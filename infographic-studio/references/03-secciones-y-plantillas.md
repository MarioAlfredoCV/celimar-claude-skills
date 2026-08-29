# 03 · Secciones y plantillas

## Contrato del lienzo
- **Ancho fijo 1200px**; alto **libre** — crece con el contenido, el motor lo captura completo
  (`fullPage`, ver `references/05`). Nada se recorta ni se sale por los lados.
- **Zona segura horizontal**: contenido primario dentro de `padding: 0 84px` (clase `.safe` de
  `assets/canvas-frame.css`). El fondo de una sección puede ir a sangre (`.section.bleed-bg` respeta el
  margen solo en el texto); el texto no cruza los 84px laterales.
- **Ritmo vertical**: cada sección usa `.section` (72px de aire arriba/abajo) o `.section.tight` (40px)
  para secciones más ligadas a la anterior. Mantén el ritmo consistente en toda la pieza.
- **Jerarquía de 3 niveles** por sección: titular · dato/visual central · apoyo. Salto de escala claro.
- Ancho fijo → si necesitas comparar dos o más columnas, se resuelven **dentro** de los 1200px
  (`.grid-2`, `.grid-3`), nunca ensanchando el lienzo.

## Estructura general de la pieza
Encabezado (hook) arriba → cuerpo en secciones apiladas, alternando tratamiento de fondo para dar ritmo
a lo largo del scroll (igual que la "estructura sándwich" de un deck, pero en una sola pieza continua) →
pie con fuentes al final. La pieza se lee de arriba hacia abajo como un argumento completo, no como
láminas sueltas.

## Tipos de sección (elige y combina)

**Encabezado / hook.** Kicker + título grande + una línea de contexto; opcional una cifra ancla que
resuma la pieza entera. Es la primera impresión — debe decir de qué trata y por qué importa en una
mirada.

**Bloque de dato (stat-block).** Una cifra gigante + etiqueta corta + contexto (comparación, periodo) +
fuente en pequeño. Puede repetirse en grid (`.grid-2`/`.grid-3`) para encadenar 2–6 datos relacionados
en una sección. Nunca un número sin contexto ni fuente.

**Comparación / antes-después.** Dos (o más) columnas paralelas con la misma estructura; el lado
destacado en acento. Útil para "esto vs. aquello" o "antes vs. después".

**Línea de tiempo / proceso.** Pasos en secuencia — verticales si son muchos (aprovecha que el alto es
libre) u horizontales dentro del ancho fijo si son pocos (3–4). Numeral por paso; conector fino; texto
telegráfico.

**Lista con íconos / pilares.** Grid de 2–4 tarjetas con ícono/numeral + título corto + una línea. Si
son 5+, replantea o divide en dos secciones.

**Gráfico de datos.** Un gráfico construido en HTML/CSS/SVG (barra, línea, donut), con el hallazgo
clave resaltado en acento y el resto atenuado. Etiqueta directa sobre el dato, no leyenda aparte. Eje de
barras desde cero. Fuente del dato visible.

**Mapa o diagrama.** Cuando el contenido es geográfico o de sistema. El CSS puro rinde mal para mapas
reales — evalúa con `references/04` si conviene una imagen/SVG aportado o generado, en vez de forzarlo
en HTML/CSS puro.

**Cita.** Una cita breve destacada, atribución pequeña. Úsala con moderación — una infografía no es un
collage de testimonios.

**Pie con fuentes.** Sección final (`.sources`) que consolida todas las fuentes citadas a lo largo de
la pieza, más créditos si aplica. Casi ninguna infografía seria debería omitirlo.

## Reglas de composición
- Alinea todo a los 1200px y a la zona segura; nunca uses posiciones "a ojo" que rompan el ancho.
- Alterna tratamiento de fondo entre secciones consecutivas para dar ritmo a una pieza larga — evita
  que se sienta como un solo bloque monótono de scroll.
- Contraste figura-fondo alto en cada sección; si el fondo es una imagen, `.overlay` bajo el texto.
- No más de dos familias tipográficas visibles; la utilidad (mono/estrecha) para datos, etiquetas y
  fuentes.
- Si dudas entre añadir una sección o fusionarla con la anterior, **fusiónala** — menos secciones, cada
  una con más peso, se lee mejor que muchas secciones diminutas.
