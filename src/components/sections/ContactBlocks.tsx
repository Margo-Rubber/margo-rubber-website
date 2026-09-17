"use client";

import { useMemo, useState, type ReactNode } from "react";
import { readPrefill, useSearch } from "@/lib/contact-prefill";
import { autocompleteFor } from "@/lib/autocomplete";
import { PRODUCTS } from "@/content/routes";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import type { Crumb } from "@/lib/breadcrumbs";
import { Img } from "@/components/ui/Img";
import { Container } from "@/components/ui/Section";
import { INDUSTRIES, PRODUCT_GROUPS } from "@/content/routes";
import {
  EnquiryForm,
  EnquiryStatus,
  EnquirySubmit,
  useEnquiry,
} from "@/components/forms/EnquiryForm";

/* ── HERO ─────────────────────────────────────────────────────────────── */
export function ContactHero({
  badge,
  lines,
  accentLines,
  intro,
  proof,
  image,
  breadcrumb,
}: {
  badge: string;
  lines: string[];
  accentLines: number[];
  intro: string;
  proof: string[];
  image?: string;
  breadcrumb?: readonly Crumb[];
}) {
  return (
    <header className="relative isolate overflow-hidden pt-32 pb-20 md:pt-48 md:pb-28">
      {image && (
        <>
          <Img
            k={image}
            fill
            priority
            sizes="100vw"
            className="-z-20 object-cover"
          />
          {/* Copy sits left over the darkest part of the frame. */}
          <div className="from-canvas via-canvas/70 absolute inset-0 -z-10 bg-gradient-to-r from-5% via-45% to-transparent to-90%" />
          <div className="from-canvas absolute inset-0 -z-10 bg-gradient-to-t from-0% to-transparent to-45%" />
        </>
      )}

      <Container>
        <Breadcrumb items={breadcrumb} className="mb-6" />
        <p className="text-eyebrow text-accent-400 font-mono uppercase">
          {badge}
        </p>

        <h1 className="text-display mt-6">
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

        <p className="text-ink-3 mt-6 max-w-[48ch] leading-relaxed">{intro}</p>

        {proof.length > 0 && (
          <ul className="mt-8 flex flex-wrap gap-3">
            {proof.map((p) => (
              <li
                key={p}
                className="text-eyebrow border-line-2 bg-canvas/50 text-ink-2 flex items-center gap-2 rounded-md border px-3 py-2 font-mono uppercase backdrop-blur"
              >
                <span aria-hidden className="bg-accent-400 size-1.5 rounded-full" />
                {p}
              </li>
            ))}
          </ul>
        )}
      </Container>
    </header>
  );
}

/* ── DIRECT CONTACT PANEL ─────────────────────────────────────────────── */
const CONTACT_ICON: Record<string, React.ReactNode> = {
  whatsapp: (
    <>
      <path d="M21 11.5a8.5 8.5 0 0 1-12.7 7.4L3 21l2.2-5.1A8.5 8.5 0 1 1 21 11.5z" />
      <path d="M8.5 9.5c0 3 2 5 5 5 .8 0 1.5-.6 1.5-1.2 0-.4-1.6-1.1-1.9-1-.3.1-.6.9-.9.8-.9-.3-2-1.4-2.3-2.3-.1-.3.7-.6.8-.9.1-.3-.6-1.9-1-1.9-.6 0-1.2.7-1.2 1.5z" />
    </>
  ),
  phone: (
    <path d="M4 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L14 13l5 2v4a1 1 0 0 1-1 1A15 15 0 0 1 3 5a1 1 0 0 1 1-1z" />
  ),
  email: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </>
  ),
};

function DirectContact({
  facility,
  directHeading,
  contacts,
  footnote,
}: {
  facility: { eyebrow: string; body: string };
  directHeading: string;
  contacts: { icon: string; label: string; value: string; note?: string }[];
  footnote: string;
}) {
  return (
    <div className="rounded-card overflow-hidden border border-[#1B2026] bg-[#0F1317]">
      <div className="border-accent-400 border-l-2 p-6">
        <p className="text-eyebrow text-accent-400 font-mono uppercase">
          {facility.eyebrow}
        </p>
        <p className="text-ink-3 mt-3 text-sm leading-relaxed">
          {facility.body}
        </p>
      </div>

      <div className="border-t border-[#1B2026] p-6">
        <p className="text-eyebrow text-ink-4 font-mono uppercase">
          {directHeading}
        </p>

        <ul className="divide-y divide-[#1B2026]">
          {contacts.map((c) => (
            <li key={c.label} className="flex gap-4 py-5 first:pt-5">
              <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-[#172A30]">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-accent-400 size-[18px]"
                  aria-hidden
                >
                  {CONTACT_ICON[c.icon]}
                </svg>
              </span>
              <div>
                <p className="text-ink text-sm font-semibold">{c.label}</p>
                {/* The visible string and the href share one source (sheet 04
                    §02): phone as tel:, WhatsApp as wa.me, email as mailto:. */}
                <p className="text-ink-2 mt-1 text-sm">
                  {(() => {
                    const digits = c.value.replace(/[^\d+]/g, "");
                    const href =
                      c.icon === "whatsapp" ? `https://wa.me/${digits.replace(/^\+/, "")}`
                      : c.icon === "phone" ? `tel:${digits}`
                      : c.icon === "email" ? `mailto:${c.value.trim()}`
                      : null;
                    return href ? <a href={href} className="hover:text-accent-400 transition-colors">{c.value}</a> : c.value;
                  })()}
                </p>
                {c.note && (
                  <p className="text-ink-4 mt-1 text-xs">{c.note}</p>
                )}
              </div>
            </li>
          ))}
        </ul>

        <p className="text-ink-4 mt-2 text-xs leading-relaxed">{footnote}</p>
      </div>
    </div>
  );
}

/* ── 2-STEP RFQ FORM ──────────────────────────────────────────────────── */
type Field = {
  name: string;
  label: string;
  placeholder: string;
  type: string;
  options?: string[];
  required?: boolean;
  full?: boolean;
};

const inputCls =
  "mt-2 w-full rounded-lg border border-[#1F242A] bg-[#16191E] px-4 py-3 text-sm text-ink placeholder:text-ink-4 focus:border-accent-400";

/**
 * The two dropdowns that name what Margo makes come from the route registry,
 * not from the document — the same fifteen categories in three groups and
 * eleven industries the footer, menus and sitemap use, so the RFQ form can
 * never offer nine of fifteen. A category with a sheet but no page yet is
 * still offered: a buyer who wants a diaphragm should be able to say so.
 * The document's own option list still drives every other select.
 */
const REGISTRY_OPTIONS: Record<string, { groups: { label: string | null; options: string[] }[]; other: string }> = {
  productCategory: {
    groups: PRODUCT_GROUPS.map((g) => ({ label: g.label, options: g.items.map((i) => i.label) })),
    other: "Not sure / other",
  },
  industry: {
    groups: [{ label: null, options: INDUSTRIES.map((i) => i.label) }],
    other: "Other",
  },
};

function FieldControl({
  f,
  value,
  onChange,
}: {
  f: Field;
  value: string;
  onChange: (v: string) => void;
}) {
  if (f.type === "textarea") {
    return (
      <textarea
        id={`contact-${f.name}`}
        name={f.name}
        rows={5}
        required={f.required}
        placeholder={f.placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={inputCls}
      />
    );
  }
  if (f.type === "select") {
    return (
      <select
        id={`contact-${f.name}`}
        name={f.name}
        required={f.required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${inputCls} ${value ? "text-ink" : "text-ink-4"}`}
      >
        <option value="" disabled>
          {f.placeholder}
        </option>
        {REGISTRY_OPTIONS[f.name] ? (
          <>
            {REGISTRY_OPTIONS[f.name].groups.map((g) =>
              g.label ? (
                <optgroup key={g.label} label={g.label}>
                  {g.options.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </optgroup>
              ) : (
                g.options.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))
              ),
            )}
            <option value={REGISTRY_OPTIONS[f.name].other}>{REGISTRY_OPTIONS[f.name].other}</option>
          </>
        ) : (
          f.options?.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))
        )}
      </select>
    );
  }
  return (
    <input
      id={`contact-${f.name}`}
      name={f.name}
      type={f.type}
      required={f.required}
      placeholder={f.placeholder}
      autoComplete={autocompleteFor(f.name)}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={inputCls}
    />
  );
}

/**
 * The post-submit state — "Enquiry received. A named engineer replies within
 * 48 hours to {email}." (sheets 11–28 §Enquiries), with the address the
 * buyer gave. A page that asked for something specific says what is coming
 * back: the variant keyed by the product category chosen.
 */
function Received({
  text,
  variants,
  children,
}: {
  text?: string;
  variants: readonly { product: string; text: string }[];
  children: ReactNode;
}) {
  const { status, submitted } = useEnquiry();
  if (!text || status !== "success") return <>{children}</>;
  const chosen = PRODUCTS.find((p) => p.label === submitted.productCategory);
  const line = variants.find((v) => v.product === chosen?.slug)?.text ?? text;
  const [before, after] = line.split("{email}");
  return (
    <div role="status" className="border-accent-400/40 rounded-card border bg-[#0B1416] p-6 md:p-8">
      <p className="text-ink text-base leading-relaxed">
        {before}
        {after !== undefined && <strong className="text-accent-400 font-semibold">{submitted.email}</strong>}
        {after}
      </p>
    </div>
  );
}

export function RfqForm({
  steps,
  step1,
  step2,
  continueLabel,
  backLabel,
  submitLabel,
  responsePromise,
  attachLabel,
  attachHint,
  confirmation,
  confirmations = [],
}: {
  steps: string[];
  step1: Field[];
  step2: Field[];
  continueLabel: string;
  backLabel: string;
  submitLabel: string;
  responsePromise: string;
  attachLabel?: string;
  attachHint?: string;
  /** The post-submit line, with `{email}` where the address goes. */
  confirmation?: string;
  /** The line for a page that asked for something specific, by product-category slug. */
  confirmations?: readonly { product: string; text: string }[];
}) {
  const [step, setStep] = useState(0);
  // What the buyer has typed. A field the buyer has not touched shows what
  // the link that brought them here already said — the part, the industry,
  // the request — read from the address (the visitor's, not the server's)
  // and put where the buyer would have typed it. The raw parameters travel
  // with the enquiry as hidden fields.
  const [values, setValues] = useState<Record<string, string>>({});
  const search = useSearch();
  const arrived = useMemo(() => readPrefill(search), [search]);
  const defaults: Record<string, string> = {
    ...(arrived.product ? { productCategory: arrived.product } : {}),
    ...(arrived.industry ? { industry: arrived.industry } : {}),
    ...(arrived.lines.length ? { details: `${arrived.lines.join("\n")}\n\n` } : {}),
  };
  const context = arrived.context;
  const valueOf = (name: string) => values[name] ?? defaults[name] ?? "";
  const setValue = (name: string) => (v: string) => setValues((cur) => ({ ...cur, [name]: v }));

  // BOTH steps stay mounted, the inactive one hidden. Unmounting step one when
  // step two appears would remove its inputs from the DOM, and FormData reads
  // the DOM — so name, company, email and phone would silently never be
  // submitted. `hidden` inputs still post their values.
  const fieldSets = [step1, step2];

  return (
    <div className="rounded-card border border-[#1B2026] bg-[#15191D] p-6 md:p-8">
      {/* Stepper */}
      <ol className="mb-8 flex items-center gap-4">
        {steps.map((label, i) => (
          <li key={label} aria-current={i === step ? "step" : undefined} className="flex flex-1 items-center gap-4 last:flex-none">
            <span className="flex items-center gap-3">
              <span
                className={`grid size-7 place-items-center rounded-full text-xs font-semibold ${
                  i <= step
                    ? "border-accent-400 text-accent-400 border"
                    : "border-line text-ink-4 border"
                }`}
              >
                {i + 1}
              </span>
              <span
                className={`text-eyebrow font-mono uppercase ${i <= step ? "text-ink" : "text-ink-4"}`}
              >
                {label}
              </span>
            </span>
            {i === 0 && (
              <span
                aria-hidden
                className={`h-px flex-1 ${step > 0 ? "bg-accent-400" : "bg-line"}`}
              />
            )}
          </li>
        ))}
      </ol>

      <EnquiryForm
        source="contact"
        redirectTo={confirmation ? null : "/thank-you"}
        onBeforeSubmit={() => {
          // Step one advances rather than submitting. Only step two posts.
          if (step === 0) {
            setStep(1);
            return false;
          }
          return true;
        }}
      >
        <Received text={confirmation} variants={confirmations}>

        {fieldSets.map((set, i) => (
          <div
            key={i}
            hidden={step !== i}
            className="grid gap-5 sm:grid-cols-2"
          >
            {set.map((f) => (
              <label
                key={f.name}
                htmlFor={`contact-${f.name}`}
                className={f.full ? "sm:col-span-2" : undefined}
              >
                <span className="text-eyebrow text-ink-4 font-mono uppercase">
                  {f.label}
                </span>
                <FieldControl f={f} value={valueOf(f.name)} onChange={setValue(f.name)} />
              </label>
            ))}
            {/* The attachment field (sheet 04 §02). Same inert affordance as
                the homepage form until the upload backend exists. */}
            {i === 0 && attachLabel && (
              <div className="sm:col-span-2">
                <span className="text-eyebrow text-ink-4 font-mono uppercase">{attachLabel}</span>
                <p className="border-line-2 text-ink-4 mt-2 rounded-lg border border-dashed bg-[#16191E] px-4 py-3.5 text-sm">
                  {attachHint}
                </p>
              </div>
            )}
          </div>
        ))}

        {/* The parameters the buyer arrived with, as they arrived — under
            their own names so they never shadow the field they pre-filled. */}
        {Object.entries(context).map(([k, v]) => (
          <input key={k} type="hidden" name={`via_${k}`} value={v} />
        ))}

        <div className="mt-7 flex flex-wrap items-center gap-3">
          {/* Both step labels are in the DOM; the step decides which shows. */}
          <button
            type="button"
            hidden={step !== 1}
            onClick={() => setStep(0)}
            className="border-line text-ink-2 hover:text-ink rounded-pill border px-5 py-3 text-sm font-medium transition-colors"
          >
            ← {backLabel}
          </button>
          <EnquirySubmit className="bg-accent-400 text-ink hover:opacity-90 flex-1 rounded-cta px-6 py-3.5 text-sm font-semibold transition-colors sm:flex-none sm:px-10">
            <span hidden={step !== 0}>{continueLabel}</span>
            <span hidden={step !== 1}>{submitLabel}</span> <span aria-hidden>→</span>
          </EnquirySubmit>
        </div>

        <EnquiryStatus />

        {/* No competitor in the teardown states any response time. */}
        <p className="text-ink-4 mt-4 text-xs">{responsePromise}</p>
        </Received>
      </EnquiryForm>
    </div>
  );
}

/* ── SECTION WRAPPER ──────────────────────────────────────────────────── */
export function QuoteSection({
  eyebrow,
  heading,
  note,
  facility,
  directHeading,
  contacts,
  footnote,
  steps,
  step1,
  step2,
  continueLabel,
  backLabel,
  submitLabel,
  responsePromise,
  attachLabel,
  attachHint,
  confirmation,
  confirmations,
}: {
  eyebrow: string;
  heading: string;
  note: string;
  facility: { eyebrow: string; body: string };
  directHeading: string;
  contacts: { icon: string; label: string; value: string; note?: string }[];
  footnote: string;
  steps: string[];
  step1: Field[];
  step2: Field[];
  continueLabel: string;
  backLabel: string;
  submitLabel: string;
  responsePromise: string;
  attachLabel?: string;
  attachHint?: string;
  confirmation?: string;
  confirmations?: readonly { product: string; text: string }[];
}) {
  return (
    <section className="py-[70px]">
      <Container>
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-eyebrow text-accent-400 font-mono uppercase">
              {eyebrow}
            </p>
            <h2 className="text-h1 mt-3">{heading}</h2>
          </div>
          <p className="text-ink-4 max-w-[38ch] text-right text-sm leading-relaxed">
            {note}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,340px)_1fr]">
          <DirectContact
            facility={facility}
            directHeading={directHeading}
            contacts={contacts}
            footnote={footnote}
          />
          <RfqForm
            steps={steps}
            step1={step1}
            step2={step2}
            continueLabel={continueLabel}
            backLabel={backLabel}
            submitLabel={submitLabel}
            responsePromise={responsePromise}
            attachLabel={attachLabel}
            attachHint={attachHint}
            confirmation={confirmation}
            confirmations={confirmations}
          />
        </div>
      </Container>
    </section>
  );
}
