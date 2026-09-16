import Link from "next/link";
import { getSitePage } from "@/lib/page-source";
import { productsHubSchema } from "@/content/schemas";
import { buildMetadata } from "@/lib/seo";
import { itemListNode, pageGraph } from "@/lib/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { Container, Eyebrow, Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Img } from "@/components/ui/Img";
import {
  CapabilitiesPanel,
  CatalogueBlock,
  CertGrid,
  CompoundSelector,
  FAQAccordion,
  HubHero,
  Marquee,
  ProcessSteps,
  ProductRange,
  QuoteBand,
  SectorSelector,
  StatCards,
  ValidationPanel,
} from "@/components/sections/HubBlocks";

export async function generateMetadata() {
  const frontmatter = await getSitePage("products", productsHubSchema);
  return buildMetadata(frontmatter, "/products");
}

export default async function ProductsHubPage() {
  const fm = await getSitePage("products", productsHubSchema);

  return (
    <div className="bg-surface-2">
      <JsonLd
        status={fm.status}
        graph={await pageGraph({
          type: "CollectionPage",
          path: "/products",
          name: fm.seo.title,
          description: fm.seo.description,
          crumbs: [{ name: "Home", path: "/" }, { name: "Products", path: "/products" }],
          extra: [
            itemListNode(
              fm.range.cards.map((c) => ({
                name: c.title,
                path: `/products/${c.slug}`,
              })),
              "/products",
            ),
          ],
        })}
      />

      <HubHero
        badge={fm.badge}
        lines={fm.h1Lines}
        accentLines={fm.h1AccentLines}
        intro={fm.intro}
        actions={fm.actions}
        stats={fm.heroStats}
        divider={fm.heroDivider}
        image={fm.hero?.image}
      />

      {fm.marquee.length > 0 && <Marquee items={fm.marquee} />}

      <Section
        id="range"
        align="center"
        eyebrow={fm.range.eyebrow}
        eyebrowVariant="rule"
        accentLastWords={1}
        heading={fm.range.heading}
        body={fm.range.body}
        className="relative"
      >
        {/* The count, set large and faint beside the heading — the comp's
            device, and it was in the schema without ever being rendered.
            Decorative, so it is hidden from assistive tech: the number of
            categories is already evident from the grid. */}
        {fm.range.watermark && (
          <span
            aria-hidden
            className="text-accent-400/10 pointer-events-none absolute top-16 right-6 text-7xl leading-none font-bold tabular-nums select-none md:right-[50px] md:text-8xl"
          >
            {fm.range.watermark}
          </span>
        )}
        <ProductRange filters={fm.range.filters} cards={fm.range.cards} />
        {fm.range.cta && (
          <div className="mt-10 flex justify-center">
            <Button href={fm.range.cta.href} variant="secondary">
              {fm.range.cta.label} <span aria-hidden>→</span>
            </Button>
          </div>
        )}
      </Section>

      {fm.excellence && (
        <Section className="bg-surface">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <Eyebrow variant="rule">{fm.excellence.eyebrow}</Eyebrow>
              <h2 className="text-h1 mt-3">
                {fm.excellence.heading.split(" ").slice(0, -1).join(" ")}{" "}
                <span className="text-accent-400 block">
                  {fm.excellence.heading.split(" ").slice(-1)}
                </span>
              </h2>
              {fm.excellence.body && (
                <p className="text-ink-4 mt-4 leading-relaxed">
                  {fm.excellence.body}
                </p>
              )}
            </div>
            <div className="rounded-card bg-surface-3 relative aspect-[16/10] overflow-hidden">
              {fm.excellence.image && (
                <>
                  <Img
                    k={fm.excellence.image}
                    fill
                    sizes="(max-width:1024px) 100vw, 50vw"
                    className="object-cover brightness-[0.9]"
                  />
                  <div className="from-surface absolute inset-0 bg-gradient-to-t from-0% to-transparent to-55%" />
                </>
              )}
              {fm.excellence.imageBadge && (
                <div className="bg-canvas/80 absolute bottom-4 left-4 rounded-lg px-4 py-2 backdrop-blur">
                  <p className="text-eyebrow text-accent-400 font-mono uppercase">
                    {fm.excellence.imageBadge.label}
                  </p>
                  <p className="text-ink mt-1 text-sm font-semibold">
                    {fm.excellence.imageBadge.value}
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="mt-12">
            <StatCards stats={fm.excellence.stats} />
          </div>
        </Section>
      )}

      {fm.process && (
        <Section heading={fm.process.heading}>
          <div className="grid gap-6 lg:grid-cols-2">
            <ProcessSteps steps={fm.process.steps} />
            {fm.process.capabilities && (
              <CapabilitiesPanel {...fm.process.capabilities} />
            )}
          </div>
        </Section>
      )}

      {fm.compounds && (
        <Section
          className="bg-surface"
          eyebrow={fm.compounds.eyebrow}
          eyebrowVariant="rule"
          accentLastWords={1}
          heading={fm.compounds.heading}
          body={fm.compounds.body}
        >
          <CompoundSelector items={fm.compounds.items} />

          {fm.compounds.cta && (
            <p className="mt-8 text-center">
              <Link
                href={fm.compounds.cta.href}
                className="text-accent-400 hover:opacity-80 inline-flex items-center gap-2 text-sm font-medium transition-colors"
              >
                {fm.compounds.cta.label}
                <span aria-hidden>&rarr;</span>
              </Link>
            </p>
          )}
        </Section>
      )}

      {fm.sectors && (
        <Section
          eyebrow={fm.sectors.eyebrow}
          eyebrowVariant="rule"
          accentLastWords={2}
          heading={fm.sectors.heading}
          body={fm.sectors.body}
        >
          <SectorSelector items={fm.sectors.items} />
        </Section>
      )}

      {fm.certifications && (
        <Section
          className="bg-surface"
          eyebrow={fm.certifications.eyebrow}
          eyebrowVariant="rule"
          accentLastWords={2}
          heading={fm.certifications.heading}
          body={fm.certifications.body}
        >
          <CertGrid items={fm.certifications.items} />
        </Section>
      )}

      {fm.validation && (
        <Section>
          <ValidationPanel
            eyebrow={fm.validation.eyebrow}
            heading={fm.validation.heading}
            body={fm.validation.body ?? ""}
            items={fm.validation.items}
            cta={fm.validation.cta}
          />
        </Section>
      )}

      {fm.catalogue && (
        <Section className="bg-surface">
          <CatalogueBlock
            heading={fm.catalogue.heading}
            body={fm.catalogue.body ?? ""}
            bullets={fm.catalogue.bullets}
            formHeading={fm.catalogue.formHeading}
            formBody={fm.catalogue.formBody}
            submitLabel={fm.catalogue.submitLabel}
            footnote={fm.catalogue.footnote}
          />
        </Section>
      )}

      {fm.faqs.length > 0 && (
        <Section>
          <Container className="!px-0 text-center">
            <Eyebrow>{fm.faqSection?.eyebrow ?? "FREQUENTLY ASKED"}</Eyebrow>
            <h2 className="text-h1 mt-3">
              {(fm.faqSection?.heading ?? "Common Questions").split(" ").slice(0, -1).join(" ")}{" "}
              <span className="text-accent-400">
                {(fm.faqSection?.heading ?? "Common Questions").split(" ").slice(-1)}
              </span>
            </h2>
          </Container>
          <div className="mx-auto mt-10 max-w-[860px]">
            <FAQAccordion items={fm.faqs} />
            {fm.faqSection?.cta && (
              <div className="border-line bg-surface-3 rounded-card mt-6 border p-6 text-center">
                <p className="text-ink-4 text-sm">{fm.faqSection.cta.note}</p>
                <Button href={fm.faqSection.cta.href} className="mt-4">
                  {fm.faqSection.cta.label}
                </Button>
              </div>
            )}
          </div>
        </Section>
      )}
      {fm.quote && (
        <Section className="bg-surface">
          <QuoteBand
            eyebrow={fm.quote.eyebrow}
            heading={fm.quote.heading}
            body={fm.quote.body}
            contactHeading={fm.quote.contactHeading}
            contacts={fm.quote.contacts}
            promiseHeading={fm.quote.promiseHeading}
            promises={fm.quote.promises}
            fields={fm.quote.fields}
            submitLabel={fm.quote.submitLabel}
          />
        </Section>
      )}
    </div>
  );
}
