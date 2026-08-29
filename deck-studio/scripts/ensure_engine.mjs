#!/usr/bin/env node
// -*- coding: utf-8 -*-
/**
 * ensure_engine.mjs — Garantiza que el motor de deck-studio esté listo SIN que el
 * usuario instale nada a mano. Idempotente: en Cowork/Chat (motor precargado) solo
 * confirma; en Claude Code (desktop o CLI, en la máquina del usuario) instala lo que falte.
 * El motor Node vive en el node_modules de la carpeta de la skill (render_deck.mjs es fijo).
 *
 * Además de Node/Chromium/Python, este script sabe reparar un caso real encontrado en
 * sandboxes mínimos (p. ej. algunos entornos Cowork sin privilegios de root): Chromium se
 * descarga bien pero no arranca porque falta una biblioteca del sistema (típicamente de
 * X11) que normalmente se instalaría con `apt-get install` — algo que un usuario sin sudo no
 * puede hacer. En ese caso, `apt-get download` (que SÍ funciona sin root: solo descarga el
 * .deb, no lo instala) + `dpkg-deb -x` (extrae sin root) permiten vincular esa biblioteca de
 * forma local, dentro de esta misma carpeta (`.local-libs/`), sin tocar el sistema.
 */
import { createRequire } from "node:module";
import { execSync } from "node:child_process";
import path from "node:path";
import url from "node:url";
import fs from "node:fs";
const SKILL_DIR = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), "..");
const LOCAL_LIBS_DIR = path.join(SKILL_DIR, ".local-libs", "lib");
const log = (m) => console.log(m);
const warn = (m) => console.error(m);

function nodeDepsOk() {
  try {
    const req = createRequire(path.join(SKILL_DIR, "__probe__.js"));
    req.resolve("playwright");
    req.resolve("pptxgenjs");
    return true;
  } catch { return false; }
}
if (nodeDepsOk()) {
  log(`Node OK: playwright + pptxgenjs presentes en ${SKILL_DIR}.`);
} else {
  log(`Instalando playwright + pptxgenjs en ${SKILL_DIR}…`);
  try {
    execSync(`npm install playwright pptxgenjs --prefix "${SKILL_DIR}"`, { stdio: "inherit", windowsHide: true });
  } catch (e) { warn(`Falló la instalación Node (${e.message}).`); process.exit(2); }
}

// --- Ruta del ejecutable: override explícito, o el que Playwright ya resuelve solo. ---
// (No escaneamos carpetas a mano: el nombre de la subcarpeta del binario de Playwright ha
// cambiado entre versiones — p. ej. "chrome-linux" vs "chrome-linux64" — y confiar en
// chromium.executablePath() evita que ese detalle interno rompa la detección.)
function overrideChromiumPath() {
  const c = process.env.DECK_STUDIO_CHROMIUM;
  if (c) { try { if (fs.statSync(c).isFile()) return c; } catch {} }
  return null;
}
function localLibsEnv() {
  if (!fs.existsSync(LOCAL_LIBS_DIR)) return {};
  const cur = process.env.LD_LIBRARY_PATH;
  return { LD_LIBRARY_PATH: cur ? `${LOCAL_LIBS_DIR}:${cur}` : LOCAL_LIBS_DIR };
}
async function browserLaunches() {
  const { chromium } = await import("playwright");
  const exe = overrideChromiumPath() || (() => { try { return chromium.executablePath(); } catch { return null; } })();
  const env = { ...process.env, ...localLibsEnv() };
  try {
    const opts = { args: ["--no-sandbox"], env };
    if (exe) opts.executablePath = exe;
    const b = await chromium.launch(opts);
    await b.close();
    return true;
  } catch { return false; }
}

// --- Reparación de bibliotecas de sistema faltantes, sin root (ver cabecera del archivo). ---
const SONAME_TO_PKG = {
  "libnss3.so": "libnss3", "libnssutil3.so": "libnss3", "libsmime3.so": "libnss3", "libnssckbi.so": "libnss3",
  "libnspr4.so": "libnspr4",
  "libdbus-1.so.3": "libdbus-1-3",
  "libatk-1.0.so.0": "libatk1.0-0",
  "libatk-bridge-2.0.so.0": "libatk-bridge2.0-0",
  "libatspi.so.0": "libatspi2.0-0",
  "libcups.so.2": "libcups2",
  "libXcomposite.so.1": "libxcomposite1",
  "libXdamage.so.1": "libxdamage1",
  "libXfixes.so.3": "libxfixes3",
  "libXrandr.so.2": "libxrandr2",
  "libgbm.so.1": "libgbm1",
  "libxkbcommon.so.0": "libxkbcommon0",
  "libasound.so.2": "libasound2",
  "libpango-1.0.so.0": "libpango-1.0-0", "libpangocairo-1.0.so.0": "libpango-1.0-0",
  "libcairo.so.2": "libcairo2",
  "libX11.so.6": "libx11-6", "libX11-xcb.so.1": "libx11-xcb1",
  "libxcb.so.1": "libxcb1",
  "libXext.so.6": "libxext6",
  "libXrender.so.1": "libxrender1",
  "libXtst.so.6": "libxtst6",
  "libxshmfence.so.1": "libxshmfence1",
  "libgtk-3.so.0": "libgtk-3-0", "libgdk-3.so.0": "libgtk-3-0",
  "libglib-2.0.so.0": "libglib2.0-0", "libgobject-2.0.so.0": "libglib2.0-0", "libgio-2.0.so.0": "libglib2.0-0",
  "libgdk_pixbuf-2.0.so.0": "libgdk-pixbuf2.0-0",
  "libdrm.so.2": "libdrm2",
  "libEGL.so.1": "libegl1",
  "libGLESv2.so.2": "libgles2",
  "libexpat.so.1": "libexpat1",
  "libfontconfig.so.1": "libfontconfig1",
  "libfreetype.so.6": "libfreetype6",
  "libpixman-1.so.0": "libpixman-1-0",
  "libpng16.so.16": "libpng16-16",
  "libharfbuzz.so.0": "libharfbuzz0b",
  "libsecret-1.so.0": "libsecret-1-0",
  "libmanette-0.2.so.0": "libmanette-0.2-0",
  "libwayland-client.so.0": "libwayland-client0", "libwayland-egl.so.1": "libwayland-egl1", "libwayland-server.so.0": "libwayland-server0",
  "libatomic.so.1": "libatomic1",
};
function missingSonames(exePath) {
  try {
    const out = execSync(`ldd "${exePath}"`, { encoding: "utf8" });
    return [...out.matchAll(/^\s*(\S+)\s*=>\s*not found/gm)].map((m) => m[1]);
  } catch { return []; }
}
function copySoFiles(srcRoot, destDir) {
  let count = 0;
  function walk(dir) {
    let entries = [];
    try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
    for (const entry of entries) {
      const p = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(p);
      else if (/\.so(\.\d+)*$/.test(entry.name)) {
        try { fs.copyFileSync(p, path.join(destDir, entry.name)); count++; } catch {}
      }
    }
  }
  walk(srcRoot);
  return count;
}
function repairMissingSystemLibs(exePath) {
  if (!exePath) return false;
  const missing = missingSonames(exePath);
  if (missing.length === 0) return false;
  const pkgs = [...new Set(missing.map((s) => SONAME_TO_PKG[s]).filter(Boolean))];
  const unmapped = missing.filter((s) => !SONAME_TO_PKG[s]);
  if (unmapped.length) warn(`Bibliotecas de sistema sin mapeo conocido (no las puedo reparar sola): ${unmapped.join(", ")}`);
  if (pkgs.length === 0) return false;
  try { execSync("apt-get --version", { stdio: "ignore" }); } catch { warn("apt-get no está disponible; no puedo reparar dependencias del sistema."); return false; }
  const scratch = path.join(SKILL_DIR, ".local-libs", "_scratch");
  try { fs.mkdirSync(scratch, { recursive: true }); fs.mkdirSync(LOCAL_LIBS_DIR, { recursive: true }); } catch {}
  log(`Vinculando bibliotecas de sistema faltantes sin privilegios de root: ${pkgs.join(", ")}…`);
  try {
    execSync(`apt-get download ${pkgs.map((p) => `'${p}'`).join(" ")}`, { cwd: scratch, stdio: "inherit", windowsHide: true });
  } catch (e) {
    warn(`No pude descargar los paquetes con 'apt-get download' (${e.message}).`);
    try { fs.rmSync(scratch, { recursive: true, force: true }); } catch {}
    return false;
  }
  let placed = 0;
  let debFiles = [];
  try { debFiles = fs.readdirSync(scratch).filter((f) => f.endsWith(".deb")); } catch {}
  for (const f of debFiles) {
    const extractDir = path.join(scratch, "x_" + f.replace(/\.deb$/, ""));
    try {
      execSync(`dpkg-deb -x "${path.join(scratch, f)}" "${extractDir}"`, { stdio: "ignore" });
      placed += copySoFiles(extractDir, LOCAL_LIBS_DIR);
    } catch (e) { warn(`No pude extraer ${f}: ${e.message}`); }
  }
  try { fs.rmSync(scratch, { recursive: true, force: true }); } catch {}
  return placed > 0;
}

if (await browserLaunches()) {
  log("Chromium OK: el motor puede lanzar el navegador.");
} else {
  log("Instalando el navegador Chromium de Playwright (una sola vez, ~150 MB)…");
  try {
    execSync(`node "${path.join(SKILL_DIR, "node_modules", "playwright", "cli.js")}" install chromium`, { stdio: "inherit", windowsHide: true });
  } catch (e) { warn(`Falló la instalación del navegador (${e.message}).`); process.exit(2); }

  if (!(await browserLaunches())) {
    log("El navegador se instaló pero no arranca — puede faltar una biblioteca del sistema. Intentando reparar sin privilegios de root…");
    const { chromium } = await import("playwright");
    const exe = overrideChromiumPath() || (() => { try { return chromium.executablePath(); } catch { return null; } })();
    const repaired = repairMissingSystemLibs(exe);
    if (!repaired || !(await browserLaunches())) {
      warn(
        "Instalé Chromium pero el navegador sigue sin lanzar, incluso tras intentar reparar dependencias del " +
        "sistema.\nEste entorno puede carecer de una biblioteca que solo se instala con privilegios de root. " +
        "Revisa la salida de arriba para ver qué falta y, si tienes acceso de administrador, corre:\n" +
        "  sudo apt-get update && sudo apt-get install -y <paquete-faltante>"
      );
      process.exit(2);
    }
    log("Reparado: bibliotecas de sistema vinculadas localmente en .local-libs/ (no se tocó el sistema).");
  } else {
    log("Chromium OK: el motor puede lanzar el navegador.");
  }
}

function pyCmd() {
  for (const c of ["python", "python3"]) {
    try { execSync(`${c} --version`, { stdio: "ignore", windowsHide: true }); return c; } catch {}
  }
  return null;
}
const py = pyCmd();
if (!py) { warn("No encuentro Python 3. Instálalo con img2pdf + python-pptx para el PDF y el QA."); process.exit(2); }
function pyDepsOk() {
  try { execSync(`${py} -c "import img2pdf, pptx"`, { stdio: "ignore", windowsHide: true }); return true; } catch { return false; }
}
if (pyDepsOk()) {
  log("Python OK: img2pdf + python-pptx presentes.");
} else {
  log("Instalando img2pdf + python-pptx…");
  try {
    execSync(`${py} -m pip install img2pdf python-pptx`, { stdio: "inherit", windowsHide: true });
  } catch (e) { warn(`No pude instalar los paquetes de Python (${e.message}). Manual: ${py} -m pip install img2pdf python-pptx`); process.exit(2); }
}
log("Motor de deck-studio listo.");
process.exit(0);
