"use client";

import { useState } from "react";
import { withoutDeadDownloads } from "@/lib/downloads";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import type { Crumb } from "@/lib/breadcrumbs";
import Link from "next/link";
import { Img } from "@/components/ui/Img";
import { Button } from "@/components/ui/Button";
import { Container, Eyebrow } from "@/components/ui/Section";
import {
  EnquiryForm,
  EnquiryStatus,
  EnquirySubmit,
} from "@/components/forms/EnquiryForm";

/* ────────────────────────────────────────────────────────────────────────
   HUB HERO
   Desktop: copy left, 2x2 stat grid right. Mobile: stacked, stats 2-up.
   ──────────────────────────────────────────────────────────────────────── */
/** Hero stat icons, matching the design. Inline SVG, no icon dependency. */
const STAT_ICON: Record<string, React.ReactNode> = {
  award: (
    <>
      <circle cx="12" cy="9" r="5" />
      <path d="M9 13.5 8 21l4-2 4 2-1-7.5" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a15 15 0 0 1 0 18a15 15 0 0 1 0-18" />
    </>
  ),
  chart: (
    <>
      <path d="M3 21V9l6-4 6 4v12" />
      <path d="M3 21h18M9 13v3M13 13v3" />
    </>
  ),
  shield: <path d="M12 3l8 3v6c0 4.5-3.2 7.9-8 9-4.8-1.1-8-4.5-8-9V6z" />,
};

function StatIcon({ name }: { name?: string }) {
  if (!name || !STAT_ICON[name]) return null;
  return (
    <span className="mb-4 grid size-11 place-items-center rounded-lg bg-[#172A30]">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-accent-400 size-5"
        aria-hidden
      >
        {STAT_ICON[name]}
      </svg>
    </span>
  );
}

export function HubHero({
  badge,
  lines,
  accentLines,
  intro,
  actions,
  stats,
  divider,
  image,
  breadcrumb,
}: {
  badge: string;
  lines: string[];
  accentLines: number[];
  intro: string;
  actions: { label: string; href: string; variant: "primary" | "secondary" }[];
  stats: { value: string; label: string; icon?: string }[];
  divider?: string;
  image?: string;
  breadcrumb?: readonly Crumb[];
}) {
  return (
    <header className="border-line relative isolate overflow-hidden border-b pt-28 pb-14 md:pt-40 md:pb-20">
      {image && (
        <>
          {/* The design suppresses this to ~15%; raised on request so the
              plant reads as a photograph. The left-to-right scrim still keeps
              the heading on a clean field. */}
          <Img
            k={image}
            fill
            priority
            sizes="100vw"
            className="-z-20 object-cover brightness-140"
          />
          {/* Only two scrims, and neither covers the right side: a left wash
              so the heading stays legible, and a short bottom fade into the
              section. Stacking full-bleed gradients was washing the plant out. */}
          <div className="from-surface-2 via-surface-2/55 absolute inset-0 -z-10 bg-gradient-to-r from-8% via-42% to-transparent to-72%" />
          <div className="from-surface-2 absolute inset-0 -z-10 bg-gradient-to-t from-0% to-transparent to-28%" />
        </>
      )}
      <Container>
        <Breadcrumb items={breadcrumb} className="mb-6" />
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_auto]">
          <div>
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

            <p className="text-ink-3 mt-6 max-w-[48ch] leading-relaxed">
              {intro}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {actions.map((a) => (
                <Button key={a.label} href={a.href} variant={a.variant}>
                  {a.label} <span aria-hidden>{a.variant === "primary" ? "→" : "▶"}</span>
                </Button>
              ))}
            </div>

            {divider && (
              <div className="mt-10 flex max-w-[430px] items-center gap-4">
                <span aria-hidden className="bg-line-2 h-px flex-1" />
                <span className="text-eyebrow text-ink-4 font-mono uppercase">
                  {divider}
                </span>
                <span aria-hidden className="bg-line-2 h-px flex-1" />
              </div>
            )}
          </div>

          {/* Two columns, right column offset down ~20px. Measured off the
              design, which staggers the pairs rather than aligning a 2x2. */}
          <dl className="grid grid-cols-2 gap-5 lg:w-[560px]">
            <div className="space-y-5">
              {stats
                .filter((_, i) => i % 2 === 0)
                .map((s) => (
                  <StatCard key={s.label} s={s} />
                ))}
            </div>
            <div className="space-y-5 lg:mt-5">
              {stats
                .filter((_, i) => i % 2 === 1)
                .map((s) => (
                  <StatCard key={s.label} s={s} />
                ))}
            </div>
          </dl>
        </div>
      </Container>
    </header>
  );
}

function StatCard({ s }: { s: { value: string; label: string; icon?: string } }) {
  return (
    <div className="border-line bg-surface-3/70 rounded-card border p-6 backdrop-blur-sm">
      <StatIcon name={s.icon} />
      <dd className="text-ink text-[2.25rem] leading-none font-bold">
        {s.value}
      </dd>
      <dt className="text-ink-4 mt-2.5 text-xs">{s.label}</dt>
    </div>
  );
}

/** Sector marquee. CSS animation only, no JS, near-zero runtime cost. */
export function Marquee({ items }: { items: string[] }) {
  const doubled = [...items, ...items];
  return (
    <div className="marquee-track border-line overflow-hidden border-b py-4">
      <div className="animate-marquee flex w-max gap-10 whitespace-nowrap motion-reduce:animate-none">
        {doubled.map((t, i) => (
          <span
            key={`${t}-${i}`}
            className="text-eyebrow text-ink-4 flex items-center gap-10 font-mono uppercase"
          >
            {t}
            <span className="text-accent-400" aria-hidden>
              +
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────
   PRODUCT RANGE — filterable bento grid
   ──────────────────────────────────────────────────────────────────────── */
type Card = {
  slug: string;
  title: string;
  kicker: string;
  tag: string;
  chips: string[];
  image: string;
  span: "wide" | "tall" | "normal";
  /** How this category is sold — "by the piece", "by the metre". */
  unit?: string;
  /** Set on the first card of a labelled group; opens a new grid above it. */
  groupLabel?: string;
};

export function ProductRange({
  filters,
  cards,
}: {
  filters: string[];
  cards: Card[];
}) {
  const [active, setActive] = useState(filters[0] ?? "All Products");
  // The filter decides what is SHOWN, never what is rendered: all cards are in
  // the DOM at first paint and the others are hidden. Unmounting would take
  // ten of eleven category links out of the crawlable page.
  const shown = (c: Card) => active === filters[0] || c.tag === active;
  const visible = cards;

  /**
   * The comp runs one uniform grid, then a labelled break, then a second
   * grid — the two continuous-form categories are set apart from the nine
   * sold by the piece. A card carrying `groupLabel` opens that new group.
   */
  const groups: { label?: string; cards: Card[] }[] = [];
  for (const c of visible) {
    if (!groups.length || c.groupLabel) {
      groups.push({ label: c.groupLabel, cards: [] });
    }
    groups[groups.length - 1].cards.push(c);
  }

  return (
    <div>
      {/* Filters sit in one rounded well rather than free-floating pills. */}
      <div className="mb-10 flex justify-center">
        <div className="border-line bg-surface-2 rounded-pill flex flex-wrap justify-center gap-1 border p-1.5">
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setActive(f)}
              aria-pressed={active === f}
              className={`rounded-pill px-4 py-2 text-xs font-medium transition-colors ${
                active === f
                  ? "bg-accent-400 text-canvas"
                  : "text-ink-3 hover:text-ink"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {groups.map((g, gi) => (
        <div key={g.label ?? gi}>
          {g.label && (
            <p className="border-accent-400/30 text-accent-400 rounded-pill mt-10 mb-5 inline-flex border px-4 py-1.5 font-mono text-[10px] tracking-[0.16em] uppercase">
              {g.label}
            </p>
          )}

          {/* Equal cards, three across. The mosaic spans the earlier comp
              used are gone: this one sizes every category the same. A group
              of two fills the row at half width rather than sitting short. */}
          <div
            className={`grid grid-cols-1 gap-4 sm:grid-cols-2 ${
              g.cards.length === 2 ? "lg:grid-cols-2" : "lg:grid-cols-3"
            }`}
          >
            {g.cards.map((c) => (
              <Link
                key={c.slug}
                hidden={!shown(c)}
                href={`/products/${c.slug}`}
                data-lift=""
                className={`group rounded-card relative isolate flex flex-col justify-end overflow-hidden p-5 ${
                  // A half-width card at the same row height as a third-width
                  // 4:3 one is 2:1. The comp widens this row, it does not
                  // deepen it.
                  g.cards.length === 2 ? "aspect-[4/3] lg:aspect-[2/1]" : "aspect-[4/3]"
                }`}
              >
                <Img
                  k={c.image}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="-z-10 object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
                <div className="from-canvas via-canvas/75 absolute inset-0 -z-10 bg-gradient-to-t to-transparent" />

                <span className="text-eyebrow bg-canvas/70 text-accent-400 rounded-pill absolute top-4 left-4 px-3 py-1 font-mono uppercase backdrop-blur">
                  {c.tag}
                </span>

                <p className="text-eyebrow text-accent-400 font-mono uppercase">
                  {c.kicker}
                </p>
                <h3 className="text-h3 mt-1.5">{c.title}</h3>
                {c.unit && (
                  <p className="text-ink-4 mt-1 font-mono text-xs">{c.unit}</p>
                )}

                <div className="mt-3 flex flex-wrap gap-2">
                  {c.chips.map((ch) => (
                    <span
                      key={ch}
                      className="border-line-2 text-ink-3 rounded-pill border px-2.5 py-1 text-[11px]"
                    >
                      {ch}
                    </span>
                  ))}
                </div>

                <span className="text-accent-400 mt-4 flex items-center gap-1.5 text-sm font-medium">
                  View Details
                  <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
                    &rarr;
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────
   STAT CARDS · PROCESS · CAPABILITIES
   ──────────────────────────────────────────────────────────────────────── */
export function StatCards({
  stats,
}: {
  stats: { value: string; label: string; sub?: string }[];
}) {
  return (
    <dl className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((s) => (
        <div
          key={s.label}
          className="border-line bg-surface-3 rounded-card border p-6 text-center"
        >
          <dd className="text-accent-400 text-3xl font-bold md:text-4xl">
            {s.value}
          </dd>
          <dt className="text-ink mt-2 text-sm font-medium">{s.label}</dt>
          {s.sub && <p className="text-ink-4 mt-1 text-xs">{s.sub}</p>}
        </div>
      ))}
    </dl>
  );
}

export function ProcessSteps({
  steps,
}: {
  steps: { n: string; title: string; body: string }[];
}) {
  return (
    <ol className="space-y-4">
      {steps.map((s) => (
        <li
          key={s.n}
          className="border-line bg-surface-3 rounded-card flex gap-4 border p-5"
        >
          <span className="text-accent-400 bg-accent-400/10 grid size-9 shrink-0 place-items-center rounded-lg font-mono text-xs font-bold">
            {s.n}
          </span>
          <div>
            <h3 className="text-ink text-sm font-semibold">{s.title}</h3>
            <p className="text-ink-4 mt-1.5 text-sm leading-relaxed">{s.body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function CapabilitiesPanel({
  heading,
  items,
  cta,
}: {
  heading: string;
  items: string[];
  cta?: { heading: string; body: string; label: string; href: string };
}) {
  return (
    <div className="border-line bg-surface-3 rounded-card border p-6 md:p-8">
      <h3 className="text-h3">{heading}</h3>
      <ul className="mt-6 grid gap-x-6 gap-y-3 sm:grid-cols-2">
        {items.map((i) => (
          <li key={i} className="text-ink-2 flex items-start gap-2.5 text-sm">
            <span className="text-accent-400 mt-0.5 shrink-0" aria-hidden>
              ⊘
            </span>
            {i}
          </li>
        ))}
      </ul>

      {cta && (
        <div className="border-accent-400/40 mt-8 rounded-card border bg-[#020909] p-5">
          <p className="text-ink text-sm font-semibold">{cta.heading}</p>
          <p className="text-ink-4 mt-1.5 text-sm leading-relaxed">{cta.body}</p>
          <Button href={cta.href} className="mt-4">
            {cta.label}
          </Button>
        </div>
      )}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────
   COMPOUND SELECTOR
   ──────────────────────────────────────────────────────────────────────── */
type Compound = {
  code: string;
  name: string;
  summary: string;
  dot: string;
  temp: string;
  hardness: string;
  bestFor: string;
  tags: string[];
  applications: string[];
};

export function CompoundSelector({ items }: { items: Compound[] }) {
  const [i, setI] = useState(0);
  // Every panel stays in the DOM, hidden rather than unmounted: a panel that mounts on click does not exist for a crawler, and these are the passages an assistant lifts.
  const panelId = (k: string) =>
    `hub-compound-${k.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2" role="tablist">
        {items.map((m, idx) => (
          <button
            key={m.code}
            role="tab"
            id={`${panelId(m.code)}-tab`}
            aria-controls={panelId(m.code)}
            aria-selected={idx === i}
            onClick={() => setI(idx)}
            className={`rounded-card inline-flex items-center gap-2 border px-4 py-2 text-xs font-medium transition-colors ${
              idx === i
                ? "border-accent-400 text-ink bg-accent-400/10"
                : "border-line text-ink-3 hover:text-ink"
            }`}
          >
            <span
              className="size-2 rounded-full"
              style={{ backgroundColor: m.dot }}
            />
            {m.code}
          </button>
        ))}
      </div>

      {items.map((c, idx) => (
        <div
          key={c.code}
          id={panelId(c.code)}
          role="tabpanel"
          aria-labelledby={`${panelId(c.code)}-tab`}
          hidden={idx !== i}
        >
          <div className="border-line bg-surface-3 rounded-card grid gap-8 border p-6 md:p-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)]">
            <div>
              <span
                className="rounded-card inline-grid size-12 place-items-center text-sm font-bold"
                style={{ backgroundColor: `${c.dot}22`, color: c.dot }}
              >
                {c.code}
              </span>
              <h3 className="text-h3 mt-4">{c.code}</h3>
              <p className="text-ink-4 mt-1 text-sm">{c.name}</p>
              <p className="text-ink-3 mt-4 text-sm leading-relaxed">
                {c.summary}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {c.tags.map((t) => (
                  <span
                    key={t}
                    className="text-accent-400 border-accent-400/30 rounded-pill border px-2.5 py-1 text-[11px]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <p className="text-ink text-sm font-semibold">Key Properties</p>
              <dl className="mt-4 space-y-2.5">
                {[
                  ["Temperature Range", c.temp],
                  ["Hardness Range", c.hardness],
                  ["Best For", c.bestFor],
                ].map(([k, v]) => (
                  <div
                    key={k}
                    className="border-line bg-surface flex items-center justify-between gap-4 rounded-lg border px-4 py-3"
                  >
                    <dt className="text-ink-4 text-xs">{k}</dt>
                    <dd className="text-ink text-sm font-medium">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div>
              <p className="text-ink text-sm font-semibold">
                Typical Applications
              </p>
              <ol className="mt-4 space-y-2.5">
                {c.applications.map((a, idx) => (
                  <li
                    key={a}
                    className="border-line bg-surface flex items-center gap-3 rounded-lg border px-4 py-3"
                  >
                    <span className="text-accent-400 font-mono text-[11px]">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <span className="text-ink-2 text-sm">{a}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────
   SECTOR SELECTOR
   ──────────────────────────────────────────────────────────────────────── */
type Sector = {
  name: string;
  body: string;
  products: string;
  clients: string;
  href: string;
  image?: string;
};

export function SectorSelector({ items }: { items: Sector[] }) {
  const [i, setI] = useState(0);
  // Every panel stays in the DOM, hidden rather than unmounted — these nine passages are the product-to-industry crossover content, and unmounting eight of nine deletes them from the crawl.
  const panelId = (k: string) =>
    `hub-sector-${k.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <div className="grid grid-cols-2 gap-3 self-start">
        {items.map((m, idx) => (
          <button
            key={m.name}
            id={`${panelId(m.name)}-tab`}
            aria-controls={panelId(m.name)}
            onClick={() => setI(idx)}
            aria-pressed={idx === i}
            className={`rounded-card border p-4 text-left transition-colors ${
              idx === i
                ? "border-accent-400 bg-accent-400/10"
                : "border-line bg-surface-3 hover:border-line-2"
            }`}
          >
            <span
              className={`block text-sm font-medium ${idx === i ? "text-ink" : "text-ink-3"}`}
            >
              {m.name}
            </span>
          </button>
        ))}
      </div>

      {items.map((s, idx) => (
        <div
          key={s.name}
          id={panelId(s.name)}
          role="tabpanel"
          aria-labelledby={`${panelId(s.name)}-tab`}
          hidden={idx !== i}
        >
          <div className="border-line bg-surface-3 rounded-card overflow-hidden border">
            <div className="bg-surface relative h-48 overflow-hidden md:h-64">
              {s.image && (
                <>
                  <Img
                    k={s.image}
                    fill
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover brightness-[0.8]"
                  />
                  <div className="from-surface-3 via-surface-3/35 absolute inset-0 bg-gradient-to-t from-0% via-40% to-transparent to-78%" />
                </>
              )}
              <span className="text-eyebrow bg-canvas/70 text-ink absolute top-4 left-4 z-10 rounded-pill px-3 py-1 font-mono uppercase backdrop-blur">
                {s.name}
              </span>
            </div>
            <div className="p-6">
              <p className="text-ink-2 leading-relaxed">{s.body}</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {[
                  ["Products Supplied", s.products],
                  ["Typical Clients", s.clients],
                ].map(([k, v]) => (
                  <div
                    key={k}
                    className="border-line bg-surface rounded-lg border px-4 py-3"
                  >
                    <p className="text-eyebrow text-ink-4 font-mono uppercase">
                      {k}
                    </p>
                    <p className="text-ink mt-1.5 text-sm">{v}</p>
                  </div>
                ))}
              </div>
              <Button href={s.href} className="mt-5">
                Find {s.name} Solutions <span aria-hidden>→</span>
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────
   CERTIFICATIONS · VALIDATION · CATALOGUE · FAQ
   ──────────────────────────────────────────────────────────────────────── */
export function ValidationPanel({
  items,
  cta,
  heading,
  body,
  eyebrow,
}: {
  items: string[];
  heading: string;
  body: string;
  eyebrow: string;
  cta?: { label: string; href: string };
}) {
  return (
    <div className="border-line bg-surface-3 rounded-card grid gap-8 border p-6 md:p-10 lg:grid-cols-2">
      <div>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 className="text-h2 mt-3">{heading}</h2>
        <p className="text-ink-4 mt-4 text-sm leading-relaxed">{body}</p>
        {cta && withoutDeadDownloads([cta]).length > 0 && (
          <Button href={cta.href} className="mt-6">
            {cta.label}
          </Button>
        )}
      </div>
      <ul className="grid gap-3 sm:grid-cols-2">
        {items.map((t) => (
          <li
            key={t}
            className="border-line bg-surface text-ink-2 flex items-center gap-2.5 rounded-lg border px-4 py-3 text-sm"
          >
            <span className="bg-accent-400 size-1.5 shrink-0 rounded-full" />
            {t}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function CatalogueBlock({
  heading,
  body,
  bullets,
  formHeading,
  formBody,
  submitLabel,
  footnote,
}: {
  heading: string;
  body: string;
  bullets: string[];
  formHeading: string;
  formBody: string;
  submitLabel: string;
  footnote?: string;
}) {
  const words = heading.split(" ");
  const accent = words.splice(-2).join(" ");

  return (
    <div className="border-line bg-surface-3 rounded-card grid gap-10 border p-6 md:p-12 lg:grid-cols-2">
      <div>
        <span className="bg-accent-400/10 text-accent-400 grid size-11 place-items-center rounded-lg">
          ▤
        </span>
        <h2 className="text-h1 mt-6">
          {words.join(" ")} <span className="text-accent-400">{accent}</span>
        </h2>
        <p className="text-ink-4 mt-4 text-sm leading-relaxed">{body}</p>
        <ul className="mt-6 space-y-3">
          {bullets.map((b) => (
            <li key={b} className="text-ink-2 flex items-start gap-2.5 text-sm">
              <span className="text-accent-400 shrink-0" aria-hidden>
                ▸
              </span>
              {b}
            </li>
          ))}
        </ul>
      </div>

      <div className="border-line bg-surface rounded-card border p-6">
        <p className="text-ink font-semibold">{formHeading}</p>
        <p className="text-ink-4 mt-1 text-sm">{formBody}</p>
        <EnquiryForm source="catalogue" className="mt-5 space-y-4">
          {[
            ["name", "Full Name", "Your Name", "text"],
            ["email", "Work Email", "you@company.com", "email"],
            ["company", "Company", "Company Name", "text"],
          ].map(([field, label, ph, type]) => (
            <label key={label} className="block">
              <span className="text-eyebrow text-ink-4 font-mono uppercase">
                {label}
              </span>
              <input
                name={field}
                type={type}
                placeholder={ph}
                className="border-line bg-surface-3 text-ink placeholder:text-ink-4 focus:border-accent-400 mt-2 w-full rounded-lg border px-4 py-3 text-sm"
              />
            </label>
          ))}
          <EnquirySubmit className="bg-accent-400 text-ink hover:opacity-90 w-full rounded-lg px-6 py-3 text-sm font-semibold transition-colors">
            ↓ {submitLabel}
          </EnquirySubmit>
          <EnquiryStatus />
        </EnquiryForm>
        {footnote && (
          <p className="text-ink-4 mt-3 text-center text-[11px]">{footnote}</p>
        )}
      </div>
    </div>
  );
}

export function FAQAccordion({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState(0);
  return (
    <div className="space-y-3">
      {items.map((f, i) => (
        <div
          key={f.q}
          className={`rounded-card border ${open === i ? "border-accent-400/40 bg-[#020909]" : "border-line bg-surface-3"}`}
        >
          <button
            type="button"
            onClick={() => setOpen(open === i ? -1 : i)}
            aria-expanded={open === i}
            className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
          >
            <span className="text-ink text-sm font-medium">{f.q}</span>
            <span
              className={`grid size-6 shrink-0 place-items-center rounded-md text-sm ${
                open === i
                  ? "bg-accent-400 text-canvas"
                  : "border-line text-ink-3 border"
              }`}
              aria-hidden
            >
              {open === i ? "−" : "+"}
            </span>
          </button>
          <p
            hidden={open !== i}
            className="text-ink-4 px-5 pb-5 text-sm leading-relaxed"
          >
            {f.a}
          </p>
        </div>
      ))}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────
   REQUEST A QUOTE — closing band
   Measured: left column 383px, gutter 33px, form panel 799px.
   contact card #13161B · promise card #0C161A w/ accent border
   form panel #13171C · input fill #0F1116
   ──────────────────────────────────────────────────────────────────────── */
const CONTACT_ICON: Record<string, React.ReactNode> = {
  phone: <path d="M4 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L14 13l5 2v4a1 1 0 0 1-1 1A15 15 0 0 1 3 5a1 1 0 0 1 1-1z" />,
  email: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </>
  ),
  address: (
    <>
      <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
};

export function QuoteBand({
  eyebrow,
  heading,
  body,
  contactHeading,
  contacts,
  promiseHeading,
  promises,
  fields,
  submitLabel,
}: {
  eyebrow: string;
  heading: string;
  body?: string;
  contactHeading: string;
  contacts: { icon: string; label: string; value: string; note?: string }[];
  promiseHeading: string;
  promises: string[];
  fields: { label: string; placeholder: string; type: string; full: boolean }[];
  submitLabel: string;
}) {
  const words = heading.split(" ");
  const accent = words.pop();

  return (
    <Container>
      <div className="mb-12 text-center">
        <div className="flex items-center justify-center gap-4">
          <span aria-hidden className="bg-accent-400 h-px w-8" />
          <span className="text-eyebrow text-accent-400 font-mono uppercase">
            {eyebrow}
          </span>
          <span aria-hidden className="bg-accent-400 h-px w-8" />
        </div>
        <h2 className="text-h1 mt-4">
          {words.join(" ")} <span className="text-accent-400">{accent}</span>
        </h2>
        {body && (
          <p className="text-ink-4 mx-auto mt-4 max-w-[62ch] text-sm leading-relaxed">
            {body}
          </p>
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-[383px_1fr]">
        <div className="space-y-6">
          <div className="border-line rounded-card border bg-[#13161B] p-6">
            <h3 className="text-ink text-base font-semibold">
              {contactHeading}
            </h3>
            <ul className="mt-5 space-y-5">
              {contacts.map((c) => (
                <li key={c.label} className="flex gap-3.5">
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-[#172A30]">
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
                      {CONTACT_ICON[c.icon]}
                    </svg>
                  </span>
                  <div>
                    <p className="text-eyebrow text-ink-4 font-mono uppercase">
                      {c.label}
                    </p>
                    <p className="text-ink mt-1 text-sm font-medium">
                      {c.value}
                    </p>
                    {c.note && (
                      <p className="text-ink-4 mt-0.5 text-xs">{c.note}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-card border border-[#16323A] bg-[#0C161A] p-6">
            <h3 className="text-ink text-base font-semibold">
              {promiseHeading}
            </h3>
            <ul className="mt-4 space-y-3">
              {promises.map((p) => (
                <li
                  key={p}
                  className="text-ink-2 flex items-center gap-2.5 text-sm"
                >
                  <span className="text-accent-400 shrink-0" aria-hidden>
                    ⊘
                  </span>
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <EnquiryForm
          source="products"
          className="border-line rounded-card border bg-[#13171C] p-6 md:p-8"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            {fields.map((f) => (
              <label
                key={f.label}
                className={f.full ? "sm:col-span-2" : undefined}
              >
                <span className="text-eyebrow text-ink-4 font-mono uppercase">
                  {f.label}
                </span>
                {f.type === "textarea" ? (
                  <textarea
                    rows={4}
                    placeholder={f.placeholder}
                    className="border-line text-ink placeholder:text-ink-4 focus:border-accent-400 mt-2 w-full rounded-lg border bg-[#0F1116] px-4 py-3 text-sm"
                  />
                ) : f.type === "select" ? (
                  <select
                    defaultValue=""
                    className="border-line text-ink-4 focus:border-accent-400 mt-2 w-full rounded-lg border bg-[#0F1116] px-4 py-3 text-sm"
                  >
                    <option value="" disabled>
                      {f.placeholder}
                    </option>
                  </select>
                ) : (
                  <input
                    type={f.type}
                    placeholder={f.placeholder}
                    className="border-line text-ink placeholder:text-ink-4 focus:border-accent-400 mt-2 w-full rounded-lg border bg-[#0F1116] px-4 py-3 text-sm"
                  />
                )}
              </label>
            ))}
          </div>

          <EnquirySubmit className="bg-accent-400 text-ink hover:opacity-90 mt-7 w-full rounded-cta px-6 py-3.5 text-sm font-semibold transition-colors">
            ➤ {submitLabel}
          </EnquirySubmit>
          <EnquiryStatus />
        </EnquiryForm>
      </div>
    </Container>
  );
}
