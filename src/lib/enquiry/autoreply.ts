import type { MappedEnquiry } from "./sources";
import { INDUSTRY_MENU } from "@/content/navigation";
import { enquiryFingerprint, isDuplicateSend } from "./dedupe";

/**
 * AUTO-REPLY TO THE BUYER
 *
 * A personal acknowledgement, sent the moment an enquiry is saved, that plays
 * back what the buyer asked for: their name, company, product, quantity,
 * industry and their own words. It tells them the enquiry landed and gives
 * them a direct line (WhatsApp / phone) to the person who decides.
 *
 * Sent through the same Resend account as the internal notification, from
 * ENQUIRY_FROM (which must be on the verified domain — Resend's shared test
 * sender cannot email arbitrary addresses, so without ENQUIRY_FROM nothing is
 * sent). Replies go to ENQUIRY_TO, i.e. Margo's own inbox, never to the robot.
 *
 * Never fatal: the enquiry is already stored and Margo already notified. A
 * failed acknowledgement is logged and the visitor still sees success.
 *
 * Set AUTOREPLY_OFF=true in Vercel to switch it off without a code change.
 */

const CONTACT_NAME = "Mr. Ayyaz Shaikh";
const CONTACT_TITLE = "CEO, Margo Rubber Group";
const CONTACT_PHONE_DISPLAY = "+91 96655 79276";
const CONTACT_PHONE_TEL = "+919665579276";
const CONTACT_WHATSAPP = "https://wa.me/919665579276";
const SITE = "https://www.margorubber.com";

const escape = (s: string) =>
  s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );

/** The industry, from the form's own field or the industry page it was sent from. */
function industryOf(e: MappedEnquiry): string | undefined {
  const own = e.raw.industry ?? e.raw.sector;
  if (own && own !== "Other") return own;
  const fromPage = INDUSTRY_MENU.find((i) => e.page.startsWith(i.href));
  return fromPage?.label;
}

/** "Not sure yet" and similar are not quantities worth repeating back. */
function quantityOf(e: MappedEnquiry): string | undefined {
  const q = e.quantity?.trim();
  if (!q || /not sure/i.test(q)) return undefined;
  return q;
}

/** The sentence that plays the request back, built from whatever was given. */
function requestLine(e: MappedEnquiry): { html: string; text: string } {
  if (e.source === "catalogue") {
    const s = "We received your request for the Margo Rubber product catalogue.";
    return { html: s, text: s };
  }

  const product = e.product?.trim();
  const qty = quantityOf(e);
  const industry = industryOf(e);

  if (!product && !industry) {
    const s = "We received your enquiry and our engineering team is reviewing it.";
    return { html: s, text: s };
  }

  const parts = {
    product: product ? `<strong>${escape(product)}</strong>` : "our rubber components",
    productText: product ?? "our rubber components",
    qty: qty ? ` (quantity: ${escape(qty)})` : "",
    qtyText: qty ? ` (quantity: ${qty})` : "",
    ind: industry ? ` for your <strong>${escape(industry)}</strong> application` : "",
    indText: industry ? ` for your ${industry} application` : "",
  };

  return {
    html: `We received your enquiry regarding ${parts.product}${parts.qty}${parts.ind}.`,
    text: `We received your enquiry regarding ${parts.productText}${parts.qtyText}${parts.indText}.`,
  };
}

/** Their own words, quoted back (trimmed), so they can see what we received. */
function theirMessage(e: MappedEnquiry): string | undefined {
  const m = (e.message ?? e.raw.notes ?? "").trim();
  if (!m) return undefined;
  return m.length > 600 ? `${m.slice(0, 600)}…` : m;
}

export async function sendAutoReply(enquiry: MappedEnquiry): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.ENQUIRY_FROM;
  if (!key || !from || process.env.AUTOREPLY_OFF === "true") return;

  const name = enquiry.name?.trim();
  const greeting = name ? `Dear ${name},` : "Dear Sir / Madam,";
  const line = requestLine(enquiry);
  const message = theirMessage(enquiry);
  const company = enquiry.company?.trim();

  const subject = enquiry.source === "catalogue"
    ? "Your Margo Rubber catalogue request"
    : `We received your enquiry${company ? ` — ${company}` : ""} | Margo Rubber`;

  const p = 'style="margin:0 0 14px"';
  const html = `
  <div style="font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;font-size:15px;line-height:1.6;color:#111;max-width:600px">
    <p ${p}>${escape(greeting)}</p>
    <p ${p}>Greetings from Margo Rubber!</p>
    <p ${p}>Thank you for reaching out${company ? ` on behalf of <strong>${escape(company)}</strong>` : ""} and expressing your interest in our products.</p>
    <p ${p}>${line.html}</p>
    ${
      message
        ? `<p style="margin:0 0 6px;color:#6a6a6a;font-size:13px">Your message:</p>
           <blockquote style="margin:0 0 14px;padding:10px 14px;border-left:3px solid #2bbcc4;background:#f4fbfb;color:#333;white-space:pre-wrap">${escape(message)}</blockquote>`
        : ""
    }
    <p ${p}>We would be happy to assist you with your requirement.</p>
    <p ${p}>For further discussions regarding product specifications, pricing, and availability, you may directly get in touch with our CEO:</p>
    <p ${p}>
      <strong>${CONTACT_NAME}</strong><br />
      ${CONTACT_TITLE}<br />
      Contact / WhatsApp: <a href="tel:${CONTACT_PHONE_TEL}" style="color:#1b767b">${CONTACT_PHONE_DISPLAY}</a>
      &nbsp;·&nbsp; <a href="${CONTACT_WHATSAPP}" style="color:#1b767b">Chat on WhatsApp</a>
    </p>
    <p ${p}>Alternatively, you may share any additional technical specifications, drawings or requirements by replying to this email, and our team will be happy to assist you.</p>
    <p ${p}>We look forward to hearing from you and exploring the opportunity to work together.</p>
    <p style="margin:0">Best regards,<br /><strong>Team Margo Rubber</strong><br />
      Website: <a href="${SITE}" style="color:#1b767b">www.margorubber.com</a></p>
  </div>`;

  const text = [
    greeting,
    "",
    "Greetings from Margo Rubber!",
    `Thank you for reaching out${company ? ` on behalf of ${company}` : ""} and expressing your interest in our products.`,
    line.text,
    ...(message ? ["", "Your message:", message] : []),
    "",
    "We would be happy to assist you with your requirement.",
    "For further discussions regarding product specifications, pricing, and availability, you may directly get in touch with our CEO:",
    "",
    CONTACT_NAME,
    CONTACT_TITLE,
    `Contact / WhatsApp: ${CONTACT_PHONE_DISPLAY}`,
    "",
    "Alternatively, you may share any additional technical specifications, drawings or requirements by replying to this email, and our team will be happy to assist you.",
    "We look forward to hearing from you and exploring the opportunity to work together.",
    "",
    "Best regards,",
    "Team Margo Rubber",
    "Website: www.margorubber.com",
  ].join("\n");

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        // Identical enquiry within 24h → the buyer is acknowledged once (see dedupe.ts).
        "Idempotency-Key": `autoreply-${enquiryFingerprint(enquiry)}`,
      },
      body: JSON.stringify({
        from,
        to: [enquiry.email],
        subject,
        html,
        text,
        // The buyer's reply lands in Margo's inbox, not the sending address.
        ...(process.env.ENQUIRY_TO ? { reply_to: process.env.ENQUIRY_TO } : {}),
      }),
      signal: AbortSignal.timeout(8_000),
    });
    if (isDuplicateSend(res.status)) {
      console.warn("[enquiry] duplicate auto-reply suppressed for", enquiry.email);
    } else if (!res.ok) {
      console.error("[enquiry] auto-reply failed:", res.status, (await res.text()).slice(0, 200));
    }
  } catch (err) {
    console.error("[enquiry] auto-reply failed:", err instanceof Error ? err.message : String(err));
  }
}
