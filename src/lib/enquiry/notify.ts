import type { MappedEnquiry } from "./sources";
import { FIELD_MAP } from "./sources";

/**
 * NOTIFICATION
 *
 * Emails the enquiry to Margo, and this is the step that makes the whole
 * pipeline safe. It runs BEFORE the webhook and is waited on: if the CRM is
 * down, the automation misconfigured, or the webhook URL wrong, the enquiry has
 * still reached a person in a system they check daily and can search.
 *
 * Plain fetch rather than an SDK. Resend's send endpoint is one POST, and a
 * dependency for that would be a dependency to keep patched for no gain.
 *
 * DEGRADATION. Unset `RESEND_API_KEY` returns `{ sent: false, reason:
 * "unconfigured" }` so local development works without an account.
 */

export type NotifyResult =
  | { sent: true; id: string }
  | { sent: false; reason: "unconfigured" }
  | { sent: false; reason: "error"; message: string };

export function isNotifyConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.ENQUIRY_TO);
}

const escape = (s: string) =>
  s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );

/**
 * Every submitted field, in the form's own labels, not just the eight that
 * earned a column. The person reading this needs what the buyer actually
 * wrote, not the subset the schema happens to model.
 */
function fieldRows(enquiry: MappedEnquiry): string {
  const map = FIELD_MAP[enquiry.source];
  return Object.entries(enquiry.raw)
    .filter(([, v]) => v.trim() !== "")
    .map(([key, value]) => {
      const canonical = map[key];
      const label = key.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());
      return `<tr>
        <td style="padding:6px 14px 6px 0;color:#6a6a6a;vertical-align:top;white-space:nowrap">${escape(label)}${canonical ? "" : " *"}</td>
        <td style="padding:6px 0;color:#111"><strong>${escape(value)}</strong></td>
      </tr>`;
    })
    .join("");
}

export async function notifyEnquiry(
  enquiry: MappedEnquiry,
  extra: {
    fileUrl?: string;
    /** The attached drawing, by name — the file itself is opened from the desk, behind its login. */
    attachment?: { name: string; size: string };
    enquiryId?: string;
    stored: boolean;
  },
): Promise<NotifyResult> {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.ENQUIRY_TO;
  if (!key || !to) return { sent: false, reason: "unconfigured" };

  const from =
    process.env.ENQUIRY_FROM ??
    "Margo Rubber Products Website <onboarding@resend.dev>";

  const who = enquiry.company ?? enquiry.name ?? enquiry.email;
  const subject = `Enquiry from ${who}${enquiry.country ? ` (${enquiry.country})` : ""}`;

  const html = `
    <div style="font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;font-size:15px;line-height:1.6;color:#111">
      <p style="margin:0 0 4px;color:#6a6a6a;font-size:13px">
        New enquiry from the website, submitted at
        <strong>${escape(enquiry.page)}</strong>
      </p>
      <h2 style="margin:0 0 18px;font-size:19px">${escape(who)}</h2>

      <table style="border-collapse:collapse;margin-bottom:20px">${fieldRows(enquiry)}</table>

      ${
        extra.fileUrl
          ? `<p style="margin:0 0 18px"><a href="${escape(extra.fileUrl)}" style="color:#1b767b">Download the attached drawing</a></p>`
          : ""
      }
      ${
        extra.attachment
          ? `<p style="margin:0 0 18px">Attached: <strong>${escape(extra.attachment.name)}</strong> (${escape(extra.attachment.size)}) — open this enquiry in the desk to download it.</p>`
          : ""
      }

      <hr style="border:none;border-top:1px solid #e4e4e4;margin:22px 0" />
      <p style="margin:0;color:#8a8a8a;font-size:12px">
        Reply directly to this email to answer ${escape(enquiry.email)}.<br />
        Source: ${escape(enquiry.source)}${enquiry.referrer ? ` &middot; referred from ${escape(enquiry.referrer)}` : ""}
        ${extra.enquiryId ? `<br />Reference: ${escape(extra.enquiryId)}` : ""}
        ${
          extra.stored
            ? ""
            : `<br /><strong style="color:#b3261e">Not saved to the database.</strong> This email is the only copy.`
        }
      </p>
    </div>`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject,
        html,
        // So hitting Reply in the inbox answers the buyer, not the robot.
        reply_to: enquiry.email,
      }),
      signal: AbortSignal.timeout(8_000),
    });

    if (!res.ok) {
      return {
        sent: false,
        reason: "error",
        message: `${res.status} ${(await res.text()).slice(0, 200)}`,
      };
    }

    const body = (await res.json()) as { id?: string };
    return { sent: true, id: body.id ?? "" };
  } catch (err) {
    return {
      sent: false,
      reason: "error",
      message: err instanceof Error ? err.message : String(err),
    };
  }
}

/**
 * Forwards the complete payload to whatever is configured downstream: Make,
 * n8n, a CRM endpoint. Fire and forget by design.
 *
 * The whole payload goes, not the subset the CRM needs today. A future
 * integration then already has its data waiting in the automation tool,
 * instead of requiring a website change, a deploy and a retest to add one
 * field. That is what makes "integrations are configuration, not code" true
 * rather than aspirational.
 */
export async function forwardEnquiry(
  enquiry: MappedEnquiry,
  extra: { fileUrl?: string; enquiryId?: string; userAgent?: string },
): Promise<void> {
  const url = process.env.WEBHOOK_URL;
  if (!url) return;

  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: extra.enquiryId ?? null,
        receivedAt: new Date().toISOString(),
        source: enquiry.source,
        page: enquiry.page,
        referrer: enquiry.referrer ?? null,
        userAgent: extra.userAgent ?? null,
        fileUrl: extra.fileUrl ?? null,
        // Canonical columns, for straightforward mapping in the automation.
        contact: {
          name: enquiry.name ?? null,
          company: enquiry.company ?? null,
          email: enquiry.email,
          phone: enquiry.phone ?? null,
          country: enquiry.country ?? null,
        },
        enquiry: {
          product: enquiry.product ?? null,
          quantity: enquiry.quantity ?? null,
          message: enquiry.message ?? null,
        },
        // And everything, verbatim.
        raw: enquiry.raw,
      }),
      signal: AbortSignal.timeout(5_000),
    });
  } catch {
    // Intentionally swallowed. The enquiry is already in the database and in
    // an inbox; a webhook failure must not turn a captured lead into an error
    // page for the visitor. The dashboard surfaces it via crm_synced_at.
  }
}
