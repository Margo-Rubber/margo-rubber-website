import { AnswerLead } from "@/components/sections/AnswerLead";
import { answerBlockFor } from "@/content/answer-blocks";
import { notFound } from "next/navigation";
import { trail } from "@/lib/breadcrumbs";
import { buildMetadata } from "@/lib/seo";
import { productCategoryGraph, shouldEmitSchema } from "@/lib/schema";
import { BlockRenderer } from "@/components/blocks/BlockRenderer";
import { categorySlugs, getCategoryPage } from "@/lib/product-source";
import { Section } from "@/components/ui/Section";
import { CategoryHero } from "@/components/sections/Blocks";
import { FurtherReading } from "@/components/sections/FurtherReading";
import { CatalogueBlock } from "@/components/sections/HubBlocks";
import { getProductCatalogue } from "@/lib/catalogue-file";

/** Category pages whose desktop hero uses the full-bleed photo layout (see
 *  CategoryHero `fullBleed`), with the wide image-registry key it shows.
 *  Add a slug here (and a wide photo to the registry) to switch a page.
 *
 *  `frame` is for a photo whose product reaches further left than the
 *  others: Tailwind classes (written out here so they are generated) that
 *  narrow the photo frame and choose which part of the photo it shows. */
const FULL_BLEED_HERO: Record<string, { image: string; frame?: string; fit?: string }> = {
  "o-rings": { image: "products.o-rings.hero-wide" },
  "oil-seals": { image: "products.oil-seals.hero-wide" },
  gaskets: { image: "products.gaskets.hero-wide" },
  grommets: { image: "products.grommets.hero-wide" },
  "anti-vibration-mounts": { image: "products.anti-vibration-mounts.hero-wide" },
  bellows: { image: "products.bellows.hero-wide" },
  "bonded-components": { image: "products.bonded-components.hero-wide" },
  bushes: { image: "products.bushes.hero-wide" },
  extrusion: { image: "products.extrusion.hero-wide" },
  "leak-test-rubber": { image: "products.leak-test-rubber.hero-wide" },
  // The slotted pad sits further left than most; a slightly narrower frame
  // keeps it clear of the end of the first heading line.
  "pads-stoppers-caps": { image: "products.pads-stoppers-caps.hero-wide", frame: "lg:left-[22%]" },
  // Reciprocating Seals
  seals: { image: "products.seals.hero-wide" },
  "rubber-lining": { image: "products.rubber-lining.hero-wide" },
  "sponge-foam-rubber": { image: "products.sponge-foam.hero-wide" },
  // The fanned mats fill the photo edge to edge: frame on the right 60% so
  // they sit clear of the long two-line heading and the intro.
  "rubber-mats": { image: "products.rubber-mats.hero-wide", frame: "lg:left-[40%]" },
  // Long two-line heading and a photo with the product from 18% across:
  // frame on the right 60%, photo shifted so both parts sit clear of the copy.
  diaphragms: {
    image: "products.diaphragms.hero-wide",
    frame: "lg:left-[40%]",
    fit: "object-[63%_center]",
  },
};

/**
 * ONE file → nine product category pages.
 *
 * Adding a category is adding one .mdx file to src/content/products/.
 * This route is never edited for it.
 */

export async function generateStaticParams() {
  return (await categorySlugs()).map((category) => ({ category }));
}

export async function generateMetadata(
  props: PageProps<"/products/[category]">,
) {
  const { category } = await props.params;
  const page = await getCategoryPage(category);
  return page ? buildMetadata(page.frontmatter, `/products/${category}`) : {};
}

export default async function ProductCategoryPage(
  props: PageProps<"/products/[category]">,
) {
  const { category } = await props.params;

  const page = await getCategoryPage(category);
  if (!page) notFound();

  const { frontmatter: fm, blocks, Content, hasBody } = page;
  const path = `/products/${category}`;

  // Heading splits across two lines, second line in accent — "Precision" /
  // "O-Rings". `h1Accent` sets the split explicitly; otherwise the last word
  // is used, which is correct for most headings but not ones ending "& X".
  const accentFromFm =
    fm.h1Accent && fm.h1.endsWith(fm.h1Accent) ? fm.h1Accent : null;
  const headingAccent = accentFromFm ?? fm.h1.split(" ").slice(-1)[0];
  const headingLead = fm.h1.slice(0, fm.h1.length - headingAccent.length).trim();

  /**
   * The newer comps alternate a near-black band with a lighter one. Whether a
   * page participates is decided here; WHICH blocks alternate is decided by
   * the renderer, because it depends on the order the blocks are actually in.
   */
  const comp2 = fm.heroActions.length > 0;

  // This product line's own catalogue PDF; no section without one.
  const catalogue = await getProductCatalogue(category);

  return (
    <>
      {shouldEmitSchema(fm.status) && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(await productCategoryGraph(fm, path, blocks)),
          }}
        />
      )}

      <CategoryHero
        // The certificate covers moulded parts only, and this fallback shows
        // on /products/extrusion and /products/sponge-foam-rubber too (N2).
        badge={fm.heroEyebrow ?? "ISO 9001:2015 (Moulded Parts) · Nashik, India"}
        chips={fm.heroChips}
        headingLead={headingLead}
        headingAccent={headingAccent}
        intro={fm.intro}
        link={fm.heroLink}
        stats={fm.heroStats}
        image={fm.hero?.image}
        actions={fm.heroActions}
        eyebrowVariant={fm.heroActions.length > 0 ? "rule" : "badge"}
        statsAlign={fm.heroStatsAlign}
        breadcrumb={trail(["Products", "/products"], [fm.navLabel, path])}
        fullBleed={category in FULL_BLEED_HERO}
        bleedImage={FULL_BLEED_HERO[category]?.image}
        bleedFrame={FULL_BLEED_HERO[category]?.frame}
        bleedFit={FULL_BLEED_HERO[category]?.fit}
      />

      <AnswerLead block={answerBlockFor(path)} />

      <BlockRenderer
        blocks={blocks}
        comp2={comp2}
        heroEyebrow={fm.heroEyebrow}
        prose={
          // Free-form prose — passed only when the .mdx body actually has
          // any, so a structured page doesn't ship an empty padded band.
          // The FAQPage node carries only questions the page already
          // answers in its own sections — a category sheet has no FAQ
          // section, so none is drawn (sheet 09, page-level).
          hasBody || fm.service?.area.length || fm.service?.exclusions.length || fm.related.resources.length ? (
            <>
              {hasBody && Content && (
                <Section>
                  <Content />
                </Section>
              )}
              {/* What the line covers and what it does not — sheet 38 §07.
                  Two plain lists; the exclusions are as load-bearing as the
                  coverage for a buyer deciding whether to ask. */}
              {fm.service && (fm.service.area.length > 0 || fm.service.exclusions.length > 0) && (
                <Section id="scope" heading={fm.service.heading}>
                  <div className="grid gap-8 md:grid-cols-2">
                    {fm.service.area.length > 0 && (
                      <ul className="space-y-2.5">
                        {fm.service.area.map((a) => (
                          <li key={a} className="text-ink-2 flex gap-3 text-sm">
                            <span aria-hidden className="bg-accent-400 mt-2 size-1.5 shrink-0 rounded-full" />
                            {a}
                          </li>
                        ))}
                      </ul>
                    )}
                    {fm.service.exclusions.length > 0 && (
                      <div className="rounded-card border-line border border-dashed p-6">
                        <p className="text-eyebrow text-ink-4 font-mono uppercase">
                          {fm.service.exclusionsHeading ?? "Not supplied"}
                        </p>
                        <ul className="mt-4 space-y-2.5">
                          {fm.service.exclusions.map((e) => (
                            <li key={e} className="text-ink-3 flex gap-3 text-sm">
                              <span aria-hidden className="text-ink-4">—</span>
                              {e}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </Section>
              )}
              {/* The guides this category's sheet, or a guide's own sheet,
                  asks it to send the reader on to — RES_02 §01, RES_05 §01. */}
              <FurtherReading slugs={fm.related.resources} />
            </>
          ) : undefined
        }
      />

      {/* Product-line catalogue, behind the same short form as an industry
          page's. Stored as a "catalogue" lead with "<Line> catalogue" as its
          product, and the buyer's email carries the same PDF (api/enquiry). */}
      {catalogue && (
        <Section id="catalogue" className="bg-surface">
          <CatalogueBlock
            heading={catalogue.heading ?? `Download the ${fm.navLabel} *Catalogue*`}
            body={
              catalogue.body ??
              `Every ${fm.navLabel.toLowerCase()} part we make in one PDF: part types, compounds, hardness ranges and size basis, ready to share with your engineering and purchasing teams.`
            }
            bullets={[]}
            formHeading={`Get the ${fm.navLabel} catalogue`}
            formBody="Tell us where to send it. The download starts as soon as you submit."
            submitLabel="Download Catalogue"
            fileUrl={catalogue.url}
            product={`${fm.navLabel} catalogue`}
          />
        </Section>
      )}
    </>
  );
}
