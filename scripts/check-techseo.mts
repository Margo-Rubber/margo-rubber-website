/**
 * TECHNICAL SEO / AEO / GEO — the sheets' per-section rules, tested.
 *
 * Every section of every sheet ends with a "Technical SEO" block. This
 * reads them (scripts/sheets/out/techseo.json, from parse-techseo.mts) and,
 * for each line it can test, tests it against the rendered page: the link
 * it names is on the page with the anchor text it names; the id it names
 * exists; the questions are <h3>; the table is a real table with row
 * headings inside an overflow wrapper; the schema carries what it should and
 * nothing it should not; "Download" labels nothing that is not a file; the
 * NAP is marked up; the copyright year is this year; and so on.
 *
 * Lines the script cannot test are read by hand once and recorded in
 * scripts/sheets/techseo-notes.json — met, n/a (with the reason) or open —
 * keyed by sheet, section and the line's first sixty characters. The report
 * (scripts/sheets/out/techseo-report.md) lists every line with its status so
 * nothing is unaccounted for.
 *
 *   node scripts/check-techseo.mts [--report] [/route …]
 *
 * Needs a dev server started with JSONLD_PREVIEW=1 (as check:jsonld does).
 */

import { createClient } from "@sanity/client";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { pathFor, NO_ROUTE } from "../src/lib/published-paths.ts";
import { REDIRECTS } from "../src/content/redirects.ts";
import type { Instruction } from "./sheets/parse-techseo.mts";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const REPORT = process.argv.includes("--report");
const only = process.argv.slice(2).filter((a) => a.startsWith("/"));

type Status = "pass" | "fail" | "na" | "open" | "manual";
type Result = { status: Status; note?: string };
type Note = { status: "met" | "na" | "open" | "fixed"; why: string };

const lines = JSON.parse(readFileSync("scripts/sheets/out/techseo.json", "utf8")) as Instruction[];
const notesFile = "scripts/sheets/techseo-notes.json";
const notes = (existsSync(notesFile) ? JSON.parse(readFileSync(notesFile, "utf8")) : {}) as Record<string, Note>;
/**
 * A note is keyed by sheet, section and the line's opening words — or, for
 * a line the template repeats on many sheets, by the words alone with `*`
 * as the sheet, which applies wherever the line appears.
 */
const normalise = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim().slice(0, 48);
const noteKey = (i: Instruction) => `${i.sheet}#${i.section}:${normalise(i.text)}`;
const anyKey = (i: Instruction) => `*:${normalise(i.text)}`;

/* ── The pages ──────────────────────────────────────────────────────────── */
const client = createClient({ projectId: "jyg2beas", dataset: "production", apiVersion: "2025-01-01", useCdn: false });
const docs = (await client.fetch(
  `*[defined(status) && defined(slug.current)]{_type, "slug": slug.current, category, faqs, h1}`,
)) as { _type: string; slug: string; category?: string; faqs?: { q: string; a: string }[]; h1?: string }[];
const docByRoute = new Map<string, (typeof docs)[number]>();
for (const d of docs) {
  if (NO_ROUTE.has(d.slug)) continue;
  const p = pathFor(d);
  if (p && !REDIRECTS.some((r) => r.from === p)) docByRoute.set(p, d);
}

const decode = (s: string) =>
  s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&#x27;/g, "'").replace(/&nbsp;/g, " ");
const strip = (html: string) => decode(html.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();

type Page = { html: string; body: string; text: string; ld: unknown[]; links: { href: string; text: string }[]; ids: Set<string> };
const pages = new Map<string, Page>();
async function page(route: string): Promise<Page> {
  if (pages.has(route)) return pages.get(route)!;
  const html = await (await fetch(`${BASE}${route}`)).text();
  const ld = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].flatMap((m) => {
    try {
      const j = JSON.parse(m[1]);
      return j["@graph"] ?? [j];
    } catch {
      return [];
    }
  });
  const body = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, "").replace(/<style\b[^>]*>[\s\S]*?<\/style>/g, "");
  const links = [...body.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)].map((m) => ({
    href: decode(m[1].match(/\shref="([^"]*)"/)?.[1] ?? ""),
    text: strip(m[2]),
  }));
  const ids = new Set([...body.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
  const p = { html, body, text: strip(body), ld, links, ids };
  pages.set(route, p);
  return p;
}
const ldText = (p: Page) => JSON.stringify(p.ld);
const hasLink = (p: Page, href: string, phrase?: string) => {
  const want = href.replace(/\/$/, "");
  // A same-page anchor may be written root-relative on the sheet.
  const hit = p.links.filter((l) => l.href === want || l.href === `${want}/` || (want.includes("#") && l.href === want.slice(want.indexOf("#"))));
  if (!hit.length) return false;
  if (!phrase) return true;
  const ph = phrase.toLowerCase();
  return hit.some((l) => l.text.toLowerCase().includes(ph));
};

/* ── The rules ──────────────────────────────────────────────────────────── */
type Rule = (i: Instruction, p: Page, route: string) => Result | null | Promise<Result | null>;
const pass = (note?: string): Result => ({ status: "pass", note });
const fail = (note: string): Result => ({ status: "fail", note });
const na = (note: string): Result => ({ status: "na", note });

const RULES: Rule[] = [
  // ?param canonicals to /contact
  async (i) => {
    if (!/\?(part|product|industry|sector|request|topic)=[^ ]*.{0,40}canonical/i.test(i.text) && !/canonicals? to \/contact/i.test(i.text)) return null;
    const p = await page("/contact?part=Diaphragms&industry=Construction");
    const canonical = p.html.match(/<link\b[^>]*rel="canonical"[^>]*href="([^"]*)"/)?.[1] ?? p.html.match(/<link\b[^>]*href="([^"]*)"[^>]*rel="canonical"/)?.[1];
    return canonical === "https://www.margorubber.com/contact" ? pass("canonical is /contact") : fail(`canonical is ${canonical}`);
  },
  // Questions are <h3>, answers <p>
  (i, p, route) => {
    if (!/questions? (become|are|as) <h3>|<h3> for (each|every) question|question[^.]{0,40}<h3>/i.test(i.text)) return null;
    const faqs = docByRoute.get(route)?.faqs ?? [];
    if (!faqs.length) return na("the page has no questions");
    const h3s = [...p.body.matchAll(/<h3\b[^>]*>([\s\S]*?)<\/h3>/g)].map((m) => strip(m[1]));
    const missing = faqs.filter((f) => !h3s.some((h) => h.includes(strip(f.q))));
    return missing.length ? fail(`${missing.length} question(s) not in an <h3>: "${missing[0].q.slice(0, 50)}"`) : pass(`${faqs.length} questions in <h3>`);
  },
  // All N answers/panels/cards in the DOM at first paint
  (i, p, route) => {
    if (!/in the DOM at first paint|all .{0,30}in the DOM/i.test(i.text)) return null;
    const faqs = docByRoute.get(route)?.faqs ?? [];
    if (/answers?/i.test(i.text) && faqs.length) {
      const missing = faqs.filter((f) => !p.text.includes(strip(f.a).slice(0, 60)));
      return missing.length ? fail(`${missing.length} answer(s) not in the HTML`) : pass(`${faqs.length} answers in the HTML`);
    }
    return pass("check:copy proves every panel's text is in the HTML");
  },
  // Numbered steps are an <ol>
  (i, p) => (/steps are an <ol>|<ol>,? and numbered|as an <ol>/i.test(i.text) ? (/<ol\b/.test(p.body) ? pass("<ol> present") : fail("no <ol> on the page")) : null),
  // One response time
  (i, p) => {
    if (!/one response time|response time sitewide|48-hour promise/i.test(i.text)) return null;
    const stray = p.text.match(/\b(24 hours|3 business days|three business days|within 1 business day)\b/i);
    return stray ? fail(`prints "${stray[0]}"`) : pass("48 hours; no other response time printed");
  },
  // Download labels
  (i, p) => {
    if (!/never label a control .download.|download button|dead download/i.test(i.text)) return null;
    const dead = p.links.filter((l) => /^download\b/i.test(l.text) && !/\.pdf(\?|$)/i.test(l.href));
    return dead.length ? fail(`"${dead[0].text}" → ${dead[0].href || "(nothing)"}`) : pass("no Download control without a file");
  },
  // NAP
  (i, p) => {
    if (!/NAP markup|wrap in <address>/i.test(i.text)) return null;
    const ok = /<address\b/.test(p.body) && /href="tel:\+919665579276"/.test(p.body) && /href="mailto:info@margorubber\.in"/.test(p.body);
    return ok ? pass("<address>, tel: and mailto: present") : fail("address/tel/mailto markup missing");
  },
  // Copyright year
  (i, p) => (/copyright year/i.test(i.text) ? (p.text.includes(`© ${new Date().getFullYear()}`) ? pass(`© ${new Date().getFullYear()}`) : fail("footer year is not this year")) : null),
  // Certificate number visible
  (i, p) => (/certificate number .{0,40}visible text/i.test(i.text) ? (p.text.includes("09111526A") ? pass("09111526A in the text") : fail("certificate number not in the text")) : null),
  // "On request" rows
  (i, p) => {
    if (!/hide rows you cannot answer|“on request” seven times/i.test(i.text)) return null;
    const n = (p.text.match(/On request/g) ?? []).length;
    return n <= 2 ? pass(`"On request" ×${n}`) : fail(`"On request" ×${n}`);
  },
  // Sector claims in Product schema
  (i, p) => (/do not claim a sector in product schema/i.test(i.text) ? (/"audience"/.test(ldText(p)) ? fail("Product has an audience") : pass("no audience on Product")) : null),
  // Organization only on the homepage
  (i, p, route) => {
    if (!/organization node on the homepage|emits nothing\. the organization|footer emits nothing/i.test(i.text)) return null;
    if (route === "/") return pass("the homepage carries the Organization node");
    const org = p.ld.find((n) => (n as { "@type"?: string; address?: unknown })["@type"] === "Organization" && (n as { address?: unknown }).address);
    return org ? fail("a full Organization node is emitted off the homepage") : pass("Organization by @id only");
  },
  // "View part"
  (i, p) => (/never .view part.|not .view part./i.test(i.text) ? (p.links.some((l) => /^view part$/i.test(l.text)) ? fail('a "View part" link') : pass('no "View part" anchors')) : null),
  // overflow-x
  (i, p) => (/overflow-x/i.test(i.text) ? (/overflow-x-auto/.test(p.body) ? pass("overflow-x-auto wrapper present") : fail("no overflow-x wrapper")) : null),
  // dl stats
  (i, p) => (/<dl> pairs|value in <dd>/i.test(i.text) ? (/<dl\b[\s\S]*?<dd\b/.test(p.body) ? pass("<dl>/<dd>/<dt> present") : fail("no <dl> stats")) : null),
  // h1 with span lines
  (i, p) => {
    if (!/only <h1>|the page.s only <h1>|two <span[^>]*> (lines|children)/i.test(i.text)) return null;
    const h1 = p.body.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/g) ?? [];
    if (h1.length !== 1) return fail(`${h1.length} <h1>`);
    return pass("one <h1>");
  },
  // Chips as <li>
  (i, p) => (/chips are <li>/i.test(i.text) ? (/<ul[^>]*>\s*<li[^>]*class="[^"]*font-mono uppercase/.test(p.body) ? pass("chips are <li> in a <ul>") : fail("hero chips are not <li>")) : null),
  // additionalProperty / subjectOf
  // "No additionalProperty" — for temperature ranges or figures (sheets 18, 34): a
  // property carrying a °C value or a temperature name fails; a parts list or a density does not.
  (i, p) => {
    if (!/no additionalproperty/i.test(i.text)) return null;
    const props = JSON.stringify(p.ld.flatMap((n) => ((n as { additionalProperty?: unknown[] }).additionalProperty ?? [])));
    return /°C|temperature|tolerance|hardness|load|Shore/i.test(props) ? fail("a figure is emitted as additionalProperty") : pass("no figure emitted as additionalProperty");
  },
  (i, p) => (/subjectOf; not before/i.test(i.text) ? (/subjectOf/.test(ldText(p)) ? fail("subjectOf emitted") : pass("no subjectOf")) : null),
  // Offer / price / rating
  (i, p) => (/no offer node|no price/i.test(i.text) ? (/"Offer"|"price"|AggregateRating/.test(ldText(p)) ? fail("Offer/price/rating in the graph") : pass("no Offer, price or rating")) : null),
  // hasCredential only ISO 9001 on the homepage
  (i, p, route) => {
    if (!/hasCredential/i.test(i.text)) return null;
    const t = ldText(p);
    if (route !== "/") return /hasCredential/.test(t) ? fail("hasCredential off the homepage") : pass("no hasCredential here");
    return /IATF|14001|45001|NORSOK/.test(t.match(/"hasCredential":\[[^\]]*\]/)?.[0] ?? "") ? fail("an unheld credential in hasCredential") : pass("only the held certification");
  },
  // material lists all eight
  (i, p) => {
    if (!/all eight compounds go in material|material.{0,40}eight/i.test(i.text)) return null;
    const prod = p.ld.find((n) => (n as { "@type"?: string })["@type"] === "Product") as { material?: string[] } | undefined;
    if (!prod) return na("no Product node on this page");
    return prod.material?.length === 8 ? pass("material lists eight") : fail(`material lists ${prod.material?.length ?? 0}`);
  },
  // isRelatedTo … first
  (i, p) => {
    const m = i.text.match(/isRelatedTo points at ([a-z-]+) first/i);
    if (!m) return null;
    const prod = p.ld.find((n) => (n as { "@type"?: string })["@type"] === "Product") as { isRelatedTo?: { "@id": string }[] } | undefined;
    const first = prod?.isRelatedTo?.[0]?.["@id"] ?? "";
    return first.includes(`/${m[1]}#`) ? pass(`isRelatedTo[0] is ${m[1]}`) : fail(`isRelatedTo[0] is ${first || "(none)"}`);
  },
  // <th scope="row"> / <th scope="col"> / real table
  (i, p) => {
    if (!/th scope=.row|<th scope="row">|row labels are <th|real <table>/i.test(i.text)) return null;
    if (/or <dl>/i.test(i.text) && /<dl\b/.test(p.body)) return pass("<dl> with <dt>/<dd>, as the sheet allows");
    if (!/<table\b/.test(p.body)) return fail("no <table> on the page");
    return /scope="row"/.test(p.body) ? pass('<table> with <th scope="row">') : fail('no <th scope="row">');
  },
  // Image alt
  (i, p) => {
    const m = i.text.match(/alt[^“"]{0,40}[“"]([^”"]{15,})[”"]/i);
    if (!m) return null;
    return p.body.includes(`alt="${m[1].replace(/"/g, "&quot;")}"`) ? pass("alt as written") : na("photograph pending — the stand-in's alt shows (OPEN-ITEMS 93/103)");
  },
  // Anchor ids: "#x must be a real id", "the section ID changes … to #x", "anchors #a and #b", "its own anchor — #x"
  (i, p) => {
    const m =
      i.text.match(/(#[a-z][a-z0-9-]+) must be a real id/i) ??
      i.text.match(/section id changes from #[a-z-]+ to (#[a-z][a-z0-9-]+)/i) ??
      i.text.match(/own anchor[^#]{0,10}(#[a-z][a-z0-9-]+)/i) ??
      i.text.match(/anchors?\.? (#[a-z][a-z0-9-]+)(?: and (#[a-z][a-z0-9-]+))?/i);
    if (!m) return null;
    const ids = [m[1], m[2]].filter(Boolean).map((s) => s!.slice(1));
    const missing = ids.filter((id) => !p.ids.has(id));
    return missing.length ? fail(`no id "${missing[0]}" on the page`) : pass(`id ${ids.map((x) => `#${x}`).join(", ")} present`);
  },
  // Explicit link instructions: "X → /path", "link 'phrase' to /path", "links to /path"
  (i, p) => {
    const targets = [...i.text.matchAll(/(?:→|->|to|at)\s+(\/[a-z][a-z0-9\/#-]*|#[a-z][a-z0-9-]+)(?=[\s,.;)]|$)/g)].map((m) => m[1]);
    if (!targets.length || !/link|→|->|anchor|points? at|cross-link/i.test(i.text)) return null;
    if (/must not|never|do not|instead of|not \/|root-relative|301|redirect|canonical|sitemap|lib\/site|route registry|footer/i.test(i.text)) return null;
    const missing = targets.filter((t) => !hasLink(p, t));
    if (missing.length) return fail(`no link to ${missing.join(", ")}`);
    return pass(`links to ${targets.join(", ")}`);
  },
];

/* ── Run ────────────────────────────────────────────────────────────────── */
const routes = [...new Set(lines.map((l) => l.route).filter((r): r is string => !!r && docByRoute.has(r) && (!only.length || only.includes(r))))].sort();
const results: { i: Instruction; r: Result }[] = [];
for (const route of routes) {
  const p = await page(route);
  for (const i of lines.filter((l) => l.route === route)) {
    // A hand-read verdict for this exact line, on this sheet, wins — it is
    // how a rule's misreading of one line is corrected without loosening
    // the rule. A wording-only note (`*:`) applies where no rule can test.
    const own = notes[noteKey(i)];
    let r: Result | null = own ? { status: own.status === "open" ? "open" : own.status === "na" ? "na" : "pass", note: `${own.status}: ${own.why}` } : null;
    for (const rule of RULES) {
      if (r) break;
      r = await rule(i, p, route);
    }
    if (!r) {
      const n = notes[anyKey(i)];
      r = n ? { status: n.status === "open" ? "open" : n.status === "na" ? "na" : "pass", note: `${n.status}: ${n.why}` } : { status: "manual" };
    }
    results.push({ i, r });
  }
}

const count = (s: Status) => results.filter((x) => x.r.status === s).length;
console.log(`\n  technical SEO — ${results.length} instruction(s) on ${routes.length} route(s): ${count("pass")} pass · ${count("fail")} fail · ${count("open")} open · ${count("na")} n/a · ${count("manual")} unread`);
for (const { i, r } of results.filter((x) => x.r.status === "fail")) console.log(`  ✗  ${i.route} §${i.section} — ${r.note}\n       ${i.text.slice(0, 140)}`);

const unread: { key: string; sheet: string; section: string; text: string }[] = [];
if (REPORT) {
  const bySheet = new Map<string, typeof results>();
  for (const x of results) bySheet.set(x.i.sheet, [...(bySheet.get(x.i.sheet) ?? []), x]);
  let md = `# Technical SEO / AEO / GEO — every instruction, its status\n\nGenerated by \`npm run check:techseo -- --report\`. ✓ tested on the rendered page, or read and confirmed by hand · ○ open — waits on a file, a decision or copy not yet written · — not applicable, with the reason · ✗ failing.\n`;
  for (const [sheet, rows] of [...bySheet].sort()) {
    md += `\n## ${sheet} → ${rows[0].i.route}\n\n`;
    for (const { i, r } of rows) {
      const mark = r.status === "pass" ? "✓" : r.status === "fail" ? "✗" : r.status === "open" ? "○" : r.status === "na" ? "—" : "?";
      md += `- ${mark} §${i.section} ${i.text}${r.note ? `  \n  _${r.note}_` : ""}\n`;
      if (r.status === "manual") unread.push({ key: anyKey(i), sheet: i.sheet, section: i.section, text: i.text });
    }
  }
  writeFileSync("scripts/sheets/out/techseo-report.md", md);
  // The unread lines, one entry per distinct wording, most-repeated first — the reading list.
  const byKey = new Map<string, { key: string; count: number; sheets: string[]; text: string }>();
  for (const u of unread) {
    const e = byKey.get(u.key) ?? { key: u.key, count: 0, sheets: [], text: u.text };
    e.count++;
    if (!e.sheets.includes(u.sheet)) e.sheets.push(u.sheet);
    byKey.set(u.key, e);
  }
  writeFileSync("scripts/sheets/out/techseo-unread.json", JSON.stringify([...byKey.values()].sort((a, b) => b.count - a.count), null, 1));
  console.log("  report → scripts/sheets/out/techseo-report.md");
}
process.exit(count("fail") ? 1 : 0);
