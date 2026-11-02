"use client";

import { useEffect, useRef, useState } from "react";
import { Img } from "@/components/ui/Img";

/**
 * PHOTO CAROUSEL — a few photographs in one frame, sliding sideways on their
 * own, with dots underneath to pick one (client, 2 Nov 2026: "like an
 * Instagram carousel").
 *
 *  · Moves to the next photo every `interval` ms, all the time — it does not
 *    stop under the mouse (client). Any manual move restarts the count, so a
 *    picked photo always gets a full interval.
 *  · Ways to move it by hand: the dots; the ‹ › buttons (shown on hover, and
 *    always on touch screens); dragging the photo with a finger or the mouse;
 *    a sideways scroll on a trackpad; and, once the carousel has focus, the
 *    ← → keys (Home / End for the first and last photo).
 *  · Visitors who ask for reduced motion get no autoplay and no slide
 *    animation; every manual control still works.
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
  const count = slides.length;
  const [index, setIndex] = useState(0);
  const [still, setStill] = useState(false);
  // Pixels the track is pulled by a drag in progress; null when not dragging.
  const [drag, setDrag] = useState<number | null>(null);
  const start = useRef<{ x: number; w: number } | null>(null);
  const wheelLock = useRef(0);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setStill(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Restarts whenever the slide changes, so a manual move gets a full
  // interval. Held only while a drag is under way.
  useEffect(() => {
    if (count < 2 || still || drag !== null) return;
    const t = window.setTimeout(() => setIndex((i) => (i + 1) % count), interval);
    return () => window.clearTimeout(t);
  }, [index, still, drag, count, interval]);

  const go = (i: number) => setIndex(((i % count) + count) % count);

  if (count === 0) return null;

  const pull = drag ?? 0;
  const arrow =
    "bg-canvas/70 text-ink border-line absolute top-1/2 z-10 grid size-11 -translate-y-1/2 md:size-10 place-items-center rounded-full border backdrop-blur transition-opacity hover:bg-canvas/90 focus-visible:opacity-100 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100";

  return (
    <div
      className="flex h-full flex-col"
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(index + 1);
        else if (e.key === "ArrowLeft") go(index - 1);
        else if (e.key === "Home") go(0);
        else if (e.key === "End") go(count - 1);
        else return;
        e.preventDefault();
      }}
    >
      <div
        className={`group rounded-card border-line relative touch-pan-y overflow-hidden border select-none ${
          drag !== null ? "cursor-grabbing" : "cursor-grab"
        } ${ratio}`}
        onPointerDown={(e) => {
          if (e.button !== 0 || (e.target as HTMLElement).closest("button")) return;
          start.current = { x: e.clientX, w: e.currentTarget.clientWidth };
          e.currentTarget.setPointerCapture(e.pointerId);
          setDrag(0);
        }}
        onPointerMove={(e) => {
          if (!start.current) return;
          setDrag(e.clientX - start.current.x);
        }}
        onPointerUp={(e) => {
          const s = start.current;
          start.current = null;
          setDrag(null);
          if (!s) return;
          const dx = e.clientX - s.x;
          // A fifth of the frame, or a short flick, turns the page.
          if (Math.abs(dx) > Math.min(60, s.w / 5)) go(index + (dx < 0 ? 1 : -1));
        }}
        onPointerCancel={() => {
          start.current = null;
          setDrag(null);
        }}
        onWheel={(e) => {
          // Sideways trackpad scroll (or shift + wheel): one photo per gesture.
          const dx = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.shiftKey ? e.deltaY : 0;
          if (Math.abs(dx) < 20) return;
          const now = Date.now();
          if (now - wheelLock.current < 600) return;
          wheelLock.current = now;
          go(index + (dx > 0 ? 1 : -1));
        }}
      >
        <div
          className={`flex h-full ${still || drag !== null ? "" : "transition-transform duration-700 ease-out"}`}
          style={{ transform: `translateX(calc(-${index * 100}% + ${pull}px))` }}
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
              <Img k={k} fill sizes={sizes} className="pointer-events-none object-cover" />
            </div>
          ))}
        </div>

        {count > 1 && (
          <>
            <button type="button" onClick={() => go(index - 1)} aria-label="Previous photo" className={`${arrow} left-3`}>
              <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M15 5l-7 7 7 7" />
              </svg>
            </button>
            <button type="button" onClick={() => go(index + 1)} aria-label="Next photo" className={`${arrow} right-3`}>
              <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>

      {count > 1 && (
        // Each dot sits in a 44px-tall button so it can be tapped; the
        // negative margins keep the dots where the 8px row put them.
        <div className="-mt-0.5 -mb-[18px] flex justify-center">
          {slides.map((k, i) => (
            <button
              key={k}
              type="button"
              onClick={() => go(i)}
              aria-label={`Show photo ${i + 1} of ${count}`}
              aria-current={i === index}
              className="group/dot grid h-11 place-items-center px-1"
            >
              <span
                aria-hidden
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === index ? "bg-accent-400 w-6" : "bg-ink-4/50 group-hover/dot:bg-ink-4 w-2"
                }`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
