# Grupo Saturno — Landing Page

Landing page institucional trilingüe para [GrupoSaturno.com.uy](https://gruposaturno.com.uy).

## Stack

- **Framework:** Astro 4 (output estático)
- **Estilos:** Tailwind CSS v3
- **Interactividad:** Alpine.js
- **i18n:** Astro i18n nativo — rutas `/es/`, `/en/`, `/zh/`
- **Tipografía:** Cormorant Garamond + Inter + Noto SC (zh)
- **Formulario:** Formspree (endpoint pendiente de configurar)

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
    sections/     # Secciones de la landing (Hero, Díptico, etc.)
    ui/           # Átomos UI (Button, SectionLabel)
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
