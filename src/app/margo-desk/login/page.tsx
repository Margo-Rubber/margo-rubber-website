"use client";

import { useActionState } from "react";
import { signInAction } from "../actions";

export default function AdminLoginPage() {
  const [error, formAction, pending] = useActionState(signInAction, null);

  return (
    <main className="desk grid min-h-dvh place-items-center px-6">
      <form action={formAction} className="desk-card w-full max-w-sm p-8">
        <span aria-hidden className="bg-accent-400 grid size-9 place-items-center rounded-md text-sm font-bold text-white">
          M
        </span>
        <h1 className="text-ink mt-5 text-lg font-semibold">Margo enquiries desk</h1>
        <p className="text-ink-3 mt-1 text-sm">Sign in to see what the website has received.</p>

        <label className="mt-7 block">
          <span className="text-ink-3 text-xs">Password</span>
          <input
            type="password"
            name="password"
            autoComplete="current-password"
            required
            autoFocus
            className="border-line bg-surface-4 text-ink focus:border-accent-400 focus:ring-accent-400/20 mt-2 w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:ring-2"
          />
        </label>

        {error && (
          <p role="alert" className="text-danger mt-4 text-sm">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="bg-accent-400 mt-6 w-full rounded-lg py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {pending ? "Checking…" : "Sign in"}
        </button>
      </form>
    </main>
  );
}
