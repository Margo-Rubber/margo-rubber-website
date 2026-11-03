/**
 * What the enquiry forms accept for an attachment, with no dependencies.
 *
 * Kept apart from attachment-ref.ts because that file imports zod: the
 * upload field imported these two constants from it, and that alone put the
 * whole of zod (~370 KB) into the first load of every page with a form
 * (3rd Shade fix 8, 3 Nov 2026).
 */

export const MAX_BYTES = 10 * 1024 * 1024;

/** What the form accepts (sheet 01 §11: ".pdf,.dwg,.dxf,image/*", max 10MB). */
export const ACCEPT = ".pdf,.dwg,.dxf,image/*";
