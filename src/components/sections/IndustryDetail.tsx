"use client";

import { useState } from "react";
import { withoutDeadDownloads } from "@/lib/downloads";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import type { Crumb } from "@/lib/breadcrumbs";
import Link from "next/link";
import { Img } from "@/components/ui/Img";
import { Button } from "@/components/ui/Button";
import { Container, Eyebrow } from "@/components/ui/Section";

/* ── HERO ─────────────────────────────────────────────────────────────── */
export function IndustryHero({
  badge,
  lines,
  accentLines,
  intro,
  actions,
  image,
  boost = false,
  breadcrumb,
}: {
  badge: string;
  lines: string[];
  accentLines: number[];
  intro: string;
  actions: { label: string; href: string; variant: "primary" | "secondary" }[];
  image?: string;
  /** Only for sources already faded to black; a normal photo would blow out. */
  boost?: boolean;
  breadcrumb?: readonly Crumb[];
}) {
  return (
    <header className="relative isolate overflow-hidden pt-28 pb-16 md:pt-44 md:pb-24">
      {image && (
        <>
          {boost ? (
            /* Mining only: the crop was lifted out of the design PNG and is
               already faded to black, so it needs recovering rather than dimming. */
            <>
              <div className="absolute inset-x-0 top-0 -z-20 h-[520px]">
                <Img
                  k={image}
                  fill
                  priority
                  sizes="100vw"
                  className="object-cover object-top brightness-[2.1] contrast-[1.15] saturate-125"
                />
              </div>
              <div className="from-canvas absolute inset-0 -z-10 bg-gradient-to-t from-45% to-transparent to-100%" />
            </>
          ) : (
            <>
              <Img
                k={image}
                fill
                priority
                sizes="100vw"
                className="-z-20 object-cover brightness-[0.85]"
              />
              <div className="from-canvas via-canvas/70 absolute inset-0 -z-10 bg-gradient-to-r from-10% via-50% to-transparent to-85%" />
              <div className="from-canvas absolute inset-0 -z-10 bg-gradient-to-t from-0% to-transparent to-45%" />
            </>
          )}
        </>
      )}
      <Container>
        <Breadcrumb items={breadcrumb} className="mb-6" />
        <span className="text-eyebrow border-accent-400/40 text-accent-400 inline-flex items-center gap-2 rounded-pill border px-4 py-1.5 font-mono uppercase">
          <span className="bg-accent-400 size-1.5 rounded-full" />
          {badge}
        </span>

        <h1 className="text-display mt-6">
          {lines.map((l, i) => (
            <span
              key={l}
              className={`block ${accentLines.includes(i) ? "text-accent-400" : ""}`}
            >
              {l}
              {/* Trailing space inside the block: invisible, but a crawler reads the lines with spaces. */}
              {i < lines.length - 1 ? " " : ""}
            </span>
          ))}
        </h1>

        <p className="text-ink-3 mt-6 max-w-[58ch] leading-relaxed">{intro}</p>

        <div className="mt-8 flex flex-wrap gap-3">
          {actions.map((a) => (
            <Button key={a.label} href={a.href} variant={a.variant}>
              {a.label} <span aria-hidden>→</span>
            </Button>
          ))}
        </div>
      </Container>
    </header>
  );
}

/* ── 02 · COMPONENT TABS ──────────────────────────────────────────────── */
type Component = {
  key: string;
  name: string;
  body: string;
  bullets: string[];
  image: string;
  cta: { label: string; href: string };
};

export function ComponentTabs({ items }: { items: Component[] }) {
  const [i, setI] = useState(0);
  // Every panel stays in the DOM, hidden rather than unmounted: a tab that mounts on click does not exist for a crawler.
  const panelId = (k: string) =>
    `component-${k.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2" role="tablist">
        {items.map((m, idx) => (
          <button
            key={m.key}
            role="tab"
            id={`${panelId(m.name)}-tab`}
            aria-controls={panelId(m.name)}
            aria-selected={idx === i}
            onClick={() => setI(idx)}
            className={`rounded-pill px-4 py-2 text-xs font-medium transition-colors ${
              idx === i
                ? "border-accent-400 text-accent-400 border"
                : "border-line text-ink-3 hover:text-ink border"
            }`}
          >
            {m.key}
          </button>
        ))}
      </div>

      {items.map((c, idx) => (
        <div
          key={c.name}
          id={panelId(c.name)}
          role="tabpanel"
          aria-labelledby={`${panelId(c.name)}-tab`}
          hidden={idx !== i}
        >
          <div className="border-line rounded-card grid overflow-hidden border bg-[#0A0A0A] md:grid-cols-[minmax(0,42%)_1fr]">
            <div className="relative min-h-[220px] overflow-hidden">
              <Img
                k={c.image}
                fill
                sizes="(max-width: 768px) 100vw, 42vw"
                className="object-cover brightness-[0.85]"
              />
              {/* Dissolve into the panel fill: downward on mobile where the image
                stacks above the copy, rightward on desktop where it sits beside it. */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] from-0% to-transparent to-55% md:bg-gradient-to-r md:from-transparent md:from-45% md:to-[#0A0A0A] md:to-100%" />
            </div>
            <div className="p-6 md:p-8">
              <h3 className="text-h3">{c.name}</h3>
              <p className="text-ink-4 mt-3 text-sm leading-relaxed">
                {c.body}
              </p>
              <ul className="mt-5 space-y-2.5">
                {c.bullets.map((b) => (
                  <li
                    key={b}
                    className="text-ink-2 flex items-start gap-2.5 text-sm"
                  >
                    <span
                      aria-hidden
                      className="bg-accent-400 mt-1.5 size-1.5 shrink-0 rounded-full"
                    />
                    {b}
                  </li>
                ))}
              </ul>
              <Button href={c.cta.href} variant="secondary" className="mt-6">
                {c.cta.label} <span aria-hidden>›</span>
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── 03 · APPLICATION CARDS ───────────────────────────────────────────── */
export function ApplicationCards({
  items,
}: {
  items: { name: string; body: string; image?: string }[];
}) {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {items.map((a) => (
        <article
          key={a.name}
          className="border-line rounded-card overflow-hidden border bg-[#0A0A0A]"
        >
          {a.image && (
            <div className="relative aspect-[16/7] overflow-hidden">
              <Img
                k={a.image}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover brightness-[0.78]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] from-0% via-[#0A0A0A]/35 via-42% to-transparent to-78%" />
            </div>
          )}
          <div className="p-5">
            <h3 className="text-ink text-base font-semibold">{a.name}</h3>
            <p className="text-ink-4 mt-2 text-sm leading-relaxed">{a.body}</p>
          </div>
        </article>
      ))}
    </div>
  );
}

/* ── 04 · CONDITIONS ──────────────────────────────────────────────────── */
const COND_ICON: Record<string, React.ReactNode> = {
  shield: <path d="M12 3l8 3v6c0 4.5-3.2 7.9-8 9-4.8-1.1-8-4.5-8-9V6z" />,
  wave: <path d="M3 12c2-4 4-4 6 0s4 4 6 0 4-4 6 0" />,
  thermo: (
    <>
      <path d="M12 14V4a2 2 0 1 1 4 0v10" transform="translate(-2)" />
      <circle cx="12" cy="17" r="3.5" />
    </>
  ),
  dust: <path d="M4 8h10M4 12h14M4 16h8M18 8h2M20 16h-2" />,
};

export function ConditionGrid({
  items,
}: {
  items: { icon: string; name: string; body: string }[];
}) {
  return (
    <div className="border-line rounded-card grid gap-8 border bg-[#0A0A0A] p-8 md:grid-cols-2 md:p-10">
      {items.map((c) => (
        <div key={c.name}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-accent-400 size-6"
            aria-hidden
          >
            {COND_ICON[c.icon]}
          </svg>
          <h3 className="text-ink mt-4 text-base font-semibold">{c.name}</h3>
          <p className="text-ink-4 mt-2 max-w-[46ch] text-sm leading-relaxed">
            {c.body}
          </p>
        </div>
      ))}
    </div>
  );
}

/* ── 06 · QUALITY ─────────────────────────────────────────────────────── */
export function QualityCards({
  items,
  links,
}: {
  items: { chip: string; name: string; body: string }[];
  links: { label: string; href: string }[];
}) {
  return (
    <>
      <div className="grid gap-5 md:grid-cols-3">
        {items.map((q) => (
          <div
            key={q.name}
            className="border-line rounded-card border bg-[#0A0A0A] p-6"
          >
            <span className="text-accent-400 bg-accent-400/10 rounded-pill px-3 py-1 text-[11px] font-medium">
              {q.chip}
            </span>
            <h3 className="text-ink mt-4 text-base font-semibold">{q.name}</h3>
            <p className="text-ink-4 mt-2 text-sm leading-relaxed">{q.body}</p>
          </div>
        ))}
      </div>
      {withoutDeadDownloads(links).length > 0 && (
        <div className="mt-8 flex flex-wrap gap-8">
          {withoutDeadDownloads(links).map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className="text-accent-400 inline-flex items-center gap-1.5 text-sm"
            >
              {l.label} <span aria-hidden>›</span>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}

/* ── 07 · EXPORT LANE ─────────────────────────────────────────────────── */
export function ExportLane({
  paragraphs,
  rows,
  card,
}: {
  paragraphs: string[];
  rows: { label: string; value: string }[];
  card?: { title: string; subtitle: string; regions: string[]; footnote?: string };
}) {
  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div>
        {paragraphs.map((p) => (
          <p key={p.slice(0, 24)} className="text-ink-4 mb-4 text-sm leading-relaxed">
            {p}
          </p>
        ))}
        <dl className="divide-line mt-8 divide-y">
          {rows.map((r) => (
            <div key={r.label} className="grid gap-2 py-4 sm:grid-cols-[160px_1fr]">
              <dt className="text-eyebrow text-ink-4 font-mono uppercase">
                {r.label}
              </dt>
              <dd className="text-ink-2 text-sm">{r.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      {card && (
        <div className="border-line rounded-card h-fit border bg-[#0A0A0A] p-7">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            className="text-accent-400 size-7"
            aria-hidden
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M3 12h18M12 3a15 15 0 0 1 0 18a15 15 0 0 1 0-18" />
          </svg>
          <h3 className="text-h3 mt-5">{card.title}</h3>
          <p className="text-ink-4 mt-1.5 text-sm">{card.subtitle}</p>
          <ul className="mt-5 space-y-2.5">
            {card.regions.map((r) => (
              <li key={r} className="text-ink-2 flex items-center gap-2.5 text-sm">
                <span aria-hidden className="bg-accent-400 size-1.5 shrink-0 rounded-full" />
                {r}
              </li>
            ))}
          </ul>
          {card.footnote && (
            <p className="border-line text-ink-4 mt-6 border-t pt-5 text-xs leading-relaxed">
              {card.footnote}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

/* ── 08 · FAQ ─────────────────────────────────────────────────────────── */
export function IndustryFAQ({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState(-1);
  return (
    <div className="mx-auto max-w-[880px] space-y-3">
      {items.map((f, i) => (
        <div
          key={f.q}
          className="border-line rounded-card border bg-[#0A0A0A]"
        >
          <button
            type="button"
            onClick={() => setOpen(open === i ? -1 : i)}
            aria-expanded={open === i}
            className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
          >
            <span className="text-ink text-sm font-medium">{f.q}</span>
            <span
              aria-hidden
              className={`text-accent-400 shrink-0 transition-transform ${open === i ? "rotate-180" : ""}`}
            >
              ⌄
            </span>
          </button>
          {/* The chevron rotated but the panel it controls appeared in a
              single frame, so the affordance animated and the content did not.
              `grid-template-rows: 0fr -> 1fr` animates height without
              measuring anything in JavaScript; the inner element needs
              `min-h-0` or it refuses to shrink below its content. The answer
              stays mounted, so it remains findable by in-page search and by
              crawlers whether or not it is open. */}
          <div
            className="grid transition-[grid-template-rows] duration-300 ease-standard motion-reduce:transition-none"
            style={{ gridTemplateRows: open === i ? "1fr" : "0fr" }}
          >
            <div className="min-h-0 overflow-hidden">
              <p
                className="text-ink-4 px-5 pb-5 text-sm leading-relaxed"
                aria-hidden={open !== i}
              >
                {f.a}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── 09 · CLOSING ─────────────────────────────────────────────────────── */
const CLOSE_ICON: Record<string, string> = { phone: "✆", email: "✉", cert: "⛊" };

export function ClosingBand({
  eyebrow,
  lines,
  accentLines,
  body,
  actions,
  contacts,
}: {
  eyebrow: string;
  lines: string[];
  accentLines: number[];
  body: string;
  actions: { label: string; href: string; variant: "primary" | "secondary" }[];
  contacts: { icon: string; text: string; href?: string }[];
}) {
  return (
    <section className="bg-[#050505] py-[70px]">
      <Container>
        <div className="text-center">
          <div className="flex items-center justify-center gap-3">
            <span aria-hidden className="bg-accent-400 h-px w-8" />
            <span className="text-eyebrow text-accent-400 font-mono uppercase">
              {eyebrow}
            </span>
          </div>
          <h2 className="text-h1 mx-auto mt-5 max-w-[22ch]">
            {lines.map((l, i) => (
              <span
                key={l}
                className={`block ${accentLines.includes(i) ? "text-accent-400" : ""}`}
              >
                {l}
                {/* Trailing space inside the block: invisible, but a crawler reads the lines with spaces. */}
                {i < lines.length - 1 ? " " : ""}
              </span>
            ))}
          </h2>
          <p className="text-ink-4 mx-auto mt-5 max-w-[58ch] text-sm leading-relaxed">
            {body}
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {actions.map((a) => (
              <Button key={a.label} href={a.href} variant={a.variant}>
                {a.label} {a.variant === "primary" && <span aria-hidden>→</span>}
              </Button>
            ))}
          </div>

          {contacts.length > 0 && (
            <ul className="border-line mt-12 flex flex-wrap justify-center gap-x-10 gap-y-3 border-t pt-8">
              {contacts.map((c) => (
                <li
                  key={c.text}
                  className="text-ink-4 flex items-center gap-2 text-xs"
                >
                  <span className="text-accent-400" aria-hidden>
                    {CLOSE_ICON[c.icon]}
                  </span>
                  {c.href ? (
                    <a
                      href={c.href}
                      className="hover:text-ink transition-colors"
                    >
                      {c.text}
                    </a>
                  ) : (
                    c.text
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </Container>
    </section>
  );
}

export { Eyebrow };

/* ── CUSTOM ENGINEERING PANEL ─────────────────────────────────────────── */

/**
 * Lifted verbatim out of the industry route.
 *
 * It was the one section written as inline JSX rather than a component, which
 * was fine while the route owned the order of everything. Once the page became
 * a block list it had to become a component like its neighbours, because a
 * block is dispatched to a component and there was nothing to dispatch to.
 *
 * The markup is unchanged — this is a move, not a rewrite, and nine live pages
 * are the reason for keeping it that way.
 */
export function CustomPanel({
  eyebrow,
  heading,
  body,
  bullets,
  cta,
  image,
  imageCaption,
}: {
  eyebrow: string;
  heading: string;
  body?: string;
  bullets: string[];
  cta: { label: string; href: string };
  image?: string;
  imageCaption?: { title: string; note: string };
}) {
  return (
    <div className="grid items-center gap-12 lg:grid-cols-2">
      <div>
        <Eyebrow variant="rule">{eyebrow}</Eyebrow>
        <h2 className="text-h1 mt-4 max-w-[18ch]">{heading}</h2>
        {body && (
          <p className="text-ink-4 mt-5 max-w-[52ch] text-sm leading-relaxed">
            {body}
          </p>
        )}
        <ul className="mt-6 space-y-2.5">
          {bullets.map((b) => (
            <li key={b} className="text-ink-2 flex items-start gap-2.5 text-sm">
              <span aria-hidden className="bg-accent-400 mt-1.5 size-1.5 shrink-0 rounded-full" />
              {b}
            </li>
          ))}
        </ul>
        <Button href={cta.href} className="mt-8">
          {cta.label} <span aria-hidden>→</span>
        </Button>
      </div>

      {image && (
        <div className="rounded-card relative aspect-[4/3] overflow-hidden">
          <Img k={image} fill sizes="(max-width:1024px) 100vw, 50vw" className="object-cover" />
          {imageCaption && (
            <div className="from-canvas absolute inset-x-0 bottom-0 bg-gradient-to-t to-transparent p-5">
              <p className="text-ink text-sm font-semibold">{imageCaption.title}</p>
              <p className="text-ink-4 mt-1 text-xs">{imageCaption.note}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
