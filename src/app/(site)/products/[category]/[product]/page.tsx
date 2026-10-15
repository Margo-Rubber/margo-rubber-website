import { notFound } from "next/navigation";
import { displayName, hrefFor, industryBySlug, productBySlug } from "@/content/routes";
import { trail } from "@/lib/breadcrumbs";
import { getFrontmatter } from "@/lib/content";
import { getSkuPage, skuSlugs } from "@/lib/sku-source";
import { buildMetadata } from "@/lib/seo";
import { pageGraph, skuNode } from "@/lib/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { getSiteSettings } from "@/lib/settings";
import {
  SkuAdvantages,
  SkuApplications,
  SkuCompounds,
  SkuCta,
  SkuDownloads,
  SkuFaq,
  SkuGallery,
  SkuHero,
  SkuProcess,
  SkuQuality,
  SkuRelated,
  SkuSpecs,
} from "@/components/sections/SkuBlocks";
import { FurtherReading } from "@/components/sections/FurtherReading";

/**
 * ONE file → every SKU page, built to `single category.png` section for section.
 *
 * Strategy D3 / Scenario 1 from §4.5: the blueprint states four separate times
 * that SKUs are sections rather than pages, so these ship `noindex` until real
 * per-part spec content exists. Structure complete, no thin-page penalty, and
 * the category page keeps the ranking intent.
 *
 * NO structured data is emitted here, deliberately. The design shows a star
 * rating ("4.8 / 5 from 143 verified orders"); fabricated aggregateRating
 * markup is banned by name in FORBIDDEN_CLAIMS and is a Google manual-action
 * risk. Product JSON-LD can be added once real specs and genuine reviews exist.
 *
 * SKU files are named `<category>--<slug>.mdx` because anchor ids are unique
 * per category, not globally: "epdm" is a real part in both gaskets and
 * oil-seals, and a flat filename would have silently dropped one.
 */

// Separator is "--", not "_": baseSchema validates slug against ^[a-z0-9-]+$
// and an underscore fails it, which made every SKU throw and prerender as a
// 404 page. Kebab slugs never contain a double hyphen, so the split is safe.
const fileFor = (category: string, product: string) => `${category}--${product}`;

export async function generateStaticParams() {
  return (await skuSlugs()).map((file) => {
    const i = file.indexOf("--");
    return { category: file.slice(0, i), product: file.slice(i + 2) };
  });
}

export async function generateMetadata(
  props: PageProps<"/products/[category]/[product]">,
) {
  const { category, product } = await props.params;
  const page = await getSkuPage(fileFor(category, product));
  return page
    ? buildMetadata(page.frontmatter, `/products/${category}/${product}`)
    : {};
}

export default async function SkuPage(
  props: PageProps<"/products/[category]/[product]">,
) {
  const { category, product } = await props.params;

  const [page, settings] = await Promise.all([
    getSkuPage(fileFor(category, product)),
    getSiteSettings(),
  ]);
  if (!page) notFound();

  const fm = page.frontmatter;

  // A SKU whose file says it belongs elsewhere must not resolve here, or the
  // same part would be reachable under every category.
  if (fm.category !== category) notFound();

  // Category display name and the sibling part list both come from the category
  // file, so the breadcrumb and "You may also need" can never drift from it.
  let categoryLabel = displayName(category);
  let siblings: { slug: string; label: string }[] = [];
  try {
    const cat = getFrontmatter("products", category);
    categoryLabel = cat.navLabel;
    siblings = cat.anchors
      .filter((a) => a.id !== product)
      .map((a) => ({ slug: a.id, label: a.label }));
  } catch {
    // A missing category file is a content error, not a reason to 500.
  }

  // The sheet's four: a sibling by slug, or "category/slug" for the
  // cross-category part that shares an assembly (sheet 32 §11). A part
  // that does not exist is left out rather than linked to a 404.
  const relatedParts = (
    await Promise.all(
      fm.relatedParts.map(async (r) => {
        if (r.slug.includes("/")) {
          const [cat, slug] = r.slug.split("/");
          // "industries/pumps-valves": the sector page the part serves.
          if (cat === "industries") {
            const ind = industryBySlug(slug);
            return ind ? { slug: r.slug, label: ind.label, difference: r.difference, href: hrefFor(ind) } : null;
          }
          const other = await getSkuPage(fileFor(cat, slug));
          return other && other.frontmatter.category === cat
            ? { slug: r.slug, label: other.frontmatter.h1, difference: r.difference, href: `/products/${cat}/${slug}` }
            : null;
        }
        // A bare category ("o-rings"): its page.
        const cat = productBySlug(r.slug);
        if (cat && !siblings.some((x) => x.slug === r.slug)) return { slug: r.slug, label: cat.label, difference: r.difference, href: hrefFor(cat) };
        // A sibling: its own document's heading, not the category file's list.
        const sib = await getSkuPage(fileFor(category, r.slug));
        return sib ? { slug: r.slug, label: sib.frontmatter.h1, difference: r.difference } : null;
      }),
    )
  ).filter((x): x is NonNullable<typeof x> => !!x);

  const crumbs = trail(
    ["Products", "/products"],
    [categoryLabel, `/products/${category}`],
    [fm.productCode || fm.h1, `/products/${category}/${product}`],
  );

  return (
    <>
      <JsonLd
        status={fm.status}
        graph={await pageGraph({
          path: `/products/${category}/${product}`,
          name: fm.seo.title,
          description: fm.seo.description,
          crumbs,
          // No FAQPage node here: the five questions are the same on every
          // part, and "Q1's answer competes with itself 31 times" (sheet 32
          // §10). The accordion stays visible; the schema lives with the
          // category once it has a questions section.
          extra: [
            await skuNode(
              fm,
              `/products/${category}/${product}`,
              `/products/${category}`,
              siblings.map((s) => `/products/${category}/${s.slug}`),
            ),
          ],
        })}
      />

      <SkuHero
        breadcrumb={crumbs}
        categoryLabel={categoryLabel}
        eyebrow={fm.eyebrow}
        h1={fm.h1}
        intro={fm.intro}
        gallery={fm.gallery}
        model3dUrl={fm.model3dUrl}
        quickSpecs={fm.quickSpecs}
        order={fm.order}
        assurances={fm.assurances}
      />

      <SkuGallery
        gallery={fm.gallery}
        dimensional={fm.dimensional}
        model3dUrl={fm.model3dUrl}
        partName={fm.h1}
      />

      <SkuSpecs
        productCode={fm.productCode}
        specs={fm.specs}
        hardness={fm.hardness}
        dimensions={fm.dimensions}
        dimensional={fm.dimensional}
        categoryLabel={categoryLabel}
        settings={settings}
      />

      <SkuCompounds
        codes={fm.compounds}
        properties={fm.compoundProperties}
        compounds={settings.compounds}
        ranking={fm.compoundRanking}
        router={fm.compoundRouter}
        h1={fm.h1}
        prompt={fm.compoundPrompt}
      />

      <SkuAdvantages items={fm.advantages} chip={fm.qualityChip} heading={fm.advantagesHeading} />

      <SkuApplications items={fm.applications} />

      <SkuProcess steps={fm.process} />

      <SkuQuality quality={fm.quality} foundingYear={settings.entity.foundingYear} />

      <SkuDownloads items={fm.downloads} documentation={fm.documentation} h1={fm.h1} />

      <SkuFaq items={fm.faqs} />

      {/* The sheet's four named siblings with their differences when set;
          the category's other parts otherwise. */}
      <SkuRelated items={relatedParts.length ? relatedParts : siblings} categorySlug={category} />
      <FurtherReading slugs={fm.related.resources} />

      <SkuCta
        h1={fm.h1}
        categorySlug={category}
        categoryLabel={categoryLabel}
        quotation={settings.commercial.quotation}
        body={fm.ctaBody}
      />
    </>
  );
}
