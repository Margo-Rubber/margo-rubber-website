/**
 * 40_Resource_Sponge_Foam_Datasheet → resource-sponge-foam-datasheet (new).
 *
 *   node scripts/sheets/apply/datasheet.mts [--write]
 *
 * A reference document rather than a guide: the same resource type and
 * Portable Text body as the seven articles, in the "datasheets" category
 * sheet 40 adds. The PDF the sheet's meta strip offers does not exist yet,
 * so that row is not written; the twelve-figure CONFIRM list at the foot of
 * the sheet is a note to Margo, not copy — OPEN-ITEMS.
 */

import { z } from "zod";
import { resourceSchema } from "../../../src/content/schemas/index.ts";
import { stripNullsDeep } from "../../../src/content/blocks.ts";
import { applyDocument, client, field, heading, lit, loadSheet, paragraphs, rows, section } from "../lib.mts";

const WRITE = process.argv.includes("--write");
const ID = "resource-sponge-foam-datasheet";
const SLUG = "sponge-foam-datasheet";
const resourceDocSchema = z.preprocess((raw) => stripNullsDeep(raw), resourceSchema.passthrough());

const sheet = loadSheet("40_Resource_Sponge_Foam_Datasheet");
const s = (n: string) => section(sheet, n);
const expect: string[] = [];
const E = (v: string) => (expect.push(v.replace(/\*\*/g, "").replace(/🛑\s*/g, "")), v);

let keyN = 0;
const key = (p: string) => `${p}${(keyN++).toString(36)}`;
const block = (text: string, style: "normal" | "h2" | "h3" = "normal") => {
  const parts = text.replace(/🛑\s*/g, "").split(/\*\*([^*]+)\*\*/g);
  return {
    _type: "block",
    _key: key("b"),
    style,
    markDefs: [],
    children: parts.map((part, i) => ({ _type: "span", _key: key("s"), text: part, marks: i % 2 ? ["strong"] : [] })).filter((c) => c.text),
  };
};
const table = (columns: string[], tableRows: string[][]) => ({
  _type: "guideTable",
  _key: key("t"),
  columns: columns.map((c) => E(c)),
  rows: tableRows.map((r) => r.map((c) => E(c).replace(/\|/g, "／")).join(" | ")),
});
const paras = (sec: ReturnType<typeof s>, label: string) =>
  field(sec, label, "paragraphs").marked.map((p) => block(E(p)));

const body: unknown[] = [];

/* 01 Document header — the meta strip, without the PDF row */
const head = s("01");
const meta = rows(head, "Document meta strip").filter((r) => !/^Download$/.test(r[0]));
body.push(table(["Field", "Value"], meta));

/* 02 How sponge is specified */
const spec = s("02");
body.push(block(E(heading(spec, "H2").value), "h2"));
body.push(...paras(spec, "Body"), ...paras(spec, "The designation"));
const tc = field(spec, "Type & Class table", "table");
body.push(table(tc.columns, tc.rows));
const grade = field(spec, "Grade table", "table");
body.push(table(grade.columns, grade.rows));

/* 03 Compound data */
const comp = s("03");
body.push(block(E(heading(comp, "H2").value), "h2"));
body.push(...paras(comp, "Reconciliation note"));
const ct = field(comp, "Compound table", "table");
body.push(table(ct.columns, ct.rows));
body.push(block(E("Not available as sponge"), "h3"), ...paras(comp, "Not available as sponge"));

/* 04 Density and compression force deflection */
const den = s("04");
body.push(block(E(heading(den, "H2").value), "h2"));
body.push(...paras(den, "Body"));
const ga = field(den, "Grade availability table", "table");
body.push(table(ga.columns, ga.rows));

/* 05 Formats */
const fmt = s("05");
body.push(block(E(heading(fmt, "H2").value), "h2"));
const ft = field(fmt, "Formats table", "table");
body.push(table(ft.columns, ft.rows));
body.push(...paras(fmt, "Boundary"));

/* 06 Adhesive-backed tape */
const tape = s("06");
body.push(block(E(heading(tape, "H2").value), "h2"));
const tt = field(tape, "Tape table", "table");
body.push(table(tt.columns, tt.rows));
body.push(...paras(tape, "Adhesive note"));

/* 07 Tolerances and testing */
const test = s("07");
body.push(block(E(heading(test, "H2").value), "h2"));
const et = field(test, "Test table", "table");
body.push(table(et.columns, et.rows));
body.push(...paras(test, "Ships with every consignment"));

/* 08 Certification, and what this document is not */
const cert = s("08");
body.push(block(E("Certification, and what this document is not"), "h2"));
for (const line of lit(cert, "Certification block").split("\n")) body.push(block(E(line)));
const limits = field(cert, "Limits block", "table");
body.push(table(limits.columns, limits.rows));

/* 09 Enquiries → closing */
const enq = s("09");
const closingBody = [paragraphs(enq, "Body")[0], paragraphs(enq, "Minimum order note")[0]].map((p) => E(p)).join(" ");
const buttons = lit(enq, "Buttons").split("\n").map((l) => l.match(/^\[\s*(.*?)\s*→\s*(\S+?)\s*\]$/));
if (!buttons[0]) throw new Error("datasheet buttons");
body.push(block(E(heading(enq, "H2").value), "h2"));

const patch = {
  "seo.title": sheet.head.title,
  "seo.description": sheet.head.description,
  h1: E(heading(head, "H1").value),
  eyebrow: E(lit(head, "Eyebrow")),
  navLabel: "Sponge & Foam Datasheet",
  category: "datasheets",
  icon: "clipboard",
  featured: false,
  // A reference document is looked up, not read through; the hub lists
  // guides by read time and this one sits outside the groups.
  readingMinutes: 8,
  intro: E(paragraphs(head, "Standfirst")[0]),
  standfirst: paragraphs(head, "Standfirst")[0],
  body,
  faqs: [],
  closing: { body: closingBody, cta: { label: E(buttons[0][1]), href: buttons[0][2] } },
  related: { products: ["sponge-foam-rubber"], industries: [], resources: [] },
  confirmWithMargo: [],
};
if (WRITE) {
  await client.createIfNotExists({
    _id: ID,
    _type: "resource",
    slug: { _type: "slug", current: SLUG },
    status: "placeholder",
    h1: patch.h1,
  });
}
await applyDocument({ id: ID, type: "resource", schema: resourceDocSchema, patch, expect });
