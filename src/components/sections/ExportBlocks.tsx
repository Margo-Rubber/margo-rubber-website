import Link from "next/link";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import type { Crumb } from "@/lib/breadcrumbs";
import { Img } from "@/components/ui/Img";
import { Container } from "@/components/ui/Section";
import {
  EnquiryForm,
  EnquiryStatus,
  EnquirySubmit,
} from "@/components/forms/EnquiryForm";

/* ══ SHARED ═══════════════════════════════════════════════════════════════ */

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-eyebrow text-accent-400 font-mono uppercase">
      {children}
    </p>
  );
}

/** Display heading with inline `*accent*` marking. */
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

function Bloom({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`bg-accent-400/10 pointer-events-none absolute -z-10 rounded-full blur-3xl ${className}`}
    />
  );
}

const ICONS: Record<string, React.ReactNode> = {
  doc: (
    <>
      <path d="M13.5 3.5H7a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9z" />
      <path d="M13.5 3.5V9H19M8.5 13h7M8.5 16.5h4.5" />
    </>
  ),
  clipboard: (
    <>
      <path d="M9 4.5H7.5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-12a2 2 0 0 0-2-2H15" />
      <rect x="9" y="2.8" width="6" height="3.4" rx="1" />
      <path d="M8.8 12h6.4M8.8 15.5h4" />
    </>
  ),
  box: (
    <>
      <path d="m12 3.2 8 4.4v8.8l-8 4.4-8-4.4V7.6z" />
      <path d="m4 7.6 8 4.4 8-4.4M12 12v8.8" />
    </>
  ),
  pallet: (
    <>
      <rect x="3.5" y="4.5" width="17" height="6" rx="1" />
      <path d="M3.5 14.5h17M3.5 18.5h17M6.5 14.5v4M12 14.5v4M17.5 14.5v4" />
    </>
  ),
  ship: (
    <>
      <path d="M3.5 15.5 5 10.5h14l1.5 5M12 5v5.5" />
      <path d="M2.5 15.5c1.6 0 1.6 1.6 3.2 1.6s1.6-1.6 3.2-1.6 1.6 1.6 3.1 1.6 1.6-1.6 3.2-1.6 1.6 1.6 3.2 1.6 1.6-1.6 3.2-1.6" />
      <path d="M7 10.5v-3h10v3" />
    </>
  ),
  truck: (
    <>
      <path d="M3 7h10v9H3zM13 10.5h4l3 3V16h-7z" />
      <circle cx="7" cy="18" r="1.8" />
      <circle cx="17" cy="18" r="1.8" />
    </>
  ),
  shield: <path d="M12 3.2 19 6v5.6c0 4-2.9 7.4-7 9.2-4.1-1.8-7-5.2-7-9.2V6z" />,
  check: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4" />
      <path d="m8 12.2 2.8 2.8L16.4 9.4" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17M12 3.5c2.4 2.4 3.6 5.4 3.6 8.5S14.4 18.1 12 20.5c-2.4-2.4-3.6-5.4-3.6-8.5S9.6 5.9 12 3.5z" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s7-5.7 7-11a7 7 0 1 0-14 0c0 5.3 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.6" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </>
  ),
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

/** External-link glyph used on the market cross-links. */
function OutLink({ className = "size-3.5" }: { className?: string }) {
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
      <path d="M14 4.5h5.5V10M19 5l-7.5 7.5" />
      <path d="M18 14v4.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 4 18.5v-11A1.5 1.5 0 0 1 5.5 6H10" />
    </svg>
  );
}

/* ══ 01 · HERO + MAP ══════════════════════════════════════════════════════ */
type Pin = { slug: string; chip: string; heading: string; pin: { x: number; y: number } };

export function ExportHero({
  badge,
  h1Lines,
  intro,
  image,
  markets,
  breadcrumb,
}: {
  badge: string;
  h1Lines: readonly string[];
  intro: string;
  image: string;
  hub: { label: string; x: number; y: number };
  markets: readonly Pin[];
  breadcrumb?: readonly Crumb[];
}) {
  return (
    <header className="bg-canvas relative isolate overflow-hidden pt-36 pb-12 md:pt-48 md:pb-14">
      <Img
        k={image}
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover brightness-[1.08] contrast-[1.04]"
      />
      {/* Two scrims, not one, so the port photograph can actually be seen.
          It was previously dimmed twice over — brightness 0.45 AND a vertical
          wash starting at 78% black — which left the cranes and containers as
          barely-readable shapes. The image is now pushed slightly past 1 (the
          rest of the site's heroes sit at 0.85, but this photograph is a dusk
          shot and starts darker than any of them), and the work of protecting
          the copy is done by a horizontal scrim over the left column rather
          than by flattening the whole frame. The vertical wash keeps only the
          one job it is needed for:
          fading the bottom edge into the section below — and it does that in
          the last 20% only. Ramping from 45% down, as it did before, turned
          the entire lower half of the frame into a dead black band. */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(to bottom, color-mix(in srgb, var(--color-canvas) 34%, transparent) 0%, color-mix(in srgb, var(--color-canvas) 22%, transparent) 45%, color-mix(in srgb, var(--color-canvas) 40%, transparent) 80%, var(--color-canvas) 100%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(to right, color-mix(in srgb, var(--color-canvas) 64%, transparent), color-mix(in srgb, var(--color-canvas) 28%, transparent) 46%, transparent 70%)",
        }}
      />
      <Bloom className="top-1/4 -left-32 size-[32rem]" />

      <Container>
        <Breadcrumb items={breadcrumb} className="mb-6" />
        <span className="text-eyebrow border-accent-400/35 bg-accent-400/8 text-accent-400 inline-flex items-center gap-2.5 rounded-pill border px-3.5 py-1.5 font-mono uppercase backdrop-blur">
          <Icon name="globe" className="size-3.5" />
          {badge}
        </span>

        <Marked as="h1" size="hero" lines={h1Lines} className="mt-6" />

        {/* ink-2 rather than the ink-3 used for ledes elsewhere: this one sits
            directly on photography rather than on a flat surface, and the
            brighter image behind it costs the dimmer grey its contrast. */}
        <p className="text-ink-2 mt-6 max-w-[52ch] leading-relaxed">{intro}</p>

        {/* The map itself now lives in ExportLaneSequence directly below,
            where it pins and draws each trade lane in turn. Rendering the
            same artwork here as well meant the page showed two maps within a
            screen of each other. The chip row survives because it is the real
            navigation into the market sections, and it is what carries the
            tap targets on phones where the sequence does not run. */}
        <ul className="mt-6 flex flex-wrap gap-2.5">
          {markets.map((m) => (
            <li key={m.slug}>
              <Link
                href={`#${m.slug}`}
                // min-h-11 on mobile only: with the map pins hidden below md these chips are
                // the sole way to reach a market, so they need a real 44px tap target.
                className="text-eyebrow border-line-2 text-ink-3 hover:border-accent-400/60 hover:text-ink rounded-pill inline-flex min-h-11 items-center gap-2 border px-4 py-1.5 font-mono transition-colors md:min-h-0 md:px-3.5"
              >
                <span
                  aria-hidden
                  className="bg-accent-400 size-1.5 rounded-full"
                />
                {m.chip}
              </Link>
            </li>
          ))}
        </ul>

        {/* Scroll affordance from the comp. A real link to the first market so
            it does something rather than being decorative. */}
        <div className="mt-10 flex justify-center">
          <Link
            href={`#${markets[0].slug}`}
            aria-label={`Skip to ${markets[0].heading}`}
            className="text-ink-4 hover:text-accent-400 transition-colors"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-6"
              aria-hidden
            >
              <path d="m6 9.5 6 6 6-6" />
            </svg>
          </Link>
        </div>
      </Container>
    </header>
  );
}

/* ══ 02 · MARKET SECTION ══════════════════════════════════════════════════ */
export type Market = {
  slug: string;
  eyebrow: string;
  chip: string;
  heading: string;
  body: string;
  image: string;
  points: readonly string[];
  caveat?: string;
  links: readonly { label: string; href: string }[];
  panel?: {
    heading: string;
    body?: string;
    terms: readonly { code: string; name: string; body: string }[];
    facts: readonly { label: string; value: string }[];
    footnote?: string;
  };
};

export function MarketSection({
  market,
  flip,
}: {
  market: Market;
  flip: boolean;
}) {
  return (
    <section
      id={market.slug}
      className="border-line bg-canvas scroll-mt-24 border-t py-[70px]"
    >
      <Container>
        <div className="grid items-start gap-12 lg:grid-cols-2">
          {/* Copy column. Order flips so the image alternates side to side. */}
          <div className={flip ? "lg:order-2" : undefined}>
            <Eyebrow>{market.eyebrow}</Eyebrow>
            <Marked
              lines={[market.heading]}
              size="column"
              className="mt-4"
            />
            <p className="text-ink-3 mt-6 leading-relaxed">{market.body}</p>

            <ul className="mt-7 space-y-3.5">
              {market.points.map((p) => (
                <li key={p} className="text-ink-2 flex gap-3 text-sm leading-relaxed">
                  <span
                    aria-hidden
                    className="bg-accent-400 mt-[0.45rem] size-1.5 shrink-0 rounded-full"
                  />
                  {p}
                </li>
              ))}
            </ul>

            {market.panel && <MarketPanel panel={market.panel} />}

            {market.caveat && (
              <p className="text-ink-4 mt-7 text-sm leading-relaxed italic">
                {market.caveat}
              </p>
            )}

            {market.links.length > 0 && (
              <ul className="mt-7 flex flex-wrap gap-x-7 gap-y-3">
                {market.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-accent-400 hover:opacity-80 inline-flex items-center gap-2 text-sm transition-colors"
                    >
                      {l.label}
                      <Arrow className="size-3.5" />
                      <OutLink />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Plate with the location pill, as in the comp. */}
          <figure
            className={`rounded-card border-line relative isolate overflow-hidden border ${
              flip ? "lg:order-1" : ""
            }`}
          >
            <div className="relative isolate aspect-[16/11]">
              <Img
                k={market.image}
                fill
                sizes="(min-width:1024px) 46vw, 100vw"
                className="object-cover brightness-[0.92]"
              />
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, color-mix(in srgb, var(--color-canvas) 65%, transparent), transparent 55%)",
                }}
              />
            </div>
            <figcaption className="text-eyebrow border-line bg-canvas/75 text-ink absolute top-4 left-4 flex items-center gap-2 rounded-md border px-3 py-1.5 font-mono backdrop-blur">
              <Icon name="pin" className="text-accent-400 size-3.5" />
              {market.chip}
            </figcaption>
          </figure>
        </div>
      </Container>
    </section>
  );
}

/** Incoterms grid (US & EU) or the landed-cost guide (USA). */
function MarketPanel({ panel }: { panel: NonNullable<Market["panel"]> }) {
  return (
    <div className="rounded-card border-line mt-8 border bg-[#0B0D10] p-6">
      <p className="text-eyebrow text-accent-400 font-mono uppercase">
        {panel.heading}
      </p>

      {panel.body && (
        <p className="text-ink-4 mt-4 text-sm leading-relaxed">{panel.body}</p>
      )}

      {panel.terms.length > 0 && (
        <dl className="mt-5 grid gap-4 sm:grid-cols-2">
          {panel.terms.map((t) => (
            <div
              key={t.code}
              className="rounded-card border-line border bg-[#111418] p-4"
            >
              <dt className="flex items-baseline gap-2">
                <span className="text-accent-400 text-sm font-semibold">
                  {t.code}
                </span>
                <span className="text-ink-4 text-xs">{t.name}</span>
              </dt>
              <dd className="text-ink-4 mt-2 text-xs leading-relaxed">
                {t.body}
              </dd>
            </div>
          ))}
        </dl>
      )}

      {panel.facts.length > 0 && (
        <dl className="mt-5 grid gap-4 sm:grid-cols-3">
          {panel.facts.map((f) => (
            <div
              key={f.label}
              className="rounded-card border-line border bg-[#111418] p-4"
            >
              <dt className="text-ink-4 text-xs">{f.label}</dt>
              <dd className="text-ink mt-1 text-sm font-semibold">{f.value}</dd>
            </div>
          ))}
        </dl>
      )}

      {panel.footnote && (
        <p className="text-ink-4 mt-5 text-xs leading-relaxed">
          {panel.footnote}
        </p>
      )}
    </div>
  );
}

/* ══ 03 · PROCESS ═════════════════════════════════════════════════════════ */
export function ExportProcess({
  eyebrow,
  heading,
  body,
  steps,
}: {
  eyebrow: string;
  heading: string;
  body: string;
  steps: readonly { icon: string; name: string; body: string }[];
}) {
  return (
    <section className="border-line bg-canvas border-t py-[70px]">
      <Container>
        <header className="max-w-[46rem]">
          <Eyebrow>{eyebrow}</Eyebrow>
          <Marked lines={[heading]} size="column" className="mt-4" />
          <p className="text-ink-3 mt-5 max-w-[52ch] leading-relaxed">{body}</p>
        </header>

        <ol className="relative mt-14">
          <span
            aria-hidden
            className="bg-line-2 absolute top-8 bottom-8 left-8 w-px"
          />
          {steps.map((s, i) => (
            <li key={s.name} className="relative flex gap-6 pb-10 last:pb-0">
              <span className="border-line bg-canvas text-accent-400 relative z-10 grid size-16 shrink-0 place-items-center rounded-xl border">
                <Icon name={s.icon} className="size-5" />
                <span className="text-eyebrow text-ink-4 absolute bottom-2 font-mono">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </span>
              <div className="pt-2">
                <h3 className="text-ink text-lg font-semibold">{s.name}</h3>
                <p className="text-ink-4 mt-2 max-w-[70ch] text-sm leading-relaxed">
                  {s.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}

/* ══ 04 · DOCUMENTS ═══════════════════════════════════════════════════════ */
export function ExportDocuments({
  eyebrow,
  heading,
  body,
  items,
}: {
  eyebrow: string;
  heading: string;
  body: string;
  items: readonly { icon: string; name: string; body: string }[];
}) {
  return (
    <section className="border-line bg-canvas border-t py-[70px]">
      <Container>
        <header className="max-w-[46rem]">
          <Eyebrow>{eyebrow}</Eyebrow>
          <Marked lines={[heading]} size="column" className="mt-4" />
          <p className="text-ink-3 mt-5 max-w-[54ch] leading-relaxed">{body}</p>
        </header>

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((d) => (
            <li
              key={d.name}
              className="rounded-card border-line border bg-[#0B0D10] p-6"
            >
              <IconTile name={d.icon} />
              <h3 className="text-ink mt-5 text-base font-semibold">
                {d.name}
              </h3>
              <p className="text-ink-4 mt-2.5 text-sm leading-relaxed">
                {d.body}
              </p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

/* ══ 05 · EXPORT QUOTE ════════════════════════════════════════════════════ */
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
  "mt-2 w-full rounded-md border border-line-2 bg-[#111418] px-4 py-3 text-sm text-ink placeholder:text-ink-4 focus:border-accent-400";

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

export function ExportQuote({
  heading,
  body,
  checks,
  formHeading,
  fields,
  submitLabel,
  footnote,
}: {
  heading: string;
  body: string;
  checks: readonly string[];
  formHeading: string;
  fields: readonly Field[];
  submitLabel: string;
  footnote: string;
}) {
  return (
    <section className="border-line bg-canvas border-t py-[70px]">
      <Container>
        <div className="rounded-card border-line divide-line grid divide-y overflow-hidden border bg-[#0B0D10] lg:grid-cols-2 lg:divide-x lg:divide-y-0">
          <div className="p-8 md:p-10">
            <IconTile name="mail" />
            <h2 className="text-ink mt-7 text-2xl font-semibold md:text-3xl">
              {heading}
            </h2>
            <p className="text-ink-3 mt-4 max-w-[46ch] leading-relaxed">
              {body}
            </p>
            <ul className="mt-7 space-y-3">
              {checks.map((c) => (
                <li key={c} className="text-ink-2 flex gap-3 text-sm">
                  <Check className="text-accent-400 mt-0.5 size-4 shrink-0" />
                  {c}
                </li>
              ))}
            </ul>
          </div>

          {/* Hands off to /contact, the site's single submission path. */}
          <EnquiryForm source="export" className="p-8 md:p-10">
            <p className="text-eyebrow text-ink-4 font-mono uppercase">
              {formHeading}
            </p>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
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
            <EnquirySubmit className="bg-accent-400 text-ink hover:opacity-90 shadow-glow mt-7 flex w-full items-center justify-center gap-2 rounded-md px-6 py-4 text-sm font-semibold transition-colors">
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

/* ══ 06 · SUMMARY ═════════════════════════════════════════════════════════ */
export function ExportSummary({
  eyebrow,
  heading,
  body,
  facts,
}: {
  eyebrow: string;
  heading: string;
  body: string;
  facts: readonly { label: string; value: string }[];
}) {
  return (
    <section className="border-line relative isolate overflow-hidden border-t bg-[#050505] py-[70px]">
      <Bloom className="-bottom-32 right-0 size-[30rem]" />
      <Container>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,28rem)_1fr]">
          <header>
            <Eyebrow>{eyebrow}</Eyebrow>
            {/* Summary runs a step below the section scale: the comp sets this
                block at roughly h2 size, not display. */}
            <h2 className="text-h2 mt-4">{heading}</h2>
            <p className="text-ink-3 mt-5 text-sm leading-relaxed">{body}</p>
          </header>

          <dl className="grid gap-4 sm:grid-cols-2">
            {facts.map((f) => (
              <div
                key={f.label}
                className="rounded-card border-line border bg-[#0B0D10] px-6 py-5"
              >
                <dt className="text-ink-4 flex items-center gap-2 text-xs">
                  <span
                    aria-hidden
                    className="bg-accent-400 size-1.5 rounded-full"
                  />
                  {f.label}
                </dt>
                <dd className="text-ink mt-1.5 text-base font-semibold">
                  {f.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </Container>
    </section>
  );
}
