import { defineArrayMember, defineField } from "sanity";
import { imageRefField } from "../blocks/_shared.ts";

/**
 * SHARED FIELDS FOR THE MARKETING PAGES
 *
 * Thirteen files, twelve distinct schemas, and no leverage — that is what
 * makes this the expensive part of the migration. Products got eleven pages
 * out of one schema and SKUs thirty-one; here every page is its own shape.
 *
 * What CAN be shared is the small vocabulary they all draw on: a heading split
 * over lines, a row of buttons, a breadcrumb, a form field. Those are here, so
 * that the twelve types differ where the pages genuinely differ and are
 * identical everywhere they do not.
 *
 * All of these pages are FIXED STRUCTURE. Every route renders its sections
 * unconditionally in one order — checked, not assumed — so none of them takes
 * a block list. An editor changes the words, never the arrangement.
 */

export const PAGE_GROUPS = [
  { name: "hero", title: "Top of page", default: true },
  { name: "body", title: "Page content" },
  { name: "meta", title: "Search" },
];

/** slug + status + seo — on every page type, identical every time. */
export function pageIdentityFields(pathHint: string) {
  return [
    defineField({
      name: "slug",
      title: "Page",
      type: "slug",
      description: `Identifies this page (${pathHint}). Do not change it.`,
      readOnly: true,
      validation: (r) => r.required(),
      group: "hero",
    }),
    defineField({
      name: "status",
      title: "Publication status",
      type: "string",
      description:
        "Before launch only 'Published' pages reach Google or the sitemap; once the site is live, every page except 'Draft' does. 'Draft' always stays out of Google — use it to hide a page while it is rewritten.",
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
      group: "hero",
    }),
  ];
}

/**
 * The heading, split over lines, with accent indices.
 *
 * Several of these pages draw their H1 as separate lines with some in accent
 * colour. `h1` remains the flat version the structured data uses — omitting it
 * is what broke every industry page, so it is included here by default rather
 * than remembered.
 */
export function headingFields({ accents = true, group = "hero" } = {}) {
  // Built as one expression rather than pushed into: TypeScript narrows an
  // array's element type from its first literal, so appending a differently
  // shaped field afterwards fails to typecheck.
  const accentField = defineField({
    name: "h1AccentLines",
    title: "Which lines are in accent colour",
    type: "array",
    of: [defineArrayMember({ type: "number" })],
    description: "Line numbers, counting from 0. Leave empty for none.",
    group,
  });

  return [
    defineField({
      name: "h1",
      title: "Heading as one line",
      type: "string",
      description:
        "The same heading written as a single sentence. Used by Google, not shown on the page.",
      validation: (r) => r.required().min(8),
      group,
    }),
    defineField({
      name: "h1Lines",
      title: "Heading lines",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      description: "One entry per line, as it should break on the page.",
      validation: (r) => r.required().min(1),
      group,
    }),
    ...(accents ? [accentField] : []),
  ];
}

/** A row of buttons. */
export function actionsField(
  name = "actions",
  title = "Buttons",
  opts: { group?: string | null; min?: number } = {},
) {
  const { min = 0 } = opts;
  // `null` means "no group"; `undefined` means "not specified, use the
  // default". They cannot be collapsed, because a default parameter value
  // fires on `undefined` — so passing `group: undefined` to opt OUT silently
  // opts IN. That crashed the Studio once already, in imageRefField.
  const group = opts.group === null ? undefined : (opts.group ?? "hero");

  return defineField({
    name,
    title,
    type: "array",
    of: [
      defineArrayMember({
        type: "object",
        name: "action",
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
        ],
        preview: { select: { title: "label", subtitle: "href" } },
      }),
    ],
    validation: (r) => (min > 0 ? r.required().min(min) : r),
    group,
  });
}

/** Eyebrow + heading + optional body, for a section inside a page. */
export function sectionFields(prefix = "") {
  const n = (s: string) => (prefix ? `${prefix}${s[0].toUpperCase()}${s.slice(1)}` : s);
  return [
    defineField({ name: n("eyebrow"), title: "Label above the heading", type: "string", validation: (r) => r.required() }),
    defineField({ name: n("heading"), title: "Heading", type: "string", validation: (r) => r.required() }),
    defineField({ name: n("body"), title: "Intro paragraph", type: "text", rows: 3 }),
  ];
}

/** label/value rows. */
export const labelValueMember = defineArrayMember({
  type: "object",
  name: "pair",
  fields: [
    defineField({ name: "label", type: "string", validation: (r) => r.required() }),
    defineField({ name: "value", type: "string", validation: (r) => r.required() }),
  ],
  preview: { select: { title: "label", subtitle: "value" } },
});

/** A plain string list. */
export function listField(
  name: string,
  title: string,
  opts: { group?: string | null; min?: number; description?: string } = {},
) {
  const { min = 0, description = "" } = opts;
  const group = opts.group === null ? undefined : (opts.group ?? "body");

  return defineField({
    name,
    title,
    type: "array",
    of: [defineArrayMember({ type: "string" })],
    description: description || undefined,
    validation: (r) => (min > 0 ? r.required().min(min) : r),
    group,
  });
}

/**
 * One field on an enquiry form.
 *
 * `name` is the STABLE KEY the submission is keyed by — it reaches the
 * database and the enquiry mapper, not the visitor. Renaming it silently
 * changes what an enquiry looks like on the other end, so it says so.
 */
export function formFieldMember(
  types: Array<{ title: string; value: string }>,
  extra: ReturnType<typeof defineField>[] = [],
) {
  return defineArrayMember({
    type: "object",
    name: "formField",
    fields: [
      defineField({
        name: "name",
        title: "Field id",
        type: "string",
        description:
          "Internal name this answer is stored under. Changing it changes how enquiries arrive — leave it alone unless you know why.",
        validation: (r) => r.required(),
      }),
      defineField({ name: "label", title: "Label shown", type: "string", validation: (r) => r.required() }),
      defineField({ name: "placeholder", title: "Placeholder", type: "string", validation: (r) => r.required() }),
      defineField({
        name: "type",
        title: "Kind of field",
        type: "string",
        options: { list: types },
        initialValue: types[0]?.value,
      }),
      ...extra,
    ],
    preview: { select: { title: "label", subtitle: "name" } },
  });
}

/**
 * The guides a page sends its reader on to — a "Further reading" strip
 * before the closing call-to-action, listing only guides that are
 * published. The guide sheets name the pages: the evaluation checklist
 * from /about and /certifications (RES_06), the sourcing comparison from
 * /export (RES_07).
 */
export const furtherReadingField = defineField({
  name: "furtherReading",
  title: "Further reading",
  type: "array",
  of: [defineArrayMember({ type: "string" })],
  options: { layout: "tags" },
  description: "Guides to list before the closing call-to-action. Use the last part of the guide's URL only, e.g. how-to-evaluate-a-rubber-manufacturer. Unpublished guides are not shown.",
  group: "meta",
});

/** confirmWithMargo — on every type. */
export const confirmField = defineField({
  name: "confirmWithMargo",
  title: "Figures still to be confirmed",
  type: "array",
  of: [defineArrayMember({ type: "string" })],
  description: "Anything on this page Margo has not signed off. Listed in the build report.",
  group: "meta",
});


/**
 * Which structured-data types the page emits.
 *
 * HIDDEN, not omitted. It is a developer decision, not an editorial one — an
 * editor changing it would silently alter what Google is told about the page.
 * But it has to be DECLARED, because the migration writes it: an undeclared
 * field shows up in Studio as "Unknown fields found" with a Remove button
 * beside it, which invites an editor to delete real data to make a warning go
 * away.
 */
export const schemaTypesField = defineField({
  name: "schemaTypes",
  title: "Structured data types",
  type: "array",
  of: [defineArrayMember({ type: "string" })],
  hidden: true,
  readOnly: true,
});


/**
 * The shared hero image + alt that every content type inherits.
 *
 * Some pages define a richer hero of their own and never use this one; three
 * carry it. Declaring it only where it is used keeps the others' forms clean —
 * but it MUST be declared where the data exists, or Studio shows the editor an
 * "Unknown field" warning with a Remove button beside real content.
 */
export const baseHeroField = defineField({
  name: "hero",
  title: "Hero image",
  type: "object",
  fields: [
    imageRefField("image", { required: true, group: null }),
    defineField({
      name: "alt",
      title: "Description for screen readers",
      type: "string",
      validation: (r) => r.required().min(10),
    }),
  ],
  group: "hero",
});
