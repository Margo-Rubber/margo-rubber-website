"use client";

import { usePathname } from "next/navigation";

/**
 * Floating "Chat on WhatsApp" button, bottom-right on every public page.
 *
 * The number is the WhatsApp number in Site Settings (Studio), so changing
 * it there changes it here. The message is pre-filled with the page the
 * visitor was on, so the sales team knows which part they were looking at.
 *
 * Size: 48px button, 24px icon (was 56/28). 48px stays above the 44px
 * minimum touch target. Clicks are counted by ContactClickTracker, which
 * matches any wa.me link, so the href format must stay as it is.
 */
export function WhatsAppButton({ number }: { number: string }) {
  const pathname = usePathname();
  const digits = number.replace(/\D/g, "");
  if (digits.length < 8) return null;

  const text = `Hello Margo Rubber, I have an enquiry. (Page: www.margorubber.com${pathname})`;
  const href = `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Margo Rubber on WhatsApp"
      title="Chat on WhatsApp"
      className="fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 grid size-12 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_6px_18px_-6px_rgb(0_0_0/0.5)] transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white print:hidden"
    >
      <svg viewBox="0 0 24 24" className="size-6" fill="currentColor" aria-hidden>
        <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.79-1.47-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35M12.05 21.5h-.01a9.4 9.4 0 0 1-4.79-1.31l-.34-.2-3.56.93.95-3.47-.22-.36a9.4 9.4 0 0 1-1.44-5.02c0-5.2 4.23-9.43 9.44-9.43a9.37 9.37 0 0 1 6.67 2.77 9.37 9.37 0 0 1 2.76 6.67c0 5.2-4.24 9.43-9.44 9.43m8.02-17.45A11.27 11.27 0 0 0 12.05.72C5.8.72.72 5.8.72 12.05c0 2 .52 3.95 1.52 5.66L.62 23.28l5.7-1.5a11.3 11.3 0 0 0 5.42 1.38h.01c6.24 0 11.33-5.08 11.33-11.33 0-3.03-1.18-5.87-3.32-8.01" />
      </svg>
    </a>
  );
}
