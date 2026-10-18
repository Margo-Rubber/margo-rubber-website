import { ogCard, OG_SIZE, OG_TYPE } from "@/lib/og-card";

export const size = OG_SIZE;
export const contentType = OG_TYPE;
export const alt = "Margo Rubber Products: precision rubber components made to drawing in Nashik, India";

/** The home page's share card; pages without a card of their own inherit it. */
export default async function Image() {
  return ogCard({
    eyebrow: "Rubber components manufacturer",
    title: "Precision moulded and extruded rubber parts, made to your drawing",
  });
}
