"use client";

/**
 * COOKIE CONSENT — the one place the visitor's choice lives.
 *
 * Who is asked: visitors whose browser time zone is in Europe (EEA, UK,
 * Switzerland — GDPR territory). Everyone else gets analytics by default and
 * no banner. The time zone is read in the browser, so the cached pages stay
 * identical for every visitor and no geo lookup is needed. Google also
 * applies its own region defaults by IP (see Analytics.tsx), as a backstop.
 *
 * What is stored: "granted" or "denied" in localStorage. If storage is
 * blocked, the choice is kept in memory for the visit instead, so the
 * banner does not come straight back.
 *
 * Ads storage is always denied: the site runs no advertising tags.
 */

export type Choice = "granted" | "denied";

const KEY = "margo-consent";
const EVENT = "margo:consent";

let memoryChoice: Choice | null = null;
let forcedOpen = false;

export function storedChoice(): Choice | null {
  try {
    const v = localStorage.getItem(KEY);
    if (v === "granted" || v === "denied") return v;
  } catch {}
  return memoryChoice;
}

export function inConsentRegion(): boolean {
  try {
    return /^Europe\//.test(Intl.DateTimeFormat().resolvedOptions().timeZone ?? "");
  } catch {
    return false;
  }
}

/** Show the banner? Read by useSyncExternalStore — must be cheap and pure. */
export function bannerVisible(): boolean {
  if (forcedOpen) return true;
  return storedChoice() === null && inConsentRegion();
}

export function subscribe(cb: () => void): () => void {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

/** Footer "Cookie settings": reopen the banner so a choice can be changed. */
export function openConsent() {
  forcedOpen = true;
  window.dispatchEvent(new Event(EVENT));
}

export function choose(choice: Choice) {
  memoryChoice = choice;
  try {
    localStorage.setItem(KEY, choice);
  } catch {}
  forcedOpen = false;
  window.gtag?.("consent", "update", { analytics_storage: choice });
  window.clarity?.("consentv2", { ad_Storage: "denied", analytics_Storage: choice });
  window.dispatchEvent(new Event(EVENT));
}
