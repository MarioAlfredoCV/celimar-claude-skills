#!/usr/bin/env node
// -*- coding: utf-8 -*-
/**
 * ensure_engine.mjs — Garantiza que `pptxgenjs` esté disponible en la carpeta
 * donde se construirá el deck, SIN que el usuario tenga que instalar nada a mano.
 *
 * Idempotente y con resolución de Node (carpeta + padres): si `pptxgenjs` ya resuelve
 * desde el directorio destino O desde cualquier carpeta padre (motor preinstalado en
 * esa misma carpeta o en una raíz superior), NO instala nada. Si no resuelve por ningún
 * lado, corre `npm install pptxgenjs --prefix <dir>` (crea <dir>/node_modules).
 *
 * Uso:
 *   node ensure_engine.mjs [--dir <carpeta_del_deck>]
 * Por defecto <dir> es el directorio de trabajo actual (cwd).
 */
import { createRequire } from "node:module";
import { execSync } from "node:child_process";
import path from "node:path";
import fs from "node:fs";
function arg(name, def) {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : def;
}
const dir = path.resolve(arg("dir", process.cwd()));
if (!fs.existsSync(dir)) {
  try {
    fs.mkdirSync(dir, { recursive: true });
  } catch (e) {
    console.error(`No se pudo crear la carpeta destino ${dir}: ${e.message}`);
    process.exit(2);
  }
}
function resolvesFrom(targetDir) {
  try {
    const req = createRequire(path.join(targetDir, "__probe__.js"));
    req.resolve("pptxgenjs");
    return true;
  } catch {
    return false;
  }
}
if (resolvesFrom(dir)) {
  console.log(`pptxgenjs ya disponible en ${dir} — no se instala nada.`);
  process.exit(0);
}
console.log(`pptxgenjs no está en ${dir}; instalando (una sola vez por carpeta)…`);
try {
  execSync(`npm install pptxgenjs --prefix "${dir}"`, {
    stdio: "inherit",
    windowsHide: true,
  });
} catch (e) {
  console.error(`Falló la instalación de pptxgenjs: ${e.message}`);
  process.exit(2);
}
if (resolvesFrom(dir)) {
  console.log(`OK: pptxgenjs listo en ${path.join(dir, "node_modules")}.`);
  process.exit(0);
}
console.error("La instalación terminó pero pptxgenjs sigue sin resolver. Revisa npm/permisos.");
process.exit(2);
