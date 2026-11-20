import Link from "next/link";
import { notFound } from "next/navigation";
import { trail } from "@/lib/breadcrumbs";
import { buildMetadata } from "@/lib/seo";
import { pageGraph } from "@/lib/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { getIndustryPage } from "@/lib/industry-source";
import { BlockRenderer } from "@/components/blocks/BlockRenderer";
import { IndustryHero } from "@/components/sections/IndustryDetail";
import { Section } from "@/components/ui/Section";
import type { Block } from "@/content/blocks";
import { INDUSTRY_LANDING_COPY, LANDINGS, landingBySlug, landingsFor, type Landing } from "@/content/industry-landings";

/**
 * /industries/[slug]/[topic] — a landing page for one part line, buyer type
 * or cluster inside an industry (src/content/industry-landings.ts).
 *
 * The sections are the industry page's own blocks, built from the landing's
 * data, so the page looks like its parent and the closing band reads the
 * phone and email from Site settings like every other industry page.
 */

/**
 * Both segments, bottom up: the parent's generateStaticParams sits on a page,
 * not a layout, so it does not feed this one. Under Cache Components the list
 * must not be empty.
 */
export async function generateStaticParams() {
  return Object.keys(LANDINGS).flatMap((slug) =>
    landingsFor(slug).map((l) => ({ slug, topic: l.slug })),
  );
}

export async function generateMetadata(props: PageProps<"/industries/[slug]/[topic]">) {
  const { slug, topic } = await props.params;
  const landing = landingBySlug(slug, topic);
  return landing ? buildMetadata(landing, `/industries/${slug}/${topic}`) : {};
}

function blocksFor(l: Landing, enquiryHref: string, faqHeading: string): Block[] {
  return [
    {
      _type: "block.componentTabs",
      _key: "parts",
      eyebrow: l.parts.eyebrow,
      heading: l.parts.heading,
      body: l.parts.body,
      items: l.parts.items.map((p) => ({ ...p, bullets: [], cta: { label: `View ${p.name}`, href: p.href } })),
    },
    {
      _type: "block.conditionGrid",
      _key: "specs",
      eyebrow: l.specs.eyebrow,
      heading: l.specs.heading,
      body: l.specs.body,
      items: l.specs.items,
      table: l.specs.table,
    },
    {
      _type: "block.industryApplications",
      _key: "uses",
      eyebrow: l.uses.eyebrow,
      heading: l.uses.heading,
      items: l.uses.items,
    },
    {
      _type: "block.industryFaq",
      _key: "faq",
      eyebrow: "FREQUENTLY ASKED QUESTIONS",
      heading: faqHeading,
      items: l.faqs,
    },
    {
      _type: "block.closingBand",
      _key: "closing",
      eyebrow: "GET A QUOTE",
      lines: l.closing.lines,
      accentLines: [1],
      body: l.closing.body,
      actions: [
        { label: "Request a Quote", href: enquiryHref, variant: "primary" },
        { label: "Call Technical Sales", href: "tel:+919665579276", variant: "secondary" },
      ],
      contacts: [],
    },
  ] as Block[];
}

export default async function IndustryLandingPage(props: PageProps<"/industries/[slug]/[topic]">) {
  const { slug, topic } = await props.params;
  const landing = landingBySlug(slug, topic);
  if (!landing) notFound();
  const parent = await getIndustryPage(slug);
  if (!parent) notFound();

  const pfm = parent.frontmatter;
  const path = `/industries/${slug}/${topic}`;
  const crumbs = trail(
    ["Industries", "/industries"],
    [pfm.navLabel, `/industries/${slug}`],
    [landing.navLabel, path],
  );
  const enquiryHref = `/contact?industry=${encodeURIComponent(pfm.navLabel)}&part=${encodeURIComponent(landing.enquiryPart)}`;
  const siblings = landingsFor(slug).filter((l) => l.slug !== topic);
  // The links to the other landings sit between the FAQ and the closing band.
  const copy = INDUSTRY_LANDING_COPY[slug];
  const blocks = blocksFor(landing, enquiryHref, copy?.faqHeading ?? "Common questions.");
  const body = blocks.filter((b) => b._type !== "block.closingBand");
  const closing = blocks.filter((b) => b._type === "block.closingBand");

  return (
    <>
      <JsonLd
        status={landing.status}
        graph={await pageGraph({
          path,
          name: landing.seo.title,
          description: landing.seo.description,
          crumbs,
          faqs: landing.faqs,
          heroSlot: pfm.hero?.image,
        })}
      />

      <IndustryHero
        breadcrumb={crumbs}
        badge={landing.badge}
        lines={landing.h1Lines}
        accentLines={[1]}
        intro={landing.intro}
        chips={landing.chips}
        answer={landing.answer}
        actions={[
          { label: "Request a Quote", href: enquiryHref, variant: "primary" },
          { label: `All ${pfm.navLabel} Parts`, href: `/industries/${slug}`, variant: "secondary" },
        ]}
        image={pfm.hero?.image}
        // Same rule as the parent page: the medical cut-out photo is set
        // whole on the right rather than filling the hero.
        framed={pfm.hero?.image === "industries.medical-devices.hero-lab"}
      />

      <BlockRenderer blocks={body} comp2={false} heroEyebrow={landing.badge} />

      {siblings.length > 0 && (
        <Section
          className="bg-surface"
          eyebrow={`MORE FOR ${pfm.navLabel.toUpperCase()} BUYERS`}
          eyebrowVariant="rule"
          heading={`${pfm.navLabel} rubber parts by part and location`}
        >
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <li>
              <Link
                href={`/industries/${slug}`}
                className="border-line rounded-card hover:border-accent-400 block border bg-[#0A0A0A] px-5 py-4 text-sm text-ink transition-colors"
              >
                {pfm.navLabel} rubber components: overview <span aria-hidden>→</span>
              </Link>
            </li>
            {siblings.map((l) => (
              <li key={l.slug}>
                <Link
                  href={`/industries/${slug}/${l.slug}`}
                  className="border-line rounded-card hover:border-accent-400 block border bg-[#0A0A0A] px-5 py-4 text-sm text-ink transition-colors"
                >
                  {l.navLabel} <span aria-hidden>→</span>
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <BlockRenderer blocks={closing} comp2={false} />
    </>
  );
}
