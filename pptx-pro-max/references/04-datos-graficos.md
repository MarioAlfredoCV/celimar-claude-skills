# 04 · Datos y gráficos

Los gráficos van **nativos y editables** (`addChart` de `pptxgenjs`), nunca como imagen. Solo los tipos que
PowerPoint no soporta de forma nativa (Sankey, red, cascada compleja) se insertan como imagen.

---

## A. Fundamento perceptual (Cleveland-McGill) — la raíz de todo

El ojo estima con más exactitud unos canales que otros. Codifica la magnitud **más importante** con el canal
más alto disponible:

1. Posición en escala común (barras desde el mismo eje) · 2. Posición en escalas no alineadas · 3. Longitud ·
4. Ángulo/pendiente · 5. Área · 6. Volumen · 7. Color/saturación.

Consecuencia dura: para comparar con precisión, **una barra vence a una torta** (la torta obliga a comparar
ángulos/áreas). Evita pedir comparaciones de área/volumen cuando la precisión importa.

---

## B. Selección del gráfico por intención comunicativa

Primero nombra la **intención**, luego elige la familia:

| Intención | Cuándo | Gráfico |
|---|---|---|
| **Comparación entre ítems** | Ranking o magnitud entre categorías | Barras (horizontal si etiquetas largas / muchas), **ordenadas por valor** |
| **Evolución en el tiempo** | Tendencia | Línea (muchos puntos) · columnas (pocos periodos) |
| **Composición estática** | Partes de un todo, un momento | Barra apilada 100% > torta; torta solo si ≤5 partes |
| **Composición en el tiempo** | Mezcla que cambia | Apilada 100% (solo relativo) · apilada/área (importan absolutos) |
| **Acumulación paso a paso** | Suma/resta hacia un total | Cascada (waterfall) |
| **Relación** | Correlación 2–3 variables | Dispersión (2 var) · burbujas (3 var) |
| **Distribución** | Forma, frecuencia, sesgo | Histograma · boxplot para comparar distribuciones |
| **Desviación** | +/- respecto a una referencia | Barras divergentes, columnas +/- con base cero |
| **Comparación en paralelo** | Muchos grupos, misma métrica | Small multiples (mini-gráficos, misma escala) |

Selector de Abela (resumen): comparación pocas categorías → columnas; muchas → barras; dos variables por ítem
→ columnas agrupadas o scatter; tiempo pocos periodos → columnas, muchos → línea.

---

## C. Declutter (Knaflic) — quitar lo que no aporta

Borra: bordes del gráfico, líneas de cuadrícula (o gris muy tenue), marcadores inútiles, etiquetas de eje
redundantes, decimales innecesarios, **leyendas separadas** (etiqueta directamente sobre el dato). Usa el
espacio en blanco; no estires el gráfico para "llenar".

**Dirigir la atención (atributos preatentivos):** por defecto todo en **gris**; reserva **un** color de
acento para el dato focal (contraste + aislamiento = el ojo va solo). Lo más importante y el título, arriba a
la izquierda (lectura en Z/F). El dato crucial, proporcionalmente más grande.

**El texto es la conclusión:** título de acción/takeaway en cada gráfico ("Las ventas cayeron 17%", no
"Ventas"); anota la conclusión sobre el punto relevante.

---

## D. Integridad gráfica (Tufte)

- **Maximiza el data-ink**: borra la tinta que no representa datos; rejillas y ejes tenues, al fondo.
- **Sin chartjunk**: nada de 3D sobre datos 2D, adornos, patrones vibrantes (moiré), rejillas pesadas.
- **Lie factor ≈ 1**: el tamaño del efecto dibujado = el tamaño del efecto en los datos. **Eje de barras
  siempre desde cero.** No uses área/volumen para una magnitud 1D. Series monetarias: unidades comparables
  (ajusta por inflación si aplica).
- **Small multiples** (misma escala y ejes) para comparar a través de una variable.

---

## E. Reglas de implementación (charts editables — motor en `references/07`)

Los gráficos de `pptxgenjs` salen "pelados" por defecto: hay que vestirlos.

- Pon `showTitle`+`title`, `showValue:true`+`dataLabelPosition`, `chartColors:[...]` de tu paleta.
- Aquieta el marco: `catAxisLabelColor`/`valAxisLabelColor` atenuados, `valGridLine:{color,size}` tenue,
  `catGridLine:{style:"none"}`, `showLegend:false` para una sola serie (mejor etiqueta directa).
- **Barra/columna apilada**: `dataLabelPosition` debe ser `ctr`/`inEnd`/`inBase` (`outEnd` **corrompe** el archivo).
- **Combo con eje secundario**: exige `valAxes` **y** `catAxes` con dos entradas cada uno, o PowerPoint
  descarta el gráfico y reporta el archivo como corrupto.
- Tras generar, corre `scripts/validate_deck.py`: reporta estas fallas de chart (y las de accesibilidad).

---

## F. Tablas en diapositivas

- Números **alineados a la derecha** (misma unidad y decimales); texto a la izquierda. Encabezados en minúscula
  tipo oración, breves.
- **Bordes mínimos**: solo reglas horizontales finas y tenues (bajo el encabezado, sobre la fila de totales);
  nada de líneas verticales. Usa el espacio en blanco y la similitud de color de fila (Gestalt) para agrupar.
- Ordena filas por valor (no alfabético, salvo búsqueda). Redondeo consistente por columna. Resalta la
  fila/celda clave. Considera **heat table** (color condicional) para añadir magnitud preatentiva.
- Mantén la tabla pequeña en pantalla (~≤6–8 filas, pocas columnas); lo grande va a apéndice/handout.
- Prefiere **gráfico sobre tabla** para tendencias/comparaciones; reserva la tabla para valores exactos que importan.

---

## G. Big number / stat callout (tarjetas KPI)

- **Un** número primario, el elemento más grande; el ojo aterriza en la cifra, luego el veredicto, luego el contexto.
- **Redondea** con sufijos K/M/B ("518M", no "517.893.412"); decimales y unidades consistentes en todos los callouts.
- Da **siempre** contexto/benchmark (objetivo, periodo anterior, YoY) y muestra la brecha en absoluto y en %.
- **Colorea el veredicto (la variación), no el número principal**; acompaña el color con flecha/símbolo (no solo color).
- ≤5 KPIs por vista. Filtro de relevancia: incluye una métrica solo si "un cambio del 20% obligaría a actuar".

---

## H. Errores frecuentes de datos
Torta con muchas rebanadas o para series temporales; eje de barras truncado; 3D; doble eje-Y engañoso; línea
"espagueti" (>4–5 series sin resaltar una); leyenda separada en vez de etiqueta directa; número sin benchmark;
exceso de decimales; estado señalado solo por color.

---

## Fuentes
- Cleveland & McGill (jerarquía perceptual); FlowingData.
- Knaflic, *Storytelling with Data* (chart chooser, preattentive, declutter).
- Tufte, *The Visual Display of Quantitative Information* (data-ink, chartjunk, lie factor, small multiples).
- Abela, "Choosing a good chart"; Financial Times, *Visual Vocabulary*.
- Gotchas de charts y motor: `references/07-motor-y-render.md`.
