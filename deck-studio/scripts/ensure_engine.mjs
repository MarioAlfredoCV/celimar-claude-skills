#!/usr/bin/env node
// -*- coding: utf-8 -*-
/**
 * ensure_engine.mjs — Garantiza que el motor de deck-studio esté listo SIN que el
 * usuario instale nada a mano. Idempotente: en Cowork/Chat (motor precargado) solo
 * confirma; en Claude Code (desktop o CLI, en la máquina del usuario) instala lo que falte.
 * El motor Node vive en el node_modules de la carpeta de la skill (render_deck.mjs es fijo).
 */
import { createRequire } from "node:module";
import { execSync } from "node:child_process";
import path from "node:path";
import url from "node:url";
import fs from "node:fs";
const SKILL_DIR = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), "..");
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
function findChromiumPath() {
  const cands = [];
  if (process.env.DECK_STUDIO_CHROMIUM) cands.push(process.env.DECK_STUDIO_CHROMIUM);
  cands.push("/opt/pw-browsers/chromium");
  const base = process.env.PLAYWRIGHT_BROWSERS_PATH || "/opt/pw-browsers";
  try {
    for (const d of fs.readdirSync(base)) {
      if (/^chromium-/.test(d)) {
        cands.push(path.join(base, d, "chrome-linux", "chrome"));
        cands.push(path.join(base, d, "chrome-mac", "Chromium.app", "Contents", "MacOS", "Chromium"));
      }
    }
  } catch {}
  for (const c of cands) { try { if (c && fs.statSync(c).isFile()) return c; } catch {} }
  return null;
}
async function browserLaunches() {
  const { chromium } = await import("playwright");
  const exe = findChromiumPath();
  try {
    const opts = { args: ["--no-sandbox"] };
    if (exe) opts.executablePath = exe;
    const b = await chromium.launch(opts);
    await b.close();
    return true;
  } catch {}
  try {
    const b = await chromium.launch({ args: ["--no-sandbox"] });
    await b.close();
    return true;
  } catch { return false; }
}
if (await browserLaunches()) {
  log("Chromium OK: el motor puede lanzar el navegador.");
} else {
  log("Instalando el navegador Chromium de Playwright (una sola vez, ~150 MB)…");
  try {
    execSync(`node "${path.join(SKILL_DIR, "node_modules", "playwright", "cli.js")}" install chromium`, { stdio: "inherit", windowsHide: true });
  } catch (e) { warn(`Falló la instalación del navegador (${e.message}).`); process.exit(2); }
  if (!(await browserLaunches())) { warn("Instalé Chromium pero el navegador sigue sin lanzar. Revisa Playwright."); process.exit(2); }
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
