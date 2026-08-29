---
name: pptx-pro-max
description: >-
  Sistema de políticas y buenas prácticas internacionales para diseñar presentaciones PPTX
  de alto impacto profesional — siempre editables. Actívala cuando el usuario pida crear, armar,
  mejorar, rediseñar o revisar una presentación, deck, diapositivas, slides, "PowerPoint" o .pptx,
  en cualquier contexto (consultoría, pitch, junta directiva, licitación/banco multilateral, comité
  técnico, docencia, ventas, informe ejecutivo). No es una plantilla ni un motor nuevo: es la capa de
  DECISIÓN que gobierna narrativa, contenido, sistema visual, elección de gráfico y elección de
  plantilla, con su propio motor (pptxgenjs) y su propio validador reforzado para producir y verificar el
  archivo editable, sin depender de otras skills. Triggers: "hazme una presentación", "arma un deck", "mejora estas diapositivas",
  "pptx", "slides", "presentación ejecutiva", "pitch". Es agnóstica de marca; para aplicar identidad de
  una empresa, combínala manualmente con la skill de marca correspondiente.
---

# PPTX Pro Max — Sistema de decisión para presentaciones de alto impacto

## Qué es y qué no es

Esta skill es un **sistema de políticas**: convierte cada solicitud de presentación en una serie de
decisiones justificadas sobre **narrativa, contenido, diseño visual, datos y plantilla**, apoyadas en
fuentes internacionales de autoridad (Minto, Alley, Mayer, Duarte, Knaflic, Tufte, TED, WCAG) y en las
mejores prácticas de las consultoras. No inventa un motor propio.

- **Es autónoma.** Trae su propio motor (`pptxgenjs`, open source) y su propio **validador reforzado**
  (`scripts/validate_deck.py`), más el render con LibreOffice + poppler del entorno. No depende de ninguna
  otra skill. Los detalles técnicos del motor están en `references/07-motor-y-render.md`.
- **Todo lo que produce esta skill es un `.pptx` 100% editable** (texto, formas y gráficos nativos
  editables en PowerPoint). Si necesitas impacto visual máximo aceptando láminas no editables (imagen),
  esa es otra herramienta; esta no hace eso.
- **Es agnóstica de marca.** No asume ninguna identidad corporativa. Para vestir el deck con la marca de
  una empresa, el usuario invoca en paralelo la skill de marca que corresponda; esta skill no la menciona
  ni depende de ella.

## Principio rector

**La presentación es el apoyo de un ponente que domina el tema, no su reemplazo.** El orador lleva el
argumento; la lámina lleva la evidencia. De ahí se derivan las tres reglas que nunca se rompen:

1. **Una idea por lámina**, articulada en el título y probada por el cuerpo.
2. **Título-afirmación**: cada lámina de contenido se titula con una oración que afirma su conclusión
   (el "so what"), no con una etiqueta temática.
3. **Evidencia visual, no volcado de texto**: el cuerpo muestra un gráfico, imagen, diagrama o dato;
   nunca un párrafo que el orador leería en voz alta.

## El flujo de decisión (7 pasos)

Sigue este orden en toda presentación no trivial. Cada paso remite a un archivo de `references/` con el
detalle y las reglas numéricas. **No saltes al diseño visual antes de haber fijado narrativa y contenido.**

### Paso 0 — Activación y motor
Confirma que produces un `.pptx` editable. El motor es `pptxgenjs` y el control de calidad es el validador
propio `scripts/validate_deck.py` (+ render con LibreOffice/poppler). Ten a mano `references/07-motor-y-render.md`.

**Preparación automática del motor (no pidas al usuario que instale nada).** Antes de construir, decide
la **carpeta del deck** (donde vivirá y correrá el script `pptxgenjs`): usa la que el usuario indique o,
si no indica ninguna, el directorio de trabajo actual. Luego corre tú mismo, una sola vez por carpeta:
`node "<ruta-de-esta-skill>/scripts/ensure_engine.mjs" --dir "<carpeta_del_deck>"`
Es idempotente y usa la resolución de Node (carpeta + padres): instala `pptxgenjs` en
`<carpeta_del_deck>/node_modules` solo si no resuelve desde ahí ni desde ninguna carpeta padre; si el motor
ya está (en la carpeta o en una raíz superior preinstalada), no hace nada. No interrumpas el flujo para que
el usuario lo ejecute; hazlo como parte de la construcción y sigue. En **Cowork y Chat** el motor ya viene en
el entorno, así que el script solo confirma y sigue; en **Claude Code (versión desktop y versión CLI, ambas
en la máquina del usuario)** el motor no está y el script lo instala. Genera y ejecuta el script del deck **en
esa misma carpeta**, para que Node resuelva `pptxgenjs` desde ahí (o desde un padre).

### Paso 1 — Diagnóstico  → `references/01-diagnostico-narrativa.md`
Antes de escribir nada, determina: **audiencia** (quién entra, qué decide), **propósito** (decisión,
avance, arranque, formación, venta), **canal** (¿se leerá el deck sin el ponente presente, o lo narra en
vivo?), **tiempo** disponible y **dominio** del ponente. El canal es la decisión más determinante: fija la
densidad de cada lámina (ver la tabla "leído vs hablado" en la referencia). Si falta información de alto
impacto y hay con quién consultar, pregunta; si trabajas sin supervisión, asume lo más razonable y decláralo.

### Paso 2 — Narrativa  → `references/01-diagnostico-narrativa.md`
Construye el argumento **en texto, antes de tocar una lámina**:
- Define la **Idea Gobernante** (Big Idea) en una sola oración: tu postura + lo que está en juego para la audiencia.
- Estructura el arranque con **SCQA** (Situación → Complicación → Pregunta → Respuesta).
- Deriva **3–5 pilares MECE** (mutuamente excluyentes, colectivamente exhaustivos), cada uno con 2–3 evidencias.
- Escribe el **título-afirmación** de cada lámina y córrelos en secuencia: el **test del deck fantasma**
  (leer solo los títulos debe contar toda la historia). Si no fluyen, arregla la estructura ahora.
- Elige la arquitectura de deck según propósito (ver plantillas de arco en la referencia).

### Paso 3 — Contenido por lámina  → `references/02-contenido-evidencia.md`
Aplica el diseño basado en evidencia: una idea por lámina, evidencia visual sobre viñetas
(assertion-evidence de Alley), no duplicar el canal verbal (redundancia de Mayer/Sweller), eliminar todo
lo que no aporta (coherencia), resaltar con moderación, y respetar los **límites de texto** (títulos ≤2
líneas; cuerpo mínimo legible; ≤3–5 unidades nuevas por lámina). Cada exhibit debe ganarse su lugar y
llevar anotada su conclusión.

### Paso 4 — Sistema visual  → `references/03-sistema-visual.md`
Elige una **dirección visual informada por el tema** (no el azul genérico por defecto): paleta
(dominancia 60-30-10), tipografía (jerarquía de 4 niveles, fuentes seguras, tamaños), retícula de 12
columnas, zona segura, y un motivo visual coherente. Verifica **contraste WCAG** (capa dura, no estética).
Respeta los **antipatrones prohibidos** (ver `references/03`): nada de líneas de acento bajo el
título, nada de franjas/barras decorativas, nada de fondos crema por defecto.

### Paso 5 — Datos y gráficos  → `references/04-datos-graficos.md`
Elige el gráfico por **intención comunicativa** (comparación, evolución, composición, distribución,
relación, ranking, desviación, flujo) con el selector de Abela + el Vocabulario Visual del FT, codificando
la magnitud con posición/longitud (Cleveland-McGill). Declutter (Knaflic), integridad gráfica (Tufte, eje
de barras desde cero), etiqueta directamente y anota el dato clave. Mantén los gráficos **nativos y
editables** (`addChart`), nunca como imagen.

### Paso 6 — Selección de plantilla  → `references/05-catalogo-plantillas.md`
Para cada lámina, usa el **catálogo** como árbol de decisión: lista 1–3 plantillas candidatas, elimina con
la cláusula "no usar cuando", y elige la superviviente por número de ítems, tipo de eje y audiencia.
**Escribe una línea de justificación por lámina** (qué plantilla y por qué esa y no la vecina). El catálogo
da el layout y el patrón `pptxgenjs` editable de cada una.

### Paso 7 — Construcción y QA triple  → `references/06-proceso-qa.md`
Construye con `pptxgenjs` (gotchas en `references/07`). Luego corre **tres controles**:
- **QA de comunicación**: test del deck fantasma, "so what" por lámina, disciplina de exhibit, límites de texto, una idea por lámina.
- **QA técnico**: `python3 scripts/validate_deck.py salida.pptx` — errores que rompen PowerPoint (charts, XML, rels, colores) **más** contraste WCAG, placeholders, fuentes y antipatrones.
- **QA visual**: render a imágenes y revisión lámina por lámina (overflow, solapes, contraste, alineación). Corrige y re-renderiza solo lo que tocaste.

## Reglas duras (no-negociables)

Estas se aplican siempre, con respaldo de evidencia (detalle y fuentes en las referencias):

- **Título-afirmación** en toda lámina de contenido (oración con verbo, específica, cuantificada cuando aplique).
- **Una idea por lámina**; si el título necesita "y" con dos conclusiones, son dos láminas.
- **Nunca texto idéntico a lo que se dice en voz alta**; nunca leer viñetas palabra por palabra (efecto de redundancia).
- **Eliminar el ruido**: fuera clip-art, música, logos repetidos, grillas pesadas, adornos (principio de coherencia).
- **Eje de barras siempre desde cero** (integridad gráfica; truncarlo miente sobre la proporción).
- **Contraste WCAG AA**: ≥4.5:1 texto normal, ≥3:1 texto grande; el color nunca es el único portador de significado.
- **Editable siempre**: gráficos nativos, texto real; jamás una lámina pegada como imagen.
- **Cero antipatrones de diseño**: sin líneas de acento bajo títulos, sin franjas/barras decorativas, sin fondos crema.

## Honestidad (mitos que NO se codifican)

Esta skill se basa en evidencia; por eso **rechaza** estos mitos frecuentes:
- La "regla 7×7 / 6×6" (máx. viñetas × palabras) es folclore sin respaldo; la evidencia dice **eliminar** las
  viñetas, no contarlas. Úsala solo como techo de emergencia, no como meta.
- Las cifras tipo "recordamos 10% de lo que leemos / 65% de lo que vemos" no tienen respaldo sólido; no las cites como dato.
- Los tamaños de efecto de Mayer varían entre meta-análisis; trátalos como rangos, no como constantes.
- El método assertion-evidence mejora comprensión y retención, pero puede reducir el recuerdo de datos
  *accesorios*: por eso los datos que importan deben estar explícitos en la lámina.

## Archivos de referencia

Léelos bajo demanda según el paso en que estés:

- `references/01-diagnostico-narrativa.md` — diagnóstico de audiencia/propósito/canal y arquitectura del
  mensaje (Minto/pirámide/SCQA, storyline de consultoras, Duarte, títulos-afirmación, arcos de deck).
- `references/02-contenido-evidencia.md` — diseño de lámina basado en evidencia (Alley assertion-evidence,
  Mayer 12 principios, carga cognitiva de Sweller, Reynolds), con límites numéricos.
- `references/03-sistema-visual.md` — color, tipografía, retícula, accesibilidad WCAG, motivo visual y antipatrones.
- `references/04-datos-graficos.md` — selección de gráfico por intención, Cleveland-McGill, declutter de
  Knaflic, integridad de Tufte, tablas y big numbers.
- `references/05-catalogo-plantillas.md` — catálogo de plantillas editables de negocio con "usar/no usar cuando" y patrón `pptxgenjs`.
- `references/06-proceso-qa.md` — proceso de construcción y el triple QA (comunicación + técnico con el validador propio + visual), con checklist.
- `references/07-motor-y-render.md` — motor `pptxgenjs` (dependencias y gotchas) y render a imágenes; todo autónomo.
