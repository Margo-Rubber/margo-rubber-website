/**
 * 01_Homepage → homePage-home (and the footer blurb on siteFooter-footer).
 *
 * Every string is placed from the parsed sheet by reference. Where the
 * sheet's copy carries one of the three roadmap claims (95 countries, 200+
 * SKUs, named ports) the buyer-build field gets the nearest copy the sheet
 * itself supplies, the vision-build field gets the sheet's line, and the
 * deviation is listed in scripts/sheets/OPEN-ITEMS.md for Ayaz.
 *
 *   node scripts/sheets/apply/home.mts            dry run — prints the diff
 *   node scripts/sheets/apply/home.mts --write    patches the documents
 */

import {
  homePageSchema,
  footerSchema,
} from "../../../src/content/schemas/index.ts";
import {
  applyDocument,
  loadSheet,
  section,
  lit,
  litHref,
  heading,
  paragraph,
  paragraphs,
  rows,
  list,
  links,
  starAccent,
} from "../lib.mts";

const sheet = loadSheet("01_Homepage");
const s = (n: string) => section(sheet, n);
const expect: string[] = [];
const E = (...v: string[]) => {
  expect.push(...v);
  return v[0];
};

/* ── 01 Hero ─────────────────────────────────────────────────────────────── */
const hero = s("01");
const h1 = heading(hero, "H1");
// Buyer build: lines 1–2 only. Line 3 ("Shipped to 95 Countries.") is a
// roadmap claim — OPEN-ITEMS #1. The comma that closed line 2 mid-sentence
// is dropped now that the line is terminal.
const h1Buyer = starAccent({
  lines: h1.lines.slice(0, 2),
  accent: h1.accent,
}).map((l) => l.replace(/,\*?$/, (m) => m.replace(",", "")));
const subhead = E(paragraph(hero, "Subhead"));
const heroStats = rows(hero, "Stat cards");
// Cards 1–2 (95 countries, 200+ SKUs) are roadmap claims — OPEN-ITEMS #2.
const heroCards = heroStats
  .filter((r) => !/^(95|200\+)$/.test(r[0]))
  .map((r) => ({ value: E(r[0]), label: E(r[1]) }));

/* ── 02 Client strip ─────────────────────────────────────────────────────── */
const strip = s("02");
const bands = rows(strip, "Names");
const names = bands.flatMap((r) => r[1].split(" · ").map((n) => n.trim()));
// Victor Reinz needs separate confirmation (checklist 2026-09-02) — OPEN-ITEMS #3.
const trustNames = names.filter((n) => n !== "Victor Reinz");
trustNames.forEach((n) => E(n));

/* ── 03 Story ────────────────────────────────────────────────────────────── */
const story = s("03");
const storyH2 = heading(story, "H2");
const storyPars = [
  E(paragraph(story, "Paragraph 1")),
  E(paragraph(story, "Paragraph 2")),
];
const storyStats = rows(story, "Stat cards").map((r) => ({
  value: E(r[0]),
  label: E(r[1]),
}));

/* ── 04 Edge ─────────────────────────────────────────────────────────────── */
const edge = s("04");
const EDGE_ICON = [
  "shield",
  "layers",
  "bolt",
  "gear",
  "ribbon",
  "globe",
] as const;
const EDGE_HREF: Record<number, string> = {
  0: "/certifications",
  1: "/products#materials",
  2: "/contact",
  5: "/export",
};
const edgeItems = rows(edge, "Cards").map((r, i) => ({
  icon: EDGE_ICON[i],
  name: E(r[0]),
  body: E(r[1]),
  ...(EDGE_HREF[i] ? { href: EDGE_HREF[i] } : {}),
}));

/* ── 05 Portfolio ────────────────────────────────────────────────────────── */
const port = s("05");
const portLink = lit(port, "Section link").match(/^(.*?)\s*↗\s*(\/\S*)$/);
if (!portLink) throw new Error("portfolio section link");
const portItems = rows(port, "Cards").map((r) => {
  const slug = r[2].split("/").pop()!;
  return {
    name: E(r[0]),
    spec: E(r[1]),
    href: r[2],
    image: `home.portfolio.${slug}`,
  };
});

/* ── 06 Sectors ──────────────────────────────────────────────────────────── */
const sectors = s("06");
const SECTOR_ICON: Record<string, string> = {
  Automotive: "car",
  Mining: "pickaxe",
  "Oil & Gas": "fuel",
  "Pumps & Valves": "gauge",
  HVAC: "wind",
  "Electrical & Electronics": "chip",
  Agriculture: "leaf",
  "Medical Devices": "heart",
  "Water & Fluid Management": "droplet",
};
const SECTOR_HREF: Record<string, string> = {
  Automotive: "/industries/automotive",
  Mining: "/industries/mining",
  "Oil & Gas": "/industries/oil-gas",
  "Pumps & Valves": "/industries/pumps-valves",
  HVAC: "/industries/hvac",
  "Electrical & Electronics": "/industries/electrical-electronics",
  Agriculture: "/industries/agriculture",
  "Medical Devices": "/industries/medical-devices",
  "Water & Fluid Management": "/industries/water-fluid-management",
};
const sectorItems = rows(sectors, "Cards").map((r) => {
  if (!SECTOR_ICON[r[0]]) throw new Error(`sector icon for ${r[0]}`);
  return {
    name: E(r[0]),
    body: E(r[1]),
    icon: SECTOR_ICON[r[0]],
    href: SECTOR_HREF[r[0]],
  };
});

/* ── 07 Process ──────────────────────────────────────────────────────────── */
const proc = s("07");
const STEP_HREF: Record<number, string> = {
  0: "/contact",
  4: "/certifications",
  5: "/export",
};
const steps = rows(proc, "Steps").map((r, i) => ({
  name: E(r[1]),
  body: E(r[2]),
  ...(STEP_HREF[i] ? { href: STEP_HREF[i] } : {}),
}));

/* ── 08 Facility ─────────────────────────────────────────────────────────── */
const fac = s("08");
const checks = list(fac, "Bullets").map((b) => E(b));
const facStats = rows(fac, "Stat row").map((r) => ({
  value: E(r[0]),
  label: E(r[1]),
}));

/* ── 09 Export markets ───────────────────────────────────────────────────── */
const exp = s("09");
const expH2 = heading(exp, "H2");
const LANE: Record<string, { x: number; y: number; href: string }> = {
  AU: { x: 82, y: 82, href: "/export#australia" },
  GB: { x: 38, y: 20, href: "/export#uk" },
  AE: { x: 52, y: 30, href: "/export#uae-saudi" },
  MY: { x: 72, y: 58, href: "/export#malaysia" },
};
const lanes = rows(exp, "Lane cards").map((r) => ({
  code: r[0],
  name: E(r[1]),
  note: E(r[2]),
  ...LANE[r[0]],
}));
const footnote = paragraph(exp, "Footnote");
// The closing sentence is the section's link; "95 markets" is the roadmap
// figure — OPEN-ITEMS #4.
const noteText = E(
  footnote.replace(/\s*See all 95 markets and their trade lanes\s*→?\s*$/, ""),
);
const buyerExportH2 = "Where we are opening lanes first"; // sheet 01 §09 note "Vision-build guard"
E(buyerExportH2);

/* ── 10 Materials ────────────────────────────────────────────────────────── */
const mat = s("10");
const matH2 = heading(mat, "H2");
const matIntro = E(paragraph(mat, "Intro"));
const matFoot = E(paragraph(mat, "Footnote"));

/* ── 11 Contact ──────────────────────────────────────────────────────────── */
const cta = s("11");
const ctaH2 = heading(cta, "H2");
const ctaH3 = heading(cta, "H3");
const ctaPara = E(paragraph(cta, "Paragraph"));
const ctaStats = rows(cta, "Stat cards").map((r) => ({
  value: E(r[0]),
  label: E(r[1]),
}));
const submit = E(lit(cta, "Submit button").replace(/\s*→$/, ""));

/* ── 12 Footer ───────────────────────────────────────────────────────────── */
const foot = s("12");
const footDesc = paragraph(foot, "Description");
// "…in 95 countries" is the roadmap figure — OPEN-ITEMS #5: first sentence only.
const footBlurb = E(footDesc.split(". ")[0] + ".");

/* ── The patch ───────────────────────────────────────────────────────────── */
if (!sheet.head.title || !sheet.head.description) throw new Error("sheet head");
const patch = {
  // <title> and description from the page-level block; h1 is the one-line
  // form of the buyer heading, used by search and the breadcrumb.
  "seo.title": sheet.head.title,
  "seo.description": sheet.head.description,
  h1: h1Buyer.map((l) => l.replace(/\*/g, "")).join(" "),
  "hero.eyebrow": E(lit(hero, "Eyebrow")),
  "hero.h1Lines": h1Buyer,
  "hero.intro": subhead,
  "hero.introLinks": [
    { label: "O-rings", href: "/products/o-rings" },
    { label: "oil seals", href: "/products/oil-seals" },
    { label: "gaskets", href: "/products/gaskets" },
    { label: "bellows", href: "/products/bellows" },
  ],
  "hero.actions": [
    {
      label: E(lit(hero, "CTA primary").replace(/\s*→$/, "")),
      href: "/contact",
      variant: "primary",
    },
    {
      label: E(lit(hero, "CTA secondary").replace(/^▶\s*/, "")),
      href: "/products",
      variant: "secondary",
    },
  ],
  "hero.chips": links(hero, "Industry chips").map((l) => ({
    label: E(l.label),
    href: l.href,
  })),
  "hero.cards": heroCards.map((c) =>
    c.value === "ISO 9001:2015" ? { ...c, icon: "ribbon" } : c,
  ),

  "trustbar.label": E(lit(strip, "Eyebrow")),
  "trustbar.items": trustNames,

  "story.eyebrow": E(lit(story, "Eyebrow")),
  "story.lines": starAccent(storyH2),
  "story.imageBadge": E(lit(story, "Badge overline")),
  "story.floatCard": {
    title: E(lit(story, "Badge title")),
    body: E(paragraph(story, "Badge caption")),
    href: "/certifications",
  },
  "story.paragraphs": storyPars,
  "story.stats": storyStats,
  "story.cta": litHref(story, "CTA"),

  "edge.eyebrow": E(lit(edge, "Eyebrow")),
  "edge.lines": starAccent(heading(edge, "H2")),
  "edge.items": edgeItems,

  "portfolio.eyebrow": E(lit(port, "Eyebrow")),
  "portfolio.lines": starAccent(heading(port, "H2")),
  "portfolio.cta": { label: E(portLink[1]), href: portLink[2] },
  "portfolio.items": portItems,

  "sectors.eyebrow": E(lit(sectors, "Eyebrow")),
  "sectors.lines": starAccent(heading(sectors, "H2")),
  "sectors.items": sectorItems,

  "process.eyebrow": E(lit(proc, "Eyebrow")),
  "process.lines": starAccent(heading(proc, "H2")),
  "process.body": E(paragraph(proc, "Intro")),
  "process.steps": steps,

  "facility.eyebrow": E(lit(fac, "Eyebrow")),
  "facility.lines": starAccent(heading(fac, "H2")),
  "facility.body": E(paragraph(fac, "Paragraph")),
  // The sheet has no badge; the old one named Ambad.
  "facility.badge": "",
  "facility.checks": checks,
  "facility.stats": facStats,

  "exportMarkets.eyebrow": E(lit(exp, "Eyebrow")),
  "exportMarkets.lines": [buyerExportH2],
  "exportMarkets.linesVision": starAccent(expH2),
  "exportMarkets.standfirstVision": paragraph(exp, "Standfirst"),
  "exportMarkets.lanes": lanes,
  "exportMarkets.pins": [{ label: "Saudi Arabia", x: 62, y: 26 }],
  "exportMarkets.note": noteText,
  "exportMarkets.noteLink": {
    label: "See all markets and their trade lanes",
    href: "/export",
  },

  "materials.eyebrow": E(lit(mat, "Eyebrow")),
  "materials.lines": starAccent(matH2),
  "materials.body": matIntro,
  "materials.footnote": matFoot,

  "cta.eyebrow": E(lit(cta, "Eyebrow")),
  "cta.lines": starAccent(ctaH2),
  "cta.panel.title": E(ctaH3.value),
  "cta.panel.body": ctaPara,
  "cta.panel.badge": "",
  "cta.panel.stats": ctaStats,
  "cta.submitLabel": submit,
  // The sheet gives no footnote (its row is a test instruction) — OPEN-ITEMS #6.
  "cta.footnote": "Quotation within 48 hours · info@margorubber.in",
};

// Expect strings that are heading lines (rendered as separate spans) go in
// per line, without the accent stars.
expect.push(...h1Buyer.map((l) => l.replace(/\*/g, "")));
for (const h of [
  storyH2,
  heading(edge, "H2"),
  heading(port, "H2"),
  heading(sectors, "H2"),
  heading(proc, "H2"),
  heading(fac, "H2"),
  matH2,
  ctaH2,
]) {
  for (const l of h.lines) if (!/95 Countries/.test(l)) expect.push(l);
}
for (const p of paragraphs(story, "Paragraph 1")) expect.push(p);

await applyDocument({
  id: "homePage-home",
  type: "homePage",
  schema: homePageSchema,
  patch,
  expect,
});
await applyDocument({
  id: "siteFooter-footer",
  type: "siteFooter",
  schema: footerSchema,
  patch: { "brand.blurb": footBlurb },
});
