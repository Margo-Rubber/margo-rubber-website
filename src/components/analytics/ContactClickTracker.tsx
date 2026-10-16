"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

/**
 * Direct-contact clicks as events, from one listener rather than an
 * onClick on every link: WhatsApp, phone and email links live in the
 * footer, the contact page, CMS blocks and the floating button.
 *
 * In GA4, mark `generate_lead`, `whatsapp_click`, `phone_click` and
 * `email_click` as key events (Admin → Events).
 */
export function ContactClickTracker() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a[href]");
      if (!a) return;
      const href = a.getAttribute("href") ?? "";
      const page = window.location.pathname;
      if (/^https:\/\/(wa\.me|api\.whatsapp\.com)\//.test(href)) track("whatsapp_click", { page });
      else if (href.startsWith("tel:")) track("phone_click", { page });
      else if (href.startsWith("mailto:")) track("email_click", { page });
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}
