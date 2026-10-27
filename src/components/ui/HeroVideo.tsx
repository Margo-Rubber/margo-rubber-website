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
 * filters back on the className below) and export a new first-frame poster:
 *   ffmpeg -i hero-bg-boomerang.mp4 -frames:v 1 -q:v 3 hero-bg-poster.jpg
 * A stale poster shows the old look until the new video starts playing.
 *
 * PING-PONG LOOP: the video plays forward, then in reverse, then forward
 * again, instead of jumping back to the start. This is baked into the file
 * (hero-bg-boomerang.mp4 = the original clip followed by its reverse, with
 * the duplicate turnaround frames removed), so a plain `loop` is seamless.
 * Reversing in JavaScript was avoided on purpose: browsers don't support
 * negative playbackRate reliably, and stepping currentTime backwards forces
 * a seek per frame, which stutters. If the clip is replaced, rebuild it with:
 *   ffmpeg -i new.mp4 -filter_complex "[0:v]split[f][b];[b]reverse,
 *     trim=start_frame=1:end_frame=<frames-1>,setpts=PTS-STARTPTS[r];
 *     [f][r]concat=n=2:v=1[out]" -map "[out]" -an -c:v libx264 -crf 25
 *     -movflags +faststart hero-bg-boomerang.mp4
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
