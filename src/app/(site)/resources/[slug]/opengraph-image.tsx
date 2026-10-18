import { getResourcePage } from "@/lib/resource-source";
import { ogCard, OG_SIZE, OG_TYPE } from "@/lib/og-card";

export const size = OG_SIZE;
export const contentType = OG_TYPE;
export const alt = "Margo Rubber Products engineering guide";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await getResourcePage(slug);
  return ogCard({
    eyebrow: "Engineering guide",
    title: page?.frontmatter.h1 ?? "Rubber engineering guide",
  });
}
