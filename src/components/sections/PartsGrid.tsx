import Link from "next/link";

/**
 * PARTS IN THIS CATEGORY
 *
 * Renders the `anchors:` list that every category content file already carries.
 * The data has been authored since the content pipeline was built (31 entries
 * across 9 categories) but was never rendered, which meant two things were
 * broken at once:
 *
 *   1. There was no way to browse the individual parts Margo actually makes.
 *   2. The 301 map in §4.0 points 29 legacy WooCommerce URLs at
 *      `page#anchor` targets that did not exist in the HTML. Notably
 *      `#scorpio-footrest-mat` and `#c-pillar-garnish`, both flagged in the
 *      plan as legacy pages with real indexed equity.
 *
 * Each part therefore renders with its `id` on a real element, so the fragment
 * resolves and an inbound redirect lands on the named part rather than the top
 * of the page.
 *
 * Each card links to its SKU page under /products/[category]/[product], built
 * to strategy D3 / Scenario 1 in §4.5: route and template now, shipped noindex
 * until real per-part spec data exists. The category page keeps the ranking
 * intent; these are structure, not competing landing pages.
 */

function Arrow({ className = "size-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M4 12h15M13.5 6.5 20 12l-6.5 5.5" />
    </svg>
  );
}

export function PartsGrid({
  parts,
  items = [],
  categoryLabel,
  categorySlug,
}: {
  parts: readonly { id: string; label: string; legacyUrl?: string }[];
  /** The sheets' static list: names only, no links. Replaces `parts` when filled. */
  items?: readonly { name: string; availability?: string }[];
  categoryLabel: string;
  categorySlug: string;
}) {
  // The sheets' card: number, part name as <h3>, category and order basis
  // as a <p> — the live card's three lines with the "View part" link gone
  // (sheet 10 §04). Nothing here links anywhere.
  if (items.length > 0) {
    return (
      <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((it, i) => (
          <li key={it.name} className="rounded-card border-line border bg-[#080808] p-6">
            <p className="text-eyebrow text-ink-4 font-mono">{String(i + 1).padStart(2, "0")}</p>
            <h3 className="text-ink mt-3 text-base leading-snug font-semibold">{it.name}</h3>
            {it.availability && <p className="text-ink-4 mt-2 text-sm">{it.availability}</p>}
          </li>
        ))}
      </ol>
    );
  }
  if (parts.length === 0) return null;

  return (
    <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {parts.map((p, i) => (
        <li
          key={p.id}
          id={p.id}
          // Clears the sticky header when an inbound redirect targets this
          // fragment directly.
          data-lift=""
          className="rounded-card border-line hover:border-accent-400/40 group scroll-mt-28 border bg-[#080808] p-6"
        >
          <p className="text-eyebrow text-ink-4 font-mono">
            {String(i + 1).padStart(2, "0")}
          </p>
          <h3 className="text-ink mt-3 text-base leading-snug font-semibold">
            {p.label}
          </h3>
          <p className="text-ink-4 mt-2 text-sm">
            {categoryLabel} · Made to order
          </p>
          <Link
            href={`/products/${categorySlug}/${p.id}`}
            className="text-accent-400 hover:opacity-80 mt-5 inline-flex items-center gap-2 text-sm font-medium transition-colors"
          >
            View part
            <Arrow />
          </Link>
        </li>
      ))}
    </ol>
  );
}
