import Link from "next/link";
import type { CmsImage } from "@/content/blocks";
import { SanityPhoto } from "@/components/ui/SanityPhoto";

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

/** Neutral stand-in for a card whose siblings have photos and it does not. */
function NoPhoto() {
  return (
    <div aria-hidden className="grid size-full place-items-center">
      <svg viewBox="0 0 24 24" className="size-8 text-[#B9C0C7]" fill="none" stroke="currentColor" strokeWidth="1.4">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <circle cx="9" cy="10" r="1.6" />
        <path d="m21 16-5-5-8 8" />
      </svg>
    </div>
  );
}

export function PartsGrid({
  parts,
  items = [],
  groupPhoto,
  categoryLabel,
  categorySlug,
}: {
  parts: readonly { id: string; label: string; legacyUrl?: string }[];
  /** The sheets' static list. Replaces `parts` when filled; a card with an
   *  `href` is a part with its own page and its name is the link. A card
   *  may carry its own photo whether or not it has a page. */
  items?: readonly { name: string; availability?: string; href?: string; image?: CmsImage }[];
  /** One photo of the parts together, drawn above whichever list renders. */
  groupPhoto?: CmsImage;
  categoryLabel: string;
  categorySlug: string;
}) {
  return (
    <>
      {groupPhoto?.asset && (
        <figure className="mb-8">
          <div className="rounded-card border-line overflow-hidden border bg-[#F4F5F6]">
            <SanityPhoto
              image={groupPhoto}
              fallbackAlt={`${categoryLabel} made by Margo Rubber Products`}
              sizes="(max-width: 1280px) 100vw, 1200px"
              className="h-auto max-h-[70vh] w-full"
            />
          </div>
          {groupPhoto.caption && (
            <figcaption className="text-ink-4 mt-3 text-xs">{groupPhoto.caption}</figcaption>
          )}
        </figure>
      )}
      <PartsList parts={parts} items={items} categoryLabel={categoryLabel} categorySlug={categorySlug} />
    </>
  );
}

function PartsList({
  parts,
  items,
  categoryLabel,
  categorySlug,
}: {
  parts: readonly { id: string; label: string; legacyUrl?: string }[];
  items: readonly { name: string; availability?: string; href?: string; image?: CmsImage }[];
  categoryLabel: string;
  categorySlug: string;
}) {
  // The sheets' card: number, part name as <h3>, category and order basis
  // as a <p> — the live card's three lines with the "View part" link gone
  // (sheet 10 §04). Nothing here links anywhere.
  if (items.length > 0) {
    // Photo panels appear only once at least one part has a photo; then
    // every card gets the panel so the grid rows stay level.
    const withPhotos = items.some((it) => it.image?.asset);
    return (
      <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((it, i) => (
          <li key={it.name} className="rounded-card border-line overflow-hidden border bg-[#080808]">
            {withPhotos && (
              <div className="relative aspect-[4/3] bg-[#F4F5F6]">
                {it.image?.asset ? (
                  <SanityPhoto
                    image={it.image}
                    fallbackAlt={it.name}
                    fill
                    fit="contain"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                    className="p-4"
                  />
                ) : (
                  <NoPhoto />
                )}
              </div>
            )}
            <div className="p-6">
              <p className="text-eyebrow text-ink-4 font-mono">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="text-ink mt-3 text-base leading-snug font-semibold">
                {it.href ? (
                  <Link href={it.href} className="hover:text-accent-400 inline-flex items-center gap-1.5">
                    {it.name} <span aria-hidden className="text-accent-400">›</span>
                  </Link>
                ) : (
                  it.name
                )}
              </h3>
              {it.availability && <p className="text-ink-4 mt-2 text-sm">{it.availability}</p>}
            </div>
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
