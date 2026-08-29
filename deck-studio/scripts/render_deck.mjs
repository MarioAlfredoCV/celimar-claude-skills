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
 * si no hay ninguno, indica correr `node scripts/ensure_engine.mjs`.
 */
import fs from "node:fs";
import path from "node:path";
import url, { pathToFileURL } from "node:url";

// ---------- args ----------
function arg(name, def) {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : def;
}
const IN_DIR = arg("in", "slides");
const OUT = arg("out", "deck.pptx");
const SCALE = parseInt(arg("scale", "2"), 10) || 2;
const PNG_DIR = arg("png", OUT.replace(/\.pptx$/i, "") + "_png");

const SKILL_DIR = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), "..");
const LOCAL_LIBS_DIR = path.join(SKILL_DIR, ".local-libs", "lib");

// Ruta del ejecutable: override explícito, o el que Playwright ya resuelve solo. No se
// escanean carpetas a mano — el nombre de la subcarpeta del binario de Playwright cambia
// entre versiones (p. ej. "chrome-linux" vs "chrome-linux64"), y chromium.executablePath()
// siempre acierta con la instalación real, evitando ese acoplamiento.
function overrideChromium() {
  const c = process.env.DECK_STUDIO_CHROMIUM;
  if (c) { try { if (fs.statSync(c).isFile()) return c; } catch {} }
  return null;
}
// Si `ensure_engine.mjs` tuvo que vincular bibliotecas de sistema localmente (sandbox sin
// root al que le faltaba, p. ej., libXdamage.so.1 — ver ensure_engine.mjs), este directorio
// existe y hay que incluirlo en LD_LIBRARY_PATH para que Chromium las encuentre al lanzar.
function envWithLocalLibs() {
  if (!fs.existsSync(LOCAL_LIBS_DIR)) return process.env;
  const cur = process.env.LD_LIBRARY_PATH;
  return { ...process.env, LD_LIBRARY_PATH: cur ? `${LOCAL_LIBS_DIR}:${cur}` : LOCAL_LIBS_DIR };
}

async function launchBrowser(chromium) {
  const exe = overrideChromium() || (() => { try { return chromium.executablePath(); } catch { return null; } })();
  const env = envWithLocalLibs();
  const opts = { args: ["--no-sandbox", "--force-color-profile=srgb"], env };
  if (exe) opts.executablePath = exe;
  try {
    return await chromium.launch(opts);
  } catch (e) {
    if (exe) {
      try { return await chromium.launch({ args: opts.args, env }); } catch {}
    }
    console.error(
      "\nNo se pudo iniciar Chromium. Corre primero:\n" +
      "    node scripts/ensure_engine.mjs\n" +
      "o exporta la ruta de un Chromium existente en DECK_STUDIO_CHROMIUM.\n"
    );
    throw e;
  }
}

// ---------- main ----------
async function main() {
  let chromium, pptxgen;
  try { ({ chromium } = await import("playwright")); }
  catch { console.error("Falta 'playwright'. Corre: node scripts/ensure_engine.mjs"); process.exit(2); }
  try { pptxgen = (await import("pptxgenjs")).default; }
  catch { console.error("Falta 'pptxgenjs'. Corre: node scripts/ensure_engine.mjs"); process.exit(2); }

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
