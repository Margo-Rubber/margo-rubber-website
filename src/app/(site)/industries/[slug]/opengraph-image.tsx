import { getIndustryPage } from "@/lib/industry-source";
import { cardTitle, ogCard, OG_SIZE, OG_TYPE } from "@/lib/og-card";

export const size = OG_SIZE;
export const contentType = OG_TYPE;
export const alt = "Margo Rubber Products industry page";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await getIndustryPage(slug);
  const fm = page?.frontmatter;
  return ogCard({
    eyebrow: fm?.navLabel ? `Industry · ${fm.navLabel}` : "Industry",
    title: fm ? cardTitle(fm.seo.title) : "Rubber components by industry",
  });
}
