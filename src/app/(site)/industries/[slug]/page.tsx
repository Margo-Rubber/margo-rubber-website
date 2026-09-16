import { notFound } from "next/navigation";
import { trail } from "@/lib/breadcrumbs";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbNode, faqNode, organizationNode, shouldEmitSchema } from "@/lib/schema";
import { getIndustryPage, industrySlugs } from "@/lib/industry-source";
import { BlockRenderer } from "@/components/blocks/BlockRenderer";
import { Section } from "@/components/ui/Section";
import { IndustryHero } from "@/components/sections/IndustryDetail";

/** ONE file → all nine industry pages. */
export async function generateStaticParams() {
  return (await industrySlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata(props: PageProps<"/industries/[slug]">) {
  const { slug } = await props.params;
  const page = await getIndustryPage(slug);
  return page ? buildMetadata(page.frontmatter, `/industries/${slug}`) : {};
}

export default async function IndustryPage(props: PageProps<"/industries/[slug]">) {
  const { slug } = await props.params;

  const page = await getIndustryPage(slug);
  if (!page) notFound();

  const { frontmatter: fm, blocks } = page;
  const path = `/industries/${slug}`;
  const crumbs = trail(["Industries", "/industries"], [fm.navLabel, path]);

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      await organizationNode(),
      breadcrumbNode(crumbs),
      ...(faqNode(fm.faqs) ? [faqNode(fm.faqs)!] : []),
    ],
  };

  return (
    <>
      {shouldEmitSchema(fm.status) && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
        />
      )}

      <IndustryHero
        breadcrumb={crumbs}
        badge={fm.badge}
        lines={fm.h1Lines}
        accentLines={fm.h1AccentLines}
        intro={fm.intro}
        actions={fm.actions}
        image={fm.hero?.image}
        boost={fm.heroBoost}
      />

      {/* Industry pages have no alternating band, so nothing alternates. */}
      <BlockRenderer blocks={blocks} comp2={false} />

      {/* Mandatory verbatim non-claim sentences, e.g. NORSOK/API on oil-gas.
          Not a block: it is a legal obligation attached to the page, not a
          section an editor chooses to place. */}
      {fm.nonClaims.length > 0 && (
        <Section>
          <div className="border-line rounded-card border bg-[#0A0A0A] p-6">
            {fm.nonClaims.map((n) => (
              <p key={n.slice(0, 24)} className="text-ink-4 text-sm leading-relaxed">
                {n}
              </p>
            ))}
          </div>
        </Section>
      )}
    </>
  );
}
