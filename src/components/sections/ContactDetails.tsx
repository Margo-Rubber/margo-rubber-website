import Link from "next/link";
import { Img } from "@/components/ui/Img";
import { Container, Eyebrow, Section } from "@/components/ui/Section";
import { IndustryFAQ } from "@/components/sections/IndustryDetail";
import type { SiteSettings } from "@/content/schemas/settings";
import { telHref } from "@/lib/settings";
import { InView } from "@/components/ui/InView";
import { googleMapsUrl } from "@/lib/maps";

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

/** "185 km" -> 185. Anything without a number gets no bar. */
const km = (s: string) => {
  const m = s.replace(/,/g, "").match(/(\d+(?:\.\d+)?)/);
  return m ? Number(m[1]) : 0;
};

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
  // Opens the Google Business listing itself, not a pin at raw coordinates.
  const mapsHref = googleMapsUrl(entity.legalName);

  return (
    <>
      {/* Each block shows on its data; the heading rows are optional — the
          sheet (04 §05) gives none for three of the five. */}
      {(has(addressSection) || map?.image) && (
        <Section
          id="address"
          eyebrow={has(addressSection) ? addressSection.eyebrow : undefined}
          eyebrowVariant="rule"
          heading={has(addressSection) ? addressSection.heading : undefined}
        >
          <div className="grid gap-8 lg:grid-cols-2">
            <address className="margo-address rounded-card border-line bg-surface-3 relative isolate overflow-hidden border p-8 text-sm not-italic">
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
                className="margo-map rounded-card border-line group relative block aspect-[4/3] overflow-hidden border"
                aria-label={`${map.label} (opens Google Maps)`}
              >
                <Img
                  k={map.image}
                  fill
                  sizes="(min-width:1024px) 46vw, 100vw"
                  className="object-cover"
                />
                {/* Pulsing location marker: the map is centred on the plant. */}
                <span aria-hidden className="margo-map-pin" />
                {/* Required by the OpenStreetMap licence for the map still. */}
                <span className="margo-map-credit">© OpenStreetMap contributors</span>
                <span className="margo-map-label bg-canvas/80 text-ink absolute right-4 bottom-4 rounded-pill px-4 py-2 text-sm font-medium backdrop-blur group-hover:text-accent-400">
                  {map.label || "Google Maps"} <span aria-hidden>↗</span>
                </span>
              </a>
            )}
          </div>
        </Section>
      )}

      {logistics.length > 0 && (
        <Section
          id="logistics"
          className="bg-surface"
          eyebrow={has(logisticsSection) ? logisticsSection.eyebrow : undefined}
          eyebrowVariant="rule"
          heading={has(logisticsSection) ? logisticsSection.heading : undefined}
        >
          <InView className="margo-logistics overflow-x-auto" threshold={0.25}>
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
                {(() => {
                  const longest = Math.max(1, ...logistics.map((r) => km(r.distance)));
                  return logistics.map((r, i) => (
                    <tr
                      key={r.destination}
                      style={{ "--i": i, "--w": km(r.distance) / longest } as React.CSSProperties}
                      className="margo-route border-line border-b"
                    >
                      <th
                        scope="row"
                        className="text-ink py-3.5 pr-6 text-left font-medium"
                      >
                        <span className="margo-route-name">
                          <span aria-hidden className="margo-route-dot" />
                          {r.destination}
                        </span>
                      </th>
                      <td className="text-ink-3 py-3.5 pr-6">
                        <span className="margo-route-dist">
                          {km(r.distance) > 0 && (
                            <span aria-hidden className="margo-route-track">
                              <span className="margo-route-bar" />
                            </span>
                          )}
                          <span className="margo-route-km">{r.distance}</span>
                        </span>
                      </td>
                      <td className="text-ink-3 py-3.5 font-mono text-xs">{r.transit}</td>
                    </tr>
                  ));
                })()}
              </tbody>
            </table>
          </InView>
        </Section>
      )}

      {nextSteps.length > 0 && (
        <Section
          id="next"
          eyebrow={has(nextStepsSection) ? nextStepsSection.eyebrow : undefined}
          eyebrowVariant="rule"
          heading={has(nextStepsSection) ? nextStepsSection.heading : undefined}
        >
          <InView as="ol" threshold={0.2} className="margo-next grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {nextSteps.map((st, i) => (
              <li
                key={st.stage}
                style={{ "--i": i } as React.CSSProperties}
                className="margo-next-step rounded-card border-line bg-surface-3 relative border"
              >
                <span aria-hidden className="margo-next-dot" />
                <p className="text-eyebrow text-accent-400 font-mono uppercase">
                  Step {String(i + 1).padStart(2, "0")}
                </p>
                <p className="text-ink mt-3 text-sm font-semibold">
                  {st.stage}
                </p>
                <p className="margo-next-time text-ink-4 mt-1.5 text-sm">{st.timing}</p>
              </li>
            ))}
          </InView>
        </Section>
      )}

      {faqs.length > 0 && (
        <Section className="bg-surface">
          {has(faqSection) && (
            <Container className="!px-0">
              <Eyebrow variant="rule">{faqSection.eyebrow}</Eyebrow>
              <h2 className="text-h2 mt-4 mb-10">{faqSection.heading}</h2>
            </Container>
          )}
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
