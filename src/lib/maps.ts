/**
 * GOOGLE MAPS LINK FOR THE PLANT
 *
 * Opens Margo's own Google Business listing ("Margo Rubber Products",
 * Vilholi, Nashik) — name, photos, reviews, directions — instead of a bare
 * pin dropped at a pair of coordinates.
 *
 * The place ID is Google's permanent identifier for that listing, so it is
 * a code constant rather than a CMS field: nobody edits it, and it does not
 * change when the listing's details do. If the listing is ever replaced,
 * look the new ID up at
 * https://developers.google.com/maps/documentation/places/web-service/place-id
 *
 * Uses Google's documented Maps URLs format (no API key needed).
 */
export const GOOGLE_PLACE_ID = "ChIJjyRECkTr3TsRAPBPxlXi_jM";

export function googleMapsUrl(name: string): string {
  const q = new URLSearchParams({
    api: "1",
    query: name,
    query_place_id: GOOGLE_PLACE_ID,
  });
  return `https://www.google.com/maps/search/?${q.toString()}`;
}
