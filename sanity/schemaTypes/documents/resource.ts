import { defineArrayMember, defineField, defineType } from "sanity";
import { imageRefField, iconField, linkFields } from "../blocks/_shared.ts";
import { schemaTypesField } from "./_marketing.ts";

/**
 * RESOURCE GUIDE — the eight technical articles.
 *
 * Fixed structure like a SKU, with one difference that matters more than all
 * the rest of this migration put together: it has a BODY.
 *
 * Every other page type moved content that already existed. These eight have
 * none — each .mdx file carries a comment saying the 1,200–2,200 words of
 * material engineering have to come from Margo or a technical writer, and that
 * inventing compound behaviour is the one thing this build will not do.
 *
 * So this is the only document type where the CMS is not a nicer way to edit
 * existing words but the place the words will first be written. If a guide is
 * ever going to exist, it is because somebody at Margo could sit down in
 * Studio and write it. That is the argument for the whole project, made
 * concrete on eight pages.
 */

// The stored values — the same four keys the hub's category list uses.
const CATEGORIES = [
  { title: "Material comparison", value: "material-comparison" },
  { title: "Sizing & specification", value: "sizing-spec" },
  { title: "Sourcing & buyer guides", value: "sourcing-buyer" },
  { title: "Datasheets", value: "datasheets" },
];

export const resource = defineType({
  name: "resource",
  title: "Guide",
  type: "document",
  groups: [
    { name: "article", title: "The guide", default: true },
    { name: "card", title: "How it is listed" },
    { name: "meta", title: "Search & links" },
  ],
  fields: [
    defineField({
      name: "slug",
      title: "Web address",
      type: "slug",
      description: "The last part of the URL: /resources/<this>.",
      options: { source: "navLabel", maxLength: 96 },
      validation: (r) => r.required(),
      group: "article",
    }),
    defineField({
      name: "status",
      title: "Publication status",
      type: "string",
      description:
        "A guide stays on 'Placeholder' until the engineering content has been reviewed. Only 'Published' reaches Google.",
      options: {
        list: [
          { title: "Placeholder — not written yet", value: "placeholder" },
          { title: "Draft — being written", value: "draft" },
          { title: "Published", value: "published" },
        ],
        layout: "radio",
      },
      initialValue: "placeholder",
      validation: (r) => r.required(),
      group: "article",
    }),
    defineField({
      name: "h1",
      title: "Title",
      type: "string",
      validation: (r) => r.required().min(8),
      group: "article",
    }),
    defineField({
      name: "intro",
      title: "Opening paragraph",
      type: "text",
      rows: 3,
      description: "The paragraph under the title. Also used as the card summary.",
      validation: (r) => r.required().min(40),
      group: "article",
    }),

    /**
     * The article itself.
     *
     * H1 and H2 are absent from the style list on purpose: the page supplies
     * the H1, and an author who can pick a second one from a dropdown
     * eventually will. That leaves H3 and H4, which is the real depth a
     * 2,000-word guide needs.
     *
     * Leave it empty and the page renders its "this guide is being written"
     * state, exactly as it does today — so publishing a half-written guide is
     * a deliberate act, not an accident.
     */
    defineField({
      name: "body",
      title: "The guide",
      type: "array",
      description:
        "Leave empty and the page shows its 'being written' notice instead. Aim for 1,200–2,200 words.",
      of: [
        defineArrayMember({
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "Section heading", value: "h2" },
            { title: "Subheading", value: "h3" },
            { title: "Small heading", value: "h4" },
            { title: "Quote", value: "blockquote" },
          ],
          lists: [
            { title: "Bulleted", value: "bullet" },
            { title: "Numbered", value: "number" },
          ],
          marks: {
            decorators: [
              { title: "Bold", value: "strong" },
              { title: "Italic", value: "em" },
            ],
            annotations: [
              {
                name: "link",
                title: "Link",
                type: "object",
                fields: linkFields({ requireLabel: false }),
              },
            ],
          },
        }),
        defineArrayMember({
          type: "object",
          // NOT "image": that is a built-in Sanity type, and reusing the name
          // for an inline array member fails schema validation.
          name: "guideImage",
          title: "Image",
          fields: [
            imageRefField("key", { title: "Image", required: true, group: null }),
            defineField({ name: "caption", title: "Caption", type: "string" }),
          ],
          preview: { select: { title: "key", subtitle: "caption" } },
        }),
        defineArrayMember({
          type: "object",
          name: "guideTable",
          title: "Table",
          fields: [
            defineField({ name: "caption", title: "Caption", type: "string", description: "One line saying what the table shows. Read aloud by screen readers." }),
            defineField({
              name: "columns",
              title: "Column headings",
              type: "array",
              of: [defineArrayMember({ type: "string" })],
              validation: (r) => r.required().min(2),
            }),
            defineField({
              name: "rows",
              title: "Rows",
              description: "One entry per row; cells in the same order as the column headings. Separate cells with a pipe: 25 °C | 70 Shore A | NBR",
              type: "array",
              of: [defineArrayMember({ type: "string" })],
              validation: (r) => r.required().min(1),
            }),
          ],
          preview: { select: { title: "caption" }, prepare: ({ title }) => ({ title: title || "Table" }) },
        }),
        defineArrayMember({
          type: "object",
          name: "callout",
          title: "Answer box",
          description: "The answer up front — a boxed paragraph a reader can take without the rest of the section.",
          fields: [
            defineField({ name: "title", title: "Title", type: "string" }),
            defineField({ name: "body", title: "Text", type: "text", rows: 4, validation: (r) => r.required() }),
          ],
          preview: { select: { title: "title", subtitle: "body" } },
        }),
      ],
      group: "article",
    }),
    defineField({
      name: "eyebrow",
      title: "Line above the heading",
      type: "string",
      description: 'Only where the category and read time are the wrong line — a datasheet reads "TECHNICAL DATASHEET · SPONGE & FOAM RUBBER".',
      group: "article",
    }),
    defineField({
      name: "standfirst",
      title: "Opening paragraph",
      type: "text",
      rows: 3,
      description: "Under the heading on the guide itself. The card blurb on /resources is the short description below.",
      group: "article",
    }),
    defineField({
      name: "closing",
      title: "Closing offer",
      type: "object",
      description: "The paragraph and button at the end of the guide.",
      fields: [
        defineField({ name: "body", title: "Text", type: "text", rows: 3, validation: (r) => r.required() }),
        defineField({
          name: "cta",
          title: "Button",
          type: "object",
          fields: [
            defineField({ name: "label", title: "Button text", type: "string", validation: (r) => r.required() }),
            defineField({ name: "href", title: "Goes to", type: "string", validation: (r) => r.required() }),
          ],
        }),
      ],
      group: "article",
    }),
    defineField({
      name: "publishedAt",
      title: "Published on",
      type: "date",
      description: "Shown in the byline and sent to Google. Leave empty until the guide is live.",
      group: "article",
    }),

    /* ── How it is listed ─────────────────────────────────────────────────── */
    defineField({
      name: "navLabel",
      title: "Short name",
      type: "string",
      description: "Used on cards and in breadcrumbs.",
      validation: (r) => r.required().min(2),
      group: "card",
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: { list: CATEGORIES },
      validation: (r) => r.required(),
      group: "card",
    }),
    iconField("icon", "Card icon"),
    defineField({
      name: "featured",
      title: "Feature on the guides index",
      type: "boolean",
      initialValue: false,
      group: "card",
    }),
    defineField({
      name: "featuredBlurb",
      title: "Blurb on the Start-here card",
      type: "text",
      rows: 2,
      description: "Only the featured guide uses this; the category card shows the opening paragraph.",
      group: "card",
    }),
    defineField({
      name: "readingMinutes",
      title: "Reading time in minutes",
      type: "number",
      description:
        "Shown on the card and above the title. Roughly 200 words a minute.",
      validation: (r) => r.required().min(1).max(60),
      group: "card",
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
        defineField({
          name: "pages",
          title: "Other pages",
          type: "array",
          description: "Any other page on the site, with the words the link shows — e.g. /certifications, “ISO 9001:2015 certification”.",
          of: [
            defineArrayMember({
              type: "object",
              name: "relatedPage",
              fields: [
                defineField({ name: "label", title: "Link text", type: "string", validation: (r) => r.required() }),
                defineField({ name: "href", title: "Web address", type: "string", validation: (r) => r.required() }),
              ],
              preview: { select: { title: "label", subtitle: "href" } },
            }),
          ],
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
    select: { title: "h1", category: "category", status: "status", body: "body" },
    prepare: ({ title, category, status, body }) => {
      const written = Array.isArray(body) && body.length > 0;
      return {
        title: title || "Untitled guide",
        subtitle: `${status ?? "placeholder"} · ${category ?? "—"} · ${
          written ? "written" : "not written yet"
        }`,
      };
    },
  },
});
