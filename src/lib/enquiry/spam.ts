/**
 * SPAM CHECKS
 *
 * Three cheap signals, deliberately no captcha.
 *
 * A captcha on a B2B enquiry form costs real enquiries: a procurement engineer
 * comparing three suppliers will abandon rather than solve a puzzle, and this
 * form expects perhaps twenty submissions a month. The three checks below stop
 * the automated volume that makes up nearly all of it, and a human spammer who
 * gets through is one email to delete.
 */

/** Minimum plausible time to fill a form. Bots post instantly. */
const MIN_ELAPSED_MS = 2_000;

/**
 * Per-IP submissions allowed inside the window.
 *
 * Per IP, not sitewide: a busy day of enquiries from many visitors is never
 * limited. What one address has to allow for is a shared one — an office
 * behind a single NAT, or the carrier-grade NAT most Indian mobile networks
 * put thousands of subscribers behind. Twenty an hour covers a whole
 * office's procurement team and is still far below what a bot sends.
 */
const RATE_LIMIT = 20;
const RATE_WINDOW_MS = 60 * 60 * 1000;

export type SpamVerdict =
  | { ok: true }
  | { ok: false; reason: "honeypot" | "too-fast" | "rate-limited" };

/**
 * Rate-limit store.
 *
 * In-memory here, which is correct for local development and WRONG in
 * production on Workers: each request may hit a different isolate, so counters
 * do not accumulate. The deploy step swaps this for a KV-backed implementation
 * behind the same interface. Until then the limiter is best-effort, which is
 * why it is the third line of defence rather than the first.
 */
export interface RateStore {
  hit(key: string, windowMs: number): Promise<number>;
}

const memory = new Map<string, { count: number; resetAt: number }>();

export const memoryRateStore: RateStore = {
  async hit(key, windowMs) {
    const now = Date.now();
    const entry = memory.get(key);

    if (!entry || entry.resetAt <= now) {
      memory.set(key, { count: 1, resetAt: now + windowMs });
      return 1;
    }

    entry.count += 1;
    return entry.count;
  },
};

/**
 * The client IP, as reported by whichever proxy is in front.
 *
 * `cf-connecting-ip` is Cloudflare's and is the one that will apply in
 * production. `x-forwarded-for` may hold a chain, so only the first entry is
 * the originating client; the rest are proxies and are trivially spoofed.
 */
export function clientIp(headers: Headers): string {
  const cf = headers.get("cf-connecting-ip");
  if (cf) return cf;

  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();

  return headers.get("x-real-ip") ?? "unknown";
}

export async function checkSpam(
  input: { honeypot?: string; elapsedMs?: number; ip: string },
  store: RateStore = memoryRateStore,
): Promise<SpamVerdict> {
  // 1. Honeypot. A field hidden from people; bots fill everything they find.
  if (input.honeypot && input.honeypot.trim() !== "") {
    return { ok: false, reason: "honeypot" };
  }

  // 2. Time on form. Absent elapsedMs is NOT treated as failure: a visitor
  //    with JavaScript disabled cannot report it, and refusing them would
  //    reject exactly the careful, script-blocking engineer we want to hear
  //    from.
  if (input.elapsedMs !== undefined && input.elapsedMs < MIN_ELAPSED_MS) {
    return { ok: false, reason: "too-fast" };
  }

  // 3. Rate limit per IP.
  if (input.ip !== "unknown") {
    const count = await store.hit(`enquiry:${input.ip}`, RATE_WINDOW_MS);
    if (count > RATE_LIMIT) return { ok: false, reason: "rate-limited" };
  }

  return { ok: true };
}

/**
 * What the visitor is told.
 *
 * Never the real reason. Telling a bot which check it failed is free
 * information for whoever tunes it next, and a rate-limited human does not
 * need to know the threshold.
 */
export type SpamReason = Extract<SpamVerdict, { ok: false }>["reason"];

export function spamMessage(reason: SpamReason): string {
  return reason === "rate-limited"
    ? "Too many enquiries from this connection. Please try again later, or email us directly."
    : "We could not process that submission. Please try again, or email us directly.";
}
