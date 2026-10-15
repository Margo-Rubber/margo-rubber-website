"use client";

import NextImage from "next/image";
import { getImage } from "@/content/images";
import { useImageOverride } from "@/components/ui/ImageOverrideProvider";

/**
 * The ONLY way an image reaches the page.
 *
 * Takes a registry key, never a path. Width/height/alt come from the registry,
 * so CLS is structurally impossible and alt text can't be forgotten.
 *
 * TWO SOURCES, one contract.
 *
 * Most images on the site are still stock stand-ins held in the registry. When
 * a real photograph arrives, somebody at Margo uploads it against this slot in
 * the CMS, and it wins here — same key, same position, different file.
 *
 * The override supplies its own width, height, alt text and blurred
 * placeholder, so every guarantee the registry provides survives the swap.
 * Anything incomplete never reaches this component: `getImageOverrides` drops
 * it and the stock image renders instead, on the principle that a worse-looking
 * correct page beats a better-looking broken one.
 *
 * A client component because four of the components that draw images are
 * themselves client components, and the override map has to be readable
 * synchronously from all of them.
 */
export function Img({
  k,
  className,
  priority = false,
  sizes,
  fill = false,
  alt,
}: {
  k: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
  fill?: boolean;
  /**
   * Overrides the registry/CMS alt for this one placement — for an image
   * whose meaning depends on where it sits (the logo inside the home link).
   */
  alt?: string;
}) {
  const stock = getImage(k);
  const uploaded = useImageOverride(k);

  const base = uploaded
    ? { src: uploaded.url, alt: uploaded.alt, w: uploaded.w, h: uploaded.h, blur: uploaded.blur }
    : stock;
  const img = alt === undefined ? base : { ...base, alt };

  /**
   * Blur-up, but never on a priority image.
   *
   * A priority image is preloaded and is usually the LCP element, so its blur
   * would flash for a moment at best while adding ~450 bytes of base64 to the
   * critical markup, competing with the image it is standing in for. Below the
   * fold, where the image arrives long after the layout, the placeholder is
   * the entire point.
   *
   * Spread rather than passed directly: `placeholder="blur"` throws at runtime
   * if `blurDataURL` is undefined, which is the case for SVG entries.
   */
  const blurProps =
    !priority && img.blur
      ? ({ placeholder: "blur", blurDataURL: img.blur } as const)
      : {};

  if (fill) {
    return (
      <NextImage
        src={img.src}
        alt={img.alt}
        fill
        priority={priority}
        // The LCP element asks for the network first (sheet 01 §01:
        // fetchpriority="high" on the hero background only).
        fetchPriority={priority ? "high" : undefined}
        sizes={sizes ?? "100vw"}
        className={className}
        {...blurProps}
      />
    );
  }

  return (
    <NextImage
      src={img.src}
      alt={img.alt}
      width={img.w}
      height={img.h}
      priority={priority}
      fetchPriority={priority ? "high" : undefined}
      sizes={sizes}
      className={className}
      {...blurProps}
    />
  );
}
