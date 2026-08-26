#!/usr/bin/env node
/**
 * render_deck.mjs — Motor de deck-studio.
 * Renderiza cada lámina HTML (1600×900) a PNG de alta resolución con Chromium headless
 * y las empaqueta en un .pptx de imágenes a pantalla completa (no editable, máxima fidelidad).
 *
 * Uso:
 *   node render_deck.mjs --in <dir_html> --out <salida.pptx> [--scale 2] [--png <dir_png>]
 *     --in    directorio con láminas HTML nombradas por orden (01.html, 02.html, …)
 *     --out   ruta del .pptx de salida (default: deck.pptx)
 *     --scale factor de resolución (default 2 → 3200×1800 por lámina)
 *     --png   directorio donde dejar los PNG (default: <out>_png/)
 *
 * Autónomo: solo requiere `playwright` y `pptxgenjs` (npm). Detecta el navegador del entorno;
 * si no hay ninguno, indica `npx playwright install chromium`.
 */
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

// ---------- args ----------
function arg(name, def) {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : def;
}
const IN_DIR = arg("in", "slides");
const OUT = arg("out", "deck.pptx");
const SCALE = parseInt(arg("scale", "2"), 10) || 2;
const PNG_DIR = arg("png", OUT.replace(/\.pptx$/i, "") + "_png");

// ---------- detección robusta del navegador ----------
function findChromium() {
  const candidates = [];
  if (process.env.DECK_STUDIO_CHROMIUM) candidates.push(process.env.DECK_STUDIO_CHROMIUM);
  candidates.push("/opt/pw-browsers/chromium"); // symlink típico en Cowork
  const base = process.env.PLAYWRIGHT_BROWSERS_PATH || "/opt/pw-browsers";
  try {
    for (const d of fs.readdirSync(base)) {
      if (/^chromium-/.test(d)) {
        candidates.push(path.join(base, d, "chrome-linux", "chrome"));
        candidates.push(path.join(base, d, "chrome-mac", "Chromium.app", "Contents", "MacOS", "Chromium"));
      }
    }
  } catch {}
  for (const c of candidates) {
    try { if (c && fs.statSync(c).isFile()) return c; } catch {}
    try { if (c && fs.lstatSync(c).isSymbolicLink()) return c; } catch {}
  }
  return null; // dejar que playwright use su propio navegador
}

async function launchBrowser(chromium) {
  const exe = findChromium();
  const opts = { args: ["--no-sandbox", "--force-color-profile=srgb"] };
  if (exe) opts.executablePath = exe;
  try {
    return await chromium.launch(opts);
  } catch (e) {
    if (exe) { // segundo intento con el navegador propio de playwright
      try { return await chromium.launch({ args: opts.args }); } catch {}
    }
    console.error(
      "\nNo se pudo iniciar Chromium. Si es la primera vez en este entorno, instala el navegador:\n" +
      "    npx playwright install chromium\n" +
      "o exporta la ruta de un Chromium existente en DECK_STUDIO_CHROMIUM.\n"
    );
    throw e;
  }
}

// ---------- main ----------
async function main() {
  let chromium, pptxgen;
  try { ({ chromium } = await import("playwright")); }
  catch { console.error("Falta 'playwright'. Instala: npm install playwright  (y npx playwright install chromium)"); process.exit(2); }
  try { pptxgen = (await import("pptxgenjs")).default; }
  catch { console.error("Falta 'pptxgenjs'. Instala: npm install pptxgenjs"); process.exit(2); }

  if (!fs.existsSync(IN_DIR)) { console.error(`No existe el directorio de láminas: ${IN_DIR}`); process.exit(2); }
  const htmls = fs.readdirSync(IN_DIR).filter(f => /\.html?$/i.test(f)).sort();
  if (!htmls.length) { console.error(`No hay archivos .html en ${IN_DIR}`); process.exit(2); }

  fs.mkdirSync(PNG_DIR, { recursive: true });
  const browser = await launchBrowser(chromium);
  const pngs = [];
  for (let i = 0; i < htmls.length; i++) {
    const page = await browser.newPage({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: SCALE });
    const url = pathToFileURL(path.resolve(IN_DIR, htmls[i])).href;
    await page.goto(url, { waitUntil: "networkidle" });
    try { await page.evaluate(async () => { if (document.fonts?.ready) await document.fonts.ready; }); } catch {}
    const out = path.join(PNG_DIR, String(i + 1).padStart(2, "0") + ".png");
    await page.screenshot({ path: out, clip: { x: 0, y: 0, width: 1600, height: 900 } });
    pngs.push(out);
    await page.close();
    console.log(`  render ${htmls[i]} → ${path.basename(out)}`);
  }
  await browser.close();

  const pres = new pptxgen();
  pres.defineLayout({ name: "DS", width: 13.333, height: 7.5 });
  pres.layout = "DS";
  for (const p of pngs) {
    const s = pres.addSlide();
    s.addImage({ path: p, x: 0, y: 0, w: 13.333, h: 7.5 });
  }
  await pres.writeFile({ fileName: OUT });
  console.log(`\nOK: ${OUT}  (${pngs.length} láminas)  ·  PNG en ${PNG_DIR}`);
}

main().catch(e => { console.error("ERROR:", e.message || e); process.exit(1); });
