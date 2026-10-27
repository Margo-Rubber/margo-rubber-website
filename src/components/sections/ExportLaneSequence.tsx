import Link from "next/link";
import { Container } from "@/components/ui/Section";
import {
  MAP_VIEWBOX,
  MapBase,
  MapDefs,
  MapPin,
  PinLabel,
  laneFor,
} from "@/components/sections/WorldMapArt";

/**
 * TRADE LANES — the pinned scroll sequence on /export.
 *
 * The map holds still while the page scrolls past it, and each trade lane
 * draws itself from Nashik to its destination in turn, one market at a time.
 *
 * WHY THIS SECTION AND NOT ANOTHER. Export IS the business, and the arcs are
 * the proposition drawn literally. This is the one place on the site where a
 * long, attention-taking sequence is arguing for something rather than
 * decorating it — and it is the only major set-piece that needs no
 * photography, because the artwork is vector and the data is already locked.
 *
 * NO JAVASCRIPT. The whole thing runs on CSS scroll-driven animation:
 * `view-timeline` on the outer section, `position: sticky` for the pin, and
 * `animation-range` slicing the pinned scroll into one window per market. No
 * library, no scroll listener, no client boundary — this stays a Server
 * Component. See the TRADE LANE SEQUENCE block in globals.css.
 *
 * DEGRADATION IS THE DEFAULT, NOT THE FALLBACK. Every rule lives inside
 * `@supports (animation-timeline: view())`, plus a reduced-motion and a
 * min-width gate. Absent any of those the section is a plain static map with
 * every lane drawn and the markets listed beneath it — which is exactly what
 * this markup renders on its own. Nothing is hidden by default.
 *
 * NO NEW COPY. Everything here is derived from data that already exists: the
 * hub label, and each market's own chip and heading. There is no invented
 * prose to be signed off.
 */
export function ExportLaneSequence({
  hub,
  markets,
  extraPins = [],
}: {
  hub: { label: string; x: number; y: number };
  markets: readonly {
    slug: string;
    chip: string;
    heading: string;
    pin: { x: number; y: number };
    pinLabel?: string;
    pins?: readonly { label: string; x: number; y: number }[];
    pinNote?: string;
  }[];
  /** Pins with no lane: drawn once, still, without a route. */
  extraPins?: readonly { label: string; x: number; y: number }[];
}) {
  if (markets.length === 0) return null;
  const total = String(markets.length).padStart(2, "0");

  return (
    <section className="lane-seq bg-canvas relative">
      <div className="lane-seq__stage flex items-center py-16 md:py-0">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-14">
            {/* ── Map ────────────────────────────────────────────────── */}
            <div className="rounded-card border-line relative overflow-hidden border">
              <svg
                viewBox={MAP_VIEWBOX}
                // Load-bearing: the lane arcs are unclosed paths and would
                // fill solid black without it.
                fill="none"
                className="h-auto w-full"
                role="img"
                aria-labelledby="export-map-title"
                aria-describedby="export-map-desc"
              >
                {/* Named inside the SVG so the map is in the text layer a
                    crawler reads (sheet 01 §09: <title> and <desc> on the <svg>). */}
                <title id="export-map-title">{`Margo export trade lanes from ${hub.label}`}</title>
                <desc id="export-map-desc">{`Sea lanes from ${hub.label} to ${markets.map((m) => m.pinLabel ?? m.chip).join(", ")}.`}</desc>
                <MapBase />
                <g clipPath="url(#margo-map-clip)">
                  {markets.map((m, i) => {
                    // One arc per destination: the market's own pin, plus
                    // any second pin it carries (Saudi Arabia with the UAE,
                    // Tanzania with Kenya). All of a market's arcs share its
                    // data-lane, so they draw together in its scroll window.
                    const arcs = [m.pin, ...(m.pins ?? [])]
                      .map((p) => laneFor(p.x, p.y))
                      .filter((d): d is string => Boolean(d));
                    return (
                      <g key={m.slug}>
                        {arcs.map((d, k) => (
                          <g key={k}>
                            {/* The dashed route, always present. */}
                            <path
                              d={d}
                              stroke="#2BBCC4"
                              strokeOpacity="0.12"
                              strokeWidth="0.8"
                              strokeDasharray="5 4"
                            />
                            {/* The solid line that draws along it.
                                `pathLength="1"` normalises every arc to a
                                length of 1 regardless of its real geometry,
                                so one dashoffset keyframe drives all of them
                                despite them being wildly different lengths. */}
                            <path
                              className="lane-draw"
                              data-lane={i}
                              d={d}
                              pathLength={1}
                              stroke="#2BBCC4"
                              strokeWidth="1.6"
                              strokeLinecap="round"
                            />
                          </g>
                        ))}
                        {/* Each pin is a focusable link to its market block
                            (sheet 06 §03: "pins as focusable <a> elements"). */}
                        <a href={`#${m.slug}`} aria-label={`${m.pinLabel ?? m.chip} — read the market notes`}>
                          <g className="lane-pin" data-lane={i}>
                            {/* The tooltip is the pin's <title>: port · days · FCL/LCL. */}
                            {m.pinNote && <title>{`${m.pinLabel ?? m.chip}: ${m.pinNote}`}</title>}
                            <MapPin x={m.pin.x} y={m.pin.y} label={m.pinLabel} />
                            {(m.pins ?? []).map((p) => (
                              <MapPin key={p.label} x={p.x} y={p.y} label={p.label} />
                            ))}
                          </g>
                        </a>
                      </g>
                    );
                  })}
                  {extraPins.map((p) => (
                    <g key={`extra-${p.label}`} opacity="0.55">
                      <title>{p.label}</title>
                      <MapPin x={p.x} y={p.y} />
                    </g>
                  ))}
                  {/* The origin, named — the sheet's tenth label (06 §03). */}
                  <g>
                    <title>{`${hub.label} (origin)`}</title>
                    <circle cx={hub.x} cy={hub.y} r="5" fill="#2BBCC4" />
                    <circle cx={hub.x} cy={hub.y} r="14" stroke="#2BBCC4" opacity="0.35" />
                    <PinLabel x={hub.x} y={hub.y} label={hub.label} strong />
                  </g>
                </g>
                <MapDefs />
              </svg>
            </div>

            {/* ── Panel ──────────────────────────────────────────────── */}
            <div>
              <p className="text-eyebrow text-accent-400 font-mono uppercase">
                Trade lanes from {hub.label}
              </p>

              {/* Stacked, one per market, crossfading as its lane draws.
                  Display:none until the scroll timeline is available —
                  otherwise all eight would render on top of each other. */}
              <div className="lane-seq__focus relative mt-4 h-24">
                {markets.map((m, i) => (
                  <div
                    key={m.slug}
                    data-lane={i}
                    className="lane-focus absolute inset-0"
                  >
                    <p className="text-ink-4 font-mono text-sm">
                      {String(i + 1).padStart(2, "0")}
                      <span className="text-ink-4/50"> / {total}</span>
                    </p>
                    <p className="text-ink mt-1 text-2xl leading-tight font-semibold">
                      {m.chip}
                    </p>
                  </div>
                ))}
              </div>

              <ol className="mt-6 space-y-1">
                {markets.map((m, i) => (
                  <li key={m.slug} data-lane={i} className="lane-row">
                    <Link
                      href={`#${m.slug}`}
                      className="group flex items-center gap-3 rounded-lg py-2 pr-2 pl-3 text-sm transition-colors"
                    >
                      <span
                        aria-hidden
                        data-lane={i}
                        className="lane-row__bar bg-accent-400 h-4 w-[2px] shrink-0 origin-bottom rounded-full"
                      />
                      <span className="text-ink-2 group-hover:text-ink min-w-0 flex-1 truncate transition-colors">
                        {m.chip}
                      </span>
                      <span className="text-ink-4 font-mono text-xs">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </Link>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}
