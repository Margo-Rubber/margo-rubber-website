import { defineArrayMember, defineField, defineType } from "sanity";
import { imageRefField } from "../blocks/_shared.ts";
import {
  PAGE_GROUPS,
  actionsField,
  baseHeroField,
  confirmField,
  formFieldMember,
  headingFields,
  listField,
  schemaTypesField,
  pageIdentityFields,
  sectionFields,
} from "./_marketing.ts";

/**
 * /products — the largest single page on the site.
 *
 * Eighty-eight fields across eleven sections, which is why the earlier
 * estimate that treated it as "one more page" was wrong. It is the products
 * hub, the compound guide, the process explainer, the certification summary
 * and the closing enquiry form, all on one URL.
 *
 * Fixed structure, like every marketing page: the route renders these sections
 * unconditionally in one order. Most are optional in the schema, so a section
 * left empty simply does not render — which is how the page was built up
 * incrementally and how it can be trimmed without a developer.
 */

const iconList = (values: string[]) => ({
  list: values.map((v) => ({ title: v, value: v })),
});

export const productsHub = defineType({
  name: "productsHub",
  title: "Products page",
  type: "document",
  groups: [
    ...PAGE_GROUPS.slice(0, 2),
    { name: "sections", title: "Lower sections" },
    PAGE_GROUPS[2],
  ],
  fields: [
    ...pageIdentityFields("/products"),
    baseHeroField,
    defineField({ name: "badge", title: "Badge above the heading", type: "string", validation: (r) => r.required(), group: "hero" }),
    ...headingFields(),
    defineField({
      name: "intro",
      title: "Opening paragraph",
      type: "text",
      rows: 3,
      validation: (r) => r.required().min(40),
      group: "hero",
    }),
    actionsField(),
    defineField({
      name: "heroStats",
      title: "Figures under the intro",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "heroStat",
          fields: [
            defineField({ name: "value", type: "string", validation: (r) => r.required() }),
            defineField({ name: "label", type: "string", validation: (r) => r.required() }),
            defineField({ name: "sub", title: "Caption", type: "string" }),
            defineField({ name: "icon", type: "string", options: iconList(["award", "globe", "chart", "shield"]) }),
          ],
          preview: { select: { title: "value", subtitle: "label" } },
        }),
      ],
      group: "hero",
    }),
    defineField({ name: "heroDivider", title: "Divider caption", type: "string", group: "hero" }),
    listField("marquee", "Scrolling strip", {
      group: "hero",
      description: "The words that scroll across under the hero.",
    }),

    /* ── The range ────────────────────────────────────────────────────────── */
    defineField({
      name: "range",
      title: "The product range",
      type: "object",
      description: "The 3×3 grid of category cards. Order here is order on the page.",
      fields: [
        ...sectionFields(),
        defineField({ name: "watermark", title: "Background word", type: "string" }),
        defineField({
          name: "filters",
          title: "Filter chips",
          type: "array",
          of: [defineArrayMember({ type: "string" })],
          options: { layout: "tags" },
        }),
        defineField({
          name: "cards",
          title: "Category cards",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              name: "rangeCard",
              fields: [
                defineField({
                  name: "slug",
                  title: "Links to category",
                  type: "string",
                  description: "The web address of that product category.",
                  validation: (r) => r.required(),
                }),
                defineField({ name: "title", type: "string", validation: (r) => r.required() }),
                defineField({ name: "kicker", title: "Label above the title", type: "string", validation: (r) => r.required() }),
                defineField({ name: "tag", title: "Small tag on the card", type: "string", validation: (r) => r.required() }),
                defineField({
                  name: "chips",
                  type: "array",
                  of: [defineArrayMember({ type: "string" })],
                  options: { layout: "tags" },
                }),
                imageRefField("image", { required: true, group: null }),
                defineField({
                  name: "span",
                  title: "Card size",
                  type: "string",
                  description: "The comp uses a uniform grid; change this only deliberately.",
                  options: {
                    list: [
                      { title: "Normal", value: "normal" },
                      { title: "Wide", value: "wide" },
                      { title: "Tall", value: "tall" },
                    ],
                    layout: "radio",
                  },
                  initialValue: "normal",
                }),
                defineField({ name: "unit", title: "Sold by", type: "string", description: 'e.g. "per metre".' }),
                defineField({
                  name: "groupLabel",
                  title: "Opens a labelled group",
                  type: "string",
                  description:
                    "Setting this starts a new labelled group above the card. Used for the two continuous-form categories.",
                }),
              ],
              preview: { select: { title: "title", subtitle: "tag" } },
            }),
          ],
          validation: (r) => r.required().min(1),
        }),
        defineField({
          name: "cta",
          title: "Link under the grid",
          type: "object",
          fields: [
            defineField({ name: "label", type: "string", validation: (r) => r.required() }),
            defineField({ name: "href", title: "Link address", type: "string", validation: (r) => r.required() }),
          ],
          options: { collapsible: true, collapsed: true },
        }),
      ],
      group: "body",
    }),

    /* ── Lower sections ───────────────────────────────────────────────────── */
    defineField({
      name: "excellence",
      title: "Manufacturing excellence",
      type: "object",
      fields: [
        ...sectionFields(),
        imageRefField("image", { group: null }),
        defineField({
          name: "imageBadge",
          title: "Badge over the image",
          type: "object",
          fields: [
            defineField({ name: "label", type: "string", validation: (r) => r.required() }),
            defineField({ name: "value", type: "string", validation: (r) => r.required() }),
          ],
        }),
        defineField({
          name: "stats",
          title: "Figures",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              name: "excellenceStat",
              fields: [
                defineField({ name: "value", type: "string", validation: (r) => r.required() }),
                defineField({ name: "label", type: "string", validation: (r) => r.required() }),
                defineField({ name: "sub", title: "Caption", type: "string" }),
              ],
              preview: { select: { title: "value", subtitle: "label" } },
            }),
          ],
        }),
      ],
      options: { collapsible: true, collapsed: true },
      group: "sections",
    }),

    defineField({
      name: "process",
      title: "How parts are made",
      type: "object",
      fields: [
        ...sectionFields(),
        defineField({
          name: "steps",
          title: "Steps",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              name: "hubStep",
              fields: [
                defineField({ name: "n", title: "Number", type: "string", validation: (r) => r.required() }),
                defineField({ name: "title", type: "string", validation: (r) => r.required() }),
                defineField({ name: "body", type: "text", rows: 2, validation: (r) => r.required() }),
              ],
              preview: { select: { title: "title", subtitle: "n" } },
            }),
          ],
          validation: (r) => r.required().min(1),
        }),
        defineField({
          name: "capabilities",
          title: "Capabilities panel",
          type: "object",
          fields: [
            defineField({ name: "heading", type: "string", validation: (r) => r.required() }),
            listField("items", "Capabilities", { group: null, min: 1 }),
            defineField({
              name: "cta",
              title: "Button",
              type: "object",
              fields: [
                defineField({ name: "heading", type: "string", validation: (r) => r.required() }),
                defineField({ name: "body", type: "text", rows: 2, validation: (r) => r.required() }),
                defineField({ name: "label", type: "string", validation: (r) => r.required() }),
                defineField({ name: "href", title: "Link address", type: "string", validation: (r) => r.required() }),
              ],
              options: { collapsible: true, collapsed: true },
            }),
          ],
          options: { collapsible: true, collapsed: true },
        }),
      ],
      options: { collapsible: true, collapsed: true },
      group: "sections",
    }),

    defineField({
      name: "compounds",
      title: "Compound guide",
      type: "object",
      fields: [
        ...sectionFields(),
        defineField({
          name: "items",
          title: "Compounds",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              name: "hubCompound",
              fields: [
                defineField({ name: "code", type: "string", validation: (r) => r.required() }),
                defineField({ name: "name", type: "string", validation: (r) => r.required() }),
                defineField({ name: "summary", type: "text", rows: 2, validation: (r) => r.required() }),
                defineField({ name: "dot", title: "Dot colour", type: "string", validation: (r) => r.required() }),
                defineField({ name: "temp", title: "Temperature range", type: "string", validation: (r) => r.required() }),
                defineField({ name: "hardness", type: "string", validation: (r) => r.required() }),
                defineField({ name: "bestFor", title: "Best for", type: "string", validation: (r) => r.required() }),
                defineField({
                  name: "tags",
                  type: "array",
                  of: [defineArrayMember({ type: "string" })],
                  options: { layout: "tags" },
                }),
                defineField({
                  name: "applications",
                  type: "array",
                  of: [defineArrayMember({ type: "string" })],
                  options: { layout: "tags" },
                }),
              ],
              preview: { select: { title: "code", subtitle: "name" } },
            }),
          ],
          validation: (r) => r.required().min(1),
        }),
        defineField({
          name: "cta",
          title: "Route out for other materials",
          type: "object",
          description:
            "The closing line under the grid — a way through for anyone whose compound is not one of these.",
          fields: [
            defineField({ name: "label", type: "string", validation: (r) => r.required() }),
            defineField({ name: "href", title: "Link address", type: "string", validation: (r) => r.required() }),
          ],
          options: { collapsible: true, collapsed: true },
        }),
      ],
      options: { collapsible: true, collapsed: true },
      group: "sections",
    }),

    defineField({
      name: "sectors",
      title: "Sectors served",
      type: "object",
      fields: [
        ...sectionFields(),
        defineField({
          name: "items",
          title: "Sectors",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              name: "hubSector",
              fields: [
                defineField({ name: "name", type: "string", validation: (r) => r.required() }),
                defineField({ name: "body", type: "text", rows: 2, validation: (r) => r.required() }),
                imageRefField("image", { group: null }),
                defineField({ name: "products", title: "Products line", type: "string", validation: (r) => r.required() }),
                defineField({ name: "clients", title: "Clients line", type: "string", validation: (r) => r.required() }),
                defineField({ name: "href", title: "Link address", type: "string", validation: (r) => r.required() }),
              ],
              preview: { select: { title: "name", subtitle: "products" } },
            }),
          ],
          validation: (r) => r.required().min(1),
        }),
      ],
      options: { collapsible: true, collapsed: true },
      group: "sections",
    }),

    defineField({
      name: "certifications",
      title: "Certifications",
      type: "object",
      fields: [
        ...sectionFields(),
        defineField({
          name: "cta",
          title: "Closing link",
          type: "object",
          fields: [
            defineField({ name: "label", title: "Link text", type: "string" }),
            defineField({ name: "href", title: "Link address", type: "string" }),
          ],
        }),
        defineField({
          name: "items",
          title: "Certifications",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              name: "hubCertification",
              fields: [
                defineField({ name: "name", type: "string", validation: (r) => r.required() }),
                defineField({ name: "version", type: "string", validation: (r) => r.required() }),
                defineField({ name: "title", type: "string", validation: (r) => r.required() }),
                defineField({ name: "body", type: "text", rows: 2, validation: (r) => r.required() }),
                defineField({ name: "by", title: "Issued by", type: "string", validation: (r) => r.required() }),
                defineField({
                  name: "color",
                  title: "Colour",
                  type: "string",
                  description: "Six-digit hex, e.g. #2BBCC4. Each certification has its own in the design.",
                  validation: (r) =>
                    r.required().regex(/^#[0-9A-Fa-f]{6}$/, { name: "hex colour like #2BBCC4" }),
                }),
                defineField({
                  name: "icon",
                  type: "string",
                  options: iconList(["shield", "award", "doc", "star"]),
                  validation: (r) => r.required(),
                }),
              ],
              preview: { select: { title: "name", subtitle: "version" } },
            }),
          ],
          description: "Not used: the certifications strip reads the record in Site settings. Kept so older documents still open.",
        }),
      ],
      options: { collapsible: true, collapsed: true },
      group: "sections",
    }),

    defineField({
      name: "validation",
      title: "Testing & validation",
      type: "object",
      fields: [
        ...sectionFields(),
        listField("items", "Tests", { group: null, min: 1 }),
        defineField({
          name: "groups",
          title: "Tests by who performs them",
          description:
            "Two groups — in-house and partner laboratory — each a list of test and the standard it is run to. When filled, these replace the plain list above.",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              name: "testGroup",
              fields: [
                defineField({ name: "title", title: "Group title", type: "string", validation: (r) => r.required() }),
                defineField({
                  name: "rows",
                  title: "Tests",
                  type: "array",
                  of: [
                    defineArrayMember({
                      type: "object",
                      name: "testRow",
                      fields: [
                        defineField({ name: "test", title: "Test", type: "string", validation: (r) => r.required() }),
                        defineField({ name: "standard", title: "Standard", type: "string", validation: (r) => r.required() }),
                      ],
                      preview: { select: { title: "test", subtitle: "standard" } },
                    }),
                  ],
                  validation: (r) => r.required().min(1),
                }),
              ],
              preview: { select: { title: "title" } },
            }),
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
          options: { collapsible: true, collapsed: true },
        }),
      ],
      options: { collapsible: true, collapsed: true },
      group: "sections",
    }),

    defineField({
      name: "catalogue",
      title: "Catalogue request",
      type: "object",
      fields: [
        ...sectionFields(),
        listField("bullets", "Bullet points", { group: null }),
        defineField({ name: "formHeading", type: "string", validation: (r) => r.required() }),
        defineField({ name: "formBody", type: "text", rows: 2, validation: (r) => r.required() }),
        defineField({ name: "submitLabel", type: "string", validation: (r) => r.required() }),
        defineField({ name: "footnote", type: "string" }),
      ],
      options: { collapsible: true, collapsed: true },
      group: "sections",
    }),

    defineField({
      name: "quote",
      title: "Closing enquiry band",
      type: "object",
      fields: [
        ...sectionFields(),
        defineField({ name: "contactHeading", type: "string", validation: (r) => r.required() }),
        defineField({
          name: "contacts",
          title: "Contacts",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              name: "hubContact",
              fields: [
                defineField({
                  name: "icon",
                  type: "string",
                  options: iconList(["phone", "email", "address"]),
                  validation: (r) => r.required(),
                }),
                defineField({ name: "label", type: "string", validation: (r) => r.required() }),
                defineField({ name: "value", type: "string", validation: (r) => r.required() }),
                defineField({ name: "note", type: "string" }),
              ],
              preview: { select: { title: "label", subtitle: "value" } },
            }),
          ],
          validation: (r) => r.required().min(1),
        }),
        defineField({ name: "promiseHeading", type: "string", validation: (r) => r.required() }),
        listField("promises", "Promises", { group: null, min: 1 }),
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
              [defineField({ name: "full", title: "Full width", type: "boolean", initialValue: false })],
            ),
          ],
          validation: (r) => r.required().min(1),
        }),
        defineField({ name: "submitLabel", type: "string", validation: (r) => r.required() }),
        defineField({ name: "attachLabel", title: "Attachment field — label", type: "string", description: "e.g. ATTACH DRAWING / SPEC (OPTIONAL). Shown but inert until file upload is wired." }),
        defineField({ name: "attachHint", title: "Attachment field — hint", type: "string", description: "e.g. PDF, DWG or image, max 10MB" }),
      ],
      options: { collapsible: true, collapsed: true },
      group: "sections",
    }),

    /* ── Search ───────────────────────────────────────────────────────────── */
    defineField({ name: "seo", title: "Search engine listing", type: "seo", group: "meta" }),
    defineField({
      name: "faqSection",
      title: "Questions heading",
      type: "object",
      fields: [
        ...sectionFields(),
        defineField({
          name: "cta",
          title: "Button",
          type: "object",
          fields: [
            defineField({ name: "label", type: "string", validation: (r) => r.required() }),
            defineField({ name: "href", title: "Link address", type: "string", validation: (r) => r.required() }),
            defineField({ name: "note", type: "string", validation: (r) => r.required() }),
          ],
          options: { collapsible: true, collapsed: true },
        }),
      ],
      options: { collapsible: true, collapsed: true },
      group: "meta",
    }),
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
    defineField({
      name: "related",
      title: "Related pages",
      type: "object",
      fields: [
        listField("products", "Product categories", { group: null }),
        listField("industries", "Industries", { group: null }),
        listField("resources", "Guides", { group: null }),
      ],
      options: { collapsible: true, collapsed: true },
      group: "meta",
    }),
    schemaTypesField,
  confirmField,
  ],

  preview: { prepare: () => ({ title: "Products page", subtitle: "/products" }) },
});
