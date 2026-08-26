# PPTX Pro Max

Skill de Claude que convierte cada solicitud de presentación en un **sistema de decisiones** sobre
narrativa, contenido, diseño visual, datos y plantilla, para producir un **.pptx editable de alto
impacto**. Reúne las buenas prácticas de la consultoría (catálogo de plantillas + selección) y del método
académico (títulos-afirmación, disciplina de exhibit) con investigación internacional de autoridad
(Minto, Alley/assertion-evidence, Mayer, Duarte, Knaflic, Tufte, TED, WCAG).

## Qué la hace distinta
- **No es una suma de capas**: es un flujo único de 7 pasos (diagnóstico → narrativa → contenido → visual →
  datos → plantilla → QA triple) que decide y justifica cada lámina.
- **Basada en evidencia y honesta**: rechaza mitos frecuentes (regla 7×7, "recordamos 10%/65%").
- **Autónoma**: trae su propio motor (`pptxgenjs`, open source) y su **propio validador reforzado**
  (`scripts/validate_deck.py`). No depende de ninguna otra skill.
- **Siempre editable**: texto y gráficos nativos; ninguna lámina pegada como imagen.
- **Agnóstica de marca**: sirve para cualquier presentación. Para vestirla con la identidad de una empresa,
  se invoca en paralelo la skill de marca correspondiente (no viene acoplada a ninguna).

## Validador propio (más exigente)
`scripts/validate_deck.py` audita en dos niveles, sin depender de nadie:
- **Errores que rompen PowerPoint**: `dLblPos=outEnd` en apiladas, gráficos sin ejes, XML mal formado,
  colores hex inválidos, relaciones rotas, marcadores de plantilla sin reemplazar, deck sin diapositivas.
- **Calidad/comunicación/accesibilidad** (lo que otros validadores no miran): contraste WCAG AA, tamaños de
  fuente, tipografías inseguras, cuadros sin `txBox`, y antipatrones (franjas decorativas).
```bash
python3 scripts/validate_deck.py salida.pptx           # informe
python3 scripts/validate_deck.py salida.pptx --strict   # advertencias = errores
```

## Requisitos (todo libre; en Claude ya viene incluido)
- Node.js + `pptxgenjs` (`npm install pptxgenjs` si falta)
- Python 3 + `python-pptx` + `lxml` (`pip install python-pptx lxml` si faltan)
- LibreOffice (`soffice`) y poppler (`pdftoppm`) para el QA visual

## Cómo instalarla
En Claude (Cowork): Customize → Skills → subir el archivo `.skill`. (En Claude Code: carpeta de skills.)

## Cómo usarla
Pídele a Claude una presentación en lenguaje normal ("hazme un deck ejecutivo sobre…", "arma un pitch de…",
"mejora estas diapositivas"). La skill se activa sola. Si quieres marca de una empresa, invócala junto a la
skill de marca.

## Estructura
```
pptx-pro-max/
├── SKILL.md                          # cerebro: principio rector + flujo de 7 pasos + reglas duras
├── scripts/
│   └── validate_deck.py              # validador propio reforzado (autónomo)
└── references/
    ├── 01-diagnostico-narrativa.md   # audiencia/canal + Minto/SCQA/Duarte + títulos-afirmación
    ├── 02-contenido-evidencia.md     # Alley/Mayer/Sweller/Reynolds + límites numéricos
    ├── 03-sistema-visual.md          # color 60-30-10, tipografía, retícula, WCAG, antipatrones
    ├── 04-datos-graficos.md          # selección de gráfico, Cleveland-McGill, Knaflic, Tufte
    ├── 05-catalogo-plantillas.md     # catálogo editable de negocio con "usar/no usar cuando"
    ├── 06-proceso-qa.md              # construcción + QA triple (comunicación + validador + visual)
    └── 07-motor-y-render.md          # motor pptxgenjs (dependencias, gotchas) y render — autónomo
```

## Autoría y licencia
Skill propia, construida por benchmarking: toma las mejores prácticas de la industria y las reorganiza con un
proceso y un criterio propios. No copia código ni estilos de terceros; el catálogo de plantillas y el
validador son originales. Define la licencia que prefieras antes de publicarla (p. ej. MIT).
