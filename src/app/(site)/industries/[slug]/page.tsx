import { AnswerLead } from "@/components/sections/AnswerLead";
import { answerBlockFor } from "@/content/answer-blocks";
import { notFound } from "next/navigation";
import { trail } from "@/lib/breadcrumbs";
import { buildMetadata } from "@/lib/seo";
import { industryGraph, shouldEmitSchema } from "@/lib/schema";
import { getIndustryPage, industrySlugs } from "@/lib/industry-source";
import { BlockRenderer } from "@/components/blocks/BlockRenderer";
import { Section } from "@/components/ui/Section";
import { IndustryHero } from "@/components/sections/IndustryDetail";
import { FurtherReading } from "@/components/sections/FurtherReading";
import { getImageOverrides } from "@/lib/image-overrides";
import { getIndustryCatalogueFileUrl } from "@/lib/catalogue-file";
import { CatalogueBlock } from "@/components/sections/HubBlocks";

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

  const graph = industryGraph(fm, path, crumbs);

  // The brightness boost exists for one stock crop that is already faded to
  // black. Once an editor uploads a real photo for the slot, boosting it
  // blows it out and the heavy fade hides it — so the boost only applies to
  // the stock image, never to an uploaded one.
  const overrides = await getImageOverrides();
  const heroImage = fm.hero?.image;
  const boost = Boolean(fm.heroBoost) && !(heroImage && overrides[heroImage]);

  // The hero's catalogue button scrolls to this page's own catalogue section.
  // Sanity documents carry "#catalogue" already (migration of 26 Oct 2026);
  // this catches any copy still pointing at the old targets.
  const actions = fm.actions.map((a) =>
    a.href === "/certifications" || a.href === "/products#catalogue"
      ? { ...a, label: "Download Catalogue", href: "#catalogue" }
      : a,
  );

  // This industry's PDF, or the main catalogue until one is uploaded.
  const catalogueFileUrl = await getIndustryCatalogueFileUrl(slug);
  const cat = fm.catalogue;
  const catalogueName = `${fm.navLabel} catalogue`;


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
        chips={fm.heroChips}
        actions={actions}
        image={heroImage}
        boost={boost}
      />

      <AnswerLead block={answerBlockFor(path)} />

      {/* Industry pages have no alternating band, so nothing alternates. */}
      <BlockRenderer blocks={blocks} comp2={false} prose={<FurtherReading slugs={fm.related.resources} />} />

      {/* Industry catalogue, behind a short form. Each request is stored as a
          "catalogue" lead with "<Industry> catalogue" as its product, and the
          buyer's email carries the same PDF (api/enquiry). */}
      <Section id="catalogue" className="bg-surface">
        <CatalogueBlock
          heading={cat?.heading ?? `Download the ${fm.navLabel} *Catalogue*`}
          body={
            cat?.body ??
            `Every rubber component we make for ${fm.navLabel.toLowerCase()} applications in one PDF: part types, compounds, hardness ranges and sizes, ready to share with your engineering and purchasing teams.`
          }
          bullets={cat?.bullets ?? []}
          formHeading={cat?.formHeading ?? `Get the ${fm.navLabel} catalogue`}
          formBody={cat?.formBody ?? "Tell us where to send it. The download starts as soon as you submit."}
          submitLabel={cat?.submitLabel ?? "Download Catalogue"}
          footnote={cat?.footnote}
          fileUrl={catalogueFileUrl}
          product={catalogueName}
        />
      </Section>

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
