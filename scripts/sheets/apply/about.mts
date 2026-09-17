/**
 * 03_About → aboutPage-about.
 *
 *   node scripts/sheets/apply/about.mts [--write]
 */

import { aboutPageSchema } from "../../../src/content/schemas/index.ts";
import { hrefFor, productBySlug } from "../../../src/content/routes.ts";
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
  list,
  accentLines,
} from "../lib.mts";

const sheet = loadSheet("03_About");
const s = (n: string) => section(sheet, n);
const expect: string[] = [];
const E = (v: string) => (expect.push(v), v);
/** About headings are `lines[]` + `accentLines[]` (index of the accent line). */
const lines = (sec: ReturnType<typeof s>, label = "H2") => {
  const h = heading(sec, label);
  h.lines.forEach((l) => expect.push(l));
  return { lines: h.lines, accentLines: accentLines(h) };
};

/* ── 01 Hero + 02 Stat bar ───────────────────────────────────────────────── */
const hero = s("01");
const h1 = heading(hero, "H1");
const heroStats = rows(s("02"), "Stat cards").map((r) => ({
  value: E(r[0]),
  label: E(r[1]),
}));

/* ── 03 Story ────────────────────────────────────────────────────────────── */
const story = s("03");
const badge = lit(story, "Floating badge").split("\n");
const storyCta = litHref(story, "CTA");

/* ── 04 Vision & mission ─────────────────────────────────────────────────── */
const vis = s("04");
const card = (label: string) => {
  const r = Object.fromEntries(rows(vis, label).map(([k, v]) => [k, v]));
  return {
    eyebrow: E(r.Eyebrow),
    title: E(r.H3),
    body: E(r.Body),
    foot: E(r.Footer),
  };
};
const vision = card("Card 1");
const mission = card("Card 2");

/* ── 05 Values ───────────────────────────────────────────────────────────── */
const val = s("05");
const VALUE_ICON = [
  "shield",
  "target",
  "globe",
  "bolt",
  "users",
  "leaf",
] as const;
const values = rows(val, "Cards").map((r, i) => ({
  icon: VALUE_ICON[i],
  name: E(r[1]),
  body: E(r[2]),
}));

/* ── 06 Founder quote ────────────────────────────────────────────────────── */
const fq = s("06");
const quote = paragraph(fq, "Pull quote").replace(/^“|”$/g, "");
E(quote);
// The component sets the quotation marks and puts each line in its own block.
const quoteLines = quote.split(/(?<=\.)\s+(?=[A-Z])/);
const attribution = lit(fq, "Attribution").split("\n"); // MS / Mehboob Shaikh / Founder & Director · Margo Rubber Products

/* ── 07 Manufacturing ────────────────────────────────────────────────────── */
const mf = s("07");
const MF_ICON = ["area", "lab", "weight"] as const;
const mfStats = rows(mf, "Stat cards").map((r, i) => ({
  icon: MF_ICON[i],
  value: E(r[0]),
  label: E(r[1]),
}));
const equipment = list(mf, "Equipment").map((e) => E(e));
const PORT_SLUG: Record<string, string> = {
  "O-Rings": "o-rings",
  "Oil Seals": "oil-seals",
  Gaskets: "gaskets",
  Bellows: "bellows",
  "Anti-Vibration Mounts": "anti-vibration-mounts",
  Grommets: "grommets",
  "Bushes & Bushings": "bushes",
  "Pads, Stoppers & Caps": "pads-stoppers-caps",
  "Leak Test Rubber": "leak-test-rubber",
  "Extrusion Profiles": "extrusion",
  "Sponge & Foam Rubber": "sponge-foam-rubber",
  Diaphragms: "diaphragms",
};
const portfolio = rows(mf, "Product portfolio")
  .map((r) => r[0])
  .filter((n) => n && n !== "twelfth category")
  .concat(["Diaphragms"]) // the sheet's twelfth entry — "keep it"
  .map((label) => {
    const entry = productBySlug(PORT_SLUG[label]);
    if (!entry) throw new Error(`portfolio slug for ${label}`);
    return { label: E(label), href: hrefFor(entry) };
  });

/* ── 08 Leadership ───────────────────────────────────────────────────────── */
const lead = s("08");
const members = rows(lead, "Cards").map((r, i) => ({
  name: E(r[0]),
  role: E(r[1]),
  body: E(r[2]),
  image: i === 0 ? "about.team.portrait-b" : "about.team.portrait-a",
}));
// "CONFIRM | Team Members": an empty value is not shown (Phase 4 rule).
const leadStats = rows(lead, "Stat cards").map((r) =>
  r[0] === "CONFIRM"
    ? { value: "", label: r[1] }
    : { value: E(r[0]), label: E(r[1]) },
);

/* ── 09 Global reach ─────────────────────────────────────────────────────── */
const reach = s("09");
const chips = (label: string) =>
  lit(reach, label)
    .split(/\s·\s|\n/)
    .map((c) => c.trim())
    .filter(Boolean)
    .map((c) => {
      const m = c.match(/^(\S+)\s+(.*)$/);
      if (!m) throw new Error(`chip ${c}`);
      return { flag: m[1], name: E(m[2]) };
    });
const TRANSIT: Record<string, string> = {
  Australia: "Melbourne 18–22 d",
  "United Kingdom": "Felixstowe 22–28 d",
  UAE: "Jebel Ali 5–8 d",
  "Saudi Arabia": "Dammam",
  Malaysia: "Port Klang 10–14 d",
};
const countries = [
  ...chips("Tier 1").map((c) => ({
    ...c,
    tier: 1 as const,
    note: TRANSIT[c.name],
  })),
  ...chips("Tier 2").map((c) => ({ ...c, tier: 2 as const })),
];
const REACH_ICON = ["globe", "truck"] as const;
const reachStats = rows(reach, "Figure block").map((r, i) => ({
  icon: REACH_ICON[i],
  value: E(r[0]),
  label: E(r[1]),
}));

/* ── 10 Certifications (record from Site settings) ───────────────────────── */
const cert = s("10");
const auditedLabel = E(
  field(cert, "Auditor strip", "paragraphs").lits?.[0]?.split("\n")[0] ?? "",
);

/* ── 11 Sustainability ───────────────────────────────────────────────────── */
const green = s("11");
const bars = rows(green, "Bars").map((r) => ({
  label: E(r[1]),
  note: "",
  pct: Number(r[0].replace("%", "")),
}));

/* ── 12 Numbers ──────────────────────────────────────────────────────────── */
const num = s("12");
const numStats = rows(num, "Stat cards").map((r) => ({
  value: E(r[0]),
  label: E(r[1]),
  note: E(r[2]),
}));
const refLit = field(num, "Testimonial", "paragraphs").lits?.[0] ?? "";
const [refEyebrow, ...refBody] = refLit.split("\n");

/* ── 13 Milestones ───────────────────────────────────────────────────────── */
const ms = s("13");
const msField = field(ms, "Entries", "table");
// The sheet marks ten of the eleven years CONFIRM. Ayaz's instruction
// (2026-09-17): the sheets are the source of truth — what they write is
// published as written, and only a contradiction inside the content is a
// question. So every entry ships; the Studio's verified/proposed switch
// remains the way to take one down if a date proves wrong.
const timeline = msField.rows.map((r) => ({
  year: r[0],
  title: r[1],
  body: r[2],
  verification: "verified" as const,
}));
timeline
  .filter((t) => t.verification === "verified")
  .forEach((t) => {
    E(t.year);
    E(t.title);
    E(t.body);
  });

/* ── 14 Clients ──────────────────────────────────────────────────────────── */
const cl = s("14");
const clientRows = rows(cl, "Names");

/* ── 15 Closing ──────────────────────────────────────────────────────────── */
const close = s("15");
const fieldLit = lit(close, "Field").match(/^(\S+)\s+\[\s*(.*?)\s*→\s*\]$/);
if (!fieldLit) throw new Error("closing field");

const patch = {
  // RES_06 §01: the guide this page sends its reader on to — shown once published.
  furtherReading: ["how-to-evaluate-a-rubber-manufacturer"],
  "seo.title": sheet.head.title,
  "seo.description": sheet.head.description,
  h1: h1.lines.join(" "),
  h1Lines: h1.lines.map((l) => E(l)),
  h1AccentLines: accentLines(h1),
  intro: E(paragraph(hero, "Subhead")),
  actions: [
    { ...litHref(hero, "CTA primary"), variant: "primary" },
    { ...litHref(hero, "CTA secondary"), variant: "secondary" },
  ],
  // "WATCH FILM — there is no film": the control comes off. The sheet's hero
  // has no badge row either (the old one read "About Margo Rubber Industries").
  watchLabel: "",
  badge: "",
  heroStats,

  "story.lines": lines(story).lines,
  "story.accentLines": lines(story).accentLines,
  "story.badge": { value: E(badge[0]), label: E(badge[1]) },
  "story.paragraphs": [
    E(paragraph(story, "Paragraph 1")),
    E(paragraph(story, "Paragraph 2")),
  ],
  "story.checks": rows(story, "Bullets").map((r) => E(r[0])),
  "story.cta": { label: E(storyCta.label), href: storyCta.href },

  "vision.lines": lines(vis).lines,
  "vision.accentLines": lines(vis).accentLines,
  "vision.items": [
    { icon: "target", footIcon: "trend", ...vision, footHref: "/export" },
    { icon: "bolt", footIcon: "shield", ...mission },
  ],

  "values.lines": lines(val).lines,
  "values.accentLines": [],
  // Values and Team use the split head, whose lede is `note`.
  "values.note": E(paragraph(val, "Intro")),
  "values.items": values,

  "leadership.quoteLines": quoteLines,
  "leadership.quoteAccent": "",
  "leadership.body": E(paragraph(fq, "Body")),
  "leadership.person": {
    initials: E(attribution[0]),
    name: E(attribution[1]),
    role: E(attribution[2]),
  },

  "manufacturing.lines": lines(mf).lines,
  "manufacturing.accentLines": lines(mf).accentLines,
  "manufacturing.body": E(paragraph(mf, "Intro")),
  "manufacturing.main.caption": E(lit(mf, "Image caption")),
  "manufacturing.stats": mfStats,
  "manufacturing.equipment": equipment,
  "manufacturing.portfolio": portfolio,

  "team.lines": lines(lead).lines,
  "team.accentLines": lines(lead).accentLines,
  "team.note": E(paragraph(lead, "Intro")),
  "team.members": members,
  "team.stats": leadStats,

  "presence.lines": lines(reach).lines,
  "presence.accentLines": lines(reach).accentLines,
  "presence.body": E(paragraph(reach, "Intro")),
  "presence.countries": countries,
  "presence.stats": reachStats,

  "awards.lines": lines(cert).lines,
  "awards.accentLines": lines(cert).accentLines,
  "awards.auditedLabel": auditedLabel,

  "green.lines": lines(green).lines,
  "green.accentLines": lines(green).accentLines,
  "green.body": E(paragraph(green, "Body")),
  "green.bars": bars,
  // "Remove badge: Carbon Neutral · Target: 2027"
  "green.imageBadge": { title: "", note: "" },

  "numbers.lines": lines(num).lines,
  "numbers.accentLines": lines(num).accentLines,
  "numbers.stats": numStats,
  "numbers.references": { eyebrow: E(refEyebrow), body: E(refBody.join(" ")) },

  "timeline.lines": lines(ms).lines,
  "timeline.accentLines": lines(ms).accentLines,
  "timeline.items": timeline,

  "clients.label": E(lit(cl, "Eyebrow")),
  "clients.items": clientRows.map((r) => E(r[0])),
  "clients.sectors": clientRows.map((r) => E(r[1])),

  "closing.lines": lines(close).lines,
  "closing.accentLines": lines(close).accentLines,
  "closing.body": E(paragraph(close, "Body")),
  "closing.placeholder": fieldLit[1],
  "closing.submitLabel": E(fieldLit[2]),
  "closing.assurances": rows(close, "Assurance chips").map((r) => E(r[0])),
};

await applyDocument({
  id: "aboutPage-about",
  type: "aboutPage",
  schema: aboutPageSchema,
  patch,
  expect,
});
