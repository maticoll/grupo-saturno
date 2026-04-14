# Prompt para Claude Code — Landing Page Grupo Saturno

> Usar el skill `ui-ux-pro-max-skill` como guía de criterio visual, UX y código. Priorizar diseño premium, jerarquía clara, microinteracciones sobrias y rendimiento.

---

## 1. Objetivo del proyecto

Construir una **landing page institucional** para **Grupo Saturno** (empresa uruguaya con 26 años de trayectoria en ganadería y procesamiento cárnico, ubicada en Empalme Olmos, Canelones). La página debe funcionar como **carta de presentación a clientes internacionales** (importadores, distribuidores y encargados de comercio exterior) y como **hub que centralice las dos unidades de negocio principales del grupo**.

La landing principal debe vivir en `GrupoSaturno.com.uy` y, debajo del hero, presentar dos accesos diferenciados hacia:

- `GrupoSaturno.com.uy/FrigorificoFlorida`
- `GrupoSaturno.com.uy/FrigorificoSaturno`

**Fuente de información y referencia visual actual:** https://www.frigorificosaturno.com.uy/ (usar como fuente de imágenes, datos de producción, trayectoria y contenido. No copiar la estética — la nueva debe superarla en calidad, modernidad y coherencia).

---

## 2. Stack y requisitos técnicos

Proyecto simple, estático, rápido. No es una app — es una landing institucional con 3 rutas y contenido mayormente fijo. Nada de frameworks pesados.

- **Framework:** **Astro** (ideal para landings: estático por defecto, i18n nativo, SEO excelente, output HTML puro al build). Si el cliente prefiere aún más simple, alternativa válida es HTML + CSS + JS vanilla con un bundler liviano (Vite). **No usar Next.js, Remix ni CRA — es sobreingeniería.**
- **Estilos:** Tailwind CSS (configurado con el design system propio). Opcionalmente CSS puro con custom properties si el equipo lo prefiere, pero Tailwind agiliza el ritmo.
- **Componentes:** componentes `.astro` nativos. Si se necesita interactividad puntual (selector de idioma, menú mobile, formulario), usar islas de Astro con JS vanilla o Alpine.js — nada de React para esto.
- **Animaciones:** CSS + `IntersectionObserver` para revelados al scroll. Sin librerías pesadas. Respetar `prefers-reduced-motion`.
- **Tipografías:** una serif editorial para titulares (Fraunces, Canela o similar) + una sans neutra para cuerpo (Inter o Geist), cargadas vía `@fontsource` o Google Fonts con `font-display: swap` y `preload` de las variantes críticas.
- **Imágenes:** usar `<Image />` de Astro (genera AVIF/WebP automático, lazy loading, dimensiones correctas para evitar CLS). `loading="eager"` sólo en el hero.
- **SEO:** metadata completa (título, descripción, Open Graph, Twitter Card), `lang` correcto por página, canonical, `sitemap.xml` y `robots.txt` generados en build. Schema.org `Organization` con domicilio en Uruguay.
- **Accesibilidad:** WCAG 2.1 AA. Contrastes AA, navegación por teclado, focus visibles, landmarks semánticos, alt descriptivos en todas las imágenes.
- **Performance:** Lighthouse ≥ 95 en todas las métricas en mobile. CLS 0, LCP < 2.5s. Build genera HTML estático — debería ser trivial alcanzarlo.
- **Responsive:** mobile-first, breakpoints 360 / 768 / 1024 / 1280 / 1440. Testear en mobile chico (iPhone SE) y desktop ancho (1440+).
- **i18n trilingüe obligatorio (ES / EN / ZH):** usar el sistema i18n nativo de Astro (`astro:i18n`). Tres idiomas funcionales al lanzamiento:
  - **ES** (default, es-UY) — público local y LATAM.
  - **EN** (en) — importadores y distribuidores internacionales (EEUU, UE, Medio Oriente).
  - **ZH** (zh-CN, simplificado) — clientes chinos, mercado estratégico clave.
  Todos los textos viven en archivos de diccionario por idioma (`/src/i18n/es.json`, `/src/i18n/en.json`, `/src/i18n/zh.json`). Nada hardcodeado en componentes.
- **Tipografía multilingüe:** cargar `Noto Sans SC` + `Noto Serif SC` para chino, con fallback automático según `lang` del `<html>`. El stack tipográfico debe cambiar según locale.
- **Rutas localizadas:** `/es/...`, `/en/...`, `/zh/...` (configuradas con `i18n.routing` de Astro). Redirect automático en la raíz según `Accept-Language`, con override manual siempre disponible.
- **Selector de idioma:** componente visible en el header (desktop y mobile) mostrando `ES · EN · 中文` con el activo destacado. Al cambiar, mantener la misma ruta/sección en el nuevo idioma.
- **SEO multilingüe:** `hreflang` tags correctos para los tres idiomas, metadata traducida por locale, sitemap con las tres versiones.
- **Deploy:** listo para Vercel, Netlify o Cloudflare Pages. Output estático (`output: 'static'` en `astro.config.mjs`).

Entregar el proyecto con `README.md` corto indicando cómo correr en local, estructura de carpetas y cómo editar contenido.

---

## 3. Dirección de arte

### Mood general
**Formal, sobrio, premium, internacional.** El público es B2B de alto nivel (comercio exterior, importadores en EEUU, UE y especialmente China). La landing es una carta de presentación comercial — tiene que transmitir **seriedad industrial + elegancia editorial** desde el primer segundo. Nada de rústico-folclórico, nada de corporativo frío genérico, nada de "startup". El equilibrio lo da Uruguay contemporáneo presentado con estándar global: campo + diseño editorial moderno + rigor formal.

### Consideraciones específicas para el público chino
El mercado chino B2B valora señales claras de **seriedad, trayectoria y escala**. Al diseñar tener presente:
- Datos visibles de producción, capacidad y años de operación presentados con jerarquía fuerte (números grandes, tipografía editorial).
- Certificaciones, banderas de mercados de exportación y logos de clientes/socios cuando existan (con permiso).
- Fotografía de instalaciones industriales — planta, líneas de procesado, logística, contenedores — que demuestre escala real.
- Evitar humor, ironía o tono casual. El registro es el de un proveedor industrial serio presentándose a una reunión formal.
- La versión ZH debe revisarse con un hablante nativo antes del lanzamiento — el prompt debe dejar el placeholder de traducción pero advertir que **NO se debe usar traducción automática sin revisión humana**.

### Referencias de marca a las que hay que acercarse
- **Illy** — rigor editorial, tipografía fuerte, fotografía de alta calidad, blancos amplios.
- **Patagonia** — honestidad visual, protagonismo de las personas y del proceso, fotografía documental sin filtros extremos.
- **Garzón** — lujo uruguayo contemporáneo, paletas tierra, tipografía serif editorial, mucho aire.
- **La Martina** — tradición + sofisticación, materiales nobles, elegancia discreta.

### Referencias a las que NO hay que parecerse
- Minerva Foods (demasiado corporativo/frío, genérico).
- Las Piedras / Santa Clara (estéticas saturadas, sin jerarquía editorial).
- Frigoríficos típicos con sliders de stock photos, fondos rojo sangre, tipografías agresivas.

### Paleta sugerida (proponer variaciones, no tomar literal)
- **Base:** off-white cálido (`#F5F1EA` aprox) y negro carbón (`#1A1A1A`).
- **Acento primario:** un tierra profundo — siena tostado / borgoña oscuro / verde campo (`#3A4A2E` o `#6B2E2A`). Elegir una, no mezclar.
- **Neutros:** grises cálidos para jerarquía secundaria.
- **Nunca:** rojo saturado tipo matadero, degradados tecnológicos, gradientes azul/violeta.

### Fotografía
Priorizar fotografía real del grupo (campos, planta, equipo humano, cortes, logística). Tratamiento **documental, luz natural, grano sutil permitido**. Nada de stock genérico. Si falta material, dejar placeholders claros y comentados en el código indicando qué foto ideal iría ahí (p. ej. `{/* PLACEHOLDER: foto cenital de res en proceso de despiece, luz natural, horizontal 16:9 */}`).

### Extracción de imágenes
Scrapear/descargar imágenes utilizables desde https://www.frigorificosaturno.com.uy/ y guardarlas en `/public/images/` con nombres semánticos (`planta-exterior.jpg`, `campo-ganado.jpg`, etc.). Si una imagen no tiene la calidad suficiente, dejar placeholder y notarlo en un `ASSETS-TODO.md`.

---

## 4. Estructura de la landing principal (GrupoSaturno.com.uy)

### 4.1 Header / Navegación
- Logo Grupo Saturno a la izquierda (tipografía, por ahora — si no existe marca gráfica, proponer lockup tipográfico sobrio).
- Nav minimalista: `Grupo`, `Unidades de negocio`, `Trayectoria`, `Contacto`.
- Botón CTA secundario: `Contacto comercial` (ancla a sección contacto).
- Sticky con blur/translucidez al hacer scroll.
- **Selector de idioma trilingüe** a la derecha del nav, siempre visible: `ES · EN · 中文`. Diseño minimalista, separadores sutiles, idioma activo en color de acento. En mobile, integrado dentro del menú hamburguesa de forma prominente (arriba del listado de links). Debe funcionar antes del primer scroll — es lo primero que un cliente internacional busca.

### 4.2 Hero (home)
- **Fullscreen o 90vh.** Imagen de fondo: campo uruguayo o planta, tratamiento cinematográfico con un overlay suave para legibilidad.
- **Titular principal** (H1, serif, grande):
  > *"26 años llevando la calidad uruguaya al mundo."*
  (Proponer 2 variantes alternativas en comentario para que el cliente elija. Ejemplo alternativo: *"Del campo uruguayo a mesas del mundo."*)
- **Bajada** (1–2 líneas, sans, neutra):
  > *"Grupo Saturno integra producción ganadera, procesamiento frigorífico y comercialización. Un socio confiable para quienes entienden que la calidad se construye en cada eslabón."*
- **Dos CTAs:** primario `Conocé nuestras unidades` (scroll suave a la sección de columnas), secundario `Contactanos`.
- Scroll cue sutil abajo.

### 4.3 Sección de doble columna — Unidades de negocio *(el núcleo del pedido del cliente)*
Inmediatamente debajo del hero. **Dos columnas iguales**, cada una es una "puerta de entrada" a una sub-landing.

**Layout:**
- Desktop: 2 columnas 50/50, altura mínima 70vh. Separación mínima entre columnas (línea vertical sutil o gap pequeño). Debe sentirse como un díptico.
- Mobile: apiladas, full width, una encima de la otra.
- En hover (desktop): la columna activa crece sutilmente (scale 1.02 o la otra baja opacidad a 0.7). Transición suave, nunca brusca.

**Columna 1 — Frigorífico Florida**
- Imagen de fondo representativa de Florida (planta, ubicación, equipo) — editorial, no ilustrativa.
- Kicker arriba: `Unidad 01`
- Título (serif, grande): `Frigorífico Florida`
- Descripción breve (1 línea): *"Procesamiento especializado con foco en [definir con cliente — exportación / mercado interno premium / etc.]"* — **dejar el texto marcado claramente como `[A CONFIRMAR CON CLIENTE]`** si no fue provisto.
- Botón: `Conocer Frigorífico Florida →` → `/FrigorificoFlorida`

**Columna 2 — Frigorífico Saturno**
- Imagen de fondo representativa de Saturno (tomar del sitio actual).
- Kicker arriba: `Unidad 02`
- Título (serif, grande): `Frigorífico Saturno`
- Descripción breve: *"Producción y procesamiento integrados con trazabilidad desde el origen. 80% de nuestra facturación, núcleo del grupo."*
- Botón: `Conocer Frigorífico Saturno →` → `/FrigorificoSaturno`

Los botones son los elementos accionables explícitos del pedido del cliente, pero **toda la columna también debe ser clickeable** (mejor UX). El botón en sí debe ser estilo ghost/outline con hover que invierte colores.

### 4.4 Sección "Quiénes somos" (grupo)
- Título editorial: *"Un grupo, una cadena completa."*
- Texto a dos columnas:
  > *"Grupo Saturno es una empresa uruguaya con 26 años de trayectoria dedicada a la producción, procesamiento y comercialización de carne. Desde nuestros campos en Empalme Olmos hasta mesas en todo el mundo, cada etapa ocurre bajo el mismo estándar: consistencia, trazabilidad y compromiso humano."*
- Bloque de **números clave** (proponer placeholders si el cliente no los dio):
  - `26 años` · de trayectoria
  - `100%` · trazabilidad del origen al producto final
  - `[X] campos propios` · `[A CONFIRMAR]`
  - `[X] ton/semana` · capacidad de procesamiento `[A CONFIRMAR]`
  - `[X] mercados` · de exportación `[A CONFIRMAR]`

### 4.5 Sección "Misión · Visión · Valores"
Tratamiento editorial, no como bullets aburridos. Tres bloques, uno debajo del otro o en columnas, con mucho aire.

- **Misión:** *"Llevar la calidad y la esencia uruguaya al mundo."*
- **Visión:** *"Ser reconocidos por nuestra empatía, seriedad y confianza, construyendo relaciones estratégicas y duraderas."*
- **Valores:** Aprendizaje · Crecimiento · Esfuerzo · Adaptabilidad · Compromiso · Empatía.
  (Presentarlos como lista editorial tipográfica, cada uno con una sola palabra grande + una frase corta que lo explique. Sin íconos genéricos.)

### 4.6 Sección "El producto" (nueva — crítica para clientes internacionales)
Porque el cliente no puede oler, tocar ni ver el producto en persona, **la landing tiene que hacer ese trabajo por nosotros**. Esta sección es el corazón demostrativo de la página.

Composición:
- Título editorial: *"La carne uruguaya, en detalle."*
- **Galería principal de producto** tipo editorial: 4 a 6 imágenes de alta resolución de cortes principales, empaquetado final, etiquetado con trazabilidad, y producto listo para despacho. Tratamiento: fondos neutros, luz de estudio, composición limpia — referencia Illy/Garzón, no catálogo de supermercado.
- **Ficha técnica lateral o inferior** con datos verificables (usar placeholders `[A CONFIRMAR]` cuando no haya dato):
  - Tipos de corte disponibles.
  - Formatos de presentación (fresco / congelado / vacuum / boxed beef).
  - Razas trabajadas.
  - Estándares de calidad y certificaciones (HACCP, Halal, Kosher, USDA-equivalente, UE, China GACC, etc. — **marcar todo como `[A CONFIRMAR]`, no inventar**).
  - Mercados de exportación actuales.
- **Carrusel de instalaciones** con 4–6 fotos: planta exterior, línea de faena, cámaras de frío, packaging, carga de contenedores. Demostrar escala industrial real.
- **Video loop corto** (opcional, sin audio, autoplay silencioso) mostrando la planta en operación, si hay material disponible. Si no, placeholder.

Esta sección es la respuesta directa al problema declarado por el cliente: *"Evidencia de capacidad real — cuánto producimos por semana, dónde almacenamos, dónde producimos, dónde están nuestros campos, quiénes son nuestros trabajadores"*.

### 4.7 Sección "Cadena de valor" (diferenciador clave)
Mostrar los **eslabones** como secuencia visual horizontal (desktop) o vertical (mobile). Esto responde al problema declarado: *"demostrar lo que decimos"*.

Eslabones:
1. **Producción ganadera** — campos propios.
2. **Procesamiento** — frigoríficos con control de calidad.
3. **Venta mayorista** — importadores, distribuidores, comercios.
4. **Venta minorista** — carnicerías y supermercados propios.
5. **E-commerce** — alcance nacional.
6. **Experiencia gastronómica** — Restaurante La Hacienda.

Cada eslabón con: foto real + nombre + 1 línea. Línea/trazo conectivo sutil entre ellos.

### 4.8 Sección "Por qué Saturno" (diferenciadores)
Título: *"Lo que nos diferencia."*
Cuatro bloques (grid 2x2 en desktop, stack en mobile):
- **Integración total** — *"Producimos, procesamos y comercializamos. Control real en cada etapa."*
- **Calidad constante** — *"Sin intermediarios que alteren el resultado. Conocemos el producto desde el origen."*
- **Escala con cercanía** — *"Capacidad industrial, trato humano. Somos ambas cosas, no una ni la otra."*
- **Visión internacional** — *"Evolucionando hacia mercados globales, con estándares alineados a la exigencia externa."*

### 4.9 Sección "Trayectoria" (opcional — línea de tiempo sobria)
Si hay datos, una timeline vertical con hitos (fundación, crecimiento, apertura de unidades, exportación). Si no, omitir y dejar comentado.

### 4.10 Sección "Contacto comercial"
Enfocada en **comercio exterior**, que es el público objetivo.
- Título: *"Hablemos de negocios a largo plazo."*
- Texto breve: *"Si representás una empresa importadora, distribuidora o del sector alimenticio, te invitamos a conocernos en profundidad."*
- Formulario: nombre, empresa, país, email, mensaje. Validación client-side. Endpoint preparado (puede ser Formspree o placeholder).
- Datos directos: dirección (Empalme Olmos, Canelones, Uruguay), email comercial (placeholder si no fue provisto), LinkedIn del grupo.

### 4.11 Footer
- Logo.
- Nav secundaria.
- Enlaces a las unidades.
- Redes sociales (Instagram, LinkedIn, Facebook).
- Legales (Aviso legal, Política de privacidad — stubs).
- Línea inferior: `© 2026 Grupo Saturno · Empalme Olmos, Uruguay`.

---

## 5. Sub-landings (estructura base — crear las rutas pero con contenido provisorio)

Crear las rutas `/FrigorificoFlorida` y `/FrigorificoSaturno` con una estructura base reutilizable:
- Hero propio de cada unidad (imagen, nombre, bajada).
- Sección de capacidades / servicios.
- Sección de instalaciones (galería).
- Contacto directo de esa unidad.
- Breadcrumb volviendo a `GrupoSaturno.com.uy`.

Marcar claramente con `[CONTENIDO A DEFINIR CON CLIENTE]` los textos que no fueron provistos. **No inventar datos de producción, capacidades, certificaciones o mercados.**

---

## 6. Tono de voz (aplicable a todo el copy)

- **Registro formal profesional**, claro, sobrio. La landing es institucional y B2B internacional — incluido mercado chino donde la formalidad es una señal de respeto y seriedad.
- Frases cortas, directas, sin adornos.
- Equilibrio entre calidez humana y seriedad industrial. La calidez viene del contenido (personas, años, historia), no del tono del copy.
- Nunca: *"somos una gran familia"*, *"líderes indiscutidos"*, *"la mejor carne del mundo"*, superlativos vacíos, lenguaje corporativo genérico, coloquialismos uruguayos/rioplatenses.
- Sí: hablar desde el hacer, desde los años de trabajo, desde los hechos verificables. Mostrar, no afirmar.
- Humor: **no** en esta landing. El humor queda para las marcas de consumo final, no para Grupo Saturno institucional.

### Notas específicas por idioma
- **ES (es-UY → neutro):** evitar modismos rioplatenses marcados. Un importador mexicano o español debe leerlo sin fricción.
- **EN:** inglés comercial internacional, no americano coloquial ni británico rebuscado. Estilo tipo *The Economist* / reportes industriales serios.
- **ZH:** chino simplificado formal comercial (商务正式). **Traducción obligatoriamente revisada por hablante nativo**, preferentemente con experiencia en comercio exterior agroindustrial. El prompt debe generar los diccionarios ZH con traducción base pero marcarlos claramente como `// REQUIRES NATIVE REVIEW` en el archivo.

---

## 7. Criterios de calidad (usar ui-ux-pro-max-skill)

Aplicar al 100% los criterios del skill, especialmente:

- **Jerarquía tipográfica clara** — máximo 3 niveles por vista, escalas tipográficas armónicas.
- **Espaciado generoso** — nada pegado. Sistema de espaciado consistente (4/8px base).
- **Grid coherente** — 12 columnas desktop, container max 1280–1440 con padding lateral.
- **Microinteracciones con propósito** — hover states, focus visibles, transiciones 200–400ms con easing suave (`ease-out`).
- **Consistencia de componentes** — botones, links, cards con el mismo DNA visual.
- **Imagen como protagonista** — tratamiento editorial, no relleno.
- **Mobile first real** — probar cada sección en 360px antes de darla por terminada.
- **Evitar el "template look"** — cero hero con gradiente morado, cero cards con sombra azul, cero íconos de línea genéricos.

---

## 8. Entregables esperados

1. Proyecto Astro corriendo localmente con `npm run dev`.
2. Código limpio, componentes reutilizables en `/src/components`, contenido y diccionarios i18n centralizados en `/src/i18n/`.
3. `README.md` con: stack, cómo correr, estructura, cómo editar textos/imágenes, qué queda pendiente.
4. `ASSETS-TODO.md` con la lista de imágenes placeholder que el cliente debe proveer.
5. `CONTENT-TODO.md` con todos los textos marcados como `[A CONFIRMAR CON CLIENTE]` listados en un solo lugar.
6. Build de producción verificada (`npm run build`) sin errores ni warnings.
7. Screenshots de la landing en mobile y desktop incluidos en `/docs`.

---

## 9. Qué NO hacer

- No inventar datos cuantitativos (toneladas, certificaciones, mercados, empleados, etc.).
- No usar stock photos genéricos de carne cruda sobre tabla de madera con perejil.
- No meter sliders de clientes, testimonios inventados, o premios que no existan.
- No usar lenguaje de "familia feliz" o frases hechas del rubro.
- No saturar con animaciones. Si una animación no aporta claridad o deleite, fuera.
- No hacer la sub-landing `/FrigorificoFlorida` idéntica a `/FrigorificoSaturno` — deben sentirse hermanas pero con identidad propia.

---

## 10. Proceso sugerido

1. Leer el skill `ui-ux-pro-max-skill` completo antes de escribir código.
2. Scrapear imágenes de https://www.frigorificosaturno.com.uy/ y organizarlas.
3. Proponer **moodboard tipográfico + paleta** en un archivo `/docs/design-system.md` antes de maquetar.
4. Construir sistema de diseño base (tokens, componentes primitivos).
5. Maquetar home completa.
6. Maquetar sub-landings con layout base.
7. QA de accesibilidad y performance.
8. Entregar con documentación.

---

**Nota final:** el cliente valora la transparencia y la consistencia por sobre la ostentación. La landing debe transmitir *"esta empresa sabe lo que hace hace 26 años y tiene con qué respaldarlo"* — sin decirlo con esas palabras, mostrándolo con diseño.