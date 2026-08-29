---
name: infographic-studio
description: >-
  Genera infografías de una sola pieza: lienzo HTML de ancho fijo y alto variable, renderizado con
  Chromium headless y capturado completo (sin recortar, por alta que sea) como PNG de alta resolución,
  con PDF de una página al aceptarse. Sirve para comunicar datos concretos con fuente — cifras,
  comparaciones, procesos, líneas de tiempo, guías — no piezas abstractas ni presentaciones de varias
  láminas. Actívala ante: "infografía", "resumen visual", "one-pager", "pieza de datos para redes",
  "explica esto en una imagen" o "de un vistazo", o cuando el resultado deba ser UNA sola imagen/PDF con
  varias secciones apiladas (no un .pptx de láminas ni una pieza artística abstracta). Es autónoma (Node
  + Playwright/Chromium; Python + img2pdf para el PDF) y agnóstica de marca. Para presentaciones de
  varias láminas usa deck-studio o pptx-pro-max; para arte abstracto/póster sin datos usa canvas-design.
---

# infographic-studio — Infografías de una sola pieza (HTML → imagen)

## Qué es y cuándo usarla

infographic-studio compone una infografía como **un solo lienzo HTML de ancho fijo (1200px) y alto
libre**, la renderiza con **Chromium headless** capturando el contenido completo (sin recortar, por alto
que sea) y entrega un **PNG de alta resolución** — con **PDF de una página** al aceptarse. No es una
presentación: es UNA pieza visual que comunica datos e información concreta, hecha para leerse un rato,
no para glancear en 3 segundos.

- **Úsala cuando** el encargo es una infografía, un resumen visual, un one-pager, una pieza de datos
  para redes, o "explica esto en una imagen" — cifras con fuente, un proceso, una comparación, una línea
  de tiempo, una guía.
- **NO la uses cuando** el resultado debe ser una presentación de varias láminas (→ `deck-studio` si el
  impacto visual manda y no se editará, `pptx-pro-max` si debe ser editable en PowerPoint), o cuando el
  pedido es una pieza artística/abstracta sin información concreta que comunicar (→ `canvas-design`). Si
  hay duda, **pregúntalo** (Paso 0).
- **Es autónoma y agnóstica de marca.** Para vestir la pieza con la identidad de una empresa, se invoca
  en paralelo la skill de marca correspondiente; esta no la menciona ni depende de ella.

## Principio rector

**La información manda; el diseño la hace legible y memorable, no al revés.** Cada dato lleva su
fuente, cada sección tiene un solo trabajo, y la pieza completa se lee de corrido como un argumento —
no como un collage de gráficos bonitos sin hilo conductor.

## No al "look de IA" (calibración obligatoria)

El diseño generado por IA tiende a caer en tres clichés; **evítalos** salvo que el usuario los pida:
1. fondo crema (~`#F4F1EA`) + serif de alto contraste + acento terracota (~`#D97757`);
2. fondo casi negro + un único acento verde ácido o bermellón;
3. estilo periódico: filetes finos, cero radios, columnas densas.
Elige una dirección **específica para este tema** (ver la galería de estilos).

## El flujo (8 pasos)

### Paso 0 — ¿Es el formato correcto? + preparar el motor
Confirma que el encargo es UNA pieza (imagen/PDF), no una presentación de varias láminas ni una pieza
abstracta sin datos — si es alguno de esos casos, deriva a `deck-studio`/`pptx-pro-max` o `canvas-design`
(ver arriba).

**Preparación automática del motor (no pidas al usuario que instale nada).** Antes de renderizar (Paso
6), corre tú mismo, una sola vez: `node "<ruta-de-esta-skill>/scripts/ensure_engine.mjs"`. Es idempotente
y deja listas dos piezas: Node (`playwright`) en la carpeta de la skill, y Python (`img2pdf`) para el
PDF — no hace falta `pptxgenjs` ni `python-pptx`, aquí no hay `.pptx`. En Cowork y Chat el motor ya viene
y el script solo confirma; en Claude Code (versión desktop y versión CLI, ambas en la máquina del
usuario) instala lo que falte. No interrumpas el flujo para que el usuario lo ejecute.

### Paso 1 — Contenido y narrativa  → `references/01-contenido-y-narrativa.md`
Fija el argumento en texto: Idea Gobernante, una idea por sección, titulares que afirman, y **la fuente
de cada dato** — no negociable.

### Paso 2 — Elegir el estilo visual  → `references/02-galeria-estilos.md`
Escoge del catálogo el estilo cuyo carácter sirva a ESTE tema (no el default).

### Paso 3 — Secciones y plantilla  → `references/03-secciones-y-plantillas.md`
Decide el tipo de sección para cada parte de la narrativa (encabezado, bloque de dato, comparación,
línea de tiempo, lista, gráfico, cita, pie de fuentes) y su orden. Respeta el ancho de 1200px y la zona
segura.

### Paso 4 — Código o imagen  → `references/04-decision-imagenes.md`
Decide con criterio si cada sección se resuelve por código (HTML/CSS/SVG, el default) o con una imagen.

### Paso 5 — Construir el HTML
Escribe **un solo archivo** `infografia.html` con todas las secciones apiladas en orden. Carga
`assets/canvas-frame.css` y luego el `<style>` del estilo elegido.

### Paso 6 — Render  → `references/05-motor-y-render.md`
```bash
node scripts/render_infographic.mjs --in infografia.html --out infografia.png   # captura el alto completo, sin recortar
```

### Paso 7 — QA y entrega  → `references/06-proceso-qa.md`
Revisa el PNG completo (mirada fresca): overflow, contraste, jerarquía, fuentes citadas, ritmo entre
secciones. Corre `python3 scripts/check_infographic.py infografia.png --width 1200` (si renderizaste con
un `--scale` distinto del default 2, pásaselo también: `--scale <N>` — el PNG sale a esa escala, no en
CSS px crudos). Entrega el PNG y **pide revisión**; cuando el usuario lo dé por aceptado, ofrece el PDF:
```bash
python3 scripts/export_pdf.py --png <carpeta_con_el_png> --out infografia.pdf
```

## Reglas duras

- **Ancho fijo 1200px; alto libre** — el motor lo captura completo, nada se recorta.
- **Cada dato numérico lleva su fuente.** Sin excepción.
- **Densidad controlada** por sección (ver `references/01`); si crece a párrafos largos, es un informe,
  no esta pieza.
- **Cero clichés de IA**, salvo pedido explícito.
- **Contraste alto** texto/fondo (WCAG AA: 4.5:1 / 3:1); el color no es el único portador de significado.
- **Estilos propios**: deriva cada color y tipo del tema, no copies de otras herramientas.
- **Resultado no editable**: dilo al entregar; ofrece regenerar ante cualquier cambio.

## Autonomía y dependencias

No depende de ninguna otra skill (ni de `deck-studio`, aunque comparte la técnica de render). Requiere
(todo libre): **Node** + `playwright` (con un **Chromium** cuyo build debe casar con la versión de
`playwright` instalada — un desajuste entre ambos le impide lanzarlo), y **Python** + `img2pdf` para el
PDF. No usa `pptxgenjs` ni `python-pptx` — no hay `.pptx` en esta skill.

Hay una segunda causa, distinta del desajuste de versión, por la que Chromium puede no lanzar: que
falte una **biblioteca del sistema** (típicamente de X11) que el sandbox nunca tuvo instalada — confirmado
en pruebas reales de esta skill (faltaba `libXdamage.so.1` en el entorno de desarrollo). `ensure_engine.mjs`
la detecta y la repara **sin privilegios de root**, vinculándola de forma local dentro de la propia carpeta
de la skill; ver `references/05-motor-y-render.md`.

**El motor solo viene precargado en la nube** (Cowork y Chat). En **Claude Code** (versión desktop y
versión CLI, ambas en la máquina del usuario) no viene instalado: lo prepara el **Paso 0**, corriendo
`scripts/ensure_engine.mjs` de forma idempotente, en el `node_modules` de **esta carpeta de la skill** —
nunca en la carpeta de la infografía ni en una raíz de proyecto, porque `render_infographic.mjs` es un
script fijo que resuelve sus imports desde su propia ubicación. Detalles en
`references/05-motor-y-render.md`.

## Archivos de referencia

- `references/01-contenido-y-narrativa.md` — Idea Gobernante, una idea por sección, titulares, fuentes.
- `references/02-galeria-estilos.md` — 8 estilos visuales propios (paleta, tipografía, signature, cuándo usar).
- `references/03-secciones-y-plantillas.md` — contrato del lienzo (1200px, alto libre) y tipos de sección.
- `references/04-decision-imagenes.md` — criterio código-vs-imagen y el adaptador de imágenes opcional.
- `references/05-motor-y-render.md` — cómo correr el motor (Chromium, fuentes, PNG, PDF) y solución de problemas.
- `references/06-proceso-qa.md` — proceso completo, QA visual + `check_infographic.py`, y checklist.
