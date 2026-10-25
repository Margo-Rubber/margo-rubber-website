/**
 * Real-world positions for the homepage export map.
 *
 * Sanity holds each lane's name, note and link, but not a latitude/longitude,
 * so the map looks positions up here by ISO country code (lanes) or by name
 * (extra pins). The point is the export port named on the card, not the
 * country's centre, so the dot sits where the cargo actually lands.
 *
 * A lane whose code is missing here still renders its card; it just has no
 * dot or arc on the map (and a warning is logged on the server).
 *
 * `anchor` is the fallback link for a pin that has no card (and so no Sanity
 * href): the section on /export that covers that country.
 */
export type GeoPoint = {
  /** [longitude, latitude] */
  coords: readonly [number, number];
  /** Short label for narrow screens. */
  short: string;
  /** Section on /export that covers this country. */
  anchor?: string;
  /** Label placement relative to the dot, in em of the label's font size. */
  label?: { dx: number; dy: number; anchor: "start" | "middle" | "end" };
  /**
   * Side card for a country that is only a map pin in the CMS (no lane).
   * Once the editor adds a real lane for it in Studio, that lane's card is
   * used instead and this is ignored.
   */
  card?: { name: string; note: string; after?: string };
};

/** Nashik, the origin of every lane. */
export const HUB_COORDS: readonly [number, number] = [73.79, 20.0];

export const EXPORT_GEO: Record<string, GeoPoint> = {
  // Felixstowe
  GB: { coords: [1.35, 51.96], short: "UK", anchor: "/export#uk" },
  // Jebel Ali. Sits ~20px from Dammam, so its label goes below-left and
  // Saudi Arabia's above-left; neither reaches the Nashik origin.
  AE: {
    coords: [55.06, 25.01],
    short: "UAE",
    anchor: "/export#uae-saudi",
    label: { dx: 0.4, dy: 1.75, anchor: "end" },
  },
  // Dammam. No section of its own on /export; covered by the Gulf section.
  SA: {
    coords: [50.1, 26.43],
    short: "SAUDI",
    anchor: "/export#uae-saudi",
    label: { dx: -0.9, dy: -0.75, anchor: "end" },
    // Note copy is the fallback lane text from home.mdx; no transit time is
    // given because none is published for Dammam.
    card: { name: "Saudi Arabia", note: "Oil & gas, construction", after: "AE" },
  },
  // Port Klang
  MY: { coords: [101.39, 3.0], short: "MALAYSIA", anchor: "/export#malaysia" },
  // Melbourne. Near the right edge, so the label goes on the left.
  AU: {
    coords: [144.95, -37.84],
    short: "AUSTRALIA",
    anchor: "/export#australia",
    label: { dx: -1.1, dy: 0.35, anchor: "end" },
  },
  SG: { coords: [103.84, 1.26], short: "SINGAPORE", anchor: "/export#singapore" },
  KE: { coords: [39.67, -4.04], short: "KENYA", anchor: "/export#east-africa" },
  TZ: { coords: [39.29, -6.82], short: "TANZANIA", anchor: "/export#east-africa" },
};

/** Pins carry only a label, so they are matched by country name. */
const NAME_TO_CODE: Record<string, string> = {
  "UNITED KINGDOM": "GB",
  UK: "GB",
  "UNITED ARAB EMIRATES": "AE",
  UAE: "AE",
  "SAUDI ARABIA": "SA",
  MALAYSIA: "MY",
  AUSTRALIA: "AU",
  SINGAPORE: "SG",
  KENYA: "KE",
  TANZANIA: "TZ",
};

export function codeForName(name: string): string | undefined {
  return NAME_TO_CODE[name.trim().toUpperCase()];
}
