/**
 * 06_Export → exportPage-export.
 *
 *   node scripts/sheets/apply/export.mts [--write]
 */

import { exportPageSchema } from "../../../src/content/schemas/index.ts";
import {
  applyDocument,
  field,
  loadSheet,
  section,
  lit,
  heading,
  paragraph,
  rows,
  starAccent,
  type Section,
} from "../lib.mts";
import type { Part } from "../parse-sheets.mts";

const sheet = loadSheet("06_Export");
const s = (n: string) => section(sheet, n);
const expect: string[] = [];
const E = (v: string) => (expect.push(v), v);
const marked = (sec: Section, label = "H2") => {
  const h = heading(sec, label);
  h.lines.forEach((l) => expect.push(l));
  return starAccent(h).join(" ");
};

/* ── 01 Hero ─────────────────────────────────────────────────────────────── */
const hero = s("01");
const h1 = heading(hero, "H1");

/* ── 03 Map ──────────────────────────────────────────────────────────────── */
const map = s("03");
const tooltip = lit(map, "Pin tooltip").split("\n"); // AUSTRALIA / Melbourne, Sydney, Brisbane · 18–22 days · FCL or LCL

/* ── 04 Market blocks ────────────────────────────────────────────────────── */
const blocks = s("04");
/** Slug, chip, image and pin for each sheet block; images and pins are the plate's existing ones. */
const MARKET: Record<
  string,
  {
    slug: string;
    chip: string;
    image: string;
    pin: { x: number; y: number };
    pins?: { label: string; x: number; y: number }[];
  }
> = {
  "01 — Australia": {
    slug: "australia",
    chip: "Australia",
    image: "export.market.1",
    pin: { x: 840, y: 360 },
  },
  "02 — United Kingdom": {
    slug: "uk",
    chip: "United Kingdom",
    image: "export.market.4",
    pin: { x: 460, y: 145 },
  },
  "03 — UAE & Saudi Arabia": {
    slug: "uae-saudi",
    chip: "UAE & Saudi",
    image: "export.market.2",
    pin: { x: 580, y: 230 },
    pins: [{ label: "Saudi Arabia", x: 600, y: 250 }],
  },
  "04 — Malaysia": {
    slug: "malaysia",
    chip: "Malaysia",
    image: "export.market.5",
    pin: { x: 780, y: 310 },
  },
  "05 — United States": {
    slug: "usa",
    chip: "USA",
    image: "export.market.6",
    pin: { x: 170, y: 210 },
  },
  "06 — European Union": {
    slug: "eu",
    chip: "European Union",
    image: "export.market.3",
    pin: { x: 495, y: 160 },
  },
  "07 — Singapore": {
    slug: "singapore",
    chip: "Singapore",
    image: "export.market.7",
    pin: { x: 795, y: 330 },
  },
  "08 — Kenya & Tanzania": {
    slug: "east-africa",
    chip: "Kenya & Tanzania",
    image: "export.market.8",
    pin: { x: 570, y: 320 },
    pins: [{ label: "Tanzania", x: 585, y: 345 }],
  },
};
const markets = blocks.fields
  .filter((f) => f.kind === "composite" && /^0\d — /.test(f.label))
  .map((f) => {
    if (f.kind !== "composite") throw new Error("kind");
    const meta = MARKET[f.label];
    if (!meta) throw new Error(`market ${f.label}`);
    const part = <K extends Part["kind"]>(kind: K, nth = 0) => {
      const p = f.parts.filter((x) => x.kind === kind)[nth] as
        Extract<Part, { kind: K }> | undefined;
      if (!p) throw new Error(`${f.label}: no ${kind} #${nth}`);
      return p;
    };
    const paras = f.parts.filter(
      (p): p is Extract<Part, { kind: "para" }> => p.kind === "para",
    );
    const standfirst = paras.find((p) => !p.em);
    const caveat = paras.find((p) => p.em);
    if (!standfirst) throw new Error(`${f.label}: no standfirst`);
    const linkLit = f.parts.filter((p) => p.kind === "lit").at(-1) as Extract<
      Part,
      { kind: "lit" }
    >;
    const links = linkLit.value
      .split("\n")
      .map((l) => l.match(/^→\s*(.*?)\s+(\/\S+)$/))
      .map((m) => {
        if (!m) throw new Error(`${f.label}: link line`);
        return { label: E(m[1]), href: m[2] };
      });
    return {
      slug: meta.slug,
      eyebrow: E(part("lit").value),
      chip: meta.chip,
      heading: E(part("heading").lines.join(" ")),
      body: E(standfirst.text),
      image: meta.image,
      pin: meta.pin,
      ...(meta.pins ? { pins: meta.pins } : {}),
      ...(meta.slug === "australia" ? { pinNote: E(tooltip[1]) } : {}),
      points: part("list").items.map((i) => E(i)),
      ...(caveat ? { caveat: E(caveat.text) } : {}),
      links,
      // The Incoterms panel that lived inside US & EU is now its own section.
      panel: null,
    };
  });

/* ── 05 Incoterms ────────────────────────────────────────────────────────── */
const inc = s("05");
const terms = rows(inc, "Terms").map((r) => ({
  code: E(r[0]),
  name: E(r[1]),
  body: E(r[2]),
}));

/* ── 06 Process ──────────────────────────────────────────────────────────── */
const proc = s("06");
const ICONS = ["doc", "clipboard", "box", "pallet", "ship", "truck"] as const;
const steps = rows(proc, "Steps").map((r, i) => ({
  icon: ICONS[i],
  name: E(r[1]),
  body: r[2].replace(/\n/g, " "),
  // "We need: … / You get back: … / We do: … / Why it matters: …" — one line per label.
  lines: r[2].split("\n").map((line) => {
    const m = line.match(
      /^(We need|You get back|We do|Why it matters):\s*(.*)$/,
    );
    if (!m)
      throw new Error(`step ${r[0]}: unlabelled line "${line.slice(0, 40)}"`);
    return { label: E(m[1]), text: E(m[2]) };
  }),
}));

/* ── 07 Documents ────────────────────────────────────────────────────────── */
const docs = s("07");
const docRows = rows(docs, "Documents");
// "Rename to Inspection Release Report"; every other verdict is keep verbatim.
const docPatch = docRows.map((r) => {
  const rename = r[1].match(/^Rename to (.+?)\./);
  return { from: r[0], name: rename ? rename[1] : r[0] };
});

/* ── 08 Quote ────────────────────────────────────────────────────────────── */
const quote = s("08");

/* ── 09 Summary ──────────────────────────────────────────────────────────── */
const sum = s("09");
const facts = rows(sum, "Summary rows").map((r) => ({
  label: E(r[0]),
  value: E(r[1]),
}));

const patch = {
  "seo.title": sheet.head.title,
  "seo.description": sheet.head.description,
  h1: h1.lines.join(" "),
  "hero.badge": E(lit(hero, "Eyebrow")),
  "hero.h1Lines": h1.lines.map((l) => E(l)),
  "hero.intro": E(paragraph(hero, "Subhead")),
  "hero.visionStrip": lit(hero, "Vision-build addition"),
  "hero.hub": { label: E("NASHIK, IN"), x: 650, y: 200 },
  markets,

  incoterms: {
    eyebrow: "",
    heading: E(heading(inc, "H2").value),
    terms,
    standard: "FOB",
    footnote: E(lit(inc, "Footnote").replace(/\n/g, " ")),
  },

  "process.eyebrow": E(lit(proc, "Eyebrow")),
  "process.heading": marked(proc),
  "process.body": E(paragraph(proc, "Intro")),
  "process.steps": steps,

  "documents.body": E(paragraph(docs, "Intro")),
  ...Object.fromEntries(
    docPatch
      .filter((d) => d.name !== d.from)
      .map((d) => [`?documents.items[name=="${d.from}"].name`, E(d.name)]),
  ),

  "quote.heading": E(heading(quote, "H2").value),
  "quote.body": E(paragraph(quote, "Body")),
  "quote.checks": rows(quote, "Bullets").map((r) => E(r[0])),
  "quote.footnote": E(lit(quote, "Footnote")),

  "summary.heading": marked(sum),
  "summary.body": E(paragraph(sum, "Body")),
  "summary.facts": facts,
};
docRows.forEach((r) => E(docPatch.find((d) => d.from === r[0])!.name));

await applyDocument({
  id: "exportPage-export",
  type: "exportPage",
  schema: exportPageSchema,
  patch,
  expect,
});
