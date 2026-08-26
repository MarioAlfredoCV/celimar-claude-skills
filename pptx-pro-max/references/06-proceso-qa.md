# 06 · Proceso de construcción y control de calidad

Esta skill es **autónoma**: el motor (`pptxgenjs`), el validador propio (`scripts/validate_deck.py`) y el
render (LibreOffice + poppler) están todos dentro de la skill o en el entorno. Detalles del motor y del
render en `references/07-motor-y-render.md`.

---

## A. Proceso de construcción

1. **Narrativa antes que diseño.** Cierra los pasos 1–2 del flujo (diagnóstico + argumento en texto con
   títulos-afirmación que pasan el test del deck fantasma). No abras el editor antes.
2. **Mapa lámina→plantilla.** Con `references/05`, asigna a cada título su plantilla y escribe la línea de
   justificación. Varía las plantillas; no pongas todo en "título + viñetas".
3. **Construye con `pptxgenjs`** siguiendo los *gotchas* de `references/07` (layout antes de las láminas,
   hex de 6 dígitos, `isTextBox:true`, `margin:0`, gráficos nativos vestidos, apiladas con `ctr`/`inEnd`).
4. **Edición sobre plantilla del usuario**: usa el flujo unzip → editar XML → rezip de `references/07`,
   respetando el estilo de la plantilla por encima de las paletas de arranque.

---

## B. QA de comunicación (propio de esta skill) — hazlo primero

Antes del QA técnico, audita el argumento:

- **Deck fantasma**: lee solo los títulos en orden. ¿Cuentan la historia completa (Situación-Complicación-
  Resolución)? Si no, arregla títulos/estructura.
- **"So what" por lámina**: cada una responde "¿por qué le importa a la audiencia ahora?". Si no, al apéndice o fuera.
- **Una idea por lámina**: ningún título con "y" que esconda dos conclusiones.
- **Título-afirmación**: pasa el checklist de 7 chequeos de `references/01`.
- **Disciplina de exhibit**: un exhibit por lámina, hallazgo anotado, cita si el dato es ajeno.
- **Límites de texto**: título ≤2 líneas; cuerpo ≥20 pt (30 en pitch); ≤~40 palabras; ≤3–5 unidades nuevas.
- **Presupuesto de láminas** coherente con el tiempo; versión de 5 minutos identificada.

---

## C. QA técnico (validador propio) — obligatorio

El validador `scripts/validate_deck.py` es autónomo (solo `python-pptx` + `lxml`). Cubre los defectos que
PowerPoint rechaza **y** capas de calidad que otros validadores no miran.

```bash
python3 scripts/validate_deck.py salida.pptx           # informe completo
python3 scripts/validate_deck.py salida.pptx --strict   # trata las advertencias como errores
```

**Qué comprueba:**

- **Errores (hacen fallar):** el archivo no abre / no es OOXML de presentación válido · XML mal formado ·
  gráfico con `dLblPos=outEnd` en barras apiladas · gráfico que declara menos de 2 ejes · colores hex
  inválidos (con `#`, longitud ≠ 6 o no-hex) · relación `.rels` con Target interno inexistente · marcador de
  plantilla sin reemplazar (lorem/ipsum/xxx/[insert]/[Description]…) · presentación sin diapositivas.
- **Advertencias (calidad/comunicación/accesibilidad):** contraste texto/fondo bajo WCAG AA (4.5:1 / 3:1) ·
  fuente por debajo del piso · tipografía fuera de la lista segura (recuerda incrustar) · cuadro de texto sin
  `txBox='1'` · posible franja/barra decorativa de ancho casi completo · `<p:notesMasterIdLst>` antes de
  `<p:sldIdLst>`.

Corrige cada error en el generador y vuelve a validar. Trata las advertencias como deuda de calidad: en un
entregable serio, apunta a **cero advertencias** (usa `--strict` para forzarlo).

---

## D. QA visual — obligatorio

Renderiza y revisa lámina por lámina (comandos en `references/07`):

```bash
soffice --headless --convert-to pdf salida.pptx && rm -f slide-*.jpg && pdftoppm -jpeg -r 150 salida.pdf slide
ls -1 "$PWD"/slide-*.jpg
```

Abre las imágenes con la herramienta de lectura (mejor con mirada fresca o un subagente) y busca: texto que
se desborda o se corta, elementos solapados, cita/pie chocando con el contenido, gráficos con etiquetas
encimadas, columnas desalineadas, contraste bajo, márgenes <0.5". Corrige en el generador y **re-renderiza
solo lo que tocaste**. Repite hasta que no queden defectos visibles.

> Si `soffice`/`pdftoppm` no están disponibles, dilo en el reporte: el deck no fue verificado visualmente.

---

## E. Checklist final

```
COMUNICACIÓN
□ Cada lámina de contenido tiene título-afirmación (oración, "so what")
□ Test del deck fantasma: los títulos solos cuentan la historia
□ Una idea por lámina; un exhibit por lámina; hallazgo anotado
□ Resumen ejecutivo construido al final; recomendación clara y temprana (según canal)
□ Presupuesto de láminas acorde al tiempo; versión de 5 min lista

VISUAL
□ Dirección visual informada por el tema (no azul por defecto); paleta 60-30-10 coherente
□ Jerarquía tipográfica de 4 niveles; ≤2 familias; cuerpo ≥20 pt (30 en pitch)
□ Retícula/zonas consistentes; márgenes ≥0.5"; contenido en el 80% central
□ SIN líneas de acento bajo títulos, SIN franjas/barras decorativas, SIN fondos crema
□ Gráficos nativos vestidos; eje de barras desde cero; etiqueta directa; un color de acento

ACCESIBILIDAD
□ Contraste ≥4.5:1 (texto normal) / ≥3:1 (texto grande) en cada par texto/fondo
□ El color no es el único portador de significado (etiqueta/ícono/forma)

TÉCNICO
□ validate_deck.py sin errores (idealmente sin advertencias, o con --strict)
□ Revisión visual lámina por lámina hecha; sin overflow/solapes/desalineación
□ Archivo editable (texto y gráficos nativos); ningún slide pegado como imagen
```

---

## F. Reporte al usuario

Al entregar: la ruta del `.pptx`, una lista numerada de láminas con su plantilla y la justificación de una
línea, los supuestos/placeholders que dejaste (qué cifras vienen del usuario y cuáles ilustraste), y una
invitación a iterar. No narres el proceso; lidera con el resultado.
