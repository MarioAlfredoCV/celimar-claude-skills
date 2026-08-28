---
name: mapa-memoria-proyecto
description: >
  Optimiza la ingeniería de contexto de un proyecto de Claude en Cowork o Claude Code: crea y
  mantiene una memoria de proyecto AUTOSUFICIENTE más un MAPA (índice + sub-índice + grafo
  dirigido de relaciones) que trabajan en sinergia para que Claude consulte SOLO lo necesario y
  economice ~80–93% de tokens por consulta. Úsala SIEMPRE que el usuario quiera crear, montar,
  actualizar, refrescar o poner al día la memoria, el contexto o el MAPA de su proyecto; cuando
  quiera un sistema de memoria de proyecto eficiente en tokens; o cuando pida que su memoria sea
  consultable sin leerla entera, aunque no nombre "MAPA" ni "índice-grafo" explícitamente. Se
  parametriza por un archivo de config por proyecto. Solo actúa en Cowork o Claude Code (necesita
  herramientas de archivo); en Chat, avisa que no está disponible y detente.
license: MIT
---

# mapa-memoria-proyecto

## Qué es

Ingeniería de contexto para un proyecto de Claude en **Cowork / Claude Code**. Monta y mantiene
**dos artefactos que trabajan en sinergia**, para que Claude tenga contexto completo del proyecto
**sin gastar tokens leyéndolo todo** en cada conversación:

1. **La memoria** (`<memoria>.md`, en la raíz del proyecto) — la **fuente de verdad**:
   conocimiento del proyecto, redactado **autosuficiente** (se entiende y responde sin abrir
   ningún archivo) y clasificado `Crítico`/`Normal`.
2. **El MAPA** (`MAPA-<proyecto>.md`) — la **capa de enrutamiento derivada**: un **índice** de las
   secciones, un **sub-índice** de las secciones gigantes y un **grafo dirigido** de relaciones
   (insumo/impacto). Se lee primero para ubicar y consultar **solo lo necesario**.

**Orden que nunca cambia:** la memoria es la fuente de verdad; el MAPA se **regenera después** de
ella. El MAPA nunca antes que la memoria. Medido en un proyecto real: **~80–93% de ahorro de
tokens por consulta** frente a leer la memoria completa (ver el Wiki de la skill).

## Compuerta de ambiente (SIEMPRE primero)

Esta skill necesita **herramientas de archivo** (Read/Write/Edit) y una carpeta de proyecto
conectada: corre en **Cowork** o **Claude Code**. Si estás en **Chat** (sin file tools), avisa
que la skill no aplica y detente.

## Config (parametrización por proyecto)

Lo específico de cada proyecto vive en `mapa-memoria.config.md` en la raíz. Léelo al arrancar; si
**no existe**, créalo preguntando lo mínimo (esquema y preguntas en `references/config.md`):

- `proyecto`: nombre del proyecto.
- `memoria`: nombre del archivo de memoria (p. ej. `Memoria del proyecto.md`).
- `mapa`: nombre del MAPA (por defecto `MAPA-<proyecto>.md`, sin espacios).
- `fuentes`: carpetas raíz a escanear como conocimiento.
- `carpeta_privada`: carpeta a **excluir por completo** del escaneo y de la memoria/MAPA (por
  defecto `ST/`). Útil para material sensible; nunca se escanea ni se nombra.

## Paso 1 — Modo: crear (bootstrap) o actualizar

- **Si NO existe `<memoria>.md`** → **bootstrap**: créala desde cero escaneando las `fuentes`,
  con estructura de espejo de carpetas (Paso 4). Confirma el alcance en una línea antes de escribir.
- **Si YA existe** → **actualizar** (comparar-reconciliar): parte del archivo existente, respeta su
  estructura, y actualiza en sitio lo que cambió. No regeneres de cero lo que sigue válido. Si el
  usuario acota ("solo la sección X"), concéntrate ahí.
- **Caso mixto:** si existe la memoria pero **no** el MAPA (o al revés), crea el que falte. El MAPA
  siempre se (re)genera al final (Paso 7) si esta corrida tocó la memoria.

## Paso 2 — Fuentes a considerar

- Las **carpetas `fuentes`** del config y sus subcarpetas.
- **Excluye por completo la `carpeta_privada`**: no la leas, no la escanees, no la nombres en la
  memoria ni en el MAPA.
- Concentra la lectura en lo que cambió (fechas de modificación, carpetas nuevas, lo que el usuario
  señale).

## Paso 3 — Reglas de contenido (autosuficiencia + clasificación)

Redacta la memoria **autosuficiente** (que una pregunta típica del proyecto se responda **sin abrir
ningún archivo**): captura la **sustancia** (qué es, qué se decidió, estado vigente, cifras, razón),
no punteros tipo "ver `X.docx`". *(Esto es lo que hace la memoria útil incluso fuera de Cowork —
ver el Wiki: proyecto gemelo en Chat.)*

- **Clasifica cada sección `Crítico` o `Normal`** en la **primera línea de su cuerpo**
  (`**Clasificación: Crítico.**` / `**Clasificación: Normal.**`), **nunca en el encabezado** (el
  encabezado es el ancla del MAPA y debe quedar limpio). `Crítico` = conocimiento núcleo,
  respondible por sí solo; `Normal` = detalle operativo/inventario. El listón de autosuficiencia se
  aplica al máximo en las `Crítico`.
- **Secciones utilitarias vs. paraguas:** una sección puramente utilitaria (p. ej. un *índice global
  de archivos*, o la nota de mantenimiento) **no lleva** marca Crítico/Normal; márcala `utilitario`
  en el índice del MAPA. Una sección **paraguas** (carpeta-contenedor con hijas) lleva una línea
  breve de encuadre y su propia marca (normalmente `Normal`); sus hijas se clasifican aparte.
- **Ubicación fuera de la prosa:** rutas/nombres de archivo van en una **cola breve "Dónde vive"**
  al final de cada sección, y en un **índice global de archivos**; nunca entretejidas en el texto.
- **No transcribas secretos** — credenciales: contraseñas, tokens, claves, PAT. (Datos de negocio
  como correos de contacto o precios **no** son secretos: consérvalos como sustancia.) Descríbelos
  sin volcarlos; deja una nota de seguridad si están en texto plano.
- **Marca lo vigente** ante datos que evolucionaron; **no inventes** (si algo es ambiguo, "a verificar").

## Paso 4 — Estructura de la memoria

- **Espejo del sistema de carpetas:** cada sección corresponde a una carpeta/tema. Respeta la
  estructura que el archivo ya tiene (actualizar) o créala espejando las `fuentes` (bootstrap).
- **Conocimiento primero, ubicación al final:** cada sección abre con la línea de `Clasificación` y
  la **sustancia**; cierra con la cola **"Dónde vive"**. Encabezados **limpios** (sin tags ni rutas),
  jerarquía `#/##/###/####`.
- **Secciones gigantes → desagrégalas con `####`** de títulos únicos (para leerlas por sub-bloques;
  el MAPA las sub-indexa). Insértalos **sin tocar la prosa** y verifica por programa que al quitarlos
  el texto queda idéntico (fidelidad). Recipe en `references/tecnicas.md`.
- Mantén una **nota de mantenimiento** (fecha de **esta corrida** + qué cambió) como **bloque breve
  de cabecera**, no como sección `##` (para que el MAPA no la indexe).

## Paso 5 — Extracción (proyectos con muchos archivos)

- Si hay subagentes, úsalos en paralelo para leer/resumir clústeres y devolver **síntesis densas**.
- **Sustancia, no solo nombres:** si el contenido de un archivo haría falta para una pregunta
  probable, captura su sustancia; para archivos puramente operativos, mención breve.
- Extracción por tipo (`pandoc`, `pdftotext`, `python-pptx`, `openpyxl`, `cat`…) y evita ruido.
  Detalle en `references/tecnicas.md`.

## Paso 6 — Cierre de la memoria

- **Prueba de autosuficiencia:** toma 2–3 preguntas típicas del proyecto y verifica si la memoria
  **sola** las responde sin abrir archivo; enriquece (sobre todo las `Crítico`) donde no.
- Revisión de calidad (prosa densa y natural, sin muletillas). Guarda la memoria en la raíz con su
  nombre exacto y compártela (`present_files`). Continúa con el **Paso 7 (MAPA)**.

## Paso 7 — Regenerar el MAPA (después de la memoria)

Solo si esta corrida editó la memoria. El MAPA se **reconcilia** contra los encabezados reales (no
se reescribe de cero):

1. Extrae todos los encabezados `##/###/####` (`grep -n '^#\{1,4\} '`).
2. **Índice:** una entrada por `##`/`###`, con palabras clave + el **título exacto** (para el salto
   por Grep) + la marca **`Crítico`/`Normal`** (de la primera línea de la sección).
3. **Sub-índice:** una entrada por cada `####` de las secciones gigantes (marcadas ⬛).
4. **Grafo dirigido:** insumos (aguas arriba) e impactos (aguas abajo) por nodo, 2–4 aristas de alto
   valor; backbone en Mermaid de la columna vertebral.
5. **Verifica** que cada título-ancla del MAPA exista como encabezado real en la memoria (prefijo de
   línea); corrige antes de cerrar — un ancla rota rompe el enrutamiento.

Guarda `MAPA-<proyecto>.md` en la raíz y compártelo. Enruta por **título**, nunca por número de
línea. Estructura completa del MAPA en `references/formato-mapa.md`.

## Paso 8 — Setup de la instrucción del proyecto (OBLIGATORIO la 1ª vez)

El enrutamiento **no funciona** hasta que las instrucciones del proyecto le digan a Claude que lea
el MAPA primero. La skill **no puede editar** esa configuración: **genera el texto y guía al usuario
a pegarlo** en las instrucciones del proyecto de Cowork. El texto (flujo de 3 pasos: ubicar →
descender → autoridad, con los nombres reales del config) está en `references/instrucciones-proyecto.md`.
Recuérdaselo al cerrar si detectas que aún no está pegado.

## Cierre

Resume en pocas líneas qué se creó/actualizó (memoria + MAPA) y recuérdale pegar la instrucción si
falta. No narres cada paso.

*Nota: llevar este mismo contexto a un **proyecto gemelo en Claude Chat** (para consultarlo desde el
móvil) o respaldarlo en **GitHub** es un aprovechamiento avanzado que la Wiki de esta skill explica
en detalle; no forma parte de la skill base.*

## Referencias

- `references/config.md` — esquema del config y las preguntas de la 1ª corrida.
- `references/instrucciones-proyecto.md` — el texto de instrucción (Cowork) para pegar.
- `references/formato-mapa.md` — estructura exacta del MAPA (índice + sub-índice + grafo).
- `references/tecnicas.md` — desagregación de gigantes con fidelidad, y extracción por tipo.
