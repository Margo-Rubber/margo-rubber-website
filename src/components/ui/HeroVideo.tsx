"use client";

/**
 * Full-bleed background video for the homepage hero.
 *
 * The POSTER is the video's own first frame, exported next to it, so the
 * picture shown while the video loads is the same picture the video starts
 * on. It used to be the old hero photograph from the image registry, which
 * flashed on every reload before the video took over.
 *
 * The darkening the hero needs (it sat at 60% opacity with brightness and
 * contrast filters) is baked into the video file itself. CSS filters and
 * opacity on a playing video are re-applied to every frame, and together
 * with the slow drift animation they made playback stutter on laptops.
 * If the video is ever replaced, re-export it with that look (or put the
 * filters back on the className below) and export a new first-frame poster.
 *
 * Decorative: muted, no controls, hidden from assistive tech.
 */
export function HeroVideo({
  src,
  poster,
  className,
}: {
  src: string;
  poster: string;
  className?: string;
}) {
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
