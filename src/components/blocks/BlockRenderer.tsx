import { Fragment, type ReactNode } from "react";
import Link from "next/link";
import type { SiteSettings } from "@/content/schemas/settings";
import {
  compoundByCode,
  formatRangeCompact,
  getSiteSettings,
  telHref,
} from "@/lib/settings";
import { Section } from "@/components/ui/Section";
import { SpecTable } from "@/components/sections/SpecTable";
import { MaterialCards } from "@/components/sections/MaterialCards";
import { PartsGrid } from "@/components/sections/PartsGrid";
import { Prose } from "@/components/blocks/Prose";
import {
  CtaPanel,
  PlainCards,
  ProcessTimeline,
  ProfileGrid,
  QualityPanel,
  SectorCards,
  SpecifyCards,
} from "@/components/sections/CategoryBlocks";
import { emphasised } from "@/components/ui/Emphasis";
import {
  ApplicationCards,
  ComparePanels,
  DensityBlock,
  SubCategoryBlock,
} from "@/components/sections/FoamBlocks";
import { CompoundGuide } from "@/components/sections/CompoundGuide";
import {
  AnswerBlock,
  CommercialTable,
  CTABand,
  NarrowBlock,
  StandardsGrid,
} from "@/components/sections/Blocks";
import {
  ApplicationCards as IndustryApplicationCards,
  ClosingBand,
  ComponentTabs,
  ConditionGrid,
  CustomPanel,
  ExportLane,
  IndustryFAQ,
  QualityCards,
} from "@/components/sections/IndustryDetail";
import { Container, Eyebrow } from "@/components/ui/Section";
import type { Block } from "@/content/blocks";

/**
 * THE BLOCK RENDERER
 *
 * One ordered list in, one page out. This is the piece that turns the page
 * builder from a schema into something a visitor can see.
 *
 * It replaces fifteen `{fm.xSection && <Section …>}` stanzas in the category
 * route. Those stanzas encoded two separate things at once — which sections
 * exist, and how each is presented — and only the first of those should be an
 * editor's business. The presentation stays here, in code: an editor chooses
 * that a page HAS a compound table and where it sits, not that it is centred
 * with a rule eyebrow and an accent bloom.
 *
 * That division is what makes the page builder safe. Reordering blocks cannot
 * produce an ugly page, because the styling is not reorderable.
 */

/* ── Banding ──────────────────────────────────────────────────────────────── */

/**
 * The newer comps alternate a near-black band with a lighter one. `bg-band` is
 * #030303 against a #000000 canvas — invisible — so these pages use
 * `bg-surface-2`.
 *
 * Assigned in a pass BEFORE rendering rather than counted during it. The old
 * template incremented a counter inside JSX, which worked only because JSX
 * evaluates top to bottom in one uninterrupted return. Here the list can be
 * split around the prose slot, so the alternation is computed up front and the
 * result travels with each block.
 *
 * Only some blocks participate. A material-cards or terms block sets `bg-band`
 * outright, and the standards block sets nothing — those must not consume a
 * turn, or every band after them would flip. This set is exactly the blocks
 * that called `band()` in the original template, and changing it changes the
 * appearance of eleven live pages.
 */
const BANDED = new Set<Block["_type"]>([
  "block.cardGrid",
  "block.comparePanels",
  "block.compoundSelector",
  "block.specTable",
  "block.densityScale",
  "block.processTimeline",
  "block.subCategory",
  "block.applicationCards",
  "block.specifyGrid",
  "block.qualityPanel",
  "block.ctaBand",
]);

export type BandedBlock = { block: Block; band: string };

export function assignBands(blocks: Block[], alternate: boolean): BandedBlock[] {
  let i = 0;
  return blocks.map((block) => {
    // The closing band only alternates in its panel form. Its plain form takes
    // no className at all, so it must not consume a turn either.
    const participates =
      BANDED.has(block._type) &&
      (block._type !== "block.ctaBand" || chipCount(block) > 0);

    if (!alternate || !participates) return { block, band: "" };
    return { block, band: i++ % 2 === 1 ? "bg-surface-2" : "" };
  });
}

function chipCount(block: Block): number {
  const chips = block.chips;
  return Array.isArray(chips) ? chips.length : 0;
}

/* ── Per-block rendering ──────────────────────────────────────────────────── */

/**
 * Fields arrive already validated against the same Zod schema the .mdx files
 * use, so each block's shape is known once its `_type` is. The list is
 * heterogeneous by nature, so the widening happens once here rather than being
 * repeated at fifteen call sites.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const f = (block: Block) => block as Record<string, any>;

type Ctx = {
  band: string;
  /** True on the pages built from the newer comps — they centre their headers. */
  comp2: boolean;
  /** The one phone, email and certification line every closing band shows. */
  settings: SiteSettings;
};

function renderBlock(block: Block, ctx: Ctx): ReactNode {
  const b = f(block);
  const { band, comp2 } = ctx;

  switch (block._type) {
    /* The catalogue of sections comes before the compound table: you pick the
       shape you need, then the compound it is made in. That is the order the
       comp draws and the order a buyer decides in — but it is now the order of
       the LIST, not of this file. */
    case "block.cardGrid": {
      const sectors = block.layout === "sectors";
      const plain = block.layout === "plain";
      return (
        <Section
          id={b.id ?? (sectors ? "sectors" : plain ? "cards" : "profiles")}
          eyebrow={b.eyebrow}
          heading={b.heading}
          body={b.body}
          align={plain ? "left" : "center"}
          eyebrowVariant="rule"
          className={band}
          glow={!plain}
        >
          {sectors ? (
            <SectorCards items={b.items} cardCta={b.cardCta} />
          ) : plain ? (
            <PlainCards items={b.items} noteLabel={b.noteLabel} group={b.group} />
          ) : (
            <ProfileGrid items={b.items} cardCta={b.cardCta} />
          )}
        </Section>
      );
    }

    case "block.comparePanels":
      return (
        <Section
          id="cell-structure"
          eyebrow={b.eyebrow}
          heading={b.heading}
          body={b.body}
          align="center"
          eyebrowVariant="rule"
          className={band}
          glow
        >
          <ComparePanels panels={b.panels} />
        </Section>
      );

    case "block.compoundSelector":
      return (
        <Section
          id="compounds"
          eyebrow={b.eyebrow}
          heading={b.heading}
          body={b.body}
          className={band}
          glow
          align="center"
          eyebrowVariant="rule"
        >
          <CompoundGuide items={b.items} />
        </Section>
      );

    case "block.specTable":
      return (
        <Section
          id={b.id ?? "specifications"}
          eyebrow={b.eyebrow}
          heading={b.heading}
          body={b.body}
          align={comp2 ? "center" : "left"}
          eyebrowVariant={comp2 ? "rule" : "plain"}
          className={band}
          glow={comp2}
        >
          <SpecTable
            columns={b.columns}
            rows={b.rows}
            footnote={b.footnote}
            controls={b.controls}
            chips={b.chips}
            searchPlaceholder={b.searchPlaceholder}
          />
          {b.closing && (
            <p className="text-ink-3 mt-6 max-w-[68ch] text-sm leading-relaxed">{emphasised(b.closing)}</p>
          )}
        </Section>
      );

    case "block.densityScale":
      return (
        <Section
          id="density"
          eyebrow={b.eyebrow}
          heading={b.heading}
          body={b.body}
          eyebrowVariant="rule"
          className={band}
          glow
        >
          <DensityBlock scale={b.scale} quote={b.quote} bands={b.bands} />
        </Section>
      );

    case "block.materialCards":
      return (
        <Section
          id="materials"
          eyebrow={b.eyebrow}
          heading={b.heading}
          body={b.body}
          className="bg-band"
        >
          {/* Ranges and hardness come from the compound table in Site
              settings, matched by code; the block keeps its own copy only
              for a compound the table does not list. */}
          <MaterialCards
            items={b.items.map(
              (m: { code: string; tempRange: string; hardness: string }) => {
                const c = compoundByCode(ctx.settings, m.code);
                return c
                  ? { ...m, tempRange: formatRangeCompact(c), hardness: c.hardness }
                  : m;
              },
            )}
          />
          {b.footnote && (
            <Container>
              <p className="text-ink-4 mt-8 text-xs leading-relaxed">{b.footnote}</p>
            </Container>
          )}
        </Section>
      );

    /* Parts in this category. Renders the `anchors:` data every category file
       carries, and gives the 301 map real fragment targets to land on. */
    case "block.partsGrid":
      return (
        <Section id="parts" eyebrow={b.eyebrow} heading={b.heading} body={b.body}>
          <PartsGrid
            parts={b.parts}
            items={b.items}
            categoryLabel={b.categoryLabel}
            categorySlug={b.categorySlug}
          />
        </Section>
      );

    case "block.processTimeline":
      return (
        <Section
          id="process"
          eyebrow={b.eyebrow}
          heading={b.heading}
          body={b.body}
          className={band}
          glow
          align="center"
          eyebrowVariant="rule"
        >
          <ProcessTimeline steps={b.steps} />
        </Section>
      );

    case "block.subCategory":
      return (
        <SubCategoryBlock
          id={b.id}
          eyebrow={b.eyebrow}
          heading={b.heading}
          body={b.body}
          dividerLabel={b.dividerLabel}
          buildUp={b.buildUp}
          comparisons={b.comparisons}
          note={b.note}
          className={band}
        />
      );

    case "block.applicationCards":
      return (
        <Section
          id="applications"
          eyebrow={b.eyebrow}
          heading={b.heading}
          body={b.body}
          className={band}
          glow
          align="center"
          eyebrowVariant="rule"
        >
          <ApplicationCards items={b.items} />
        </Section>
      );

    case "block.specifyGrid":
      return (
        <Section
          id="specify"
          eyebrow={b.eyebrow}
          heading={b.heading}
          body={b.body}
          align="center"
          eyebrowVariant="rule"
          className={band}
          glow
        >
          <SpecifyCards items={b.items} closing={b.closing} closingLink={b.closingLink} />
        </Section>
      );

    case "block.standardsAnswer":
      return (
        <Section id="standards" eyebrow={b.eyebrow} heading={b.heading}>
          <NarrowBlock>
            <AnswerBlock>{b.answer}</AnswerBlock>
            <div className="mt-[38px]">
              <StandardsGrid items={b.items} />
            </div>
            {b.closing && (
              <p className="text-ink-3 mt-8 text-sm leading-relaxed">
                {b.closing}
                {b.closingLink?.label && b.closingLink.href && (
                  <>
                    {" "}
                    <Link href={b.closingLink.href} className="text-accent-400 hover:opacity-80">
                      {b.closingLink.label} <span aria-hidden>›</span>
                    </Link>
                  </>
                )}
              </p>
            )}
          </NarrowBlock>
        </Section>
      );

    case "block.qualityPanel":
      return (
        <QualityPanel
          eyebrow={b.eyebrow}
          heading={b.heading}
          body={b.body}
          quote={b.quote}
          badges={b.badges}
          standards={b.standards}
          docPackage={b.docPackage}
          className={band}
        />
      );

    // "#lead-times", not "#commercial": the anchor names what the section
    // answers, and a table-of-contents entry named after an MOQ was one more
    // place the term appeared (sheet 09 §06).
    case "block.propertyList":
      return (
        <Section
          id="lead-times"
          eyebrow={b.eyebrow}
          heading={b.heading}
          body={b.body}
          className="bg-band"
        >
          <CommercialTable rows={b.rows} />
        </Section>
      );

    /* Two closing bands. The nine older pages use the left-aligned CTABand;
       the newer comps use a centred panel with corner brackets and a row of
       fact chips. Chips are what distinguishes them, so their presence selects
       the layout rather than a separate flag. */
    case "block.ctaBand":
      return chipCount(block) > 0 ? (
        <CtaPanel
          eyebrow={b.eyebrow}
          heading={b.heading}
          body={b.body}
          chips={b.chips}
          primary={b.primary}
          secondary={b.secondary}
          className={band}
        />
      ) : (
        <CTABand
          eyebrow={b.eyebrow}
          heading={b.heading}
          body={b.body}
          primary={b.primary}
          secondary={b.secondary}
        />
      );

    /* ── Industry blocks ──────────────────────────────────────────────────
       These set their own background rather than taking a turn in the
       alternation. The industry route hard-coded `bg-[#050505]` on specific
       sections instead of counting, so a section's background is a property
       of what it IS, not of where it sits. Preserved as-is: changing it would
       change nine live pages. */

    case "block.componentTabs":
      return (
        <Section
          eyebrow={b.eyebrow}
          eyebrowVariant="rule"
          heading={b.heading}
          body={b.body}
        >
          <ComponentTabs items={b.items} />
        </Section>
      );

    case "block.industryApplications":
      return (
        <Section
          className="bg-[#050505]"
          eyebrow={b.eyebrow}
          eyebrowVariant="rule"
          heading={b.heading}
          body={b.body}
        >
          <IndustryApplicationCards items={b.items} />
        </Section>
      );

    case "block.conditionGrid":
      return (
        <Section
          align="center"
          eyebrow={b.eyebrow}
          eyebrowVariant="rule"
          heading={b.heading}
          body={b.body}
        >
          <ConditionGrid items={b.items} />
        </Section>
      );

    case "block.customPanel":
      return (
        <Section className="bg-[#050505]">
          <CustomPanel
            eyebrow={b.eyebrow}
            heading={b.heading}
            body={b.body}
            bullets={b.bullets}
            cta={b.cta}
            image={b.image}
            imageCaption={b.imageCaption}
          />
        </Section>
      );

    case "block.qualityCards":
      return (
        <Section
          eyebrow={b.eyebrow}
          eyebrowVariant="rule"
          heading={b.heading}
          body={b.body}
        >
          <QualityCards items={b.items} links={b.links} />
        </Section>
      );

    case "block.exportLane":
      return (
        <Section
          className="bg-[#050505]"
          eyebrow={b.eyebrow}
          eyebrowVariant="rule"
          heading={b.heading}
        >
          <ExportLane paragraphs={b.paragraphs} rows={b.rows} card={b.card} />
        </Section>
      );

    case "block.industryFaq":
      return (
        <Section>
          <Container className="!px-0">
            <Eyebrow variant="rule">
              {b.eyebrow ?? "FREQUENTLY ASKED QUESTIONS"}
            </Eyebrow>
            <h2 className="text-h2 mt-4 mb-10">
              {b.heading ?? "Common questions."}
            </h2>
          </Container>
          <IndustryFAQ items={b.items} />
        </Section>
      );

    case "block.closingBand":
      return (
        // The contact strip is not the document's to type: nine industry
        // files carried "+91 (Nashik), Contact for number" and "Contact for
        // email" as the published values. It reads Site settings.
        <ClosingBand
          eyebrow={b.eyebrow}
          lines={b.lines}
          accentLines={b.accentLines}
          body={b.body}
          actions={b.actions}
          contacts={closingContacts(ctx.settings)}
        />
      );

    /* ── The universal additions for the new sheets (36–42) ──────────── */

    case "block.accordion":
      return (
        <Section id={b.id ?? "accordion"} eyebrow={b.eyebrow} eyebrowVariant="rule" heading={b.heading} body={b.intro}>
          <div className="mx-auto max-w-[860px] space-y-3">
            {/* Native disclosure: every panel is in the DOM at first paint and
                readable without script; the first opens by default. */}
            {b.panels.map((p: { title: string; body: string }, i: number) => (
              <details
                key={p.title}
                open={i === 0}
                className="rounded-card border-line group border bg-surface-3"
              >
                <summary className="text-ink flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm font-semibold [&::-webkit-details-marker]:hidden">
                  {p.title}
                  <span aria-hidden className="text-accent-400 transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <div className="text-ink-3 px-5 pb-5 text-sm leading-relaxed whitespace-pre-line">{emphasised(p.body)}</div>
              </details>
            ))}
            {b.closing && <p className="text-ink-3 pt-3 text-sm leading-relaxed">{emphasised(b.closing)}</p>}
          </div>
        </Section>
      );

    case "block.certificationStrip": {
      // The lines are Site settings' — one place, every page (sheets 36–42).
      const lines = ctx.settings.certifications.strip;
      if (!lines.length) return null;
      return (
        <Section id={b.id ?? "certification"} eyebrow={b.eyebrow} eyebrowVariant="rule" heading={b.heading}>
          <div className="border-line bg-surface-3 rounded-card mx-auto max-w-[860px] border p-6 md:p-8">
            {lines.map((l, i) => (
              <p key={l} className={`text-sm leading-relaxed ${i === 0 ? "text-ink font-semibold" : "text-ink-3"} ${i ? "mt-2" : ""}`}>
                {l}
              </p>
            ))}
          </div>
        </Section>
      );
    }

    case "block.routerList":
      return (
        <Section id={b.id ?? "router"} eyebrow={b.eyebrow} eyebrowVariant="rule" heading={b.heading} body={b.intro}>
          <ol className="mx-auto max-w-[860px] divide-y divide-[color:var(--color-line)] rounded-card border-line border">
            {b.rows.map((r: { condition: string; need: string; href?: string }, i: number) => (
              <li key={r.condition} className="grid gap-2 p-5 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] sm:gap-8">
                <p className="text-ink text-sm font-medium">
                  <span className="text-ink-4 mr-3 font-mono text-xs">{String(i + 1).padStart(2, "0")}</span>
                  {r.condition}
                </p>
                <p className="text-ink-3 text-sm leading-relaxed">
                  {r.href ? (
                    <Link href={r.href} className="text-accent-400 hover:opacity-80">
                      {r.need} <span aria-hidden>›</span>
                    </Link>
                  ) : (
                    r.need
                  )}
                </p>
              </li>
            ))}
          </ol>
        </Section>
      );

    case "block.richText":
      return (
        <Section id={b.id} eyebrow={b.eyebrow} heading={b.heading} body={b.body}>
          <div className="prose-guide mx-auto max-w-[68ch]">
            <Prose value={b.content} />
          </div>
        </Section>
      );

    default:
      // Unreachable for validated blocks — parseBlocks drops unknown types
      // before they get here. Returning null rather than throwing keeps a
      // future block type from taking a live page down while it is being
      // added.
      return null;
  }
}

/* ── The renderer ─────────────────────────────────────────────────────────── */

/** Phone · email · certification, from Site settings — identical on every page. */
function closingContacts(settings: SiteSettings) {
  const { entity, certifications } = settings;
  const held = certifications.items.find((c) => c.standing === "held");
  return [
    { icon: "phone", text: entity.phone, href: telHref(entity.phone) },
    { icon: "email", text: entity.email, href: `mailto:${entity.email}` },
    ...(held
      ? [
          {
            icon: "cert",
            // "ISO 9001:2015 · Certificate 09111526A" — the contact strip
            // on the industry pages (sheet 25 §09).
            text: held.identifier ? `${held.code} · Certificate ${held.identifier}` : `${held.code} ${held.statusLabel}`,
            href: "/certifications",
          },
        ]
      : []),
  ];
}

export async function BlockRenderer({
  blocks,
  comp2,
  prose,
}: {
  blocks: Block[];
  comp2: boolean;
  /**
   * The compiled .mdx body, for the pages that still have one.
   *
   * It renders immediately before the closing call-to-action, which is where
   * the template placed it. Passing it as a slot rather than appending it
   * keeps a page served from a file and the same page served from the CMS in
   * the same order — the CMS has no .mdx body, so the slot is simply absent.
   */
  prose?: ReactNode;
}) {
  const settings = await getSiteSettings();
  const banded = assignBands(blocks, comp2);
  const ctaAt = banded.findIndex((b) => b.block._type === "block.ctaBand");
  const proseAt = ctaAt === -1 ? banded.length : ctaAt;

  return (
    <>
      {banded.map(({ block, band }, i) => (
        // Fragment, never a wrapper element: these eleven pages already ship,
        // and an extra div around every section would change their layout.
        <Fragment key={block._key}>
          {i === proseAt && prose}
          {renderBlock(block, { band, comp2, settings })}
        </Fragment>
      ))}
      {proseAt === banded.length && prose}
    </>
  );
}
