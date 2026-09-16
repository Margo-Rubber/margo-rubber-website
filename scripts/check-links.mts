/**
 * INTERNAL LINK INTEGRITY GATE
 *
 * Every internal href in navigation, MDX content and page components is checked
 * against the routes that actually build. This exists because the Figma copy
 * names products and sectors that are not in Margo's 9+9 architecture
 * (moulded-components, extruded-profiles, rubber-sheets, diaphragms,
 * medical-pharma, general-engineering), and those names were being transcribed
 * straight into hrefs, producing links that 404 in production but that nothing
 * in the build complained about.
 *
 * It also guards a second, subtler failure. Retargeting links can leave two
 * entries in the same list pointing at the same hub. That is fine in itself,
 * but it silently breaks any list keyed by href: React drops or duplicates
 * children rather than erroring, so a row just renders short. That is exactly
 * what happened to the /about portfolio chips. So this script FAILS on any
 * `key={x.href}` in a component, and reports which content lists have
 * repeating hrefs.
 *
 *   node scripts/check-links.mts            report only
 *   node scripts/check-links.mts --strict   exit 1 on any unexpected break
 *
 * Routes in PLANNED are unbuilt but are in the route map (§4.0), so they are
 * reported separately rather than failing the gate. Delete an entry from
 * PLANNED the moment its page ships.
 */

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";

const SRC = "src";

/** In the route map but not built yet. Not failures. */
const PLANNED = new Set<string>([]);

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

const files = walk(SRC);

/* ── What routes exist? ─────────────────────────────────────────────────── */
const live = new Set<string>();

const stripGroups = (p: string) =>
  p.replace(/\/\([^/]+\)/g, "").replace(/^\([^/]+\)/, "") || "/";

// Route handlers are routes too. Without this, an href to /api/enquiries —
// the dashboard's CSV export link — reads as broken.
for (const f of files) {
  if (!f.endsWith("route.ts") && !f.endsWith("route.tsx")) continue;
  const route = stripGroups(
    f.slice(SRC.length + 4, -(f.endsWith(".tsx") ? "/route.tsx" : "/route.ts").length),
  );
  if (!route.includes("[")) live.add(route);
}

for (const f of files) {
  if (!f.endsWith("page.tsx")) continue;
  const route =
    f
      .slice(SRC.length + 4, -"/page.tsx".length)
      // Route groups — `(site)`, `(dash)` — organise files without adding a
      // path segment, so they must not appear in the route either. Without
      // this every grouped page reads as a route nobody links to, and every
      // real link to it reads as broken.
      .replace(/\/\([^/]+\)/g, "")
      .replace(/^\([^/]+\)/, "") || "/";
  if (!route.includes("[")) live.add(route);
}

const slugs = (dir: string) =>
  readdirSync(join(SRC, "content", dir))
    .filter((f) => f.endsWith(".mdx") && !f.startsWith("_"))
    .map((f) => f.slice(0, -4));

for (const s of slugs("products")) live.add(`/products/${s}`);
for (const s of slugs("industries")) live.add(`/industries/${s}`);
for (const s of slugs("resources")) live.add(`/resources/${s}`);
for (const s of slugs("legal")) live.add(`/legal/${s}`);

/* ── What is linked? ────────────────────────────────────────────────────── */
type Hit = { href: string; file: string };
const hits: Hit[] = [];

for (const f of files) {
  if (!/\.(mdx|ts|tsx)$/.test(f)) continue;
  if (f.includes("scripts/")) continue;
  const text = readFileSync(f, "utf8");
  for (const m of text.matchAll(/href[:=]\s*["'{]?\s*["']?(\/[a-z0-9/#-]*)/gi)) {
    hits.push({ href: m[1], file: f });
  }
}

/* ── Compare ────────────────────────────────────────────────────────────── */
const broken = new Map<string, Set<string>>();
const planned = new Map<string, Set<string>>();

for (const { href, file } of hits) {
  // `/#id` is root-relative: it navigates to the homepage and looks for the
  // section there. The in-page form is `#id`; the cross-page form is
  // `/page#id`. Content sheets, Build Instructions §anchors.
  if (href.startsWith("/#")) {
    if (!broken.has(href)) broken.set(href, new Set());
    broken
      .get(href)!
      .add(
        `${file.replace(`${SRC}/`, "")} (root-relative anchor — use #id or /page#id)`,
      );
    continue;
  }
  const path = href.split("#")[0];
  // A bare "#anchor" link has no path component; nothing to resolve.
  if (!path || path === "/") continue;
  if (live.has(path)) continue;
  const bucket = PLANNED.has(path) ? planned : broken;
  if (!bucket.has(path)) bucket.set(path, new Set());
  bucket.get(path)!.add(file.replace(`${SRC}/`, ""));
}

/* ── Href-keyed lists ────────────────────────────────────────────────────
   The real defect. `key={a.href}` is only safe while every href in the list
   is distinct, and link retargeting breaks that invisibly. Key on label. */
const hrefKeyed: { file: string; line: number; text: string }[] = [];

for (const f of files) {
  if (!/\.tsx$/.test(f)) continue;
  readFileSync(f, "utf8")
    .split("\n")
    .forEach((line, i) => {
      if (/key=\{\s*[A-Za-z_$][\w$]*\.href\s*\}/.test(line)) {
        hrefKeyed.push({
          file: f.replace(`${SRC}/`, ""),
          line: i + 1,
          text: line.trim(),
        });
      }
    });
}

/* ── Content lists whose hrefs repeat ────────────────────────────────────
   Informational: these are the lists that would break if anything ever keys
   them by href again. */
const collapsed: { file: string; path: string; dupes: string }[] = [];

function scanForDupes(node: unknown, path: string, file: string): void {
  if (Array.isArray(node)) {
    const hrefs = node
      .filter((i): i is Record<string, unknown> => !!i && typeof i === "object")
      .map((i) => i.href)
      .filter((h): h is string => typeof h === "string");

    const counts = new Map<string, number>();
    for (const h of hrefs) counts.set(h, (counts.get(h) ?? 0) + 1);
    const dupes = [...counts].filter(([, n]) => n > 1);
    if (dupes.length) {
      collapsed.push({
        file,
        path: path || "(root)",
        dupes: dupes.map(([h, n]) => `${h} x${n}`).join(", "),
      });
    }
    node.forEach((item, i) => scanForDupes(item, `${path}[${i}]`, file));
  } else if (node && typeof node === "object") {
    for (const [k, v] of Object.entries(node)) {
      scanForDupes(v, path ? `${path}.${k}` : k, file);
    }
  }
}

for (const f of files) {
  if (!f.endsWith(".mdx")) continue;
  try {
    const { data } = matter(readFileSync(f, "utf8"));
    scanForDupes(data, "", f.replace(`${SRC}/content/`, ""));
  } catch {
    console.log(`  !  could not parse frontmatter: ${f}`);
  }
}

const strict = process.argv.includes("--strict");

console.log(`\n  Internal links checked against ${live.size} live routes\n`);

if (planned.size) {
  console.log(`  ○  ${planned.size} link(s) to PLANNED routes (not failures):`);
  for (const [path, where] of [...planned].sort()) {
    console.log(`     ${path}  ←  ${[...where].sort().join(", ")}`);
  }
  console.log("");
}

if (collapsed.length) {
  console.log(`  ○  ${collapsed.length} content list(s) with repeating hrefs.`);
  console.log("     Fine as long as nothing keys them by href:\n");
  for (const c of collapsed) {
    console.log(`     ${c.file} → ${c.path}`);
    console.log(`        ${c.dupes}`);
  }
  console.log("");
}

if (hrefKeyed.length) {
  console.log(`  ✗  ${hrefKeyed.length} list(s) KEYED BY HREF. Key by label instead:\n`);
  for (const h of hrefKeyed) {
    console.log(`     ${h.file}:${h.line}`);
    console.log(`        ${h.text}`);
  }
  console.log("");
}

if (broken.size === 0 && hrefKeyed.length === 0) {
  console.log("  ✓  No broken internal links. No href-keyed lists.\n");
  process.exit(0);
}

if (broken.size === 0) {
  // Links themselves are fine; the href-keyed lists above are the failure.
  console.log("  ✓  No broken internal links (but fix the keys above).\n");
  process.exit(strict ? 1 : 0);
}

console.log(`  ✗  ${broken.size} BROKEN internal link target(s):\n`);
for (const [path, where] of [...broken].sort()) {
  console.log(`     ${path}`);
  for (const w of [...where].sort()) console.log(`        ← ${w}`);
}
console.log("");
process.exit(strict ? 1 : 0);
