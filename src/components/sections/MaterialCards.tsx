"use client";

import { compoundAnchor } from "@/lib/compound-anchor";
import { useState } from "react";
import { Img } from "@/components/ui/Img";

type Material = {
  code: string;
  name: string;
  tempRange: string;
  hardness: string;
  summary: string;
  image?: string;
  dot?: string;
};

/**
 * Per-compound badge dot, pixel-sampled from the O-Rings design. These are a
 * design-system decision (compound → colour), not content, so they live here
 * rather than in every .mdx file. Content may override via `dot`.
 */
const DOT: Record<string, string> = {
  FKM: "#2D4A2D",
  NBR: "#1A1A2E",
  EPDM: "#1A2A1A",
  VMQ: "#2A1A0E",
};

/**
 * Material cards.
 *
 * 27 Oct 2026 (client: "too big for the product pages — rectangular,
 * compact, three per row, less space"; then "really compact"): the photo is
 * a short 5:2 band in normal flow (it was a square band as wide as the card, so a card
 * on a two-column grid was ~800px tall). Three columns from lg, two from sm.
 * Tighter padding and spacing throughout. Still one contiguous grid with
 * 1px hairline dividers, and the compound badge still sits over the photo.
 *
 * The photo is object-cover: a square swatch loses a little top and bottom,
 * which on these centred product shots is mostly background. Wide uploads
 * (~1500×600) fill the band exactly.
 */
export function MaterialCards({ items }: { items: Material[] }) {
  return (
    <div className="bg-hairline grid gap-px sm:grid-cols-2 lg:grid-cols-3">
      {items.map((m) => (
        <MaterialCard key={m.code} m={m} />
      ))}
    </div>
  );
}

function MaterialCard({ m }: { m: Material }) {
  const [open, setOpen] = useState(false);
  const panelId = `material-${m.code.toLowerCase()}`;
  // Fallback for a compound with no swatch of its own. Was accent-800, a
  // token removed when the accent ramp was cut to the single brand blue —
  // an undefined var here would have rendered no dot at all.
  const dot = m.dot ?? DOT[m.code] ?? "var(--color-surface-4)";

  const badge = (
    <div className="flex items-center gap-2">
      <span className="size-3.5 shrink-0 rounded-full" style={{ backgroundColor: dot }} />
      <span className="text-eyebrow text-accent-400 font-mono uppercase">{m.code}</span>
    </div>
  );

  return (
    /* The card is addressable as #fkm, #nbr … — "FKM → /products/oil-seals#fkm"
       (sheet 01 §10); the panel inside keeps its own id for aria-controls. */
    <div id={compoundAnchor(m.code)} className="bg-card relative flex flex-col">
      {m.image ? (
        <div className="relative aspect-[5/2] overflow-hidden">
          <Img
            k={m.image}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
          />
          {/* Badge on the photo, on a dark chip so it reads on the pale swatches. */}
          <div className="bg-canvas/75 absolute top-3 left-3 rounded-full px-2.5 py-1 backdrop-blur">
            {badge}
          </div>
        </div>
      ) : (
        <div className="px-4 pt-4">{badge}</div>
      )}

      <div className="flex flex-1 flex-col px-4 pt-3.5 pb-4">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls={panelId}
          className="flex w-full items-center justify-between gap-3 text-left max-md:min-h-11"
        >
          <h3 className="text-ink text-base leading-snug font-semibold">{m.name}</h3>
          <span
            aria-hidden
            className={`text-accent-400 text-sm transition-transform ${open ? "rotate-180" : ""}`}
          >
            ⌄
          </span>
        </button>

        <dl className="mt-3 flex gap-5">
          <div>
            <dt className="text-eyebrow text-ink-4 font-mono uppercase">Temp. Range</dt>
            <dd className="text-ink mt-1 text-sm font-medium whitespace-pre-line">{m.tempRange}</dd>
          </div>
          <div className="border-line border-l pl-5">
            <dt className="text-eyebrow text-ink-4 font-mono uppercase">Hardness</dt>
            <dd className="text-ink mt-1 text-sm font-medium">{m.hardness}</dd>
          </div>
        </dl>

        {/* Always in the DOM — clamped with CSS, never truncated in JS, so
            crawlers and AI retrieval see the full text regardless of UI state. */}
        <p
          id={panelId}
          className={`text-ink-3 mt-3 text-sm leading-relaxed ${open ? "" : "line-clamp-2"}`}
        >
          {m.summary}
        </p>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="text-accent-400 mt-1 self-start text-sm max-md:-mt-2 max-md:-mb-3 max-md:py-3"
        >
          {open ? "Show less" : "Read more"}
        </button>
      </div>
    </div>
  );
}
