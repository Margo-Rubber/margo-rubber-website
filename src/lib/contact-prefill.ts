import { useSyncExternalStore } from "react";
import { INDUSTRIES, PRODUCTS } from "@/content/routes";

/**
 * WHAT A LINK TO /contact CAN PRE-FILL.
 *
 * Eleven kinds of entry point across the sheets arrive with a parameter:
 *
 *   ?part=Diaphragms                    the part or category, from a category or SKU page (32 §12)
 *   ?part=Rubber%20Plungers&doc=1       a documentation request for that part (32 §09)
 *   ?product=Diaphragms                 the registry's own pre-fill for an unbuilt page
 *   ?industry=Construction              from an industry page (41 §01)
 *   ?sector=hvac                        from the industries hub filter (05 §05)
 *   ?request=iso|quality-policy         the certificate and quality-policy requests (20 §06)
 *   ?request=datasheets                 from the extrusion page (18 §09)
 *   ?topic=Sponge%20%26%20Foam          from the datasheet (40 §09)
 *   ?profile=EXT-DS01                   a profile code from the extrusion library (18 §02)
 *
 * "The ?part= parameter must be URL-encoded and the form must read it.
 * Verify the value actually lands in the form field — a pre-fill that
 * silently fails is worse than none." Every parameter is read here, once,
 * into the two dropdowns and the opening line of the project details, and
 * carried through to the enquiry record as it arrived.
 */

export type Prefill = {
  /** The product-category dropdown, by its registry label. */
  product?: string;
  /** The industry dropdown, by its registry label. */
  industry?: string;
  /** Opening lines for the project-details field, one per parameter. */
  lines: string[];
  /** The parameters as they arrived, posted with the enquiry as `via_<name>`. */
  context: Record<string, string>;
};

const REQUESTS: Record<string, string> = {
  iso: "ISO 9001:2015 certificate",
  "quality-policy": "quality policy",
  datasheets: "data sheets",
};

/** The registry entry a free-text name most plausibly means — exact label first, then the one label it begins or is contained in. */
function match<T extends { label: string; slug: string }>(list: readonly T[], value: string): T | undefined {
  const v = value.trim().toLowerCase();
  if (!v) return undefined;
  const exact = list.find((e) => e.label.toLowerCase() === v || e.slug === v);
  if (exact) return exact;
  const hits = list.filter((e) => e.label.toLowerCase().startsWith(v) || v.startsWith(e.label.toLowerCase()));
  return hits.length === 1 ? hits[0] : undefined;
}

export function readPrefill(search: string): Prefill {
  const q = new URLSearchParams(search);
  const get = (k: string) => q.get(k)?.trim() || undefined;
  const out: Prefill = { lines: [], context: {} };
  for (const k of ["part", "product", "industry", "sector", "request", "topic", "profile", "doc"]) {
    const v = get(k);
    if (v) out.context[k] = v;
  }

  const part = get("part") ?? get("product");
  if (part) {
    const cat = match(PRODUCTS, part);
    if (cat) out.product = cat.label;
    // A part name that is not a category is the part itself.
    else out.lines.push(get("doc") ? `Part: ${part} — documentation request` : `Part: ${part}`);
    if (cat && get("doc")) out.lines.push(`Documentation request: ${cat.label}`);
  }

  const industry = get("industry") ?? get("sector");
  if (industry) {
    const ind = match(INDUSTRIES, industry);
    if (ind) out.industry = ind.label;
    else out.lines.push(`Industry: ${industry}`);
  }

  const request = get("request");
  if (request) out.lines.push(`Request: ${REQUESTS[request] ?? request}`);

  const topic = get("topic");
  if (topic) {
    const cat = match(PRODUCTS, topic);
    if (cat && !out.product) out.product = cat.label;
    out.lines.push(`Topic: ${topic}`);
  }

  const profile = get("profile");
  if (profile) {
    if (!out.product) out.product = "Extrusion Profiles";
    out.lines.push(`Profile: ${profile}`);
  }

  return out;
}

/**
 * The page's query string, as an external store: empty while the server
 * renders and during hydration, the real value on the client after it —
 * without a state update inside an effect, and without a hydration mismatch.
 */
const subscribe = (cb: () => void) => {
  window.addEventListener("popstate", cb);
  return () => window.removeEventListener("popstate", cb);
};
export function useSearch(): string {
  return useSyncExternalStore(
    subscribe,
    () => window.location.search,
    () => "",
  );
}
