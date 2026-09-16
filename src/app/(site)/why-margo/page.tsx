import { getSitePage } from "@/lib/page-source";
import { trail } from "@/lib/breadcrumbs";
import { buildMetadata } from "@/lib/seo";
import { pageGraph } from "@/lib/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { whyMargoPageSchema } from "@/content/schemas";
import {
  Capabilities,
  Difference,
  Enquiry,
  Faq,
  Feedback,
  GlobalExport,
  Heritage,
  Materials,
  Quality,
  Responsibility,
  Standards,
  Support,
  Tenure,
  WhyHero,
} from "@/components/sections/WhyBlocks";

export async function generateMetadata() {
  const fm = await getSitePage("why-margo", whyMargoPageSchema);
  return buildMetadata(fm, "/why-margo");
}

/**
 * /why-margo — the manufacturer-vs-trading-house argument.
 *
 * This is the page with the deepest factual conflicts in the project: its
 * design asserts a 1982 founding, 60+ countries and IATF 16949 certification,
 * all three of which contradict other pages already built. It ships
 * `status: placeholder` (noindex, no JSON-LD) and every conflict is listed in
 * the confirmWithMargo block in why-margo.mdx.
 */
export default async function WhyMargoPage() {
  const fm = await getSitePage("why-margo", whyMargoPageSchema);

  const crumbs = trail(["Why Margo", "/why-margo"]);

  return (
    <>
      <JsonLd
        status={fm.status}
        graph={await pageGraph({
          path: "/why-margo",
          name: fm.seo.title,
          description: fm.seo.description,
          crumbs,
        })}
      />

      <WhyHero
        breadcrumb={crumbs}
        eyebrow={fm.hero.eyebrow}
        h1Lines={fm.hero.h1Lines}
        intro={fm.hero.intro}
        image={fm.hero.image}
        stats={fm.hero.stats}
        actions={fm.hero.actions}
      />

      <Heritage
        head={fm.heritage}
        image={fm.heritage.image}
        milestones={fm.heritage.milestones}
        stats={fm.heritage.stats}
        note={fm.heritage.note}
      />

      <Difference head={fm.difference} items={fm.difference.items} />

      <Capabilities
        head={fm.capabilities}
        banner={fm.capabilities.banner}
        bannerEyebrow={fm.capabilities.bannerEyebrow}
        bannerLines={fm.capabilities.bannerLines}
        items={fm.capabilities.items}
      />

      <Materials
        head={fm.materials}
        items={fm.materials.items}
        customNote={fm.materials.customNote}
      />

      <Quality
        head={fm.quality}
        image={fm.quality.image}
        imageCaption={fm.quality.imageCaption}
        stats={fm.quality.stats}
        checks={fm.quality.checks}
        note={fm.quality.note}
      />

      <Standards head={fm.standards} items={fm.standards.items} />

      <Responsibility
        head={fm.responsibility}
        cards={fm.responsibility.cards}
        initiativesHeading={fm.responsibility.initiativesHeading}
        initiatives={fm.responsibility.initiatives}
      />

      <GlobalExport
        head={fm.globalExport}
        image={fm.globalExport.image}
        stats={fm.globalExport.stats}
        regionsHeading={fm.globalExport.regionsHeading}
        regions={fm.globalExport.regions}
        industriesHeading={fm.globalExport.industriesHeading}
        industries={fm.globalExport.industries}
        terms={fm.globalExport.terms}
      />

      <Support head={fm.support} image={fm.support.image} items={fm.support.items} />

      <Tenure head={fm.tenure} columns={fm.tenure.columns} rows={fm.tenure.rows} />

      <Feedback
        head={fm.feedback}
        quote={fm.feedback.quote}
        initials={fm.feedback.initials}
        name={fm.feedback.name}
        role={fm.feedback.role}
        stats={fm.feedback.stats}
      />

      <Faq head={fm.faq} items={fm.faq.items} />

      <Enquiry
        eyebrow={fm.enquiry.eyebrow}
        lines={fm.enquiry.lines}
        body={fm.enquiry.body}
        contacts={fm.enquiry.contacts}
        note={fm.enquiry.note}
        fields={fm.enquiry.fields}
        submitLabel={fm.enquiry.submitLabel}
        footnote={fm.enquiry.footnote}
      />
    </>
  );
}
