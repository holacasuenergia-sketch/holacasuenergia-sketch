# Backend Plan - Enerlux Soluciones SaaS

## 🚀 ARQUITECTURA COMPLETA

```
┌─────────────────────────────────────────────────┐
│              FRONTEND                            │
│  • Landing Page (Storytelling)                  │
│  • Formulario Subida Factura                    │
│  • Chatbot WhatsApp/Web                         │
│  • Simulador Ahorro Real                        │
│  • Dashboard Clientes                           │
│  • Blog Educativo                               │
└─────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────┐
│           BACKEND API (Node.js + Express)        │
│  • /api/upload-factura                          │
│  • /api/comparativa                             │
│  • /api/chatbot                                 │
│  • /api/send-email                              │
│  • Integración WhatsApp Business API            │
│  • OCR Extracción Facturas                      │
│  • PostgreSQL Database                          │
└─────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────┐
│            SERVICIOS EXTERNOS                     │
│  • APIs Comercializadoras                       │
│  • Google Cloud Vision / Tesseract              │
│  • Nodemailer / SendGrid                        │
│  • WhatsApp Business API                       │
│  • Google Analytics 4                           │
└─────────────────────────────────────────────────┘
```

---

## 📁 ESTRUCTURA DEL PROYECTO

```
enerlux-website/
├── frontend/
│   ├── index.html              (Landing Hero)
│   ├── simulador.html          (Simulador Factura)
│   ├── dashboard.html          (Dashboard Cliente)
│   ├── chatbot.html            (Chatbot Web)
│   ├── blog/                   (Artículos)
│   ├── css/
│   │   ├── styles.css         (Global)
│   │   ├── components.css      (Chatbot, Modales)
│   │   └── animations.css      (Animaciones)
│   └── js/
│       ├── upload.js          (Subida factura)
│       ├── chatbot.js         (Chatbot web)
│       ├── simulador.js       (Simulador lógica)
│       └── dashboard.js       (Dashboard)
│
├── backend/
│   ├── server.js              (Express API)
│   ├── routes/
│   │   ├── factura.js         (Upload & OCR)
│   │   ├── comparativa.js     (Comparar)
│   │   ├── chatbot.js         (WhatsApp/Web)
│   │   └── email.js           (Enviar email)
│   ├── services/
│   │   ├── ocr.js            (Extracción factura)
│   │   ├── comparador.js      (Lógica comparar)
│   │   ├── email.js          (Nodemailer)
│   │   └── whatsapp.js       (WhatsApp API)
│   ├── models/
│   │   ├── Cliente.js         (PostgreSQL schema)
│   │   └── Comparativa.js     (Resultados)
│   └── config/
│       └── database.js        (PostgreSQL config)
│
├── database/
│   └── schema.sql            (PostgreSQL tables)
│
└── docs/
    ├── API.md                (Documentación)
    └── INSTALL.md            (Instrucciones)
```

---

## 🔌 ENDPOINTS DE LA API

### 1. Upload Factura
```
POST /api/upload-factura
Content-Type: multipart/form-data

Body:
- factura: (File - PDF/IMG)
- nombre: String
- email: String
- telefono: String
- cp: String

Response:
{
  "success": true,
  "cliente_id": "uuid",
  "factura_url": "https://s3.amazonaws.com/factura.pdf"
}
```

### 2. Comparativa
```
POST /api/comparativa
Content-Type: application/json

Body:
{
  "cliente_id": "uuid"
}

Response:
{
  "comparativa": {
    "empresa_actual": "Iberdrola",
    "factura_actual": "85€/mes",
    "opciones": [
      {
        "empresa": "Endesa",
        "tarifa": "Tarifa Plana 24h",
        "precio": "68€/mes",
        "ahorro": "17€/mes (20%)",
        "ahorro_anual": "204€"
      }
    ],
    "recomendacion": "Endesa - Ahorras 204€/año"
  }
}
```

### 3. Chatbot WhatsApp
```
POST /api/chatbot
Content-Type: application/json

Body:
{
  "mensaje": String,
  "telefono": String,
  "media_url": String? (factura)
}

Response:
{
  "respuesta": String,
  "estado": String
}
```

### 4. Send Email
```
POST /api/send-email
Content-Type: application/json

Body:
{
  "cliente_id": "uuid"
}

Response:
{
  "success": true,
  "email_id": "uuid"
}
```

---

## 💾 DATABASE SCHEMA (PostgreSQL)

### Tabla: clientes
```sql
CREATE TABLE clientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  telefono VARCHAR(20) UNIQUE NOT NULL,
  cp VARCHAR(5) NOT NULL,
  fecha_registro TIMESTAMP DEFAULT NOW(),
  estado VARCHAR(20) DEFAULT 'pendiente'
);
```

### Tabla: facturas
```sql
CREATE TABLE facturas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID REFERENCES clientes(id),
  url_factura TEXT NOT NULL,
  tipo VARCHAR(10) NOT NULL, -- 'luz' | 'gas' | 'ambos'
 _consumo_kwh DECIMAL(10,2) NOT NULL,
  potencia VARCHAR(10) NOT NULL,
  periodo VARCHAR(20) NOT NULL,
  precio_actual DECIMAL(10,2) NOT NULL,
  fecha_subida TIMESTAMP DEFAULT NOW()
);
```

### Tabla: comparativas
```sql
CREATE TABLE comparativas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID REFERENCES clientes(id),
  factura_id UUID REFERENCES facturas(id),
  empresa_actual VARCHAR(50) NOT NULL,
  empresa_recomendada VARCHAR(50) NOT NULL,
  ahorro_anual DECIMAL(10,2) NOT NULL,
  resultado_json JSONB NOT NULL,
  fecha_generada TIMESTAMP DEFAULT NOW()
);
```

---

## 🔧 STACK TECNOLÓGICO

### Backend
- **Node.js** v20+
- **Express.js** (Framework)
- **PostgreSQL** (Database)
- **Sequelize** (ORM)
- **Multer** (Upload archivos)
- **Tesseract.js** (OCR)
- **Nodemailer** (Email)
- **WhatsApp Business API** (WhatsApp)

### Frontend
- **HTML5/CSS3**
- **JavaScript ES6+**
- **Chart.js** (Gráficos comparativa)
- **Google Fonts**
- **Chatra/Tidio** (Chatbot web) - Opcional

### Servicios
- **Netlify** (Hosting frontend)
- **Render/Heroku** (Hosting backend)
- **AWS S3** (Almacenamiento facturas)
- **Google Cloud Vision API** (OCR avanzado) - Opcional

---

## 📋 SECUENCIA DE IMPLEMENTACIÓN

### FASE 1: Backend Core (2-3 días)
1. ✅ Crear estructura backend
2. ✅ Configurar PostgreSQL
3. ✅ Implementar endpoints básicos
4. ✅ Testar API con Postman

### FASE 2: Funcionalidad OCR (1 día)
1. ✅ Integrar Tesseract.js
2. ✅ Extracción datos factura
3. ✅ Validación de datos

### FASE 3: Comparativa Inteligente (1-2 días)
1. ✅ Algoritmo comparar tarifas
2. ✅ Integrar APIs comercializadoras
3. ✅ Generar recomendación

### FASE 4: Implementación Email (½ día)
1. ✅ Configurar Nodemailer
2. ✅ Template email
3. ✅ Adjuntar PDF comparativa

### FASE 5: WhatsApp Bot (1 día)
1. ✅ Configurar WhatsApp Business API
2. ✅ Implementar flujo conversacional
3. ✅ Integrar con backend

### FASE 6: Frontend Mejorado (2 días)
1. ✅ Landing tipo Gana Energía
2. ✅ Formulario drag & drop
3. ✅ Dashboard visual
4. ✅ Simulador interactivo
5. ✅ Blog educativo

### FASE 7: Testing & Deploy (1 día)
1. ✅ Testing E2E
2. ✅ Deploy backend (Render)
3. ✅ Deploy frontend (Netlify)
4. ✅ Configurar dominio
5. ✅ Configurar SSL

---

## 💰 COSTOS ESTIMADOS (MENSUALES)

### Servicios
- **Render** (Backend): ~$7/mes
- **Netlify** (Frontend): Gratis (<100GB/mes)
- **AWS S3** (Storage): ~$0.023/GB
- **PostgreSQL** (Render): ~$7/mes
- **Google Cloud Vision** (OCR): $0.0015/página
- **WhatsApp Business API**: €0,08/1000 mensajes
- **SendGrid** (Email): Gratis (<100 emails/día)

### TOTAL MENSUAL INICIAL
~$15-20/mes (primeros meses)

---

## ⚡ TIEMPO TOTAL ESTIMADO

- **Desarrollo**: 7-10 días
- **Testing**: 2 días
- **Deploy**: 1 día

**TOTAL**: 12-14 días (2 semanas)

---

## 📱 PROXIMOS PASOS

1. Crear estructura backend
2. Configurar base de datos
3. Implementar OCR
4. Integrar WhatsApp
5. Mejorar frontend
6. Deploy completo

**¿EMPEZAR CON LA IMPLEMENTACIÓN DEL BACKEND?** 🚀