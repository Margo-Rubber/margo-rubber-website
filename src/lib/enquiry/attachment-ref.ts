import { z } from "zod";

/**
 * The reference to an uploaded file that travels from the form to the
 * endpoint and into enquiry_attachments. Kept apart from attachments.ts,
 * which loads the Cloudinary SDK, so the form's client code and the
 * payload schema can share it without pulling a Node library into the
 * browser bundle.
 */

export const MAX_BYTES = 10 * 1024 * 1024;

/** What the form accepts (sheet 01 §11: ".pdf,.dwg,.dxf,image/*", max 10MB). */
export const ACCEPT = ".pdf,.dwg,.dxf,image/*";

export const attachmentRefSchema = z.object({
  publicId: z.string().regex(/^enquiries\/[a-f0-9-]{36}(\.[a-z0-9]{1,5})?$/),
  resourceType: z.enum(["image", "raw"]),
  originalFilename: z.string().min(1).max(255),
  bytes: z.number().int().positive().max(MAX_BYTES),
  mime: z.string().max(120).optional(),
});
export type AttachmentRef = z.infer<typeof attachmentRefSchema>;
