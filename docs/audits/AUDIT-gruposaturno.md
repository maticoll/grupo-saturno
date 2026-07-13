# Auditoría técnica — Grupo Saturno

**Fecha:** 2026-07-07 · **Auditor:** Claude Code (auditoría de solo lectura)
**Stack:** Astro 4 (static) + Alpine.js + Tailwind 3 + TypeScript + PHP (contacto.php + PHPMailer vendored)

| Dimensión | Score |
|---|---|
| Funcionalidad | 🟡 |
| Calidad de código | 🟡 |
| Dependencias | 🟡 |
| Seguridad | 🟢 |
| Mantenibilidad | 🟡 |
| **General** | 🟡 |

## Resumen ejecutivo

El sitio está bien construido en lo esencial: arquitectura Astro limpia, i18n trilingüe (es/en/zh) sin texto hardcodeado, endpoint de contacto PHP con validación seria, y un DEPLOY_NOTES.md ejemplar. No hay secretos commiteados (verificado en working tree e historia de git). Pero hay deuda visible: la suite de smoke tests quedó obsoleta (apunta a rutas que ya no existen), un unit test falla hoy, la tipografía china nunca se aplica por un selector CSS mal escrito (grave si el mercado objetivo es China), links del footer dan 404, y `astro check` reporta 4 errores. Nada está "roto de raíz", pero el proyecto no pasa sus propios checks.

---

## Findings verificados

### F1 — Suite de smoke tests obsoleta: rutas inexistentes y texto desactualizado
- **Archivo:** `tests/smoke.spec.ts:6-13` y `:23-33`
- **Severidad:** Alto · **Fix:** S
- Los tests navegan a `/es|en|zh/FrigorificoFlorida`, pero la página real es `src/pages/[lang]/EstablecimientoFlorida.astro` (fue renombrada y los tests no se actualizaron) → 6 de los 9 route-tests fallan con 404. Además el test de H1 espera `"26 años"` / `"26 years"`, pero `src/i18n/es.json:16` dice `"36 años aprendiendo y creciendo."`. El test del breadcrumb (`:41-46`) también apunta a la ruta muerta. La suite E2E completa es inservible como red de seguridad.

### F2 — Tipografía china nunca se aplica: selector CSS no matchea el `lang` renderizado
- **Archivo:** `src/styles/global.css:54` vs `src/layouts/BaseLayout.astro:21`
- **Severidad:** Alto · **Fix:** S
- `global.css` define `html[lang='zh'] { font-family: theme('fontFamily.sans-zh'); }`, pero el layout renderiza `<html lang="zh-CN">`. El attribute selector exige match exacto, así que la regla **nunca aplica** y `/zh/` se renderiza con ITC Blair/Outfit (sin glifos CJK correctos, cae en fallback del sistema). Fix: `html[lang^='zh']` o `:lang(zh)`.
- Agravante: las webfonts chinas se cargan desde `fonts.googleapis.com` (`BaseLayout.astro:107-111`), **bloqueado en China continental** — justo el mercado objetivo declarado (habilitación GACC, versión zh). Los paquetes `@fontsource/noto-sans-sc` y `@fontsource/noto-serif-sc` ya están instalados y servirían self-hosted, pero nadie los importa.

### F3 — Unit test fallando hoy: keys i18n vacías huérfanas
- **Archivo:** `src/i18n/es.json:90,94,98` (test en `src/i18n/__tests__/i18n.test.ts:32-38`)
- **Severidad:** Medio · **Fix:** S
- `npx vitest run` → **1 failed**: `product.spec1Pending`, `spec2Pending`, `spec3Pending` son strings vacíos. Ya ningún componente las usa (`ElProducto.astro` referencia `spec1Cat/Title/Text`); son keys muertas de una iteración anterior. Borrarlas de los 3 JSON y la suite queda verde.

### F4 — Links del footer a páginas inexistentes (404) y redes sociales en `href="#"`
- **Archivo:** `src/components/Footer.astro:56-64`
- **Severidad:** Medio · **Fix:** S (borrar/ocultar) o M (crear las páginas)
- El footer linkea a `/${lang}/legal` y `/${lang}/privacidad`, pero no existe ninguna página `legal.astro` ni `privacidad.astro` en `src/pages/` → 404 en producción, en las 3 lenguas. Instagram y LinkedIn apuntan a `href="#"` (placeholder). Para un sitio B2B de exportación, aviso legal/privacidad rotos dan mala señal (y la página de privacidad suele ser requisito legal).

### F5 — Imagen Open Graph por defecto inexistente
- **Archivo:** `src/layouts/BaseLayout.astro:11` (`image = '/og-default.jpg'`)
- **Severidad:** Medio · **Fix:** S
- El default de OG/Twitter apunta a `/og-default.jpg`, que **no existe** ni en `public/` ni en git. Ninguna página pasa `image`, así que todas las URLs compartidas en LinkedIn/WeChat/WhatsApp muestran og:image rota. Fix: agregar el asset o apuntar a una imagen existente de `public/images/`.

### F6 — `npx astro check` falla con 4 errores TS
- **Archivo:** `src/layouts/BaseLayout.astro:117,129-131`
- **Severidad:** Medio · **Fix:** S
- El script del count-up usa `el.dataset` y `el._countVersion` sobre `Element` (no `HTMLElement`) y un parámetro `now` implícito `any` → 4 errores. Funciona en runtime (el script compila como JS), pero el proyecto no pasa su propio type-check, lo que anula el valor de tener `@astrojs/check` como dependencia. Fix: cast a `HTMLElement` + tipar `now: number` (o `is:inline` con JSDoc).

### F7 — Dependencias: Astro 2 majors atrás y 15 vulnerabilidades en `npm audit`
- **Archivo:** `package.json:20` (`"astro": "4.16.18"`, pinneado sin `^`)
- **Severidad:** Medio · **Fix:** M (audit fix) / L (migrar a Astro 5/6)
- `npm audit`: **15 vulns (1 critical, 4 high, 9 moderate, 1 low)**. La critical (vitest/vite-node) y la mayoría de las high (vite, devalue) son **devDependencies** — no afectan el sitio estático servido. La high de `astro` (X-Forwarded-Host reflection) aplica a SSR; con `output: 'static'` el riesgo real es bajo. Aún así: Astro 4.16 vs 6.0.5 actual (2 majors), `@astrojs/alpinejs` 0.4 vs 1.0, vitest 2 vs 4. Cuanto más se postergue, más caro el salto.

### F8 — Cuatro paquetes de fuentes instalados y nunca usados
- **Archivo:** `package.json:8,10-12` (`@fontsource/cormorant-garamond`, `@fontsource/inter`, `@fontsource/noto-sans-sc`, `@fontsource/noto-serif-sc`)
- **Severidad:** Bajo · **Fix:** S
- `global.css` solo importa `@fontsource/outfit`; el serif real es ITC Blair (woff2 locales en `public/fonts/`). Los otros 4 paquetes son peso muerto en `node_modules` y ruido en el audit. Nota: los Noto SC deberían pasar a usarse para resolver F2 en vez de eliminarse.

### F9 — README desactualizado: referencias a archivos inexistentes y datos viejos
- **Archivo:** `README.md` (secciones Stack, "Editar imágenes", "Pendientes")
- **Severidad:** Bajo · **Fix:** S
- Referencia `ASSETS-TODO.md` y `CONTENT-TODO.md` que **no existen** en el repo; declara tipografía "Cormorant Garamond + Inter" (real: ITC Blair + Outfit); el dominio del encabezado dice `gruposaturno.com.uy` mientras `astro.config.mjs:7` usa `https://gruposaturno.uy`. Menor, pero es lo primero que lee quien hereda el proyecto.

### F10 — Higiene del working tree: assets pesados sueltos en la raíz
- **Archivo:** raíz del repo (untracked): `Establecimiento Florida*.zip` ×3, `1.png`, `4-7.png`, `11.png`, `imagen cortes vaca.png`, SVGs sueltos
- **Severidad:** Bajo · **Fix:** S
- Material fuente del cliente tirado en la raíz (untracked, el `.gitignore` cubre parte). Riesgo de commit accidental de cientos de MB y confusión sobre qué es fuente de verdad. Mover a `assets/` (ya ignorado) o fuera del repo. Además `.claude/settings.local.json` está trackeado con `"defaultMode": "bypassPermissions"` — mejor no versionar settings locales.

**Menores no listados (1 línea):** hints de `astro check` por `is:inline` faltante en los JSON-LD; `useTranslations()` devuelve arrays como JSON string y obliga a `JSON.parse` sin type-safety en las sub-landings; `docs/screenshots` versionado a medias; título "PHPMailer 7.1.0" en README coincide con el vendored (OK).

---

## Sospechas a confirmar

- **Estado real del deploy — No verificable desde el filesystem.** `DEPLOY_NOTES.md` es un checklist con todos los checkboxes sin marcar; no hay forma de saber desde acá si el switch a Exim local se ejecutó, si `noreply@gruposaturno.uy` existe, ni si el `.env` de producción tiene `DEBUG_SMTP=false`. Correr los `curl -I` de la sección 3 del propio DEPLOY_NOTES contra producción lo confirma en 2 minutos.
- **Licencia de ITC Blair.** Hay 6 `.woff2` de ITC Blair commiteados en `public/fonts/` y servidos públicamente. ITC Blair es una fuente comercial (Monotype); habría que confirmar que la licencia del cliente cubre webfont self-hosting **y** la redistribución en un repo GitHub (`github.com/maticoll/grupo-saturno` — visibilidad pública/privada no verificable desde acá; si es público, el riesgo es mayor).
- **`zh.json` sin revisión nativa.** El propio README lo advierte; no puedo validar la calidad del chino (361 líneas, keys completas según el test).
- **Sincronía de `dist/` con `src/`.** Hay un `dist/` local buildeado; no verifiqué si corresponde al último commit — irrelevante si el deploy re-buildea, crítico si se sube ese `dist/` por FTP tal cual.

---

## Detalle por dimensión

### 1. Funcionalidad — 🟡
El sitio core funciona: 4 páginas × 3 idiomas, redirect por `navigator.language` en la raíz (con `noscript` fallback y `noindex`, bien resuelto), form de contacto completo con estados en Alpine. Lo que resta: footer con 404s (F4), og:image rota (F5), fuente china nunca aplicada (F2) y tests que ya no reflejan el sitio (F1, F3). `astro check`: 4 errores (F6).

### 2. Calidad de código — 🟡
Estructura prolija (sections/ui/layouts separados), cero texto hardcodeado, componentes chicos, buen uso de Alpine (drawer con `x-teleport`, focus management y `x-destroy` del scroll listener en `Header.astro` — nivel alto). Contras: el helper `t()` es stringly-typed y las sub-landings hacen 7 `JSON.parse(t(...))` con `as` casts (`FrigorificoSaturno.astro:14-20`) — un typo de key falla silencioso en runtime de build; keys i18n muertas (F3); errores de tipos en el script inline (F6).

### 3. Dependencias — 🟡
15 vulns pero concentradas en toolchain de dev; runtime estático casi no expone superficie. El problema real es el atraso: Astro 4 (EOL de facto con 6.x afuera) y 4 paquetes de fuentes muertos (F8). `package-lock` sano, sin deps exóticas.

### 4. Seguridad — 🟢
**Sin secretos commiteados** (verificado: `git ls-files` solo muestra `.env.example` con campos vacíos; `git log -S` sobre toda la historia no encuentra credenciales; `.gitignore` cubre `.env` y `.env.production`). `contacto.php` está por encima del promedio: honeypot, límites de longitud espejados frontend/backend, `filter_var` email, anti CRLF-injection, `htmlspecialchars` en el body HTML, error codes estables sin filtrar detalles, `DEBUG_SMTP` con comparación estricta. `.htaccess` bloquea dotfiles con `RedirectMatch 404`. Únicos puntos a vigilar: sin rate-limiting en el endpoint (el honeypot es la única defensa anti-spam) y la sospecha de licencia de fuentes.

### 5. Mantenibilidad — 🟡
`DEPLOY_NOTES.md` es de lo mejor del repo: checklist accionable con rollback documentado. README cubre setup local incluido el truco de `php -S` para probar el form. `.env.example` comentado. Pero: README con referencias muertas (F9), tests rotos que impedirían a un tercero validar sus cambios (F1, F3), y env vars de producción viven solo en el servidor (correcto, pero nadie documentó dónde está el backup de esas credenciales).

### 6. Reutilización — ver sección siguiente

---

## Código reutilizable para Kairo

Ordenado por valor/esfuerzo de extracción:

1. **Kit "contact form para hosting cPanel/PHP"** — `public/contacto.php` + `public/.htaccess` + `.env.example` + la sección de testing local del README + `DEPLOY_NOTES.md` como template de checklist. Es el problema #1 de todo cliente en hosting compartido uruguayo (NTY, etc.) y acá está resuelto con validación, honeypot, modos SMTP conmutables por env y hardening. Extraíble casi tal cual.
2. **Setup i18n Astro estático** — `src/i18n/index.ts` + estructura `[lang]/` + `getStaticPaths` + redirect client-side de `src/pages/index.astro` + hreflang/canonical de `BaseLayout.astro` + el **test de completitud de diccionarios** (`i18n.test.ts` — barato y ataja el bug más común de sitios multilenguaje). Mejora sugerida antes de templetizar: tipar las keys.
3. **`BaseLayout.astro` como template SEO** — head completo: OG, Twitter, JSON-LD Organization con escape de `</`, geo tags, hreflang, preload de fuentes. Parametrizable por config.
4. **Componentes Alpine accesibles** — `MobileMenu.astro` (drawer con overlay teleportado, focus trap manual, escape) y el dropdown del `Header.astro`. Son los dos componentes que toda landing necesita y acá están bien hechos.
5. **Micro-interacciones** — scroll-reveal + count-up con replay por IntersectionObserver (`BaseLayout.astro:93-140`, previo fix de tipos F6) + tokens de `global.css`/`tailwind.config.mjs` como base de design system.
6. **Setup de tests** — `playwright.config.ts` (webServer con preview) + patrón de smoke tests por ruta + `screenshots.spec.ts` para capturas de QA multi-locale. Como template está bien; la lección de F1 es generarlos desde una lista de rutas compartida con el router.
