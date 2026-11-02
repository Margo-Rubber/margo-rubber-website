import Link from "next/link";
import type { SiteSettings } from "@/content/schemas/settings";
import { CertificationBadges } from "@/components/sections/CertificationRecord";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import type { Crumb } from "@/lib/breadcrumbs";
import { Img } from "@/components/ui/Img";
import { Container } from "@/components/ui/Section";
import { TimelineSlider } from "@/components/sections/TimelineSlider";
import { Bloom } from "@/components/ui/Bloom";
import {
  EnquiryForm,
  EnquiryStatus,
  EnquirySubmit,
} from "@/components/forms/EnquiryForm";
import { displaySize } from "@/lib/display-size";
import { SlotValue } from "@/components/ui/SlotValue";
import { InView } from "@/components/ui/InView";
import { SanityPhoto } from "@/components/ui/SanityPhoto";
import type { CmsImage } from "@/content/blocks";

/* ══ SHARED ═══════════════════════════════════════════════════════════════ */

/** Pill eyebrow with the leading dot, used by every /about section. */
export function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-eyebrow border-accent-400/35 bg-accent-400/8 text-accent-400 inline-flex items-center gap-2 rounded-pill border px-3.5 py-1.5 font-mono uppercase">
      <span aria-hidden className="bg-accent-400 size-1.5 rounded-full" />
      {children}
    </span>
  );
}

/**
 * Display heading. The design sets one line white and one accent, and closes
 * the last line with a full stop that is itself accent even on a white line.
 */
export function Display({
  lines,
  accentLines = [],
  className = "",
  as: H = "h2",
  size = "section",
}: {
  lines: readonly string[];
  accentLines?: readonly number[];
  className?: string;
  as?: "h1" | "h2";
  /** The hero runs a step larger than the section headings below it. */
  size?: "hero" | "section";
}) {
  return (
    <H
      className={`${displaySize(lines, size)} ${className}`}
    >
      {lines.map((line, i) => {
        const accent = accentLines.includes(i);
        const stop = line.endsWith(".") || line.endsWith("?");
        const text = stop ? line.slice(0, -1) : line;
        return (
          <span key={line}>
            <span className={`block ${accent ? "text-accent-400" : ""}`}>
              {text}
              {stop && (
                <span className={accent ? "" : "text-accent-400"}>
                  {line.slice(-1)}
                </span>
              )}
            </span>
            {/* Whitespace between block lines, so the H1 reads with spaces to a crawler. */}
            {i < lines.length - 1 ? " " : null}
          </span>
        );
      })}
    </H>
  );
}

type Head = {
  eyebrow: string;
  lines: readonly string[];
  accentLines?: readonly number[];
  body?: string;
  note?: string;
};

/** Centred head: pill, display, optional lede. */
function CenterHead({ head }: { head: Head }) {
  return (
    <header className="mx-auto max-w-[52rem] text-center">
      <Pill>{head.eyebrow}</Pill>
      <Display
        lines={head.lines}
        accentLines={head.accentLines}
        className="mt-7"
      />
      {head.body && (
        <p className="text-ink-3 mx-auto mt-6 max-w-[62ch] leading-relaxed">
          {head.body}
        </p>
      )}
    </header>
  );
}

/** Split head: display left, note right-aligned on the baseline. */
function SplitHead({ head, stacked = false }: { head: Head; stacked?: boolean }) {
  // stacked: the note sits under the heading instead of against the far
  // right edge — for sections whose content doesn't span the full width.
  if (stacked) {
    return (
      <header className="mb-12">
        <Pill>{head.eyebrow}</Pill>
        <Display lines={head.lines} accentLines={head.accentLines} className="mt-7" />
        {head.note && (
          <p className="text-ink-4 mt-5 max-w-[52ch] leading-relaxed">{head.note}</p>
        )}
      </header>
    );
  }
  return (
    <header className="mb-12 flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
      <div>
        <Pill>{head.eyebrow}</Pill>
        <Display
          lines={head.lines}
          accentLines={head.accentLines}
          className="mt-7"
        />
      </div>
      {head.note && (
        <p className="text-ink-4 max-w-[38ch] leading-relaxed md:text-right">
          {head.note}
        </p>
      )}
    </header>
  );
}

/**
 * Photo wrapper. Every image on this page is dimmed and dissolved into the
 * surrounding surface rather than sitting on it as a hard-edged rectangle,
 * which is what the design does throughout.
 */
function Photo({
  k,
  className = "",
  sizes,
  ratio = "aspect-[4/3]",
  dissolve = "b",
  priority = false,
  surface = "var(--color-surface-2)",
  brightness = "brightness-[0.9]",
  delay = 0,
  reveal = true,
}: {
  k: string;
  className?: string;
  sizes?: string;
  ratio?: string;
  /** Which edges fade into the surface: b bottom, y both, l left, none. */
  dissolve?: "b" | "y" | "l" | "none";
  priority?: boolean;
  /** The band colour this photo dissolves into. */
  surface?: string;
  brightness?: string;
  /** Stagger for the scroll-in reveal, in ms (collages reveal in sequence). */
  delay?: number;
  /** false: plain frame, loads and shows like any image (no scroll wipe). */
  reveal?: boolean;
}) {
  const Frame = reveal ? InView : "div";
  return (
    <Frame
      className={`${reveal ? "margo-reveal-img " : ""}relative isolate overflow-hidden ${ratio} ${className}`}
      style={reveal ? ({ "--rd": `${delay}ms` } as React.CSSProperties) : undefined}
      {...(reveal ? { threshold: 0.08 } : {})}
    >
      {/* The reveal mask goes on this wrapper — not on the frame (the
          observer watching it would never see it on screen) and not on the
          <img> (browsers won't lazy-load an image that is fully masked). */}
      <div className="margo-reveal-inner absolute inset-0">
      <Img
        k={k}
        fill
        priority={priority}
        sizes={sizes ?? "(min-width:1024px) 50vw, 100vw"}
        className={`object-cover ${brightness}`}
      />
      {dissolve !== "none" && (
        <>
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: `linear-gradient(to top, ${surface}, transparent 55%)` }}
          />
          {dissolve === "y" && (
            <div
              className="pointer-events-none absolute inset-0"
              style={{ background: `linear-gradient(to bottom, ${surface}, transparent 40%)` }}
            />
          )}
          {dissolve === "l" && (
            <div
              className="pointer-events-none absolute inset-0"
              style={{ background: `linear-gradient(to right, ${surface}, transparent 70%)` }}
            />
          )}
        </>
      )}
      </div>
    </Frame>
  );
}

/* ── icon set ─────────────────────────────────────────────────────────────
   Drawn paths, never Unicode glyphs. 24x24, 1.6 stroke, currentColor.        */
const ICONS: Record<string, React.ReactNode> = {
  target: (
    <>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
    </>
  ),
  bolt: <path d="M13.5 3 5.5 13.5H11l-.5 7.5 8-10.5H13z" />,
  shield: <path d="M12 3.2 19 6v5.6c0 4-2.9 7.4-7 9.2-4.1-1.8-7-5.2-7-9.2V6z" />,
  globe: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17M12 3.5c2.4 2.4 3.6 5.4 3.6 8.5S14.4 18.1 12 20.5c-2.4-2.4-3.6-5.4-3.6-8.5S9.6 5.9 12 3.5z" />
    </>
  ),
  leaf: (
    <>
      <path d="M20 4c0 8.5-4.6 13-11.5 13H5C5 9.6 9.9 4.6 20 4z" />
      <path d="M5 21c1.6-5 4.6-8.6 9-11" />
    </>
  ),
  users: (
    <>
      <circle cx="9.5" cy="8.5" r="3.2" />
      <path d="M3.8 19.5c.5-3.1 2.8-5 5.7-5s5.2 1.9 5.7 5" />
      <path d="M16 6.1a3.2 3.2 0 0 1 0 6.1M17.5 14.9c2.1.5 3.5 2.2 3.9 4.6" />
    </>
  ),
  trend: <path d="M4 16.5 10 10l3.5 3.5L20 6.5M20 6.5h-4.5M20 6.5V11" />,
  area: (
    <>
      <path d="M4 20V9.5l5.5 3.2V9.5L15 12.7V5h5v15z" />
      <path d="M4 20h16" />
    </>
  ),
  lab: (
    <>
      <path d="M10 3.5h4M11 3.5v6.2L5.8 18a2 2 0 0 0 1.7 3h9a2 2 0 0 0 1.7-3L13 9.7V3.5" />
      <path d="M8.4 14.5h7.2" />
    </>
  ),
  weight: (
    <>
      <path d="m12 3.2 8 4.4v8.8l-8 4.4-8-4.4V7.6z" />
      <path d="M4 7.6l8 4.4 8-4.4M12 12v8.8" />
    </>
  ),
  truck: (
    <>
      <path d="M3 7h10v9H3zM13 10.5h4l3 3V16h-7z" />
      <circle cx="7" cy="18" r="1.8" />
      <circle cx="17" cy="18" r="1.8" />
    </>
  ),
  medal: (
    <>
      <circle cx="12" cy="14.5" r="5" />
      <path d="M8.5 9.8 6 3h12l-2.5 6.8" />
      <path d="m12 12.4.9 1.9 2 .3-1.5 1.4.4 2-1.8-1-1.8 1 .4-2L9.1 14.6l2-.3z" />
    </>
  ),
  flask: (
    <>
      <path d="M9.5 3.5h5M10.5 3.5v5.8l-4.6 7.9A2.2 2.2 0 0 0 7.8 21h8.4a2.2 2.2 0 0 0 1.9-3.8l-4.6-7.9V3.5" />
      <path d="M8 15.5c1.8-1 3-.2 4.4.4 1.3.6 2.3.5 3.3-.2" />
    </>
  ),
  check: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4" />
      <path d="m8 12.2 2.8 2.8L16.4 9.4" />
    </>
  ),
  scope: (
    <>
      <circle cx="12" cy="12" r="7.5" />
      <path d="M12 2.5v3.5M12 18v3.5M2.5 12H6M18 12h3.5" />
      <circle cx="12" cy="12" r="2.2" />
    </>
  ),
  trophy: (
    <>
      <path d="M7.5 4h9v5a4.5 4.5 0 0 1-9 0z" />
      <path d="M7.5 5.5H5A2.5 2.5 0 0 0 7.5 10M16.5 5.5H19a2.5 2.5 0 0 1-2.5 4.5" />
      <path d="M12 13.5V17M8.8 20h6.4M9.8 17h4.4l1 3H8.8z" />
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

/** Accent-tinted rounded icon tile. */
function IconTile({ name }: { name: string }) {
  return (
    <span className="border-accent-400/20 bg-accent-400/10 text-accent-400 grid size-11 place-items-center rounded-xl border">
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

/* ══ 00 · HERO ════════════════════════════════════════════════════════════ */
export function AboutHero({
  badge,
  lines,
  accentLines,
  intro,
  actions,
  image,
  watchLabel,
  scrollLabel,
  breadcrumb,
}: {
  badge: string;
  lines: readonly string[];
  accentLines: readonly number[];
  intro: string;
  actions: readonly { label: string; href: string; variant: string }[];
  image: string;
  watchLabel: string;
  scrollLabel: string;
  breadcrumb?: readonly Crumb[];
}) {
  return (
    <header className="bg-surface-2 hero-offset relative isolate overflow-hidden pb-24 md:pb-36">
      {/* The plant photograph is drawn inside the Container below (see
          .hero-media): whole building, never cropped. */}
      {/* Slow light sweep across the plant photo, under the gradients. */}
      <span aria-hidden className="margo-about-hero-sweep -z-20" />
      {/* Phones: the copy sits over the whole photo, so it is shaded from
          the left, top and bottom. */}
      <div
        className="absolute inset-0 -z-10 lg:hidden"
        style={{
          background:
            "linear-gradient(to right, var(--color-surface-2) 8%, color-mix(in srgb, var(--color-surface-2) 72%, transparent) 34%, transparent 62%)",
        }}
      />
      <div
        className="absolute inset-0 -z-10 lg:hidden"
        style={{
          background:
            "linear-gradient(to top, var(--color-surface-2), transparent 26%)",
        }}
      />
      <div
        className="absolute inset-0 -z-10 lg:hidden"
        style={{
          background:
            "linear-gradient(to bottom, var(--color-surface-2), transparent 14%)",
        }}
      />

      <Container>
        <Breadcrumb items={breadcrumb} className="mb-6" />
        <div className="relative">
          <div className="max-w-[46rem]">
            {badge && <Pill>{badge}</Pill>}
            <Display
              as="h1"
              size="hero"
              lines={lines}
              accentLines={accentLines}
              className="mt-7"
            />
            <p className="text-ink-3 mt-7 max-w-[42ch] leading-relaxed">
              {intro}
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              {actions.map((a) =>
                a.variant === "primary" ? (
                  <Link
                    key={a.label}
                    href={a.href}
                    className="bg-accent-400 text-canvas hover:opacity-90 shadow-glow rounded-cta inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold transition-colors"
                  >
                    {a.label}
                    <Arrow />
                  </Link>
                ) : (
                  <Link
                    key={a.label}
                    href={a.href}
                    className="border-line-2 text-ink hover:border-accent-400/60 rounded-pill inline-flex items-center border px-6 py-3.5 text-sm font-semibold transition-colors"
                  >
                    {a.label}
                  </Link>
                ),
              )}
            </div>
          </div>

          {/* Film affordance — only while there is a label for it. Sheet 03
              §01: "there is no film, and the live control goes nowhere". */}
          {watchLabel && (
          <div className="pointer-events-none absolute top-1/2 left-1/2 hidden -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-3 lg:flex">
            <span className="border-ink/30 bg-ink/10 text-ink grid size-16 place-items-center rounded-full border backdrop-blur-sm">
              <svg viewBox="0 0 24 24" className="ml-0.5 size-5 fill-current" aria-hidden>
                <path d="M8 5.5v13l11-6.5z" />
              </svg>
            </span>
            <span className="text-eyebrow text-ink-3 font-mono uppercase">
              {watchLabel}
            </span>
          </div>
          )}
        </div>

        {/* The whole building, at the photo's own proportions. Phones and
            tablets: under the copy. Desktop: full height on the right,
            below the fixed header, fading into the surface behind the copy.
            The old full-bleed cover cut off the roof (hidden under the nav)
            and the ground. The 75% cap lets this wider-than-square frame
            stay full height down to 1024px; the copy column's own scrim
            keeps the text legible where the two overlap. */}
        <Img
          k={image}
          priority
          sizes="(min-width: 1024px) 75vw, (min-width: 768px) 40rem, 100vw"
          className="margo-about-hero-img hero-media max-lg:max-w-[40rem] brightness-[0.85] [--hero-media-max:75%]"
        />
      </Container>

      <span className="text-eyebrow text-ink-4 absolute right-6 bottom-24 hidden font-mono uppercase [writing-mode:vertical-rl] lg:block">
        {scrollLabel}
      </span>
    </header>
  );
}

/* ══ 00b · STAT STRIP ═════════════════════════════════════════════════════ */
export function HeroStats({
  stats,
}: {
  stats: readonly { value: string; label: string }[];
}) {
  return (
    <section className="bg-surface-2 pb-20 md:pb-28">
      <Container>
        <dl className="border-line rounded-card grid grid-cols-2 gap-y-10 border bg-surface-3 px-6 py-12 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col-reverse text-center">
              <dt className="text-eyebrow text-ink-4 mt-3 font-mono uppercase">
                {s.label}
              </dt>
              <dd className="text-accent-400 text-[clamp(2rem,4vw,3.25rem)] leading-none font-semibold tracking-tight">
                <SlotValue value={s.value} />
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}

/* ══ 01 · OUR STORY ═══════════════════════════════════════════════════════ */
export function Story({
  head,
  paragraphs,
  checks,
  image,
  cta,
}: {
  head: Head;
  paragraphs: readonly string[];
  checks: readonly string[];
  image: string;
  cta: { label: string; href: string };
}) {
  return (
    <section
      // Not id="story": content extractors (trafilatura, readability) take an
      // element with that id as the whole article and drop the rest of the
      // page — 156 of ~1,681 words kept (D5, 21 Oct 2026).
      id="company-history"
      className="bg-surface-2 relative isolate overflow-hidden py-[70px]"
    >
      <Bloom className="top-0 -left-32 size-[34rem]" />
      <Container>
        {/* Photo column is the wider one, aligned to the top of the copy and
            reaching a little past the container's left edge on wide screens
            (kept small, so the frame is never cut at the window edge). */}
        <div className="grid items-start gap-14 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          <div className="rounded-card border-line overflow-hidden border xl:-ml-8">
            <Photo
              k={image}
              ratio="aspect-[4/3.4]"
              dissolve="none"
              sizes="(min-width:1024px) 54vw, 90vw"
            />
          </div>

          <div>
            <Pill>{head.eyebrow}</Pill>
            <Display
              lines={head.lines}
              accentLines={head.accentLines}
              className="mt-7"
            />
            {/* The site's body face; the first paragraph leads a shade
                brighter and a step up. */}
            {paragraphs.map((p, i) => (
              <p
                key={p.slice(0, 24)}
                className={
                  i === 0
                    ? "text-ink-2 mt-7 text-lg leading-relaxed"
                    : "text-ink-3 mt-5 leading-relaxed"
                }
              >
                {p}
              </p>
            ))}
            {/* The one place the old domain is named as a website (D9): buyers
                and crawlers that knew the old site can match the two. */}
            <p className="text-ink-4 mt-5 text-sm">This website was formerly margorubber.in.</p>
          </div>
        </div>

        {/* Checks and the link run centred across the section, under both
            the photo and the copy. */}
        <ul className="border-line mt-14 grid gap-6 border-t pt-10 md:grid-cols-3">
          {checks.map((c) => (
            <li key={c} className="text-ink-2 flex flex-col items-center gap-3 text-center text-sm">
              <Check className="text-accent-400 size-5 shrink-0" />
              <span className="max-w-[40ch]">{c}</span>
            </li>
          ))}
        </ul>

        <p className="mt-10 text-center">
          <Link
            href={cta.href}
            className="text-accent-400 hover:opacity-80 inline-flex items-center gap-2 text-sm font-semibold transition-colors"
          >
            {cta.label}
            <Arrow />
          </Link>
        </p>
      </Container>
    </section>
  );
}

/* ══ 02 · VISION & MISSION ════════════════════════════════════════════════ */
export function Vision({
  head,
  watermark,
  items,
}: {
  head: Head;
  watermark: string;
  items: readonly {
    icon: string;
    eyebrow: string;
    title: string;
    body: string;
    footIcon: string;
    foot: string;
    footHref?: string;
  }[];
}) {
  return (
    <section className="relative isolate overflow-hidden bg-band-2 py-[70px]">
      <span
        aria-hidden
        className="text-ink pointer-events-none absolute -top-6 right-4 -z-10 text-[13rem] leading-none font-bold opacity-[0.03] select-none md:right-24 md:text-[17rem]"
      >
        {watermark}
      </span>

      <Container>
        <CenterHead head={head} />

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {items.map((it) => (
            <div
              key={it.eyebrow}
              className="rounded-card border-line relative isolate overflow-hidden border bg-surface-3 p-8 md:p-10"
            >
              {/* Each card carries its own soft accent bloom, as the design does. */}
              <span
                aria-hidden
                className="bg-accent-400/10 pointer-events-none absolute -top-24 -right-16 -z-10 size-64 rounded-full blur-3xl"
              />
              <IconTile name={it.icon} />
              <p className="text-eyebrow text-accent-400 mt-7 font-mono uppercase">
                {it.eyebrow}
              </p>
              <h3 className="text-ink mt-3 text-xl leading-snug font-semibold md:text-2xl">
                {it.title}
              </h3>
              <p className="text-ink-3 mt-4 leading-relaxed">{it.body}</p>
              <div className="border-line mt-8 border-t pt-5">
                <p className="text-accent-400 flex items-center gap-2.5 text-sm font-medium">
                  <Icon name={it.footIcon} className="size-4" />
                  {it.footHref ? (
                    <Link href={it.footHref} className="hover:opacity-80">
                      {it.foot} <span aria-hidden>→</span>
                    </Link>
                  ) : (
                    it.foot
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ══ 03 · CORE VALUES ═════════════════════════════════════════════════════ */
export function Values({
  head,
  items,
}: {
  head: Head;
  items: readonly { icon: string; name: string; body: string }[];
}) {
  return (
    <section className="bg-surface-2 relative isolate overflow-hidden py-[70px]">
      <Bloom className="-top-32 right-0 size-[34rem]" />
      <Container>
        <SplitHead head={head} />

        <InView
          as="ol"
          spotlight
          threshold={0.15}
          className="margo-values grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {items.map((v, i) => (
            <li
              key={v.name}
              data-spot
              style={{ "--i": i } as React.CSSProperties}
              className="margo-value rounded-card relative isolate overflow-hidden border bg-surface-3 p-7"
            >
              <span aria-hidden className="margo-value-spot" />
              <span className="margo-value-num text-eyebrow absolute top-6 right-6 font-mono">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="margo-value-icon block w-fit">
                <IconTile name={v.icon} />
              </span>
              <h3 className="margo-value-title text-ink mt-6 text-base font-semibold">
                {v.name}
              </h3>
              <p className="text-ink-4 mt-2.5 text-sm leading-relaxed">
                {v.body}
              </p>
            </li>
          ))}
        </InView>
      </Container>
    </section>
  );
}

/* ══ 04 · LEADERSHIP MESSAGE ══════════════════════════════════════════════ */
export function Leadership({
  eyebrow,
  image,
  quoteLines,
  quoteAccent,
  body,
  person,
}: {
  eyebrow: string;
  image: string;
  quoteLines: readonly string[];
  quoteAccent: string;
  body: string;
  person: { initials: string; name: string; role: string };
}) {
  return (
    <section className="bg-surface-2 grid items-stretch gap-0 lg:grid-cols-2">
      {/* The founder's portrait, shown whole and as photographed (25 Oct
          2026): no gradients, no side fill — object-contain so the full
          figure, head to shoes, survives any screen width or browser zoom.
          Where the column is wider than the portrait, the section's own
          dark surface shows either side. */}
      <div className="relative isolate min-h-[480px] overflow-hidden lg:min-h-[620px]">
        <Img
          k={image}
          fill
          sizes="(min-width:1024px) 50vw, 100vw"
          className="object-contain"
        />
      </div>

      <div className="flex items-center px-6 py-[70px] lg:pr-16 lg:pl-14">
        <div className="max-w-[52ch]">
          <Pill>{eyebrow}</Pill>

          <svg
            viewBox="0 0 24 24"
            className="text-accent-400/35 mt-8 size-9 fill-current"
            aria-hidden
          >
            <path d="M9.5 5.5C6.4 7 4.6 9.6 4.6 12.9c0 2.9 1.8 4.9 4.2 4.9 2.1 0 3.7-1.5 3.7-3.5 0-1.9-1.4-3.4-3.3-3.4-.4 0-.8.1-1 .2.4-1.6 1.7-3 3.5-3.9zm9.4 0c-3.1 1.5-4.9 4.1-4.9 7.4 0 2.9 1.8 4.9 4.2 4.9 2.1 0 3.7-1.5 3.7-3.5 0-1.9-1.4-3.4-3.3-3.4-.4 0-.8.1-1 .2.4-1.6 1.7-3 3.5-3.9z" />
          </svg>

          <blockquote className="text-ink mt-6 text-[clamp(1.4rem,2.4vw,2rem)] leading-[1.28] font-semibold tracking-tight">
            <p>
              {quoteLines.map((l, i) => (
                <span key={l} className="block">
                  {i === 0 ? `“${l}` : l}
                  {/* No space before the closing quote when there is no accent run. */}
                  {i < quoteLines.length - 1 || quoteAccent ? " " : ""}
                  {i === quoteLines.length - 1 && (
                    <span className="text-accent-400">
                      {quoteAccent}
                      <span className="text-ink">{"”"}</span>
                    </span>
                  )}
                </span>
              ))}
            </p>
          </blockquote>

          <p className="text-ink-3 mt-7 leading-relaxed">{body}</p>

          <figcaption className="mt-9 flex items-center gap-4">
            <span className="border-accent-400/25 bg-accent-400/10 text-accent-400 grid size-11 place-items-center rounded-full border text-sm font-semibold">
              {person.initials}
            </span>
            <span>
              <span className="text-ink block text-sm font-semibold">
                {person.name}
              </span>
              <span className="text-accent-400 block text-sm">
                {person.role}
              </span>
            </span>
          </figcaption>
        </div>
      </div>
    </section>
  );
}

/* ══ 05 · MANUFACTURING EXCELLENCE ════════════════════════════════════════ */
export function Manufacturing({
  head,
  image,
  stats,
  portfolioLabel,
  portfolio,
  equipmentLabel,
  equipment = [],
}: {
  head: Head;
  image: string;
  stats: readonly { icon: string; value: string; label: string }[];
  portfolioLabel: string;
  portfolio: readonly { label: string; href: string }[];
  equipmentLabel?: string;
  equipment?: readonly string[];
}) {
  return (
    <section
      id="manufacturing"
      className="relative isolate overflow-hidden bg-band-2 py-[70px]"
    >
      <span
        aria-hidden
        className="bg-accent-400/8 pointer-events-none absolute -top-40 left-1/2 -z-10 size-[36rem] -translate-x-1/2 rounded-full blur-3xl"
      />
      <Container>
        <CenterHead head={head} />

        {/* Photo and stat cards side by side; the photo matches the stack's height. */}
        <div className="mt-14 grid gap-5 lg:grid-cols-[1.55fr_1fr]">
          <div className="rounded-card border-line overflow-hidden border">
            <Photo
              k={image}
              ratio="aspect-[16/10] lg:aspect-auto lg:h-full"
              dissolve="none"
              sizes="(min-width:1024px) 60vw, 100vw"
            />
          </div>

          <dl className="grid gap-5 md:grid-cols-3 lg:min-h-[24rem] lg:auto-rows-fr lg:grid-cols-1">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-card border-line flex items-center gap-4 border bg-surface-3 p-6"
              >
                <IconTile name={s.icon} />
                <div className="flex flex-col-reverse">
                  <dt className="text-ink-4 mt-0.5 text-sm">{s.label}</dt>
                  <dd className="text-ink text-lg font-semibold"><SlotValue value={s.value} /></dd>
                </div>
              </div>
            ))}
          </dl>
        </div>

        <div className="mt-14">
          <p className="text-eyebrow text-ink-4 font-mono uppercase">
            {portfolioLabel}
          </p>
          <ul className="mt-5 flex flex-wrap gap-3">
            {portfolio.map((p) => (
              <li key={p.label}>
                <Link
                  href={p.href}
                  className="border-line-2 text-ink-2 hover:border-accent-400/60 hover:text-ink rounded-pill inline-flex border px-5 py-2.5 text-sm transition-colors"
                >
                  {p.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {equipment.length > 0 && (
          <div className="mt-12">
            <p className="text-eyebrow text-ink-4 font-mono uppercase">
              {equipmentLabel ?? "On the floor"}
            </p>
            <ul className="mt-5 grid gap-x-10 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
              {equipment.map((e) => (
                <li key={e} className="text-ink-2 flex gap-3 text-sm">
                  <span aria-hidden className="bg-accent-400 mt-2 size-1.5 shrink-0 rounded-full" />
                  {e}
                </li>
              ))}
            </ul>
          </div>
        )}
      </Container>
    </section>
  );
}

/* ══ 06 · OUR TEAM ════════════════════════════════════════════════════════ */
export function Team({
  head,
  members,
  stats,
}: {
  head: Head;
  members: readonly { name: string; role: string; image: string; body?: string }[];
  stats: readonly { value: string; label: string }[];
}) {
  return (
    <section className="bg-surface-2 relative isolate overflow-hidden py-[70px]">
      <Bloom className="top-1/4 -left-40 size-[32rem]" />
      <Container>
        {/* Two founders: heading and stats on the left, the portraits on
            the right, so the row doesn't sit half empty. */}
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] lg:items-start">
        <div>
          <SplitHead head={head} stacked />

          {/* A stat whose value is empty is a question Margo has not answered
              yet (the headcount) — it is left out rather than shown blank. */}
          <dl className="grid gap-5 md:grid-cols-3 lg:grid-cols-1">
            {stats.filter((s) => s.value.trim()).map((s) => (
              <div
                key={s.label}
                className="margo-glow-stat flex flex-col-reverse rounded-card border-line relative isolate overflow-hidden border bg-surface-3 py-8 text-center"
              >
                <dt className="text-eyebrow text-ink-4 mt-2 font-mono uppercase">
                  {s.label}
                </dt>
                <dd className="margo-glow-num text-2xl font-semibold">
                  <SlotValue value={s.value} />
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <ul className="grid gap-5 sm:grid-cols-2">
          {members.map((m) => (
            <li
              key={m.name}
              className="margo-founder rounded-card border-line overflow-hidden border bg-surface-3"
            >
              {/* Full-length portrait, no fade (25 Oct 2026): the founders
                  are shown head to shoes. 3:4 matches the uploaded portraits
                  (1086×1334, 1053×1436) closely, and object-bottom anchors
                  any trim to the top so the feet are never cut. */}
              <div className="margo-founder-photo relative isolate">
                <Photo
                  k={m.image}
                  ratio="aspect-[3/4]"
                  dissolve="none"
                  sizes="(min-width:1024px) 28vw, 50vw"
                  reveal={false}
                  brightness="object-bottom"
                />
              </div>
              <div className="margo-founder-caption p-5">
                <p className="text-ink text-sm font-semibold">{m.name}</p>
                <p className="text-accent-400 mt-1 text-sm">{m.role}</p>
                {m.body && <p className="text-ink-4 mt-2 text-sm leading-relaxed">{m.body}</p>}
              </div>
            </li>
          ))}
        </ul>
        </div>
      </Container>
    </section>
  );
}

/* ── Markets: priority lanes as a transit board, the rest as a pipeline ──
   Data shape is unchanged (flag, name, tier, note), so the CMS needs nothing.
   · Flags render as ISO code plates, not emoji: Windows has no flag emoji
     and was showing bare "AU" / "GB" letters in a misaligned column.
   · A note like "Melbourne 18–22 d" is split into port + transit days and
     drawn as a bar scaled to the longest lane. Anything else in the note
     (e.g. just "Dammam") shows as the port with transit "on request".   */
function isoFromFlag(flag: string, name: string) {
  const letters = [...flag]
    .map((ch) => ch.codePointAt(0) ?? 0)
    .filter((cp) => cp >= 0x1f1e6 && cp <= 0x1f1ff)
    .map((cp) => String.fromCharCode(cp - 0x1f1e6 + 65))
    .join("");
  return letters.length === 2 ? letters : name.slice(0, 2).toUpperCase();
}

function parseLane(note?: string) {
  if (!note) return { port: "", min: 0, max: 0 };
  const m = note.match(/^(.*?)\s*(\d+)\s*[–-]\s*(\d+)\s*d(?:ays?)?\.?$/i);
  if (m) return { port: m[1].trim(), min: Number(m[2]), max: Number(m[3]) };
  const single = note.match(/^(.*?)\s*(\d+)\s*d(?:ays?)?\.?$/i);
  if (single) return { port: single[1].trim(), min: Number(single[2]), max: Number(single[2]) };
  return { port: note.trim(), min: 0, max: 0 };
}

function MarketLanes({
  countries,
}: {
  countries: readonly { flag: string; name: string; tier?: 1 | 2; note?: string }[];
}) {
  const lanes = countries.filter((c) => c.tier !== 2);
  const pipeline = countries.filter((c) => c.tier === 2);
  const parsed = lanes.map((c) => ({ ...c, ...parseLane(c.note) }));
  const longest = Math.max(1, ...parsed.map((l) => l.max));

  return (
    <InView threshold={0.2} className="margo-lanes mt-14">
      {lanes.length > 0 && (
        <>
          <p className="text-eyebrow text-ink-4 flex items-center gap-3 font-mono uppercase">
            <span className="bg-accent-400 size-1.5 rounded-full" aria-hidden />
            Priority lanes
            <span className="text-accent-400">{String(lanes.length).padStart(2, "0")}</span>
            <span className="margo-lanes-meta text-ink-4 ml-auto">Port · transit</span>
          </p>
          <ol className="margo-lane-grid mt-4">
            {parsed.map((l, i) => (
              <li
                key={l.name}
                style={{ "--i": i, "--w": l.max ? l.max / longest : 0, "--w0": l.max ? l.min / longest : 0 } as React.CSSProperties}
                className="margo-lane border-line rounded-card border bg-surface-3/60 p-5"
              >
                <span className="margo-iso" aria-hidden>
                  {isoFromFlag(l.flag, l.name)}
                </span>
                <span className="margo-lane-name min-w-0">
                  <span className="text-ink block truncate text-sm font-semibold">{l.name}</span>
                  {l.port && (
                    <span className="text-ink-4 block truncate font-mono text-[11px] tracking-wide uppercase">
                      {l.port}
                    </span>
                  )}
                </span>
                <span
                  className={`margo-lane-days text-right font-mono text-xs whitespace-nowrap ${
                    l.max ? "text-accent-400" : "text-ink-4"
                  }`}
                >
                  {l.max ? `${l.min === l.max ? l.max : `${l.min}–${l.max}`} days` : ""}
                </span>
                <span
                  aria-hidden
                  className={`margo-lane-trackcell ${l.max ? "margo-lane-track" : "margo-lane-track--empty"}`}
                >
                  {l.max > 0 && <span className="margo-lane-bar" />}
                </span>
              </li>
            ))}
          </ol>
        </>
      )}

      {pipeline.length > 0 && (
        <>
          <p className="text-eyebrow text-ink-4 mt-8 flex items-center gap-3 font-mono uppercase">
            <span className="margo-dot-hollow size-1.5 rounded-full border" aria-hidden />
            Further markets
            <span className="text-ink-3">{String(pipeline.length).padStart(2, "0")}</span>
          </p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {pipeline.map((c, i) => (
              <li
                key={c.name}
                style={{ "--i": i } as React.CSSProperties}
                className="margo-market-chip border-line text-ink-3 inline-flex items-center gap-2 rounded-pill border py-1.5 text-sm"
              >
                <span className="margo-iso margo-iso--sm" aria-hidden>
                  {isoFromFlag(c.flag, c.name)}
                </span>
                {c.name}
              </li>
            ))}
          </ul>
        </>
      )}
    </InView>
  );
}

/* ══ 07 · GLOBAL PRESENCE ═════════════════════════════════════════════════ */
export function Presence({
  head,
  image,
  countries,
  link,
}: {
  head: Head;
  image: string;
  countries: readonly { flag: string; name: string; tier?: 1 | 2; note?: string }[];
  link?: { label: string; href: string };
}) {
  return (
    <section className="bg-band-2 py-[70px]">
      <Container>
        <div className="grid gap-14 lg:grid-cols-2">
          <div>
            <Pill>{head.eyebrow}</Pill>
            <Display
              lines={head.lines}
              accentLines={head.accentLines}
              className="mt-7"
            />
            {head.body && (
              <p className="text-ink-3 mt-6 max-w-[46ch] leading-relaxed">
                {head.body}
              </p>
            )}
            {link?.label && link.href && (
              <p className="mt-6">
                <Link href={link.href} className="text-accent-400 text-sm font-medium hover:opacity-80">
                  {link.label} <span aria-hidden>→</span>
                </Link>
              </p>
            )}
          </div>

          {/* Stretches to the height of the copy beside it on desktop. */}
          <div className="rounded-card border-line overflow-hidden border">
            <Photo
              k={image}
              ratio="aspect-[4/3] lg:aspect-auto lg:h-full"
              dissolve="none"
              sizes="(min-width:1024px) 46vw, 100vw"
            />
          </div>
        </div>

        <MarketLanes countries={countries} />
      </Container>
    </section>
  );
}

/* ══ 08 · CERTIFICATIONS & AWARDS ═════════════════════════════════════════ */

export function Awards({
  head,
  certifications,
  auditedLabel,
  auditImage,
}: {
  head: Head;
  certifications: SiteSettings["certifications"];
  auditedLabel: string;
  auditImage: string;
}) {
  // About shows only what is held (ISO 9001:2015); the in-progress
  // programmes stay on the products hub and the certifications page.
  const held = certifications.items.filter((c) => c.standing === "held");
  // The auditor band names the bodies that actually issued something — the
  // issuers of held rows — rather than a typed list of registrars.
  const auditors = [
    ...new Set(held.filter((c) => c.issuer).map((c) => c.issuer as string)),
  ];
  return (
    <section className="bg-surface-2 relative isolate overflow-hidden py-[70px]">
      <Bloom className="-top-24 left-1/2 size-[38rem] -translate-x-1/2" />
      <Container>
        <CenterHead head={head} />

        <div className="mt-14">
          <CertificationBadges
            items={held}
            scopeNote={certifications.scopeNote}
            compact
          />
        </div>
      </Container>

      {/* Auditor band: photo dimmed almost to black and dissolved top and bottom. */}
      <div className="relative isolate mt-14 overflow-hidden py-14">
        <Img
          k={auditImage}
          fill
          sizes="100vw"
          className="-z-20 object-cover brightness-[0.35] saturate-[0.6]"
        />
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              "linear-gradient(to bottom, var(--color-surface-2), color-mix(in srgb, var(--color-surface-2) 55%, transparent) 50%, var(--color-surface-2))",
          }}
        />
        <Container>
          <p className="text-eyebrow text-ink-4 text-center font-mono uppercase">
            {auditedLabel}
          </p>
          <ul className="mt-5 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {auditors.map((a) => (
              <li key={a} className="text-ink-2 text-sm font-semibold">
                {a}
              </li>
            ))}
          </ul>
        </Container>
      </div>
    </section>
  );
}

/* ══ 09 · GREEN MANUFACTURING ═════════════════════════════════════════════ */
export function Green({
  head,
  image,
  imageBadge,
  bars,
}: {
  head: Head;
  image: string;
  imageBadge: { title: string; note: string };
  bars: readonly { label: string; note: string; pct: number }[];
}) {
  return (
    <section className="bg-band-2 py-[70px]">
      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <figure className="rounded-card border-line relative isolate overflow-hidden border">
            <Photo
              k={image}
              ratio="aspect-[4/3.6]"
              dissolve="none"
              surface="var(--color-band-2)"
              sizes="(min-width:1024px) 46vw, 100vw"
            />
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, var(--color-band-2), transparent 50%)",
              }}
            />
            {/* "Carbon Neutral · Target: 2027" came off (sheet 03 §11); no badge, no card. */}
            {imageBadge.title && (
              <figcaption className="border-line bg-surface-3/80 absolute right-5 bottom-5 left-5 flex items-center gap-3 rounded-xl border px-5 py-4 backdrop-blur">
                <Icon name="leaf" className="text-accent-400 size-5 shrink-0" />
                <span>
                  <span className="text-ink block text-sm font-semibold">
                    {imageBadge.title}
                  </span>
                  <span className="text-ink-4 block text-xs">
                    {imageBadge.note}
                  </span>
                </span>
              </figcaption>
            )}
          </figure>

          <div>
            <Pill>{head.eyebrow}</Pill>
            <Display
              lines={head.lines}
              accentLines={head.accentLines}
              className="mt-7"
            />
            {head.body && (
              <p className="text-ink-3 mt-6 leading-relaxed">{head.body}</p>
            )}

            <ul className="mt-10 space-y-7">
              {bars.map((b) => (
                <li key={b.label}>
                  <div className="flex items-baseline justify-between gap-4">
                    <p className="text-ink text-sm font-medium">{b.label}</p>
                    <p className="text-accent-400 text-sm font-semibold">
                      {b.pct}%
                    </p>
                  </div>
                  <div
                    role="img"
                    aria-label={`${b.label}: ${b.pct} percent`}
                    className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-surface-4"
                  >
                    <div
                      className="bg-accent-400 h-full rounded-full"
                      style={{ width: `${b.pct}%` }}
                    />
                  </div>
                  {b.note && <p className="text-ink-4 mt-2 text-xs">{b.note}</p>}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ══ 10 · THE NUMBERS ═════════════════════════════════════════════════════ */
export function Numbers({
  head,
  stats,
  testimonial,
  references,
}: {
  head: Head;
  stats: readonly { value: string; label: string; note: string }[];
  references?: { eyebrow: string; body: string };
  testimonial: {
    stars: number;
    quote: string;
    initials: string;
    name: string;
    role: string;
  };
}) {
  return (
    <section className="bg-surface-2 relative isolate overflow-hidden py-[70px]">
      <Bloom className="-top-20 left-1/2 size-[36rem] -translate-x-1/2" />
      <Container>
        <CenterHead head={head} />

        <dl className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-card border-line flex flex-col border bg-surface-3 px-6 py-8 text-center"
            >
              <dt className="text-ink order-2 mt-2 text-sm font-medium">{s.label}</dt>
              <dd className="text-accent-400 order-1 text-2xl font-semibold">
                <SlotValue value={s.value} />
              </dd>
              <dd className="text-ink-4 order-3 mt-1 text-xs">{s.note}</dd>
            </div>
          ))}
        </dl>

        {references?.body ? (
          <div className="rounded-card border-line mt-5 border bg-surface-3 p-8 md:p-12">
            <p className="text-eyebrow text-accent-400 font-mono uppercase">{references.eyebrow}</p>
            <p className="text-ink mt-4 max-w-[62ch] text-[clamp(1.1rem,1.9vw,1.5rem)] leading-[1.45] font-medium">
              {references.body}
            </p>
          </div>
        ) : (
        <figure className="rounded-card border-line relative isolate mt-5 overflow-hidden border bg-surface-3 p-8 md:p-12">
          <svg
            viewBox="0 0 24 24"
            className="text-ink pointer-events-none absolute top-8 right-8 -z-10 size-24 fill-current opacity-[0.045]"
            aria-hidden
          >
            <path d="M9.5 5.5C6.4 7 4.6 9.6 4.6 12.9c0 2.9 1.8 4.9 4.2 4.9 2.1 0 3.7-1.5 3.7-3.5 0-1.9-1.4-3.4-3.3-3.4-.4 0-.8.1-1 .2.4-1.6 1.7-3 3.5-3.9zm9.4 0c-3.1 1.5-4.9 4.1-4.9 7.4 0 2.9 1.8 4.9 4.2 4.9 2.1 0 3.7-1.5 3.7-3.5 0-1.9-1.4-3.4-3.3-3.4-.4 0-.8.1-1 .2.4-1.6 1.7-3 3.5-3.9z" />
          </svg>

          <div
            className="text-accent-400 flex gap-1"
            role="img"
            aria-label={`${testimonial.stars} out of 5`}
          >
            {Array.from({ length: testimonial.stars }, (_, i) => (
              <svg
                key={i}
                viewBox="0 0 24 24"
                className="size-4 fill-current"
                aria-hidden
              >
                <path d="m12 3.5 2.6 5.6 6 .8-4.4 4.2 1.1 6L12 17.2 6.7 20.1l1.1-6-4.4-4.2 6-.8z" />
              </svg>
            ))}
          </div>

          <blockquote className="text-ink mt-6 max-w-[62ch] text-[clamp(1.1rem,1.9vw,1.5rem)] leading-[1.45] font-medium">
            <p>{`“${testimonial.quote}”`}</p>
          </blockquote>

          <figcaption className="mt-8 flex items-center gap-4">
            <span className="border-accent-400/25 bg-accent-400/10 text-accent-400 grid size-10 place-items-center rounded-full border text-xs font-semibold">
              {testimonial.initials.trim() || (
                <Icon name="users" className="size-4" />
              )}
            </span>
            <span>
              <span className="text-ink block text-sm font-semibold">
                {testimonial.name}
              </span>
              <span className="text-accent-400 block text-sm">
                {testimonial.role}
              </span>
            </span>
          </figcaption>
        </figure>
        )}
      </Container>
    </section>
  );
}

/* ══ 11 · COMPANY TIMELINE ════════════════════════════════════════════════ */
export function Timeline({
  head,
  items,
}: {
  head: Head;
  items: readonly { year: string; title: string; body: string }[];
}) {
  return (
    <section className="bg-band-2 relative isolate overflow-hidden py-[70px]">
      <Bloom className="-top-24 left-1/2 size-[36rem] -translate-x-1/2" />
      <Container>
        <CenterHead head={head} />
        <div className="mt-12">
          <TimelineSlider items={items} />
        </div>
      </Container>
    </section>
  );
}

/* ══ 12 · CLIENT WALL ═════════════════════════════════════════════════════ */
export function Clients({
  label,
  items,
  trademarkLine,
}: {
  label: string;
  /** Name, sector (sheet 03 §14) and logo, one entry per client. */
  items: readonly { name: string; sector?: string; logo?: CmsImage }[];
  /** From Site settings — beneath every customer list. */
  trademarkLine?: string;
}) {
  return (
    <section className="bg-surface-2 py-[70px]">
      <Container>
        <p className="text-eyebrow text-ink-4 text-center font-mono uppercase">
          {label}
        </p>
        <ul className="mt-8 grid grid-cols-2 gap-5 md:grid-cols-4">
          {items.map((c) => (
            <li
              key={c.name}
              className="rounded-card border-line text-ink-2 flex flex-col items-center justify-center border bg-surface-3 px-4 py-8 text-center text-sm font-semibold"
            >
              {/* On a white plate: most brand marks are drawn for a light
                  background and disappear on the dark card. */}
              {/* Until a logo is uploaded the plate carries the name as a
                  plain wordmark, so every card in the grid has the same
                  shape (client, 2 Nov 2026: all 24 accounts listed). */}
              <span className="mb-4 flex h-24 w-full max-w-[240px] items-center justify-center rounded-lg bg-white px-3 py-2">
                {c.logo?.asset ? (
                  <SanityPhoto
                    image={c.logo}
                    fallbackAlt={`${c.name} logo`}
                    sizes="240px"
                    fit="contain"
                    className="h-full max-h-20 w-auto max-w-full"
                  />
                ) : (
                  <span aria-hidden className="text-base leading-tight font-bold text-[#1f2933]">
                    {c.name}
                  </span>
                )}
              </span>
              <span>
                {c.name}
                {c.sector && <span className="text-ink-4 mt-1.5 block text-xs font-normal">{c.sector}</span>}
              </span>
            </li>
          ))}
        </ul>
        {trademarkLine && (
          <p className="text-ink-4 mx-auto mt-6 max-w-[70ch] text-center text-xs leading-relaxed">{trademarkLine}</p>
        )}
      </Container>
    </section>
  );
}

/* ══ 13 · CLOSING CTA ═════════════════════════════════════════════════════ */
export function Closing({
  eyebrow,
  lines,
  accentLines,
  body,
  image,
  placeholder,
  submitLabel,
  assurances,
}: {
  eyebrow: string;
  lines: readonly string[];
  accentLines: readonly number[];
  body: string;
  image: string;
  placeholder: string;
  submitLabel: string;
  assurances: readonly string[];
}) {
  return (
    <section className="bg-surface-2 relative isolate overflow-hidden py-[70px]">
      <Img
        k={image}
        fill
        sizes="100vw"
        className="-z-20 object-cover brightness-[0.6]"
      />
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(to bottom, var(--color-surface-2), color-mix(in srgb, var(--color-surface-2) 62%, transparent) 48%, var(--color-surface-2))",
        }}
      />
      <span
        aria-hidden
        className="bg-accent-400/8 pointer-events-none absolute bottom-0 left-1/2 -z-10 size-[34rem] -translate-x-1/2 translate-y-1/3 rounded-full blur-3xl"
      />

      <Container>
        <div className="mx-auto max-w-[46ch] text-center">
          <Pill>{eyebrow}</Pill>
          <Display lines={lines} accentLines={accentLines} className="mt-7" />
          <p className="text-ink-3 mx-auto mt-6 max-w-[52ch] leading-relaxed">
            {body}
          </p>

          <EnquiryForm
            source="about"
            className="margo-form-wrap mx-auto mt-9 flex max-w-[34rem] flex-col gap-3 sm:flex-row"
          >
            <label htmlFor="cta-email" className="sr-only">
              {placeholder}
            </label>
            <input
              id="cta-email"
              name="email"
              type="email"
              required
              placeholder={placeholder}
              className="text-ink placeholder:text-ink-4 focus:border-accent-400 rounded-pill min-w-0 flex-1 border border-line-2 bg-surface-4/85 px-6 py-3.5 text-sm backdrop-blur"
            />
            <EnquirySubmit className="bg-accent-400 text-canvas hover:opacity-90 shadow-glow rounded-cta inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-semibold transition-colors">
              {submitLabel}
              <Arrow />
            </EnquirySubmit>
            <EnquiryStatus />
          </EnquiryForm>

          <ul className="mt-7 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {assurances.map((a) => (
              <li
                key={a}
                className="text-ink-3 flex items-center gap-2 text-sm"
              >
                <Check className="text-accent-400 size-4" />
                {a}
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
