"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { isFileHref } from "@/lib/downloads";
import { downloadUrl, sameOriginFileUrl } from "@/lib/sanity-file";
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

/**
 * Text transcription of the certificate. Every field is optional: with a PDF
 * uploaded the document carries the certificate, so this is supporting text
 * and editors may trim it.
 */
type Card = {
  eyebrow?: string;
  title?: string;
  certifyLine?: string;
  company?: string;
  address?: string;
  conformLine?: string;
  standard?: string;
  scopeLine?: string;
  fields?: { label: string; value: string }[];
  barTitle?: string;
  barNote?: string;
  downloadLabel?: string;
  /** LEGACY typed-in PDF address — used only when no PDF is uploaded. */
  downloadHref?: string;
};

/** The uploaded certificate PDF, as the page query resolves it. */
type CertificateDocument = {
  title?: string;
  orientation?: "portrait" | "landscape";
  asset?: {
    url: string;
    originalFilename?: string;
    size?: number;
    mimeType?: string;
    extension?: string;
  };
};

type ResolvedPdf = {
  /** Same-origin URL (next.config.ts rewrites it to Sanity's file CDN). */
  url: string;
  filename: string;
  size?: number;
  landscape: boolean;
  title?: string;
};

/** A usable PDF, or null: no upload, an unresolved asset, or not a PDF. */
function resolvePdf(doc?: CertificateDocument): ResolvedPdf | null {
  const a = doc?.asset;
  if (!a?.url) return null;
  const isPdf =
    a.mimeType === "application/pdf" ||
    a.extension?.toLowerCase() === "pdf" ||
    /\.pdf(?:$|\?)/i.test(a.url);
  if (!isPdf) return null;
  return {
    url: sameOriginFileUrl(a.url),
    filename: a.originalFilename || "certificate.pdf",
    size: a.size,
    landscape: doc?.orientation === "landscape",
    title: doc?.title,
  };
}

function formatBytes(n?: number): string | undefined {
  if (!n || n <= 0) return undefined;
  return n >= 1024 * 1024
    ? `${(n / (1024 * 1024)).toFixed(1)} MB`
    : `${Math.max(1, Math.round(n / 1024))} KB`;
}

/**
 * Can this browser show a PDF inline? Desktop browsers and iOS can; Android
 * Chrome cannot (it offers a download instead). `null` on the server and
 * during hydration, so the server HTML never depends on the browser.
 */
const noSubscribe = () => () => {};
function useInlinePdf(): boolean | null {
  return useSyncExternalStore(
    noSubscribe,
    () => {
      const nav = navigator as Navigator & { pdfViewerEnabled?: boolean };
      return nav.pdfViewerEnabled ?? !/Android/i.test(nav.userAgent);
    },
    () => null,
  );
}

export function CertificateBlock({
  document: pdfDocument,
  card,
  meta,
}: {
  /** The uploaded PDF. When usable it is the certificate shown. */
  document?: CertificateDocument;
  /** Transcription; shown as the card itself only when there is no PDF. */
  card?: Card;
  meta: { label: string; value: string }[];
}) {
  const pdf = resolvePdf(pdfDocument);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_minmax(0,320px)]">
      <div className="min-w-0">
        {pdf ? (
          <>
            <CertificatePdf pdf={pdf} card={card} />
            {card && <CertificateTranscription card={card} />}
          </>
        ) : card ? (
          <CertificateCard card={card} />
        ) : (
          <CertificateUnavailable />
        )}
      </div>

      <dl className="space-y-3">
        {meta.map((m) => (
          <div
            key={m.label}
            className="border-line rounded-card border bg-[#0A0A0A] px-5 py-4"
          >
            <dt className="text-eyebrow text-ink-4 font-mono uppercase">
              {m.label}
            </dt>
            <dd className="text-ink mt-1.5 text-sm">{m.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/** The uploaded PDF: inline preview, then open / download. */
function CertificatePdf({ pdf, card }: { pdf: ResolvedPdf; card?: Card }) {
  const inline = useInlinePdf();
  const label = pdf.title ?? card?.barTitle ?? "Certificate";
  const facts = ["PDF", formatBytes(pdf.size)].filter(Boolean).join(" · ");
  const ratio = pdf.landscape ? "aspect-[1.414/1]" : "aspect-[1/1.414]";

  return (
    <figure className="rounded-card border-line overflow-hidden border">
      {inline === false ? (
        // No inline viewer (Android): a clear way in rather than a blank box.
        <a
          href={pdf.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-3 bg-[#F1F3F5] px-6 py-12 text-center"
        >
          <PdfMark />
          <span className="text-base font-semibold text-[#101418]">{label}</span>
          <span className="text-xs text-[#5A6472]">Tap to view the certificate · {facts}</span>
        </a>
      ) : (
        <div className={`relative w-full ${ratio} max-h-[85vh] bg-[#F1F3F5]`}>
          {inline && (
            <iframe
              src={`${pdf.url}#view=Fit&navpanes=0`}
              title={label}
              loading="lazy"
              className="absolute inset-0 z-10 size-full"
            />
          )}
          {/* Visible until the viewer paints over it (and in the server HTML). */}
          <div
            aria-hidden={inline ? true : undefined}
            className={`absolute inset-0 grid place-items-center ${inline ? "pointer-events-none" : ""}`}
          >
            <div className="flex flex-col items-center gap-3 text-center">
              <PdfMark />
              <span className="text-xs text-[#5A6472]">Loading certificate…</span>
            </div>
          </div>
        </div>
      )}

      <figcaption className="flex flex-wrap items-center justify-between gap-4 bg-[#0D0D0D] px-6 py-4">
        <div className="min-w-0">
          <p className="text-ink text-sm font-medium">{card?.barTitle ?? label}</p>
          {card?.barNote && <p className="text-ink-4 mt-0.5 text-xs">{card.barNote}</p>}
          <p className="text-ink-4 mt-0.5 truncate text-xs">
            {facts} · {pdf.filename}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a
            href={pdf.url}
            target="_blank"
            rel="noopener noreferrer"
            className="border-line text-ink hover:border-line-2 rounded-cta border px-5 py-2.5 text-sm font-semibold transition-colors"
          >
            Open certificate <span aria-hidden>↗</span>
          </a>
          <a
            href={downloadUrl(pdf.url, pdf.filename)}
            download={pdf.filename}
            className="bg-accent-400 text-ink hover:opacity-90 rounded-cta px-5 py-2.5 text-sm font-semibold transition-colors"
          >
            ↓ {card?.downloadLabel ?? "Download PDF"}
          </a>
        </div>
      </figcaption>
    </figure>
  );
}

function PdfMark() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className="size-10 text-[#3A6C8C]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5" />
      <path d="M9 13h6M9 17h4" />
    </svg>
  );
}

/**
 * The certificate's wording as text, under the PDF. Collapsed, but in the
 * HTML: readable by search engines and screen readers, which a PDF in a
 * frame is not.
 */
function CertificateTranscription({ card }: { card: Card }) {
  const lines = [
    card.certifyLine,
    card.company,
    card.address,
    card.conformLine,
    card.standard,
    card.scopeLine,
  ].filter(Boolean);
  if (!lines.length && !card.fields?.length) return null;

  return (
    <details className="border-line rounded-card group mt-4 border bg-[#0A0A0A]">
      <summary className="text-ink-2 hover:text-ink flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm">
        <span>
          Certificate text <span className="text-ink-4">(transcription)</span>
        </span>
        <span aria-hidden className="text-[10px] transition-transform group-open:rotate-180">
          ▼
        </span>
      </summary>
      <div className="border-line border-t px-5 py-5">
        {(card.eyebrow || card.title) && (
          <p className="text-ink text-sm font-semibold">
            {[card.eyebrow, card.title].filter(Boolean).join(" — ")}
          </p>
        )}
        {lines.map((l) => (
          <p key={l} className="text-ink-3 mt-2 text-sm leading-relaxed">
            {l}
          </p>
        ))}
        {!!card.fields?.length && (
          <dl className="border-line mt-4 grid gap-4 border-t pt-4 sm:grid-cols-3">
            {card.fields.map((f) => (
              <div key={f.label}>
                <dt className="text-ink-4 text-[10px] tracking-wide">{f.label}</dt>
                <dd className="text-ink mt-1 text-sm font-semibold">{f.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </details>
  );
}

/** No PDF uploaded (or its asset is gone): the designed card, as before. */
function CertificateCard({ card }: { card: Card }) {
  return (
    <div className="rounded-card overflow-hidden">
      {/* Cream stock, sampled #FAF7F0. A DESIGNED REPRESENTATION, not a
          scan — used only until a certificate PDF is uploaded in Studio. */}
      <div className="bg-[#FAF7F0] p-7 md:p-9">
        <div className="flex items-start justify-between gap-6">
          <div>
            {card.eyebrow && (
              <p className="text-eyebrow font-mono uppercase text-[#3A6C8C]">
                {card.eyebrow}
              </p>
            )}
            {card.title && (
              <h3 className="mt-2 text-2xl font-bold text-[#101418]">{card.title}</h3>
            )}
          </div>
          <span className="grid size-14 shrink-0 place-items-center rounded-full border-2 border-dashed border-[#7FB4CC] text-[9px] font-semibold text-[#3A6C8C]">
            ISO
          </span>
        </div>

        {card.certifyLine && <p className="mt-7 text-xs text-[#5A6472]">{card.certifyLine}</p>}
        {card.company && <p className="mt-2 text-lg font-bold text-[#101418]">{card.company}</p>}
        {card.address && <p className="mt-1 text-xs text-[#5A6472]">{card.address}</p>}

        {card.conformLine && <p className="mt-5 text-xs text-[#5A6472]">{card.conformLine}</p>}
        {card.standard && (
          <p className="mt-1 text-xl font-bold text-[#2F7FA8]">{card.standard}</p>
        )}

        {card.scopeLine && (
          <p className="mt-4 max-w-[62ch] text-[11px] leading-relaxed text-[#5A6472]">
            {card.scopeLine}
          </p>
        )}

        {!!card.fields?.length && (
          <dl className="mt-7 grid gap-4 border-t border-dashed border-[#D6D2C8] pt-5 sm:grid-cols-3">
            {card.fields.map((f) => (
              <div key={f.label}>
                <dt className="text-[10px] tracking-wide text-[#8A8E96]">{f.label}</dt>
                <dd className="mt-1 text-sm font-semibold text-[#101418]">{f.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>

      {(card.barTitle || card.barNote || isFileHref(card.downloadHref)) && (
        <div className="flex flex-wrap items-center justify-between gap-4 bg-[#0D0D0D] px-6 py-4">
          <div>
            {card.barTitle && <p className="text-ink text-sm font-medium">{card.barTitle}</p>}
            {card.barNote && <p className="text-ink-4 mt-0.5 text-xs">{card.barNote}</p>}
          </div>
          {isFileHref(card.downloadHref) && (
            <a
              href={card.downloadHref}
              download
              className="bg-accent-400 text-ink hover:opacity-90 rounded-cta px-5 py-2.5 text-sm font-semibold transition-colors"
            >
              ↓ {card.downloadLabel ?? "Download PDF"}
            </a>
          )}
        </div>
      )}
    </div>
  );
}

/** Neither a PDF nor a transcription — say so plainly, never an empty box. */
function CertificateUnavailable() {
  return (
    <div className="border-line rounded-card border bg-[#0A0A0A] p-8">
      <p className="text-ink text-sm font-medium">The certificate is being updated.</p>
      <p className="text-ink-4 mt-2 text-sm">
        A copy is available on request —{" "}
        <Link href="/contact" className="text-accent-400 hover:underline">
          contact us
        </Link>
        .
      </p>
    </div>
  );
}

/**
 * The DGFT Importer-Exporter Code: the registration every Indian export
 * shipment is filed under. One copy, shown on /export and /certifications.
 */
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
                <Link href={c.href} className="hover:text-accent-400 inline-flex items-center gap-1.5 max-md:-my-3 max-md:py-3">
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
                <Link href={q.href} className="hover:text-accent-400 inline-flex items-center gap-1.5 max-md:-my-3 max-md:py-3">
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
