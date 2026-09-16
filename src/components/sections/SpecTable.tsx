"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { emphasised } from "@/components/ui/Emphasis";

type Props = {
  columns: string[];
  rows: string[][];
  footnote?: string;
  /** Filter chips and search box. See the note at the render site. */
  controls?: boolean;
  /** The standards a chip can select, in the sheet's order. */
  chips?: string[];
  searchPlaceholder?: string;
};

/**
 * Standard families a chip can select, in chip order. Only the families that
 * appear in the first column are offered — "a filter with nothing to select
 * is a dead control" (sheet 09 §02), and the same component serves oil-seal,
 * gasket and bush tables whose families differ.
 */
const FAMILIES = ["AS568", "ISO", "JIS", "DIN", "ASME", "EN", "ASTM", "BS", "SAE"];

/**
 * A chip is a standard's name, matched as a whole word in any cell — or, for
 * a table filtered by service rather than by standard (the bellows page's
 * "Fatigue-critical", "Oil contact"), `Label :: pattern`, a regular
 * expression a cell must match.
 */
const chipLabel = (chip: string) => chip.split(" :: ")[0];
const chipTest = (chip: string): RegExp => {
  const [label, pattern] = chip.split(" :: ");
  return pattern ? new RegExp(pattern, "i") : new RegExp(`(^|[^A-Z0-9])${label}(?![A-Z0-9])`, "i");
};
const mentions = (row: string[], chip: string) => {
  const re = chipTest(chip);
  return row.some((cell) => re.test(cell));
};

/**
 * The spec table is a real <table>, never an image — required by both AI
 * crawlers and Product schema, and it is the single most load-bearing element
 * on a category page.
 *
 * On mobile it scrolls horizontally inside its own container rather than
 * stacking: stacking would destroy the column-to-column comparability that is
 * the entire point of the table.
 */
export function SpecTable({ columns, rows, footnote, controls = true, chips, searchPlaceholder }: Props) {
  const [family, setFamily] = useState<string>("all");
  // A catalogue of sizes keeps every cell on one line so the columns compare;
  // a reference table (no controls) carries prose in its cells and wraps.
  const ws = controls ? "whitespace-pre" : "whitespace-pre-line";
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<{ col: number; dir: 1 | -1 } | null>(null);
  // A chip list may open with its own "All …" label ("All standards").
  const allLabel = chips?.[0] && /^all\b/i.test(chips[0]) ? chips[0] : "All Standards";
  const families = useMemo(
    () => (chips ?? FAMILIES).filter((f) => !/^all\b/i.test(f) && rows.some((r) => mentions(r, f))),
    [rows, chips],
  );

  const visible = useMemo(() => {
    let out = rows;

    if (family !== "all") {
      out = out.filter((r) => mentions(r, family));
    }
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      out = out.filter((r) => r.some((cell) => cell.toLowerCase().includes(q)));
    }
    if (sort) {
      out = [...out].sort((a, b) => {
        const av = a[sort.col];
        const bv = b[sort.col];
        // Numeric-aware compare so "12.42" sorts after "4.475".
        const an = parseFloat(av.replace(/[^\d.]/g, ""));
        const bn = parseFloat(bv.replace(/[^\d.]/g, ""));
        const cmp =
          !Number.isNaN(an) && !Number.isNaN(bn)
            ? an - bn
            : av.localeCompare(bv);
        return cmp * sort.dir;
      });
    }
    return out;
  }, [rows, family, query, sort]);

  function toggleSort(col: number) {
    setSort((s) =>
      s?.col === col ? { col, dir: s.dir === 1 ? -1 : 1 } : { col, dir: 1 },
    );
  }

  return (
    <div>
      {/* Controls. Off for tables that are a short reference rather than a
          searchable catalogue — the compound tables on the UI-changes2
          category pages are five rows, and the standard-family chips below
          are O-ring families that never match a compound name. */}
      {controls && (
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-2">
          <Chip active={family === "all"} onClick={() => setFamily("all")}>
            {allLabel}
          </Chip>
          {families.map((f) => (
            <Chip key={f} active={family === f} onClick={() => setFamily(f)}>
              {chipLabel(f)}
            </Chip>
          ))}
        </div>

        <label className="ml-auto flex min-w-[220px] items-center gap-2">
          <span className="sr-only">Filter by ID or dimension</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={searchPlaceholder ?? "Filter by ID or dimension…"}
            className="border-line bg-surface-2 text-ink placeholder:text-ink-4 focus:border-accent-400 w-full rounded-pill border px-4 py-2 text-sm"
          />
        </label>
      </div>
      )}

      {/* Table */}
      <div className="border-line rounded-card border overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              {columns.map((c, i) => {
                const isSorted = sort?.col === i;
                return (
                  <th
                    key={c}
                    scope="col"
                    aria-sort={
                      isSorted
                        ? sort.dir === 1
                          ? "ascending"
                          : "descending"
                        : "none"
                    }
                    className="bg-accent-400 text-canvas px-4 py-3 text-left font-semibold whitespace-nowrap"
                  >
                    {controls ? (
                      <button
                        type="button"
                        onClick={() => toggleSort(i)}
                        className="inline-flex items-center gap-1.5"
                      >
                        {c}
                        <span aria-hidden className="opacity-60">
                          {isSorted ? (sort.dir === 1 ? "▲" : "▼") : "↕"}
                        </span>
                      </button>
                    ) : (
                      // A reference table reads in the sheet's order; nothing to sort.
                      c
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {/* Every row stays in the DOM — a filtered table that unmounts
                hides the specification from a crawler. Rows outside the
                current filter are hidden; the sorted order is applied on top. */}
            {(sort ? visible : rows).map((r, ri) => (
              <tr
                key={r[0] + ri}
                hidden={!visible.includes(r)}
                className="odd:bg-surface-2/40"
              >
                {r.map((cell, ci) =>
                  ci === 0 ? (
                    /* The row label is a row heading, not a data cell and not
                       an <h3> — what a screen reader and an assistant both key
                       the row on. */
                    <th
                      key={ci}
                      scope="row"
                      className={`border-line text-ink border-t px-4 py-3 text-left font-medium align-top ${ws}`}
                    >
                      {emphasised(cell, "text-ink font-semibold")}
                    </th>
                  ) : (
                    <td
                      key={ci}
                      className={`border-line text-ink-2 border-t px-4 py-3 align-top ${ws} ${
                        columns[ci]?.includes("FKM") ? "text-accent-400" : ""
                      }`}
                    >
                      {emphasised(cell, "text-ink font-semibold")}
                    </td>
                  ),
                )}
              </tr>
            ))}
            {!visible.length && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-ink-4 border-line border-t px-4 py-8 text-center"
                >
                  No sizes match that filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {footnote && (
          <p className="text-ink-4 border-line border-t px-4 py-3 text-xs whitespace-pre-line">
            {disclaimerLinked(withCount(footnote, visible.length, rows.length, controls))}
          </p>
        )}
      </div>
    </div>
  );
}

/**
 * The count belongs to the filter, so it goes with it. A footnote written
 * with its own "Showing 9 of 9 entries." keeps that wording and gets the
 * live numbers; one written without gets "Showing N of M · " in front.
 */
function withCount(footnote: string, shown: number, total: number, controls: boolean) {
  const count = `Showing ${shown} of ${total}`;
  if (/^Showing \d+ of \d+/.test(footnote))
    return controls ? footnote.replace(/^Showing \d+ of \d+/, count) : footnote.replace(/^Showing \d+ of \d+( entries)?[ ·.]+/, "");
  return controls ? `${count} · ${footnote}` : footnote;
}

/**
 * "Typical values. See our technical disclaimer." — every technical table
 * links the disclaimer (sheet 08, page-level). The words stay the sheet's;
 * only the phrase becomes the link.
 */
function disclaimerLinked(text: string) {
  const parts = text.split(/(technical disclaimer)/i);
  return parts.map((part, i) =>
    i % 2 ? (
      <Link key={i} href="/legal/disclaimer" className="text-ink-3 underline underline-offset-2 hover:text-ink">
        {part}
      </Link>
    ) : (
      <span key={i}>{emphasised(part, "text-ink-2 font-semibold")}</span>
    ),
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-pill px-4 py-1.5 text-xs font-medium transition-colors ${
        active
          ? "bg-accent-400 text-canvas"
          : "border-line text-ink-3 hover:text-ink border"
      }`}
    >
      {children}
    </button>
  );
}
