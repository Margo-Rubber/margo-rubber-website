import { defineArrayMember, defineField, defineType } from "sanity";
import { imageRefField } from "../blocks/_shared.ts";
import {
  PAGE_GROUPS,
  actionsField,
  confirmField,
  furtherReadingField,
  formFieldMember,
  headingFields,
  labelValueMember,
  listField,
  schemaTypesField,
  pageIdentityFields,
  sectionFields,
} from "./_marketing.ts";

/**
 * MARKETING PAGES — certifications, case studies and export.
 *
 * All fixed structure, like the rest. What distinguishes these three is that
 * each carries a section whose WORDING is the point of the page, and the field
 * descriptions say so — because an editor tidying prose has no way of knowing
 * which sentences were argued over.
 */

/* ── /certifications ──────────────────────────────────────────────────────── */

/**
 * The page exists for one panel: an explicit statement of what the ISO
 * certification does NOT cover.
 *
 * Every competitor in the teardown lists certifications and stops. This page
 * says plainly that Margo holds ISO 9001:2015 and not IATF 16949 — which is
 * the reason a serious buyer trusts the rest of the site. Softening that panel
 * would remove the page's whole purpose, so the fields say as much.
 */
export const certificationsPage = defineType({
  name: "certificationsPage",
  title: "Certifications",
  type: "document",
  groups: PAGE_GROUPS,
  fields: [
    ...pageIdentityFields("/certifications"),
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
      name: "scope",
      title: "What the certification covers",
      type: "object",
      description:
        "The most important section on the site. Its second half states what Margo is NOT certified for — that candour is why buyers believe the rest.",
      fields: [
        ...sectionFields(),
        defineField({ name: "meansHeading", title: 'Heading: "what it means"', type: "string", validation: (r) => r.required() }),
        listField("means", "What it means", { group: null, min: 1 }),
        defineField({ name: "notHeading", title: 'Heading: "what it does not mean"', type: "string", validation: (r) => r.required() }),
        defineField({
          name: "notLead",
          title: "The headline admission",
          type: "string",
          description:
            "Rendered first and boldest in the red panel. This is the sentence the page exists for — do not soften it.",
          validation: (r) => r.required(),
        }),
        defineField({ name: "notLeadBody", title: "Explanation", type: "text", rows: 3, validation: (r) => r.required() }),
        listField("notItems", "Further limitations", { group: null, min: 1 }),
        defineField({ name: "footnote", type: "string", validation: (r) => r.required() }),
      ],
      group: "body",
    }),

    defineField({
      name: "certificate",
      title: "The certificate itself",
      type: "object",
      fields: [
        ...sectionFields(),
        defineField({
          name: "card",
          title: "Certificate card",
          type: "object",
          description: "Reproduces the certificate. Every line should match the document exactly.",
          fields: [
            defineField({ name: "eyebrow", title: "Small label above the heading", type: "string", validation: (r) => r.required() }),
            defineField({ name: "title", type: "string", validation: (r) => r.required() }),
            defineField({ name: "certifyLine", title: "“This is to certify…”", type: "string", validation: (r) => r.required() }),
            defineField({ name: "company", type: "string", validation: (r) => r.required() }),
            defineField({ name: "address", type: "text", rows: 3, validation: (r) => r.required() }),
            defineField({ name: "conformLine", title: "“…conforms to”", type: "string", validation: (r) => r.required() }),
            defineField({ name: "standard", type: "string", validation: (r) => r.required() }),
            defineField({ name: "scopeLine", title: "Scope", type: "text", rows: 2, validation: (r) => r.required() }),
            defineField({ name: "fields", title: "Certificate details", type: "array", of: [labelValueMember] }),
            defineField({ name: "barTitle", type: "string", validation: (r) => r.required() }),
            defineField({ name: "barNote", type: "string", description: "Optional." }),
            defineField({ name: "downloadLabel", type: "string", validation: (r) => r.required() }),
            defineField({
              name: "downloadHref",
              title: "Certificate file address",
              type: "string",
              description: "The button appears only once a PDF address is here.",
            }),
          ],
        }),
        defineField({ name: "meta", title: "Details beside the card", type: "array", of: [labelValueMember] }),
      ],
      group: "body",
    }),

    defineField({
      name: "facility",
      title: "The facility",
      type: "object",
      fields: [
        ...sectionFields(),
        defineField({ name: "caption", type: "string", validation: (r) => r.required() }),
        defineField({
          name: "gallery",
          title: "Photographs",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              name: "shot",
              fields: [
                imageRefField("image", { required: true, group: null }),
                defineField({
                  name: "alt",
                  title: "Description for screen readers",
                  type: "string",
                  validation: (r) => r.required(),
                }),
              ],
              preview: { select: { title: "alt", subtitle: "image" } },
            }),
          ],
          validation: (r) => r.required().min(1),
        }),
        defineField({
          name: "capabilities",
          title: "Capabilities",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              name: "capability",
              fields: [
                defineField({ name: "name", type: "string", validation: (r) => r.required() }),
                defineField({ name: "body", type: "text", rows: 2, validation: (r) => r.required() }),
                defineField({ name: "href", title: "Links to", type: "string", description: "Where the card's name links, e.g. /products/extrusion. Empty for no link." }),
              ],
              preview: { select: { title: "name", subtitle: "body" } },
            }),
          ],
        }),
      ],
      group: "body",
    }),

    defineField({
      name: "system",
      title: "The quality system",
      type: "object",
      fields: [
        ...sectionFields(),
        defineField({
          name: "items",
          title: "Parts of the system",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              name: "systemItem",
              fields: [
                defineField({
                  name: "icon",
                  type: "string",
                  options: {
                    list: ["inbox", "gauge", "shield", "loop"].map((v) => ({ title: v, value: v })),
                  },
                  validation: (r) => r.required(),
                }),
                defineField({ name: "name", type: "string", validation: (r) => r.required() }),
                defineField({ name: "body", type: "text", rows: 2, validation: (r) => r.required() }),
                defineField({ name: "href", title: "Link address", type: "string", description: "Optional — a stage that links out, e.g. final QC to /products#testing (sheet 07 §05)." }),
              ],
              preview: { select: { title: "name", subtitle: "body" } },
            }),
          ],
        }),
        defineField({
          name: "auditNote",
          title: "Audit note",
          type: "object",
          fields: [
            defineField({ name: "lead", title: "Opening line", type: "string", validation: (r) => r.required() }),
            defineField({ name: "body", type: "text", rows: 3, validation: (r) => r.required() }),
          ],
        }),
      ],
      group: "body",
    }),

    defineField({
      name: "docs",
      title: "Request documents",
      type: "object",
      fields: [
        defineField({ name: "heading", type: "string", validation: (r) => r.required() }),
        defineField({ name: "body", type: "text", rows: 3, validation: (r) => r.required() }),
        listField("items", "What can be requested", { group: null, min: 1 }),
        defineField({
          name: "fields",
          title: "Form fields",
          type: "array",
          of: [
            formFieldMember([
              { title: "Single line", value: "text" },
              { title: "Email", value: "email" },
              { title: "Paragraph", value: "textarea" },
            ]),
          ],
          validation: (r) => r.required().min(1),
        }),
        defineField({ name: "submitLabel", type: "string", validation: (r) => r.required() }),
        defineField({ name: "footnote", type: "string", validation: (r) => r.required() }),
        defineField({ name: "confirmation", title: "After submit", type: "text", rows: 2, description: "Shown in place of the form once sent; {email} is the address given." }),
      ],
      group: "body",
    }),
    defineField({ name: "seo", title: "Search engine listing", type: "seo", group: "meta" }),
    schemaTypesField,
  furtherReadingField,
  confirmField,
  ],
  preview: { prepare: () => ({ title: "Certifications", subtitle: "/certifications" }) },
});

/* ── /case-studies ────────────────────────────────────────────────────────── */

/**
 * An honest empty state, deliberately.
 *
 * Margo has no documented export case studies. Rather than invent one, the
 * page says so and explains what a case study will contain when it exists.
 * That was the brief — "placeholder only, do not fabricate" — and it is the
 * whole design, so the fields warn against filling it with a plausible story.
 */
export const caseStudiesPage = defineType({
  name: "caseStudiesPage",
  title: "Case Studies",
  type: "document",
  groups: PAGE_GROUPS,
  fields: [
    ...pageIdentityFields("/case-studies"),
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
      title: "Top of page",
      type: "object",
      description:
        "This page states that no case studies exist yet. Do not replace that with an invented example — add a real one only when Margo can evidence it.",
      fields: [
        defineField({ name: "eyebrow", title: "Small label above the heading", type: "string", validation: (r) => r.required() }),
        listField("h1Lines", "Heading lines", { group: null, min: 1 }),
        listField("paragraphs", "Paragraphs", { group: null, min: 1 }),
        imageRefField("image", { required: true, group: null }),
        defineField({
          name: "badge",
          title: "Badge over the image",
          type: "object",
          fields: [
            defineField({ name: "title", type: "string", validation: (r) => r.required() }),
            defineField({ name: "note", type: "string", validation: (r) => r.required() }),
          ],
        }),
        actionsField("actions", "Buttons", { group: null, min: 1 }),
      ],
      group: "hero",
    }),

    defineField({
      name: "methodology",
      title: "How a case study is built",
      type: "object",
      fields: [
        defineField({ name: "index", title: "Section number", type: "string", validation: (r) => r.required() }),
        defineField({ name: "label", type: "string", validation: (r) => r.required() }),
        defineField({ name: "heading", type: "string", validation: (r) => r.required() }),
        defineField({ name: "body", type: "text", rows: 3, validation: (r) => r.required() }),
        defineField({
          name: "items",
          title: "Stages",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              name: "stage",
              fields: [
                defineField({ name: "eyebrow", title: "Small label above the heading", type: "string", validation: (r) => r.required() }),
                defineField({ name: "name", type: "string", validation: (r) => r.required() }),
                defineField({ name: "body", type: "text", rows: 2, validation: (r) => r.required() }),
                defineField({ name: "statValue", title: "Figure", type: "string", validation: (r) => r.required() }),
                defineField({ name: "statNote", title: "Figure caption", type: "string", validation: (r) => r.required() }),
              ],
              preview: { select: { title: "name", subtitle: "statValue" } },
            }),
          ],
          validation: (r) => r.required().min(1),
        }),
      ],
      group: "body",
    }),

    defineField({
      name: "meantime",
      title: "What to look at meanwhile",
      type: "object",
      fields: [
        defineField({ name: "index", title: "Section number", type: "string", validation: (r) => r.required() }),
        defineField({ name: "label", type: "string", validation: (r) => r.required() }),
        defineField({ name: "heading", type: "string", validation: (r) => r.required() }),
        defineField({ name: "body", type: "text", rows: 3, validation: (r) => r.required() }),
        defineField({
          name: "items",
          title: "Alternatives",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              name: "alternative",
              fields: [
                defineField({
                  name: "icon",
                  type: "string",
                  options: { list: ["ribbon", "shield", "check", "doc"].map((v) => ({ title: v, value: v })) },
                  validation: (r) => r.required(),
                }),
                defineField({ name: "eyebrow", title: "Small label above the heading", type: "string", validation: (r) => r.required() }),
                defineField({ name: "name", type: "string", validation: (r) => r.required() }),
                defineField({ name: "body", type: "text", rows: 2, validation: (r) => r.required() }),
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
              preview: { select: { title: "name", subtitle: "eyebrow" } },
            }),
          ],
          validation: (r) => r.required().min(1),
        }),
      ],
      group: "body",
    }),

    defineField({
      name: "invitation",
      title: "Invitation to be the first",
      type: "object",
      fields: [
        defineField({ name: "index", title: "Section number", type: "string", validation: (r) => r.required() }),
        defineField({ name: "label", type: "string", validation: (r) => r.required() }),
        defineField({ name: "eyebrow", title: "Small label above the heading", type: "string", validation: (r) => r.required() }),
        listField("headingLines", "Heading lines", { group: null, min: 1 }),
        listField("paragraphs", "Paragraphs", { group: null, min: 1 }),
        defineField({
          name: "cta",
          title: "Button",
          type: "object",
          fields: [
            defineField({ name: "label", type: "string", validation: (r) => r.required() }),
            defineField({ name: "href", title: "Link address", type: "string", validation: (r) => r.required() }),
          ],
        }),
        defineField({ name: "listHeading", type: "string", validation: (r) => r.required() }),
        listField("list", "Points", { group: null, min: 1 }),
        defineField({ name: "footnote", type: "string", validation: (r) => r.required() }),
      ],
      group: "body",
    }),

    defineField({
      name: "closing",
      title: "Closing band",
      type: "object",
      fields: [
        defineField({ name: "eyebrow", title: "Small label above the heading", type: "string", validation: (r) => r.required() }),
        listField("headingLines", "Heading lines", { group: null, min: 1 }),
        defineField({ name: "body", type: "text", rows: 3, validation: (r) => r.required() }),
        defineField({
          name: "actions",
          title: "Buttons",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              name: "closingAction",
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
                defineField({
                  name: "icon",
                  type: "string",
                  options: {
                    list: [
                      { title: "Mail", value: "mail" },
                      { title: "External", value: "out" },
                      { title: "Phone", value: "phone" },
                    ],
                  },
                }),
              ],
              preview: { select: { title: "label", subtitle: "href" } },
            }),
          ],
          validation: (r) => r.required().min(1),
        }),
      ],
      group: "body",
    }),
    defineField({ name: "seo", title: "Search engine listing", type: "seo", group: "meta" }),
    schemaTypesField,
  confirmField,
  ],
  preview: { prepare: () => ({ title: "Case Studies", subtitle: "/case-studies" }) },
});

/* ── /export ──────────────────────────────────────────────────────────────── */

export const exportPage = defineType({
  name: "exportPage",
  title: "Export",
  type: "document",
  groups: PAGE_GROUPS,
  fields: [
    ...pageIdentityFields("/export"),
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
      title: "Top of page",
      type: "object",
      fields: [
        defineField({ name: "badge", type: "string", validation: (r) => r.required() }),
        listField("h1Lines", "Heading lines", { group: null, min: 1 }),
        defineField({ name: "intro", type: "text", rows: 3, validation: (r) => r.required().min(40) }),
        imageRefField("image", { required: true, group: null }),
        defineField({
          name: "hub",
          title: "Hub marker on the map",
          type: "object",
          description:
            "Position on the 1000×500 map plate. x and y are coordinates on that plate, not percentages.",
          fields: [
            defineField({ name: "label", type: "string", validation: (r) => r.required() }),
            defineField({ name: "x", type: "number", validation: (r) => r.required().min(0).max(1000) }),
            defineField({ name: "y", type: "number", validation: (r) => r.required().min(0).max(500) }),
          ],
        }),
        defineField({
          name: "visionStrip",
          title: "Figure strip — concept build only",
          type: "string",
          description: "e.g. “95 MARKETS SCREENED · 18 PLAYBOOKS · 9 LANES”. Shown only on the password-protected concept build.",
        }),
        defineField({
          name: "visionPins",
          title: "Extra map pins — concept build only",
          description: "The wider screened set. Never shown on the public site.",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              name: "mapPin",
              fields: [
                defineField({ name: "label", title: "Label", type: "string", validation: (r) => r.required() }),
                defineField({ name: "x", type: "number", validation: (r) => r.required().min(0).max(1000) }),
                defineField({ name: "y", type: "number", validation: (r) => r.required().min(0).max(500) }),
              ],
              preview: { select: { title: "label" } },
            }),
          ],
        }),
      ],
      group: "hero",
    }),

    defineField({
      name: "markets",
      title: "Markets",
      type: "array",
      description: "One per trade lane. Each pins itself on the map.",
      of: [
        defineArrayMember({
          type: "object",
          name: "market",
          fields: [
            defineField({
              name: "slug",
              title: "Anchor id",
              type: "string",
              description:
                "Used in the page address when someone links straight to this market — lowercase, no spaces.",
              validation: (r) => r.required().min(2),
            }),
            defineField({ name: "eyebrow", title: "Small label above the heading", type: "string", validation: (r) => r.required() }),
            defineField({ name: "chip", title: "Small tag on the card", type: "string", validation: (r) => r.required() }),
            defineField({ name: "heading", type: "string", validation: (r) => r.required() }),
            defineField({ name: "body", type: "text", rows: 3, validation: (r) => r.required().min(40) }),
            imageRefField("image", { required: true, group: null }),
            defineField({
              name: "pin",
              title: "Map pin",
              type: "object",
              fields: [
                defineField({ name: "x", type: "number", validation: (r) => r.required().min(0).max(1000) }),
                defineField({ name: "y", type: "number", validation: (r) => r.required().min(0).max(500) }),
              ],
            }),
            defineField({
              name: "pinLabel",
              title: "Pin label",
              type: "string",
              description: 'Set beside the pin on the map, in capitals: "UNITED ARAB EMIRATES". Empty draws the pin unlabelled.',
            }),
            defineField({
              name: "pins",
              title: "Further pins for this market",
              description: "When one block covers two ports or countries (Kenya and Tanzania), each extra pin here.",
              type: "array",
              of: [
                defineArrayMember({
              type: "object",
              name: "mapPin",
              fields: [
                defineField({ name: "label", title: "Label", type: "string", validation: (r) => r.required() }),
                defineField({ name: "x", type: "number", validation: (r) => r.required().min(0).max(1000) }),
                defineField({ name: "y", type: "number", validation: (r) => r.required().min(0).max(500) }),
              ],
              preview: { select: { title: "label" } },
            }),
              ],
            }),
            defineField({
              name: "pinNote",
              title: "Pin tooltip",
              type: "string",
              description: "Shown when the pin is hovered: port · transit days · FCL/LCL.",
            }),
            listField("points", "Points", { group: null, min: 1 }),
            defineField({
              name: "caveat",
              title: "Duty or regulatory caveat",
              type: "text",
              rows: 2,
              description:
                "Rendered italic and muted. This is where an honest limitation goes — it should not be dropped to make a lane look simpler than it is.",
            }),
            defineField({
              name: "links",
              type: "array",
              of: [
                defineArrayMember({
                  type: "object",
                  name: "marketLink",
                  fields: [
                    defineField({ name: "label", type: "string", validation: (r) => r.required() }),
                    defineField({ name: "href", title: "Link address", type: "string", validation: (r) => r.required() }),
                  ],
                  preview: { select: { title: "label", subtitle: "href" } },
                }),
              ],
            }),
            defineField({
              name: "panel",
              title: "Extra panel",
              type: "object",
              description: "Only some lanes have one.",
              fields: [
                defineField({ name: "heading", type: "string", validation: (r) => r.required() }),
                defineField({ name: "body", type: "text", rows: 3 }),
                defineField({
                  name: "terms",
                  title: "Trade terms",
                  type: "array",
                  of: [
                    defineArrayMember({
                      type: "object",
                      name: "term",
                      fields: [
                        defineField({ name: "code", type: "string", validation: (r) => r.required() }),
                        defineField({ name: "name", type: "string", validation: (r) => r.required() }),
                        defineField({ name: "body", type: "text", rows: 2, validation: (r) => r.required() }),
                      ],
                      preview: { select: { title: "code", subtitle: "name" } },
                    }),
                  ],
                }),
                defineField({ name: "facts", type: "array", of: [labelValueMember] }),
                defineField({ name: "footnote", type: "string" }),
              ],
              options: { collapsible: true, collapsed: true },
            }),
          ],
          preview: { select: { title: "heading", subtitle: "chip" } },
        }),
      ],
      validation: (r) => r.required().min(1),
      group: "body",
    }),

    defineField({
      name: "process",
      title: "How an order ships",
      type: "object",
      fields: [
        defineField({ name: "eyebrow", title: "Small label above the heading", type: "string", validation: (r) => r.required() }),
        defineField({ name: "heading", type: "string", validation: (r) => r.required() }),
        defineField({ name: "body", type: "text", rows: 3, validation: (r) => r.required() }),
        defineField({
          name: "steps",
          title: "Steps",
          type: "array",
          description: "Numbered on the page in this order.",
          of: [
            defineArrayMember({
              type: "object",
              name: "shipStep",
              fields: [
                defineField({
                  name: "icon",
                  type: "string",
                  options: {
                    list: ["doc", "clipboard", "box", "pallet", "ship", "truck"].map((v) => ({ title: v, value: v })),
                  },
                  validation: (r) => r.required(),
                }),
                defineField({ name: "name", type: "string", validation: (r) => r.required() }),
                defineField({ name: "body", type: "text", rows: 2, validation: (r) => r.required() }),
                defineField({
                  name: "lines",
                  title: "Labelled lines",
                  description: "We need · You get back · We do · Why it matters. When filled, these show instead of the body.",
                  type: "array",
                  of: [
                    defineArrayMember({
                      type: "object",
                      name: "stepLine",
                      fields: [
                        defineField({ name: "label", title: "Label", type: "string", validation: (r) => r.required() }),
                        defineField({ name: "text", title: "Text", type: "text", rows: 2, validation: (r) => r.required() }),
                      ],
                      preview: { select: { title: "label", subtitle: "text" } },
                    }),
                  ],
                }),
              ],
              preview: { select: { title: "name", subtitle: "body" } },
            }),
          ],
          validation: (r) => r.required().min(1),
        }),
      ],
      group: "body",
    }),

    defineField({
      name: "incoterms",
      title: "Incoterms",
      description: "Its own section on the page (#incoterms). Until this is filled, the terms stay inside the US & EU market panel.",
      type: "object",
      fields: [
        defineField({ name: "eyebrow", title: "Small label above the heading", type: "string" }),
        defineField({ name: "heading", type: "string" }),
        defineField({ name: "body", type: "text", rows: 2 }),
        defineField({
          name: "terms",
          title: "Terms",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              name: "incoterm",
              fields: [
                defineField({ name: "code", title: "Code", type: "string", validation: (r) => r.required() }),
                defineField({ name: "name", type: "string", validation: (r) => r.required() }),
                defineField({ name: "body", type: "text", rows: 2, validation: (r) => r.required() }),
              ],
              preview: { select: { title: "code", subtitle: "name" } },
            }),
          ],
        }),
        defineField({ name: "standard", title: "Standard term", type: "string", description: "The code offered by default — FOB." }),
        defineField({ name: "footnote", type: "text", rows: 2 }),
      ],
      options: { collapsible: true, collapsed: true },
      group: "body",
    }),
    defineField({
      name: "documents",
      title: "Export documents",
      type: "object",
      fields: [
        defineField({ name: "eyebrow", title: "Small label above the heading", type: "string", validation: (r) => r.required() }),
        defineField({ name: "heading", type: "string", validation: (r) => r.required() }),
        defineField({ name: "body", type: "text", rows: 3, validation: (r) => r.required() }),
        defineField({
          name: "items",
          title: "Documents",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              name: "exportDoc",
              fields: [
                defineField({
                  name: "icon",
                  type: "string",
                  options: { list: ["doc", "clipboard", "shield", "check"].map((v) => ({ title: v, value: v })) },
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
      group: "body",
    }),

    defineField({
      name: "quote",
      title: "Enquiry form",
      type: "object",
      fields: [
        defineField({ name: "heading", type: "string", validation: (r) => r.required() }),
        defineField({ name: "body", type: "text", rows: 3, validation: (r) => r.required() }),
        listField("checks", "Reassurance lines", { group: null, min: 1 }),
        defineField({ name: "formHeading", type: "string", validation: (r) => r.required() }),
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
      group: "body",
    }),

    defineField({
      name: "summary",
      title: "Closing summary",
      type: "object",
      fields: [
        defineField({ name: "eyebrow", title: "Small label above the heading", type: "string", validation: (r) => r.required() }),
        defineField({ name: "heading", type: "string", validation: (r) => r.required() }),
        defineField({ name: "body", type: "text", rows: 3, validation: (r) => r.required() }),
        defineField({ name: "facts", type: "array", of: [labelValueMember], validation: (r) => r.required().min(1) }),
      ],
      group: "body",
    }),
    defineField({ name: "seo", title: "Search engine listing", type: "seo", group: "meta" }),
    defineField({
      name: "faqs",
      title: "Questions & answers",
      description:
        "The six export steps and the Incoterms, each phrased as a question. Submitted to Google as structured data.",
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
  furtherReadingField,
  confirmField,
  ],
  preview: { prepare: () => ({ title: "Export", subtitle: "/export" }) },
});

export const MEDIUM_MARKETING_TYPES = [
  certificationsPage,
  caseStudiesPage,
  exportPage,
];
