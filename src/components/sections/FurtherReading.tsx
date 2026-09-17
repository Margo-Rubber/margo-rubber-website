import Link from "next/link";
import { listResources } from "@/lib/resource-source";
import { publishedRoutes } from "@/lib/published";
import { Container, Eyebrow } from "@/components/ui/Section";

/**
 * The guides a page should send its reader on to — `related.resources`
 * on the document, rendered as a short "Further reading" strip.
 *
 * The guide sheets ask for the links in this direction: the FKM vs NBR
 * guide from the oil-seal pages (RES_02 §01), the bonded-parts guide
 * from /products/anti-vibration-mounts and /products/bushes (RES_05),
 * the evaluation checklist from /about and /certifications (RES_06),
 * the sourcing comparison from /export (RES_07). Only published guides
 * are listed — "a link to an unwritten guide is another dead affordance"
 * (RES_01 §12) — so the strip appears as each guide is published.
 */
export async function FurtherReading({ slugs }: { slugs: readonly string[] }) {
  if (!slugs.length) return null;
  const [guides, routes] = await Promise.all([listResources(), publishedRoutes()]);
  const live = new Set(routes.filter((r) => r.type === "resource").map((r) => r.slug));
  const items = slugs.map((s) => guides.find((g) => g.slug === s)).filter((g) => g && live.has(g.slug));
  if (!items.length) return null;
  return (
    <section aria-labelledby="further-reading" className="bg-canvas border-line border-t py-[70px]">
      <Container>
        <Eyebrow>Guides</Eyebrow>
        <h2 id="further-reading" className="text-h2 mt-3">
          Further Reading
        </h2>
        <ul className="mt-8 grid gap-5 md:grid-cols-2">
          {items.map((g) => (
            <li key={g!.slug} className="rounded-card border-line hover:border-accent-400/40 border bg-[#0D0F12] p-6">
              <h3 className="text-ink text-base font-semibold">
                <Link href={`/resources/${g!.slug}`} className="hover:text-accent-400 transition-colors">
                  {g!.h1}
                </Link>
              </h3>
              <p className="text-ink-4 mt-2 text-sm leading-relaxed">{g!.intro}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
