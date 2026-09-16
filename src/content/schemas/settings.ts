import { z } from "zod";

/**
 * SITE SETTINGS — the strings that must be identical on every page.
 *
 * The content sheets' §08 lists them: legal name, address, phone, email,
 * the response times, the minimum run, terms, the documents that ship with
 * every consignment, the certification record and the eight-row compound
 * table. On the old site each of these was typed wherever it appeared —
 * which is how one promise was published at six different speeds and one
 * compound at three different temperatures.
 *
 * One document. Components read it; JSON-LD reads it; a check fails the
 * build when any page disagrees with it. Editors change a value once.
 */

const certificationSchema = z.object({
  /** The standard as written on the badge: "ISO 9001:2015". */
  code: z.string().min(3),
  standing: z.enum(["held", "in-progress"]),
  /** Bracketed status shown on the badge: "Approved", "Upgrade in progress". */
  statusLabel: z.string().min(3),
  title: z.string().min(3),
  body: z.string().min(20),
  identifier: z.string().optional(),
  issuer: z.string().optional(),
  validThrough: z.string().optional(),
  scope: z.string().optional(),
  /** Roadmap year for in-progress rows: "end 2026", "2027". */
  target: z.string().optional(),
});

const compoundSchema = z.object({
  /** Short code used to match rows elsewhere: AEM, FKM, VMQ, EPDM, NBR, CR, SBR, NR. */
  code: z.string().min(2),
  /** Display name: "Silicone (VMQ)". */
  name: z.string().min(2),
  fullName: z.string().min(3),
  descriptor: z.string().min(3),
  minC: z.number(),
  maxC: z.number(),
  /** Where the peak and continuous ratings differ (AEM, FKM). */
  continuousMaxC: z.number().optional(),
  hardness: z.string().min(3),
  /** Where the compound name links to. */
  href: z.string().optional(),
});

export const siteSettingsSchema = z.object({
  slug: z.string(),

  entity: z.object({
    legalName: z.string().min(3),
    shortName: z.string().min(2),
    foundingYear: z.number().int().min(1900).max(2100),
    address: z.object({
      /** The street line exactly as confirmed, landmarks included. */
      street: z.string().min(10),
      /** The same address broken for display: three lines. */
      lines: z.array(z.string().min(3)).min(2),
      locality: z.string(),
      region: z.string(),
      postalCode: z.string(),
      country: z.string().length(2),
    }),
    geo: z.object({ lat: z.number(), lng: z.number() }),
    phone: z.string().min(8),
    whatsapp: z.string().min(8),
    email: z.string().email(),
    hours: z.string().min(5),
    hoursSchema: z.object({
      days: z.array(z.string()).min(1),
      opens: z.string(),
      closes: z.string(),
    }),
    gstin: z.string().optional(),
    /** LinkedIn, IndiaMART, Google Business Profile — empty until confirmed. */
    sameAs: z.array(z.string().url()).default([]),
    /** One sentence for the Organization node. Content sheet 01 §entity graph. */
    description: z.string().default(""),
    /** Organization.knowsAbout — the vocabulary the entity is tied to. */
    knowsAbout: z.array(z.string()).default([]),
    /** ISO 3166-1 alpha-2 codes for contactPoint.areaServed — the 18 export markets. */
    areaServed: z.array(z.string().length(2)).default([]),
    /** The named people on /about; each becomes a Person node and Organization.founder. */
    founders: z
      .array(
        z.object({
          name: z.string().min(3),
          role: z.string().min(3),
          knowsAbout: z.array(z.string()).default([]),
        }),
      )
      .default([]),
  }),

  commercial: z.object({
    acknowledgement: z.string().min(5),
    quotation: z.string().min(5),
    prototype: z.string().min(5),
    samples: z.string().min(5),
    production: z.string().min(5),
    minimumRunPieces: z.number().int().positive(),
    minimumRunMoulded: z.string().min(20),
    minimumRunContinuous: z.string().min(20),
    terms: z.string().min(20),
    documents: z.string().min(20),
    incoterms: z.string().min(10),
    tolerance: z.string().min(20),
    capacityInstalledMonthly: z.number().int().positive(),
    capacityCurrentMonthly: z.number().int().positive(),
  }),

  certifications: z.object({
    items: z.array(certificationSchema).min(1),
    /** The footer line, checkable on every page. */
    line: z.string().min(10),
    /** Scope caveat that travels with the badge everywhere it appears. */
    scopeNote: z.string().min(20),
  }),

  compounds: z.array(compoundSchema).length(8),

  clients: z.object({
    items: z.array(z.object({ name: z.string().min(2), sector: z.string().min(2) })).min(1),
    trademarkLine: z.string().min(20),
  }),

  guideReviewer: z.object({
    name: z.string().default(""),
    role: z.string().default(""),
  }),
});

export type SiteSettings = z.infer<typeof siteSettingsSchema>;
export type Certification = z.infer<typeof certificationSchema>;
export type Compound = z.infer<typeof compoundSchema>;
