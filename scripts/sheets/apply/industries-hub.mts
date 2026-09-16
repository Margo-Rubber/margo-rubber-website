/**
 * 05_Industries → industriesHub-industries.
 *
 *   node scripts/sheets/apply/industries-hub.mts [--write]
 */

import { industriesHubSchema } from "../../../src/content/schemas/index.ts";
import {
  applyDocument,
  loadSheet,
  section,
  lit,
  heading,
  paragraph,
  rows,
  accentLines,
  starAccent,
} from "../lib.mts";

const sheet = loadSheet("05_Industries");
const s = (n: string) => section(sheet, n);
const expect: string[] = [];
const E = (v: string) => (expect.push(v), v);
const h2 = (sec: ReturnType<typeof s>) => {
  const h = heading(sec, "H2");
  h.lines.forEach((l) => expect.push(l));
  return starAccent(h).join(" ");
};

/* ── 01 Hero ─────────────────────────────────────────────────────────────── */
const hero = s("01");
const h1 = heading(hero, "H1");
const heroFacts = rows(hero, "Stats").map((r) => ({
  label: E(r[0]),
  value: E(r[1]),
}));

/* ── 02 Search & filter ──────────────────────────────────────────────────── */
const filt = s("02");
const chips = lit(filt, "Filter chips")
  .split(/\s·\s|\n/)
  .map((c) => E(c.trim()));

/* ── 03 Grid ─────────────────────────────────────────────────────────────── */
const grid = s("03");
const CARD: Record<string, { slug: string; chip: string; image: string }> = {
  Automotive: {
    slug: "automotive",
    chip: "Automotive",
    image: "industries.automotive",
  },
  Mining: { slug: "mining", chip: "Mining", image: "industries.mining" },
  "Oil & Gas": {
    slug: "oil-gas",
    chip: "Oil & Gas",
    image: "industries.oil-gas",
  },
  "Pumps & Valves": {
    slug: "pumps-valves",
    chip: "Pumps & Valves",
    image: "industries.pumps-valves",
  },
  HVAC: { slug: "hvac", chip: "HVAC", image: "industries.hvac" },
  "Electrical & Electronics": {
    slug: "electrical-electronics",
    chip: "Electrical",
    image: "industries.electrical-electronics",
  },
  Agriculture: {
    slug: "agriculture",
    chip: "Agriculture",
    image: "industries.agriculture",
  },
  "Medical Devices": {
    slug: "medical-devices",
    chip: "Medical",
    image: "industries.medical-devices",
  },
  "Water & Fluid Management": {
    slug: "water-fluid-management",
    chip: "Water",
    image: "industries.water-fluid-management",
  },
};
const cards = rows(grid, "Cards").map((r) => {
  const meta = CARD[r[0]];
  if (!meta) throw new Error(`industry card ${r[0]}`);
  return {
    name: E(r[0]),
    body: E(r[1]),
    tags: r[2].split(" · ").map((t) => E(t.trim())),
    ...meta,
  };
});

/* ── 04 Additional sectors ───────────────────────────────────────────────── */
const add = s("04");
const additional = rows(add, "Cards").map((r) => ({
  name: E(r[0]),
  body: E(r[1]),
  href: r[2],
  linkLabel: "Browse product category",
}));

/* ── 05 Enquiry ──────────────────────────────────────────────────────────── */
const enq = s("05");
const enqH2 = heading(enq, "H2");
const formLit = lit(enq, "Form fields").split("\n");
const submit = formLit[formLit.length - 1].match(/^\[\s*(.*?)\s*→\s*\]$/);
if (!submit) throw new Error("enquiry submit");

const patch = {
  "seo.title": sheet.head.title,
  "seo.description": sheet.head.description,
  h1: h1.lines.join(" "),
  h1Lines: h1.lines.map((l) => E(l)),
  h1AccentLines: accentLines(h1),
  intro: E(paragraph(hero, "Subhead")),
  // The sheet's hero has no badge row (the old one read "9 Industries · 15 Sectors").
  badge: "",
  heroFacts,

  "filter.placeholder": E(lit(filt, "Search placeholder")),
  "filter.chips": chips,

  "primary.eyebrow": E(lit(grid, "Eyebrow")),
  "primary.heading": h2(grid),
  "primary.countLabel": E(lit(grid, "Counter")),
  "primary.items": cards,

  "additional.eyebrow": E(lit(add, "Eyebrow")),
  "additional.heading": E(heading(add, "H2").value),
  "additional.note": E(paragraph(add, "Intro")),
  "additional.items": additional,

  "enquiry.heading": enqH2.lines.map((l) => E(l)).join(" "),
  "enquiry.body": E(paragraph(enq, "Body")),
  "enquiry.points": rows(enq, "Assurance lines").map((r) => E(r[0])),
  "enquiry.submitLabel": E(submit[1]),
  "enquiry.footnote": E(lit(enq, "Footnote")),
};

await applyDocument({
  id: "industriesHub-industries",
  type: "industriesHub",
  schema: industriesHubSchema,
  patch,
  expect,
});
