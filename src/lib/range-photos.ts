import type { Block, CmsImage } from "@/content/blocks";

type RangePhotos = {
  eyebrow?: string;
  heading?: string;
  groupPhoto?: CmsImage;
  items: { name: string; availability?: string; href?: string; image?: CmsImage }[];
};

/**
 * Puts a category's "Product photos" (Studio tab) on its page.
 *
 *  · The page has a "Parts in this category" section → the photos go into
 *    it, above its list. Anything set inside that section itself wins: its
 *    own group photo, and its own part list if it has one.
 *  · It has none → a parts section is added as the first section, under the
 *    header, built from the photos alone.
 *
 * With no photo and no sub-product entered, the blocks come back untouched,
 * so a category nobody has photographed renders exactly as before.
 */
export function withRangePhotos(
  blocks: Block[],
  range: RangePhotos | undefined,
  categoryLabel: string,
  categorySlug: string,
): Block[] {
  const hasGroup = !!range?.groupPhoto?.asset;
  const items = range?.items ?? [];
  if (!hasGroup && items.length === 0) return blocks;

  const i = blocks.findIndex((b) => b._type === "block.partsGrid");
  if (i >= 0) {
    const grid = blocks[i] as Block & { groupPhoto?: CmsImage; items?: unknown[] };
    const merged = {
      ...grid,
      groupPhoto: grid.groupPhoto?.asset ? grid.groupPhoto : range?.groupPhoto,
      items: grid.items?.length ? grid.items : items,
    } as Block;
    return blocks.map((b, j) => (j === i ? merged : b));
  }

  const section = {
    _type: "block.partsGrid",
    _key: "rangePhotos",
    eyebrow: range?.eyebrow || "PRODUCT RANGE",
    heading: range?.heading || "What We Make in This Category",
    parts: [],
    items,
    groupPhoto: range?.groupPhoto,
    categoryLabel,
    categorySlug,
  } as unknown as Block;
  return [section, ...blocks];
}
