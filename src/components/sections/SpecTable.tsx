"use client";

import { useMemo, useState } from "react";

type Props = {
  columns: string[];
  rows: string[][];
  footnote?: string;
  /** Filter chips and search box. See the note at the render site. */
  controls?: boolean;
};

/** Standard families derived from the "Part / Standard ID" column. */
const FAMILIES = ["AS568", "ISO", "JIS", "DIN"] as const;

/**
 * The spec table is a real <table>, never an image — required by both AI
 * crawlers and Product schema, and it is the single most load-bearing element
 * on a category page.
 *
 * On mobile it scrolls horizontally inside its own container rather than
 * stacking: stacking would destroy the column-to-column comparability that is
 * the entire point of the table.
 */
export function SpecTable({ columns, rows, footnote, controls = true }: Props) {
  const [family, setFamily] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<{ col: number; dir: 1 | -1 } | null>(null);

  const visible = useMemo(() => {
    let out = rows;

    if (family !== "all") {
      out = out.filter((r) => r[0].toUpperCase().includes(family));
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
            All Standards
          </Chip>
          {FAMILIES.map((f) => (
            <Chip key={f} active={family === f} onClick={() => setFamily(f)}>
              {f}
            </Chip>
          ))}
        </div>

        <label className="ml-auto flex min-w-[220px] items-center gap-2">
          <span className="sr-only">Filter by ID or dimension</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter by ID or dimension…"
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
                {r.map((cell, ci) => (
                  <td
                    key={ci}
                    className={`border-line border-t px-4 py-3 whitespace-nowrap ${
                      ci === 0 ? "text-ink font-medium" : "text-ink-2"
                    } ${columns[ci]?.includes("FKM") ? "text-accent-400" : ""}`}
                  >
                    {cell}
                  </td>
                ))}
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
          <p className="text-ink-4 border-line border-t px-4 py-3 text-xs">
            {/* The count belongs to the filter, so it goes with it. */}
            {controls && `Showing ${visible.length} of ${rows.length} entries · `}
            {footnote.replace(/^Showing \d+ of \d+ entries · /, "")}
          </p>
        )}
      </div>
    </div>
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
