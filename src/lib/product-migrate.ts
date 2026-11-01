import type { Block } from "../content/blocks.ts";
import type { ProductCategory } from "../content/schemas/index.ts";
import { toBlocks } from "./product-blocks.ts";
import { toIndustryBlocks } from "./industry-blocks.ts";
import type { Industry, Legal, Resource, Sku } from "../content/schemas/index.ts";

/**
 * .MDX FILE → SANITY DOCUMENT
 *
 * The migration writer. Takes a validated category page and produces the exact
 * JSON to be written into the dataset.
 *
 * It is a pure function, deliberately: it does no network calls and holds no
 * token, so it can be exercised by `check:blocks` on every run without
 * touching the live dataset. The script that DOES hold the token is a thin
 * wrapper around it, which keeps the risky part small enough to read.
 *
 * Two shapes differ from what the page renders, and both are Sanity's
 * constraints rather than choices:
 *
 *  · Every array member needs a `_key`. Sanity uses it to diff arrays; without
 *    one, two editors reordering the same list produce a mess rather than a
 *    conflict.
 *  · An array cannot contain another array, so a spec-table row becomes an
 *    object holding its cells. The GROQ projection unwraps it on the way out.
 */

/** Deterministic, so re-running the migration updates rather than duplicates. */
export const categoryDocId = (slug: string) => `productCategory-${slug}`;

/**
 * Keys must be stable across runs for the same reason the id is: a second run
 * should be a no-op, not a rewrite of every array. Derived from position,
 * which is fixed for content coming out of a file.
 */
const keyed = (items: unknown[], prefix: string) =>
  items.map((item, i) =>
    item && typeof item === "object" && !Array.isArray(item)
      ? { ...(item as object), _key: `${prefix}_${i}` }
      : item,
  );

export function toSanityBlock(block: Block): Record<string, unknown> {
  const out: Record<string, unknown> = { ...block };

  if (block._type === "block.specTable" && Array.isArray(block.rows)) {
    out.rows = (block.rows as string[][]).map((cells, i) => ({
      _key: `row_${i}`,
      cells,
    }));
  }

  // The parts grid carries only its copy. The parts themselves stay on the
  // document, where the redirect map also reads them, and the projection
  // re-joins the two. Storing both would let them disagree.
  if (block._type === "block.partsGrid") {
    delete out.parts;
    delete out.categoryLabel;
    delete out.categorySlug;
  }

  for (const [k, v] of Object.entries(out)) {
    if (k === "rows") continue;
    if (Array.isArray(v) && v.some((x) => x && typeof x === "object")) {
      out[k] = keyed(v, k);
    }
  }

  return out;
}

/** Nested objects also carry arrays — comparison panels, sub-category options. */
function deepKey(value: unknown, path = "k"): unknown {
  if (Array.isArray(value)) {
    return value.map((item, i) => {
      const keyedItem = deepKey(item, `${path}_${i}`);
      return keyedItem && typeof keyedItem === "object" && !Array.isArray(keyedItem)
        ? { _key: `${path}_${i}`, ...(keyedItem as object) }
        : keyedItem;
    });
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([k, v]) => [
        k,
        // `rows` on a spec-table block is already keyed by toSanityBlock.
        deepKey(v, `${path}_${k}`),
      ]),
    );
  }
  return value;
}

export type CategoryDocument = Record<string, unknown> & {
  _id: string;
  _type: "productCategory";
};

export function toSanityDocument(
  fm: ProductCategory,
  slug: string,
): CategoryDocument {
  const sections = toBlocks(fm, slug).map(toSanityBlock).map((b) => {
    // Block-level keys are set by toBlocks; everything nested below still
    // needs them. The FAQ block keeps its headings only; the projection joins
    // the document's questions back in, as on industry pages.
    const out = { ...b } as Record<string, unknown>;
    if (out._type === "block.industryFaq") delete out.items;
    const { _key, _type, ...rest } = out;
    return { _key, _type, ...(deepKey(rest, String(_key)) as object) };
  });

  return {
    _id: categoryDocId(slug),
    _type: "productCategory",
    slug: { _type: "slug", current: slug },
    status: fm.status,
    navLabel: fm.navLabel,
    h1: fm.h1,
    ...(fm.h1Accent ? { h1Accent: fm.h1Accent } : {}),
    intro: fm.intro,
    ...(fm.hero ? { hero: fm.hero } : {}),
    heroStats: keyed(fm.heroStats, "heroStat"),
    heroStatsAlign: fm.heroStatsAlign,
    ...(fm.heroLink ? { heroLink: fm.heroLink } : {}),
    heroActions: keyed(fm.heroActions, "heroAction"),
    heroBreadcrumb: fm.heroBreadcrumb,
    ...(fm.heroEyebrow ? { heroEyebrow: fm.heroEyebrow } : {}),
    ...(fm.heroChips.length ? { heroChips: fm.heroChips } : {}),
    ...(fm.service ? { service: fm.service } : {}),
    ...(fm.schemaProduct ? { schemaProduct: fm.schemaProduct } : {}),
    anchors: keyed(fm.anchors, "anchor"),
    faqs: keyed(fm.faqs, "faq"),
    confirmWithMargo: fm.confirmWithMargo,
    related: fm.related,
    seo: {
      title: fm.seo.title,
      description: fm.seo.description,
      ...(fm.seo.keywords
        ? {
            primaryKeyword: fm.seo.keywords.primary,
            secondaryKeywords: fm.seo.keywords.secondary,
          }
        : {}),
    },
    sections,
  };
}


/* ── Industries ───────────────────────────────────────────────────────────── */

export const industryDocId = (slug: string) => `industry-${slug}`;

/**
 * The industry equivalent. Shares `toSanityBlock` and `deepKey` — the two
 * pieces that encode Sanity's storage constraints — and differs only in which
 * document fields it carries.
 *
 * `faqs` are written to the DOCUMENT and stripped from the FAQ block, mirroring
 * what the projection does on the way back out. The block keeps its headings.
 */
export function toIndustryDocument(
  fm: Industry,
  slug: string,
): Record<string, unknown> & { _id: string; _type: "industry" } {
  const sections = toIndustryBlocks(fm)
    .map(toSanityBlock)
    .map((b) => {
      const out = { ...b };
      if (out._type === "block.industryFaq") delete out.items;
      const { _key, _type, ...rest } = out as Record<string, unknown>;
      return { _key, _type, ...(deepKey(rest, String(_key)) as object) };
    });

  return {
    _id: industryDocId(slug),
    _type: "industry",
    slug: { _type: "slug", current: slug },
    status: fm.status,
    navLabel: fm.navLabel,
    tier: fm.tier,
    badge: fm.badge,
    h1: fm.h1,
    h1Lines: fm.h1Lines,
    h1AccentLines: fm.h1AccentLines,
    intro: fm.intro,
    ...(fm.hero ? { hero: fm.hero } : {}),
    heroBoost: fm.heroBoost,
    ...(fm.heroChips.length ? { heroChips: fm.heroChips } : {}),
    ...(fm.schemaService ? { schemaService: fm.schemaService } : {}),
    actions: keyed(fm.actions, "action"),
    faqs: keyed(fm.faqs, "faq"),
    nonClaims: fm.nonClaims,
    confirmWithMargo: fm.confirmWithMargo,
    related: fm.related,
    seo: {
      title: fm.seo.title,
      description: fm.seo.description,
      ...(fm.seo.keywords
        ? {
            primaryKeyword: fm.seo.keywords.primary,
            secondaryKeywords: fm.seo.keywords.secondary,
          }
        : {}),
    },
    sections,
  };
}


/* ── Catalogue parts ──────────────────────────────────────────────────────── */

export const skuDocId = (slug: string) => `sku-${slug}`;

/**
 * The simplest of the three writers: a SKU is fixed structure, so there are no
 * blocks and nothing to reorder — the fields go across as they are.
 *
 * The one reshaping is `compoundProperties`, a map in the content file and a
 * list of pairs in Sanity because Sanity has no map type. Rebuilt on read by
 * `validateSkuDocument`; taken apart here.
 */
export function toSkuDocument(
  fm: Sku,
  slug: string,
): Record<string, unknown> & { _id: string; _type: "sku" } {
  const compoundProperties = Object.entries(fm.compoundProperties ?? {}).map(
    ([code, values], i) => ({ _key: `compound_${i}`, code, values }),
  );

  return {
    _id: skuDocId(slug),
    _type: "sku",
    slug: { _type: "slug", current: slug },
    status: fm.status,
    category: fm.category,
    navLabel: fm.navLabel,
    h1: fm.h1,
    ...(fm.eyebrow ? { eyebrow: fm.eyebrow } : {}),
    intro: fm.intro,
    ...(fm.productCode ? { productCode: fm.productCode } : {}),
    ...(fm.stockLabel ? { stockLabel: fm.stockLabel } : {}),
    gallery: {
      ...(fm.gallery.main ? { main: fm.gallery.main } : {}),
      thumbs: fm.gallery.thumbs,
      overlay: keyed(fm.gallery.overlay, "overlay"),
    },
    quickSpecs: keyed(fm.quickSpecs, "quickSpec"),
    ...(fm.order ? { order: fm.order } : {}),
    assurances: fm.assurances,
    ...(fm.dimensional
      ? { dimensional: { ...fm.dimensional, tiles: keyed(fm.dimensional.tiles, "tile") } }
      : {}),
    specs: keyed(fm.specs, "spec"),
    compounds: fm.compounds,
    compoundProperties,
    advantages: keyed(fm.advantages, "advantage"),
    applications: keyed(fm.applications, "application"),
    process: keyed(fm.process, "step"),
    ...(fm.quality
      ? {
          quality: {
            ...fm.quality,
            certificates: keyed(fm.quality.certificates, "certificate"),
            metrics: keyed(fm.quality.metrics, "metric"),
          },
        }
      : {}),
    downloads: keyed(fm.downloads, "download"),
    faqs: keyed(fm.faqs, "faq"),
    // The per-part fields the sheets added after the first migration (and the
    // Oct 2026 parts use). The router's rows are stored as objects holding
    // their cells, as on the spec table; the projection unwraps them.
    ...(fm.compoundRouter
      ? {
          compoundRouter: {
            columns: fm.compoundRouter.columns,
            rows: fm.compoundRouter.rows.map((cells, i) => ({ _type: "row", _key: `row-${i + 1}`, cells })),
          },
        }
      : {}),
    ...(fm.compoundPrompt ? { compoundPrompt: fm.compoundPrompt } : {}),
    ...(fm.qualityChip ? { qualityChip: fm.qualityChip } : {}),
    ...(fm.documentation ? { documentation: fm.documentation } : {}),
    ...(fm.ctaBody ? { ctaBody: fm.ctaBody } : {}),
    ...(fm.advantagesHeading ? { advantagesHeading: fm.advantagesHeading } : {}),
    relatedParts: keyed(fm.relatedParts, "relatedPart"),
    confirmWithMargo: fm.confirmWithMargo,
    related: fm.related,
    seo: {
      title: fm.seo.title,
      description: fm.seo.description,
      ...(fm.seo.keywords
        ? {
            primaryKeyword: fm.seo.keywords.primary,
            secondaryKeywords: fm.seo.keywords.secondary,
          }
        : {}),
    },
  };
}


/* ── Guides ───────────────────────────────────────────────────────────────── */

export const resourceDocId = (slug: string) => `resource-${slug}`;

/**
 * The guides carry no body, and that is not an omission.
 *
 * All eight .mdx files are frontmatter and a comment explaining that the
 * article itself has to be written by someone with the material engineering to
 * write it. So this migrates the card metadata and leaves `body` unset, which
 * is exactly the state the page already renders as "this guide is being
 * written".
 *
 * The point of moving them at all is that the empty body is now a rich-text
 * field in Studio rather than an empty .mdx file in a git repository — which
 * is the difference between a guide that can be written and one that cannot.
 */
export function toResourceDocument(
  fm: Resource,
  slug: string,
): Record<string, unknown> & { _id: string; _type: "resource" } {
  return {
    _id: resourceDocId(slug),
    _type: "resource",
    slug: { _type: "slug", current: slug },
    status: fm.status,
    navLabel: fm.navLabel,
    category: fm.category,
    ...(fm.icon ? { icon: fm.icon } : {}),
    featured: fm.featured,
    readingMinutes: fm.readingMinutes,
    h1: fm.h1,
    intro: fm.intro,
    faqs: keyed(fm.faqs, "faq"),
    confirmWithMargo: fm.confirmWithMargo,
    related: fm.related,
    seo: {
      title: fm.seo.title,
      description: fm.seo.description,
      ...(fm.seo.keywords
        ? {
            primaryKeyword: fm.seo.keywords.primary,
            secondaryKeywords: fm.seo.keywords.secondary,
          }
        : {}),
    },
  };
}


/* ── One-off marketing pages ──────────────────────────────────────────────── */

/**
 * These need no per-page writer.
 *
 * Every one of them is fixed structure with no block list, no joined
 * collection and no array nested inside an array — so the frontmatter IS the
 * document, give or take a `_key` on each array member and Sanity's slug
 * wrapper. One generic function replaces what would have been twelve nearly
 * identical ones.
 *
 * `deepKey` does the rest: it walks the whole object adding keys wherever
 * Sanity needs them, which is the only structural difference between what the
 * .mdx file holds and what the content lake wants.
 */
export function toPageDocument(
  fm: Record<string, unknown>,
  slug: string,
  type: string,
): Record<string, unknown> & { _id: string } {
  // The .mdx slug is a plain string; Sanity wants its own slug object, so the
  // incoming one is dropped rather than carried through as a stray field.
  const rest = Object.fromEntries(
    Object.entries(fm).filter(([k]) => k !== "slug"),
  );

  return {
    _id: `${type}-${slug}`,
    _type: type,
    slug: { _type: "slug", current: slug },
    ...(deepKey(rest, slug) as object),
  };
}


/* ── Legal pages ──────────────────────────────────────────────────────────── */

export const legalDocId = (slug: string) => `legal-${slug}`;

/**
 * The legal pages, and the one place a content file and its stored form
 * genuinely disagree.
 *
 * A block in the .mdx file is a single-key object — `{ p: "…" }`, `{ ul: […] }`
 * — which is how a human writes it and impossible to express in Sanity, where
 * an object needs fixed named fields. Stored, it becomes a `kind` plus either
 * `text` or `items`, and the reader turns it back.
 *
 * This writer did not exist until now: the first legal page was migrated by
 * hand during the spike that proved the CMS pattern, and a hand-migrated
 * document is one nobody can reproduce. It also meant the page could not be
 * restored from its source file — which mattered, because a test edit made
 * during that spike ("Testing") had overwritten the opening paragraph of the
 * live privacy policy and stayed there.
 */
export function toLegalDocument(
  fm: Legal,
  slug: string,
): Record<string, unknown> & { _id: string; _type: "legal" } {
  const sections = fm.sections.map((section: Legal["sections"][number], si: number) => ({
    _key: `section_${si}`,
    _type: "legalSection",
    // A SLUG OBJECT, not a string: the projection reads `id.current`, and a
    // bare string makes it undefined — which fails validation and drops the
    // page back to its .mdx file while looking entirely fine.
    id: { _type: "slug", current: section.id },
    title: section.title,
    ...(section.navLabel ? { navLabel: section.navLabel } : {}),
    icon: section.icon,
    blocks: section.blocks.map((block: Legal["sections"][number]["blocks"][number], bi: number) => {
      const key = `section_${si}_block_${bi}`;
      if ("ul" in block) {
        return { _key: key, _type: "legalBlock", kind: "ul", items: block.ul };
      }
      const kind = "p" in block ? "p" : "h" in block ? "h" : "note";
      const text =
        "p" in block ? block.p : "h" in block ? block.h : (block as { note: string }).note;
      return { _key: key, _type: "legalBlock", kind, text };
    }),
  }));

  return {
    _id: legalDocId(slug),
    _type: "legal",
    slug: { _type: "slug", current: slug },
    status: fm.status,
    // The document field is `title`; the schema and the page call it `h1`.
    // The GROQ projection maps it back on the way out.
    title: fm.h1,
    badge: fm.badge,
    intro: fm.intro,
    ...(fm.lastUpdated ? { lastUpdated: fm.lastUpdated } : {}),
    seo: {
      title: fm.seo.title,
      description: fm.seo.description,
      ...(fm.seo.keywords
        ? {
            primaryKeyword: fm.seo.keywords.primary,
            secondaryKeywords: fm.seo.keywords.secondary,
          }
        : {}),
    },
    sections,
  };
}
