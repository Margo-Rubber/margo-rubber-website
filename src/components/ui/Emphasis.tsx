import type { ReactNode } from "react";
import Link from "next/link";

/**
 * `**Legal basis.** Under DPDP…` — the content sheets emphasise a lead-in
 * or a governing phrase in bold; the CMS keeps that as `**…**` so the copy
 * stays one string. This turns the markers back into <strong>.
 *
 * The same string may carry a link the sheet asks for on a phrase —
 * "metering and dosing pumps → /industries/pumps-valves" (sheet 36 §02) —
 * written `[metering and dosing pumps](/industries/pumps-valves)`. The
 * words stay the sheet's; only the phrase becomes the link.
 */
export function emphasised(text: string, className = "text-ink font-semibold"): ReactNode {
  const parts = text.split(/\*\*([^*]+)\*\*/g);
  if (parts.length === 1) return linked(text);
  return parts.map((part, i) =>
    i % 2 ? (
      <strong key={i} className={className}>
        {linked(part)}
      </strong>
    ) : (
      <span key={i}>{linked(part)}</span>
    ),
  );
}

const LINK = /\[([^\]]+)\]\(((?:\/|#|https?:)[^)\s]+)\)/g;

function linked(text: string): ReactNode {
  if (!LINK.test(text)) return text;
  LINK.lastIndex = 0;
  const out: ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(LINK)) {
    if (m.index > last) out.push(text.slice(last, m.index));
    out.push(
      <Link key={m.index} href={m[2]} className="text-accent-400 underline decoration-accent-400/40 underline-offset-2 hover:decoration-accent-400">
        {m[1]}
      </Link>,
    );
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

/**
 * `Every Shipment, *Same Quality System.*` — the sheets mark the accent
 * words of a heading with single stars (starAccent in scripts/sheets/lib);
 * the hub headings render them coloured. Anything printing a heading
 * string straight goes through this, or the stars reach the page.
 */
export function accented(text: string): ReactNode {
  if (!text.includes("*")) return text;
  return text.split("*").map((part, i) =>
    i % 2 ? (
      <span key={i} className="text-accent-400">
        {part}
      </span>
    ) : (
      part
    ),
  );
}

/** The same string with its markers removed — for structured data and titles. */
export function plainText(text: string): string {
  return text.replace(/\*\*([^*]+)\*\*/g, "$1").replace(/\*([^*]+)\*/g, "$1").replace(LINK, "$1");
}
