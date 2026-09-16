/**
 * The industry page (sheets 20–28): one applier, per-sheet options.
 *
 * An industry document keeps its sections as typed blocks; the frontmatter
 * validates with industrySchema and each block with its own schema.
 * Section numbering is the same on every sheet: 01 hero, 02 components,
 * 03 applications, 04 conditions, 05 custom engineering, 06 quality,
 * 07 export lane, 08 FAQ, 09 enquiries.
 */

import { z } from "zod";
import { industrySchema } from "../../src/content/schemas/index.ts";
import { parseBlock, stripNullsDeep } from "../../src/content/blocks.ts";
import { applyDocument, client, field, heading, lit, litHref, loadSheet, paragraph, paragraphs, rows, section } from "./lib.mts";
import type { Section } from "./lib.mts";
import { arrowLink } from "./category.mts";
import { PRODUCTS } from "../../src/content/routes.ts";
import { IMAGES } from "../../src/content/images.ts";

export const industryDocSchema = z.preprocess(
  (raw) => stripNullsDeep(raw),
  industrySchema.passthrough().superRefine((doc, ctx) => {
    const sections = (doc as { sections?: unknown[] }).sections ?? [];
    sections.forEach((b, i) => {
      const r = parseBlock(b, i);
      if (!r.ok) ctx.addIssue({ code: "custom", path: ["sections", i], message: r.error });
    });
  }),
);

/** "View ISO Certificate ›" and its two neighbours: the sheets' own fallback while no PDF exists. */
const QUALITY_LINKS: Record<string, { label: string; href: string }> = {
  "View ISO Certificate": { label: "Request ISO Certificate", href: "/contact?request=iso" },
  "Download Quality Policy": { label: "Request Quality Policy", href: "/contact?request=quality-policy" },
  "All Certifications": { label: "All Certifications", href: "/certifications" },
};

export type IndustryOptions = {
  stem: string;
  id: string;
  /** The component card the sheet writes bullets for ("AV mounts card — bullets"). */
  bulletsFor: string;
  /** Nine sheets, four condition icons each; the existing icons stay by index. */
};

const has = (sec: Section, label: string) =>
  sec.fields.some((f) => f.label.toLowerCase().startsWith(label.toLowerCase()));
/**
 * The category a card links to. A card written "— no product page exists"
 * (Diaphragms, sheets 23–24) resolves by name through the route registry,
 * which sends the click to the contact form until the page is built.
 */
const slugOf = (name: string, href: string) => {
  const m = href.match(/^\/products\/([a-z0-9-]+)$/);
  if (m) return m[1];
  const entry = PRODUCTS.find((p) => p.label.toLowerCase() === name.toLowerCase());
  if (!entry) throw new Error(`not a product href and no registry entry: ${name} → ${href}`);
  return entry.slug;
};
const imageFor = (slug: string, fallback: string) => {
  const key = `products.${slug === "sponge-foam-rubber" ? "sponge-foam" : slug}.hero`;
  return key in IMAGES ? key : fallback;
};

export async function applyIndustry(o: IndustryOptions): Promise<void> {
  // An "Eyebrow · H2" composite (sheets 27–28) or the two fields (20–26).
  const eyebrowAndH2 = (sec: Section, prefix: string) => {
    const both = sec.fields.find((f) => f.label.startsWith("Eyebrow · H2"));
    if (both?.kind === "composite") {
      const l = both.parts.find((p) => p.kind === "lit");
      const h = both.parts.find((p) => p.kind === "heading");
      if (l?.kind === "lit") patch[`${prefix}.eyebrow`] = E(l.value);
      if (h?.kind === "heading") patch[`${prefix}.heading`] = E(h.lines.join(" "));
      return;
    }
    if (has(sec, "Eyebrow")) patch[`${prefix}.eyebrow`] = E(lit(sec, "Eyebrow"));
    if (has(sec, "H2")) patch[`${prefix}.heading`] = E(heading(sec, "H2").value);
  };
  const sheet = loadSheet(o.stem);
  const s = (n: string) => section(sheet, n);
  const expect: string[] = [];
  const E = (v: string) => (expect.push(v.replace(/\*\*/g, "")), v);
  const current = (await client.fetch(`*[_id == $id][0]`, { id: o.id })) as { sections: Record<string, unknown>[] };
  const block = <T = Record<string, unknown>,>(key: string): T => {
    const b = current.sections.find((x) => x._key === key);
    if (!b) throw new Error(`${o.id}: no block ${key}`);
    return b as T;
  };
  const patch: Record<string, unknown> = {
    "seo.title": sheet.head.title,
    "seo.description": sheet.head.description,
    confirmWithMargo: [],
  };

  /* 01 Hero */
  const hero = s("01");
  const h1 = heading(hero, "H1");
  patch.badge = E(lit(hero, "Eyebrow"));
  patch.h1 = h1.lines.map((l) => E(l)).join(" ");
  patch.h1Lines = h1.lines;
  patch.h1AccentLines = h1.lines.map((l, i) => (h1.accent.includes(l) ? i : -1)).filter((i) => i >= 0);
  patch.intro = E(paragraph(hero, "Subhead"));
  const cta1 = litHref(hero, "CTA 1");
  const cta2 = litHref(hero, "CTA 2");
  patch.actions = [
    { label: E(cta1.label), href: cta1.href, variant: "primary" },
    { label: E(cta2.label), href: cta2.href, variant: "secondary" },
  ];

  /* 02 Components we supply */
  const comp = s("02");
  const cp = 'sections[_key=="components"]';
  if (has(comp, "Eyebrow")) patch[`${cp}.eyebrow`] = E(lit(comp, "Eyebrow"));
  patch[`${cp}.heading`] = E(heading(comp, "H2").value);
  patch[`${cp}.body`] = E(paragraph(comp, "Intro"));
  const cardCta = lit(comp, "Card CTA").match(/^(.*?)\s*›\s*\/products\/\{slug\}$/);
  if (!cardCta) throw new Error(`${o.stem}: card CTA pattern`);
  // The bullets the sheet writes, for one card: a Bullet | Replaces table
  // (sheets 21–28) or a literal beside the instruction (sheet 20).
  const bulletsField = comp.fields.find((f) => /card — bullets|Card body/.test(f.label));
  const bullets =
    bulletsField?.kind === "table"
      ? bulletsField.rows.map((r) => r[0])
      : bulletsField?.kind === "paragraphs"
        ? (bulletsField.lits?.[0] ?? "").split("\n")
        : [];
  if (!bullets.length) throw new Error(`${o.stem}: no bullets`);
  const cards = rows(comp, "Cards");
  if (!cards.some((r) => r[0] === o.bulletsFor)) throw new Error(`${o.stem}: no card "${o.bulletsFor}"`);
  const oldImages = (block<{ items?: { image?: string }[] }>("components").items ?? []).map((it) => it.image ?? "");
  patch[`${cp}.items`] = cards.map((r, i) => {
    const slug = slugOf(r[0], r[2]);
    return {
      key: r[0],
      name: E(r[0]),
      body: E(r[1]),
      bullets: r[0] === o.bulletsFor ? bullets.map((b) => E(b)) : [],
      // The linked category's own photograph, not a sector stock image; a
      // category without one keeps the page's own slot.
      image: imageFor(slug, oldImages[i] || oldImages[0]),
      cta: { label: E(cardCta[1].replace("{Component}", r[0])), href: `/products/${slug}` },
    };
  });
  patch["related.products"] = cards.map((r) => slugOf(r[0], r[2]));

  /* 03 Where components are used */
  const app = s("03");
  const ap = 'sections[_key=="applications"]';
  if (has(app, "Eyebrow")) patch[`${ap}.eyebrow`] = E(lit(app, "Eyebrow"));
  patch[`${ap}.heading`] = E(heading(app, "H2").value);
  patch[`${ap}.items`] = rows(app, "Groups").map((r) => ({ name: E(r[0]), body: E(r[1]) }));

  /* 04 Built for … conditions */
  const con = s("04");
  const np = 'sections[_key=="conditions"]';
  const oldIcons = (block<{ items: { icon: string }[] }>("conditions").items ?? []).map((it) => it.icon);
  if (has(con, "Eyebrow")) patch[`${np}.eyebrow`] = E(lit(con, "Eyebrow"));
  patch[`${np}.heading`] = E(heading(con, "H2").value);
  patch[`${np}.body`] = E(paragraph(con, "Intro"));
  const condRows = has(con, "Cards")
    ? rows(con, "Cards").map((r) => [r[0], r[1]])
    : // Sheets 27–28: "Card 1 — Title" fields, each one paragraph.
      con.fields
        .filter((f) => /^Card \d/.test(f.label) && f.kind === "paragraphs")
        .map((f) => [f.label.replace(/^Card \d+ — /, ""), (f as { paragraphs: string[] }).paragraphs[0]]);
  patch[`${np}.items`] = condRows.map((r, i) => ({ icon: oldIcons[i] ?? "shield", name: E(r[0]), body: E(r[1]) }));

  /* 05 Custom engineering */
  const cus = s("05");
  const up = 'sections[_key=="custom"]';
  if (has(cus, "Eyebrow")) patch[`${up}.eyebrow`] = E(lit(cus, "Eyebrow"));
  patch[`${up}.heading`] = E(heading(cus, "H2").value);
  patch[`${up}.body`] = E(paragraph(cus, has(cus, "Intro") ? "Intro" : "Body"));
  const bul = cus.fields.find((f) => f.label.startsWith("Bullets"))!;
  patch[`${up}.bullets`] = (bul.kind === "table" ? bul.rows.map((r) => r[0]) : bul.kind === "lit" ? bul.value.split("\n") : []).map((b) => E(b));
  const ccta = litHref(cus, "CTA");
  patch[`${up}.cta`] = { label: E(ccta.label), href: ccta.href };
  const [locTitle, locNote] = lit(cus, has(cus, "Location panel") ? "Location panel" : "Side card").split("\n");
  patch[`${up}.imageCaption`] = { title: E(locTitle), note: E(locNote) };

  /* 06 Quality & certification */
  const qa = s("06");
  const qp = 'sections[_key=="quality"]';
  eyebrowAndH2(qa, qp);
  patch[`${qp}.body`] = E(paragraph(qa, has(qa, "Intro") ? "Intro" : "Body"));
  if (has(qa, "Cards")) {
    const qcards = field(qa, "Cards", "table");
    patch[`${qp}.items`] = qcards.rows.map((r) =>
      // Card | Sub-head | Body, or Card | Body. The card label is the chip
      // when there is a sub-head to be the name; the name otherwise.
      r.length === 3 ? { chip: E(r[0]), name: E(r[1]), body: E(r[2]) } : { chip: "", name: E(r[0]), body: E(r[1]) },
    );
  } else {
    // Sheets 27–28: "Card N" — a body paragraph with "chip\nname" set beside it.
    patch[`${qp}.items`] = qa.fields
      .filter((f) => /^Card \d/.test(f.label) && f.kind === "paragraphs")
      .map((f) => {
        // Bold in these sheets highlights a figure for the reader of the
        // sheet; the card carries plain text.
        const p = f as { paragraphs: string[]; lits?: string[] };
        const [chip, name] = (p.lits?.[0] ?? "").split("\n");
        return { chip: E(chip), name: E(name), body: E(p.paragraphs[0]) };
      });
  }
  if (has(qa, "Links")) {
    patch[`${qp}.links`] = rows(qa, "Links").map((r) => {
      const key = r[0].replace(/\s*›\s*$/, "");
      const link = QUALITY_LINKS[key];
      if (!link) throw new Error(`${o.stem}: unknown quality link "${key}"`);
      return { label: E(link.label), href: link.href };
    });
  } else {
    // Button | Live | Ships as — a button "Remove[d] until the PDF exists" is dropped.
    patch[`${qp}.links`] = rows(qa, "Buttons")
      .filter((r) => !/^Remove/i.test(r[2]))
      .map((r) => ({ label: E(r[0]), href: /^\[no change\]/.test(r[2]) ? r[1] : r[2] }));
  }

  /* 07 Export lane */
  const ex = s("07");
  const xp = 'sections[_key=="exportLane"]';
  const oldCard = block<{ card?: { title: string; subtitle: string } }>("exportLane").card;
  if (has(ex, "Eyebrow")) patch[`${xp}.eyebrow`] = E(lit(ex, "Eyebrow"));
  patch[`${xp}.heading`] = E(heading(ex, "H2").value);
  patch[`${xp}.paragraphs`] = paragraphs(ex, "Body").map((p) => E(p));
  patch[`${xp}.rows`] = rows(ex, has(ex, "Export facts") ? "Export facts" : "Info blocks").map((r) => ({ label: E(r[0]), value: E(r[1]) }));
  // "India → Australia · Direct OEM supply chain from Nashik, Maharashtra" then the
  // markets; sheet 20 has a Supply modes table and a closing line instead.
  const markets = ex.fields.find((f) => /^(States|Countries|Markets|Market list)/.test(f.label));
  let title = oldCard?.title ?? "";
  let subtitle = oldCard?.subtitle ?? "";
  let regions: string[];
  if (markets?.kind === "lit") {
    // "Title · Subtitle" then the list (sheets 21–26), or title, subtitle
    // and list on three lines (sheets 27–28).
    const lines = markets.value.split("\n");
    if (lines.length === 3) [title, subtitle] = [E(lines[0]), E(lines[1])];
    else {
      const m = lines[0].match(/^(.*?) · (.*)$/);
      if (m) [title, subtitle] = [E(m[1]), E(m[2])];
    }
    regions = lines[lines.length - 1].split(" · ").map((x) => E(x));
  } else regions = rows(ex, "Supply modes").map((r) => E(r[0]));
  const note = ex.fields.find((f) => / note$|^Closing line$/.test(f.label));
  const footnote =
    note?.kind === "paragraphs" ? note.paragraphs[0] : note?.kind === "lit" ? note.value.replace(/\n/g, " ") : undefined;
  if (!footnote) throw new Error(`${o.stem}: no export note`);
  patch[`${xp}.card`] = { title, subtitle, regions, footnote: E(footnote) };

  /* 08 FAQ */
  const faq = s("08");
  const fp = 'sections[_key=="faqs"]';
  eyebrowAndH2(faq, fp);
  patch.faqs = faq.fields
    .filter((f) => /^Q\d/.test(f.label))
    .map((f) => {
      if (f.kind === "composite") {
        const h = f.parts.find((p) => p.kind === "heading");
        const p = f.parts.find((p) => p.kind === "para");
        if (h?.kind !== "heading" || p?.kind !== "para") throw new Error(`${o.stem}: ${f.label} shape`);
        return { q: E(h.lines.join(" ")), a: E(p.text) };
      }
      if (f.kind === "paragraphs" && f.lits?.[0]) {
        // Sheets 27–28: the answer paragraph with the question set beside it.
        return { q: E(f.lits[0]), a: E(f.paragraphs[0]) };
      }
      throw new Error(`${o.stem}: ${f.label} shape`);
    });

  /* 09 Enquiries */
  const enq = s("09");
  const zp = 'sections[_key=="closing"]';
  if (has(enq, "Eyebrow")) patch[`${zp}.eyebrow`] = E(lit(enq, "Eyebrow"));
  const h2 = heading(enq, "H2");
  patch[`${zp}.lines`] = h2.lines.map((l) => E(l));
  patch[`${zp}.body`] = E(paragraph(enq, "Body"));
  const buttons = enq.fields.find((f) => f.label.startsWith("Buttons"))!;
  const links =
    buttons.kind === "lit"
      ? buttons.value.split("\n").map(arrowLink)
      : buttons.kind === "table"
        ? // Button | Live | Ships as — "[no change]" keeps the live button.
          buttons.rows.map((r) => arrowLink(/^\[no change\]/.test(r[2]) ? r[1] : r[2]))
        : [];
  patch[`${zp}.actions`] = links.map((l, i) => ({ label: E(l.label), href: l.href, variant: i ? "secondary" : "primary" }));

  await applyDocument({ id: o.id, type: "industry", schema: industryDocSchema, patch, expect });
}
