"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type MouseEvent, type PointerEvent } from "react";
import type { ExportMapData } from "@/lib/export-map";

/**
 * Homepage export map + lane cards, sharing one highlight.
 *
 * The geometry arrives finished from the server (see lib/export-map); this
 * component only tracks which lane is "active" so a dot, its arc and its card
 * light up together, from whichever of the three was hovered or focused.
 *
 * Touch: pointerenter from a finger is ignored, so a tap goes straight to the
 * export page without leaving a stuck highlight behind.
 */
type Card = { code: string; name: string; note: string; href?: string };

export function ExportMap({
  data,
  hubLabel,
  cards,
  children,
}: {
  data: ExportMapData;
  hubLabel: string;
  cards: readonly Card[];
  children?: React.ReactNode;
}) {
  const router = useRouter();
  const [active, setActive] = useState<string | null>(null);
  const { w, h, land, hub, routes } = data;

  const hoverOn = (code: string) => (e: PointerEvent) => {
    if (e.pointerType !== "touch") setActive(code);
  };
  const hoverOff = () => setActive(null);

  // SVG <a> is a plain anchor, so route it through the App Router for a
  // client-side transition. Modified clicks (new tab etc.) keep the default.
  const go = (href: string) => (e: MouseEvent) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    router.push(href);
  };

  return (
    <div className="xmap grid gap-6 lg:grid-cols-[minmax(0,1fr)_26rem]" data-active={active ?? undefined}>
      <div className="rounded-card border-line overflow-hidden border bg-[#0F1115] p-4">
        <svg
          viewBox={`0 0 ${w} ${h}`}
          className="h-auto w-full"
          role="img"
          aria-labelledby="home-map-title"
          aria-describedby="home-map-desc"
        >
          {/* Named inside the SVG so the lanes are in the text layer a
              crawler reads (sheet 01 §09: <title> and <desc> on the <svg>). */}
          <title id="home-map-title">{`Export lanes from ${hubLabel}`}</title>
          <desc id="home-map-desc">{`Sea lanes from ${hubLabel} to ${routes.map((r) => r.name).join(", ")}.`}</desc>

          <defs>
            <filter id="xmap-glow" x="-200%" y="-200%" width="500%" height="500%">
              <feGaussianBlur stdDeviation="6" />
            </filter>
          </defs>

          {/* Countries: quiet dark-grey shapes; the stroke in the plate colour
              reads as the borders between them. */}
          <path d={land} className="xmap-land" />

          {routes.map((r, i) => {
            const d = `M ${hub.x} ${hub.y} Q ${r.cx} ${r.cy} ${r.x} ${r.y}`;
            const on = active === r.code;
            return (
              <g key={r.key} className={`xmap-route${on ? " is-active" : ""}`}>
                <path className="xmap-arc" d={d} fill="none" stroke="var(--color-accent-400)" />
                {/* Moving lines: dashes flow hub -> destination, then a
                    brighter pulse rides the same route. Staggered per lane. */}
                <path
                  className="margo-lane-flow"
                  d={d}
                  fill="none"
                  stroke="var(--color-accent-400)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  pathLength={100}
                  style={{ animationDelay: `${-(i * 0.9)}s` }}
                  aria-hidden
                />
                <path
                  className="margo-lane-pulse"
                  d={d}
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  pathLength={100}
                  style={{ animationDelay: `${-(i * 1.1)}s` }}
                  aria-hidden
                />

                {r.href ? (
                  <a
                    href={r.href}
                    className="xmap-link"
                    aria-label={`${r.name}: export details`}
                    onClick={go(r.href)}
                    onPointerEnter={hoverOn(r.code)}
                    onPointerLeave={hoverOff}
                    onFocus={() => setActive(r.code)}
                    onBlur={hoverOff}
                  >
                    <Dot r={r} />
                  </a>
                ) : (
                  <Dot r={r} />
                )}
              </g>
            );
          })}

          {/* Nashik origin: soft glow behind the existing ring + core. */}
          <circle cx={hub.x} cy={hub.y} r="12" fill="var(--color-accent-400)" opacity="0.45" filter="url(#xmap-glow)" />
          <circle cx={hub.x} cy={hub.y} r="14" fill="none" stroke="var(--color-accent-400)" strokeWidth="1.5" />
          <circle cx={hub.x} cy={hub.y} r="6" fill="var(--color-accent-400)" />
          <text x={hub.x} y={hub.y} dx="2em" dy="0.35em" className="xmap-label xmap-label--hub" fill="var(--color-ink)">
            <tspan className="xmap-long">{hubLabel}</tspan>
            <tspan className="xmap-short">NASHIK</tspan>
          </text>
        </svg>
      </div>

      <div className="flex flex-col gap-3.5">
        {/* Sheet 01 §09: <h2> + four <h3> market names; the country code
            is decoration, the accessible name is the full country. */}
        <ul className="flex flex-col gap-3.5">
          {cards.map((l) => (
            <li
              key={l.code}
              className={`xmap-card margo-card rounded-card border-line relative flex items-center gap-4 border bg-[#0F1115] px-5 py-4${active === l.code ? " is-active" : ""}`}
              onPointerEnter={hoverOn(l.code)}
              onPointerLeave={hoverOff}
              onFocus={() => setActive(l.code)}
              onBlur={hoverOff}
            >
              <span
                aria-hidden="true"
                className="text-eyebrow border-accent-400/20 bg-accent-400/10 text-accent-400 grid size-10 shrink-0 place-items-center rounded-lg border font-mono"
              >
                {l.code}
              </span>
              <div>
                <h3 className="text-ink text-sm font-semibold">
                  {l.href ? (
                    <Link href={l.href} className="hover:text-accent-400 transition-colors after:absolute after:inset-0">
                      {l.name}
                    </Link>
                  ) : (
                    l.name
                  )}
                </h3>
                <p className="text-ink-4 mt-0.5 text-sm">{l.note}</p>
              </div>
            </li>
          ))}
        </ul>
        {children}
      </div>
    </div>
  );
}

function Dot({ r }: { r: ExportMapData["routes"][number] }) {
  return (
    <>
      {/* Generous invisible hit area so the dot is easy to tap. */}
      <circle cx={r.x} cy={r.y} r="14" fill="transparent" />
      <circle cx={r.x} cy={r.y} r="9" className="xmap-ring" fill="none" stroke="var(--color-accent-400)" strokeWidth="1.5" />
      <circle cx={r.x} cy={r.y} r="4.5" className="xmap-dot" fill="#ffffff" />
      <text
        x={r.x}
        y={r.y}
        dx={`${r.label.dx}em`}
        dy={`${r.label.dy}em`}
        textAnchor={r.label.anchor}
        className="xmap-label"
        fill="var(--color-ink)"
      >
        <tspan className="xmap-long">{r.name.toUpperCase()}</tspan>
        <tspan className="xmap-short">{r.short}</tspan>
      </text>
    </>
  );
}
