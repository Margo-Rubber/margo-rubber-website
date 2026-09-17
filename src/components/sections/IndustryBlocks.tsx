"use client";

import { useMemo, useState } from "react";
import { INDUSTRIES, industryBySlug } from "@/content/routes";
import { useSearch } from "@/lib/contact-prefill";
import { autocompleteFor } from "@/lib/autocomplete";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import type { Crumb } from "@/lib/breadcrumbs";
import Link from "next/link";
import { Img } from "@/components/ui/Img";
import { Container } from "@/components/ui/Section";
import {
  EnquiryForm,
  EnquiryStatus,
  EnquirySubmit,
} from "@/components/forms/EnquiryForm";
import { accented } from "@/components/ui/Emphasis";

type Industry = {
  slug: string;
  name: string;
  chip: string;
  body: string;
  image: string;
  tags: string[];
};

/* ────────────────────────────────────────────────────────────────────────
   HERO — badge, split heading, intro, 3-column fact strip
   ──────────────────────────────────────────────────────────────────────── */
export function IndustriesHero({
  badge,
  lines,
  accentLines,
  intro,
  facts,
  image,
  breadcrumb,
}: {
  badge: string;
  lines: string[];
  accentLines: number[];
  intro: string;
  facts: { label: string; value: string }[];
  image?: string;
  breadcrumb?: readonly Crumb[];
}) {
  return (
    <header className="relative isolate overflow-hidden pt-28 pb-12 md:pt-40 md:pb-16">
      {image && (
        <>
          <Img
            k={image}
            fill
            priority
            sizes="100vw"
            className="-z-20 object-cover brightness-[0.85]"
          />
          <div className="from-canvas via-canvas/70 absolute inset-0 -z-10 bg-gradient-to-r from-10% via-50% to-transparent to-85%" />
          <div className="from-canvas absolute inset-0 -z-10 bg-gradient-to-t from-0% to-transparent to-40%" />
        </>
      )}
      <Container>
        <Breadcrumb items={breadcrumb} className="mb-6" />
        {badge && (
          <span className="text-eyebrow border-accent-400/40 text-accent-400 inline-flex items-center gap-2 rounded-pill border px-4 py-1.5 font-mono uppercase">
            <span className="bg-accent-400 size-1.5 rounded-full" />
            {badge}
          </span>
        )}

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

        <p className="text-ink-3 mt-6 max-w-[52ch] leading-relaxed">{intro}</p>

        {facts.length > 0 && (
          <dl className="border-line divide-line bg-surface rounded-card mt-10 grid max-w-[700px] divide-y overflow-hidden border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {facts.map((f) => (
              <div key={f.label} className="px-5 py-4">
                <dt className="text-ink-4 text-xs">{f.label}</dt>
                <dd className="text-ink mt-1.5 text-sm font-semibold">
                  {f.value}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </Container>
    </header>
  );
}

/* ────────────────────────────────────────────────────────────────────────
   FILTERABLE INDUSTRY GRID
   Search + chips drive one shared filter, so the count label stays honest.
   ──────────────────────────────────────────────────────────────────────── */
export function IndustryGrid({
  placeholder,
  chips,
  eyebrow,
  heading,
  items,
}: {
  placeholder: string;
  chips: string[];
  eyebrow: string;
  heading: string;
  items: Industry[];
}) {
  const [chip, setChip] = useState(chips[0]);
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    let out = items;
    if (chip !== chips[0]) out = out.filter((i) => i.chip === chip);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      out = out.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.body.toLowerCase().includes(q) ||
          i.tags.some((t) => t.toLowerCase().includes(q)),
      );
    }
    return out;
  }, [items, chip, query, chips]);

  return (
    <>
      {/* Filter bar */}
      <div className="border-line border-y py-4">
        <Container className="flex flex-wrap items-center gap-3">
          <label className="relative w-full sm:w-64">
            <span className="sr-only">{placeholder}</span>
            <span
              className="text-ink-4 pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-xs"
              aria-hidden
            >
              ⌕
            </span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholder}
              className="border-line bg-surface text-ink placeholder:text-ink-4 focus:border-accent-400 w-full rounded-pill border py-2.5 pr-4 pl-9 text-sm"
            />
          </label>

          <div className="flex flex-wrap gap-2">
            {chips.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setChip(c)}
                aria-pressed={chip === c}
                className={`rounded-pill px-3.5 py-2 text-xs font-medium transition-colors ${
                  chip === c
                    ? "bg-accent-400 text-canvas"
                    : "border-line text-ink-3 hover:text-ink border"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </Container>
      </div>

      <section className="py-[70px]">
        <Container>
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-eyebrow text-accent-400 font-mono uppercase">
                {eyebrow}
              </p>
              <h2 className="text-h2 mt-3">{accented(heading)}</h2>
            </div>
            <p className="text-ink-4 text-xs">
              {visible.length} of {items.length} showing
            </p>
          </div>

          {/* All nine cards render at first paint; the filter hides, never
              unmounts. A filtered card that unmounts takes its link out of
              the crawlable page. */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((i) => (
              <Link
                key={i.slug}
                href={`/industries/${i.slug}`}
                hidden={!visible.includes(i)}
                data-lift=""
                className="border-line bg-surface rounded-card group block overflow-hidden border hover:border-[color:var(--color-line-accent)]"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Img
                    k={i.image}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover brightness-[0.78] transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                  {/* The design dims the photo and dissolves its lower edge into
                      the card fill rather than ending on a hard line. */}
                  <div className="from-surface via-surface/35 absolute inset-0 bg-gradient-to-t from-0% via-42% to-transparent to-78%" />
                  <span
                    aria-hidden
                    className="border-line-2 bg-canvas/70 text-ink absolute top-3 right-3 grid size-7 place-items-center rounded-full border text-xs backdrop-blur transition-colors group-hover:border-[color:var(--color-accent-400)] group-hover:text-[color:var(--color-accent-400)]"
                  >
                    ↗
                  </span>
                </div>

                <div className="p-5">
                  <h3 className="text-h3">{i.name}</h3>
                  <p className="text-ink-4 mt-2 text-sm leading-relaxed">
                    {i.body}
                  </p>

                  <ul className="mt-4 flex flex-wrap gap-2">
                    {i.tags.map((t) => (
                      <li
                        key={t}
                        className="border-line text-ink-3 rounded-md border px-2.5 py-1 text-[11px]"
                      >
                        {t}
                      </li>
                    ))}
                  </ul>

                  <span className="text-accent-400 mt-5 inline-flex items-center gap-1.5 text-sm font-medium">
                    View industry page{" "}
                    <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
                      →
                    </span>
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {!visible.length && (
            <p className="text-ink-4 py-12 text-center text-sm">
              No industries match that filter.
            </p>
          )}
        </Container>
      </section>
    </>
  );
}

/* ────────────────────────────────────────────────────────────────────────
   ADDITIONAL SECTORS — cards with a left accent bar, no dedicated page yet
   ──────────────────────────────────────────────────────────────────────── */
export function SectorCards({
  eyebrow,
  heading,
  note,
  items,
}: {
  eyebrow: string;
  heading: string;
  note: string;
  items: { name: string; body: string; href: string; linkLabel: string }[];
}) {
  return (
    <section className="bg-[#050505] py-[70px]">
      <Container>
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-eyebrow text-accent-400 font-mono uppercase">
              {eyebrow}
            </p>
            <h2 className="text-h2 mt-3">{accented(heading)}</h2>
          </div>
          <p className="text-ink-4 max-w-[44ch] text-right text-xs leading-relaxed">
            {note}
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((s) => (
            <div
              key={s.name}
              className="border-line bg-surface rounded-card relative overflow-hidden border p-5 pl-6"
            >
              <span
                aria-hidden
                className="bg-accent-400 absolute inset-y-0 left-0 w-[3px]"
              />
              <span
                aria-hidden
                className="text-ink-4 absolute top-4 right-4 text-xs"
              >
                ✕
              </span>
              <h3 className="text-ink pr-6 text-sm font-semibold">{s.name}</h3>
              <p className="text-ink-4 mt-2 text-sm leading-relaxed">
                {s.body}
              </p>
              <Link
                href={s.href}
                className="text-accent-400 mt-4 inline-flex items-center gap-1.5 text-sm"
              >
                {s.linkLabel} <span aria-hidden>→</span>
              </Link>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────────
   ENQUIRY PANEL
   ──────────────────────────────────────────────────────────────────────── */
export function EnquiryPanel({
  heading,
  body,
  points,
  fields,
  submitLabel,
  footnote,
}: {
  heading: string;
  body: string;
  points: string[];
  fields: { name: string; label: string; placeholder: string; type: string; full: boolean }[];
  submitLabel: string;
  footnote: string;
}) {
  // The industry dropdown, from the route registry — the eleven sectors and
  // "Other". A buyer who arrives via ?sector=hvac, or clicked the HVAC chip,
  // finds it already chosen (sheet 05 §05); the address is read as a store,
  // so the server renders it empty and the client fills it after hydration.
  const [chosen, setChosen] = useState<string | null>(null);
  const search = useSearch();
  const fromLink = useMemo(() => {
    const want = new URLSearchParams(search).get("sector")?.trim().toLowerCase();
    if (!want) return "";
    return (industryBySlug(want) ?? INDUSTRIES.find((i) => i.label.toLowerCase() === want))?.label ?? "";
  }, [search]);
  const sector = chosen ?? fromLink;
  const setSector = setChosen;
  return (
    <section className="py-[70px]">
      <Container>
        <div className="border-line bg-surface rounded-card grid overflow-hidden border lg:grid-cols-2">
          <div className="p-8 md:p-10">
            <span className="bg-accent-400/10 text-accent-400 grid size-11 place-items-center rounded-lg text-lg">
              ✍
            </span>
            <h2 className="text-h1 mt-6 max-w-[16ch]">{accented(heading)}</h2>
            <p className="text-ink-4 mt-4 max-w-[46ch] text-sm leading-relaxed">
              {body}
            </p>
            <ul className="mt-7 space-y-3">
              {points.map((p) => (
                <li
                  key={p}
                  className="text-ink-2 flex items-start gap-2.5 text-sm"
                >
                  <span
                    aria-hidden
                    className="bg-accent-400 mt-1.5 size-1.5 shrink-0 rounded-full"
                  />
                  {p}
                </li>
              ))}
            </ul>
          </div>

          <EnquiryForm
            source="industries"
            className="border-line bg-[#050505] p-8 md:p-10 lg:border-l"
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
                  {/* Every control carries its field name: FormData reads the
                      DOM, and an input without a name posts nothing. */}
                  {f.type === "textarea" ? (
                    <textarea
                      name={f.name}
                      rows={3}
                      required
                      placeholder={f.placeholder}
                      className="border-line bg-surface text-ink placeholder:text-ink-4 focus:border-accent-400 mt-2 w-full rounded-lg border px-4 py-3 text-sm"
                    />
                  ) : f.type === "select" ? (
                    <select
                      name={f.name}
                      required
                      value={sector}
                      onChange={(e) => setSector(e.target.value)}
                      className={`border-line bg-surface focus:border-accent-400 mt-2 w-full rounded-lg border px-4 py-3 text-sm ${sector ? "text-ink" : "text-ink-4"}`}
                    >
                      <option value="" disabled>
                        {f.placeholder}
                      </option>
                      {INDUSTRIES.map((i) => (
                        <option key={i.slug} value={i.label}>
                          {i.label}
                        </option>
                      ))}
                      <option value="Other">Other</option>
                    </select>
                  ) : (
                    <input
                      name={f.name}
                      type={f.type}
                      autoComplete={autocompleteFor(f.name)}
                      required
                      placeholder={f.placeholder}
                      className="border-line bg-surface text-ink placeholder:text-ink-4 focus:border-accent-400 mt-2 w-full rounded-lg border px-4 py-3 text-sm"
                    />
                  )}
                </label>
              ))}
            </div>

            <EnquirySubmit className="bg-accent-400 text-ink hover:opacity-90 mt-6 w-full rounded-cta px-6 py-3.5 text-sm font-semibold transition-colors">
              {submitLabel} <span aria-hidden>→</span>
            </EnquirySubmit>
            <EnquiryStatus />
            <p className="text-ink-4 mt-3 text-[11px] leading-relaxed">
              {footnote}
            </p>
          </EnquiryForm>
        </div>
      </Container>
    </section>
  );
}
