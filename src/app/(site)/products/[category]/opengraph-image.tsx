import { getCategoryPage } from "@/lib/product-source";
import { imageUrl } from "@/lib/schema";
import { cardTitle, ogCard, OG_SIZE, OG_TYPE } from "@/lib/og-card";

export const size = OG_SIZE;
export const contentType = OG_TYPE;
export const alt = "Margo Rubber Products product line";

export default async function Image({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const page = await getCategoryPage(category);
  const fm = page?.frontmatter;
  return ogCard({
    eyebrow: "Product line",
    title: fm ? cardTitle(fm.seo.title) || fm.h1 : "Rubber components",
    photo: fm?.hero?.image ? await imageUrl(fm.hero.image) : null,
  });
}
