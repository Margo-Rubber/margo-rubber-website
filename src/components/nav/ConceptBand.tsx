import { CONCEPT_BAND_TEXT, IS_VISION } from "@/lib/build-mode";

/**
 * The persistent band on the vision build — every page, every viewport,
 * visible in any screenshot, so a slide from the demo can never be
 * mistaken for the live site. Pinned to the bottom edge, where it does not
 * fight the fixed header and stays in frame on a phone.
 *
 * Renders nothing on the buyer build.
 */
export function ConceptBand() {
  if (!IS_VISION) return null;
  return (
    <div
      role="note"
      aria-label="Concept build"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[100] bg-[#B45309] px-4 py-2 text-center font-mono text-[11px] font-semibold tracking-[0.12em] text-white uppercase"
    >
      {CONCEPT_BAND_TEXT}
    </div>
  );
}
