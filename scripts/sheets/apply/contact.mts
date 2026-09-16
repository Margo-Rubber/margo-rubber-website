/**
 * 04_Contact → contactPage-contact.
 *
 *   node scripts/sheets/apply/contact.mts [--write]
 */

import { contactPageSchema } from "../../../src/content/schemas/index.ts";
import {
  applyDocument,
  loadSheet,
  section,
  lit,
  heading,
  paragraph,
  rows,
  accentLines,
} from "../lib.mts";

const sheet = loadSheet("04_Contact");
const s = (n: string) => section(sheet, n);
const expect: string[] = [];
const E = (v: string) => (expect.push(v), v);

/* ── 01 Hero ─────────────────────────────────────────────────────────────── */
const hero = s("01");
const h1 = heading(hero, "H1");

/* ── 02 Form step 1 + direct contact ─────────────────────────────────────── */
const f1 = s("02");
const side = lit(f1, "Side panel").split("\n"); // eyebrow line, then the body wrapped over two lines
const ICON: Record<string, string> = {
  WhatsApp: "whatsapp",
  Phone: "phone",
  Email: "email",
};
const contacts = rows(f1, "Direct contact").map((r) => ({
  icon: ICON[r[0]],
  label: E(r[0]),
  value: E(r[1]),
  note: E(r[2]),
}));
const step1 = lit(f1, "Step 1 fields").split("\n"); // labels line · "[ Continue to Requirement → ]" · promise
const continueLabel = step1[1].match(/^\[\s*(.*?)\s*→\s*\]$/);
if (!continueLabel) throw new Error("continue label");

/* ── 03 Form step 2 ──────────────────────────────────────────────────────── */
const f2 = s("03");
const countries = lit(f2, "COUNTRY")
  .split(/\s·\s|\n/)
  .map((c) => E(c.trim()));
const volumes = rows(f2, "ORDER VOLUME").map((r) => E(r[0]));
const details = E(lit(f2, "PROJECT DETAILS").replace(/\n/g, " "));
const submitLine = lit(f2, "Submit").split("\n"); // "← Back [ Submit Quote Request → ]" · promise
const submit = submitLine[0].match(/^←\s*(\S+)\s+\[\s*(.*?)\s*→\s*\]$/);
if (!submit) throw new Error("submit line");

/* ── 05 What is missing ──────────────────────────────────────────────────── */
const add = s("05");
const logistics = rows(add, "Logistics").map((r) => ({
  destination: E(r[0]),
  distance: E(r[1]),
  transit: E(r[2]),
}));
const nextSteps = rows(add, "What happens next").map((r) => ({
  stage: E(r[0]),
  timing: E(r[1]),
}));
const faqs = rows(add, "Three FAQ").map((r) => ({ q: E(r[0]), a: E(r[1]) }));

// The address block lines are Site settings — assert they match the sheet.
const addr = lit(add, "Address block").split("\n");
expect.push(addr[0], addr[3]); // MARGO RUBBER PRODUCTS (CSS-cased) · Mon–Sat · 09:30–18:30 IST

const patch = {
  "seo.title": sheet.head.title,
  "seo.description": sheet.head.description,
  badge: E(lit(hero, "Eyebrow")),
  h1: h1.lines.join(" "),
  h1Lines: h1.lines.map((l) => E(l)),
  h1AccentLines: accentLines(h1),
  intro: E(paragraph(hero, "Subhead")),
  proof: rows(hero, "Chips").map((r) => E(r[0])),

  "quote.eyebrow": E(lit(f1, "Eyebrow")),
  "quote.heading": E(heading(f1, "H2").value),
  "quote.note": E(paragraph(f1, "Intro")),
  "quote.facility": { eyebrow: E(side[0]), body: E(side.slice(1).join(" ")) },
  "quote.contacts": contacts,
  "quote.footnote": E(lit(f1, "Footnote").replace(/\n/g, " ")),
  "quote.continueLabel": E(continueLabel[1]),
  "quote.responsePromise": E(step1[2]),
  "quote.backLabel": E(submit[1]),
  // "Add: file field" — label and hint from the sheet's one line.
  ...(() => {
    const m = lit(f1, "Add: file field").match(/^(.*?)\s+—\s+(.*)$/);
    if (!m) throw new Error("file field");
    return { "quote.attachLabel": E(m[1]), "quote.attachHint": E(m[2]) };
  })(),
  "quote.submitLabel": E(submit[2]),
  // Step-2 selects: country and volume options from the sheet; product
  // category and industry come from the route registry at render time.
  'quote.step2[name=="country"].options': countries,
  'quote.step2[name=="volume"].options': volumes,
  'quote.step2[name=="details"].placeholder': details,

  // The five blocks the sheet adds (§05). Address, hours and coordinates
  // render from Site settings; the map still links to Google Maps.
  map: { image: "contact.map", label: "Google Maps" },
  logistics,
  nextStepsSection: { eyebrow: "", heading: E("What happens next") },
  nextSteps,
  faqs,
};

await applyDocument({
  id: "contactPage-contact",
  type: "contactPage",
  schema: contactPageSchema,
  patch,
  expect,
});
