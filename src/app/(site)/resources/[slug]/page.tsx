import Link from "next/link";
import { notFound } from "next/navigation";
import { getResourcePage, resourceSlugs } from "@/lib/resource-source";
import { Prose } from "@/components/blocks/Prose";
import { buildMetadata } from "@/lib/seo";
import { articleNode, pageGraph } from "@/lib/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { Container } from "@/components/ui/Section";

export async function generateStaticParams() {
  return (await resourceSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata(
  props: PageProps<"/resources/[slug]">,
) {
  const { slug } = await props.params;
  const page = await getResourcePage(slug);
  return page ? buildMetadata(page.frontmatter, `/resources/${slug}`) : {};
}

const CATEGORY_LABEL: Record<string, string> = {
  "material-comparison": "Material Comparison",
  "sizing-spec": "Sizing & Spec",
  "sourcing-buyer": "Sourcing & Buyer",
};

/**
 * /resources/[slug] — the guide template.
 *
 * NOTE: there is no Figma design for this page type. The layout below is
 * derived from the established design system and should be reviewed before it
 * carries real copy.
 *
 * The guides currently have no body. Rather than fabricate material
 * engineering, `hasBody` drives an explicit in-preparation state: the reader is
 * told the guide is being written and pointed at the pages that DO have
 * substance. The moment real prose lands in the MDX body, this page renders it
 * and the notice disappears with no code change.
 */
export default async function ResourceGuidePage(
  props: PageProps<"/resources/[slug]">,
) {
  const { slug } = await props.params;

  // Unknown slugs are handled by letting getContent throw rather than by
  // listing the directory here. Reading the filesystem inside the component is
  // runtime data, which makes the route blocking under cacheComponents and
  // stops the fallback shell prerendering. Same pattern as the products and
  // industries routes.
  const page = await getResourcePage(slug);
  if (!page) notFound();

  const { frontmatter: fm, Content, prose, hasBody } = page;
  const related = fm.related;

  return (
    <article className="bg-canvas">
      <JsonLd
        status={fm.status}
        graph={await pageGraph({
          path: `/resources/${slug}`,
          name: fm.seo.title,
          description: fm.seo.description,
          crumbs: [
            { name: "Home", path: "/" },
            { name: "Resources", path: "/resources" },
            { name: fm.h1, path: `/resources/${slug}` },
          ],
          faqs: fm.faqs,
          extra: [articleNode(fm, `/resources/${slug}`)],
        })}
      />

      <header className="relative isolate overflow-hidden pt-36 pb-14 md:pt-48">
        <span
          aria-hidden
          className="bg-accent-400/10 pointer-events-none absolute -top-24 -left-32 -z-10 size-[30rem] rounded-full blur-3xl"
        />
        <Container>
          <nav aria-label="Breadcrumb">
            <ol className="text-eyebrow text-ink-4 flex flex-wrap items-center gap-2 font-mono uppercase">
              <li>
                <Link href="/resources" className="hover:text-ink transition-colors">
                  Resources
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li className="text-ink-2">{fm.navLabel}</li>
            </ol>
          </nav>

          <p className="text-eyebrow text-accent-400 mt-8 flex items-center gap-2.5 font-mono uppercase">
            {CATEGORY_LABEL[fm.category] ?? fm.category}
            <span aria-hidden className="text-ink-4">·</span>
            <span className="text-ink-4 normal-case">
              {fm.readingMinutes} min read
            </span>
          </p>

          <h1 className="text-display-2 mt-4 max-w-[24ch]">{fm.h1}</h1>

          <p className="text-ink-3 mt-6 max-w-[60ch] leading-relaxed">
            {fm.intro}
          </p>
        </Container>
      </header>

      <Container>
        {hasBody ? (
          <div className="prose-guide max-w-[68ch] pb-16">
            {/* Same wrapper for both sources, so a guide written in Studio and
                one written in MDX are indistinguishable once rendered. */}
            {prose ? <Prose value={prose} /> : Content ? <Content /> : null}
          </div>
        ) : (
          <div className="rounded-card border-line border-l-accent-400 mb-16 max-w-[68ch] border border-l-2 bg-[#0B0D10] p-7 md:p-9">
            <h2 className="text-ink text-lg font-semibold">
              This guide is being written
            </h2>
            <p className="text-ink-4 mt-3 text-sm leading-relaxed">
              We publish technical guides only once the engineering content has
              been reviewed by our team in Nashik. This one is in preparation.
              Rather than fill the page with generic material, we would rather
              answer your specific question directly.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="bg-accent-400 text-ink hover:opacity-90 shadow-glow rounded-cta inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold transition-colors"
              >
                Ask our engineers
              </Link>
              <Link
                href="/resources"
                className="border-line-2 text-ink hover:border-accent-400/60 rounded-pill inline-flex items-center border px-6 py-3 text-sm font-semibold transition-colors"
              >
                Back to all guides
              </Link>
            </div>
          </div>
        )}

        {/* Related links carry the internal-linking spec from the plan: every
            guide points at the categories and sectors it informs. */}
        {(related.products.length > 0 || related.industries.length > 0) && (
          <div className="border-line max-w-[68ch] border-t pt-10 pb-20">
            <h2 className="text-eyebrow text-ink-4 font-mono uppercase">
              Related
            </h2>
            <ul className="mt-5 flex flex-wrap gap-3">
              {related.products.map((p) => (
                <li key={`p-${p}`}>
                  <Link
                    href={`/products/${p}`}
                    className="border-line-2 text-ink-2 hover:border-accent-400/60 hover:text-ink rounded-pill inline-flex border px-4 py-2 text-sm transition-colors"
                  >
                    {p.replace(/-/g, " ")}
                  </Link>
                </li>
              ))}
              {related.industries.map((i) => (
                <li key={`i-${i}`}>
                  <Link
                    href={`/industries/${i}`}
                    className="border-line-2 text-ink-2 hover:border-accent-400/60 hover:text-ink rounded-pill inline-flex border px-4 py-2 text-sm transition-colors"
                  >
                    {i.replace(/-/g, " ")}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Container>
    </article>
  );
}
