import { getSkuPage } from "@/lib/sku-source";
import { imageUrl } from "@/lib/schema";
import { ogCard, OG_SIZE, OG_TYPE } from "@/lib/og-card";

export const size = OG_SIZE;
export const contentType = OG_TYPE;
export const alt = "Margo Rubber Products part";

/** A part's card carries the part's own photograph. */
export default async function Image({
  params,
}: {
  params: Promise<{ category: string; product: string }>;
}) {
  const { category, product } = await params;
  const page = await getSkuPage(`${category}--${product}`);
  const fm = page?.frontmatter;
  return ogCard({
    eyebrow: fm?.navLabel ? `Part · ${category.replace(/-/g, " ")}` : "Part",
    title: fm?.h1 ?? "Rubber part",
    photo: fm?.gallery.main ? await imageUrl(fm.gallery.main) : null,
  });
}
