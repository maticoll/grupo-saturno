# Plan de implementación — Cambios en la Home (PDF cliente 03/07/2026)

Alcance: solo la página principal. Las páginas Frigorífico Saturno y Establecimiento Florida se planifican por separado.

## Cambio 1 — Hero
**Archivos:** `src/i18n/es.json` (`hero.lead`), `en.json`, `zh.json`

Reemplazar `hero.lead` (elimina "Un socio confiable...") por:

> Del campo al mundo, una cadena completa. Grupo Saturno integra producción ganadera, industria frigorífica exportadora y abastecimiento a todo el Uruguay, junto a nuestros cortes Saturno Premium, tiendas especializadas, restaurante de campo y Barbaco, delivery diario.

Traducir a EN y ZH. Verificar que el largo no rompa el layout del hero en mobile.

## Cambio 2 — Cards de unidades (DipticoUnidades)
**Archivos:** `src/i18n/*.json` (`units.unit1Desc`, `units.unit2Desc`)

- Florida 365: "Planta de faena exportadora para los mercados más exigentes del mundo."
- Frigorífico Saturno: "Nuestro 'ciclo 2', dedicado a abastecer con nuestros productos a todo el territorio nacional uruguayo."

## Cambio 3 — Stats del bloque "Un grupo, una cadena completa" (QuienesSomos)
**Archivos:** `src/i18n/*.json` (`about.stat3*`), posible ajuste en `QuienesSomos.astro`

Reemplazar la stat "4+ mercados / China · EE.UU. · UE · Terceros países" por el concepto **"Un mundo entero como destino"**. Propuesta: número "1", unidad "mundo entero", desc "como destino — habilitados para los mercados más exigentes". Ajustar si el componente no admite texto largo.

## Cambio 4 — Listado de cortes INAC (ElProducto)
**Archivos:** `src/components/sections/ElProducto.astro`, `src/i18n/*.json`, fuente: `listado-cortes-INAC.md`

- Mantener la card "Tipos de corte" con los destacados actuales.
- Agregar acordeón "Ver listado completo" con 3 categorías: con hueso (30), sin hueso (55+), subproductos (41).
- Datos como arrays en los JSON de i18n (ES del manual INAC; EN del mismo manual bilingüe; ZH del Handbook of Uruguayan Meats eng-chi de INAC).
- Interacción con Alpine.js (ya está en el proyecto).
- Pendiente cliente: confirmar si se incluyen subproductos.

## Cambio 5 — Diferenciador 02 (PorQueSaturno)
**Archivos:** `src/i18n/*.json` (`why.items[1]`)

- Título: "Un mundo entero como destino" (reemplaza "Cuatro mercados. Un solo proveedor.")
- Texto: "Estamos habilitados para todos los destinos más exigentes: China (GACC), Estados Unidos (USDA), la Unión Europea y terceros países. Son aprobaciones activas, no objetivos."

## Traducciones
Todos los cambios se replican en `en.json` y `zh.json`. El test `src/i18n/__tests__/i18n.test.ts` valida paridad de claves — correrlo tras cada edición.

## Verificación
1. `npm run dev` + revisión visual de las 5 secciones en ES/EN/ZH (desktop y mobile).
2. `npx vitest run` (paridad i18n).
3. `npm run build` sin errores.
4. Screenshots comparativos antes/después para enviar al cliente.

## Responsive mobile (obligatorio)
- Verificar cada sección modificada en viewports 375px (iPhone SE), 390px (iPhone 14) y 768px (tablet), usando Playwright (ya configurado en el proyecto) para capturar screenshots automáticos por viewport e idioma.
- Puntos críticos:
  - **Hero:** el nuevo `hero.lead` es más largo — controlar que no empuje los CTAs fuera del viewport ni tape la imagen en 375px.
  - **Acordeón de cortes:** en mobile las 3 categorías deben apilarse en 1 columna, con áreas táctiles ≥44px y sin scroll horizontal.
  - **Stat "Un mundo entero como destino":** texto más largo que "4+ mercados" — verificar que la fila de stats no se desborde ni desalinee en mobile.
  - **ZH:** los textos en chino cambian los saltos de línea — revisar los 3 idiomas en mobile, no solo ES.

## Orden sugerido
1→2→3→5 (solo texto, rápidos) → 4 (requiere desarrollo del acordeón) → traducciones → verificación.

## Fuera de alcance (fase siguiente)
- Página Frigorífico Saturno (foto hero, "Ciclo 2", cifras, cobertura, ejes, cortes).
- Página Establecimiento Florida ("Nuestra ventana al mundo", procesos, hero).
