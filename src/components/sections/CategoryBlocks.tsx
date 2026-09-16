import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { hrefFor, industryBySlug, productBySlug } from "@/content/routes";
import { Container, Eyebrow, SectionGlow } from "@/components/ui/Section";
import { Icon, ProfileDrawing, type IconName, type ProfileShape } from "@/components/ui/Icon";

/**
 * CATEGORY PAGE BLOCKS — the sections drawn by the two new category comps in
 * UI-changes2/ (Extrusion Profiles, Sponge & Foam Rubber).
 *
 * These comps introduce a visual language the original nine category pages do
 * not use: centred section headers, stroked icons in soft accent tiles,
 * cards that centre their content, and a connected process timeline. Kept in
 * their own file rather than bent into Blocks.tsx, which serves the nine.
 *
 * All server components — nothing here is interactive.
 */

/** Soft accent tile behind an icon. Used on specify, sector and chip rows. */
function IconTile({
  name,
  size = "md",
}: {
  name: IconName;
  size?: "sm" | "md";
}) {
  return (
    <span
      className={`bg-accent-400/10 text-accent-400 grid shrink-0 place-items-center rounded-lg ${
        size === "sm" ? "size-7" : "size-9"
      }`}
    >
      <Icon name={name} className={size === "sm" ? "size-3.5" : "size-4.5"} />
    </span>
  );
}

/* ── Profile library ─────────────────────────────────────────────────────── */

/**
 * The catalogue of cross-sections.
 *
 * Five across, because the comp draws five and the drawings need the width to
 * stay readable. The final card is the custom option and is drawn differently
 * — dashed border, accent title — because it is an invitation rather than a
 * stock item.
 */
export function ProfileGrid({
  items,
  cardCta,
}: {
  items: readonly {
    id?: string;
    code?: string;
    name: string;
    body: string;
    shape?: string;
  }[];
  /** "Quote this section" — links each coded card to the contact form with its code. */
  cardCta?: string;
}) {
  return (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      {items.map((p) => {
        const custom = !p.code;
        return (
          <li
            key={p.name}
            id={p.id}
            className={`rounded-card scroll-mt-28 px-5 py-7 text-center ${
              custom
                ? "border-accent-400/40 bg-accent-400/[0.04] border border-dashed"
                : "border-line bg-surface-3 border"
            }`}
          >
            <span className="text-accent-400 flex justify-center">
              <ProfileDrawing shape={(p.shape ?? "custom-profile") as ProfileShape} />
            </span>
            <h3
              className={`mt-5 text-sm font-semibold ${
                custom ? "text-accent-400" : "text-ink"
              }`}
            >
              {p.name}
            </h3>
            {p.code && (
              <p className="text-accent-400 mt-1.5 font-mono text-[11px] tracking-[0.1em]">
                {p.code}
              </p>
            )}
            <p className="text-ink-4 mt-2.5 text-xs leading-relaxed">{p.body}</p>
            {cardCta && p.code && (
              <Link
                href={`/contact?profile=${encodeURIComponent(p.code)}`}
                className="text-accent-400 mt-4 inline-flex items-center gap-1.5 text-xs font-medium hover:opacity-80"
              >
                {cardCta} <span aria-hidden>→</span>
              </Link>
            )}
          </li>
        );
      })}
    </ul>
  );
}

/* ── Process ─────────────────────────────────────────────────────────────── */

/**
 * The manufacturing stages, as a connected timeline.
 *
 * `<ol>`, and numbered, because the order carries the information —
 * compounding has to precede extrusion, curing precedes cut-off. The
 * connecting rule is a single absolutely-positioned line behind the badges
 * rather than a border on each item, so it does not overhang at either end.
 */
export function ProcessTimeline({
  steps,
}: {
  steps: readonly { name: string; body: string; icon?: string }[];
}) {
  return (
    <ol className="relative grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
      {/* Rule between the badge centres. Hidden below lg, where the stages
          stack and a horizontal line would connect nothing. */}
      <span
        aria-hidden
        className="bg-line-2 absolute top-8 right-[12.5%] left-[12.5%] hidden h-px lg:block"
      />
      {steps.map((s, i) => (
        <li key={s.name} className="relative text-center">
          <span className="border-accent-400/40 bg-canvas text-accent-400 relative mx-auto grid size-16 place-items-center rounded-full border">
            <Icon name={(s.icon ?? "gear") as IconName} className="size-6" />
          </span>
          <p className="text-accent-400 mt-5 font-mono text-[11px] tabular-nums">
            {String(i + 1).padStart(2, "0")}
          </p>
          <h3 className="text-ink mt-2 text-base font-semibold">{s.name}</h3>
          <p className="text-ink-4 mx-auto mt-3 max-w-[34ch] text-xs leading-relaxed">
            {s.body}
          </p>
        </li>
      ))}
    </ol>
  );
}

/* ── Specify in four lines ───────────────────────────────────────────────── */

/**
 * Each parameter with the format expected of it, so a buyer can assemble a
 * complete enquiry in one pass. The oversized ghost numeral is the comp's;
 * it is decorative, hence `aria-hidden` — the order of these four does not
 * matter, so the number must not be read out as if it did.
 */
export function SpecifyCards({
  items,
  closing,
  closingLink,
}: {
  items: readonly {
    label: string;
    value: string;
    body: string;
    icon?: string;
  }[];
  closing?: string;
  closingLink?: { label: string; href: string };
}) {
  return (
    <>
    <dl className="grid gap-4 sm:grid-cols-2">
      {items.map((it, i) => (
        <div
          key={it.label}
          className="border-line bg-surface-3 rounded-card relative overflow-hidden border p-6"
        >
          <span
            aria-hidden
            className="text-ink/[0.04] pointer-events-none absolute -top-3 right-4 text-7xl leading-none font-bold tabular-nums"
          >
            {String(i + 1).padStart(2, "0")}
          </span>
          <div className="relative flex items-start gap-4">
            <IconTile name={(it.icon ?? "gear") as IconName} />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <dt className="text-ink text-base font-semibold">{it.label}</dt>
                <span className="border-accent-400/30 text-accent-400 rounded border px-2 py-0.5 font-mono text-[10px] whitespace-nowrap">
                  {it.value}
                </span>
              </div>
              <dd className="text-ink-4 mt-3 text-sm leading-relaxed">
                {it.body}
              </dd>
            </div>
          </div>
        </div>
      ))}
    </dl>
    {closing && (
      <p className="text-ink-3 mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-center text-sm">
        {closing}
        {closingLink && (
          <Button href={closingLink.href}>
            {closingLink.label}
            <span aria-hidden>→</span>
          </Button>
        )}
      </p>
    )}
    </>
  );
}

/* ── Quality assurance ───────────────────────────────────────────────────── */

/**
 * Two columns: the claim on the left, the evidence on the right.
 *
 * This is the one section on the page that is not centred, and deliberately
 * so — a testimonial and a list of test standards are both read left to
 * right, and centring either would slow them down.
 */
export function QualityPanel({
  eyebrow,
  heading,
  body,
  quote,
  badges,
  standards,
  docPackage,
  className = "",
}: {
  eyebrow: string;
  heading: string;
  body: string;
  quote?: { text: string; author: string; org: string; initials: string };
  badges?: readonly { label: string; icon?: string }[];
  standards: readonly { name: string; code: string; group?: string }[];
  docPackage?: { title: string; body: string };
  className?: string;
}) {
  const marked = heading.split("*").map((part, i) =>
    i % 2 === 1 ? (
      <span key={part} className="text-accent-400">
        {part}
      </span>
    ) : (
      part
    ),
  );

  return (
    <section className={`relative overflow-hidden py-[70px] ${className}`}>
      <SectionGlow />
      <Container className="relative">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <Eyebrow variant="rule">{eyebrow}</Eyebrow>
            <h2 className="text-h2 mt-3">{marked}</h2>
            <p className="text-ink-3 mt-4 max-w-[54ch] leading-relaxed">
              {body}
            </p>

            {quote && (
              <figure className="border-line bg-surface-3 rounded-card mt-8 border border-l-2 border-l-[color:var(--color-accent-400)] p-7">
                <span aria-hidden className="text-accent-400 block text-2xl leading-none">
                  &ldquo;
                </span>
                <blockquote className="text-ink-2 mt-3 text-sm leading-relaxed italic">
                  {quote.text}
                </blockquote>
                <figcaption className="mt-5 flex items-center gap-3">
                  <span className="bg-accent-400 text-ink grid size-9 shrink-0 place-items-center rounded-full text-[11px] font-bold">
                    {quote.initials}
                  </span>
                  <span className="text-sm">
                    <span className="text-ink block font-semibold">
                      {quote.author}
                    </span>
                    <span className="text-ink-4 block text-xs">{quote.org}</span>
                  </span>
                </figcaption>
              </figure>
            )}

            {badges && badges.length > 0 && (
              <ul className="text-ink-4 mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs">
                {badges.map((b) => (
                  <li key={b.label} className="flex items-center gap-2">
                    <Icon
                      name={(b.icon ?? "shield") as IconName}
                      className="text-accent-400 size-3.5"
                    />
                    {b.label}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            {/* Tests in their groups — "Per batch, before despatch" / "Per
                compound, at qualification" (sheet 18 §06). One list per
                group with its label above; an ungrouped list has none. */}
            {groupStandards(standards).map((g) => (
              <div key={g.label ?? "all"} className="[&+div]:mt-6">
                {g.label && (
                  <p className="text-eyebrow text-ink-4 mb-3 font-mono uppercase">{g.label}</p>
                )}
                <ul className="space-y-2.5">
                  {g.items.map((s) => (
                    <li
                      key={s.name}
                      className="border-line bg-surface-3 flex items-center gap-3 rounded-lg border px-5 py-3.5"
                    >
                      <Icon name="check" className="text-accent-400 size-4 shrink-0" />
                      <span className="text-ink-2 min-w-0 flex-1 text-sm">
                        {s.name}
                      </span>
                      <span className="text-ink-4 font-mono text-[10px] tracking-[0.08em] whitespace-nowrap">
                        {s.code}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {docPackage && (
              <div className="border-accent-400/25 bg-accent-400/[0.05] rounded-card mt-4 border p-6">
                <p className="text-accent-400 flex items-center gap-2.5 text-sm font-semibold">
                  <Icon name="document" className="size-4" />
                  {docPackage.title}
                </p>
                <p className="text-ink-4 mt-3 text-xs leading-relaxed whitespace-pre-line">
                  {docPackage.body}
                </p>
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}

/**
 * A card may point at a page the registry has not flipped live yet
 * (Construction, sheet 41). Until it is, the click goes where the registry
 * sends every other link to that page — never to a 404.
 */
function liveHref(href: string): string {
  const m = href.match(/^\/(industries|products)\/([a-z0-9-]+)$/);
  if (!m) return href;
  const entry = m[1] === "industries" ? industryBySlug(m[2]) : productBySlug(m[2]);
  return entry ? hrefFor(entry) : href;
}

/** Consecutive tests with the same group label, in order; ungrouped stay together. */
function groupStandards<T extends { group?: string }>(items: readonly T[]) {
  const out: { label?: string; items: T[] }[] = [];
  for (const it of items) {
    const last = out[out.length - 1];
    if (last && last.label === it.group) last.items.push(it);
    else out.push({ label: it.group, items: [it] });
  }
  return out;
}

/* ── Sectors ─────────────────────────────────────────────────────────────── */

/** Three across, icon tile top-left, left-aligned inside the card. */
export function SectorCards({
  items,
  cardCta,
}: {
  items: readonly { name: string; body: string; icon?: string; href?: string }[];
  /** "Rubber components for {sector}" — the link under each card that has an href. */
  cardCta?: string;
}) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((s) => (
        <li
          key={s.name}
          className="border-line bg-surface-3 rounded-card border p-6"
        >
          <IconTile name={(s.icon ?? "building") as IconName} />
          <h3 className="text-ink mt-5 text-base font-semibold">{s.name}</h3>
          <p className="text-ink-4 mt-3 text-sm leading-relaxed">{s.body}</p>
          {cardCta && s.href && (
            <Link
              href={liveHref(s.href)}
              className="text-accent-400 mt-4 inline-flex items-center gap-1.5 text-sm font-medium hover:opacity-80"
            >
              {cardCta.replace("{sector}", s.name)} <span aria-hidden>→</span>
            </Link>
          )}
        </li>
      ))}
    </ul>
  );
}

/* ── Closing CTA ─────────────────────────────────────────────────────────── */

/**
 * Centred panel with corner brackets — the comp's framing device, four short
 * rules set outside the card. Purely decorative, so they are `aria-hidden`
 * and drawn with borders rather than an image.
 */
export function CtaPanel({
  eyebrow,
  heading,
  body,
  chips,
  primary,
  secondary,
  className = "",
}: {
  eyebrow: string;
  heading: string;
  body: string;
  className?: string;
  chips?: readonly { label: string; icon?: string }[];
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
}) {
  const marked = heading.split("*").map((part, i) =>
    i % 2 === 1 ? (
      <span key={part} className="text-accent-400">
        {part}
      </span>
    ) : (
      part
    ),
  );

  return (
    <section className={`relative overflow-hidden py-[70px] ${className}`}>
      <SectionGlow />
      <Container className="relative">
        <div className="relative px-4 py-4">
          {[
            "top-0 left-0 border-t border-l",
            "top-0 right-0 border-t border-r",
            "bottom-0 left-0 border-b border-l",
            "bottom-0 right-0 border-b border-r",
          ].map((pos) => (
            <span
              key={pos}
              aria-hidden
              className={`border-accent-400/30 absolute size-8 ${pos}`}
            />
          ))}

          <div className="border-line bg-surface-2 rounded-card border px-6 py-14 text-center md:px-14">
            <Eyebrow variant="rule" center>
              {eyebrow}
            </Eyebrow>
            <h2 className="text-h1 mt-4">{marked}</h2>
            <p className="text-ink-3 mx-auto mt-5 max-w-[56ch] leading-relaxed">
              {body}
            </p>

            {chips && chips.length > 0 && (
              <ul className="mt-8 flex flex-wrap justify-center gap-2.5">
                {chips.map((c) => (
                  <li
                    key={c.label}
                    className="border-line text-ink-3 flex items-center gap-2 rounded-pill border px-4 py-2 text-xs"
                  >
                    <Icon
                      name={(c.icon ?? "box") as IconName}
                      className="text-accent-400 size-3.5"
                    />
                    {c.label}
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Button href={primary.href}>
                <Icon name="upload" className="size-4" />
                {primary.label}
              </Button>
              {secondary && (
                <Button href={secondary.href} variant="secondary">
                  <Icon name="document" className="size-4" />
                  {secondary.label}
                </Button>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
