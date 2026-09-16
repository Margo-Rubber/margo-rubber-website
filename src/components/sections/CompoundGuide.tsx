"use client";

import { useState } from "react";

/**
 * Five elastomer families as tabs, with the selected one expanded beneath.
 *
 * The table below repeats every row, and deliberately: the tabs are for
 * choosing one, the table for comparing all five. It also means the page
 * still answers the question with JavaScript unavailable.
 */
export function CompoundGuide({
  items,
}: {
  items: readonly {
    code: string;
    fullName: string;
    hardness: string;
    tempRange: string;
    applications: string;
  }[];
}) {
  const [active, setActive] = useState(0);
  // Every panel is in the DOM at first paint and hidden with the `hidden`
  // attribute, never unmounted: a panel that mounts on click does not exist
  // for a crawler, and these descriptions are the passage an assistant lifts.
  const panelId = (code: string) =>
    `compound-${code.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

  return (
    <div>
      <div
        role="tablist"
        aria-label="Compound families"
        className="flex flex-wrap justify-center gap-2"
      >
        {items.map((c, i) => (
          <button
            key={c.code}
            type="button"
            role="tab"
            id={`${panelId(c.code)}-tab`}
            aria-selected={i === active}
            aria-controls={panelId(c.code)}
            onClick={() => setActive(i)}
            className={`rounded-lg px-5 py-2 font-mono text-xs tracking-[0.1em] transition-colors ${
              i === active
                ? "bg-accent-400 text-canvas"
                : "border-line text-ink-3 hover:text-ink border"
            }`}
          >
            {c.code}
          </button>
        ))}
      </div>

      {items.map((sel, i) => (
        <div
          key={sel.code}
          id={panelId(sel.code)}
          role="tabpanel"
          aria-labelledby={`${panelId(sel.code)}-tab`}
          hidden={i !== active}
          className="mt-8 grid gap-5 lg:grid-cols-[1.6fr_1fr]"
        >
          <div className="border-line bg-surface-3 rounded-card border p-7">
            <p className="text-ink-4 font-mono text-[10px] tracking-[0.16em] uppercase">
              Selected Compound
            </p>
            <p className="text-accent-400 mt-3 text-2xl font-bold">
              {sel.code}
            </p>
            <p className="text-ink-3 mt-1 font-mono text-xs">{sel.fullName}</p>

            <dl className="mt-7 grid gap-6 sm:grid-cols-2">
              <div>
                <dt className="text-ink-4 font-mono text-[10px] tracking-[0.16em] uppercase">
                  Hardness Range
                </dt>
                <dd className="text-ink mt-2 text-lg font-semibold">
                  {sel.hardness}
                </dd>
              </div>
              <div>
                <dt className="text-ink-4 font-mono text-[10px] tracking-[0.16em] uppercase">
                  Service Temperature
                </dt>
                <dd className="text-ink mt-2 text-lg font-semibold whitespace-pre-line">
                  {sel.tempRange}
                </dd>
              </div>
            </dl>
          </div>

          <div className="border-line bg-surface-3 rounded-card border p-7">
            <p className="text-ink-4 font-mono text-[10px] tracking-[0.16em] uppercase">
              Key Applications
            </p>
            <p className="text-ink-2 mt-3 text-sm leading-relaxed">
              {sel.applications}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
