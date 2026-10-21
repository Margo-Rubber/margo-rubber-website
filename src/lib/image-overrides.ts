import { cacheTag } from "next/cache";
import { client } from "../../sanity/client";
import { imageOverridesQuery } from "../../sanity/queries";

/**
 * PHOTOGRAPHS UPLOADED TO REPLACE STOCK IMAGES
 *
 * Fetched once per render of the site chrome and handed to every `Img` on the
 * page, rather than looked up per image.
 *
 * That shape is forced by where `Img` is used: four of the components that
 * draw images are client components, so `Img` cannot fetch anything itself.
 * The alternative — resolving overrides inside every page's data fetch — would
 * mean changing the props of every component that takes an image key, which is
 * most of them. Loading one small map at the top is the cheaper trade.
 *
 * The map is small by construction: at most one entry per registry slot, 85
 * slots, and only slots an editor has actually replaced.
 */

export const imageOverrideTag = () => "imageOverride";

export type ImageOverride = {
  url: string;
  alt: string;
  w: number;
  h: number;
  blur?: string;
};

export type ImageOverrideMap = Record<string, ImageOverride>;

type Row = {
  slot: string;
  alt: string | null;
  url: string | null;
  w: number | null;
  h: number | null;
  blur: string | null;
};

export async function getImageOverrides(): Promise<ImageOverrideMap> {
  "use cache";
  cacheTag(imageOverrideTag());

  const rows = await client.fetch<Row[]>(imageOverridesQuery).catch(() => []);

  const map: ImageOverrideMap = {};
  for (const r of rows) {
    // A row missing its asset or dimensions would remove the guarantee the
    // registry exists to provide — known width and height, so the page cannot
    // shift as the image loads. Skipping it falls back to the stock image,
    // which is worse-looking and correct, rather than better-looking and broken.
    // `alt` may legitimately be empty — a decorative image. Only the pieces
    // that guarantee the layout (url, width, height) are mandatory here.
    if (!r.url || !r.w || !r.h) continue;
    // Retired slot (D4): "sku.product" was the shared stand-in photo for a
    // part without its own, and holds the EPDM oil-seal photograph. No page
    // draws it any more (SkuBlocks: a part's own photo or none), so it is
    // not sent to the browser. Delete the upload in Studio → Photographs.
    if (r.slot === "sku.product") continue;
    map[r.slot] = {
      // Some uploads are camera originals (8000×6000, 3–4 MB). Next fetches
      // the original before resizing it, so cap it at Sanity's CDN first: no
      // slot renders wider than 2400px. w/h stay the original's — only the
      // aspect ratio matters to layout, and `fit=max` keeps it.
      url: `${r.url}?w=2400&fit=max&q=85`,
      alt: r.alt ?? "",
      w: r.w,
      h: r.h,
      // No `blur`: placeholders are off (D2), and this whole map is sent to
      // the browser on every page, so its 35 KB of base64 went with it.
    };
  }
  return map;
}
