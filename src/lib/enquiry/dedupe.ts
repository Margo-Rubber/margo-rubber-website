import { createHash } from "node:crypto";
import type { MappedEnquiry } from "./sources";

/**
 * DUPLICATE-SEND GUARD
 *
 * The same enquiry was reaching Margo's inbox and the buyer three times. However
 * the duplicates arrive (a repeated click, a resent request, a retry somewhere
 * upstream), the content is identical, so a fingerprint of the content lets
 * Resend drop the repeats: requests that carry the same `Idempotency-Key` within
 * 24 hours are sent once.
 *
 * The fingerprint is the source plus every submitted field, sorted, trimmed and
 * lower-cased, so field order and stray whitespace do not make two copies of the
 * same enquiry look different. A buyer who sends a genuinely different enquiry
 * (any field changed) gets a new key and a new email.
 */
export function enquiryFingerprint(enquiry: MappedEnquiry): string {
  const fields = Object.entries(enquiry.raw)
    .map(([k, v]) => [k, v.trim().toLowerCase()] as const)
    .filter(([, v]) => v !== "")
    .sort(([a], [b]) => a.localeCompare(b));

  return createHash("sha256")
    .update(JSON.stringify({ source: enquiry.source, email: enquiry.email.trim().toLowerCase(), fields }))
    .digest("hex")
    .slice(0, 40);
}

/**
 * Resend answers a repeat of an idempotency key with 409 — either "already
 * processed" or, when the body differs (the notification carries the database
 * row id, which is new for each copy), "invalid idempotent request". Both mean
 * this exact enquiry has already been emailed, so neither is a failure.
 */
export function isDuplicateSend(status: number): boolean {
  return status === 409;
}
