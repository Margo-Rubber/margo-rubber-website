/**
 * The display step a heading is set at, from its own length.
 *
 * The comps set every hero H1 at 60px for headings of two or three short
 * lines ("Where Rubber / Meets Innovation"). The sheets' H1s run to four,
 * five and six lines, and a line of 27 characters — "Precision Rubber
 * Components" — needs 1,000px at that size where the column has 800. Set
 * at 60px they wrap their authored lines a second time, run into the
 * stat cards beside them, or stack six deep. So the size follows the copy:
 * the longest authored line decides, and a heading of four lines or more
 * steps down regardless. The tokens are in globals.css.
 *
 *   step 0  --text-display     60px   a line of ≤ 16 characters
 *   step 1  --text-display-2   48px   ≤ 22
 *   step 2  --text-display-3   44px   ≤ 28, or four lines or more
 *   step 3  --text-display-4   36px   longer still
 */
const HERO = ["text-display", "text-display-2", "text-display-3", "text-display-4"] as const;
const SECTION = ["text-display-2", "text-display-3", "text-display-4"] as const;

export function displaySize(text: string | readonly string[], role: "hero" | "section" = "hero"): string {
  const lines = (Array.isArray(text) ? text : String(text).split("\n")).map((l) => String(l).replace(/\*/g, ""));
  const longest = Math.max(0, ...lines.map((l) => l.length));
  const total = lines.join(" ").length;

  if (role === "section") {
    const step = longest <= 22 ? 0 : longest <= 30 ? 1 : 2;
    return SECTION[Math.max(step, total > 60 ? 1 : 0)];
  }

  // One run of text with no authored breaks wraps where the column says;
  // only its length matters. Two lines at 60px is 40 characters or so.
  if (lines.length === 1) return HERO[total <= 22 ? 0 : total <= 48 ? 1 : total <= 80 ? 2 : 3];

  let step = longest <= 16 ? 0 : longest <= 22 ? 1 : longest <= 28 ? 2 : 3;
  if (lines.length >= 4 || total > 70) step = Math.max(step, 2);
  if (total > 95) step = 3;
  return HERO[step];
}
