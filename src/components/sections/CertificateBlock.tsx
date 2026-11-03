"use client";

/**
 * The certificate viewer (3rd Shade fix 8, 3 Nov 2026): the only part of the
 * certifications blocks that needs the browser — it checks whether the PDF
 * can be shown inline. Split out of CertBlocks.tsx so the rest of that file
 * renders on the server and ships no JavaScript.
 */
import Link from "next/link";
import { useSyncExternalStore } from "react";
import { isFileHref } from "@/lib/downloads";
import { downloadUrl, sameOriginFileUrl } from "@/lib/sanity-file";

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
