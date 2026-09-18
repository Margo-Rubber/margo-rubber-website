import { neon } from "@neondatabase/serverless";
import type { MappedEnquiry } from "./sources";
import type { AttachmentRef, AttachmentRow } from "./attachments";

/**
 * PERSISTENCE
 *
 * Two adapters behind one interface.
 *
 *  · Postgres, when DATABASE_URL is set. Neon's serverless driver, which
 *    talks SQL over HTTP rather than holding a TCP connection — the right
 *    shape for a serverless deploy target, Vercel included.
 *
 *  · A JSON file, in development only, when it is not. This exists so the
 *    whole loop — form, endpoint, storage, dashboard — can be built and
 *    verified before anyone has created a Neon account. It is NOT a fallback:
 *    in production an unset DATABASE_URL still returns `unconfigured` and the
 *    endpoint treats that as the loud failure it is.
 *
 * The driver is used rather than hand-rolling Neon's HTTP protocol. An
 * earlier draft did the latter from memory, which is the kind of guess that
 * works until the provider changes a header and then fails silently.
 */

export const STATUSES = ["new", "contacted", "quoted", "won", "lost"] as const;
export type Status = (typeof STATUSES)[number];

export type EnquiryRow = {
  id: string;
  created_at: string;
  source: string;
  page: string;
  referrer: string | null;
  user_agent: string | null;
  name: string | null;
  company: string | null;
  email: string;
  phone: string | null;
  country: string | null;
  product: string | null;
  quantity: string | null;
  message: string | null;
  file_url: string | null;
  status: Status;
  crm_id: string | null;
  crm_synced_at: string | null;
  raw: Record<string, string>;
  /** Development file store only; Postgres keeps these in enquiry_attachments. */
  attachments?: AttachmentRow[];
};

export type StoreResult =
  | { stored: true; id: string }
  | { stored: false; reason: "unconfigured" }
  | { stored: false; reason: "error"; message: string };

export function isStoreConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

/**
 * The JSON file is only ever reachable outside production. Guarded here in
 * one place so no call site has to remember, and so a production deploy that
 * loses its DATABASE_URL fails loudly instead of quietly writing leads to a
 * file on an ephemeral filesystem.
 */
function devStoreEnabled(): boolean {
  return !process.env.DATABASE_URL && process.env.NODE_ENV !== "production";
}

const DEV_FILE = ".enquiries.dev.json";

async function devRead(): Promise<EnquiryRow[]> {
  const { readFile } = await import("node:fs/promises");
  try {
    return JSON.parse(await readFile(DEV_FILE, "utf8")) as EnquiryRow[];
  } catch {
    return [];
  }
}

async function devWrite(rows: EnquiryRow[]): Promise<void> {
  const { writeFile } = await import("node:fs/promises");
  await writeFile(DEV_FILE, JSON.stringify(rows, null, 2), "utf8");
}

/* ── Write ───────────────────────────────────────────────────────────────── */

export async function storeEnquiry(
  enquiry: MappedEnquiry,
  extra: { userAgent?: string; fileUrl?: string },
): Promise<StoreResult> {
  const url = process.env.DATABASE_URL;

  if (!url) {
    if (!devStoreEnabled()) return { stored: false, reason: "unconfigured" };

    const rows = await devRead();
    const row: EnquiryRow = {
      // `crypto.randomUUID` rather than a counter: ids must not be guessable
      // from one another even in development, because the dashboard routes
      // by id and habits formed here carry into production.
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      source: enquiry.source,
      page: enquiry.page,
      referrer: enquiry.referrer ?? null,
      user_agent: extra.userAgent ?? null,
      name: enquiry.name ?? null,
      company: enquiry.company ?? null,
      email: enquiry.email,
      phone: enquiry.phone ?? null,
      country: enquiry.country ?? null,
      product: enquiry.product ?? null,
      quantity: enquiry.quantity ?? null,
      message: enquiry.message ?? null,
      file_url: extra.fileUrl ?? null,
      status: "new",
      crm_id: null,
      crm_synced_at: null,
      raw: enquiry.raw,
    };
    rows.unshift(row);
    await devWrite(rows);
    return { stored: true, id: row.id };
  }

  try {
    const sql = neon(url);

    // Parameterised throughout. `raw` is passed as a JS object and serialised
    // by the driver, so a message containing quotes or braces cannot break the
    // statement.
    const rows = await sql`
      INSERT INTO enquiries
        (source, page, referrer, user_agent,
         name, company, email, phone, country, product, quantity, message,
         file_url, raw)
      VALUES
        (${enquiry.source}, ${enquiry.page}, ${enquiry.referrer ?? null},
         ${extra.userAgent ?? null},
         ${enquiry.name ?? null}, ${enquiry.company ?? null}, ${enquiry.email},
         ${enquiry.phone ?? null}, ${enquiry.country ?? null},
         ${enquiry.product ?? null}, ${enquiry.quantity ?? null},
         ${enquiry.message ?? null},
         ${extra.fileUrl ?? null}, ${JSON.stringify(enquiry.raw)}::jsonb)
      RETURNING id
    `;

    const id = (rows as Array<{ id: string }>)[0]?.id;
    if (!id) {
      return { stored: false, reason: "error", message: "insert returned no id" };
    }
    return { stored: true, id };
  } catch (err) {
    return {
      stored: false,
      reason: "error",
      message: err instanceof Error ? err.message : String(err),
    };
  }
}

/* ── Read ────────────────────────────────────────────────────────────────── */

export type ListQuery = {
  status?: Status;
  source?: string;
  /** Matched against name, company, email and message. */
  q?: string;
  limit?: number;
  offset?: number;
};

/**
 * `error` carries a database failure to the caller rather than throwing.
 *
 * The dashboard renders during a request; an exception here becomes a bare
 * 500 with no indication of what went wrong, which is exactly what happened
 * on the first Vercel deploy. An operator seeing "cannot reach the database"
 * can act on it. An operator seeing Vercel's error page cannot.
 */
export type ListResult = { rows: EnquiryRow[]; total: number; error?: string };

export async function listEnquiries(query: ListQuery = {}): Promise<ListResult> {
  const { status, source, q, limit = 50, offset = 0 } = query;
  const url = process.env.DATABASE_URL;

  if (!url) {
    if (!devStoreEnabled()) return { rows: [], total: 0 };
    let rows = await devRead();
    if (status) rows = rows.filter((r) => r.status === status);
    if (source) rows = rows.filter((r) => r.source === source);
    if (q) {
      const needle = q.toLowerCase();
      rows = rows.filter((r) =>
        [r.name, r.company, r.email, r.message]
          .filter(Boolean)
          .some((v) => v!.toLowerCase().includes(needle)),
      );
    }
    return { rows: rows.slice(offset, offset + limit), total: rows.length };
  }

  try {
    const sql = neon(url);

  // Every filter is optional, so each predicate is written to be a no-op when
  // its parameter is null. That keeps this as one parameterised statement
  // rather than string-built SQL, which is where injection bugs live.
  const rows = (await sql`
    SELECT * FROM enquiries
    WHERE (${status ?? null}::text IS NULL OR status = ${status ?? null})
      AND (${source ?? null}::text IS NULL OR source = ${source ?? null})
      AND (${q ?? null}::text IS NULL OR (
            coalesce(name, '')    ILIKE ${"%" + (q ?? "") + "%"} OR
            coalesce(company, '') ILIKE ${"%" + (q ?? "") + "%"} OR
            email                 ILIKE ${"%" + (q ?? "") + "%"} OR
            coalesce(message, '') ILIKE ${"%" + (q ?? "") + "%"}))
    ORDER BY created_at DESC
    LIMIT ${limit} OFFSET ${offset}
  `) as EnquiryRow[];

  const counted = (await sql`
    SELECT count(*)::int AS total FROM enquiries
    WHERE (${status ?? null}::text IS NULL OR status = ${status ?? null})
      AND (${source ?? null}::text IS NULL OR source = ${source ?? null})
      AND (${q ?? null}::text IS NULL OR (
            coalesce(name, '')    ILIKE ${"%" + (q ?? "") + "%"} OR
            coalesce(company, '') ILIKE ${"%" + (q ?? "") + "%"} OR
            email                 ILIKE ${"%" + (q ?? "") + "%"} OR
            coalesce(message, '') ILIKE ${"%" + (q ?? "") + "%"}))
  `) as Array<{ total: number }>;

    return { rows, total: counted[0]?.total ?? 0 };
  } catch (err) {
    return {
      rows: [],
      total: 0,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

export async function getEnquiry(id: string): Promise<EnquiryRow | null> {
  const url = process.env.DATABASE_URL;

  if (!url) {
    if (!devStoreEnabled()) return null;
    return (await devRead()).find((r) => r.id === id) ?? null;
  }

  try {
    const sql = neon(url);
    const rows = (await sql`
      SELECT * FROM enquiries WHERE id = ${id}::uuid
    `) as EnquiryRow[];
    return rows[0] ?? null;
  } catch {
    // Indistinguishable from "not found" to the caller, which renders a 404.
    // Acceptable: the list page above states the database problem plainly,
    // and that is where an operator arrives from.
    return null;
  }
}

/** Counts per status, for the dashboard's summary row. Always all five keys. */
export async function countByStatus(): Promise<Record<Status, number>> {
  const empty = Object.fromEntries(STATUSES.map((s) => [s, 0])) as Record<
    Status,
    number
  >;
  const url = process.env.DATABASE_URL;

  if (!url) {
    if (!devStoreEnabled()) return empty;
    for (const r of await devRead()) empty[r.status] = (empty[r.status] ?? 0) + 1;
    return empty;
  }

  try {
    const sql = neon(url);
    const rows = (await sql`
      SELECT status, count(*)::int AS n FROM enquiries GROUP BY status
    `) as Array<{ status: Status; n: number }>;
    for (const r of rows) empty[r.status] = r.n;
  } catch {
    // Zeroes. listEnquiries reports the reason; two identical error banners
    // on one page would be noise.
  }
  return empty;
}

/* ── Update ──────────────────────────────────────────────────────────────── */

export async function setStatus(
  id: string,
  status: Status,
): Promise<{ ok: boolean; message?: string }> {
  // Validated against the list rather than trusted, because this value
  // reaches a CHECK constraint in Postgres and a rejected write there would
  // surface as an opaque 500 rather than a useful message.
  if (!STATUSES.includes(status)) {
    return { ok: false, message: `Unknown status: ${status}` };
  }

  const url = process.env.DATABASE_URL;

  if (!url) {
    if (!devStoreEnabled()) return { ok: false, message: "Store not configured" };
    const rows = await devRead();
    const row = rows.find((r) => r.id === id);
    if (!row) return { ok: false, message: "Not found" };
    row.status = status;
    await devWrite(rows);
    return { ok: true };
  }

  try {
    const sql = neon(url);
    const rows = await sql`
      UPDATE enquiries SET status = ${status} WHERE id = ${id}::uuid
      RETURNING id
    `;
    if ((rows as unknown[]).length === 0) {
      return { ok: false, message: "Not found" };
    }
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      message: err instanceof Error ? err.message : String(err),
    };
  }
}

/* ── Attachments ─────────────────────────────────────────────────────────── */

/**
 * Records the file the visitor attached, once `verifyUpload` has confirmed
 * it exists. A failure here is logged, not fatal: the enquiry row is the
 * system of record and already stored; the desk shows the file as missing.
 */
export async function storeAttachment(
  enquiryId: string,
  ref: AttachmentRef,
  verified: { format: string | null; bytes: number },
): Promise<boolean> {
  const url = process.env.DATABASE_URL;
  const row: AttachmentRow = {
    id: crypto.randomUUID(),
    enquiry_id: enquiryId,
    public_id: ref.publicId,
    resource_type: ref.resourceType,
    format: verified.format,
    original_filename: ref.originalFilename,
    bytes: verified.bytes,
    mime: ref.mime ?? null,
    created_at: new Date().toISOString(),
  };

  if (!url) {
    if (!devStoreEnabled()) return false;
    const rows = await devRead();
    const target = rows.find((r) => r.id === enquiryId);
    if (!target) return false;
    target.attachments = [...(target.attachments ?? []), row];
    await devWrite(rows);
    return true;
  }

  try {
    const sql = neon(url);
    await sql`
      INSERT INTO enquiry_attachments
        (enquiry_id, public_id, resource_type, format, original_filename, bytes, mime)
      VALUES
        (${enquiryId}::uuid, ${row.public_id}, ${row.resource_type}, ${row.format},
         ${row.original_filename}, ${row.bytes}, ${row.mime})
    `;
    return true;
  } catch (err) {
    console.error("[enquiry] attachment store failed:", err instanceof Error ? err.message : err);
    return false;
  }
}

export async function listAttachments(enquiryId: string): Promise<AttachmentRow[]> {
  const url = process.env.DATABASE_URL;
  if (!url) {
    if (!devStoreEnabled()) return [];
    return (await devRead()).find((r) => r.id === enquiryId)?.attachments ?? [];
  }
  try {
    const sql = neon(url);
    return (await sql`
      SELECT * FROM enquiry_attachments
      WHERE enquiry_id = ${enquiryId}::uuid
      ORDER BY created_at
    `) as AttachmentRow[];
  } catch {
    return [];
  }
}
