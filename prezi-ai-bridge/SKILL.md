---
name: prezi-ai-bridge
description: Prepara el puente entre Claude y Prezi AI — a partir de material en bruto (texto pegado, notas, archivos adjuntos) que el usuario entregue, genera UN documento consolidado (prompt + contenido en un solo archivo) listo para pegar en un Word nuevo y subir a Prezi AI. Usar esta skill siempre que el usuario pida preparar, armar, consolidar o "pasar a limpio" contenido para Prezi o Prezi AI, mencione un "puente a Prezi", pida "el documento y el prompt para Prezi", o quiera convertir material disperso en una presentación de Prezi — incluso si no nombra la skill explícitamente.
---

# Prezi AI Bridge

Prezi AI no tiene conector directo con Claude (ni MCP, ni Zapier/Make/n8n, ni API pública de creación de contenido — verificado ago-2026). El único puente real es: **subir un documento de texto (PPTX/DOCX/PDF) + editar el texto extraído con instrucciones al inicio**, y dejar que Prezi AI genere el outline y el diseño. Esta skill produce ese documento único.

## Hallazgo crítico — por qué el archivo debe pasar por un Word real (verificado sep-2026)

Prezi rechaza con el error genérico "El tipo de archivo no es compatible" cualquier .docx generado **programáticamente**, sin importar el método: se probó con la librería `docx` de Node (docx-js), con `python-docx`, y con correcciones manuales de metadata y orden interno del zip (incluso logrando que el comando `file` de Unix clasificara el resultado como "Microsoft Word 2007+", igual que un archivo real) — todo fue rechazado. En cambio, **todo archivo guardado por una instancia real de Microsoft Word fue aceptado sin excepción**, incluidos archivos con el mismo contenido palabra por palabra que los rechazados.

Conclusión operativa, sin excepción: **esta skill nunca entrega un archivo para subir directo a Prezi.** Entrega el contenido para que el usuario lo pegue en un documento Word nuevo (creado y guardado por su propio Word), y solo ese documento pegado a mano se sube a Prezi. Recordar esto explícitamente en cada entrega (ver Paso 4).

## Cómo funciona realmente el flujo de subida en Prezi (verificado sep-2026)

En el flujo "Start from a file" de Prezi AI no existe un cuadro de prompt separado: al subir el documento, Prezi extrae su texto y lo muestra editable *antes* de generar — ese es el único lugar donde se puede inyectar una instrucción. Por eso el documento que arma esta skill lleva **una sola pieza**: el prompt como primer párrafo, envuelto entre `<<` y `>>`, iniciando con "Instrucciones concretas para la generación:", seguido de un párrafo en blanco y luego el contenido normal. Ya no se entregan dos archivos (contenido + prompt.txt) — un solo documento.

## Paso 1 — Reunir el contenido en bruto

Fuente: lo que el usuario pegue en el chat, adjunte como archivo(s), o dicte.

- Organizar en secciones con encabezados simples y claros — Prezi arma su outline a partir de esa estructura.
- Sin diseño, sin imágenes incrustadas. Cifras clave van como texto o tabla simple.
- Límite duro: Prezi AI procesa hasta 170.000 caracteres de texto por archivo subido. Si el material lo excede, resumir o priorizar antes de consolidar, y avisar al usuario qué quedó afuera y por qué.
- Si hay que extraer texto de un .docx existente, usar `pandoc -t markdown` para no reescribir de memoria — la instrucción de fidelidad del prompt (paso 3) pierde sentido si el propio insumo ya tiene errores de transcripción.

## Paso 2 — Redactar el prompt (fórmula validada con pruebas reales, sep-2026)

El prompt es el único control real que tiene el usuario sobre el resultado, dado que el documento en sí pierde todo el diseño. Sobre la estructura oficial de Prezi (tema, secciones, contexto, longitud, idioma explícito ≥6 palabras, instrucción de fidelidad), se agregan estos refuerzos — cada uno resuelve una falla observada en pruebas reales, no es un supuesto:

1. **Cantidad de láminas — aproximada, nunca estricta.** Escribir "usá alrededor de N diapositivas como referencia aproximada, no como límite estricto; si el detalle de alguna sección amerita dividirse en más láminas, está bien que lo hagas". Prezi tiene una naturaleza de zoom (anida sub-frames dentro de un frame padre); si se le exige un número EXACTO y a la vez se le pide preservar contenido secuencial detallado (cronogramas, pasos), tiende a fragmentar una sección en varias láminas adicionales para no perder detalle — el límite estricto y el detalle completo compiten entre sí. Cediendo en el número, ambas cosas mejoran.

2. **Títulos exactos, citados literalmente.** Sin esta instrucción, Prezi convierte sistemáticamente títulos-afirmación (que ya son la conclusión de la lámina) en etiquetas genéricas de tema — probado: 0 de 7 títulos se preservaron sin esta instrucción, 7 de 7 se preservaron con ella. Redactar así: "Usá exactamente estos N títulos para las láminas principales, en este orden y sin acortarlos ni convertirlos en etiquetas genéricas — cada título ya es la conclusión de esa diapositiva, no un tema", listándolos entre comillas.

3. **Cifras y datos críticos, restated explícitamente en el prompt** — no basta con que estén en el documento adjunto. Cifras derivables por cálculo (p. ej. una resta o suma simple) o cronogramas de varios pasos se pierden, se generalizan, o Prezi los recalcula por su cuenta si no se citan tal cual en la instrucción misma. Identificar 2-4 cifras o datos verdaderamente críticos del contenido y citarlos literalmente en el prompt, con la instrucción de que aparezcan "tal cual, sin generalizarlos, omitirlos ni reemplazarlos por una cifra calculada".

4. **Imágenes — instrucción de dos partes, ambas confirmadas necesarias por pruebas reales:**
   - Preferir ilustración o iconografía de estilo gráfico/abstracto sobre fotografía — es la opción que menos falla.
   - Si se usan fotografías, exigir que sean genéricas y de uso público, sin personas, banderas, monumentos, marcas o símbolos asociables a un país, gobierno, institución, evento o persona real y reconocible, y que ninguna imagen sugiera retratar a las personas reales de la organización.
   - Además (hallazgo de la tercera ronda de pruebas): ninguna imagen debe traer simbología, escritura o iconografía cultural de un país o región ajena al contexto real de la presentación; si se usa algún elemento con identidad cultural, que sea acorde al país o región donde ocurre lo que documenta la presentación; en caso de duda, preferir imágenes neutras sin ninguna marca geográfica o cultural.

   Sin esta instrucción, en pruebas reales Prezi insertó: una foto de una ceremonia diplomática real con banderas de otro país, un grupo de ejecutivos genéricos que podían confundirse con las personas reales del caso, y un emblema/logo de una organización cultural de un país totalmente ajeno al contexto de la presentación.

5. **Instrucción de fidelidad** (ya validada en rondas anteriores): agregar siempre *"Basate estrictamente en los datos, cifras y nombres del texto que aparece a continuación de esta instrucción; no inventes cifras ni ejemplos nuevos."*

### Nota de estilo CEliMaR (opcional — preguntar siempre, nunca asumir)

Antes de cerrar el prompt, preguntar siempre al usuario si quiere agregar la nota de estilo CEliMaR — sin importar cuán evidente parezca el contexto. Nunca incluirla ni omitirla por defecto: es una decisión del usuario, no una inferencia de la skill (mismo criterio que usa `celimar-brand` para assets y firmas).

Si el usuario confirma que sí: agregar al final del prompt una nota de estilo derivada del Design System v2.0 de CEliMaR. Es una orientación en lenguaje descriptivo, no un parámetro exacto: Prezi AI es generativo y probablemente no reproduzca el HEX ni las tipografías al pie de la letra (confirmado también en pruebas reales — ningún test mostró la paleta CEliMaR aplicada). Aun así vale la pena incluirla — es la única influencia de marca que un prompt de texto plano puede ejercer.

1. Preguntar (o confirmar, si ya es obvio por el encargo) qué tema de marca aplica:

   | Contexto | Tema | Fondo | Acento |
   |---|---|---|---|
   | Identidad, propuestas, redes | Tierra Volcánica | verde bosque profundo (#2D4841) | terracota / naranja quemado (#CB6843) |
   | Licitaciones, institucional, consultoría | Convergencia | azul marino profundo (#003153) | vino / burdeos (#900020) |
   | Eventos, pitch de inversión, premium | Nocturno | café oscuro casi negro (#2C2620) | rosa palo (#C08081) |

2. Redactar la nota con esta forma:

   *"Estilo visual sugerido: paleta de fondo en [color descriptivo] ([HEX]) con acentos en [color descriptivo] ([HEX]); tipografía sans-serif moderna y limpia para títulos, con una secundaria más neutra para el cuerpo de texto."*

3. Advertir siempre, junto con el documento entregado: *"Prezi probablemente no reproduzca el HEX ni las tipografías exactas — el ajuste fino de marca (logo, colores, fuentes) se termina a mano en el editor de Prezi."*

## Paso 3 — Armar el documento único

Un solo archivo .docx con esta estructura, en este orden:

1. Primer párrafo: el prompt completo del Paso 2, envuelto así: `<<Instrucciones concretas para la generación: [prompt completo incluida la nota de estilo si aplica]>>`
2. Un párrafo en blanco.
3. El contenido normal: título (Heading 1) + secciones (Heading 2) + cuerpo, tal como se reunió en el Paso 1.

Generar el archivo con la skill `docx` de este entorno (no reinventar la generación). Nombre sugerido: `[tema-en-kebab-case]-prompt-y-contenido.docx`. No hace falta ninguna corrección especial de metadata o de zip interno — es indiferente, porque este archivo **no se sube directo** (ver hallazgo crítico arriba).

## Paso 4 — Entrega

- Guardar el documento único en la carpeta del proyecto o trabajo correspondiente (crear subcarpeta si el proyecto lo requiere).
- Recordar siempre, de forma explícita y como parte de la entrega — no como nota al pie —: *"Prezi rechaza los archivos que yo genero directamente. Pegá todo el contenido de este documento (el prompt entre `<<>>` y el texto que sigue) en un Word nuevo creado y guardado desde tu propio Word, y subí ese archivo a Prezi."*
- Recordar los pasos manuales que siguen del lado de Prezi: (a) subir ese Word nuevo vía "Start from a file", (b) cuando Prezi muestre el texto extraído editable, verificar que el bloque `<<>>` quedó al inicio, (c) generar, (d) revisar el outline y las imágenes elegidas antes de darlo por bueno, y (e) reinsertar a mano el logo/imágenes de marca en el editor — Prezi no las conserva.

## Ejemplo ilustrativo

**Insumo (resumen):** notas sobre una propuesta de CEliMaR para una licitación de infraestructura educativa, con 4 puntos: diagnóstico, metodología, equipo, cronograma.

**Documento único generado (ejemplo, primer párrafo):**

> <<Instrucciones concretas para la generación: Creá una presentación sobre nuestra propuesta de acompañamiento técnico para el proyecto de infraestructura educativa, dirigida a un comité evaluador institucional, con tono profesional y el objetivo de demostrar rigor metodológico y capacidad del equipo. Usá alrededor de 8 diapositivas como referencia aproximada, no como límite estricto. Usá exactamente estos títulos para las láminas principales, en este orden y sin acortarlos ni convertirlos en etiquetas genéricas: "Diagnóstico", "Metodología", "Equipo", "Cronograma". Para las imágenes: preferí ilustraciones o iconografía de estilo gráfico sobre fotografía; si usás fotografías, que sean genéricas y de uso público, sin personas, banderas, monumentos, marcas o símbolos asociables a un país, gobierno, institución, evento o persona real y reconocible, y acordes al contexto salvadoreño/centroamericano de la propuesta. Basate estrictamente en los datos y cifras del texto que aparece a continuación de esta instrucción; no inventes cifras ni ejemplos nuevos. Idioma: español.>>
>
> [párrafo en blanco]
>
> Propuesta técnica — Acompañamiento en infraestructura educativa
>
> Diagnóstico
> [contenido...]

## Fuentes y evidencia

Estructura oficial del prompt: support.prezi.com (FAQ de Prezi AI, guía de prompts efectivos). Todo lo demás en esta skill (hallazgo del archivo, formato de una sola pieza, fórmula de prompt de las secciones 1-4 del Paso 2) proviene de tres rondas de prueba real documentadas en sep-2026, no de documentación oficial ni de foros de terceros — Prezi no publica estos comportamientos.
