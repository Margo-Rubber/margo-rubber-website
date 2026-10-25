import { geoEquirectangular, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";
import world from "world-atlas/countries-110m.json";
import { EXPORT_GEO, HUB_COORDS, codeForName } from "@/content/export-geo";

/**
 * Server-side geometry for the homepage export map.
 *
 * Everything here runs on the server: the projection, the country outlines and
 * the projected dots. The browser receives finished SVG path strings and no
 * map library and no world data, which is why this is d3-geo rather than
 * react-simple-maps.
 *
 * Equirectangular, cropped from just west of the UK to just east of Melbourne.
 * It keeps the plate at roughly the 600x380 the section was designed around;
 * Natural Earth over the same span is ~25% taller than the card column.
 */
export const MAP_W = 600;
const CROP = { west: -10, east: 153, north: 57, south: -43 };

const cropBox = {
  type: "MultiPoint" as const,
  coordinates: [
    [CROP.west, CROP.north],
    [CROP.east, CROP.north],
    [CROP.west, CROP.south],
    [CROP.east, CROP.south],
  ],
};

let cache: { h: number; land: string } | null = null;

function base() {
  if (cache) return cache;
  const fit = geoEquirectangular().fitWidth(MAP_W, cropBox);
  const [[, y0], [, y1]] = geoPath(fit).bounds(cropBox);
  const h = Math.round(y1 - y0);
  const topo = world as unknown as Topology<{ countries: GeometryCollection }>;
  const land = geoPath(projection(h)).digits(0)(feature(topo, topo.objects.countries)) ?? "";
  cache = { h, land };
  return cache;
}

function projection(h: number) {
  return geoEquirectangular()
    .fitExtent([[0, 0], [MAP_W, h]], cropBox)
    .clipExtent([[0, 0], [MAP_W, h]]);
}

const r1 = (n: number) => Math.round(n * 10) / 10;

export type MapRoute = {
  key: string;
  code: string;
  name: string;
  short: string;
  href?: string;
  x: number;
  y: number;
  /** Quadratic control point, bowed away from the straight line. */
  cx: number;
  cy: number;
  label: { dx: number; dy: number; anchor: "start" | "middle" | "end" };
  /** Index of the matching card, or -1 for a map-only pin. */
  card: number;
};

export type ExportMapData = {
  w: number;
  h: number;
  land: string;
  hub: { x: number; y: number };
  routes: MapRoute[];
};

export type LaneCard = { code: string; name: string; note: string; href?: string };

/**
 * Sanity lanes as cards, plus a card for any map-only pin that has card copy
 * in export-geo (Saudi Arabia), placed after the lane it names.
 */
export function laneCards(
  lanes: readonly LaneCard[],
  pins: readonly { label: string }[],
): LaneCard[] {
  const cards = [...lanes];
  for (const p of pins) {
    const code = codeForName(p.label);
    const geo = code ? EXPORT_GEO[code] : undefined;
    if (!code || !geo?.card || cards.some((c) => c.code.toUpperCase() === code)) continue;
    const card = { code, name: geo.card.name, note: geo.card.note, href: geo.anchor };
    const at = geo.card.after ? cards.findIndex((c) => c.code.toUpperCase() === geo.card!.after) : -1;
    if (at >= 0) cards.splice(at + 1, 0, card);
    else cards.push(card);
  }
  return cards;
}

export function buildExportMap(
  lanes: readonly { code: string; name: string; href?: string }[],
  pins: readonly { label: string }[],
): ExportMapData {
  const { h, land } = base();
  const project = projection(h);
  const [hx, hy] = project(HUB_COORDS as [number, number])!;

  const routes: MapRoute[] = [];
  const add = (code: string | undefined, name: string, href: string | undefined, card: number) => {
    const geo = code ? EXPORT_GEO[code.toUpperCase()] : undefined;
    const p = geo && project(geo.coords as [number, number]);
    if (!geo || !p) {
      console.warn(`[export-map] No map position for "${name}" (${code ?? "no code"}); card only.`);
      return;
    }
    const [x, y] = p;
    routes.push({
      key: `${code}-${card}`,
      code: code!.toUpperCase(),
      name,
      short: geo.short,
      href: href || geo.anchor,
      x: r1(x),
      y: r1(y),
      cx: r1((hx + x) / 2),
      cy: r1((hy + y) / 2 - Math.abs(x - hx) * 0.28),
      label: geo.label ?? { dx: 1.1, dy: 0.35, anchor: "start" },
      card,
    });
  };

  lanes.forEach((l, i) => add(l.code, l.name, l.href, i));
  pins.forEach((p) => {
    const code = codeForName(p.label);
    // Skip a pin for a country that already has a card.
    if (code && lanes.some((l) => l.code.toUpperCase() === code)) return;
    add(code, p.label, undefined, -1);
  });

  return { w: MAP_W, h, land, hub: { x: r1(hx), y: r1(hy) }, routes };
}
