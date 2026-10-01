# Bloque de arranque para el `CLAUDE.md` del proyecto

El enrutamiento por MAPA **no funciona** hasta que `CLAUDE.md` (en la raíz de la carpeta) le diga a Claude que lo use.
La skill crea o completa ese archivo. Sustituye `<memoria>` y `<mapa>` por los nombres reales del config. Si el `CLAUDE.md` ya
existe, **agrega** el bloque al final sin pisar lo existente y muéstraselo al usuario.

```
## Arranque y uso de la memoria (enrutamiento por MAPA)

La memoria de esta carpeta se consulta POR ENRUTAMIENTO, no leyéndola entera. Al iniciar cada conversación:

1. Ubicar. Lee primero `<mapa>` (raíz): índice + sub-índice de secciones gigantes + grafo dirigido. Contrasta la solicitud contra el índice (qué secciones toca) y contra el grafo (insumos aguas arriba, impactos aguas abajo, a 1 salto). No lo uses para leer la memoria completa.
2. Descender — el nivel más barato que baste: salta a la(s) sección(es) de `<memoria>` con Grep del título exacto que da el MAPA (si es gigante ⬛, solo el sub-bloque #### del sub-índice); si no basta, abre el archivo real de la carpeta; si falta información, pide aclaración. La memoria automática de Claude es apoyo, nunca respuesta única en algo no trivial.
3. Autoridad. Ante conflicto, dato con fecha sensible o salida a un tercero, prevalece lo marcado VIGENTE en la memoria + el archivo real.

Enruta por título (Grep), nunca por número de línea. Si el título que da el MAPA no aparece en la memoria, regenera el MAPA (skill contexto-pro-max-proyecto) antes de continuar.
```
