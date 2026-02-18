# 🚀 INSTRUCCIONES DE USO

## Desde cualquier ordenador:

### 1. Clonar el repositorio
```bash
git clone https://github.com/holacasuenergia-sketch/holacasuenergia-sketch.git
cd holacasuenergia-sketch/call-center
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Crear cuenta en Twilio (5 minutos)
1. Ve a: https://www.twilio.com/try-twilio
2. Regístrate (te dan **$15 de crédito gratis**)
3. Verifica tu teléfono
4. Compra un número español: Phone Numbers → Buy a Number → España
5. Cuesta **~$1/mes**

### 4. Obtener API Keys
- **Twilio:** Console Dashboard → copia `ACCOUNT SID` y `AUTH TOKEN`
- **OpenAI:** https://platform.openai.com/api-keys → crea una key nueva

### 5. Configurar .env
```bash
cp .env.example .env
nano .env  # o edita con tu editor favorito
```

Cambia estas líneas:
```
TWILIO_ACCOUNT_SID=ACxxxxx (tu Account SID)
TWILIO_AUTH_TOKEN=xxxxx (tu Auth Token)
TWILIO_PHONE_NUMBER=+34XXXXXXXXX (el número que compraste)
CALLER_ID=+34610243061 (tu número ilimitado)
OPENAI_API_KEY=sk-proj-xxxxx (tu key de OpenAI)
```

### 6. Desplegar en Vercel (gratis)
```bash
# Instalar Vercel CLI si no lo tienes
npm i -g vercel

# Desplegar
vercel --prod
```

Anota la URL que te da (ej: `https://call-center-xxx.vercel.app`)

### 7. Configurar Webhook en Twilio
1. Ve a Twilio Console → Phone Numbers → Tu número
2. En "Voice & Fax" → "A CALL COMES IN":
   - URL: `https://TU-URL.vercel.app/twilio/voice`
   - Método: **HTTP POST**
3. Guarda

### 8. ¡Listo!
Abre tu panel de control en la URL de Vercel y empieza a llamar.

---

## 📋 Formato de Lista de Clientes

### CSV
```csv
nombre,telefono,direccion,notas
Juan García,612345678,Calle Mayor 1,Puede estar interesado
María López,698765432,Avenida Sol 5,No llamar después de las 8
```

### JSON
```json
[
  {"nombre": "Juan García", "telefono": "612345678", "direccion": "Calle Mayor 1"},
  {"nombre": "María López", "telefono": "698765432", "direccion": "Avenida Sol 5"}
]
```

---

## 💰 Costos Reales (Ejemplo)

| Concepto | Costo |
|----------|-------|
| Número Twilio | $1/mes |
| 100 llamadas × 3 min | $6 |
| OpenAI (transcripción + respuesta) | $5 |
| **Total** | **~$12/mes** |

**Mucho más barato que Zadarma por minutos.**

---

## ⚠️ Importante

- El archivo `.env` **NUNCA** se sube a Git (está en .gitignore)
- Tus API keys están a salvo
- El cliente siempre ve **tu número ilimitado** cuando le llamas
- Twilio hace la llamada, no tu teléfono

---

## 🔧 Problemas Comunes

### "Error al llamar"
- Verifica que el número Twilio esté activo
- Verifica que el Caller ID sea un número verificado en Twilio (para trial)
- En trial, solo puedes llamar a números verificados

### "El cliente no oye nada"
- Verifica que el webhook está configurado en Twilio
- Verifica que la URL de Vercel funciona (abre `/api/health`)

### "Error de API"
- Verifica que las API keys están correctas en `.env`
- Verifica que tienes créditos en OpenAI y Twilio