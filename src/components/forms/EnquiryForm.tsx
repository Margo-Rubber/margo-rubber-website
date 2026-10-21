"use client";

import {
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { track } from "@/lib/analytics";

/**
 * ENQUIRY FORM
 *
 * The submission behaviour for all nine forms on the site, in one place.
 *
 * Only the `<form>` element itself is a client component. Everything inside it
 * is passed through as `children`, so the eight sections that render these keep
 * their own markup, their own layout classes, and — for the four that are
 * Server Components — stay server-rendered. Wrapping is the cheapest possible
 * boundary: nothing about the fields crosses it.
 *
 * Fields are read from the DOM on submit rather than tracked in React state.
 * With inputs living in `children` there is nothing to bind to, and a form
 * this size gains nothing from controlled inputs. `FormData` already knows
 * every named field.
 */

type Status = "idle" | "submitting" | "error" | "success";

type Ctx = {
  status: Status;
  message: string | null;
  errors: Record<string, string>;
  /** What was sent, once it has been — for a confirmation that names the address it replies to. */
  submitted: Record<string, string>;
};

const EnquiryContext = createContext<Ctx>({
  status: "idle",
  message: null,
  errors: {},
  submitted: {},
});

export function useEnquiry() {
  return useContext(EnquiryContext);
}

export function EnquiryForm({
  source,
  children,
  className = "",
  /** Where to send the visitor on success; `null` stays on the page and shows the form's own confirmation. */
  redirectTo = "/thank-you" as string | null,
  /**
   * Return false to cancel this submit. Exists for the multi-step RFQ form on
   * /contact, where the same button advances a step before it ever submits.
   */
  onBeforeSubmit,
}: {
  source: string;
  children: ReactNode;
  className?: string;
  redirectTo?: string | null;
  onBeforeSubmit?: () => boolean;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<Record<string, string>>({});

  // When the form first rendered. The endpoint rejects submissions faster than
  // a person can type, and this is how it knows. Set in an effect so it is the
  // moment the visitor saw the form, not the moment the server rendered it.
  const shownAt = useRef<number | null>(null);
  useEffect(() => {
    shownAt.current = Date.now();
  }, []);

  // Set synchronously, unlike `status`. A double-click or a repeated Enter fires
  // several submit events before React re-renders, and every one of them still
  // sees status === "idle" — each became its own POST and its own set of emails.
  const inFlight = useRef(false);
  /** Enquiries already counted as a lead in this visit (D1). */
  const leadsSent = useRef(new Set<string>());

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current || status === "submitting") return;
    if (onBeforeSubmit && !onBeforeSubmit()) return;

    const form = event.currentTarget;
    const data = new FormData(form);

    const fields: Record<string, string> = {};
    let honeypot = "";
    let attachment: unknown;

    for (const [key, value] of data.entries()) {
      if (typeof value !== "string") continue; // the file itself never posts here
      if (key === "company_website") {
        honeypot = value;
        continue;
      }
      // The AttachmentField's hidden inputs: the uploaded file's reference,
      // and whether an upload is still in flight (see AttachmentField.tsx).
      if (key === "attachment") {
        if (value) attachment = JSON.parse(value);
        continue;
      }
      if (key === "attachment_state") {
        if (value === "uploading") {
          setStatus("error");
          setMessage("Your file is still uploading — give it a moment, then send again.");
          return;
        }
        continue;
      }
      fields[key] = value;
    }

    inFlight.current = true;
    setStatus("submitting");
    setMessage(null);
    setErrors({});

    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source,
          fields,
          company_website: honeypot,
          attachment,
          meta: {
            page: window.location.pathname,
            referrer: document.referrer || undefined,
            elapsedMs: shownAt.current
              ? Date.now() - shownAt.current
              : undefined,
          },
        }),
      });

      const body = (await res.json()) as {
        ok: boolean;
        message?: string;
        errors?: Record<string, string>;
      };

      if (body.ok) {
        setSubmitted(fields);
        setStatus("success");
        form.reset();
        // Once per enquiry (D1): the same content sent again — a double
        // click, a back-button resend — is the same lead, not a new one.
        const key = `${source}:${JSON.stringify(fields)}`;
        if (!leadsSent.current.has(key)) {
          leadsSent.current.add(key);
          track("generate_lead", { form: source });
        }
        if (redirectTo) router.push(redirectTo);
        return;
      }

      setStatus("error");
      setErrors(body.errors ?? {});
      setMessage(body.message ?? "Something went wrong. Please try again.");
    } catch {
      // Network failure, offline, or the request was blocked. The enquiry did
      // not reach us, so say so plainly and give a route that does not depend
      // on this working.
      setStatus("error");
      setMessage(
        "We could not reach the server. Please check your connection, or email us at info@margorubber.in.",
      );
    } finally {
      inFlight.current = false;
    }
  }

  return (
    <EnquiryContext.Provider value={{ status, message, errors, submitted }}>
      <form onSubmit={onSubmit} noValidate className={className}>
        {/* Honeypot. Hidden from people, irresistible to bots. `display:none`
            rather than `type="hidden"`, which better bots skip. Also removed
            from the tab order and from autofill. */}
        <div className="hidden" aria-hidden>
          <label htmlFor={`cw-${source}`}>Company website</label>
          <input
            id={`cw-${source}`}
            name="company_website"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        {children}

        <EnquiryConsent />
      </form>
    </EnquiryContext.Provider>
  );
}

/**
 * PRIVACY NOTICE + MARKETING OPT-IN — on every form, added here once rather
 * than in nine sections.
 *
 * India's DPDP Act expects notice at or before the point data is collected,
 * and these forms also take drawing uploads, so the notice sits with the
 * submit button and links the policy. The marketing box is separate and
 * unticked: the Privacy Policy promises nobody is added to a marketing list
 * without asking, and a pre-ticked or bundled box would not be asking.
 *
 * Ticked, it posts `marketingOptIn=Yes`, which lands in the enquiry's `raw`
 * fields and the notification email like any unmapped field (sources.ts).
 * Unticked, nothing is sent. Hidden once a form shows its own confirmation.
 */
function EnquiryConsent() {
  const { status } = useEnquiry();
  const id = useId();
  if (status === "success") return null;
  return (
    <div className="margo-consent">
      <label htmlFor={`${id}-mkt`} className="margo-consent-opt">
        <input id={`${id}-mkt`} type="checkbox" name="marketingOptIn" value="Yes" />
        <span>
          Email me occasional product and compound updates. Optional; unsubscribe any time.
        </span>
      </label>
      <p className="margo-consent-note">
        By submitting, you agree to our{" "}
        <Link href="/legal/privacy-policy">Privacy Policy</Link>. Drawings and files you
        upload are treated as confidential.
      </p>
    </div>
  );
}

/**
 * The post-submit state, in place of the form: "Received. The documents you
 * selected will follow within one business day to {email}." (sheet 07 §06)
 * — `{email}` is the address the visitor gave. Renders the children until
 * the enquiry is sent; a form with no `text` keeps its redirect instead.
 */
export function EnquiryReceived({
  text,
  action,
  children,
}: {
  text?: string;
  /**
   * A file to hand over once the enquiry is in (the catalogue PDF). Shown as
   * a button, and also started automatically — the button stays for anyone
   * whose browser blocked or missed the automatic download.
   */
  action?: { label: string; href: string };
  children: ReactNode;
}) {
  const { status, submitted } = useEnquiry();
  const done = status === "success";
  const started = useRef(false);
  const href = action?.href;

  useEffect(() => {
    // Once per submission. Navigating to an attachment URL downloads it
    // without leaving the page.
    if (done && href && !started.current) {
      started.current = true;
      window.location.assign(href);
    }
  }, [done, href]);

  if (!text || !done) return <>{children}</>;
  const [before, after] = text.split("{email}");
  return (
    <div role="status" className="border-accent-400/40 rounded-card border bg-[#0B1416] p-6 md:p-8">
      <p className="text-ink text-base leading-relaxed">
        {before}
        {after !== undefined && <strong className="text-accent-400 font-semibold">{submitted.email}</strong>}
        {after}
      </p>
      {action && (
        <a
          href={action.href}
          className="bg-accent-400 text-ink hover:opacity-90 mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold transition-colors"
        >
          ↓ {action.label}
        </a>
      )}
    </div>
  );
}

/**
 * Submit button. Disabled while in flight so a slow connection cannot produce
 * two identical enquiries from one impatient click.
 */
export function EnquirySubmit({
  children,
  className = "",
  pendingLabel = "Sending…",
}: {
  children: ReactNode;
  className?: string;
  pendingLabel?: string;
}) {
  const { status } = useEnquiry();
  const busy = status === "submitting";

  return (
    <button
      type="submit"
      disabled={busy}
      aria-busy={busy}
      className={`${className} disabled:cursor-not-allowed disabled:opacity-60`}
    >
      {busy ? pendingLabel : children}
    </button>
  );
}

/**
 * Error output.
 *
 * A summary rather than per-field markers: the inputs live in `children` and
 * belong to eight different components, so marking them individually would
 * mean making all of them client components for a form that fails rarely. The
 * summary names the fields, which is what a visitor needs in order to fix it.
 *
 * `role="alert"` so a screen reader announces it without the visitor having to
 * go looking.
 */
export function EnquiryStatus({ className = "" }: { className?: string }) {
  const { status, message, errors } = useEnquiry();
  if (status !== "error" || !message) return null;

  const fields = Object.entries(errors);

  return (
    <div
      role="alert"
      className={`border-danger/40 bg-danger/10 text-ink-2 mt-4 rounded-lg border px-4 py-3 text-sm ${className}`}
    >
      <p>{message}</p>
      {fields.length > 0 && (
        <ul className="mt-2 space-y-1">
          {fields.map(([field, error]) => (
            <li key={field} className="text-ink-3">
              <span className="text-ink font-medium">{label(field)}</span>:{" "}
              {error}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** `productCategory` reads as "Product category" to someone who is not us. */
function label(field: string) {
  return field
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (c) => c.toUpperCase())
    .trim();
}
