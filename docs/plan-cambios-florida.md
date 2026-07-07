# Plan de implementación — Página Establecimiento Florida 365 (PDF cliente 03/07/2026)

Alcance: `src/pages/[lang]/EstablecimientoFlorida.astro`, `src/components/sections/CadenaValor.astro`, sección `florida` + `chain` de los i18n (es/en/zh).

## Cambio 1 — Subtítulo del hero
**Clave:** `florida.heroDesc`

Actual: "Establecimiento especializado en procesamiento y exportación de carne vacuna. Florida, Uruguay."
Nuevo: **"Nuestro frigorífico exportador: faena, desosado y depósito. Florida, Uruguay."**

## Cambio 2 — Sección Presentación: "Nuestra ventana al mundo"
**Claves:** `florida.presentationH2`, `florida.presentationBody`

- H2: "Especialización y capacidad de escala" → **"Nuestra ventana al mundo"**
- Body (cambiar todo el texto, incorporando "habilitado para los mercados más exigentes"). Propuesta:

> El Establecimiento Florida 365 es nuestro frigorífico exportador: faena, desosado y depósito. Habilitado para los mercados más exigentes —China (GACC), Estados Unidos (USDA) y la Unión Europea—, es la ventana del grupo al mundo: del campo a cada destino, sin intermediarios.

## Cambio 3 — Sección "Un proveedor. Toda la cadena." (CadenaValor)
**Archivos:** `CadenaValor.astro` + claves `chain.*`

Reemplazar todo el contenido por el texto del cliente:

- H2: **"Una empresa seria."** / itálica: "Procesos que respetamos."
- Body: "Somos una empresa seria en la que respetamos todos los procesos de bienestar animal, inocuidad, seguridad alimentaria, calidad, sustentabilidad y trazabilidad. Nos caracteriza la adaptación a las necesidades de cada mercado y, en especial, de cada cliente."
- Los 3 facts actuales ("Faena propia · Procesamiento propio · Sin traders ni brokers") pasan a **6 chips de procesos**: Bienestar animal · Inocuidad · Seguridad alimentaria · Calidad · Sustentabilidad · Trazabilidad.
- Requiere ajuste del componente: la grilla de facts pasa de 3 a 6 ítems (2 filas de 3 en desktop, 1 columna en mobile). Convertir `chain.fact1..3` en array `chain.facts[]`.
- El componente solo se usa en esta página — sin efectos colaterales.

## Cambios derivados (consistencia)
- `meta.floridaDesc`: alinear con el nuevo posicionamiento ("frigorífico exportador / ventana al mundo").
- Título de página y H2 en el índice de navegación no cambian (el nombre "Establecimiento Florida 365" se mantiene).

## Traducciones
Replicar en `en.json` y `zh.json` (incluye la conversión fact1..3 → facts[] en los 3 archivos). Correr `npx vitest run` (paridad de claves).

## Verificación
1. `npm run dev`: revisión visual en ES/EN/ZH.
2. Responsive: viewports 375/390/768px con Playwright. Punto crítico: la grilla de 6 chips en CadenaValor (apilado en mobile, sin desborde con textos largos en EN/ZH).
3. `npm run build` sin errores + screenshots antes/después para el cliente.

## Notas
- La foto del hero (`florida-exterior-principal.jpg`) no está observada en el PDF — se mantiene.
- La stat "Exportaciones 2024" (`florida.stat3*`) existe en i18n pero no se renderiza en la página; sin cambios.
