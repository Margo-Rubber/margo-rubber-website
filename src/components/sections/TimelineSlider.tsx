"use client";

import { useState } from "react";

type Item = { year: string; title: string; body: string };

/**
 * Milestone slider.
 *
 * One card visible at a time, matching the design. All seven milestones stay
 * in the DOM (stacked in a single grid cell) rather than being mounted on
 * demand, so the full company history is still crawlable and findable with
 * in-page search.
 */
export function TimelineSlider({ items }: { items: readonly Item[] }) {
  const [i, setI] = useState(0);
  const go = (n: number) => setI((n + items.length) % items.length);

  return (
    <div>
      <ul className="flex flex-wrap justify-center gap-3">
        {items.map((it, n) => (
          <li key={`${it.year}-${n}`}>
            <button
              type="button"
              onClick={() => setI(n)}
              aria-current={n === i}
              className={`rounded-pill inline-flex px-5 py-2 text-sm font-medium transition-colors ${
                n === i
                  ? "bg-accent-400 text-canvas shadow-glow"
                  : "border-line-2 text-ink-4 hover:text-ink border"
              }`}
            >
              {it.year}
            </button>
          </li>
        ))}
      </ul>

      {/* An <ol>: the timeline is a real sequence, and each year is a <time>
          so the date is machine-readable (sheet 03 §13). Every milestone is
          in the DOM; the slider only chooses which one is visible. */}
      <ol
        className="rounded-card border-line bg-surface-3 relative isolate mx-auto mt-10 grid max-w-[44rem] list-none overflow-hidden border px-8 py-14"
        aria-live="polite"
      >
        <span
          aria-hidden
          className="bg-accent-400/10 pointer-events-none absolute -top-32 left-1/2 -z-10 size-80 -translate-x-1/2 rounded-full blur-3xl"
        />
        {items.map((it, n) => (
          <li
            key={`${it.year}-${n}`}
            // Every panel occupies the same grid cell, so the card height is
            // the tallest milestone and never jumps between slides.
            className={`col-start-1 row-start-1 text-center transition-opacity duration-300 ${
              n === i ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
            aria-hidden={n !== i}
          >
            <span
              aria-hidden
              className="text-ink pointer-events-none absolute inset-0 -z-10 grid place-items-center text-[7rem] leading-none font-bold opacity-[0.045] select-none md:text-[9rem]"
            >
              {it.year}
            </span>
            <time
              dateTime={it.year}
              className="text-eyebrow border-accent-400/35 bg-accent-400/10 text-accent-400 rounded-pill inline-flex border px-3 py-1 font-mono"
            >
              {it.year}
            </time>
            <h3 className="text-ink mt-5 text-2xl font-semibold md:text-3xl">
              {it.title}
            </h3>
            <p className="text-ink-3 mx-auto mt-4 max-w-[46ch] leading-relaxed">
              {it.body}
            </p>
          </li>
        ))}

        <li aria-hidden className="col-start-1 row-start-2 mt-9 flex items-center justify-center gap-5">
          <button
            type="button"
            onClick={() => go(i - 1)}
            aria-label="Previous milestone"
            className="border-line-2 text-ink-4 hover:border-accent-400/60 hover:text-ink grid size-9 place-items-center rounded-full border transition-colors"
          >
            <Chevron className="size-4 rotate-180" />
          </button>
          <p className="text-ink-3 font-mono text-sm tabular-nums">
            {i + 1} / {items.length}
          </p>
          <button
            type="button"
            onClick={() => go(i + 1)}
            aria-label="Next milestone"
            className="border-accent-400/50 text-accent-400 hover:bg-accent-400 hover:text-ink grid size-9 place-items-center rounded-full border transition-colors"
          >
            <Chevron className="size-4" />
          </button>
        </li>
      </ol>
    </div>
  );
}

function Chevron({ className }: { className?: string }) {
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
