import { Button } from "@/components/ui/Button";
import type { Crumb } from "@/lib/breadcrumbs";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Container, Eyebrow } from "@/components/ui/Section";
import { Img } from "@/components/ui/Img";

/**
 * The 40–60 word direct answer rendered BEFORE elaboration — the AEO pattern
 * the technical spec requires on every question-formatted H2.
 */
export function AnswerBlock({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-card border border-[#0A2B2C] bg-[#020909] px-8 py-7">
      <p className="text-ink-2 leading-relaxed">{children}</p>
    </div>
  );
}

/**
 * Section 04 standards reference. Measured off the design:
 * panel #0A0A0A · 2px dividers #0C0C0C · 2×2 · code in accent at 1.375rem.
 */
export function StandardsGrid({
  items,
}: {
  items: { code: string; name: string; body: string }[];
}) {
  return (
    <div className="rounded-card grid gap-[2px] overflow-hidden bg-[#0C0C0C] sm:grid-cols-2">
      {items.map((s) => (
        <div key={s.code} className="bg-[#0A0A0A] px-7 py-7">
          <h3 className="text-accent-400 text-[1.375rem] leading-none font-bold">
            {s.code}
          </h3>
          <p className="text-ink mt-3 text-sm font-semibold">{s.name}</p>
          <p className="text-ink-4 mt-3.5 text-sm leading-relaxed">{s.body}</p>
        </div>
      ))}
    </div>
  );
}

/**
 * Section 04's blocks are constrained to 896px, not the full content width.
 * Measured: x 108 → 1004 inside an 1184px content column.
 */
export function NarrowBlock({ children }: { children: React.ReactNode }) {
  return <div className="max-w-[896px]">{children}</div>;
}

/** Section 05 — the label / value / note commercial rows. */
export function CommercialTable({
  rows,
}: {
  rows: { label: string; value: string; note?: string }[];
}) {
  return (
    <div className="border-line bg-surface-2 rounded-card divide-line divide-y overflow-hidden border">
      {rows.map((r) => (
        <div
          key={r.label}
          className="flex items-center justify-between gap-6 px-6 py-4"
        >
          <div>
            <p className="text-ink text-sm font-semibold">{r.label}</p>
            {r.note && <p className="text-ink-4 mt-0.5 text-xs">{r.note}</p>}
          </div>
          <p className="text-accent-400 shrink-0 text-lg font-bold whitespace-nowrap">
            {r.value}
          </p>
        </div>
      ))}
    </div>
  );
}

/** Section 06 — closing enquiry band. */
export function CTABand({
  eyebrow,
  heading,
  body,
  primary,
  secondary,
}: {
  eyebrow: string;
  heading: string;
  body: string;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
}) {
  return (
    <section className="py-[70px]">
      <Container>
        <div className="border-line bg-surface-2 rounded-card border p-10 md:p-14">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h2 className="text-h1 mt-3">{heading}</h2>
          <p className="text-ink-3 mt-4 max-w-[60ch] leading-relaxed">{body}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href={primary.href}>{primary.label}</Button>
            {secondary && (
              <Button href={secondary.href} variant="secondary">
                {secondary.label}
              </Button>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}

/** Category-page hero — full-bleed image, badge, split-colour heading, stat row. */
export function CategoryHero({
  badge,
  headingLead,
  headingAccent,
  intro,
  link,
  stats,
  image,
  actions,
  eyebrowVariant = "badge",
  breadcrumb,
  statsAlign = "center",
}: {
  badge: string;
  headingLead: string;
  headingAccent: string;
  intro: string;
  link?: { label: string; href: string };
  stats: { value: string; label: string }[];
  image?: string;
  /** Hero buttons. The UI-changes2 comps open with two; the nine older
   *  category pages have none and pass nothing. */
  actions?: readonly { label: string; href: string; variant?: "primary" | "secondary" }[];
  /**
   * How the line above the H1 is set. The nine existing pages use a pill
   * `badge`; the new comps use the site's rule-and-label `eyebrow`.
   */
  eyebrowVariant?: "badge" | "rule";
  /** Trail above the eyebrow. Only the Sponge & Foam comp draws one. */
  breadcrumb?: readonly Crumb[];
  /** Extrusion centres the stat panel; Sponge & Foam sets it left. */
  statsAlign?: "left" | "center";
}) {
  return (
    <header className="relative isolate overflow-hidden">
      {image && (
        <>
          <Img
            k={image}
            fill
            priority
            sizes="100vw"
            className="-z-10 object-cover"
          />
          {/* Legibility scrim, in two passes because the copy is set left and
              the plant photography is brightest top-right. The vertical pass
              grounds the whole frame; the horizontal one darkens only the
              column the text occupies, so the image stays readable on the
              right instead of being flattened everywhere. */}
          <div className="from-canvas via-canvas/85 to-canvas/50 absolute inset-0 -z-10 bg-gradient-to-t" />
          <div className="from-canvas/95 via-canvas/60 absolute inset-0 -z-10 bg-gradient-to-r to-transparent" />
        </>
      )}

      <Container className="pt-32 pb-16 md:pt-48 md:pb-20">
        <Breadcrumb items={breadcrumb} className="mb-6" />

        {eyebrowVariant === "rule" ? (
          <Eyebrow variant="rule">{badge}</Eyebrow>
        ) : (
          <p className="text-eyebrow border-line-2 text-ink-2 inline-flex rounded-pill border px-4 py-1.5 font-mono uppercase">
            {badge}
          </p>
        )}

        <h1 className="text-display mt-6">
          {headingLead}
          <br />
          <span className="text-accent-400">{headingAccent}</span>
        </h1>

        <p className="text-ink-3 mt-6 max-w-[52ch] leading-relaxed">{intro}</p>

        {link && (
          <a
            href={link.href}
            className="text-accent-400 mt-6 inline-flex items-center gap-1.5 text-sm font-medium"
          >
            {/* An in-page link points down the page, not out of it. */}
            {link.label} <span aria-hidden>{link.href.startsWith("#") ? "↓" : "↗"}</span>
          </a>
        )}

        {actions && actions.length > 0 && (
          <div className="mt-9 flex flex-wrap gap-3">
            {actions.map((a) => (
              <Button key={a.label} href={a.href} variant={a.variant ?? "primary"}>
                {a.label}
                <span aria-hidden>{a.variant === "secondary" ? "›" : "→"}</span>
              </Button>
            ))}
          </div>
        )}

        {stats.length > 0 &&
          (actions && actions.length > 0 ? (
            /* The new comps set the stat row inside a bordered panel with
               vertical rules between the columns, rather than the bare
               border-top row the nine older pages use. */
            <dl className="border-line bg-surface-2/60 rounded-card divide-line mt-12 grid divide-y border backdrop-blur sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className={`px-6 py-7 ${statsAlign === "center" ? "text-center" : ""}`}
                >
                  <dd className="text-ink order-1 text-2xl font-bold">
                    {s.value}
                  </dd>
                  <dt className="text-ink-4 order-2 mt-1.5 text-xs">
                    {s.label}
                  </dt>
                </div>
              ))}
            </dl>
          ) : (
          <dl className="border-line mt-14 grid gap-8 border-t pt-6 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label}>
                {/* Value first visually, but dt/dd order kept semantic. */}
                <dd className="text-ink order-1 text-sm font-bold">
                  {s.value}
                </dd>
                <dt className="text-ink-4 order-2 mt-1 text-xs">{s.label}</dt>
              </div>
            ))}
          </dl>
          ))}
      </Container>
    </header>
  );
}
