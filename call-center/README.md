# 📞 Enerlux Call Center IA

Sistema de llamadas automatizadas con IA para captación de clientes.

## 🚀 Flujo de Funcionamiento

```
┌─────────────────┐
│  LISTA CLIENTES │
│   (CSV/JSON)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐      ┌─────────────────┐
│   TWILIO API    │─────►│   TU NÚMERO     │
│ (hace llamada)  │      │ (Caller ID)     │
└────────┬────────┘      └────────┬────────┘
         │                        │
         │                        ▼
         │               ┌─────────────────┐
         │               │    CLIENTE      │
         │               │  (ve tu número) │
         │               └────────┬────────┘
         │                        │
         ▼                        ▼
┌─────────────────────────────────────────┐
│              SERVIDOR IA                 │
│                                          │
│  1. Cliente contesta → Twilio webhook    │
│  2. Transcripción → OpenAI Whisper       │
│  3. Respuesta → GPT-4                    │
│  4. Voz → ElevenLabs (opcional)          │
│ 5. Guardar lead → Firebase               │
└──────────────────────────────────────────┘
```

## 💰 Costos Estimados

| Componente | Costo |
|------------|-------|
| **Twilio** (número + llamadas) | ~€5-15/mes |
| **OpenAI Whisper** | €0.006/min |
| **OpenAI GPT-4** | ~€0.02-0.05/llamada |
| **ElevenLabs** (opcional) | €5-22/mes |
| **100 llamadas de 3 min** | ~€15-25 total |

**Mucho más barato que Zadarma por minutos.**

## ⚙️ Configuración

### 1. Crear cuenta en Twilio

1. Ve a https://www.twilio.com/try-twilio
2. Regístrate (gratis, te dan €15 de crédito)
3. Compra un número español (+34) por ~€1/mes

### 2. Configurar Variables de Entorno

Copia `.env.example` a `.env` y completa:

```env
# Twilio (obligatorio)
TWILIO_ACCOUNT_SID=ACxxxxx
TWILIO_AUTH_TOKEN=xxxxx
TWILIO_PHONE_NUMBER=+34XXXXXXXXX

# TU NÚMERO ILIMITADO (lo que ve el cliente)
CALLER_ID=+34610243061

# OpenAI (obligatorio)
OPENAI_API_KEY=sk-proj-xxxxx

# ElevenLabs (opcional - voz ultra realista)
ELEVENLABS_API_KEY=xxxxx

# Servidor (cambiar en producción)
BASE_URL=https://tu-servidor.vercel.app
```

### 3. Desplegar Servidor

El servidor necesita estar accesible desde internet para recibir webhooks de Twilio.

**Opción A: Vercel (recomendado)**
```bash
vercel --prod
```

**Opción B: ngrok (desarrollo)**
```bash
ngrok http 3333
# Copia la URL de ngrok a BASE_URL
```

### 4. Configurar Webhooks en Twilio

1. Ve a Twilio Console → Phone Numbers → Tu número
2. En "Voice & Fax", configura:
   - **Voice URL:** `https://tu-servidor.vercel.app/twilio/voice`
   - **HTTP POST**

### 5. Instalar y Ejecutar

```bash
cd call-center
npm install
npm start
```

Abre http://localhost:3333

## 📋 Usar el Sistema

### 1. Cargar Lista de Clientes

**Formato CSV:**
```csv
nombre,telefono,direccion,notas
Juan García,612345678,Calle Mayor 1,Cliente potencial
María López,698765432,Avenida Sol 5,Ya tiene oferta
```

**Formato JSON:**
```json
[
  {"nombre": "Juan García", "telefono": "612345678"},
  {"nombre": "María López", "telefono": "698765432"}
]
```

### 2. Hacer Llamadas

1. Selecciona un cliente de la lista
2. Clic en **📞 Llamar**
3. El sistema llama mostrando TU número
4. El cliente contesta → La IA habla
5. Marca el resultado: Interesado / No interesado / No contesta

### 3. Modo Automático

1. Clic en **▶️ Auto**
2. El sistema llama automáticamente a cada cliente
3. Espera resultado y pasa al siguiente

## 🔧 API Endpoints

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `GET /api/estado` | GET | Estado del sistema |
| `POST /api/clientes` | POST | Cargar lista de clientes |
| `POST /api/llamar/:index` | POST | Llamar a cliente |
| `POST /api/colgar` | POST | Colgar llamada actual |
| `POST /api/finalizar` | POST | Finalizar con resultado |
| `GET /api/siguiente` | GET | Siguiente cliente pendiente |
| `POST /twilio/voice` | POST | Webhook de Twilio |
| `POST /twilio/gather` | POST | Procesar respuesta del cliente |

## 📁 Estructura

```
call-center/
├── server.js           # Servidor Express + Twilio
├── package.json        # Dependencias
├── .env.example        # Variables de entorno
├── .gitignore
├── README.md
└── public/
    └── index.html      # Panel de control
```

## ⚠️ Importante

1. **Twilio requiere un servidor público** para webhooks
2. **Tu número ilimitado** solo se usa como Caller ID (lo que ve el cliente)
3. **Twilio hace la llamada**, no tu teléfono
4. **El cliente ve tu número** y puede devolver la llamada

## 🔐 Seguridad

- NUNCA subas `.env` a Git
- Regenera las API keys si se exponen
- Firebase ya está configurado con reglas seguras