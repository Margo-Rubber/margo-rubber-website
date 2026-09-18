import { v2 as cloudinary } from "cloudinary";
import { MAX_BYTES, type AttachmentRef } from "./attachment-ref";

export { ACCEPT, MAX_BYTES, attachmentRefSchema, type AttachmentRef } from "./attachment-ref";

/**
 * ATTACHMENTS — the drawing or specification a visitor sends with an enquiry.
 *
 * Stored in Margo's Cloudinary account (Settings → API keys →
 * CLOUDINARY_URL), never on a public URL: every upload is `type: private`,
 * so the original is reachable only through a download link this module
 * signs for the desk, expiring after an hour. Customer drawings are often
 * under NDA and that is the whole design constraint.
 *
 * The browser uploads straight to Cloudinary. It first asks
 * /api/enquiry/upload for a signature over parameters this module chooses
 * (a random public_id under enquiries/, the private type, the allowed
 * formats), then posts the file to Cloudinary with that signature. The
 * file never passes through a Vercel function — which caps a request body
 * at 4.5 MB, under the form's 10 MB limit — and the secret never leaves the
 * server. When the enquiry is submitted, the server checks the asset is
 * really there before recording it (`verifyUpload`): a public_id nobody
 * uploaded under our folder is refused.
 *
 * The record in Postgres is the reference (public_id, resource type,
 * filename, size), not a URL. Links are made at view time, so the storage
 * account can be swapped without touching the data.
 */

/** Which store each accepted extension goes to; anything else is refused. */
const FORMATS: Record<string, "image" | "raw"> = {
  pdf: "raw",
  dwg: "raw",
  dxf: "raw",
  png: "image",
  jpg: "image",
  jpeg: "image",
  gif: "image",
  webp: "image",
  heic: "image",
  heif: "image",
  tif: "image",
  tiff: "image",
  bmp: "image",
};
const FOLDER = "enquiries";

export function isAttachmentsConfigured(): boolean {
  return Boolean(process.env.CLOUDINARY_URL);
}

export type AttachmentRow = {
  id: string;
  enquiry_id: string;
  public_id: string;
  resource_type: "image" | "raw";
  format: string | null;
  original_filename: string;
  bytes: number;
  mime: string | null;
  created_at: string;
};

const ext = (filename: string) => filename.toLowerCase().match(/\.([a-z0-9]+)$/)?.[1] ?? "";

/** Why a file cannot be attached, in the visitor's words — or null when it can. */
export function rejectReason(filename: string, bytes: number): string | null {
  const e = ext(filename);
  if (!e || !FORMATS[e]) return "Please attach a PDF, DWG, DXF or image file.";
  if (bytes > MAX_BYTES) return "That file is over 10 MB. Please send a smaller file, or email it to info@margorubber.in.";
  if (bytes <= 0) return "That file is empty.";
  return null;
}

/**
 * The parameters the browser posts to Cloudinary, signed. Everything the
 * signature covers is fixed here — the client can change none of it without
 * the upload being refused.
 */
export function signUpload(filename: string, bytes: number) {
  const reason = rejectReason(filename, bytes);
  if (reason) return { ok: false as const, message: reason };
  if (!isAttachmentsConfigured()) return { ok: false as const, message: "Attachments are not available right now — please email the file to info@margorubber.in." };

  const e = ext(filename);
  const resourceType = FORMATS[e];
  // A raw asset is delivered by its public_id alone, so it carries the
  // extension; an image gets its format from the file.
  const publicId = `${FOLDER}/${crypto.randomUUID()}${resourceType === "raw" ? `.${e}` : ""}`;
  const params: Record<string, string | number> = {
    timestamp: Math.floor(Date.now() / 1000),
    public_id: publicId,
    type: "private",
    allowed_formats: Object.keys(FORMATS).join(","),
  };
  const { api_key, api_secret, cloud_name } = cloudinary.config();
  const signature = cloudinary.utils.api_sign_request(params, api_secret as string);

  return {
    ok: true as const,
    upload: {
      url: `https://api.cloudinary.com/v1_1/${cloud_name}/${resourceType}/upload`,
      fields: { ...params, api_key: String(api_key), signature },
      publicId,
      resourceType,
    },
  };
}

/**
 * The asset the form claims to have uploaded, as Cloudinary holds it — or
 * null when it is not there, not ours, or not what was claimed.
 */
export async function verifyUpload(ref: AttachmentRef): Promise<{ format: string | null; bytes: number } | null> {
  if (!isAttachmentsConfigured()) return null;
  try {
    const res = (await cloudinary.api.resource(ref.publicId, { resource_type: ref.resourceType, type: "private" })) as {
      public_id: string;
      bytes: number;
      format?: string;
    };
    if (res.public_id !== ref.publicId || res.bytes > MAX_BYTES || res.bytes <= 0) return null;
    return { format: res.format ?? null, bytes: res.bytes };
  } catch {
    return null;
  }
}

/**
 * Links for the desk: a download that expires in an hour, and for an image
 * a signed preview. Neither is guessable and neither is stored.
 */
export function attachmentLinks(att: Pick<AttachmentRow, "public_id" | "resource_type" | "format" | "original_filename">) {
  if (!isAttachmentsConfigured()) return { download: null, preview: null };
  const expiresAt = Math.floor(Date.now() / 1000) + 60 * 60;
  const download = cloudinary.utils.private_download_url(att.public_id, att.resource_type === "raw" ? "" : (att.format ?? ""), {
    resource_type: att.resource_type,
    type: "private",
    expires_at: expiresAt,
    attachment: true,
  });
  const preview =
    att.resource_type === "image"
      ? cloudinary.url(att.public_id, {
          type: "private",
          resource_type: "image",
          secure: true,
          sign_url: true,
          transformation: [{ width: 640, height: 480, crop: "limit", fetch_format: "auto", quality: "auto" }],
        })
      : null;
  return { download, preview };
}

/** "2.4 MB", for the desk and the email. */
export function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}
