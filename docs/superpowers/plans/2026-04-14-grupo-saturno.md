# Grupo Saturno — Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir una landing page institucional estática trilingüe (ES/EN/ZH) para Grupo Saturno en Astro 4 con Tailwind CSS y Alpine.js, lista para deploy en Vercel/Netlify/Cloudflare Pages.

**Architecture:** Astro monorepo con output estático, i18n nativo con rutas `/es/`, `/en/`, `/zh/`, textos en JSON por locale. Landing principal con 9 secciones + 2 sub-landings con layout base compartido. Design system Cormorant Garamond + Inter, acento borgoña `#6B2E2A`.

**Tech Stack:** Astro 4, Tailwind CSS v3, Alpine.js, @fontsource (Cormorant Garamond, Inter, Noto SC), @astrojs/sitemap, Vitest (tests i18n), Playwright (smoke tests build).

---

## File Map

### Configuración
- `astro.config.mjs` — config de Astro: i18n routing, sitemap, image, output static
- `tailwind.config.mjs` — design tokens: colores, tipografía, spacing
- `package.json` — deps y scripts
- `tsconfig.json` — TypeScript config

### Layouts
- `src/layouts/BaseLayout.astro` — head, fonts, global CSS, meta SEO, hreflang, Schema.org
- `src/layouts/SubLandingLayout.astro` — hereda BaseLayout, agrega breadcrumb

### Componentes UI (átomos)
- `src/components/ui/Button.astro` — variantes: primary, ghost, ghost-dark
- `src/components/ui/SectionLabel.astro` — kicker uppercase borgoña
- ~~`src/components/ui/ScrollReveal.astro`~~ — implementado como clase CSS `.scroll-reveal` + IntersectionObserver en `BaseLayout.astro`. No se crea como componente separado.

### Componentes estructura
- `src/components/Header.astro` — nav sticky blur, logo, CTA, LanguageSelector
- `src/components/LanguageSelector.astro` — `ES · EN · 中文` con Alpine.js
- `src/components/MobileMenu.astro` — drawer Alpine.js con lang selector arriba
- `src/components/Footer.astro` — 4 columnas, copyright

### Secciones (home)
- `src/components/sections/Hero.astro`
- `src/components/sections/DipticoUnidades.astro`
- `src/components/sections/QuienesSomos.astro`
- `src/components/sections/MisionVisionValores.astro`
- `src/components/sections/ElProducto.astro`
- `src/components/sections/CadenaValor.astro`
- `src/components/sections/PorQueSaturno.astro`
- `src/components/sections/ContactoComercial.astro`

### Páginas
- `src/pages/index.astro` — redirect JS client-side según `navigator.language`
- `src/pages/[lang]/index.astro` — landing principal
- `src/pages/[lang]/FrigorificoFlorida.astro` — sub-landing
- `src/pages/[lang]/FrigorificoSaturno.astro` — sub-landing

### i18n
- `src/i18n/es.json` — textos ES (es-UY neutro)
- `src/i18n/en.json` — textos EN (inglés comercial)
- `src/i18n/zh.json` — textos ZH-CN (marcado REQUIRES NATIVE REVIEW)
- `src/i18n/index.ts` — funciones helper: `useTranslations(lang)`, `getLangFromUrl(url)`

### Estilos
- `src/styles/global.css` — reset, custom properties, font-face declarations, scroll-reveal keyframes

### Públicos
- `public/images/` — imágenes scrapeadas (generado por script)
- `public/robots.txt`
- `public/favicon.svg`

### Scripts de utilidad
- `scripts/scrape-images.js` — Node script para descargar imágenes de frigorificosaturno.com.uy

### Tests
- `src/i18n/__tests__/i18n.test.ts` — verifica que todos los locales tienen las mismas keys
- `tests/smoke.spec.ts` — Playwright: build genera las rutas esperadas y no hay 404s

### Documentación
- `README.md`
- `ASSETS-TODO.md`
- `CONTENT-TODO.md`
- `docs/design-system.md`

---

## Task 1: Scaffolding del proyecto

**Files:**
- Create: `astro.config.mjs`
- Create: `tailwind.config.mjs`
- Create: `package.json` (generado por Astro CLI)
- Create: `tsconfig.json`
- Create: `src/styles/global.css`

- [ ] **Step 1: Crear proyecto Astro**

```bash
cd "C:/Users/Usuario/OneDrive/Desktop/CLAUDIO/GrupoSaturno"
npm create astro@latest . -- --template minimal --typescript strict --no-install --no-git
```

Expected: Estructura de proyecto creada con `src/pages/index.astro`, `astro.config.mjs`, `tsconfig.json`.

- [ ] **Step 2: Instalar dependencias**

```bash
npm install
npm install @astrojs/tailwind @astrojs/sitemap @astrojs/alpinejs tailwindcss alpinejs
npm install @fontsource/cormorant-garamond @fontsource/inter @fontsource-variable/inter
npm install @fontsource/noto-serif-sc @fontsource/noto-sans-sc
npm install --save-dev vitest @playwright/test
```

- [ ] **Step 3: Configurar `astro.config.mjs`**

```javascript
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import alpinejs from '@astrojs/alpinejs';

export default defineConfig({
  site: 'https://gruposaturno.com.uy',
  output: 'static',
  integrations: [
    tailwind({ applyBaseStyles: false }),
    sitemap({ i18n: { defaultLocale: 'es', locales: { es: 'es-UY', en: 'en', zh: 'zh-CN' } } }),
    alpinejs({ entrypoint: '/src/entrypoints/alpine.ts' }),
  ],
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en', 'zh'],
    routing: { prefixDefaultLocale: true },
  },
  image: { service: { entrypoint: 'astro/assets/services/sharp' } },
});
```

- [ ] **Step 4: Crear `src/entrypoints/alpine.ts`**

```typescript
import type { Alpine } from 'alpinejs';

export default (Alpine: Alpine) => {
  // Alpine plugins / stores pueden agregarse aquí
};
```

- [ ] **Step 5: Configurar `tailwind.config.mjs`**

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        burgundy: { DEFAULT: '#6B2E2A', light: '#8A3D38' },
        cream: '#F5F1EA',
        'off-white': '#FAF8F4',
        carbon: '#1A1A1A',
        'warm-gray': '#9E9188',
        'dark-bg': '#141410',
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        'serif-zh': ['Noto Serif SC', 'Cormorant Garamond', 'serif'],
        'sans-zh': ['Noto Sans SC', 'Inter', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem', '22': '5.5rem', '26': '6.5rem',
        '30': '7.5rem', '34': '8.5rem',
      },
      transitionTimingFunction: { 'out-smooth': 'cubic-bezier(0.0, 0.0, 0.2, 1)' },
    },
  },
  plugins: [],
};
```

- [ ] **Step 6: Crear `src/styles/global.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Cormorant Garamond */
@import '@fontsource/cormorant-garamond/300.css';
@import '@fontsource/cormorant-garamond/400.css';
@import '@fontsource/cormorant-garamond/300-italic.css';
@import '@fontsource/cormorant-garamond/400-italic.css';

/* Inter */
@import '@fontsource/inter/300.css';
@import '@fontsource/inter/400.css';
@import '@fontsource/inter/500.css';

@layer base {
  html { font-family: theme('fontFamily.sans'); color: theme('colors.carbon'); }
  html[lang='zh'] { font-family: theme('fontFamily.sans-zh'); }

  *:focus-visible {
    outline: 2px solid theme('colors.burgundy.DEFAULT');
    outline-offset: 3px;
  }

  ::selection {
    background: theme('colors.burgundy.DEFAULT');
    color: white;
  }
}

@layer utilities {
  .scroll-reveal {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.5s ease-out, transform 0.5s ease-out;
  }
  .scroll-reveal.revealed {
    opacity: 1;
    transform: translateY(0);
  }
  @media (prefers-reduced-motion: reduce) {
    .scroll-reveal { opacity: 1; transform: none; transition: none; }
  }
}
```

- [ ] **Step 7: Verificar que el servidor de dev levanta**

```bash
npm run dev
```

Expected: `http://localhost:4321` responde con la página de Astro por defecto.

- [ ] **Step 8: Commit**

```bash
git init
git add -A
git commit -m "feat: scaffold Astro project with Tailwind, Alpine, i18n config"
```

---

## Task 2: Sistema i18n — diccionarios y helpers

**Files:**
- Create: `src/i18n/es.json`
- Create: `src/i18n/en.json`
- Create: `src/i18n/zh.json`
- Create: `src/i18n/index.ts`
- Create: `src/i18n/__tests__/i18n.test.ts`

- [ ] **Step 1: Crear `src/i18n/es.json`**

```json
{
  "nav": {
    "group": "Grupo",
    "units": "Unidades de negocio",
    "history": "Trayectoria",
    "contact": "Contacto",
    "ctaContact": "Contacto comercial"
  },
  "lang": {
    "es": "ES",
    "en": "EN",
    "zh": "中文"
  },
  "hero": {
    "kicker": "Empalme Olmos, Uruguay · Est. 1998",
    "h1": "26 años llevando la calidad uruguaya al mundo.",
    "h1Italic": "al mundo.",
    "lead": "Grupo Saturno integra producción ganadera, procesamiento frigorífico y comercialización. Un socio confiable para quienes entienden que la calidad se construye en cada eslabón.",
    "ctaPrimary": "Conocé nuestras unidades",
    "ctaSecondary": "Contactanos"
  },
  "units": {
    "unit1Number": "Unidad 01",
    "unit1Title": "Frigorífico Florida",
    "unit1Desc": "[CONTENIDO A CONFIRMAR CON CLIENTE] — Procesamiento especializado con foco en exportación y mercado interno premium.",
    "unit1Cta": "Conocer Frigorífico Florida",
    "unit2Number": "Unidad 02",
    "unit2Title": "Frigorífico Saturno",
    "unit2Desc": "Producción y procesamiento integrados con trazabilidad desde el origen. Núcleo del grupo.",
    "unit2Cta": "Conocer Frigorífico Saturno"
  },
  "about": {
    "label": "El Grupo",
    "h2": "Un grupo, una cadena completa.",
    "h2Italic": "una cadena completa.",
    "body": "Grupo Saturno es una empresa uruguaya con 26 años de trayectoria dedicada a la producción, procesamiento y comercialización de carne. Desde nuestros campos en Empalme Olmos hasta mesas en todo el mundo, cada etapa ocurre bajo el mismo estándar: consistencia, trazabilidad y compromiso humano.",
    "stat1Number": "26",
    "stat1Unit": "años",
    "stat1Desc": "de trayectoria",
    "stat2Number": "100%",
    "stat2Unit": "trazabilidad",
    "stat2Desc": "origen al producto final",
    "stat3Number": "—",
    "stat3Unit": "mercados",
    "stat3Desc": "de exportación [A CONFIRMAR]"
  },
  "mvv": {
    "label": "Propósito",
    "h2": "Lo que nos mueve cada día.",
    "h2Italic": "cada día.",
    "misionLabel": "Misión",
    "mision": "Llevar la calidad y la esencia uruguaya al mundo.",
    "visionLabel": "Visión",
    "vision": "Ser reconocidos por nuestra empatía, seriedad y confianza, construyendo relaciones estratégicas y duraderas.",
    "valores": [
      { "word": "Aprendizaje", "desc": "Cada ciclo productivo como oportunidad de mejorar." },
      { "word": "Crecimiento", "desc": "Personal, profesional y como organización." },
      { "word": "Esfuerzo", "desc": "El trabajo sostenido como única garantía." },
      { "word": "Adaptabilidad", "desc": "26 años requieren saber cambiar a tiempo." },
      { "word": "Compromiso", "desc": "Con el producto, el equipo y el cliente." },
      { "word": "Empatía", "desc": "Entender al otro es parte del negocio." }
    ]
  },
  "product": {
    "label": "Evidencia de capacidad",
    "h2": "La carne uruguaya, en detalle.",
    "h2Italic": "en detalle.",
    "subtitle": "Fotografía de producto, instalaciones y logística.",
    "spec1Cat": "Cortes disponibles",
    "spec1Title": "Tipos de corte",
    "spec1Text": "Cortes estándar internacionales y cortes uruguayos tradicionales.",
    "spec1Pending": "[ A CONFIRMAR CON CLIENTE ]",
    "spec2Cat": "Presentación",
    "spec2Title": "Formatos de despacho",
    "spec2Text": "Fresco · Congelado · Vacuum packed · Boxed beef",
    "spec2Pending": "[ A CONFIRMAR ]",
    "spec3Cat": "Calidad",
    "spec3Title": "Certificaciones",
    "spec3Text": "HACCP · Habilitación UE · China GACC · Halal · Kosher",
    "spec3Pending": "[ VERIFICAR CON CLIENTE ]"
  },
  "chain": {
    "label": "Integración vertical",
    "h2": "De la tierra a la mesa, sin intermediarios.",
    "h2Italic": "sin intermediarios.",
    "steps": [
      { "n": "01", "title": "Producción ganadera", "desc": "Campos propios en Uruguay" },
      { "n": "02", "title": "Procesamiento frigorífico", "desc": "Control de calidad propio" },
      { "n": "03", "title": "Venta mayorista", "desc": "Importadores y distribuidores" },
      { "n": "04", "title": "Venta minorista", "desc": "Carnicerías y supermercados" },
      { "n": "05", "title": "E-commerce", "desc": "Alcance nacional directo" },
      { "n": "06", "title": "Restaurante La Hacienda", "desc": "Experiencia gastronómica" }
    ]
  },
  "why": {
    "label": "Diferenciadores",
    "h2": "Lo que nos diferencia.",
    "items": [
      { "n": "01", "title": "Integración total", "text": "Producimos, procesamos y comercializamos. Control real en cada etapa de la cadena." },
      { "n": "02", "title": "Calidad constante", "text": "Sin intermediarios que alteren el resultado. Conocemos el producto desde el origen." },
      { "n": "03", "title": "Escala con cercanía", "text": "Capacidad industrial, trato humano. Somos ambas cosas, no una ni la otra." },
      { "n": "04", "title": "Visión internacional", "text": "Evolucionando hacia mercados globales con estándares alineados a la exigencia externa." }
    ]
  },
  "contact": {
    "label": "Contacto comercial",
    "h2": "Hablemos de negocios a largo plazo.",
    "h2Italic": "a largo plazo.",
    "lead": "Si representás una empresa importadora, distribuidora o del sector alimenticio, te invitamos a conocernos en profundidad.",
    "locationLabel": "Ubicación",
    "location": "Empalme Olmos, Canelones, Uruguay",
    "emailLabel": "Email",
    "email": "[A CONFIRMAR CON CLIENTE]",
    "linkedinLabel": "LinkedIn",
    "linkedin": "/grupo-saturno",
    "fieldName": "Nombre",
    "fieldCompany": "Empresa",
    "fieldCountry": "País",
    "fieldEmail": "Email",
    "fieldMessage": "Mensaje",
    "fieldNamePlaceholder": "Tu nombre",
    "fieldCompanyPlaceholder": "Razón social",
    "fieldCountryPlaceholder": "País de origen",
    "fieldEmailPlaceholder": "correo@empresa.com",
    "fieldMessagePlaceholder": "¿En qué podemos ayudarte?",
    "submit": "Enviar consulta →"
  },
  "footer": {
    "desc": "Empresa uruguaya con 26 años de trayectoria en producción, procesamiento y comercialización de carne.",
    "navTitle": "Navegación",
    "unitsTitle": "Unidades",
    "legalTitle": "Legal",
    "legal": "Aviso legal",
    "privacy": "Privacidad",
    "copyright": "© 2026 Grupo Saturno · Empalme Olmos, Uruguay"
  },
  "meta": {
    "homeTitle": "Grupo Saturno — Producción y Procesamiento Cárnico | Uruguay",
    "homeDesc": "26 años de trayectoria en ganadería, procesamiento frigorífico y comercialización internacional. Empalme Olmos, Uruguay.",
    "floridaTitle": "Frigorífico Florida — Grupo Saturno",
    "floridaDesc": "[A CONFIRMAR CON CLIENTE]",
    "saturnoTitle": "Frigorífico Saturno — Grupo Saturno",
    "saturnoDesc": "Núcleo productivo del Grupo Saturno. Procesamiento integrado con trazabilidad desde el origen."
  }
}
```

- [ ] **Step 2: Crear `src/i18n/en.json`** (misma estructura, textos en inglés comercial)

Crear el archivo con las mismas keys que `es.json`. Valores en inglés:
- `hero.h1`: `"26 years bringing Uruguayan quality to the world."`
- `hero.h1Italic`: `"to the world."`
- `hero.lead`: `"Grupo Saturno integrates cattle production, meat processing, and commercialization. A reliable partner for those who understand that quality is built at every link in the chain."`
- Resto: traducción directa fiel al tono comercial formal del spec.
- `meta.homeTitle`: `"Grupo Saturno — Meat Production & Processing | Uruguay"`

> **Nota:** el archivo completo debe tener EXACTAMENTE las mismas keys que `es.json`. El test de i18n fallará si falta alguna key.

- [ ] **Step 3: Crear `src/i18n/zh.json`** (misma estructura, marcado REQUIRES NATIVE REVIEW)

```json
{
  "_notice": "// REQUIRES NATIVE REVIEW — DO NOT PUBLISH WITHOUT HUMAN NATIVE SPEAKER REVIEW",
  "nav": {
    "group": "集团",
    "units": "业务单元",
    "history": "发展历程",
    "contact": "联系我们",
    "ctaContact": "商业联系"
  },
  "hero": {
    "kicker": "乌拉圭坎内洛内斯省 · 创立于1998年",
    "h1": "26年，将乌拉圭品质带向世界。",
    "h1Italic": "带向世界。",
    "lead": "萨图诺集团整合了畜牧业生产、冷冻加工和商业销售。对于那些深知品质源于每一个环节的合作伙伴而言，我们是可靠的选择。",
    "ctaPrimary": "了解我们的业务",
    "ctaSecondary": "联系我们"
  }
}
```

> ⚠️ **IMPORTANTE:** completar el resto de las keys igual que en `es.json`. Todo el contenido ZH está marcado como borrador — **requiere revisión obligatoria por hablante nativo con experiencia en comercio exterior agroindustrial antes del lanzamiento.**

- [ ] **Step 4: Crear `src/i18n/index.ts`**

```typescript
export const languages = ['es', 'en', 'zh'] as const;
export type Lang = typeof languages[number];
export const defaultLang: Lang = 'es';

type Translations = typeof import('./es.json');

const translations: Record<Lang, Translations> = {
  es: (await import('./es.json')).default as Translations,
  en: (await import('./en.json')).default as Translations,
  zh: (await import('./zh.json')).default as Translations,
};

export function getLangFromUrl(url: URL): Lang {
  const [, lang] = url.pathname.split('/');
  if (languages.includes(lang as Lang)) return lang as Lang;
  return defaultLang;
}

export function useTranslations(lang: Lang) {
  return function t(key: string): string {
    const keys = key.split('.');
    let value: unknown = translations[lang];
    for (const k of keys) {
      value = (value as Record<string, unknown>)?.[k];
    }
    if (value === undefined) {
      // Fallback a español
      let fallback: unknown = translations[defaultLang];
      for (const k of keys) {
        fallback = (fallback as Record<string, unknown>)?.[k];
      }
      return String(fallback ?? key);
    }
    // Retornar valor crudo si es array u objeto (para iteración en componentes)
    if (Array.isArray(value) || typeof value === 'object') return JSON.stringify(value);
    return String(value);
  };
}
```

- [ ] **Step 5: Escribir tests de i18n**

Crear `src/i18n/__tests__/i18n.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import es from '../es.json';
import en from '../en.json';
import zh from '../zh.json';

function getLeafKeys(obj: object, prefix = ''): string[] {
  return Object.entries(obj).flatMap(([key, value]) => {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (Array.isArray(value)) return [fullKey];
    if (typeof value === 'object' && value !== null) return getLeafKeys(value as object, fullKey);
    return [fullKey];
  });
}

describe('i18n completeness', () => {
  const esKeys = getLeafKeys(es).filter(k => !k.startsWith('_'));
  const enKeys = getLeafKeys(en).filter(k => !k.startsWith('_'));
  const zhKeys = getLeafKeys(zh).filter(k => !k.startsWith('_'));

  it('EN tiene todas las keys de ES', () => {
    const missing = esKeys.filter(k => !enKeys.includes(k));
    expect(missing, `Missing in EN: ${missing.join(', ')}`).toHaveLength(0);
  });

  it('ZH tiene todas las keys de ES', () => {
    const missing = esKeys.filter(k => !zhKeys.includes(k));
    expect(missing, `Missing in ZH: ${missing.join(', ')}`).toHaveLength(0);
  });

  it('no hay keys vacías en ES', () => {
    const empty = esKeys.filter(k => {
      const keys = k.split('.');
      let v: unknown = es;
      for (const key of keys) v = (v as Record<string, unknown>)?.[key];
      return v === '';
    });
    expect(empty, `Empty keys in ES: ${empty.join(', ')}`).toHaveLength(0);
  });
});
```

- [ ] **Step 6: Agregar script de test a `package.json`**

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

- [ ] **Step 7: Correr tests**

```bash
npm test
```

Expected: Los tests de ES→EN y ES→ZH fallan hasta completar los archivos JSON. Completar los archivos hasta que pasen.

- [ ] **Step 8: Commit**

```bash
git add src/i18n/
git commit -m "feat: i18n dictionaries ES/EN/ZH with completeness tests"
```

---

## Task 3: Layouts base

**Files:**
- Create: `src/layouts/BaseLayout.astro`
- Create: `src/layouts/SubLandingLayout.astro`

- [ ] **Step 1: Crear `src/layouts/BaseLayout.astro`**

```astro
---
import '../styles/global.css';
import { getLangFromUrl, useTranslations, languages } from '../i18n/index';
import type { Lang } from '../i18n/index';

export interface Props {
  title: string;
  description: string;
  image?: string;
}

const { title, description, image = '/og-default.jpg' } = Astro.props;
const lang = getLangFromUrl(Astro.url) as Lang;
const t = useTranslations(lang);

const canonicalURL = new URL(Astro.url.pathname, Astro.site);
const hreflangs = languages.map(l => ({
  lang: l === 'zh' ? 'zh-CN' : l,
  href: new URL(`/${l}${Astro.url.pathname.replace(/^\/(es|en|zh)/, '')}`, Astro.site).href,
}));
---
<!DOCTYPE html>
<html lang={lang === 'zh' ? 'zh-CN' : lang}>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{title}</title>
  <meta name="description" content={description} />
  <link rel="canonical" href={canonicalURL} />

  {hreflangs.map(({ lang: l, href }) => (
    <link rel="alternate" hreflang={l} href={href} />
  ))}
  <link rel="alternate" hreflang="x-default" href={new URL('/es/', Astro.site).href} />

  <!-- Open Graph -->
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content={new URL(image, Astro.site).href} />
  <meta property="og:type" content="website" />
  <meta property="og:url" content={canonicalURL} />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={new URL(image, Astro.site).href} />

  <!-- Schema.org Organization -->
  <script type="application/ld+json">
    {JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Grupo Saturno",
      "url": "https://gruposaturno.com.uy",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Empalme Olmos",
        "addressRegion": "Canelones",
        "addressCountry": "UY"
      },
      "foundingDate": "1998",
      "description": "Empresa uruguaya de producción, procesamiento y comercialización cárnica."
    })}
  </script>

  <!-- Preload fuentes críticas -->
  <link rel="preload" as="font" type="font/woff2"
    href="/fonts/cormorant-garamond-latin-300-normal.woff2" crossorigin />
  <link rel="preload" as="font" type="font/woff2"
    href="/fonts/inter-latin-400-normal.woff2" crossorigin />
</head>
<body>
  <slot />
  <script>
    // Scroll reveal con IntersectionObserver
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('revealed'); }),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.scroll-reveal').forEach(el => observer.observe(el));
  </script>
</body>
</html>
```

- [ ] **Step 2: Crear `src/layouts/SubLandingLayout.astro`**

```astro
---
import BaseLayout from './BaseLayout.astro';
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
import { getLangFromUrl, useTranslations } from '../i18n/index';

export interface Props {
  title: string;
  description: string;
  unitName: string;
}

const { title, description, unitName } = Astro.props;
const lang = getLangFromUrl(Astro.url);
const t = useTranslations(lang);
---
<BaseLayout title={title} description={description}>
  <Header />
  <!-- Breadcrumb -->
  <nav aria-label="Breadcrumb"
    class="sticky top-16 z-40 bg-cream/95 backdrop-blur border-b border-burgundy/10 px-8 lg:px-20 py-3 flex items-center gap-2 text-xs text-warm-gray tracking-wide">
    <a href={`/${lang}/`} class="font-serif text-carbon hover:text-burgundy transition-colors">
      Grupo <span class="text-burgundy">Saturno</span>
    </a>
    <span class="text-warm-gray/40">›</span>
    <span class="text-burgundy">{unitName}</span>
  </nav>
  <main>
    <slot />
  </main>
  <Footer />
</BaseLayout>
```

- [ ] **Step 3: Verificar que no hay errores TypeScript**

```bash
npx astro check
```

Expected: 0 errors.

- [ ] **Step 4: Commit**

```bash
git add src/layouts/
git commit -m "feat: BaseLayout and SubLandingLayout with SEO, hreflang, Schema.org"
```

---

## Task 4: Componentes UI base + Header + Footer

**Files:**
- Create: `src/components/ui/Button.astro`
- Create: `src/components/ui/SectionLabel.astro`
- Create: `src/components/Header.astro`
- Create: `src/components/LanguageSelector.astro`
- Create: `src/components/MobileMenu.astro`
- Create: `src/components/Footer.astro`

- [ ] **Step 1: `src/components/ui/Button.astro`**

```astro
---
export interface Props {
  variant?: 'primary' | 'ghost' | 'ghost-dark';
  href?: string;
  class?: string;
}
const { variant = 'primary', href, class: cls } = Astro.props;
const base = 'inline-flex items-center gap-3 font-sans text-[0.72rem] font-medium tracking-[0.12em] uppercase transition-all duration-300 ease-out px-8 py-3.5';
const variants = {
  primary: 'bg-burgundy text-white hover:bg-burgundy-light',
  ghost: 'border border-white/30 text-white/70 hover:border-white/60 hover:text-white',
  'ghost-dark': 'border border-burgundy text-burgundy hover:bg-burgundy hover:text-white',
};
const Tag = href ? 'a' : 'button';
---
<Tag href={href} class={`${base} ${variants[variant]} ${cls ?? ''}`}>
  <slot />
</Tag>
```

- [ ] **Step 2: `src/components/ui/SectionLabel.astro`**

```astro
---
export interface Props { class?: string; }
const { class: cls } = Astro.props;
---
<p class={`font-sans text-[0.6rem] tracking-[0.22em] uppercase text-burgundy ${cls ?? ''}`}>
  <slot />
</p>
```

- [ ] **Step 3: `src/components/LanguageSelector.astro`**

```astro
---
import { getLangFromUrl } from '../i18n/index';
const lang = getLangFromUrl(Astro.url);
const currentPath = Astro.url.pathname.replace(/^\/(es|en|zh)/, '') || '/';

const langs = [
  { code: 'es', label: 'ES' },
  { code: 'en', label: 'EN' },
  { code: 'zh', label: '中文' },
];
---
<div class="flex items-center gap-2 pl-4 border-l border-warm-gray/30
            font-sans text-[0.65rem] tracking-[0.1em]">
  {langs.map(({ code, label }, i) => (
    <>
      {i > 0 && <span class="text-warm-gray/30">·</span>}
      <a
        href={`/${code}${currentPath}`}
        class={`transition-colors ${lang === code
          ? 'text-burgundy font-medium'
          : 'text-warm-gray hover:text-carbon'}`}
        aria-current={lang === code ? 'true' : undefined}
        hreflang={code === 'zh' ? 'zh-CN' : code}
      >
        {label}
      </a>
    </>
  ))}
</div>
```

- [ ] **Step 4: `src/components/Header.astro`**

```astro
---
import LanguageSelector from './LanguageSelector.astro';
import { getLangFromUrl, useTranslations } from '../i18n/index';
const lang = getLangFromUrl(Astro.url);
const t = useTranslations(lang);
---
<header
  x-data="{ scrolled: false }"
  x-init="window.addEventListener('scroll', () => { scrolled = window.scrollY > 20 })"
  :class="scrolled ? 'bg-cream/95 backdrop-blur-md shadow-sm' : 'bg-transparent'"
  class="fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out"
>
  <div class="max-w-[1440px] mx-auto px-8 lg:px-20 h-16 flex items-center justify-between">
    <!-- Logo -->
    <a href={`/${lang}/`} class="font-serif text-xl tracking-[0.12em] uppercase">
      Grupo <span class="text-burgundy">Saturno</span>
    </a>

    <!-- Nav desktop -->
    <nav class="hidden lg:flex items-center gap-10" aria-label="Navegación principal">
      <a href={`/${lang}/#grupo`} class="font-sans text-[0.72rem] tracking-[0.08em] uppercase text-carbon/60 hover:text-carbon transition-colors">
        {t('nav.group')}
      </a>
      <a href={`/${lang}/#unidades`} class="font-sans text-[0.72rem] tracking-[0.08em] uppercase text-carbon/60 hover:text-carbon transition-colors">
        {t('nav.units')}
      </a>
      <a href={`/${lang}/#trayectoria`} class="font-sans text-[0.72rem] tracking-[0.08em] uppercase text-carbon/60 hover:text-carbon transition-colors">
        {t('nav.history')}
      </a>
      <a href={`/${lang}/#contacto`}
        class="font-sans text-[0.68rem] font-medium tracking-[0.1em] uppercase text-burgundy border border-burgundy px-4 py-2 hover:bg-burgundy hover:text-white transition-all duration-200">
        {t('nav.ctaContact')}
      </a>
      <LanguageSelector />
    </nav>

    <!-- Mobile menu button -->
    <button
      x-data="{ open: false }"
      @click="open = !open"
      class="lg:hidden p-2 text-carbon"
      aria-label="Abrir menú"
      aria-expanded="false"
      :aria-expanded="open.toString()"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="18" x2="21" y2="18" />
      </svg>
    </button>
  </div>
</header>
<!-- Spacer para contenido bajo el header fixed -->
<div class="h-16" aria-hidden="true"></div>
```

- [ ] **Step 5: `src/components/MobileMenu.astro`** (drawer Alpine.js)

```astro
---
import LanguageSelector from './LanguageSelector.astro';
import { getLangFromUrl, useTranslations } from '../i18n/index';
const lang = getLangFromUrl(Astro.url);
const t = useTranslations(lang);
---
<div
  x-data="{ open: false }"
  @keydown.escape.window="open = false"
  class="lg:hidden"
>
  <!-- Hamburger button -->
  <button
    @click="open = true"
    class="p-2 text-carbon hover:text-burgundy transition-colors"
    aria-label="Abrir menú"
    :aria-expanded="open.toString()"
  >
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  </button>

  <!-- Overlay -->
  <div
    x-show="open"
    x-transition:enter="transition-opacity duration-300"
    x-transition:enter-start="opacity-0"
    x-transition:enter-end="opacity-100"
    x-transition:leave="transition-opacity duration-200"
    x-transition:leave-start="opacity-100"
    x-transition:leave-end="opacity-0"
    @click="open = false"
    class="fixed inset-0 bg-carbon/60 z-40"
    aria-hidden="true"
  ></div>

  <!-- Drawer -->
  <div
    x-show="open"
    x-transition:enter="transition-transform duration-300 ease-out"
    x-transition:enter-start="translate-x-full"
    x-transition:enter-end="translate-x-0"
    x-transition:leave="transition-transform duration-200 ease-in"
    x-transition:leave-start="translate-x-0"
    x-transition:leave-end="translate-x-full"
    class="fixed top-0 right-0 bottom-0 w-72 bg-cream z-50 flex flex-col p-8 shadow-2xl"
    role="dialog"
    aria-modal="true"
    aria-label="Menú de navegación"
  >
    <!-- Cerrar -->
    <button @click="open = false" class="self-end p-1 text-warm-gray hover:text-carbon mb-8" aria-label="Cerrar menú">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    </button>

    <!-- Selector de idioma arriba -->
    <div class="mb-8 pb-8 border-b border-burgundy/10">
      <LanguageSelector />
    </div>

    <!-- Nav links -->
    <nav class="flex flex-col gap-6" aria-label="Navegación mobile">
      <a href={`/${lang}/#grupo`} @click="open = false"
        class="font-sans text-[0.8rem] tracking-[0.1em] uppercase text-carbon/70 hover:text-carbon transition-colors">
        {t('nav.group')}
      </a>
      <a href={`/${lang}/#unidades`} @click="open = false"
        class="font-sans text-[0.8rem] tracking-[0.1em] uppercase text-carbon/70 hover:text-carbon transition-colors">
        {t('nav.units')}
      </a>
      <a href={`/${lang}/#trayectoria`} @click="open = false"
        class="font-sans text-[0.8rem] tracking-[0.1em] uppercase text-carbon/70 hover:text-carbon transition-colors">
        {t('nav.history')}
      </a>
    </nav>

    <!-- CTA al fondo -->
    <div class="mt-auto">
      <a href={`/${lang}/#contacto`} @click="open = false"
        class="block w-full text-center font-sans text-[0.72rem] font-medium tracking-[0.1em] uppercase
               bg-burgundy text-white px-4 py-3 hover:bg-burgundy-light transition-colors">
        {t('nav.ctaContact')}
      </a>
    </div>
  </div>
</div>
```

Actualizar `Header.astro` para reemplazar el botón hamburguesa standalone por `<MobileMenu />`:

```astro
import MobileMenu from './MobileMenu.astro';
// Reemplazar el <button> de hamburguesa por:
<MobileMenu />
```

- [ ] **Step 6: `src/components/Footer.astro`**

```astro
---
import { getLangFromUrl, useTranslations } from '../i18n/index';
const lang = getLangFromUrl(Astro.url);
const t = useTranslations(lang);
---
<footer class="bg-[#0e0e0a] border-t border-burgundy/20">
  <div class="max-w-[1440px] mx-auto px-8 lg:px-20 pt-16 pb-8">
    <!-- 4 columnas -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12 pb-12 border-b border-white/5">
      <div>
        <div class="font-serif text-[1.15rem] tracking-[0.12em] uppercase text-white mb-4">
          Grupo <span class="text-burgundy">Saturno</span>
        </div>
        <p class="font-sans text-[0.72rem] font-light text-white/25 leading-relaxed">
          {t('footer.desc')}
        </p>
      </div>
      <div>
        <div class="font-sans text-[0.6rem] tracking-[0.2em] uppercase text-white/25 mb-5">
          {t('footer.navTitle')}
        </div>
        <a href={`/${lang}/#grupo`} class="block font-sans text-[0.75rem] font-light text-white/40 hover:text-white/70 transition-colors mb-3">
          {t('nav.group')}
        </a>
        <a href={`/${lang}/#trayectoria`} class="block font-sans text-[0.75rem] font-light text-white/40 hover:text-white/70 transition-colors mb-3">
          {t('nav.history')}
        </a>
        <a href={`/${lang}/#contacto`} class="block font-sans text-[0.75rem] font-light text-white/40 hover:text-white/70 transition-colors mb-3">
          {t('nav.contact')}
        </a>
      </div>
      <div>
        <div class="font-sans text-[0.6rem] tracking-[0.2em] uppercase text-white/25 mb-5">
          {t('footer.unitsTitle')}
        </div>
        <a href={`/${lang}/FrigorificoFlorida`} class="block font-sans text-[0.75rem] font-light text-white/40 hover:text-white/70 transition-colors mb-3">
          Frigorífico Florida
        </a>
        <a href={`/${lang}/FrigorificoSaturno`} class="block font-sans text-[0.75rem] font-light text-white/40 hover:text-white/70 transition-colors mb-3">
          Frigorífico Saturno
        </a>
      </div>
      <div>
        <div class="font-sans text-[0.6rem] tracking-[0.2em] uppercase text-white/25 mb-5">
          {t('footer.legalTitle')}
        </div>
        <a href={`/${lang}/legal`} class="block font-sans text-[0.75rem] font-light text-white/40 hover:text-white/70 transition-colors mb-3">
          {t('footer.legal')}
        </a>
        <a href={`/${lang}/privacidad`} class="block font-sans text-[0.75rem] font-light text-white/40 hover:text-white/70 transition-colors mb-3">
          {t('footer.privacy')}
        </a>
        <a href="#" class="block font-sans text-[0.75rem] font-light text-white/40 hover:text-white/70 transition-colors mb-3">
          Instagram
        </a>
        <a href="#" class="block font-sans text-[0.75rem] font-light text-white/40 hover:text-white/70 transition-colors mb-3">
          LinkedIn
        </a>
      </div>
    </div>
    <div class="flex justify-between items-center font-sans text-[0.65rem] text-white/20">
      <span>{t('footer.copyright')}</span>
      <span>GrupoSaturno.com.uy</span>
    </div>
  </div>
</footer>
```

- [ ] **Step 6: Crear página root con redirect**

`src/pages/index.astro`:

```astro
---
// Client-side redirect basado en navigator.language
// El sitio es estático — no hay server-side Accept-Language
---
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="robots" content="noindex" />
  <script>
    const lang = navigator.language?.toLowerCase() ?? 'es';
    if (lang.startsWith('zh')) {
      window.location.replace('/zh/');
    } else if (lang.startsWith('en')) {
      window.location.replace('/en/');
    } else {
      window.location.replace('/es/');
    }
  </script>
  <noscript>
    <meta http-equiv="refresh" content="0;url=/es/" />
  </noscript>
</head>
<body></body>
</html>
```

- [ ] **Step 7: Crear `src/pages/[lang]/index.astro` mínimo para verificar routing**

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import Header from '../../components/Header.astro';
import Footer from '../../components/Footer.astro';
import { getLangFromUrl, useTranslations, languages } from '../../i18n/index';
import type { Lang } from '../../i18n/index';

export function getStaticPaths() {
  return languages.map(lang => ({ params: { lang } }));
}

const lang = getLangFromUrl(Astro.url) as Lang;
const t = useTranslations(lang);
---
<BaseLayout title={t('meta.homeTitle')} description={t('meta.homeDesc')}>
  <Header />
  <main>
    <p style="padding: 2rem;">Landing en construcción — {lang}</p>
  </main>
  <Footer />
</BaseLayout>
```

- [ ] **Step 8: Verificar en dev server**

```bash
npm run dev
```

Navegar a `http://localhost:4321/es/`, `/en/`, `/zh/`. Expected: cada ruta carga con el texto correcto del locale.

- [ ] **Step 9: Commit**

```bash
git add src/
git commit -m "feat: UI atoms, Header, Footer, LanguageSelector, page routing"
```

---

## Task 5: Scraping de imágenes

**Files:**
- Create: `scripts/scrape-images.js`
- Create: `public/images/` (imágenes descargadas)
- Create: `ASSETS-TODO.md`

- [ ] **Step 1: Crear script de scraping**

`scripts/scrape-images.js`:

```javascript
import https from 'node:https';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { URL } from 'node:url';

const OUTPUT_DIR = 'public/images';
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

// URLs de imágenes identificadas en frigorificosaturno.com.uy
// Ejecutar primero: inspeccionar la página y completar esta lista
const IMAGES = [
  // { url: 'https://www.frigorificosaturno.com.uy/...', name: 'planta-exterior.jpg' },
  // Completar con las URLs reales encontradas al inspeccionar el sitio
];

async function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const dest = path.join(OUTPUT_DIR, filename);
    const file = fs.createWriteStream(dest);
    const protocol = url.startsWith('https') ? https : http;
    protocol.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close();
        fs.unlinkSync(dest);
        return downloadImage(res.headers.location, filename).then(resolve).catch(reject);
      }
      res.pipe(file);
      file.on('finish', () => { file.close(); console.log(`✓ ${filename}`); resolve(); });
    }).on('error', err => { fs.unlinkSync(dest); reject(err); });
  });
}

for (const img of IMAGES) {
  try { await downloadImage(img.url, img.name); }
  catch (e) { console.error(`✗ ${img.name}: ${e.message}`); }
}
console.log('Done. Revisar ASSETS-TODO.md para imágenes faltantes.');
```

- [ ] **Step 2: Inspeccionar `https://www.frigorificosaturno.com.uy/` y completar el array `IMAGES`**

Abrir el sitio en el browser, usar DevTools → Network → Images para identificar URLs de imágenes usables. Agregar al script con nombres semánticos:
- `planta-exterior.jpg`, `campo-ganado.jpg`, `linea-procesado.jpg`, `corte-producto.jpg`, `packaging-vacuum.jpg`, `carga-contenedor.jpg`, `equipo-trabajo.jpg`

- [ ] **Step 3: Ejecutar el script**

```bash
node scripts/scrape-images.js
```

Expected: imágenes descargadas en `public/images/`.

- [ ] **Step 4: Crear `ASSETS-TODO.md`**

```markdown
# Assets pendientes — Grupo Saturno

## Imágenes no encontradas o de calidad insuficiente

Estas imágenes deben ser provistas por el cliente para reemplazar los placeholders:

| Placeholder en código | Descripción ideal | Sección |
|----------------------|-------------------|---------|
| `campo-ganado-hero.jpg` | Foto de campo uruguayo, luz natural, horizonte amplio, ganado en segundo plano. Formato 16:9, mínimo 1920×1080. | Hero |
| `planta-procesado.jpg` | Interior de planta de procesado, personal con uniforme, luz industrial. Horizontal 16:9. | El Producto / Instalaciones |
| `corte-producto-hero.jpg` | Corte vacuno premium en primer plano, fondo neutro gris/beige, luz de estudio. Vertical 3:4. | El Producto / Galería |
| `packaging-vacuum.jpg` | Producto en packaging vacuum con etiqueta de trazabilidad visible. | El Producto / Ficha |
| `carga-contenedor.jpg` | Carga de contenedor refrigerado, logística de exportación. Horizontal. | El Producto / Instalaciones |
| `florida-exterior.jpg` | Exterior / fachada de Frigorífico Florida. | Sub-landing Florida |
| `saturno-exterior.jpg` | Exterior / fachada de Frigorífico Saturno. | Sub-landing Saturno |

## Notas
- Tratamiento requerido: documental, luz natural, sin filtros extremos
- NO usar stock photos genéricos de carne con perejil
- Mínimo 1200px de ancho, preferiblemente 2000px+
- Formatos aceptados: JPG (calidad 85+), WebP, PNG
```

- [ ] **Step 5: Commit**

```bash
git add scripts/ public/images/ ASSETS-TODO.md
git commit -m "feat: image scraping script and ASSETS-TODO"
```

---

## Task 6: Sección Hero

**Files:**
- Modify: `src/pages/[lang]/index.astro`
- Create: `src/components/sections/Hero.astro`

- [ ] **Step 1: Crear `src/components/sections/Hero.astro`**

```astro
---
import Button from '../ui/Button.astro';
import { getLangFromUrl, useTranslations } from '../../i18n/index';
import { Image } from 'astro:assets';

const lang = getLangFromUrl(Astro.url);
const t = useTranslations(lang);
---
<section class="relative h-[92vh] min-h-[600px] flex items-end overflow-hidden">
  <!-- PLACEHOLDER: foto cenital campo uruguayo, luz natural, ganado, 16:9 mínimo 1920x1080 -->
  <!-- Reemplazar con <Image> cuando el cliente provea la foto -->
  <div class="absolute inset-0 bg-gradient-to-br from-[#2a3520] via-[#1e2818] to-[#1A1A1A]"
    aria-hidden="true"></div>

  <!-- Overlay cinematográfico -->
  <div class="absolute inset-0 bg-gradient-to-t from-carbon/85 via-carbon/30 to-carbon/10"
    aria-hidden="true"></div>

  <!-- Contenido -->
  <div class="relative z-10 max-w-[1440px] mx-auto px-8 lg:px-20 pb-20 max-w-4xl">
    <p class="font-sans text-[0.65rem] tracking-[0.25em] uppercase text-white/50 mb-6 flex items-center gap-3">
      <span class="w-6 h-px bg-burgundy inline-block" aria-hidden="true"></span>
      {t('hero.kicker')}
    </p>

    <h1 class="font-serif text-[clamp(2.8rem,6vw,5.5rem)] font-light leading-[1.0] tracking-[-0.02em] text-white mb-6">
      {t('hero.h1').replace(t('hero.h1Italic'), '')}
      <em class="italic text-white/75">{t('hero.h1Italic')}</em>
    </h1>

    <p class="font-sans text-[0.9rem] font-light leading-[1.75] text-white/60 max-w-xl mb-10">
      {t('hero.lead')}
    </p>

    <div class="flex flex-wrap gap-4 items-center">
      <Button variant="primary" href={`#unidades`}>{t('hero.ctaPrimary')}</Button>
      <Button variant="ghost" href={`#contacto`}>{t('hero.ctaSecondary')}</Button>
    </div>
  </div>

  <!-- Scroll cue -->
  <div class="absolute bottom-8 right-12 font-sans text-[0.6rem] tracking-[0.15em] uppercase text-white/30 writing-mode-vertical"
    style="writing-mode: vertical-rl" aria-hidden="true">
    Scroll
  </div>
</section>
```

- [ ] **Step 2: Integrar Hero en `src/pages/[lang]/index.astro`**

```astro
import Hero from '../../components/sections/Hero.astro';
// ... dentro de <main>:
<Hero />
```

- [ ] **Step 3: Verificar en dev**

```bash
npm run dev
```

Navegar a `/es/`. Expected: Hero visible con texto correcto, gradiente oscuro, los dos botones.

- [ ] **Step 4: Commit**

```bash
git add src/
git commit -m "feat: Hero section with i18n and placeholder background"
```

---

## Task 7: Sección Díptico de Unidades

**Files:**
- Create: `src/components/sections/DipticoUnidades.astro`

- [ ] **Step 1: Crear `src/components/sections/DipticoUnidades.astro`**

```astro
---
import Button from '../ui/Button.astro';
import { getLangFromUrl, useTranslations } from '../../i18n/index';

const lang = getLangFromUrl(Astro.url);
const t = useTranslations(lang);
---
<section id="unidades" class="grid grid-cols-1 lg:grid-cols-2 min-h-[72vh]">

  <!-- Unidad 01: Frigorífico Florida -->
  <!-- PLACEHOLDER: foto planta Florida, tono azulado-industrial, 16:9 horizontal -->
  <a href={`/${lang}/FrigorificoFlorida`}
    class="group relative flex items-end overflow-hidden cursor-pointer"
    aria-label={`Conocer ${t('units.unit1Title')}`}>

    <div class="absolute inset-0 bg-gradient-to-br from-[#2a3a50] via-[#1a2535] to-[#101820]
                transition-transform duration-700 ease-out group-hover:scale-[1.03]"
      aria-hidden="true"></div>
    <div class="absolute inset-0 bg-gradient-to-t from-carbon/92 via-carbon/50 to-carbon/15
                transition-opacity duration-400 group-hover:opacity-85"
      aria-hidden="true"></div>

    <!-- Separador vertical -->
    <div class="absolute top-[10%] right-0 bottom-[10%] w-px
                bg-gradient-to-b from-transparent via-cream/15 to-transparent hidden lg:block"
      aria-hidden="true"></div>

    <div class="relative z-10 p-14 w-full
                transition-all duration-400 ease-out
                lg:group-hover:scale-[1.01]">
      <p class="font-sans text-[0.6rem] tracking-[0.25em] uppercase text-burgundy mb-5 flex items-center gap-3">
        <span class="w-5 h-px bg-burgundy inline-block" aria-hidden="true"></span>
        {t('units.unit1Number')}
      </p>
      <h2 class="font-serif text-[clamp(2rem,3.5vw,3.2rem)] font-light leading-[1.0] tracking-[-0.02em] text-white mb-4">
        {t('units.unit1Title')}
      </h2>
      <p class="font-sans text-[0.78rem] font-light text-white/55 leading-[1.7] max-w-sm mb-8">
        {t('units.unit1Desc')}
      </p>
      <span class="inline-flex items-center gap-3 font-sans text-[0.68rem] tracking-[0.12em] uppercase
                   text-white/70 border border-white/20 px-5 py-2.5
                   transition-all duration-250 ease-out
                   group-hover:text-white group-hover:border-white/50 group-hover:bg-burgundy/30">
        {t('units.unit1Cta')}
        <span class="transition-transform duration-250 group-hover:translate-x-1" aria-hidden="true">→</span>
      </span>
    </div>
  </a>

  <!-- Unidad 02: Frigorífico Saturno -->
  <!-- PLACEHOLDER: foto planta Saturno, tono cálido-tierra, del sitio frigorificosaturno.com.uy -->
  <a href={`/${lang}/FrigorificoSaturno`}
    class="group relative flex items-end overflow-hidden cursor-pointer"
    aria-label={`Conocer ${t('units.unit2Title')}`}>

    <div class="absolute inset-0 bg-gradient-to-br from-[#4a3020] via-[#301f12] to-[#1e130a]
                transition-transform duration-700 ease-out group-hover:scale-[1.03]"
      aria-hidden="true"></div>
    <div class="absolute inset-0 bg-gradient-to-t from-carbon/92 via-carbon/50 to-carbon/15
                transition-opacity duration-400 group-hover:opacity-85"
      aria-hidden="true"></div>

    <div class="relative z-10 p-14 w-full
                transition-all duration-400 ease-out
                lg:group-hover:scale-[1.01]">
      <p class="font-sans text-[0.6rem] tracking-[0.25em] uppercase text-burgundy mb-5 flex items-center gap-3">
        <span class="w-5 h-px bg-burgundy inline-block" aria-hidden="true"></span>
        {t('units.unit2Number')}
      </p>
      <h2 class="font-serif text-[clamp(2rem,3.5vw,3.2rem)] font-light leading-[1.0] tracking-[-0.02em] text-white mb-4">
        {t('units.unit2Title')}
      </h2>
      <p class="font-sans text-[0.78rem] font-light text-white/55 leading-[1.7] max-w-sm mb-8">
        {t('units.unit2Desc')}
      </p>
      <span class="inline-flex items-center gap-3 font-sans text-[0.68rem] tracking-[0.12em] uppercase
                   text-white/70 border border-white/20 px-5 py-2.5
                   transition-all duration-250 ease-out
                   group-hover:text-white group-hover:border-white/50 group-hover:bg-burgundy/30">
        {t('units.unit2Cta')}
        <span class="transition-transform duration-250 group-hover:translate-x-1" aria-hidden="true">→</span>
      </span>
    </div>
  </a>

</section>
```

- [ ] **Step 2: Integrar en `index.astro`**

```astro
import DipticoUnidades from '../../components/sections/DipticoUnidades.astro';
// después de <Hero />:
<DipticoUnidades />
```

- [ ] **Step 3: Verificar hover en desktop**

En `localhost:4321/es/`, hacer hover sobre cada columna. Expected: scale sutil, bordes del botón brighten, flecha se desplaza.

- [ ] **Step 4: Commit**

```bash
git add src/
git commit -m "feat: DipticoUnidades section with hover interactions and i18n"
```

---

## Task 8: Secciones de contenido (Quiénes, MVV, Producto, Cadena, Por qué)

**Files:**
- Create: `src/components/sections/QuienesSomos.astro`
- Create: `src/components/sections/MisionVisionValores.astro`
- Create: `src/components/sections/ElProducto.astro`
- Create: `src/components/sections/CadenaValor.astro`
- Create: `src/components/sections/PorQueSaturno.astro`

- [ ] **Step 1: `QuienesSomos.astro`**

```astro
---
import SectionLabel from '../ui/SectionLabel.astro';
import { getLangFromUrl, useTranslations } from '../../i18n/index';
const lang = getLangFromUrl(Astro.url);
const t = useTranslations(lang);
---
<section id="grupo" class="bg-cream py-28 px-8 lg:px-20">
  <div class="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-20 items-start">
    <div class="scroll-reveal">
      <SectionLabel class="mb-6">{t('about.label')}</SectionLabel>
      <h2 class="font-serif text-[clamp(2.2rem,3.5vw,3.2rem)] font-light leading-[1.05] tracking-[-0.025em] text-carbon">
        {t('about.h2').replace(t('about.h2Italic'), '')}
        <em class="italic">{t('about.h2Italic')}</em>
      </h2>
    </div>
    <div class="scroll-reveal" style="transition-delay: 100ms">
      <p class="font-sans text-[0.88rem] font-light text-[#444] leading-[1.85] mb-12">
        {t('about.body')}
      </p>
      <!-- Stats -->
      <div class="grid grid-cols-3 gap-8 border-t border-burgundy/15 pt-8">
        {[1,2,3].map(n => (
          <div>
            <div class="font-serif text-[3rem] font-light leading-none text-burgundy tracking-[-0.03em] mb-1">
              {t(`about.stat${n}Number`)}
            </div>
            <div class="font-sans text-[0.65rem] tracking-[0.1em] uppercase text-warm-gray">
              {t(`about.stat${n}Unit`)}
            </div>
            <div class="font-sans text-[0.72rem] text-[#666] mt-1">
              {t(`about.stat${n}Desc`)}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 2: `MisionVisionValores.astro`**

```astro
---
import SectionLabel from '../ui/SectionLabel.astro';
import { getLangFromUrl, useTranslations } from '../../i18n/index';
const lang = getLangFromUrl(Astro.url);
const t = useTranslations(lang);
const valores = JSON.parse(t('mvv.valores'));
---
<section class="bg-carbon py-28 px-8 lg:px-20">
  <div class="max-w-[1440px] mx-auto">
    <!-- Top: MVV en 3 columnas -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-16 pb-20 mb-20 border-b border-white/8">
      <div class="scroll-reveal">
        <SectionLabel class="mb-6">{t('mvv.label')}</SectionLabel>
        <h2 class="font-serif text-[clamp(2.2rem,3vw,3.2rem)] font-light leading-[1.05] tracking-[-0.025em] text-white">
          {t('mvv.h2').replace(t('mvv.h2Italic'), '')}
          <em class="italic text-white/55">{t('mvv.h2Italic')}</em>
        </h2>
      </div>
      <div class="scroll-reveal" style="transition-delay: 100ms">
        <p class="font-sans text-[0.6rem] tracking-[0.2em] uppercase text-burgundy mb-4">{t('mvv.misionLabel')}</p>
        <p class="font-serif text-[1.2rem] font-light italic leading-[1.55] text-white/75">
          "{t('mvv.mision')}"
        </p>
      </div>
      <div class="scroll-reveal" style="transition-delay: 200ms">
        <p class="font-sans text-[0.6rem] tracking-[0.2em] uppercase text-burgundy mb-4">{t('mvv.visionLabel')}</p>
        <p class="font-serif text-[1.2rem] font-light italic leading-[1.55] text-white/75">
          "{t('mvv.vision')}"
        </p>
      </div>
    </div>
    <!-- Valores grid horizontal -->
    <div class="grid grid-cols-2 lg:grid-cols-6 gap-0 scroll-reveal">
      {valores.map((v: {word: string, desc: string}, i: number) => (
        <div class={`px-6 py-8 ${i < valores.length - 1 ? 'lg:border-r border-white/6' : ''}`}>
          <span class="font-serif text-[1.5rem] font-light text-white tracking-[-0.01em] block mb-3">
            {v.word}
          </span>
          <p class="font-sans text-[0.68rem] font-light text-white/35 leading-[1.6]">
            {v.desc}
          </p>
        </div>
      ))}
    </div>
  </div>
</section>
```

> **Nota técnica:** `t('mvv.valores')` retorna un string del array JSON. Se hace `JSON.parse()` para iterarlo. Si `useTranslations` no maneja arrays nativamente, agregar lógica en `index.ts` para retornar el valor crudo cuando es array.

- [ ] **Step 3: `ElProducto.astro`**

```astro
---
import SectionLabel from '../ui/SectionLabel.astro';
import { getLangFromUrl, useTranslations } from '../../i18n/index';
const lang = getLangFromUrl(Astro.url);
const t = useTranslations(lang);
---
<section class="bg-cream py-28 px-8 lg:px-20">
  <div class="max-w-[1440px] mx-auto">
    <!-- Header -->
    <div class="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 scroll-reveal">
      <div>
        <SectionLabel class="mb-4">{t('product.label')}</SectionLabel>
        <h2 class="font-serif text-[clamp(2rem,2.8vw,2.8rem)] font-light tracking-[-0.025em] text-carbon leading-[1.05]">
          {t('product.h2').replace(t('product.h2Italic'), '')}
          <em class="italic">{t('product.h2Italic')}</em>
        </h2>
      </div>
      <p class="font-sans text-[0.78rem] font-light text-warm-gray leading-[1.7] max-w-sm lg:text-right mt-4 lg:mt-0">
        {t('product.subtitle')}
      </p>
    </div>

    <!-- Galería editorial -->
    <div class="grid gap-1 mb-16 scroll-reveal"
      style="grid-template-columns: 1.4fr 1fr 1fr; grid-template-rows: 280px 200px">
      <!-- Foto principal vertical -->
      <div class="row-span-2 relative overflow-hidden group">
        <!-- PLACEHOLDER: corte vacuno premium, luz de estudio, fondo neutro, vertical -->
        <div class="absolute inset-0 bg-gradient-to-br from-[#5a3a2a] via-[#3a2518] to-[#241810]
                    transition-transform duration-700 group-hover:scale-[1.04]"></div>
        <div class="absolute bottom-0 left-0 right-0 px-5 py-4
                    bg-gradient-to-t from-carbon/70 to-transparent">
          <span class="font-sans text-[0.6rem] tracking-[0.15em] uppercase text-white/50">
            Producto final · Cortes premium
          </span>
        </div>
      </div>
      {[
        { bg: 'from-[#3a3530] to-[#181510]', cap: 'Instalaciones · Procesamiento' },
        { bg: 'from-[#3d5a30] to-[#1a2a10]', cap: 'Origen · Campo propio' },
        { bg: 'from-[#2a3a4a] to-[#101820]', cap: 'Presentación · Vacuum / Boxed beef' },
        { bg: 'from-[#3a3020] to-[#181508]', cap: 'Logística · Exportación' },
      ].map(({ bg, cap }) => (
        <div class="relative overflow-hidden group">
          <div class={`absolute inset-0 bg-gradient-to-br ${bg}
                      transition-transform duration-700 group-hover:scale-[1.04]`}></div>
          <div class="absolute bottom-0 left-0 right-0 px-4 py-3
                      bg-gradient-to-t from-carbon/70 to-transparent">
            <span class="font-sans text-[0.6rem] tracking-[0.15em] uppercase text-white/50">{cap}</span>
          </div>
        </div>
      ))}
    </div>

    <!-- Ficha técnica -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-px bg-burgundy/10 scroll-reveal">
      {[1,2,3].map(n => (
        <div class="bg-cream p-9">
          <p class="font-sans text-[0.58rem] tracking-[0.2em] uppercase text-burgundy mb-3">
            {t(`product.spec${n}Cat`)}
          </p>
          <h3 class="font-serif text-[1rem] font-medium text-carbon mb-2">
            {t(`product.spec${n}Title`)}
          </h3>
          <p class="font-sans text-[0.72rem] font-light text-[#666] leading-[1.7]">
            {t(`product.spec${n}Text`)}
          </p>
          <span class="inline-block mt-3 bg-burgundy/8 text-burgundy font-sans text-[0.6rem] px-2 py-1">
            {t(`product.spec${n}Pending`)}
          </span>
        </div>
      ))}
    </div>
  </div>
</section>
```

- [ ] **Step 4: `CadenaValor.astro`**

```astro
---
import SectionLabel from '../ui/SectionLabel.astro';
import { getLangFromUrl, useTranslations } from '../../i18n/index';
const lang = getLangFromUrl(Astro.url);
const t = useTranslations(lang);
const steps = JSON.parse(t('chain.steps'));
---
<section id="trayectoria" class="bg-cream py-28 px-8 lg:px-20">
  <div class="max-w-[1440px] mx-auto">
    <SectionLabel class="mb-4 scroll-reveal">{t('chain.label')}</SectionLabel>
    <h2 class="font-serif text-[clamp(2rem,2.8vw,2.8rem)] font-light tracking-[-0.025em] text-carbon mb-16 scroll-reveal">
      {t('chain.h2').replace(t('chain.h2Italic'), '')}
      <em class="italic">{t('chain.h2Italic')}</em>
    </h2>
    <div class="relative grid grid-cols-2 lg:grid-cols-6 gap-8 scroll-reveal">
      <!-- Línea conectiva desktop -->
      <div class="absolute top-[22px] left-[8%] right-[8%] h-px
                  bg-gradient-to-r from-transparent via-burgundy/25 to-transparent
                  hidden lg:block" aria-hidden="true"></div>
      {steps.map((s: {n: string, title: string, desc: string}) => (
        <div class="flex flex-col items-center text-center relative z-10">
          <div class="w-11 h-11 rounded-full border border-burgundy/30 bg-cream flex items-center justify-center mb-5">
            <span class="font-serif text-[0.9rem] text-burgundy">{s.n}</span>
          </div>
          <h3 class="font-serif text-[0.95rem] font-medium text-carbon mb-2 leading-[1.2]">
            {s.title}
          </h3>
          <p class="font-sans text-[0.65rem] font-light text-warm-gray leading-[1.5]">
            {s.desc}
          </p>
        </div>
      ))}
    </div>
  </div>
</section>
```

- [ ] **Step 5: `PorQueSaturno.astro`**

```astro
---
import SectionLabel from '../ui/SectionLabel.astro';
import { getLangFromUrl, useTranslations } from '../../i18n/index';
const lang = getLangFromUrl(Astro.url);
const t = useTranslations(lang);
const items = JSON.parse(t('why.items'));
---
<section class="bg-off-white py-28 px-8 lg:px-20">
  <div class="max-w-[1440px] mx-auto">
    <SectionLabel class="mb-4 scroll-reveal">{t('why.label')}</SectionLabel>
    <h2 class="font-serif text-[clamp(2rem,2.8vw,2.8rem)] font-light tracking-[-0.025em] text-carbon mb-14 scroll-reveal">
      {t('why.h2')}
    </h2>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-px bg-burgundy/10">
      {items.map((item: {n: string, title: string, text: string}, i: number) => (
        <div class="bg-off-white p-10 scroll-reveal" style={`transition-delay: ${i * 80}ms`}>
          <div class="font-serif text-[2.5rem] font-light text-burgundy/15 leading-none mb-5 tracking-[-0.05em]">
            {item.n}
          </div>
          <h3 class="font-serif text-[1.3rem] font-medium text-carbon mb-3 leading-[1.2]">
            {item.title}
          </h3>
          <p class="font-sans text-[0.78rem] font-light text-[#555] leading-[1.75]">
            {item.text}
          </p>
        </div>
      ))}
    </div>
  </div>
</section>
```

- [ ] **Step 6: Crear `ContactoComercial.astro`**

```astro
---
import SectionLabel from '../ui/SectionLabel.astro';
import { getLangFromUrl, useTranslations } from '../../i18n/index';
const lang = getLangFromUrl(Astro.url);
const t = useTranslations(lang);
---
<section id="contacto" class="bg-[#141410] py-28 px-8 lg:px-20">
  <div class="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
    <!-- Columna izquierda: copy -->
    <div class="scroll-reveal">
      <SectionLabel class="mb-6">{t('contact.label')}</SectionLabel>
      <h2 class="font-serif text-[clamp(2rem,2.8vw,3rem)] font-light leading-[1.05] tracking-[-0.025em] text-white mb-6">
        {t('contact.h2').replace(t('contact.h2Italic'), '')}
        <em class="italic text-white/55">{t('contact.h2Italic')}</em>
      </h2>
      <p class="font-sans text-[0.82rem] font-light text-white/45 leading-[1.8] mb-10">
        {t('contact.lead')}
      </p>
      <div class="font-sans text-[0.72rem] text-white/30 leading-loose">
        <p><strong class="text-white/50">{t('contact.locationLabel')}</strong><br />{t('contact.location')}</p>
        <p class="mt-3"><strong class="text-white/50">{t('contact.emailLabel')}</strong><br />{t('contact.email')}</p>
        <p class="mt-3"><strong class="text-white/50">{t('contact.linkedinLabel')}</strong><br />{t('contact.linkedin')}</p>
      </div>
    </div>

    <!-- Columna derecha: formulario -->
    <form
      x-data="{ submitted: false }"
      @submit.prevent="submitted = true; $el.submit()"
      action="https://formspree.io/f/PLACEHOLDER"
      method="POST"
      class="scroll-reveal" style="transition-delay: 100ms"
    >
      <div class="grid grid-cols-2 gap-px bg-white/6 mb-px">
        {['Name', 'Company', 'Country', 'Email'].map((field) => (
          <div class="bg-white/3 px-5 py-4">
            <label class="font-sans text-[0.6rem] tracking-[0.15em] uppercase text-white/25 block mb-2">
              {t(`contact.field${field}`)}
            </label>
            <input
              type={field === 'Email' ? 'email' : 'text'}
              name={field.toLowerCase()}
              required
              placeholder={t(`contact.field${field}Placeholder`)}
              class="font-sans text-[0.8rem] font-light text-white/50 bg-transparent border-none outline-none w-full border-b border-white/8 pb-1 placeholder:text-white/20"
            />
          </div>
        ))}
      </div>
      <div class="bg-white/3 px-5 py-4 mb-px">
        <label class="font-sans text-[0.6rem] tracking-[0.15em] uppercase text-white/25 block mb-2">
          {t('contact.fieldMessage')}
        </label>
        <textarea
          name="message"
          rows="4"
          required
          placeholder={t('contact.fieldMessagePlaceholder')}
          class="font-sans text-[0.8rem] font-light text-white/50 bg-transparent border-none outline-none w-full border-b border-white/8 pb-1 placeholder:text-white/20 resize-none"
        ></textarea>
      </div>
      <button
        type="submit"
        class="w-full bg-burgundy text-white font-sans text-[0.72rem] font-medium tracking-[0.12em] uppercase py-4 mt-4 hover:bg-burgundy-light transition-colors duration-200"
      >
        {t('contact.submit')}
      </button>
    </form>
  </div>
</section>
```

- [ ] **Step 7: Ensamblar todas las secciones en `index.astro`**

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import Header from '../../components/Header.astro';
import Footer from '../../components/Footer.astro';
import Hero from '../../components/sections/Hero.astro';
import DipticoUnidades from '../../components/sections/DipticoUnidades.astro';
import QuienesSomos from '../../components/sections/QuienesSomos.astro';
import MisionVisionValores from '../../components/sections/MisionVisionValores.astro';
import ElProducto from '../../components/sections/ElProducto.astro';
import CadenaValor from '../../components/sections/CadenaValor.astro';
import PorQueSaturno from '../../components/sections/PorQueSaturno.astro';
import ContactoComercial from '../../components/sections/ContactoComercial.astro';
import { getLangFromUrl, useTranslations, languages } from '../../i18n/index';
import type { Lang } from '../../i18n/index';

export function getStaticPaths() {
  return languages.map(lang => ({ params: { lang } }));
}

const lang = getLangFromUrl(Astro.url) as Lang;
const t = useTranslations(lang);
---
<BaseLayout title={t('meta.homeTitle')} description={t('meta.homeDesc')}>
  <Header />
  <main>
    <Hero />
    <DipticoUnidades />
    <QuienesSomos />
    <MisionVisionValores />
    <ElProducto />
    <CadenaValor />
    <PorQueSaturno />
    <ContactoComercial />
  </main>
  <Footer />
</BaseLayout>
```

- [ ] **Step 8: Verificar todas las secciones en dev**

```bash
npm run dev
```

Navegar a `/es/`, `/en/`, `/zh/`. Verificar que cada sección renderiza con los textos correctos de su locale.

- [ ] **Step 9: Commit**

```bash
git add src/
git commit -m "feat: all home sections — QuienesSomos, MVV, Producto, Cadena, PorQue, Contacto"
```

---

## Task 9: Sub-landings Florida y Saturno

**Files:**
- Create: `src/pages/[lang]/FrigorificoFlorida.astro`
- Create: `src/pages/[lang]/FrigorificoSaturno.astro`

- [ ] **Step 1: `src/pages/[lang]/FrigorificoFlorida.astro`**

```astro
---
import SubLandingLayout from '../../layouts/SubLandingLayout.astro';
import SectionLabel from '../../components/ui/SectionLabel.astro';
import ContactoComercial from '../../components/sections/ContactoComercial.astro';
import { getLangFromUrl, useTranslations, languages } from '../../i18n/index';

export function getStaticPaths() {
  return languages.map(lang => ({ params: { lang } }));
}

const lang = getLangFromUrl(Astro.url);
const t = useTranslations(lang);
---
<SubLandingLayout
  title={t('meta.floridaTitle')}
  description={t('meta.floridaDesc')}
  unitName="Frigorífico Florida"
>
  <!-- Hero de sub-landing — tono azulado-industrial -->
  <!-- PLACEHOLDER: foto exterior Frigorífico Florida -->
  <section class="relative h-[70vh] min-h-[500px] flex items-end overflow-hidden">
    <div class="absolute inset-0 bg-gradient-to-br from-[#2a3a50] via-[#1a2535] to-[#101820]"></div>
    <div class="absolute inset-0 bg-gradient-to-t from-carbon/90 via-carbon/40 to-carbon/10"></div>
    <div class="relative z-10 max-w-[1440px] mx-auto px-8 lg:px-20 pb-16 w-full">
      <p class="font-sans text-[0.6rem] tracking-[0.22em] uppercase text-burgundy mb-4 flex items-center gap-3">
        <span class="w-5 h-px bg-burgundy inline-block"></span>
        Unidad 01 · Grupo Saturno
      </p>
      <h1 class="font-serif text-[clamp(2.5rem,5vw,4.5rem)] font-light leading-[1.0] tracking-[-0.02em] text-white">
        Frigorífico Florida
      </h1>
    </div>
  </section>

  <!-- Capacidades -->
  <section class="bg-off-white py-24 px-8 lg:px-20">
    <div class="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
      <div>
        <SectionLabel class="mb-4">Presentación</SectionLabel>
        <h2 class="font-serif text-[clamp(1.8rem,2.5vw,2.5rem)] font-light tracking-[-0.025em] text-carbon mb-6">
          Especialización y capacidad de escala
        </h2>
        <p class="font-sans text-[0.85rem] font-light text-[#555] leading-[1.8]">
          {/* [CONTENIDO A DEFINIR CON CLIENTE] */}
          Procesamiento especializado con foco en [definir con cliente — exportación / mercado interno premium / etc.].
        </p>
        <p class="mt-4 inline-block bg-burgundy/8 text-burgundy font-sans text-[0.62rem] px-3 py-1.5">
          [ CONTENIDO A DEFINIR CON CLIENTE ]
        </p>
      </div>
      <!-- PLACEHOLDER: galería de instalaciones Florida (3 fotos) -->
      <div class="grid grid-cols-3 gap-2">
        {[1,2,3].map(_ => (
          <div class="h-40 bg-gradient-to-br from-[#2a3a50] to-[#101820] rounded-sm"></div>
        ))}
      </div>
    </div>
  </section>

  <ContactoComercial />
</SubLandingLayout>
```

- [ ] **Step 2: `src/pages/[lang]/FrigorificoSaturno.astro`** (misma estructura, tono cálido-tierra)

```astro
---
import SubLandingLayout from '../../layouts/SubLandingLayout.astro';
import SectionLabel from '../../components/ui/SectionLabel.astro';
import ContactoComercial from '../../components/sections/ContactoComercial.astro';
import { getLangFromUrl, useTranslations, languages } from '../../i18n/index';

export function getStaticPaths() {
  return languages.map(lang => ({ params: { lang } }));
}

const lang = getLangFromUrl(Astro.url);
const t = useTranslations(lang);
---
<SubLandingLayout
  title={t('meta.saturnoTitle')}
  description={t('meta.saturnoDesc')}
  unitName="Frigorífico Saturno"
>
  <!-- Hero — tono cálido-tierra -->
  <!-- PLACEHOLDER: foto exterior Frigorífico Saturno (del sitio frigorificosaturno.com.uy) -->
  <section class="relative h-[70vh] min-h-[500px] flex items-end overflow-hidden">
    <div class="absolute inset-0 bg-gradient-to-br from-[#4a3020] via-[#301f12] to-[#1e130a]"></div>
    <div class="absolute inset-0 bg-gradient-to-t from-carbon/90 via-carbon/40 to-carbon/10"></div>
    <div class="relative z-10 max-w-[1440px] mx-auto px-8 lg:px-20 pb-16 w-full">
      <p class="font-sans text-[0.6rem] tracking-[0.22em] uppercase text-burgundy mb-4 flex items-center gap-3">
        <span class="w-5 h-px bg-burgundy inline-block"></span>
        Unidad 02 · Grupo Saturno
      </p>
      <h1 class="font-serif text-[clamp(2.5rem,5vw,4.5rem)] font-light leading-[1.0] tracking-[-0.02em] text-white">
        Frigorífico Saturno
      </h1>
    </div>
  </section>

  <!-- Capacidades -->
  <section class="bg-off-white py-24 px-8 lg:px-20">
    <div class="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
      <div>
        <SectionLabel class="mb-4">Presentación</SectionLabel>
        <h2 class="font-serif text-[clamp(1.8rem,2.5vw,2.5rem)] font-light tracking-[-0.025em] text-carbon mb-6">
          Núcleo productivo del grupo
        </h2>
        <p class="font-sans text-[0.85rem] font-light text-[#555] leading-[1.8]">
          Producción y procesamiento integrados con trazabilidad desde el origen.
          80% de la facturación del grupo.
        </p>
      </div>
      <!-- PLACEHOLDER: galería instalaciones Saturno (del sitio actual, 3 fotos) -->
      <div class="grid grid-cols-3 gap-2">
        {[1,2,3].map(_ => (
          <div class="h-40 bg-gradient-to-br from-[#4a3020] to-[#1e130a] rounded-sm"></div>
        ))}
      </div>
    </div>
  </section>

  <ContactoComercial />
</SubLandingLayout>
```

- [ ] **Step 3: Verificar sub-landings**

```bash
npm run dev
```

Navegar a `/es/FrigorificoFlorida`, `/en/FrigorificoFlorida`, `/zh/FrigorificoSaturno`. Expected: breadcrumb visible, hero correcto para cada unidad, ContactoComercial al final.

- [ ] **Step 4: Commit**

```bash
git add src/pages/
git commit -m "feat: FrigorificoFlorida and FrigorificoSaturno sub-landings"
```

---

## Task 10: Documentación y archivos de entrega

**Files:**
- Create: `README.md`
- Create: `CONTENT-TODO.md`
- Create: `docs/design-system.md`
- Create: `public/robots.txt`
- Create: `public/favicon.svg`

- [ ] **Step 1: Crear `README.md`**

```markdown
# Grupo Saturno — Landing Page

Landing page institucional trilingüe para [GrupoSaturno.com.uy](https://gruposaturno.com.uy).

## Stack

- **Framework:** Astro 4 (output estático)
- **Estilos:** Tailwind CSS
- **Interactividad:** Alpine.js
- **i18n:** Astro i18n nativo — rutas `/es/`, `/en/`, `/zh/`

## Correr en local

```bash
npm install
npm run dev       # → http://localhost:4321
npm run build     # build de producción
npm run preview   # preview del build
```

## Estructura de carpetas

```
src/
  components/     # Componentes reutilizables
  layouts/        # BaseLayout y SubLandingLayout
  pages/          # Rutas — [lang]/index.astro, [lang]/FrigorificoXxx.astro
  i18n/           # Diccionarios ES/EN/ZH + helper functions
  styles/         # global.css (design tokens, scroll-reveal)
public/
  images/         # Imágenes del sitio
```

## Editar textos

Todos los textos están en `src/i18n/es.json`, `en.json`, `zh.json`.
No hay texto hardcodeado en los componentes.

⚠️ El archivo `zh.json` requiere revisión por hablante nativo antes del lanzamiento.

## Editar imágenes

Reemplazar los archivos en `public/images/` con los que provea el cliente.
Ver `ASSETS-TODO.md` para la lista de imágenes pendientes.

## Pendientes antes del lanzamiento

Ver `CONTENT-TODO.md` para textos a confirmar con el cliente.
Ver `ASSETS-TODO.md` para imágenes a proveer.

## Deploy

Compatible con Vercel, Netlify y Cloudflare Pages.
Output: carpeta `dist/` con HTML estático puro.
```

- [ ] **Step 2: Crear `CONTENT-TODO.md`**

```markdown
# Contenido pendiente de confirmación — Grupo Saturno

Todos estos items están marcados `[A CONFIRMAR CON CLIENTE]` en el código.
**No publicar sin confirmar estos datos.**

## Frigorífico Florida
- [ ] Descripción de la unidad y su diferenciador principal
- [ ] Capacidad de procesamiento (ton/semana o ton/año)
- [ ] Mercados de exportación específicos de esta unidad
- [ ] Certificaciones vigentes de esta planta
- [ ] Contacto directo de la unidad (email, teléfono)

## Frigorífico Saturno
- [ ] Capacidad de procesamiento confirmada
- [ ] Certificaciones vigentes: HACCP, Halal, Kosher, UE, China GACC — confirmar cuáles aplican
- [ ] Contacto directo de la unidad

## Grupo (sección Quiénes somos)
- [ ] Número de campos propios
- [ ] Cantidad de mercados de exportación actuales
- [ ] Toneladas procesadas por semana (o el indicador que prefieran mostrar)
- [ ] Número de empleados (si se quiere mostrar)

## Formulario de contacto
- [ ] **Configurar endpoint Formspree** — reemplazar `https://formspree.io/f/PLACEHOLDER` en `src/components/sections/ContactoComercial.astro` con el endpoint real creado en formspree.io

## Datos de contacto
- [ ] Email comercial del grupo
- [ ] Teléfono (si se quiere publicar)
- [ ] URL correcta del LinkedIn del grupo
- [ ] Cuentas de Instagram y Facebook

## SEO
- [ ] Descripción meta de Frigorífico Florida (en los 3 idiomas)
- [ ] Open Graph image para cada página

## Chino (ZH)
- [ ] **REVISIÓN NATIVA OBLIGATORIA** de todo el archivo `src/i18n/zh.json`
  - Requiere hablante nativo con experiencia en comercio exterior agroindustrial
  - No publicar en zh hasta completar esta revisión
```

- [ ] **Step 3: `docs/design-system.md`**

```markdown
# Design System — Grupo Saturno

## Colores

| Token | Valor | Uso |
|-------|-------|-----|
| `burgundy` | `#6B2E2A` | Acento primario — CTAs, kickers, stats |
| `burgundy-light` | `#8A3D38` | Hover states |
| `cream` | `#F5F1EA` | Fondo secciones claras |
| `off-white` | `#FAF8F4` | Variante más clara |
| `carbon` | `#1A1A1A` | Texto principal, fondos oscuros |
| `warm-gray` | `#9E9188` | Texto secundario, kickers |
| `dark-bg` | `#141410` | Fondo contacto y footer |

## Tipografía

- **Cormorant Garamond** (serif) — display, H1, H2, stats grandes, valores, italic editorial
- **Inter** (sans) — body, labels, nav, botones, UI en general
- **Noto Serif SC + Noto Sans SC** — solo locale zh, cargado condicionalmente

### Escala
- H1: `clamp(2.8rem, 6vw, 5.5rem)` weight 300
- H2: `clamp(2rem, 2.8vw, 3.2rem)` weight 300
- Body: `0.875–0.9rem` weight 300, `leading-[1.75]`
- Label/kicker: `0.6rem` weight 400, `tracking-[0.22em]` uppercase

## Espaciado
Base 4px. Secciones: `py-28` (7rem). Container: `max-w-[1440px]`, padding `px-8 lg:px-20`.

## Botones
- **Primary**: bg-burgundy, text-white, hover bg-burgundy-light
- **Ghost dark**: border-burgundy, text-burgundy, hover bg-burgundy text-white
- **Ghost light**: border-white/30, text-white/70, hover border-white/60 text-white

## Animaciones
- Duración: 200–400ms, easing: `ease-out`
- Scroll reveal: clase `.scroll-reveal` + IntersectionObserver en BaseLayout
- Hover díptico: `scale-[1.03]` en columna activa, `opacity-75` en la otra
- `prefers-reduced-motion`: todas las animaciones off

## Accesibilidad
- Focus visible: `outline-2 outline-burgundy outline-offset-2`
- Contraste mínimo: 4.5:1 texto normal, 3:1 texto grande (WCAG 2.1 AA)
```

- [ ] **Step 4: `public/robots.txt`**

```
User-agent: *
Allow: /

Sitemap: https://gruposaturno.com.uy/sitemap-index.xml
```

- [ ] **Step 5: `public/favicon.svg`** (placeholder tipográfico)

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" fill="#6B2E2A"/>
  <text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle"
    font-family="Georgia, serif" font-size="18" font-weight="300" fill="white">S</text>
</svg>
```

- [ ] **Step 6: Commit**

```bash
git add README.md CONTENT-TODO.md docs/design-system.md public/robots.txt public/favicon.svg
git commit -m "docs: README, CONTENT-TODO, design-system, robots.txt, favicon placeholder"
```

---

## Task 11: Build de producción + smoke tests + QA

**Files:**
- Create: `tests/smoke.spec.ts`
- Create: `playwright.config.ts`

- [ ] **Step 1: Configurar Playwright**

`playwright.config.ts`:

```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  use: {
    baseURL: 'http://localhost:4321',
  },
  webServer: {
    command: 'npm run preview',
    url: 'http://localhost:4321',
    reuseExistingServer: !process.env.CI,
  },
});
```

- [ ] **Step 2: `tests/smoke.spec.ts`**

```typescript
import { test, expect } from '@playwright/test';

const routes = [
  '/es/',
  '/en/',
  '/zh/',
  '/es/FrigorificoFlorida',
  '/en/FrigorificoFlorida',
  '/zh/FrigorificoFlorida',
  '/es/FrigorificoSaturno',
  '/en/FrigorificoSaturno',
  '/zh/FrigorificoSaturno',
];

for (const route of routes) {
  test(`${route} — carga sin errores 404`, async ({ page }) => {
    const response = await page.goto(route);
    expect(response?.status()).toBeLessThan(400);
  });
}

test('/es/ — tiene H1 con "26 años"', async ({ page }) => {
  await page.goto('/es/');
  const h1 = page.locator('h1').first();
  await expect(h1).toContainText('26 años');
});

test('/en/ — tiene H1 con "26 years"', async ({ page }) => {
  await page.goto('/en/');
  const h1 = page.locator('h1').first();
  await expect(h1).toContainText('26 years');
});

test('/es/ — selector de idioma visible', async ({ page }) => {
  await page.goto('/es/');
  const langSelector = page.locator('[hreflang]').first();
  await expect(langSelector).toBeVisible();
});

test('/es/FrigorificoFlorida — tiene breadcrumb de regreso', async ({ page }) => {
  await page.goto('/es/FrigorificoFlorida');
  const breadcrumb = page.locator('nav[aria-label="Breadcrumb"]');
  await expect(breadcrumb).toBeVisible();
  await expect(breadcrumb).toContainText('Frigorífico Florida');
});
```

- [ ] **Step 3: Build de producción**

```bash
npm run build
```

Expected: sin errores ni warnings. Carpeta `dist/` generada.

- [ ] **Step 4: Correr smoke tests**

```bash
npm run preview &
npx playwright test
```

Expected: todos los tests pasan.

- [ ] **Step 5: Verificar accesibilidad básica**

```bash
npx playwright test --reporter=list
# Si hay fallas de contraste visibles al revisar el sitio, ajustar en Tailwind config
```

Manual checklist:
- [ ] Focus visible en todos los links y botones (outline borgoña visible)
- [ ] Contraste texto sobre fondo: herramienta [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [ ] Navegación por teclado funcional en Header y formulario
- [ ] `alt` descriptivo en todas las imágenes (no vacío)
- [ ] Landmarks semánticos presentes (`header`, `nav`, `main`, `footer`)

- [ ] **Step 6: Tomar screenshots**

```bash
mkdir -p docs/screenshots
```

Tomar screenshots manualmente (o via Playwright):
- Desktop 1440px: `/es/`, `/en/`, `/zh/`, sub-landings
- Mobile 375px: mismas rutas

Guardar en `docs/screenshots/`.

- [ ] **Step 7: Commit final**

```bash
git add .
git commit -m "feat: production build verified, smoke tests passing, screenshots"
```

---

## Checklist final pre-entrega

- [ ] `npm test` pasa (i18n completeness)
- [ ] `npx astro check` — 0 TypeScript errors
- [ ] `npm run build` — 0 errors/warnings
- [ ] Smoke tests Playwright pasan en todas las rutas
- [ ] `README.md`, `ASSETS-TODO.md`, `CONTENT-TODO.md` completos
- [ ] Screenshots mobile + desktop en `docs/screenshots/`
- [ ] ZH marcado como `// REQUIRES NATIVE REVIEW`
- [ ] Sin datos inventados — todo pendiente en `CONTENT-TODO.md`
