# 06 · Proceso y control de calidad

## Proceso de principio a fin
1. **Contenido en texto** (`references/01`): Idea Gobernante, una idea por sección, titulares que
   afirman, fuentes de cada dato. Test de los titulares con la pieza fantasma.
2. **Estilo** (`references/02`): elige uno del catálogo, informado por el tema; descarta los clichés de IA.
3. **Secciones** (`references/03`): decide qué tipo de sección usa cada parte de la narrativa; respeta
   1200px y la zona segura.
4. **Código o imagen** (`references/04`) por sección.
5. **Construye** un único `infografia.html` que carga `assets/canvas-frame.css` + el `<style>` del
   estilo elegido, con todas las secciones apiladas en orden. Fuentes con fallback real.
6. **Render** (`references/05`): `node scripts/render_infographic.mjs --in infografia.html --out infografia.png`.
7. **QA** (abajo). Corrige y re-renderiza — es una pieza sola, no hay "solo lo que tocaste": vuelve a
   correr el motor completo.
8. **Entrega y revisión**: entrega el PNG, y **pide revisión**. Cuando el usuario lo dé por aceptado,
   ofrece el **PDF** (`export_pdf.py`).

## QA de comunicación (rápido)
- Test de los titulares: leídos en orden, cuentan la historia completa.
- Una idea + un dato central por sección; densidad controlada (ver `references/01`).
- **Cada dato numérico tiene su fuente** — sin excepción.
- Copia específica del tema, sin clichés.

## QA visual (obligatorio) — mira el PNG completo
Abre el PNG completo (mejor con mirada fresca o un subagente, revisando sección por sección de arriba a
abajo) y verifica:
- **Nada se sale** del ancho de 1200px ni de la zona segura; el texto no toca los bordes.
- **Sin overflow ni recortes** de texto; sin líneas viudas feas.
- **Contraste alto** en cada par texto/fondo (AA: 4.5:1 normal, 3:1 grande). Overlay bajo texto sobre
  imágenes.
- **Jerarquía clara** dentro de cada sección: titular < dato/visual < apoyo.
- **Ritmo**: el alternado de fondos da respiro a lo largo de toda la pieza; no se siente monótona.
- **Coherencia**: mismo estilo, mismo ancho, misma familia tipográfica en toda la pieza.
- Ningún cliché de IA se coló.
- La fuente correcta cargó (no cayó al fallback por falta de red).

## QA técnico
```bash
python3 scripts/check_infographic.py infografia.png --width 1200 --pdf infografia.pdf
```
Verifica que el PNG sea válido, que el ancho coincida con el esperado (el PNG sale a `--width × --scale`
— si renderizaste con un `--scale` distinto del 2 por defecto, pásaselo también aquí), que el alto sea
razonable (no una captura truncada), y —si ya generaste el PDF— que también esté bien.

## Checklist final
```
CONTENIDO
□ Titulares afirman; la pieza fantasma cuenta la historia completa
□ Una idea + un dato central por sección; densidad controlada
□ TODOS los datos numéricos llevan su fuente
VISUAL
□ Estilo del catálogo, informado por el tema; sin clichés de IA
□ 1200px de ancho; zona segura respetada; jerarquía de 3 niveles
□ Contraste AA en cada sección; overlay bajo el texto sobre imágenes
□ Ritmo entre secciones; coherencia de estilo en toda la pieza
TÉCNICO
□ Fuentes tipográficas correctas cargadas; sin overflow (revisión del PNG hecha)
□ check_infographic.py sin problemas
ENTREGA
□ Revisión pedida; PDF ofrecido al aceptar
```

## Reporte al usuario
Entrega el PNG, di el estilo elegido y por qué encaja con el tema, señala qué secciones tienen
placeholders de imagen (con sus prompts) si las hay, y recuerda que cualquier cambio implica regenerar
la pieza completa. Ofrece el PDF cuando la apruebe.
