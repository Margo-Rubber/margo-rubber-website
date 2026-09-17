"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Section";

/* ── types ──────────────────────────────────────────────────────────────── */
export type Guide = {
  slug: string;
  h1: string;
  intro: string;
  category: string;
  icon: string;
  readingMinutes: number;
  featured: boolean;
  featuredBlurb?: string;
};

export type Category = { key: string; label: string; blurb?: string };

/* ── icons ──────────────────────────────────────────────────────────────── */
const ICONS: Record<string, React.ReactNode> = {
  flask: (
    <>
      <path d="M9.5 3.5h5M10.5 3.5v5.8l-4.6 7.9A2.2 2.2 0 0 0 7.8 21h8.4a2.2 2.2 0 0 0 1.9-3.8l-4.6-7.9V3.5" />
      <path d="M8 15.5c1.8-1 3-.2 4.4.4 1.3.6 2.3.5 3.3-.2" />
    </>
  ),
  thermometer: (
    <>
      <path d="M14 14.8V5.5a2 2 0 1 0-4 0v9.3a4 4 0 1 0 4 0z" />
      <path d="M12 9.5v6.2" />
    </>
  ),
  book: (
    <>
      <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H10a2 2 0 0 1 2 2v13a2 2 0 0 0-2-2H5.5A1.5 1.5 0 0 1 4 15.5z" />
      <path d="M20 5.5A1.5 1.5 0 0 0 18.5 4H14a2 2 0 0 0-2 2v13a2 2 0 0 1 2-2h4.5a1.5 1.5 0 0 0 1.5-1.5z" />
    </>
  ),
  ruler: (
    <>
      <path d="m14.5 3.5 6 6L9.5 20.5l-6-6z" />
      <path d="m7 11 2 2M10 8l2 2M13 5l2 2" />
    </>
  ),
  wrench: (
    <path d="M15.5 3.5a5 5 0 0 0-4.6 7l-7 7 2.6 2.6 7-7a5 5 0 0 0 6.3-6.3l-3 3-2.6-2.6 3-3a5 5 0 0 0-1.7-.7z" />
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17M12 3.5c2.4 2.4 3.6 5.4 3.6 8.5S14.4 18.1 12 20.5c-2.4-2.4-3.6-5.4-3.6-8.5S9.6 5.9 12 3.5z" />
    </>
  ),
  clipboard: (
    <>
      <path d="M9 4.5H7.5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-12a2 2 0 0 0-2-2H15" />
      <rect x="9" y="2.8" width="6" height="3.4" rx="1" />
      <path d="M8.8 12h6.4M8.8 15.5h4" />
    </>
  ),
  chat: (
    <>
      <path d="M20.5 12.5a7.5 7.5 0 0 1-7.5 7.5H8l-4.5 2.5.9-4.4A7.5 7.5 0 0 1 13 5a7.5 7.5 0 0 1 7.5 7.5z" />
      <path d="M8.5 12h7M8.5 15h4" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.5 4.5" />
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

function IconTile({ name }: { name: string }) {
  return (
    <span className="border-accent-400/20 bg-accent-400/10 text-accent-400 grid size-10 shrink-0 place-items-center rounded-lg border">
      <Icon name={name} />
    </span>
  );
}

/* ── guide card ─────────────────────────────────────────────────────────── */
function GuideCard({
  g,
  label,
  hidden = false,
}: {
  g: Guide;
  label: string;
  hidden?: boolean;
}) {
  return (
    <li
      data-lift=""
      hidden={hidden}
      className="rounded-card border-line hover:border-accent-400/40 flex flex-col border bg-[#0B0D10] p-7"
    >
      <IconTile name={g.icon} />
      <p className="text-eyebrow text-accent-400 mt-6 flex items-center gap-2.5 font-mono uppercase">
        {label}
        <span aria-hidden className="text-ink-4">
          ·
        </span>
        <span className="text-ink-4 normal-case">{g.readingMinutes} min read</span>
      </p>
      <h3 className="text-ink mt-3 text-base leading-snug font-semibold">
        {g.h1}
      </h3>
      <p className="text-ink-4 mt-3 flex-1 text-sm leading-relaxed">{g.intro}</p>
      <Link
        href={`/resources/${g.slug}`}
        className="text-accent-400 hover:opacity-80 mt-6 inline-flex items-center gap-2 text-sm font-medium transition-colors"
      >
        Read Guide
        <Arrow />
      </Link>
    </li>
  );
}

/* ══ HUB ══════════════════════════════════════════════════════════════════ */
export function ResourceLibrary({
  guides,
  categories,
  searchPlaceholder,
  allLabel,
  featuredLabel,
}: {
  guides: readonly Guide[];
  categories: readonly Category[];
  searchPlaceholder: string;
  allLabel: string;
  featuredLabel: string;
}) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<string>("all");

  const labelFor = (key: string) =>
    categories.find((c) => c.key === key)?.label ?? key;

  // Filtering is client-side over the whole set. Correct at this size; if the
  // library ever passes ~30 guides this wants revisiting.
  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    return guides.filter((g) => {
      if (active !== "all" && g.category !== active) return false;
      if (!q) return true;
      return (
        g.h1.toLowerCase().includes(q) ||
        g.intro.toLowerCase().includes(q) ||
        labelFor(g.category).toLowerCase().includes(q)
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [guides, query, active]);

  const featured = guides.find((g) => g.featured);
  const isFiltering = query.trim() !== "" || active !== "all";

  return (
    <>
      {/* Filter bar */}
      <section className="bg-canvas border-line border-y py-6">
        <Container>
          <div className="flex flex-wrap items-center justify-between gap-5">
            <label className="relative w-full max-w-[20rem]">
              <span className="sr-only">{searchPlaceholder}</span>
              <span className="text-ink-4 pointer-events-none absolute top-1/2 left-4 -translate-y-1/2">
                <Icon name="search" className="size-4" />
              </span>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={searchPlaceholder}
                className="border-line-2 text-ink placeholder:text-ink-4 focus:border-accent-400 w-full rounded-lg border bg-[#0D0F12] py-2.5 pr-4 pl-11 text-sm"
              />
            </label>

            <div className="flex flex-wrap items-center gap-2.5">
              {[{ key: "all", label: allLabel }, ...categories].map((c) => (
                <button
                  key={c.key}
                  type="button"
                  onClick={() => setActive(c.key)}
                  aria-pressed={active === c.key}
                  className={`rounded-pill px-4 py-2 text-sm transition-colors ${
                    active === c.key
                      ? "bg-accent-400 text-canvas font-semibold"
                      : "border-line-2 text-ink-3 hover:text-ink border"
                  }`}
                >
                  {c.label}
                </button>
              ))}
              <span
                aria-live="polite"
                className="text-eyebrow text-ink-4 ml-1 font-mono"
              >
                {matches.length} result{matches.length === 1 ? "" : "s"}
              </span>
            </div>
          </div>
        </Container>
      </section>

      {/* Featured guide. Hidden while filtering, since it sits outside the
          result set and would contradict the count. */}
      {featured && !isFiltering && (
        <section className="bg-canvas pt-14">
          <Container>
            <p className="text-eyebrow text-accent-400 flex items-center gap-2.5 font-mono uppercase">
              <svg viewBox="0 0 24 24" className="size-3.5 fill-current" aria-hidden>
                <path d="m12 3.5 2.6 5.6 6 .8-4.4 4.2 1.1 6L12 17.2 6.7 20.1l1.1-6-4.4-4.2 6-.8z" />
              </svg>
              {featuredLabel}
            </p>

            <Link
              href={`/resources/${featured.slug}`}
              className="rounded-card border-line border-l-accent-400 hover:border-accent-400/50 group mt-5 flex items-center gap-6 border border-l-2 bg-[#0B0D10] p-7 transition-colors"
            >
              <IconTile name={featured.icon} />
              <span className="min-w-0 flex-1">
                <span className="text-eyebrow text-accent-400 flex items-center gap-2.5 font-mono uppercase">
                  {labelFor(featured.category)}
                  <span aria-hidden className="text-ink-4">
                    ·
                  </span>
                  <span className="text-ink-4 normal-case">
                    {featured.readingMinutes} min read
                  </span>
                </span>
                <span className="text-ink mt-2 block text-xl font-semibold">
                  {featured.h1}
                </span>
                <span className="text-ink-4 mt-2 block text-sm leading-relaxed">
                  {featured.featuredBlurb ?? featured.intro}
                </span>
              </span>
              <span className="border-line-2 text-ink-3 group-hover:border-accent-400 group-hover:text-accent-400 grid size-10 shrink-0 place-items-center rounded-full border transition-colors">
                <Arrow />
              </span>
            </Link>
          </Container>
        </section>
      )}

      {/* Category groups */}
      <section className="bg-canvas py-[70px]">
        <Container>
          {categories.map((c) => {
            // Every guide card is in the DOM at first paint; the filter and
            // search hide, never unmount. A filtered library that unmounts
            // is empty to a crawler.
            const all = guides.filter((g) => g.category === c.key);
            const inGroup = matches.filter((g) => g.category === c.key);
            if (!all.length) return null;
            return (
              <div
                key={c.key}
                className="mb-16 last:mb-0"
                hidden={!inGroup.length}
              >
                {/* Centred, per the comp. The count moves under the blurb
                    rather than floating on the opposite edge, where it read as
                    an unrelated fragment across a wide row. */}
                <header className="border-line mx-auto max-w-[52rem] border-b pb-6 text-center">
                  <h2 className="text-h2">{c.label}</h2>
                  {c.blurb && (
                    <p className="text-ink-3 mx-auto mt-3 max-w-[62ch] text-sm leading-relaxed">
                      {c.blurb}
                    </p>
                  )}
                  <p className="text-ink-4 mt-3 text-sm">
                    {inGroup.length} {c.key === "datasheets" ? "datasheet" : "guide"}
                    {inGroup.length === 1 ? "" : "s"}
                  </p>
                </header>
                <ul className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {all.map((g) => (
                    <GuideCard
                      key={g.slug}
                      g={g}
                      label={c.label}
                      hidden={!inGroup.includes(g)}
                    />
                  ))}
                </ul>
              </div>
            );
          })}

          {matches.length === 0 && (
            <p className="text-ink-4 py-16 text-center text-sm">
              No guides match that search. Try a compound name, a standard, or
              clear the filter.
            </p>
          )}
        </Container>
      </section>
    </>
  );
}

/* ══ CTA ══════════════════════════════════════════════════════════════════ */
export function ResourceCta({
  icon,
  headingLines,
  body,
  actions,
}: {
  icon: string;
  headingLines: readonly string[];
  body: string;
  actions: readonly { label: string; href: string; variant: string }[];
}) {
  return (
    <section className="bg-canvas pb-20 md:pb-28">
      <Container>
        <div className="rounded-card border-line border-l-accent-400 relative isolate flex flex-wrap items-center justify-between gap-8 overflow-hidden border border-l-2 bg-[#0B0D10] p-8 md:p-10">
          <span
            aria-hidden
            className="bg-accent-400/10 pointer-events-none absolute -top-24 -left-16 -z-10 size-72 rounded-full blur-3xl"
          />
          <div className="flex gap-5">
            <IconTile name={icon} />
            <div>
              <h2 className="text-ink text-2xl leading-tight font-semibold">
                {headingLines.map((l) => (
                  <span key={l} className="block">
                    {l}
                  </span>
                ))}
              </h2>
              <p className="text-ink-4 mt-3 max-w-[46ch] text-sm leading-relaxed">
                {body}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-5">
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
                  className="text-ink-2 hover:text-ink inline-flex items-center gap-2 text-sm font-medium transition-colors"
                >
                  {a.label}
                  <span aria-hidden>&rarr;</span>
                </Link>
              ),
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
