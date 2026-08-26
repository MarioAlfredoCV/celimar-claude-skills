# 03 · Sistema visual: color, tipografía, retícula, accesibilidad

El diseño se decide **después** de la narrativa y el contenido, nunca antes. La meta es una lámina que se
vea intencional y "trabajada por alguien experto" (la disciplina de craftsmanship de canvas-design, aplicada
a un deck editable), no una plantilla anónima.

---

## A. Dirección visual informada por el tema

Elige una dirección visual que sirva a ESTE contenido; si la misma paleta funcionaría igual en una
presentación de otro tema, no fue una elección específica. Define una vez: paleta, tipografía, motivo
visual y tratamiento de fondo, y **repítelos en todo el deck** (parecido de familia).

- **Estructura "sándwich"**: fondos oscuros para portada, divisores y cierre; fondos claros para el
  contenido. O comprométete a oscuro en todo el deck para un aire premium.
- **Un motivo visual**: escoge UN elemento distintivo y repítelo (marcos de imagen redondeados, iconos en
  círculos de color). **No uses una barra o franja de color como motivo** (ver antipatrones).

---

## B. Color

**Regla 60-30-10**: 60% color dominante/fondo (neutro), 30% secundario (texto, subtítulos, iconos), 10%
acento (dato clave, CTA, énfasis). El dominante fija el tono; el acento dirige la mirada.

- **Dominancia sobre igualdad**: un color manda; 1–2 de apoyo; un acento nítido. Nunca todos con el mismo peso.
- **No el azul genérico por defecto**: se lee como plantilla anónima. Elige una paleta que refleje el tema.
- **Contraste figura-fondo alto**: fondo oscuro ⇒ texto claro + acentos brillantes; fondo claro ⇒ texto
  oscuro + acentos saturados. El texto debe "flotar", no fundirse (los proyectores bajan contraste real).
- **Combinaciones a evitar**: rojo+verde (chocan y son problemáticas para daltonismo), naranja+azul (vibran),
  rojo+azul (contraste pobre). Nada de fondos con patrones/degradados/fotos de tono variable detrás del texto.

**Paletas de arranque** (dominante · secundario · acento) — elige por tema, no por defecto:

| Tema | Dominante | Secundario | Acento |
|---|---|---|---|
| Ejecutivo nocturno | `1E2761` navy | `CADCFC` azul hielo | `FFFFFF` blanco |
| Bosque | `2C5F2D` | `97BC62` | `F5F5F5` |
| Coral | `F96167` | `F9E795` | `2F3C7E` |
| Terracota | `B85042` | `E7E8D1` | `A7BEAE` |
| Océano | `065A82` | `1C7293` | `21295C` |
| Carbón minimal | `36454F` | `F2F2F2` | `212121` |
| Teal confianza | `028090` | `00A896` | `02C39A` |
| Cereza | `990011` | `FCF6F5` | `2F3C7E` |

(Recuerda: hex sin `#` y sin 8 dígitos en `pptxgenjs`; motor en `references/07`.)

---

## C. Tipografía

- **Jerarquía de 4 niveles**, consistente en todo el deck: Título > Encabezado de sección > Cuerpo > Nota/caption.
- **Máximo 2 familias** (una para título, otra para cuerpo); alternativa más segura: 1 familia con contraste
  por peso y escala. Emparejamiento fiable: serif en título + sans en cuerpo.
- **Fuentes seguras** (rinden fieles y vienen con Office): Arial, Calibri, Cambria, Times New Roman, Century
  Schoolbook, Bookman Old Style. Para títulos con carácter sin riesgo, empareja una serif segura (Cambria,
  Bookman, Century Schoolbook) con una sans segura (Calibri/Arial). **Nunca Aptos por defecto** (sin
  sustituto métrico fiable). Si usas una fuente custom, hay que incrustarla.

| Elemento | Tamaño |
|---|---|
| Título de lámina | 28 pt (mín. 24), negrita |
| Encabezado de sección | 20–24 pt, negrita |
| Cuerpo | **20 pt piso** (charla/negocio); 28 pt en sala grande |
| Etiquetas de gráfico / call-out | 14–18 pt |
| Nota / cita al pie | 12–14 pt, atenuada |

- Pitch de inversión: cuerpo ≥30 pt (Kawasaki). Verificación objetiva de legibilidad por distancia (regla
  8H): altura mínima del texto (pulgadas) ≈ distancia a la última fila ÷ 400.
- Evita: pesos ultralight/thin en cuerpo, TODO EN MAYÚSCULAS en párrafos, >3 tamaños por lámina.

---

## D. Retícula, márgenes y zona segura

- **Retícula de 12 columnas** (divisible en 6+6, 4+4+4, 3+3+3+3): alinea todo a ella.
- **Márgenes** ≥0.5"; contenido crítico dentro del **80% central** (zona segura, tolera recortes de pantalla).
- **Zonas fijas** en posición idéntica en cada lámina (definidas en el patrón maestro): título, contenido,
  pie/número. El ojo no debe "recalibrar" en cada lámina.
- Lienzo **`LAYOUT_WIDE` (13.33" × 7.5")** por defecto; fija `pres.layout` **antes** de añadir láminas.
- Espaciado consistente: 0.3"–0.5" entre bloques; deja aire, no llenes cada pulgada.

---

## E. Accesibilidad (capa dura, verificable — no es estética)

- **Contraste WCAG AA**: texto normal ≥ **4.5:1**; texto grande (≥18 pt, o ≥14 pt negrita) ≥ **3:1**. Verifica
  cada par texto/fondo con un contrast checker.
- **El color nunca es el único portador de significado** (WCAG 1.4.1): añade etiqueta, ícono, forma o patrón.
  Afecta a ~8% de los hombres (daltonismo rojo-verde).
- En gráficos: etiqueta las series **directamente** (no solo por color de leyenda); usa forma/posición como
  codificación redundante. Prefiere paletas colorblind-safe (ColorBrewer, Viridis, Okabe-Ito); **azul/naranja
  antes que rojo/verde** para estados.

---

## F. Antipatrones prohibidos

- **NUNCA líneas de acento bajo el título** (sello de lámina hecha por IA); usa espacio en blanco o color de fondo.
- **NUNCA franjas/barras decorativas**: ni bandas de encabezado/pie a lo ancho, ni barras laterales, ni
  filetes al borde de una tarjeta, ni "bordes de un solo lado". Para separar una tarjeta: tinte de fondo sutil,
  sombra suave o un ícono, no una raya al borde.
- **No fondos crema/beige por defecto** (`F5F5DC`, `FAF0E6`, `FFF8E1`…): usa blanco o la paleta elegida.
- No centrar el cuerpo de texto (solo los títulos); no repetir el mismo layout en todas las láminas; no texto
  de bajo contraste; no dejar texto que se desborde de su caja.

---

## Fuentes
- 60-30-10 (freeCodeCamp, Wix); figura-fondo (Think Outside The Slide).
- Tipografía: BrightCarbon (tamaños), Presentation Guild (regla 8H), PresentationGO (pairing/incrustación).
- Retícula/consistencia: PageOn (12 columnas, zonas); TED (consistencia visual).
- WCAG 1.4.3 / 1.4.1 (W3C); paletas colorblind-safe (NCEAS/UCSB, Okabe-Ito).
- Motor, gotchas y render: `references/07-motor-y-render.md`.
