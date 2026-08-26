# 03 · Layout y arquetipos de lámina

## Contrato del lienzo
- **1600×900 px** exactos (16:9). Nada se sale.
- **Zona segura**: contenido primario dentro de `inset: 96px 130px` (clase `.safe` de `assets/slide-frame.css`).
  El **fondo** (color, gradiente, imagen, formas) puede ir **a sangre**; el **texto** no cruza la zona segura.
- **Retícula de 12 columnas** mental (helpers `.grid-12`, `.grid-2`, `.grid-3`); alinea a ella.
- **Jerarquía de 3–4 niveles** por lámina: kicker/eyebrow · título · apoyo · pie. Un salto de escala claro entre
  cada nivel (p. ej. título 88–120px, apoyo 26–30px, pie 16–18px).
- **Un foco** por lámina. Espacio en blanco generoso: en alto impacto, el vacío es diseño.

## Estructura sándwich
Portada, divisores y cierre en **fondo pleno** (oscuro o color); contenido en fondos más claros o alternando.
Da ritmo y hace que los momentos clave respiren.

## Arquetipos (elige y varía)

**Portada.** Kicker + título grande a la izquierda o centrado; una línea de contexto; signature (filete, número,
forma). Cero desorden. → estilos oscuros o de color pleno.

**Afirmación / statement.** Una sola frase enorme ocupando la lámina; opcional una palabra en color de acento.
Para "si recuerdan una cosa…". Fondo pleno.

**Dato-héroe (big number).** Una cifra gigante (160–320px) + etiqueta corta + contexto pequeño (comparación,
periodo). El número es el foco; el resto minúsculo. Nunca un número sin contexto.

**Comparación / antes-después.** Dos zonas (grid-2) con la misma estructura; el lado "después/mejor" en acento.
Flecha o separador mínimo. Evita recargar ambos lados.

**Áreas / pilares (2–4).** Tarjetas o columnas con un ícono/numeral, un título corto y una línea. ≤4 elementos;
si son 5+, replantea. Los numerales solo si el orden **significa** algo.

**Datos / gráfico.** Un solo gráfico, construido en HTML/CSS/SVG, con el dato clave resaltado en acento y el
resto atenuado. Etiqueta directa (no leyenda aparte). Eje de barras desde cero. Un título que afirma el hallazgo.

**Cita / voz.** Una cita breve en grande, atribución pequeña. Comilla o marca tipográfica como signature. Una
sola cita por lámina.

**Proceso / línea de tiempo.** 3–5 pasos en secuencia horizontal; numeral por paso (aquí el orden sí informa).
Conector fino. Texto por paso, telegráfico.

**Imagen a sangre + overlay.** Foto/ilustración a pantalla completa (`.bleed`) con un `.overlay` (degradado o
capa de color a baja opacidad) para garantizar contraste del texto encima. Texto en una esquina, en zona segura.

**Divisor de sección.** Número o título de sección grande sobre fondo pleno; una línea de subtítulo. Orienta.

**Cierre.** Recapitulación en 1–3 líneas + llamada a la acción + contacto/URL/QR. Fondo pleno (cierra el sándwich).

## Reglas de composición
- Alinea todo a la retícula; evita posiciones "a ojo" inconsistentes entre láminas.
- Mantén **zonas fijas** (dónde va el kicker, el pie) iguales en todas las láminas del deck.
- Contraste figura-fondo alto; si el fondo es una imagen, siempre `.overlay` bajo el texto.
- No más de **dos** familias tipográficas visibles; la utilidad (mono/estrecha) solo para datos/etiquetas/pies.
- Si dudas entre añadir un elemento o quitarlo, **quítalo** (regla de "una pieza menos").
