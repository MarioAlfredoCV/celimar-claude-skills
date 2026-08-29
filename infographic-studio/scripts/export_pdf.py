#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
export_pdf.py — Envuelve el PNG de infographic-studio (o varios, si los hay) en un único
PDF, en orden, sin recomprimir (fidelidad total).

Método preferido: img2pdf (pip install img2pdf) — lossless, sin recompresión.
Fallback: Pillow (pip install Pillow), reduciendo a paleta si falta el codec JPEG.

Uso:
    python3 export_pdf.py --png <archivo_o_carpeta.png> --out <salida.pdf>
"""
import argparse
import sys
from pathlib import Path


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--png", required=True, help="un PNG, o un directorio con PNG (se toman todos, en orden)")
    ap.add_argument("--out", default="infografia.pdf", help="ruta del PDF de salida")
    args = ap.parse_args()

    src = Path(args.png)
    if src.is_dir():
        files = sorted(src.glob("*.png"))
    elif src.is_file():
        files = [src]
    else:
        files = []
    if not files:
        print(f"No hay PNG en {args.png}", file=sys.stderr); sys.exit(2)

    # 1) img2pdf: embebe el/los PNG tal cual (lossless).
    try:
        import img2pdf
        with open(args.out, "wb") as f:
            f.write(img2pdf.convert([str(x) for x in files]))
        print(f"OK: {args.out}  ({len(files)} página(s), lossless vía img2pdf)")
        return
    except ImportError:
        pass
    except Exception as e:
        print(f"img2pdf falló ({e}); intento con Pillow…", file=sys.stderr)

    # 2) Fallback Pillow.
    try:
        from PIL import Image
    except Exception:
        print("Instala img2pdf (recomendado) o Pillow: pip install img2pdf", file=sys.stderr)
        sys.exit(2)
    imgs = []
    for f in files:
        im = Image.open(f)
        try:
            im.convert("RGB").save("/dev/null", "JPEG")  # ¿hay codec JPEG?
            imgs.append(im.convert("RGB"))
        except Exception:
            imgs.append(im.convert("P", palette=Image.ADAPTIVE, colors=256))
    imgs[0].save(args.out, save_all=True, append_images=imgs[1:], resolution=150.0)
    print(f"OK: {args.out}  ({len(imgs)} página(s), vía Pillow)")


if __name__ == "__main__":
    main()
