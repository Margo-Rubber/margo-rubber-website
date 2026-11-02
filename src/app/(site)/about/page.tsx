import { getSitePage } from "@/lib/page-source";
import { getSiteSettings, telHref } from "@/lib/settings";
import { trail } from "@/lib/breadcrumbs";
import { buildMetadata } from "@/lib/seo";
import { pageGraph, personNodes } from "@/lib/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { aboutPageSchema } from "@/content/schemas";
import {
  AboutHero,
  Awards,
  Clients,
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
import { FurtherReading } from "@/components/sections/FurtherReading";
import { CTABand } from "@/components/sections/Blocks";

export async function generateMetadata() {
  const fm = await getSitePage("about", aboutPageSchema);
  return buildMetadata(fm, "/about");
}

/**
 * /about — brief A12.
 *
 * Carries two anchors that other pages and the old sitemap point at:
 * #company-history (was #story until 21 Oct 2026, D5) and #manufacturing.
 * Keep both if sections are ever reordered.
 *
 * Almost every figure on this page is still awaiting Margo's sign-off, so the
 * content file ships `status: placeholder`, which means noindex plus no
 * Organization JSON-LD. See the confirmWithMargo block in about.mdx.
 */
export default async function AboutPage() {
  const fm = await getSitePage("about", aboutPageSchema);

  const crumbs = trail(["About", "/about"]);

  const settings = await getSiteSettings();
  return (
    <>
      <JsonLd
        status={fm.status}
        graph={await pageGraph({
          type: "AboutPage",
          path: "/about",
          name: fm.seo.title,
          description: fm.seo.description,
          crumbs,
          extra: await personNodes(),
        })}
      />

      <AboutHero
        breadcrumb={crumbs}
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
        image={fm.story.images.main}
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
        image={fm.manufacturing.main.image}
        more={["about.manufacturing.packaging", "about.manufacturing.line"]}
        stats={fm.manufacturing.stats}
        portfolioLabel={fm.manufacturing.portfolioLabel}
        portfolio={fm.manufacturing.portfolio}
        equipmentLabel={fm.manufacturing.equipmentLabel}
        equipment={fm.manufacturing.equipment}
      />

      <Team head={fm.team} members={fm.team.members} stats={fm.team.stats} />

      <Presence
        head={fm.presence}
        image={fm.presence.image}
        countries={fm.presence.countries}
        link={fm.presence.link}
      />

      <Awards
        head={fm.awards}
        certifications={settings.certifications}
        auditedLabel={fm.awards.auditedLabel}
        auditImage={fm.awards.auditImage}
      />

      {fm.green.enabled && (
      <Green
        head={fm.green}
        image={fm.green.image}
        imageBadge={fm.green.imageBadge}
        bars={fm.green.bars}
      />
      )}

      <Numbers
        head={fm.numbers}
        stats={fm.numbers.stats}
        testimonial={fm.numbers.testimonial}
        references={fm.numbers.references}
      />

      {/* Proposed years never publish — the sheet's rule, kept in code so an
          editor cannot flip one live by accident. */}
      {fm.timeline.items.some((i) => i.verification === "verified") && (
        <Timeline
          head={fm.timeline}
          items={fm.timeline.items.filter((i) => i.verification === "verified")}
        />
      )}

      <Clients
        label={fm.clients.label}
        items={fm.clients.items.map((c, i) =>
          typeof c === "string" ? { name: c, sector: fm.clients.sectors[i] } : c,
        )}
        trademarkLine={settings.clients.trademarkLine}
      />

      <FurtherReading slugs={fm.furtherReading} />

      {/* The same closing band as the product category pages (client,
          2 Nov 2026), in place of the photo-backed email box. Wording from
          Studio → About page → closing; the email field became the button. */}
      <CTABand
        eyebrow={fm.closing.eyebrow}
        heading={fm.closing.lines
          .map((l, i) => (fm.closing.accentLines.includes(i) ? `*${l}*` : l))
          .join(" ")}
        body={fm.closing.body}
        primary={{ label: fm.closing.submitLabel, href: "/contact" }}
        secondary={{ label: "Call Technical Sales", href: telHref(settings.entity.phone) }}
      />
    </>
  );
}
