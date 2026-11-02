import { Container, Eyebrow, SectionGlow } from "@/components/ui/Section";
import { Img } from "@/components/ui/Img";
import { Icon, type IconName } from "@/components/ui/Icon";
import { SanityPhoto } from "@/components/ui/SanityPhoto";
import type { CmsImage } from "@/content/blocks";

/**
 * SPONGE & FOAM BLOCKS — the sections particular to
 * UI-changes2/Sponge & Foam Rubber.pdf.
 *
 * All server components. The one part of this comp that needs interactivity
 * — the compound tab selector — lives in CompoundGuide.tsx so that choosing a
 * tab does not cost the rest of the page a client bundle.
 */

/* ── Cell morphology ─────────────────────────────────────────────────────── */

/**
 * Closed cell vs open cell, drawn rather than photographed.
 *
 * The distinction is topological — sealed membranes against interconnected
 * pores — so a diagram states it in a way a micrograph would not. Solid
 * circles for closed, dashed for open, which is the comp's own shorthand and
 * survives being read at 40mm on a phone.
 */
function CellDiagram({ kind }: { kind: "closed" | "open" }) {
  const closed = kind === "closed";
  // Hand-placed so the packing reads as a real foam rather than a lattice.
  const cells: [number, number, number][] = [
    [26, 30, 11], [52, 24, 8], [76, 32, 10], [104, 26, 7], [130, 33, 9],
    [20, 56, 8], [44, 60, 12], [72, 58, 9], [98, 62, 11], [126, 57, 8],
    [34, 84, 10], [62, 86, 8], [88, 82, 7], [114, 86, 10],
  ];

  return (
    <svg viewBox="0 0 152 108" aria-hidden className="h-28 w-full">
      {cells.map(([cx, cy, r]) => (
        <circle
          key={`${cx}-${cy}`}
          cx={cx}
          cy={cy}
          r={r}
          fill={closed ? "currentColor" : "none"}
          fillOpacity={closed ? 0.18 : 0}
          stroke="currentColor"
          strokeWidth={1}
          strokeDasharray={closed ? undefined : "2 2.5"}
        />
      ))}
    </svg>
  );
}

export function ComparePanels({
  panels,
}: {
  panels: readonly {
    label: string;
    caption: string;
    diagram: "closed" | "open";
    rows: readonly { label: string; value: string }[];
  }[];
}) {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {panels.map((p) => (
        <section
          key={p.label}
          className="border-line rounded-card overflow-hidden border"
        >
          <h3 className="bg-accent-400/[0.07] text-accent-400 border-line border-b px-6 py-3 text-center font-mono text-[11px] tracking-[0.16em] uppercase">
            {p.label}
          </h3>

          <div className="bg-surface-3 px-6 py-8">
            <p className="text-ink-4 mb-4 text-center text-[11px]">
              {p.caption}
            </p>
            <div className="text-accent-400">
              <CellDiagram kind={p.diagram} />
            </div>
          </div>

          <dl className="divide-line divide-y">
            {p.rows.map((r) => (
              <div
                key={r.label}
                className="flex items-baseline justify-between gap-6 px-6 py-3.5"
              >
                <dt className="text-ink-4 text-sm">{r.label}</dt>
                <dd className="text-ink text-right text-sm font-medium">
                  {r.value}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      ))}
    </div>
  );
}

/* ── Density ─────────────────────────────────────────────────────────────── */

export function DensityBlock({
  scale,
  quote,
  bands,
}: {
  scale: {
    min: string;
    max: string;
    unit: string;
    lowLabel: string;
    lowNote: string;
    highLabel: string;
    highNote: string;
  };
  quote: { text: string; author: string; org?: string };
  bands: readonly { range: string; note: string }[];
}) {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <div className="border-line bg-surface-3 rounded-card border p-8">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
          <div className="text-accent-400">
            <CellDiagram kind="open" />
          </div>
          <span className="text-ink-4 font-mono text-[10px] tracking-[0.16em] uppercase">
            vs
          </span>
          <div className="text-accent-400">
            <CellDiagram kind="closed" />
          </div>
        </div>

        <div className="mt-2 grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-ink text-xs font-semibold">{scale.lowLabel}</p>
            <p className="text-ink-4 mt-1 text-[11px]">{scale.lowNote}</p>
          </div>
          <div>
            <p className="text-ink text-xs font-semibold">{scale.highLabel}</p>
            <p className="text-ink-4 mt-1 text-[11px]">{scale.highNote}</p>
          </div>
        </div>

        {/* The scale itself. Flat rather than a gradient — the brand allows
            one blue — and unfilled, because density is continuous and any
            fill level would be a fiction. Low-to-high is carried by the
            labels either side. */}
        <div className="bg-accent-400/60 mt-7 h-2.5 rounded-full" />
        <div className="text-ink-4 mt-3 flex items-center justify-between font-mono text-[10px]">
          <span>
            {scale.min} {scale.unit}
          </span>
          <span className="tracking-[0.16em] uppercase">Density</span>
          <span>
            {scale.max} {scale.unit}
          </span>
        </div>
      </div>

      <div>
        <figure className="border-accent-400 bg-surface-3 rounded-card border border-l-2 p-7">
          <blockquote className="text-ink text-base leading-relaxed">
            {quote.text}
          </blockquote>
          <figcaption className="text-accent-400 mt-4 font-mono text-xs">
            <cite className="not-italic">
              — {quote.author}
              {quote.org && <span className="text-ink-4 block">{quote.org}</span>}
            </cite>
          </figcaption>
        </figure>

        {/* "Each band should be an <h3> or a <dt>, not a styled span" (sheet 19 §05). */}
        <dl className="mt-4 space-y-2.5">
          {bands.map((b) => (
            <div
              key={b.range}
              className="border-line bg-surface-3 flex flex-wrap items-baseline gap-x-4 gap-y-1 rounded-lg border px-5 py-3.5"
            >
              <dt className="text-accent-400 font-mono text-xs whitespace-nowrap">
                {b.range}
              </dt>
              <dd className="text-ink-4 text-sm">{b.note}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

/* ── Self-adhesive sub-category ──────────────────────────────────────────── */

/** The tape's layer stack, drawn top to bottom as it is assembled. */
function BuildUp({ label, layers }: { label: string; layers: readonly string[] }) {
  return (
    // Flex column so that, stretched to the height of the product photo
    // beside it, the caption stays at the top and the stack sits centred in
    // the space below rather than leaving a gap under it.
    <div className="border-line bg-surface-3 rounded-card flex flex-col border p-8">
      <p className="text-ink-4 font-mono text-[10px] tracking-[0.16em] uppercase">
        {label}
      </p>
      <ul className="mx-auto my-auto w-full max-w-md space-y-2 pt-7">
        {layers.map((l, i) => (
          <li key={l} className="flex items-center gap-4">
            <span
              aria-hidden
              className={`border-accent-400 h-4 flex-1 rounded-sm border ${
                i === 0 ? "bg-accent-400/25" : "bg-accent-400/10"
              }`}
            />
            <span className="text-ink-3 w-52 shrink-0 text-xs">{l}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ComparisonRows({
  label,
  items,
}: {
  label: string;
  items: readonly {
    name: string;
    tag?: string;
    rows: readonly { label: string; value?: string; caveat?: boolean }[];
  }[];
}) {
  return (
    <section className="mt-10">
      <h3 className="text-ink-4 font-mono text-[10px] tracking-[0.16em] uppercase">
        {label}
      </h3>
      <div className="mt-4 grid gap-5 lg:grid-cols-2">
        {items.map((it) => (
          <div
            key={it.name}
            className="border-line bg-surface-3 rounded-card border p-7"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-accent-400 flex items-center gap-2.5 text-sm font-semibold">
                <span aria-hidden className="bg-accent-400 size-1.5 rounded-full" />
                {it.name}
              </p>
              {it.tag && (
                <span className="border-accent-400/30 text-accent-400 rounded border px-2 py-0.5 font-mono text-[9px] tracking-[0.1em] uppercase">
                  {it.tag}
                </span>
              )}
            </div>

            <dl className="mt-5 space-y-3">
              {it.rows.map((r) =>
                r.value ? (
                  <div key={r.label} className="flex gap-5 text-sm">
                    <dt className="text-ink-4 w-24 shrink-0">{r.label}</dt>
                    <dd className="text-ink-2">{r.value}</dd>
                  </div>
                ) : (
                  <div
                    key={r.label}
                    className={`flex items-start gap-2.5 text-sm ${
                      r.caveat ? "text-ink-4" : "text-ink-2"
                    }`}
                  >
                    <Icon
                      name={r.caveat ? "clock" : "check"}
                      className={`mt-0.5 size-3.5 shrink-0 ${
                        r.caveat ? "text-ink-4" : "text-accent-400"
                      }`}
                    />
                    <dd>{r.label}</dd>
                  </div>
                ),
              )}
            </dl>
          </div>
        ))}
      </div>
    </section>
  );
}

/**
 * The product itself, uploaded in Studio. On white, like the parts group
 * photo, because product shots arrive cut out on white; the whole photo is
 * always visible (contain, never cropped).
 */
function ProductPhoto({ image, fallbackAlt }: { image: CmsImage; fallbackAlt: string }) {
  return (
    <figure className="flex flex-col">
      <div className="rounded-card border-line flex flex-1 items-center justify-center overflow-hidden border bg-white p-6">
        <SanityPhoto
          image={image}
          fallbackAlt={fallbackAlt}
          sizes="(min-width: 1024px) 480px, 100vw"
          fit="contain"
          className="h-auto max-h-[340px] w-auto max-w-full"
        />
      </div>
      {image.caption && (
        <figcaption className="text-ink-4 mt-3 text-xs">{image.caption}</figcaption>
      )}
    </figure>
  );
}

export function SubCategoryBlock({
  id,
  eyebrow,
  heading,
  body,
  dividerLabel,
  photo,
  detailPhoto,
  buildUp,
  comparisons,
  note,
  className = "",
}: {
  id?: string;
  className?: string;
  eyebrow: string;
  heading: string;
  body?: string;
  dividerLabel?: string;
  /** The product itself, uploaded in Studio. Optional. */
  photo?: CmsImage;
  /** A second photo, shown in place of the build-up when set. */
  detailPhoto?: CmsImage;
  buildUp?: { label: string; layers: readonly string[] };
  comparisons: readonly {
    label: string;
    items: readonly {
      name: string;
      tag?: string;
      rows: readonly { label: string; value?: string; caveat?: boolean }[];
    }[];
  }[];
  note?: { title: string; body: string };
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

  // A photo with nothing else beside it (no build-up, no second photo) takes
  // the heading and paragraph into the panel on its right instead of above
  // the pair (client, 2 Nov 2026: the self-adhesive foam tape section).
  const textBeside = Boolean(photo?.asset) && !detailPhoto?.asset && !buildUp;

  return (
    <section
      id={id}
      className={`relative overflow-hidden py-[70px] ${className}`}
    >
      <SectionGlow />
      <Container className="relative">
        {dividerLabel && (
          <p className="text-ink-4 flex items-center gap-5 font-mono text-[10px] tracking-[0.16em] uppercase">
            <span aria-hidden className="bg-line-2 h-px flex-1" />
            {dividerLabel}
            <span aria-hidden className="bg-line-2 h-px flex-1" />
          </p>
        )}

        {!textBeside && (
          <header className="mx-auto mt-12 max-w-[52rem] text-center">
            <Eyebrow variant="rule" center>
              {eyebrow}
            </Eyebrow>
            <h2 className="text-h2 mt-3">{marked}</h2>
            {body && (
              <p className="text-ink-3 mx-auto mt-4 max-w-[62ch] leading-relaxed">
                {body}
              </p>
            )}
          </header>
        )}

        <div className={textBeside ? "mt-12" : "mt-10"}>
          {/* Photo beside the build-up when there is one; photo first on a
              phone. Without a photo the build-up runs full width as before.
              A second photo takes the build-up's place, in equal halves.
              With neither, the heading and paragraph take that place. */}
          {photo?.asset ? (
            <div
              className={
                detailPhoto?.asset
                  ? "grid gap-5 lg:grid-cols-2"
                  : buildUp
                    ? "grid gap-5 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]"
                    : "grid items-stretch gap-5 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]"
              }
            >
              <ProductPhoto image={photo} fallbackAlt={heading.split("*").join("")} />
              {detailPhoto?.asset ? (
                <ProductPhoto image={detailPhoto} fallbackAlt={heading.split("*").join("")} />
              ) : buildUp ? (
                <BuildUp label={buildUp.label} layers={buildUp.layers} />
              ) : (
                <div className="border-line bg-surface-3 rounded-card flex flex-col justify-center border p-8 md:p-10">
                  <Eyebrow variant="rule">{eyebrow}</Eyebrow>
                  <h2 className="text-h2 mt-3">{marked}</h2>
                  {body && <p className="text-ink-3 mt-4 max-w-[62ch] leading-relaxed">{body}</p>}
                </div>
              )}
            </div>
          ) : (
            buildUp && <BuildUp label={buildUp.label} layers={buildUp.layers} />
          )}
          {comparisons.map((c) => (
            <ComparisonRows key={c.label} label={c.label} items={c.items} />
          ))}

          {note && (
            <div className="border-accent-400/25 bg-accent-400/[0.05] rounded-card mt-10 border p-7">
              <p className="text-accent-400 flex items-center gap-2.5 font-mono text-[10px] tracking-[0.16em] uppercase">
                <Icon name="check" className="size-3.5" />
                {note.title}
              </p>
              <p className="text-ink-3 mt-3 text-sm leading-relaxed">
                {note.body}
              </p>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}

/* ── Applications in the field ───────────────────────────────────────────── */

export function ApplicationCards({
  items,
}: {
  items: readonly {
    tag: string;
    name: string;
    body: string;
    icon?: string;
    image?: string;
  }[];
}) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((a) => (
        <li
          key={a.name}
          className="border-line bg-surface-3 rounded-card overflow-hidden border"
        >
          {/* 4:3, so the row keeps its rhythm whether a card has its
              photograph yet or is still showing the fallback glyph. */}
          <div className="bg-surface-4 relative grid aspect-[4/3] place-items-center overflow-hidden">
            {a.image ? (
              <Img
                k={a.image}
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover"
              />
            ) : (
              <Icon
                name={(a.icon ?? "layers") as IconName}
                className="text-ink-4/40 size-10"
              />
            )}
            <span className="bg-accent-400 text-ink absolute top-3 right-3 rounded px-2 py-1 font-mono text-[9px] tracking-[0.1em] uppercase">
              {a.tag}
            </span>
          </div>
          <div className="p-5">
            <h3 className="text-ink text-sm font-semibold">{a.name}</h3>
            <p className="text-ink-4 mt-2.5 text-xs leading-relaxed">{a.body}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
