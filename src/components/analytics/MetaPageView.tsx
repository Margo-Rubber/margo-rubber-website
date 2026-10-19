"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * Meta PageView on client-side navigation. The first view is sent by the
 * pixel's own init script, so the first render is skipped (no double count).
 * GA4 and Clarity track navigation themselves.
 */
export function MetaPageView() {
  const pathname = usePathname();
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    window.fbq?.("track", "PageView");
  }, [pathname]);
  return null;
}
