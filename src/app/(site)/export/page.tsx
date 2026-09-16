import { ExportLaneSequence } from "@/components/sections/ExportLaneSequence";
import { IS_VISION } from "@/lib/build-mode";
import { Section } from "@/components/ui/Section";
import { FAQAccordion } from "@/components/sections/HubBlocks";
import { trail } from "@/lib/breadcrumbs";
import { getSitePage } from "@/lib/page-source";
import { buildMetadata } from "@/lib/seo";
import { incotermsTermSetNode, pageGraph } from "@/lib/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { exportPageSchema } from "@/content/schemas";
import {
  ExportDocuments,
  ExportHero,
  IncotermsSection,
  ExportProcess,
  ExportQuote,
  ExportSummary,
  MarketSection,
} from "@/components/sections/ExportBlocks";

export async function generateMetadata() {
  const fm = await getSitePage("export", exportPageSchema);
  return buildMetadata(fm, "/export");
}

/**
 * /export — brief A18.
 *
 * The eight market sections carry the canonical anchors from §4.0 of the plan
 * (#australia, #uae-saudi, #us-eu, #uk, #malaysia, #usa, #singapore,
 * #east-africa). The hero map links into them, so those anchors are load-bearing
 * and must not be renamed.
 *
 * Note: /export has NO nav entry in the source architecture, so it is reachable
 * only from the homepage sector card and the footer. Flagged in §4.0.
 */
export default async function ExportPage() {
  const fm = await getSitePage("export", exportPageSchema);

  const crumbs = trail(["Export", "/export"]);

  return (
    <>
      <JsonLd
        status={fm.status}
        graph={await pageGraph({
          path: "/export",
          name: fm.seo.title,
          description: fm.seo.description,
          crumbs,
          faqs: fm.faqs,
          extra: incotermsTermSetNode(
            fm.incoterms?.terms ?? fm.markets.find((m) => m.panel?.terms?.length)?.panel?.terms ?? [],
          ),
        })}
      />

      <ExportHero
        breadcrumb={crumbs}
        badge={fm.hero.badge}
        h1Lines={fm.hero.h1Lines}
        intro={fm.hero.intro}
        image={fm.hero.image}
        hub={fm.hero.hub}
        markets={fm.markets}
        visionStrip={IS_VISION ? fm.hero.visionStrip : undefined}
      />

      {/* Pinned scroll sequence. Sits between the hero's static overview plate
          and the per-market detail sections, so it reads as the transition
          from "we export" to "here is each market". */}
      <ExportLaneSequence
        hub={fm.hero.hub}
        markets={fm.markets}
        extraPins={IS_VISION ? fm.hero.visionPins : []}
      />

      {/* Incoterms as their own section once the editor has filled it; the
          US & EU panel keeps the nested copy until then (sheet 06 §05). */}
      {fm.incoterms && (
        <IncotermsSection
          eyebrow={fm.incoterms.eyebrow}
          heading={fm.incoterms.heading}
          body={fm.incoterms.body}
          terms={fm.incoterms.terms}
          standard={fm.incoterms.standard}
          footnote={fm.incoterms.footnote}
        />
      )}

      {fm.markets.map((m, i) => (
        <MarketSection key={m.slug} market={m} flip={i % 2 === 1} />
      ))}

      <ExportProcess
        eyebrow={fm.process.eyebrow}
        heading={fm.process.heading}
        body={fm.process.body}
        steps={fm.process.steps}
      />

      <ExportDocuments
        eyebrow={fm.documents.eyebrow}
        heading={fm.documents.heading}
        body={fm.documents.body}
        items={fm.documents.items}
      />

      {/* The FAQPage node is built from this same list, so what Google is
          told is exactly what the reader sees. Nothing renders while the
          list is empty. */}
      {fm.faqs.length > 0 && (
        <Section eyebrow="EXPORT QUESTIONS" eyebrowVariant="rule" heading="Common questions about exporting from Nashik">
          <div className="mx-auto max-w-[860px]">
            <FAQAccordion items={fm.faqs} />
          </div>
        </Section>
      )}

      <ExportQuote
        heading={fm.quote.heading}
        body={fm.quote.body}
        checks={fm.quote.checks}
        formHeading={fm.quote.formHeading}
        fields={fm.quote.fields}
        submitLabel={fm.quote.submitLabel}
        footnote={fm.quote.footnote}
      />

      <ExportSummary
        eyebrow={fm.summary.eyebrow}
        heading={fm.summary.heading}
        body={fm.summary.body}
        facts={fm.summary.facts}
      />
    </>
  );
}
