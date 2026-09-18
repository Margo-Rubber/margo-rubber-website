"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { ACCEPT, MAX_BYTES, type AttachmentRef } from "@/lib/enquiry/attachment-ref";

/**
 * "Attach drawing / spec (optional) — PDF, DWG or image, max 10MB" (sheet
 * 01 §11). The file goes straight from the browser to Cloudinary, signed by
 * /api/enquiry/upload, while the visitor finishes the form; what the form
 * then submits is the reference, in a hidden input the EnquiryForm reads.
 *
 * Every state is a sentence the visitor can act on: what to attach, that
 * it is uploading, that it is attached (with the name, and a way to drop
 * it), or why it was refused. Never a bare progress bar.
 */

type State =
  | { kind: "empty" }
  | { kind: "uploading"; name: string; percent: number }
  | { kind: "done"; name: string; ref: AttachmentRef }
  | { kind: "error"; message: string };

const kb = (n: number) => (n < 1024 * 1024 ? `${Math.max(1, Math.round(n / 1024))} KB` : `${(n / (1024 * 1024)).toFixed(1)} MB`);

export function AttachmentField({
  label,
  hint,
  className = "",
}: {
  label: string;
  /** The sheet's line under the label — "PDF, DWG or image, max 10MB". */
  hint?: string;
  className?: string;
}) {
  const id = useId();
  const [state, setState] = useState<State>({ kind: "empty" });
  const input = useRef<HTMLInputElement>(null);
  const request = useRef<XMLHttpRequest | null>(null);

  // The EnquiryForm resets itself after a send; this field follows.
  useEffect(() => {
    const form = input.current?.form;
    if (!form) return;
    const onReset = () => {
      request.current?.abort();
      setState({ kind: "empty" });
    };
    form.addEventListener("reset", onReset);
    return () => form.removeEventListener("reset", onReset);
  }, []);

  async function upload(file: File) {
    request.current?.abort();
    if (file.size > MAX_BYTES) {
      setState({ kind: "error", message: `${file.name} is ${kb(file.size)} — the limit is 10 MB. Send a smaller file, or email it to info@margorubber.in.` });
      return;
    }
    setState({ kind: "uploading", name: file.name, percent: 0 });

    let signed: { ok: boolean; message?: string; url?: string; fields?: Record<string, string | number>; publicId?: string; resourceType?: "image" | "raw" };
    try {
      const res = await fetch("/api/enquiry/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: file.name, bytes: file.size }),
      });
      signed = await res.json();
    } catch {
      setState({ kind: "error", message: "We could not start the upload. Check your connection and try again, or email the file to info@margorubber.in." });
      return;
    }
    if (!signed.ok || !signed.url || !signed.fields || !signed.publicId || !signed.resourceType) {
      setState({ kind: "error", message: signed.message ?? "That file could not be attached." });
      return;
    }

    const body = new FormData();
    for (const [k, v] of Object.entries(signed.fields)) body.append(k, String(v));
    body.append("file", file);

    const xhr = new XMLHttpRequest();
    request.current = xhr;
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) setState({ kind: "uploading", name: file.name, percent: Math.round((e.loaded / e.total) * 100) });
    };
    xhr.onerror = () => setState({ kind: "error", message: "The upload was interrupted. Please try again." });
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        setState({
          kind: "done",
          name: file.name,
          ref: {
            publicId: signed.publicId!,
            resourceType: signed.resourceType!,
            originalFilename: file.name,
            bytes: file.size,
            mime: file.type || undefined,
          },
        });
      } else {
        setState({ kind: "error", message: "The file was not accepted. Please attach a PDF, DWG, DXF or image under 10 MB." });
      }
    };
    xhr.open("POST", signed.url);
    xhr.send(body);
  }

  function clear() {
    request.current?.abort();
    if (input.current) input.current.value = "";
    setState({ kind: "empty" });
  }

  const busy = state.kind === "uploading";

  return (
    <div className={className}>
      <span className="text-eyebrow text-ink-4 font-mono uppercase">{label}</span>

      {/* What the form reads: the reference once uploaded, and a flag while
          the upload is in flight so a send cannot race it. */}
      <input type="hidden" name="attachment" value={state.kind === "done" ? JSON.stringify(state.ref) : ""} />
      <input type="hidden" name="attachment_state" value={busy ? "uploading" : ""} />

      <div
        className={`mt-2 rounded-lg border border-dashed bg-[#16191E] px-4 py-3.5 text-sm ${
          state.kind === "error" ? "border-danger/60" : state.kind === "done" ? "border-accent-400/60" : "border-line-2"
        }`}
      >
        {state.kind === "empty" && (
          <label htmlFor={id} className="text-ink-4 flex cursor-pointer items-center gap-3">
            <Icon name="upload" className="text-accent-400 size-4 shrink-0" />
            <span>
              <span className="text-ink-2 underline decoration-accent-400/50 underline-offset-2">Choose a file</span>
              {hint ? ` — ${hint}` : ""}
            </span>
          </label>
        )}
        {state.kind === "uploading" && (
          <p className="text-ink-2 flex items-center gap-3" aria-live="polite">
            <span aria-hidden className="border-accent-400 size-4 shrink-0 animate-spin rounded-full border-2 border-t-transparent" />
            Uploading {state.name}… {state.percent}%
          </p>
        )}
        {state.kind === "done" && (
          <p className="text-ink-2 flex items-center gap-3" aria-live="polite">
            <Icon name="check" className="text-accent-400 size-4 shrink-0" />
            <span className="min-w-0 flex-1 truncate">
              Attached: <span className="text-ink">{state.name}</span> ({kb(state.ref.bytes)})
            </span>
            <button type="button" onClick={clear} className="text-ink-4 hover:text-ink shrink-0 text-xs underline underline-offset-2">
              Remove
            </button>
          </p>
        )}
        {state.kind === "error" && (
          <p className="text-ink-2" role="alert">
            {state.message}{" "}
            <button type="button" onClick={clear} className="text-accent-400 underline underline-offset-2">
              Choose another file
            </button>
          </p>
        )}
        <input
          ref={input}
          id={id}
          type="file"
          accept={ACCEPT}
          className="sr-only"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void upload(file);
          }}
        />
      </div>
    </div>
  );
}
