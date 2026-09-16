import { notFound } from "next/navigation";
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
  let categoryLabel = category.replace(/-/g, " ");
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

  return (
    <>
      <JsonLd
        status={fm.status}
        graph={await pageGraph({
          path: `/products/${category}/${product}`,
          name: fm.seo.title,
          description: fm.seo.description,
          crumbs: [
            { name: "Home", path: "/" },
            { name: "Products", path: "/products" },
            { name: categoryLabel, path: `/products/${category}` },
            { name: fm.h1, path: `/products/${category}/${product}` },
          ],
          extra: [
            skuNode(fm, `/products/${category}/${product}`, `/products/${category}`),
          ],
        })}
      />

      <SkuHero
        categorySlug={category}
        categoryLabel={categoryLabel}
        productCode={fm.productCode}
        eyebrow={fm.eyebrow}
        h1={fm.h1}
        intro={fm.intro}
        stockLabel={fm.stockLabel}
        gallery={fm.gallery}
        quickSpecs={fm.quickSpecs}
        order={fm.order}
        assurances={fm.assurances}
      />

      <SkuGallery gallery={fm.gallery} dimensional={fm.dimensional} />

      <SkuSpecs
        productCode={fm.productCode}
        specs={fm.specs}
        dimensional={fm.dimensional}
        categoryLabel={categoryLabel}
        settings={settings}
      />

      <SkuCompounds
        codes={fm.compounds}
        properties={fm.compoundProperties}
        compounds={settings.compounds}
      />

      <SkuAdvantages items={fm.advantages} />

      <SkuApplications items={fm.applications} />

      <SkuProcess steps={fm.process} />

      <SkuQuality quality={fm.quality} />

      <SkuDownloads items={fm.downloads} />

      <SkuFaq items={fm.faqs} />

      <SkuRelated items={siblings} categorySlug={category} />

      <SkuCta
        h1={fm.h1}
        categorySlug={category}
        categoryLabel={categoryLabel}
        quotation={settings.commercial.quotation}
      />
    </>
  );
}
