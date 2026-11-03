import { z } from "zod";

/**
 * The reference to an uploaded file that travels from the form to the
 * endpoint and into enquiry_attachments. Kept apart from attachments.ts,
 * which loads the Cloudinary SDK, so the form's client code and the
 * payload schema can share it without pulling a Node library into the
 * browser bundle.
 */

// The limits live in attachment-limits.ts, which has no zod, so the
// browser can import them on their own.
import { MAX_BYTES } from "./attachment-limits";
export { ACCEPT, MAX_BYTES } from "./attachment-limits";

export const attachmentRefSchema = z.object({
  publicId: z.string().regex(/^enquiries\/[a-f0-9-]{36}(\.[a-z0-9]{1,5})?$/),
  resourceType: z.enum(["image", "raw"]),
  originalFilename: z.string().min(1).max(255),
  bytes: z.number().int().positive().max(MAX_BYTES),
  mime: z.string().max(120).optional(),
});
export type AttachmentRef = z.infer<typeof attachmentRefSchema>;
