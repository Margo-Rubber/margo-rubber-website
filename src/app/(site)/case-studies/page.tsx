import { getSitePage } from "@/lib/page-source";
import { trail } from "@/lib/breadcrumbs";
import { buildMetadata } from "@/lib/seo";
import { pageGraph } from "@/lib/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { caseStudiesPageSchema } from "@/content/schemas";
import {
  CaseClosing,
  CaseHero,
  Invitation,
  Meantime,
  Methodology,
} from "@/components/sections/CaseStudyBlocks";

export async function generateMetadata() {
  const fm = await getSitePage("case-studies", caseStudiesPageSchema);
  return buildMetadata(fm, "/case-studies");
}

/**
 * /case-studies — brief C4.
 *
 * The brief said "placeholder only, do not fabricate", and the Figma design
 * already does exactly that: it states plainly that Margo has no documented
 * export case studies yet, sets out the four-part structure a real one will
 * follow, and invites a first partner. So this page ships the design verbatim.
 * It is the only page in the build with nothing held back.
 *
 * When the first real case study arrives it should become a new content
 * collection (src/content/case-studies/*.mdx) rather than an edit here: the
 * four headings in the methodology section map straight onto frontmatter.
 */
export default async function CaseStudiesPage() {
  const fm = await getSitePage("case-studies", caseStudiesPageSchema);

  const crumbs = trail(["Case Studies", "/case-studies"]);

  return (
    <>
      <JsonLd
        status={fm.status}
        graph={await pageGraph({
          path: "/case-studies",
          name: fm.seo.title,
          description: fm.seo.description,
          crumbs,
        })}
      />

      <CaseHero
        breadcrumb={crumbs}
        eyebrow={fm.hero.eyebrow}
        h1Lines={fm.hero.h1Lines}
        paragraphs={fm.hero.paragraphs}
        image={fm.hero.image}
        actions={fm.hero.actions}
      />

      <Methodology
        index={fm.methodology.index}
        label={fm.methodology.label}
        heading={fm.methodology.heading}
        body={fm.methodology.body}
        items={fm.methodology.items}
      />

      <Meantime
        index={fm.meantime.index}
        label={fm.meantime.label}
        heading={fm.meantime.heading}
        body={fm.meantime.body}
        items={fm.meantime.items}
      />

      <Invitation
        index={fm.invitation.index}
        label={fm.invitation.label}
        eyebrow={fm.invitation.eyebrow}
        headingLines={fm.invitation.headingLines}
        paragraphs={fm.invitation.paragraphs}
        cta={fm.invitation.cta}
        listHeading={fm.invitation.listHeading}
        list={fm.invitation.list}
        footnote={fm.invitation.footnote}
      />

      <CaseClosing
        eyebrow={fm.closing.eyebrow}
        headingLines={fm.closing.headingLines}
        body={fm.closing.body}
        actions={fm.closing.actions}
      />
    </>
  );
}
