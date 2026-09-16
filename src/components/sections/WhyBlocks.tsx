import Link from "next/link";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import type { Crumb } from "@/lib/breadcrumbs";
import { Img } from "@/components/ui/Img";
import { Container } from "@/components/ui/Section";
import {
  MaterialSelector,
  type Material,
} from "@/components/sections/MaterialSelector";
import {
  EnquiryForm,
  EnquiryStatus,
  EnquirySubmit,
} from "@/components/forms/EnquiryForm";

/* ══ SHARED ═══════════════════════════════════════════════════════════════ */

/** Plain accent eyebrow. This page uses no rule and no pill. */
function Eyebrow({
  children,
  center = false,
}: {
  children: React.ReactNode;
  center?: boolean;
}) {
  return (
    <p
      className={`text-eyebrow text-accent-400 font-mono uppercase ${
        center ? "text-center" : ""
      }`}
    >
      {children}
    </p>
  );
}

/** Display heading. Accent is marked inline with `*asterisks*`. */
function Marked({
  lines,
  as: H = "h2",
  size = "section",
  className = "",
}: {
  lines: readonly string[];
  as?: "h1" | "h2";
  size?: "hero" | "section" | "column";
  className?: string;
}) {
  const scale =
    size === "hero"
      ? "text-display"
      : size === "column"
        ? "text-display-3"
        : "text-display-2";
  return (
    <H className={`${scale} ${className}`}>
      {lines.map((line, li) => (
        // The space after each block line is invisible but load-bearing: without
        // it a crawler reads the stacked H1 as one run-together word.
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

type Head = {
  eyebrow: string;
  lines: readonly string[];
  body?: string;
};

function LeftHead({ head, className = "" }: { head: Head; className?: string }) {
  return (
    <header className={className}>
      <Eyebrow>{head.eyebrow}</Eyebrow>
      <Marked lines={head.lines} size="column" className="mt-5" />
      {head.body && (
        <p className="text-ink-3 mt-6 max-w-[62ch] leading-relaxed">
          {head.body}
        </p>
      )}
    </header>
  );
}

function CenterHead({ head }: { head: Head }) {
  return (
    <header className="mx-auto max-w-[52rem] text-center">
      <Eyebrow center>{head.eyebrow}</Eyebrow>
      <Marked lines={head.lines} className="mt-5" />
      {head.body && (
        <p className="text-ink-3 mx-auto mt-6 max-w-[58ch] leading-relaxed">
          {head.body}
        </p>
      )}
    </header>
  );
}

/** Photo that dims and dissolves into the band it sits on. */
function Photo({
  k,
  ratio = "aspect-[3/2]",
  sizes,
  surface = "var(--color-canvas)",
  dissolve = true,
  brightness = "brightness-[0.9]",
  className = "",
}: {
  k: string;
  ratio?: string;
  sizes?: string;
  surface?: string;
  dissolve?: boolean;
  brightness?: string;
  className?: string;
}) {
  return (
    <div className={`relative isolate overflow-hidden ${ratio} ${className}`}>
      <Img
        k={k}
        fill
        sizes={sizes ?? "(min-width:1024px) 50vw, 100vw"}
        className={`object-cover ${brightness}`}
      />
      {dissolve && (
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

function Bloom({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`bg-accent-400/10 pointer-events-none absolute -z-10 rounded-full blur-3xl ${className}`}
    />
  );
}

/* ── icons ──────────────────────────────────────────────────────────────── */
const ICONS: Record<string, React.ReactNode> = {
  gear: (
    <>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 2.8v2.4M12 18.8v2.4M21.2 12h-2.4M5.2 12H2.8M18.5 5.5l-1.7 1.7M7.2 16.8l-1.7 1.7M18.5 18.5l-1.7-1.7M7.2 7.2 5.5 5.5" />
    </>
  ),
  layers: (
    <>
      <path d="m12 3.5 8.5 4.3-8.5 4.3-8.5-4.3z" />
      <path d="m3.5 12.2 8.5 4.3 8.5-4.3M3.5 16.4l8.5 4.3 8.5-4.3" />
    </>
  ),
  swap: <path d="M4 8.5h13m-3.5-3.5 3.5 3.5-3.5 3.5M20 15.5H7m3.5-3.5L7 15.5l3.5 3.5" />,
  extrude: (
    <>
      <path d="M4 6.5h5.5a3 3 0 0 1 3 3v5a3 3 0 0 0 3 3H20" />
      <circle cx="4" cy="6.5" r="1.6" />
      <circle cx="20" cy="17.5" r="1.6" />
    </>
  ),
  robot: (
    <>
      <rect x="4.5" y="8" width="15" height="11" rx="2.5" />
      <path d="M12 4.5V8M9 13h.01M15 13h.01M9.5 16h5" />
      <circle cx="12" cy="3.5" r="1.2" />
    </>
  ),
  tool: (
    <path d="M15.5 3.5a5 5 0 0 0-4.6 7l-7 7 2.6 2.6 7-7a5 5 0 0 0 6.3-6.3l-3 3-2.6-2.6 3-3a5 5 0 0 0-1.7-.7z" />
  ),
  leaf: (
    <>
      <path d="M20 4c0 8.5-4.6 13-11.5 13H5C5 9.6 9.9 4.6 20 4z" />
      <path d="M5 21c1.6-5 4.6-8.6 9-11" />
    </>
  ),
  droplet: (
    <>
      <path d="M12 3.2s5.5 5.6 5.5 9.3a5.5 5.5 0 0 1-11 0c0-3.7 5.5-9.3 5.5-9.3z" />
      <path d="M9.4 13.5a2.6 2.6 0 0 0 2.6 2.6" />
    </>
  ),
  recycle: (
    <>
      <path d="M8.2 6.5 10.4 3l2.2 3.5M15.9 10.4 18 14l-4 .1M8.1 14.1 4 14l2.2-3.6" />
      <path d="M10.4 3 6.2 10.2M18 14l-4.2 7M4 14l4.1 7h5.7" />
    </>
  ),
  package: (
    <>
      <path d="m12 3.2 8 4.4v8.8l-8 4.4-8-4.4V7.6z" />
      <path d="m4 7.6 8 4.4 8-4.4M12 12v8.8" />
    </>
  ),
  ribbon: (
    <>
      <circle cx="12" cy="9" r="5.2" />
      <path d="m8.9 13.6-1.6 6.4 4.7-2.2 4.7 2.2-1.6-6.4" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s7-5.7 7-11a7 7 0 1 0-14 0c0 5.3 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.6" />
    </>
  ),
  phone: (
    <path d="M4 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L14 13l5 2v4a1 1 0 0 1-1 1A15 15 0 0 1 3 5a1 1 0 0 1 1-1z" />
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7v5.2l3.4 2" />
    </>
  ),
  download: <path d="M12 3.5v11m0 0 4-4m-4 4-4-4M4.5 19.5h15" />,
  send: <path d="M20.5 3.5 10.5 13.5M20.5 3.5l-6.5 17-3.5-7-7-3.5z" />,
};

function Icon({
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
    <span className="border-accent-400/25 bg-accent-400/10 text-accent-400 grid size-9 shrink-0 place-items-center rounded-md border">
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

/** Small accent-arrow footer line used on the difference and capability cards. */
function FootLine({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-accent-400 flex items-center gap-2 text-sm font-medium">
      <span aria-hidden className="font-mono">
        &rsaquo;
      </span>
      {children}
    </p>
  );
}

/* ══ 01 · HERO ════════════════════════════════════════════════════════════ */
export function WhyHero({
  eyebrow,
  h1Lines,
  intro,
  image,
  stats,
  actions,
  breadcrumb,
}: {
  eyebrow: string;
  h1Lines: readonly string[];
  intro: string;
  image: string;
  stats: readonly { value: string; label: string }[];
  actions: readonly {
    label: string;
    href: string;
    variant: string;
    icon?: string;
  }[];
  breadcrumb?: readonly Crumb[];
}) {
  return (
    <header className="bg-canvas relative isolate overflow-hidden pt-40 pb-24 md:pt-56 md:pb-32">
      <Img
        k={image}
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover brightness-[0.55]"
      />
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(to right, color-mix(in srgb, var(--color-canvas) 88%, transparent) 6%, color-mix(in srgb, var(--color-canvas) 55%, transparent) 40%, transparent 78%)",
        }}
      />
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(to top, var(--color-canvas), transparent 42%)",
        }}
      />
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(to bottom, var(--color-canvas), transparent 26%)",
        }}
      />
      <Bloom className="top-1/3 -left-40 size-[34rem]" />

      <Container>
        <Breadcrumb items={breadcrumb} className="mb-6" />
        <p className="text-eyebrow text-accent-400 flex items-center gap-4 font-mono uppercase">
          <span aria-hidden className="bg-accent-400/70 inline-block h-px w-8" />
          {eyebrow}
        </p>

        <Marked as="h1" size="hero" lines={h1Lines} className="mt-6" />

        <p className="text-ink-3 mt-7 max-w-[52ch] leading-relaxed">{intro}</p>

        <dl className="mt-10 flex flex-wrap gap-3.5">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-card border-line bg-canvas/45 min-w-[8.5rem] border px-5 py-4 backdrop-blur"
            >
              <dd className="text-accent-400 text-xl font-semibold">
                {s.value}
              </dd>
              <dt className="text-ink-4 mt-1 text-xs">{s.label}</dt>
            </div>
          ))}
        </dl>

        <div className="mt-9 flex flex-wrap gap-3">
          {actions.map((a) =>
            a.variant === "primary" ? (
              <Link
                key={a.label}
                href={a.href}
                className="bg-accent-400 text-ink hover:opacity-90 shadow-glow rounded-cta inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold transition-colors"
              >
                {a.label}
                <Arrow />
              </Link>
            ) : (
              <Link
                key={a.label}
                href={a.href}
                className="border-line-2 bg-canvas/60 text-ink hover:border-accent-400/60 rounded-pill inline-flex items-center gap-2.5 border px-6 py-3.5 text-sm font-semibold backdrop-blur transition-colors"
              >
                {a.icon && <Icon name={a.icon} className="size-4" />}
                {a.label}
              </Link>
            ),
          )}
        </div>
      </Container>
    </header>
  );
}

/* ══ 02 · HERITAGE ════════════════════════════════════════════════════════ */
export function Heritage({
  head,
  image,
  milestones,
  stats,
  note,
}: {
  head: Head;
  image: string;
  milestones: readonly { year: string; body: string }[];
  stats: readonly { value: string; label: string }[];
  note: string;
}) {
  return (
    <section className="bg-canvas py-[70px]">
      <Container>
        <div className="grid gap-14 lg:grid-cols-2">
          <div>
            <LeftHead head={head} />
            <ol className="border-line mt-10 space-y-8 border-l pl-7">
              {milestones.map((m) => (
                <li key={m.year} className="relative">
                  <span
                    aria-hidden
                    className="bg-accent-400 absolute top-1.5 -left-[1.9rem] size-2 rounded-full"
                  />
                  <p className="text-accent-400 text-sm font-semibold">
                    {m.year}
                  </p>
                  <p className="text-ink-3 mt-1.5 text-sm leading-relaxed">
                    {m.body}
                  </p>
                </li>
              ))}
            </ol>
          </div>

          <div>
            <div className="rounded-card border-line overflow-hidden border">
              <Photo
                k={image}
                ratio="aspect-[3/2]"
                dissolve={false}
                sizes="(min-width:1024px) 46vw, 100vw"
              />
            </div>

            <dl className="mt-5 grid grid-cols-3 gap-4">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-card border-line border bg-[#0D0D0D] py-6 text-center"
                >
                  <dd className="text-accent-400 text-xl font-semibold">
                    {s.value}
                  </dd>
                  <dt className="text-ink-4 mt-1 text-xs">{s.label}</dt>
                </div>
              ))}
            </dl>

            <p className="border-accent-400 text-ink-3 mt-6 border-l-2 pl-5 text-sm leading-relaxed">
              {note}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ══ 03 · THE DIFFERENCE ══════════════════════════════════════════════════ */
export function Difference({
  head,
  items,
}: {
  head: Head;
  items: readonly {
    eyebrow: string;
    name: string;
    body: string;
    foot: string;
  }[];
}) {
  return (
    <section className="relative isolate overflow-hidden bg-[#050505] py-[70px]">
      <Bloom className="-top-24 right-0 size-[32rem]" />
      <Container>
        <LeftHead head={head} className="max-w-[46rem]" />

        {/* Hairline-divided columns rather than detached cards, as in the comp. */}
        <ul className="divide-line border-line mt-14 grid divide-y border-t md:grid-cols-3 md:divide-x md:divide-y-0">
          {items.map((d) => (
            <li key={d.name} className="flex flex-col p-8 first:pl-0 last:pr-0">
              <span className="bg-accent-400/60 mb-7 block h-1 w-8" />
              <Eyebrow>{d.eyebrow}</Eyebrow>
              <h3 className="text-ink mt-3 text-xl font-semibold">{d.name}</h3>
              <p className="text-ink-4 mt-4 flex-1 text-sm leading-relaxed">
                {d.body}
              </p>
              <div className="border-line mt-7 border-t pt-5">
                <FootLine>{d.foot}</FootLine>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

/* ══ 04 · CAPABILITIES ════════════════════════════════════════════════════ */
export function Capabilities({
  head,
  banner,
  bannerEyebrow,
  bannerLines,
  items,
}: {
  head: Head;
  banner: string;
  bannerEyebrow: string;
  bannerLines: readonly string[];
  items: readonly {
    icon: string;
    name: string;
    body: string;
    foot: string;
  }[];
}) {
  return (
    <>
      {/* Full-bleed banner with the heading laid over it. */}
      <section className="bg-canvas relative isolate overflow-hidden">
        <Img
          k={banner}
          fill
          sizes="100vw"
          className="-z-20 object-cover brightness-[0.6]"
        />
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              "linear-gradient(to right, color-mix(in srgb, var(--color-canvas) 85%, transparent), color-mix(in srgb, var(--color-canvas) 30%, transparent) 62%, transparent)",
          }}
        />
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              "linear-gradient(to bottom, var(--color-canvas), transparent 18%, transparent 82%, var(--color-canvas))",
          }}
        />
        <Container>
          <div className="py-24 md:py-32">
            <Eyebrow>{bannerEyebrow}</Eyebrow>
            <Marked lines={bannerLines} className="mt-5" />
          </div>
        </Container>
      </section>

      <section className="bg-canvas py-[70px]">
        <Container>
          <h2 className="sr-only">{head.lines.join(" ")}</h2>
          <ul className="divide-line border-line grid divide-y border-t md:grid-cols-3 md:divide-x">
            {items.map((c, i) => (
              <li
                key={c.name}
                className={`flex flex-col p-8 ${i % 3 === 0 ? "md:pl-0" : ""} ${
                  i % 3 === 2 ? "md:pr-0" : ""
                } ${i >= 3 ? "border-line md:border-t" : ""}`}
              >
                <IconTile name={c.icon} />
                <h3 className="text-ink mt-6 text-base font-semibold">
                  {c.name}
                </h3>
                <p className="text-ink-4 mt-3 flex-1 text-sm leading-relaxed">
                  {c.body}
                </p>
                <p className="text-accent-400 mt-5 text-sm font-medium">
                  {c.foot}
                </p>
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </>
  );
}

/* ══ 05 · MATERIALS SCIENCE ═══════════════════════════════════════════════ */
export function Materials({
  head,
  items,
  customNote,
}: {
  head: Head;
  items: readonly Material[];
  customNote: string;
}) {
  return (
    <section className="bg-canvas py-[70px]">
      <Container>
        <LeftHead head={head} className="mb-12" />
        <MaterialSelector items={items} customNote={customNote} />
      </Container>
    </section>
  );
}

/* ══ 06 · QUALITY ═════════════════════════════════════════════════════════ */
export function Quality({
  head,
  image,
  imageCaption,
  stats,
  checks,
  note,
}: {
  head: Head;
  image: string;
  imageCaption: string;
  stats: readonly { value: string; label: string }[];
  checks: readonly string[];
  note: string;
}) {
  return (
    <section className="bg-canvas py-[70px]">
      <Container>
        <div className="grid gap-14 lg:grid-cols-2">
          <div>
            <figure className="rounded-card border-line relative isolate overflow-hidden border">
              <Photo
                k={image}
                ratio="aspect-[4/3]"
                dissolve={false}
                sizes="(min-width:1024px) 46vw, 100vw"
              />
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, color-mix(in srgb, var(--color-canvas) 88%, transparent), transparent 48%)",
                }}
              />
              <figcaption className="text-ink-2 absolute bottom-4 left-5 text-sm">
                {imageCaption}
              </figcaption>
            </figure>

            <dl className="mt-5 grid grid-cols-3 gap-4">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-card border-line border bg-[#0D0D0D] py-6 text-center"
                >
                  <dd className="text-accent-400 text-xl font-semibold">
                    {s.value}
                  </dd>
                  <dt className="text-ink-4 mt-1 text-xs">{s.label}</dt>
                </div>
              ))}
            </dl>
          </div>

          <div>
            <LeftHead head={head} />
            <ul className="divide-line mt-8 divide-y">
              {checks.map((c) => (
                <li key={c} className="text-ink-2 flex gap-3.5 py-4 text-sm">
                  <Check className="text-accent-400 mt-0.5 size-4 shrink-0" />
                  {c}
                </li>
              ))}
            </ul>
            <p className="border-accent-400/40 bg-accent-400/5 text-ink-3 mt-8 rounded-md border p-5 text-sm leading-relaxed">
              {note}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ══ 07 · STANDARDS ═══════════════════════════════════════════════════════ */
export function Standards({
  head,
  items,
}: {
  head: Head;
  items: readonly {
    code: string;
    suffix: string;
    name: string;
    auditor: string;
    scope: string;
  }[];
}) {
  return (
    <section className="relative isolate overflow-hidden bg-[#050505] py-[70px]">
      <Bloom className="-top-20 left-1/2 size-[34rem] -translate-x-1/2" />
      <Container>
        <CenterHead head={head} />

        <ul className="divide-line border-line mt-14 grid divide-y border-y sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 lg:divide-x lg:divide-y-0">
          {items.map((c) => (
            <li key={c.code} className="px-6 py-9 text-center">
              <span className="border-accent-400/25 bg-accent-400/10 text-accent-400 mx-auto grid size-11 place-items-center rounded-md border">
                <Icon name="ribbon" />
              </span>
              <p className="mt-6">
                <span className="text-accent-400 text-base font-semibold">
                  {c.code}
                </span>
                <span className="text-accent-400/70 text-sm">{c.suffix}</span>
              </p>
              <p className="text-ink mt-2 text-sm font-semibold">{c.name}</p>
              <p className="text-ink-4 border-line mt-4 border-b pb-4 text-xs">
                {c.auditor}
              </p>
              <p className="text-ink-4 mt-4 text-xs leading-relaxed">
                {c.scope}
              </p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

/* ══ 08 · RESPONSIBILITY ══════════════════════════════════════════════════ */
export function Responsibility({
  head,
  cards,
  initiativesHeading,
  initiatives,
}: {
  head: Head;
  cards: readonly {
    icon: string;
    value: string;
    name: string;
    body: string;
  }[];
  initiativesHeading: string;
  initiatives: readonly string[];
}) {
  return (
    <section className="bg-canvas py-[70px]">
      <Container>
        <div className="grid gap-14 lg:grid-cols-2">
          <div>
            <LeftHead head={head} />
            <ul className="mt-10 grid gap-5 sm:grid-cols-2">
              {cards.map((c) => (
                <li
                  key={c.name}
                  className="rounded-card border-line border bg-[#0D0D0D] p-6"
                >
                  <Icon name={c.icon} className="text-accent-400 size-5" />
                  <p className="text-accent-400 mt-4 text-2xl font-semibold">
                    {c.value}
                  </p>
                  <p className="text-ink mt-1 text-sm font-semibold">{c.name}</p>
                  <p className="text-ink-4 mt-2 text-xs leading-relaxed">
                    {c.body}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:pt-16">
            <h3 className="text-ink text-xl font-semibold">
              {initiativesHeading}
            </h3>
            <ol className="divide-line border-line mt-6 divide-y border-t">
              {initiatives.map((t, i) => (
                <li key={t} className="flex gap-5 py-5">
                  <span className="text-eyebrow text-accent-400 shrink-0 font-mono">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-ink-2 text-sm leading-relaxed">{t}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ══ 09 · GLOBAL EXPORT ═══════════════════════════════════════════════════ */
export function GlobalExport({
  head,
  image,
  stats,
  regionsHeading,
  regions,
  industriesHeading,
  industries,
  terms,
}: {
  head: Head;
  image: string;
  stats: readonly { value: string; label: string }[];
  regionsHeading: string;
  regions: readonly { name: string; list: string }[];
  industriesHeading: string;
  industries: readonly string[];
  terms: string;
}) {
  return (
    <section className="bg-canvas relative isolate overflow-hidden py-[70px]">
      <Img
        k={image}
        fill
        sizes="100vw"
        className="-z-20 object-cover brightness-[0.3] saturate-[0.6]"
      />
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(to bottom, var(--color-canvas), color-mix(in srgb, var(--color-canvas) 55%, transparent) 45%, var(--color-canvas))",
        }}
      />

      <Container>
        <CenterHead head={head} />

        <dl className="mt-12 flex flex-wrap justify-center gap-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-card border-line bg-canvas/50 min-w-[9rem] border px-8 py-5 text-center backdrop-blur"
            >
              <dd className="text-accent-400 text-2xl font-semibold">
                {s.value}
              </dd>
              <dt className="text-ink-4 mt-1 text-xs">{s.label}</dt>
            </div>
          ))}
        </dl>

        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          <div className="rounded-card border-line bg-canvas/70 border p-7 backdrop-blur">
            <h3 className="text-ink text-lg font-semibold">{regionsHeading}</h3>
            <dl className="divide-line mt-5 divide-y">
              {regions.map((r) => (
                <div
                  key={r.name}
                  className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-3.5"
                >
                  <dt className="text-accent-400 text-sm font-medium">
                    {r.name}
                  </dt>
                  <dd className="text-ink-4 text-sm">{r.list}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="rounded-card border-line bg-canvas/70 border p-7 backdrop-blur">
            <h3 className="text-ink text-lg font-semibold">
              {industriesHeading}
            </h3>
            <ul className="divide-line mt-5 divide-y">
              {industries.map((n) => (
                <li
                  key={n}
                  className="text-ink-2 flex items-center gap-3 py-3.5 text-sm"
                >
                  <span
                    aria-hidden
                    className="bg-accent-400 size-1.5 shrink-0 rounded-full"
                  />
                  {n}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="text-ink-4 mt-8 text-center text-sm">{terms}</p>
      </Container>
    </section>
  );
}

/* ══ 10 · ENGINEERING SUPPORT ═════════════════════════════════════════════ */
export function Support({
  head,
  image,
  items,
}: {
  head: Head;
  image: string;
  items: readonly { name: string; body: string }[];
}) {
  return (
    <section className="bg-canvas py-[70px]">
      <Container>
        <div className="grid gap-14 lg:grid-cols-2">
          <div className="rounded-card border-line h-fit overflow-hidden border">
            <Photo
              k={image}
              ratio="aspect-[4/5]"
              dissolve={false}
              sizes="(min-width:1024px) 46vw, 100vw"
            />
          </div>

          <div>
            <LeftHead head={head} />
            <ul className="mt-9 space-y-7">
              {items.map((s) => (
                <li key={s.name} className="flex gap-3.5">
                  <Check className="text-accent-400 mt-1 size-4 shrink-0" />
                  <div>
                    <h3 className="text-ink text-base font-semibold">
                      {s.name}
                    </h3>
                    <p className="text-ink-4 mt-1.5 text-sm leading-relaxed">
                      {s.body}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ══ 11 · CLIENT TENURE ═══════════════════════════════════════════════════ */
export function Tenure({
  head,
  columns,
  rows,
}: {
  head: Head;
  columns: readonly string[];
  rows: readonly { metric: string; value: string; context: string }[];
}) {
  return (
    <section className="bg-canvas py-[70px]">
      <Container>
        <LeftHead head={head} className="mb-12" />

        <div className="rounded-card border-line overflow-x-auto border">
          <table className="w-full min-w-[42rem] text-left">
            <thead>
              <tr className="border-line border-b bg-[#0D0D0D]">
                {columns.map((c) => (
                  <th
                    key={c}
                    scope="col"
                    className="text-eyebrow text-ink-4 px-6 py-4 font-mono font-normal uppercase"
                  >
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-line divide-y">
              {rows.map((r) => (
                <tr key={r.metric}>
                  <th
                    scope="row"
                    className="text-ink-2 px-6 py-5 text-sm font-normal"
                  >
                    {r.metric}
                  </th>
                  <td className="text-accent-400 px-6 py-5 text-sm font-semibold">
                    {r.value}
                  </td>
                  <td className="text-ink-4 px-6 py-5 text-sm">{r.context}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Container>
    </section>
  );
}

/* ══ 12 · CLIENT FEEDBACK ═════════════════════════════════════════════════ */
export function Feedback({
  head,
  quote,
  initials,
  name,
  role,
  stats,
}: {
  head: Head;
  quote: string;
  initials: string;
  name: string;
  role: string;
  stats: readonly { value: string; label: string }[];
}) {
  return (
    <section className="bg-canvas relative isolate overflow-hidden py-[70px]">
      <Bloom className="-top-16 left-1/2 size-[32rem] -translate-x-1/2" />
      <Container>
        <CenterHead head={head} />

        <figure className="rounded-card border-line border-l-accent-400 mx-auto mt-12 max-w-[56rem] border border-l-2 bg-[#0D0D0D] p-8 md:p-12">
          <svg
            viewBox="0 0 24 24"
            className="text-accent-400/40 size-8 fill-current"
            aria-hidden
          >
            <path d="M9.5 5.5C6.4 7 4.6 9.6 4.6 12.9c0 2.9 1.8 4.9 4.2 4.9 2.1 0 3.7-1.5 3.7-3.5 0-1.9-1.4-3.4-3.3-3.4-.4 0-.8.1-1 .2.4-1.6 1.7-3 3.5-3.9zm9.4 0c-3.1 1.5-4.9 4.1-4.9 7.4 0 2.9 1.8 4.9 4.2 4.9 2.1 0 3.7-1.5 3.7-3.5 0-1.9-1.4-3.4-3.3-3.4-.4 0-.8.1-1 .2.4-1.6 1.7-3 3.5-3.9z" />
          </svg>

          <blockquote className="text-ink mt-6 text-[clamp(1.05rem,1.9vw,1.4rem)] leading-[1.55] font-medium italic">
            <p>{`"${quote}"`}</p>
          </blockquote>

          <figcaption className="mt-8 flex items-center gap-4">
            <span className="border-accent-400/25 bg-accent-400/10 text-accent-400 grid size-10 shrink-0 place-items-center rounded-md border text-xs font-semibold">
              {initials}
            </span>
            <span>
              <span className="text-ink block text-sm font-semibold">
                {name}
              </span>
              <span className="text-ink-4 block text-xs">{role}</span>
            </span>
          </figcaption>
        </figure>

        <dl className="divide-line border-line mx-auto mt-12 grid max-w-[56rem] divide-y border-t sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {stats.map((s) => (
            <div key={s.label} className="px-6 py-8 text-center">
              <dd className="text-accent-400 text-2xl font-semibold">
                {s.value}
              </dd>
              <dt className="text-ink-4 mt-1.5 text-xs">{s.label}</dt>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}

/* ══ 13 · BUYER QUESTIONS ═════════════════════════════════════════════════ */
export function Faq({
  head,
  items,
}: {
  head: Head;
  items: readonly { q: string; a: string }[];
}) {
  return (
    <section className="bg-canvas py-[70px]">
      <Container>
        <CenterHead head={head} />

        {/* Native <details>: the answers are in the HTML whether open or not,
            which is what the FAQPage JSON-LD asserts and what crawlers read. */}
        <ul className="divide-line border-line mx-auto mt-12 max-w-[52rem] divide-y border-y">
          {items.map((f) => (
            <li key={f.q}>
              <details className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 [&::-webkit-details-marker]:hidden">
                  <span className="text-ink text-base font-medium">{f.q}</span>
                  <span
                    aria-hidden
                    className="border-line-2 text-ink-3 group-hover:border-accent-400/60 group-hover:text-accent-400 relative grid size-7 shrink-0 place-items-center rounded border transition-colors"
                  >
                    <span className="absolute h-px w-3 bg-current" />
                    <span className="absolute h-3 w-px bg-current transition-transform group-open:scale-y-0" />
                  </span>
                </summary>
                <p className="text-ink-4 max-w-[62ch] pb-7 text-sm leading-relaxed">
                  {f.a}
                </p>
              </details>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

/* ══ 14 · ENQUIRE NOW ═════════════════════════════════════════════════════ */
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
  "mt-2 w-full rounded-md border border-line-2 bg-[#0D0D0D] px-4 py-3 text-sm text-ink placeholder:text-ink-4 focus:border-accent-400";

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
        defaultValue=""
        required={f.required}
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
      required={f.required}
      placeholder={f.placeholder}
      className={inputCls}
    />
  );
}

export function Enquiry({
  eyebrow,
  lines,
  body,
  contacts,
  note,
  fields,
  submitLabel,
  footnote,
}: {
  eyebrow: string;
  lines: readonly string[];
  body: string;
  contacts: readonly { icon: string; label: string; value: string }[];
  note: string;
  fields: readonly Field[];
  submitLabel: string;
  footnote: string;
}) {
  return (
    <section className="bg-canvas relative isolate overflow-hidden py-[70px]">
      <Bloom className="-bottom-32 right-0 size-[32rem]" />
      <Container>
        <div className="grid gap-14 lg:grid-cols-[minmax(0,26rem)_1fr]">
          <div>
            <Eyebrow>{eyebrow}</Eyebrow>
            <Marked lines={lines} size="column" className="mt-5" />
            <p className="text-ink-3 mt-6 leading-relaxed">{body}</p>

            <ul className="mt-9 space-y-5">
              {contacts.map((c) => (
                <li key={c.label} className="flex gap-4">
                  <IconTile name={c.icon} />
                  <div>
                    <p className="text-eyebrow text-ink-4 font-mono uppercase">
                      {c.label}
                    </p>
                    <p className="text-ink-2 mt-1 text-sm">{c.value}</p>
                  </div>
                </li>
              ))}
            </ul>

            <p className="border-accent-400/40 bg-accent-400/5 text-ink-3 mt-9 rounded-md border p-5 text-sm leading-relaxed">
              {note}
            </p>
          </div>

          <EnquiryForm
            source="why-margo"
            className="rounded-card border-line border bg-[#0D0D0D] p-7 md:p-9"
          >
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
            </div>

            <EnquirySubmit className="bg-accent-400 text-ink hover:opacity-90 shadow-glow mt-7 flex w-full items-center justify-center gap-2.5 rounded-md px-6 py-4 text-sm font-semibold tracking-wide transition-colors">
              <Icon name="send" className="size-4" />
              {submitLabel}
            </EnquirySubmit>
            <EnquiryStatus />

            <p className="text-ink-4 mt-4 text-center text-xs">{footnote}</p>
          </EnquiryForm>
        </div>
      </Container>
    </section>
  );
}
