# Plan de implementación — Página Frigorífico Saturno (PDF cliente 03/07/2026)

Alcance: `src/pages/[lang]/FrigorificoSaturno.astro` + sección `saturno` de los i18n (es/en/zh). La página Establecimiento Florida se planifica aparte.

## Cambio 1 — Foto del hero
**Archivo:** `FrigorificoSaturno.astro` (línea ~30)

Hoy usa `/images/planta/planta-exterior-05.jpg` (el camión). Reemplazar por una foto más representativa de la planta. Candidatas existentes en `public/images/planta/`: `planta-exterior-01`, `planta-exterior-02`, `planta-exterior-06`.
**Pendiente cliente:** confirmar si envían foto nueva; mientras, usar la mejor existente como provisoria.

## Cambio 2 — Presentación: "Núcleo productivo" → "Ciclo 2"
**Claves:** `saturno.presentationH2`, `presentationBody1`

- H2: "Ciclo 2, dedicado al mercado interno uruguayo"
- Reescribir body incorporando: centro logístico nacional, centro de distribución, abastecimiento a todo el país, más de 40 vehículos, más de 1.000 toneladas por mes. Propuesta:

> Fundado en 1990, Frigorífico Saturno es el ciclo 2 del grupo: centro logístico y de distribución nacional con planta en Ruta 8 Km 38, Empalme Olmos, Canelones. Abastecemos a todo el país con una flota de más de 40 vehículos y un volumen superior a las 1.000 toneladas mensuales.

## Cambio 3 — Barra de estadísticas
**Clave:** `saturno.stats`

| Stat | Actual | Nuevo |
|------|--------|-------|
| Toneladas/año | 5.000+ | 12.000+ |
| Vehículos de distribución | 15 | 40+ |
| Departamentos cubiertos | 8+ | 19 |
| Empleados nacionales | 100 | 100+ |
| Años / m² planta | 36 / 2.183 | sin cambio |

## Cambio 4 — Distribución "Cobertura nacional propia"
**Claves:** `saturno.distBody`, `distInteriorDepts`, `distInteriorFreq`, `capacity`

- `distBody`: "Flota de 15 vehículos" → "más de 40 vehículos".
- `distInteriorDepts`: lista de 8 departamentos → "Todos los departamentos".
- `distInteriorFreq`: "Frecuencia semanal" → "Dos veces por semana".
- `capacity[]`: "más de 5.000 toneladas anuales" → "más de 12.000 toneladas al año"; agregar "Centro logístico y de distribución nacional".

## Cambio 5 — Saturno Premium
**Claves:** `saturno.premiumBody`, `cuts`

- `premiumBody`: "Novillos y vacas Angus y Hereford" → "Novillos y **vaquillonas** Angus y Hereford".
- `cuts`: hoy 6 cortes → listado completo INAC (fuente: `listado-cortes-INAC.md`). Reusar el patrón de acordeón de la home (destacados visibles + "Ver listado completo").
- **Atención:** el hotmap interactivo de la vaca (SVG con zonas → `data-cuts` por índice) depende de los índices del array `cuts`. Si el array cambia, remapear los `data-cuts` de los polígonos o desacoplar el hotmap del listado (recomendado: mantener el hotmap con los 6 destacados y el acordeón aparte).

## Cambio 6 — Seis ejes
**Clave:** `saturno.pilares` (items 01 y 04)

- El Productor: "Eslabón inicial y fundamental con el que mantenemos un relacionamiento cercano y diario."
- El Entorno Social: "Comprometidos con nuestra zona de influencia en todo el país."

## Cambios derivados (consistencia)
- `saturno.adnItems`: "Presencia regional en 8+ departamentos" → "Presencia en los 19 departamentos".
- `meta.saturnoDesc`: menciona "Núcleo productivo" → actualizar a "Ciclo 2".

## Traducciones
Replicar todo en `en.json` y `zh.json`. Correr `npx vitest run` (paridad de claves).

## Verificación
1. `npm run dev`: revisión visual de todas las secciones en ES/EN/ZH.
2. Responsive: viewports 375/390/768px con Playwright. Puntos críticos: barra de stats (6 valores), acordeón de cortes, hotmap de la vaca en mobile.
3. Hotmap: verificar hover/tap de cada zona tras el cambio del array `cuts`.
4. `npm run build` sin errores + screenshots antes/después para el cliente.

## Pendientes cliente
- Foto definitiva de la planta para el hero.
- Confirmar si el listado de cortes en esta página (mercado interno) incluye subproductos.
