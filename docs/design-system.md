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
- **Primary**: `bg-burgundy text-white hover:bg-burgundy-light`
- **Ghost dark**: `border-burgundy text-burgundy hover:bg-burgundy hover:text-white`
- **Ghost light**: `border-white/30 text-white/70 hover:border-white/60 hover:text-white`

## Animaciones
- Duración: 200–400ms, easing: `ease-out`
- Scroll reveal: clase `.scroll-reveal` + IntersectionObserver en BaseLayout
- Hover díptico: `scale-[1.03]` en columna activa, `opacity-75` en la otra
- `prefers-reduced-motion`: todas las animaciones off

## Accesibilidad
- Focus visible: `outline-2 outline-burgundy outline-offset-2` (definido en `global.css`)
- Contraste mínimo: 4.5:1 texto normal, 3:1 texto grande (WCAG 2.1 AA)
