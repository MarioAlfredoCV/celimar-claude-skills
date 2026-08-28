# Técnicas

## Desagregar una sección gigante con `####` (con fidelidad)

Cuando una sección supera ~4.000 tokens (~9.000 caracteres), divídela con sub-encabezados
`####` de **títulos únicos**, **sin tocar la prosa**. Hazlo por script para garantizar
fidelidad: verifica que cada ancla es única, y que al revertir las inserciones el texto queda
**idéntico** al original.

```python
orig = open(MEM, encoding="utf-8").read()
# (ancla única en el texto ANTES de la cual insertas, encabezado #### a insertar)
ins = [("<ancla única 1>", "#### 5.1.1 Título…"),
       ("<ancla única 2>", "#### 5.1.2 Título…")]
for a, _ in ins:
    assert orig.count(a) == 1, a[:60]          # unicidad
t = orig
for a, h in ins:
    t = t.replace(a, f"{h}\n\n{a}", 1)
chk = t
for a, h in ins:
    chk = chk.replace(f"{h}\n\n{a}", a, 1)
assert chk == orig                             # fidelidad: revertir == original
open(MEM, "w", encoding="utf-8").write(t)
```

Los encabezados quedan **limpios** (sin tags ni rutas). La jerarquía es `#/##/###/####`.

## Verificar las anclas del MAPA contra la memoria

Cada título que el MAPA usa como ancla debe existir como encabezado real en la memoria
(prefijo de una línea). Si alguno no aparece, la memoria cambió sin regenerar el MAPA: corrige.

```python
import re
mem = open(MEM, encoding="utf-8").read()
mp  = open(MAPA, encoding="utf-8").read()
titles = re.findall(r"`(#{2,4} [^`]+)`", mp)
faltan = [t for t in titles if not any(l.startswith(t) for l in mem.splitlines())]
assert not faltan, faltan
```

## Extracción por tipo de archivo

- `.docx` → `pandoc "x.docx" -t plain`
- `.pdf`  → `pdftotext "x.pdf" -`
- `.pptx` → python-pptx (texto + notas del ponente)
- `.xlsx` → openpyxl / pandas
- `.md` / `.txt` → `cat`
- `.html` → `pandoc -t plain`

**Ignora ruido:** internos de apps, fuentes tipográficas, `__pycache__`, `desktop.ini`, y la
**carpeta de secretos** del config. Nombres acentuados en bash pueden fallar por NFC/NFD; si
`ls` falla, usa `python os.listdir` o globs.

## Regla de oro de extracción

Captura la **sustancia** que haría falta para responder una pregunta probable (decisión, dato,
estado, razón), **no** solo el nombre del archivo. Para archivos puramente operativos que un
gemelo en Chat nunca necesita, basta una mención breve en la cola "Dónde vive".
