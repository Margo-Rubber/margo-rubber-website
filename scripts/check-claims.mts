/**
 * FORBIDDEN-CLAIMS CHECK
 *
 * Scans everything a visitor could read for the strings that must never
 * ship — FORBIDDEN_CLAIMS in src/content/site.ts, drawn from the content
 * sheets' claim rules:
 *
 *   · the .mdx fallbacks under src/content
 *   · every published document in the Sanity dataset
 *   · JSX text and string literals in src/components and src/app
 *
 * The site carries known defects today (a 500-piece minimum, "within 24
 * hours", the wrong legal entity) that the copy pass removes. Failing the
 * build on all of them now would block every merge until that pass lands,
 * so violations are compared with claims-baseline.json: a match already in
 * the baseline is reported and tolerated; a match that is NOT is a new
 * defect and fails the build. `--update-baseline` rewrites the file from the
 * current state — run it only after deliberately fixing or accepting entries.
 * The copy pass ends with an empty baseline.
 *
 * Usage:  node scripts/check-claims.mts [--update-baseline] [--no-sanity]
 */

import fs from "node:fs";
import path from "node:path";
import { FORBIDDEN_CLAIMS } from "../src/content/site.ts";

const ROOT = path.resolve(import.meta.dirname, "..");
const BASELINE = path.join(ROOT, "claims-baseline.json");
const update = process.argv.includes("--update-baseline");
const noSanity = process.argv.includes("--no-sanity");

type Hit = { source: string; pattern: string; match: string; context: string };
const hits: Hit[] = [];

function scanText(source: string, text: string) {
  for (const { pattern } of FORBIDDEN_CLAIMS) {
    const re = new RegExp(pattern.source, pattern.flags.includes("g") ? pattern.flags : pattern.flags + "g");
    for (const m of text.matchAll(re)) {
      const at = m.index ?? 0;
      hits.push({
        source,
        pattern: pattern.source.slice(0, 40),
        match: m[0],
        context: text.slice(Math.max(0, at - 40), at + m[0].length + 40).replace(/\s+/g, " ").trim(),
      });
    }
  }
}

/* ── 1. .mdx fallbacks ─────────────────────────────────────────────── */
function walk(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) return walk(full);
    return /\.(mdx|tsx?)$/.test(e.name) ? [full] : [];
  });
}
for (const f of walk(path.join(ROOT, "src/content")).filter((f) => f.endsWith(".mdx"))) {
  // YAML comment lines quote the rules they explain; they never ship.
  scanText(path.relative(ROOT, f), fs.readFileSync(f, "utf8").replace(/^\s*#.*$/gm, ""));
}

/* ── 2. Component source — JSX text and string literals only ────────── */
for (const f of [...walk(path.join(ROOT, "src/components")), ...walk(path.join(ROOT, "src/app"))].filter((f) => f.endsWith(".tsx"))) {
  const src = fs.readFileSync(f, "utf8")
    // drop comments: the rules are quoted in them by design
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/^\s*\/\/.*$/gm, "");
  const literals = [...src.matchAll(/(["'`])((?:\\.|(?!\1)[^\\])*)\1/g)].map((m) => m[2]);
  const jsxText = [...src.matchAll(/>([^<>{}]{4,})</g)].map((m) => m[1]);
  scanText(path.relative(ROOT, f), [...literals, ...jsxText].join("\n"));
}

/* ── 3. The Sanity dataset — every string in every published document ── */
if (!noSanity) {
  const q = encodeURIComponent(`*[!(_id in path("drafts.**")) && _type != "imageOverride"]`);
  const res = await fetch(`https://jyg2beas.api.sanity.io/v2021-03-25/data/query/production?query=${q}`);
  const docs = ((await res.json()) as { result: Record<string, unknown>[] }).result;
  const strings = (v: unknown, out: string[]): string[] => {
    if (typeof v === "string") out.push(v);
    else if (Array.isArray(v)) v.forEach((x) => strings(x, out));
    else if (v && typeof v === "object") for (const [k, x] of Object.entries(v)) if (!k.startsWith("_") && k !== "confirmWithMargo") strings(x, out);
    return out;
  };
  for (const d of docs) scanText(`sanity:${String(d._id)}`, strings(d, []).join("\n"));
}

/* ── Compare with the baseline ─────────────────────────────────────── */
const key = (h: Hit) => `${h.source} :: ${h.pattern} :: ${h.match}`;
const current = new Map<string, Hit>();
for (const h of hits) current.set(key(h), h);

if (update) {
  fs.writeFileSync(BASELINE, JSON.stringify([...current.keys()].sort(), null, 2) + "\n");
  console.log(`baseline written: ${current.size} known violations`);
  process.exit(0);
}

const baseline = new Set<string>(fs.existsSync(BASELINE) ? (JSON.parse(fs.readFileSync(BASELINE, "utf8")) as string[]) : []);
const fresh = [...current.entries()].filter(([k]) => !baseline.has(k));
const fixed = [...baseline].filter((k) => !current.has(k));

const bySource = new Map<string, number>();
for (const h of current.values()) bySource.set(h.source.split(":")[0].split("/")[0], (bySource.get(h.source.split(":")[0].split("/")[0]) ?? 0) + 1);

console.log(`forbidden strings found: ${current.size}  (baseline ${baseline.size} · fixed since baseline ${fixed.length} · NEW ${fresh.length})`);
for (const [s, n] of bySource) console.log(`  ${s.padEnd(10)} ${n}`);

if (fresh.length) {
  console.log(`\nNEW violations — not in the baseline, so this fails:\n`);
  for (const [, h] of fresh.slice(0, 40)) console.log(`  ${h.source}\n    "${h.match}"  …${h.context}…\n    rule: ${FORBIDDEN_CLAIMS.find((c) => c.pattern.source.startsWith(h.pattern))?.why ?? ""}\n`);
  if (fresh.length > 40) console.log(`  … and ${fresh.length - 40} more`);
  process.exit(1);
}
if (fixed.length) console.log(`\n${fixed.length} baseline entries no longer match — run --update-baseline to record the progress.`);
console.log("\nno new forbidden strings.");
