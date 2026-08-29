#!/usr/bin/env node
/**
 * render_infographic.mjs — Motor de infographic-studio.
 * Renderiza UNA infografía HTML (ancho fijo, alto variable) a un PNG de alta resolución
 * con Chromium headless, capturando el alto real del contenido (fullPage) — sin recortar,
 * por larga que sea la pieza.
 *
 * Uso:
 *   node render_infographic.mjs --in <archivo.html> --out <salida.png> [--width 1200] [--scale 2]
 *     --in     archivo HTML de la infografía (UN solo lienzo, no una carpeta de láminas)
 *     --out    ruta del PNG de salida (default: infografia.png)
 *     --width  ancho del lienzo en px (default 1200) — debe casar con assets/canvas-frame.css
 *     --scale  factor de resolución (default 2 → nítido para pantalla; sube a 3 para impresión)
 *
 * Autónomo: solo requiere `playwright` (npm). Detecta el navegador del entorno; si no hay
 * ninguno, indica correr `node scripts/ensure_engine.mjs`.
 */
import fs from "node:fs";
import path from "node:path";
import url, { pathToFileURL } from "node:url";

function arg(name, def) {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : def;
}
const IN_FILE = arg("in", null);
const OUT = arg("out", "infografia.png");
const WIDTH = parseInt(arg("width", "1200"), 10) || 1200;
const SCALE = parseInt(arg("scale", "2"), 10) || 2;

const SKILL_DIR = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), "..");
const LOCAL_LIBS_DIR = path.join(SKILL_DIR, ".local-libs", "lib");

// Ruta del ejecutable: override explícito, o el que Playwright ya resuelve solo. No se
// escanean carpetas a mano — el nombre de la subcarpeta del binario de Playwright cambia
// entre versiones (p. ej. "chrome-linux" vs "chrome-linux64"), y chromium.executablePath()
// siempre acierta con la instalación real, evitando ese acoplamiento.
function overrideChromium() {
  const c = process.env.INFOGRAPHIC_STUDIO_CHROMIUM || process.env.DECK_STUDIO_CHROMIUM;
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
      "o exporta la ruta de un Chromium existente en INFOGRAPHIC_STUDIO_CHROMIUM.\n"
    );
    throw e;
  }
}

async function main() {
  if (!IN_FILE) { console.error("Falta --in <archivo.html>"); process.exit(2); }
  if (!fs.existsSync(IN_FILE)) { console.error(`No existe el archivo: ${IN_FILE}`); process.exit(2); }

  let chromium;
  try { ({ chromium } = await import("playwright")); }
  catch { console.error("Falta 'playwright'. Corre: node scripts/ensure_engine.mjs"); process.exit(2); }

  const outDir = path.dirname(path.resolve(OUT));
  fs.mkdirSync(outDir || ".", { recursive: true });

  const browser = await launchBrowser(chromium);
  const page = await browser.newPage({ viewport: { width: WIDTH, height: 1200 }, deviceScaleFactor: SCALE });
  const fileUrl = pathToFileURL(path.resolve(IN_FILE)).href;
  await page.goto(fileUrl, { waitUntil: "networkidle" });
  try { await page.evaluate(async () => { if (document.fonts?.ready) await document.fonts.ready; }); } catch {}

  // Captura el alto real del contenido — sin recorte, sin medir a mano.
  await page.screenshot({ path: OUT, fullPage: true });

  const dims = await page.evaluate(() => ({
    w: document.documentElement.scrollWidth,
    h: document.documentElement.scrollHeight,
  }));

  await browser.close();
  console.log(`\nOK: ${OUT}  (lienzo ${dims.w}×${dims.h}px @ ${SCALE}x → PNG ${dims.w * SCALE}×${dims.h * SCALE}px)`);
  if (dims.w !== WIDTH) {
    console.warn(`Aviso: el ancho renderizado (${dims.w}px) no coincide con --width (${WIDTH}px). Revisa el CSS del lienzo.`);
  }
}

main().catch(e => { console.error("ERROR:", e.message || e); process.exit(1); });
