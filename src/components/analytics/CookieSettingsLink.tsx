"use client";

import { openConsent } from "@/lib/consent";
import { CLARITY_ID, GA_ID } from "@/lib/analytics";

/** Footer link that reopens the cookie banner. Hidden when analytics is off. */
export function CookieSettingsLink({ className }: { className?: string }) {
  if (!GA_ID && !CLARITY_ID) return null;
  return (
    <button type="button" onClick={openConsent} className={className}>
      Cookie settings
    </button>
  );
}
