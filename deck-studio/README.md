# deck-studio

Skill de Claude que genera presentaciones de **máximo impacto visual** renderizando cada lámina como HTML por
navegador (Chromium headless) y empaquetándola como **imagen a pantalla completa** en un `.pptx` — y, al
aceptarse, en PDF. **No editable** (cada lámina es una imagen); a cambio, control total de tipografía, color,
composición y detalle, imposible con gráficos nativos.

## Cuándo usarla
- **Sí**: pitch de inversión, keynote, portada/cierre, deck de marca, escenario — cuando el impacto manda y el
  archivo no se va a editar.
- **No**: cuando necesitas editar el texto/números en PowerPoint → usa una skill de PPTX **editable**.

## Qué la hace distinta
- **Fidelidad visual total** (HTML/CSS/SVG renderizado por navegador), con **8 estilos propios** y una
  calibración explícita para **no caer en los clichés del "diseño IA"**.
- **Mismo rigor de contenido** que una buena presentación (una idea por lámina, títulos que afirman, texto
  mínimo "glance media").
- **Decide con criterio código vs. imagen**; como Claude no genera imágenes, deja placeholders + prompts cuando
  conviene una foto y no hay generador — el deck sale completo igual.
- **Autónoma y agnóstica de marca.** Para identidad de empresa, se combina con una skill de marca.

## Requisitos y preparación del motor
El motor viene **precargado en Cowork y en Chat** — ahí no hay nada que instalar. Si usas esta skill en
**Claude Code** (versión desktop o versión CLI, en tu propia máquina), el motor no viene de fábrica: el
**Paso 0** del flujo lo prepara solo, corriendo una vez `node scripts/ensure_engine.mjs` (idempotente — no
reinstala lo que ya está). Deja listas tres piezas, todas libres:
- **Node** + `pptxgenjs` + `playwright`, instalados en el `node_modules` de **esta misma carpeta** (no en la
  carpeta del deck ni en la raíz de tu proyecto — `render_deck.mjs` es fijo y resuelve sus imports desde aquí).
- Un **Chromium** para Playwright — su build debe casar con la versión de `playwright` instalada, o no arranca.

Probado de verdad: en un sandbox real sin privilegios de root, un Chromium recién descargado (versión ya
correcta) no lanzaba por faltar una biblioteca de sistema (`libXdamage.so.1`). `ensure_engine.mjs` lo
repara solo — descarga el paquete `.deb` sin instalarlo (`apt-get download`, que no requiere root) y lo
vincula localmente en `.local-libs/` dentro de esta carpeta, sin tocar el sistema.
- **Python 3** + `img2pdf` + `python-pptx` (sin `img2pdf`, el respaldo a `Pillow` degrada el PDF a 256 colores
  en Windows).

Si algo falla, `references/05-motor-y-render.md` trae la solución de problemas y los comandos manuales.

## Instalación
En Claude (Cowork): Customize → Skills → subir el `.skill`. (En Claude Code: carpeta de skills.)

## Uso
Pídele a Claude un deck de alto impacto ("un pitch para inversores sobre…", "una keynote impactante de…"). La
skill se activa sola, arma las láminas HTML, las renderiza y te entrega el `.pptx`; al aprobarlo, te ofrece el PDF.

## Flujo del motor
```bash
node scripts/render_deck.mjs --in slides --out deck.pptx     # HTML → PNG (Chromium) → PPTX de imágenes
python3 scripts/check_deck.py deck.pptx --png deck_png        # QA del paquete
python3 scripts/export_pdf.py --png deck_png --out deck.pdf   # PDF (tras aceptación)
```

## Estructura
```
deck-studio/
├── SKILL.md                       # cerebro: cuándo usarla + flujo de 8 pasos + reglas
├── assets/
│   └── slide-frame.css            # contrato 1600×900 + zona segura + utilidades
├── scripts/
│   ├── ensure_engine.mjs          # prepara el motor solo (Node/Chromium/Python) — Claude Code local
│   ├── render_deck.mjs            # HTML → PNG (Playwright/Chromium) → PPTX de imágenes
│   ├── export_pdf.py              # PNG → PDF (img2pdf, lossless; fallback Pillow)
│   └── check_deck.py              # QA del .pptx de imágenes (python-pptx)
└── references/
    ├── 01-contenido-y-voz.md      # argumento, una idea, títulos, texto mínimo
    ├── 02-galeria-estilos.md      # 8 estilos propios (paleta, tipografía, signature)
    ├── 03-layout-y-plantillas.md  # contrato 1600×900, zona segura, arquetipos
    ├── 04-decision-imagenes.md    # criterio código-vs-imagen + adaptador opcional
    ├── 05-motor-y-render.md       # Chromium, fuentes, PPTX, PDF, troubleshooting
    └── 06-proceso-qa.md           # proceso, QA visual + check_deck.py, checklist
```

## Autoría y licencia
Skill propia, construida por benchmarking: toma lo mejor de la industria (render HTML→imagen, filosofía visual)
y lo reorganiza con estilos, criterio y proceso originales. No copia código ni estilos de terceros. Define la
licencia que prefieras antes de publicarla (p. ej. MIT).
