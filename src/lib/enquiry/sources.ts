import { z } from "zod";
import { attachmentRefSchema } from "./attachment-ref";

/**
 * ENQUIRY SOURCES
 *
 * Nine forms across six pages, each with its own field set, all posting to one
 * endpoint. This file is the only place that knows how a given form's fields
 * map onto the `enquiries` table.
 *
 * Adding a form later means adding an entry here. It does not mean another
 * endpoint, another validator, or another place that talks to the database.
 */

/** Every form the site can submit from. Matches `enquiries.source`. */
export const SOURCES = [
  "contact",
  "export",
  "products",
  "industries",
  "certifications",
  "why-margo",
  "home",
  /** Catalogue download on /products. Gated on an email, so still a lead. */
  "catalogue",
  /** Email-only capture in the /about closing band. */
  "about",
] as const;

export type Source = (typeof SOURCES)[number];

/**
 * Canonical columns. A form field is mapped onto one of these, or falls
 * through to `raw` alone.
 */
export const CANONICAL = [
  "name",
  "company",
  "email",
  "phone",
  "country",
  "product",
  "quantity",
  "message",
] as const;

export type Canonical = (typeof CANONICAL)[number];

/**
 * Per-source field mapping: the form's own field name on the left, the column
 * it belongs in on the right.
 *
 * Fields absent here are still captured, in `raw`. Nothing submitted is ever
 * discarded; the mapping only decides what earns a column and therefore what
 * the dashboard can filter and sort by.
 */
export const FIELD_MAP: Record<Source, Record<string, Canonical>> = {
  contact: {
    // The two-step RFQ form. Field names come from contact.mdx `quote.step1`
    // and `quote.step2`, not from the shorter names the other forms use.
    fullName: "name",
    company: "company",
    email: "email",
    phone: "phone",
    country: "country",
    productCategory: "product",
    volume: "quantity",
    details: "message",
    // `industry` has no column of its own and stays in raw.
  },

  export: {
    company: "company",
    email: "email",
    country: "country",
    requirements: "message",
    // `incoterm` is deliberately not canonical: it is meaningful only for
    // export enquiries, so it lives in `raw` rather than adding a column that
    // is null on eight forms out of nine.
  },

  products: {
    name: "name",
    company: "company",
    email: "email",
    phone: "phone",
    product: "product",
    quantity: "quantity",
    message: "message",
  },

  industries: {
    name: "name",
    company: "company",
    email: "email",
    product: "product",
    message: "message",
  },

  certifications: {
    name: "name",
    company: "company",
    email: "email",
    need: "message",
  },

  "why-margo": {
    name: "name",
    company: "company",
    country: "country",
    email: "email",
    material: "product",
    application: "message",
    // `notes` stays in raw.
  },

  catalogue: {
    name: "name",
    email: "email",
    company: "company",
    // Which catalogue: "Automotive catalogue" on an industry page. Absent on
    // the main catalogue form on /products.
    catalogue: "product",
  },

  about: {
    email: "email",
  },

  home: {
    company: "company",
    email: "email",
    country: "country",
    phone: "phone",
    product: "product",
    volume: "quantity",
    requirements: "message",
  },
};

/**
 * What every submission must carry, whatever form it came from.
 *
 * Only email is genuinely required. A procurement engineer who types an
 * address and one line about the part is a real lead; rejecting them for
 * omitting a company name would be choosing tidy data over enquiries.
 */
const baseFields = z.object({
  // A missing email is the common case (an empty field never reaches the
  // map), so it gets the visitor's own sentence, not zod's.
  email: z
    .string({ error: "Please enter your work email address." })
    .trim()
    .toLowerCase()
    .email("Enter a valid email address"),
  name: z.string().trim().max(120).optional(),
  company: z.string().trim().max(160).optional(),
  phone: z.string().trim().max(40).optional(),
  country: z.string().trim().max(80).optional(),
  product: z.string().trim().max(160).optional(),
  quantity: z.string().trim().max(120).optional(),
  message: z.string().trim().max(5000).optional(),
});

/**
 * The submitted payload.
 *
 * `fields` is loose on purpose: the form posts its own field names and this
 * schema checks the canonical shape after mapping. Validating the raw names
 * here would mean this file changing every time a label does.
 */
export const enquiryPayloadSchema = z.object({
  source: z.enum(SOURCES),
  fields: z.record(z.string(), z.string()),
  meta: z.object({
    page: z.string().min(1).max(500),
    referrer: z.string().max(500).optional(),
    /** Milliseconds between the form rendering and submitting. See spam.ts. */
    elapsedMs: z.coerce.number().int().nonnegative().optional(),
  }),
  /** Honeypot. Must be empty; a bot fills every field it finds. */
  company_website: z.string().max(0).optional(),
  /** The file already uploaded to Cloudinary, by reference — see attachments.ts. */
  attachment: attachmentRefSchema.optional(),
});

export type EnquiryPayload = z.infer<typeof enquiryPayloadSchema>;

export type MappedEnquiry = z.infer<typeof baseFields> & {
  source: Source;
  page: string;
  referrer?: string;
  raw: Record<string, string>;
};

/**
 * Applies the source's field map, then validates the canonical shape.
 *
 * Returns either the mapped row or the field errors, so the caller can send
 * them back to the form rather than a generic failure.
 */
export function mapAndValidate(
  payload: EnquiryPayload,
):
  | { ok: true; data: MappedEnquiry }
  | { ok: false; errors: Record<string, string> } {
  const map = FIELD_MAP[payload.source];
  const canonical: Record<string, string> = {};

  for (const [field, value] of Object.entries(payload.fields)) {
    const column = map[field];
    if (column && value.trim() !== "") canonical[column] = value;
  }

  const parsed = baseFields.safeParse(canonical);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const column = String(issue.path[0] ?? "form");
      // Report against the form's own field name, not the column, so the
      // message can be attached to the input the visitor is looking at.
      const field =
        Object.entries(map).find(([, c]) => c === column)?.[0] ?? column;
      errors[field] ??= issue.message;
    }
    return { ok: false, errors };
  }

  return {
    ok: true,
    data: {
      ...parsed.data,
      source: payload.source,
      page: payload.meta.page,
      referrer: payload.meta.referrer,
      raw: payload.fields,
    },
  };
}
