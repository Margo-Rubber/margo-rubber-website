import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo";
import { productCategoryGraph, shouldEmitSchema } from "@/lib/schema";
import { BlockRenderer } from "@/components/blocks/BlockRenderer";
import { categorySlugs, getCategoryPage } from "@/lib/product-source";
import { Section } from "@/components/ui/Section";
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
            __html: JSON.stringify(await productCategoryGraph(fm, path)),
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
        breadcrumb={
          fm.heroBreadcrumb
            ? [
                { label: "Products", href: "/products" },
                { label: fm.navLabel, href: path },
              ]
            : undefined
        }
      />

      <BlockRenderer
        blocks={blocks}
        comp2={comp2}
        prose={
          // Free-form prose — passed only when the .mdx body actually has
          // any, so a structured page doesn't ship an empty padded band.
          hasBody && Content ? (
            <Section>
              <Content />
            </Section>
          ) : undefined
        }
      />
    </>
  );
}
