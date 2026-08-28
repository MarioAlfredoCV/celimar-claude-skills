# Instrucción del proyecto para pegar (setup obligatorio, Cowork)

El enrutamiento por MAPA **no funciona** hasta que esta instrucción esté en la configuración del
proyecto. La skill **no puede editarla**: entrega el texto y guía al usuario a pegarlo. Sustituye
`<memoria>` y `<mapa>` por los nombres reales del config.

## Para el proyecto de Cowork / Claude Code

```
## Arranque y uso de la memoria (enrutamiento por MAPA)

La memoria del proyecto se consulta POR ENRUTAMIENTO, no leyéndola entera. Al iniciar cada conversación:

1. Ubicar. Lee primero `<mapa>` (raíz del proyecto): índice + sub-índice de secciones gigantes + grafo dirigido. Contrasta la solicitud contra el índice (qué secciones toca) y contra el grafo (insumos aguas arriba, impactos aguas abajo, a 1 salto).
2. Descender — el nivel más barato que baste: salta a la(s) sección(es) de `<memoria>` con Grep del título exacto que da el MAPA (si es gigante ⬛, solo el sub-bloque #### del sub-índice); si no basta, abre el archivo real de la carpeta; si falta info, pide aclaración. La memoria automática de Claude es apoyo, nunca respuesta única en algo no trivial.
3. Autoridad. Ante conflicto, dato con fecha sensible o salida a un tercero, prevalece lo marcado VIGENTE en la memoria + el archivo real.

Enruta por título (Grep), nunca por número de línea. Si el título que da el MAPA no aparece en la memoria, regenera el MAPA antes de continuar.
```

---

*Aprovechamiento avanzado (no parte de la skill base):* llevar este mismo contexto a un **proyecto
gemelo en Claude Chat** —para consultarlo desde el móvil— requiere respaldar la memoria y el MAPA en
un **repo privado de GitHub** y pegar una instrucción distinta en el proyecto de Chat. La **Wiki** de
esta skill lo explica en detalle, incluyendo cómo extender la skill (con skill-creator) para que suba
la memoria y el MAPA a GitHub.
