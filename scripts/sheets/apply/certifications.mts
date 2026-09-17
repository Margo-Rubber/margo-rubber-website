/**
 * 07_Certifications → certificationsPage-certifications.
 *
 *   node scripts/sheets/apply/certifications.mts [--write]
 */

import { certificationsPageSchema } from "../../../src/content/schemas/index.ts";
import {
  applyDocument,
  field,
  loadSheet,
  section,
  lit,
  heading,
  paragraph,
  rows,
  accentLines,
} from "../lib.mts";

const sheet = loadSheet("07_Certifications");
const s = (n: string) => section(sheet, n);
const expect: string[] = [];
const E = (v: string) => (expect.push(v), v);

/* ── 01 Hero ─────────────────────────────────────────────────────────────── */
const hero = s("01");
const h1 = heading(hero, "H1");
const cta = lit(hero, "CTA").match(/^(.*?)\s*↓\s*(#\S+)$/);
if (!cta) throw new Error("hero cta");
const badge = lit(hero, "Badge").split("\n"); // ISO 9001 : 2015 / CERTIFIED · 09111526A

/* ── 03 The certificate ──────────────────────────────────────────────────── */
const cert = s("03");
const cardRows = Object.fromEntries(
  rows(cert, "Certificate card").map(([k, v]) => [k, v]),
);
const stripRows = rows(cert, "Spec strip").map((r) => ({
  label: E(r[0]),
  value: E(r[1]),
}));
const download =
  field(cert, "Download", "paragraphs").lits?.[0]?.split("\n") ?? [];
// The address on the certificate itself still carries the old MIDC Ambad
// line (sheet: MISMATCH); the card is a designed representation and shows
// the site's confirmed address — OPEN-ITEMS.
const ADDRESS =
  "SRNO. 4494/10, behind Furniture Stop, opposite Samarth Dies, Vilholi, Nashik, Maharashtra 422010, India";

/* ── 04 Facility ─────────────────────────────────────────────────────────── */
const fac = s("04");
// "Internal links. Three: /products/extrusion, /products#compounds,
// /about#manufacturing" — on the card that describes each.
const CAP_LINK: Record<string, string> = {
  "Extrusion lines": "/products/extrusion",
  "Compound mixing": "/products#compounds",
  "Tool room": "/about#manufacturing",
};
const capabilities = rows(fac, "Cards").map((r) => ({
  name: E(r[0]),
  body: E(r[1]),
  ...(CAP_LINK[r[0]] ? { href: CAP_LINK[r[0]] } : {}),
}));

/* ── 05 Quality system ───────────────────────────────────────────────────── */
const sys = s("05");
const ICON = ["inbox", "gauge", "shield", "loop"] as const;
const stages = rows(sys, "Stages").map((r, i) => ({
  icon: ICON[i],
  name: E(r[0]),
  body: E(r[1]),
  // "Stage 3 links to /products#testing where the twelve ASTM and ISO test standards are listed."
  ...(i === 2 ? { href: "/products#testing" } : {}),
}));
const audit = paragraph(sys, "Audit note").match(/^(For supplier qualification audits:)\s*([^]*)$/);
if (!audit) throw new Error("audit note");

/* ── 06 Documentation request ────────────────────────────────────────────── */
const docs = s("06");
const docsH2 = heading(docs, "H2");
const docsForm = lit(docs, "Form fields").split("\n");
// The post-submit state the sheet's technical note writes for this form.
const docsConfirmation = "Received. The documents you selected will follow within one business day to {email}.";
const send = docsForm[docsForm.length - 1].match(/^\[\s*(.*?)\s*→\s*\]$/);
if (!send) throw new Error("docs submit");

const patch = {
  // RES_06 §01: the guide this page sends its reader on to — shown once published.
  furtherReading: ["how-to-evaluate-a-rubber-manufacturer"],
  "seo.title": sheet.head.title,
  "seo.description": sheet.head.description,
  h1: h1.lines.join(" "),
  h1Lines: h1.lines.map((l) => E(l)),
  h1AccentLines: accentLines(h1),
  intro: E(paragraph(hero, "Subhead")),
  // "One button, not two."
  actions: [{ label: E(cta[1]), href: cta[2], variant: "primary" }],
  badge: E(badge.join(" · ")),

  // §02 "DELETE THIS ENTIRE SECTION FROM THE WEBSITE."
  scope: undefined,

  "certificate.card": {
    eyebrow: "QUALITY MANAGEMENT SYSTEM",
    title: "Certificate of Registration",
    certifyLine: "This is to certify that",
    company: E(cardRows["Certified entity"]),
    address: ADDRESS,
    conformLine:
      "has established and maintains a Quality Management System conforming to",
    standard: E(cardRows.Standard),
    scopeLine: E(`Scope: ${cardRows.Scope}`),
    // Issue date is CONFIRM on the sheet — not shown until extracted.
    fields: [
      { label: E("Certificate No."), value: E(cardRows["Certificate No."]) },
      { label: E("Valid until"), value: E(cardRows["Valid until"]) },
    ],
    barTitle: E(download[0] ?? ""),
    barNote: "",
    downloadLabel: (download[1] ?? "").replace(/^\[\s*↓?\s*|\s*\]$/g, ""),
  },
  "certificate.meta": stripRows,
  // The old body promised a PDF that does not exist; the sheet gives none.
  "certificate.body": "",

  "facility.body": E(paragraph(fac, "Intro")),
  "facility.capabilities": capabilities,
  "facility.caption": E(lit(fac, "Image caption")),

  "system.body": E(paragraph(sys, "Intro")),
  "system.items": stages,
  "system.auditNote": { lead: E(audit[1]), body: E(audit[2]) },

  "docs.heading": docsH2.lines.map((l) => E(l)).join(" "),
  "docs.body": E(paragraph(docs, "Body")),
  "docs.items": rows(docs, "Options").map((r) => E(r[0])),
  "docs.submitLabel": E(send[1]),
  "docs.footnote": E(lit(docs, "Footnote")),
  "docs.confirmation": docsConfirmation,
};

await applyDocument({
  id: "certificationsPage-certifications",
  type: "certificationsPage",
  schema: certificationsPageSchema,
  patch,
  expect,
});
