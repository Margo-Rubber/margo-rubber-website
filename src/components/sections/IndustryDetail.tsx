"use client";

import { withoutDeadDownloads } from "@/lib/downloads";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import type { Crumb } from "@/lib/breadcrumbs";
import Link from "next/link";
import { Img } from "@/components/ui/Img";
import { InView } from "@/components/ui/InView";
import { Button } from "@/components/ui/Button";
import { Container, Eyebrow, HeroChips } from "@/components/ui/Section";
import { emphasised } from "@/components/ui/Emphasis";
import { hrefFor, productBySlug } from "@/content/routes";
import { displaySize } from "@/lib/display-size";

/* ── HERO ─────────────────────────────────────────────────────────────── */
export function IndustryHero({
  badge,
  lines,
  accentLines,
  intro,
  actions,
  image,
  boost = false,
  framed = false,
  breadcrumb,
  chips = [],
  lead,
  note,
  answer,
}: {
  badge: string;
  lines: string[];
  accentLines: number[];
  intro: string;
  /** Short uppercase facts under the subhead (sheets 41–42). */
  chips?: readonly string[];
  /** Bolder line above the intro. */
  lead?: string;
  /** Short note set beside the buttons. */
  note?: string;
  /** Summary paragraph under the buttons. */
  answer?: string;
  actions: { label: string; href: string; variant: "primary" | "secondary" }[];
  image?: string;
  /** Only for sources already faded to black; a normal photo would blow out. */
  boost?: boolean;
  /** Set the photo whole on the right, at its own proportions, instead of filling the hero. */
  framed?: boolean;
  breadcrumb?: readonly Crumb[];
}) {
  return (
    <header className="relative isolate overflow-hidden hero-offset pb-16 md:pb-24">
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
          ) : framed ? (
            /* Medical Devices: the photo's own black background meets the page,
               so its edges are masked soft rather than overlaid. */
            <>
              <div
                className="absolute top-24 right-0 -z-20 aspect-[2000/1056] w-full opacity-40 lg:top-1/2 lg:right-[3%] lg:w-[74%] lg:-translate-y-1/2 lg:opacity-100"
                style={{
                  maskImage:
                    "linear-gradient(to right, transparent, #000 30%, #000 94%, transparent), linear-gradient(to bottom, transparent, #000 10%, #000 85%, transparent)",
                  maskComposite: "intersect",
                }}
              >
                <Img k={image} fill priority sizes="(min-width: 1024px) 74vw, 100vw" className="object-contain" />
              </div>
              <div className="from-canvas absolute inset-0 -z-10 bg-gradient-to-t from-0% to-transparent to-25%" />
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

        <h1 className={`${displaySize(lines)} mt-6`}>
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

        {lead && (
          <p className="text-ink-2 mt-5 max-w-[58ch] text-base leading-relaxed font-semibold">{lead}</p>
        )}
        <p className={`text-ink-3 ${lead ? "mt-3" : "mt-6"} max-w-[58ch] leading-relaxed`}>{emphasised(intro)}</p>

        <HeroChips chips={chips} />

        <div className="mt-8 flex flex-wrap items-center gap-3">
          {actions.map((a) => (
            <Button key={a.label} href={a.href} variant={a.variant}>
              {a.label} <span aria-hidden>→</span>
            </Button>
          ))}
          {note && <p className="text-ink text-sm leading-snug sm:ml-2">{note}</p>}
        </div>

        {answer && (
          <p className="text-ink-3 mt-6 max-w-[68ch] text-[0.9375rem] leading-relaxed">{answer}</p>
        )}
      </Container>
    </header>
  );
}

/* ── 02 · COMPONENT GRID ──────────────────────────────────────────────── */
type Component = {
  key: string;
  name: string;
  body: string;
  bullets: string[];
  image: string;
  cta: { label: string; href: string };
  group?: string;
};

function liveProductHref(href: string): string {
  const m = href.match(/^\/products\/([a-z0-9-]+)$/);
  const entry = m ? productBySlug(m[1]) : undefined;
  return entry ? hrefFor(entry) : href;
}

/**
 * Every component this industry is supplied with, shown at once as a card
 * grid (was a tab strip that showed one at a time). Card layout follows the
 * category pages' parts grid: photo, number, name, one line of copy. The
 * whole card is the link. Bullets stay in the content but are not drawn here.
 *
 * Motion: cards rise in one after another as the grid scrolls into view, and
 * lift with a teal edge on hover (.margo-ind-card in globals.css). Reduced
 * motion and no-JS both get the plain, fully visible grid.
 *
 * Exported under the old name so BlockRenderer and the CMS block type are
 * untouched.
 */
export function ComponentTabs({ items, footnote }: { items: Component[]; footnote?: string }) {
  // Same ids the tab panels carried, so any existing #component-… link still lands.
  const cardId = (k: string) =>
    `component-${k.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

  // Named groups (Medical Devices, Nov 2026): consecutive cards sharing a
  // heading are listed under it. The photos are product cut-outs, so they
  // are shown whole on a light plate rather than cropped, and the cards
  // carry no running number — the groups do the ordering.
  if (items.some((c) => c.group)) {
    const groups: { title?: string; items: Component[] }[] = [];
    for (const c of items) {
      const last = groups[groups.length - 1];
      if (last && last.title === c.group) last.items.push(c);
      else groups.push({ title: c.group, items: [c] });
    }
    return (
      <>
        {groups.map((g, gi) => (
          <div key={`${g.title ?? ""}-${gi}`} className={gi > 0 ? "mt-10" : undefined}>
            {g.title && <h3 className="text-ink font-display mb-4 text-lg font-semibold">{g.title}</h3>}
            <InView as="ul" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {g.items.map((c, idx) => (
                <li
                  key={c.name}
                  id={cardId(c.name)}
                  data-lift=""
                  style={{ "--i": idx } as React.CSSProperties}
                  className="margo-ind-card rounded-card border-line group overflow-hidden border bg-[#080808]"
                >
                  <Link href={liveProductHref(c.cta.href)} className="flex h-full flex-col">
                    <div className="relative aspect-[4/3] overflow-hidden bg-[#F3F7F8]">
                      <Img
                        k={c.image}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                        className="margo-ind-card-img object-contain"
                      />
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <h4 className="text-ink text-base leading-snug font-semibold">{c.name}</h4>
                      <p className="text-ink-4 mt-2 text-sm leading-relaxed">{c.body}</p>
                      <span className="text-accent-400 mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-medium">
                        View product
                        <span aria-hidden className="margo-ind-card-arrow">
                          ›
                        </span>
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </InView>
          </div>
        ))}
        {footnote && <p className="text-ink-4 mt-5 text-xs">{footnote}</p>}
      </>
    );
  }

  return (
    <>
    <InView as="ol" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((c, idx) => (
        <li
          key={c.name}
          id={cardId(c.name)}
          data-lift=""
          style={{ "--i": idx } as React.CSSProperties}
          className="margo-ind-card rounded-card border-line group overflow-hidden border bg-[#080808]"
        >
          {/* A category the registry has not flipped live (Diaphragms,
              sheet 36) sends the click where every other link to it
              goes — the contact form, never a 404. */}
          <Link href={liveProductHref(c.cta.href)} className="flex h-full flex-col">
            <div className="relative aspect-[4/3] overflow-hidden bg-white">
              <Img
                k={c.image}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                className="margo-ind-card-img object-cover"
              />
            </div>
            <div className="flex flex-1 flex-col p-6">
              <p className="text-eyebrow text-ink-4 margo-ind-card-num font-mono">
                {String(idx + 1).padStart(2, "0")}
              </p>
              <h3 className="text-ink mt-3 text-base leading-snug font-semibold">
                {c.name}
              </h3>
              <p className="text-ink-4 mt-2 text-sm leading-relaxed">{c.body}</p>
              <span className="text-accent-400 mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-medium">
                View product
                <span aria-hidden className="margo-ind-card-arrow">
                  ›
                </span>
              </span>
            </div>
          </Link>
        </li>
      ))}
    </InView>
    {footnote && <p className="text-ink-4 mt-5 text-xs">{footnote}</p>}
    </>
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
        <div
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
            <p className="text-ink-4 mt-2 text-sm leading-relaxed">{emphasised(a.body, "text-ink-2 font-semibold")}</p>
          </div>
        </div>
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
  table,
}: {
  items: { icon: string; name: string; body: string }[];
  /** Optional table under the cards; the first cell of each row heads it. */
  table?: { caption: string; columns: string[]; rows: { cells: string[] }[] };
}) {
  return (
    <>
    {/* Three cards sit in one row of three rather than two-and-one. */}
    <div
      className={`border-line rounded-card grid gap-8 border bg-[#0A0A0A] p-8 md:p-10 ${
        items.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2"
      }`}
    >
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
            {emphasised(c.body, "text-ink-2 font-semibold")}
          </p>
        </div>
      ))}
    </div>
    {table && (
      <div className="border-line rounded-card mt-8 overflow-x-auto border bg-[#0A0A0A]">
        <table className="w-full min-w-[540px] border-collapse text-left text-sm">
          <caption className="text-ink font-display px-5 pt-5 pb-2 text-left font-semibold">{table.caption}</caption>
          <thead>
            <tr>
              {table.columns.map((h) => (
                <th
                  key={h}
                  scope="col"
                  className="border-line text-ink-4 border-t px-5 py-3.5 align-top font-mono text-[0.7rem] font-medium tracking-[0.08em] uppercase"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((r) => (
              <tr key={r.cells[0]}>
                {r.cells.map((cell, i) =>
                  i === 0 ? (
                    <th key={i} scope="row" className="border-line text-ink border-t px-5 py-3.5 align-top font-semibold">
                      {cell}
                    </th>
                  ) : (
                    <td key={i} className="border-line text-ink-3 border-t px-5 py-3.5 align-top">
                      {cell}
                    </td>
                  ),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
    </>
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
            {/* Sheets 22–28 write the card as a name and a body, no chip. */}
            {q.chip && (
              <span className="text-accent-400 bg-accent-400/10 rounded-pill px-3 py-1 text-[11px] font-medium">
                {q.chip}
              </span>
            )}
            <h3 className={`text-ink text-base font-semibold ${q.chip ? "mt-4" : ""}`}>{q.name}</h3>
            <p className="text-ink-4 mt-2 text-sm leading-relaxed">{emphasised(q.body, "text-ink-2 font-semibold")}</p>
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
/**
 * Native <details>/<summary>, as on the part pages and guides. The answer is
 * ordinary, unhidden text in the HTML whether the item is open or not, so
 * screen readers, in-page search, Google and AI answer engines all read it
 * (ticket T07: the old accordion marked closed answers aria-hidden, and
 * extractors dropped the whole section). The chevron is drawn in CSS
 * (.margo-faq in globals.css), not typed into the question.
 */
export function IndustryFAQ({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="mx-auto max-w-[880px] space-y-3">
      {items.map((f) => (
        <details key={f.q} className="margo-faq border-line rounded-card border bg-[#0A0A0A]">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left [&::-webkit-details-marker]:hidden">
            {/* The question is a real heading (the sheets' "questions are <h3>"). */}
            <h3 className="text-ink m-0 text-sm font-medium">{f.q}</h3>
          </summary>
          <p className="text-ink-4 px-5 pb-5 text-sm leading-relaxed">
            {emphasised(f.a, "text-ink-2 font-semibold")}
          </p>
        </details>
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
            {emphasised(body)}
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
  steps,
}: {
  eyebrow: string;
  heading: string;
  body?: string;
  bullets: string[];
  cta: { label: string; href: string };
  image?: string;
  /** A numbered process; takes the photo's column when there is no photo. */
  steps?: { heading: string; note?: string; items: string[] };
}) {
  const process = steps && (
    <div>
      <h3 className="text-ink text-base font-semibold">{steps.heading}</h3>
      {steps.note && <p className="text-ink-4 mt-2 text-sm leading-relaxed">{steps.note}</p>}
      <ol className="mt-5 grid gap-3">
        {steps.items.map((s, i) => (
          <li key={s} className="text-ink-2 flex items-start gap-3 text-sm leading-relaxed">
            <span
              aria-hidden
              className="border-accent-400/40 text-accent-400 mt-px grid size-6 shrink-0 place-items-center rounded-full border font-mono text-[0.7rem]"
            >
              {i + 1}
            </span>
            {s}
          </li>
        ))}
      </ol>
    </div>
  );

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
        {bullets.length > 0 && (
          <ul className="mt-6 space-y-2.5">
            {bullets.map((b) => (
              <li key={b} className="text-ink-2 flex items-start gap-2.5 text-sm">
                <span aria-hidden className="bg-accent-400 mt-1.5 size-1.5 shrink-0 rounded-full" />
                {b}
              </li>
            ))}
          </ul>
        )}
        {process && image && <div className="mt-8">{process}</div>}
        <Button href={cta.href} className="mt-8">
          {cta.label} <span aria-hidden>→</span>
        </Button>
      </div>

      {/* No photo (Medical Devices, Nov 2026: the plant photo was taken off):
          the numbered process takes its column. */}
      {process && !image && (
        <div className="border-line rounded-card border bg-[#0A0A0A] p-7 md:p-8">{process}</div>
      )}

      {image && (
        <div className="rounded-card relative aspect-[4/3] overflow-hidden">
          {/* No caption over the photo: the "Nashik, Maharashtra, India" line
              was taken off every industry page (client, 2 Nov 2026). */}
          <Img k={image} fill sizes="(max-width:1024px) 100vw, 50vw" className="object-cover" />
        </div>
      )}
    </div>
  );
}
