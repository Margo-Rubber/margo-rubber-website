"use client";

import { useSyncExternalStore } from "react";
import { preload } from "react-dom";

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
 * The poster is preloaded from <head> at high priority. Otherwise the
 * browser only finds it when it reaches the <video> tag and fetches it at
 * normal priority, and the dark page background shows for about a second
 * before it appears.
 *
 * Decorative: muted, no controls, hidden from assistive tech.
 *
 * MOBILE / LOW-DATA: the poster is always rendered as a plain <img> in the
 * server HTML (so it is the LCP element and is found immediately). The 3.5 MB
 * video is only mounted after hydration, and only on screens 768px and wider,
 * without reduced-motion and without the browser's Data Saver on. Phones and
 * data-saver users therefore never download the mp4.
 */
const noopSubscribe = () => () => {};

function shouldPlayVideo(): boolean {
  const wide = window.matchMedia("(min-width: 768px)").matches;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  return wide && !reduceMotion && conn?.saveData !== true;
}

export function HeroVideo({
  src,
  poster,
  className,
}: {
  src: string;
  poster: string;
  className?: string;
}) {
  preload(poster, { as: "image", fetchPriority: "high" });
  // Server and first client render: false (poster only). After hydration the
  // client value applies, so the video mounts only where it should.
  const play = useSyncExternalStore(noopSubscribe, shouldPlayVideo, () => false);
  const cls = `absolute inset-0 h-full w-full object-cover ${className ?? ""}`;
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element -- decorative LCP poster, already a sized jpg */}
      <img src={poster} alt="" aria-hidden fetchPriority="high" decoding="async" className={cls} />
      {play && (
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={poster}
          aria-hidden
          tabIndex={-1}
          className={cls}
        >
          <source src={src} type="video/mp4" />
        </video>
      )}
    </>
  );
}
