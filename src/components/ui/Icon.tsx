import {
  PATHS,
  PROFILES,
  ICON_NAMES,
  PROFILE_SHAPES,
  type IconName,
  type ProfileShape,
} from "./icon-paths";

/**
 * LINE ICONS
 *
 * The UI-changes2 comps use a stroked 24px icon set throughout — process
 * stages, specify parameters, sector cards, quality badges, CTA chips. These
 * are drawn to match: 24×24 box, 1.5 stroke, round caps, `currentColor`, so
 * an icon takes the colour of whatever it sits in.
 *
 * Inline rather than a sprite or a dependency: there are two dozen, they are
 * a few hundred bytes each, and shipping an icon library to render twenty
 * static glyphs on a server-rendered page is not a trade worth making.
 */

export function Icon({
  name,
  className = "size-5",
}: {
  name: IconName;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <path d={PATHS[name]} />
    </svg>
  );
}

/**
 * The nine extrusion cross-sections, drawn as the comp draws them: a single
 * open stroke showing the profile shape, not a filled pictogram. A buyer
 * recognises a P-seal by its bulb-and-tail outline, so the outline is the
 * information and a solid silhouette would destroy it.
 *
 * Deliberately kept separate from `Icon` — these are technical drawings on a
 * 48px box with a heavier stroke, not UI glyphs.
 */

export function ProfileDrawing({ shape, title }: { shape: ProfileShape; title?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      // Named when the card gives it a name, so the drawing is words as
      // well as a picture (sheet 18 §02); decorative otherwise.
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      className="size-12"
    >
      {title && <title>{title}</title>}
      <path d={PROFILES[shape]} />
    </svg>
  );
}

// Re-exported so existing imports of these from Icon.tsx keep working.
export { ICON_NAMES, PROFILE_SHAPES };
export type { IconName, ProfileShape };
