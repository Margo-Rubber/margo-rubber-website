import Link from "next/link";
import type { Crumb } from "@/lib/breadcrumbs";

/**
 * The visible trail: Home › Section › Page. The last crumb is the page the
 * reader is on — text, not a link, marked aria-current so assistive tech
 * reads it as the current location.
 *
 * Set in the body face at text-sm rather than the eyebrow mono: the mono
 * face is far wider per character and overflowed on long names such as
 * "Pads, Stoppers & Caps". Wraps rather than truncating so nothing is cut.
 *
 * Renders nothing for a trail shorter than two entries — the homepage.
 */
export function Breadcrumb({
  items,
  className = "",
}: {
  items?: readonly Crumb[];
  className?: string;
}) {
  if (!items || items.length < 2) return null;
  const last = items.length - 1;
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="text-ink-4 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm">
        {items.map((c, i) => (
          <li key={c.path} className="flex items-center gap-x-3">
            {i > 0 && (
              <span aria-hidden className="text-ink-4/50">
                &rsaquo;
              </span>
            )}
            {i === last ? (
              <span aria-current="page" className="text-ink font-medium">
                {c.name}
              </span>
            ) : (
              <Link href={c.path} className="hover:text-ink transition-colors max-md:-my-3 max-md:inline-block max-md:py-3">
                {c.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
