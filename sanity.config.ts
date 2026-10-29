"use client";

import { defineConfig } from "sanity";
import { structureTool, type DocumentBuilder, type StructureBuilder } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { apiVersion, dataset, projectId } from "./sanity/env";
import { schemaTypes } from "./sanity/schemaTypes";
import { photographsMenu } from "./sanity/structure/photographs";
import {
  PhotographsView,
  RestoreOriginalAction,
  StudioField,
} from "./sanity/components/photographs.tsx";
import {
  singletonActions,
  singletonTemplateFilter,
} from "./sanity/structure/singletons";

/**
 * Sanity Studio, mounted inside this app at /studio.
 *
 * Embedded rather than standalone so the editor lives on Margo's own domain
 * and there is one deployment rather than two. Sanity's own setup flow
 * recommends standalone, which is right when the app sits inside a larger
 * repo — here the app IS the repo root, so a sibling folder would fall
 * outside version control.
 *
 * The desk is organised the way Margo's business is, not the way the schema
 * is. That distinction matters more as the model grows: a flat alphabetical
 * list of 17 document types is a database browser, not a place to work.
 */
/**
 * Every page document opens with two tabs: the editor, and "Photographs" —
 * the pictures that page draws, each with a button to replace it. That is
 * the path an editor actually takes: "I'm on the home page and I want to
 * change that picture", not "which of 85 slots is it".
 *
 * Explicit `S.document()` nodes in the structure below do not pick up
 * `defaultDocumentNode`, so the singletons go through this helper and the
 * lists get the same views from `defaultDocumentNode`.
 */
const withPhotographs = (S: StructureBuilder, doc: DocumentBuilder) =>
  doc.views([
    S.view.form(),
    S.view.component(PhotographsView).id("photographs").title("Photographs"),
  ]);

export default defineConfig({
  name: "margo",
  title: "Margo Rubber",
  basePath: "/studio",
  projectId,
  dataset,

  document: {
    // A page there can only be one of cannot be duplicated or deleted. A
    // photograph override gains "Restore original", placed right after
    // Publish so it is the second thing an editor sees, not a hunt through
    // the ⋮ menu for a Delete that sounds destructive.
    actions: (prev, ctx) => {
      const base = singletonActions(prev, ctx);
      if (ctx.schemaType !== "imageOverride") return base;
      const i = base.findIndex((a) => a.action === "publish");
      return [...base.slice(0, i + 1), RestoreOriginalAction, ...base.slice(i + 1)];
    },
    // …and is not offered by the global "create new" menu either, which builds
    // its list from the schema rather than from the actions above.
    newDocumentOptions: (prev) => singletonTemplateFilter(prev),
  },

  schema: { types: schemaTypes },
  // The "Currently on the site" panel on photograph documents. Attached here
  // rather than in the schema so the schema files stay loadable by the Node
  // checks — see sanity/components/photographs.tsx.
  form: { components: { field: StudioField } },
  plugins: [
    structureTool({
      defaultDocumentNode: (S, { schemaType }) =>
        schemaType === "imageOverride" ? S.document() : withPhotographs(S, S.document()),
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            S.listItem()
              .title("Product categories")
              .child(
                S.documentTypeList("productCategory")
                  .title("Product categories")
                  // Ordered the way the site orders them, not by creation
                  // date — an editor looking for "Gaskets" scans a list, and
                  // a list only supports scanning if it is alphabetical.
                  .defaultOrdering([{ field: "navLabel", direction: "asc" }]),
              ),
            S.listItem()
              .title("Industries")
              .child(
                S.documentTypeList("industry")
                  .title("Industries")
                  .defaultOrdering([{ field: "navLabel", direction: "asc" }]),
              ),
            S.listItem()
              .title("Parts")
              .child(
                // Grouped by category rather than listed flat: thirty-one
                // parts in one alphabetical list is a database browser, not a
                // place to work.
                S.documentTypeList("sku")
                  .title("Parts")
                  .defaultOrdering([
                    { field: "category", direction: "asc" },
                    { field: "h1", direction: "asc" },
                  ]),
              ),
            S.listItem()
              // The individual articles. The page that lists them is under
              // Pages → Resources & Guides, matching the site's own wording.
              .title("Guides")
              .child(
                S.documentTypeList("resource")
                  .title("Guides")
                  .defaultOrdering([{ field: "navLabel", direction: "asc" }]),
              ),
            S.divider(),

            /**
             * The one-off pages, opened DIRECTLY rather than through a list.
             *
             * Each of these exists exactly once, so a list would be a list of
             * one — an extra click that teaches the editor nothing. Pointing
             * at a fixed document id also means "Contact" always opens the
             * contact page and never an accidental second copy of it.
             */
            S.listItem()
              .title("Pages")
              .child(
                S.list()
                  .title("Pages")
                  .items([
                    S.listItem()
                      .title("Home")
                      .child(
                        withPhotographs(S, S.document().schemaType("homePage").documentId("homePage-home").title("Home")),
                      ),
                    S.listItem()
                      .title("About")
                      .child(
                        withPhotographs(S, S.document().schemaType("aboutPage").documentId("aboutPage-about").title("About")),
                      ),
                    S.listItem()
                      .title("Why Margo")
                      .child(
                        withPhotographs(S, S.document().schemaType("whyMargoPage").documentId("whyMargoPage-why-margo").title("Why Margo")),
                      ),
                    S.listItem()
                      .title("Export")
                      .child(
                        withPhotographs(S, S.document().schemaType("exportPage").documentId("exportPage-export").title("Export")),
                      ),
                    S.listItem()
                      .title("Manufacturing")
                      .child(
                        withPhotographs(S, S.document().schemaType("manufacturingPage").documentId("manufacturingPage-manufacturing").title("Manufacturing")),
                      ),
                    S.listItem()
                      .title("Certifications")
                      .child(
                        withPhotographs(S, S.document().schemaType("certificationsPage").documentId("certificationsPage-certifications").title("Certifications")),
                      ),
                    S.listItem()
                      .title("Case Studies")
                      .child(
                        withPhotographs(S, S.document().schemaType("caseStudiesPage").documentId("caseStudiesPage-case-studies").title("Case Studies")),
                      ),
                    S.listItem()
                      .title("Contact")
                      .child(
                        withPhotographs(S, S.document()
                          .schemaType("contactPage")
                          .documentId("contactPage-contact")
                          .title("Contact")),
                      ),
                    S.listItem()
                      .title("Products page")
                      .child(
                        withPhotographs(S, S.document()
                          .schemaType("productsHub")
                          .documentId("productsHub-products")
                          .title("Products page")),
                      ),
                    S.listItem()
                      .title("Industries page")
                      .child(
                        withPhotographs(S, S.document()
                          .schemaType("industriesHub")
                          .documentId("industriesHub-industries")
                          .title("Industries page")),
                      ),
                    S.listItem()
                      .title("Resources & Guides")
                      .child(
                        withPhotographs(S, S.document()
                          .schemaType("resourcesHub")
                          .documentId("resourcesHub-resources")
                          .title("Resources & Guides")),
                      ),
                    S.divider(),
                    S.listItem()
                      .title("Thank you")
                      .child(
                        withPhotographs(S, S.document()
                          .schemaType("utilityPage")
                          .documentId("utilityPage-thank-you")
                          .title("Thank you")),
                      ),
                    S.listItem()
                      .title("Page not found (404)")
                      .child(
                        withPhotographs(S, S.document()
                          .schemaType("utilityPage")
                          .documentId("utilityPage-not-found")
                          .title("Page not found")),
                      ),
                  ]),
              ),

            S.listItem()
              .title("Photographs")
              .child(photographsMenu(S)),
            S.listItem()
              .title("Site settings")
              .child(
                withPhotographs(
                  S,
                  S.document()
                    .schemaType("siteSettings")
                    .documentId("siteSettings-settings")
                    .title("Site settings"),
                ),
              ),
            S.listItem()
              .title("Footer")
              .child(
                withPhotographs(S, S.document()
                  .schemaType("siteFooter")
                  .documentId("siteFooter-footer")
                  .title("Footer")),
              ),

            S.divider(),
            S.listItem()
              .title("Legal pages")
              .child(S.documentTypeList("legal").title("Legal pages")),
          ]),
    }),
    // Query playground. Useful while building, and harmless in production —
    // it can only read what the dataset already exposes publicly.
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
