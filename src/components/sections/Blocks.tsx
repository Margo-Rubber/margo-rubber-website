import { Button } from "@/components/ui/Button";
import type { Crumb } from "@/lib/breadcrumbs";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Container, Eyebrow, HeroChips } from "@/components/ui/Section";
import { Img } from "@/components/ui/Img";
import { emphasised } from "@/components/ui/Emphasis";
import { displaySize } from "@/lib/display-size";

/**
 * The 40–60 word direct answer rendered BEFORE elaboration — the AEO pattern
 * the technical spec requires on every question-formatted H2.
 */
export function AnswerBlock({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-card border border-[#0A2B2C] bg-[#020909] px-8 py-7">
      <p className="text-ink-2 leading-relaxed">{children}</p>
    </div>
  );
}

/**
 * Section 04 standards reference. Measured off the design:
 * panel #0A0A0A · 2px dividers #0C0C0C · 2×2 · code in accent at 1.375rem.
 */
export function StandardsGrid({
  items,
}: {
  items: { code: string; name: string; body: string }[];
}) {
  return (
    <div className="rounded-card grid gap-[2px] overflow-hidden bg-[#0C0C0C] sm:grid-cols-2">
      {items.map((s) => (
        <div key={s.code} className="bg-[#0A0A0A] px-7 py-7">
          <h3 className="text-accent-400 text-[1.375rem] leading-none font-bold">
            {s.code}
          </h3>
          <p className="text-ink mt-3 text-sm font-semibold">{s.name}</p>
          <p className="text-ink-4 mt-3.5 text-sm leading-relaxed">{s.body}</p>
        </div>
      ))}
    </div>
  );
}

/**
 * Section 04's blocks are constrained to 896px, not the full content width.
 * Measured: x 108 → 1004 inside an 1184px content column.
 */
export function NarrowBlock({ children }: { children: React.ReactNode }) {
  return <div className="max-w-[896px]">{children}</div>;
}

/** Section 05 — the label / value / note commercial rows. */
export function CommercialTable({
  rows,
}: {
  rows: { label: string; value: string; note?: string }[];
}) {
  return (
    <div className="border-line bg-surface-2 rounded-card divide-line divide-y overflow-hidden border">
      {rows.map((r) => (
        <div
          key={r.label}
          className="flex items-center justify-between gap-6 px-6 py-4"
        >
          <div>
            <p className="text-ink text-sm font-semibold">{r.label}</p>
            {r.note && <p className="text-ink-4 mt-0.5 text-xs">{r.note}</p>}
          </div>
          <p className="text-accent-400 shrink-0 text-lg font-bold whitespace-nowrap">
            {r.value}
          </p>
        </div>
      ))}
    </div>
  );
}

/** Section 06 — closing enquiry band. */
export function CTABand({
  eyebrow,
  heading,
  body,
  primary,
  secondary,
}: {
  eyebrow: string;
  heading: string;
  body: string;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
}) {
  return (
    <section className="py-[70px]">
      <Container>
        <div className="border-line bg-surface-2 rounded-card border p-10 md:p-14">
          <Eyebrow>{eyebrow}</Eyebrow>
          {/* `*accent*` marking, as every other heading on these pages. */}
          <h2 className="text-h1 mt-3">
            {heading.split("*").map((part, i) =>
              i % 2 === 1 ? (
                <span key={i} className="text-accent-400">
                  {part}
                </span>
              ) : (
                part
              ),
            )}
          </h2>
          <p className="text-ink-3 mt-4 max-w-[60ch] leading-relaxed">{emphasised(body)}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href={primary.href}>{primary.label}</Button>
            {secondary && (
              <Button href={secondary.href} variant="secondary">
                {secondary.label}
              </Button>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}

/** Category-page hero — full-bleed image, badge, split-colour heading, stat row. */
export function CategoryHero({
  badge,
  headingLead,
  headingAccent,
  intro,
  link,
  stats,
  image,
  actions,
  eyebrowVariant = "badge",
  breadcrumb,
  statsAlign = "center",
  chips = [],
  fullBleed = false,
  bleedImage,
  bleedFrame,
  bleedFit,
}: {
  badge: string;
  headingLead: string;
  headingAccent: string;
  intro: string;
  link?: { label: string; href: string };
  stats: { value: string; label: string }[];
  /** Short uppercase facts under the subhead (sheets 36–39). */
  chips?: readonly string[];
  image?: string;
  /** Hero buttons. The UI-changes2 comps open with two; the nine older
   *  category pages have none and pass nothing. */
  actions?: readonly { label: string; href: string; variant?: "primary" | "secondary" }[];
  /**
   * How the line above the H1 is set. The nine existing pages use a pill
   * `badge`; the new comps use the site's rule-and-label `eyebrow`.
   */
  eyebrowVariant?: "badge" | "rule";
  /** Trail above the eyebrow. Only the Sponge & Foam comp draws one. */
  breadcrumb?: readonly Crumb[];
  /** Extrusion centres the stat panel; Sponge & Foam sets it left. */
  statsAlign?: "left" | "center";
  /**
   * Desktop layout for the photo (25 Oct 2026, O-Rings first). Instead of a
   * framed photo over a blurred backdrop, the photo runs the full height of
   * the hero on the right, fading only on its left edge into one soft scrim
   * behind the copy. Phones are unchanged.
   */
  fullBleed?: boolean;
  /** Wide image key for the fullBleed desktop hero; falls back to `image`. */
  bleedImage?: string;
  /** fullBleed only: classes overriding the photo frame's left edge
   *  (default 16%) and the photo's object-position (default right). */
  bleedFrame?: string;
  bleedFit?: string;
}) {
  const statsRow =
    stats.length > 0 &&
          (actions && actions.length > 0 ? (
            /* The new comps set the stat row inside a bordered panel with
               vertical rules between the columns, rather than the bare
               border-top row the nine older pages use. */
            <dl className="border-line bg-surface-2/60 rounded-card divide-line mt-12 grid divide-y border backdrop-blur sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className={`px-6 py-7 ${statsAlign === "center" ? "text-center" : ""}`}
                >
                  <dd className="text-ink order-1 text-2xl font-bold">
                    {s.value}
                  </dd>
                  <dt className="text-ink-4 order-2 mt-1.5 text-xs">
                    {s.label}
                  </dt>
                </div>
              ))}
            </dl>
          ) : (
          <dl className="border-line mt-14 grid gap-8 border-t pt-6 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label}>
                {/* Value first visually, but dt/dd order kept semantic. */}
                <dd className="text-ink order-1 text-sm font-bold">
                  {s.value}
                </dd>
                <dt className="text-ink-4 order-2 mt-1 text-xs">{s.label}</dt>
              </div>
            ))}
          </dl>
          ));

  return (
    <>
    {/* bg-canvas: the multiply tint below needs a dark ground to blend with.
        With the photo no longer full-bleed, a transparent header let the
        tint show as a flat grey wherever the photo is not.
        With a photo, the hero fills the screen height on desktop (25 Oct
        2026): the photo is shown whole at the hero's height, so a taller
        hero is what makes it large — enlarging it past the hero's height
        is what used to crop the rings. Copy stays at the top; the stat row
        sits at the foot (the spacer below takes up the difference). */}
    <header
      className={`bg-canvas relative isolate overflow-hidden ${
        !image
          ? ""
          : fullBleed
            ? // Tall enough that the ~2.4:1 photo, sized to this height,
              // spans ~80% of the width (34vw); taller if the copy needs it.
              "lg:flex lg:min-h-[calc(var(--header-h)+34vw)] lg:flex-col"
            : "lg:flex lg:min-h-svh lg:flex-col"
      }`}
    >
      {image && (
        <>
          {/* Full-bleed backdrop (desktop): the same photo, enlarged to
              cover the hero, heavily blurred and darkened. It gives the hero
              the edge-to-edge photographic look while the SHARP photo — drawn
              inside the Container below (see .hero-media) — stays whole:
              nothing in focus is ever cropped. Decorative, so alt="". Not
              priority: hidden below lg, where a lazy image is never fetched. */}
          {fullBleed ? (
            /* Desktop: the wide photo fills the hero edge to edge, product on
               the right; the scrim below darkens only the copy side. */
            /* The photo fills the same frame on every page: below the
               header, the right 84% of the width, its left edge fading into
               the copy side. Very wide shots (O-Rings, ~2.4:1) fit it almost
               exactly; 16:9 shots are trimmed a little top and bottom rather
               than leaving bare page beside them. */
            <div className={`absolute top-[var(--header-h)] right-0 bottom-0 left-[16%] -z-30 hidden [mask-image:linear-gradient(to_right,transparent,#000_22%)] lg:block ${bleedFrame ?? ""}`}>
              <Img
                k={bleedImage ?? image}
                fill
                priority
                sizes="85vw"
                className={`object-cover ${bleedFit ?? "object-[right_center]"}`}
              />
            </div>
          ) : (
            <Img
              k={image}
              fill
              alt=""
              sizes="40vw"
              className="-z-30 hidden scale-[1.15] object-cover object-right blur-[28px] brightness-[0.55] saturate-[0.9] lg:block"
            />
          )}
          {/* Tone (21 Oct 2026): a cool grey multiplied over the photos, so
              the white studio backdrops read as soft grey on a black page
              while black rubber stays black. */}
          {/* (The wide full-bleed photo is shot dark grey already, so it
              skips the tint.) */}
          {!fullBleed && <div className="absolute inset-0 -z-10 bg-[#a1a9ae] mix-blend-multiply" />}
          {/* Desktop legibility: a solid black panel behind the copy with a
              straight edge, then a short blend into the photo (25 Oct 2026).
              Solid to 42% / blended out by 52%; from 1024 to 1279px, 38% /
              47%, where the photo starts further left, so the panel never
              covers the product. Plus a fade under the stat row. Phones need
              neither — the photo sits under the copy there. */}
          {fullBleed ? (
            <>
              {/* One eased scrim behind the copy, no hard panel edge. */}
              <div className="absolute inset-0 -z-10 hidden bg-[linear-gradient(to_right,rgb(0_0_0/0.92)_0%,rgb(0_0_0/0.8)_22%,rgb(0_0_0/0.45)_40%,transparent_58%)] lg:block" />
              <div className="from-canvas absolute inset-x-0 bottom-0 -z-10 hidden h-[12%] bg-gradient-to-t to-transparent lg:block" />
            </>
          ) : (
            <>
              <div className="absolute inset-0 -z-10 hidden bg-[linear-gradient(to_right,var(--color-canvas)_0%,var(--color-canvas)_38%,transparent_47%)] lg:block xl:bg-[linear-gradient(to_right,var(--color-canvas)_0%,var(--color-canvas)_42%,transparent_52%)]" />
              <div className="from-canvas absolute inset-x-0 bottom-0 -z-10 hidden h-[30%] bg-gradient-to-t to-transparent lg:block" />
            </>
          )}
        </>
      )}

      <Container
        className={`hero-offset pb-16 md:pb-20 ${
          image ? "lg:flex lg:flex-1 lg:flex-col" : ""
        }`}
      >
        <Breadcrumb items={breadcrumb} className="mb-6" />

        {eyebrowVariant === "rule" ? (
          <Eyebrow variant="rule">{badge}</Eyebrow>
        ) : (
          <p className="text-eyebrow border-line-2 text-ink-2 inline-flex self-start rounded-pill border px-4 py-1.5 font-mono uppercase">
            {badge}
          </p>
        )}

        <h1 className={`${displaySize([headingLead, headingAccent])} mt-6`}>
          {/* The space before the break is invisible but keeps the two lines
              two words apart for a crawler reading the text. */}
          {headingLead}{" "}
          <br />
          <span className="text-accent-400">{headingAccent}</span>
        </h1>

        <p className="text-ink-3 mt-6 max-w-[52ch] leading-relaxed">{emphasised(intro)}</p>

        <HeroChips chips={chips} />

        {link && (
          <a
            href={link.href}
            className="text-accent-400 mt-6 inline-flex self-start items-center gap-1.5 text-sm font-medium"
          >
            {/* An in-page link points down the page, not out of it. */}
            {link.label} <span aria-hidden>{link.href.startsWith("#") ? "↓" : "↗"}</span>
          </a>
        )}

        {actions && actions.length > 0 && (
          <div className="mt-9 flex flex-wrap gap-3">
            {actions.map((a) => (
              <Button key={a.label} href={a.href} variant={a.variant ?? "primary"}>
                {a.label}
                <span aria-hidden>{a.variant === "secondary" ? "›" : "→"}</span>
              </Button>
            ))}
          </div>
        )}

        {/* Product photograph — shown whole, never cropped or enlarged past
            its own resolution (the category shots are 1024px squares).
            Phones/tablets: in the flow under the copy. Desktop: anchored
            right as the hero backdrop. Brightness on phones stands in for
            the multiply tint above, which only reaches it on desktop. */}
        {image && (
          <Img
            k={image}
            priority
            sizes="(min-width: 1024px) 60vw, (min-width: 640px) 32rem, 100vw"
            className={`hero-media max-lg:max-w-[32rem] max-lg:brightness-[0.7] lg:contrast-[1.04] [--hero-media-max-h:60vw]${
              fullBleed ? " lg:hidden" : ""
            }`}
          />
        )}

        {/* Desktop full-screen hero: pushes the stat row to the foot. */}
        {image && <div aria-hidden className="hidden lg:block lg:flex-1" />}

        {!fullBleed && statsRow}
      </Container>
    </header>

    {/* fullBleed: the stat row sits just under the photo hero, not over it. */}
    {fullBleed && statsRow && (
      <div className="bg-canvas">
        <Container className="pb-12">{statsRow}</Container>
      </div>
    )}
    </>
  );
}
