import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * Shared objects. Every document type reuses these rather than redeclaring
 * the same fields, which is what keeps 17 page types from drifting apart.
 */

/**
 * SEO.
 *
 * The character limits are the ones the Zod schema already enforces at build
 * time. Here they become live counters and warnings in the editor, so the
 * manager sees "142 / 160" as they type instead of a developer seeing a
 * failed build afterwards.
 */
export const seo = defineType({
  name: "seo",
  title: "Search appearance",
  type: "object",
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({
      name: "title",
      title: "Title in Google",
      type: "string",
      description: "The blue headline in search results. Google cuts it around 60 characters.",
      validation: (r) => r.required().min(10).max(70),
    }),
    defineField({
      name: "description",
      title: "Description in Google",
      type: "text",
      rows: 3,
      description: "The grey text under the headline. Between 50 and 160 characters.",
      validation: (r) => r.required().min(50).max(200),
    }),
    defineField({
      name: "primaryKeyword",
      title: "Main search term",
      type: "string",
      description: "The one phrase this page should rank for. Optional.",
    }),
    defineField({
      name: "secondaryKeywords",
      title: "Other search terms",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      description:
        "Reference only — these are not written into the page. They record what it was written to rank for.",
      options: { layout: "tags" },
    }),
  ],
});

/** One block inside a legal section: paragraph, subheading, list or note. */
export const legalBlock = defineType({
  name: "legalBlock",
  title: "Block",
  type: "object",
  fields: [
    defineField({
      name: "kind",
      title: "Type",
      type: "string",
      options: {
        list: [
          { title: "Paragraph", value: "p" },
          { title: "Subheading", value: "h" },
          { title: "Bullet list", value: "ul" },
          { title: "Highlighted note", value: "note" },
        ],
        layout: "radio",
      },
      initialValue: "p",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "text",
      title: "Text",
      type: "text",
      rows: 3,
      // Shown for everything except a list, which needs its own repeating field.
      hidden: ({ parent }) => parent?.kind === "ul",
      validation: (r) =>
        r.custom((value, ctx) => {
          const kind = (ctx.parent as { kind?: string })?.kind;
          if (kind !== "ul" && !value) return "Required";
          return true;
        }),
    }),
    defineField({
      name: "items",
      title: "List items",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      hidden: ({ parent }) => parent?.kind !== "ul",
      validation: (r) =>
        r.custom((value, ctx) => {
          const kind = (ctx.parent as { kind?: string })?.kind;
          if (kind === "ul" && (!value || value.length === 0)) {
            return "Add at least one item";
          }
          return true;
        }),
    }),
  ],
  preview: {
    select: { kind: "kind", text: "text", items: "items" },
    prepare: ({ kind, text, items }) => ({
      title: text ?? (items?.[0] as string) ?? "Empty",
      subtitle:
        { p: "Paragraph", h: "Subheading", ul: "Bullet list", note: "Note" }[
          kind as string
        ] ?? kind,
    }),
  },
});

/** A numbered section of a legal document, with its own anchor. */
export const legalSection = defineType({
  name: "legalSection",
  title: "Section",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Section heading",
      type: "string",
      validation: (r) => r.required().min(3),
    }),
    defineField({
      name: "id",
      title: "Anchor",
      type: "slug",
      description:
        "Used in the link to this section. Existing links break if it changes.",
      options: { source: "title", maxLength: 64 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "navLabel",
      title: "Short label for the contents list",
      type: "string",
      description: "Optional. Falls back to the section heading.",
    }),
    defineField({
      name: "blocks",
      title: "Content",
      type: "array",
      of: [defineArrayMember({ type: "legalBlock" })],
    }),
  ],
  preview: {
    select: { title: "title", blocks: "blocks" },
    prepare: ({ title, blocks }) => ({
      title,
      subtitle: `${blocks?.length ?? 0} block${blocks?.length === 1 ? "" : "s"}`,
    }),
  },
});
