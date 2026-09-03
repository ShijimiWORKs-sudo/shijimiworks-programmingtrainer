import { copyFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const pyodidePackageJson = require.resolve("pyodide/package.json");
const pyodideRoot = dirname(pyodidePackageJson);
const projectRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const outputDir = join(projectRoot, "public", "pyodide");

mkdirSync(outputDir, { recursive: true });

for (const filename of [
  "pyodide.asm.js",
  "pyodide.asm.wasm",
  "pyodide-lock.json",
  "python_stdlib.zip"
]) {
  copyFileSync(join(pyodideRoot, filename), join(outputDir, filename));
}

console.log("Copied Pyodide assets to public/pyodide");
