import { defineArrayMember, defineField, defineType } from "sanity";
import { PAGE_GROUPS, pageIdentityFields } from "./_marketing.ts";

/**
 * /manufacturing — the process page (3rd Shade keyword pack K5, 25 Oct 2026).
 *
 * One article-shaped page: an H1, an answer paragraph (rendered by the route
 * from src/content/answer-blocks.ts, like /export), then H2 sections of
 * prose, bullet lists and small tables, and a closing CTA.
 *
 * Sections are structured — heading, paragraphs, bullets, one optional table
 * — rather than free portable text, so the page stays checkable the way the
 * category pages are, and the .mdx fallback can carry the identical content.
 * Table rows are pipe-separated strings, exactly as the resource guides'
 * tables already store them (Sanity arrays cannot nest arrays).
 */
export const manufacturingPage = defineType({
  name: "manufacturingPage",
  title: "Manufacturing page",
  type: "document",
  groups: PAGE_GROUPS,
  fields: [
    ...pageIdentityFields("/manufacturing"),
    defineField({
      name: "h1",
      title: "Heading",
      type: "string",
      validation: (r) => r.required().min(8),
      group: "hero",
    }),
    defineField({
      name: "standfirst",
      title: "Line under the heading",
      type: "text",
      rows: 2,
      description: "One short sentence; the answer paragraph itself is fixed in code with the other answer blocks.",
      group: "hero",
    }),
    defineField({
      name: "sections",
      title: "Sections",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "processSection",
          fields: [
            defineField({ name: "heading", title: "Heading", type: "string", validation: (r) => r.required().min(4) }),
            defineField({
              name: "intro",
              title: "Paragraphs",
              type: "text",
              rows: 6,
              description: "Blank line between paragraphs. **Bold** and [text](/path) render as written.",
            }),
            defineField({
              name: "bullets",
              title: "Bullet list",
              type: "array",
              of: [defineArrayMember({ type: "string" })],
            }),
            defineField({
              name: "table",
              title: "Table",
              type: "object",
              fields: [
                defineField({
                  name: "columns",
                  title: "Column headings",
                  type: "array",
                  of: [defineArrayMember({ type: "string" })],
                  validation: (r) => r.min(2),
                }),
                defineField({
                  name: "rows",
                  title: "Rows",
                  type: "array",
                  description: "One row per entry, cells separated by | — e.g. 10 | Raw material receipt | …",
                  of: [defineArrayMember({ type: "string" })],
                }),
                defineField({ name: "caption", title: "Caption", type: "string" }),
              ],
            }),
            defineField({
              name: "outro",
              title: "Paragraphs after the table",
              type: "text",
              rows: 4,
            }),
          ],
          preview: {
            select: { title: "heading", rows: "table.rows" },
            prepare: ({ title, rows }) => ({
              title: title || "Section",
              subtitle: Array.isArray(rows) && rows.length ? `${rows.length}-row table` : undefined,
            }),
          },
        }),
      ],
      validation: (r) => r.required().min(3),
      group: "body",
    }),
    defineField({
      name: "cta",
      title: "Closing button",
      type: "object",
      fields: [
        defineField({ name: "label", title: "Button text", type: "string", validation: (r) => r.required() }),
        defineField({ name: "href", title: "Goes to", type: "string", validation: (r) => r.required() }),
      ],
      group: "body",
    }),
    defineField({ name: "seo", title: "Search engine listing", type: "seo", group: "meta" }),
  ],
  preview: {
    prepare: () => ({ title: "Manufacturing", subtitle: "/manufacturing" }),
  },
});
