# 05 · Catálogo de plantillas editables

Cada lámina se resuelve eligiendo la plantilla correcta. Úsalo como **árbol de decisión**: por cada lámina,
lista 1–3 candidatas, elimina con "no usar cuando", y elige la superviviente por número de ítems, tipo de eje
y audiencia. **Escribe una línea de justificación por lámina** (qué plantilla y por qué esa y no la vecina).

Todo es `pptxgenjs` **editable** en lienzo `LAYOUT_WIDE` (13.33" × 7.5"). Convención de layout de esta skill:
título en `x:0.6, y:0.4, w:12.1`; contenido desde `y:1.5`; márgenes ≥0.5"; **sin regla ni filete bajo el
título** (se separa con espacio en blanco — este es un antipatrón prohibido, a diferencia de otras plantillas
de consultoría). Colores desde la paleta elegida en `references/03`.

---

## Cómo elegir entre plantillas parecidas (reglas rápidas)

- **Estructura del deck**: primera página → `cover`; cambio de capítulo → `section_divider`; índice → `agenda`.
- **Un número es el punto** → `stat_hero`. Varios números en mosaico → `kpi_dashboard`. KPIs por área con
  objetivo/real + estado → `status_table`.
- **3 vs 5 vs 7 ítems** → `three_themes` / `areas_overview` (5–7).
- **Serie temporal (una métrica)**: tendencia plana + una tasa → `col_simple`; quiebre → `col_split`;
  pronóstico → `col_forecast`. Multi-serie continua → `line_multi`.
- **Barras categóricas**: ordenadas con un foco → `bar_comparison`. Dos escenarios por categoría →
  `col_grouped`. Partes de un todo por categoría → `col_stacked`.
- **Matriz/2D**: dos ejes continuos → `bubble`; participación×crecimiento → `matrix_2x2` (portafolio);
  impacto×esfuerzo/tiempo → `priority_matrix`.
- **Opciones**: 2–4 opciones × criterios → `option_matrix` (Harvey balls); una opción +/- → `pros_cons`;
  antes/después → `two_column_compare`.
- **Jerarquía**: causas de un problema → `issue_tree`; reporte → `org_chart`; embudo/tamaño → `funnel`.
- **Roadmap**: 3 fases → `phases`; 4 olas en flecha → `roadmap_waves`; 10+ semanas paralelas → `gantt`;
  4–6 pasos lineales → `process_flow`.
- **Resumen**: conclusiones estructuradas → `exec_takeaways`; una sola afirmación → `statement_slide`.

---

## Estructurales

**`cover`** — portada. *Usar*: todo deck. *Layout*: fondo oscuro del tema; título (32–40 pt, negrita) a la
izquierda; subtítulo, cliente/fecha debajo; tag "CONFIDENCIAL" arriba-derecha si aplica. Sin adornos.

**`agenda`** — índice. *Usar*: deck >10 láminas o antes de cada sección. *No usar*: deck corto (overhead).
*Layout*: lista numerada de capítulos; resalta el activo con el color de acento (no con una barra).

**`section_divider`** — divisor de capítulo. *Usar*: decks largos, para orientar. *Layout*: fondo oscuro
(variación tonal del tema); número de sección grande atenuado + título de sección grande en blanco.

**`closing`** — cierre/recomendación. *Usar*: última lámina de contenido. *Layout*: fondo oscuro (cierra el
"sándwich"); 2–4 conclusiones numeradas; contacto/siguiente paso. **Queda en pantalla durante preguntas**;
nunca la sigas con "Gracias" ni una lámina en blanco.

```javascript
// cover — patrón de referencia
const P = { bg:"1E2761", ink:"FFFFFF", sub:"CADCFC" };
pres.layout = "LAYOUT_WIDE";
const s = pres.addSlide(); s.background = { color: P.bg };
s.addText("Título que afirma la tesis del deck", { x:0.7, y:2.4, w:9.5, h:1.6,
  fontFace:"Cambria", fontSize:36, bold:true, color:P.ink, isTextBox:true, margin:0 });
s.addText("Subtítulo · Cliente · Mes 2026", { x:0.7, y:4.1, w:9.5, h:0.5,
  fontFace:"Calibri", fontSize:16, color:P.sub, isTextBox:true, margin:0 });
```

---

## Resumen

**`exec_takeaways`** — resumen ejecutivo por conclusiones. *Usar*: el patrón más común; 2–4 conclusiones en
negrita, cada una con 2–3 viñetas, opcional recomendación final. *No usar*: una sola conclusión (→
`statement_slide`). *Construir al final del proceso*, cuando existen todas las láminas de soporte.

```javascript
// exec_takeaways — patrón de referencia (fondo claro)
const s = pres.addSlide(); s.background = { color:"FFFFFF" };
s.addText("Resumen ejecutivo", { x:0.6, y:0.4, w:12.1, h:0.7, fontFace:"Cambria",
  fontSize:28, bold:true, color:"1E2761", isTextBox:true, margin:0 });
const secs = [
  { t:"El mercado crece 22% anual y seguirá", b:["Norteamérica gana participación","Europa se estanca"] },
  { t:"Los actores locales deben reposicionarse", b:["Brecha de costo se amplía","Mezcla cambia a LFP"] },
];
let y = 1.6;
secs.forEach(sec => {
  s.addText(sec.t, { x:0.6, y, w:12.1, h:0.5, fontFace:"Calibri", fontSize:20, bold:true,
    color:"1E2761", isTextBox:true, margin:0 });
  s.addText(sec.b.map((x,i)=>({ text:x, options:{ bullet:true, breakLine:true } })),
    { x:0.9, y:y+0.55, w:11.5, h:1.0, fontFace:"Calibri", fontSize:16, color:"2D2D2D",
      isTextBox:true, margin:0, paraSpaceAfter:6 });
  y += 1.9;
});
```

**`statement_slide`** — una afirmación a fondo. *Usar*: un hallazgo clave merece su lámina ("si recuerdan una
cosa…"). *Layout*: fondo navy a sangre, texto blanco grande en negrita; opcional etiqueta pequeña arriba.
*No usar*: varias conclusiones (→ `exec_takeaways`).

---

## Narrativa y áreas

**`three_themes`** — exactamente 3 temas, cada uno con ícono (círculo de color) y 3–4 viñetas. *No usar*: 5
temas (→ `areas_overview`). **`areas_overview`** — 5–7 áreas en columnas con badge (A–G) y viñetas.
**`two_column_compare`** — antes/después, actual/futuro: dos tarjetas con flecha entre ellas (tarjetas con
tinte de fondo, **no** franja lateral). **`pros_cons`** — una opción, ✓ verde / ✗ rojo (con símbolo, no solo
color). **`option_matrix`** — 2–4 opciones × 3–6 criterios con Harvey balls (relleno 0–4); marca la
recomendada con "★" y color de acento en su columna.

---

## Datos (ver `references/04` para elegir el gráfico)

**`bar_comparison`** — una métrica en 5–12 categorías, ordenadas alto→bajo, una barra en color de acento (el
foco) y el resto atenuadas; panel de conclusión a la derecha. **`col_simple` / `col_split` / `col_forecast`**
— serie temporal de una métrica: una tasa / quiebre con dos tasas / histórico+pronóstico (histórico atenuado,
pronóstico en acento). **`line_multi`** — 1–4 líneas en el tiempo; resalta una en acento, resto en gris.
**`col_stacked`** — composición por categoría (etiquetas `ctr`/`inEnd`, nunca `outEnd`). **`status_table`** —
KPIs por área con objetivo/real y semáforo (verde/ámbar/rojo + etiqueta de texto). **`stat_hero`** y
**`kpi_dashboard`** — ver abajo.

```javascript
// stat_hero — un número es el punto
const s = pres.addSlide(); s.background={color:"FFFFFF"};
s.addText("US$1.2B", { x:0.6, y:2.2, w:7, h:1.6, fontFace:"Cambria", fontSize:96, bold:true,
  color:"1E2761", isTextBox:true, margin:0 });
s.addText("Impacto anual en ingresos hacia 2030", { x:0.65, y:3.9, w:7, h:0.6,
  fontFace:"Calibri", fontSize:20, color:"2D2D2D", isTextBox:true, margin:0 });
s.addText("Si se ejecutan las cinco acciones a tiempo.", { x:0.65, y:4.5, w:8, h:0.5,
  fontFace:"Calibri", fontSize:14, italic:true, color:"777777", isTextBox:true, margin:0 });
```

`kpi_dashboard`: 4–8 tarjetas; cada una con valor grande, delta (▲ verde / ▼ rojo / ▬) y línea de contexto.
Colorea el delta, no el número. ≤5 por vista si compiten por atención.

---

## Matrices y jerarquías

**`matrix_2x2`** — dos ejes categóricos con cuadrantes (p. ej. portafolio participación×crecimiento).
**`priority_matrix`** — iniciativas en impacto × esfuerzo/tiempo (bandas Bajo/Medio/Alto), color por estado;
resalta la celda de mayor prioridad. **`bubble`** — 5–15 entidades en dos ejes continuos, tamaño = tercera
variable; rompe solapes moviendo la etiqueta. **`issue_tree`** — descompone un problema raíz en drivers
(principal → secundario → subyacente), MECE. **`org_chart`** — estructura de reporte. **`funnel`** —
TAM/SAM/SOM o embudo de conversión (cada banda: nombre + valor + descripción a la derecha).

```javascript
// priority_matrix — esqueleto (rejilla 3x3 impacto x esfuerzo)
const s = pres.addSlide(); s.background={color:"FFFFFF"};
s.addText("Priorizar por impacto y esfuerzo enfoca los próximos 90 días",
  { x:0.6, y:0.4, w:12.1, h:0.8, fontFace:"Cambria", fontSize:26, bold:true, color:"1E2761",
    isTextBox:true, margin:0 });
// dibuja 3x3 celdas (RECTANGLE con tinte suave), ejes etiquetados a la izquierda/abajo,
// y coloca cada iniciativa como círculo (ROUNDED_RECTANGLE/ELLIPSE) con estado por color+etiqueta.
```

---

## Proceso y roadmap

**`process_flow`** — 4–6 pasos lineales (chevrons numerados alternando dos tonos, una línea por paso).
**`phases`** — exactamente 3 fases (chevron) con entregables y responsables. **`roadmap_waves`** — 4 olas en
una flecha horizontal con hitos. **`gantt`** — múltiples flujos paralelos a lo largo de muchas semanas
(filas × columnas de semana), hitos marcados. Regla: 3 fases → `phases`; 4 olas → `roadmap_waves`; 10+ semanas
paralelas → `gantt`.

---

## Voz

**`quote`** — una cita de cliente/experto: comilla grande, cita en itálica, atribución. *No usar*: muchas
citas (elige una, el resto al apéndice).

---

## Nota de construcción

Estos patrones son recetas de layout; escribe el código real siguiendo los *gotchas* de
`references/07-motor-y-render.md` (hex sin `#`, `isTextBox:true` en `addText`, `margin:0` para alinear, charts
vestidos, etc.). No copies código de paquetes de terceros; construye con `pptxgenjs` propio y valida con
`scripts/validate_deck.py`.
