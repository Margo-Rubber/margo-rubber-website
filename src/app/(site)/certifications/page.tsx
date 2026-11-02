import { getSitePage } from "@/lib/page-source";
import { trail } from "@/lib/breadcrumbs";
import { buildMetadata } from "@/lib/seo";
import { pageGraph } from "@/lib/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { certificationsPageSchema } from "@/content/schemas";
import { Section } from "@/components/ui/Section";
import {
  CertHero,
  CertificateBlock,
  DocsPanel,
  FacilityGallery,
  IecCertificate,
  QualitySystem,
  ScopePanel,
} from "@/components/sections/CertBlocks";
import { IEC_SECTION } from "@/content/iec";

export async function generateMetadata() {
  const fm = await getSitePage("certifications", certificationsPageSchema);
  return buildMetadata(fm, "/certifications");
}

/**
 * /certifications — brief A11.
 *
 * Certs sit at the point of decision rather than buried in About, and the
 * scope panel states plainly what the certification is NOT. That reverses the
 * competitor cert-row pattern instead of copying it.
 *
 * The facility section carries the #manufacturing anchor, which is the 301
 * target for the old /our-plants/ page.
 */
export default async function CertificationsPage() {
  const fm = await getSitePage("certifications", certificationsPageSchema);

  const crumbs = trail(["Certifications", "/certifications"]);

  return (
    <>
      <JsonLd
        status={fm.status}
        graph={await pageGraph({
          path: "/certifications",
          name: fm.seo.title,
          description: fm.seo.description,
          crumbs,
        })}
      />

      <CertHero
        breadcrumb={crumbs}
        badge={fm.badge}
        lines={fm.h1Lines}
        accentLines={fm.h1AccentLines}
        intro={fm.intro}
        actions={fm.actions}
      />

      {fm.scope && (
        <Section
          id="scope"
          className="bg-[#050505]"
          eyebrow={fm.scope.eyebrow}
          heading={fm.scope.heading}
        >
          <ScopePanel
            meansHeading={fm.scope.meansHeading}
            means={fm.scope.means}
            notHeading={fm.scope.notHeading}
            notLead={fm.scope.notLead}
            notLeadBody={fm.scope.notLeadBody}
            notItems={fm.scope.notItems}
            footnote={fm.scope.footnote}
          />
        </Section>
      )}

      <Section
        id="certificate"
        eyebrow={fm.certificate.eyebrow}
        heading={fm.certificate.heading}
        body={fm.certificate.body}
      >
        {/* The industry pages' "View ISO Certificate" lands here
            (/certifications#iso-9001, sheets 27–28); the hero's own button
            lands on the section (#certificate, sheet 07). */}
        <div id="iso-9001">
          <CertificateBlock
            document={fm.certificate.document}
            card={fm.certificate.card}
            meta={fm.certificate.meta}
          />
        </div>
      </Section>

      {/* The export registration beside the quality certificate (client,
          2 Nov 2026); the same block as on /export. The bands below it
          flipped so the dark/darker alternation still holds. */}
      <Section
        id="iec"
        className="bg-[#050505]"
        eyebrow={IEC_SECTION.eyebrow}
        heading={IEC_SECTION.heading}
        body={IEC_SECTION.body}
      >
        <IecCertificate />
      </Section>

      {/* 301 target for the old /our-plants/ page. */}
      <Section
        id="manufacturing"
        eyebrow={fm.facility.eyebrow}
        heading={fm.facility.heading}
        body={fm.facility.body}
      >
        <FacilityGallery
          gallery={fm.facility.gallery}
          capabilities={fm.facility.capabilities}
        />
      </Section>

      <Section
        className="bg-[#050505]"
        eyebrow={fm.system.eyebrow}
        heading={fm.system.heading}
        body={fm.system.body}
      >
        <QualitySystem
          items={fm.system.items}
          auditNote={fm.system.auditNote}
        />
      </Section>

      <Section>
        <DocsPanel
          heading={fm.docs.heading}
          body={fm.docs.body}
          items={fm.docs.items}
          fields={fm.docs.fields}
          submitLabel={fm.docs.submitLabel}
          footnote={fm.docs.footnote}
          confirmation={fm.docs.confirmation}
        />
      </Section>
    </>
  );
}
