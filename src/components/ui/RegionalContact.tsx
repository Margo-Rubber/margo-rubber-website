"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * VISITORS IN INDIA SEE THE INDIA NUMBER.
 *
 * Indian and export enquiries go to different people. Every page is built
 * once, with the export number from Site settings: that is what search
 * engines, link previews and visitors outside India get. For a visitor in
 * India (the `mr_cc` cookie the proxy sets from Vercel's country header),
 * this rewrites the export number to the India one after the page loads:
 *
 *   · tel: links           → the India phone
 *   · wa.me links          → the India WhatsApp
 *   · the number as text   → the India phone, in the same "+91 …" format
 *
 * It works on the rendered page rather than on each component because the
 * number is also written into content (legal pages, "Call +91 …" buttons,
 * the contact blocks), and one rewrite covers all of it, including anything
 * an editor adds later. A MutationObserver catches what renders after load:
 * client-side navigation, the mobile menu, a re-rendered component.
 *
 * <head> (meta description, JSON-LD) is never touched: those are for search
 * engines, and the JSON-LD already lists both numbers by region.
 */
export function RegionalContact({
  exportPhone,
  exportWhatsapp,
  india,
}: {
  exportPhone: string;
  exportWhatsapp: string;
  india?: { phone: string; whatsapp: string };
}) {
  const pathname = usePathname();

  useEffect(() => {
    if (!india || readCountry() !== "IN") return;

    const swap = buildSwap(exportPhone, exportWhatsapp, india);
    const observer = new MutationObserver((records) => {
      for (const r of records) {
        if (r.type === "childList") r.addedNodes.forEach((n) => swap(n));
        else swap(r.target);
      }
    });

    // NOT BEFORE HYDRATION. This layout's effect runs as soon as the layout
    // hydrates, but the page below it, and streamed Suspense boundaries,
    // hydrate later; a number changed under them makes React throw a
    // hydration mismatch and re-render that whole section. So the first pass
    // (and the observer) waits for the load event and then an idle moment,
    // which comes only once React's hydration work has drained. Visitors in
    // India see the export number for that moment.
    let cancelled = false;
    const start = () => {
      if (cancelled) return;
      swap(document.body);
      observer.observe(document.body, {
        subtree: true,
        childList: true,
        characterData: true,
        attributes: true,
        attributeFilter: ["href"],
      });
    };
    const idle = () =>
      "requestIdleCallback" in window
        ? window.requestIdleCallback(start, { timeout: 3000 })
        : window.setTimeout(start, 300);
    if (document.readyState === "complete") idle();
    else window.addEventListener("load", idle, { once: true });

    return () => {
      cancelled = true;
      window.removeEventListener("load", idle);
      observer.disconnect();
    };
  }, [pathname, exportPhone, exportWhatsapp, india]);

  return null;
}

function readCountry(): string {
  const m = document.cookie.match(/(?:^|;\s*)mr_cc=([A-Za-z]{2})/);
  return m ? m[1].toUpperCase() : "";
}

const digitsOf = (n: string) => n.replace(/\D/g, "");

/** Any spacing of the last ten digits, with or without +91 / 0 / 91 in front. */
function numberPattern(n: string): RegExp {
  const local = digitsOf(n).slice(-10).split("").join("[\\s.-]?");
  return new RegExp(`(?:\\+?91[\\s.-]?|0)?${local}(?!\\d)`, "g");
}

function buildSwap(
  exportPhone: string,
  exportWhatsapp: string,
  india: { phone: string; whatsapp: string },
) {
  const patterns = [...new Set([exportPhone, exportWhatsapp].map(digitsOf))].map(
    (d) => numberPattern(d),
  );
  const fromDigits = new Set([digitsOf(exportPhone), digitsOf(exportWhatsapp)]);
  const telTo = `tel:+${digitsOf(india.phone)}`;
  const waTo = digitsOf(india.whatsapp);

  const swapText = (node: Text) => {
    const v = node.nodeValue;
    if (!v) return;
    let out = v;
    for (const p of patterns) out = out.replace(p, india.phone);
    if (out !== v) node.nodeValue = out;
  };

  const swapLink = (a: HTMLAnchorElement) => {
    const href = a.getAttribute("href") ?? "";
    if (href.startsWith("tel:")) {
      if (fromDigits.has(digitsOf(href))) a.setAttribute("href", telTo);
    } else {
      const m = href.match(/^https:\/\/(?:wa\.me\/|api\.whatsapp\.com\/send\?phone=)(\d+)/);
      if (m && fromDigits.has(m[1])) a.setAttribute("href", href.replace(m[1], waTo));
    }
  };

  return function swap(root: Node) {
    if (root.nodeType === Node.TEXT_NODE) return swapText(root as Text);
    if (!(root instanceof Element)) return;
    if (root.closest("script, style, noscript, head")) return;
    if (root instanceof HTMLAnchorElement) swapLink(root);
    root.querySelectorAll<HTMLAnchorElement>("a[href]").forEach(swapLink);
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: (n) =>
        n.parentElement?.closest("script, style, noscript")
          ? NodeFilter.FILTER_REJECT
          : NodeFilter.FILTER_ACCEPT,
    });
    for (let n = walker.nextNode(); n; n = walker.nextNode()) swapText(n as Text);
  };
}
