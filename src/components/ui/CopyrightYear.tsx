"use client";

import { useSyncExternalStore } from "react";

/**
 * The year in the footer, from the clock — the sheets' rule, because the old
 * footer read 2024 for eight months.
 *
 * Next's prerender rejects a non-deterministic value in a cached server
 * tree, so the server renders the year it was given and the browser reads
 * its own clock on hydration. The two differ only across midnight on 31
 * December, which is what suppressHydrationWarning is for. useSyncExternalStore
 * rather than an effect: no render-after-mount, and no state set inside an
 * effect for the React compiler to object to.
 */
const subscribe = () => () => {};

export function CopyrightYear({ initial }: { initial: number }) {
  const year = useSyncExternalStore(
    subscribe,
    () => new Date().getFullYear(),
    () => initial,
  );
  return <span suppressHydrationWarning>{year}</span>;
}
