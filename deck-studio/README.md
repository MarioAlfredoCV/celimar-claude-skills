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

## Requisitos (todo libre)
- **Node** + `pptxgenjs` + `playwright` (`npm install pptxgenjs playwright`) y un **Chromium** (el motor detecta
  el del entorno; si no hay: `npx playwright install chromium`, ~150 MB una vez).
- **Python 3** + `img2pdf` (o `Pillow`) para el PDF y `python-pptx` para el QA (`pip install img2pdf python-pptx`).

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
