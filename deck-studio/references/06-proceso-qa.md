# 06 · Proceso y control de calidad

## Proceso de principio a fin
1. **Contenido en texto** (`references/01`): Idea Gobernante, una idea por lámina, títulos que afirman, texto
   mínimo. Test del deck fantasma con los títulos.
2. **Estilo** (`references/02`): elige uno del catálogo, informado por el tema; descarta los clichés de IA.
3. **Arquetipos** (`references/03`): asigna a cada lámina su arquetipo; respeta 1600×900 y la zona segura.
4. **Código o imagen** (`references/04`) por lámina.
5. **Construye** un `NN.html` por lámina (carga `assets/slide-frame.css` + el `<style>` del estilo). Fuentes con
   fallback real.
6. **Render** (`references/05`): `node scripts/render_deck.mjs --in <dir> --out deck.pptx`.
7. **QA** (abajo). Corrige y re-renderiza solo lo que tocaste.
8. **Entrega y revisión**: entrega el `.pptx`, di claramente que **no es editable**, y **pide revisión**. Cuando
   el usuario lo dé por aceptado, ofrece el **PDF** (`export_pdf.py`).

## QA de comunicación (rápido)
- Test del deck fantasma: los títulos, en orden, cuentan la historia.
- Una idea + un foco por lámina; texto mínimo (glance media, ≤ ~12–15 palabras visibles como norma).
- Cada dato con contexto (comparación/periodo); ningún número desnudo.
- Copia específica del tema, sin clichés.

## QA visual (obligatorio) — mira cada PNG
Abre **cada** PNG de `<out>_png/` con la herramienta de lectura (mejor con mirada fresca o un subagente) y verifica:
- **Nada se sale de la zona segura**; el texto no toca los bordes.
- **Sin overflow ni recortes** de texto; sin líneas viudas feas.
- **Contraste alto** en cada par texto/fondo (apunta a AA: 4.5:1 normal, 3:1 grande). Si hay imagen de fondo, que
  el `.overlay` garantice legibilidad.
- **Jerarquía clara**: se distingue de un vistazo kicker < título < apoyo.
- **Coherencia** entre láminas: mismo estilo, mismas zonas fijas, misma familia tipográfica.
- **Un solo foco** por lámina; ningún cliché de IA se coló.
- La fuente correcta cargó (no cayó al fallback por falta de red).

## QA técnico (empaque)
```bash
python3 scripts/check_deck.py deck.pptx --png deck_png
```
Verifica que el `.pptx` abre, que hay una imagen a sangre por lámina, y que nº de PNG = nº de láminas.

## Checklist final
```
CONTENIDO
□ Títulos afirman; el deck fantasma cuenta la historia
□ Una idea + un foco por lámina; texto mínimo; datos con contexto
VISUAL
□ Estilo del catálogo, informado por el tema; sin clichés de IA
□ 1600×900; contenido en zona segura; jerarquía de 3–4 niveles
□ Contraste AA en cada lámina; overlay bajo el texto sobre imágenes
□ Un signature por lámina; coherencia de estilo en todo el deck
TÉCNICO
□ Fuentes correctas cargadas; sin overflow (revisión PNG hecha)
□ check_deck.py sin problemas
ENTREGA
□ Avisado que NO es editable; revisión pedida; PDF ofrecido al aceptar
```

## Reporte al usuario
Entrega el `.pptx`, di el estilo elegido y por qué encaja con el tema, señala qué láminas tienen placeholders de
imagen (con sus prompts) si las hay, y recuerda que cualquier cambio implica **regenerar** (no es editable).
Ofrece el PDF cuando lo apruebe.
