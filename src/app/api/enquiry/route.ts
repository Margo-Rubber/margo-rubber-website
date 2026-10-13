import { enquiryPayloadSchema, mapAndValidate } from "@/lib/enquiry/sources";
import { checkSpam, clientIp, spamMessage } from "@/lib/enquiry/spam";
import { isStoreConfigured, storeAttachment, storeEnquiry } from "@/lib/enquiry/store";
import { forwardEnquiry, notifyEnquiry } from "@/lib/enquiry/notify";
import { sendAutoReply } from "@/lib/enquiry/autoreply";
import { formatBytes, verifyUpload } from "@/lib/enquiry/attachments";

/**
 * POST /api/enquiry
 *
 * Every form on the site posts here. One endpoint, one validation path, one
 * place that talks to the database.
 *
 * ORDER MATTERS, and is the whole reliability story:
 *
 *   1. validate        cheap, rejects malformed input before any I/O
 *   2. spam checks     cheap, rejects bots before any I/O
 *   3. store           the system of record
 *   4. email           waited on; the safety net if everything downstream fails
 *   5. forward         fire and forget; may fail without losing the enquiry
 *
 * Storing before emailing means the durable copy exists first. Emailing before
 * forwarding means a human has it even if the automation is misconfigured. By
 * the time anything unreliable runs, the enquiry is already in two places.
 */

// No route segment config here. `dynamic` is rejected outright under
// `cacheComponents`, and it was redundant anyway: route handlers are uncached
// by default and only GET can opt in.

type Ok = { ok: true; id: string | null };
type Err = { ok: false; message: string; errors?: Record<string, string> };

const json = (body: Ok | Err, status: number) =>
  Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });

export async function POST(request: Request) {
  // ── 1. Parse and validate ────────────────────────────────────────────
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, message: "Expected a JSON body." }, 400);
  }

  const payload = enquiryPayloadSchema.safeParse(body);
  if (!payload.success) {
    // A failure here is a malformed request rather than a person mistyping,
    // since the fields themselves are checked after mapping. The honeypot
    // also lands here, and is deliberately not distinguished.
    return json(
      { ok: false, message: "We could not process that submission." },
      400,
    );
  }

  const mapped = mapAndValidate(payload.data);
  if (!mapped.ok) {
    return json(
      {
        ok: false,
        message: "Please check the highlighted fields.",
        errors: mapped.errors,
      },
      422,
    );
  }

  // ── 2. Spam ──────────────────────────────────────────────────────────
  const ip = clientIp(request.headers);
  const verdict = await checkSpam({
    honeypot: payload.data.company_website,
    elapsedMs: payload.data.meta.elapsedMs,
    ip,
  });

  if (!verdict.ok) {
    // 200, not 4xx. A bot learns nothing from a success response, and the
    // handful of humans who trip the rate limit see the message rather than a
    // browser error.
    return json({ ok: false, message: spamMessage(verdict.reason) }, 200);
  }

  const userAgent = request.headers.get("user-agent") ?? undefined;

  // ── 2b. The attached file, if any ────────────────────────────────────
  // The browser uploaded it to Cloudinary already (see attachments.ts) and
  // sends back a reference. Confirm the asset is really there, under our
  // folder, before believing it — the reference is client-supplied.
  const ref = payload.data.attachment;
  const verified = ref ? await verifyUpload(ref) : null;
  if (ref && !verified) {
    return json(
      {
        ok: false,
        message: "The attached file did not arrive. Please attach it again, or email it to info@margorubber.in.",
        errors: { attachment: "Upload not found" },
      },
      422,
    );
  }
  const attachment = ref && verified ? { name: ref.originalFilename, size: formatBytes(verified.bytes) } : undefined;

  // ── 3. Store ─────────────────────────────────────────────────────────
  const stored = await storeEnquiry(mapped.data, { userAgent });
  if (stored.stored && ref && verified) await storeAttachment(stored.id, ref, verified);
  const fileUrl: string | undefined = undefined;

  if (!stored.stored && stored.reason === "error") {
    // The database is the system of record. Losing the row is fatal, and the
    // visitor must be told so they can email instead of assuming it arrived.
    console.error("[enquiry] store failed:", stored.message);
    return json(
      {
        ok: false,
        message:
          "We could not record your enquiry. Please email us directly at info@margorubber.in.",
      },
      500,
    );
  }

  const enquiryId = stored.stored ? stored.id : undefined;

  if (!isStoreConfigured()) {
    // Local development, or a deploy missing its environment. Loud, because
    // silently accepting enquiries that are never saved is the worst possible
    // failure for this endpoint.
    console.warn(
      "[enquiry] DATABASE_URL is not set — this submission was NOT saved.",
    );
  }

  // ── 4. Email, waited on ──────────────────────────────────────────────
  const notified = await notifyEnquiry(mapped.data, {
    fileUrl,
    attachment,
    enquiryId,
    stored: stored.stored,
  });

  if (!notified.sent && notified.reason === "error") {
    console.error("[enquiry] email failed:", notified.message);

    // Only fatal when nothing else caught it. If the row is safely stored, the
    // enquiry is not lost and telling the visitor it failed would invite a
    // duplicate submission.
    if (!stored.stored) {
      return json(
        {
          ok: false,
          message:
            "We could not send your enquiry. Please email us directly at info@margorubber.in.",
        },
        500,
      );
    }
  }

  // ── 5. Acknowledge the buyer + forward, side by side, never fatal ─────
  // Only reached once the enquiry is safe (stored or emailed to Margo), so a
  // buyer is never told "we received it" for an enquiry that went nowhere.
  await Promise.all([
    sendAutoReply(mapped.data),
    forwardEnquiry(mapped.data, { fileUrl, enquiryId, userAgent }),
  ]);

  return json({ ok: true, id: enquiryId ?? null }, 200);
}

/** Anything other than POST. */
export async function GET() {
  return json({ ok: false, message: "Method not allowed." }, 405);
}
