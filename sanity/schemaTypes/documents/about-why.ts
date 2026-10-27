import { defineArrayMember, defineField, defineType } from "sanity";
import { imageRefField } from "../blocks/_shared.ts";
import {
  actionsField,
  confirmField,
  furtherReadingField,
  formFieldMember,
  listField,
  schemaTypesField,
  pageIdentityFields,
} from "./_marketing.ts";

/**
 * /why-margo and /about — the two largest pages after the products hub.
 *
 * Both fixed structure. Both carry sections whose CONTENT is constrained by
 * something outside the design, and those constraints are written onto the
 * fields, because they are invisible to anyone editing prose later.
 */

const iconList = (values: string[]) => ({
  list: values.map((v) => ({ title: v, value: v })),
});

const statMember = defineArrayMember({
  type: "object",
  name: "pageStat",
  fields: [
    // A blank value is a figure the works has not confirmed yet (OPEN-ITEMS);
    // the sheets leave it empty rather than invent it, and so may the Studio.
    defineField({ name: "value", type: "string" }),
    defineField({ name: "label", type: "string", validation: (r) => r.required() }),
  ],
  preview: { select: { title: "value", subtitle: "label" } },
});

/** eyebrow + heading lines + optional paragraph — on every section of both pages. */
function head({ accents = false, note = false } = {}) {
  return [
    defineField({
      name: "eyebrow",
      title: "Label above the heading",
      type: "string",
      validation: (r) => r.required().min(2),
    }),
    defineField({
      name: "lines",
      title: "Heading lines",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      validation: (r) => r.required().min(1),
    }),
    ...(accents
      ? [
          defineField({
            name: "accentLines",
            title: "Which lines are in accent colour",
            type: "array",
            of: [defineArrayMember({ type: "number" })],
            description: "Line numbers, counting from 0.",
          }),
        ]
      : []),
    defineField({ name: "body", title: "Paragraph", type: "text", rows: 3 }),
    ...(note ? [defineField({ name: "note", title: "Note", type: "string" })] : []),
  ];
}

/* ── /why-margo ───────────────────────────────────────────────────────────── */

export const whyMargoPage = defineType({
  name: "whyMargoPage",
  title: "Why Margo",
  type: "document",
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "company", title: "Heritage & capability" },
    { name: "proof", title: "Quality & standards" },
    { name: "reach", title: "Responsibility & export" },
    { name: "closing", title: "Support & enquiry" },
    { name: "meta", title: "Search" },
  ],
  fields: [
    ...pageIdentityFields("/why-margo"),
    defineField({
      name: "h1",
      title: "Heading as one line",
      type: "string",
      description: "Used by Google. The visible heading is inside the hero below.",
      validation: (r) => r.required().min(8),
      group: "hero",
    }),
    defineField({
      name: "hero",
      title: "Hero",
      type: "object",
      fields: [
        defineField({ name: "eyebrow", title: "Small label above the heading", type: "string", validation: (r) => r.required() }),
        listField("h1Lines", "Heading lines", {
          group: null,
          min: 1,
          description: "Wrap words in *asterisks* to colour them.",
        }),
        defineField({ name: "intro", type: "text", rows: 3, validation: (r) => r.required().min(40) }),
        imageRefField("image", { required: true, group: null }),
        defineField({ name: "stats", type: "array", of: [statMember], validation: (r) => r.required().min(1) }),
        defineField({
          name: "actions",
          title: "Buttons",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              name: "heroAction",
              fields: [
                defineField({ name: "label", type: "string", validation: (r) => r.required() }),
                defineField({ name: "href", title: "Link address", type: "string", validation: (r) => r.required() }),
                defineField({
                  name: "variant",
                  title: "Button style",
                  type: "string",
                  options: {
                    list: [
                      { title: "Solid", value: "primary" },
                      { title: "Outline", value: "secondary" },
                    ],
                    layout: "radio",
                  },
                  initialValue: "primary",
                }),
                defineField({ name: "icon", type: "string", options: iconList(["download"]) }),
              ],
              preview: { select: { title: "label", subtitle: "href" } },
            }),
          ],
          validation: (r) => r.required().min(1),
        }),
      ],
      group: "hero",
    }),

    defineField({
      name: "heritage",
      title: "Heritage",
      type: "object",
      description:
        "The founding year on this page is one of the site's unresolved facts — the sources disagree. Do not adjust it to make the timeline tidy; get it confirmed.",
      fields: [
        ...head(),
        imageRefField("image", { required: true, group: null }),
        defineField({
          name: "milestones",
          title: "Milestones",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              name: "milestone",
              fields: [
                defineField({ name: "year", type: "string", validation: (r) => r.required() }),
                defineField({ name: "body", type: "text", rows: 2, validation: (r) => r.required() }),
              ],
              preview: { select: { title: "year", subtitle: "body" } },
            }),
          ],
          validation: (r) => r.required().min(1),
        }),
        defineField({ name: "stats", type: "array", of: [statMember], validation: (r) => r.required().min(1) }),
        defineField({ name: "note", type: "string", validation: (r) => r.required() }),
      ],
      options: { collapsible: true, collapsed: true },
      group: "company",
    }),

    defineField({
      name: "difference",
      title: "What is different",
      type: "object",
      fields: [
        ...head(),
        defineField({
          name: "items",
          title: "Points",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              name: "differenceItem",
              fields: [
                defineField({ name: "eyebrow", title: "Small label above the heading", type: "string", validation: (r) => r.required() }),
                defineField({ name: "name", type: "string", validation: (r) => r.required() }),
                defineField({ name: "body", type: "text", rows: 3, validation: (r) => r.required() }),
                defineField({ name: "foot", title: "Footer line", type: "string", validation: (r) => r.required() }),
              ],
              preview: { select: { title: "name", subtitle: "eyebrow" } },
            }),
          ],
          validation: (r) => r.required().min(1),
        }),
      ],
      options: { collapsible: true, collapsed: true },
      group: "company",
    }),

    defineField({
      name: "capabilities",
      title: "Capabilities",
      type: "object",
      fields: [
        ...head(),
        imageRefField("banner", { title: "Banner image", required: true, group: null }),
        defineField({ name: "bannerEyebrow", type: "string", validation: (r) => r.required() }),
        listField("bannerLines", "Banner heading lines", { group: null, min: 1 }),
        defineField({
          name: "items",
          title: "Capabilities",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              name: "capabilityItem",
              fields: [
                defineField({
                  name: "icon",
                  type: "string",
                  options: iconList(["gear", "layers", "swap", "extrude", "robot", "tool"]),
                  validation: (r) => r.required(),
                }),
                defineField({ name: "name", type: "string", validation: (r) => r.required() }),
                defineField({ name: "body", type: "text", rows: 2, validation: (r) => r.required() }),
                defineField({ name: "foot", title: "Footer line", type: "string", validation: (r) => r.required() }),
              ],
              preview: { select: { title: "name", subtitle: "foot" } },
            }),
          ],
          validation: (r) => r.required().min(1),
        }),
      ],
      options: { collapsible: true, collapsed: true },
      group: "company",
    }),

    defineField({
      name: "materials",
      title: "Materials table",
      type: "object",
      fields: [
        ...head(),
        defineField({
          name: "items",
          title: "Compounds",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              name: "materialRow",
              fields: [
                defineField({ name: "code", type: "string", validation: (r) => r.required() }),
                defineField({ name: "name", type: "string", validation: (r) => r.required() }),
                defineField({ name: "temp", title: "Temperature range", type: "string", validation: (r) => r.required() }),
                defineField({ name: "hardness", type: "string", validation: (r) => r.required() }),
                defineField({ name: "chemical", title: "Chemical resistance", type: "string", validation: (r) => r.required() }),
                defineField({ name: "industries", type: "string", validation: (r) => r.required() }),
                defineField({ name: "applications", type: "string", validation: (r) => r.required() }),
              ],
              preview: { select: { title: "code", subtitle: "name" } },
            }),
          ],
          validation: (r) => r.required().min(1),
        }),
        defineField({ name: "customNote", type: "text", rows: 2, validation: (r) => r.required() }),
      ],
      options: { collapsible: true, collapsed: true },
      group: "proof",
    }),

    defineField({
      name: "quality",
      title: "Quality",
      type: "object",
      fields: [
        ...head(),
        imageRefField("image", { required: true, group: null }),
        defineField({ name: "imageCaption", type: "string", validation: (r) => r.required() }),
        defineField({ name: "stats", type: "array", of: [statMember], validation: (r) => r.required().min(1) }),
        listField("checks", "Points", { group: null, min: 1 }),
        defineField({ name: "note", type: "string", validation: (r) => r.required() }),
      ],
      options: { collapsible: true, collapsed: true },
      group: "proof",
    }),

    defineField({
      name: "standards",
      title: "Standards",
      type: "object",
      fields: [
        ...head(),
        defineField({
          name: "items",
          title: "Standards",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              name: "standardRow",
              fields: [
                defineField({ name: "code", type: "string", validation: (r) => r.required() }),
                defineField({ name: "suffix", type: "string", validation: (r) => r.required() }),
                defineField({ name: "name", type: "string", validation: (r) => r.required() }),
                defineField({ name: "auditor", type: "string", validation: (r) => r.required() }),
                defineField({ name: "scope", type: "string", validation: (r) => r.required() }),
              ],
              preview: { select: { title: "code", subtitle: "name" } },
            }),
          ],
          validation: (r) => r.required().min(1),
        }),
      ],
      options: { collapsible: true, collapsed: true },
      group: "proof",
    }),

    defineField({
      name: "responsibility",
      title: "Responsibility",
      type: "object",
      fields: [
        ...head(),
        defineField({
          name: "cards",
          title: "Cards",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              name: "responsibilityCard",
              fields: [
                defineField({
                  name: "icon",
                  type: "string",
                  options: iconList(["leaf", "droplet", "recycle", "package"]),
                  validation: (r) => r.required(),
                }),
                defineField({ name: "value", type: "string", validation: (r) => r.required() }),
                defineField({ name: "name", type: "string", validation: (r) => r.required() }),
                defineField({ name: "body", type: "text", rows: 2, validation: (r) => r.required() }),
              ],
              preview: { select: { title: "name", subtitle: "value" } },
            }),
          ],
          validation: (r) => r.required().min(1),
        }),
        defineField({ name: "initiativesHeading", type: "string", validation: (r) => r.required() }),
        listField("initiatives", "Initiatives", { group: null, min: 1 }),
      ],
      options: { collapsible: true, collapsed: true },
      group: "reach",
    }),

    defineField({
      name: "globalExport",
      title: "Global export",
      type: "object",
      fields: [
        ...head(),
        imageRefField("image", { required: true, group: null }),
        defineField({ name: "stats", type: "array", of: [statMember], validation: (r) => r.required().min(1) }),
        defineField({ name: "regionsHeading", type: "string", validation: (r) => r.required() }),
        defineField({
          name: "regions",
          title: "Regions",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              name: "region",
              fields: [
                defineField({ name: "name", type: "string", validation: (r) => r.required() }),
                defineField({ name: "list", title: "Countries", type: "text", rows: 2, validation: (r) => r.required() }),
              ],
              preview: { select: { title: "name", subtitle: "list" } },
            }),
          ],
          validation: (r) => r.required().min(1),
        }),
        defineField({ name: "industriesHeading", type: "string", validation: (r) => r.required() }),
        listField("industries", "Industries", { group: null, min: 1 }),
        defineField({ name: "terms", title: "Trade terms", type: "text", rows: 2, validation: (r) => r.required() }),
      ],
      options: { collapsible: true, collapsed: true },
      group: "reach",
    }),

    defineField({
      name: "support",
      title: "Support",
      type: "object",
      fields: [
        ...head(),
        imageRefField("image", { required: true, group: null }),
        defineField({
          name: "items",
          title: "Points",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              name: "supportItem",
              fields: [
                defineField({ name: "name", type: "string", validation: (r) => r.required() }),
                defineField({ name: "body", type: "text", rows: 2, validation: (r) => r.required() }),
              ],
              preview: { select: { title: "name", subtitle: "body" } },
            }),
          ],
          validation: (r) => r.required().min(1),
        }),
      ],
      options: { collapsible: true, collapsed: true },
      group: "closing",
    }),

    defineField({
      name: "tenure",
      title: "Tenure table",
      type: "object",
      fields: [
        ...head(),
        defineField({
          name: "columns",
          title: "Column headings",
          type: "array",
          of: [defineArrayMember({ type: "string" })],
          description: "Exactly three — the table is built for three columns.",
          validation: (r) => r.required().length(3).error("This table has exactly three columns."),
        }),
        defineField({
          name: "rows",
          title: "Rows",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              name: "tenureRow",
              fields: [
                defineField({ name: "metric", type: "string", validation: (r) => r.required() }),
                defineField({ name: "value", type: "string", validation: (r) => r.required() }),
                defineField({ name: "context", type: "string", validation: (r) => r.required() }),
              ],
              preview: { select: { title: "metric", subtitle: "value" } },
            }),
          ],
          validation: (r) => r.required().min(1),
        }),
      ],
      options: { collapsible: true, collapsed: true },
      group: "closing",
    }),

    defineField({
      name: "feedback",
      title: "Customer quote",
      type: "object",
      description:
        "ATTRIBUTION MUST BE REAL. The design carried a quote credited to a named person at a named company that Margo has not corroborated. A testimonial nobody said is a fabrication, not copy — leave the placeholder until there is a real one.",
      fields: [
        ...head(),
        defineField({ name: "quote", type: "text", rows: 4, validation: (r) => r.required().min(40) }),
        defineField({ name: "initials", type: "string", validation: (r) => r.required() }),
        defineField({ name: "name", type: "string", validation: (r) => r.required() }),
        defineField({ name: "role", type: "string", validation: (r) => r.required() }),
        defineField({ name: "stats", type: "array", of: [statMember], validation: (r) => r.required().min(1) }),
      ],
      options: { collapsible: true, collapsed: true },
      group: "closing",
    }),

    defineField({
      name: "faq",
      title: "Questions & answers",
      type: "object",
      fields: [
        ...head(),
        defineField({
          name: "items",
          title: "Questions",
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
          validation: (r) => r.required().min(1),
        }),
      ],
      options: { collapsible: true, collapsed: true },
      group: "closing",
    }),

    defineField({
      name: "enquiry",
      title: "Enquiry form",
      type: "object",
      fields: [
        defineField({ name: "eyebrow", title: "Small label above the heading", type: "string", validation: (r) => r.required() }),
        listField("lines", "Heading lines", { group: null, min: 1 }),
        defineField({ name: "body", type: "text", rows: 3, validation: (r) => r.required() }),
        defineField({
          name: "contacts",
          title: "Contacts",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              name: "whyContact",
              fields: [
                defineField({
                  name: "icon",
                  type: "string",
                  options: iconList(["pin", "phone", "mail", "clock"]),
                  validation: (r) => r.required(),
                }),
                defineField({ name: "label", type: "string", validation: (r) => r.required() }),
                defineField({ name: "value", type: "string", validation: (r) => r.required() }),
              ],
              preview: { select: { title: "label", subtitle: "value" } },
            }),
          ],
          validation: (r) => r.required().min(1),
        }),
        defineField({ name: "note", type: "string", validation: (r) => r.required() }),
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
  preview: { prepare: () => ({ title: "Why Margo", subtitle: "/why-margo" }) },
});

/* ── /about ───────────────────────────────────────────────────────────────── */

/**
 * /about carries more unverified content than any other page, and the schema
 * says so in three places.
 *
 * The design supplied named executives with stock portraits, a testimonial
 * credited to a named person at a named company, and eight client logos none
 * of which Margo has confirmed. Those are represented as NEUTRAL PLACEHOLDERS
 * so the layout is complete without asserting anything untrue.
 *
 * The risk of moving this page into a CMS is precisely that a placeholder now
 * looks like an empty field waiting to be filled — so the fields that must not
 * be invented say so on the field, where an editor will actually read it.
 */
export const aboutPage = defineType({
  name: "aboutPage",
  title: "About",
  type: "document",
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "story", title: "Story & values" },
    { name: "people", title: "Leadership & team" },
    { name: "operations", title: "Manufacturing & reach" },
    { name: "closing", title: "Recognition & closing" },
    { name: "meta", title: "Search" },
  ],
  fields: [
    ...pageIdentityFields("/about"),
    defineField({
      name: "h1",
      title: "Heading as one line",
      type: "string",
      description: "Used by Google.",
      validation: (r) => r.required().min(8),
      group: "hero",
    }),
    defineField({ name: "badge", title: "Badge above the heading", type: "string", description: "Optional — the sheet leaves it empty on some pages.", group: "hero" }),
    listField("h1Lines", "Heading lines", { group: "hero", min: 1 }),
    defineField({
      name: "h1AccentLines",
      title: "Which heading lines are in accent colour",
      type: "array",
      of: [defineArrayMember({ type: "number" })],
      description: "Line numbers, counting from 0.",
      group: "hero",
    }),
    defineField({
      name: "intro",
      title: "Opening paragraph",
      type: "text",
      rows: 3,
      validation: (r) => r.required().min(40),
      group: "hero",
    }),
    imageRefField("heroImage", { title: "Hero image", required: true, group: "hero" }),
    defineField({ name: "watchLabel", type: "string", description: "Optional.", group: "hero" }),
    defineField({ name: "scrollLabel", type: "string", validation: (r) => r.required(), group: "hero" }),
    actionsField(),
    defineField({
      name: "heroStats",
      title: "Figures under the intro",
      type: "array",
      of: [statMember],
      validation: (r) => r.required().min(1),
      group: "hero",
    }),

    defineField({
      name: "story",
      title: "The story",
      type: "object",
      description:
        "The founding year here is contested across Margo's own sources. It is listed under 'Figures still to be confirmed' — do not resolve it by picking one.",
      fields: [
        ...head({ accents: true, note: true }),
        listField("paragraphs", "Paragraphs", { group: null, min: 1 }),
        listField("checks", "Points", { group: null }),
        defineField({
          name: "badge",
          title: "Badge",
          type: "object",
          fields: [
            defineField({ name: "value", type: "string", validation: (r) => r.required() }),
            defineField({ name: "label", type: "string", validation: (r) => r.required() }),
          ],
        }),
        defineField({
          name: "images",
          title: "Images",
          type: "object",
          fields: [
            imageRefField("main", { title: "Main", required: true, group: null }),
            imageRefField("inset", { title: "Inset", required: true, group: null }),
            imageRefField("lower", { title: "Lower", required: true, group: null }),
          ],
        }),
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
      group: "story",
    }),

    defineField({
      name: "vision",
      title: "Vision & mission",
      type: "object",
      fields: [
        ...head({ accents: true, note: true }),
        defineField({ name: "watermark", title: "Background word", type: "string", validation: (r) => r.required() }),
        defineField({
          name: "items",
          title: "The two panels",
          type: "array",
          description: "Exactly two — this layout is a pair.",
          of: [
            defineArrayMember({
              type: "object",
              name: "visionItem",
              fields: [
                defineField({ name: "icon", type: "string", options: iconList(["target", "bolt"]), validation: (r) => r.required() }),
                defineField({ name: "eyebrow", title: "Small label above the heading", type: "string", validation: (r) => r.required() }),
                defineField({ name: "title", type: "string", validation: (r) => r.required() }),
                defineField({ name: "body", type: "text", rows: 3, validation: (r) => r.required() }),
                defineField({ name: "footIcon", title: "Icon on the footer line", type: "string", options: iconList(["trend", "shield"]), validation: (r) => r.required() }),
                defineField({ name: "foot", title: "Footer line", type: "string", validation: (r) => r.required() }),
                defineField({ name: "footHref", title: "Footer line links to", type: "string", description: "e.g. /export. Leave empty for no link." }),
              ],
              preview: { select: { title: "title", subtitle: "eyebrow" } },
            }),
          ],
          validation: (r) => r.required().length(2).error("This section is a pair — exactly two panels."),
        }),
      ],
      options: { collapsible: true, collapsed: true },
      group: "story",
    }),

    defineField({
      name: "values",
      title: "Values",
      type: "object",
      fields: [
        ...head({ accents: true, note: true }),
        defineField({
          name: "items",
          title: "Values",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              name: "valueItem",
              fields: [
                defineField({
                  name: "icon",
                  type: "string",
                  options: iconList(["shield", "bolt", "globe", "leaf", "users", "target"]),
                  validation: (r) => r.required(),
                }),
                defineField({ name: "name", type: "string", validation: (r) => r.required() }),
                defineField({ name: "body", type: "text", rows: 2, validation: (r) => r.required() }),
              ],
              preview: { select: { title: "name", subtitle: "body" } },
            }),
          ],
          validation: (r) => r.required().min(1),
        }),
      ],
      options: { collapsible: true, collapsed: true },
      group: "story",
    }),

    defineField({
      name: "leadership",
      title: "Leadership quote",
      type: "object",
      description:
        "ATTRIBUTION MUST BE REAL. The design named an executive who has not been confirmed. Leave the neutral placeholder until Margo supplies a real name and role.",
      fields: [
        defineField({ name: "eyebrow", title: "Small label above the heading", type: "string", validation: (r) => r.required() }),
        imageRefField("image", { required: true, group: null }),
        listField("quoteLines", "Quote lines", { group: null, min: 1 }),
        defineField({ name: "quoteAccent", title: "Accented words", type: "string", description: "Optional — leave empty for a quote with no accent." }),
        defineField({ name: "body", type: "text", rows: 3, validation: (r) => r.required() }),
        defineField({
          name: "person",
          title: "Attributed to",
          type: "object",
          fields: [
            defineField({ name: "initials", type: "string", validation: (r) => r.required() }),
            defineField({ name: "name", type: "string", validation: (r) => r.required() }),
            defineField({ name: "role", type: "string", validation: (r) => r.required() }),
          ],
        }),
      ],
      options: { collapsible: true, collapsed: true },
      group: "people",
    }),

    defineField({
      name: "team",
      title: "The team",
      type: "object",
      description:
        "REAL PEOPLE ONLY. The design used stock portraits with invented names. A photograph of someone who does not work at Margo, captioned as though they do, is a fabrication.",
      fields: [
        ...head({ accents: true, note: true }),
        defineField({
          name: "members",
          title: "Members",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              name: "member",
              fields: [
                defineField({ name: "name", type: "string", validation: (r) => r.required() }),
                defineField({ name: "role", type: "string", validation: (r) => r.required() }),
                imageRefField("image", { required: true, group: null }),
                defineField({ name: "body", title: "One-line bio", type: "text", rows: 2 }),
              ],
              preview: { select: { title: "name", subtitle: "role" } },
            }),
          ],
          validation: (r) => r.required().min(1),
        }),
        defineField({ name: "stats", type: "array", of: [statMember], validation: (r) => r.required().min(1) }),
      ],
      options: { collapsible: true, collapsed: true },
      group: "people",
    }),

    defineField({
      name: "manufacturing",
      title: "Manufacturing",
      type: "object",
      fields: [
        ...head({ accents: true, note: true }),
        defineField({
          name: "main",
          title: "Main image",
          type: "object",
          fields: [
            imageRefField("image", { required: true, group: null }),
            defineField({ name: "caption", type: "string", validation: (r) => r.required() }),
          ],
        }),
        defineField({
          name: "side",
          title: "Side images",
          type: "array",
          of: [defineArrayMember({ type: "string" })],
          description: "Image library keys.",
          validation: (r) => r.required().min(1),
        }),
        defineField({
          name: "stats",
          title: "Figures",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              name: "manufacturingStat",
              fields: [
                defineField({ name: "icon", type: "string", options: iconList(["area", "lab", "weight"]), validation: (r) => r.required() }),
                defineField({ name: "value", type: "string", validation: (r) => r.required() }),
                defineField({ name: "label", type: "string", validation: (r) => r.required() }),
              ],
              preview: { select: { title: "value", subtitle: "label" } },
            }),
          ],
          validation: (r) => r.required().min(1),
        }),
        defineField({ name: "portfolioLabel", type: "string", validation: (r) => r.required() }),
        defineField({
          name: "portfolio",
          title: "Portfolio links",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              name: "portfolioLink",
              fields: [
                defineField({ name: "label", type: "string", validation: (r) => r.required() }),
                defineField({ name: "href", title: "Link address", type: "string", validation: (r) => r.required() }),
              ],
              preview: { select: { title: "label", subtitle: "href" } },
            }),
          ],
          validation: (r) => r.required().min(1),
        }),
        defineField({ name: "equipmentLabel", title: "Equipment list heading", type: "string" }),
        defineField({
          name: "equipment",
          title: "Equipment",
          description: "One machine or line per entry. Leave empty to show no list.",
          type: "array",
          of: [defineArrayMember({ type: "string" })],
        }),
      ],
      options: { collapsible: true, collapsed: true },
      group: "operations",
    }),

    defineField({
      name: "presence",
      title: "Global presence",
      type: "object",
      fields: [
        ...head({ accents: true, note: true }),
        imageRefField("image", { required: true, group: null }),
        defineField({
          name: "countries",
          title: "Countries",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              name: "country",
              fields: [
                defineField({ name: "flag", title: "Flag emoji", type: "string", validation: (r) => r.required() }),
                defineField({ name: "name", type: "string", validation: (r) => r.required() }),
                defineField({
                  name: "tier",
                  title: "Tier",
                  type: "number",
                  description: "1 = active trade lane · 2 = reachable market.",
                  options: { list: [{ title: "1 — active lane", value: 1 }, { title: "2 — reachable market", value: 2 }] },
                  initialValue: 1,
                }),
                defineField({ name: "note", title: "Transit note", type: "string", description: "e.g. “18 days, FCL”." }),
              ],
              preview: { select: { title: "name", subtitle: "note" } },
            }),
          ],
          validation: (r) => r.required().min(1),
        }),
        defineField({
          name: "link",
          title: "Link beneath the countries",
          description: "e.g. “See the trade lanes” → /export. Leave empty for no link.",
          type: "object",
          fields: [
            defineField({ name: "label", title: "Link text", type: "string" }),
            defineField({ name: "href", title: "Link address", type: "string" }),
          ],
        }),
        defineField({
          name: "stats",
          title: "Figures",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              name: "presenceStat",
              fields: [
                defineField({ name: "icon", type: "string", options: iconList(["truck", "globe"]), validation: (r) => r.required() }),
                defineField({ name: "value", type: "string", validation: (r) => r.required() }),
                defineField({ name: "label", type: "string", validation: (r) => r.required() }),
                defineField({ name: "note", type: "string" }),
              ],
              preview: { select: { title: "value", subtitle: "label" } },
            }),
          ],
          validation: (r) => r.required().min(1),
        }),
      ],
      options: { collapsible: true, collapsed: true },
      group: "operations",
    }),

    defineField({
      name: "awards",
      title: "Awards & audits",
      type: "object",
      fields: [
        ...head({ accents: true, note: true }),
        defineField({
          name: "items",
          title: "Awards",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              name: "award",
              fields: [
                defineField({
                  name: "icon",
                  type: "string",
                  options: iconList(["medal", "leaf", "flask", "check", "scope", "trophy"]),
                  validation: (r) => r.required(),
                }),
                defineField({ name: "name", type: "string", validation: (r) => r.required() }),
                defineField({ name: "body", type: "text", rows: 2, validation: (r) => r.required() }),
              ],
              preview: { select: { title: "name", subtitle: "body" } },
            }),
          ],
          validation: (r) => r.required().min(1),
        }),
        defineField({ name: "auditedLabel", type: "string", validation: (r) => r.required() }),
        listField("auditors", "Auditors", {
          group: null,
          min: 1,
          description: "Only organisations that have actually audited Margo.",
        }),
        imageRefField("auditImage", { title: "Audit image", required: true, group: null }),
      ],
      options: { collapsible: true, collapsed: true },
      group: "closing",
    }),

    defineField({
      name: "green",
      title: "Sustainability",
      type: "object",
      fields: [
        defineField({
          name: "enabled",
          title: "Show this section",
          type: "boolean",
          description: "Off until the sustainability figures are confirmed. The section is kept, not deleted.",
          initialValue: true,
        }),
        ...head({ accents: true, note: true }),
        imageRefField("image", { required: true, group: null }),
        defineField({
          name: "imageBadge",
          title: "Badge over the image",
          type: "object",
          fields: [
            defineField({ name: "title", type: "string", description: "Optional — the badge is not shown while empty." }),
            defineField({ name: "note", type: "string" }),
          ],
        }),
        defineField({
          name: "bars",
          title: "Progress bars",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              name: "greenBar",
              fields: [
                defineField({ name: "label", type: "string", validation: (r) => r.required() }),
                defineField({ name: "note", type: "string", description: "Optional." }),
                defineField({
                  name: "pct",
                  title: "Percentage",
                  type: "number",
                  description: "0 to 100. This is a claim about Margo's operations — it should be measured, not estimated.",
                  validation: (r) => r.required().min(0).max(100),
                }),
              ],
              preview: { select: { title: "label", subtitle: "pct" } },
            }),
          ],
          validation: (r) => r.required().min(1),
        }),
      ],
      options: { collapsible: true, collapsed: true },
      group: "closing",
    }),

    defineField({
      name: "numbers",
      title: "By the numbers",
      type: "object",
      fields: [
        ...head({ accents: true, note: true }),
        defineField({
          name: "stats",
          title: "Figures",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              name: "numberStat",
              fields: [
                defineField({ name: "value", type: "string", validation: (r) => r.required() }),
                defineField({ name: "label", type: "string", validation: (r) => r.required() }),
                defineField({ name: "note", type: "string", validation: (r) => r.required() }),
              ],
              preview: { select: { title: "value", subtitle: "label" } },
            }),
          ],
          validation: (r) => r.required().min(1),
        }),
        defineField({
          name: "testimonial",
          title: "Testimonial",
          type: "object",
          description:
            "ATTRIBUTION MUST BE REAL — the design credited this to a named person at a named company Margo has not corroborated.",
          fields: [
            defineField({ name: "stars", type: "number", initialValue: 5, validation: (r) => r.required().min(1).max(5) }),
            defineField({ name: "quote", type: "text", rows: 4, validation: (r) => r.required().min(40) }),
            defineField({ name: "initials", type: "string", validation: (r) => r.required() }),
            defineField({ name: "name", type: "string", validation: (r) => r.required() }),
            defineField({ name: "role", type: "string", validation: (r) => r.required() }),
          ],
        }),
        defineField({
          name: "references",
          title: "Reference-check offer",
          description: "When filled, this replaces the testimonial: an offer to put a buyer in touch with a customer, rather than a quote.",
          type: "object",
          fields: [
            defineField({ name: "eyebrow", title: "Small label", type: "string" }),
            defineField({ name: "body", title: "Text", type: "text", rows: 3 }),
          ],
        }),
      ],
      options: { collapsible: true, collapsed: true },
      group: "closing",
    }),

    defineField({
      name: "timeline",
      title: "Timeline",
      type: "object",
      fields: [
        ...head({ accents: true, note: true }),
        defineField({
          name: "items",
          title: "Entries",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              name: "timelineItem",
              fields: [
                defineField({ name: "year", type: "string", validation: (r) => r.required() }),
                defineField({ name: "title", type: "string", validation: (r) => r.required() }),
                defineField({ name: "body", type: "text", rows: 2, validation: (r) => r.required() }),
                defineField({
                  name: "verification",
                  title: "Date status",
                  type: "string",
                  description: "Only verified entries are published. A proposed year never reaches the page.",
                  options: { list: [{ title: "Verified", value: "verified" }, { title: "Proposed — not yet confirmed", value: "proposed" }], layout: "radio" },
                  initialValue: "verified",
                }),
              ],
              preview: { select: { title: "year", subtitle: "title" } },
            }),
          ],
          validation: (r) => r.required().min(1),
        }),
      ],
      options: { collapsible: true, collapsed: true },
      group: "closing",
    }),

    defineField({
      name: "clients",
      title: "Client list",
      type: "object",
      description:
        "NAMED COMPANIES ONLY WITH PERMISSION. The design listed eight client logos, none confirmed. Listing a company as a client without their agreement is a claim Margo cannot support.",
      fields: [
        defineField({ name: "label", type: "string", validation: (r) => r.required() }),
        defineField({
          name: "items",
          title: "Clients",
          type: "array",
          description:
            "One entry per client: name, sector and logo together, in the order they appear on the page. A client without a logo shows its name only.",
          validation: (r) => r.required().min(1),
          of: [
            defineArrayMember({
              type: "object",
              name: "client",
              title: "Client",
              fields: [
                defineField({ name: "name", title: "Client name", type: "string", validation: (r) => r.required() }),
                defineField({ name: "sector", title: "Sector", type: "string", description: "Shown under the name, e.g. Automotive." }),
                defineField({
                  name: "logo",
                  title: "Logo",
                  type: "image",
                  description:
                    "A PNG with a transparent background works best. SVG is not accepted (the site's image optimiser rejects it) — export it as PNG.",
                  options: { accept: "image/png,image/webp,image/jpeg" },
                  fields: [
                    defineField({
                      name: "alt",
                      title: "Description for screen readers",
                      type: "string",
                      description: 'Leave empty for "<client name> logo".',
                    }),
                  ],
                }),
              ],
              preview: { select: { title: "name", subtitle: "sector", media: "logo" } },
            }),
          ],
        }),
      ],
      options: { collapsible: true, collapsed: true },
      group: "closing",
    }),

    defineField({
      name: "closing",
      title: "Closing band",
      type: "object",
      fields: [
        defineField({ name: "eyebrow", title: "Small label above the heading", type: "string", validation: (r) => r.required() }),
        listField("lines", "Heading lines", { group: null, min: 1 }),
        defineField({
          name: "accentLines",
          title: "Which lines are in accent colour",
          type: "array",
          of: [defineArrayMember({ type: "number" })],
        }),
        defineField({ name: "body", type: "text", rows: 3, validation: (r) => r.required() }),
        imageRefField("image", { required: true, group: null }),
        defineField({ name: "placeholder", title: "Field placeholder", type: "string", validation: (r) => r.required() }),
        defineField({ name: "submitLabel", type: "string", validation: (r) => r.required() }),
        listField("assurances", "Reassurance lines", { group: null }),
      ],
      options: { collapsible: true, collapsed: true },
      group: "closing",
    }),

    defineField({ name: "seo", title: "Search engine listing", type: "seo", group: "meta" }),
    schemaTypesField,
    furtherReadingField,
  confirmField,
  ],
  preview: { prepare: () => ({ title: "About", subtitle: "/about" }) },
});

export const LARGE_MARKETING_TYPES = [whyMargoPage, aboutPage];
