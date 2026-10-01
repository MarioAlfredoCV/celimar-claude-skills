---
name: contexto-pro-max-proyecto
description: >
  Monta y mantiene, en Claude Code local, la memoria detallada + el MAPA (índice, sub-índice y grafo)
  de cualquier carpeta de trabajo: crea la memoria desde cero o la actualiza, regenera el MAPA, deja una instrucción
  de arranque en el CLAUDE.md de la carpeta y, opcionalmente, respalda en GitHub. Se parametriza con
  un archivo contexto-pro-max.config.md en la raíz de esa carpeta. Úsala cuando el usuario pida crear,
  montar, actualizar o poner al día la memoria, el contexto o el MAPA de otra carpeta o proyecto, o un
  sistema de memoria consultable sin leerla entera, aunque no diga "MAPA". Solo corre en Claude Code,
  en local.
license: MIT
---

# contexto-pro-max-proyecto (versión Claude Code local, sep-2026)

## Qué es y cuándo usarla

Ingeniería de contexto para una carpeta de trabajo cualquiera. Monta **dos artefactos que trabajan en sinergia**, para que Claude tenga contexto completo de la carpeta **sin leerla entera**:

1. **La memoria** (`<memoria>.md`, en la raíz de la carpeta): fuente de verdad, **autosuficiente** y clasificada `Crítico`/`Normal`.
2. **El MAPA** (`<mapa>.md`): capa de enrutamiento **derivada** (índice + sub-índice + grafo). Se usa para ubicar el tema y saltar con `Grep` al título; **nunca se lee entero**.

**Orden que no cambia:** primero la memoria, después el MAPA. Nunca al revés.

## Paso 0 — Compuerta de ambiente

Debes estar en **Claude Code, en local**, con herramientas de archivo y Bash, y con una carpeta de trabajo (`RAIZ`). Si estás en Chat o sin herramientas de archivo, avisa que no aplica y detente. No toques archivos fuera de `RAIZ`.

## Paso 1 — Config (parametrización)

Lo específico vive en `RAIZ\contexto-pro-max.config.md`. Léelo al arrancar; si no existe, créalo preguntando lo mínimo
(esquema y preguntas en `references/config.md`): `proyecto`, `memoria`, `mapa`, `fuentes`, `carpeta_privada` (se excluye
por completo; por defecto `ST`), `github` (opcional) y `memoria_automatica` (opcional).

## Paso 2 — Modo: crear o actualizar

- **No existe la memoria → bootstrap:** créala escaneando las `fuentes` con estructura de espejo de carpetas. Confirma el alcance en una línea antes de escribir.
- **Ya existe → actualizar** (comparar y reconciliar): parte del archivo existente, respeta su estructura y edita en sitio lo que cambió; no regeneres de cero lo vigente. Si el usuario acota ("solo la sección X"), concéntrate ahí.
- **Antes de editar, respalda** la memoria y el MAPA existentes en `<carpeta_privada>\Versiones no vigentes\AAAA-MM-DD <motivo>\`.

## Paso 3 — Arranque

En este orden: `prompt-six-sigma` → `plan-first` (en una actualización de rutina basta confirmar el alcance en una línea) → `humanizer` al redactar. Los archivos de memoria y MAPA son internos, en Markdown plano.

## Paso 4 — Fuentes y extracción

- Las carpetas `fuentes` y sus subcarpetas. **Excluye por completo la `carpeta_privada`** (no la leas, no la escanees, no la nombres).
- **Ignora ruido:** `node_modules`, `.git`, `__pycache__`, `dist`, `desktop.ini`, `.~lock.*`, fuentes tipográficas y binarios.
- **Herramientas locales (Windows):** `python` con `openpyxl` y `python-docx`; `pdftotext`; `git`. **No asumas `pandoc`**: verifica con `where pandoc`; si falta, usa `python-docx` para `.docx`.
- **Subagentes:** en paralelo y de **un solo nivel**; prohíbe la delegación en el brief (un subagente que lanza otros no recibe sus resultados). Piden síntesis densas, no volcados. Quien escribe la memoria eres tú.
- **Sustancia, no solo nombres:** captura qué es, qué se decidió, estado vigente, cifras y razón.

## Paso 5 — Reglas de contenido

- **Autosuficiencia:** una pregunta típica debe poder responderse sin abrir el archivo fuente. Las rutas van en una cola breve **«Dónde vive»** por sección y en un índice global, no en la prosa.
- **Clasifica cada sección** `Crítico` o `Normal` en la **primera línea del cuerpo** (`**Clasificación: Crítico.**`), **nunca en el encabezado** (es el ancla del MAPA). Una sección utilitaria (índice de archivos) va como `util`.
- **No transcribas secretos** (contraseñas, tokens, claves, PAT) **ni documentos de identidad ni datos personales sensibles**: indica solo que existen y dónde. Los datos de contacto profesional no son secretos.
- Marca lo **vigente** frente a lo superado y **no inventes** (lo dudoso va como «a verificar»).

## Paso 6 — Estructura

Espejo del sistema de carpetas, jerarquía `#/##/###/####`, encabezados limpios. Las secciones gigantes (≈9.000 caracteres o más) se desagregan con `####` de títulos únicos **por script, sin tocar la prosa**, verificando que al revertir las inserciones el texto queda idéntico (receta en `references/tecnicas.md`). La nota de mantenimiento va como bloque de cabecera, no como sección `##`.

## Paso 7 — Cierre de la memoria

**Prueba de autosuficiencia:** 2–3 preguntas típicas deben responderse con la memoria sola; si no, enriquece (sobre todo las `Crítico`). Revisión de calidad (prosa densa y natural). Guarda con el nombre exacto y **fin de línea LF** (en Python, `newline="\n"`; los `open(...,"w")` de Windows escriben CRLF).

## Paso 8 — Regenerar el MAPA

Solo si esta corrida editó la memoria. Se reconcilia contra los encabezados reales (formato en `references/formato-mapa.md`): índice (una entrada por `##`/`###` con palabras clave, marca y título exacto), sub-índice de las gigantes ⬛ y grafo dirigido (2–4 aristas de alto valor por nodo, backbone Mermaid). **Verifica por programa** que cada título-ancla exista como prefijo de una línea de la memoria; si falla, corrige antes de cerrar.

## Paso 9 — Instrucción de arranque en `CLAUDE.md`

El enrutamiento no se activa hasta que Claude sepa que debe leer el MAPA primero. En Claude Code eso va en el **`CLAUDE.md` de la raíz**: crea o completa ese archivo con el texto de `references/claude-md.md` (sustituyendo los nombres reales). Si ya existe un `CLAUDE.md`, **agrega** el bloque sin pisar lo existente y muéstraselo al usuario.

## Paso 10 — Respaldo en GitHub (opcional)

Solo si el config trae `github`. Clona el repo en un directorio temporal con el PAT (de la `carpeta_privada` o de la variable `GITHUB_TOKEN`; **no lo leas en voz alta, no lo imprimas ni lo escribas en la memoria**), copia la memoria y el MAPA a la carpeta indicada (sin espacios en la ruta remota), haz commit y push, verifica con `git ls-remote` y compara `git hash-object --no-filters` del archivo local con el del remoto, y **borra el clon** (el token queda en su `.git/config`). Usa un PAT fine-grained con permiso `Contents: Read and write` sobre ese único repo, y un repo **privado**. Nunca subas la `carpeta_privada`.

## Cierre

Resume en pocas líneas qué se creó o actualizó (memoria, MAPA, `CLAUDE.md`, GitHub). No narres cada paso.

## Referencias

- `references/config.md` — esquema del config y preguntas de la primera corrida.
- `references/claude-md.md` — bloque de arranque para el `CLAUDE.md` del proyecto.
- `references/formato-mapa.md` — estructura exacta del MAPA.
- `references/tecnicas.md` — desagregación con fidelidad, verificación de anclas, extracción y LF.
