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
 * Material cards — measured against the Figma design, not approximated:
 *
 *  · The image is NOT a discrete block with a hard bottom edge. It fills the
 *    top of the card and DISSOLVES into the card fill via a mask gradient.
 *  · Cards form one contiguous 2×2 grid with 1px hairline dividers — no gaps,
 *    no rounded corners, no per-card border.
 *  · The compound badge sits over the image, top-left.
 *
 * Sampled values: card #080808 · divider #0D0D0D · image extent ≈49% of card
 * height (157px of 322px), fading over its last ~40%.
 */
export function MaterialCards({ items }: { items: Material[] }) {
  return (
    <div className="bg-hairline grid gap-px sm:grid-cols-2">
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

  return (
    /* The card is addressable as #fkm, #nbr … — "FKM → /products/oil-seals#fkm"
       (sheet 01 §10); the panel inside keeps its own id for aria-controls. */
    <div id={compoundAnchor(m.code)} className="bg-card relative isolate overflow-hidden">
      {m.image && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[175px]"
          style={{
            // Dissolve into the card fill instead of ending on a hard edge.
            // Fully gone by ~157px, matching the measured design.
            maskImage:
              "linear-gradient(to bottom, #000 0%, #000 65%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, #000 0%, #000 65%, transparent 100%)",
          }}
        >
          <Img
            k={m.image}
            fill
            sizes="(max-width: 640px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      )}

      {/* Badge sits on the image */}
      <div className="flex items-center gap-2.5 px-5 pt-5">
        <span
          className="size-[18px] shrink-0 rounded-full"
          style={{ backgroundColor: dot }}
        />
        <span className="text-eyebrow text-accent-400 font-mono uppercase">
          {m.code}
        </span>
      </div>

      {/* Content begins below the image's visible extent — title lands 172px
          from the card top, measured off the design. */}
      <div className="px-5 pb-5 pt-[134px]">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls={panelId}
          className="flex w-full items-center justify-between gap-4 text-left"
        >
          <h3 className="text-h3">{m.name}</h3>
          <span
            aria-hidden
            className={`text-accent-400 text-sm transition-transform ${open ? "rotate-180" : ""}`}
          >
            ⌄
          </span>
        </button>

        <dl className="mt-4 flex gap-8">
          <div>
            <dt className="text-eyebrow text-ink-4 font-mono uppercase">
              Temp. Range
            </dt>
            <dd className="text-ink mt-1.5 text-sm font-medium whitespace-pre-line">
              {m.tempRange}
            </dd>
          </div>
          <div className="border-line border-l pl-8">
            <dt className="text-eyebrow text-ink-4 font-mono uppercase">
              Hardness
            </dt>
            <dd className="text-ink mt-1.5 text-sm font-medium">
              {m.hardness}
            </dd>
          </div>
        </dl>

        {/* Always in the DOM — clamped with CSS, never truncated in JS, so
            crawlers and AI retrieval see the full text regardless of UI state. */}
        <p
          id={panelId}
          className={`text-ink-3 mt-5 text-sm leading-relaxed ${open ? "" : "line-clamp-1"}`}
        >
          {m.summary}
        </p>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="text-accent-400 mt-1.5 text-sm"
        >
          {open ? "Show less" : "Read more"}
        </button>
      </div>
    </div>
  );
}
