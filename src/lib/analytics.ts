/**
 * ANALYTICS — Google Analytics 4, Microsoft Clarity and the Meta Pixel.
 *
 * Each is off unless their ID is set, so previews, local builds and the
 * vision build send nothing. Set them on the Vercel PRODUCTION environment
 * only:
 *
 *   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX      (GA4 → Admin → Data streams → Web)
 *   NEXT_PUBLIC_CLARITY_ID=abcd1234ef   (Clarity → Settings → Overview)
 *   NEXT_PUBLIC_META_PIXEL_ID=1234…     (Meta Events Manager → dataset ID)
 *
 * NEXT_PUBLIC_, so they are fixed at build time: redeploy after changing.
 * Use Margo's own properties — never Humraah's or 3rd Shade's.
 *
 * The IDs are validated before they reach an inline script, so a mistyped
 * variable disables tracking instead of injecting whatever was pasted.
 */
const raw = (v: string | undefined) => v?.trim() || undefined;

export const GA_ID = (() => {
  const v = raw(process.env.NEXT_PUBLIC_GA_ID);
  return v && /^G-[A-Z0-9]{4,20}$/.test(v) ? v : undefined;
})();

export const CLARITY_ID = (() => {
  const v = raw(process.env.NEXT_PUBLIC_CLARITY_ID);
  return v && /^[a-z0-9]{6,20}$/i.test(v) ? v : undefined;
})();

export const META_PIXEL_ID = (() => {
  const v = raw(process.env.NEXT_PUBLIC_META_PIXEL_ID);
  return v && /^\d{10,20}$/.test(v) ? v : undefined;
})();

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    clarity?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

/** Site events that also go to Meta, as Meta's standard event names. */
const META_EVENT: Record<string, string> = {
  generate_lead: "Lead",
  whatsapp_click: "Contact",
  phone_click: "Contact",
};

/** Call one tool, never letting it break the page or the next tool (D1). */
function safely(fn: unknown, ...args: unknown[]) {
  if (typeof fn !== "function") return;
  try {
    (fn as (...a: unknown[]) => void)(...args);
  } catch {
    // An analytics tool failing must never surface to the visitor. Until
    // 21 Oct 2026 a throw here (window.clarity was the <script id="clarity">
    // element, not a function) reached the enquiry form's catch block and
    // told buyers their sent enquiry had failed — so they sent it again.
  }
}

/**
 * Record a conversion-type event in every tool. Safe to call anywhere on
 * the client; a no-op when analytics is off or still loading.
 *
 * `transport_type: "beacon"`: a tel:, mailto: or WhatsApp click hands the
 * visitor to another app at once, and GA4's batched hit was being lost
 * with the page (phone_click: 0 events in 28 days to 21 Oct 2026).
 */
export function track(event: string, params?: Record<string, string | number>) {
  if (typeof window === "undefined") return;
  safely(window.gtag, "event", event, { ...params, transport_type: "beacon" });
  safely(window.clarity, "event", event);
  const meta = META_EVENT[event];
  if (meta) safely(window.fbq, "track", meta, { content_name: String(params?.form ?? params?.page ?? event) });
}