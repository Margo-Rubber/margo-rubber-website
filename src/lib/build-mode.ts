/**
 * TWO BUILDS, ONE CODEBASE — Build Instructions §01.
 *
 * The content sheets are written for the target-state company. That copy
 * may be shown to the board on a password-protected preview (the VISION
 * build) but must never be served from margorubber.in as fact. The two
 * differ in exactly three ways, all switched here from one variable:
 *
 *   NEXT_PUBLIC_BUILD_MODE=vision   noindex on every page · the CONCEPT band
 *                                   on every page · HTTP basic auth (proxy.ts)
 *   anything else (default: buyer)  index,follow on published pages · no band
 *                                   · no gate
 *
 * NEXT_PUBLIC_ so the value is fixed at build time and the same in the
 * browser: the band cannot flicker in after hydration, and a preview
 * deployment cannot forget the gate because someone unset a server-only var.
 */
export const BUILD_MODE: "vision" | "buyer" =
  process.env.NEXT_PUBLIC_BUILD_MODE === "vision" ? "vision" : "buyer";

export const IS_VISION = BUILD_MODE === "vision";

/** The band's wording is fixed by the Build Instructions; do not edit. */
export const CONCEPT_BAND_TEXT =
  "CONCEPT — TARGET STATE · NOT CURRENT COMPANY DATA";
