# Grupo Saturno — Landing Page

Landing page institucional trilingüe para [GrupoSaturno.com.uy](https://gruposaturno.com.uy).

## Stack

- **Framework:** Astro 4 (output estático)
- **Estilos:** Tailwind CSS v3
- **Interactividad:** Alpine.js
- **i18n:** Astro i18n nativo — rutas `/es/`, `/en/`, `/zh/`
- **Tipografía:** Cormorant Garamond + Inter + Noto SC (zh)
- **Formulario:** PHP + PHPMailer 7.1.0 + SMTP de NTY (vendored en `public/PHPMailer/`)

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

Hosting destino: **NTY (cPanel + Apache + PHP 8.1+)**.
Subir el contenido de `dist/` por FTP a la raíz del dominio.
El formulario de contacto requiere PHP en el servidor — Vercel/Netlify/Cloudflare Pages NO sirven (no ejecutan PHP).

### Variables de entorno en producción

Setearlas en cPanel ➜ "Setup PHP" ➜ "Environment Variables", o subir un `.env` junto a `contacto.php` en la raíz del dist.
Ver `.env.example` para la lista completa. El `.htaccess` ya bloquea el acceso HTTP a `.env`.

## Testing del formulario de contacto en local

`astro dev` no ejecuta PHP. Para probar el endpoint end-to-end:

```bash
npm run build
cp .env.example dist/.env       # completar las credenciales reales antes
php -S localhost:8000 -t dist
```

Abrir `http://localhost:8000/es/`, completar el form y enviarlo.
Requiere PHP 8.1+ instalado y en el PATH (Windows: `winget install --id PHP.PHP`).
Alternativas: Laragon o XAMPP si preferís Apache real (más cerca del entorno NTY).
