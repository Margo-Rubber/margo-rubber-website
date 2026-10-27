import { autocompleteFor } from "@/lib/autocomplete";
import Link from "next/link";
import { Img } from "@/components/ui/Img";
import { HeroVideo } from "@/components/ui/HeroVideo";
import { ExportMap } from "@/components/sections/ExportMap";
import { buildExportMap, laneCards } from "@/lib/export-map";
import { Container } from "@/components/ui/Section";
import type { Compound } from "@/content/schemas";
import { Bloom } from "@/components/ui/Bloom";
import { ScrollSteps } from "@/components/ui/ScrollSteps";
import {
  EnquiryForm,
  EnquiryStatus,
  EnquirySubmit,
} from "@/components/forms/EnquiryForm";
import { AttachmentField } from "@/components/forms/AttachmentField";
import { displaySize } from "@/lib/display-size";
import { SlotValue } from "@/components/ui/SlotValue";

/* ══ SHARED ═══════════════════════════════════════════════════════════════ */

/**
 * Rule-flanked eyebrow. The homepage uses two forms: a single leading rule for
 * left-aligned sections, and rules on both sides for centred ones.
 */
export function Rule({
  children,
  center = false,
}: {
  children: React.ReactNode;
  center?: boolean;
}) {
  return (
    <p
      className={`text-eyebrow text-accent-400 flex items-center gap-4 font-mono uppercase ${
        center ? "justify-center" : ""
      }`}
    >
      <span aria-hidden className="bg-accent-400/70 inline-block h-px w-8" />
      {children}
      {center && (
        <span aria-hidden className="bg-accent-400/70 inline-block h-px w-8" />
      )}
    </p>
  );
}

/**
 * Display heading with inline accent.
 *
 * The homepage mixes whole-line accent ("*Meets*") with mid-line accent
 * ("Two Decades of *Engineering* Precision"), so accent is marked in the
 * content with asterisks rather than by line index.
 */
export function Marked({
  lines,
  as: H = "h2",
  size = "section",
  className = "",
}: {
  lines: readonly string[];
  as?: "h1" | "h2";
  size?: "hero" | "section";
  className?: string;
}) {
  return (
    <H
      className={`${displaySize(lines, size)} ${className}`}
    >
      {lines.map((line, li) => (
        // The space after each block line is invisible but load-bearing: without
        // it a crawler reads "Where RubberMeetsInnovation" as the H1.
        <span key={line}>
          <span className="block">
            {line.split("*").map((part, i) =>
              i % 2 === 1 ? (
                <span key={part} className="text-accent-400">
                  {part}
                </span>
              ) : (
                part
              ),
            )}
          </span>
          {li < lines.length - 1 ? " " : null}
        </span>
      ))}
    </H>
  );
}

function CenterHead({
  eyebrow,
  lines,
  body,
}: {
  eyebrow: string;
  lines: readonly string[];
  body?: string;
}) {
  return (
    <header className="mx-auto max-w-[52rem] text-center">
      <Rule center>{eyebrow}</Rule>
      <Marked lines={lines} className="mt-7" />
      {body && (
        <p className="text-ink-3 mx-auto mt-6 max-w-[62ch] leading-relaxed">
          {body}
        </p>
      )}
    </header>
  );
}

/** Photo that dims and dissolves into the band it sits on. */
function Photo({
  k,
  ratio = "aspect-[16/9]",
  sizes,
  surface,
  dissolve = true,
  className = "",
  brightness = "brightness-[0.9]",
  priority = false,
}: {
  k: string;
  ratio?: string;
  sizes?: string;
  surface?: string;
  dissolve?: boolean;
  className?: string;
  brightness?: string;
  priority?: boolean;
}) {
  return (
    <div className={`relative isolate overflow-hidden ${ratio} ${className}`}>
      <Img
        k={k}
        fill
        priority={priority}
        sizes={sizes ?? "(min-width:1024px) 50vw, 100vw"}
        className={`object-cover ${brightness}`}
      />
      {dissolve && surface && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `linear-gradient(to top, ${surface}, transparent 60%)`,
          }}
        />
      )}
    </div>
  );
}

/* ── icons: drawn paths, never Unicode glyphs ───────────────────────────── */
const ICONS: Record<string, React.ReactNode> = {
  /* Added for the nine-sector grid. The previous six cards reused car /
     heart / chip / droplet / wrench / package; Mining, Oil & Gas, Pumps &
     Valves, HVAC and Agriculture had no glyph of their own. */
  pickaxe: (
    <>
      <path d="M3.5 20.5 12 12" />
      <path d="M5.5 9.5a11 11 0 0 1 13 0" />
      <path d="M9.5 5.5a11 11 0 0 1 9 9" />
      <path d="m10.5 10.5 3 3" />
    </>
  ),
  fuel: (
    <>
      <path d="M4 20.5V6a2 2 0 0 1 2-2h5a2 2 0 0 1 2 2v14.5M3 20.5h11" />
      <path d="M4 11h9" />
      <path d="M16 8.5 18.5 11v6a1.8 1.8 0 0 0 3.5 0v-7.6L19 6.5" />
    </>
  ),
  gauge: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m12 12 4-3.2" />
      <path d="M12 3.5v2M20.5 12h-2M12 20.5v-2M3.5 12h2" />
    </>
  ),
  wind: (
    <>
      <path d="M3.5 8.5h9a2.8 2.8 0 1 0-2.8-2.8" />
      <path d="M3.5 12.5h13a2.8 2.8 0 1 1-2.8 2.8" />
      <path d="M3.5 16.5h6" />
    </>
  ),
  leaf: (
    <>
      <path d="M4.5 19.5c0-8 5-13 15-13 0 10-5 14-11 14-2.2 0-4-1.6-4-1z" />
      <path d="M9 15c2.5-3 5.5-5 9-6" />
    </>
  ),
  shield: <path d="M12 3.2 19 6v5.6c0 4-2.9 7.4-7 9.2-4.1-1.8-7-5.2-7-9.2V6z" />,
  bolt: <path d="M13.5 3 5.5 13.5H11l-.5 7.5 8-10.5H13z" />,
  gear: (
    <>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 2.8v2.4M12 18.8v2.4M21.2 12h-2.4M5.2 12H2.8M18.5 5.5l-1.7 1.7M7.2 16.8l-1.7 1.7M18.5 18.5l-1.7-1.7M7.2 7.2 5.5 5.5" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17M12 3.5c2.4 2.4 3.6 5.4 3.6 8.5S14.4 18.1 12 20.5c-2.4-2.4-3.6-5.4-3.6-8.5S9.6 5.9 12 3.5z" />
    </>
  ),
  layers: (
    <>
      <path d="m12 3.5 8.5 4.3-8.5 4.3-8.5-4.3z" />
      <path d="m3.5 12.2 8.5 4.3 8.5-4.3M3.5 16.4l8.5 4.3 8.5-4.3" />
    </>
  ),
  ribbon: (
    <>
      <circle cx="12" cy="9" r="5.2" />
      <path d="m8.9 13.6-1.6 6.4 4.7-2.2 4.7 2.2-1.6-6.4" />
    </>
  ),
  car: (
    <>
      <path d="M4.5 16.5v-3l1.8-4.2A2 2 0 0 1 8.1 8h7.8a2 2 0 0 1 1.8 1.3l1.8 4.2v3" />
      <path d="M3.5 13.5h17M4.5 16.5h3v1.8h-3zM16.5 16.5h3v1.8h-3z" />
      <circle cx="8" cy="13.5" r=".6" fill="currentColor" stroke="none" />
      <circle cx="16" cy="13.5" r=".6" fill="currentColor" stroke="none" />
    </>
  ),
  heart: (
    <path d="M12 20.2 4.9 13a4.4 4.4 0 0 1 0-6.3 4.4 4.4 0 0 1 6.3 0l.8.8.8-.8a4.4 4.4 0 0 1 6.3 0 4.4 4.4 0 0 1 0 6.3z" />
  ),
  chip: (
    <>
      <rect x="7" y="7" width="10" height="10" rx="2" />
      <path d="M10 3.5v3M14 3.5v3M10 17.5v3M14 17.5v3M3.5 10h3M3.5 14h3M17.5 10h3M17.5 14h3" />
    </>
  ),
  droplet: (
    <>
      <path d="M12 3.2s5.5 5.6 5.5 9.3a5.5 5.5 0 0 1-11 0c0-3.7 5.5-9.3 5.5-9.3z" />
      <path d="M9.4 13.5a2.6 2.6 0 0 0 2.6 2.6" />
    </>
  ),
  wrench: (
    <path d="M15.5 3.5a5 5 0 0 0-4.6 7l-7 7 2.6 2.6 7-7a5 5 0 0 0 6.3-6.3l-3 3-2.6-2.6 3-3a5 5 0 0 0-1.7-.7z" />
  ),
  package: (
    <>
      <path d="m12 3.2 8 4.4v8.8l-8 4.4-8-4.4V7.6z" />
      <path d="m4 7.6 8 4.4 8-4.4M12 12v8.8" />
    </>
  ),
};

export function Icon({
  name,
  className = "size-5",
}: {
  name: string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {ICONS[name]}
    </svg>
  );
}

function IconTile({ name }: { name: string }) {
  return (
    <span className="border-accent-400/20 bg-accent-400/10 text-accent-400 grid size-10 shrink-0 place-items-center rounded-xl border">
      <Icon name={name} />
    </span>
  );
}

function Check({ className = "size-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M20.5 11.2V12a8.5 8.5 0 1 1-5-7.8" />
      <path d="m8.6 11.6 2.9 2.9 8-8" />
    </svg>
  );
}

function Arrow({ className = "size-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M4 12h15M13.5 6.5 20 12l-6.5 5.5" />
    </svg>
  );
}

/* ══ 01 · HERO ════════════════════════════════════════════════════════════ */
/**
 * A paragraph with named phrases linked — the hero intro names four product
 * lines (sheet 01 §01). The first occurrence of each label, as written, is
 * wrapped; a label that is not in the text is simply not linked.
 */
export function LinkedText({
  text,
  links,
}: {
  text: string;
  links: readonly { label: string; href: string }[];
}) {
  const parts: React.ReactNode[] = [];
  let rest = text;
  const pending = links.filter((l) => l.label && rest.includes(l.label));
  while (rest.length) {
    let first: { label: string; href: string; at: number } | null = null;
    for (const l of pending) {
      const at = rest.indexOf(l.label);
      if (at !== -1 && (first === null || at < first.at)) first = { ...l, at };
    }
    if (!first) {
      parts.push(rest);
      break;
    }
    if (first.at > 0) parts.push(rest.slice(0, first.at));
    parts.push(
      <Link key={`${first.href}-${parts.length}`} href={first.href} className="text-ink underline decoration-accent-400/50 underline-offset-4 hover:decoration-accent-400">
        {first.label}
      </Link>,
    );
    rest = rest.slice(first.at + first.label.length);
    pending.splice(pending.findIndex((l) => l.label === first!.label), 1);
  }
  return <>{parts}</>;
}

export function HomeHero({
  eyebrow,
  h1Lines,
  intro,
  introLinks = [],
  actions,
  chips,
  cards,
}: {
  eyebrow: string;
  h1Lines: readonly string[];
  intro: string;
  introLinks?: readonly { label: string; href: string }[];
  image: string;
  actions: readonly { label: string; href: string; variant: string }[];
  chips: readonly { label: string; href: string }[];
  cards: readonly { value: string; label: string; icon?: string }[];
}) {
  return (
    <header className="margo-hero bg-canvas relative isolate overflow-hidden hero-offset pb-24 md:pb-32">
      <HeroVideo
        // Bump ?v= whenever the video or poster file is replaced, so cached
        // copies of the old files are not shown.
        src="/videos/hero-bg-boomerang.mp4?v=2"
        poster="/videos/hero-bg-poster.jpg?v=2"
        className="margo-hero-image -z-20"
      />
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(to right, color-mix(in srgb, var(--color-canvas) 92%, transparent) 4%, color-mix(in srgb, var(--color-canvas) 55%, transparent) 30%, transparent 52%)",
        }}
      />
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(to top, var(--color-canvas), transparent 32%)",
        }}
      />
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(to bottom, var(--color-canvas), transparent 16%)",
        }}
      />

      {/* Accent blooms, as on /about: one behind the copy, one behind the
          stat stack, so the frame is lit rather than flat. */}
      <Bloom className="top-1/4 -left-32 size-[34rem]" />
      <Bloom className="top-1/3 right-[-6rem] size-[30rem]" />


      {/* Wide screens: up to ~1500px this is the normal site column. Beyond
          it the side margin stops growing at 10.4% of the width (the comp's
          proportion) instead of centring a fixed 1184px column, so the copy
          stays left-aligned like the comp on large or zoomed-out windows. */}
      <Container className="lg:max-w-none! lg:px-[min(max(50px,calc((100%-1184px)/2)),max(50px,10.4%))]">
        <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div>
            <Rule>{eyebrow}</Rule>
            <Marked as="h1" size="hero" lines={h1Lines} className="mt-6" />
            <p className="text-ink-3 mt-7 max-w-[46ch] leading-relaxed">
              <LinkedText text={intro} links={introLinks} />
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              {actions.map((a) =>
                a.variant === "primary" ? (
                  <Link
                    key={a.label}
                    href={a.href}
                    className="margo-hero-action bg-accent-400 text-ink hover:opacity-90 shadow-glow rounded-cta inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold"
                  >
                    {a.label}
                    <Arrow />
                  </Link>
                ) : (
                  <Link
                    key={a.label}
                    href={a.href}
                    className="margo-hero-action border-line-2 bg-canvas/60 text-ink hover:border-accent-400/60 rounded-pill inline-flex items-center gap-2.5 border px-6 py-3.5 text-sm font-semibold backdrop-blur"
                  >
                    <svg viewBox="0 0 24 24" className="size-3.5 fill-current" aria-hidden>
                      <path d="M8 5.5v13l11-6.5z" />
                    </svg>
                    {a.label}
                  </Link>
                ),
              )}
            </div>

            <ul className="mt-9 flex flex-wrap gap-2.5">
              {chips.map((c) => (
                <li key={c.label}>
                  <Link
                    href={c.href}
                    className="margo-hero-chip text-eyebrow border-line-2 bg-canvas/50 text-ink-3 hover:border-accent-400/60 hover:text-ink rounded-pill inline-flex border px-3.5 py-1.5 font-mono backdrop-blur"
                  >
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="margo-orbit-anchor">
          <dl className="flex flex-col gap-3.5">
            {cards.map((c) => (
              <div
                key={c.label}
                className="margo-hero-stat rounded-card border-line flex items-center gap-3 border bg-[#111418]/80 px-6 py-4 shadow-[0_0_0_1px_rgba(43,188,196,0.05)] backdrop-blur-md"
              >
                {c.icon && <IconTile name={c.icon} />}
                <div>
                  <dd
                    className={
                      c.icon
                        ? "text-ink text-sm font-semibold"
                        : "text-ink text-2xl leading-none font-semibold"
                    }
                  >
                    {c.value}
                  </dd>
                  <dt className="text-ink-4 mt-1.5 text-sm">{c.label}</dt>
                </div>
              </div>
            ))}
          </dl>
          </div>
        </div>
      </Container>
    </header>
  );
}

/* ══ 02 · TRUST BAR ═══════════════════════════════════════════════════════ */
export function TrustBar({
  label,
  items,
}: {
  label: string;
  items: readonly string[];
}) {
  return (
    <section className="bg-canvas border-line border-y py-10">
      <Container>
        {/* Label animates (rules draw out, light sweep); the names below
            stay as a still, scrollable row. */}
        <p className="margo-trust-label text-eyebrow text-center font-mono uppercase">
          <span className="margo-trust-label-text">{label}</span>
        </p>
      </Container>
      {/* Edge-to-edge and horizontally scrollable rather than a JS marquee, so
          every name stays selectable and in the DOM. */}
      <ul className="mt-6 flex snap-x gap-x-10 overflow-x-auto px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((n) => (
          <li
            key={n}
            className="text-ink-3 flex shrink-0 snap-start items-center gap-3 text-sm whitespace-nowrap"
          >
            <span aria-hidden className="bg-accent-400 size-1.5 rounded-full" />
            {n}
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ══ 03 · OUR STORY ═══════════════════════════════════════════════════════ */
export function Story({
  eyebrow,
  lines,
  paragraphs,
  image,
  imageBadge,
  floatCard,
  stats,
  cta,
}: {
  eyebrow: string;
  lines: readonly string[];
  paragraphs: readonly string[];
  image: string;
  imageBadge: string;
  floatCard: { title: string; body: string; href?: string };
  stats: readonly { value: string; label: string }[];
  cta: { label: string; href: string };
}) {
  return (
    <section className="bg-canvas relative isolate overflow-hidden py-[70px]">
      <Bloom className="top-10 -left-40 size-[32rem]" />
      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <div className="relative pb-24">
            <span className="text-eyebrow border-accent-400/35 bg-canvas/80 text-accent-400 absolute -top-3 left-0 z-10 rounded-md border px-3.5 py-2 font-mono backdrop-blur">
              {imageBadge}
            </span>
            <Photo
              k={image}
              ratio="aspect-[4/3]"
              surface="var(--color-canvas)"
              sizes="(min-width:1024px) 46vw, 100vw"
              className="margo-image-frame rounded-card border-line ml-[6%] border"
            />
            <div className="margo-card rounded-card border-line absolute right-0 bottom-0 w-[62%] border bg-[#111418]/90 p-5 backdrop-blur">
              <p className="text-ink flex items-center gap-2.5 text-sm font-semibold">
                <Icon name="ribbon" className="text-accent-400 size-4" />
                {floatCard.href ? (
                  <Link href={floatCard.href} className="hover:text-accent-400 transition-colors after:absolute after:inset-0">
                    {floatCard.title}
                  </Link>
                ) : (
                  floatCard.title
                )}
              </p>
              <p className="text-ink-4 mt-2 text-xs leading-relaxed">
                {floatCard.body}
              </p>
            </div>
          </div>

          <div>
            <Rule>{eyebrow}</Rule>
            <Marked lines={lines} className="mt-6" />
            {paragraphs.map((p) => (
              <p key={p.slice(0, 24)} className="text-ink-3 mt-5 leading-relaxed">
                {p}
              </p>
            ))}

            <dl className="mt-8 grid grid-cols-2 gap-4">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="margo-card rounded-card border-line border bg-[#0F1115] px-6 py-5"
                >
                  <dd className="text-ink text-xl font-semibold"><SlotValue value={s.value} /></dd>
                  <dt className="text-ink-4 mt-1 text-sm">{s.label}</dt>
                </div>
              ))}
            </dl>

            <Link
              href={cta.href}
              className="text-accent-400 hover:opacity-80 mt-8 inline-flex items-center gap-2 text-sm font-semibold transition-colors"
            >
              {cta.label}
              <Arrow />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ══ 04 · COMPETITIVE EDGE ════════════════════════════════════════════════ */
export function Edge({
  eyebrow,
  lines,
  items,
}: {
  eyebrow: string;
  lines: readonly string[];
  items: readonly { icon: string; name: string; body: string; href?: string }[];
}) {
  return (
    <section className="bg-canvas relative isolate overflow-hidden py-[70px]">
      <Bloom className="-top-20 left-1/2 size-[36rem] -translate-x-1/2" />
      <Container>
        <CenterHead eyebrow={eyebrow} lines={lines} />
        <ul className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {items.map((it) => (
            <li
              key={it.name}
              className="margo-card rounded-card border-line relative border bg-[#0F1115] p-7"
            >
              <IconTile name={it.icon} />
              <h3 className="text-ink mt-6 text-base font-semibold">
                {it.href ? (
                  <Link href={it.href} className="hover:text-accent-400 transition-colors after:absolute after:inset-0">
                    {it.name}
                  </Link>
                ) : (
                  it.name
                )}
              </h3>
              <p className="text-ink-4 mt-2.5 text-sm leading-relaxed">
                {it.body}
              </p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

/* ══ 05 · PORTFOLIO ═══════════════════════════════════════════════════════ */
export function Portfolio({
  eyebrow,
  lines,
  cta,
  items,
}: {
  eyebrow: string;
  lines: readonly string[];
  cta: { label: string; href: string };
  items: readonly {
    name: string;
    spec: string;
    image: string;
    href: string;
  }[];
}) {
  return (
    <section className="bg-canvas py-[70px]">
      <Container>
        <header className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div>
            <Rule>{eyebrow}</Rule>
            <Marked lines={lines} className="mt-6" />
          </div>
          <Link
            href={cta.href}
            className="text-accent-400 hover:opacity-80 inline-flex items-center gap-1.5 text-sm font-semibold transition-colors"
          >
            {cta.label}
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-3.5"
              aria-hidden
            >
              <path d="M7 17 17 7M8.5 7H17v8.5" />
            </svg>
          </Link>
        </header>

        {/* Edge-to-edge image tiles, per the comp: no card chrome, no gap.
            The whole tile is the link, the name and spec sit on the art, and
            the nine categories match /products exactly. Replaces six generic
            marketing cards ("Rubber Sheets", "Custom Solutions") that did not
            correspond to anything in the catalogue. */}
        {/* Six columns so a tile can be a third (span 2) or a half (span 3).
            The comp runs rows of three and finishes on a row of two, and it
            keeps that last row the SAME HEIGHT as the others — the tiles get
            wider, not taller. A third-width 4:3 tile is W/4 high, so a
            half-width tile at the same height is 2:1. */}
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6">
          {items.map((p, i) => {
            // Only when the last row would otherwise sit short by one.
            const widowed = items.length % 3 === 2 && i >= items.length - 2;
            return (
            <li
              key={p.name}
              className={`margo-product-tile relative isolate ${widowed ? "lg:col-span-3" : "lg:col-span-2"}`}
            >
              <Link
                href={p.href}
                className="group block focus-visible:z-10"
                aria-label={`${p.name} — ${p.spec}`}
              >
                <Photo
                  k={p.image}
                  ratio={widowed ? "aspect-[2/1]" : "aspect-[4/3]"}
                  dissolve={false}
                  sizes={
                    widowed
                      ? "(min-width:1024px) 50vw, (min-width:640px) 50vw, 100vw"
                      : "(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                  }
                  brightness="brightness-[0.62] transition-[filter,transform] duration-700 group-hover:brightness-[0.78]"
                />
                {/* Scrim only across the lower third, so the art stays legible
                    while the caption keeps its contrast. */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, rgb(0 0 0 / 0.82) 0%, rgb(0 0 0 / 0.35) 26%, transparent 52%)",
                  }}
                />
                <span className="absolute inset-x-0 bottom-0 p-6">
                  <span className="text-ink block text-lg font-semibold">
                    {p.name}
                  </span>
                  <span className="text-eyebrow text-accent-400 mt-1.5 block font-mono uppercase">
                    {p.spec}
                  </span>
                </span>
              </Link>
            </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}

/* ══ 06 · SECTORS ═════════════════════════════════════════════════════════ */
export function Sectors({
  eyebrow,
  lines,
  items,
}: {
  eyebrow: string;
  lines: readonly string[];
  items: readonly {
    icon: string;
    name: string;
    body: string;
    href: string;
  }[];
}) {
  return (
    <section className="bg-canvas relative isolate overflow-hidden py-[70px]">
      <Bloom className="-top-20 left-1/2 size-[36rem] -translate-x-1/2" />
      <Container>
        <CenterHead eyebrow={eyebrow} lines={lines} />
        <ul className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {items.map((s) => (
            <li key={s.name}>
              <Link
                href={s.href}
                data-lift="" className="rounded-card border-line hover:border-accent-400/40 flex h-full gap-4 border bg-[#0F1115] p-6"
              >
                <IconTile name={s.icon} />
                <div>
                  <h3 className="text-ink text-base font-semibold">{s.name}</h3>
                  <p className="text-ink-4 mt-2 text-sm leading-relaxed">
                    {s.body}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

/* ══ 07 · HOW WE WORK ═════════════════════════════════════════════════════ */
export function Process({
  eyebrow,
  lines,
  body,
  steps,
}: {
  eyebrow: string;
  lines: readonly string[];
  body?: string;
  steps: readonly { name: string; body: string; href?: string }[];
}) {
  return (
    <section className="relative isolate overflow-hidden bg-[#171A1F] py-[70px]">
      <Container>
        <CenterHead eyebrow={eyebrow} lines={lines} body={body} />

        <ScrollSteps className="margo-steps relative mt-16">
          {/* Spine. Sits behind the nodes and is hidden from assistive tech. */}
          <span
            aria-hidden
            className="bg-line-2 absolute top-0 bottom-0 left-4 w-px md:left-1/2 md:-translate-x-1/2"
          />
          {/* Spine fill: grows with scroll progress (see ScrollSteps). */}
          <span
            aria-hidden
            className="margo-spine-fill absolute top-0 bottom-0 left-4 w-px md:left-1/2 md:-translate-x-1/2"
          />

          {steps.map((s, i) => (
            <li
              key={s.name}
              className="relative grid gap-x-10 pb-10 last:pb-0 md:grid-cols-2"
            >
              <span
                aria-hidden
                className="margo-step-node absolute top-6 left-4 z-10 grid size-7 -translate-x-1/2 place-items-center rounded-full text-xs font-semibold md:left-1/2"
              >
                {i + 1}
              </span>

              <div
                className={
                  i % 2 === 0
                    ? "md:col-start-1 md:pr-14"
                    : "md:col-start-2 md:pl-14"
                }
              >
                <div className="margo-step-card rounded-card ml-10 border bg-[#0F1115] p-6 md:ml-0">
                  <p className="text-eyebrow text-accent-400 font-mono uppercase">
                    STEP {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="text-ink mt-2 text-lg font-semibold">
                    {s.href ? (
                      <Link href={s.href} className="hover:text-accent-400 transition-colors">
                        {s.name} <span aria-hidden>›</span>
                      </Link>
                    ) : (
                      s.name
                    )}
                  </h3>
                  <p className="text-ink-4 mt-2 text-sm leading-relaxed">
                    {s.body}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ScrollSteps>
      </Container>
    </section>
  );
}

/* ══ 08 · FACILITY ════════════════════════════════════════════════════════ */
export function Facility({
  eyebrow,
  lines,
  body,
  image,
  inset,
  badge,
  checks,
  stats = [],
}: {
  eyebrow: string;
  lines: readonly string[];
  body?: string;
  image: string;
  inset: string;
  badge: string;
  checks: readonly string[];
  stats?: readonly { value: string; label: string }[];
}) {
  return (
    <section className="bg-surface-2 py-[70px]">
      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <div className="relative pb-16">
            <figure className="margo-image-frame rounded-card border-line relative isolate overflow-hidden border">
              <Photo
                k={image}
                ratio="aspect-[3/2]"
                dissolve={false}
                sizes="(min-width:1024px) 46vw, 100vw"
              />
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, color-mix(in srgb, var(--color-surface-2) 90%, transparent), transparent 45%)",
                }}
              />
              {/* No badge, no pill: the sheet gives this section none. */}
              {badge && (
                <figcaption className="text-eyebrow border-line bg-canvas/70 text-ink absolute bottom-5 left-5 flex items-center gap-2.5 rounded-md border px-3.5 py-2 font-mono backdrop-blur">
                  <span
                    aria-hidden
                    className="bg-accent-400 size-1.5 rounded-full"
                  />
                  {badge}
                </figcaption>
              )}
            </figure>

            {/* Inset plate overlapping the lower-right corner. */}
            <div className="rounded-card border-line absolute right-0 bottom-0 w-[36%] overflow-hidden border">
              <Photo
                k={inset}
                ratio="aspect-[4/3]"
                dissolve={false}
                brightness="brightness-[0.7] saturate-0"
                sizes="(min-width:1024px) 17vw, 36vw"
              />
            </div>
          </div>

          <div>
            <Rule>{eyebrow}</Rule>
            <Marked lines={lines} className="mt-6" />
            {body && (
              <p className="text-ink-3 mt-6 leading-relaxed">{body}</p>
            )}
            <ul className="mt-8 space-y-3.5">
              {checks.map((c) => (
                <li key={c} className="text-ink-2 flex gap-3 text-sm">
                  <Check className="text-accent-400 mt-0.5 size-4 shrink-0" />
                  {c}
                </li>
              ))}
            </ul>
            {stats.length > 0 && (
              <dl className="border-line mt-8 grid grid-cols-2 gap-6 border-t pt-8 sm:grid-cols-4">
                {stats.map((st) => (
                  <div key={st.label}>
                    <dd className="text-ink text-2xl font-bold"><SlotValue value={st.value} /></dd>
                    <dt className="text-ink-4 mt-1 text-xs">{st.label}</dt>
                  </div>
                ))}
              </dl>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ══ 09 · EXPORT MARKETS ══════════════════════════════════════════════════ */
type Lane = {
  code: string;
  name: string;
  note: string;
  x: number;
  y: number;
  href?: string;
};

/** Coordinates are rounded: raw float output serialises differently on server
 *  and client, which trips a hydration mismatch. */
const r2 = (n: number) => Math.round(n * 100) / 100;

export function ExportMarkets({
  eyebrow,
  lines,
  standfirst,
  hub,
  lanes,
  pins = [],
  note,
  noteLink,
}: {
  eyebrow: string;
  lines: readonly string[];
  standfirst?: string;
  hub: { label: string; x: number; y: number };
  lanes: readonly Lane[];
  /** Pins with no lane card — drawn on the map only. */
  pins?: readonly { label: string; x: number; y: number }[];
  note: string;
  noteLink?: { label: string; href: string };
}) {
  // Real-world geometry, projected on the server (lib/export-map). The x/y
  // percentages still in the CMS are no longer used for placement.
  const map = buildExportMap(lanes, pins);

  return (
    <section className="bg-canvas py-[70px]">
      <Container>
        <header className="mb-12">
          <Rule>{eyebrow}</Rule>
          <Marked lines={lines} className="mt-6" />
          {standfirst && (
            <p className="text-ink-3 mt-6 max-w-[58ch] leading-relaxed">{standfirst}</p>
          )}
        </header>

        <ExportMap data={map} hubLabel={hub.label} cards={laneCards(lanes, pins)}>
            <p className="text-ink-4 mt-2 flex gap-2.5 text-xs leading-relaxed">
              <Icon name="globe" className="text-accent-400 mt-px size-4 shrink-0" />
              <span>
                {note}
                {noteLink?.label && noteLink.href && (
                  <>
                    {" "}
                    <Link href={noteLink.href} className="text-accent-400 hover:opacity-80">
                      {noteLink.label} <span aria-hidden>→</span>
                    </Link>
                  </>
                )}
              </span>
            </p>
        </ExportMap>
      </Container>
    </section>
  );
}

/* ══ 10 · MATERIAL ENGINEERING ════════════════════════════════════════════ */
const deg = (n: number) => (n < 0 ? `−${Math.abs(n)}` : String(n));
export function Materials({
  eyebrow,
  lines,
  body,
  axis,
  footnote,
  compounds,
}: {
  eyebrow: string;
  lines: readonly string[];
  body?: string;
  axis: { min: number; mid: number; max: number };
  footnote: string;
  /** The eight rows from site settings — the one source every page reads. */
  compounds: readonly Compound[];
}) {
  const span = axis.max - axis.min;
  const pct = (v: number) => r2(((v - axis.min) / span) * 100);

  return (
    <section className="bg-canvas py-[70px]">
      <Container>
        <header className="mb-12">
          <Rule>{eyebrow}</Rule>
          <Marked lines={lines} className="mt-6" />
          {body && (
            <p className="text-ink-3 mt-6 max-w-[58ch] leading-relaxed">
              {body}
            </p>
          )}
        </header>

        <div className="rounded-card border-line overflow-x-auto border bg-[#0F1115]">
          {/* A real table, styled as bars (sheet 01 §10: "Do not build it from
              <div>s — the tabular relationship is what makes it extractable").
              Compound names are row headings; the bar is a visual of the
              range column, not the data. */}
          <table className="w-full border-collapse">
            <caption className="sr-only">Service temperature range of the eight compounds mixed in-house</caption>
            <thead>
              <tr className="text-eyebrow text-ink-4 font-mono">
                <th scope="col" className="w-[10rem] px-6 pt-5 pb-1 text-left font-normal">
                  <span className="sr-only">Compound</span>
                </th>
                <th scope="col" className="px-2 pt-5 pb-1 font-normal">
                  <span className="flex justify-between" aria-hidden>
                    <span>{axis.min}°C</span>
                    <span>{axis.mid}°C</span>
                    <span>{axis.max}°C</span>
                  </span>
                  <span className="sr-only">Service range on a scale of {axis.min}°C to {axis.max}°C</span>
                </th>
                <th scope="col" className="w-[8rem] px-6 pt-5 pb-1 text-right font-normal">
                  <span className="sr-only">Service range</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {compounds.map((c) => {
                const lo = pct(c.minC);
                const hi = pct(c.maxC);
                return (
                  <tr key={c.code} className="border-line border-t">
                    <th scope="row" className="min-w-0 px-6 py-5 text-left align-middle">
                      <p className="text-ink text-sm font-semibold">{c.href ? <a href={c.href} className="hover:text-accent-400 transition-colors">{c.name}</a> : c.name}</p>
                      <p className="text-ink-4 mt-0.5 text-xs leading-snug font-normal">{c.descriptor}</p>
                    </th>
                    <td className="px-2 py-5 align-middle">
                      <div
                        className="relative h-1.5 w-full rounded-full bg-[#20242A]"
                        role="img"
                        aria-label={`${c.name} service range ${c.minC} to ${c.maxC} degrees Celsius${c.continuousMaxC ? `, continuous to ${c.continuousMaxC}` : ""}`}
                      >
                        <span
                          className="bg-accent-400 absolute inset-y-0 rounded-full"
                          style={{ left: `${lo}%`, width: `${r2(hi - lo)}%` }}
                        />
                      </div>
                    </td>
                    {/* A true minus sign (U+2212), as the sheets and the compound table write it — not a hyphen. */}
                    <td className="text-ink-2 px-6 py-5 text-right align-middle text-sm whitespace-nowrap">
                      {deg(c.minC)}° to {deg(c.maxC)}°C{c.continuousMaxC ? <span className="text-ink-4 block text-xs">continuous to {c.continuousMaxC}°C</span> : null}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <p className="text-ink-4 border-line flex gap-2.5 border-t px-6 py-5 text-xs leading-relaxed">
            <Icon name="ribbon" className="text-accent-400 mt-px size-4 shrink-0" />
            {footnote}
          </p>
        </div>
      </Container>
    </section>
  );
}

/* ══ 12 · GET IN TOUCH ════════════════════════════════════════════════════ */
type Field = {
  name: string;
  label: string;
  placeholder: string;
  type: string;
  options?: readonly string[];
  required?: boolean;
  full?: boolean;
};

const inputCls =
  "mt-2 w-full rounded-lg border border-line-2 bg-[#16191E] px-4 py-3 text-sm text-ink placeholder:text-ink-4 focus:border-accent-400";

function Control({ f }: { f: Field }) {
  if (f.type === "textarea") {
    return (
      <textarea
        name={f.name}
        rows={4}
        required={f.required}
        placeholder={f.placeholder}
        className={inputCls}
      />
    );
  }
  if (f.type === "select") {
    return (
      <select
        name={f.name}
        required={f.required}
        defaultValue=""
        className={`${inputCls} text-ink-4`}
      >
        <option value="" disabled>
          {f.placeholder}
        </option>
        {f.options?.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    );
  }
  return (
    <input
      name={f.name}
      type={f.type}
      autoComplete={autocompleteFor(f.name)}
      required={f.required}
      placeholder={f.placeholder}
      className={inputCls}
    />
  );
}

export function HomeCta({
  eyebrow,
  lines,
  panel,
  fields,
  uploadLabel,
  uploadHint,
  submitLabel,
  footnote,
}: {
  eyebrow: string;
  lines: readonly string[];
  panel: {
    badge: string;
    title: string;
    body: string;
    image: string;
    stats: readonly { value: string; label: string }[];
  };
  fields: readonly Field[];
  uploadLabel: string;
  uploadHint: string;
  submitLabel: string;
  footnote: string;
}) {
  return (
    <section className="bg-surface-2 relative isolate overflow-hidden py-[70px]">
      <Bloom className="-bottom-40 left-1/2 size-[36rem] -translate-x-1/2" />
      <Container>
        <CenterHead eyebrow={eyebrow} lines={lines} />

        <div className="rounded-card border-line mt-14 grid overflow-hidden border bg-[#171A1F] lg:grid-cols-2">
          {/* Left plate */}
          <div className="relative isolate flex flex-col justify-center p-8 md:p-10">
            <Img
              k={panel.image}
              fill
              sizes="(min-width:1024px) 50vw, 100vw"
              className="-z-20 object-cover brightness-[0.72]"
            />
            {/* Lighter than before so the photo reads: dark only where the
                stat tiles sit, fading to a light tint at the top. */}
            <div
              className="absolute inset-0 -z-10"
              style={{
                background:
                  "linear-gradient(to top, color-mix(in srgb, #171A1F 88%, transparent) 0%, color-mix(in srgb, #171A1F 72%, transparent) 45%, color-mix(in srgb, #171A1F 50%, transparent) 62%, color-mix(in srgb, #171A1F 12%, transparent) 100%)",
              }}
            />
            {panel.badge && (
              <span className="text-eyebrow border-accent-400/35 bg-accent-400/10 text-accent-400 inline-flex w-fit items-center gap-2 rounded-pill border px-3.5 py-1.5 font-mono uppercase">
                <span aria-hidden className="bg-accent-400 size-1.5 rounded-full" />
                {panel.badge}
              </span>
            )}
            <h3 className="text-ink mt-6 text-2xl leading-tight font-semibold md:text-3xl">
              {panel.title}
            </h3>
            <p className="text-ink/75 mt-4 max-w-[42ch] text-sm leading-relaxed [text-shadow:0_1px_10px_rgb(0_0_0/0.85)]">
              {panel.body}
            </p>

            <dl className="mt-8 grid grid-cols-2 gap-3.5">
              {panel.stats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-card border-line bg-canvas/50 border px-5 py-4 backdrop-blur"
                >
                  <dd className="text-ink text-lg font-semibold"><SlotValue value={s.value} /></dd>
                  <dt className="text-eyebrow text-ink-4 mt-1 font-mono uppercase">
                    {s.label}
                  </dt>
                </div>
              ))}
            </dl>
          </div>

          {/* Posts to /api/enquiry. Only the <form> element is a client
              component; everything inside stays server-rendered. */}
          <EnquiryForm source="home" className="p-8 md:p-10">
            <div className="grid gap-5 sm:grid-cols-2">
              {fields.map((f) => (
                <label
                  key={f.name}
                  className={f.full ? "sm:col-span-2" : undefined}
                >
                  <span className="text-eyebrow text-ink-4 font-mono uppercase">
                    {f.label}
                  </span>
                  <Control f={f} />
                </label>
              ))}

              {/* Sheet 01 §11: the drawing uploads to Margo's Cloudinary
                  while the visitor types; the enquiry carries the reference. */}
              <AttachmentField label={uploadLabel} hint={uploadHint} className="sm:col-span-2" />
            </div>

            <EnquirySubmit className="bg-accent-400 text-ink hover:opacity-90 shadow-glow rounded-cta mt-7 flex w-full items-center justify-center gap-2 px-6 py-4 text-sm font-semibold transition-colors">
              {submitLabel}
              <Arrow />
            </EnquirySubmit>
            <EnquiryStatus />

            <p className="text-ink-4 mt-4 text-center text-xs">{footnote}</p>
          </EnquiryForm>
        </div>
      </Container>
    </section>
  );
}
