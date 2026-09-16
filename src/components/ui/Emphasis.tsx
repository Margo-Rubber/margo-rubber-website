import type { ReactNode } from "react";

/**
 * `**Legal basis.** Under DPDP…` — the content sheets emphasise a lead-in
 * or a governing phrase in bold; the CMS keeps that as `**…**` so the copy
 * stays one string. This turns the markers back into <strong>.
 */
export function emphasised(text: string, className = "text-ink font-semibold"): ReactNode {
  const parts = text.split(/\*\*([^*]+)\*\*/g);
  if (parts.length === 1) return text;
  return parts.map((part, i) =>
    i % 2 ? (
      <strong key={i} className={className}>
        {part}
      </strong>
    ) : (
      part
    ),
  );
}
