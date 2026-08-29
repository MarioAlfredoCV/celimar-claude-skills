# infographic-studio

Skill de Claude que genera infografías de **una sola pieza**: un lienzo HTML de ancho fijo y alto libre,
renderizado por navegador (Chromium headless) y capturado completo — sin recortar, por larga que sea la
pieza — como un **PNG de alta resolución**, con **PDF de una página** al aceptarse.

## Cuándo usarla
- **Sí**: infografías, resúmenes visuales, one-pagers, piezas de datos para redes — cifras con fuente,
  un proceso, una comparación, una línea de tiempo, una guía.
- **No**: presentaciones de varias láminas (→ `deck-studio` o `pptx-pro-max`), o piezas
  artísticas/abstractas sin información concreta (→ `canvas-design`).

## Qué la hace distinta
- **Alto libre, capturado completo** — el motor mide el contenido real con un screenshot `fullPage`, no
  un lienzo fijo como una lámina de presentación.
- **Disciplina de fuentes**: todo dato numérico debe llevar su fuente citada.
- **Mismos 8 estilos visuales propios** que `deck-studio`, con la misma calibración anti-cliché de IA.
- **Decide con criterio código vs. imagen**; deja placeholders + prompts cuando conviene una foto y no
  hay generador.
- **Autónoma y agnóstica de marca.**

## Requisitos y preparación del motor
El motor viene **precargado en Cowork y en Chat** — ahí no hay nada que instalar. Si usas esta skill en
**Claude Code** (versión de escritorio o de línea de comandos, en tu propia máquina), el motor no viene
de fábrica: el **Paso 0** del flujo lo prepara solo, corriendo una vez `node scripts/ensure_engine.mjs`
(idempotente). Deja listas dos piezas, todas libres (no hace falta `pptxgenjs` ni `python-pptx` — aquí
no hay `.pptx`):
- **Node** + `playwright`, instalados en el `node_modules` de **esta misma carpeta**.
- Un **Chromium** para Playwright — su build debe casar con la versión de `playwright` instalada.
- **Python 3** + `img2pdf` para el PDF.

Probado de verdad: en el desarrollo de esta skill, `ensure_engine.mjs` se topó con un Chromium recién
descargado que no lanzaba por faltar una biblioteca de sistema (`libXdamage.so.1`) en un sandbox sin
privilegios de root. Lo repara solo — descarga el paquete `.deb` sin instalarlo (`apt-get download`, que
no requiere root) y lo vincula localmente en `.local-libs/` dentro de esta carpeta, sin tocar el sistema.

Si algo falla, `references/05-motor-y-render.md` trae la solución de problemas.

## Instalación
En Claude (Cowork): Customize → Skills → subir el `.skill`. (En Claude Code: carpeta de skills.)

## Uso
Pídele a Claude una infografía ("una infografía sobre…", "resume estas cifras en una imagen", "un
one-pager de…"). La skill se activa sola, arma el HTML de la pieza, la renderiza y te entrega el PNG;
al aprobarlo, te ofrece el PDF.

## Flujo del motor
```bash
node scripts/render_infographic.mjs --in infografia.html --out infografia.png   # HTML → PNG (alto completo)
python3 scripts/check_infographic.py infografia.png --width 1200                # QA técnico (PNG a --width × --scale)
python3 scripts/export_pdf.py --png <carpeta_con_el_png> --out infografia.pdf   # PDF (tras aceptación)
```

## Estructura
```
infographic-studio/
├── SKILL.md                            # cerebro: cuándo usarla + flujo de 8 pasos + reglas
├── assets/
│   └── canvas-frame.css                # contrato 1200px de ancho + zona segura + utilidades
├── scripts/
│   ├── ensure_engine.mjs               # prepara el motor solo (Node/Chromium/Python) — Claude Code local
│   ├── render_infographic.mjs          # HTML → PNG (Playwright/Chromium, fullPage) — sin recortar
│   ├── export_pdf.py                   # PNG → PDF (img2pdf, lossless)
│   └── check_infographic.py            # QA técnico del PNG (dimensiones, sin dependencias externas)
└── references/
    ├── 01-contenido-y-narrativa.md     # Idea Gobernante, una idea por sección, titulares, fuentes
    ├── 02-galeria-estilos.md           # 8 estilos propios (paleta, tipografía, signature)
    ├── 03-secciones-y-plantillas.md    # contrato del lienzo, tipos de sección
    ├── 04-decision-imagenes.md         # criterio código-vs-imagen + adaptador opcional
    ├── 05-motor-y-render.md            # Chromium, fuentes, PNG, PDF, troubleshooting
    └── 06-proceso-qa.md                # proceso, QA visual + check_infographic.py, checklist
```

## Autoría y licencia
Skill propia, hermana de `deck-studio` (comparte la técnica de render HTML→imagen, adaptada a un lienzo
de alto libre). No copia código ni estilos de terceros. Define la licencia que prefieras antes de
publicarla (p. ej. MIT).
