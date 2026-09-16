import { defineArrayMember, defineField, defineType } from "sanity";
import { imageRefField, iconField } from "../blocks/_shared.ts";
import { schemaTypesField } from "./_marketing.ts";

/**
 * SKU — a catalogue part. Thirty-one pages, and the first FIXED-STRUCTURE
 * page type.
 *
 * No `sections` array, no blocks, nothing to reorder. That is not a shortcut;
 * it is what the page actually is. The SKU route renders ten sections
 * unconditionally, in one order, each a self-contained component that owns its
 * own heading and handles its own empty state. There has never been a SKU page
 * with a different order, and there is no sensible one.
 *
 * Offering an editor a block list here would mean offering them a choice with
 * one correct answer, and a way to break thirty-one pages by dragging. So the
 * structure is fixed and every word inside it is editable — which is the
 * distinction the plan drew between "reorderable blocks" and "fixed structure,
 * editable content", and this is the first page type on the second side of it.
 *
 * The practical consequence: SKUs cost no new blocks at all.
 */

/** Groups follow the page top to bottom, so the editor's order matches the visitor's. */
const GROUPS = [
  { name: "top", title: "Top of page", default: true },
  { name: "specs", title: "Specifications" },
  { name: "selling", title: "Advantages & uses" },
  { name: "trust", title: "Quality & downloads" },
  { name: "meta", title: "Search & links" },
];

const labelValueArray = (name: string, title: string, group: string, description?: string) =>
  defineField({
    name,
    title,
    type: "array",
    description,
    of: [
      defineArrayMember({
        type: "object",
        name: "row",
        fields: [
          defineField({ name: "label", type: "string", validation: (r) => r.required() }),
          defineField({ name: "value", type: "string", validation: (r) => r.required() }),
        ],
        preview: { select: { title: "label", subtitle: "value" } },
      }),
    ],
    group,
  });

const iconCardArray = (name: string, title: string, description: string) =>
  defineField({
    name,
    title,
    type: "array",
    description,
    of: [
      defineArrayMember({
        type: "object",
        name: "card",
        fields: [
          iconField(),
          defineField({ name: "name", title: "Heading", type: "string", validation: (r) => r.required() }),
          defineField({ name: "body", title: "Description", type: "text", rows: 2, validation: (r) => r.required() }),
        ],
        preview: { select: { title: "name", subtitle: "body" } },
      }),
    ],
    group: "selling",
  });

export const sku = defineType({
  name: "sku",
  title: "Part",
  type: "document",
  groups: GROUPS,
  fields: [
    /* ── Identity ─────────────────────────────────────────────────────────── */
    defineField({
      name: "slug",
      title: "Web address",
      type: "slug",
      description: "The last part of the URL. Changing it breaks existing links.",
      options: { source: "navLabel", maxLength: 96 },
      validation: (r) => r.required(),
      group: "top",
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      description:
        "Which product category this part belongs to. Must match a category's web address exactly — it decides the URL and the breadcrumb.",
      validation: (r) =>
        r.required().regex(/^[a-z0-9-]+$/, { name: "lowercase-with-hyphens" }),
      group: "top",
    }),
    defineField({
      name: "status",
      title: "Publication status",
      type: "string",
      options: {
        list: [
          { title: "Placeholder — not real content yet", value: "placeholder" },
          { title: "Draft — being written", value: "draft" },
          { title: "Published", value: "published" },
        ],
        layout: "radio",
      },
      initialValue: "placeholder",
      validation: (r) => r.required(),
      group: "top",
    }),
    defineField({
      name: "navLabel",
      title: "Short name",
      type: "string",
      validation: (r) => r.required().min(2),
      group: "top",
    }),

    /* ── Hero ─────────────────────────────────────────────────────────────── */
    defineField({
      name: "h1",
      title: "Part name",
      type: "string",
      // Two characters, not eight. Catalogue names are legitimately short —
      // "C Pad", "L Pad" — and the editorial minimum that suits a marketing
      // heading is simply wrong here.
      validation: (r) => r.required().min(2),
      group: "top",
    }),
    defineField({ name: "eyebrow", title: "Label above the name", type: "string", group: "top" }),
    defineField({
      name: "intro",
      title: "Opening paragraph",
      type: "text",
      rows: 3,
      validation: (r) => r.required().min(30),
      group: "top",
    }),
    defineField({
      name: "productCode",
      title: "Part number",
      type: "string",
      group: "top",
    }),
    defineField({
      name: "stockLabel",
      title: "Availability (no longer shown)",
      type: "string",
      description: "Retired: nothing is stocked, so the badge came off the page. Kept for old records.",
      readOnly: true,
      hidden: ({ value }) => !value,
      group: "top",
    }),
    defineField({ name: "hardness", title: "Hardness", type: "string", description: "e.g. 70 ±5 Shore A", group: "top" }),
    defineField({ name: "dimensions", title: "Dimensions", type: "string", description: "e.g. Ø 42 × 3.5 mm, or “to your drawing”", group: "top" }),
    defineField({
      name: "processType",
      title: "Process",
      type: "string",
      options: {
        list: [
          { title: "Compression moulding", value: "compression" },
          { title: "Injection moulding", value: "injection" },
          { title: "Transfer moulding", value: "transfer" },
          { title: "Extrusion", value: "extrusion" },
          { title: "Rubber-to-metal bonding", value: "bonded" },
          { title: "Cut from sheet", value: "cut" },
        ],
      },
      group: "top",
    }),
    defineField({
      name: "legacyUrl",
      title: "Old address (WooCommerce)",
      type: "string",
      description: "The old shop URL for this part, e.g. /product/oil-seal-fkm. Requests to it are redirected here.",
      group: "meta",
    }),
    defineField({
      name: "gallery",
      title: "Photographs",
      type: "object",
      description: "Leave empty and the page draws styled placeholder plates rather than broken images.",
      fields: [
        imageRefField("main", { title: "Main photograph", group: null }),
        defineField({
          name: "thumbs",
          title: "Thumbnails",
          type: "array",
          of: [defineArrayMember({ type: "string" })],
        }),
        defineField({
          name: "overlay",
          title: "Figures over the photograph",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              name: "overlayRow",
              fields: [
                defineField({ name: "label", type: "string", validation: (r) => r.required() }),
                defineField({ name: "value", type: "string", validation: (r) => r.required() }),
                defineField({ name: "note", type: "string" }),
              ],
              preview: { select: { title: "label", subtitle: "value" } },
            }),
          ],
        }),
      ],
      group: "top",
    }),
    labelValueArray("quickSpecs", "The four tiles beside the name", "top"),
    defineField({
      name: "order",
      title: "Quantity box",
      type: "object",
      fields: [
        defineField({ name: "unit", title: "Unit", type: "string", validation: (r) => r.required() }),
        defineField({ name: "defaultQty", title: "Default quantity", type: "string", validation: (r) => r.required() }),
        defineField({ name: "minNote", title: "Minimum-order note", type: "string", validation: (r) => r.required() }),
      ],
      options: { collapsible: true, collapsed: true },
      group: "top",
    }),
    defineField({
      name: "assurances",
      title: "Reassurance lines",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      description: "Short promises under the quantity box.",
      group: "top",
    }),

    /* ── Specifications ───────────────────────────────────────────────────── */
    defineField({
      name: "dimensional",
      title: "Dimensions panel",
      type: "object",
      fields: [
        defineField({ name: "caption", type: "string", validation: (r) => r.required() }),
        defineField({ name: "widthNote", title: "Width note", type: "string", validation: (r) => r.required() }),
        defineField({ name: "thicknessNote", title: "Thickness note", type: "string", validation: (r) => r.required() }),
        defineField({
          name: "tiles",
          title: "Figures",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              name: "tile",
              fields: [
                defineField({ name: "value", type: "string", validation: (r) => r.required() }),
                defineField({ name: "label", type: "string", validation: (r) => r.required() }),
              ],
              preview: { select: { title: "value", subtitle: "label" } },
            }),
          ],
        }),
        defineField({ name: "footnote", type: "string" }),
      ],
      options: { collapsible: true, collapsed: true },
      group: "specs",
    }),
    labelValueArray("specs", "Specification rows", "specs"),
    defineField({
      name: "compounds",
      title: "Compounds available",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      description: 'Short codes — "NBR", "EPDM". Each becomes a tab.',
      options: { layout: "tags" },
      group: "specs",
    }),
    /**
     * SHAPE DIFFERENCE, like the spec table's rows.
     *
     * The content file stores this as a map of compound code → list of
     * properties. Sanity has no map type, so it is stored as a list of
     * code/properties pairs and rebuilt into a map when read. The rebuild
     * happens in the source layer rather than in a component, so the templates
     * never learn the storage shape differed.
     */
    defineField({
      name: "compoundProperties",
      title: "Properties per compound",
      type: "array",
      description: "One entry per compound above. The code must match exactly.",
      of: [
        defineArrayMember({
          type: "object",
          name: "compoundProperty",
          fields: [
            defineField({ name: "code", title: "Compound code", type: "string", validation: (r) => r.required() }),
            defineField({
              name: "values",
              title: "Properties",
              type: "array",
              of: [defineArrayMember({ type: "string" })],
              validation: (r) => r.required().min(1),
            }),
          ],
          preview: {
            select: { title: "code", values: "values" },
            prepare: ({ title, values }) => ({
              title,
              subtitle: `${(values as unknown[])?.length ?? 0} properties`,
            }),
          },
        }),
      ],
      group: "specs",
    }),

    /* ── Advantages & uses ────────────────────────────────────────────────── */
    iconCardArray("advantages", "Why this part", "What makes it the right choice."),
    iconCardArray("applications", "Where it is used", "Typical applications."),
    defineField({
      name: "process",
      title: "How it is made",
      type: "array",
      description: "Numbered on the page in this order.",
      of: [
        defineArrayMember({
          type: "object",
          name: "step",
          fields: [
            defineField({ name: "name", title: "Step", type: "string", validation: (r) => r.required() }),
            defineField({ name: "body", title: "What happens", type: "text", rows: 2, validation: (r) => r.required() }),
          ],
          preview: { select: { title: "name", subtitle: "body" } },
        }),
      ],
      group: "selling",
    }),

    /* ── Quality & downloads ──────────────────────────────────────────────── */
    defineField({
      name: "quality",
      title: "Quality panel",
      type: "object",
      fields: [
        defineField({ name: "heading", type: "string", validation: (r) => r.required() }),
        defineField({ name: "body", type: "text", rows: 3, validation: (r) => r.required() }),
        defineField({
          name: "certificates",
          title: "Certificates",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              name: "certificate",
              fields: [
                defineField({ name: "name", type: "string", validation: (r) => r.required() }),
                defineField({ name: "issuer", type: "string", validation: (r) => r.required() }),
                defineField({ name: "validity", type: "string", validation: (r) => r.required() }),
              ],
              preview: { select: { title: "name", subtitle: "issuer" } },
            }),
          ],
        }),
        defineField({
          name: "metrics",
          title: "Figures",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              name: "metric",
              fields: [
                defineField({ name: "value", type: "string", validation: (r) => r.required() }),
                defineField({ name: "label", type: "string", validation: (r) => r.required() }),
              ],
              preview: { select: { title: "value", subtitle: "label" } },
            }),
          ],
        }),
        defineField({
          name: "tour",
          title: "Factory-visit note",
          type: "object",
          fields: [
            defineField({ name: "title", type: "string", validation: (r) => r.required() }),
            defineField({ name: "note", type: "string", validation: (r) => r.required() }),
          ],
          options: { collapsible: true, collapsed: true },
        }),
      ],
      options: { collapsible: true, collapsed: true },
      group: "trust",
    }),
    defineField({
      name: "downloads",
      title: "Downloadable files",
      type: "array",
      description:
        "A row renders only when it has a file address — until then the section stays hidden.",
      of: [
        defineArrayMember({
          type: "object",
          name: "download",
          fields: [
            defineField({ name: "name", type: "string", validation: (r) => r.required() }),
            defineField({ name: "format", title: "File type", type: "string", validation: (r) => r.required() }),
            defineField({ name: "size", type: "string", validation: (r) => r.required() }),
            defineField({
              name: "href",
              title: "File address",
              type: "string",
              description: "Paste the file URL. The row is shown only once a file is here.",
            }),
            iconField(),
          ],
          preview: { select: { title: "name", subtitle: "format" } },
        }),
      ],
      group: "trust",
    }),

    /* ── Search and links ─────────────────────────────────────────────────── */
    defineField({ name: "seo", title: "Search engine listing", type: "seo", group: "meta" }),
    defineField({
      name: "faqs",
      title: "Questions & answers",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "faq",
          fields: [
            defineField({ name: "q", title: "Question", type: "string", validation: (r) => r.required().min(8) }),
            defineField({
              name: "a",
              title: "Answer",
              type: "text",
              rows: 4,
              validation: (r) => r.required().min(40).max(700),
            }),
          ],
          preview: { select: { title: "q" } },
        }),
      ],
      group: "meta",
    }),
    /**
     * INTERNAL LINKING, as data.
     *
     * Present on every content file and rendered today only by the guides —
     * but it is authored content, and a migration that quietly dropped it
     * would lose work nobody would notice was gone until the .mdx files were
     * deleted. Carried across on every type for that reason.
     */
    defineField({
      name: "compoundRanking",
      title: "Compounds ranked for this part",
      description: "All eight, best first, each with the reason. The compound selector shows them in this order.",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "ranked",
          fields: [
            defineField({ name: "code", title: "Compound code", type: "string", description: "AEM · FKM · VMQ · EPDM · NBR · CR · SBR · NR", validation: (r) => r.required() }),
            defineField({ name: "rank", title: "Rank", type: "number", validation: (r) => r.required().integer().min(1).max(8) }),
            defineField({ name: "reason", title: "Why", type: "string", validation: (r) => r.required() }),
          ],
          preview: { select: { title: "code", subtitle: "reason", rank: "rank" }, prepare: ({ title, subtitle, rank }) => ({ title: `${rank}. ${title}`, subtitle }) },
        }),
      ],
      group: "specs",
    }),
    defineField({
      name: "relatedParts",
      title: "You may also need",
      description: "Up to four sibling parts, each with the one line that says how it differs from this one.",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "relatedPart",
          fields: [
            defineField({ name: "slug", title: "Part address (last part of the URL)", type: "string", validation: (r) => r.required() }),
            defineField({ name: "difference", title: "How it differs", type: "string", validation: (r) => r.required() }),
          ],
          preview: { select: { title: "slug", subtitle: "difference" } },
        }),
      ],
      validation: (r) => r.max(4),
      group: "trust",
    }),
    defineField({
      name: "related",
      title: "Related pages",
      type: "object",
      description:
        "Web addresses of pages this one should link to. Use the last part of the URL only.",
      fields: [
        defineField({
          name: "products",
          title: "Product categories",
          type: "array",
          of: [defineArrayMember({ type: "string" })],
          options: { layout: "tags" },
        }),
        defineField({
          name: "industries",
          title: "Industries",
          type: "array",
          of: [defineArrayMember({ type: "string" })],
          options: { layout: "tags" },
        }),
        defineField({
          name: "resources",
          title: "Guides",
          type: "array",
          of: [defineArrayMember({ type: "string" })],
          options: { layout: "tags" },
        }),
      ],
      options: { collapsible: true, collapsed: true },
      group: "meta",
    }),
    schemaTypesField,
    defineField({
      name: "confirmWithMargo",
      title: "Figures still to be confirmed",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      group: "meta",
    }),
  ],

  preview: {
    select: { title: "h1", code: "productCode", category: "category", status: "status" },
    prepare: ({ title, code, category, status }) => ({
      title: title || "Untitled part",
      subtitle: [code, category, status].filter(Boolean).join(" · "),
    }),
  },
});
