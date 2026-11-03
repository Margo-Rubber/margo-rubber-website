import Link from "next/link";
import { Img } from "@/components/ui/Img";
import { Container } from "@/components/ui/Section";
import { getSitePage } from "@/lib/page-source";
import { footerSchema } from "@/content/schemas";
import { getSiteSettings, telHref } from "@/lib/settings";
import {
  COMPANY_LINKS,
  INDUSTRIES,
  PRODUCT_GROUPS,
  hrefFor,
} from "@/content/routes";
import { CopyrightYear } from "@/components/ui/CopyrightYear";
import { CookieSettingsLink } from "@/components/analytics/CookieSettingsLink";

/**
 * SITE FOOTER — built to ui-changes/footer.pdf.
 *
 * Its own file rather than living beside SiteHeader, because SiteHeader is a
 * client component (it owns the mobile menu state) and this reads content
 * from disk. Keeping them together would force the whole footer across the
 * client boundary for no reason.
 *
 * Every string comes from content/pages/footer.mdx. Nothing is hardcoded
 * here, so the eventual CMS has exactly one file to bind to and a
 * non-technical editor never opens a .tsx file to change a link label.
 */

const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  linkedin: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="2.5" />
      <path d="M8 10.5V16M8 7.6v.01M12 16v-3.2a2 2 0 0 1 4 0V16" />
    </>
  ),
  twitter: (
    <path d="M4 4.5h3.6l4.2 5.6 4.9-5.6H20l-6.6 7.5L20.5 20h-3.6l-4.5-6-5.2 6H4.6l7-8z" />
  ),
  youtube: (
    <>
      <rect x="2.8" y="6" width="18.4" height="12" rx="3.5" />
      <path d="m10.4 9.6 4.6 2.4-4.6 2.4z" />
    </>
  ),
};

function SocialIcon({ name }: { name: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-4"
      aria-hidden
    >
      {SOCIAL_ICONS[name]}
    </svg>
  );
}

/** The teal triangle that precedes every link in the comp. */
function Caret() {
  return (
    <svg
      viewBox="0 0 8 10"
      className="text-accent-400 mt-[0.35em] size-2 shrink-0"
      aria-hidden
    >
      <path d="M0 0l8 5-8 5z" fill="currentColor" />
    </svg>
  );
}

function ContactRow({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <li className="text-ink-3 flex items-start gap-3 text-sm">
      <span className="border-line bg-surface-3 text-accent-400 mt-px grid size-8 shrink-0 place-items-center rounded-lg border">
        {icon}
      </span>
      <span className="pt-1.5 leading-relaxed">{children}</span>
    </li>
  );
}

/**
 * The three link columns come from the route registry, not from the footer
 * document. A hand-typed copy of twenty-six URLs is how the old footer ended
 * up with four industry links on one page and two categories missing; the
 * registry is the same list the menus, dropdowns and sitemap read, so the
 * footer cannot drift from them. The Products column is grouped in three —
 * fifteen flat is not readable — and the group labels are plain text, never
 * headings: three phantom sections is not an improvement on one.
 */
const COLUMNS = [
  {
    heading: "Products",
    groups: PRODUCT_GROUPS.map((g) => ({
      label: g.label,
      links: g.items.map((e) => ({ label: e.label, href: hrefFor(e) })),
    })),
  },
  {
    heading: "Industries",
    groups: [
      {
        label: null,
        links: INDUSTRIES.map((e) => ({ label: e.label, href: hrefFor(e) })),
      },
    ],
  },
  { heading: "Company", groups: [{ label: null, links: [...COMPANY_LINKS] }] },
] as const;

/**
 * Evaluated once when the module loads, not inside a cached render — the
 * prerender rejects a clock read in a cached server tree. The client
 * component corrects it from the browser's clock.
 */
const BUILD_YEAR = new Date().getFullYear();

export async function SiteFooter() {
  const [fm, settings] = await Promise.all([
    getSitePage("footer", footerSchema),
    getSiteSettings(),
  ]);
  const social = fm.social.filter((s) => s.href.trim() !== "");
  const { entity, certifications } = settings;

  return (
    <footer className="border-line bg-surface-2 border-t pt-16 pb-10">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-16">
          {/* Identity */}
          <div>
            <div className="inline-flex flex-col items-start">
              <Img k="brand.mark" sizes="56px" className="size-14 shrink-0" />
              <span className="mt-2 flex flex-col leading-none">
                <span className="text-ink text-lg font-bold tracking-[0.14em]">
                  MARGO
                </span>
                <span className="text-ink-4 mt-1.5 text-[9px] tracking-[0.22em]">
                  RUBBER PRODUCTS
                </span>
              </span>
            </div>

            <p className="text-ink-3 mt-6 max-w-[38ch] text-sm leading-relaxed">
              {fm.brand.blurb}
            </p>

            {/* NAP in <address>: the visible strings and the hrefs share one source. */}
            <address className="not-italic">
              <ul className="mt-7 space-y-3.5">
                <ContactRow
                  icon={
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      className="size-4"
                      aria-hidden
                    >
                      <path d="M6.5 3.5h3l1.5 4-2 1.5a12 12 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.5 5.7a2 2 0 0 1 2-2.2z" />
                    </svg>
                  }
                >
                  <a
                    href={telHref(entity.phone)}
                    className="hover:text-ink transition-colors"
                  >
                    {entity.phone}
                  </a>
                </ContactRow>

                <ContactRow
                  icon={
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      className="size-4"
                      aria-hidden
                    >
                      <rect x="3" y="5" width="18" height="14" rx="2" />
                      <path d="m3 7 9 6 9-6" />
                    </svg>
                  }
                >
                  <a
                    href={`mailto:${entity.email}`}
                    className="hover:text-ink transition-colors"
                  >
                    {entity.email}
                  </a>
                </ContactRow>

                <ContactRow
                  icon={
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      className="size-4"
                      aria-hidden
                    >
                      <path d="M12 21s7-5.7 7-11a7 7 0 1 0-14 0c0 5.3 7 11 7 11z" />
                      <circle cx="12" cy="10" r="2.6" />
                    </svg>
                  }
                >
                  {entity.address.lines.map((line, i) => (
                    <span key={i} className="block">
                      {/* Trailing space: separate blocks on screen, but
                          crawlers read them as one string — without it
                          "Stop,opposite" ran together. */}
                      {line}{" "}
                    </span>
                  ))}
                </ContactRow>

                {/* Working hours, under the address (client, 2 Nov 2026).
                    The same Site settings string the Contact page shows. */}
                <ContactRow
                  icon={
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      className="size-4"
                      aria-hidden
                    >
                      <circle cx="12" cy="12" r="9" />
                      <path d="M12 7v5l3 2" />
                    </svg>
                  }
                >
                  {entity.hours}
                </ContactRow>
              </ul>
            </address>

            {social.length > 0 && (
              <ul className="mt-7 flex gap-2.5">
                {social.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      aria-label={s.label}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="border-line bg-surface-3 text-ink-3 hover:border-accent-400/50 hover:text-accent-400 grid size-9 place-items-center rounded-lg border transition-colors"
                    >
                      <SocialIcon name={s.icon} />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Link columns — from the route registry */}
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {COLUMNS.map((col) => (
              <nav key={col.heading} aria-label={col.heading}>
                <p className="text-ink text-sm font-bold tracking-[0.14em] uppercase">
                  {col.heading}
                </p>
                {col.groups.map((g, gi) => (
                  <div key={g.label ?? gi} className={gi > 0 ? "mt-6" : "mt-5"}>
                    {g.label && (
                      <p className="text-ink-4 mb-2 font-mono text-[11px] tracking-[0.14em] uppercase">
                        {g.label}
                      </p>
                    )}
                    <ul className="space-y-3">
                      {g.links.map((l) => (
                        <li key={l.label}>
                          <Link
                            href={l.href}
                            className="text-ink-3 hover:text-ink flex items-start gap-2.5 text-sm transition-colors"
                          >
                            <Caret />
                            {l.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </nav>
            ))}
          </div>
        </div>

        {/* Closing CTA band */}
        <div className="rounded-card border-line bg-surface-3/60 mt-16 flex flex-wrap items-center justify-between gap-6 border px-7 py-6">
          <div>
            <p className="text-ink text-lg font-semibold">{fm.cta.heading}</p>
            <p className="text-ink-3 mt-1 text-sm">{fm.cta.body}</p>
          </div>
          <Link
            href={fm.cta.action.href}
            className="rounded-cta bg-accent-400 text-canvas hover:opacity-90 inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold transition-colors"
          >
            {fm.cta.action.label}
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-4"
              aria-hidden
            >
              <path d="M4 12h15M13.5 6.5 20 12l-6.5 5.5" />
            </svg>
          </Link>
        </div>

        {/* Bottom bar */}
        <div className="border-line mt-10 flex flex-wrap items-center justify-between gap-x-8 gap-y-4 border-t pt-7">
          <p className="text-ink-4 text-sm">
            © <CopyrightYear initial={BUILD_YEAR} />{" "}
            {entity.legalName}. All rights reserved.
          </p>

          <nav aria-label="Legal">
            <ul className="flex flex-wrap gap-x-7 gap-y-2">
              {fm.legal.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-ink-4 hover:text-ink text-sm transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <CookieSettingsLink className="text-ink-4 hover:text-ink cursor-pointer text-sm transition-colors" />
              </li>
            </ul>
          </nav>

          <p className="text-eyebrow border-accent-400/30 bg-accent-400/10 text-accent-400 inline-flex items-center gap-2 rounded-pill border px-3.5 py-1.5 font-mono">
            <span aria-hidden className="bg-accent-400 size-1.5 rounded-full" />
            {certifications.line}
          </p>
        </div>
      </Container>
    </footer>
  );
}
