import { defineArrayMember, defineField, defineType } from "sanity";
import { imageRefField } from "../blocks/_shared.ts";
import {
  actionsField,
  confirmField,
  formFieldMember,
  listField,
  schemaTypesField,
  pageIdentityFields,
} from "./_marketing.ts";

/**
 * THE HOMEPAGE
 *
 * Eleven sections, fixed order, fixed structure — the route renders every one
 * of them unconditionally.
 *
 * Two conventions run through this page and both are easy to break by tidying:
 *
 *  · `*asterisks*` mark the accent colour inside a heading line. They are
 *    markup, not punctuation. Removing a pair does not remove emphasis; it
 *    prints literal asterisks on the largest text on the site.
 *
 *  · Several icon fields are CLOSED LISTS drawn from a map in the component.
 *    A value outside the list renders an empty tile silently, which is why
 *    they are dropdowns rather than free text.
 */

const iconList = (values: string[]) => ({
  list: values.map((v) => ({ title: v, value: v })),
});

/**
 * Every section on this page opens the same way: a small label, a heading
 * split over lines, and an optional paragraph.
 */
function homeHead({ lines = true } = {}) {
  return [
    defineField({
      name: "eyebrow",
      title: "Label above the heading",
      type: "string",
      validation: (r) => r.required().min(2),
    }),
    ...(lines
      ? [
          defineField({
            name: "lines",
            title: "Heading lines",
            type: "array",
            of: [defineArrayMember({ type: "string" })],
            description:
              "One entry per line. Wrap words in *asterisks* to colour them — the asterisks are markup and print literally if left unpaired.",
            validation: (r) => r.required().min(1),
          }),
        ]
      : []),
    defineField({ name: "body", title: "Paragraph", type: "text", rows: 3 }),
  ];
}

/** An optional link on an item that is usually plain text. */
const optionalHref = (description: string) =>
  defineField({
    name: "href",
    title: "Link address",
    type: "string",
    description,
  });

const statMember = defineArrayMember({
  type: "object",
  name: "homeStat",
  fields: [
    defineField({ name: "value", type: "string", validation: (r) => r.required() }),
    defineField({ name: "label", type: "string", validation: (r) => r.required() }),
  ],
  preview: { select: { title: "value", subtitle: "label" } },
});

export const homePage = defineType({
  name: "homePage",
  title: "Home",
  type: "document",
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "upper", title: "Story, edge & portfolio" },
    { name: "lower", title: "Sectors, process & facility" },
    { name: "closing", title: "Export, materials & enquiry" },
    { name: "meta", title: "Search" },
  ],
  fields: [
    ...pageIdentityFields("/"),
    defineField({
      name: "h1",
      title: "Heading as one line",
      type: "string",
      description: "Used by Google. The visible heading is inside the hero below.",
      validation: (r) => r.required().min(8),
      group: "hero",
    }),

    /* ── Hero ─────────────────────────────────────────────────────────────── */
    defineField({
      name: "hero",
      title: "Hero",
      type: "object",
      fields: [
        ...homeHead({ lines: false }),
        listField("h1Lines", "Heading lines", {
          group: null,
          min: 1,
          description:
            "The largest text on the site. Wrap words in *asterisks* to colour them.",
        }),
        defineField({ name: "intro", type: "text", rows: 3, validation: (r) => r.required().min(40) }),
        defineField({
          name: "mobileIntro",
          title: "Shorter intro for phones (optional)",
          description:
            "Shown instead of the intro above on screens under 768px wide, so the hero stays clean over the image. Leave empty to show the full intro on phones too. Keep it to one or two short sentences (about 100 characters). It has no links.",
          type: "text",
          rows: 2,
          validation: (r) => r.max(160),
        }),
        imageRefField("image", { required: true, group: null }),
        actionsField("actions", "Buttons", { group: null, min: 1 }),
        defineField({
          name: "chips",
          title: "Quick links",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              name: "chip",
              fields: [
                defineField({ name: "label", type: "string", validation: (r) => r.required() }),
                defineField({ name: "href", title: "Link address", type: "string", validation: (r) => r.required() }),
              ],
              preview: { select: { title: "label", subtitle: "href" } },
            }),
          ],
          validation: (r) => r.required().min(1),
        }),
        defineField({
          name: "introLinks",
          title: "Links inside the intro",
          description:
            "Phrases from the intro paragraph that should link out, exactly as written there. The first match of each is linked.",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              name: "introLink",
              fields: [
                defineField({ name: "label", title: "Phrase in the intro", type: "string", validation: (r) => r.required() }),
                defineField({ name: "href", title: "Link address", type: "string", validation: (r) => r.required() }),
              ],
              preview: { select: { title: "label", subtitle: "href" } },
            }),
          ],
        }),
        defineField({
          name: "cards",
          title: "Figure cards",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              name: "heroCard",
              fields: [
                defineField({ name: "value", type: "string", validation: (r) => r.required() }),
                defineField({ name: "label", type: "string", validation: (r) => r.required() }),
                defineField({ name: "icon", type: "string", options: iconList(["ribbon"]) }),
              ],
              preview: { select: { title: "value", subtitle: "label" } },
            }),
          ],
          validation: (r) => r.required().min(1),
        }),
      ],
      group: "hero",
    }),

    defineField({
      name: "trustbar",
      title: "Trust bar",
      type: "object",
      fields: [
        defineField({ name: "label", type: "string", validation: (r) => r.required() }),
        listField("items", "Items", { group: null, min: 1 }),
      ],
      group: "hero",
    }),

    /* ── Story, edge, portfolio ───────────────────────────────────────────── */
    defineField({
      name: "story",
      title: "The company story",
      type: "object",
      fields: [
        ...homeHead(),
        listField("paragraphs", "Paragraphs", { group: null, min: 1 }),
        imageRefField("image", { required: true, group: null }),
        defineField({ name: "imageBadge", title: "Badge over the image", type: "string", validation: (r) => r.required() }),
        defineField({
          name: "floatCard",
          title: "Floating card",
          type: "object",
          fields: [
            defineField({ name: "title", type: "string", validation: (r) => r.required() }),
            defineField({ name: "body", type: "text", rows: 2, validation: (r) => r.required() }),
            optionalHref("Where the card leads when clicked, e.g. /certifications. Leave empty for no link."),
          ],
        }),
        defineField({ name: "stats", title: "Figures", type: "array", of: [statMember], validation: (r) => r.required().min(1) }),
        defineField({
          name: "cta",
          title: "Button",
          type: "object",
          fields: [
            defineField({ name: "label", type: "string", validation: (r) => r.required() }),
            defineField({ name: "href", title: "Link address", type: "string", validation: (r) => r.required() }),
          ],
        }),
      ],
      options: { collapsible: true, collapsed: true },
      group: "upper",
    }),

    defineField({
      name: "edge",
      title: "Why Margo",
      type: "object",
      fields: [
        ...homeHead(),
        defineField({
          name: "items",
          title: "Points",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              name: "edgeItem",
              fields: [
                defineField({
                  name: "icon",
                  type: "string",
                  options: iconList(["shield", "bolt", "gear", "globe", "layers", "ribbon"]),
                  validation: (r) => r.required(),
                }),
                defineField({ name: "name", type: "string", validation: (r) => r.required() }),
                defineField({ name: "body", type: "text", rows: 2, validation: (r) => r.required() }),
                optionalHref("Where the point leads when clicked. Leave empty for no link."),
              ],
              preview: { select: { title: "name", subtitle: "body" } },
            }),
          ],
          validation: (r) => r.required().min(1),
        }),
      ],
      options: { collapsible: true, collapsed: true },
      group: "upper",
    }),

    defineField({
      name: "portfolio",
      title: "Product tiles",
      type: "object",
      fields: [
        ...homeHead(),
        defineField({
          name: "cta",
          title: "Button",
          type: "object",
          fields: [
            defineField({ name: "label", type: "string", validation: (r) => r.required() }),
            defineField({ name: "href", title: "Link address", type: "string", validation: (r) => r.required() }),
          ],
        }),
        defineField({
          name: "items",
          title: "Tiles",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              name: "portfolioItem",
              fields: [
                defineField({ name: "name", type: "string", validation: (r) => r.required() }),
                defineField({
                  name: "spec",
                  title: "Standards line",
                  type: "string",
                  description: 'The strip under the name, e.g. "AS568 / BS1806 / Metric".',
                  validation: (r) => r.required(),
                }),
                imageRefField("image", { required: true, group: null }),
                defineField({ name: "href", title: "Link address", type: "string", validation: (r) => r.required() }),
              ],
              preview: { select: { title: "name", subtitle: "spec" } },
            }),
          ],
          validation: (r) => r.required().min(1),
        }),
      ],
      options: { collapsible: true, collapsed: true },
      group: "upper",
    }),

    /* ── Sectors, process, facility ───────────────────────────────────────── */
    defineField({
      name: "sectors",
      title: "Sectors",
      type: "object",
      fields: [
        ...homeHead(),
        defineField({
          name: "items",
          title: "Sectors",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              name: "homeSector",
              fields: [
                defineField({
                  name: "icon",
                  type: "string",
                  description:
                    "A value outside this list renders a blank tile, so the list is closed rather than free text.",
                  options: iconList([
                    "car", "heart", "chip", "droplet", "wrench", "package",
                    "pickaxe", "fuel", "gauge", "wind", "leaf",
                  ]),
                  validation: (r) => r.required(),
                }),
                defineField({ name: "name", type: "string", validation: (r) => r.required() }),
                defineField({ name: "body", type: "text", rows: 2, validation: (r) => r.required() }),
                defineField({ name: "href", title: "Link address", type: "string", validation: (r) => r.required() }),
              ],
              preview: { select: { title: "name", subtitle: "body" } },
            }),
          ],
          validation: (r) => r.required().min(1),
        }),
      ],
      options: { collapsible: true, collapsed: true },
      group: "lower",
    }),

    defineField({
      name: "process",
      title: "How we work",
      type: "object",
      fields: [
        ...homeHead(),
        defineField({
          name: "steps",
          title: "Steps",
          type: "array",
          description: "Numbered on the page in this order.",
          of: [
            defineArrayMember({
              type: "object",
              name: "homeStep",
              fields: [
                defineField({ name: "name", type: "string", validation: (r) => r.required() }),
                defineField({ name: "body", type: "text", rows: 2, validation: (r) => r.required() }),
                optionalHref("Where the step leads, e.g. /contact for the brief. Leave empty for no link."),
              ],
              preview: { select: { title: "name", subtitle: "body" } },
            }),
          ],
          validation: (r) => r.required().min(1),
        }),
      ],
      options: { collapsible: true, collapsed: true },
      group: "lower",
    }),

    defineField({
      name: "facility",
      title: "The facility",
      type: "object",
      fields: [
        ...homeHead(),
        imageRefField("image", { required: true, group: null }),
        imageRefField("inset", { title: "Inset image", required: true, group: null }),
        defineField({ name: "badge", type: "string", description: "Optional." }),
        listField("checks", "Points", { group: null, min: 1 }),
        defineField({
          name: "stats",
          title: "Figures beneath the points",
          description: "The stat row: value and label. Leave empty to show none.",
          type: "array",
          of: [statMember],
        }),
      ],
      options: { collapsible: true, collapsed: true },
      group: "lower",
    }),

    /* ── Export, materials, enquiry ───────────────────────────────────────── */
    defineField({
      name: "exportMarkets",
      title: "Export markets",
      type: "object",
      fields: [
        ...homeHead(),
        defineField({
          name: "standfirst",
          title: "Paragraph under the heading",
          type: "text",
          rows: 3,
        }),
        listField("linesVision", "Heading lines — concept build only", {
          group: null,
          description: "Shown instead of the heading lines on the password-protected concept build. Leave empty to reuse the heading above.",
        }),
        defineField({
          name: "standfirstVision",
          title: "Paragraph — concept build only",
          type: "text",
          rows: 3,
          description: "Shown instead of the paragraph on the concept build. Leave empty to reuse it.",
        }),
        defineField({
          name: "hub",
          title: "Hub marker",
          type: "object",
          description: "Percentage coordinates on the map plate — 0 to 100, not pixels.",
          fields: [
            defineField({ name: "label", type: "string", validation: (r) => r.required() }),
            defineField({ name: "x", type: "number", validation: (r) => r.required().min(0).max(100) }),
            defineField({ name: "y", type: "number", validation: (r) => r.required().min(0).max(100) }),
          ],
        }),
        defineField({
          name: "lanes",
          title: "Trade lanes",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              name: "lane",
              fields: [
                defineField({
                  name: "code",
                  title: "Country code",
                  type: "string",
                  description: "Exactly two letters.",
                  validation: (r) => r.required().length(2),
                }),
                defineField({ name: "name", type: "string", validation: (r) => r.required() }),
                defineField({ name: "note", type: "string", validation: (r) => r.required() }),
                defineField({ name: "x", type: "number", validation: (r) => r.required().min(0).max(100) }),
                defineField({ name: "y", type: "number", validation: (r) => r.required().min(0).max(100) }),
                optionalHref("The market's block on the export page, e.g. /export#uk."),
              ],
              preview: { select: { title: "name", subtitle: "note" } },
            }),
          ],
          validation: (r) => r.required().min(1),
        }),
        defineField({
          name: "pins",
          title: "Extra map pins",
          description: "Pins on the map that have no lane card beneath. Percentage coordinates, 0 to 100.",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              name: "pin",
              fields: [
                defineField({ name: "label", type: "string", validation: (r) => r.required() }),
                defineField({ name: "x", type: "number", validation: (r) => r.required().min(0).max(100) }),
                defineField({ name: "y", type: "number", validation: (r) => r.required().min(0).max(100) }),
              ],
              preview: { select: { title: "label" } },
            }),
          ],
        }),
        defineField({ name: "note", type: "text", rows: 2, validation: (r) => r.required() }),
        defineField({
          name: "noteLink",
          title: "Link after the note",
          description: "e.g. “See all 95 markets” → /export. Leave empty for no link.",
          type: "object",
          fields: [
            defineField({ name: "label", title: "Link text", type: "string" }),
            defineField({ name: "href", title: "Link address", type: "string" }),
          ],
        }),
      ],
      options: { collapsible: true, collapsed: true },
      group: "closing",
    }),

    defineField({
      name: "materials",
      title: "Materials chart",
      type: "object",
      description:
        "The rows come from the shared compound list in code, so the table has one source of truth. Only the axis and footnote are editable here.",
      fields: [
        ...homeHead(),
        defineField({
          name: "axis",
          title: "Temperature axis",
          type: "object",
          fields: [
            defineField({ name: "min", type: "number", validation: (r) => r.required() }),
            defineField({ name: "mid", type: "number", validation: (r) => r.required() }),
            defineField({ name: "max", type: "number", validation: (r) => r.required() }),
          ],
        }),
        defineField({ name: "footnote", type: "string", validation: (r) => r.required() }),
      ],
      options: { collapsible: true, collapsed: true },
      group: "closing",
    }),

    defineField({
      name: "cta",
      title: "Closing enquiry band",
      type: "object",
      fields: [
        ...homeHead(),
        defineField({
          name: "panel",
          title: "Panel beside the form",
          type: "object",
          fields: [
            defineField({ name: "badge", type: "string", description: "Optional." }),
            defineField({ name: "title", type: "string", validation: (r) => r.required() }),
            defineField({ name: "body", type: "text", rows: 3, validation: (r) => r.required() }),
            imageRefField("image", { required: true, group: null }),
            defineField({ name: "stats", type: "array", of: [statMember], validation: (r) => r.required().min(1) }),
          ],
        }),
        defineField({
          name: "fields",
          title: "Form fields",
          type: "array",
          of: [
            formFieldMember(
              [
                { title: "Single line", value: "text" },
                { title: "Email", value: "email" },
                { title: "Telephone", value: "tel" },
                { title: "Dropdown", value: "select" },
                { title: "Paragraph", value: "textarea" },
              ],
              [
                defineField({
                  name: "options",
                  title: "Dropdown options",
                  type: "array",
                  of: [defineArrayMember({ type: "string" })],
                  hidden: ({ parent }) => parent?.type !== "select",
                }),
                defineField({ name: "required", type: "boolean", initialValue: true }),
                defineField({ name: "full", title: "Full width", type: "boolean", initialValue: false }),
              ],
            ),
          ],
          validation: (r) => r.required().min(1),
        }),
        defineField({
          name: "uploadLabel",
          title: "Attachment label",
          type: "string",
          description:
            "The drawing-upload affordance is NOT yet wired to a storage provider — it renders but accepts nothing. Wording here should not promise more than that until it is.",
          validation: (r) => r.required(),
        }),
        defineField({ name: "uploadHint", title: "Attachment hint", type: "string", validation: (r) => r.required() }),
        defineField({ name: "submitLabel", type: "string", validation: (r) => r.required() }),
        defineField({ name: "footnote", type: "string", validation: (r) => r.required() }),
      ],
      options: { collapsible: true, collapsed: true },
      group: "closing",
    }),

    defineField({ name: "seo", title: "Search engine listing", type: "seo", group: "meta" }),
    schemaTypesField,
  confirmField,
  ],

  preview: { prepare: () => ({ title: "Home", subtitle: "/" }) },
});
