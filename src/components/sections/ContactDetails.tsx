import Link from "next/link";
import { Img } from "@/components/ui/Img";
import { Container, Eyebrow, Section } from "@/components/ui/Section";
import { IndustryFAQ } from "@/components/sections/IndustryDetail";
import type { SiteSettings } from "@/content/schemas/settings";
import { telHref } from "@/lib/settings";

/**
 * THE FIVE BLOCKS AFTER THE FORM — content sheet 04 §05.
 *
 * Address and hours, a still map, logistics from the plant, what happens
 * after the enquiry, and the questions. Each renders only when the editor
 * has given it a heading, and the address, hours, phone, email and
 * coordinates are never typed here: they come from Site settings, the same
 * as the footer and the structured data.
 *
 * The map is an image linking out to Google Maps, never an iframe — an
 * embedded map is a third-party script and a layout shift for a block a
 * buyer glances at once.
 */

type Head = { eyebrow: string; heading: string } | undefined;

const has = (h: Head): h is { eyebrow: string; heading: string } =>
  !!h?.heading?.trim();

export function ContactDetails({
  settings,
  addressSection,
  map,
  logisticsSection,
  logistics,
  nextStepsSection,
  nextSteps,
  faqSection,
  faqs,
}: {
  settings: SiteSettings;
  addressSection?: Head;
  map?: { image: string; label: string };
  logisticsSection?: Head;
  logistics: readonly {
    destination: string;
    distance: string;
    transit: string;
  }[];
  nextStepsSection?: Head;
  nextSteps: readonly { stage: string; timing: string }[];
  faqSection?: Head;
  faqs: readonly { q: string; a: string }[];
}) {
  const { entity } = settings;
  const mapsHref = `https://www.google.com/maps?q=${entity.geo.lat},${entity.geo.lng}`;

  return (
    <>
      {has(addressSection) && (
        <Section
          id="address"
          eyebrow={addressSection.eyebrow}
          eyebrowVariant="rule"
          heading={addressSection.heading}
        >
          <div className="grid gap-8 lg:grid-cols-2">
            <address className="rounded-card border-line bg-surface-3 border p-8 text-sm not-italic">
              <p className="text-ink font-semibold">{entity.legalName}</p>
              {entity.address.lines.map((l) => (
                <p key={l} className="text-ink-3 mt-1">
                  {l}
                </p>
              ))}
              <dl className="border-line mt-6 space-y-3 border-t pt-6">
                <div className="flex gap-4">
                  <dt className="text-ink-4 w-20 shrink-0">Phone</dt>
                  <dd>
                    <a
                      href={telHref(entity.phone)}
                      className="text-ink hover:text-accent-400 transition-colors"
                    >
                      {entity.phone}
                    </a>
                  </dd>
                </div>
                <div className="flex gap-4">
                  <dt className="text-ink-4 w-20 shrink-0">Email</dt>
                  <dd>
                    <a
                      href={`mailto:${entity.email}`}
                      className="text-ink hover:text-accent-400 transition-colors"
                    >
                      {entity.email}
                    </a>
                  </dd>
                </div>
                <div className="flex gap-4">
                  <dt className="text-ink-4 w-20 shrink-0">Hours</dt>
                  <dd className="text-ink">{entity.hours}</dd>
                </div>
              </dl>
            </address>

            {map?.image && (
              <a
                href={mapsHref}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-card border-line group relative block aspect-[4/3] overflow-hidden border"
                aria-label={`${map.label} (opens Google Maps)`}
              >
                <Img
                  k={map.image}
                  fill
                  sizes="(min-width:1024px) 46vw, 100vw"
                  className="object-cover"
                />
                <span className="bg-canvas/80 text-ink absolute right-4 bottom-4 rounded-pill px-4 py-2 text-sm font-medium backdrop-blur group-hover:text-accent-400">
                  {map.label} <span aria-hidden>↗</span>
                </span>
              </a>
            )}
          </div>
        </Section>
      )}

      {has(logisticsSection) && logistics.length > 0 && (
        <Section
          id="logistics"
          className="bg-surface"
          eyebrow={logisticsSection.eyebrow}
          eyebrowVariant="rule"
          heading={logisticsSection.heading}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-eyebrow text-ink-4 border-line border-b font-mono uppercase">
                  <th scope="col" className="py-3 text-left font-medium">
                    Destination
                  </th>
                  <th scope="col" className="py-3 text-left font-medium">
                    Distance
                  </th>
                  <th scope="col" className="py-3 text-left font-medium">
                    Transit
                  </th>
                </tr>
              </thead>
              <tbody>
                {logistics.map((r) => (
                  <tr key={r.destination} className="border-line border-b">
                    <th
                      scope="row"
                      className="text-ink py-3.5 pr-6 text-left font-medium"
                    >
                      {r.destination}
                    </th>
                    <td className="text-ink-3 py-3.5 pr-6">{r.distance}</td>
                    <td className="text-ink-3 py-3.5">{r.transit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      )}

      {has(nextStepsSection) && nextSteps.length > 0 && (
        <Section
          id="next"
          eyebrow={nextStepsSection.eyebrow}
          eyebrowVariant="rule"
          heading={nextStepsSection.heading}
        >
          <ol className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {nextSteps.map((st, i) => (
              <li
                key={st.stage}
                className="rounded-card border-line bg-surface-3 border p-6"
              >
                <p className="text-eyebrow text-accent-400 font-mono uppercase">
                  Step {String(i + 1).padStart(2, "0")}
                </p>
                <p className="text-ink mt-3 text-sm font-semibold">
                  {st.stage}
                </p>
                <p className="text-ink-4 mt-1.5 text-sm">{st.timing}</p>
              </li>
            ))}
          </ol>
        </Section>
      )}

      {has(faqSection) && faqs.length > 0 && (
        <Section className="bg-surface">
          <Container className="!px-0">
            <Eyebrow variant="rule">{faqSection.eyebrow}</Eyebrow>
            <h2 className="text-h2 mt-4 mb-10">{faqSection.heading}</h2>
          </Container>
          <IndustryFAQ items={[...faqs]} />
        </Section>
      )}

      {/* Every form links to the privacy policy — content sheet 08. */}
      <p className="sr-only">
        <Link href="/legal/privacy-policy">Privacy policy</Link>
      </p>
    </>
  );
}
