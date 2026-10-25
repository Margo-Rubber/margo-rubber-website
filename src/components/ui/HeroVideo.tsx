"use client";

import { getImage } from "@/content/images";
import { useImageOverride } from "@/components/ui/ImageOverrideProvider";

/**
 * Full-bleed background video for the homepage hero.
 *
 * Takes the same image-registry key the hero `Img` used and resolves it the
 * same way (CMS upload wins, stock image otherwise), but only as the POSTER,
 * so the frame is never blank while the video loads. The image slot and its
 * Sanity field are untouched; the homepage just stops drawing it as an <img>.
 *
 * Decorative: muted, no controls, hidden from assistive tech.
 */
export function HeroVideo({
  k,
  src,
  className,
}: {
  k: string;
  src: string;
  className?: string;
}) {
  const stock = getImage(k);
  const uploaded = useImageOverride(k);
  const poster = uploaded ? uploaded.url : stock.src;

  return (
    <video
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      poster={poster}
      aria-hidden
      tabIndex={-1}
      className={`absolute inset-0 h-full w-full object-cover ${className ?? ""}`}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
