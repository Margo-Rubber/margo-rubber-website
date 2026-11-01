import type { Metadata } from "next";
import { Poppins, Source_Sans_3, JetBrains_Mono } from "next/font/google";
import { SITE_URL } from "@/lib/seo";
import "./globals.css";

// Self-hosted via next/font — never a Google Fonts CDN <link>.
//
// Two families, not one. Everything on the site previously rendered in a
// single face; headings and body are now separate, wired in globals.css.
//
// Variables are named after the FACE, not its role. `--font-display` is the
// name next/font would generate here and is also the Tailwind theme token for
// the heading stack, and having both would leave two different values fighting
// over one custom property.
//
// Poppins has no variable cut on Google Fonts, so weights are explicit. Only
// the ones the type scale actually asks for: 600 for h2/h3, 700 for the
// display sizes and h1.
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

// "Source Sans Pro" was retired in 2021 and is no longer served; Source Sans 3
// is the same typeface, continued under its current name.
const source = Source_Sans_3({
  variable: "--font-source",
  subsets: ["latin"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-mono-code",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Margo Rubber Products",
    template: "%s",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // No `h-full` on <html>: it clips the document to the viewport and breaks
    // scrolling on long pages. Body owns the min-height instead.
    // `data-scroll-behavior="smooth"` is REQUIRED, not decorative. globals.css
    // sets `scroll-behavior: smooth` on <html> for in-page anchors. As of
    // Next 16 the router no longer neutralises that during route transitions
    // unless this attribute is present, so without it every client-side
    // navigation animates its scroll to top and the new page lands part-way
    // down. See node_modules/next/dist/shared/lib/router/utils/disable-smooth-scroll.js
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${poppins.variable} ${source.variable} ${mono.variable} antialiased`}
    >
      {/* Browser extensions (ColorZilla's cz-shortcut-listen, Grammarly, etc.)
          inject attributes onto <body> before React hydrates, which reports as
          a hydration mismatch. This suppresses that on <body> only; it does not
          mask mismatches in our own components.
 */}
      {/* Chrome lives in the (site) group, not here. The root layout owns
          <html>, the fonts and the stylesheet — things every route needs —
          while the marketing header and footer belong only to the marketing
          routes. /margo-desk is a tool and must not inherit them. */}
      <body className="flex min-h-screen flex-col" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
