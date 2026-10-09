/**
 * MIGRATION — legal page fixes from the October 2026 legal review.
 *
 *   node --env-file=.env.local scripts/migrations/2026-10-09-legal-text-fixes.mts           (dry run)
 *   node --env-file=.env.local scripts/migrations/2026-10-09-legal-text-fixes.mts --write   (apply)
 *
 * What it changes (published documents in Sanity, not the .mdx fallbacks):
 *
 *   Privacy Policy
 *     · margorubber.in → this website (www.margorubber.com)
 *     · §2  automatic collection described as server logs; "business address" dropped
 *           (no form asks for it); marketing-box choice listed
 *     · §3  marketing now refers to the optional, unticked box on the forms
 *     · §4  cookies: the site runs no analytics, so no cookie notice exists or is needed
 *     · §5  "Analytics providers" recipient removed
 *     · §8  "Analytics data" retention line replaced by server logs
 *     · §9  "hosting and analytics providers" → hosting providers
 *   Terms
 *     · margorubber.in → this website (www.margorubber.com)
 *     · §1  new "Order of precedence" paragraph (signed agreements and terms
 *           confirmed on the order acknowledgement prevail, e.g. longer OEM warranties)
 *     · §8  non-conforming goods: replace, re-manufacture OR credit note, at Margo's option
 *   Disclaimer
 *     · margorubber.in → this website (www.margorubber.com)
 *   All three: Last updated → 09 October 2026.
 *
 * Deliberately NOT changed (need a decision / a lawyer): jurisdiction or
 * arbitration, tooling ownership, the firm's legal-form wording.
 *
 * Safe to re-run. Every edit checks the CURRENT text first: if it already
 * reads the new way it is skipped; if it reads neither the old way nor the
 * new way (someone edited it in the Studio), it is reported and NOT touched.
 * Each document is patched with ifRevisionId, so a concurrent Studio edit
 * makes the write fail rather than overwrite it.
 */
import { createClient } from "@sanity/client";

const write = process.argv.includes("--write");
const token = process.env.SANITY_WRITE_TOKEN;
if (write && !token) throw new Error("SANITY_WRITE_TOKEN is not set — run with --env-file=.env.local");

const client = createClient({
  projectId: "jyg2beas",
  dataset: "production",
  apiVersion: "2024-01-01",
  token,
  useCdn: false,
  perspective: "published",
});

const DATE = "09 October 2026";
const SITE = "this website (www.margorubber.com)";

/** A key path inside a document: section key, then block key, then field. */
type Loc = { section?: string; block?: string; field: "text" | "items" | "intro" | "lastUpdated" };

type Edit =
  /** Replace one substring, which must occur exactly once. */
  | { doc: string; loc: Loc; find: string; replace: string }
  /** Replace the whole string; `guard` must be found in the current value. */
  | { doc: string; loc: Loc; guard: string; set: string }
  /** List items: drop the item containing `drop` / swap the item containing `match`. */
  | { doc: string; loc: Loc; drop: string }
  | { doc: string; loc: Loc; match: string; item: string }
  /** List items: append an item unless one containing `unless` is already there. */
  | { doc: string; loc: Loc; append: string; unless: string }
  /** Insert a new paragraph block after `after`, unless block `key` exists. */
  | { doc: string; section: string; after: string; key: string; text: string };

const P = "legal-privacy-policy";
const T = "legal-terms";
const D = "legal-disclaimer";

const EDITS: Edit[] = [
  // ── PRIVACY POLICY ────────────────────────────────────────────────────
  { doc: P, loc: { field: "intro" }, find: "when you use margorubber.in or contact us", replace: `when you use ${SITE} or contact us` },
  { doc: P, loc: { section: "introduction", block: "p", field: "text" }, find: "collected through margorubber.in.", replace: `collected through ${SITE}.` },

  { doc: P, loc: { section: "information-we-collect", block: "ul", field: "items" }, match: "business address", item: "Country" },
  {
    doc: P, loc: { section: "information-we-collect", block: "ul", field: "items" },
    append: "Whether you want occasional product and compound updates by email, where you tick the optional box on a form",
    unless: "optional box",
  },
  {
    doc: P, loc: { section: "information-we-collect", block: "p-3", field: "text" },
    guard: "When you browse the site",
    set: "When you browse the site, our hosting provider records standard server logs: IP address, browser type and version, device and operating system, the pages requested and the time of each request. These are used to keep the site working and secure and to diagnose faults. We do not run analytics or tracking scripts on this website.",
  },

  {
    doc: P, loc: { section: "how-we-use-your-information", block: "p-2", field: "text" },
    guard: "We use automatically collected information",
    set: "We use automatically collected information only to operate and secure the website and to diagnose faults. We do not use it to build a profile of you as an individual.",
  },
  {
    doc: P, loc: { section: "how-we-use-your-information", block: "p-4", field: "text" },
    guard: "**Marketing.**",
    set: "**Marketing.** We will contact you about your enquiry. We will send you marketing emails only if you tick the optional box on one of our forms, and every such email will carry an unsubscribe route. You can withdraw that consent at any time by replying or by writing to us at the address in section 12.",
  },

  {
    doc: P, loc: { section: "cookies-tracking", block: "p", field: "text" },
    guard: "cookies",
    set: "This website does not use analytics, advertising or tracking cookies, so it does not show a cookie banner. The only cookies it may set are strictly necessary ones that keep the site and its forms working, which do not require consent.",
  },
  {
    doc: P, loc: { section: "cookies-tracking", block: "p-2", field: "text" },
    guard: "block cookies in your browser",
    set: "You can clear or block cookies in your browser at any time. Blocking strictly necessary cookies may stop parts of the site, such as the enquiry forms, from working.",
  },
  {
    doc: P, loc: { section: "cookies-tracking", block: "p-3", field: "text" },
    guard: "remarketing pixels",
    set: "If we introduce analytics in future, we will update this policy first and ask for your consent through a cookie notice before any analytics cookie is set. We do not use cross-site tracking and do not run remarketing pixels on this website.",
  },

  { doc: P, loc: { section: "third-party-services", block: "ul", field: "items" }, drop: "**Analytics providers**" },

  {
    doc: P, loc: { section: "data-retention", block: "ul", field: "items" },
    match: "**Analytics data**",
    item: "**Server logs** — kept by our hosting provider for a short period for security and fault diagnosis, then deleted automatically",
  },

  { doc: P, loc: { section: "international-transfers", block: "p-3", field: "text" }, find: "Some of our hosting and analytics providers store data outside India.", replace: "Some of our hosting providers, including the services that store form submissions and uploaded files, process data outside India." },

  { doc: P, loc: { field: "lastUpdated" }, guard: "20", set: DATE },

  // ── TERMS ─────────────────────────────────────────────────────────────
  { doc: T, loc: { field: "intro" }, find: "your use of margorubber.in and", replace: `your use of ${SITE} and` },
  {
    doc: T, section: "acceptance-of-terms", after: "p-2", key: "p-precedence",
    text: "**Order of precedence.** Where we have signed a supply agreement with you, it governs. Where we confirm terms for a particular order in writing on the quotation or order acknowledgement — for example a longer warranty period or different payment terms — those terms prevail over these for that order. Your own purchase-order terms apply only where we have accepted them in writing.",
  },
  {
    doc: T, loc: { section: "warranties-disclaimers", block: "p", field: "text" },
    guard: "Where goods do not conform",
    set: "Where goods do not conform, we will at our option **replace or re-manufacture them, or issue a credit note for their invoice value**. These are your sole remedies for non-conformity. **We do not issue cash refunds for non-conforming goods.**",
  },
  { doc: T, loc: { field: "lastUpdated" }, guard: "20", set: DATE },

  // ── DISCLAIMER ────────────────────────────────────────────────────────
  { doc: D, loc: { section: "scope-of-this-disclaimer", block: "p", field: "text" }, find: "published on margorubber.in by", replace: `published on ${SITE} by` },
  { doc: D, loc: { field: "lastUpdated" }, guard: "20", set: DATE },
];

// ── machinery ───────────────────────────────────────────────────────────

type Block = { _key: string; kind: string; text?: string; items?: string[] };
type Section = { _key: string; blocks: Block[] };
type LegalDoc = { _id: string; _rev: string; intro?: string; lastUpdated?: string; sections: Section[] };

const path = (l: Loc) =>
  l.section
    ? `sections[_key=="${l.section}"].blocks[_key=="${l.block}"].${l.field}`
    : l.field;

function read(d: LegalDoc, l: Loc): unknown {
  if (!l.section) return d[l.field as "intro" | "lastUpdated"];
  const s = d.sections.find((x) => x._key === l.section);
  const b = s?.blocks.find((x) => x._key === l.block);
  return b?.[l.field as "text" | "items"];
}

const ids = [...new Set(EDITS.map((e) => e.doc))];
const docs = new Map<string, LegalDoc>();
for (const id of ids) {
  const d = await client.getDocument<LegalDoc>(id);
  if (!d) throw new Error(`document ${id} not found`);
  docs.set(id, d);
}

/** Pending `set`s per document (path → value), and inserts. */
const sets = new Map<string, Record<string, unknown>>();
const inserts = new Map<string, { at: string; items: Block[] }[]>();
let problems = 0;
const say = (tag: string, e: { doc: string }, what: string) => console.log(`  ${tag.padEnd(8)} ${e.doc}  ${what}`);
const stage = (doc: string, p: string, v: unknown) => {
  // Two edits on one list (e.g. swap + append) must build on each other.
  sets.set(doc, { ...(sets.get(doc) ?? {}), [p]: v });
};
const current = (doc: string, l: Loc) => sets.get(doc)?.[path(l)] ?? read(docs.get(doc)!, l);

for (const e of EDITS) {
  const d = docs.get(e.doc)!;

  if ("section" in e) {
    const s = d.sections.find((x) => x._key === e.section);
    if (!s) { say("MISSING", e, `section ${e.section}`); problems++; continue; }
    if (s.blocks.some((b) => b._key === e.key)) { say("done", e, `${e.section}.${e.key} already present`); continue; }
    if (!s.blocks.some((b) => b._key === e.after)) { say("MISSING", e, `${e.section}.${e.after}`); problems++; continue; }
    const list = inserts.get(e.doc) ?? [];
    list.push({ at: `sections[_key=="${e.section}"].blocks[_key=="${e.after}"]`, items: [{ _key: e.key, kind: "p", text: e.text }] });
    inserts.set(e.doc, list);
    say("insert", e, `${e.section}.${e.key}`);
    continue;
  }

  const p = path(e.loc);
  const cur = current(e.doc, e.loc);

  if ("find" in e) {
    if (typeof cur !== "string") { say("MISSING", e, p); problems++; continue; }
    if (cur.includes(e.replace)) { say("done", e, p); continue; }
    const n = cur.split(e.find).length - 1;
    if (n !== 1) { say("CHANGED", e, `${p} — expected text not found exactly once; edit by hand`); problems++; continue; }
    stage(e.doc, p, cur.replace(e.find, e.replace));
    say("set", e, p);
  } else if ("set" in e) {
    if (typeof cur !== "string") { say("MISSING", e, p); problems++; continue; }
    if (cur === e.set) { say("done", e, p); continue; }
    if (!cur.includes(e.guard)) { say("CHANGED", e, `${p} — no longer matches; edit by hand`); problems++; continue; }
    stage(e.doc, p, e.set);
    say("set", e, p);
  } else {
    if (!Array.isArray(cur)) { say("MISSING", e, p); problems++; continue; }
    const items = cur as string[];
    if ("drop" in e) {
      if (!items.some((i) => i.includes(e.drop))) { say("done", e, `${p} (${e.drop})`); continue; }
      stage(e.doc, p, items.filter((i) => !i.includes(e.drop)));
      say("drop", e, `${p} (${e.drop})`);
    } else if ("match" in e) {
      if (items.includes(e.item)) { say("done", e, `${p} (${e.item})`); continue; }
      const i = items.findIndex((x) => x.includes(e.match));
      if (i < 0) { say("CHANGED", e, `${p} — no item contains "${e.match}"; edit by hand`); problems++; continue; }
      stage(e.doc, p, items.map((x, j) => (j === i ? e.item : x)));
      say("swap", e, `${p} (${e.match})`);
    } else {
      if (items.some((x) => x.includes(e.unless))) { say("done", e, `${p} (append)`); continue; }
      stage(e.doc, p, [...items, e.append]);
      say("append", e, p);
    }
  }
}

const touched = [...new Set([...sets.keys(), ...inserts.keys()])];
console.log(`\n${touched.length} document(s) to patch; ${problems} edit(s) need a hand fix.`);
if (!write) {
  console.log("Dry run. Add --write to apply.");
  process.exit(problems ? 1 : 0);
}
if (!touched.length) process.exit(problems ? 1 : 0);

let tx = client.transaction();
for (const id of touched) {
  tx = tx.patch(id, (p) => {
    let q = p.ifRevisionId(docs.get(id)!._rev);
    const s = sets.get(id);
    if (s) q = q.set(s);
    for (const ins of inserts.get(id) ?? []) q = q.insert("after", ins.at, ins.items);
    return q;
  });
}
const result = await tx.commit();
console.log(`patched ${touched.length} document(s); transaction ${result.transactionId}`);
console.log("The live site updates through the publish webhook. Locally: npm run revalidate --all");
