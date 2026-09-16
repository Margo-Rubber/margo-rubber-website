import { getSitePage } from "@/lib/page-source";
import { buildMetadata } from "@/lib/seo";
import { pageGraph } from "@/lib/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { aboutPageSchema } from "@/content/schemas";
import {
  AboutHero,
  Awards,
  Clients,
  Closing,
  Green,
  HeroStats,
  Leadership,
  Manufacturing,
  Numbers,
  Presence,
  Story,
  Team,
  Timeline,
  Values,
  Vision,
} from "@/components/sections/AboutBlocks";

export async function generateMetadata() {
  const fm = await getSitePage("about", aboutPageSchema);
  return buildMetadata(fm, "/about");
}

/**
 * /about — brief A12.
 *
 * Carries two anchors that other pages and the old sitemap point at:
 * #story and #manufacturing. Keep both if sections are ever reordered.
 *
 * Almost every figure on this page is still awaiting Margo's sign-off, so the
 * content file ships `status: placeholder`, which means noindex plus no
 * Organization JSON-LD. See the confirmWithMargo block in about.mdx.
 */
export default async function AboutPage() {
  const fm = await getSitePage("about", aboutPageSchema);

  return (
    <>
      <JsonLd
        status={fm.status}
        graph={await pageGraph({
          type: "AboutPage",
          path: "/about",
          name: fm.seo.title,
          description: fm.seo.description,
          crumbs: [{ name: "Home", path: "/" }, { name: "About", path: "/about" }],
        })}
      />

      <AboutHero
        badge={fm.badge}
        lines={fm.h1Lines}
        accentLines={fm.h1AccentLines}
        intro={fm.intro}
        actions={fm.actions}
        image={fm.heroImage}
        watchLabel={fm.watchLabel}
        scrollLabel={fm.scrollLabel}
      />

      <HeroStats stats={fm.heroStats} />

      <Story
        head={fm.story}
        paragraphs={fm.story.paragraphs}
        checks={fm.story.checks}
        badge={fm.story.badge}
        images={fm.story.images}
        cta={fm.story.cta}
      />

      <Vision
        head={fm.vision}
        watermark={fm.vision.watermark}
        items={fm.vision.items}
      />

      <Values head={fm.values} items={fm.values.items} />

      <Leadership
        eyebrow={fm.leadership.eyebrow}
        image={fm.leadership.image}
        quoteLines={fm.leadership.quoteLines}
        quoteAccent={fm.leadership.quoteAccent}
        body={fm.leadership.body}
        person={fm.leadership.person}
      />

      <Manufacturing
        head={fm.manufacturing}
        main={fm.manufacturing.main}
        side={fm.manufacturing.side}
        stats={fm.manufacturing.stats}
        portfolioLabel={fm.manufacturing.portfolioLabel}
        portfolio={fm.manufacturing.portfolio}
      />

      <Team head={fm.team} members={fm.team.members} stats={fm.team.stats} />

      <Presence
        head={fm.presence}
        image={fm.presence.image}
        countries={fm.presence.countries}
        stats={fm.presence.stats}
      />

      <Awards
        head={fm.awards}
        items={fm.awards.items}
        auditedLabel={fm.awards.auditedLabel}
        auditors={fm.awards.auditors}
        auditImage={fm.awards.auditImage}
      />

      <Green
        head={fm.green}
        image={fm.green.image}
        imageBadge={fm.green.imageBadge}
        bars={fm.green.bars}
      />

      <Numbers
        head={fm.numbers}
        stats={fm.numbers.stats}
        testimonial={fm.numbers.testimonial}
      />

      <Timeline head={fm.timeline} items={fm.timeline.items} />

      <Clients label={fm.clients.label} items={fm.clients.items} />

      <Closing
        eyebrow={fm.closing.eyebrow}
        lines={fm.closing.lines}
        accentLines={fm.closing.accentLines}
        body={fm.closing.body}
        image={fm.closing.image}
        placeholder={fm.closing.placeholder}
        submitLabel={fm.closing.submitLabel}
        assurances={fm.closing.assurances}
      />
    </>
  );
}
