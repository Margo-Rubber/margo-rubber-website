import type { Status } from "@/lib/enquiry/store";

/**
 * Status as a coloured chip.
 *
 * Semantic colour, deliberately separate from the brand accent: these encode
 * state, and if `new` were brand teal it would read as decoration rather than
 * as "this one needs attention". The dot carries the colour; the text stays
 * dark so it reads at 11px on a white desk.
 */
const TONE: Record<Status, { dot: string; chip: string }> = {
  new: { dot: "bg-warn", chip: "bg-warn/10 border-warn/30 text-ink" },
  contacted: { dot: "bg-ink-4", chip: "bg-ink-4/10 border-line-2 text-ink-2" },
  quoted: { dot: "bg-accent-400", chip: "bg-accent-400/10 border-accent-400/30 text-ink" },
  won: { dot: "bg-ok", chip: "bg-ok/10 border-ok/30 text-ink" },
  lost: { dot: "bg-danger", chip: "bg-danger/10 border-danger/30 text-ink" },
};

export function StatusPill({ status }: { status: Status }) {
  const tone = TONE[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium capitalize ${tone.chip}`}
    >
      <span aria-hidden className={`size-1.5 rounded-full ${tone.dot}`} />
      {status}
    </span>
  );
}
