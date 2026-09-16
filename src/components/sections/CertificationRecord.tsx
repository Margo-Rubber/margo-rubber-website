import Link from "next/link";
import type { Certification } from "@/content/schemas/settings";

/**
 * THE CERTIFICATION RECORD — one block, read from Site settings.
 *
 * It appears on the products hub, the About page and the certifications
 * page, and on the old site each of those typed its own list: the hub said
 * ISO 14001 and IATF were "Certified by SGS India" and "TÜV Rheinland"; About
 * listed a FIEO award. None of that is held. The record here is the one in
 * settings, and every badge states its standing in brackets — Approved,
 * Upgrade in progress, Qualification in progress — so a reader never takes
 * a programme for a certificate. Content sheets §07 / Build Instructions.
 *
 * Held rows are filled; in-progress rows are outlined. The scope note
 * travels with the block wherever it renders.
 */
export function CertificationBadges({
  items,
  scopeNote,
  compact = false,
}: {
  items: readonly Certification[];
  scopeNote?: string;
  /** Three-up card grid without bodies — for pages where the record is a footnote. */
  compact?: boolean;
}) {
  return (
    <div>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((c) => {
          const held = c.standing === "held";
          return (
            <li
              key={c.code}
              className={`rounded-card relative border p-6 ${
                held
                  ? "border-accent-400/40 bg-accent-400/[0.06]"
                  : "border-line bg-surface-3 border-dashed"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <p className="text-ink text-xl leading-tight font-bold">
                  {c.code}
                </p>
                <span
                  className={`rounded-pill shrink-0 border px-2.5 py-1 font-mono text-[11px] uppercase ${
                    held
                      ? "border-accent-400/40 bg-accent-400 text-ink"
                      : "border-line-2 text-ink-3"
                  }`}
                >
                  [{c.statusLabel}]
                </span>
              </div>
              <p className="text-ink mt-4 text-sm font-semibold">{c.title}</p>
              {!compact && (
                <p className="text-ink-4 mt-2 text-sm leading-relaxed">
                  {c.body}
                </p>
              )}
              <p className="text-ink-4 mt-4 font-mono text-[11px]">
                {held
                  ? [
                      c.issuer,
                      c.identifier && `Certificate ${c.identifier}`,
                      c.validThrough &&
                        `valid to ${formatDate(c.validThrough)}`,
                    ]
                      .filter(Boolean)
                      .join(" · ")
                  : c.target
                    ? `Target ${c.target}`
                    : ""}
              </p>
            </li>
          );
        })}
      </ul>
      {scopeNote && (
        <p className="text-ink-4 mt-6 text-xs leading-relaxed">
          {scopeNote}{" "}
          <Link
            href="/certifications"
            className="text-accent-400 hover:opacity-80"
          >
            Read the certificate ›
          </Link>
        </p>
      )}
    </div>
  );
}

/** "2027-02-21" → "21 February 2027". Fixed locale so server and client agree. */
function formatDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  return `${d} ${MONTHS[m - 1]} ${y}`;
}
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
