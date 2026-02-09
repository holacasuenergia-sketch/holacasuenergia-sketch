# Enerlux CRM - README

**Enerlux Soluciones CRM System**
**Deployed:** February 9, 2026
**Status:** LIVE on GitHub Pages (HTTPS)

---

## 🌐 **DEPLOYED URLs**

### **Primary - HTTPS (Recommended):**
```
https://dahao12.github.io/enerlux-website/crm/
```

### **Debug Version - For Testing:**
```
https://dahao12.github.io/enerlux-website/crm/debug.html
```

### **Alternative - HTTP Only (Auth Blocked):**
```
http://pagomenosluzygas.es/crm/
```

---

## 🔐 **LOGIN CREDENTIALS**

### **Admin Account:**
```
Email: admin@enerlux.com
Password: enerlux123
Role: Admin (view all asesores + leaderboard)
```

### **Asesor Account:**
```
Email: juan@enerlux.com
Password: enerlux123
Role: Asesor (view personal operations only)
```

---

## 🎯 **FEATURES**

### **1. Operations Management**
- Create, edit, delete client operations
- Status workflow: En trámite → Completo → Activo → Dado de baja
- Date tracking (inicio, completo, activo, baja)
- Notes field for details
- Filter operations by status

### **2. Commission Calculator**
- Commission rate: 35€ per active client
- Real-time calculation
- Total commission display
- Monthly commission tracking (new clients this month)
- Conversion rate percentage

### **3. Objectives System**
- **Daily Target:** 2 sales (Monday-Friday only)
- **Weekly Target:** 10 sales (2 × 5 days)
- **Monthly Target:** ~40 sales (20 working days)
- Progress bars with shimmer animation
- Motivation messages based on performance

### **4. Leaderboard (Admin Only)**
- Ranking of asesores by commission
- Top 3 positions highlighted
- Week sales tracking
- Real-time updates

### **5. Role-Based Views**
- **Asesor:** Personal operations, personal stats
- **Admin:** All asesores, consolidated metrics, leaderboard

### **6. Mobile Responsive**
- Optimized for asesors on mobile devices
- Touch-friendly interface
- Responsive tables and forms

---

## 📊 **DATABASE STRUCTURE**

### **Firebase Realtime Database:**
```
/crms
  /{asesor-uid}
    /operations
      /{operation-id}
        - clientName
        - status (En trámite|Completo|Activo|Dado de baja)
        - dateInicio
        - dateCompleto
        - dateActivo
        - dateBaja
        - notes
        - createdAt
        - updatedAt

/users
  /{uid}
    - role (admin|asesor)
    - name
    - email
```

---

## 🔧 **TECHNICAL STACK**

- **Frontend:** Vanilla JavaScript (no frameworks)
- **Auth:** Firebase Authentication (enerlux-crim project)
- **Database:** Firebase Realtime Database
- **Hosting:** GitHub Pages (HTTPS enabled)
- **CSS:** Custom professional styling with gradients
- **Font:** Inter (Google Fonts)

---

## ⚙️ **CONFIGURATION**

### **Firebase Project:**
- **Name:** enerlux-crm
- **API Key:** AIzaSyCC_j9qnWf0snHV7XOaFSQLiqszZzCkGuc
- **Auth Domain:** enerlux-crm.firebaseapp.com
- **Project ID:** enerlux-crm
- **Database URL:** https://enerlux-crm-default-rtdb.firebaseio.com

---

## 🚀 **DEPLOYMENT INSTRUCTIONS**

### **To GitHub Pages:**
```bash
cd /Users/clowd/.openclaw/workspace/enerlux-website
git add crm/
git commit -m "Update CRM"
git push origin main
```

### **To Firebase Hosting:**
```bash
cd /Users/clowd/.openclaw/workspace/enerlux-website
firebase deploy --project enerlux-crm --only hosting
```

---

## 🐛 **TROUBLESHOOTING**

### **Issue: Login not working on HTTP**
**Solution:** Use HTTPS version at https://dahao12.github.io/enerlux-website/crm/
**Reason:** Firebase Auth requires HTTPS for cookie security

### **Issue: Shows "Cargando..." indefinitely**
**Solution:**
1. Try incognito mode
2. Use debug version: https://dahao12.github.io/enerlux-website/crm/debug.html
3. Check browser console for errors (F12)

### **Issue: Operations not saving**
**Solution:**
1. Verify Firebase Database has correct rules
2. Check user role in Firebase Auth
3. Ensure internet connection

---

## 📞 **SUPPORT**

- **Email:** enerlux.soluciones@gmail.com
- **WhatsApp:** +34 610 243 061
- **Developer:** Shide (AI Agent)

---

## 📝 **TODO ITEMS**

### **High Priority:**
- [ ] User testing confirmation
- [ ] Enable HTTPS on custom domain (optional)

### **Medium Priority:**
- [ ] Add lead import functionality
- [ ] Implement AI phone agent with Zadarma
- [ ] Add reports and analytics dashboard

### **Low Priority:**
- [ ] Email notifications for new leads
- [ ] In-app chat between asesores
- [ ] Advanced filtering and search

---

**Version:** 3.0 (Objectives corrected to 2 sales/day M-F)
**Last Updated:** February 9, 2026
**Maintained by:** Shide