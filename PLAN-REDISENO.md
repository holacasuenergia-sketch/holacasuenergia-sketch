# 🎨 PLAN DE REDISEÑO - PAGOMENOSLUZYGAS.ES

**Cliente:** Stephanie
**Proyecto:** Enerlux Soluciones
**Fecha:** 16/02/2026
**Objetivo:** Web elegante, sofisticada, competir con líderes del sector

---

## 📋 OBJETIVOS

1. **Diseño Premium** - Nivel Iberdrola, Endesa, Naturgy
2. **WWW** - Configurar www.pagomenosluzygas.es
3. **SEO** - Aparecer en Google búsquedas

---

## 🎨 1. DISEÑO PREMIUM

### Referencias de la Competencia

| Empresa | Puntos fuertes |
|---------|----------------|
| **Iberdrola** | Hero limpio, planes claros, Trustpilot reviews, App destacada |
| **Naturgy** | Datos de impacto, proyectos internacionales, tecnología |
| **Endesa** | Simplicidad, ofertas destacadas |

### Nuevo Diseño Enerlux

**Paleta de Colores Premium:**
```css
--primary: #0A1628;       /* Azul marino profundo - elegancia */
--secondary: #1E3A5F;     /* Azul medio - profesional */
--accent: #00D4AA;        /* Verde turquesa - energía limpia */
--gold: #C9A227;          /* Dorado sutil - premium */
--white: #FFFFFF;
--gray-light: #F8FAFC;
```

**Tipografía:**
- Títulos: `Playfair Display` o `Cormorant Garamond` (elegante, editorial)
- Texto: `Inter` o `Outfit` (moderno, legible)

**Estructura Nueva:**

```
┌─────────────────────────────────────────────────┐
│  HEADER (Sticky, glass effect)                 │
│  Logo + Navegación + CTA "Comparar Gratis"      │
├─────────────────────────────────────────────────┤
│  HERO (Full-screen, video/image background)    │
│  Título grande + Subtítulo + CTAs              │
│  "Ahorra hasta 30% en tu factura"              │
│  + Badge "Sin compromiso"                      │
├─────────────────────────────────────────────────┤
│  TRUST BAR (Logos partners + Trustpilot)       │
│  [Endesa] [Iberdrola] [Naturgy] ⭐⭐⭐⭐⭐ (4.9)  │
├─────────────────────────────────────────────────┤
│  BENEFITS (Cards con iconos animados)          │
│  Ahorro | Energía Verde | Sin Permanencia      │
├─────────────────────────────────────────────────┤
│  HOW IT WORKS (Timeline visual)                │
│  1. Comparas → 2. Eliges → 3. Ahorras         │
├─────────────────────────────────────────────────┤
│  TARIFAS DESTACADAS (Cards premium)            │
│  Plan Online | Plan Verde | Plan Nocturno      │
│  Con precios y CTAs                            │
├─────────────────────────────────────────────────┤
│  TESTIMONIOS (Slider)                          │
│  Reviews reales + fotos                        │
├─────────────────────────────────────────────────┤
│  FAQ (Accordion elegante)                      │
├─────────────────────────────────────────────────┤
│  CTA FINAL (Banner impactante)                 │
│  "¿Listo para ahorrar?" + Formulario rápido    │
├─────────────────────────────────────────────────┤
│  FOOTER (Completo)                             │
│  Links + Legal + Redes + Contacto              │
└─────────────────────────────────────────────────┘
```

---

## 🔍 2. SEO COMPLETO

### On-Page SEO

**Meta Tags:**
```html
<title>Enerlux Soluciones | Ahorra hasta 30% en Luz y Gas</title>
<meta name="description" content="Compara tarifas de luz y gas de 50+ comercializadoras gratis. Ahorra desde el primer día. Energía 100% verde disponible. Asesoría personalizada sin compromiso.">
<meta name="keywords" content="comparador luz, comparador gas, ahorro energía, tarifas luz España, cambiar compañía luz, energía verde, asesor energético">
```

**Schema.org Mejorado:**
```json
{
  "@context": "https://schema.org",
  "@type": "EnergyService",
  "name": "Enerlux Soluciones",
  "description": "Asesoría energética independiente",
  "telephone": "+34 610 243 061",
  "areaServed": "España",
  "priceRange": "Gratis",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "127"
  }
}
```

### Archivos SEO

1. **sitemap.xml** - Para Google
2. **robots.txt** - Permitir indexación
3. **Canonical URLs** - Evitar duplicados

### Keywords a Posicionar

- Primarias: "comparador luz", "ahorro energía", "cambiar compañía luz"
- Secundarias: "tarifas luz baratas", "energía verde España", "asesor energético"
- Long-tail: "cómo ahorrar en factura de luz", "mejor tarifa luz para empresas"

---

## 🌐 3. WWW CONFIGURACIÓN

### DNS Settings (Netlify)

**Dominio actual:** `pagomenosluzygas.es`

**Configurar:**
1. Añadir `www.pagomenosluzygas.es` como alias
2. Configurar redirect automático no-WWW → WWW (o viceversa)
3. SSL automático para www

### Canonical URL

```html
<link rel="canonical" href="https://www.pagomenosluzygas.es/">
```

---

## 📊 4. GOOGLE SEARCH CONSOLE

### Pasos

1. Verificar propiedad del dominio
2. Enviar sitemap.xml
3. Solicitar indexación
4. Monitorear rendimiento

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

### Diseño
- [ ] Nuevo index.html con diseño premium
- [ ] CSS moderno (glassmorphism, gradients, animations)
- [ ] Hero section impactante
- [ ] Sección de confianza (partners, reviews)
- [ ] Cards de tarifas elegantes
- [ ] Testimonios slider
- [ ] Footer completo
- [ ] Responsive 100%

### SEO
- [ ] Meta tags optimizados
- [ ] Schema.org completo
- [ ] sitemap.xml
- [ ] robots.txt
- [ ] Open Graph
- [ ] Twitter Cards
- [ ] Alt en todas imágenes

### WWW
- [ ] Configurar alias en Netlify
- [ ] Redirect correcto
- [ ] SSL para www

### Google
- [ ] Verificar en Search Console
- [ ] Enviar sitemap
- [ ] Solicitar indexación

---

## 🚀 PRÓXIMOS PASOS

1. Crear nuevo `index.html` con diseño premium
2. Añadir archivos SEO (sitemap, robots)
3. Push a GitHub
4. Configurar www en Netlify
5. Verificar en Google Search Console

---

**¿Empezamos con el nuevo diseño ahora Stephanie?**