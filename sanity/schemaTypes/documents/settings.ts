import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * SITE SETTINGS — the strings that must be identical on every page.
 *
 * Content sheets §08 lists them: legal name, address, phone, email, the
 * response times, the minimum run, terms, the documents that ship with every
 * consignment, the certification record and the eight-row compound table.
 * On the old site each was typed wherever it appeared — which is how one
 * promise was published at six different speeds and one compound at three
 * different temperatures.
 *
 * One document, one of each thing. The footer, every CTA, the structured
 * data and the compound tables read it. An editor changes a value here and
 * it changes everywhere; a check fails the build if any page still disagrees.
 *
 * Mirrors src/content/schemas/settings.ts, which is what the server validates
 * against. Add a field in both places.
 */

const text = (name: string, title: string, description?: string, rows = 3) =>
  defineField({ name, title, type: "text", rows, description, validation: (r) => r.required() });
const str = (name: string, title: string, description?: string) =>
  defineField({ name, title, type: "string", description, validation: (r) => r.required() });

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  groups: [
    { name: "entity", title: "Company & contact", default: true },
    { name: "commercial", title: "Promises & terms" },
    { name: "certifications", title: "Certifications" },
    { name: "compounds", title: "Compound table" },
    { name: "clients", title: "Customers" },
    { name: "guides", title: "Guides" },
  ],
  fields: [
    defineField({
      name: "slug",
      title: "Identifier",
      type: "slug",
      readOnly: true,
      hidden: true,
      initialValue: { current: "settings" },
    }),

    /* ── Company & contact ─────────────────────────────────────────── */
    defineField({
      name: "entity",
      title: "Company & contact",
      type: "object",
      group: "entity",
      fields: [
        str("legalName", "Legal name", "A firm, not a company — never “Pvt. Ltd.”"),
        str("shortName", "Short name"),
        defineField({ name: "foundingYear", title: "Founding year", type: "number", validation: (r) => r.required().integer().min(1900) }),
        defineField({
          name: "address",
          title: "Address",
          type: "object",
          fields: [
            str("street", "Street line", "Exactly as confirmed, landmarks included."),
            defineField({ name: "lines", title: "Address as displayed, line by line", type: "array", of: [defineArrayMember({ type: "string" })], validation: (r) => r.required().min(2) }),
            str("locality", "City"),
            str("region", "State"),
            str("postalCode", "Postcode"),
            str("country", "Country code", "Two letters: IN"),
          ],
        }),
        defineField({
          name: "geo",
          title: "Plant coordinates",
          type: "object",
          fields: [
            defineField({ name: "lat", title: "Latitude", type: "number", validation: (r) => r.required() }),
            defineField({ name: "lng", title: "Longitude", type: "number", validation: (r) => r.required() }),
          ],
        }),
        str("phone", "Phone", "The one number published everywhere."),
        str("whatsapp", "WhatsApp"),
        str("email", "Email", "The one address published everywhere."),
        str("hours", "Hours, as displayed"),
        defineField({
          name: "hoursSchema",
          title: "Hours, for search engines",
          type: "object",
          fields: [
            defineField({ name: "days", title: "Days open", type: "array", of: [defineArrayMember({ type: "string" })] }),
            str("opens", "Opens (24 h)"),
            str("closes", "Closes (24 h)"),
          ],
        }),
        defineField({ name: "gstin", title: "GSTIN", type: "string" }),
        defineField({
          name: "sameAs",
          title: "Company profiles elsewhere",
          description: "LinkedIn, IndiaMART, Google Business Profile — full URLs.",
          type: "array",
          of: [defineArrayMember({ type: "url" })],
        }),
        defineField({
          name: "description",
          title: "One-line description for search engines",
          description: "Used only in structured data — one sentence, no claims that are not held.",
          type: "text",
          rows: 2,
        }),
        defineField({
          name: "knowsAbout",
          title: "Subjects the company is known for",
          description: "Short terms, for search engines: “Rubber moulding”, “O-rings”, “FKM”.",
          type: "array",
          of: [defineArrayMember({ type: "string" })],
        }),
        defineField({
          name: "areaServed",
          title: "Export markets served",
          description: "Two-letter country codes, one per market: AU, GB, AE …",
          type: "array",
          of: [defineArrayMember({ type: "string" })],
        }),
        defineField({
          name: "founders",
          title: "Founders",
          description: "The named people on the About page. Each appears in structured data with their title.",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              name: "founder",
              fields: [
                str("name", "Name"),
                str("role", "Title"),
                defineField({ name: "knowsAbout", title: "Areas of expertise", type: "array", of: [defineArrayMember({ type: "string" })] }),
              ],
              preview: { select: { title: "name", subtitle: "role" } },
            }),
          ],
        }),
      ],
    }),

    /* ── Promises & terms ──────────────────────────────────────────── */
    defineField({
      name: "commercial",
      title: "Promises & terms",
      type: "object",
      group: "commercial",
      fields: [
        str("acknowledgement", "Acknowledgement", "e.g. “within one business day”"),
        str("quotation", "Quotation", "e.g. “within 48 hours” — the one figure, everywhere"),
        str("prototype", "Prototype"),
        str("samples", "Fitment samples"),
        str("production", "Production lead time"),
        defineField({ name: "minimumRunPieces", title: "Minimum run — pieces", type: "number", validation: (r) => r.required().integer().positive() }),
        text("minimumRunMoulded", "Minimum run — moulded parts, as a sentence"),
        text("minimumRunContinuous", "Minimum run — profile, lining, tape"),
        text("terms", "Payment & delivery terms"),
        text("documents", "Documents with every consignment"),
        text("incoterms", "Incoterms"),
        text("tolerance", "Tolerance statement"),
        defineField({ name: "capacityInstalledMonthly", title: "Installed capacity per month", type: "number", validation: (r) => r.required().integer() }),
        defineField({ name: "capacityCurrentMonthly", title: "Current output per month", type: "number", validation: (r) => r.required().integer() }),
      ],
    }),

    /* ── Certifications ────────────────────────────────────────────── */
    defineField({
      name: "certifications",
      title: "Certifications",
      type: "object",
      group: "certifications",
      fields: [
        str("line", "Footer line", "e.g. “ISO 9001:2015 · Certificate 09111526A · Integral Certification Ltd”"),
        text("scopeNote", "Scope note", "Travels with the badge everywhere it appears."),
        defineField({
          name: "items",
          title: "Certification record",
          description: "Held and in-progress, each with its status stated on the badge. Only held rows reach structured data.",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              name: "certification",
              fields: [
                str("code", "Standard", "As written on the badge: ISO 9001:2015"),
                defineField({
                  name: "standing",
                  title: "Standing",
                  type: "string",
                  options: { list: [{ title: "Held", value: "held" }, { title: "In progress", value: "in-progress" }], layout: "radio" },
                  validation: (r) => r.required(),
                }),
                str("statusLabel", "Status as shown on the badge", "Approved · Upgrade in progress · Qualification in progress"),
                str("title", "Title"),
                text("body", "Body"),
                defineField({ name: "identifier", title: "Certificate number", type: "string" }),
                defineField({ name: "issuer", title: "Issued by", type: "string" }),
                defineField({ name: "validThrough", title: "Valid until", type: "date" }),
                defineField({ name: "scope", title: "Scope", type: "string" }),
                defineField({ name: "target", title: "Target (in-progress rows)", type: "string" }),
              ],
              preview: { select: { title: "code", subtitle: "statusLabel" } },
            }),
          ],
          validation: (r) => r.required().min(1),
        }),
      ],
    }),

    /* ── Compound table ────────────────────────────────────────────── */
    defineField({
      name: "compounds",
      title: "Compound table",
      description: "The eight compounds and their service ranges. Every page that shows a range reads this table.",
      type: "array",
      group: "compounds",
      of: [
        defineArrayMember({
          type: "object",
          name: "compound",
          fields: [
            str("code", "Code", "AEM · FKM · VMQ · EPDM · NBR · CR · SBR · NR"),
            str("name", "Name as displayed"),
            str("fullName", "Full name"),
            str("descriptor", "One-line descriptor"),
            defineField({ name: "minC", title: "Minimum °C", type: "number", validation: (r) => r.required() }),
            defineField({ name: "maxC", title: "Maximum °C", type: "number", validation: (r) => r.required() }),
            defineField({ name: "continuousMaxC", title: "Continuous maximum °C", description: "Only where it differs from the peak (AEM, FKM).", type: "number" }),
            str("hardness", "Hardness band", "e.g. 40–90 Shore A"),
            defineField({ name: "href", title: "Link address", type: "string", description: "Where the compound name links to, if anywhere." }),
          ],
          preview: {
            select: { title: "name", min: "minC", max: "maxC" },
            prepare: ({ title, min, max }) => ({ title, subtitle: `${min} to +${max} °C` }),
          },
        }),
      ],
      validation: (r) => r.required().length(8),
    }),

    /* ── Customers ─────────────────────────────────────────────────── */
    defineField({
      name: "clients",
      title: "Customers",
      type: "object",
      group: "clients",
      fields: [
        text("trademarkLine", "Trade-mark line", "Shown beneath every customer list."),
        defineField({
          name: "items",
          title: "Named accounts",
          description: "In sector order. Text only until logo permission letters exist.",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              name: "client",
              fields: [str("name", "Name"), str("sector", "Sector")],
              preview: { select: { title: "name", subtitle: "sector" } },
            }),
          ],
        }),
      ],
    }),

    /* ── Guides ────────────────────────────────────────────────────── */
    defineField({
      name: "guideReviewer",
      title: "Guide reviewer",
      description: "“Technical guides are reviewed before publication by {name}, {role}, at our Nashik works.” Nothing renders while empty.",
      type: "object",
      group: "guides",
      fields: [
        defineField({ name: "name", title: "Name", type: "string" }),
        defineField({ name: "role", title: "Role", type: "string" }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Site settings" }) },
});
