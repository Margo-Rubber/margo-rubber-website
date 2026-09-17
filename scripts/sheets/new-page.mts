/**
 * The six NEW PAGE sheets (36–39 categories, 41–42 industries): one applier
 * each, driven by a per-sheet plan.
 *
 * These sheets are written against the universal blocks rather than the
 * fixed section set of the older pages — a card grid, a reference table, a
 * compound router (one table, every row in the DOM), prose panels, the
 * shared certification block, six questions and the closing band. Each
 * sheet says which component to build each section from; the plan below
 * records that reading, section by section, so the document is assembled
 * in the sheet's order with the sheet's strings.
 *
 * A page that does not exist yet is created (`createIfNotExists`) with the
 * slug and a placeholder status, then patched exactly as an existing one.
 *
 * Inline links the notes ask for on a phrase — "metering and dosing pumps"
 * → /industries/pumps-valves — are written `[phrase](href)` into the same
 * string; the page turns the markers into links and strips them from the
 * structured data. `link()` throws if the phrase is not in the sheet's
 * text, so a rewritten sentence cannot silently lose its link.
 */

import { applyDocument, client, field, forbidden, heading, lit, loadSheet, section } from "./lib.mts";
import type { Field, Section } from "./lib.mts";
import { arrowLink, categorySchema } from "./category.mts";
import { industryDocSchema } from "./industry.mts";
import { industryBySlug, productBySlug } from "../../src/content/routes.ts";

const WRITE = process.argv.includes("--write");

/* ── Block plans ────────────────────────────────────────────────────────── */

type Link = [phrase: string, href: string];

type Plan =
  /** Cards ×N — Card | Body | Typical use (note) or Links to (href). */
  | { kind: "cards"; num: string; key: string; label?: string; noteLabel?: string; group?: string; links?: Link[]; hrefFor?: (row: string[]) => string | undefined; noHeader?: boolean }
  /** A reference table with the section's intro, footnote and closing paragraph. */
  | { kind: "table"; num: string; key: string; label: string; body?: string; footnote?: string; closing?: string; links?: Link[]; compounds?: boolean }
  /** "If the parts … | You need | Goes to" — sheet 39 §02. */
  | { kind: "router"; num: string; key: string; label: string }
  /** Prose panels behind headings, plus a closing note. */
  | { kind: "accordion"; num: string; key: string; panels: string[]; closing?: string; links?: Link[] }
  /** A heading and paragraphs, by field index (sheet 38 §07 carries two versions). */
  | { kind: "prose"; num: string; key: string; h2Index: number; paragraphIndexes: number[]; links?: Link[] }
  | { kind: "certification"; num: string }
  | { kind: "faq"; num: string }
  | { kind: "cta"; num: string };

type NewPage = {
  stem: string;
  id: string;
  slug: string;
  type: "productCategory" | "industry";
  navLabel: string;
  plan: Plan[];
  /** Links inside the hero subhead. */
  heroLinks?: Link[];
  /** Links inside a FAQ answer, by question label. */
  faqLinks?: Record<string, Link[]>;
  related?: { products?: string[]; industries?: string[] };
  /** Category pages: the Product node (sheet, page-level). */
  schemaProduct?: { name: string; description: string; material: string[] };
  /** Industry pages: the Service node (sheet, page-level). */
  schemaService?: { name: string; description: string };
  /** Category pages: what a fitted line does not include (sheet 38 §07). */
  service?: { exclusionsHeading: string; exclusions: string[] };
  tier?: 1 | 2 | 3;
};

/* ── Helpers ────────────────────────────────────────────────────────────── */

/** The compound anchors on /products, by the name a router table writes. */
const COMPOUND_ANCHOR: Record<string, string> = {
  EPDM: "epdm",
  NBR: "nbr",
  FKM: "fkm",
  AEM: "aem",
  Neoprene: "neoprene",
  "Natural rubber": "natural-rubber",
  SBR: "sbr",
  Silicone: "silicone",
};

const STOP = /🛑\s*/g;
const CTA_LINE = /^\[\s*(.*?)\s*→\s*(\S+?)\s*\]$/;

const has = (sec: Section, label: string) => sec.fields.some((f) => f.label.toLowerCase().startsWith(label.toLowerCase()));

/** Mark one phrase as a link; the phrase must be in the text as the sheet wrote it. */
function link(text: string, links: Link[] | undefined, where: string): string {
  let out = text;
  for (const [phrase, href] of links ?? []) {
    if (!out.includes(phrase)) throw new Error(`${where}: no "${phrase}" to link`);
    out = out.replace(phrase, `[${phrase}](${href})`);
  }
  return out;
}

const marked = (f: Field, where: string): string[] => {
  if (f.kind !== "paragraphs") throw new Error(`${where}: not paragraphs`);
  return f.marked;
};

export async function applyNewPage(o: NewPage): Promise<void> {
  const sheet = loadSheet(o.stem);
  const s = (n: string) => section(sheet, n);
  const expect: string[] = [];
  /** What the page must show: the string without its markers and without the sheet's own glyph. */
  const E = <T extends string | undefined>(v: T): T => {
    if (typeof v === "string") {
      const plain = v.replace(STOP, "").replace(/\*\*/g, "").replace(/\[([^\]]+)\]\((?:\/|#|https?:)[^)\s]+\)/g, "$1");
      for (const line of plain.split("\n")) if (line.trim()) expect.push(line.trim());
      return v.replace(STOP, "") as T;
    }
    return v;
  };
  const cells = (rows: string[][], links?: Link[], where = "") =>
    rows.map((r) => r.map((c) => E(links ? link(c, links.filter(([p]) => c.includes(p)), where) : c)));

  const patch: Record<string, unknown> = {
    "seo.title": sheet.head.title,
    "seo.description": sheet.head.description,
    navLabel: o.navLabel,
    confirmWithMargo: [],
  };
  const sections: Record<string, unknown>[] = [];
  const faqs: { q: string; a: string }[] = [];

  /* ── 01 Hero — the same five fields on all six sheets ──────────────── */
  const hero = s("01");
  const h1 = heading(hero, "H1");
  const subhead = link(marked(field(hero, "Subhead", "paragraphs"), `${o.stem} subhead`)[0], o.heroLinks, `${o.stem} subhead`);
  const chips = field(hero, "Spec chips", "table").rows.map((r) => E(r[0]));
  const ctaSlot = lit(hero, "CTA slot").match(CTA_LINE);
  if (!ctaSlot) throw new Error(`${o.stem}: CTA slot`);
  patch.h1 = h1.lines.map((l) => E(l)).join(" ");
  patch.intro = E(subhead);
  if (o.type === "productCategory") {
    patch.h1Accent = h1.accent[0];
    patch.heroEyebrow = E(lit(hero, "Eyebrow"));
    patch.heroChips = chips;
    patch.heroLink = { label: E(ctaSlot[1]), href: ctaSlot[2] };
    patch.heroBreadcrumb = true;
    patch.heroActions = [];
    patch.heroStats = [];
    patch.schemaProduct = o.schemaProduct;
    patch.related = { products: o.related?.products ?? [], industries: o.related?.industries ?? [], resources: [] };
    patch.anchors = [];
    if (o.service) patch.service = { area: [], ...o.service };
  } else {
    patch.badge = E(lit(hero, "Eyebrow"));
    patch.h1Lines = h1.lines;
    patch.h1AccentLines = h1.lines.map((l, i) => (h1.accent.includes(l) ? i : -1)).filter((i) => i >= 0);
    patch.heroChips = chips;
    patch.actions = [{ label: E(ctaSlot[1]), href: ctaSlot[2], variant: "primary" }];
    patch.tier = o.tier ?? 3;
    patch.related = { products: o.related?.products ?? [], industries: o.related?.industries ?? [], resources: [] };
    patch.nonClaims = [];
    patch.schemaService = o.schemaService;
  }

  /* ── The sections, in the sheet's order ────────────────────────────── */
  for (const p of o.plan) {
    const sec = s(p.num);
    const meta = (withHeading = true) => ({
      ...(has(sec, "Eyebrow") ? { eyebrow: E(lit(sec, "Eyebrow")) } : {}),
      ...(withHeading && has(sec, "H2") ? { heading: E(heading(sec, "H2").value) } : {}),
      ...(has(sec, "Intro") ? { body: E(marked(field(sec, "Intro", "paragraphs"), `${o.stem} §${p.num} intro`)[0]) } : {}),
    });

    switch (p.kind) {
      case "cards": {
        const t = field(sec, p.label ?? "Cards", "table");
        const where = `${o.stem} §${p.num}`;
        const items = t.rows.map((r) => {
          const href = p.hrefFor?.(r);
          const item: Record<string, unknown> = {
            name: E(r[0]),
            body: E(link(r[1], p.links?.filter(([ph]) => r[1].includes(ph)), where)),
          };
          if (p.noteLabel) item.note = E(link(r[2], p.links?.filter(([ph]) => r[2].includes(ph)), where));
          if (href) item.href = href;
          return item;
        });
        sections.push({
          _type: "block.cardGrid",
          _key: p.key,
          id: p.key,
          layout: "plain",
          ...(p.noHeader ? {} : meta()),
          ...(p.noteLabel ? { noteLabel: p.noteLabel } : {}),
          ...(p.group ? { group: E(p.group) } : {}),
          items,
        });
        break;
      }
      case "table": {
        const t = field(sec, p.label, "table");
        const where = `${o.stem} §${p.num}`;
        // Every compound name in the router links once to its panel on /products.
        const rows = p.compounds
          ? t.rows.map((r) => {
              const anchor = COMPOUND_ANCHOR[r[1]];
              if (!anchor) throw new Error(`${where}: no /products anchor for "${r[1]}"`);
              return [r[0], `[${r[1]}](/products#${anchor})`, ...r.slice(2)];
            })
          : t.rows;
        const para = (label: string | undefined) =>
          label ? E(link(marked(field(sec, label, "paragraphs"), `${where} ${label}`).join("\n"), p.links?.filter(([ph]) => marked(field(sec, label, "paragraphs"), "").join("\n").includes(ph)), where)) : undefined;
        sections.push({
          _type: "block.specTable",
          _key: p.key,
          id: p.key,
          ...meta(),
          ...(p.body ? { body: para(p.body) } : {}),
          controls: false,
          columns: t.columns.map((c) => E(c)),
          rows: cells(rows, p.links, where).map((c) => ({ cells: c })),
          ...(p.footnote ? { footnote: para(p.footnote) } : {}),
          ...(p.closing ? { closing: para(p.closing) } : {}),
        });
        break;
      }
      case "router": {
        const t = field(sec, p.label, "table");
        sections.push({
          _type: "block.routerList",
          _key: p.key,
          id: p.key,
          ...(has(sec, "Eyebrow") ? { eyebrow: E(lit(sec, "Eyebrow")) } : {}),
          heading: E(heading(sec, "H2").value),
          intro: E(marked(field(sec, "Intro", "paragraphs"), `${o.stem} §${p.num}`)[0]),
          rows: t.rows.map((r) => {
            // "this page ↓" points down the page to the types grid.
            const href = /^\//.test(r[2]) ? r[2] : r[2].startsWith("this page") ? "#types" : undefined;
            return { condition: E(r[0]), need: E(r[1]), ...(href ? { href } : {}) };
          }),
        });
        break;
      }
      case "accordion": {
        const where = `${o.stem} §${p.num}`;
        const panels = p.panels.map((label) => {
          const f = sec.fields.find((x) => x.label === label);
          if (!f) throw new Error(`${where}: no panel "${label}"`);
          const title = label.replace(/^Panel \d+ — /, "");
          const body = marked(f, where).join("\n");
          return { title: E(title), body: E(link(body, p.links?.filter(([ph]) => body.includes(ph)), where)) };
        });
        const closing = p.closing ? marked(field(sec, p.closing, "paragraphs"), where).join("\n") : undefined;
        sections.push({
          _type: "block.accordion",
          _key: p.key,
          id: p.key,
          ...(has(sec, "Eyebrow") ? { eyebrow: E(lit(sec, "Eyebrow")) } : {}),
          heading: E(heading(sec, "H2").value),
          ...(has(sec, "Intro") ? { intro: E(marked(field(sec, "Intro", "paragraphs"), where)[0]) } : {}),
          panels,
          ...(closing ? { closing: E(link(closing, p.links?.filter(([ph]) => closing.includes(ph)), where)) } : {}),
        });
        break;
      }
      case "prose": {
        const where = `${o.stem} §${p.num}`;
        const h = sec.fields[p.h2Index];
        if (h?.kind !== "heading") throw new Error(`${where}: field ${p.h2Index} is not the H2`);
        let n = 0;
        const content = p.paragraphIndexes.flatMap((i) =>
          marked(sec.fields[i], where).map((text) => {
            const withLinks = E(link(text, p.links?.filter(([ph]) => text.includes(ph)), where));
            // Bold runs become strong spans, as the article bodies do; a
            // linked phrase becomes a span with a link annotation.
            const markDefs: { _type: "link"; _key: string; href: string }[] = [];
            const children: { _type: "span"; _key: string; text: string; marks: string[] }[] = [];
            let k = 0;
            for (const [j, part] of withLinks.split(/\*\*([^*]+)\*\*/g).entries()) {
              const strong = j % 2 ? ["strong"] : [];
              let last = 0;
              for (const m of part.matchAll(/\[([^\]]+)\]\(((?:\/|#|https?:)[^)\s]+)\)/g)) {
                if (m.index > last) children.push({ _type: "span", _key: `${p.key}-s${n}-${k++}`, text: part.slice(last, m.index), marks: strong });
                const def = { _type: "link" as const, _key: `${p.key}-l${n}-${k}`, href: m[2] };
                markDefs.push(def);
                children.push({ _type: "span", _key: `${p.key}-s${n}-${k++}`, text: m[1], marks: [...strong, def._key] });
                last = m.index + m[0].length;
              }
              if (last < part.length) children.push({ _type: "span", _key: `${p.key}-s${n}-${k++}`, text: part.slice(last), marks: strong });
            }
            return { _type: "block", _key: `${p.key}-${n++}`, style: "normal", markDefs, children: children.filter((c) => c.text) };
          }),
        );
        sections.push({ _type: "block.richText", _key: p.key, id: p.key, heading: E(h.value), content });
        break;
      }
      case "certification": {
        // The lines are Site settings'; the sheet's block is checked against them.
        for (const line of lit(sec, "Certification block").split("\n")) E(line);
        sections.push({ _type: "block.certificationStrip", _key: "certification", id: "certification" });
        break;
      }
      case "faq": {
        for (const f of sec.fields.filter((x) => /^Q\d/.test(x.label))) {
          if (f.kind !== "composite") throw new Error(`${o.stem}: ${f.label} shape`);
          const q = f.parts.find((x) => x.kind === "heading");
          const a = f.parts.find((x) => x.kind === "para");
          if (q?.kind !== "heading" || a?.kind !== "para") throw new Error(`${o.stem}: ${f.label} shape`);
          faqs.push({ q: E(q.lines.join(" ")), a: E(link(a.text, o.faqLinks?.[f.label], `${o.stem} ${f.label}`)) });
        }
        sections.push({ _type: "block.industryFaq", _key: "faqs", heading: E(sec.title) });
        break;
      }
      case "cta": {
        const buttons = lit(sec, "Buttons").split("\n").map((l) => {
          const m = l.match(CTA_LINE);
          if (!m) return arrowLink(l);
          return { label: m[1], href: m[2] };
        });
        const body = E(marked(field(sec, "Body", "paragraphs"), `${o.stem} §${p.num}`).join(" "));
        if (o.type === "productCategory") {
          sections.push({
            _type: "block.ctaBand",
            _key: "cta",
            eyebrow: E(lit(sec, "Eyebrow")),
            heading: E(heading(sec, "H2").value),
            body,
            primary: { label: E(buttons[0].label), href: buttons[0].href },
            secondary: { label: E(buttons[1].label), href: buttons[1].href },
            chips: [],
          });
        } else {
          const h2 = heading(sec, "H2");
          sections.push({
            _type: "block.closingBand",
            _key: "closing",
            eyebrow: E(lit(sec, "Eyebrow")),
            lines: h2.lines.map((l) => E(l)),
            body,
            actions: buttons.map((b, i) => ({ label: E(b.label), href: b.href, variant: i ? "secondary" : "primary" })),
          });
        }
        break;
      }
    }
  }

  patch.faqs = faqs;
  patch.sections = sections;

  if (WRITE) {
    await client.createIfNotExists({
      _id: o.id,
      _type: o.type,
      slug: { _type: "slug", current: o.slug },
      status: "placeholder",
      h1: patch.h1,
    });
  } else if (!(await client.fetch(`defined(*[_id == $id][0])`, { id: o.id }))) {
    // A dry run against a page that does not exist yet: validate the patch as
    // the created document would be.
    console.log(`\n══ ${o.id} (dry run — would be created)`);
    const doc = { _id: o.id, _type: o.type, slug: o.slug, status: "placeholder", ...patch };
    const schema = o.type === "productCategory" ? categorySchema : industryDocSchema;
    const flat = Object.fromEntries(Object.entries(doc).filter(([k]) => !k.includes(".")));
    (flat as Record<string, unknown>).seo = { title: sheet.head.title, description: sheet.head.description };
    const parsed = schema.safeParse(flat);
    if (!parsed.success) {
      for (const i of parsed.error.issues) console.error(`     ${i.path.join(".")}: ${i.message}`);
      process.exit(1);
    }
    const claims = forbidden(patch);
    if (claims.length) {
      console.error(`  ✗  ${o.id}: the patch carries forbidden claims:`);
      for (const c of claims) console.error(`     ${c}`);
      process.exit(1);
    }
    console.log(`  ${sections.length} sections, ${faqs.length} questions, ${expect.length} strings — valid.`);
    return;
  }

  const schema = o.type === "productCategory" ? categorySchema : industryDocSchema;
  await applyDocument({ id: o.id, type: o.type, schema, patch, expect });
}

/** A card's "Links to" cell → an href: a product or industry page, or the enquiry form. */
export function linksTo(cell: string, fallback?: string): string | undefined {
  const m = cell.match(/^\/(products|industries)\/([a-z0-9-]+)$/);
  if (m) {
    const entry = m[1] === "products" ? productBySlug(m[2]) : industryBySlug(m[2]);
    if (!entry) throw new Error(`"Links to" names a page the registry does not have: ${cell}`);
    return entry.path;
  }
  if (/enquire/i.test(cell)) return fallback;
  return undefined;
}
