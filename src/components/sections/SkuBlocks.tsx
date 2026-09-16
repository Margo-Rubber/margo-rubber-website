import Link from "next/link";
import type { Crumb } from "@/lib/breadcrumbs";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { isFileHref } from "@/lib/downloads";
import { Img } from "@/components/ui/Img";
import { Container } from "@/components/ui/Section";
import type { Compound as CompoundRow, SiteSettings } from "@/content/schemas";
import {
  SkuCompoundPicker,
  type Compound,
} from "@/components/sections/SkuCompoundPicker";

/**
 * SKU DETAIL TEMPLATE — built to `single category.png`, section for section.
 *
 * This is a REFERENCE build. Margo has no per-part photography, datasheets,
 * drawings or measured specs yet, so every plate, table and download here is a
 * styled placeholder that shows the finished layout. Each one is driven by a
 * content field: as real data arrives it replaces the placeholder and nothing
 * in this file changes.
 *
 * Values marked SAMPLE below are the designer's, kept so the page reads as a
 * complete design reference. They are illustrative, not Margo's data, and every
 * one is flagged in the SKU content files for sign-off.
 *
 * ONE hard line: the design's "4.8 / 5 from 143 verified orders" is rendered as
 * UI here but must NEVER be emitted as aggregateRating structured data.
 * Fabricated review markup is banned by name in FORBIDDEN_CLAIMS and is a
 * Google manual-action risk. The route emits no Product/aggregateRating JSON-LD.
 */

/* ── SAMPLE reference data ──────────────────────────────────────────────
   Used only where a SKU file has no real values. Defined once here rather
   than copied into 31 content files, so deleting the block removes every
   placeholder at a stroke. */
const SAMPLE = {
  /* The three plates supplied with the design. Shared across every SKU until
     Margo shoots the real parts; a SKU file with its own `gallery` overrides. */
  gallery: {
    main: "sku.product",
    thumbs: ["sku.product", "sku.finishing", "sku.machining", "sku.product"],
  },
  advantageImages: { main: "sku.finishing", inset: "sku.machining" },
  qualityBadge: { value: "99.7%", label: "QUALITY RATE", note: "first-pass yield avg." },
  faqImage: "sku.finishing",
  overlay: [
    { label: "SHORE A", value: "70", note: "±5 pts tolerance" },
    { label: "TENSILE", value: "18", note: "MPa" },
  ],
  quickSpecs: [
    { label: "HARDNESS", value: "70 Shore A" },
    { label: "TEMPERATURE", value: "-40 to +120°C" },
    { label: "THICKNESS", value: "1mm - 50mm" },
    { label: "WIDTH", value: "Up to 2,000mm" },
  ],
  order: { unit: "kg", defaultQty: "1,000", minNote: "Min: 500 kg" },
  assurances: ["ISO 9001:2015", "100% QC Tested", "Made to drawing"],
  specs: [
    { label: "Material", value: "Compound dependent, see options below" },
    { label: "Hardness (Shore A)", value: "On request" },
    { label: "Tensile Strength", value: "On request" },
    { label: "Elongation at Break", value: "On request" },
    { label: "Operating Temperature", value: "Compound dependent" },
    { label: "Compression Set", value: "On request" },
    { label: "Density", value: "On request" },
    { label: "Colour Options", value: "Black standard, custom RAL on request" },
    { label: "Lead Time", value: "On request" },
  ],
  dimensional: {
    caption: "DIMENSIONAL REFERENCE",
    widthNote: "W: to drawing",
    thicknessNote: "T: to drawing",
    tiles: [
      { value: "To drawing", label: "Max width" },
      { value: "To drawing", label: "Thickness" },
      { value: "On request", label: "Run length" },
    ],
  },
  advantages: [
    { icon: "shield", name: "Superior Durability", body: "Engineered for long service life under continuous mechanical stress and UV exposure." },
    { icon: "bolt", name: "Precision Tolerance", body: "Dimensional accuracy held under ISO-controlled compression moulding." },
    { icon: "globe", name: "Global Compliance", body: "Manufactured against the international standard applicable to your market." },
    { icon: "layers", name: "Custom Formulation", body: "In-house compounding delivers bespoke rubber blends for unique operating conditions." },
  ],
  applications: [
    { icon: "gear", name: "Automotive", body: "Seals, mounts, vibration dampers" },
    { icon: "factory", name: "Heavy Industry", body: "Conveyor liners, impact buffers" },
    { icon: "plane", name: "Aerospace", body: "Precision gaskets, O-rings" },
    { icon: "bolt", name: "Energy & Oil", body: "Pipeline seals, valve packing" },
    { icon: "ship", name: "Marine", body: "Hatch covers, fender systems" },
    { icon: "crane", name: "Construction", body: "Expansion joints, bearings" },
  ],
  process: [
    { name: "Material Compounding", body: "Raw polymer blending, additive integration, and batch QC testing in our ISO-certified lab." },
    { name: "Mould Design & CNC", body: "Precision steel tooling manufactured in-house and held as a controlled record." },
    { name: "Compression Moulding", body: "Hydraulic press cycles at controlled temperature and pressure profiles per product spec." },
    { name: "Post-Cure & Trimming", body: "Oven post-cure for dimensional stability, followed by flash trimming." },
    { name: "Quality Inspection", body: "Dimensional check, hardness testing, and batch sampling before release." },
    { name: "Export Packaging", body: "Industrial packing with documentation for international shipping compliance." },
  ],
  quality: {
    heading: "Certified to International Standards",
    body: "Every product leaves our facility with a documentation package: material test reports, dimensional inspection sheets, and a certificate of conformance, giving traceability from raw material to finished part.",
    certificates: [
      { name: "ISO 9001:2015", issuer: "Accredited certification body", validity: "Current" },
    ],
    metrics: [
      { value: "On request", label: "Years in operation" },
      { value: "On request", label: "Active clients" },
      { value: "On request", label: "First-pass yield" },
      { value: "On request", label: "Avg. lead time" },
    ],
    tour: { title: "Facility walkthrough", note: "Film pending" },
  },
  faqs: [
    { q: "What is the minimum order quantity for this part?", a: "Standard minimum order is 500 pieces per SKU. Prototype and qualification quantities are accepted for sample development, and the exact figure for your part is confirmed at quotation." },
    { q: "Can you match a competitor specification or reverse-engineer an existing part?", a: "Yes. Send a sample or a drawing and our team will identify the compound, hardness and geometry, then quote against a matched specification. Tooling cost, if any, is quoted upfront." },
    { q: "What file formats do you accept for drawings?", a: "DXF, DWG, PDF and STEP. A dimensioned PDF is sufficient to quote; a CAD file speeds up tooling design where a new mould is required." },
    { q: "Do you provide material test reports with each shipment?", a: "Yes. Every shipment carries batch-level traceability to the raw material lot, along with a material test report and a certificate of conformance prepared for procurement and audit requirements." },
    { q: "What are your payment and delivery terms for international orders?", a: "FOB Mumbai is standard, with CIF, EXW and DAP available on request. Payment is T/T in advance for new accounts, with open terms or L/C available for established buyers." },
  ],
} as const;

/* ── icons ──────────────────────────────────────────────────────────────── */
const ICONS: Record<string, React.ReactNode> = {
  shield: <path d="M12 3.2 19 6v5.6c0 4-2.9 7.4-7 9.2-4.1-1.8-7-5.2-7-9.2V6z" />,
  bolt: <path d="M13.5 3 5.5 13.5H11l-.5 7.5 8-10.5H13z" />,
  globe: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17M12 3.5c2.4 2.4 3.6 5.4 3.6 8.5S14.4 18.1 12 20.5c-2.4-2.4-3.6-5.4-3.6-8.5S9.6 5.9 12 3.5z" />
    </>
  ),
  layers: (
    <>
      <path d="m12 3.5 8.5 4.3-8.5 4.3-8.5-4.3z" />
      <path d="m3.5 12.2 8.5 4.3 8.5-4.3M3.5 16.4l8.5 4.3 8.5-4.3" />
    </>
  ),
  gear: (
    <>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 2.8v2.4M12 18.8v2.4M21.2 12h-2.4M5.2 12H2.8M18.5 5.5l-1.7 1.7M7.2 16.8l-1.7 1.7M18.5 18.5l-1.7-1.7M7.2 7.2 5.5 5.5" />
    </>
  ),
  factory: (
    <>
      <path d="M4 20V9.5l5.5 3.2V9.5L15 12.7V5h5v15z" />
      <path d="M4 20h16" />
    </>
  ),
  plane: <path d="M10.5 20.5 12 15l7.5-1.5 1.5-3-7.5 1L10 5.5 8 5l1 6-4.5 1L3 10l-.5 2.5 4.5 1.5-1 5z" />,
  ship: (
    <>
      <path d="M3.5 15.5 5 10.5h14l1.5 5M12 5v5.5M7 10.5v-3h10v3" />
      <path d="M2.5 15.5c1.6 0 1.6 1.6 3.2 1.6s1.6-1.6 3.2-1.6 1.6 1.6 3.1 1.6 1.6-1.6 3.2-1.6 1.6 1.6 3.2 1.6 1.6-1.6 3.2-1.6" />
    </>
  ),
  crane: (
    <>
      <path d="M4 20V4h11l5 4M4 8h11M9 8v12M4 4l16 4" />
      <path d="M15 8v4h3" />
    </>
  ),
  doc: (
    <>
      <path d="M13.5 3.5H7a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9z" />
      <path d="M13.5 3.5V9H19M8.5 13h7M8.5 16.5h4.5" />
    </>
  ),
  image: (
    <>
      <rect x="3.5" y="4.5" width="17" height="15" rx="2" />
      <circle cx="9" cy="10" r="1.6" />
      <path d="m4.5 17 5-4.5 4 3.5 3-2.5 3.5 3" />
    </>
  ),
  ribbon: (
    <>
      <circle cx="12" cy="9" r="5.2" />
      <path d="m8.9 13.6-1.6 6.4 4.7-2.2 4.7 2.2-1.6-6.4" />
    </>
  ),
  play: <path d="M8 5.5v13l11-6.5z" />,
  download: <path d="M12 3.5v11m0 0 4-4m-4 4-4-4M4.5 19.5h15" />,
  cube: (
    <>
      <path d="m12 3.2 8 4.4v8.8l-8 4.4-8-4.4V7.6z" />
      <path d="m4 7.6 8 4.4 8-4.4M12 12v8.8" />
    </>
  ),
};

function Icon({ name, className = "size-5" }: { name: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={name === "play" ? "currentColor" : "none"}
      stroke={name === "play" ? "none" : "currentColor"}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {ICONS[name] ?? ICONS.cube}
    </svg>
  );
}

function Arrow({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M4 12h15M13.5 6.5 20 12l-6.5 5.5" />
    </svg>
  );
}

function Tick({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M20.5 11.2V12a8.5 8.5 0 1 1-5-7.8" />
      <path d="m8.6 11.6 2.9 2.9 8-8" />
    </svg>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-eyebrow text-accent-400 flex items-center gap-4 font-mono uppercase">
      <span aria-hidden className="bg-accent-400/70 inline-block h-px w-8" />
      {children}
    </p>
  );
}

/**
 * Image plate. Renders the photo when one is registered, otherwise a styled
 * placeholder carrying the same footprint — so the layout is reviewable before
 * photography exists and does not shift when it arrives.
 */
function Plate({
  k,
  ratio = "aspect-[4/3]",
  label = "Product photography pending",
  className = "",
  sizes,
}: {
  k?: string;
  ratio?: string;
  label?: string;
  className?: string;
  sizes?: string;
}) {
  return (
    <div
      className={`rounded-card border-line relative isolate overflow-hidden border ${ratio} ${className}`}
    >
      {k ? (
        <Img k={k} fill sizes={sizes ?? "(min-width:1024px) 50vw, 100vw"} className="object-cover" />
      ) : (
        <div className="absolute inset-0 grid place-items-center bg-[linear-gradient(135deg,#0d0f12_0%,#131720_50%,#0d0f12_100%)]">
          <div className="text-center">
            <Icon name="image" className="text-ink-4/50 mx-auto size-7" />
            <p className="text-eyebrow text-ink-4/60 mt-2 px-4 font-mono uppercase">
              {label}
            </p>
          </div>
        </div>
      )}
      {/* Corner brackets, as the comp draws them. */}
      <span aria-hidden className="border-accent-400/40 absolute top-3 left-3 size-5 border-t border-l" />
      <span aria-hidden className="border-accent-400/40 absolute right-3 bottom-3 size-5 border-r border-b" />
    </div>
  );
}

/* ══ 01 · HERO ════════════════════════════════════════════════════════════ */
export function SkuHero({
  categoryLabel,
  eyebrow,
  h1,
  intro,
  gallery,
  quickSpecs,
  order,
  assurances,
  breadcrumb,
}: {
  categoryLabel: string;
  eyebrow?: string;
  h1: string;
  intro: string;
  gallery: { main?: string; thumbs: readonly string[]; overlay: readonly { label: string; value: string; note?: string }[] };
  quickSpecs: readonly { label: string; value: string }[];
  order?: { unit: string; defaultQty: string; minNote: string };
  assurances: readonly string[];
  breadcrumb?: readonly Crumb[];
}) {
  const overlay = gallery.overlay.length ? gallery.overlay : SAMPLE.overlay;
  const specs = quickSpecs.length ? quickSpecs : SAMPLE.quickSpecs;
  const ord = order ?? SAMPLE.order;
  const trust = assurances.length ? assurances : SAMPLE.assurances;
  const main = gallery.main ?? SAMPLE.gallery.main;
  const thumbs = gallery.thumbs.length ? gallery.thumbs : SAMPLE.gallery.thumbs;

  return (
    <header className="bg-canvas relative isolate overflow-hidden pt-32 pb-16 md:pt-40">
      <span aria-hidden className="bg-accent-400/10 pointer-events-none absolute -top-24 -left-32 -z-10 size-[30rem] rounded-full blur-3xl" />
      <Container>
        <Breadcrumb items={breadcrumb} className="mb-10" />

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Gallery */}
          <div>
            <div className="relative">
              <Plate k={main} ratio="aspect-[4/3]" sizes="(min-width:1024px) 46vw, 100vw" />
              {/* The IN STOCK badge is gone: nothing is stocked, every part is
                  made to order (sheet 32). The field stays for old records. */}
              {/* Floating spec card over the lower-right of the plate. */}
              {/* Overlay card. Sized down on small screens: at desktop scale it
                  covered most of the plate on a 375px viewport. */}
              <dl className="rounded-card border-line absolute right-3 bottom-3 max-w-[58%] border bg-[#0D0F12]/95 px-3.5 py-3 backdrop-blur sm:right-4 sm:bottom-4 sm:max-w-none sm:px-5 sm:py-4">
                {overlay.map((o) => (
                  <div key={o.label} className="not-first:mt-2.5 not-first:border-line not-first:border-t not-first:pt-2.5 sm:not-first:mt-4 sm:not-first:pt-4">
                    <dt className="text-eyebrow text-ink-4 font-mono uppercase">{o.label}</dt>
                    <dd className="text-ink mt-0.5 text-lg leading-none font-semibold sm:mt-1 sm:text-2xl">
                      {o.value}
                      {o.note && <span className="text-ink-4 ml-1.5 text-xs font-normal">{o.note}</span>}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <ul className="mt-4 grid grid-cols-5 gap-3">
              {thumbs.slice(0, 4).map((t, i) => (
                <li key={i}>
                  <Plate k={t} ratio="aspect-square" label="" sizes="120px" />
                </li>
              ))}
              <li>
                <div className="rounded-card border-line grid aspect-square place-items-center border bg-[#0D0F12]">
                  <div className="text-center">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="text-accent-400 mx-auto size-4" aria-hidden>
                      <path d="M4 12a8 8 0 1 1 2.3 5.6" /><path d="M4 18v-4.5h4.5" />
                    </svg>
                    <span className="text-eyebrow text-ink-4 mt-1 block font-mono">360°</span>
                  </div>
                </div>
              </li>
            </ul>
          </div>

          {/* Detail */}
          <div>
            <Eyebrow>
              {eyebrow ?? (
                // Wrapped in one span, not left as two flex children: Eyebrow
                // is `flex gap-4`, so a bare sibling would gain a 16px gap and
                // shift the desktop spacing. Nested inline keeps text flow.
                <span>
                  {categoryLabel}
                  {/* Mono uppercase at wide tracking is ~1.6× the width of the
                      body sans, so "· Made to order" pushes a long category
                      onto a second line below ~400px. The category alone is
                      what orients the reader here; the qualifier is repeated
                      verbatim on every card in the parts grid. */}
                  <span className="hidden sm:inline"> · Made to order</span>
                </span>
              )}
            </Eyebrow>

            <h1 className="text-display-3 mt-5">{h1}</h1>

            <p className="text-ink-3 mt-6 max-w-[52ch] leading-relaxed">{intro}</p>

            <dl className="mt-8 grid grid-cols-2 gap-4">
              {specs.map((s) => (
                <div key={s.label} className="rounded-card border-line border bg-[#0D0F12] px-5 py-4">
                  <dt className="text-eyebrow text-ink-4 font-mono uppercase">{s.label}</dt>
                  <dd className="text-ink mt-1.5 text-sm font-semibold">{s.value}</dd>
                </div>
              ))}
            </dl>

            {/* Quantity stepper. Presentational: there is no cart, the value is
                carried into the quote request. */}
            <div className="mt-7 flex flex-wrap items-center gap-4">
              <span className="text-ink-4 text-sm">QTY ({ord.unit})</span>
              <div className="border-line flex items-center rounded-lg border bg-[#0D0F12]">
                <span className="text-ink-4 px-4 py-2.5 text-lg leading-none">−</span>
                <span className="text-ink border-line border-x px-6 py-2.5 text-sm font-semibold">{ord.defaultQty}</span>
                <span className="text-ink-4 px-4 py-2.5 text-lg leading-none">+</span>
              </div>
              <span className="text-ink-4 text-sm">{ord.minNote}</span>
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href={`/contact?part=${encodeURIComponent(h1)}`}
                className="bg-accent-400 text-ink hover:opacity-90 shadow-glow rounded-cta inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold transition-colors"
              >
                Request Quote
                <Arrow />
              </Link>
              <Link
                href="/contact"
                className="border-line-2 text-ink hover:border-accent-400/60 rounded-pill inline-flex items-center gap-2.5 border px-6 py-3.5 text-sm font-semibold transition-colors"
              >
                <Icon name="download" className="size-4" />
                Download Datasheet
              </Link>
            </div>

            <ul className="text-ink-4 mt-7 flex flex-wrap items-center gap-x-7 gap-y-3 text-sm">
              {trust.map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <Tick className="text-accent-400 size-4" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </header>
  );
}

/* ══ 02 · VISUAL REFERENCE ════════════════════════════════════════════════ */
export function SkuGallery({
  gallery,
  dimensional,
}: {
  gallery: { main?: string; thumbs: readonly string[] };
  dimensional?: {
    caption: string;
    widthNote: string;
    thicknessNote: string;
    tiles: readonly { value: string; label: string }[];
    footnote?: string;
  };
}) {
  const dim = dimensional ?? SAMPLE.dimensional;
  const main = gallery.main ?? SAMPLE.gallery.main;
  const thumbs = gallery.thumbs.length ? gallery.thumbs : SAMPLE.gallery.thumbs;

  return (
    <section className="bg-band border-line border-t py-[70px]">
      <Container>
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <Eyebrow>Product gallery</Eyebrow>
            <h2 className="text-h2 mt-3">Visual Reference</h2>
          </div>
          <span className="text-eyebrow border-line-2 text-ink-3 inline-flex items-center gap-2 rounded-md border px-3.5 py-2 font-mono">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="size-3.5" aria-hidden>
              <path d="M4 12a8 8 0 1 1 2.3 5.6" /><path d="M4 18v-4.5h4.5" />
            </svg>
            360° PREVIEW
          </span>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
          <Plate k={main} ratio="aspect-[16/10]" sizes="(min-width:1024px) 58vw, 100vw" />

          <div className="grid gap-5">
            <ul className="grid grid-cols-2 gap-4">
              {thumbs.slice(0, 4).map((t, i) => (
                <li key={i}>
                  <Plate k={t} ratio="aspect-[4/3]" label="" sizes="200px" />
                </li>
              ))}
            </ul>

            {/* Cross-section panel. */}
            <div className="rounded-card border-line border bg-[#0D0F12] p-6">
              <p className="text-eyebrow text-ink-4 font-mono uppercase">Cross section view</p>
              <svg viewBox="0 0 260 120" className="mt-5 h-auto w-full" role="img" aria-label="Cross section reference diagram">
                <text x="130" y="12" textAnchor="middle" fill="var(--color-ink-4)" fontSize="8" fontFamily="var(--font-mono)">{dim.widthNote}</text>
                <line x1="20" y1="22" x2="240" y2="22" stroke="var(--color-accent-400)" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6" />
                <rect x="20" y="34" width="220" height="52" rx="3" fill="none" stroke="var(--color-accent-400)" strokeWidth="1.2" />
                <g stroke="var(--color-accent-400)" strokeWidth="0.6" opacity="0.35">
                  {[60, 100, 140, 180].map((x) => (<line key={x} x1={x} y1="34" x2={x - 18} y2="86" />))}
                </g>
                <circle cx="130" cy="60" r="7" fill="none" stroke="var(--color-accent-400)" strokeWidth="0.8" />
                <path d="M130 51v18M121 60h18" stroke="var(--color-accent-400)" strokeWidth="0.8" />
                <line x1="250" y1="34" x2="250" y2="86" stroke="var(--color-accent-400)" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6" />
                <text x="130" y="104" textAnchor="middle" fill="var(--color-ink-4)" fontSize="8" fontFamily="var(--font-mono)">{dim.thicknessNote}</text>
              </svg>
              <dl className="mt-5 grid grid-cols-3 gap-3">
                {dim.tiles.map((t) => (
                  <div key={t.label} className="rounded border border-[#1B2026] bg-[#111418] px-3 py-3 text-center">
                    <dd className="text-ink text-sm font-semibold">{t.value}</dd>
                    <dt className="text-ink-4 mt-0.5 text-xs">{t.label}</dt>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ══ 03 · ENGINEERING DATA ════════════════════════════════════════════════ */
export function SkuSpecs({
  productCode,
  specs,
  hardness,
  dimensions,
  dimensional,
  categoryLabel,
  settings,
}: {
  productCode?: string;
  specs: readonly { label: string; value: string }[];
  hardness?: string;
  dimensions?: string;
  dimensional?: { tiles: readonly { value: string; label: string }[] };
  categoryLabel: string;
  settings: SiteSettings;
}) {
  const held = settings.certifications.items.find((c) => c.standing === "held");
  const rows = [
    { label: "Product Code", value: productCode ?? "On request" },
    { label: "Product Family", value: categoryLabel },
    ...(hardness ? [{ label: "Hardness", value: hardness }] : []),
    ...(dimensions ? [{ label: "Dimensions", value: dimensions }] : []),
    // Per-part rows only; a row with nothing behind it is not shown.
    ...specs.filter((r) => r.value.trim()),
    {
      label: "Certifications",
      value: held
        ? `${held.code} — certificate ${held.identifier}, valid to ${held.validThrough}`
        : settings.certifications.line,
    },
    // One constant, three places: the hero selector, this row and the FAQ.
    { label: "Minimum Order", value: settings.commercial.minimumRunMoulded },
  ];
  const tiles = dimensional?.tiles.length ? dimensional.tiles : SAMPLE.dimensional.tiles;

  return (
    <section className="bg-canvas border-line border-t py-[70px]">
      <Container>
        <Eyebrow>Technical specifications</Eyebrow>
        <h2 className="text-h2 mt-3">Engineering Data</h2>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <div className="rounded-card border-line overflow-hidden border">
            <dl className="divide-line divide-y">
              {rows.map((r) => (
                <div key={r.label} className="grid gap-1 px-6 py-4 sm:grid-cols-[220px_1fr]">
                  <dt className="text-ink-4 text-sm">{r.label}</dt>
                  <dd className={`text-sm ${r.value === "On request" ? "text-ink-4 italic" : "text-ink"}`}>
                    {r.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="rounded-card border-line h-fit border bg-[#0D0F12] p-6">
            <p className="text-eyebrow text-ink-4 font-mono uppercase">Dimensional reference</p>
            <svg viewBox="0 0 240 130" className="mt-6 h-auto w-full" role="img" aria-label="Dimensional reference diagram">
              <line x1="24" y1="24" x2="216" y2="24" stroke="var(--color-accent-400)" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6" />
              <rect x="24" y="40" width="192" height="56" rx="3" fill="none" stroke="var(--color-accent-400)" strokeWidth="1.2" />
              <g stroke="var(--color-accent-400)" strokeWidth="0.6" opacity="0.3">
                {[60, 100, 140, 180].map((x) => (<line key={x} x1={x} y1="40" x2={x - 16} y2="96" />))}
              </g>
              <circle cx="120" cy="68" r="8" fill="none" stroke="var(--color-accent-400)" strokeWidth="0.9" />
              <path d="M120 58v20M110 68h20" stroke="var(--color-accent-400)" strokeWidth="0.9" />
              <line x1="226" y1="40" x2="226" y2="96" stroke="var(--color-accent-400)" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6" />
              <text x="120" y="116" textAnchor="middle" fill="var(--color-ink-4)" fontSize="8" fontFamily="var(--font-mono)">To customer drawing</text>
            </svg>
            <dl className="mt-6 grid grid-cols-3 gap-3">
              {tiles.map((t) => (
                <div key={t.label} className="rounded border border-[#1B2026] bg-[#111418] px-2 py-3 text-center">
                  <dd className="text-ink text-xs font-semibold">{t.value}</dd>
                  <dt className="text-ink-4 mt-1 text-xs">{t.label}</dt>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/contact" className="border-accent-400/40 text-accent-400 hover:bg-accent-400/8 inline-flex items-center gap-2.5 rounded-md border px-5 py-3 text-sm font-medium transition-colors">
            <Icon name="download" className="size-4" />
            Download Full Datasheet PDF
          </Link>
          <Link href="/contact" className="border-line-2 text-ink-2 hover:border-accent-400/60 inline-flex items-center gap-2.5 rounded-md border px-5 py-3 text-sm font-medium transition-colors">
            <Icon name="doc" className="size-4" />
            Technical Drawing DWG
          </Link>
        </div>
      </Container>
    </section>
  );
}

/* ══ 04 · COMPOUND OPTIONS ════════════════════════════════════════════════ */
export function SkuCompounds({
  codes,
  properties,
  compounds,
  ranking = [],
}: {
  codes: readonly string[];
  properties: Record<string, string[]>;
  /** The eight rows from site settings. */
  compounds: readonly CompoundRow[];
  /** Sheet 33: all eight ranked for this part, with the reason. When present
      it decides the order and the note; `codes` is the older subset. */
  ranking?: readonly { code: string; rank: number; reason: string }[];
}) {
  // Part documents name compounds either by code (FKM) or by display name
  // (Silicone, Natural Rubber); accept both so no existing record goes dark.
  const wanted = (c: CompoundRow) => codes.includes(c.code) || codes.includes(c.name);
  const rankOf = (c: CompoundRow) =>
    ranking.find((r) => r.code.toUpperCase() === c.code.toUpperCase());
  const source = ranking.length
    ? [...compounds].filter(rankOf).sort((a, b) => rankOf(a)!.rank - rankOf(b)!.rank)
    : compounds.filter(wanted);
  const items: Compound[] = source.map((c) => ({
    code: c.name,
    name: c.fullName,
    tempC: [c.minC, c.maxC] as const,
    note: rankOf(c)?.reason ?? c.descriptor,
    properties: properties[c.code] ?? properties[c.name] ?? [],
  }));
  if (!items.length) return null;

  return (
    <section className="bg-band border-line border-t py-[70px]">
      <Container>
        <div className="mb-8 flex flex-wrap items-end justify-between gap-6">
          <div>
            <Eyebrow>Available materials</Eyebrow>
            <h2 className="text-h2 mt-3">Rubber Compound Options</h2>
          </div>
          <p className="text-ink-4 max-w-[34ch] text-sm leading-relaxed md:text-right">
            Select the compound best suited to your operating environment and
            application requirements.
          </p>
        </div>
        <SkuCompoundPicker items={items} />
      </Container>
    </section>
  );
}

/* ══ 05 · KEY ADVANTAGES ══════════════════════════════════════════════════ */
export function SkuAdvantages({
  items,
}: {
  items: readonly { icon: string; name: string; body: string }[];
}) {
  const list = items.length ? items : SAMPLE.advantages;
  return (
    <section className="bg-canvas border-line border-t py-[70px]">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="relative pb-14">
            <Plate
              k={SAMPLE.advantageImages.main}
              ratio="aspect-[4/3]"
              className="w-[86%]"
              sizes="(min-width:1024px) 40vw, 90vw"
            />
            {/* Quality-rate badge sits over the lower-left of the main plate. */}
            <div className="border-accent-400 absolute top-[58%] left-0 border-l-2 bg-[#0D0F12]/95 px-5 py-4 backdrop-blur">
              <p className="text-eyebrow text-accent-400 font-mono uppercase">
                {SAMPLE.qualityBadge.label}
              </p>
              <p className="text-ink mt-1.5 text-3xl leading-none font-semibold">
                {SAMPLE.qualityBadge.value}
              </p>
              <p className="text-ink-4 mt-1 text-xs">{SAMPLE.qualityBadge.note}</p>
            </div>
            <div className="absolute right-0 bottom-0 w-[52%]">
              <Plate
                k={SAMPLE.advantageImages.inset}
                ratio="aspect-[4/3]"
                label=""
                sizes="(min-width:1024px) 22vw, 45vw"
              />
            </div>
          </div>

          <div>
            <Eyebrow>Key advantages</Eyebrow>
            <h2 className="text-h2 mt-3">Why Specifiers Choose Margo</h2>
            <ul className="mt-8 space-y-4">
              {list.map((a) => (
                <li key={a.name} className="rounded-card border-line flex gap-4 border bg-[#0D0F12] p-5">
                  <span className="border-accent-400/25 bg-accent-400/10 text-accent-400 grid size-9 shrink-0 place-items-center rounded-md border">
                    <Icon name={a.icon} className="size-4" />
                  </span>
                  <div>
                    <h3 className="text-ink text-base font-semibold">{a.name}</h3>
                    <p className="text-ink-4 mt-1.5 text-sm leading-relaxed">{a.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ══ 06 · GLOBAL APPLICATIONS ═════════════════════════════════════════════ */
export function SkuApplications({
  items,
}: {
  items: readonly { icon: string; name: string; body: string }[];
}) {
  const list = items.length ? items : SAMPLE.applications;
  return (
    <section className="bg-band border-line border-t py-[70px]">
      <Container>
        <Eyebrow>Industries served</Eyebrow>
        <h2 className="text-h2 mt-3">Global Applications</h2>
        <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((a) => (
            <li key={a.name} className="rounded-card border-line border bg-[#0D0F12] p-6">
              <span className="border-accent-400/25 bg-accent-400/10 text-accent-400 grid size-9 place-items-center rounded-md border">
                <Icon name={a.icon} className="size-4" />
              </span>
              <h3 className="text-ink mt-5 text-base font-semibold">{a.name}</h3>
              <p className="text-ink-4 mt-1.5 text-sm">{a.body}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

/* ══ 07 · MANUFACTURING PROCESS ═══════════════════════════════════════════ */
export function SkuProcess({ steps }: { steps: readonly { name: string; body: string }[] }) {
  const list = steps.length ? steps : SAMPLE.process;
  return (
    <section className="bg-canvas border-line border-t py-[70px]">
      <Container>
        <div className="text-center">
          <p className="text-eyebrow text-accent-400 flex items-center justify-center gap-4 font-mono uppercase">
            <span aria-hidden className="bg-accent-400/70 inline-block h-px w-8" />
            Manufacturing process
          </p>
          <h2 className="text-h2 mt-3">From Compound to Certification</h2>
        </div>

        <ol className="relative mt-14">
          <span aria-hidden className="bg-line-2 absolute top-0 bottom-0 left-6 w-px md:left-1/2 md:-translate-x-1/2" />
          {list.map((s, i) => (
            <li key={s.name} className="relative grid gap-x-12 pb-8 last:pb-0 md:grid-cols-2">
              <span
                aria-hidden
                className="text-eyebrow border-accent-400 bg-canvas text-accent-400 absolute top-5 left-6 z-10 grid size-9 -translate-x-1/2 place-items-center rounded border font-mono md:left-1/2"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className={i % 2 === 0 ? "md:col-start-1 md:text-right" : "md:col-start-2"}>
                <div className="rounded-card border-line ml-14 border bg-[#0D0F12] p-6 md:ml-0">
                  <h3 className="text-ink text-base font-semibold">{s.name}</h3>
                  <p className="text-ink-4 mt-2 text-sm leading-relaxed">{s.body}</p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}

/* ══ 08 · QUALITY ASSURANCE ═══════════════════════════════════════════════ */
export function SkuQuality({
  quality,
}: {
  quality?: {
    heading: string;
    body: string;
    certificates: readonly { name: string; issuer: string; validity: string }[];
    metrics: readonly { value: string; label: string }[];
    tour?: { title: string; note: string };
  };
}) {
  const q = quality ?? SAMPLE.quality;
  return (
    <section className="bg-band border-line border-t py-[70px]">
      <Container>
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <Eyebrow>Quality assurance</Eyebrow>
            <h2 className="text-h2 mt-3">{q.heading}</h2>
            <p className="text-ink-3 mt-5 max-w-[52ch] leading-relaxed">{q.body}</p>

            <ul className="mt-8 grid gap-4 sm:grid-cols-2">
              {q.certificates.map((c) => (
                <li key={c.name} className="rounded-card border-line border bg-[#0D0F12] p-5">
                  <Icon name="ribbon" className="text-accent-400 size-4" />
                  <p className="text-ink mt-3 text-sm font-semibold">{c.name}</p>
                  <p className="text-ink-4 mt-0.5 text-xs">{c.issuer}</p>
                  <p className="text-accent-400 mt-2 text-xs">{c.validity}</p>
                </li>
              ))}
            </ul>

            <Link href="/certifications" className="border-accent-400/40 text-accent-400 hover:bg-accent-400/8 mt-7 inline-flex items-center gap-2.5 rounded-md border px-5 py-3 text-sm font-medium transition-colors">
              <Icon name="download" className="size-4" />
              Download Quality Certificates
            </Link>
          </div>

          <div className="rounded-card border-line h-fit border bg-[#0D0F12] p-7">
            <p className="text-eyebrow text-accent-400 font-mono uppercase">Production metrics</p>
            <dl className="divide-line mt-6 grid grid-cols-2 gap-x-8">
              {q.metrics.map((m) => (
                <div key={m.label} className="border-line border-b py-5">
                  <dd className="text-ink text-2xl font-semibold">{m.value}</dd>
                  <dt className="text-ink-4 mt-1 text-xs">{m.label}</dt>
                </div>
              ))}
            </dl>
            {q.tour && (
              <div className="border-line mt-6 flex items-center gap-4 rounded-lg border p-4">
                <span className="border-accent-400/25 bg-accent-400/10 text-accent-400 grid size-10 shrink-0 place-items-center rounded border">
                  <Icon name="play" className="size-4" />
                </span>
                <div>
                  <p className="text-ink text-sm font-semibold">{q.tour.title}</p>
                  <p className="text-ink-4 mt-0.5 text-xs">{q.tour.note}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ══ 09 · DOWNLOADS ═══════════════════════════════════════════════════════ */
export function SkuDownloads({
  items,
}: {
  items: readonly { name: string; format: string; size: string; icon: string; href?: string }[];
}) {
  // Only rows with a file behind them. No file, no section — a card that
  // names a datasheet nobody can open is a promise the page cannot keep.
  const list = items.filter((d) => isFileHref(d.href));
  if (!list.length) return null;
  return (
    <section className="bg-canvas border-line border-t py-[70px]">
      <Container>
        <Eyebrow>Downloads</Eyebrow>
        <h2 className="text-h2 mt-3">Technical Documentation</h2>
        <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {list.map((d) => (
            <li key={d.name} className="rounded-card border-line relative border bg-[#0D0F12] p-6">
              <span className="border-accent-400/25 bg-accent-400/10 text-accent-400 grid size-9 place-items-center rounded border">
                <Icon name={d.icon} className="size-4" />
              </span>
              <span className="text-eyebrow border-line-2 text-ink-4 absolute top-6 right-6 rounded border px-2 py-0.5 font-mono">
                {d.format}
              </span>
              <p className="text-ink mt-6 text-sm font-semibold">
                <a href={d.href} download className="hover:text-accent-400 transition-colors after:absolute after:inset-0">
                  {d.name}
                </a>
              </p>
              <p className="text-ink-4 mt-1.5 text-xs">{d.size}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

/* ══ 10 · FAQ ═════════════════════════════════════════════════════════════ */
export function SkuFaq({ items }: { items: readonly { q: string; a: string }[] }) {
  const list = items.length ? items : SAMPLE.faqs;
  return (
    <section className="bg-band border-line border-t py-[70px]">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,22rem)_1fr]">
          <div>
            <Eyebrow>FAQ</Eyebrow>
            <h2 className="text-h2 mt-3">Technical &amp; Commercial Questions</h2>
            <p className="text-ink-4 mt-5 text-sm leading-relaxed">
              Answers to the most common questions from engineering teams and
              procurement managers worldwide.
            </p>
            <Plate k={SAMPLE.faqImage} ratio="aspect-[4/3]" className="mt-8" label="" sizes="(min-width:1024px) 22vw, 100vw" />
          </div>

          {/* Native <details>: answers are in the HTML whether open or not. */}
          <ul className="space-y-4">
            {list.map((f) => (
              <li key={f.q} className="rounded-card border-line border bg-[#0D0F12]">
                <details className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 p-5 [&::-webkit-details-marker]:hidden">
                    <span className="text-ink text-sm font-medium">{f.q}</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-ink-4 size-4 shrink-0 transition-transform group-open:rotate-180" aria-hidden>
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </summary>
                  <p className="text-ink-4 max-w-[64ch] px-5 pb-5 text-sm leading-relaxed">{f.a}</p>
                </details>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}

/* ══ 11 · RELATED ═════════════════════════════════════════════════════════ */
export function SkuRelated({
  items,
  categorySlug,
}: {
  items: readonly { slug: string; label: string; difference?: string }[];
  categorySlug: string;
}) {
  if (!items.length) return null;
  return (
    <section className="bg-canvas border-line border-t py-[70px]">
      <Container>
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <Eyebrow>Related products</Eyebrow>
            <h2 className="text-h2 mt-3">You May Also Need</h2>
          </div>
          <Link href={`/products/${categorySlug}`} className="text-accent-400 hover:opacity-80 inline-flex items-center gap-2 text-sm font-medium transition-colors">
            View all products
            <Arrow />
          </Link>
        </div>

        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.slice(0, 4).map((r) => (
            <li key={r.slug} data-lift="" className="rounded-card border-line hover:border-accent-400/40 overflow-hidden border bg-[#0D0F12]">
              <Link href={`/products/${categorySlug}/${r.slug}`}>
                <Plate k={SAMPLE.gallery.main} ratio="aspect-[16/9]" label="" className="rounded-none border-0 border-b" sizes="(min-width:1024px) 32vw, 100vw" />
                <span className="block p-6">
                  <span className="text-ink block text-base font-semibold">{r.label}</span>
                  {r.difference && <span className="text-ink-4 mt-2 block text-sm">{r.difference}</span>}
                  <span className="text-accent-400 mt-3 inline-flex items-center gap-2 text-sm font-medium">
                    View part
                    <Arrow />
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

/* ══ CLOSING CTA ══════════════════════════════════════════════════════════ */
export function SkuCta({
  h1,
  categorySlug,
  categoryLabel,
  quotation,
}: {
  h1: string;
  categorySlug: string;
  categoryLabel: string;
  /** "within 48 hours" — from site settings, the one figure everywhere. */
  quotation: string;
}) {
  return (
    <section className="bg-band border-line border-t py-[70px]">
      <Container>
        <div className="rounded-card border-line border-l-accent-400 flex flex-wrap items-center justify-between gap-8 border border-l-2 bg-[#0D0F12] p-8 md:p-10">
          <div>
            <h2 className="text-ink text-2xl font-semibold">Need this part quoted?</h2>
            <p className="text-ink-4 mt-3 max-w-[52ch] text-sm leading-relaxed">
              Send your drawing or a sample. We confirm compound, hardness and
              tolerance, then quote against your annual quantity. We respond{" "}
              {quotation}.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href={`/contact?part=${encodeURIComponent(h1)}`} className="bg-accent-400 text-ink hover:opacity-90 shadow-glow rounded-cta inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold transition-colors">
              Request a quote
              <Arrow />
            </Link>
            <Link href={`/products/${categorySlug}`} className="border-line-2 text-ink hover:border-accent-400/60 rounded-pill inline-flex items-center border px-6 py-3.5 text-sm font-semibold transition-colors">
              Back to {categoryLabel}
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
