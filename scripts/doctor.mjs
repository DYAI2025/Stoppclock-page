import fs from "fs/promises";
import path from "path";

const ROOT = process.cwd();
const FORBID = /(lovable|dev-?\s?agent|tagger|Loading app)/i;
const SKIP = new Set([".git", "node_modules", "dist", ".next", ".cache", "test-results", "playwright-report", "specs", "stoppclock_page", "stoppclock_speckit"]);

async function* walk(dir) {
  for (const e of await fs.readdir(dir, {withFileTypes: true})) {
    if (SKIP.has(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      yield* walk(p);
    } else if (e.isFile()) {
      yield p;
    }
  }
}

const bad = [];
for await (const f of walk(ROOT)) {
  // Skip root-level .md files (SSoT docs)
  if (path.dirname(f) === ROOT && f.endsWith('.md')) continue;
  // Skip the doctor script itself
  if (f === path.join(ROOT, 'scripts', 'doctor.mjs')) continue;
  const t = await fs.readFile(f, "utf8").catch(() => null);
  if (!t) continue;
  if (FORBID.test(t)) bad.push(f);
}

if (bad.length) {
  console.error("[doctor] Forbidden tokens in:\n" + bad.map(x => " - " + x).join("\n"));
  process.exit(2);
}

console.log("[doctor] OK");
