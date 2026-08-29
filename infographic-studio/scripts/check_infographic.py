#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
check_infographic.py — QA técnico del PNG producido por infographic-studio.
Sin dependencias externas: lee las dimensiones directo del header PNG (IHDR).

Comprueba:
  - el archivo existe y es un PNG válido;
  - el ancho coincide con --width × --scale (el PNG sale a la escala de captura, no en CSS px
    crudos — por defecto --scale 2, igual que el default de render_infographic.mjs);
  - el alto es razonable (no sospechosamente bajo — señal de que el fullPage no capturó nada);
  - si se pasa --pdf, que el PDF también exista y no esté vacío.
El aviso de "alto no mayor que el ancho" es informativo, no reprueba el QA: una infografía
tipo one-pager horizontal es un formato válido cuando es deliberado.

Uso:
    python3 check_infographic.py <infografia.png> [--width 1200] [--scale 2] [--pdf infografia.pdf]
Salida: informe + exit 0 si pasa, 1 si hay problemas reales.
"""
import argparse
import struct
import sys
from pathlib import Path


def png_dimensions(path: Path):
    with open(path, "rb") as f:
        sig = f.read(8)
        if sig != b"\x89PNG\r\n\x1a\n":
            raise ValueError("no es un PNG válido (firma incorrecta)")
        f.read(4)  # longitud del chunk IHDR
        chunk_type = f.read(4)
        if chunk_type != b"IHDR":
            raise ValueError("no es un PNG válido (falta IHDR)")
        w, h = struct.unpack(">II", f.read(8))
        return w, h


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("png")
    ap.add_argument("--width", type=int, default=None, help="ancho del lienzo en CSS px (el mismo --width del render)")
    ap.add_argument("--scale", type=float, default=2, help="factor de captura usado al renderizar (default 2, igual que render_infographic.mjs)")
    ap.add_argument("--min-height", type=int, default=None, help="alto mínimo razonable, en px del PNG (default: 200 × --scale)")
    ap.add_argument("--pdf", default=None, help="ruta del PDF a validar también")
    args = ap.parse_args()
    if args.min_height is None:
        args.min_height = round(200 * args.scale)

    p = Path(args.png)
    if not p.is_file():
        print(f"✗ No existe {p}", file=sys.stderr); sys.exit(2)

    try:
        w, h = png_dimensions(p)
    except Exception as e:
        print(f"✗ No se pudo leer el PNG: {e}"); sys.exit(1)

    errors = []
    warnings = []

    if args.width:
        expected_w = round(args.width * args.scale)
        if w != expected_w:
            errors.append(
                f"ancho {w}px ≠ esperado ({expected_w}px = --width {args.width} × --scale {args.scale}) — "
                f"revisa el CSS del lienzo o el --scale usado al renderizar."
            )
    if h < args.min_height:
        errors.append(f"alto {h}px sospechosamente bajo (<{args.min_height}px) — ¿el fullPage no capturó el contenido?")
    if h <= w:
        warnings.append(f"alto ({h}px) no mayor que el ancho ({w}px) — normal si es un one-pager horizontal a "
                         f"propósito; revisa si no era la intención.")

    if args.pdf:
        pp = Path(args.pdf)
        if not pp.is_file():
            errors.append(f"no existe el PDF esperado en {pp}.")
        elif pp.stat().st_size < 1024:
            errors.append(f"el PDF en {pp} parece vacío ({pp.stat().st_size} bytes).")

    if warnings:
        print(f"⚠ {len(warnings)} aviso(s):")
        for wmsg in warnings:
            print("  •", wmsg)

    if errors:
        print(f"✗ {len(errors)} problema(s) en {p.name} ({w}×{h}px):")
        for e in errors:
            print("  •", e)
        print(f"\nResumen: {w}×{h}px, NO superado.")
        sys.exit(1)

    print(f"✓ {p.name}: {w}×{h}px, dimensiones correctas." + (f" PDF OK ({args.pdf})." if args.pdf else ""))
    sys.exit(0)


if __name__ == "__main__":
    main()
