import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

// Entry point: copies entry.txt to $MAKEFUN_OUTPUT_DIR/entry.txt.
// Node stdlib only. Resolves entry.txt relative to this file, never cwd.

const src = join(dirname(fileURLToPath(import.meta.url)), "entry.txt");
const text = readFileSync(src, "utf8");
const codePoints = [...text.trimEnd()].length;
if (codePoints < 1 || codePoints > 240) {
  throw new Error(`entry.txt must be 1-240 code points, got ${codePoints}`);
}
if (!text.trim()) {
  throw new Error("entry.txt must not be only whitespace");
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR;
if (!outDir) {
  throw new Error("MAKEFUN_OUTPUT_DIR is not set");
}
mkdirSync(outDir, { recursive: true });
const out = join(outDir, "entry.txt");
writeFileSync(out, text, "utf8");
const written = readFileSync(out, "utf8");
if (written !== text) {
  throw new Error("output does not match entry.txt byte-for-byte");
}
console.log(`wrote ${out} (${Buffer.byteLength(text, "utf8")} bytes, ${codePoints} code points)`);
