import { defineArrayMember, defineField, defineType } from "sanity";
import { imageRefField, iconField } from "../blocks/_shared.ts";
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
 * MARKETING PAGES — the smaller five.
 *
 * Grouped in one file rather than five because they are short and share the
 * same shape of work; the four large ones (home, about, why-margo, the
 * products hub) get files of their own, being 160 to 200 lines of schema each.
 *
 * All fixed structure. Their routes render every section unconditionally in
 * one order, so there is no block list and nothing an editor can rearrange.
 */

/* ── /resources ───────────────────────────────────────────────────────────── */

export const resourcesHub = defineType({
  name: "resourcesHub",
  // Named as the page names itself. An editor should never have to work out
  // that "Guides index" means /resources.
  title: "Resources & Guides",
  type: "document",
  groups: PAGE_GROUPS,
  fields: [
    ...pageIdentityFields("/resources"),
    defineField({
      name: "breadcrumb",
      title: "Breadcrumb",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "crumb",
          fields: [
            defineField({ name: "label", type: "string", validation: (r) => r.required() }),
            defineField({ name: "href", title: "Link address", type: "string", description: "Leave empty for the current page." }),
          ],
          preview: { select: { title: "label", subtitle: "href" } },
        }),
      ],
      validation: (r) => r.required().min(1),
      group: "hero",
    }),
    ...headingFields({ accents: false }),
    defineField({
      name: "intro",
      title: "Opening paragraph",
      type: "text",
      rows: 3,
      validation: (r) => r.required().min(40),
      group: "hero",
    }),
    defineField({
      name: "lastUpdated",
      title: "Last updated",
      type: "string",
      description: "Shown beside the live guide and category counts.",
      validation: (r) => r.required(),
      group: "hero",
    }),
    defineField({ name: "searchPlaceholder", title: "Search box placeholder", type: "string", validation: (r) => r.required(), group: "body" }),
    defineField({ name: "allLabel", title: 'Label for the "all" filter', type: "string", validation: (r) => r.required(), group: "body" }),
    defineField({ name: "featuredLabel", title: 'Label for the "featured" filter', type: "string", validation: (r) => r.required(), group: "body" }),
    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      description:
        "The filter chips. Each key must match the category set on the guides themselves.",
      of: [
        defineArrayMember({
          type: "object",
          name: "guideCategory",
          fields: [
            defineField({
              name: "key",
              title: "Key",
              type: "string",
              options: {
                list: [
                  { title: "Material comparison", value: "material-comparison" },
                  { title: "Sizing & specification", value: "sizing-spec" },
                  { title: "Sourcing & buying", value: "sourcing-buyer" },
                ],
              },
              validation: (r) => r.required(),
            }),
            defineField({ name: "label", type: "string", validation: (r) => r.required() }),
            defineField({ name: "blurb", type: "text", rows: 2, validation: (r) => r.required() }),
          ],
          preview: { select: { title: "label", subtitle: "key" } },
        }),
      ],
      validation: (r) => r.required().min(1),
      group: "body",
    }),
    defineField({
      name: "cta",
      title: "Closing call to action",
      type: "object",
      fields: [
        iconField(),
        listField("headingLines", "Heading lines", { min: 1, group: null }),
        defineField({ name: "body", type: "text", rows: 3, validation: (r) => r.required() }),
        actionsField("actions", "Buttons", { group: null, min: 1 }),
      ],
      group: "body",
    }),
    defineField({ name: "seo", title: "Search engine listing", type: "seo", group: "meta" }),
    schemaTypesField,
  confirmField,
  ],
  preview: { prepare: () => ({ title: "Resources & Guides", subtitle: "/resources" }) },
});

/* ── /industries ──────────────────────────────────────────────────────────── */

export const industriesHub = defineType({
  name: "industriesHub",
  title: "Industries page",
  type: "document",
  groups: PAGE_GROUPS,
  fields: [
    ...pageIdentityFields("/industries"),
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
    defineField({
      name: "heroFacts",
      title: "Facts under the intro",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          // Keeps the stored _type of the existing rows, which were written
          // with the shared label/value member.
          name: "pair",
          fields: [
            defineField({ name: "label", type: "string", validation: (r) => r.required() }),
            defineField({ name: "value", type: "string", validation: (r) => r.required() }),
            defineField({
              name: "labelVision",
              title: "Label — concept build only",
              type: "string",
              description: "Wording shown instead of the label on the password-protected concept build. Leave empty to reuse the label.",
            }),
          ],
          preview: { select: { title: "label", subtitle: "value" } },
        }),
      ],
      group: "hero",
    }),
    defineField({
      name: "filter",
      title: "Filter bar",
      type: "object",
      fields: [
        defineField({ name: "placeholder", type: "string", validation: (r) => r.required() }),
        defineField({
          name: "chips",
          title: "Filter chips",
          type: "array",
          of: [defineArrayMember({ type: "string" })],
          options: { layout: "tags" },
        }),
      ],
      group: "body",
    }),
    defineField({
      name: "primary",
      title: "Main sectors",
      type: "object",
      fields: [
        ...sectionFields(),
        defineField({ name: "countLabel", title: "Count label", type: "string", validation: (r) => r.required() }),
        defineField({
          name: "items",
          title: "Sectors",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              name: "sector",
              fields: [
                defineField({
                  name: "slug",
                  title: "Links to industry",
                  type: "string",
                  description: "The web address of that industry page.",
                  validation: (r) => r.required(),
                }),
                defineField({ name: "name", type: "string", validation: (r) => r.required() }),
                defineField({ name: "chip", title: "Small tag on the card", type: "string", validation: (r) => r.required() }),
                defineField({ name: "body", type: "text", rows: 2, validation: (r) => r.required() }),
                imageRefField("image", { required: true, group: null }),
                defineField({
                  name: "tags",
                  type: "array",
                  of: [defineArrayMember({ type: "string" })],
                  options: { layout: "tags" },
                }),
              ],
              preview: { select: { title: "name", subtitle: "chip" } },
            }),
          ],
          validation: (r) => r.required().min(1),
        }),
      ],
      group: "body",
    }),
    defineField({
      name: "additional",
      title: "Other sectors",
      type: "object",
      fields: [
        ...sectionFields(),
        defineField({ name: "note", type: "text", rows: 2, validation: (r) => r.required() }),
        defineField({
          name: "items",
          title: "Sectors",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              name: "otherSector",
              fields: [
                defineField({ name: "name", type: "string", validation: (r) => r.required() }),
                defineField({ name: "body", type: "text", rows: 2, validation: (r) => r.required() }),
                defineField({ name: "href", title: "Link address", type: "string", validation: (r) => r.required() }),
                defineField({
                  name: "linkLabel",
                  type: "string",
                  initialValue: "Browse product category",
                }),
              ],
              preview: { select: { title: "name", subtitle: "href" } },
            }),
          ],
          validation: (r) => r.required().min(1),
        }),
      ],
      group: "body",
    }),
    defineField({
      name: "enquiry",
      title: "Enquiry form",
      type: "object",
      fields: [
        defineField({ name: "heading", type: "string", validation: (r) => r.required() }),
        defineField({ name: "body", type: "text", rows: 3, validation: (r) => r.required() }),
        listField("points", "Bullet points", { group: null }),
        defineField({
          name: "fields",
          title: "Form fields",
          type: "array",
          of: [
            formFieldMember(
              [
                { title: "Single line", value: "text" },
                { title: "Email", value: "email" },
                { title: "Dropdown", value: "select" },
                { title: "Paragraph", value: "textarea" },
              ],
              [
                defineField({
                  name: "full",
                  title: "Full width",
                  type: "boolean",
                  initialValue: false,
                }),
              ],
            ),
          ],
          validation: (r) => r.required().min(1),
        }),
        defineField({ name: "submitLabel", title: "Submit button", type: "string", validation: (r) => r.required() }),
        defineField({ name: "footnote", type: "string", validation: (r) => r.required() }),
      ],
      group: "body",
    }),
    defineField({ name: "seo", title: "Search engine listing", type: "seo", group: "meta" }),
    schemaTypesField,
  confirmField,
  ],
  preview: { prepare: () => ({ title: "Industries page", subtitle: "/industries" }) },
});

/* ── /thank-you and the 404 ───────────────────────────────────────────────── */

/**
 * Two pages, one type — they are the same shape: a short statement, a short
 * list, and routes back into the site. Neither has a Figma design; both are
 * derived from the design system.
 */
export const utilityPage = defineType({
  name: "utilityPage",
  title: "Utility page",
  type: "document",
  groups: PAGE_GROUPS,
  fields: [
    ...pageIdentityFields("/thank-you or the 404"),
    defineField({ name: "eyebrow", title: "Label above the heading", type: "string", validation: (r) => r.required(), group: "hero" }),
    ...headingFields({ accents: false }),
    defineField({
      name: "intro",
      title: "Opening paragraph",
      type: "text",
      rows: 3,
      validation: (r) => r.required().min(30),
      group: "hero",
    }),
    defineField({
      name: "steps",
      title: "What happens next",
      type: "array",
      description: "Used on the thank-you page. Leave empty on the 404.",
      of: [
        defineArrayMember({
          type: "object",
          name: "step",
          fields: [
            defineField({ name: "name", type: "string", validation: (r) => r.required() }),
            defineField({ name: "body", type: "text", rows: 2, validation: (r) => r.required() }),
          ],
          preview: { select: { title: "name", subtitle: "body" } },
        }),
      ],
      group: "body",
    }),
    defineField({ name: "note", title: "Closing note", type: "text", rows: 2, group: "body" }),
    defineField({ name: "linksHeading", title: "Heading above the links", type: "string", validation: (r) => r.required(), group: "body" }),
    defineField({
      name: "links",
      title: "Routes back into the site",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "utilityLink",
          fields: [
            defineField({
              name: "icon",
              type: "string",
              options: {
                list: ["box", "sector", "doc", "ribbon", "globe", "mail"].map((v) => ({
                  title: v,
                  value: v,
                })),
              },
              validation: (r) => r.required(),
            }),
            defineField({ name: "label", type: "string", validation: (r) => r.required() }),
            defineField({ name: "body", type: "text", rows: 2, validation: (r) => r.required() }),
            defineField({ name: "href", title: "Link address", type: "string", validation: (r) => r.required() }),
          ],
          preview: { select: { title: "label", subtitle: "href" } },
        }),
      ],
      validation: (r) => r.required().min(1),
      group: "body",
    }),
    actionsField("actions", "Buttons", { group: "body" }),
    defineField({ name: "seo", title: "Search engine listing", type: "seo", group: "meta" }),
    schemaTypesField,
  confirmField,
  ],
  preview: {
    select: { slug: "slug.current" },
    prepare: ({ slug }) => ({
      title: slug === "thank-you" ? "Thank you" : "Page not found",
      subtitle: slug === "thank-you" ? "/thank-you" : "404",
    }),
  },
});

/* ── /contact ─────────────────────────────────────────────────────────────── */

/**
 * The primary conversion of the site, and the densest form on it.
 *
 * Deliberately two steps: single-page forms above seven fields hit 67.8%
 * abandonment, so step 1 captures enough to follow up if the visitor drops,
 * and step 2 carries the qualifying fields a trader is least likely to answer
 * confidently. That split is a decision, not a layout accident, and an editor
 * moving fields between the steps is changing it.
 */
export const contactPage = defineType({
  name: "contactPage",
  // "Contact", like the nav says — not "Contact page". Its siblings are
  // "About" and "Export"; the odd one out reads like a different kind of thing.
  title: "Contact",
  type: "document",
  groups: PAGE_GROUPS,
  fields: [
    ...pageIdentityFields("/contact"),
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
    listField("proof", "Reassurance lines", { group: "hero" }),
    defineField({
      name: "quote",
      title: "Enquiry form",
      type: "object",
      fields: [
        ...sectionFields(),
        defineField({ name: "note", type: "text", rows: 2, validation: (r) => r.required() }),
        defineField({
          name: "facility",
          title: "Facility panel",
          type: "object",
          fields: [
            defineField({ name: "eyebrow", title: "Small label above the heading", type: "string", validation: (r) => r.required() }),
            defineField({ name: "body", type: "text", rows: 3, validation: (r) => r.required() }),
          ],
        }),
        defineField({ name: "directHeading", title: "Heading above the contacts", type: "string", validation: (r) => r.required() }),
        defineField({
          name: "contacts",
          title: "Direct contacts",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              name: "contact",
              fields: [
                defineField({
                  name: "icon",
                  type: "string",
                  options: {
                    list: [
                      { title: "WhatsApp", value: "whatsapp" },
                      { title: "Phone", value: "phone" },
                      { title: "Email", value: "email" },
                    ],
                  },
                  validation: (r) => r.required(),
                }),
                defineField({ name: "label", type: "string", validation: (r) => r.required() }),
                defineField({ name: "value", type: "string", validation: (r) => r.required() }),
                defineField({ name: "note", type: "string" }),
                defineField({ name: "href", title: "Link address", type: "string" }),
              ],
              preview: { select: { title: "label", subtitle: "value" } },
            }),
          ],
          validation: (r) => r.required().min(1),
        }),
        defineField({ name: "footnote", type: "string", validation: (r) => r.required() }),
        defineField({
          name: "steps",
          title: "Step names",
          type: "array",
          of: [defineArrayMember({ type: "string" })],
          description: "Exactly two — this form has two steps by design.",
          validation: (r) => r.required().length(2).error("This form has exactly two steps."),
        }),
        defineField({
          name: "step1",
          title: "Step 1 fields",
          type: "array",
          description: "Enough to follow up if the visitor abandons the form.",
          of: [
            formFieldMember(
              [
                { title: "Single line", value: "text" },
                { title: "Email", value: "email" },
                { title: "Telephone", value: "tel" },
              ],
              [defineField({ name: "required", type: "boolean", initialValue: true })],
            ),
          ],
          validation: (r) => r.required().min(1),
        }),
        defineField({
          name: "step2",
          title: "Step 2 fields",
          type: "array",
          description: "The qualifying questions, asked once step 1 is captured.",
          of: [
            formFieldMember(
              [
                { title: "Single line", value: "text" },
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
        defineField({ name: "continueLabel", title: 'Button: step 1 → 2', type: "string", validation: (r) => r.required() }),
        defineField({ name: "backLabel", title: "Button: back", type: "string", validation: (r) => r.required() }),
        defineField({ name: "submitLabel", title: "Button: submit", type: "string", validation: (r) => r.required() }),
        defineField({
          name: "responsePromise",
          title: "Response promise",
          type: "string",
          description:
            "Stated directly under Submit. No competitor states any response time — this is the page's strongest differentiator, so it should be one Margo can actually keep.",
          validation: (r) => r.required(),
        }),
      ],
      group: "body",
    }),
    defineField({ name: "seo", title: "Search engine listing", type: "seo", group: "meta" }),
    defineField({
      name: "addressSection",
      title: "Address block — heading",
      description: "The address, hours, phone and email themselves come from Site settings. Leave the heading empty to hide the block.",
      type: "object",
      fields: [
        defineField({ name: "eyebrow", title: "Small label above the heading", type: "string" }),
        defineField({ name: "heading", title: "Heading", type: "string" }),
      ],
      group: "body",
    }),
    defineField({
      name: "map",
      title: "Map",
      description: "A still image of the map that links to Google Maps at the plant's coordinates (from Site settings). Never an embedded map.",
      type: "object",
      fields: [
        imageRefField("image", { group: null }),
        defineField({ name: "label", title: "Link text", type: "string", description: "e.g. “Open in Google Maps”." }),
      ],
      group: "body",
    }),
    defineField({
      name: "logisticsSection",
      title: "Logistics block — heading",
      description: "Leave the heading empty to hide the block.",
      type: "object",
      fields: [
        defineField({ name: "eyebrow", title: "Small label above the heading", type: "string" }),
        defineField({ name: "heading", title: "Heading", type: "string" }),
      ],
      group: "body",
    }),
    defineField({
      name: "logistics",
      title: "Logistics",
      description: "Destination, distance from the plant, and transit time — one row each.",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "logisticsRow",
          fields: [
            defineField({ name: "destination", title: "Destination", type: "string", validation: (r) => r.required() }),
            defineField({ name: "distance", title: "Distance", type: "string", validation: (r) => r.required() }),
            defineField({ name: "transit", title: "Transit time", type: "string", validation: (r) => r.required() }),
          ],
          preview: { select: { title: "destination", subtitle: "transit" } },
        }),
      ],
      group: "body",
    }),
    defineField({
      name: "nextStepsSection",
      title: "What happens next — heading",
      description: "Leave the heading empty to hide the block.",
      type: "object",
      fields: [
        defineField({ name: "eyebrow", title: "Small label above the heading", type: "string" }),
        defineField({ name: "heading", title: "Heading", type: "string" }),
      ],
      group: "body",
    }),
    defineField({
      name: "nextSteps",
      title: "What happens next",
      description: "The stages after an enquiry is sent, each with its timing.",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "nextStep",
          fields: [
            defineField({ name: "stage", title: "Stage", type: "string", validation: (r) => r.required() }),
            defineField({ name: "timing", title: "Timing", type: "string", validation: (r) => r.required() }),
          ],
          preview: { select: { title: "stage", subtitle: "timing" } },
        }),
      ],
      group: "body",
    }),
    defineField({
      name: "faqSection",
      title: "Questions block — heading",
      description: "Leave the heading empty to hide the block.",
      type: "object",
      fields: [
        defineField({ name: "eyebrow", title: "Small label above the heading", type: "string" }),
        defineField({ name: "heading", title: "Heading", type: "string" }),
      ],
      group: "body",
    }),
    defineField({
      name: "faqs",
      title: "Questions & answers",
      description: "Appear on the page and are submitted to Google as structured data.",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "faq",
          fields: [
            defineField({ name: "q", title: "Question", type: "string", validation: (r) => r.required().min(8) }),
            defineField({ name: "a", title: "Answer", type: "text", rows: 4, validation: (r) => r.required().min(40).max(700) }),
          ],
          preview: { select: { title: "q" } },
        }),
      ],
      group: "body",
    }),
    schemaTypesField,
  confirmField,
  ],
  preview: { prepare: () => ({ title: "Contact", subtitle: "/contact" }) },
});

/* ── The footer ───────────────────────────────────────────────────────────── */

/**
 * Not a page — the footer that appears on every one of them.
 *
 * Content rather than code by deliberate choice: it is almost entirely copy
 * and links, which is exactly what a non-technical editor needs to change.
 */
const footerLink = defineArrayMember({
  type: "object",
  name: "footerLink",
  fields: [
    defineField({ name: "label", type: "string", validation: (r) => r.required() }),
    defineField({ name: "href", title: "Link address", type: "string", validation: (r) => r.required() }),
  ],
  preview: { select: { title: "label", subtitle: "href" } },
});

export const siteFooter = defineType({
  name: "siteFooter",
  title: "Footer",
  type: "document",
  fields: [
    defineField({
      name: "slug",
      title: "Identifier",
      type: "slug",
      readOnly: true,
      validation: (r) => r.required(),
    }),
    defineField({
      name: "brand",
      title: "Company details",
      type: "object",
      fields: [
        defineField({ name: "blurb", type: "text", rows: 3, validation: (r) => r.required().min(20) }),
        defineField({ name: "phone", type: "string", validation: (r) => r.required().min(6) }),
        defineField({ name: "email", type: "string", validation: (r) => r.required().min(5) }),
        defineField({ name: "address", type: "text", rows: 3, validation: (r) => r.required().min(10) }),
      ],
    }),
    defineField({
      name: "social",
      title: "Social links",
      type: "array",
      description:
        "An icon appears only once its address is filled in, so an unknown account ships as nothing rather than as a dead link.",
      of: [
        defineArrayMember({
          type: "object",
          name: "socialLink",
          fields: [
            defineField({ name: "label", type: "string", validation: (r) => r.required().min(2) }),
            defineField({
              name: "icon",
              type: "string",
              options: {
                list: [
                  { title: "LinkedIn", value: "linkedin" },
                  { title: "X / Twitter", value: "twitter" },
                  { title: "YouTube", value: "youtube" },
                ],
              },
              validation: (r) => r.required(),
            }),
            defineField({ name: "href", title: "Address", type: "string", description: "Leave empty to hide." }),
          ],
          preview: { select: { title: "label", subtitle: "href" } },
        }),
      ],
    }),
    defineField({
      name: "columns",
      title: "Link columns",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "column",
          fields: [
            defineField({ name: "heading", type: "string", validation: (r) => r.required().min(2) }),
            defineField({
              name: "links",
              type: "array",
              of: [footerLink],
              validation: (r) => r.required().min(1),
            }),
          ],
          preview: {
            select: { title: "heading", links: "links" },
            prepare: ({ title, links }) => ({
              title,
              subtitle: `${(links as unknown[])?.length ?? 0} links`,
            }),
          },
        }),
      ],
      validation: (r) => r.required().min(1),
    }),
    defineField({
      name: "cta",
      title: "Call to action",
      type: "object",
      fields: [
        defineField({ name: "heading", type: "string", validation: (r) => r.required().min(10) }),
        defineField({ name: "body", type: "text", rows: 2, validation: (r) => r.required().min(10) }),
        defineField({
          name: "action",
          type: "object",
          fields: [
            defineField({ name: "label", type: "string", validation: (r) => r.required() }),
            defineField({ name: "href", title: "Link address", type: "string", validation: (r) => r.required() }),
          ],
        }),
      ],
    }),
    defineField({
      name: "legal",
      title: "Legal links",
      type: "array",
      of: [footerLink],
      validation: (r) => r.required().min(1),
    }),
    defineField({ name: "copyright", type: "string", validation: (r) => r.required().min(10) }),
    defineField({ name: "badge", type: "string", validation: (r) => r.required().min(4) }),
    defineField({
      name: "confirmWithMargo",
      title: "Figures still to be confirmed",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
  ],
  preview: { prepare: () => ({ title: "Footer", subtitle: "Appears on every page" }) },
});

export const SIMPLE_MARKETING_TYPES = [
  resourcesHub,
  industriesHub,
  utilityPage,
  contactPage,
  siteFooter,
];
