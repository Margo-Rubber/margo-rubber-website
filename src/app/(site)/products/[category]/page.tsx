import { notFound } from "next/navigation";
import { IndustryFAQ } from "@/components/sections/IndustryDetail";
import { trail } from "@/lib/breadcrumbs";
import { buildMetadata } from "@/lib/seo";
import { productCategoryGraph, shouldEmitSchema } from "@/lib/schema";
import { BlockRenderer } from "@/components/blocks/BlockRenderer";
import { categorySlugs, getCategoryPage } from "@/lib/product-source";
import { Container, Eyebrow, Section } from "@/components/ui/Section";
import { CategoryHero } from "@/components/sections/Blocks";

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
        badge="ISO 9001:2015 Certified · Nashik, India"
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
      />

      <BlockRenderer
        blocks={blocks}
        comp2={comp2}
        prose={
          // Free-form prose — passed only when the .mdx body actually has
          // any, so a structured page doesn't ship an empty padded band.
          // The FAQ renders from the same list the FAQPage node is built
          // from, so what Google is told is what the reader sees. It was
          // in the graph and missing from the page — content sheet 09 §09.
          hasBody || fm.faqs.length || fm.service?.area.length || fm.service?.exclusions.length ? (
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
              {fm.faqs.length > 0 && (
                <Section>
                  <Container className="!px-0">
                    <Eyebrow variant="rule">FREQUENTLY ASKED QUESTIONS</Eyebrow>
                    <h2 className="text-h2 mt-4 mb-10">Common questions about {fm.navLabel.toLowerCase()}.</h2>
                  </Container>
                  <IndustryFAQ items={fm.faqs} />
                </Section>
              )}
            </>
          ) : undefined
        }
      />
    </>
  );
}
