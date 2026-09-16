import {
  caseStudiesPageSchema,
  certificationsPageSchema,
  contactPageSchema,
  exportPageSchema,
  productsHubSchema,
  homePageSchema,
  whyMargoPageSchema,
  aboutPageSchema,
  footerSchema,
  industriesHubSchema,
  resourcesHubSchema,
  utilityPageSchema,
  siteSettingsSchema,
} from "../content/schemas/index.ts";

/**
 * SLUG → the schema that validates it and the Sanity type that stores it.
 *
 * The marketing pages have no shared schema, so this map is the only place
 * that knows which of the twelve applies to a given slug. It is imported by
 * the migration writer AND by `check:cms`, so a page cannot be migrated
 * against one schema and checked against another.
 *
 * A slug absent from here has not been migrated yet and is served from its
 * .mdx file. Adding an entry, a document type and a line in page-source.ts is
 * the whole of what migrating one of these pages involves.
 */
export const COLLECTIONS_FOR_PAGES: Record<
  string,
  { type: string; schema: import("zod").ZodTypeAny }
> = {
  resources: { type: "resourcesHub", schema: resourcesHubSchema },
  industries: { type: "industriesHub", schema: industriesHubSchema },
  contact: { type: "contactPage", schema: contactPageSchema },
  "thank-you": { type: "utilityPage", schema: utilityPageSchema },
  "not-found": { type: "utilityPage", schema: utilityPageSchema },
  certifications: { type: "certificationsPage", schema: certificationsPageSchema },
  "case-studies": { type: "caseStudiesPage", schema: caseStudiesPageSchema },
  export: { type: "exportPage", schema: exportPageSchema },
  products: { type: "productsHub", schema: productsHubSchema },
  home: { type: "homePage", schema: homePageSchema },
  "why-margo": { type: "whyMargoPage", schema: whyMargoPageSchema },
  about: { type: "aboutPage", schema: aboutPageSchema },
  footer: { type: "siteFooter", schema: footerSchema },
  // The strings every page shares. Slug "settings", one document, no route.
  settings: { type: "siteSettings", schema: siteSettingsSchema },
};
