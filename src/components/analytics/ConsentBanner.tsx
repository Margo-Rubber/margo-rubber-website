"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { bannerVisible, choose, subscribe } from "@/lib/consent";

/**
 * Cookie banner for visitors in Europe (see src/lib/consent.ts).
 *
 * Accept and Reject are equal weight — GDPR does not allow a buried
 * "reject". Nothing is blocked while it is open: the page stays usable and
 * analytics simply waits, cookieless, for an answer.
 */
export function ConsentBanner() {
  const visible = useSyncExternalStore(subscribe, bannerVisible, () => false);
  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="consent-title"
      className="border-line bg-surface-4 fixed inset-x-3 bottom-3 z-50 mx-auto max-w-3xl rounded-xl border p-5 shadow-[0_24px_48px_-12px_rgb(0_0_0/0.7)] sm:inset-x-6 sm:bottom-6 sm:p-6 print:hidden"
    >
      <p id="consent-title" className="text-ink text-sm font-semibold">
        Cookies for site analytics
      </p>
      <p className="text-ink-3 mt-2 text-sm leading-relaxed">
        With your permission we use Google Analytics and Microsoft Clarity to
        understand how buyers use this site, so we can improve it. No
        advertising cookies are used. You can change this any time from
        “Cookie settings” in the footer.{" "}
        <Link href="/legal/privacy-policy" className="text-accent-400 hover:underline">
          Privacy policy
        </Link>
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => choose("granted")}
          className="bg-accent-400 text-ink rounded-cta px-5 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90"
        >
          Accept analytics
        </button>
        <button
          type="button"
          onClick={() => choose("denied")}
          className="border-line text-ink hover:border-line-2 rounded-cta border px-5 py-2.5 text-sm font-semibold transition-colors"
        >
          Reject
        </button>
      </div>
    </div>
  );
}
