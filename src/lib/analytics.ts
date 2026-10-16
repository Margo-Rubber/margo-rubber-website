/**
 * ANALYTICS — Google Analytics 4 and Microsoft Clarity.
 *
 * Both are off unless their ID is set, so previews, local builds and the
 * vision build send nothing. Set them on the Vercel PRODUCTION environment
 * only:
 *
 *   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX      (GA4 → Admin → Data streams → Web)
 *   NEXT_PUBLIC_CLARITY_ID=abcd1234ef   (Clarity → Settings → Overview)
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

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    clarity?: (...args: unknown[]) => void;
  }
}

/**
 * Record a conversion-type event in both tools. Safe to call anywhere on
 * the client; a no-op when analytics is off or still loading.
 */
export function track(event: string, params?: Record<string, string | number>) {
  if (typeof window === "undefined") return;
  window.gtag?.("event", event, params);
  window.clarity?.("event", event);
}
