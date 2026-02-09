# Enerlux Soluciones CRM

## 🚀 Multi-Tenant CRM con Firebase

**Sistema CRM profesional para Enerlux Soluciones con:**
- ✅ Multi-tenancy (Admin + Asesores)
- ✅ Comisiones (35€ por cliente activo)
- ✅ Objetivos y gamificación
- ✅ Dashboard personalizado
- ✅ Sistema de roles

---

## 📋 INSTALACIÓN Y DEPLOY

### **Paso 1: Crear Firebase Project (TÚ)**

1. Entra a https://console.firebase.google.com
2. Crea proyecto: `enerlux-crm`
3. Habilita Authentication (Email/Password)
4. Habilita Realtime Database
5. Copia credenciales `firebaseConfig`

### **Paso 2: Añadir credenciales (TÚ)**

Edita `index.html`, línea ~42:

```javascript
const firebaseConfig = {
  apiKey: "TU_API_KEY_AQUI",
  authDomain: "enerlux-crm.firebaseapp.com",
  projectId: "enerlux-crm",
  storageBucket: "enerlux-crm.appspot.com",
  messagingSenderId: "TU_MESSAGING_SENDER_ID",
  appId: "TU_APP_ID"
};
```

**REEMPLAZA los valores con tus credenciales de Firebase.**

### **Paso 3: Crear usuarios en Firebase (TÚ)**

1. Firebase Console → Authentication
2. "Agregar usuario"

**Admin:**
- Email: `admin@enerlux.com`
- Password: `tu-contraseña-segura`

**Asesores (ejemplo):**
- Email: `juan@enerlux.com`
- Password: `password-seguro`
- Email: `maria@enerlux.com`
- Password: `password-seguro`

### **Paso 4: Añadir roles en Firebase Database (TÚ)**

En Firebase Console → Realtime Database:

```json
{
  "users": {
    "admin-uid-aqui": {
      "email": "admin@enerlux.com",
      "name": "Administrador",
      "role": "admin"
    },
    "asesor-uid-aqui": {
      "email": "juan@enerlux.com",
      "name": "Juan Asesor",
      "role": "asesor"
    }
  }
}
```

**Para obtener los UIDs:**
1. Firebase Console → Authentication → Users
2. Click en un usuario → Copy UID

### **Paso 5: Deploy (YO + TÚ)**

```bash
# Crear repo en GitHub
cd /Users/clowd/.openclaw/workspace/enerlux-crm
git init
git add .
git commit -m "Initial Enerlux CRM deployment"
git branch -M main
git remote add origin https://github.com/Dahao12/enerlux-crm.git
git push -u origin main
```

Luego activa GitHub Pages en el repo:
1. Settings → Pages
2. Source: `deploy from a branch`
3. Branch: `main` → `/root`
4. Click "Save"

**URL:** `https://dahao12.github.io/enerlux-crm/`

Opcional: Configurar dominio `crm.pagomenosluzygas.es`

---

## 📱 ACCESO

**Como Admin:**
- URL: `https://dahao12.github.io/enerlux-crm/`
- Email: `admin@enerlux.com`
- Password: tu contraseña

**Como Asesor:**
- URL: `https://dahao12.github.io/enerlux-crm/`
- Email: `juan@enerlux.com`
- Password: su contraseña

---

## 🎯 OBJETIVOS DEL SISTEMA

### **Para Asesores:**
1. 8 clientes activos/mes (280€)
2. 30 clientes totales en cartera
3. 70% tasa de conversión
4. Ver sus ganancias en tiempo real

### **Para Admin:**
1. Ver todos los asesores y su performance
2. Ver ingresos totales del negocio
3. Leaderboard de asesores
4. Identificar asesores que necesitan ayuda

---

## 💰 COMISIÓN

**35€ por cliente activo**

El sistema calcula AUTOMÁTICAMENTE:
```javascript
ganancia = clientes_activos × 35€
```

---

## 📂 ESTRUCTURA DEL PROYECTO

```
enerlux-crm/
├── index.html              ← Página principal (login + CRM)
├── package.json           ← Dependencies
├── README.md              ← Este archivo
└── (otros archivos del workspace)
```

---

## 🔧 TECNOLOGÍAS

- **Frontend:** React 18 (vanilla JS + Babel)
- **Auth:** Firebase Authentication
- **Database:** Firebase Realtime Database
- **Hosting:** GitHub Pages
- **Styling:** Inline styles (fácil deployment)

---

## 🚀 ESTADO

✅ **Implementación completa** - Listo para deploy

**Qué se ha implementado:**
- ✅ Multi-tenant system
- ✅ Role-based access (Admin/Asesor)
- ✅ Comisiones (35€ / cliente)
- ✅ Objetivos + gamificación
- ✅ Dashboard personal
- ✅ Ready para production

**Pendiente:**
- ⏳ Credenciales de Firebase (tú)
- ⏳ Crear usuarios (tú)
- ⏳ Añadir roles (tú)
- ⏳ Deploy (nosotros)

---

## 💬 SOPORTE

WhatsApp @105901679730824 - Asistente OpenClaw

---

**Enerlux Soluciones CRM** ⚡