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

/**
 * THE LAUNCH SWITCH — CUTOVER.md §5.
 *
 * Every document carries a status, and before launch only `published` pages
 * are indexable: robots `index,follow`, in the sitemaps, JSON-LD emitted.
 * That is what let the whole site exist on the vercel.app address without
 * search engines indexing pages whose canonical points at margorubber.in.
 *
 * Launch day is one variable, not 76 Studio edits: set
 * NEXT_PUBLIC_SITE_LIVE=true on the production deployment once the domain
 * serves this site, redeploy, and every page that is not a `draft` is
 * indexable. `draft` hides a page either way — that stays the editor's
 * switch for a page that is being rewritten. Previews and local builds
 * leave it unset and keep the pre-launch rule.
 *
 * NEXT_PUBLIC_ for the same reason as BUILD_MODE: fixed at build time, so a
 * deployment is wholly one state or the other.
 */
export const SITE_LIVE = process.env.NEXT_PUBLIC_SITE_LIVE === "true";

/** The one gate the robots meta, the sitemaps and the JSON-LD all read. */
export function isIndexable(status: string | undefined): boolean {
  if (status === "published") return true;
  if (status === "placeholder") return SITE_LIVE;
  return false;
}
