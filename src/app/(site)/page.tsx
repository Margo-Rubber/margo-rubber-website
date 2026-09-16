import { getSitePage } from "@/lib/page-source";
import { getSiteSettings } from "@/lib/settings";
import { buildMetadata } from "@/lib/seo";
import { pageGraph, processListNode } from "@/lib/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { homePageSchema } from "@/content/schemas";
import {
  Edge,
  ExportMarkets,
  Facility,
  HomeCta,
  HomeHero,
  Materials,
  Portfolio,
  Process,
  Sectors,
  Story,
  TrustBar,
} from "@/components/sections/HomeBlocks";

export async function generateMetadata() {
  const fm = await getSitePage("home", homePageSchema);
  return buildMetadata(fm, "/");
}

/**
 * / — the homepage.
 *
 * The compound table in the materials section is the one block on this page
 * sourced from Margo's own published data: it reads SITE.COMPOUNDS rather than
 * duplicating the figures in MDX, so the homepage and the product pages can
 * never drift apart.
 *
 * Almost every other figure here is still the design's and awaits sign-off, so
 * the content file ships `status: placeholder` (noindex, no JSON-LD). See the
 * confirmWithMargo block in home.mdx.
 */
export default async function HomePage() {
  const [fm, settings] = await Promise.all([
    getSitePage("home", homePageSchema),
    getSiteSettings(),
  ]);

  return (
    <>
      <JsonLd
        status={fm.status}
        graph={await pageGraph({
          path: "/",
          name: fm.seo.title,
          description: fm.seo.description,
          isHome: true,
          heroSlot: fm.hero.image,
          extra: [processListNode(fm.process.steps, "/", fm.process.lines.join(" "))],
        })}
      />

      <HomeHero
        eyebrow={fm.hero.eyebrow}
        h1Lines={fm.hero.h1Lines}
        intro={fm.hero.intro}
        image={fm.hero.image}
        actions={fm.hero.actions}
        chips={fm.hero.chips}
        cards={fm.hero.cards}
      />

      <TrustBar label={fm.trustbar.label} items={fm.trustbar.items} />

      <Story
        eyebrow={fm.story.eyebrow}
        lines={fm.story.lines}
        paragraphs={fm.story.paragraphs}
        image={fm.story.image}
        imageBadge={fm.story.imageBadge}
        floatCard={fm.story.floatCard}
        stats={fm.story.stats}
        cta={fm.story.cta}
      />

      <Edge
        eyebrow={fm.edge.eyebrow}
        lines={fm.edge.lines}
        items={fm.edge.items}
      />

      <Portfolio
        eyebrow={fm.portfolio.eyebrow}
        lines={fm.portfolio.lines}
        cta={fm.portfolio.cta}
        items={fm.portfolio.items}
      />

      <Sectors
        eyebrow={fm.sectors.eyebrow}
        lines={fm.sectors.lines}
        items={fm.sectors.items}
      />

      <Process
        eyebrow={fm.process.eyebrow}
        lines={fm.process.lines}
        body={fm.process.body}
        steps={fm.process.steps}
      />

      <Facility
        eyebrow={fm.facility.eyebrow}
        lines={fm.facility.lines}
        body={fm.facility.body}
        image={fm.facility.image}
        inset={fm.facility.inset}
        badge={fm.facility.badge}
        checks={fm.facility.checks}
      />

      <ExportMarkets
        eyebrow={fm.exportMarkets.eyebrow}
        lines={fm.exportMarkets.lines}
        hub={fm.exportMarkets.hub}
        lanes={fm.exportMarkets.lanes}
        note={fm.exportMarkets.note}
      />

      <Materials
        eyebrow={fm.materials.eyebrow}
        lines={fm.materials.lines}
        body={fm.materials.body}
        axis={fm.materials.axis}
        footnote={fm.materials.footnote}
        compounds={settings.compounds}
      />

      <HomeCta
        eyebrow={fm.cta.eyebrow}
        lines={fm.cta.lines}
        panel={fm.cta.panel}
        fields={fm.cta.fields}
        uploadLabel={fm.cta.uploadLabel}
        uploadHint={fm.cta.uploadHint}
        submitLabel={fm.cta.submitLabel}
        footnote={fm.cta.footnote}
      />
    </>
  );
}
