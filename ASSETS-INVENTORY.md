# Inventario de Assets — Grupo Saturno

Archivo: `wetransfer_cartel-campo-l-jpg_2026-04-14_1834.zip`

## Imágenes (JPG) — Total ~70 MB

### Hero / Campo
- **cartel campo l.JPG** (6.7 MB) — Imagen principal del campo con letrero Saturno
  - _Uso sugerido:_ Hero section, fondo de sección "El Producto"

### Fotografías Generales de Planta
- P5260006.JPG (4.1 MB)
- P5260007.JPG (4.1 MB)
- P8280012.JPG (7.0 MB)
- P8280014.JPG (6.1 MB)
- P8280016.JPG (6.7 MB)
- P8280029.JPG (7.6 MB)
- P8280054.JPG (6.5 MB)
- P8280067.JPG (5.7 MB)
- _Uso sugerido:_ Galería de instalaciones, carrusel de planta en operación

### Fotografías de Producto (Cortes/Presentación)
- Saturno_16.JPG (7.9 MB)
- Saturno_38.JPG (10.1 MB)
- Saturno_71.JPG (9.5 MB)
- Saturno_76.JPG
- Saturno_77.JPG
- _Uso sugerido:_ Sección "El Producto", galería de cortes, ficha técnica visual

## Videos (MP4 + WMV) — Total ~400 MB

### Procesos (Cocinado/Preparación)
- **Saturno HORNO.mp4** (57.5 MB) — Proceso en horno
- **Saturno PARRILLA.mp4** (57.5 MB) — Proceso en parrilla
- **Saturno SARTEN.mp4** (58.3 MB) — Proceso en sartén
- _Uso sugerido:_ Sección "El Producto", video loop mostrando preparación
- _Nota:_ Revisar si son B-roll vertical/horizontal para determinar dónde usarlos

### Loop General
- **Saturno loop.wmv** (225 MB) — Loop general
  - _Uso sugerido:_ Posible fondo de hero o sección (convertir a MP4 primero)
  - _Nota:_ Formato WMV debe convertirse a MP4/WebM para web

## Recomendaciones de Implementación

1. **Renombrar archivos** — Los nombres actuales no son semánticos (P5260006, Saturno_16, etc.). Proponer nuevos nombres:
   - `hero-campo-planta.jpg`
   - `planta-exterior-01.jpg`, `planta-exterior-02.jpg`, etc.
   - `producto-corte-lomo.jpg`, `producto-corte-tira.jpg`, etc.
   - `video-proceso-parrilla.mp4`, etc.

2. **Optimización para web** — Los archivos son grandes. Antes de usar:
   - Comprimir JPG a ~80-85% calidad (reducir 40-50%)
   - Convertir a AVIF/WebP para navegadores modernos
   - Reducir resolución si excede 2000px ancho
   - Convertir WMV a MP4/WebM

3. **Estructura de carpetas propuesta:**
   ```
   /assets
     /images
       /hero (cartel-campo-principal.jpg)
       /planta (planta-exterior-01.jpg, etc.)
       /producto (corte-lomo.jpg, etc.)
     /videos
       /procesos (parrilla.mp4, horno.mp4, sarten.mp4)
       /loops (saturno-loop.mp4)
   ```

4. **Uso en landing:**
   - **Hero:** `cartel-campo-planta.jpg` o video background
   - **Sección "El Producto":** Galería de cortes + video loop si está en buen estado
   - **Sección "Instalaciones":** Carrusel de fotos de planta
   - **Fondo de secciones:** Alguna foto de proceso, sutilmente desaturada

## Archivos para extraer

```bash
cd assets
unzip ../wetransfer_cartel-campo-l-jpg_2026-04-14_1834.zip
```

**Tamaño total descomprimido:** ~460 MB
