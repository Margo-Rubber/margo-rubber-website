import type { Crumb } from "@/lib/breadcrumbs";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Container } from "@/components/ui/Section";
import { LegalToc } from "@/components/sections/LegalToc";
import type { LegalBlock } from "@/content/schemas";

/**
 * LEGAL DOCUMENT TEMPLATE — built to `Privacy Policy.pdf`.
 *
 * The comp lays out the hero, the sticky TOC card and sections 1–3; sections
 * 4–12 exist in the TOC only, so the frame stops after "How We Use Your
 * Information". Everything below reuses the section pattern the comp
 * establishes rather than inventing a second one.
 *
 * Surfaces are ramp B, matching the sampled comp exactly: page band #0F1115
 * (--color-surface-2), both cards #14161B (--color-surface-3), accent #2BBCC4,
 * body copy at the design's light grey rather than the darker ink-3 used for
 * marketing ledes — this is long-form reading, and contrast matters more than
 * the tonal hierarchy does.
 */

export function LegalHero({
  badge,
  h1,
  intro,
  lastUpdated,
  breadcrumb,
}: {
  badge: string;
  h1: string;
  intro: string;
  lastUpdated: string | null;
  breadcrumb?: readonly Crumb[];
}) {
  return (
    // pt-32/40 clears the FIXED site header, matching every other hero. At the
    // comp's own top padding the breadcrumb renders underneath it.
    <section className="relative overflow-hidden bg-[#101720] pt-32 pb-20 md:pt-40 md:pb-28">
      {/* Glow. The comp's hero is measurably lighter and cooler than the band
          below it (#101720 vs #0F1115), lifted by a soft teal wash off the
          upper right. Two layers rather than one: a wide cool lift for the
          overall tone, and a tighter accent bloom for the colour. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 78% 0%, rgba(43,188,196,0.10), transparent 58%), radial-gradient(90% 70% at 12% 100%, rgba(43,188,196,0.05), transparent 60%)",
        }}
      />
      {/* Fades the hero into the band below so the seam is a gradient, not a
          hard edge — the comp shows no visible join. */}
      <div
        aria-hidden
        className="to-surface-2 pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent"
      />

      <Container className="relative">
        <Breadcrumb items={breadcrumb} />

        <p className="border-accent-400/40 bg-accent-400/10 text-accent-400 text-eyebrow mt-8 inline-flex items-center gap-2.5 rounded-pill border px-4 py-2 font-mono uppercase">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-3.5"
            aria-hidden
          >
            <path d="M12 3.2 5 6v6c0 4.3 2.9 7.6 7 8.8 4.1-1.2 7-4.5 7-8.8V6z" />
          </svg>
          {badge}
        </p>

        <h1 className="text-display mt-5">{h1}</h1>

        <p className="text-ink-2 mt-7 max-w-[54ch] text-lg leading-[1.8]">
          {intro}
        </p>

        {lastUpdated && (
          <p className="rounded-card border-line text-ink-3 mt-10 inline-flex items-center gap-2.5 border bg-black/25 px-4 py-3 text-sm backdrop-blur">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-accent-400 size-4"
              aria-hidden
            >
              <path d="M20 11.5A8 8 0 0 0 6.3 6.3L4 8.5M4 12.5a8 8 0 0 0 13.7 5.2L20 15.5M4 4.5v4h4M20 19.5v-4h-4" />
            </svg>
            Last Updated:{" "}
            <span className="text-ink font-semibold">{lastUpdated}</span>
          </p>
        )}
      </Container>
    </section>
  );
}

/** One content block. `note` is the emphasised single line the comp uses for
 *  "We never sell your personal information to third parties." */
function Block({ block }: { block: LegalBlock }) {
  if ("h" in block) {
    return (
      <h3 className="text-ink mt-9 mb-3 text-base font-semibold">{block.h}</h3>
    );
  }
  if ("ul" in block) {
    return (
      <ul className="my-4 space-y-2.5">
        {block.ul.map((item) => (
          <li key={item} className="text-ink-2 flex gap-3 leading-relaxed">
            <span
              aria-hidden
              className="bg-ink-4 mt-[0.62em] size-1 shrink-0 rounded-full"
            />
            <span>{strong(item)}</span>
          </li>
        ))}
      </ul>
    );
  }
  if ("note" in block) {
    return (
      <p className="border-accent-400/30 bg-accent-400/[0.06] text-ink my-6 rounded-lg border-l-2 px-4 py-3 font-medium">
        {block.note}
      </p>
    );
  }
  return <p className="text-ink-2 my-4 leading-[1.9]">{strong(block.p)}</p>;
}

/**
 * `**Legal basis.** Under DPDP…` — the sheet emphasises a paragraph's lead-in
 * or a governing figure ("36 months from the date of the last order") with
 * <strong>; the CMS keeps that as `**…**` so the paragraph stays one string.
 */
function strong(text: string) {
  const parts = text.split(/\*\*([^*]+)\*\*/g);
  if (parts.length === 1) return text;
  return parts.map((part, i) =>
    i % 2 ? (
      <strong key={i} className="text-ink font-semibold">
        {part}
      </strong>
    ) : (
      part
    ),
  );
}

export function LegalBody({
  sections,
  pendingNote,
}: {
  sections: readonly {
    id: string;
    title: string;
    navLabel?: string;
    icon: string;
    blocks: readonly LegalBlock[];
  }[];
  /** Shown inside any section that has no copy yet. */
  pendingNote: string;
}) {
  return (
    <section className="bg-surface-2 pt-4 pb-20 md:pb-28">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[19rem_minmax(0,1fr)] lg:gap-10">
          {/* Sticky on lg+ only. Below that the card would eat most of a short
              viewport, so it scrolls away like any other block. */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <LegalToc items={sections} />
          </div>

          <div className="rounded-2xl border-line bg-surface-3 relative border px-6 py-10 md:px-12 md:py-14">
            {/* Accent hairline along the card's top edge, fading right. Sits
                inside the radius via the parent's overflow-safe inset, so it
                follows the rounded corner instead of cutting across it. */}
            <span
              aria-hidden
              className="bg-accent-400/40 absolute inset-x-6 top-0 h-px rounded-full"
            />

            {sections.map((s, i) => (
              <section
                key={s.id}
                id={s.id}
                // Clears the sticky header when a TOC link jumps here.
                className="scroll-mt-28 first:mt-0 [&+section]:mt-14"
              >
                {/* The number is part of the heading in the comp — same
                    white, same weight, just a wider space after the stop.
                    Not accent, not mono. */}
                <h2 className="text-h2 mb-5">
                  <span className="mr-1.5">{i + 1}.</span>
                  {s.title}
                </h2>

                {s.blocks.length > 0 ? (
                  s.blocks.map((b, n) => <Block key={n} block={b} />)
                ) : (
                  <p className="border-line text-ink-4 rounded-lg border border-dashed px-4 py-5 text-sm">
                    {pendingNote}
                  </p>
                )}
              </section>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
