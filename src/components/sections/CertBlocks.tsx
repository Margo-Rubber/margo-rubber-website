import Link from "next/link";
import { CertificateBlock } from "@/components/sections/CertificateBlock";
import { autocompleteFor } from "@/lib/autocomplete";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import type { Crumb } from "@/lib/breadcrumbs";
import { Img } from "@/components/ui/Img";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Section";
import {
  EnquiryForm,
  EnquiryReceived,
  EnquiryStatus,
  EnquirySubmit,
} from "@/components/forms/EnquiryForm";
import { displaySize } from "@/lib/display-size";

/** Small inline icons. Text glyphs (⊘ ⛊ ✕) render inconsistently across
 *  platforms and did not match the design, which uses drawn marks. */
function Icon({
  name,
  className = "size-[18px]",
}: {
  name: "award" | "check-circle" | "x" | "shield-check";
  className?: string;
}) {
  const paths: Record<string, React.ReactNode> = {
    // Rosette: circle with two ribbon tails. This is the footnote mark.
    award: (
      <>
        <circle cx="12" cy="9" r="5.5" />
        <path d="M8.5 13.2 7.5 21l4.5-2.6L16.5 21l-1-7.8" />
      </>
    ),
    "check-circle": (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="m8.5 12 2.5 2.5 4.5-5" />
      </>
    ),
    x: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="m9 9 6 6M15 9l-6 6" />
      </>
    ),
    "shield-check": (
      <>
        <path d="M12 3l8 3v6c0 4.5-3.2 7.9-8 9-4.8-1.1-8-4.5-8-9V6z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
  };
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {paths[name]}
    </svg>
  );
}

/* ── HERO ─────────────────────────────────────────────────────────────── */
export function CertHero({
  badge,
  lines,
  accentLines,
  intro,
  actions,
  breadcrumb,
}: {
  badge: string;
  lines: string[];
  accentLines: number[];
  intro: string;
  actions: { label: string; href: string; variant: "primary" | "secondary" }[];
  breadcrumb?: readonly Crumb[];
}) {
  return (
    // Plain black (client, 2 Nov 2026): the inspection photo, its two scrims
    // and the drawn seal are gone; the ISO 9001 graphic on the right is on
    // pure black, so it sits in the hero with no visible edge.
    <header className="relative isolate overflow-hidden bg-black hero-offset pb-20 md:pb-28">
      <Container>
        <Breadcrumb items={breadcrumb} className="mb-6" />
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_auto]">
          <div>
            <span className="text-eyebrow border-accent-400/40 text-accent-400 inline-flex items-center gap-2 rounded-pill border px-4 py-1.5 font-mono uppercase">
              <span className="bg-accent-400 size-1.5 rounded-full" />
              {badge}
            </span>

            <h1 className={`${displaySize(lines)} mt-6`}>
              {lines.map((l, i) => (
                <span
                  key={l}
                  className={`block ${accentLines.includes(i) ? "text-accent-400" : ""}`}
                >
                  {l}
                  {/* Trailing space inside the block: invisible, but a crawler reads the lines with spaces. */}
                  {i < lines.length - 1 ? " " : ""}
                </span>
              ))}
            </h1>

            {/* Near-white rather than the body grey: the grey read too faint
                against the black hero (client, 2 Nov 2026). */}
            <p className="mt-6 max-w-[46ch] leading-relaxed text-white/85">
              {intro}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {actions.map((a) => (
                <Button key={a.label} href={a.href} variant={a.variant}>
                  {a.label} <span aria-hidden>{a.variant === "primary" ? "↓" : "→"}</span>
                </Button>
              ))}
            </div>
          </div>

          <div className="relative mx-auto aspect-square w-full max-w-[320px] md:max-w-[420px] lg:w-[460px] lg:max-w-none">
            <Img k="certifications.iso-badge" fill priority sizes="(max-width: 768px) 320px, 460px" className="object-contain" />
          </div>
        </div>
      </Container>
    </header>
  );
}

/* ── 02 · SCOPE ───────────────────────────────────────────────────────── */
export function ScopePanel({
  meansHeading,
  means,
  notHeading,
  notLead,
  notLeadBody,
  notItems,
  footnote,
}: {
  meansHeading: string;
  means: string[];
  notHeading: string;
  notLead: string;
  notLeadBody: string;
  notItems: string[];
  footnote: string;
}) {
  return (
    <div className="border-line rounded-card border bg-[#0A0A0A] p-6 md:p-10">
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <h3 className="text-ink flex items-center gap-2.5 text-base font-semibold">
            <span className="text-accent-400">
              <Icon name="check-circle" />
            </span>
            {meansHeading}
          </h3>
          <ul className="mt-5 space-y-4">
            {means.map((m) => (
              <li key={m.slice(0, 24)} className="text-ink-3 flex gap-2.5 text-sm leading-relaxed">
                <span aria-hidden className="bg-accent-400 mt-2 size-1.5 shrink-0 rounded-full" />
                {m}
              </li>
            ))}
          </ul>
        </div>

        <div>
          {/* The single most important statement on the site: named, not buried. */}
          <div className="rounded-card border border-[#3A1A1A] bg-[#160D0D] p-5">
            <h3 className="flex items-center gap-2.5 text-base font-semibold text-[#FF8080]">
              <Icon name="x" className="size-[18px] shrink-0" />
              {notHeading}
            </h3>
            <p className="mt-4 text-sm font-semibold text-[#FF8080]">
              {notLead}
            </p>
            <p className="text-ink-4 mt-2 text-sm leading-relaxed">
              {notLeadBody}
            </p>
          </div>

          <ul className="mt-6 space-y-4">
            {notItems.map((n) => (
              <li key={n.slice(0, 24)} className="text-ink-4 flex gap-2.5 text-sm leading-relaxed">
                <span aria-hidden className="bg-ink-4 mt-2 size-1.5 shrink-0 rounded-full" />
                {n}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="border-line text-ink-4 mt-10 flex gap-3 border-t pt-6 text-xs leading-relaxed">
        <span className="text-accent-400 mt-0.5 shrink-0">
          <Icon name="award" className="size-4" />
        </span>
        {footnote}
      </p>
    </div>
  );
}

/* ── 03 · CERTIFICATE ─────────────────────────────────────────────────── */
// In CertificateBlock.tsx, a client component; re-exported for the pages.
export { CertificateBlock };

export function IecCertificate() {
  return (
    <CertificateBlock
      document={{
        title: "IEC Certificate — Margo Rubber Product",
        asset: {
          url: "/documents/margo-iec-certificate.pdf",
          originalFilename: "margo-iec-certificate.pdf",
          size: 57574,
          mimeType: "application/pdf",
        },
      }}
      card={{
        eyebrow: "Directorate General of Foreign Trade",
        title: "Importer-Exporter Code",
        certifyLine: "This is to certify that MARGO RUBBER PRODUCT is issued an Importer-Exporter Code (IEC) AAKFM8595Q.",
        company: "MARGO RUBBER PRODUCT",
        address: "SR.NO.4494/10, Vilholi, Nashik, Maharashtra 422010",
        fields: [
          { label: "IEC", value: "AAKFM8595Q" },
          { label: "Nature of concern", value: "Partnership" },
          { label: "Date of issue", value: "22/10/2026" },
        ],
        barTitle: "IEC Certificate",
        barNote: "Issued by the Office of the Joint DGFT, Pune",
      }}
      meta={[
        { label: "IEC Number", value: "AAKFM8595Q" },
        { label: "Issued By", value: "DGFT, Ministry of Commerce and Industry, Government of India" },
        { label: "Date of Issue", value: "22 October 2026" },
        { label: "Verify", value: "dgft.gov.in › Services › View Any IEC Details" },
      ]}
    />
  );
}

/* ── 04 · FACILITY GALLERY ────────────────────────────────────────────── */
/**
 * One photograph of the plant beside its capabilities. The row of thumbnails
 * under it, which switched the photo, was taken off (client, 2 Nov 2026):
 * the section shows the gallery's first photograph only. Its caption over
 * the photo went the same day.
 */
export function FacilityGallery({
  gallery,
  capabilities,
}: {
  gallery: { image: string; alt: string }[];
  capabilities: { name: string; body: string; href?: string }[];
}) {
  const photo = gallery[0];

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_minmax(0,380px)]">
      {photo && (
        <div className="rounded-card relative aspect-[4/3] overflow-hidden">
          <Img
            k={photo.image}
            fill
            sizes="(max-width:1024px) 100vw, 55vw"
            className="object-cover"
          />
        </div>
      )}

      <ul className="space-y-3">
        {capabilities.map((c) => (
          <li
            key={c.name}
            className="border-line rounded-card border bg-[#0A0A0A] p-5"
          >
            <p className="text-ink text-sm font-semibold">
              {c.href ? (
                <Link href={c.href} className="hover:text-accent-400 inline-flex items-center gap-1.5">
                  {c.name} <span aria-hidden className="text-accent-400">›</span>
                </Link>
              ) : (
                c.name
              )}
            </p>
            <p className="text-ink-4 mt-1.5 text-sm leading-relaxed">{c.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ── 05 · QUALITY SYSTEM ──────────────────────────────────────────────── */
const SYS_ICON: Record<string, React.ReactNode> = {
  inbox: (
    <>
      <path d="M3 13h5l1 3h6l1-3h5" />
      <path d="M4 13 6 5h12l2 8v6H4z" />
    </>
  ),
  gauge: (
    <>
      <path d="M4 18a8 8 0 1 1 16 0" />
      <path d="m12 14 4-4" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3l8 3v6c0 4.5-3.2 7.9-8 9-4.8-1.1-8-4.5-8-9V6z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  loop: (
    <>
      <path d="M4 12a8 8 0 0 1 13.7-5.7L20 8" />
      <path d="M20 12a8 8 0 0 1-13.7 5.7L4 16" />
      <path d="M20 4v4h-4M4 20v-4h4" />
    </>
  ),
};

export function QualitySystem({
  items,
  auditNote,
}: {
  items: { icon: string; name: string; body: string; href?: string }[];
  auditNote: { lead: string; body: string };
}) {
  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((q) => (
          <div
            key={q.name}
            className="border-line rounded-card flex flex-col border bg-[#0D0D0D] p-6"
          >
            <span className="bg-accent-400/10 grid size-10 place-items-center rounded-lg">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-accent-400 size-5"
                aria-hidden
              >
                {SYS_ICON[q.icon]}
              </svg>
            </span>
            <h3 className="text-ink mt-5 text-base font-semibold">
              {q.href ? (
                <Link href={q.href} className="hover:text-accent-400 inline-flex items-center gap-1.5">
                  {q.name} <span aria-hidden className="text-accent-400">›</span>
                </Link>
              ) : (
                q.name
              )}
            </h3>
            <p className="text-ink-4 mt-2 text-sm leading-relaxed">{q.body}</p>
            <span aria-hidden className="bg-accent-400 mt-5 h-px w-8" />
          </div>
        ))}
      </div>

      <div className="border-accent-400/30 rounded-card mt-6 border bg-[#020909] p-5">
        <p className="text-ink-3 text-sm leading-relaxed">
          <span className="text-accent-400 font-semibold">{auditNote.lead}</span>{" "}
          {auditNote.body}
        </p>
      </div>
    </>
  );
}

/* ── 06 · REQUEST DOCUMENTATION ───────────────────────────────────────── */
export function DocsPanel({
  heading,
  body,
  items,
  fields,
  submitLabel,
  footnote,
  confirmation,
}: {
  heading: string;
  body: string;
  items: string[];
  fields: { name: string; label: string; placeholder: string; type: string }[];
  submitLabel: string;
  footnote: string;
  confirmation?: string;
}) {
  const words = heading.split(" ");
  const second = words.slice(1).join(" ");

  return (
    <div className="border-line rounded-card grid overflow-hidden border bg-[#0A0A0A] lg:grid-cols-2">
      <div className="p-8 md:p-10">
        <span className="bg-accent-400/10 text-accent-400 grid size-11 place-items-center rounded-lg">
          ✉
        </span>
        <h2 className="text-h1 mt-6 max-w-[14ch]">
          {words[0]} <span className="block">{second}</span>
        </h2>
        <p className="text-ink-4 mt-4 max-w-[44ch] text-sm leading-relaxed">
          {body}
        </p>
        <ul className="mt-7 space-y-3">
          {items.map((i) => (
            <li key={i} className="text-ink-2 flex items-center gap-2.5 text-sm">
              <span className="text-accent-400 shrink-0">
                <Icon name="check-circle" className="size-4" />
              </span>
              {i}
            </li>
          ))}
        </ul>
      </div>

      <EnquiryForm
        source="certifications"
        redirectTo={confirmation ? null : "/thank-you"}
        className="border-line bg-[#050505] p-8 md:p-10 lg:border-l"
      >
        <EnquiryReceived text={confirmation}>
        <div className="space-y-5">
          {fields.map((f) => (
            <label key={f.name} className="block">
              <span className="text-eyebrow text-ink-4 font-mono uppercase">
                {f.label}
              </span>
              {f.type === "textarea" ? (
                <textarea
                  name={f.name}
                  rows={4}
                  placeholder={f.placeholder}
                  className="border-line text-ink placeholder:text-ink-4 focus:border-accent-400 mt-2 w-full rounded-lg border bg-[#0D0D0D] px-4 py-3 text-sm"
                />
              ) : (
                <input
                  name={f.name}
                  type={f.type}
                  autoComplete={autocompleteFor(f.name)}
                  required={f.name !== "need"}
                  placeholder={f.placeholder}
                  className="border-line text-ink placeholder:text-ink-4 focus:border-accent-400 mt-2 w-full rounded-lg border bg-[#0D0D0D] px-4 py-3 text-sm"
                />
              )}
            </label>
          ))}
        </div>

        <EnquirySubmit className="bg-accent-400 text-ink hover:opacity-90 mt-6 w-full rounded-cta px-6 py-3.5 text-sm font-semibold transition-colors">
          {submitLabel} <span aria-hidden>→</span>
        </EnquirySubmit>
        <EnquiryStatus />
        <p className="text-ink-4 mt-3 text-[11px] leading-relaxed">{footnote}</p>
        </EnquiryReceived>
      </EnquiryForm>
    </div>
  );
}
