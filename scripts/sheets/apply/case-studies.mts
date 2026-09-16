/**
 * 29_Case_Studies → caseStudiesPage-case-studies.
 *
 * This sheet writes "Live" and "Ships as" side by side: struck-through
 * live copy is dropped by the parser, "[no change]" keeps the live value.
 *
 *   node scripts/sheets/apply/case-studies.mts [--write]
 */

import { caseStudiesPageSchema } from "../../../src/content/schemas/index.ts";
import {
  applyDocument,
  field,
  loadSheet,
  section,
  lit,
  litHref,
  heading,
  paragraph,
  rows,
  starAccent,
  type Section,
} from "../lib.mts";
import type { Part } from "../parse-sheets.mts";

const sheet = loadSheet("29_Case_Studies");
const s = (n: string) => section(sheet, n);
const expect: string[] = [];
const E = (v: string) => (expect.push(v), v);
const NO_CHANGE = "[no change]";
/** "Ships as" cell, or the live value when the sheet says "[no change]". */
const ships = (row: string[]) => (row[2] === NO_CHANGE ? row[1] : row[2]);

/* ── 01 Hero ─────────────────────────────────────────────────────────────── */
const hero = s("01");
const h1 = heading(hero, "H1");
const buttons = rows(hero, "Buttons").map((r) => {
  const m = ships(r).match(/^(.*?)\s*→\s*(\S+)$/);
  if (!m) throw new Error(`hero button ${r[0]}`);
  return {
    label: E(m[1]),
    href: m[2],
    variant: r[0] === "Primary" ? "primary" : "secondary",
  };
});
const chip = lit(hero, "Trust chip").split("\n"); // ISO 9001:2015 / Certified Quality Management · certificate 09111526A

/* ── 02 Methodology ──────────────────────────────────────────────────────── */
const meth = s("02");
const eyebrowH2 = (sec: Section) => {
  const f = field(sec, "Eyebrow · H2", "composite");
  const lit_ = f.parts.find((p) => p.kind === "lit") as Extract<
    Part,
    { kind: "lit" }
  >;
  const h = f.parts.find((p) => p.kind === "heading") as Extract<
    Part,
    { kind: "heading" }
  >;
  h.lines.forEach((l) => expect.push(l));
  return {
    eyebrow: E(lit_.value.replace(/^\d\d · /, "")),
    heading: starAccent(h).join(" "),
    lines: starAccent(h),
  };
};
/** "H1 — 2 lines" written on one line with the accent as line 2: split at the accent. */
const twoLines = (h: { lines: string[]; accent: string[] }) => {
  const [line] = h.lines;
  const a = h.accent[0];
  if (h.lines.length === 2 || !a || !line.endsWith(a)) return starAccent(h);
  return [line.slice(0, -a.length).trim(), `*${a}*`];
};
const LIVE_STAT: Record<string, { statValue: string; statNote: string }> = {
  "Card 03": { statValue: "ISO 9001:2015", statNote: "" },
  "Card 04": {
    statValue: "100% Traceable",
    statNote: "Batch traceability from compound to despatch",
  },
};
const methItems = meth.fields
  .filter((f) => f.kind === "composite" && /^Card 0\d/.test(f.label))
  .map((f) => {
    if (f.kind !== "composite") throw new Error("kind");
    const body = (
      f.parts.find((p) => p.kind === "para") as Extract<Part, { kind: "para" }>
    ).text;
    const t = f.parts.find((p) => p.kind === "table") as Extract<
      Part,
      { kind: "table" }
    >;
    const live = LIVE_STAT[f.label.slice(0, 7)] ?? {
      statValue: "",
      statNote: "",
    };
    const cell = (k: string) => {
      const r = t.rows.find((x) => x[0] === k)!;
      return ships([
        r[0],
        r[1] || (k === "Value" ? live.statValue : live.statNote),
        r[2],
      ]);
    };
    return {
      body: E(body),
      statValue: E(cell("Value")),
      statNote: E(cell("Label")),
    };
  });

/* ── 03 In the meantime ──────────────────────────────────────────────────── */
const mean = s("03");
const card = (label: string, icon: string) => {
  const f = field(mean, label, "paragraphs");
  const [eyebrow, name] = (f.lits?.[0] ?? "").split("\n");
  const cta = (f.lits?.[1] ?? "").match(/^\[\s*(.*?)\s*→\s*(\S+)\s*\]$/);
  if (!cta) throw new Error(`${label}: cta`);
  return {
    icon,
    eyebrow: E(eyebrow),
    name: E(name),
    body: E(f.paragraphs[0]),
    cta: { label: E(cta[1]), href: cta[2] },
  };
};

/* ── 04 Invitation ───────────────────────────────────────────────────────── */
const inv = s("04");
const invHead = eyebrowH2(inv);

/* ── 05 Closing ──────────────────────────────────────────────────────────── */
const close = s("05");
const closeHead = eyebrowH2(close);
const closeButtons = rows(close, "Buttons").map((r) => {
  const m = ships(r).match(/^(.*?)\s*→\s*(\S+)$/);
  if (!m) throw new Error(`closing button ${r[0]}`);
  return {
    label: E(m[1]),
    href: m[2],
    variant: r[0] === "Primary" ? "primary" : "secondary",
    icon: r[0] === "Primary" ? "mail" : "phone",
  };
});

const patch = {
  "seo.title": sheet.head.title,
  "seo.description": sheet.head.description,
  h1: h1.lines.join(" "),
  "hero.eyebrow": E(lit(hero, "Eyebrow")),
  "hero.h1Lines": twoLines(h1),
  "hero.paragraphs": [
    E(paragraph(hero, "Intro — para 1")),
    E(paragraph(hero, "Intro — para 2")),
  ],
  "hero.actions": buttons,
  "hero.badge": { title: E(chip[0]), note: E(chip[1]) },

  "methodology.heading": eyebrowH2(meth).heading,
  "methodology.body": E(paragraph(meth, "Intro")),
  ...Object.fromEntries(
    methItems.flatMap((it, i) => [
      [`methodology.items[${i}].body`, it.body],
      [`methodology.items[${i}].statValue`, it.statValue],
      [`methodology.items[${i}].statNote`, it.statNote],
    ]),
  ),

  "meantime.heading": eyebrowH2(mean).heading,
  "meantime.body": E(paragraph(mean, "Intro")),
  "meantime.items": [
    card("Card 1", "ribbon"),
    card("Card 2", "shield"),
    card("Card 3", "doc"),
  ],

  "invitation.eyebrow": invHead.eyebrow,
  "invitation.headingLines": invHead.lines,
  "invitation.paragraphs": [
    E(paragraph(inv, "Body — para 1")),
    E(paragraph(inv, "Body — para 2")),
  ],
  "invitation.cta": (() => {
    const l = litHref(inv, "CTA");
    return { label: E(l.label), href: l.href };
  })(),
  "invitation.list": rows(inv, "Commitment list").map((r) => E(r[1])),
  "invitation.footnote": E(paragraph(inv, "Consent note")),

  "closing.eyebrow": closeHead.eyebrow,
  "closing.headingLines": closeHead.lines,
  "closing.body": E(paragraph(close, "Body")),
  "closing.actions": closeButtons,
};

await applyDocument({
  id: "caseStudiesPage-case-studies",
  type: "caseStudiesPage",
  schema: caseStudiesPageSchema,
  patch,
  expect,
});
