import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { listResources } from "@/lib/resource-source";
import { publishedRoutes } from "@/lib/published";
import { SITE_URL } from "@/lib/seo";
import { trail } from "@/lib/breadcrumbs";
import { getSitePage } from "@/lib/page-source";
import { buildMetadata } from "@/lib/seo";
import { itemListNode, pageGraph } from "@/lib/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { resourcesHubSchema } from "@/content/schemas";
import { Container } from "@/components/ui/Section";
import { Img } from "@/components/ui/Img";
import {
  ResourceCta,
  ResourceLibrary,
  type Guide,
} from "@/components/sections/ResourceBlocks";
import { displaySize } from "@/lib/display-size";

export async function generateMetadata() {
  const fm = await getSitePage("resources", resourcesHubSchema);
  return buildMetadata(fm, "/resources");
}

/**
 * /resources — brief C3.
 *
 * The guide cards are NOT listed in resources.mdx. They are read from the
 * resources collection at build time, so adding a guide is one MDX file and it
 * appears in the right category group with the counts updated. That is the same
 * one-route-N-files pattern as /products and /industries.
 */
export default async function ResourcesPage() {
  const fm = await getSitePage("resources", resourcesHubSchema);

  // The hub lists the guides and, in a fourth group, the datasheets —
  // sheet 40 §10 files the sponge datasheet as an eighth item, not a guide.
  const guides: Guide[] = (await listResources())
    .map((g) => ({
      slug: g.slug,
      h1: g.h1,
      intro: g.intro,
      category: g.category,
      icon: g.icon,
      readingMinutes: g.readingMinutes,
      featured: g.featured,
      featuredBlurb: g.featuredBlurb,
    }))
    // Longest reads last within a group: the quick reference guides are the
    // ones a specifying engineer wants first.
    .sort((a, b) => a.readingMinutes - b.readingMinutes);

  const categoryCount = new Set(guides.map((g) => g.category)).size;
  const datasheets = guides.filter((g) => g.category === "datasheets").length;

  const crumbs = trail(["Resources", "/resources"]);

  // The ItemList names only published guides — a list of works with no
  // works is the same class of error as a Review node with no review
  // (content sheet 31). Empty until the first guide is signed off.
  const live = new Set(
    (await publishedRoutes()).filter((r) => r.type === "resource").map((r) => r.slug),
  );
  const listed = guides.filter((g) => live.has(g.slug));

  return (
    <>
      <JsonLd
        status={fm.status}
        graph={await pageGraph({
          type: "CollectionPage",
          path: "/resources",
          name: fm.seo.title,
          description: fm.seo.description,
          crumbs,
          ...(listed.length ? { mainEntity: { "@id": `${SITE_URL}/resources#list` } } : {}),
          extra: [
            itemListNode(
              listed.map((g) => ({ name: g.h1, path: `/resources/${g.slug}` })),
              "/resources",
              "Technical guides",
            ),
          ],
        })}
      />

      <header className="bg-canvas relative isolate overflow-hidden hero-offset pb-12">
        {/* Its own slot, replaceable in Studio under "Resources page". Starts
            as the About page's caliper on a moulded part: these guides are
            about specifying dimensions and materials, and dimensional
            measurement is that in one frame. */}
        <Img
          k="resources.hero"
          fill
          priority
          sizes="100vw"
          className="-z-20 object-cover brightness-[0.9] contrast-[1.02]"
        />
        {/* Same two-scrim treatment as the export and certifications heroes:
            the vertical wash only fades the bottom edge into the section
            below, and the horizontal one does the work of protecting the
            copy, so the photograph is not flattened to do both jobs. */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{
            background:
              "linear-gradient(to bottom, color-mix(in srgb, var(--color-canvas) 42%, transparent) 0%, color-mix(in srgb, var(--color-canvas) 30%, transparent) 45%, color-mix(in srgb, var(--color-canvas) 48%, transparent) 80%, var(--color-canvas) 100%)",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{
            background:
              "linear-gradient(to right, color-mix(in srgb, var(--color-canvas) 76%, transparent) 0%, color-mix(in srgb, var(--color-canvas) 44%, transparent) 48%, transparent 78%)",
          }}
        />
        <span
          aria-hidden
          className="bg-accent-400/10 pointer-events-none absolute -top-20 -left-32 -z-10 size-[32rem] rounded-full blur-3xl"
        />
        <Container>
          <Breadcrumb items={crumbs} />

          <h1 className={`${displaySize(fm.h1Lines)} mt-6`}>
            {fm.h1Lines.map((line) => (
              <span key={line} className="block">
                {line.split("*").map((part, i) =>
                  i % 2 === 1 ? (
                    <span key={part} className="text-accent-400">
                      {part}
                    </span>
                  ) : (
                    part
                  ),
                )}
              </span>
            ))}
          </h1>

          {/* ink-2, matching the other photographic heroes: the dimmer
              grey used for ledes on flat surfaces loses contrast here. */}
          <p className="text-ink-2 mt-6 max-w-[52ch] leading-relaxed">
            {fm.intro}
          </p>

          {/* Counts are derived, so they cannot drift from the library.
              "7 Guides · 1 Datasheet" — sheet 40 §10. */}
          <dl className="text-ink-4 mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
            <div className="flex items-center gap-1.5">
              <dt className="text-accent-400 font-semibold">{guides.length - datasheets}</dt>
              <dd>Guides</dd>
            </div>
            <span aria-hidden>·</span>
            {datasheets > 0 && (
              <>
                <div className="flex items-center gap-1.5">
                  <dt className="text-accent-400 font-semibold">{datasheets}</dt>
                  <dd>{datasheets === 1 ? "Datasheet" : "Datasheets"}</dd>
                </div>
                <span aria-hidden>·</span>
              </>
            )}
            <div className="flex items-center gap-1.5">
              <dt className="text-accent-400 font-semibold">{categoryCount}</dt>
              <dd>Categories</dd>
            </div>
            <span aria-hidden>·</span>
            {/* "Updated September 2026" — the sheet's order: label, then the month. */}
            <div className="flex items-center gap-1.5">
              <dd>Updated</dd>
              <dt className="text-accent-400 font-semibold">{fm.lastUpdated}</dt>
            </div>
          </dl>
        </Container>
      </header>

      <ResourceLibrary
        guides={guides}
        categories={fm.categories}
        searchPlaceholder={fm.searchPlaceholder}
        allLabel={fm.allLabel}
        featuredLabel={fm.featuredLabel}
      />

      <ResourceCta
        icon={fm.cta.icon}
        headingLines={fm.cta.headingLines}
        body={fm.cta.body}
        actions={fm.cta.actions}
      />
    </>
  );
}
