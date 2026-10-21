import type { ReactNode } from "react";
import { Container } from "@/components/ui/Section";
import { STANDARD_LINKS, type AnswerBlock } from "@/content/answer-blocks";

/**
 * A page's answer block (D6 / T13): the question as an H2 and the answer as
 * one visible paragraph, straight after the hero — not in an accordion, so
 * crawlers and answer engines read it as main content. The first mention of
 * each named standard links to its publisher.
 */
export function AnswerLead({ block }: { block?: AnswerBlock }) {
  if (!block) return null;
  return (
    <section aria-labelledby="answer-lead" className="bg-canvas border-line border-b py-[56px]">
      <Container>
        <div className="max-w-[896px]">
          <h2 id="answer-lead" className="text-h2">
            {block.q}
          </h2>
          <p className="text-ink-2 mt-4 text-base leading-relaxed">{linkStandards(block.a)}</p>
        </div>
      </Container>
    </section>
  );
}

/** Wraps the first occurrence of each listed standard in a link. */
function linkStandards(text: string): ReactNode[] {
  const hits = STANDARD_LINKS.map((s) => ({ ...s, at: text.indexOf(s.code) }))
    .filter((s) => s.at >= 0)
    .sort((a, b) => a.at - b.at);
  const out: ReactNode[] = [];
  let i = 0;
  for (const s of hits) {
    if (s.at < i) continue; // overlapping codes: keep the earlier one
    out.push(text.slice(i, s.at));
    out.push(
      <a
        key={s.code}
        href={s.href}
        target="_blank"
        rel="noopener"
        className="text-accent-400 underline decoration-1 underline-offset-2 hover:opacity-80"
      >
        {s.code}
      </a>,
    );
    i = s.at + s.code.length;
  }
  out.push(text.slice(i));
  return out;
}
