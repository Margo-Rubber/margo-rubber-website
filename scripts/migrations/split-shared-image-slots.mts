/**
 * SPLIT EVERY SHARED IMAGE SLOT INTO ONE SLOT PER PLACEMENT.
 *
 * Client instruction, 2026-09-15: photographs will be changed individually,
 * so no two places on the site may draw the same slot. Before this, sixteen
 * category and industry pages used their grid card as the hero, the home
 * page borrowed the About hero, four material-card images were shared by
 * nine category pages, one facility photo sat on all nine industry pages,
 * eight export market blocks shared five photos, and every part page drew
 * the same three plates. Replacing any of them changed every page at once.
 *
 * After: one slot per placement. Each new slot starts with the SAME FILE as
 * the slot it was split from, so the site looks identical until an editor
 * replaces one — and then only that place changes.
 *
 * Three steps, run in this order, because getImage() throws on a key it does
 * not know and documents are read by whatever code is deployed:
 *
 *   --write-code   registry entries, labels, .mdx fallbacks, one component.
 *                  Commit, merge, deploy. Old keys are KEPT for now.
 *   --patch-docs   point every Sanity document at its new keys. Needs
 *                  SANITY_WRITE_TOKEN in .env.local. Exports the dataset
 *                  first. Safe only once --write-code is live.
 *   --verify       prove no document references an old shared key any more,
 *                  so the old keys can be deleted in a later commit.
 *
 * With no flag it prints the plan and changes nothing.
 */

import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "../..");
const PROJECT = "jyg2beas";
const DATASET = "production";
const API = `https://${PROJECT}.api.sanity.io/v2021-03-25`;

const mode = process.argv[2] ?? "--plan";

/* ── Load the published documents ─────────────────────────────────────── */

type Doc = Record<string, unknown> & { _id: string; _type: string };
const query = encodeURIComponent(
  `*[!(_id in path("drafts.**")) && _type in ["homePage","productsHub","industriesHub","productCategory","industry","aboutPage","whyMargoPage","exportPage","sku"]]`,
);
const docs: Doc[] = (
  (await (await fetch(`${API}/data/query/${DATASET}?query=${query}`)).json()) as { result: Doc[] }
).result;
const byId = new Map(docs.map((d) => [d._id, d]));
const get = (d: Doc, p: string): unknown =>
  p
    .replace(/\[(\d+)\]/g, ".$1")
    .split(".")
    .reduce<unknown>((o, k) => (o as Record<string, unknown> | undefined)?.[k], d);
const str = (v: unknown) => (typeof v === "string" ? v : "");
const slugOf = (d: Doc) => str(get(d, "slug.current"));

/* ── The plan ───────────────────────────────────────────────────────────── */

type NewSlot = { key: string; from: string; title: string; where: string; page: string };
type Patch = { id: string; path: string; value: string };
type Mdx = { file: string; from: string; to: string; nth: number };

const slots: NewSlot[] = [];
const patches: Patch[] = [];
const mdx: Mdx[] = [];

const add = (s: NewSlot, p: Patch, m?: Mdx) => {
  slots.push(s);
  patches.push(p);
  if (m) mdx.push(m);
};

const cats = docs.filter((d) => d._type === "productCategory").sort((a, b) => slugOf(a).localeCompare(slugOf(b)));
const inds = docs.filter((d) => d._type === "industry").sort((a, b) => slugOf(a).localeCompare(slugOf(b)));
const home = byId.get("homePage-home")!;
const hub = byId.get("productsHub-products")!;
const about = byId.get("aboutPage-about")!;
const why = byId.get("whyMargoPage-why-margo")!;
const exp = byId.get("exportPage-export")!;
const catName = new Map(cats.map((c) => [slugOf(c), str(c.navLabel)]));
const indName = new Map(inds.map((i) => [slugOf(i), str(i.navLabel)]));

// Home page — its own hero, and its own copy of each portfolio card.
add(
  { key: "home.hero", from: "about.hero", title: "Home page — hero background", where: "Home page, the photograph behind the heading at the top.", page: "/" },
  { id: home._id, path: "hero.image", value: "home.hero" },
  { file: "src/content/pages/home.mdx", from: "about.hero", to: "home.hero", nth: 1 },
);
(get(home, "portfolio.items") as { image: string; name: string }[]).forEach((it, i) => {
  const cat = it.image.replace("products.card.", "");
  add(
    { key: `home.portfolio.${cat}`, from: it.image, title: `Home — ${it.name} portfolio card`, where: `Home page, ‘Our portfolio’ grid — card ${i + 1} of 11.`, page: "/" },
    { id: home._id, path: `portfolio.items[${i}].image`, value: `home.portfolio.${cat}` },
    { file: "src/content/pages/home.mdx", from: it.image, to: `home.portfolio.${cat}`, nth: 1 },
  );
});

// Products hub — its own copy of each industry sector card.
(get(hub, "sectors.items") as { image: string; name: string }[]).forEach((it, i) => {
  const ind = it.image.replace("industries.", "");
  add(
    { key: `products.sectors.${ind}`, from: it.image, title: `Products page — ${it.name} sector card`, where: `Products page, ‘Industries we serve’ — card ${i + 1} of 9.`, page: "/products" },
    { id: hub._id, path: `sectors.items[${i}].image`, value: `products.sectors.${ind}` },
    { file: "src/content/pages/products.mdx", from: it.image, to: `products.sectors.${ind}`, nth: 1 },
  );
});

// Category pages — own hero where it borrowed the card; own material cards.
for (const c of cats) {
  const slug = slugOf(c);
  const name = catName.get(slug)!;
  const heroKey = str(get(c, "hero.image"));
  if (heroKey.startsWith("products.card.")) {
    add(
      { key: `products.${slug}.hero`, from: heroKey, title: `${name} page — hero background`, where: `${name} category page, the photograph behind the heading at the top.`, page: `/products/${slug}` },
      { id: c._id, path: "hero.image", value: `products.${slug}.hero` },
      { file: `src/content/products/${slug}.mdx`, from: heroKey, to: `products.${slug}.hero`, nth: 1 },
    );
  }
  const sections = c.sections as { _type: string; items?: { image?: string; name?: string; code?: string }[] }[];
  sections.forEach((s, si) => {
    if (s._type !== "block.materialCards") return;
    s.items!.forEach((it, ii) => {
      if (!it.image?.startsWith("products.material.")) return;
      const comp = it.image.replace("products.material.", "");
      add(
        { key: `products.${slug}.material.${comp}`, from: it.image, title: `${name} — ${it.name ?? comp.toUpperCase()} material card`, where: `${name} category page, ‘Material selection’ section — card ${ii + 1} of ${s.items!.length}.`, page: `/products/${slug}` },
        { id: c._id, path: `sections[${si}].items[${ii}].image`, value: `products.${slug}.material.${comp}` },
        { file: `src/content/products/${slug}.mdx`, from: it.image, to: `products.${slug}.material.${comp}`, nth: 1 },
      );
    });
  });
}

// Industry pages — own hero, own component-tab photos, own facility photo.
for (const d of inds) {
  const slug = slugOf(d);
  const name = indName.get(slug)!;
  const heroKey = str(get(d, "hero.image"));
  if (heroKey === `industries.${slug}`) {
    add(
      { key: `industries.${slug}.hero`, from: heroKey, title: `${name} page — hero background`, where: `${name} industry page, the photograph behind the heading at the top.`, page: `/industries/${slug}` },
      { id: d._id, path: "hero.image", value: `industries.${slug}.hero` },
      { file: `src/content/industries/${slug}.mdx`, from: heroKey, to: `industries.${slug}.hero`, nth: 1 },
    );
  }
  const sections = d.sections as { _type: string; image?: string; items?: { image?: string; name?: string }[] }[];
  sections.forEach((s, si) => {
    if (s._type === "block.componentTabs") {
      s.items!.forEach((it, ii) => {
        if (!it.image) return;
        add(
          { key: `industries.${slug}.component.${ii + 1}`, from: it.image, title: `${name} — ‘${it.name}’ component photo`, where: `${name} industry page, ‘Components we supply’ — tab ${ii + 1} of ${s.items!.length} (${it.name}).`, page: `/industries/${slug}` },
          { id: d._id, path: `sections[${si}].items[${ii}].image`, value: `industries.${slug}.component.${ii + 1}` },
          // In the .mdx the hero uses the same key as the tabs; hero was nth 1, so tabs are 1.. after it is renamed.
          { file: `src/content/industries/${slug}.mdx`, from: it.image, to: `industries.${slug}.component.${ii + 1}`, nth: 1 },
        );
      });
    }
    if (s.image === "industries.mining.facility" && slug !== "mining") {
      add(
        { key: `industries.${slug}.facility`, from: s.image, title: `${name} — quality section photo`, where: `${name} industry page, ‘Quality & certification’ section.`, page: `/industries/${slug}` },
        { id: d._id, path: `sections[${si}].image`, value: `industries.${slug}.facility` },
        { file: `src/content/industries/${slug}.mdx`, from: s.image, to: `industries.${slug}.facility`, nth: 1 },
      );
    }
  });
}

// About page — the closing image, the audit image and the founder portrait
// each had a twin elsewhere on the same page.
add(
  { key: "about.closing", from: "about.hero", title: "About — closing section photo", where: "About page, the photograph in the closing section at the bottom.", page: "/about" },
  { id: about._id, path: "closing.image", value: "about.closing" },
  { file: "src/content/pages/about.mdx", from: "about.hero", to: "about.closing", nth: 2 },
);
add(
  { key: "about.audit", from: "about.manufacturing.floor", title: "About — certifications audit photo", where: "About page, ‘Certifications’ section, the audit photograph.", page: "/about" },
  { id: about._id, path: "awards.auditImage", value: "about.audit" },
  { file: "src/content/pages/about.mdx", from: "about.manufacturing.floor", to: "about.audit", nth: 2 },
);
add(
  { key: "about.founder", from: "about.team.portrait-b", title: "About — founder quote portrait", where: "About page, the portrait beside the founder quote.", page: "/about" },
  { id: about._id, path: "leadership.image", value: "about.founder" },
  { file: "src/content/pages/about.mdx", from: "about.team.portrait-b", to: "about.founder", nth: 1 },
);

// Why Margo — borrowed the About page's global-reach photo.
add(
  { key: "why.global-export", from: "about.presence", title: "Why Margo — ‘Global export’ photo", where: "Why Margo page, ‘Global export’ section.", page: "/why-margo" },
  { id: why._id, path: "globalExport.image", value: "why.global-export" },
  { file: "src/content/pages/why-margo.mdx", from: "about.presence", to: "why.global-export", nth: 1 },
);

// Export page — its own hero, and one photo per market block.
add(
  { key: "export.hero", from: "export.vessel", title: "Export page — hero background", where: "Export page, the photograph behind the heading at the top.", page: "/export" },
  { id: exp._id, path: "hero.image", value: "export.hero" },
  { file: "src/content/pages/export.mdx", from: "export.vessel", to: "export.hero", nth: 1 },
);
(exp.markets as { image: string; chip: string; heading: string }[]).forEach((m, i) => {
  add(
    { key: `export.market.${i + 1}`, from: m.image, title: `Export — ${m.chip} market photo`, where: `Export page, market block ${i + 1} of 8 (“${m.heading}”).`, page: "/export" },
    { id: exp._id, path: `markets[${i}].image`, value: `export.market.${i + 1}` },
    { file: "src/content/pages/export.mdx", from: m.image, to: `export.market.${i + 1}`, nth: 1 },
  );
});

// Certifications — the hero was hard-coded to a facility photo in the component.
slots.push({ key: "certifications.hero", from: "certifications.facility.inspection", title: "Certifications page — hero background", where: "Certifications page, the photograph behind the heading at the top.", page: "/certifications" });

// Part pages — one product photo per part. The two metalworking plates stay
// shared for now: the SKU template rework (sheet 32) removes them.
for (const d of docs.filter((d) => d._type === "sku")) {
  const slug = slugOf(d);
  const [cat, part] = slug.split("--");
  const key = `sku.${slug}.photo`;
  slots.push({ key, from: "sku.product", title: `${str(d.h1)} — product photo`, where: `The part page for ${str(d.h1)}: the main gallery image and thumbnails 1 and 4.`, page: `/products/${cat}/${part}` });
  patches.push({ id: d._id, path: "gallery.main", value: key });
}

/* ── Plan ───────────────────────────────────────────────────────────────── */

const byArea = new Map<string, number>();
for (const s of slots) byArea.set(s.key.split(".")[0], (byArea.get(s.key.split(".")[0]) ?? 0) + 1);
console.log(`\n${slots.length} new slots · ${patches.length} document patches across ${new Set(patches.map((p) => p.id)).size} documents · ${mdx.length} .mdx edits`);
for (const [a, n] of byArea) console.log(`  ${a.padEnd(16)} ${n}`);

/* ── --write-code ───────────────────────────────────────────────────────── */

if (mode === "--write-code") {
  // 1. Registry: clone each source entry under the new key. Same file, same
  //    blur, same size, same alt, same status.
  const regPath = path.join(ROOT, "src/content/images.ts");
  let reg = fs.readFileSync(regPath, "utf8");
  const entryOf = (key: string) => {
    const m = reg.match(new RegExp(`^  "${key.replace(/[.]/g, "\\.")}": \\{\\n[\\s\\S]*?\\n  \\},\\n`, "m"));
    if (!m) throw new Error(`registry: no entry for ${key}`);
    return m[0];
  };
  const clones = slots
    .filter((s) => !reg.includes(`"${s.key}":`))
    .map((s) => entryOf(s.from).replace(`"${s.from}":`, `"${s.key}":`))
    .join("");
  const marker = "} as const satisfies Record<string, ImageEntry>;";
  reg = reg.replace(
    marker,
    `\n  /* --- Split from shared slots, 2026-09-15 ------------------------------\n     One slot per placement, so a photograph can be changed in one place\n     without moving anywhere else. Each starts as a copy of the slot it was\n     split from; see scripts/migrations/split-shared-image-slots.mts. */\n${clones}${marker}`,
  );
  fs.writeFileSync(regPath, reg);

  // 2. Labels for the new slots.
  const labPath = path.join(ROOT, "src/content/image-slot-labels.ts");
  let lab = fs.readFileSync(labPath, "utf8");
  const q = (s: string) => JSON.stringify(s);
  const block = slots
    .filter((s) => !lab.includes(`"${s.key}":`))
    .map((s) => `  ${q(s.key)}: {\n    title: ${q(s.title)},\n    where: ${q(s.where)},\n    page: ${q(s.page)},\n  },\n`)
    .join("");
  lab = lab.replace(
    "} satisfies Record<ImageKey, SlotLabel>;",
    `\n  /* ── Split from shared slots, 2026-09-15 — one per placement ────── */\n${block}} satisfies Record<ImageKey, SlotLabel>;`,
  );
  fs.writeFileSync(labPath, lab);

  // 3. The .mdx fallbacks, so a fallback render draws the same slots as the CMS.
  const byFile = new Map<string, Mdx[]>();
  for (const m of mdx) byFile.set(m.file, [...(byFile.get(m.file) ?? []), m]);
  for (const [file, edits] of byFile) {
    const p = path.join(ROOT, file);
    let src = fs.readFileSync(p, "utf8");
    for (const e of edits) {
      // Replace the nth remaining occurrence of the exact `image: <key>` line.
      // Fields are spelled `image:`, `heroImage:`, `auditImage:`, `inset:` …
      const re = new RegExp(`((?:[iI]mage|inset|main|lower):\\s*)${e.from.replace(/[.]/g, "\\.")}(?=\\s*$)`, "m");
      let n = e.nth;
      let idx = -1;
      let from = 0;
      while (n-- > 0) {
        const m = re.exec(src.slice(from));
        if (!m) throw new Error(`${file}: could not find occurrence of ${e.from}`);
        idx = from + m.index + m[1].length;
        from = idx + e.from.length;
      }
      src = src.slice(0, idx) + e.to + src.slice(idx + e.from.length);
    }
    fs.writeFileSync(p, src);
  }

  // 4. The one hard-coded hero.
  const certPath = path.join(ROOT, "src/components/sections/CertBlocks.tsx");
  fs.writeFileSync(
    certPath,
    fs.readFileSync(certPath, "utf8").replace('k="certifications.facility.inspection"', 'k="certifications.hero"'),
  );
  console.log("\ncode written: registry, labels, .mdx fallbacks, CertBlocks. Old keys kept until --verify passes.");
}

/* ── --patch-docs ───────────────────────────────────────────────────────── */

if (mode === "--patch-docs") {
  const env = fs.readFileSync(path.join(ROOT, ".env.local"), "utf8");
  const token = (env.split("\n").find((l) => l.startsWith("SANITY_WRITE_TOKEN=")) ?? "")
    .slice("SANITY_WRITE_TOKEN=".length)
    .trim()
    .replace(/^["']|["']$/g, "");
  if (!token) throw new Error("SANITY_WRITE_TOKEN missing from .env.local");
  const auth = { Authorization: `Bearer ${token}` };

  // Backup first. A rollback is an import, not an archaeology dig.
  const out = path.join(ROOT, `../backup-${DATASET}-${new Date().toISOString().slice(0, 10)}.ndjson`);
  const exportRes = await fetch(`https://${PROJECT}.api.sanity.io/v2021-06-07/data/export/${DATASET}`, { headers: auth });
  if (!exportRes.ok) throw new Error(`export failed: ${exportRes.status}`);
  fs.writeFileSync(out, Buffer.from(await exportRes.arrayBuffer()));
  console.log(`\nbackup: ${out} (${fs.statSync(out).size} bytes)`);

  // Every new key must already be in the deployed registry — otherwise the
  // live site throws on the first render of a patched document.
  const reg = fs.readFileSync(path.join(ROOT, "src/content/images.ts"), "utf8");
  for (const s of slots) if (!reg.includes(`"${s.key}":`)) throw new Error(`registry lacks ${s.key}; run --write-code and deploy first`);

  const byDoc = new Map<string, Record<string, string>>();
  for (const p of patches) byDoc.set(p.id, { ...(byDoc.get(p.id) ?? {}), [p.path]: p.value });
  // Part pages also get thumbnails set, so the gallery shows the part's own
  // photo in positions 1 and 4 rather than the shared plate.
  for (const [id, set] of byDoc) {
    const d = byId.get(id)!;
    if (d._type === "sku") set["gallery.thumbs"] = JSON.stringify([set["gallery.main"], "sku.finishing", "sku.machining", set["gallery.main"]]);
  }
  const mutations = [...byDoc].map(([id, set]) => ({
    patch: {
      id,
      set: Object.fromEntries(Object.entries(set).map(([k, v]) => [k, k === "gallery.thumbs" ? JSON.parse(v) : v])),
    },
  }));
  const res = await fetch(`${API}/data/mutate/${DATASET}?returnIds=true`, {
    method: "POST",
    headers: { ...auth, "Content-Type": "application/json" },
    body: JSON.stringify({ mutations }),
  });
  const body = (await res.json()) as { results?: unknown[]; error?: unknown };
  if (!res.ok) throw new Error(`mutate failed: ${JSON.stringify(body.error)}`);
  console.log(`patched ${body.results?.length} documents`);
}

/* ── --verify ───────────────────────────────────────────────────────────── */

/**
 * Tests the RULE, not the plan: no registry key may be drawn by more than
 * one placement across every document, and no retired key may be drawn at
 * all. The plan above is derived from the live documents, so after
 * --patch-docs it no longer describes anything — this check must not
 * depend on it.
 */
if (mode === "--verify") {
  const RETIRED = [
    "products.material.fkm", "products.material.nbr", "products.material.epdm", "products.material.silicone",
    "industries.mining.component",
    "export.vessel", "export.gantry", "export.containers", "export.warehouse", "export.pallets",
  ];
  // Deliberately shared, stated in their labels: the two part-page plates the
  // template rework removes. The logo is drawn by code, not documents.
  const ALLOWED_SHARED = new Set(["sku.finishing", "sku.machining"]);
  const registry = new Set(
    [...fs.readFileSync(path.join(ROOT, "src/content/images.ts"), "utf8").matchAll(/^  "([a-z0-9.-]+)": \{/gm)].map((m) => m[1]),
  );
  const uses = new Map<string, string[]>();
  const walk = (v: unknown, at: string) => {
    if (typeof v === "string") {
      if (registry.has(v)) uses.set(v, [...(uses.get(v) ?? []), at]);
    } else if (Array.isArray(v)) v.forEach((x, i) => walk(x, `${at}[${i}]`));
    else if (v && typeof v === "object")
      for (const [k, x] of Object.entries(v)) if (!k.startsWith("_")) walk(x, at ? `${at}.${k}` : k);
  };
  for (const d of docs) walk(d, d._id);

  let bad = 0;
  for (const k of RETIRED) if (uses.has(k)) { bad++; console.log(`  retired key still drawn: ${k} ← ${uses.get(k)!.join(", ")}`); }
  // A part page's gallery shows its main photograph again as thumbnails 1
  // and 4 — the same picture at two sizes on one page, not two placements
  // an editor would ever want to differ. All within one document, all
  // under `gallery`, is the only repetition the rule permits.
  const isOwnGallery = (at: string[]) =>
    new Set(at.map((a) => a.split(".")[0])).size === 1 && at.every((a) => /\.gallery\.(main|thumbs\[\d+\])$/.test(a));
  for (const [k, at] of uses) {
    if (at.length > 1 && !ALLOWED_SHARED.has(k) && !isOwnGallery(at)) { bad++; console.log(`  shared: ${k} ← ${at.join(" · ")}`); }
  }
  console.log(`\n${uses.size} keys drawn by documents · ${[...uses.values()].reduce((n, a) => n + a.length, 0)} placements`);
  console.log(bad ? `${bad} problems` : "every placement has its own slot; retired keys are unreferenced — safe to delete them");
}
