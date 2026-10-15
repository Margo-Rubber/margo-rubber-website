"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type DetailedHTMLProps,
  type HTMLAttributes,
} from "react";

/**
 * INTERACTIVE 3D VIEW OF A PART — drag to rotate, pinch/scroll to zoom.
 *
 * Renders Google's <model-viewer> web component for the part's .glb, which is
 * uploaded per SKU in Sanity ("3D model (.glb)"). The library (~three.js) is
 * heavy, so it is only imported once the viewer scrolls near the viewport;
 * pages without a model never load it at all.
 *
 * Until the library has loaded, the styled plate below shows, so there is no
 * layout shift and no hydration mismatch (the element is client-only).
 */

declare module "react" {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
        src?: string;
        alt?: string;
        poster?: string;
        loading?: "auto" | "lazy" | "eager";
        reveal?: "auto" | "manual";
        exposure?: string;
        "camera-controls"?: string;
        "auto-rotate"?: string;
        "auto-rotate-delay"?: string;
        "rotation-per-second"?: string;
        "interaction-prompt"?: string;
        "shadow-intensity"?: string;
        "environment-image"?: string;
        "touch-action"?: string;
        "disable-pan"?: string;
      };
    }
  }
}

export function SkuModelViewer({ src, alt }: { src: string; alt: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    let cancelled = false;
    const load = () => {
      import("@google/model-viewer")
        .then(() => !cancelled && setReady(true))
        .catch(() => !cancelled && setFailed(true));
    };
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          load();
        }
      },
      { rootMargin: "300px" },
    );
    io.observe(el);
    return () => {
      cancelled = true;
      io.disconnect();
    };
  }, []);

  return (
    <div
      ref={wrap}
      className="rounded-card border-line relative isolate aspect-[16/10] overflow-hidden border bg-[radial-gradient(ellipse_at_center,#1a1f27_0%,#0d0f12_70%)]"
    >
      {ready && !failed ? (
        <model-viewer
          src={src}
          alt={alt}
          camera-controls=""
          auto-rotate=""
          auto-rotate-delay="1500"
          rotation-per-second="20deg"
          interaction-prompt="auto"
          shadow-intensity="1"
          exposure="1"
          disable-pan=""
          touch-action="pan-y"
          loading="eager"
          style={
            {
              width: "100%",
              height: "100%",
              background: "transparent",
              "--poster-color": "transparent",
            } as CSSProperties
          }
        />
      ) : (
        <div className="absolute inset-0 grid place-items-center">
          <p className="text-eyebrow text-ink-4/70 font-mono uppercase">
            {failed ? "3D view unavailable" : "Loading 3D model…"}
          </p>
        </div>
      )}

      <p className="text-eyebrow text-ink-4 pointer-events-none absolute bottom-3 left-4 font-mono uppercase">
        Drag to rotate · Scroll to zoom
      </p>
      {/* Corner brackets, matching the photo plates. */}
      <span aria-hidden className="border-accent-400/40 pointer-events-none absolute top-3 left-3 size-5 border-t border-l" />
      <span aria-hidden className="border-accent-400/40 pointer-events-none absolute right-3 bottom-3 size-5 border-r border-b" />
    </div>
  );
}
