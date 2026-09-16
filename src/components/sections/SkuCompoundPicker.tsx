"use client";

import { useState } from "react";

export type Compound = {
  code: string;
  name: string;
  tempC: readonly [number, number] | number[];
  note: string;
  properties: string[];
  /** Sheet 34: "Recommended", "Suitable — hotter still", "Not recommended". */
  rankLabel?: string;
  /** The range as the sheet writes it, continuous rating on a second line. */
  temperature?: string;
  hardness?: string;
};

/**
 * Compound selector from the SKU design: a row of chips, the active one
 * outlined in accent with a SELECTED tick, and a detail panel beneath.
 *
 * Every compound's detail stays mounted (inactive panels are `hidden`, not
 * unmounted) so the whole material table is in the HTML for crawlers and
 * in-page search rather than appearing only on click.
 */
export function SkuCompoundPicker({ items }: { items: readonly Compound[] }) {
  const [i, setI] = useState(0);
  if (!items.length) return null;

  return (
    <>
      <ul role="tablist" aria-label="Compound options" className="grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {items.map((c, n) => (
          <li key={c.code}>
            <button
              type="button"
              role="tab"
              aria-selected={n === i}
              aria-controls={`compound-panel-${c.code}`}
              onClick={() => setI(n)}
              className={`w-full rounded-lg border p-5 text-left transition-colors ${
                n === i
                  ? "border-accent-400 bg-accent-400/8"
                  : "border-line hover:border-line-2 bg-[#0D0F12]"
              }`}
            >
              <span
                aria-hidden
                className="bg-accent-400 block size-8 rounded-full"
              />
              {c.rankLabel && (
                <span
                  className={`text-eyebrow mt-3 block font-mono uppercase ${
                    /not recommended/i.test(c.rankLabel) ? "text-ink-4" : "text-accent-400"
                  }`}
                >
                  {c.rankLabel}
                </span>
              )}
              <span className="text-ink mt-2 block text-lg font-semibold">
                {c.code}
              </span>
              <span className="text-ink-4 mt-0.5 block text-xs">{c.name}</span>
              {n === i && (
                <span className="text-eyebrow text-accent-400 mt-3 flex items-center gap-1.5 font-mono">
                  SELECTED
                  <svg viewBox="0 0 24 24" className="size-3" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden>
                    <path d="m5 12.5 4.5 4.5L19 7.5" />
                  </svg>
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>

      <div className="rounded-card border-line mt-5 border bg-[#0D0F12] p-7 md:p-8">
        {items.map((c, n) => (
          <div
            key={c.code}
            id={`compound-panel-${c.code}`}
            role="tabpanel"
            hidden={n !== i}
            className="panel-in grid gap-8 md:grid-cols-3"
          >
            <div>
              <p className="text-eyebrow text-accent-400 font-mono uppercase">
                Compound
              </p>
              <p className="text-ink mt-3 text-2xl font-semibold">{c.code}</p>
              <p className="text-ink-4 mt-1 text-sm">{c.name}</p>
            </div>
            <div>
              <p className="text-eyebrow text-accent-400 font-mono uppercase">
                Temperature range
              </p>
              {/* The sheet's own wording where it gives one; the settings
                  figures otherwise. */}
              <p className="text-ink mt-3 text-2xl font-semibold whitespace-pre-line">
                {c.temperature ?? `${c.tempC[0]} / +${c.tempC[1]}°C`}
              </p>
              {c.hardness && <p className="text-ink-4 mt-1 text-sm">{c.hardness}</p>}
            </div>
            <div>
              <p className="text-eyebrow text-accent-400 font-mono uppercase">
                {c.rankLabel ? "For this part" : "Properties"}
              </p>
              {c.rankLabel ? (
                <p className="text-ink-2 mt-3 text-sm leading-relaxed">{c.note}</p>
              ) : (
                <ul className="mt-3 flex flex-wrap gap-2">
                  {c.properties.length ? (
                    c.properties.map((p) => (
                      <li
                        key={p}
                        className="border-line-2 text-ink-2 rounded border px-2.5 py-1 text-xs"
                      >
                        {p}
                      </li>
                    ))
                  ) : (
                    <li className="text-ink-4 text-xs italic">On request</li>
                  )}
                </ul>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
