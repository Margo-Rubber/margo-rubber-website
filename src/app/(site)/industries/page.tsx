import { getSitePage } from "@/lib/page-source";
import { IS_VISION } from "@/lib/build-mode";
import { SITE_URL } from "@/lib/seo";
import { trail } from "@/lib/breadcrumbs";
import { buildMetadata } from "@/lib/seo";
import { industriesListNode, pageGraph } from "@/lib/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { industriesHubSchema } from "@/content/schemas";
import {
  EnquiryPanel,
  IndustriesHero,
  IndustryGrid,
  SectorCards,
} from "@/components/sections/IndustryBlocks";

export async function generateMetadata() {
  const fm = await getSitePage("industries", industriesHubSchema);
  return buildMetadata(fm, "/industries");
}

export default async function IndustriesHubPage() {
  const fm = await getSitePage("industries", industriesHubSchema);

  const crumbs = trail(["Industries", "/industries"]);

  return (
    <>
      <JsonLd
        status={fm.status}
        graph={await pageGraph({
          type: "CollectionPage",
          path: "/industries",
          name: fm.seo.title,
          description: fm.seo.description,
          crumbs,
          mainEntity: { "@id": `${SITE_URL}/industries#list` },
          extra: [industriesListNode()],
        })}
      />

      <IndustriesHero
        breadcrumb={crumbs}
        badge={fm.badge}
        lines={fm.h1Lines}
        accentLines={fm.h1AccentLines}
        intro={fm.intro}
        facts={fm.heroFacts.map((f) => ({
          label: (IS_VISION && f.labelVision) || f.label,
          value: f.value,
        }))}
        image={fm.hero?.image}
      />

      <IndustryGrid
        placeholder={fm.filter.placeholder}
        chips={fm.filter.chips}
        eyebrow={fm.primary.eyebrow}
        heading={fm.primary.heading}
        items={fm.primary.items}
      />

      <SectorCards
        eyebrow={fm.additional.eyebrow}
        heading={fm.additional.heading}
        note={fm.additional.note}
        items={fm.additional.items}
      />

      <EnquiryPanel
        heading={fm.enquiry.heading}
        body={fm.enquiry.body}
        points={fm.enquiry.points}
        fields={fm.enquiry.fields}
        submitLabel={fm.enquiry.submitLabel}
        footnote={fm.enquiry.footnote}
      />
    </>
  );
}
