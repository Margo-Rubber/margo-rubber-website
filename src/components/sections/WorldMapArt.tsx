import { geoEquirectangular, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";
import world from "world-atlas/countries-110m.json";
import { EXPORT_GEO, HUB_COORDS } from "@/content/export-geo";

/**
 * World map plate for /export.
 *
 * Inlined SVG so the destination pins can carry real anchor links into their
 * market sections. Server-only: the projection and Natural Earth outlines run
 * here and the browser receives finished path strings.
 *
 * Real geography (client, 2 Nov 2026: "export map is wrong"). The Figma
 * plate's continents were hand-drawn blobs and the CMS pin coordinates were
 * read off them, so the UK sat in the sea and Singapore next to Australia.
 * The land is now Natural Earth 110m, and every pin is projected from its
 * port's longitude/latitude (see placePin); the CMS x/y is only a fallback
 * for a market this file does not know.
 *
 * Equirectangular, 3.2px per degree, with Nashik held at 650,200 in the
 * 1000x500 viewBox, where the original artwork had it. That span runs from
 * the US west coast to east of Australia.
 */
export const MAP_VIEWBOX = "0 0 1000 500";

const HUB = { x: 650, y: 200 };
const PX_PER_DEG = 3.2;

const projection = geoEquirectangular()
  .scale((PX_PER_DEG * 180) / Math.PI)
  .center(HUB_COORDS as [number, number])
  .translate([HUB.x, HUB.y])
  .clipExtent([[0, 0], [1000, 500]]);

let landCache: string | null = null;
function plate() {
  if (landCache === null) {
    const topo = world as unknown as Topology<{ countries: GeometryCollection }>;
    landCache = geoPath(projection).digits(1)(feature(topo, topo.objects.countries)) ?? "";
  }
  return { land: landCache };
}

export type LabelPlacement = { dx: number; dy: number; anchor: "start" | "middle" | "end" };

/**
 * Ports for the /export markets the homepage table (export-geo.ts) does not
 * carry, plus label placements for this plate. Placements are in viewBox
 * units; they keep the close pairs (UAE/Saudi, Malaysia/Singapore,
 * Kenya/Tanzania, UK/EU) from printing over each other or over Nashik.
 */
const PLATE_GEO: Record<string, { coords?: readonly [number, number]; label?: LabelPlacement }> = {
  // Port of New York & New Jersey: the nearer of the two US coasts.
  US: { coords: [-74.04, 40.67] },
  // Hamburg. Rotterdam sits on top of Felixstowe at this scale.
  EU: { coords: [9.97, 53.54], label: { dx: 16, dy: -2, anchor: "start" } },
  // Above its pin: the US lane passes just under Felixstowe.
  GB: { label: { dx: -10, dy: -14, anchor: "end" } },
  AE: { label: { dx: -4, dy: 18, anchor: "end" } },
  SA: { label: { dx: -14, dy: -8, anchor: "end" } },
  MY: { label: { dx: -16, dy: -2, anchor: "end" } },
  SG: { label: { dx: 16, dy: 10, anchor: "start" } },
  KE: { label: { dx: -16, dy: -2, anchor: "end" } },
  TZ: { label: { dx: -16, dy: 12, anchor: "end" } },
};

/** CMS pin labels and market slugs → country code. */
const PLATE_CODES: Record<string, string> = {
  AUSTRALIA: "AU",
  "UNITED KINGDOM": "GB",
  UK: "GB",
  "UNITED ARAB EMIRATES": "AE",
  UAE: "AE",
  "SAUDI ARABIA": "SA",
  MALAYSIA: "MY",
  SINGAPORE: "SG",
  KENYA: "KE",
  TANZANIA: "TZ",
  "UNITED STATES": "US",
  USA: "US",
  "EUROPEAN UNION": "EU",
  EU: "EU",
  australia: "AU",
  uk: "GB",
  "uae-saudi": "AE",
  malaysia: "MY",
  singapore: "SG",
  "east-africa": "KE",
  usa: "US",
  eu: "EU",
};

export type PlacedPin = { x: number; y: number; label?: string; placement?: LabelPlacement };

/**
 * Where a pin goes on the plate: its port projected, matched by label first
 * and then by market slug. Unknown markets keep the CMS coordinates.
 */
export function placePin(
  pin: { x: number; y: number },
  label?: string,
  slug?: string,
): PlacedPin {
  const code =
    (label && PLATE_CODES[label.trim().toUpperCase()]) || (slug && PLATE_CODES[slug]) || undefined;
  const coords = code ? (PLATE_GEO[code]?.coords ?? EXPORT_GEO[code]?.coords) : undefined;
  const p = coords && projection(coords as [number, number]);
  if (!code || !p) return { ...pin, label };
  const r = (n: number) => Math.round(n * 10) / 10;
  return { x: r(p[0]), y: r(p[1]), label, placement: PLATE_GEO[code]?.label };
}

/** Graticule and landmasses. Never animated. */
/* Brightened 27 Oct 2026 (client: "a bit brighter"): plate #070D10 → #0D171C,
   land #1A2428 → #28393F with borders at 0.38 (was 0.15), grid 0.08 (was
   0.04), pins and labels lifted. */
export function MapBase() {
  return (
    <g clipPath="url(#margo-map-clip)">
      <path
        d="M988 0H12C5.37258 0 0 5.37258 0 12V488C0 494.627 5.37258 500 12 500H988C994.627 500 1000 494.627 1000 488V12C1000 5.37258 994.627 0 988 0Z"
        fill="#0D171C"
      />
      <path
        d="M0 100H1000"
        stroke="#2BBCC4"
        strokeOpacity="0.08"
        strokeWidth="0.8"
      />
      <path
        d="M0 150H1000"
        stroke="#2BBCC4"
        strokeOpacity="0.08"
        strokeWidth="0.8"
      />
      <path
        d="M0 200H1000"
        stroke="#2BBCC4"
        strokeOpacity="0.08"
        strokeWidth="0.8"
      />
      <path
        d="M0 250H1000"
        stroke="#2BBCC4"
        strokeOpacity="0.08"
        strokeWidth="0.8"
      />
      <path
        d="M0 300H1000"
        stroke="#2BBCC4"
        strokeOpacity="0.08"
        strokeWidth="0.8"
      />
      <path
        d="M0 350H1000"
        stroke="#2BBCC4"
        strokeOpacity="0.08"
        strokeWidth="0.8"
      />
      <path
        d="M0 400H1000"
        stroke="#2BBCC4"
        strokeOpacity="0.08"
        strokeWidth="0.8"
      />
      <path
        d="M100 0V500"
        stroke="#2BBCC4"
        strokeOpacity="0.08"
        strokeWidth="0.8"
      />
      <path
        d="M200 0V500"
        stroke="#2BBCC4"
        strokeOpacity="0.08"
        strokeWidth="0.8"
      />
      <path
        d="M300 0V500"
        stroke="#2BBCC4"
        strokeOpacity="0.08"
        strokeWidth="0.8"
      />
      <path
        d="M400 0V500"
        stroke="#2BBCC4"
        strokeOpacity="0.08"
        strokeWidth="0.8"
      />
      <path
        d="M500 0V500"
        stroke="#2BBCC4"
        strokeOpacity="0.08"
        strokeWidth="0.8"
      />
      <path
        d="M600 0V500"
        stroke="#2BBCC4"
        strokeOpacity="0.08"
        strokeWidth="0.8"
      />
      <path
        d="M700 0V500"
        stroke="#2BBCC4"
        strokeOpacity="0.08"
        strokeWidth="0.8"
      />
      <path
        d="M800 0V500"
        stroke="#2BBCC4"
        strokeOpacity="0.08"
        strokeWidth="0.8"
      />
      <path
        d="M900 0V500"
        stroke="#2BBCC4"
        strokeOpacity="0.08"
        strokeWidth="0.8"
      />
      <path
        d={plate().land}
        fill="#28393F"
        stroke="#2BBCC4"
        strokeOpacity="0.38"
        strokeWidth="0.6"
        strokeLinejoin="round"
      />
    </g>
  );
}

/**
 * The arc for a pin: a cubic from Nashik (650,200) with control points a
 * third and two-thirds of the way along, both lifted by a fifth of the
 * lane's length, so short Gulf lanes stay shallow and the US lane arcs high.
 * (The Figma file's hand-drawn arcs were keyed to its old pin positions and
 * went with them.)
 */
export function laneFor(x: number, y: number): string | undefined {
  if (!Number.isFinite(x) || !Number.isFinite(y)) return undefined;
  const r = (n: number) => Math.round(n * 10) / 10;
  const dx = x - HUB.x;
  const dy = y - HUB.y;
  const lift = Math.hypot(dx, dy) * 0.2;
  const c1 = [r(HUB.x + dx / 3), r(HUB.y + dy / 3 - lift)];
  const c2 = [r(HUB.x + (dx * 2) / 3), r(HUB.y + (dy * 2) / 3 - lift)];
  return `M${HUB.x} ${HUB.y}C${c1[0]} ${c1[1]} ${c2[0]} ${c2[1]} ${x} ${y}`;
}

/**
 * Destination pin. The source artwork had these as baked absolute paths; they
 * are plain circles of the same geometry (r12 ring, r4 dot) so they can be
 * placed from the market's own pin coordinates.
 */
export function MapPin({
  x,
  y,
  label,
  placement,
}: {
  x: number;
  y: number;
  label?: string;
  placement?: LabelPlacement;
}) {
  return (
    <>
      <circle cx={x} cy={y} r="12" stroke="#2BBCC4" opacity="0.5" />
      <circle cx={x} cy={y} r="4" fill="#2BBCC4" />
      {label && <PinLabel x={x} y={y} label={label} placement={placement} />}
    </>
  );
}

/**
 * A pin's name, set beside it in the site's mono caps (sheet 06 §03: the
 * nine destinations and the origin, each labelled). Pins in the eastern
 * third of the plate take their label on the left so it stays inside the
 * frame; the origin's sits below its marker, clear of the lanes, which all
 * leave it heading upward.
 * A `placement` from placePin overrides both.
 */
export function PinLabel({
  x,
  y,
  label,
  strong = false,
  placement,
}: {
  x: number;
  y: number;
  label: string;
  strong?: boolean;
  placement?: LabelPlacement;
}) {
  const left = x > 720;
  const at: LabelPlacement =
    placement ??
    (strong
      ? { dx: 0, dy: 30, anchor: "middle" }
      : { dx: left ? -16 : 16, dy: 4, anchor: left ? "end" : "start" });
  return (
    <text
      x={x + at.dx}
      y={y + at.dy}
      textAnchor={at.anchor}
      fill={strong ? "#2BBCC4" : "#D2DEE1"}
      fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
      fontSize={strong ? 11 : 10}
      letterSpacing="0.12em"
      style={{ textTransform: "uppercase" }}
    >
      {label}
    </text>
  );
}

/** Clip path + defs. Rendered once per <svg>. */
export function MapDefs() {
  return (
    <defs>
      <clipPath id="margo-map-clip">
        <rect width="1000" height="500" fill="white" />
      </clipPath>
    </defs>
  );
}
