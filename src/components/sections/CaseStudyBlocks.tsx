import Link from "next/link";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import type { Crumb } from "@/lib/breadcrumbs";
import { Img } from "@/components/ui/Img";
import { Container } from "@/components/ui/Section";
import { displaySize } from "@/lib/display-size";

/* ══ SHARED ═══════════════════════════════════════════════════════════════ */

/** Eyebrow with the leading accent bar this page uses instead of a rule. */
function BarEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-eyebrow text-accent-400 flex items-center gap-3 font-mono uppercase">
      <span aria-hidden className="bg-accent-400 inline-block h-3.5 w-0.5" />
      {children}
    </p>
  );
}

/**
 * Numbered section rule: "02 · METHODOLOGY PREVIEW ─────────".
 * The index and label are muted; the hairline runs to the container edge.
 */
function SectionRule({
  index,
  label,
  center = false,
}: {
  index: string;
  label: string;
  center?: boolean;
}) {
  return (
    <p className="text-eyebrow text-ink-4 mb-14 flex items-center gap-5 font-mono uppercase">
      {center && <span aria-hidden className="bg-line h-px flex-1" />}
      <span className="shrink-0">
        {index} · {label}
      </span>
      <span aria-hidden className="bg-line h-px flex-1" />
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
  // Length-aware (src/lib/display-size.ts); a column heading keeps its step.
  const scale = size === "column" ? "text-display-3" : displaySize(lines, size);
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
  ribbon: (
    <>
      <circle cx="12" cy="9" r="5.2" />
      <path d="m8.9 13.6-1.6 6.4 4.7-2.2 4.7 2.2-1.6-6.4" />
    </>
  ),
  shield: <path d="M12 3.2 19 6v5.6c0 4-2.9 7.4-7 9.2-4.1-1.8-7-5.2-7-9.2V6z" />,
  check: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m8.2 12.2 2.8 2.8 5-5.2" />
    </>
  ),
  doc: (
    <>
      <path d="M13.5 3.5H7a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9z" />
      <path d="M13.5 3.5V9H19M8.5 13h7M8.5 16.5h4.5" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </>
  ),
  out: (
    <>
      <path d="M14 4.5h5.5V10M19 5l-7.5 7.5" />
      <path d="M18 14v4.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 4 18.5v-11A1.5 1.5 0 0 1 5.5 6H10" />
    </>
  ),  phone: (
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6.2 6.2l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2Z" />
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
    <span className="border-accent-400/25 bg-accent-400/10 text-accent-400 grid size-10 shrink-0 place-items-center rounded-md border">
      <Icon name={name} />
    </span>
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

function Chevron({ className = "size-3.5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="m9.5 5.5 7 6.5-7 6.5" />
    </svg>
  );
}

/* ══ 01 · HERO ════════════════════════════════════════════════════════════ */
export function CaseHero({
  eyebrow,
  h1Lines,
  paragraphs,
  image,
  badge,
  actions,
  breadcrumb,
}: {
  eyebrow: string;
  h1Lines: readonly string[];
  paragraphs: readonly string[];
  image: string;
  badge: { title: string; note: string };
  actions: readonly { label: string; href: string; variant: string }[];
  breadcrumb?: readonly Crumb[];
}) {
  return (
    <header className="bg-canvas relative isolate overflow-hidden pt-36 pb-20 md:pt-48 md:pb-28">
      <Bloom className="top-1/4 -left-40 size-[32rem]" />
      <Container>
        <Breadcrumb items={breadcrumb} className="mb-6" />
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <div>
            <BarEyebrow>{eyebrow}</BarEyebrow>
            <Marked as="h1" size="hero" lines={h1Lines} className="mt-6" />
            {paragraphs.map((p) => (
              <p
                key={p.slice(0, 24)}
                className="text-ink-3 mt-6 max-w-[46ch] leading-relaxed"
              >
                {p}
              </p>
            ))}

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
                    className="border-line-2 text-ink hover:border-accent-400/60 rounded-pill inline-flex items-center border px-6 py-3.5 text-sm font-semibold transition-colors"
                  >
                    {a.label}
                  </Link>
                ),
              )}
            </div>
          </div>

          {/* Plate with the certification card overlapping its lower-right. */}
          <div className="relative pb-14 lg:pb-0">
            <figure className="rounded-card border-line relative isolate overflow-hidden border">
              <div className="relative isolate aspect-[4/3]">
                <Img
                  k={image}
                  fill
                  priority
                  sizes="(min-width:1024px) 46vw, 100vw"
                  className="object-cover brightness-[0.92]"
                />
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, color-mix(in srgb, var(--color-canvas) 55%, transparent), transparent 55%)",
                  }}
                />
              </div>
            </figure>
            <div className="rounded-card border-line absolute right-0 -bottom-0 border bg-[#111418]/95 px-6 py-4 backdrop-blur lg:-right-4 lg:-bottom-8">
              <p className="text-accent-400 text-lg font-semibold">
                {badge.title}
              </p>
              <p className="text-ink-4 mt-0.5 text-xs">{badge.note}</p>
            </div>
          </div>
        </div>
      </Container>
    </header>
  );
}

/* ══ 02 · METHODOLOGY ═════════════════════════════════════════════════════ */
export function Methodology({
  index,
  label,
  heading,
  body,
  items,
}: {
  index: string;
  label: string;
  heading: string;
  body: string;
  items: readonly {
    eyebrow: string;
    name: string;
    body: string;
    statValue: string;
    statNote: string;
  }[];
}) {
  return (
    <section id="methodology" className="bg-canvas py-[70px]">
      <Container>
        <SectionRule index={index} label={label} />

        <div className="grid gap-10 lg:grid-cols-2">
          <Marked lines={heading.split(" ").length > 4 ? [heading] : [heading]} size="column" />
          <p className="text-ink-3 leading-relaxed">{body}</p>
        </div>

        {/* Hairline-divided columns with a top accent rule, as in the comp. */}
        <ol className="divide-line border-line mt-14 grid divide-y border-t md:grid-cols-2 md:divide-x lg:grid-cols-4 lg:divide-y-0">
          {items.map((it, i) => (
            <li
              key={it.name}
              className="relative flex flex-col p-7 first:pl-0 lg:last:pr-0"
            >
              <span
                aria-hidden
                className="bg-accent-400 absolute top-0 left-0 h-px w-full lg:w-[calc(100%-1px)]"
              />
              <p className="text-eyebrow text-accent-400 font-mono uppercase">
                {it.eyebrow}
              </p>
              <span
                aria-hidden
                className="text-ink-4/25 mt-1 text-5xl leading-none font-bold select-none"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="text-ink mt-5 text-base leading-snug font-semibold">
                {it.name}
              </h3>
              <p className="text-ink-4 mt-3 flex-1 text-sm leading-relaxed">
                {it.body}
              </p>
              <div className="border-line mt-6 border-t pt-5">
                <p className="text-accent-400 text-lg font-semibold">
                  {it.statValue}
                </p>
                <p className="text-ink-4 mt-1 text-xs leading-relaxed">
                  {it.statNote}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}

/* ══ 03 · IN THE MEANTIME ═════════════════════════════════════════════════ */
export function Meantime({
  index,
  label,
  heading,
  body,
  items,
}: {
  index: string;
  label: string;
  heading: string;
  body: string;
  items: readonly {
    icon: string;
    eyebrow: string;
    name: string;
    body: string;
    cta: { label: string; href: string };
  }[];
}) {
  return (
    <section className="bg-canvas relative isolate overflow-hidden py-[70px]">
      <Bloom className="top-0 right-0 size-[30rem]" />
      <Container>
        <SectionRule index={index} label={label} center />

        {/* Centred, per the comp. This was a split header, heading left and
            body floating in a right column, which reads as two unrelated
            blocks rather than one introduction. */}
        <div className="mx-auto max-w-[52rem] text-center">
          <Marked lines={[heading]} size="column" />
          <p className="text-ink-3 mx-auto mt-6 max-w-[62ch] leading-relaxed">
            {body}
          </p>
        </div>

        <ul className="divide-line border-line mt-14 grid divide-y border-y md:grid-cols-2 md:divide-x">
          {items.map((m, i) => (
            <li
              key={m.name}
              className={`p-8 ${i % 2 === 0 ? "md:pl-0" : "md:pr-0"} ${
                i >= 2 ? "border-line md:border-t" : ""
              }`}
            >
              <IconTile name={m.icon} />
              <p className="text-eyebrow text-accent-400 mt-6 font-mono uppercase">
                {m.eyebrow}
              </p>
              <h3 className="text-ink mt-2.5 text-lg font-semibold">{m.name}</h3>
              <p className="text-ink-4 mt-3 text-sm leading-relaxed">{m.body}</p>
              <Link
                href={m.cta.href}
                className="text-accent-400 hover:opacity-80 mt-5 inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
              >
                {m.cta.label}
                <Chevron />
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

/* ══ 04 · INVITATION ══════════════════════════════════════════════════════ */
export function Invitation({
  index,
  label,
  eyebrow,
  headingLines,
  paragraphs,
  cta,
  listHeading,
  list,
  footnote,
}: {
  index: string;
  label: string;
  eyebrow: string;
  headingLines: readonly string[];
  paragraphs: readonly string[];
  cta: { label: string; href: string };
  listHeading: string;
  list: readonly string[];
  footnote: string;
}) {
  return (
    <section className="bg-canvas py-[70px]">
      <Container>
        <SectionRule index={index} label={label} />

        <div className="rounded-card border-line divide-line grid divide-y overflow-hidden border bg-[#080A0C] lg:grid-cols-2 lg:divide-x lg:divide-y-0">
          <div className="relative isolate overflow-hidden p-8 md:p-12">
            <Bloom className="-bottom-24 -left-16 size-[26rem]" />
            <p className="text-eyebrow text-accent-400 font-mono uppercase">
              {eyebrow}
            </p>
            <Marked lines={headingLines} size="column" className="mt-5" />
            {paragraphs.map((p) => (
              <p
                key={p.slice(0, 24)}
                className="text-ink-3 mt-6 max-w-[42ch] leading-relaxed"
              >
                {p}
              </p>
            ))}
            <Link
              href={cta.href}
              className="bg-accent-400 text-ink hover:opacity-90 shadow-glow rounded-cta mt-9 inline-flex items-center gap-2.5 px-6 py-3.5 text-sm font-semibold transition-colors"
            >
              <Icon name="mail" className="size-4" />
              {cta.label}
            </Link>
          </div>

          <div className="p-8 md:p-12">
            <p className="text-eyebrow text-ink-4 font-mono uppercase">
              {listHeading}
            </p>
            <ol className="mt-7 space-y-5">
              {list.map((t, i) => (
                <li key={t} className="flex gap-4">
                  <span className="text-eyebrow border-accent-400/30 bg-accent-400/10 text-accent-400 grid size-7 shrink-0 place-items-center rounded border font-mono">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-ink-2 pt-1 text-sm leading-relaxed">
                    {t}
                  </span>
                </li>
              ))}
            </ol>
            <p className="border-line text-ink-4 mt-9 border-t pt-6 text-xs leading-relaxed">
              {footnote}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ══ 05 · CLOSING ═════════════════════════════════════════════════════════ */
export function CaseClosing({
  eyebrow,
  headingLines,
  body,
  actions,
}: {
  eyebrow: string;
  headingLines: readonly string[];
  body: string;
  actions: readonly {
    label: string;
    href: string;
    variant: string;
    icon?: string;
  }[];
}) {
  return (
    <section className="bg-canvas border-line border-t py-[70px]">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <BarEyebrow>{eyebrow}</BarEyebrow>
            <Marked lines={headingLines} size="column" className="mt-5" />
            <p className="text-ink-3 mt-6 max-w-[46ch] leading-relaxed">
              {body}
            </p>
          </div>

          <div className="flex flex-wrap gap-4 lg:justify-end">
            {actions.map((a) =>
              a.variant === "primary" ? (
                <Link
                  key={a.label}
                  href={a.href}
                  className="bg-accent-400 text-ink hover:opacity-90 shadow-glow inline-flex items-center gap-2.5 rounded-xl px-7 py-4 text-sm font-semibold transition-colors"
                >
                  {a.icon && <Icon name={a.icon} className="size-4" />}
                  {a.label}
                </Link>
              ) : (
                <Link
                  key={a.label}
                  href={a.href}
                  className="border-line-2 text-ink hover:border-accent-400/60 inline-flex items-center gap-2.5 rounded-xl border px-7 py-4 text-sm font-semibold transition-colors"
                >
                  {a.icon && <Icon name={a.icon} className="size-4" />}
                  {a.label}
                </Link>
              ),
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
