# Grupo Saturno — Spec de diseño e implementación
**Fecha:** 2026-04-14  
**Estado:** Aprobado por el cliente  
**Proyecto:** Landing page institucional trilingüe — GrupoSaturno.com.uy

---

## 1. Contexto

Landing page institucional B2B para **Grupo Saturno**, empresa uruguaya con 26 años de trayectoria en ganadería y procesamiento cárnico, con sede en Empalme Olmos, Canelones. Audiencia primaria: importadores, distribuidores y encargados de comercio exterior en EEUU, UE y China.

La landing funciona como carta de presentación internacional y hub que centraliza dos unidades de negocio:
- `GrupoSaturno.com.uy/FrigorificoFlorida`
- `GrupoSaturno.com.uy/FrigorificoSaturno`

---

## 2. Stack técnico

| Capa | Tecnología |
|------|-----------|
| Framework | Astro 4.x (output: static) |
| Estilos | Tailwind CSS v3 con design system propio |
| Interactividad | Alpine.js (islas: selector de idioma, menú mobile, formulario) |
| Imágenes | `<Image />` de Astro → AVIF/WebP automático |
| i18n | `astro:i18n` nativo — rutas `/es/`, `/en/`, `/zh/` |
| Tipografías | `@fontsource` (Cormorant Garamond + Inter + Noto SC) |
| SEO | `@astrojs/sitemap` + meta manual + Schema.org Organization |
| Deploy | Vercel / Netlify / Cloudflare Pages (output estático) |
| Formulario | Formspree o placeholder de endpoint |

**Rechazado explícitamente:** Next.js, Remix, CRA — sobreingeniería para una landing estática.

---

## 3. Design tokens (aprobados)

### Colores
```
--burgundy:      #6B2E2A   /* acento primario — borgoña profundo */
--burgundy-light:#8A3D38   /* hover states */
--cream:         #F5F1EA   /* base cálida — secciones claras */
--off-white:     #FAF8F4   /* variante más clara */
--carbon:        #1A1A1A   /* texto principal, fondos oscuros */
--warm-gray:     #9E9188   /* texto secundario, kickers */
--dark-bg:       #141410   /* fondo contacto / footer */
```

**Nunca usar:** rojo saturado, degradados tecnológicos, paletas azul/violeta.

### Tipografía
| Rol | Fuente | Peso | Uso |
|-----|--------|------|-----|
| Display / Titulares | Cormorant Garamond | 300, 400, 400i | H1, H2, estadísticas grandes, valores |
| Body / UI | Inter | 300, 400, 500 | Párrafos, labels, nav, botones |
| Chino (ZH) | Noto Serif SC + Noto Sans SC | 300, 400 | Solo en locale zh, cargado condicionalmente |

**Escala tipográfica (base 16px):**
- H1 display: `clamp(2.8rem, 6vw, 5.5rem)` weight 300
- H2 sección: `clamp(2rem, 2.8vw, 3.2rem)` weight 300
- H3 subsección: `1.1–1.5rem` weight 400
- Body: `0.875–0.9rem` weight 300, line-height 1.75–1.85
- Label/kicker: `0.6rem` weight 400, letter-spacing 0.2em, uppercase

### Espaciado
Sistema base 4px. Tokens: `4, 8, 12, 16, 24, 32, 48, 64, 80, 96, 112, 128`.

### Grid
12 columnas, container max `1280px`, padding lateral `5rem` (desktop) / `1.25rem` (mobile).

### Animaciones
- Duración: 200–400ms
- Easing: `ease-out` siempre
- Hover scale en díptico: `1.03` (columna activa) + `opacity: 0.75` (columna pasiva)
- Reveal al scroll: `IntersectionObserver` + clase `.revealed`
- `prefers-reduced-motion`: todas las animaciones desactivadas

---

## 4. Arquitectura del proyecto

```
GrupoSaturno/
├── src/
│   ├── components/
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── LanguageSelector.astro   (Alpine.js)
│   │   ├── MobileMenu.astro         (Alpine.js)
│   │   ├── Hero.astro
│   │   ├── DipticoUnidades.astro
│   │   ├── QuienesSomos.astro
│   │   ├── MisionVisionValores.astro
│   │   ├── ElProducto.astro
│   │   ├── CadenaValor.astro
│   │   ├── PorQueSaturno.astro
│   │   ├── ContactoComercial.astro  (Alpine.js — formulario)
│   │   └── ui/
│   │       ├── Button.astro
│   │       ├── SectionLabel.astro
│   │       └── ScrollReveal.astro
│   ├── layouts/
│   │   ├── BaseLayout.astro         (head, meta, fonts, scripts)
│   │   └── SubLandingLayout.astro   (hereda Base, agrega breadcrumb)
│   ├── pages/
│   │   ├── index.astro              (redirect a /es/)
│   │   ├── [lang]/
│   │   │   ├── index.astro          (home)
│   │   │   ├── FrigorificoFlorida.astro
│   │   │   └── FrigorificoSaturno.astro
│   └── i18n/
│       ├── es.json                  (default — es-UY neutro)
│       ├── en.json                  (inglés comercial internacional)
│       └── zh.json                  (zh-CN — REQUIRES NATIVE REVIEW)
├── public/
│   ├── images/                      (imágenes scrapeadas + optimizadas)
│   │   ├── planta-exterior.jpg
│   │   ├── campo-ganado.jpg
│   │   └── ...
│   ├── fonts/                       (si se sirven localmente)
│   ├── favicon.svg
│   └── robots.txt
├── docs/
│   ├── superpowers/specs/           (este archivo)
│   ├── screenshots/                 (mobile + desktop post-build)
│   └── design-system.md
├── ASSETS-TODO.md
├── CONTENT-TODO.md
└── README.md
```

### i18n
- Rutas: `/es/`, `/en/`, `/zh/` — configuradas via `astro.config.mjs` con `i18n.routing`
- Redirect en `/`: JS client-side en `index.astro` lee `navigator.language` y redirige a `/es/`, `/en/` o `/zh/`. Fallback: `/es/`. El output es estático — no hay server-side `Accept-Language`. Override manual siempre disponible via selector de idioma.
- Todos los textos en `src/i18n/[locale].json`, sin nada hardcodeado en componentes
- Archivos ZH marcados `// REQUIRES NATIVE REVIEW` — sin traducción automática sin revisión humana
- `hreflang` para los 3 idiomas en cada página

---

## 5. Páginas y secciones

### 5.1 Landing principal (`/[lang]/`)

| Orden | Sección | Fondo | Altura aprox |
|-------|---------|-------|-------------|
| 1 | Header sticky | cream translúcido + blur | 64px |
| 2 | Hero | carbon oscuro + overlay | 92vh |
| 3 | Díptico unidades | carbon con fotos | 72vh mín |
| 4 | Quiénes somos | cream | auto |
| 5 | Misión / Visión / Valores | carbon | auto |
| 6 | El Producto | cream | auto |
| 7 | Cadena de valor | cream | auto |
| 8 | Por qué Saturno | off-white | auto |
| 9 | Contacto comercial | dark-bg | auto |
| 10 | Footer | #0e0e0a | auto |

#### Header
- Logo: lockup tipográfico Cormorant Garamond — "Grupo **Saturno**" (acento en borgoña)
- Nav: `Grupo · Unidades · Trayectoria · Contacto` + CTA `Contacto comercial`
- Language selector: `ES · EN · 中文` — activo en borgoña, siempre visible
- Sticky con `backdrop-filter: blur(12px)` al scrollear
- Mobile: menú hamburguesa con selector de idioma en la parte superior del drawer

#### Hero
- H1 Cormorant 300: *"26 años llevando la calidad uruguaya al mundo."* (con em italic en "al mundo.")
- Bajada Inter 300: texto sobre integración del grupo
- CTA primario (burgundy fill): "Conocé nuestras unidades" → scroll a díptico
- CTA ghost (borde blanco): "Contactanos" → anchor a contacto
- Scroll cue vertical a la derecha

#### Díptico unidades *(núcleo del pedido del cliente)*
- 2 columnas 50/50, `min-height: 72vh`
- Toda la columna es clickeable (no solo el botón)
- Hover desktop: columna activa `scale(1.03)`, otra `opacity: 0.75`
- Número de unidad en borgoña + línea horizontal sutil
- Botón estilo ghost con flecha, hover invierte colores + borde + burgundy bg translúcido
- Separador vertical entre columnas: `1px` gradiente con transparencias arriba/abajo
- Mobile: apiladas, full width

**Columna Florida:** tono azulado-industrial en fotografía/overlay  
**Columna Saturno:** tono cálido-tierra en fotografía/overlay

#### Quiénes somos
- Grid asimétrico: `1fr 1.6fr`
- Izquierda: label + H2 Cormorant italic
- Derecha: texto body + stats grid 3 columnas con números grandes en borgoña

#### Misión / Visión / Valores
- Fondo carbon
- Top: 3 columnas — H2 izquierda, Misión centro, Visión derecha
- Valores: 6 celdas en grid horizontal, separadas por `border-right` sutil
- Cada valor: palabra grande Cormorant + descripción Inter 300 en blanco/35%

#### El Producto *(crítico para clientes internacionales)*
- Header dos columnas: título izquierda, subtítulo explicativo derecha
- Galería editorial: `grid-template-columns: 1.4fr 1fr 1fr` + `rows: 280px 200px` — foto principal vertical izquierda
- Placeholders comentados en código con descripción de foto ideal
- Ficha técnica: 3 columnas (Cortes, Presentación, Certificaciones) con `[A CONFIRMAR]` marcados

#### Cadena de valor
- 6 eslabones en grid horizontal (desktop) / vertical (mobile)
- Puntos numerados Cormorant + línea conectiva sutil entre ellos
- Cada eslabón: número → nombre → 1 línea descripción

#### Por qué Saturno
- Grid 2×2 con número fantasma en borgoña muy claro
- 4 diferenciadores: Integración total, Calidad constante, Escala con cercanía, Visión internacional

#### Contacto comercial
- Grid 50/50: copy izquierda + formulario derecha
- Formulario: nombre, empresa, país, email, mensaje
- Grid de inputs con `1px` gaps sobre fondo oscuro
- Submit button full-width burgundy
- Info directa: dirección, email `[A CONFIRMAR]`, LinkedIn

#### Footer
- 4 columnas: logo+descripción, navegación, unidades, legal+redes
- Copyright: `© 2026 Grupo Saturno · Empalme Olmos, Uruguay`

---

### 5.2 Sub-landings

**Rutas:** `/[lang]/FrigorificoFlorida` y `/[lang]/FrigorificoSaturno`

**Layout base compartido (`SubLandingLayout.astro`):**
1. Header (igual a principal, con breadcrumb adicional)
2. Hero propio (imagen, nombre, bajada)
3. Sección de capacidades / servicios `[CONTENIDO A DEFINIR]`
4. Galería de instalaciones
5. Contacto directo de esa unidad
6. Footer con breadcrumb de regreso

**Diferenciación visual:**
- Florida: tonos azulado-industriales en fotografías y overlays
- Saturno: tonos cálidos-tierra en fotografías y overlays
- Misma paleta de brand (borgoña, cream, carbon), diferente temperatura fotográfica

**Todos los textos marcados** `[CONTENIDO A DEFINIR CON CLIENTE]` donde no haya datos confirmados.

---

## 6. SEO y accesibilidad

### SEO
- `<title>` y `<meta description>` traducidos por locale
- Open Graph + Twitter Card en cada página
- `hreflang` para los 3 idiomas en todas las páginas
- Schema.org `Organization` con dirección Uruguay en página principal
- `sitemap.xml` generado por `@astrojs/sitemap`
- `robots.txt` básico
- `canonical` en cada página
- `lang` attribute correcto por locale en `<html>`

### Accesibilidad (WCAG 2.1 AA)
- Contraste mínimo 4.5:1 para texto normal, 3:1 para texto grande
- Focus visible en todos los elementos interactivos (outline borgoña)
- Landmarks semánticos: `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`
- `alt` descriptivo en todas las imágenes
- Navegación por teclado funcional
- `aria-label` en botones icon-only (menú hamburguesa, selector de idioma)

### Performance
- Lighthouse ≥ 95 mobile en todas las métricas
- CLS: 0 (dimensiones explícitas en todas las imágenes)
- LCP < 2.5s (hero: `loading="eager"`, resto lazy)
- Tipografías: `font-display: swap` + `preload` para variantes críticas
- Noto SC cargado solo en locale zh (condicional)

---

## 7. Imágenes y assets

### Origen
- Scraping de `https://www.frigorificosaturno.com.uy/` → guardar en `/public/images/` con nombres semánticos
- Nombres: `planta-exterior.jpg`, `campo-ganado.jpg`, `linea-procesado.jpg`, `corte-producto.jpg`, `packaging-vacuum.jpg`, `carga-contenedor.jpg`, etc.
- Imágenes de baja calidad o irrelevantes: documentar en `ASSETS-TODO.md`

### Tratamiento
- Sin filtros extremos, sin stock genérico
- Placeholders en código: `{/* PLACEHOLDER: [descripción de foto ideal, orientación, contexto] */}`
- Galería de producto: luz de estudio, fondos neutros

---

## 8. Contenido pendiente

Todo lo que no fue confirmado por el cliente está marcado `[A CONFIRMAR CON CLIENTE]` en el código y listado en `CONTENT-TODO.md`. **Ningún dato cuantitativo fue inventado.**

Items principales pendientes:
- Toneladas / capacidad de procesamiento semanal
- Número de campos propios
- Certificaciones vigentes (HACCP, Halal, Kosher, USDA-eq, UE, GACC China)
- Mercados de exportación actuales
- Email comercial
- Descripción específica de Frigorífico Florida (diferenciadores, capacidades)
- Cortes disponibles y formatos de presentación
- Revisión nativa obligatoria del diccionario ZH antes del lanzamiento

---

## 9. Entregables

1. Proyecto Astro corriendo con `npm run dev`
2. Código en `/src/components`, textos en `/src/i18n/`
3. `README.md` — stack, cómo correr, cómo editar contenido
4. `ASSETS-TODO.md` — imágenes placeholders a proveer
5. `CONTENT-TODO.md` — textos a confirmar con cliente
6. Build de producción sin errores (`npm run build`)
7. Screenshots mobile + desktop en `/docs/screenshots/`

---

## 10. Decisiones tomadas en brainstorming

| Decisión | Elección | Alternativa descartada |
|----------|----------|----------------------|
| Acento de color | Borgoña `#6B2E2A` | Verde campo `#3A4A2E` |
| Tipografía editorial | Cormorant Garamond | Fraunces, Playfair Display |
| Framework | Astro (opción A) | HTML+Vite vanilla |
| i18n | Astro nativo — archivos JSON por locale en `src/i18n/` | MDX por sección |

---

## 11. Orden de construcción

1. Scaffolding Astro + Tailwind + Alpine.js + i18n config
2. Design system: tokens Tailwind, componentes base
3. Scraping de imágenes → `/public/images/`
4. Layout base y sub-landing layout
5. Header + Footer + LanguageSelector
6. Home completa (secciones en orden)
7. Sub-landings con contenido placeholder
8. QA accesibilidad + performance
9. Documentación (README, ASSETS-TODO, CONTENT-TODO)
10. Build verificado + screenshots
