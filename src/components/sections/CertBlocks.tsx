"use client";

import { useState } from "react";
import { Img } from "@/components/ui/Img";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Section";
import {
  EnquiryForm,
  EnquiryStatus,
  EnquirySubmit,
} from "@/components/forms/EnquiryForm";

/** Small inline icons. Text glyphs (⊘ ⛊ ✕) render inconsistently across
 *  platforms and did not match the design, which uses drawn marks. */
function Icon({
  name,
  className = "size-[18px]",
}: {
  name: "award" | "check-circle" | "x" | "shield-check";
  className?: string;
}) {
  const paths: Record<string, React.ReactNode> = {
    // Rosette: circle with two ribbon tails. This is the footnote mark.
    award: (
      <>
        <circle cx="12" cy="9" r="5.5" />
        <path d="M8.5 13.2 7.5 21l4.5-2.6L16.5 21l-1-7.8" />
      </>
    ),
    "check-circle": (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="m8.5 12 2.5 2.5 4.5-5" />
      </>
    ),
    x: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="m9 9 6 6M15 9l-6 6" />
      </>
    ),
    "shield-check": (
      <>
        <path d="M12 3l8 3v6c0 4.5-3.2 7.9-8 9-4.8-1.1-8-4.5-8-9V6z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
  };
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {paths[name]}
    </svg>
  );
}

/**
 * ISO medallion, rebuilt from the design rather than approximated.
 * Radial profile sampled at 261px diameter:
 *   core #082426 → bright #2BBCC4 ring at 74% of radius →
 *   outer bezel band #1B7A7F at 88-100%, carrying 12 tick marks.
 */
function IsoMedallion() {
  const R = 150;
  const ticks = Array.from({ length: 12 }, (_, i) => i * 30);

  return (
    <div className="relative mx-auto size-[280px] md:size-[320px]">
      <svg viewBox="0 0 300 300" className="size-full" role="img" aria-label="ISO 9001:2015 certified">
        <defs>
          <radialGradient id="isoGlow">
            <stop offset="40%" stopColor="#2BBCC4" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#2BBCC4" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ambient glow */}
        <circle cx={R} cy={R} r={R} fill="url(#isoGlow)" />

        {/* Bezel: filled disc, outer hairline, and the tick ring */}
        <circle cx={R} cy={R} r="140" fill="#082426" />
        <circle cx={R} cy={R} r="140" fill="none" stroke="#1B7A7F" strokeWidth="1.5" opacity="0.9" />
        <circle cx={R} cy={R} r="122" fill="none" stroke="#1B7A7F" strokeWidth="1" opacity="0.5" />
        {ticks.map((deg) => {
          const rad = (deg * Math.PI) / 180;
          const long = deg % 90 === 0;
          const r1 = long ? 126 : 130;
          // Rounded: raw Math.cos/sin output serialises to different float
          // precision on server vs client, which trips a hydration mismatch.
          const p = (v: number) => Math.round(v * 100) / 100;
          return (
            <line
              key={deg}
              x1={p(R + Math.cos(rad) * r1)}
              y1={p(R + Math.sin(rad) * r1)}
              x2={p(R + Math.cos(rad) * 138)}
              y2={p(R + Math.sin(rad) * 138)}
              stroke="#2BBCC4"
              strokeWidth={long ? 2.5 : 1.5}
              opacity={long ? 0.85 : 0.5}
            />
          );
        })}

        {/* Inner face + the bright accent ring */}
        <circle cx={R} cy={R} r="110" fill="#051719" />
        <circle cx={R} cy={R} r="111" fill="none" stroke="#2BBCC4" strokeWidth="2" />
      </svg>

      {/* Text sits in DOM rather than SVG so it inherits the site type scale. */}
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <p className="text-accent-400 text-xl font-extrabold tracking-[0.1em]">
            ISO
          </p>
          <p className="text-ink -mt-0.5 text-[2.9rem] leading-none font-extrabold">
            9001
          </p>
          <p className="text-accent-400 mt-1 text-xl font-extrabold">2015</p>
          <p className="text-ink-4 mt-1.5 text-xs tracking-[0.18em]">CERTIFIED</p>
        </div>
      </div>
    </div>
  );
}

/* ── HERO ─────────────────────────────────────────────────────────────── */
export function CertHero({
  badge,
  lines,
  accentLines,
  intro,
  actions,
}: {
  badge: string;
  lines: string[];
  accentLines: number[];
  intro: string;
  actions: { label: string; href: string; variant: "primary" | "secondary" }[];
}) {
  return (
    <header className="bg-canvas relative isolate overflow-hidden pt-32 pb-20 md:pt-44 md:pb-28">
      {/* QC inspection rather than a press or a plant exterior: this page is
          about a quality management system, and the dimensional-inspection
          bench is the part of the floor that ISO 9001 actually governs. */}
      <Img
        k="certifications.hero"
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover brightness-[0.95] contrast-[1.02]"
      />
      {/* Same two-scrim treatment as the export hero: a vertical wash that
          only fades the bottom edge into the section below, and a horizontal
          one carrying the work of protecting the copy. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(to bottom, color-mix(in srgb, var(--color-canvas) 40%, transparent) 0%, color-mix(in srgb, var(--color-canvas) 28%, transparent) 45%, color-mix(in srgb, var(--color-canvas) 46%, transparent) 80%, var(--color-canvas) 100%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(to right, color-mix(in srgb, var(--color-canvas) 78%, transparent) 0%, color-mix(in srgb, var(--color-canvas) 46%, transparent) 42%, color-mix(in srgb, var(--color-canvas) 30%, transparent) 62%, color-mix(in srgb, var(--color-canvas) 72%, transparent) 100%)",
        }}
      />
      {/* The medallion is thin teal linework on a transparent ground, which
          photography destroys. This puts a soft dark disc under it so it
          reads as it does on the flat background, without boxing it in. */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 right-0 -z-10 hidden size-[34rem] -translate-y-1/2 translate-x-1/4 rounded-full lg:block"
        style={{
          background:
            "radial-gradient(closest-side, var(--color-canvas) 58%, color-mix(in srgb, var(--color-canvas) 72%, transparent) 78%, transparent 100%)",
        }}
      />

      <Container>
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
                </span>
              ))}
            </h1>

            {/* ink-2, not the ink-3 used for ledes on flat surfaces: this one
                now sits on photography and the dimmer grey loses contrast. */}
            <p className="text-ink-2 mt-6 max-w-[46ch] leading-relaxed">
              {intro}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {actions.map((a) => (
                <Button key={a.label} href={a.href} variant={a.variant}>
                  {a.label} <span aria-hidden>{a.variant === "primary" ? "↓" : "→"}</span>
                </Button>
              ))}
            </div>
          </div>

          <IsoMedallion />
        </div>
      </Container>
    </header>
  );
}

/* ── 02 · SCOPE ───────────────────────────────────────────────────────── */
export function ScopePanel({
  meansHeading,
  means,
  notHeading,
  notLead,
  notLeadBody,
  notItems,
  footnote,
}: {
  meansHeading: string;
  means: string[];
  notHeading: string;
  notLead: string;
  notLeadBody: string;
  notItems: string[];
  footnote: string;
}) {
  return (
    <div className="border-line rounded-card border bg-[#0A0A0A] p-6 md:p-10">
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <h3 className="text-ink flex items-center gap-2.5 text-base font-semibold">
            <span className="text-accent-400">
              <Icon name="check-circle" />
            </span>
            {meansHeading}
          </h3>
          <ul className="mt-5 space-y-4">
            {means.map((m) => (
              <li key={m.slice(0, 24)} className="text-ink-3 flex gap-2.5 text-sm leading-relaxed">
                <span aria-hidden className="bg-accent-400 mt-2 size-1.5 shrink-0 rounded-full" />
                {m}
              </li>
            ))}
          </ul>
        </div>

        <div>
          {/* The single most important statement on the site: named, not buried. */}
          <div className="rounded-card border border-[#3A1A1A] bg-[#160D0D] p-5">
            <h3 className="flex items-center gap-2.5 text-base font-semibold text-[#FF8080]">
              <Icon name="x" className="size-[18px] shrink-0" />
              {notHeading}
            </h3>
            <p className="mt-4 text-sm font-semibold text-[#FF8080]">
              {notLead}
            </p>
            <p className="text-ink-4 mt-2 text-sm leading-relaxed">
              {notLeadBody}
            </p>
          </div>

          <ul className="mt-6 space-y-4">
            {notItems.map((n) => (
              <li key={n.slice(0, 24)} className="text-ink-4 flex gap-2.5 text-sm leading-relaxed">
                <span aria-hidden className="bg-ink-4 mt-2 size-1.5 shrink-0 rounded-full" />
                {n}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="border-line text-ink-4 mt-10 flex gap-3 border-t pt-6 text-xs leading-relaxed">
        <span className="text-accent-400 mt-0.5 shrink-0">
          <Icon name="award" className="size-4" />
        </span>
        {footnote}
      </p>
    </div>
  );
}

/* ── 03 · CERTIFICATE ─────────────────────────────────────────────────── */
type Card = {
  eyebrow: string;
  title: string;
  certifyLine: string;
  company: string;
  address: string;
  conformLine: string;
  standard: string;
  scopeLine: string;
  fields: { label: string; value: string }[];
  barTitle: string;
  barNote: string;
  downloadLabel: string;
};

export function CertificateBlock({
  card,
  meta,
}: {
  card: Card;
  meta: { label: string; value: string }[];
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_minmax(0,320px)]">
      <div className="rounded-card overflow-hidden">
        {/* Cream stock, sampled #FAF7F0. This is a DESIGNED REPRESENTATION,
            not a scan: the placeholder values stay visible on purpose so it
            can't be mistaken for a live document. */}
        <div className="bg-[#FAF7F0] p-7 md:p-9">
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="text-eyebrow font-mono uppercase text-[#3A6C8C]">
                {card.eyebrow}
              </p>
              <h3 className="mt-2 text-2xl font-bold text-[#101418]">
                {card.title}
              </h3>
            </div>
            <span className="grid size-14 shrink-0 place-items-center rounded-full border-2 border-dashed border-[#7FB4CC] text-[9px] font-semibold text-[#3A6C8C]">
              ISO
            </span>
          </div>

          <p className="mt-7 text-xs text-[#5A6472]">{card.certifyLine}</p>
          <p className="mt-2 text-lg font-bold text-[#101418]">{card.company}</p>
          <p className="mt-1 text-xs text-[#5A6472]">{card.address}</p>

          <p className="mt-5 text-xs text-[#5A6472]">{card.conformLine}</p>
          <p className="mt-1 text-xl font-bold text-[#2F7FA8]">
            {card.standard}
          </p>

          <p className="mt-4 max-w-[62ch] text-[11px] leading-relaxed text-[#5A6472]">
            {card.scopeLine}
          </p>

          <dl className="mt-7 grid gap-4 border-t border-dashed border-[#D6D2C8] pt-5 sm:grid-cols-3">
            {card.fields.map((f) => (
              <div key={f.label}>
                <dt className="text-[10px] tracking-wide text-[#8A8E96]">
                  {f.label}
                </dt>
                <dd className="mt-1 text-sm font-semibold text-[#101418]">
                  {f.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 bg-[#0D0D0D] px-6 py-4">
          <div>
            <p className="text-ink text-sm font-medium">{card.barTitle}</p>
            <p className="text-ink-4 mt-0.5 text-xs">{card.barNote}</p>
          </div>
          <button
            type="button"
            className="bg-accent-400 text-ink hover:opacity-90 rounded-cta px-5 py-2.5 text-sm font-semibold transition-colors"
          >
            ↓ {card.downloadLabel}
          </button>
        </div>
      </div>

      <dl className="space-y-3">
        {meta.map((m) => (
          <div
            key={m.label}
            className="border-line rounded-card border bg-[#0A0A0A] px-5 py-4"
          >
            <dt className="text-eyebrow text-ink-4 font-mono uppercase">
              {m.label}
            </dt>
            <dd className="text-ink mt-1.5 text-sm">{m.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/* ── 04 · FACILITY GALLERY ────────────────────────────────────────────── */
export function FacilityGallery({
  caption,
  gallery,
  capabilities,
}: {
  caption: string;
  gallery: { image: string; alt: string }[];
  capabilities: { name: string; body: string }[];
}) {
  const [active, setActive] = useState(0);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_minmax(0,380px)]">
      <div>
        <div className="rounded-card relative aspect-[4/3] overflow-hidden">
          <Img
            k={gallery[active].image}
            fill
            sizes="(max-width:1024px) 100vw, 55vw"
            className="object-cover"
          />
          <div className="from-canvas absolute inset-x-0 bottom-0 bg-gradient-to-t to-transparent p-5 pt-16">
            <p className="text-ink-2 text-xs">
              {active === 0 ? caption : gallery[active].alt}
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-4 gap-3">
          {gallery.map((g, i) => (
            <button
              key={g.image}
              type="button"
              onClick={() => setActive(i)}
              aria-label={g.alt}
              aria-current={i === active}
              className={`rounded-card relative aspect-[4/3] overflow-hidden border transition-colors ${
                i === active ? "border-accent-400" : "border-line hover:border-line-2"
              }`}
            >
              <Img k={g.image} fill sizes="120px" className="object-cover" />
            </button>
          ))}
        </div>
      </div>

      <ul className="space-y-3">
        {capabilities.map((c) => (
          <li
            key={c.name}
            className="border-line rounded-card border bg-[#0A0A0A] p-5"
          >
            <p className="text-ink text-sm font-semibold">{c.name}</p>
            <p className="text-ink-4 mt-1.5 text-sm leading-relaxed">{c.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ── 05 · QUALITY SYSTEM ──────────────────────────────────────────────── */
const SYS_ICON: Record<string, React.ReactNode> = {
  inbox: (
    <>
      <path d="M3 13h5l1 3h6l1-3h5" />
      <path d="M4 13 6 5h12l2 8v6H4z" />
    </>
  ),
  gauge: (
    <>
      <path d="M4 18a8 8 0 1 1 16 0" />
      <path d="m12 14 4-4" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3l8 3v6c0 4.5-3.2 7.9-8 9-4.8-1.1-8-4.5-8-9V6z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  loop: (
    <>
      <path d="M4 12a8 8 0 0 1 13.7-5.7L20 8" />
      <path d="M20 12a8 8 0 0 1-13.7 5.7L4 16" />
      <path d="M20 4v4h-4M4 20v-4h4" />
    </>
  ),
};

export function QualitySystem({
  items,
  auditNote,
}: {
  items: { icon: string; name: string; body: string }[];
  auditNote: { lead: string; body: string };
}) {
  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((q) => (
          <div
            key={q.name}
            className="border-line rounded-card flex flex-col border bg-[#0D0D0D] p-6"
          >
            <span className="bg-accent-400/10 grid size-10 place-items-center rounded-lg">
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
                {SYS_ICON[q.icon]}
              </svg>
            </span>
            <h3 className="text-ink mt-5 text-base font-semibold">{q.name}</h3>
            <p className="text-ink-4 mt-2 text-sm leading-relaxed">{q.body}</p>
            <span aria-hidden className="bg-accent-400 mt-5 h-px w-8" />
          </div>
        ))}
      </div>

      <div className="border-accent-400/30 rounded-card mt-6 border bg-[#020909] p-5">
        <p className="text-ink-3 text-sm leading-relaxed">
          <span className="text-accent-400 font-semibold">{auditNote.lead}</span>{" "}
          {auditNote.body}
        </p>
      </div>
    </>
  );
}

/* ── 06 · REQUEST DOCUMENTATION ───────────────────────────────────────── */
export function DocsPanel({
  heading,
  body,
  items,
  fields,
  submitLabel,
  footnote,
}: {
  heading: string;
  body: string;
  items: string[];
  fields: { name: string; label: string; placeholder: string; type: string }[];
  submitLabel: string;
  footnote: string;
}) {
  const words = heading.split(" ");
  const second = words.slice(1).join(" ");

  return (
    <div className="border-line rounded-card grid overflow-hidden border bg-[#0A0A0A] lg:grid-cols-2">
      <div className="p-8 md:p-10">
        <span className="bg-accent-400/10 text-accent-400 grid size-11 place-items-center rounded-lg">
          ✉
        </span>
        <h2 className="text-h1 mt-6 max-w-[14ch]">
          {words[0]} <span className="block">{second}</span>
        </h2>
        <p className="text-ink-4 mt-4 max-w-[44ch] text-sm leading-relaxed">
          {body}
        </p>
        <ul className="mt-7 space-y-3">
          {items.map((i) => (
            <li key={i} className="text-ink-2 flex items-center gap-2.5 text-sm">
              <span className="text-accent-400 shrink-0">
                <Icon name="check-circle" className="size-4" />
              </span>
              {i}
            </li>
          ))}
        </ul>
      </div>

      <EnquiryForm
        source="certifications"
        className="border-line bg-[#050505] p-8 md:p-10 lg:border-l"
      >
        <div className="space-y-5">
          {fields.map((f) => (
            <label key={f.name} className="block">
              <span className="text-eyebrow text-ink-4 font-mono uppercase">
                {f.label}
              </span>
              {f.type === "textarea" ? (
                <textarea
                  name={f.name}
                  rows={4}
                  placeholder={f.placeholder}
                  className="border-line text-ink placeholder:text-ink-4 focus:border-accent-400 mt-2 w-full rounded-lg border bg-[#0D0D0D] px-4 py-3 text-sm"
                />
              ) : (
                <input
                  name={f.name}
                  type={f.type}
                  placeholder={f.placeholder}
                  className="border-line text-ink placeholder:text-ink-4 focus:border-accent-400 mt-2 w-full rounded-lg border bg-[#0D0D0D] px-4 py-3 text-sm"
                />
              )}
            </label>
          ))}
        </div>

        <EnquirySubmit className="bg-accent-400 text-ink hover:opacity-90 mt-6 w-full rounded-cta px-6 py-3.5 text-sm font-semibold transition-colors">
          {submitLabel} <span aria-hidden>→</span>
        </EnquirySubmit>
        <EnquiryStatus />
        <p className="text-ink-4 mt-3 text-[11px] leading-relaxed">{footnote}</p>
      </EnquiryForm>
    </div>
  );
}
