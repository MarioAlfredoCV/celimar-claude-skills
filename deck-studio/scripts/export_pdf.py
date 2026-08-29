#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
export_pdf.py — Une los PNG de un deck (render_deck.mjs) en un único PDF, en orden.
Embebe los PNG sin recomprimir (fidelidad total).

Método preferido: img2pdf (pip install img2pdf) — lossless, sin recompresión.
Fallback: Pillow (pip install Pillow), reduciendo a paleta si falta el codec JPEG.

Uso:
    python3 export_pdf.py --png <dir_png> --out <salida.pdf>
"""
import argparse
import sys
from pathlib import Path


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--png", required=True, help="directorio con los PNG numerados")
    ap.add_argument("--out", default="deck.pdf", help="ruta del PDF de salida")
    args = ap.parse_args()

    files = sorted(Path(args.png).glob("*.png"))
    if not files:
        print(f"No hay PNG en {args.png}", file=sys.stderr); sys.exit(2)

    # 1) img2pdf: embebe los PNG tal cual (lossless).
    try:
        import img2pdf
        with open(args.out, "wb") as f:
            f.write(img2pdf.convert([str(x) for x in files]))
        print(f"OK: {args.out}  ({len(files)} páginas, lossless vía img2pdf)")
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
    print(f"OK: {args.out}  ({len(imgs)} páginas, vía Pillow)")


if __name__ == "__main__":
    main()
