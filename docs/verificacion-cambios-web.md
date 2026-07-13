# Verificación de cambios en producción — grupo-saturno.vercel.app
Fecha: 07/07/2026 · Contra: PDF del cliente "Cambios en la Web" (03/07/2026)

## Resumen: 15 de 15 cambios del PDF implementados ✅

### Home
| Cambio | Estado |
|---|---|
| Hero: nuevo texto con todas las unidades del grupo | ✅ |
| Hero: eliminado "Un socio confiable..." | ✅ |
| Card Florida: "Planta de faena exportadora..." | ✅ |
| Card Saturno: "ciclo 2... territorio nacional uruguayo" | ✅ |
| Stat "4+ mercados" → "Un mundo entero como destino" | ✅ |
| Listado completo de cortes INAC (acordeón 3 categorías) | ✅ |
| Diferenciador 02: "Todo el mundo. Un solo proveedor." + "Un mundo entero como destino" | ✅ |

### Frigorífico Saturno
| Cambio | Estado |
|---|---|
| Foto hero: ya no es el camión (ahora planta-exterior-02) | ✅ provisoria |
| "Ciclo 2, dedicado al mercado interno uruguayo" + nuevo texto (centro logístico, +40 vehículos, +1.000 ton/mes) | ✅ |
| Stats: 12.000+ ton/año · 40+ vehículos · 19 departamentos · 100+ empleados | ✅ |
| Interior del país: todos los departamentos / dos veces por semana | ✅ |
| "Novillos y vaquillonas" | ✅ |
| Listado completo de cortes (acordeón) + hotmap conservado | ✅ |
| Ejes: El Productor y El Entorno Social con nuevos textos | ✅ |
| Derivados: adnItems "19 departamentos", meta description "Ciclo 2" | ✅ |

### Establecimiento Florida 365
| Cambio | Estado |
|---|---|
| Hero: "Nuestro frigorífico exportador: faena, desosado y depósito" | ✅ |
| "Nuestra ventana al mundo" + nuevo texto (mercados más exigentes) | ✅ |
| "Una empresa seria" + 6 procesos + adaptación a cada cliente | ✅ |
| Derivado: meta description actualizada | ✅ |

## Observaciones (no corregidas, solo anotadas)

1. **Cards eliminadas en la home sin pedido del cliente:** al implementar el acordeón de cortes se quitaron las cards "Formatos de despacho" (Fresco · Congelado · Vacuum packed · Boxed beef) y "Habilitaciones vigentes" (GACC · USDA · UE · HACCP). El PDF no pedía sacarlas — para compradores del exterior las habilitaciones eran información valiosa. Confirmar con el cliente si se restauran.
2. **Inconsistencia menor en Saturno:** la lista "Capacidad instalada" dice "100 empleados de mano de obra nacional" mientras la barra de stats dice "100+". El cliente pidió "más de 100".
3. **Foto hero de Saturno provisoria:** se usa `planta-exterior-02.jpg`, la misma foto que aparece en la galería de la home ("Instalaciones"). Falta la foto definitiva que debía enviar el cliente.
4. **Conteo de cortes:** "Cortes sin hueso" figura como 54 porque incluye "Trozos de carne" y "Bloque" (otras presentaciones según INAC). Correcto en contenido; solo señalarlo si el cliente compara contra el manual.
5. **Pendiente de confirmación con el cliente:** si el listado debe incluir subproductos (hoy se muestran las 3 categorías completas).

## No verificado en esta pasada
- Versiones EN y ZH (solo se revisó /es/).
- Responsive mobile en producción (requiere revisión visual con viewports).
