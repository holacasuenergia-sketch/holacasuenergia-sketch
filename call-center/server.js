/**
 * ENERLUX CALL CENTER - SERVIDOR PRINCIPAL
 * Sistema de llamadas IA con Twilio
 * 
 * FLUJO:
 * 1. Cargar lista de clientes
 * 2. Sistema llama con Twilio (Caller ID = tu número)
 * 3. Cliente contesta → Twilio envía webhook
 * 4. IA habla con el cliente (Whisper + GPT-4 + ElevenLabs)
 * 5. Guardar resultado en Firebase
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const twilio = require('twilio');
const OpenAI = require('openai');

const app = express();
const PORT = process.env.PORT || 3333;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Clientes
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Estado del sistema
let estadoSistema = {
  activo: false,
  llamando: false,
  clienteActual: null,
  clientes: [],
  estadisticas: {
    total: 0,
    contestadas: 0,
    interesados: 0,
    noInteresados: 0
  }
};

// Conversaciones activas (en memoria)
const conversaciones = new Map();

// ========================================
// PROMPT DEL AGENTE DE VENTAS
// ========================================

const SYSTEM_PROMPT = `Eres un agente de ventas de Enerlux, empresa española especializada en ayudar a clientes a cambiar de compañía eléctrica y ahorrar dinero.

OBJETIVO: Conseguir que el cliente acepte una oferta para cambiar de compañía eléctrica.

PERSONALIDAD:
- Amable, cercano y profesional
- Hablas español de España con naturalidad
- Usas un tono conversacional, nunca robótico
- Empático con las preocupaciones del cliente

GUION DE LLAMADA:

1. SALUDO:
"Hola, le llamo de Enerlux. ¿Es este el [nombre del titular]?"

2. GANCHO (si confirma):
"Le llamo porque hemos analizado su factura eléctrica y podemos ayudarle a ahorrar hasta un 30% en su próxima factura. ¿Podría dedicarme un minuto?"

3. PROPUESTA (si muestra interés):
"Trabajamos con todas las compañías de España y encontramos la tarifa más barata para su consumo. El cambio es totalmente gratuito y nosotros nos encargamos de todo el papeleo. No tiene que preocuparse de nada."

4. RESPUESTAS A OBJECIONES:

Si dice "Ya tengo buena tarifa":
"Entiendo, pero ¿sabe exactamente cuánto paga por kWh actualmente? La mayoría de nuestros clientes pensaban lo mismo y ahora ahorran una media de 40 euros al mes."

Si dice "No me interesan ofertas":
"Lo comprendo perfectamente. Solo le pregunto: ¿le importaría que le enviemos un comparativo gratuito? Podrá ver cuánto ahorraría sin ningún compromiso."

Si dice "Es una estafa":
"Comprendo su desconfianza. Enerlux es una empresa registrada en España. Puede verificarnos en cualquier momento. Lo único que queremos es ayudarle a ahorrar dinero."

Si dice "Tengo contrato fijo":
"¿Sabe hasta cuándo es su compromiso? A veces hay cláusulas de salida gratuita que la compañía no le informa."

5. CIERRE (cuando acepta):
"¡Perfecto! Para enviarle la oferta personalizada, necesito confirmar unos datos. ¿Me permite su nombre completo y dirección actual?"

6. DESPEDIDA (si no le interesa):
"De acuerdo, gracias por su tiempo. Si cambia de opinión, puede contactarnos cuando quiera. ¡Que tenga un buen día!"

REGLAS IMPORTANTES:
- Respuestas CORTAS (máximo 2-3 frases)
- Espera a que el cliente termine de hablar
- Si hay ruido o no entiendes, pide amablemente que repita
- SOLO pide datos personales si el cliente YA aceptó
- Si el cliente se pone agresivo, despídete educadamente y cuelga
- NUNCA interrumpas al cliente

Responde SIEMPRE en español de España, de forma natural y cercana.`;

// ========================================
// API REST
// ========================================

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    twilio: !!process.env.TWILIO_ACCOUNT_SID,
    openai: !!process.env.OPENAI_API_KEY,
    elevenlabs: !!process.env.ELEVENLABS_API_KEY
  });
});

// Estado del sistema
app.get('/api/estado', (req, res) => {
  res.json(estadoSistema);
});

// Cargar lista de clientes
app.post('/api/clientes', (req, res) => {
  const { clientes } = req.body;
  
  if (!Array.isArray(clientes)) {
    return res.status(400).json({ error: 'Se espera un array de clientes' });
  }
  
  estadoSistema.clientes = clientes.map(c => ({
    nombre: c.nombre || 'Cliente',
    telefono: c.telefono || c.telefon || c.phone || c.tel,
    direccion: c.direccion || c.dirección || '',
    notas: c.notas || c.notas || '',
    estado: 'pendiente',
    intentos: 0,
    resultado: null
  })).filter(c => c.telefono);
  
  estadoSistema.estadisticas.total = estadoSistema.clientes.length;
  
  console.log(`📞 ${estadoSistema.clientes.length} clientes cargados`);
  
  res.json({
    message: `${estadoSistema.clientes.length} clientes cargados`,
    clientes: estadoSistema.clientes
  });
});

// Obtener siguiente cliente pendiente
app.get('/api/siguiente', (req, res) => {
  const pendiente = estadoSistema.clientes.find(c => c.estado === 'pendiente');
  
  if (!pendiente) {
    return res.json({ message: 'No hay más clientes pendientes' });
  }
  
  const index = estadoSistema.clientes.indexOf(pendiente);
  
  res.json({
    index,
    cliente: pendiente,
    pendientes: estadoSistema.clientes.filter(c => c.estado === 'pendiente').length
  });
});

// ========================================
// LLAMADAS TWILIO
// ========================================

// Iniciar llamada
app.post('/api/llamar/:index', async (req, res) => {
  const index = parseInt(req.params.index);
  const cliente = estadoSistema.clientes[index];
  
  if (!cliente) {
    return res.status(404).json({ error: 'Cliente no encontrado' });
  }
  
  if (estadoSistema.llamando) {
    return res.status(400).json({ error: 'Ya hay una llamada en curso' });
  }
  
  try {
    estadoSistema.llamando = true;
    estadoSistema.clienteActual = cliente;
    estadoSistema.clientes[index].estado = 'llamando';
    estadoSistema.clientes[index].intentos++;
    
    // Formatear número de teléfono (añadir +34 si no tiene)
    let telefono = cliente.telefono.replace(/\D/g, '');
    if (!telefono.startsWith('34')) {
      telefono = '34' + telefono;
    }
    
    console.log(`📞 Llamando a ${cliente.nombre} al +${telefono}...`);
    
    // Crear llamada con Twilio
    const call = await twilioClient.calls.create({
      to: `+${telefono}`,
      from: process.env.TWILIO_PHONE_NUMBER, // Número de Twilio
      callerId: process.env.CALLER_ID, // Tu número ilimitado (lo que ve el cliente)
      url: `${process.env.BASE_URL}/twilio/voice`,
      statusCallback: `${process.env.BASE_URL}/twilio/status`,
      statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'],
      timeout: 30
    });
    
    console.log(`✅ Llamada iniciada: ${call.sid}`);
    
    // Guardar SID de la llamada
    estadoSistema.callSid = call.sid;
    
    res.json({
      message: 'Llamada iniciada',
      callSid: call.sid,
      cliente: cliente
    });
    
  } catch (error) {
    console.error('❌ Error iniciando llamada:', error);
    estadoSistema.llamando = false;
    estadoSistema.clientes[index].estado = 'error';
    res.status(500).json({ error: error.message });
  }
});

// Colgar llamada
app.post('/api/colgar', async (req, res) => {
  if (!estadoSistema.callSid) {
    return res.status(400).json({ error: 'No hay llamada activa' });
  }
  
  try {
    await twilioClient.calls(estadoSistema.callSid).update({ status: 'completed' });
    console.log('📞 Llamada finalizada');
    res.json({ message: 'Llamada finalizada' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Finalizar llamada con resultado
app.post('/api/finalizar', (req, res) => {
  const { resultado, datosCliente } = req.body;
  
  if (estadoSistema.clienteActual) {
    const index = estadoSistema.clientes.findIndex(
      c => c.telefono === estadoSistema.clienteActual.telefono
    );
    
    if (index >= 0) {
      estadoSistema.clientes[index].estado = resultado;
      estadoSistema.clientes[index].resultado = resultado;
      
      // Actualizar estadísticas
      estadoSistema.estadisticas.contestadas++;
      if (resultado === 'interesado') {
        estadoSistema.estadisticas.interesados++;
      } else if (resultado === 'no-interesado') {
        estadoSistema.estadisticas.noInteresados++;
      }
      
      // Guardar datos adicionales
      if (datosCliente) {
        estadoSistema.clientes[index].direccion = datosCliente.direccion;
        estadoSistema.clientes[index].dni = datosCliente.dni;
        estadoSistema.clientes[index].email = datosCliente.email;
      }
    }
  }
  
  // Limpiar conversación
  if (estadoSistema.callSid) {
    conversaciones.delete(estadoSistema.callSid);
  }
  
  estadoSistema.llamando = false;
  estadoSistema.clienteActual = null;
  estadoSistema.callSid = null;
  
  // TODO: Guardar en Firebase
  
  res.json({
    message: 'Llamada finalizada',
    estadisticas: estadoSistema.estadisticas
  });
});

// ========================================
// WEBHOOKS TWILIO
// ========================================

// Webhook: cuando el cliente contesta
app.post('/twilio/voice', async (req, res) => {
  const { CallSid, From, To } = req.body;
  
  console.log(`📞 CallSid: ${CallSid}, Cliente contestó`);
  
  // Inicializar conversación
  conversaciones.set(CallSid, {
    mensajes: [{ role: 'system', content: SYSTEM_PROMPT }],
    clienteNombre: estadoSistema.clienteActual?.nombre || 'Cliente',
    startTime: Date.now()
  });
  
  // Generar saludo inicial
  const saludo = `Hola, le llamo de Enerlux. ¿Es este el titular de la cuenta eléctrica?`;
  
  // Añadir saludo a la conversación
  conversaciones.get(CallSid).mensajes.push({
    role: 'assistant',
    content: saludo
  });
  
  // Responder con TwiML
  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say language="es-ES">${saludo}</Say>
  <Gather input="speech" action="/twilio/gather" method="POST" speechTimeout="2" language="es-ES">
    <Say language="es-ES">¿Me escucha bien?</Say>
  </Gather>
</Response>`;
  
  res.set('Content-Type', 'text/xml');
  res.send(twiml);
});

// Webhook: procesar respuesta del cliente
app.post('/twilio/gather', async (req, res) => {
  const { CallSid, SpeechResult, Confidence } = req.body;
  
  console.log(`👤 Cliente: ${SpeechResult} (confianza: ${Confidence})`);
  
  const conversacion = conversaciones.get(CallSid);
  if (!conversacion) {
    return res.status(400).send('Conversación no encontrada');
  }
  
  // Añadir respuesta del cliente
  conversacion.mensajes.push({
    role: 'user',
    content: SpeechResult
  });
  
  // Generar respuesta con GPT-4
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: conversacion.mensajes,
      max_tokens: 150,
      temperature: 0.7
    });
    
    const respuesta = completion.choices[0].message.content;
    console.log(`🤖 Agente: ${respuesta}`);
    
    // Añadir respuesta a la conversación
    conversacion.mensajes.push({
      role: 'assistant',
      content: respuesta
    });
    
    // Detectar si es despedida
    const esDespedida = respuesta.toLowerCase().includes('que tenga') || 
                        respuesta.toLowerCase().includes('gracias por su tiempo');
    
    // Responder con TwiML
    let twiml;
    if (esDespedida) {
      twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say language="es-ES">${respuesta}</Say>
  <Hangup/>
</Response>`;
    } else {
      twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say language="es-ES">${respuesta}</Say>
  <Gather input="speech" action="/twilio/gather" method="POST" speechTimeout="2" language="es-ES">
    <Pause length="1"/>
  </Gather>
</Response>`;
    }
    
    res.set('Content-Type', 'text/xml');
    res.send(twiml);
    
  } catch (error) {
    console.error('❌ Error generando respuesta:', error);
    
    // Respuesta de fallback
    const fallbackTwiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say language="es-ES">Disculpe, no le he entendido bien. ¿Podría repetir?</Say>
  <Gather input="speech" action="/twilio/gather" method="POST" speechTimeout="2" language="es-ES">
    <Pause length="1"/>
  </Gather>
</Response>`;
    
    res.set('Content-Type', 'text/xml');
    res.send(fallbackTwiml);
  }
});

// Webhook: estado de la llamada
app.post('/twilio/status', (req, res) => {
  const { CallSid, CallStatus, CallDuration } = req.body;
  
  console.log(`📞 Estado: ${CallStatus} (CallSid: ${CallSid})`);
  
  // Actualizar estado según el resultado
  if (CallStatus === 'completed' || CallStatus === 'busy' || CallStatus === 'no-answer') {
    if (estadoSistema.callSid === CallSid) {
      estadoSistema.llamando = false;
      
      const index = estadoSistema.clientes.findIndex(
        c => c.telefono === estadoSistema.clienteActual?.telefono
      );
      
      if (index >= 0 && estadoSistema.clientes[index].estado === 'llamando') {
        estadoSistema.clientes[index].estado = CallStatus === 'completed' ? 'contestado' : CallStatus;
      }
    }
  }
  
  res.status(200).send('OK');
});

// ========================================
// PANEL WEB
// ========================================

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ========================================
// INICIAR SERVIDOR
// ========================================

app.listen(PORT, () => {
  console.log('');
  console.log('╔════════════════════════════════════════╗');
  console.log('║   📞 ENERLUX CALL CENTER IA            ║');
  console.log('║   Sistema de llamadas automatizadas    ║');
  console.log('╚════════════════════════════════════════╝');
  console.log('');
  console.log(`🌐 Panel: http://localhost:${PORT}`);
  console.log(`📞 Caller ID: ${process.env.CALLER_ID || 'No configurado'}`);
  console.log(`📱 Twilio: ${process.env.TWILIO_ACCOUNT_SID ? '✅' : '❌'}`);
  console.log(`🧠 OpenAI: ${process.env.OPENAI_API_KEY ? '✅' : '❌'}`);
  console.log(`🎤 ElevenLabs: ${process.env.ELEVENLABS_API_KEY ? '✅' : '❌'}`);
  console.log('');
  console.log('⚠️  Configura las API keys en .env antes de usar');
  console.log('');
});

module.exports = app;