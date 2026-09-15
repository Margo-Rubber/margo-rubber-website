import { defineField, defineType } from "sanity";
import { slotLabel } from "../../../src/content/image-slot-labels.ts";

/**
 * REPLACING A PHOTOGRAPH
 *
 * Every image on the site currently comes from a registry in code: 85 entries,
 * each with a file, its dimensions, a blurred placeholder, alt text, and a
 * `status` marking whether it is real Margo photography or a stock stand-in.
 * Most are stand-ins.
 *
 * When the real photographs arrive, somebody at Margo has to be able to put
 * them on the site. Until now that meant a developer editing the registry and
 * deploying — which is exactly the dependency this whole project exists to
 * remove.
 *
 * THE DESIGN, and why it is an override rather than a field.
 *
 * The obvious approach — turn every image field into a Sanity image — was
 * wrong for what was actually asked. The layout is settled. The slots do not
 * move. Only the file behind each slot changes.
 *
 * So this document does not touch the content at all. Its ID IS the slot name
 * — `imageOverride-products__hero`, dots encoded — and the site checks for one before falling
 * back to the registry. Deriving the slot from the id rather than storing it
 * in a field means one slot cannot have two competing photographs, and an
 * editor cannot mistype a slot name, because neither is representable.
 *
 * Consequences worth having:
 *
 *  · The 72 migrated documents keep their image keys untouched, so an upload
 *    cannot move an image or change which section it appears in.
 *  · No content schema changes, so nothing that already works can break.
 *  · Deleting the override restores the original. Nothing is destroyed.
 *  · One screen lists every slot that is still a stand-in — a to-do list of
 *    the photography Margo still owes, rather than 85 fields scattered across
 *    seventeen page types.
 */

export const imageOverride = defineType({
  name: "imageOverride",
  title: "Photograph",
  type: "document",
  fields: [
    /**
     * WHAT IS THERE NOW, before the field that replaces it.
     *
     * The original photograph is a file in the repo, not a Sanity asset, so
     * the image field below starts empty — and an empty field beside a key
     * like `home.story` tells an editor nothing about what they are about to
     * replace. This field stores nothing; its component draws the current
     * file from the site, names the slot in plain words, and says where on
     * the page it appears. A string type only because a field must have one.
     * The component is attached in sanity.config.ts (form.components.field),
     * not here: this file is loaded by plain Node in the schema checks, which
     * cannot parse JSX.
     */
    defineField({
      name: "current",
      title: "Currently on the site",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "image",
      title: "The replacement photograph",
      type: "image",
      description:
        "Takes the exact place and size of the picture above, everywhere it appears. Drag the crop handles to choose what stays visible when the image is cropped.",
      options: { hotspot: true },
      validation: (r) => r.required(),
    }),

    /**
     * Alt text travels WITH the photograph, and stays required.
     *
     * The registry makes alt text mandatory in the type system, which is what
     * guarantees no image ships without a description. A new photograph
     * usually needs a new description — the old one describes the stock image
     * — so this is editable, but it is not optional. That guarantee is the one
     * thing about the registry worth carrying across unchanged.
     */
    /**
     * A DECORATIVE image must be allowed to stay decorative.
     *
     * One slot on the site — the logo mark beside the "MARGO" wordmark — has
     * deliberately empty alt text, because the words are already there in the
     * markup next to it. Describing it would make a screen reader announce
     * "Margo logo MARGO Rubber Products".
     *
     * Requiring alt text unconditionally would force whoever replaces that
     * image to break it. So the requirement is conditional, and the checkbox
     * says what it means rather than leaving an empty box looking like an
     * oversight.
     */
    defineField({
      name: "decorative",
      title: "This image is decorative",
      type: "boolean",
      description:
        "Tick only if the image adds nothing a reader would miss — a logo next to the company name already written out, for instance. Screen readers will skip it.",
      initialValue: false,
    }),
    defineField({
      name: "alt",
      title: "Description for screen readers",
      type: "string",
      description:
        "What is in the photograph, for people who cannot see it and for Google. Describe this photograph, not the one it replaced.",
      hidden: ({ parent }) => parent?.decorative === true,
      validation: (r) =>
        r.custom((value, ctx) => {
          if ((ctx.parent as { decorative?: boolean })?.decorative) return true;
          if (!value || String(value).trim().length < 10) {
            return "Describe the photograph — at least a few words. If it genuinely adds nothing, tick “This image is decorative” above.";
          }
          return true;
        }),
    }),

    defineField({
      name: "note",
      title: "Note",
      type: "string",
      description: "Optional. Where the photograph came from, or who took it.",
    }),
  ],

  preview: {
    // The slot is the document id, so it is read back off the id rather than
    // stored twice. Two copies of the same fact drift. The id is then turned
    // into the editor's name for the slot, so the Drafts list and history read
    // "Our story — plant photo", not "imageOverride-home__story".
    select: { id: "_id", media: "image", alt: "alt" },
    prepare: ({ id, media, alt }) => {
      const key = String(id ?? "")
        .replace(/^drafts\./, "")
        .replace(/^imageOverride-/, "")
        .replace(/__/g, ".");
      const label = slotLabel(key);
      return {
        title: label.title,
        subtitle: alt || label.where,
        media,
      };
    },
  },
});
