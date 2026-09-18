import { defineArrayMember, defineField } from "sanity";
import { slotLabel } from "../../../src/content/image-slot-labels.ts";
import { IMAGES } from "../../../src/content/images.ts";
import { ICON_NAMES, PROFILE_SHAPES } from "../../../src/components/ui/icon-paths.ts";

/**
 * SHARED FIELD FACTORIES
 *
 * Every block in the library is assembled from these rather than from
 * hand-written field objects. Two reasons, both about drift:
 *
 *  · 40 blocks each declaring their own "eyebrow / heading / body" trio is 120
 *    chances for the label, the description or the validation to diverge. The
 *    editor then meets the same field wearing three different names.
 *
 *  · The Zod schemas in src/content/schemas/index.ts are the build-time
 *    contract. Where a rule exists there — `min(20)` on a body, kebab-case on
 *    an anchor — it is repeated here so the editor is told in the editor,
 *    rather than a developer being told by a failed build. The numbers in this
 *    file are copied from that one deliberately; they are not new opinions.
 */

/* ── Section identity ─────────────────────────────────────────────────────── */

/**
 * Every numbered section on the site owns its own eyebrow and heading. That is
 * a decision already made in the content schemas — nothing is an orphan
 * heading in an MDX body — and it is what makes a block self-contained enough
 * to be reordered at all.
 */
/**
 * `headingRequired = false` is for the one block that may sit under another's
 * heading: the second of two grouped card grids (sheet 42 §03 "Marine") has
 * a group name and no heading of its own — the content schema says the same.
 */
export function sectionMetaFields({ bodyRequired = false, headingRequired = true } = {}) {
  return [
    defineField({
      name: "eyebrow",
      title: "Label above the heading",
      type: "string",
      description: 'The small line in accent colour, e.g. "02 — SPECIFICATION REFERENCE". A section written with a heading alone leaves it empty.',
      validation: (r) => r.min(2),
      group: "content",
    }),
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      validation: (r) => (headingRequired ? r.required().min(4) : r.min(4)),
      group: "content",
    }),
    defineField({
      name: "body",
      title: "Intro paragraph",
      type: "text",
      rows: 3,
      description: bodyRequired
        ? "Required for this section — the layout has no version without it."
        : "Optional. Sits under the heading.",
      validation: (r) => (bodyRequired ? r.required().min(20) : r.min(20)),
      group: "content",
    }),
  ];
}

/**
 * Field groups, so a block with a dozen fields opens on the four that matter
 * rather than presenting all twelve at once. Applied to every block that has
 * more than about six fields.
 */
export const BLOCK_GROUPS = [
  { name: "content", title: "Content", default: true },
  { name: "options", title: "Layout & options" },
];

/* ── Images ───────────────────────────────────────────────────────────────── */

/**
 * An image is a REGISTRY KEY, never an upload.
 *
 * This mirrors src/content/images.ts, where the key carries the file path, the
 * intrinsic width and height (which is what makes layout shift structurally
 * impossible) and the alt text. An editor uploading a loose file would bypass
 * all three.
 *
 * The trade-off is stated plainly because it is a real one: the manager can
 * choose from the 85 images that exist, but cannot add an 86th without a
 * developer. Moving to Sanity's asset pipeline is possible later and is a
 * decision about who owns alt text and dimensions, not a technical blocker.
 */
const IMAGE_OPTIONS = Object.keys(IMAGES)
  .map((key) => ({ title: `${slotLabel(key).title}  (${key})`, value: key }))
  .sort((a, b) => a.title.localeCompare(b.title));

export function imageRefField(
  name = "image",
  opts: { title?: string; required?: boolean; group?: string | null } = {},
) {
  const { title = "Image", required = false } = opts;
  // `null` means "no group" and `undefined` means "not specified, use the
  // default". They cannot be collapsed: a default parameter value fires on
  // `undefined`, so passing `group: undefined` to opt OUT silently opted IN.
  const group = opts.group === null ? undefined : (opts.group ?? "content");

  return defineField({
    name,
    title,
    type: "string",
    description: "Chosen from the site's image library. Alt text travels with it.",
    options: { list: IMAGE_OPTIONS },
    validation: (r) => (required ? r.required() : r),
    group,
  });
}

/* ── Links and actions ────────────────────────────────────────────────────── */

/**
 * Internal paths and anchors only, plus mailto/tel.
 *
 * A free-text href is how a CMS ends up with a link to a staging domain in
 * production. The pattern is permissive enough for every link the site
 * actually uses and refuses the one shape that causes that.
 */
const HREF = /^(\/[^\s]*|#[a-z0-9-]+|mailto:[^\s]+|tel:[^\s]+)$/;

export function linkFields({ requireLabel = true } = {}) {
  return [
    defineField({
      name: "label",
      title: "Button text",
      type: "string",
      validation: (r) => (requireLabel ? r.required().min(2) : r),
    }),
    defineField({
      name: "href",
      title: "Goes to",
      type: "string",
      description: 'A path on this site ("/contact"), an anchor ("#compounds"), or mailto:/tel:.',
      validation: (r) =>
        r.required().regex(HREF, {
          name: "site path or anchor",
        }),
    }),
  ];
}

/**
 * `group` is a parameter, not a constant: a link on a BLOCK belongs to that
 * block's Content group, but the same helper is used for the hero link on a
 * document whose groups are named differently. Hard-coding "content" made the
 * schema fail to validate against the document — quietly, at build time, with
 * a message that named the group and not the field.
 */
export const linkObject = (
  name: string,
  title: string,
  required = false,
  group: string | undefined = "content",
) =>
  defineField({
    name,
    title,
    type: "object",
    fields: linkFields(),
    validation: (r) => (required ? r.required() : r),
    group,
  });

/* ── Anchors ──────────────────────────────────────────────────────────────── */

/**
 * A fragment target. The mega-dropdown deep-links to several of these, so
 * changing one silently breaks a navigation item — hence the warning rather
 * than a bare string field.
 */
export function anchorIdField(name = "id") {
  return defineField({
    name,
    title: "Anchor",
    type: "string",
    description:
      "Lowercase and hyphens. Menu links point at this — changing it breaks them.",
    validation: (r) =>
      r.regex(/^[a-z0-9-]+$/, { name: "lowercase-with-hyphens" }),
    group: "options",
  });
}

/**
 * A NOTE ON `group`, which cost a schema-validation failure:
 *
 * Field groups exist only on the type that DECLARES them — a block or a
 * document. A field nested inside an array member belongs to an anonymous
 * inline object with no groups at all, and naming one there fails validation
 * with a message that names the group and not the field. So every factory
 * below either takes `group` as a parameter or sets none, and the caller
 * decides based on where the field actually sits.
 */

/* ── Icons ────────────────────────────────────────────────────────────────── */

/**
 * Icon keys are validated against the drawn set rather than left free-text,
 * because an unknown key renders an empty path and does so silently — the tile
 * looks merely blank, not broken.
 *
 * Both lists are IMPORTED from the component that draws them rather than
 * retyped here. A copied list is a list that drifts, and the failure it
 * produces is invisible.
 */
export function iconField(name = "icon", title = "Icon") {
  return defineField({
    name,
    title,
    type: "string",
    options: { list: ICON_NAMES.map((k) => ({ title: k, value: k })) },
  });
}

export function shapeField(name = "shape") {
  return defineField({
    name,
    title: "Cross-section drawing",
    type: "string",
    description: "For profile tiles. Leave empty to show an icon instead.",
    options: { list: PROFILE_SHAPES.map((k) => ({ title: k, value: k })) },
  });
}

/* ── Repeaters ────────────────────────────────────────────────────────────── */

/** A plain list of strings, used for layer stacks and bullet lists. */
export function stringListField(
  name: string,
  title: string,
  opts: { min?: number; description?: string; group?: string | null } = {},
) {
  const { min = 1, description = "" } = opts;
  const group = opts.group === null ? undefined : (opts.group ?? "content");

  return defineField({
    name,
    title,
    type: "array",
    of: [defineArrayMember({ type: "string" })],
    description: description || undefined,
    // `min: 0` means genuinely optional, not "required but empty is fine".
    // Getting this wrong makes an optional bullet list block publication.
    validation: (r) => (min > 0 ? r.required().min(min) : r),
    group,
  });
}

/**
 * Label/value pairs — the shape behind commercial terms, comparison panels and
 * every property list on the site.
 */
export const labelValue = defineArrayMember({
  type: "object",
  name: "labelValue",
  fields: [
    defineField({ name: "label", type: "string", validation: (r) => r.required() }),
    defineField({ name: "value", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "note",
      title: "Footnote",
      type: "string",
      description: "Optional smaller line under the value.",
    }),
  ],
  preview: {
    select: { title: "label", subtitle: "value" },
  },
});

/* ── Previews ─────────────────────────────────────────────────────────────── */

/**
 * The standard block preview: the block's own heading as the title, and what
 * kind of block it is as the subtitle.
 *
 * Without this every entry in a page's block list reads "Object", which makes
 * a fifteen-block page unreorderable in practice — the editor cannot tell
 * which row is which. This is the single highest-value line in each block
 * definition and the reason previews were costed into the estimate.
 */
export function blockPreview(kind: string, extra?: (v: Record<string, unknown>) => string) {
  return {
    select: { heading: "heading", eyebrow: "eyebrow", items: "items", rows: "rows" },
    prepare: (value: Record<string, unknown>) => {
      const counts = extra?.(value);
      return {
        title: (value.heading as string) || kind,
        subtitle: counts ? `${kind} · ${counts}` : kind,
      };
    },
  };
}

/** "3 items", "1 item" — used in the subtitle above. */
export function count(value: unknown, noun: string): string {
  const n = Array.isArray(value) ? value.length : 0;
  return `${n} ${noun}${n === 1 ? "" : "s"}`;
}
