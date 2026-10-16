import NextImage from "next/image";
import type { CmsImage } from "@/content/blocks";

/**
 * A photograph uploaded directly in Sanity Studio (a `type: "image"` field),
 * as opposed to `Img`, which draws registry slots.
 *
 * Same guarantees as `Img`: intrinsic width and height from the asset, so
 * the space is reserved and nothing shifts; a blurred placeholder from
 * Sanity's LQIP; and the Studio hotspot as the crop focus when the frame
 * crops. Renders nothing when there is no usable asset, so a missing or
 * deleted photo never leaves a broken image behind.
 */
export function SanityPhoto({
  image,
  fallbackAlt,
  sizes,
  className = "",
  fill = false,
  fit = "cover",
}: {
  image?: CmsImage;
  /** Used when the editor left the description empty. */
  fallbackAlt: string;
  sizes: string;
  className?: string;
  /** Fill the parent (which must be positioned and sized) instead of sizing itself. */
  fill?: boolean;
  fit?: "cover" | "contain";
}) {
  const a = image?.asset;
  if (!a) return null;

  // Camera originals can be 8000 px and several MB; cap at the CDN before
  // Next resizes, exactly as image-overrides.ts does.
  const src = `${a.url}?w=2400&fit=max&q=85`;
  const alt = image?.alt?.trim() || fallbackAlt;
  const h = image?.hotspot;
  const style = {
    objectFit: fit,
    ...(h ? { objectPosition: `${(h.x * 100).toFixed(1)}% ${(h.y * 100).toFixed(1)}%` } : {}),
  } as const;
  const blur = a.lqip ? ({ placeholder: "blur", blurDataURL: a.lqip } as const) : {};

  return fill ? (
    <NextImage src={src} alt={alt} fill sizes={sizes} className={className} style={style} {...blur} />
  ) : (
    <NextImage
      src={src}
      alt={alt}
      width={a.w}
      height={a.h}
      sizes={sizes}
      className={className}
      style={style}
      {...blur}
    />
  );
}
