import { z } from "zod";

/**
 * CONTENT SCHEMAS — every content file is validated against one of these at
 * build time. A missing or malformed field fails the build loudly instead of
 * shipping an empty <h1> or a half-populated spec table.
 */

/** Drives noindex + sitemap exclusion. Placeholder content never gets indexed. */
export const statusSchema = z
  .enum(["placeholder", "draft", "published"])
  .default("placeholder");

/** An image reference is a REGISTRY KEY, never a file path. See content/images.ts. */
export const imageRefSchema = z.string().min(1);

/** Meta lengths are enforced, not suggested — the briefs specify exact budgets. */
// Ceilings are the content sheets' own longest values (70 / 217), not the
// SERP display widths — Google truncates, it does not reject.
const seoSchema = z.object({
  title: z.string().min(10).max(70),
  description: z.string().min(50).max(220),
  keywords: z
    .object({
      primary: z.string().min(3),
      secondary: z.array(z.string()).default([]),
    })
    .optional(),
});

/**
 * Every numbered section on a page carries its own eyebrow + heading, so a
 * section is never split between frontmatter data and an orphan heading in
 * the MDX body.
 */
const sectionMeta = z.object({
  /** The section id, from the Studio "Anchor" field — "#skirting" (sheet 38 §05). */
  id: z.string().regex(/^[a-z0-9-]+$/).optional(),
  /** e.g. "02 — SPECIFICATION REFERENCE" */
  eyebrow: z.string().min(2),
  heading: z.string().min(4),
  /** Optional lede paragraph under the heading. */
  body: z.string().optional(),
});

/** Reusable spec table. Every row must have the same arity as `columns`. */
export const specTableSchema = z
  .object({
    caption: z.string().optional(),
    columns: z.array(z.string()).min(2),
    rows: z.array(z.array(z.string())).min(1),
    footnote: z.string().optional(),
  })
  .refine((t) => t.rows.every((r) => r.length === t.columns.length), {
    message: "Every spec-table row must have exactly as many cells as there are columns",
  });

/** Feeds both the on-page FAQ and the FAQPage JSON-LD. */
export const faqSchema = z.object({
  q: z.string().min(8),
  /** 40–60 words is the AEO answer budget — long enough to be citable,
   *  short enough to be extracted. Enforced as a soft character range. */
  a: z.string().min(40).max(700),
});

/** The internal-linking model as data, not hardcoded JSX. */
export const relatedSchema = z
  .object({
    products: z.array(z.string()).default([]),
    industries: z.array(z.string()).default([]),
    resources: z.array(z.string()).default([]),
    /** Any other page, with the anchor text the sheet gives it — "/certifications — ISO 9001:2015 certification". */
    pages: z.array(z.object({ label: z.string(), href: z.string() })).default([]),
  })
  .default({ products: [], industries: [], resources: [], pages: [] });

/** Named on-page section that a SKU anchor resolves to. */
/**
 * A photograph uploaded straight to Sanity (not a registry key), as the
 * category query projects it: the asset is dereferenced to its URL and
 * intrinsic size, so next/image can reserve the space before it loads.
 * Every part is optional — an empty field, or an asset deleted from the
 * media library, arrives as null, is stripped, and nothing renders.
 */
export const cmsImageSchema = z.object({
  alt: z.string().optional(),
  caption: z.string().optional(),
  /** Studio hotspot, 0–1 from the top-left. Used as the crop focus. */
  hotspot: z.object({ x: z.number(), y: z.number() }).passthrough().optional(),
  asset: z
    .object({
      url: z.string().url(),
      w: z.number().positive(),
      h: z.number().positive(),
      lqip: z.string().optional(),
    })
    .optional()
    // A reference the query did not dereference (a page type whose query
    // has no photo projection) is dropped here, not allowed to fail the page.
    .catch(undefined),
});
export type CmsImage = z.infer<typeof cmsImageSchema>;

export const anchorSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/, "anchor ids are lowercase-kebab"),
  label: z.string().min(2),
  /** Legacy URL this anchor is the 301 target for, if any. */
  legacyUrl: z.string().optional(),
});

const baseSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  status: statusSchema,
  h1: z.string().min(8),
  /**
   * The trailing portion of the H1 rendered in accent colour on line 2
   * ("Precision" / "O-Rings"). Defaults to the last word, which is wrong for
   * headings ending in "& Something" — set it explicitly there.
   */
  h1Accent: z.string().optional(),
  seo: seoSchema,
  hero: z
    .object({ image: imageRefSchema, alt: z.string().min(10) })
    .optional(),
  /** Marks values still awaiting Margo sign-off. Surfaced in the build report. */
  confirmWithMargo: z.array(z.string()).default([]),
});

/**
 * A grid of cards, each a short code or label with a one-line explanation.
 *
 * Introduced by the two category comps in UI-changes2/, which both use this
 * same shape twice: once for a catalogue of sections or variants, and once
 * for the sectors those parts are specified into. `code` is optional because
 * the sectors grid has no part numbers.
 */
export const cardGridSchema = z.object({
  items: z
    .array(
      z.object({
        /** Fragment target. The mega-dropdown deep-links to these, so an id
         *  here must match the href in navigation.ts. */
        id: z
          .string()
          .regex(/^[a-z0-9-]+$/, "card ids are lowercase-kebab")
          .optional(),
        code: z.string().optional(),
        name: z.string().min(2),
        body: z.string().min(10),
        /** Key into the stroked icon set — see components/ui/Icon.tsx. */
        icon: z.string().optional(),
        /** Key into the cross-section drawings, for the profile library. */
        shape: z.string().optional(),
        /** Where the card's link goes — a sector's industry page (sheet 18 §07). */
        href: z.string().optional(),
        /** A third line under the body — "Typical use" or the compound (sheets 36–42). */
        note: z.string().optional(),
        /** The sub-product's own photo, uploaded in Studio. */
        image: cmsImageSchema.optional(),
      }),
    )
    .min(1),
  /** One photo of the cards' parts together, shown above the cards. */
  groupPhoto: cmsImageSchema.optional(),
  /** What the cards' `note` is — set once for the grid, e.g. "Typical use". */
  noteLabel: z.string().optional(),
  /**
   * A grid that is one half of a section: "Rail" and "Marine" under one
   * heading (sheet 42 §03). Rendered as an <h3> over the cards, whose own
   * titles step down to <h4>.
   */
  group: z.string().optional(),
  /**
   * The link on every card: "Quote this section" (→ /contact?profile=CODE)
   * on the profile library; "Rubber components for {sector}" on the
   * sectors grid, where `{sector}` is the card's name. Nothing links
   * while empty.
   */
  cardCta: z.string().optional(),
});

/* ------------------------------------------------------------------ */

/* ── PRODUCT-CATEGORY SECTIONS ────────────────────────────────────────────
 *
 * Exported one by one rather than left inline, because each is now TWO things:
 * a named field on the category page, and a member of the block union in
 * src/content/blocks.ts. Declaring them once means a rule added here — a new
 * required field, a tighter minimum — reaches both the .mdx files and the CMS
 * without anyone remembering to change a second copy.
 * ──────────────────────────────────────────────────────────────────────── */


/**
 * Every numbered section on the page is a self-describing block: it owns
 * its own eyebrow and heading. Nothing is an orphan heading in the MDX
 * body — the body is reserved for genuine long-form prose (which this
 * page type has none of; the resource articles are where it earns its keep).
 */
export const specSectionSchema = z
  .object({
    ...sectionMeta.shape,
    /** A table written under an H2 alone (sheet 41 §05) has no eyebrow. */
    eyebrow: z.string().min(2).optional(),
    caption: z.string().optional(),
    /** Filter chips + search. Off for short reference tables. */
    controls: z.boolean().default(true),
    /** The standards a chip can select, in order; else those found in the table. */
    chips: z.array(z.string()).optional(),
    searchPlaceholder: z.string().optional(),
    columns: z.array(z.string()).min(2),
    rows: z.array(z.array(z.string())).min(1),
    footnote: z.string().optional(),
    /** A paragraph after the table, at body size — "Ships with every consignment" (sheet 36 §06). */
    closing: z.string().optional(),
  })
  .refine((t) => t.rows.every((r) => r.length === t.columns.length), {
    message: "Every spec-table row must have exactly as many cells as there are columns",
  });


/** Section 03 — the expandable material cards. */
export const materialSectionSchema = z
  .object({
    ...sectionMeta.shape,
    items: z
      .array(
        z.object({
          code: z.string(),
          name: z.string(),
          tempRange: z.string(),
          hardness: z.string(),
          summary: z.string().min(20),
          image: imageRefSchema.optional(),
        }),
      )
      .min(1),
    /** Trade-mark attribution under the cards: "Viton® is a trade mark of…" */
    footnote: z.string().optional(),
  });


/** Section 04 — AEO answer block + the standards cards. */
export const standardsSectionSchema = z
  .object({
    ...sectionMeta.shape,
    /** The 40–60 word direct answer rendered before elaboration. */
    answer: z.string().min(40),
    items: z
      .array(z.object({ code: z.string(), name: z.string(), body: z.string().min(20) }))
      .default([]),
    /** One line after the cards, e.g. the link to the size chart (sheet 09 §05). */
    closing: z.string().optional(),
    closingLink: z.object({ label: z.string(), href: z.string() }).optional(),
  });


/**
 * Quality assurance, as the new comps draw it: the claim and a testimonial
 * on the left, the test standards and documentation package on the right.
 * Distinct from `standardsSection`, which is the older AEO answer block.
 */
export const qualitySectionSchema = z
  .object({
    ...sectionMeta.shape,
    /** Required — this layout has no version without supporting copy. */
    body: z.string().min(20),
    quote: z
      .object({
        text: z.string().min(20),
        author: z.string().min(2),
        org: z.string().min(2),
        initials: z.string().min(1).max(3),
      })
      .optional(),
    badges: z
      .array(z.object({ label: z.string(), icon: z.string().optional() }))
      .default([]),
    standards: z
      .array(
        z.object({
          name: z.string().min(3),
          code: z.string().min(2),
          /** "Per batch, before despatch" / "Per compound, at qualification" (sheet 18 §06). */
          group: z.string().optional(),
        }),
      )
      .min(1),
    docPackage: z
      .object({ title: z.string().min(4), body: z.string().min(20) })
      .optional(),
  });


/** Section 05 — commercial terms. */
export const commercialSectionSchema = z
  .object({
    ...sectionMeta.shape,
    rows: z
      .array(z.object({ label: z.string(), value: z.string(), note: z.string().optional() }))
      .min(1),
  });


/**
 * Catalogue of the sections, profiles or variants this category is made in.
 * The extrusion comp's profile library; the nine tiles with EXT- codes.
 */
export const profileSectionSchema = z
  .object({
    ...sectionMeta.shape,
    /** The second of two grouped grids (sheet 42 §03 "Marine") sits under the first's heading, without eyebrow or heading of its own. */
    eyebrow: z.string().min(2).optional(),
    heading: z.string().min(4).optional(),
    ...cardGridSchema.shape,
  });


/** How the part is made, in ordered stages. Numbered in the render, so the
 *  order of `steps` is the order shown — this is a real sequence. */
export const processSectionSchema = z
  .object({
    ...sectionMeta.shape,
    steps: z
      .array(
        z.object({
          name: z.string().min(3),
          body: z.string().min(20),
          icon: z.string().optional(),
        }),
      )
      .min(2),
  });


/**
 * The "specify in four lines" block: the handful of parameters that fully
 * define a part, each with the value format expected.
 */
export const specifySectionSchema = z
  .object({
    ...sectionMeta.shape,
    items: z
      .array(
        z.object({
          label: z.string().min(3),
          /** The example or range, set beside the label. */
          value: z.string().min(1),
          body: z.string().min(20),
          icon: z.string().optional(),
        }),
      )
      .min(2),
    /** "Have all four? Send them with your section drawing." + a button (sheet 18 §05). */
    closing: z.string().optional(),
    closingLink: z.object({ label: z.string(), href: z.string() }).optional(),
  });


/** Where these parts end up. Same card shape as `profileSection`. */
export const sectorsSectionSchema = z
  .object({ ...sectionMeta.shape, ...cardGridSchema.shape });


/**
 * Two structures set against each other, each with its own property list.
 * The Sponge & Foam comp opens with closed cell vs open cell, which is the
 * first decision a foam buyer makes.
 */
export const compareSectionSchema = z
  .object({
    ...sectionMeta.shape,
    panels: z
      .array(
        z.object({
          label: z.string().min(2),
          caption: z.string().min(3),
          /** Which cell diagram to draw — see CellDiagram. */
          diagram: z.enum(["closed", "open"]),
          rows: z
            .array(z.object({ label: z.string(), value: z.string() }))
            .min(1),
        }),
      )
      .length(2),
  });


/**
 * The compound selector: a tab per elastomer family, a detail panel for the
 * selected one, and the full table beneath. The table repeats the panel
 * content on purpose — the panel is for choosing, the table for comparing.
 */
export const compoundSectionSchema = z
  .object({
    ...sectionMeta.shape,
    items: z
      .array(
        z.object({
          code: z.string().min(1),
          fullName: z.string().min(4),
          hardness: z.string().min(2),
          tempRange: z.string().min(2),
          applications: z.string().min(10),
        }),
      )
      .min(2),
  });


/** A single property presented as a range, with a pull quote beside it. */
export const densitySectionSchema = z
  .object({
    ...sectionMeta.shape,
    scale: z.object({
      min: z.string(),
      max: z.string(),
      unit: z.string(),
      lowLabel: z.string(),
      lowNote: z.string(),
      highLabel: z.string(),
      highNote: z.string(),
    }),
    quote: z.object({ text: z.string().min(20), author: z.string().min(2), org: z.string().optional() }),
    bands: z
      .array(z.object({ range: z.string(), note: z.string() }))
      .min(2),
  });


/**
 * A product that lives inside this category rather than beside it — the
 * self-adhesive tape under Sponge & Foam. It gets its own heading block and
 * its own comparisons, but not its own route.
 */
export const subCategorySectionSchema = z
  .object({
    ...sectionMeta.shape,
    /** Fragment target — the mega-dropdown links straight to this block. */
    id: z.string().regex(/^[a-z0-9-]+$/).optional(),
    dividerLabel: z.string().optional(),
    /** The product itself (e.g. a roll of the tape), uploaded in Studio. */
    photo: cmsImageSchema.optional(),
    buildUp: z
      .object({ label: z.string(), layers: z.array(z.string()).min(2) })
      .optional(),
    comparisons: z
      .array(
        z.object({
          label: z.string().min(3),
          items: z
            .array(
              z.object({
                name: z.string().min(3),
                /** Shown as a pill beside the name. */
                tag: z.string().optional(),
                /** label/value pairs, or bare points when value is unset. */
                rows: z
                  .array(
                    z.object({
                      label: z.string(),
                      value: z.string().optional(),
                      /** Renders as a caveat rather than a benefit. */
                      caveat: z.boolean().default(false),
                    }),
                  )
                  .min(1),
              }),
            )
            .min(2),
        }),
      )
      .default([]),
    note: z.object({ title: z.string(), body: z.string().min(20) }).optional(),
  });


/** Photographed applications, each tagged with the compound used. */
export const applicationsSectionSchema = z
  .object({
    ...sectionMeta.shape,
    items: z
      .array(
        z.object({
          tag: z.string().min(2),
          name: z.string().min(3),
          body: z.string().min(10),
          image: imageRefSchema.optional(),
        }),
      )
      .min(1),
  });


/** Section 06 — closing enquiry band. */
export const ctaSchema = z
  .object({
    ...sectionMeta.shape,
    /** Required here — a CTA band with no supporting copy is never correct. */
    body: z.string().min(20),
    primary: z.object({ label: z.string(), href: z.string() }),
    secondary: z.object({ label: z.string(), href: z.string() }).optional(),
    /** Small facts set above the buttons — MOQ, sample qty, turnaround.
     *  Their presence is what switches the closing band to the new comps'
     *  centred, corner-bracketed panel. */
    chips: z
      .array(z.object({ label: z.string(), icon: z.string().optional() }))
      .default([]),
  });

export const productCategorySchema = baseSchema.extend({
  /** Short label for cards, nav and breadcrumbs. */
  navLabel: z.string().min(2),
  intro: z.string().min(40),
  /** Hero stat row — the "AS568 · ISO · JIS · DIN / ±0.08 mm / …" strip. */
  heroStats: z
    .array(z.object({ value: z.string(), label: z.string() }))
    .default([]),
  /**
   * Optional deep link in the hero, beneath the intro.
   *
   * This used to be hardcoded in the route as "View O-Ring Size Chart", which
   * meant every category page carried it — Bellows and Gaskets included. It
   * belongs to the one category that has a size chart, so it lives here.
   */
  heroLink: z.object({ label: z.string(), href: z.string() }).optional(),
  /** Breadcrumb above the H1 — "Products › Sponge & Foam Rubber". */
  heroBreadcrumb: z.boolean().default(false),
  /**
   * The line above the H1 where a sheet writes its own — "01 · DIAPHRAGMS"
   * (sheets 36–39). The eleven older pages show the certification badge.
   */
  heroEyebrow: z.string().optional(),
  /** Three uppercase chips under the subhead — "8 COMPOUNDS IN-HOUSE" (sheets 36–42). */
  heroChips: z.array(z.string()).default([]),
  /** The nine older pages centre nothing; Extrusion centres its stat panel,
   *  Sponge & Foam sets the same panel left. */
  heroStatsAlign: z.enum(["left", "center"]).default("center"),
  /** Hero buttons. Only the UI-changes2 comps open with these. */
  heroActions: z
    .array(
      z.object({
        label: z.string(),
        href: z.string(),
        variant: z.enum(["primary", "secondary"]).default("primary"),
      }),
    )
    .default([]),
  specSection: specSectionSchema.optional(),

  materialSection: materialSectionSchema.optional(),

  standardsSection: standardsSectionSchema.optional(),

  qualitySection: qualitySectionSchema.optional(),

  commercialSection: commercialSectionSchema.optional(),

  profileSection: profileSectionSchema.optional(),

  processSection: processSectionSchema.optional(),

  specifySection: specifySectionSchema.optional(),

  sectorsSection: sectorsSectionSchema.optional(),

  compareSection: compareSectionSchema.optional(),

  compoundSection: compoundSectionSchema.optional(),

  densitySection: densitySectionSchema.optional(),

  subCategorySection: subCategorySectionSchema.optional(),

  applicationsSection: applicationsSectionSchema.optional(),

  cta: ctaSchema.optional(),

  anchors: z.array(anchorSchema).default([]),
  faqs: z.array(faqSchema).default([]),
  related: relatedSchema,
  /** JSON-LD types emitted for this page. */
  /** Sheet 38 §07: what the line covers and what it does not. Nothing renders while empty. */
  service: z
    .object({
      heading: z.string().optional(),
      area: z.array(z.string()).default([]),
      exclusionsHeading: z.string().optional(),
      exclusions: z.array(z.string()).default([]),
    })
    .optional(),
  schemaTypes: z
    .array(z.enum(["Product", "BreadcrumbList", "FAQPage", "HowTo", "Organization", "WebSite"]))
    .default(["Product", "BreadcrumbList", "FAQPage"]),
  /**
   * The Product node's own name and description, where the sheet writes them
   * apart from the H1 and meta description — "Precision O-Rings" against an
   * H1 of "Precision O-Rings, Manufactured in India" (sheet 09, page-level).
   */
  schemaProduct: z
    .object({
      name: z.string().min(3).optional(),
      description: z.string().min(20).optional(),
      /** Full `material` list when it is not exactly the eight compounds. */
      material: z.array(z.string()).optional(),
      /** Named catalogue components → an ItemList node (sheet 16, page-level). */
      components: z.array(z.string()).optional(),
      /** The list's name and the fragment it points at — "Catalogue components" at #specifications by default. */
      componentsName: z.string().optional(),
      componentsAnchor: z.string().optional(),
    })
    .optional(),
});

/* ── INDUSTRY SECTIONS ─────────────────────────────────────────────────────
 *
 * Same reason as the product-category sections above: each is both a named
 * field on the industry page and a member of the block union.
 * ──────────────────────────────────────────────────────────────────────── */


/** Section 02: the products supplied to this sector, as switchable tabs. */
export const industryComponentsSchema = z
  .object({
    ...sectionMeta.shape,
    items: z.array(
      z.object({
        key: z.string(),
        name: z.string(),
        body: z.string(),
        bullets: z.array(z.string()).default([]),
        image: imageRefSchema,
        cta: z.object({ label: z.string(), href: z.string() }),
      }),
    ),
  });


/** Section 03: where the components end up. */
export const industryApplicationsSchema = z
  .object({
    ...sectionMeta.shape,
    items: z.array(z.object({ name: z.string(), body: z.string(), image: imageRefSchema.optional() })),
  });


/** Section 04: why generic parts fail here. */
export const industryConditionsSchema = z
  .object({
    ...sectionMeta.shape,
    items: z.array(
      z.object({
        icon: z.enum(["shield", "wave", "thermo", "dust"]),
        name: z.string(),
        body: z.string(),
      }),
    ),
  });


/** Section 05: custom engineering split panel. */
export const industryCustomSchema = z
  .object({
    ...sectionMeta.shape,
    bullets: z.array(z.string()).default([]),
    cta: z.object({ label: z.string(), href: z.string() }),
    image: imageRefSchema.optional(),
    imageCaption: z.object({ title: z.string(), note: z.string() }).optional(),
  });


/** Section 06: quality cards + document links. */
export const industryQualitySchema = z
  .object({
    ...sectionMeta.shape,
    items: z.array(z.object({ chip: z.string(), name: z.string(), body: z.string() })),
    links: z.array(z.object({ label: z.string(), href: z.string() })).default([]),
  });


/** Section 07: export lane detail. */
export const industryExportLaneSchema = z
  .object({
    ...sectionMeta.shape,
    paragraphs: z.array(z.string()).default([]),
    rows: z.array(z.object({ label: z.string(), value: z.string() })).default([]),
    card: z
      .object({
        title: z.string(),
        subtitle: z.string(),
        regions: z.array(z.string()).default([]),
        footnote: z.string().optional(),
      })
      .optional(),
  });


/** Section 09: closing CTA band. */
export const industryClosingSchema = z
  .object({
    eyebrow: z.string(),
    lines: z.array(z.string()).min(1),
    accentLines: z.array(z.number()).default([]),
    body: z.string(),
    actions: z.array(z.object({ label: z.string(), href: z.string(), variant: z.enum(["primary", "secondary"]).default("primary") })),
    contacts: z.array(z.object({ icon: z.enum(["phone", "email", "cert"]), text: z.string() })).default([]),
  });

export const industrySchema = baseSchema.extend({
  navLabel: z.string().min(2),
  intro: z.string().min(40),
  tier: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  h1Lines: z.array(z.string()).min(1),
  h1AccentLines: z.array(z.number()).default([]),
  badge: z.string(),
  /** Three uppercase chips under the subhead (sheets 41–42). */
  heroChips: z.array(z.string()).default([]),
  /** True only where the hero source is already faded to black (the mining
   *  crop lifted out of the design PNG). Normal photos must not be boosted. */
  heroBoost: z.boolean().default(false),
  actions: z
    .array(z.object({ label: z.string(), href: z.string(), variant: z.enum(["primary", "secondary"]).default("primary") }))
    .default([]),

  components: industryComponentsSchema.optional(),

  /**
   * The catalogue section at the foot of the page. Text only — the PDF is
   * looked up separately (src/lib/catalogue-file.ts). Every field optional:
   * the page fills gaps with wording built from the industry's name.
   */
  catalogue: z
    .object({
      heading: z.string().optional(),
      body: z.string().optional(),
      bullets: z.array(z.string()).default([]),
      formHeading: z.string().optional(),
      formBody: z.string().optional(),
      submitLabel: z.string().optional(),
      footnote: z.string().optional(),
    })
    .optional(),

  applications: industryApplicationsSchema.optional(),

  conditions: industryConditionsSchema.optional(),

  custom: industryCustomSchema.optional(),

  quality: industryQualitySchema.optional(),

  exportLane: industryExportLaneSchema.optional(),

  faqSection: sectionMeta.partial().optional(),
  faqs: z.array(faqSchema).default([]),

  closing: industryClosingSchema.optional(),

  /** Only the products actually used in this industry — never all nine. */
  related: relatedSchema,
  /** Mandatory verbatim non-claim sentences (e.g. NORSOK/API on oil-gas). */
  nonClaims: z.array(z.string()).default([]),
  /**
   * The Service node's own name and description, where the sheet writes
   * them apart from the H1 and meta description — "Rubber Components for
   * Construction and Infrastructure" (sheet 41, page-level).
   */
  schemaService: z.object({ name: z.string().min(3).optional(), description: z.string().min(20).optional() }).optional(),
  schemaTypes: z
    .array(z.enum(["Product", "BreadcrumbList", "FAQPage", "HowTo", "Organization", "WebSite"]))
    .default(["BreadcrumbList", "FAQPage"]),
});

export const resourceSchema = baseSchema.extend({
  navLabel: z.string().min(2),
  /** "datasheets" is the fourth group the Build Instructions add for sheet 40. */
  category: z.enum(["material-comparison", "sizing-spec", "sourcing-buyer", "datasheets"]),
  /** ISO date the guide was published — the byline and TechArticle.datePublished. */
  publishedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  /** Last edit, from Sanity's record of the document (T17). */
  updatedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  /** Card glyph on the /resources hub. */
  icon: z
    .enum(["flask", "thermometer", "book", "ruler", "wrench", "globe", "clipboard"])
    .default("book"),
  /** Promotes this guide into the hub's "Start here" slot. Exactly one should. */
  featured: z.boolean().default(false),
  /** The shorter blurb the "Start here" card carries (sheet 31 §02); the card list uses `intro`. */
  featuredBlurb: z.string().optional(),
  /** Replaces the "category · read time" line above the heading — "TECHNICAL DATASHEET · SPONGE & FOAM RUBBER" (sheet 40). */
  eyebrow: z.string().optional(),
  /** The article's own opening paragraph (sheet 35); `intro` stays the hub card's blurb (sheet 31). */
  standfirst: z.string().min(40).optional(),
  /** The closing band — an offer and a button (sheet 35, "Closing CTA"). */
  closing: z.object({ body: z.string().min(20), cta: z.object({ label: z.string(), href: z.string() }) }).optional(),
  readingMinutes: z.number().int().positive(),
  intro: z.string().min(40),
  faqs: z.array(faqSchema).default([]),
  related: relatedSchema,
  schemaTypes: z
    .array(z.enum(["Product", "BreadcrumbList", "FAQPage", "HowTo", "Organization", "WebSite"]))
    .default(["FAQPage", "BreadcrumbList"]),
});

/* ------------------------------------------------------------------ */

/** /products hub. Ten sections in the design; each is its own block. */
export const productsHubSchema = baseSchema.extend({
  h1Lines: z.array(z.string()).min(1),
  h1AccentLines: z.array(z.number()).default([]),
  intro: z.string().min(40),
  badge: z.string(),
  actions: z.array(z.object({ label: z.string(), href: z.string(), variant: z.enum(["primary", "secondary"]).default("primary") })).default([]),
  heroStats: z
    .array(
      z.object({
        value: z.string(),
        label: z.string(),
        sub: z.string().optional(),
        icon: z.enum(["award", "globe", "chart", "shield"]).optional(),
      }),
    )
    .default([]),
  heroDivider: z.string().optional(),
  marquee: z.array(z.string()).default([]),

  range: z.object({
    ...sectionMeta.shape,
    watermark: z.string().optional(),
    filters: z.array(z.string()).default([]),
    cards: z.array(
      z.object({
        slug: z.string(),
        title: z.string(),
        kicker: z.string(),
        tag: z.string(),
        chips: z.array(z.string()).default([]),
        image: imageRefSchema,
        span: z.enum(["wide", "tall", "normal"]).default("normal"),
        /** How the category is sold. The comp prints it under every title. */
        unit: z.string().optional(),
        /** Opens a labelled group above this card, as the comp does for the
         *  two continuous-form categories. */
        groupLabel: z.string().optional(),
      }),
    ),
    cta: z.object({ label: z.string(), href: z.string() }).optional(),
  }),

  excellence: z.object({
    ...sectionMeta.shape,
    image: imageRefSchema.optional(),
    imageBadge: z.object({ label: z.string(), value: z.string() }).optional(),
    stats: z.array(z.object({ value: z.string(), label: z.string(), sub: z.string().optional() })).default([]),
  }).optional(),

  process: z.object({
    ...sectionMeta.shape,
    steps: z.array(z.object({ n: z.string(), title: z.string(), body: z.string() })),
    capabilities: z.object({
      heading: z.string(),
      items: z.array(z.string()),
      cta: z.object({ heading: z.string(), body: z.string(), label: z.string(), href: z.string() }).optional(),
    }).optional(),
  }).optional(),

  compounds: z.object({
    ...sectionMeta.shape,
    items: z.array(
      z.object({
        code: z.string(),
        name: z.string(),
        summary: z.string(),
        dot: z.string(),
        temp: z.string(),
        hardness: z.string(),
        bestFor: z.string(),
        tags: z.array(z.string()).default([]),
        applications: z.array(z.string()).default([]),
      }),
    ),
    /** Closing line under the grid, from the comp: a route out for anyone
     *  whose material is not one of the six. */
    cta: z.object({ label: z.string(), href: z.string() }).optional(),
  }).optional(),

  sectors: z.object({
    ...sectionMeta.shape,
    items: z.array(
      z.object({
        name: z.string(),
        body: z.string(),
        image: imageRefSchema.optional(),
        products: z.string(),
        clients: z.string(),
        href: z.string(),
      }),
    ),
  }).optional(),

  certifications: z.object({
    ...sectionMeta.shape,
    /**
     * Unused since the block reads Site settings (one certification record
     * for the whole site); kept optional so an old document still validates.
     */
    items: z.array(
      z.object({
        name: z.string(),
        version: z.string(),
        title: z.string(),
        body: z.string(),
        by: z.string(),
        /** Each certification carries its own colour in the design. */
        color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
        icon: z.enum(["shield", "award", "doc", "star"]),
      }),
    ).optional(),
    /** "Full certification detail, scope and test standards" → /certifications. */
    cta: z.object({ label: z.string(), href: z.string() }).optional(),
  }).optional(),

  validation: z.object({
    ...sectionMeta.shape,
    items: z.array(z.string()),
    /** Sheet 02 §08: two groups — in-house and partner — each a list of
        test → standard pairs. Rendered instead of `items` when present. */
    groups: z
      .array(
        z.object({
          title: z.string(),
          rows: z.array(z.object({ test: z.string(), standard: z.string() })).min(1),
        }),
      )
      .default([]),
    cta: z.object({ label: z.string(), href: z.string() }).optional(),
  }).optional(),

  catalogue: z.object({
    ...sectionMeta.shape,
    bullets: z.array(z.string()).default([]),
    formHeading: z.string(),
    formBody: z.string(),
    submitLabel: z.string(),
    footnote: z.string().optional(),
    /** Catalogue PDF uploaded in Studio — a Sanity file reference. */
    file: z.object({ asset: z.object({ _ref: z.string() }) }).optional(),
  }).optional(),

  /** Closing "Request a Quote" band: contact panel + promise card + form. */
  quote: z
    .object({
      ...sectionMeta.shape,
      contactHeading: z.string(),
      contacts: z.array(
        z.object({
          icon: z.enum(["phone", "email", "address"]),
          label: z.string(),
          value: z.string(),
          note: z.string().optional(),
        }),
      ),
      promiseHeading: z.string(),
      promises: z.array(z.string()),
      fields: z.array(
        z.object({
          /** Stable key. The label is display copy and changes; this is what
           *  /api/enquiry maps to a database column, so it must not. */
          name: z.string(),
          label: z.string(),
          placeholder: z.string(),
          type: z.enum(["text", "email", "tel", "select", "textarea"]).default("text"),
          full: z.boolean().default(false),
        }),
      ),
      submitLabel: z.string(),
      /** The drawing/spec attachment — sheet 02 §11 "Add: file field". Inert until the upload backend exists. */
      attachLabel: z.string().optional(),
      attachHint: z.string().optional(),
    })
    .optional(),

  faqSection: z.object({ ...sectionMeta.shape, cta: z.object({ label: z.string(), href: z.string(), note: z.string() }).optional() }).optional(),
  faqs: z.array(faqSchema).default([]),
  schemaTypes: z.array(z.enum(["Product", "BreadcrumbList", "FAQPage", "HowTo", "Organization", "WebSite"])).default(["BreadcrumbList", "FAQPage"]),
});

/** /industries hub. Five sections in the design. */
export const industriesHubSchema = baseSchema.extend({
  h1Lines: z.array(z.string()).min(1),
  h1AccentLines: z.array(z.number()).default([]),
  badge: z.string(),
  intro: z.string().min(40),
  /** labelVision: the concept-build wording ("Markets Mapped" for "Export Markets"). */
  heroFacts: z
    .array(z.object({ label: z.string(), value: z.string(), labelVision: z.string().optional() }))
    .default([]),

  filter: z.object({
    placeholder: z.string(),
    chips: z.array(z.string()),
  }),

  primary: z.object({
    ...sectionMeta.shape,
    countLabel: z.string(),
    items: z.array(
      z.object({
        slug: z.string(),
        name: z.string(),
        chip: z.string(),
        body: z.string(),
        image: imageRefSchema,
        tags: z.array(z.string()).default([]),
      }),
    ),
  }),

  additional: z.object({
    ...sectionMeta.shape,
    note: z.string(),
    items: z.array(
      z.object({
        name: z.string(),
        body: z.string(),
        href: z.string(),
        linkLabel: z.string().default("Browse product category"),
      }),
    ),
  }),

  enquiry: z.object({
    heading: z.string(),
    body: z.string(),
    points: z.array(z.string()),
    fields: z.array(
      z.object({
        /** Stable key. See the note on the products quote fields. */
        name: z.string(),
        label: z.string(),
        placeholder: z.string(),
        type: z.enum(["text", "email", "select", "textarea"]).default("text"),
        full: z.boolean().default(false),
      }),
    ),
    submitLabel: z.string(),
    footnote: z.string(),
  }),

  schemaTypes: z.array(z.enum(["Product", "BreadcrumbList", "FAQPage", "HowTo", "Organization", "WebSite"])).default(["BreadcrumbList"]),
});

/**
 * /contact — the primary conversion of the site.
 *
 * The form is deliberately 2-step / 8 fields: every competitor RFQ form in the
 * teardown runs 4–8 fields, and single-page forms above 7 fields hit 67.8%
 * abandonment. Step 1 captures enough to follow up if they drop; step 2 carries
 * the qualifying fields a trader is least likely to answer confidently.
 */
export const contactPageSchema = baseSchema.extend({
  h1Lines: z.array(z.string()).min(1),
  h1AccentLines: z.array(z.number()).default([]),
  badge: z.string(),
  intro: z.string().min(40),
  proof: z.array(z.string()).default([]),

  quote: z.object({
    ...sectionMeta.shape,
    note: z.string(),
    facility: z.object({ eyebrow: z.string(), body: z.string() }),
    directHeading: z.string(),
    contacts: z.array(
      z.object({
        icon: z.enum(["whatsapp", "phone", "email"]),
        label: z.string(),
        value: z.string(),
        note: z.string().optional(),
        href: z.string().optional(),
      }),
    ),
    footnote: z.string(),
    steps: z.array(z.string()).length(2),
    step1: z.array(
      z.object({
        name: z.string(),
        label: z.string(),
        placeholder: z.string(),
        type: z.enum(["text", "email", "tel"]).default("text"),
        required: z.boolean().default(true),
      }),
    ),
    step2: z.array(
      z.object({
        name: z.string(),
        label: z.string(),
        placeholder: z.string(),
        type: z.enum(["text", "select", "textarea"]).default("text"),
        options: z.array(z.string()).default([]),
        required: z.boolean().default(true),
        full: z.boolean().default(false),
      }),
    ),
    continueLabel: z.string(),
    backLabel: z.string(),
    submitLabel: z.string(),
    /** Stated directly under submit. No competitor states any response time. */
    responsePromise: z.string(),
    /** The drawing/spec attachment — sheet 04 §02 "Add: file field". Inert until the upload backend exists. */
    attachLabel: z.string().optional(),
    attachHint: z.string().optional(),
    /**
     * The post-submit state — "Enquiry received. A named engineer replies
     * within 48 hours to {email}." (sheets 11–28). `{email}` is the address
     * the buyer gave. A page that asked for something specific restates what
     * is coming back: `confirmations` keys those lines by product-category
     * slug (extrusion, sponge-foam-rubber) and applies when that category is
     * chosen on the form. Without a confirmation the form goes to /thank-you.
     */
    confirmation: z.string().optional(),
    confirmations: z.array(z.object({ product: z.string(), text: z.string() })).default([]),
  }),

  /* ── The five blocks after the form — content sheet 04 §05. Each renders
        only when filled; the address and coordinates come from settings. ── */
  /** Section heading for the address block; the address itself is settings. */
  addressSection: z.object({ eyebrow: z.string(), heading: z.string() }).optional(),
  /** A static map image (never an iframe) that links to Google Maps at the plant's coordinates. */
  map: z.object({ image: imageRefSchema, label: z.string() }).optional(),
  logisticsSection: z.object({ eyebrow: z.string(), heading: z.string() }).optional(),
  logistics: z
    .array(z.object({ destination: z.string(), distance: z.string(), transit: z.string() }))
    .default([]),
  nextStepsSection: z.object({ eyebrow: z.string(), heading: z.string() }).optional(),
  nextSteps: z.array(z.object({ stage: z.string(), timing: z.string() })).default([]),
  faqSection: z.object({ eyebrow: z.string(), heading: z.string() }).optional(),
  faqs: z.array(faqSchema).default([]),

  schemaTypes: z.array(z.enum(["Product", "BreadcrumbList", "FAQPage", "HowTo", "Organization", "WebSite"])).default(["BreadcrumbList"]),
});

/**
 * An uploaded certificate PDF, as the page query projects it
 * (`document{ title, orientation, "asset": asset->{...} }`).
 */
export const certificateDocumentSchema = z.object({
  /** Display name, e.g. "ISO 9001:2015 certificate 09111526A". */
  title: z.string().optional(),
  /** Page orientation, so the preview frame matches the sheet. */
  orientation: z.enum(["portrait", "landscape"]).optional(),
  asset: z
    .object({
      url: z.string().url(),
      originalFilename: z.string().optional(),
      size: z.number().optional(),
      mimeType: z.string().optional(),
      extension: z.string().optional(),
    })
    .optional(),
});
export type CertificateDocument = z.infer<typeof certificateDocumentSchema>;

/**
 * /certifications
 *
 * Brief A11. The "What It Does Not Mean" panel carries the single most
 * important sentence on the site: an explicit statement that Margo holds
 * ISO 9001:2015 and NOT IATF 16949. That reverses the competitor cert-row
 * pattern rather than copying it, and it is the reason this page exists.
 */
export const certificationsPageSchema = baseSchema.extend({
  /** Guides listed before the closing call-to-action; only published ones show. */
  furtherReading: z.array(z.string()).default([]),
  h1Lines: z.array(z.string()).min(1),
  h1AccentLines: z.array(z.number()).default([]),
  badge: z.string(),
  intro: z.string().min(40),
  actions: z.array(z.object({ label: z.string(), href: z.string(), variant: z.enum(["primary", "secondary"]).default("primary") })).default([]),

  /** Sheet 07 §02: "DELETE THIS ENTIRE SECTION". Optional; the page skips it when absent. */
  scope: z.object({
    ...sectionMeta.shape,
    meansHeading: z.string(),
    means: z.array(z.string()),
    notHeading: z.string(),
    /** Rendered in the red panel, first and boldest. */
    notLead: z.string(),
    notLeadBody: z.string(),
    notItems: z.array(z.string()),
    footnote: z.string(),
  }).optional(),

  certificate: z.object({
    ...sectionMeta.shape,
    /**
     * THE CERTIFICATE ITSELF — the PDF uploaded in Studio. When present it is
     * what the page shows (inline preview + open/download); the card below
     * becomes its text transcription. The page query dereferences the asset,
     * so `asset.url` arrives resolved. A deleted or unresolved asset arrives
     * as null, is stripped, and the page falls back to the card.
     */
    document: certificateDocumentSchema.optional(),
    /**
     * Text transcription of the certificate. Every field optional: once the
     * PDF carries the certificate, editors may trim this without the whole
     * document failing validation and silently falling back to the .mdx.
     */
    card: z
      .object({
        eyebrow: z.string(),
        title: z.string(),
        certifyLine: z.string(),
        company: z.string(),
        address: z.string(),
        conformLine: z.string(),
        standard: z.string(),
        scopeLine: z.string(),
        fields: z.array(z.object({ label: z.string(), value: z.string() })),
        barTitle: z.string(),
        barNote: z.string(),
        downloadLabel: z.string(),
        /** LEGACY: a typed-in PDF address. Used only when no file is uploaded. */
        downloadHref: z.string().optional(),
      })
      .partial()
      .optional(),
    meta: z.array(z.object({ label: z.string(), value: z.string() })),
  }),

  facility: z.object({
    ...sectionMeta.shape,
    caption: z.string(),
    gallery: z.array(z.object({ image: imageRefSchema, alt: z.string() })).min(1),
    /** `href`: the page a capability card links out to (sheet 07 §04). */
    capabilities: z.array(z.object({ name: z.string(), body: z.string(), href: z.string().optional() })),
  }),

  system: z.object({
    ...sectionMeta.shape,
    items: z.array(
      z.object({
        icon: z.enum(["inbox", "gauge", "shield", "loop"]),
        name: z.string(),
        body: z.string(),
        /** A stage that links out — final QC to the test standards on /products#testing (sheet 07 §05). */
        href: z.string().optional(),
      }),
    ),
    auditNote: z.object({ lead: z.string(), body: z.string() }),
  }),

  docs: z.object({
    heading: z.string(),
    body: z.string(),
    items: z.array(z.string()),
    fields: z.array(z.object({ name: z.string(), label: z.string(), placeholder: z.string(), type: z.enum(["text", "email", "textarea"]).default("text") })),
    submitLabel: z.string(),
    footnote: z.string(),
    /** The post-submit state — "Received. The documents you selected will follow within one business day to {email}." (sheet 07 §06). */
    confirmation: z.string().optional(),
  }),

  schemaTypes: z.array(z.enum(["Product", "BreadcrumbList", "FAQPage", "HowTo", "Organization", "WebSite"])).default(["BreadcrumbList", "Organization"]),
});

/**
 * /about — brief A12, which marks this page BLOCKED on the founding year.
 *
 * The shell is safe to build; final copy is not, because the design carries
 * fabricated attributions (named executives with stock portraits, a testimonial
 * credited to a named person at Siemens Energy, eight uncorroborated client
 * logos). Those are represented here as neutral placeholders so the layout is
 * complete without asserting anything untrue.
 */
/** Every /about section head is a 1-2 line display heading with an accent line. */
const aboutHead = z.object({
  eyebrow: z.string().min(2),
  lines: z.array(z.string()).min(1),
  accentLines: z.array(z.number()).default([]),
  body: z.string().optional(),
  note: z.string().optional(),
});

export const aboutPageSchema = baseSchema.extend({
  /** Guides listed before the closing call-to-action; only published ones show. */
  furtherReading: z.array(z.string()).default([]),
  h1Lines: z.array(z.string()).min(1),
  h1AccentLines: z.array(z.number()).default([]),
  badge: z.string(),
  intro: z.string().min(40),
  heroImage: imageRefSchema,
  watchLabel: z.string(),
  scrollLabel: z.string(),
  actions: z
    .array(
      z.object({
        label: z.string(),
        href: z.string(),
        variant: z.enum(["primary", "secondary"]).default("primary"),
      }),
    )
    .default([]),
  heroStats: z.array(z.object({ value: z.string(), label: z.string() })).min(1),

  story: aboutHead.extend({
    paragraphs: z.array(z.string()).min(1),
    checks: z.array(z.string()).default([]),
    badge: z.object({ value: z.string(), label: z.string() }),
    images: z.object({
      main: imageRefSchema,
      inset: imageRefSchema,
      lower: imageRefSchema,
    }),
    cta: z.object({ label: z.string(), href: z.string() }),
  }),

  vision: aboutHead.extend({
    watermark: z.string(),
    items: z
      .array(
        z.object({
          icon: z.enum(["target", "bolt"]),
          eyebrow: z.string(),
          title: z.string(),
          body: z.string(),
          footIcon: z.enum(["trend", "shield"]),
          foot: z.string(),
          /** Where the foot line links, if anywhere — the vision foot → /export. */
          footHref: z.string().optional(),
        }),
      )
      .length(2),
  }),

  values: aboutHead.extend({
    items: z
      .array(
        z.object({
          icon: z.enum(["shield", "bolt", "globe", "leaf", "users", "target"]),
          name: z.string(),
          body: z.string(),
        }),
      )
      .min(1),
  }),

  leadership: z.object({
    eyebrow: z.string(),
    image: imageRefSchema,
    quoteLines: z.array(z.string()).min(1),
    /** Index of the first accented WORD run, rendered from `quoteAccent`. */
    quoteAccent: z.string(),
    body: z.string(),
    person: z.object({ initials: z.string(), name: z.string(), role: z.string() }),
  }),

  manufacturing: aboutHead.extend({
    main: z.object({ image: imageRefSchema, caption: z.string() }),
    side: z.array(imageRefSchema).min(1),
    stats: z
      .array(
        z.object({
          icon: z.enum(["area", "lab", "weight"]),
          value: z.string(),
          label: z.string(),
        }),
      )
      .min(1),
    portfolioLabel: z.string(),
    portfolio: z.array(z.object({ label: z.string(), href: z.string() })).min(1),
    /** The plant list — sheet 03 §07. Empty renders nothing. */
    equipmentLabel: z.string().optional(),
    equipment: z.array(z.string()).default([]),
  }),

  team: aboutHead.extend({
    members: z
      .array(
        z.object({
          name: z.string(),
          role: z.string(),
          image: imageRefSchema,
          /** One-sentence bio beneath the role. */
          body: z.string().optional(),
        }),
      )
      .min(1),
    /** A stat with an empty value is a question still open — it is not shown. */
    stats: z.array(z.object({ value: z.string(), label: z.string() })).min(1),
  }),

  presence: aboutHead.extend({
    image: imageRefSchema,
    countries: z
      .array(
        z.object({
          flag: z.string(),
          name: z.string(),
          /** 1 = active lane, 2 = reachable market — sheet 03 §09. */
          tier: z.union([z.literal(1), z.literal(2)]).default(1),
          /** Transit note, e.g. "18 days, FCL". */
          note: z.string().optional(),
        }),
      )
      .min(1),
    /** "See the trade lanes" → /export. */
    link: z.object({ label: z.string(), href: z.string() }).optional(),
    stats: z
      .array(
        z.object({
          icon: z.enum(["truck", "globe"]),
          value: z.string(),
          label: z.string(),
          note: z.string().optional(),
        }),
      )
      .min(1),
  }),

  awards: aboutHead.extend({
    items: z
      .array(
        z.object({
          icon: z.enum(["medal", "leaf", "flask", "check", "scope", "trophy"]),
          name: z.string(),
          body: z.string(),
        }),
      )
      .min(1),
    auditedLabel: z.string(),
    auditors: z.array(z.string()).min(1),
    auditImage: imageRefSchema,
  }),

  green: aboutHead.extend({
    /** Off while the sustainability figures are unconfirmed (sheet 03 §11). */
    enabled: z.boolean().default(true),
    image: imageRefSchema,
    imageBadge: z.object({ title: z.string(), note: z.string() }),
    bars: z
      .array(
        z.object({
          label: z.string(),
          note: z.string(),
          pct: z.number().min(0).max(100),
        }),
      )
      .min(1),
  }),

  numbers: aboutHead.extend({
    stats: z
      .array(
        z.object({ value: z.string(), label: z.string(), note: z.string() }),
      )
      .min(1),
    testimonial: z.object({
      stars: z.number().min(1).max(5).default(5),
      quote: z.string().min(40),
      initials: z.string(),
      name: z.string(),
      role: z.string(),
    }),
    /** Replaces the testimonial when set — a reference-check offer, not a
        quote nobody gave (sheet 03 §12). */
    references: z.object({ eyebrow: z.string(), body: z.string() }).optional(),
  }),

  timeline: aboutHead.extend({
    items: z
      .array(
        z.object({
          year: z.string(),
          title: z.string(),
          body: z.string(),
          /** Only verified entries publish; a proposed year is never shown. */
          verification: z.enum(["verified", "proposed"]).default("verified"),
        }),
      )
      .min(1),
  }),

  clients: z.object({
    label: z.string(),
    items: z.array(z.string()).min(1),
    /** Sector per name, same order as items — sheet 03 §14. */
    sectors: z.array(z.string()).default([]),
    /** Logos uploaded in Studio, matched to a client by name. */
    logos: z.array(cmsImageSchema.extend({ client: z.string() })).default([]),
  }),

  closing: z.object({
    eyebrow: z.string(),
    lines: z.array(z.string()).min(1),
    accentLines: z.array(z.number()).default([]),
    body: z.string(),
    image: imageRefSchema,
    placeholder: z.string(),
    submitLabel: z.string(),
    assurances: z.array(z.string()).default([]),
  }),

  schemaTypes: z
    .array(
      z.enum([
        "Product",
        "BreadcrumbList",
        "FAQPage",
        "HowTo",
        "Organization",
        "WebSite",
      ]),
    )
    .default(["BreadcrumbList", "Organization"]),
});

/**
 * HOMEPAGE.
 *
 * Display headings carry inline accent via `*asterisks*` rather than a
 * line-index list, because the homepage mixes whole-line accent ("*Meets*")
 * with mid-line accent ("Two Decades of *Engineering* Precision").
 */
const homeHead = z.object({
  eyebrow: z.string().min(2),
  lines: z.array(z.string()).min(1),
  body: z.string().optional(),
});

export const homePageSchema = baseSchema.extend({
  // The hero's display copy is h1Lines; it has no secondary heading, so the
  // shared `lines` field is dropped rather than carried as an empty array.
  hero: homeHead.omit({ lines: true }).extend({
    h1Lines: z.array(z.string()).min(1),
    intro: z.string().min(40),
    image: imageRefSchema,
    actions: z
      .array(
        z.object({
          label: z.string(),
          href: z.string(),
          variant: z.enum(["primary", "secondary"]).default("primary"),
        }),
      )
      .min(1),
    chips: z.array(z.object({ label: z.string(), href: z.string() })).min(1),
    /** Phrases in the intro that link out — content sheet 01 §01 names four.
        The renderer links the first occurrence of each label as written. */
    introLinks: z.array(z.object({ label: z.string(), href: z.string() })).default([]),
    cards: z
      .array(
        z.object({
          value: z.string(),
          label: z.string(),
          icon: z.enum(["ribbon"]).optional(),
        }),
      )
      .min(1),
  }),

  trustbar: z.object({ label: z.string(), items: z.array(z.string()).min(1) }),

  story: homeHead.extend({
    paragraphs: z.array(z.string()).min(1),
    image: imageRefSchema,
    imageBadge: z.string(),
    floatCard: z.object({ title: z.string(), body: z.string(), href: z.string().optional() }),
    stats: z.array(z.object({ value: z.string(), label: z.string() })).min(1),
    cta: z.object({ label: z.string(), href: z.string() }),
  }),

  edge: homeHead.extend({
    items: z
      .array(
        z.object({
          icon: z.enum(["shield", "bolt", "gear", "globe", "layers", "ribbon"]),
          name: z.string(),
          body: z.string(),
          /** Where the card leads, when it does — four of six do (sheet 01 §04). */
          href: z.string().optional(),
        }),
      )
      .min(1),
  }),

  portfolio: homeHead.extend({
    cta: z.object({ label: z.string(), href: z.string() }),
    items: z
      .array(
        z.object({
          name: z.string(),
          /* The standards/type strip under each name, e.g.
             "AS568 / BS1806 / Metric". Replaces the old marketing `tag` +
             `body` + per-card CTA: the comp's tiles carry a name and a spec
             line only. */
          spec: z.string(),
          image: imageRefSchema,
          href: z.string(),
        }),
      )
      .min(1),
  }),

  sectors: homeHead.extend({
    items: z
      .array(
        z.object({
          /* Mirrors the ICONS map in HomeBlocks. Kept as an enum rather than a
             free string so a typo fails the build instead of rendering a
             blank tile. `wrench` and `package` are retained: they belonged to
             the retired "Mechanical Engineering" and "Export & OEM" cards and
             are still available if a sector needs them. */
          icon: z.enum([
            "car",
            "heart",
            "chip",
            "droplet",
            "wrench",
            "package",
            "pickaxe",
            "fuel",
            "gauge",
            "wind",
            "leaf",
          ]),
          name: z.string(),
          body: z.string(),
          href: z.string(),
        }),
      )
      .min(1),
  }),

  process: homeHead.extend({
    steps: z
      .array(z.object({ name: z.string(), body: z.string(), href: z.string().optional() }))
      .min(1),
  }),

  facility: homeHead.extend({
    image: imageRefSchema,
    inset: imageRefSchema,
    badge: z.string(),
    checks: z.array(z.string()).min(1),
    /** The stat row beneath the checks — sheet 01 §08. Empty renders nothing. */
    stats: z.array(z.object({ value: z.string(), label: z.string() })).default([]),
  }),

  exportMarkets: homeHead.extend({
    /** The paragraph under the heading — sheet 01 §09. */
    standfirst: z.string().optional(),
    /** Vision-build variants of the heading lines and standfirst (Build
        Instructions §01). Rendered only on the vision build; empty falls
        back to the buyer copy. */
    linesVision: z.array(z.string()).default([]),
    standfirstVision: z.string().optional(),
    hub: z.object({ label: z.string(), x: z.number(), y: z.number() }),
    lanes: z
      .array(
        z.object({
          code: z.string().length(2),
          name: z.string(),
          note: z.string(),
          /** Percentage coordinates on the 100x100 map plate. */
          x: z.number(),
          y: z.number(),
          /** The market block on /export: "/export#uk". */
          href: z.string().optional(),
        }),
      )
      .min(1),
    /** Extra pins with no lane card — the sheet has five pins for four cards. */
    pins: z
      .array(z.object({ label: z.string(), x: z.number(), y: z.number() }))
      .default([]),
    note: z.string(),
    /** "See all 95 markets →" after the note. */
    noteLink: z.object({ label: z.string(), href: z.string() }).optional(),
  }),

  /** Rows come from SITE.COMPOUNDS, so the table has one source of truth. */
  materials: homeHead.extend({
    axis: z.object({ min: z.number(), mid: z.number(), max: z.number() }),
    footnote: z.string(),
  }),

  cta: homeHead.extend({
    panel: z.object({
      badge: z.string(),
      title: z.string(),
      body: z.string(),
      image: imageRefSchema,
      stats: z.array(z.object({ value: z.string(), label: z.string() })).min(1),
    }),
    fields: z
      .array(
        z.object({
          name: z.string(),
          label: z.string(),
          placeholder: z.string(),
          type: z.string(),
          options: z.array(z.string()).optional(),
          required: z.boolean().optional(),
          full: z.boolean().optional(),
        }),
      )
      .min(1),
    uploadLabel: z.string(),
    uploadHint: z.string(),
    submitLabel: z.string(),
    footnote: z.string(),
  }),

  schemaTypes: z
    .array(
      z.enum([
        "Product",
        "BreadcrumbList",
        "FAQPage",
        "HowTo",
        "Organization",
        "WebSite",
      ]),
    )
    .default(["Organization", "WebSite"]),
});

/** /why-margo. Same `*asterisk*` accent convention as the homepage. */
const whyHead = z.object({
  eyebrow: z.string().min(2),
  lines: z.array(z.string()).min(1),
  body: z.string().optional(),
});

const statSchema = z.object({ value: z.string(), label: z.string() });

export const whyMargoPageSchema = baseSchema.extend({
  hero: z.object({
    eyebrow: z.string(),
    h1Lines: z.array(z.string()).min(1),
    intro: z.string().min(40),
    image: imageRefSchema,
    stats: z.array(statSchema).min(1),
    actions: z
      .array(
        z.object({
          label: z.string(),
          href: z.string(),
          variant: z.enum(["primary", "secondary"]).default("primary"),
          icon: z.enum(["download"]).optional(),
        }),
      )
      .min(1),
  }),

  heritage: whyHead.extend({
    image: imageRefSchema,
    milestones: z.array(z.object({ year: z.string(), body: z.string() })).min(1),
    stats: z.array(statSchema).min(1),
    note: z.string(),
  }),

  difference: whyHead.extend({
    items: z
      .array(
        z.object({
          eyebrow: z.string(),
          name: z.string(),
          body: z.string(),
          foot: z.string(),
        }),
      )
      .min(1),
  }),

  capabilities: whyHead.extend({
    banner: imageRefSchema,
    bannerEyebrow: z.string(),
    bannerLines: z.array(z.string()).min(1),
    items: z
      .array(
        z.object({
          icon: z.enum(["gear", "layers", "swap", "extrude", "robot", "tool"]),
          name: z.string(),
          body: z.string(),
          foot: z.string(),
        }),
      )
      .min(1),
  }),

  materials: whyHead.extend({
    items: z
      .array(
        z.object({
          code: z.string(),
          name: z.string(),
          temp: z.string(),
          hardness: z.string(),
          chemical: z.string(),
          industries: z.string(),
          applications: z.string(),
        }),
      )
      .min(1),
    customNote: z.string(),
  }),

  quality: whyHead.extend({
    image: imageRefSchema,
    imageCaption: z.string(),
    stats: z.array(statSchema).min(1),
    checks: z.array(z.string()).min(1),
    note: z.string(),
  }),

  standards: whyHead.extend({
    items: z
      .array(
        z.object({
          code: z.string(),
          suffix: z.string(),
          name: z.string(),
          auditor: z.string(),
          scope: z.string(),
        }),
      )
      .min(1),
  }),

  responsibility: whyHead.extend({
    cards: z
      .array(
        z.object({
          icon: z.enum(["leaf", "droplet", "recycle", "package"]),
          value: z.string(),
          name: z.string(),
          body: z.string(),
        }),
      )
      .min(1),
    initiativesHeading: z.string(),
    initiatives: z.array(z.string()).min(1),
  }),

  globalExport: whyHead.extend({
    image: imageRefSchema,
    stats: z.array(statSchema).min(1),
    regionsHeading: z.string(),
    regions: z.array(z.object({ name: z.string(), list: z.string() })).min(1),
    industriesHeading: z.string(),
    industries: z.array(z.string()).min(1),
    terms: z.string(),
  }),

  support: whyHead.extend({
    image: imageRefSchema,
    items: z.array(z.object({ name: z.string(), body: z.string() })).min(1),
  }),

  tenure: whyHead.extend({
    columns: z.array(z.string()).length(3),
    rows: z
      .array(
        z.object({
          metric: z.string(),
          value: z.string(),
          context: z.string(),
        }),
      )
      .min(1),
  }),

  feedback: whyHead.extend({
    quote: z.string().min(40),
    initials: z.string(),
    name: z.string(),
    role: z.string(),
    stats: z.array(statSchema).min(1),
  }),

  faq: whyHead.extend({
    items: z.array(faqSchema).min(1),
  }),

  enquiry: z.object({
    eyebrow: z.string(),
    lines: z.array(z.string()).min(1),
    body: z.string(),
    contacts: z
      .array(
        z.object({
          icon: z.enum(["pin", "phone", "mail", "clock"]),
          label: z.string(),
          value: z.string(),
        }),
      )
      .min(1),
    note: z.string(),
    fields: z
      .array(
        z.object({
          name: z.string(),
          label: z.string(),
          placeholder: z.string(),
          type: z.string(),
          options: z.array(z.string()).optional(),
          required: z.boolean().optional(),
          full: z.boolean().optional(),
        }),
      )
      .min(1),
    submitLabel: z.string(),
    footnote: z.string(),
  }),

  schemaTypes: z
    .array(
      z.enum([
        "Product",
        "BreadcrumbList",
        "FAQPage",
        "HowTo",
        "Organization",
        "WebSite",
      ]),
    )
    .default(["BreadcrumbList", "FAQPage", "Organization"]),
});

/** /export. Eight anchored market sections plus process, docs and summary. */
export const exportPageSchema = baseSchema.extend({
  /** Guides listed before the closing call-to-action; only published ones show. */
  furtherReading: z.array(z.string()).default([]),
  hero: z.object({
    badge: z.string(),
    h1Lines: z.array(z.string()).min(1),
    intro: z.string().min(40),
    image: imageRefSchema,
    /** Hub marker on the 1000x500 map plate. */
    hub: z.object({ label: z.string(), x: z.number(), y: z.number() }),
    /** Concept-build strip under the intro: "95 MARKETS SCREENED · 18 PLAYBOOKS · 9 LANES". Never on the buyer build. */
    visionStrip: z.string().optional(),
    /** Concept-build tier-2 pins — the wider screened set. Never on the buyer build. */
    visionPins: z.array(z.object({ label: z.string(), x: z.number(), y: z.number() })).default([]),
  }),

  markets: z
    .array(
      z.object({
        slug: z.string().min(2),
        eyebrow: z.string(),
        chip: z.string(),
        heading: z.string(),
        body: z.string().min(40),
        image: imageRefSchema,
        pin: z.object({ x: z.number(), y: z.number() }),
        /** The pin's label on the map — "UNITED ARAB EMIRATES" (sheet 06 §03). A market without one draws an unlabelled pin. */
        pinLabel: z.string().optional(),
        /** Further pins the block owns — the East Africa lane pins KE and TZ separately. */
        pins: z.array(z.object({ label: z.string(), x: z.number(), y: z.number() })).default([]),
        /** Tooltip on the pin: "Mombasa · 18 days · FCL". */
        pinNote: z.string().optional(),
        points: z.array(z.string()).min(1),
        /** Rendered italic and muted: duty/regulatory caveats. */
        caveat: z.string().optional(),
        links: z
          .array(z.object({ label: z.string(), href: z.string() }))
          .default([]),
        /** Optional extra panel. Only US&EU and USA carry one in the comp. */
        panel: z
          .object({
            heading: z.string(),
            body: z.string().optional(),
            terms: z
              .array(
                z.object({
                  code: z.string(),
                  name: z.string(),
                  body: z.string(),
                }),
              )
              .default([]),
            facts: z
              .array(z.object({ label: z.string(), value: z.string() }))
              .default([]),
            footnote: z.string().optional(),
          })
          .optional(),
      }),
    )
    .min(1),

  process: z.object({
    eyebrow: z.string(),
    heading: z.string(),
    body: z.string(),
    steps: z
      .array(
        z.object({
          icon: z.enum(["doc", "clipboard", "box", "pallet", "ship", "truck"]),
          name: z.string(),
          body: z.string(),
          /** Labelled lines — We need / You get back / We do / Why it matters (sheet 06 §06). Rendered instead of body when present. */
          lines: z.array(z.object({ label: z.string(), text: z.string() })).default([]),
        }),
      )
      .min(1),
  }),

  /** Incoterms as their own section (#incoterms) — sheet 06 §05. Until it is
      filled the page keeps the terms nested in the US & EU market panel. */
  incoterms: z
    .object({
      eyebrow: z.string(),
      heading: z.string(),
      body: z.string().optional(),
      terms: z.array(z.object({ code: z.string(), name: z.string(), body: z.string() })).min(1),
      /** The code marked "standard" — FOB. */
      standard: z.string().optional(),
      footnote: z.string().optional(),
    })
    .optional(),

  documents: z.object({
    eyebrow: z.string(),
    heading: z.string(),
    body: z.string(),
    items: z
      .array(
        z.object({
          icon: z.enum(["doc", "clipboard", "shield", "check"]),
          name: z.string(),
          body: z.string(),
        }),
      )
      .min(1),
  }),

  quote: z.object({
    heading: z.string(),
    body: z.string(),
    checks: z.array(z.string()).min(1),
    formHeading: z.string(),
    fields: z
      .array(
        z.object({
          name: z.string(),
          label: z.string(),
          placeholder: z.string(),
          type: z.string(),
          options: z.array(z.string()).optional(),
          required: z.boolean().optional(),
          full: z.boolean().optional(),
        }),
      )
      .min(1),
    submitLabel: z.string(),
    footnote: z.string(),
  }),

  summary: z.object({
    eyebrow: z.string(),
    heading: z.string(),
    body: z.string(),
    facts: z.array(z.object({ label: z.string(), value: z.string() })).min(1),
  }),

  /** The six process steps and the Incoterms, phrased as questions — content sheet 06 §07. */
  faqs: z.array(faqSchema).default([]),
  schemaTypes: z
    .array(
      z.enum([
        "Product",
        "BreadcrumbList",
        "FAQPage",
        "HowTo",
        "Organization",
        "WebSite",
      ]),
    )
    .default(["BreadcrumbList", "Organization"]),
});

/**
 * /case-studies.
 *
 * The design is itself an honest empty state: it says plainly that Margo has
 * no documented export case studies yet and explains what one will contain
 * when it exists. Nothing here needed inventing, which is exactly what brief
 * C4 asked for ("placeholder only, do not fabricate").
 */
export const caseStudiesPageSchema = baseSchema.extend({
  hero: z.object({
    eyebrow: z.string(),
    h1Lines: z.array(z.string()).min(1),
    paragraphs: z.array(z.string()).min(1),
    image: imageRefSchema,
    badge: z.object({ title: z.string(), note: z.string() }),
    actions: z
      .array(
        z.object({
          label: z.string(),
          href: z.string(),
          variant: z.enum(["primary", "secondary"]).default("primary"),
        }),
      )
      .min(1),
  }),

  methodology: z.object({
    index: z.string(),
    label: z.string(),
    heading: z.string(),
    body: z.string(),
    items: z
      .array(
        z.object({
          eyebrow: z.string(),
          name: z.string(),
          body: z.string(),
          statValue: z.string(),
          statNote: z.string(),
        }),
      )
      .min(1),
  }),

  meantime: z.object({
    index: z.string(),
    label: z.string(),
    heading: z.string(),
    body: z.string(),
    items: z
      .array(
        z.object({
          icon: z.enum(["ribbon", "shield", "check", "doc"]),
          eyebrow: z.string(),
          name: z.string(),
          body: z.string(),
          cta: z.object({ label: z.string(), href: z.string() }),
        }),
      )
      .min(1),
  }),

  invitation: z.object({
    index: z.string(),
    label: z.string(),
    eyebrow: z.string(),
    headingLines: z.array(z.string()).min(1),
    paragraphs: z.array(z.string()).min(1),
    cta: z.object({ label: z.string(), href: z.string() }),
    listHeading: z.string(),
    list: z.array(z.string()).min(1),
    footnote: z.string(),
  }),

  closing: z.object({
    eyebrow: z.string(),
    headingLines: z.array(z.string()).min(1),
    body: z.string(),
    actions: z
      .array(
        z.object({
          label: z.string(),
          href: z.string(),
          variant: z.enum(["primary", "secondary"]).default("primary"),
          icon: z.enum(["mail", "out", "phone"]).optional(),
        }),
      )
      .min(1),
  }),

  schemaTypes: z
    .array(
      z.enum([
        "Product",
        "BreadcrumbList",
        "FAQPage",
        "HowTo",
        "Organization",
        "WebSite",
      ]),
    )
    .default(["BreadcrumbList", "Organization"]),
});

/**
 * /resources hub.
 *
 * Deliberately carries no guide list. The cards are read from the resources
 * collection at build time, so adding a guide is one MDX file and it appears
 * in the right category group with the counts updated. Category order and
 * copy live here because they are page furniture, not content.
 */
export const resourcesHubSchema = baseSchema.extend({
  breadcrumb: z.array(z.object({ label: z.string(), href: z.string().optional() })).min(1),
  h1Lines: z.array(z.string()).min(1),
  intro: z.string().min(40),
  /** Rendered next to the live guide/category counts. */
  lastUpdated: z.string(),
  searchPlaceholder: z.string(),
  allLabel: z.string(),
  featuredLabel: z.string(),
  categories: z
    .array(
      z.object({
        key: z.enum(["material-comparison", "sizing-spec", "sourcing-buyer", "datasheets"]),
        label: z.string(),
        /** Sheet 40 §10 names the Datasheets group with no blurb. */
        blurb: z.string().optional(),
      }),
    )
    .min(1),
  cta: z.object({
    icon: z.string(),
    headingLines: z.array(z.string()).min(1),
    body: z.string(),
    actions: z
      .array(
        z.object({
          label: z.string(),
          href: z.string(),
          variant: z.enum(["primary", "secondary"]).default("primary"),
        }),
      )
      .min(1),
  }),
  schemaTypes: z
    .array(z.enum(["Product", "BreadcrumbList", "FAQPage", "HowTo", "Organization", "WebSite"]))
    .default(["BreadcrumbList"]),
});

/**
 * /thank-you and the 404.
 *
 * Neither has a Figma design; both are derived from the design system. They
 * share a shape because they are the same page type: a short statement, a
 * short list, and routes back into the site.
 *
 * Neither states a response time in content. The thank-you page reads
 * SITE.responsePromise, so the one value Margo still owes us changes in one
 * place rather than in prose.
 */
export const utilityPageSchema = baseSchema.extend({
  eyebrow: z.string(),
  h1Lines: z.array(z.string()).min(1),
  intro: z.string().min(30),
  /** "What happens next" on /thank-you; omitted on the 404. */
  steps: z
    .array(z.object({ name: z.string(), body: z.string() }))
    .default([]),
  note: z.string().optional(),
  linksHeading: z.string(),
  links: z
    .array(
      z.object({
        icon: z.enum(["box", "sector", "doc", "ribbon", "globe", "mail"]),
        label: z.string(),
        body: z.string(),
        href: z.string(),
      }),
    )
    .min(1),
  actions: z
    .array(
      z.object({
        label: z.string(),
        href: z.string(),
        variant: z.enum(["primary", "secondary"]).default("primary"),
      }),
    )
    .default([]),
  schemaTypes: z
    .array(z.enum(["Product", "BreadcrumbList", "FAQPage", "HowTo", "Organization", "WebSite"]))
    .default([]),
});

/**
 * SKU detail — /products/[category]/[product]
 *
 * Strategy D3 / Scenario 1 from §4.5: build the route and template now, ship
 * noindex until real spec content exists. Structure complete, no thin-page
 * penalty.
 *
 * The part LIST stays in the category file's `anchors:`, which remains the
 * single source of truth and the 301 fragment map. This collection carries
 * only the per-part DETAIL, keyed by the same id. A part with no file here
 * still appears in the grid, just without a link — which is the per-part
 * upgrade path as Margo's spec data arrives.
 *
 * Every spec field is optional on purpose. The template renders "On request"
 * rather than a fabricated number, so a part can be published the moment its
 * name is confirmed and filled in field by field afterwards.
 */
export const skuSchema = baseSchema.extend({
  // Catalogue part names are legitimately short ("C Pad", "L Pad"). The 8-char
  // h1 minimum on baseSchema is a guard for editorial page headings and is
  // wrong here, so it is relaxed for this collection only.
  h1: z.string().min(2),
  navLabel: z.string().min(2),
  /** Must match a category slug in src/content/products/. */
  category: z.string().regex(/^[a-z0-9-]+$/),
  eyebrow: z.string().optional(),
  intro: z.string().min(30),
  productCode: z.string().optional(),
  /** No longer rendered: the IN STOCK badge was a contradiction in prose. Kept so old records validate. */
  stockLabel: z.string().optional(),
  /** Sheet 32/33 per-part fields. All optional; nothing renders while empty. */
  hardness: z.string().optional(),
  dimensions: z.string().optional(),
  /** How the part is made — the process block reads this when the per-part steps are empty. */
  processType: z.enum(["compression", "injection", "transfer", "extrusion", "bonded", "cut"]).optional(),
  /**
   * The eight compounds ranked for this part, best first, each with the
   * reason (sheet 33); the per-part sheets (34) add the rank label the buyer
   * sees ("Recommended", "Not recommended"), the range as written and the
   * hardness band.
   */
  compoundRanking: z
    .array(
      z.object({
        code: z.string().min(2),
        rank: z.number().int().positive(),
        reason: z.string().min(3),
        rankLabel: z.string().optional(),
        temperature: z.string().optional(),
        hardness: z.string().optional(),
        /** Display name where it is not the compound's own — "EPDM closed-cell" on a foam part. */
        name: z.string().optional(),
      }),
    )
    .default([]),
  /**
   * A compound-variant page (EPDM Gaskets, FKM Oil Seals) routes rather
   * than ranks: "Leave FKM if … the medium is steam → specify EPDM". The
   * sheet's table, as written (sheet 34, e.g. SKU 08/14–18).
   */
  compoundRouter: z
    .object({ columns: z.array(z.string()).min(2), rows: z.array(z.array(z.string())).min(1) })
    .optional(),
  /**
   * "Ship the selector with nothing selected and a fluid question in its
   * place" (SKU 31 §03): on a wetted part the compound is the part, so no
   * chip starts selected and the panel asks what the part sits in.
   */
  compoundPrompt: z.string().optional(),
  /** The chip over the advantages plate — "SERVICE TEMPERATURE / −40 to +160 °C continuous, in AEM" (sheet 34 §04). */
  qualityChip: z.object({ label: z.string().min(2), value: z.string().min(2), note: z.string().optional() }).optional(),
  /** One honest request line in place of four dead downloads (sheet 32 §09). */
  documentation: z
    .object({ body: z.string().min(20), cta: z.object({ label: z.string(), href: z.string() }) })
    .optional(),
  /** The closing band's line, where the sheet writes a part-specific one (sheet 34 §11). */
  ctaBody: z.string().optional(),
  /** The WooCommerce URL this part replaces — the 301 source (sheet 34). */
  legacyUrl: z.string().optional(),

  /** Hero gallery. Empty renders styled placeholder plates, not broken images. */
  gallery: z
    .object({
      main: imageRefSchema.optional(),
      thumbs: z.array(imageRefSchema).default([]),
      overlay: z
        .array(z.object({ label: z.string(), value: z.string(), note: z.string().optional() }))
        .default([]),
    })
    .default({ thumbs: [], overlay: [] }),

  /** Sanity CDN URL of the part's .glb model. Absent = no 3D viewer, no 3D tile. */
  model3dUrl: z.string().url().optional(),

  /** The four tiles beside the H1. */
  quickSpecs: z.array(z.object({ label: z.string(), value: z.string() })).default([]),

  /** Quantity stepper under the quick specs. */
  order: z
    .object({ unit: z.string(), defaultQty: z.string(), minNote: z.string() })
    .optional(),

  assurances: z.array(z.string()).default([]),

  dimensional: z
    .object({
      caption: z.string(),
      /** The sheet-stock labels; a moulded part has neither (sheet 32 §02). */
      widthNote: z.string().optional(),
      thicknessNote: z.string().optional(),
      /** "Drawing on request under NDA" — beside the cross-section label. */
      note: z.string().optional(),
      tiles: z.array(z.object({ value: z.string(), label: z.string() })).default([]),
      footnote: z.string().optional(),
    })
    .optional(),

  specs: z.array(z.object({ label: z.string(), value: z.string() })).default([]),

  compounds: z.array(z.string()).default([]),
  compoundProperties: z.record(z.string(), z.array(z.string())).default({}),

  /** The advantages heading where the page type changes it — "Why distributors buy from Margo" on a fitment part (SKU 22 §04). */
  advantagesHeading: z.string().optional(),
  advantages: z
    .array(z.object({ icon: z.string(), name: z.string(), body: z.string() }))
    .default([]),

  applications: z
    .array(
      z.object({
        icon: z.string(),
        name: z.string(),
        body: z.string(),
        /** The industry page a card is about — "Link each surviving card to its industry page" (sheet 34 §05). */
        href: z.string().optional(),
      }),
    )
    .default([]),

  process: z.array(z.object({ name: z.string(), body: z.string() })).default([]),

  quality: z
    .object({
      heading: z.string(),
      body: z.string(),
      certificates: z
        .array(z.object({ name: z.string(), issuer: z.string(), validity: z.string() }))
        .default([]),
      metrics: z.array(z.object({ value: z.string(), label: z.string() })).default([]),
      tour: z.object({ title: z.string(), note: z.string() }).optional(),
      /** Under the certificate cards — a scope or non-claim line the sheet writes for this part. */
      note: z.string().optional(),
    })
    .optional(),

  downloads: z
    .array(
      z.object({
        name: z.string(),
        format: z.string(),
        size: z.string(),
        icon: z.string(),
        /** The file itself. A row without one does not render. */
        href: z.string().optional(),
      }),
    )
    .default([]),

  faqs: z.array(faqSchema).default([]),

  related: relatedSchema,
  /**
   * "You may also need" — up to four parts (sheet 32 §11). A sibling by its
   * slug, or a part in another category as "category/slug"; the difference
   * line where the sheet writes one.
   */
  relatedParts: z
    .array(z.object({ slug: z.string().min(1), difference: z.string().optional() }))
    .max(4)
    .default([]),
  schemaTypes: z
    .array(z.enum(["Product", "BreadcrumbList", "FAQPage", "HowTo", "Organization", "WebSite"]))
    .default(["BreadcrumbList"]),
});

/* ------------------------------------------------------------------ */

/**
 * SITE FOOTER — every string the footer renders, in one content file.
 *
 * Deliberately not in navigation.ts. The footer is almost entirely copy and
 * links, which is exactly what a non-technical editor needs to change, and a
 * CMS can be pointed at one validated content file far more easily than at a
 * TypeScript module. Nothing below is hardcoded in the component.
 */
const footerLinkSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
});

export const footerSchema = z.object({
  slug: z.string(),
  brand: z.object({
    blurb: z.string().min(20),
    phone: z.string().min(6),
    email: z.string().min(5),
    address: z.string().min(10),
  }),
  /**
   * Rendered only where `href` is filled in. Margo's social accounts are not
   * known, so the entries exist with empty hrefs and the component skips
   * them: an editor fills the URL and the icon appears, and until then no
   * dead link ships.
   */
  social: z
    .array(
      z.object({
        label: z.string().min(2),
        icon: z.enum(["linkedin", "twitter", "youtube"]),
        href: z.string().default(""),
      }),
    )
    .default([]),
  columns: z
    .array(
      z.object({
        heading: z.string().min(2),
        links: z.array(footerLinkSchema).min(1),
      }),
    )
    .min(1),
  cta: z.object({
    heading: z.string().min(10),
    body: z.string().min(10),
    action: footerLinkSchema,
  }),
  legal: z.array(footerLinkSchema).min(1),
  copyright: z.string().min(10),
  badge: z.string().min(4),
  confirmWithMargo: z.array(z.string()).default([]),
});

/* ------------------------------------------------------------------ */

/**
 * LEGAL PAGES — /legal/privacy-policy, /legal/terms, /legal/export-compliance.
 *
 * Body copy is structured data rather than MDX prose, for one reason: the
 * design renders a table of contents beside the text, and every entry has to
 * resolve to a real anchor. Driving both from one `sections` array makes a
 * TOC entry with no matching section, or a section missing from the TOC,
 * unrepresentable — the failure mode a hand-written MDX body invites.
 */

/** One paragraph, one subheading, one bullet list, or one callout. */
const legalBlockSchema = z.union([
  z.object({ p: z.string().min(1) }),
  z.object({ h: z.string().min(2) }),
  z.object({ ul: z.array(z.string().min(1)).min(1) }),
  /** Emphasised single line — "We never sell your personal information." */
  z.object({ note: z.string().min(1) }),
]);

export type LegalBlock = z.infer<typeof legalBlockSchema>;

const legalSectionSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/, "section ids are lowercase-kebab"),
  title: z.string().min(3),
  /**
   * Shorter label for the TOC card, which is a third the width of the content
   * column. The comp does this itself: the heading reads "How We Use Your
   * Information" while its contents entry reads "How We Use Information".
   * Falls back to `title`.
   */
  navLabel: z.string().min(3).optional(),
  /** Key into the icon set in LegalToc. Unknown keys render the fallback. */
  icon: z.string().default("doc"),
  blocks: z.array(legalBlockSchema).default([]),
});

export const legalSchema = baseSchema.extend({
  /** Pill above the H1 — "LEGAL & COMPLIANCE" in the comp. */
  badge: z.string().min(3).default("Legal & Compliance"),
  intro: z.string().min(40),
  /**
   * Rendered verbatim, not parsed and reformatted. A legal document's stated
   * revision date is a factual claim about when counsel last reviewed it;
   * `null` means nobody has told us, and the chip is omitted rather than
   * defaulting to the build date and inventing one.
   */
  lastUpdated: z.string().min(4).nullable().default(null),
  sections: z.array(legalSectionSchema).min(1),
});

export type LegalPage = z.infer<typeof legalSchema>;

export const COLLECTIONS = {
  products: productCategorySchema,
  industries: industrySchema,
  resources: resourceSchema,
  skus: skuSchema,
  pages: productsHubSchema,
  legal: legalSchema,
} as const;

export type Collection = keyof typeof COLLECTIONS;
export type ProductCategory = z.infer<typeof productCategorySchema>;
export type Industry = z.infer<typeof industrySchema>;
export type Resource = z.infer<typeof resourceSchema>;
export type Sku = z.infer<typeof skuSchema>;
export type Legal = z.infer<typeof legalSchema>;
export type Frontmatter<C extends Collection> = z.infer<(typeof COLLECTIONS)[C]>;

export { siteSettingsSchema, type SiteSettings, type Certification, type Compound } from "./settings.ts";
