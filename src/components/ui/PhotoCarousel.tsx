"use client";

import { useEffect, useRef, useState } from "react";
import { Img } from "@/components/ui/Img";

/**
 * PHOTO CAROUSEL — a few photographs in one frame, sliding sideways on their
 * own, with dots underneath to pick one (client, 2 Nov 2026: "like an
 * Instagram carousel").
 *
 *  · Advances every `interval` ms; pauses while the pointer is over it or
 *    focus is inside it, and after a manual pick it waits a full interval.
 *  · Swipe left or right on a touch screen.
 *  · Visitors who ask for reduced motion get no autoplay and no slide
 *    animation; the dots still work.
 *
 * Every photo is an image-registry slot, so each is replaceable in Studio.
 */
export function PhotoCarousel({
  slides,
  ratio,
  sizes,
  interval = 5000,
  label = "Photographs",
}: {
  slides: readonly string[];
  /** Frame size classes, as the single photo it replaces had. */
  ratio: string;
  sizes: string;
  interval?: number;
  label?: string;
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [still, setStill] = useState(false);
  const touchX = useRef<number | null>(null);
  const count = slides.length;

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setStill(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Restarts whenever the slide changes, so a manual pick gets a full interval.
  useEffect(() => {
    if (count < 2 || paused || still) return;
    const t = window.setTimeout(() => setIndex((i) => (i + 1) % count), interval);
    return () => window.clearTimeout(t);
  }, [index, paused, still, count, interval]);

  const go = (i: number) => setIndex(((i % count) + count) % count);

  return (
    <div
      className="flex h-full flex-col"
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div
        className={`rounded-card border-line relative overflow-hidden border ${ratio}`}
        onTouchStart={(e) => {
          touchX.current = e.touches[0].clientX;
          setPaused(true);
        }}
        onTouchEnd={(e) => {
          const start = touchX.current;
          touchX.current = null;
          setPaused(false);
          if (start === null) return;
          const dx = e.changedTouches[0].clientX - start;
          if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1));
        }}
      >
        <div
          className={`flex h-full ${still ? "" : "transition-transform duration-700 ease-out"}`}
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {slides.map((k, i) => (
            <div
              key={k}
              className="relative h-full w-full shrink-0"
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}`}
              aria-hidden={i !== index}
            >
              <Img k={k} fill sizes={sizes} className="object-cover" />
            </div>
          ))}
        </div>
      </div>

      {count > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          {slides.map((k, i) => (
            <button
              key={k}
              type="button"
              onClick={() => go(i)}
              aria-label={`Show photo ${i + 1} of ${count}`}
              aria-current={i === index}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === index ? "bg-accent-400 w-6" : "bg-ink-4/50 hover:bg-ink-4 w-2"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
