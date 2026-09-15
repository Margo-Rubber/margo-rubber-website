import { IMAGES } from "./images.ts";
import { slotLabel, type SlotLabel } from "./image-slot-labels.ts";

/**
 * THE 85 IMAGE SLOTS, as a plain list.
 *
 * Derived from the registry rather than typed out beside it: a slot list that
 * can drift from the registry is a dropdown offering an editor a choice that
 * renders nothing. The Studio dropdown and the site read the same object.
 *
 * `status` comes straight from the registry, where it already records which
 * images are stock stand-ins and which are real Margo photography. Surfacing
 * it in the Studio turns the list into what Margo actually needs — a to-do
 * list of the photographs still owed.
 *
 * `src`, `w` and `h` are carried so the Studio can SHOW the current
 * photograph — a list of eighty-five names is a puzzle; a list of eighty-five
 * pictures is a menu. The human title and the "where it appears" sentence
 * come from image-slot-labels.ts, keyed by the same registry key.
 */
export type ImageSlot = SlotLabel & {
  key: string;
  alt: string;
  status: string;
  src: string;
  w: number;
  h: number;
};

export const IMAGE_SLOTS: ImageSlot[] = Object.entries(IMAGES)
  .map(([key, v]) => {
    const e = v as { alt: string; status?: string; src: string; w: number; h: number };
    return {
      key,
      ...slotLabel(key),
      alt: e.alt,
      status: e.status ?? "placeholder",
      src: e.src,
      w: e.w,
      h: e.h,
    };
  })
  .sort((a, b) => a.key.localeCompare(b.key));
