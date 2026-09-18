import { z } from "zod";
import { MAX_BYTES } from "@/lib/enquiry/attachment-ref";
import { signUpload } from "@/lib/enquiry/attachments";
import { clientIp } from "@/lib/enquiry/spam";

/**
 * POST /api/enquiry/upload
 *
 * The first half of attaching a file: the browser says what it wants to
 * upload, and gets back the signed parameters that let it post the file
 * straight to Cloudinary (see src/lib/enquiry/attachments.ts). Nothing is
 * stored here — the reference comes back with the enquiry itself, and is
 * checked then.
 *
 * Small and cheap by design: a signature costs nothing, and the parameters
 * it covers (our folder, a random id, the allowed formats, private type)
 * are what stop the endpoint being used to upload anything else anywhere
 * else in the account.
 */

const bodySchema = z.object({
  filename: z.string().min(1).max(255),
  bytes: z.number().int().positive().max(MAX_BYTES * 2),
});

/** Per-IP, per-instance. Enough to stop a loop; the form only ever asks once per file. */
const recent = new Map<string, number[]>();
const LIMIT = 20;
const WINDOW_MS = 10 * 60 * 1000;

const json = (body: unknown, status: number) =>
  Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, message: "Expected a JSON body." }, 400);
  }
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) return json({ ok: false, message: "Please attach a PDF, DWG, DXF or image file under 10 MB." }, 400);

  const ip = clientIp(request.headers) ?? "unknown";
  const now = Date.now();
  const hits = (recent.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (hits.length >= LIMIT) return json({ ok: false, message: "Too many uploads — please try again in a few minutes." }, 429);
  recent.set(ip, [...hits, now]);

  const signed = signUpload(parsed.data.filename, parsed.data.bytes);
  if (!signed.ok) return json({ ok: false, message: signed.message }, 422);
  return json({ ok: true, ...signed.upload }, 200);
}

export async function GET() {
  return json({ ok: false, message: "Method not allowed." }, 405);
}
