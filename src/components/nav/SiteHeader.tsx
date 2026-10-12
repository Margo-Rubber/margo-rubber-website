"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Section";
import { Img } from "@/components/ui/Img";
import {
  HEADER_NAV as NAV,
  PRODUCT_MENU,
  INDUSTRY_MENU,
  type MenuKey,
} from "@/content/navigation";

/**
 * SITE HEADER
 *
 * Follows UI-changes2/header.pdf: a centred bar, and mega-panels under
 * Products and Industries.
 *
 * OPEN AND CLOSE. `mouseenter` on a trigger opens; `mouseleave` on the
 * <header> closes. The panel is a DOM descendant of the header, so moving the
 * pointer down into it never leaves the header — which means no close timer,
 * and none of the flicker a timer is usually there to paper over.
 *
 * The triggers stay real links. Products and Industries both have their own
 * hub page, and a menu that swallows the click would strand anyone who
 * navigates by keyboard or taps on a touch device, where hover does not exist.
 */
/**
 * Half-widths, used only to keep an open panel on screen. Measuring the panel
 * would mean rendering it before knowing where to put it, and a corrected
 * position one frame later reads as a flinch. These are deliberately generous.
 */
const PANEL_HALF: Record<MenuKey, number> = { products: 370, industries: 130 };

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menu, setMenu] = useState<MenuKey | null>(null);
  const [mobileSection, setMobileSection] = useState<MenuKey | null>(null);
  /** Viewport x the open panel centres on — the middle of its trigger. */
  const [anchor, setAnchor] = useState(0);

  const closeAll = () => {
    setMenu(null);
    setMobileOpen(false);
    setMobileSection(null);
  };

  /** Open `key`'s panel, centred under `trigger` but never off screen. */
  const openMenu = (key: MenuKey | null, trigger: HTMLElement) => {
    if (key) {
      const r = trigger.getBoundingClientRect();
      const half = PANEL_HALF[key];
      const gutter = 24;
      setAnchor(
        Math.min(
          Math.max(r.left + r.width / 2, half + gutter),
          window.innerWidth - half - gutter,
        ),
      );
    }
    setMenu(key);
  };

  return (
    <header
      className="border-line bg-canvas/80 fixed inset-x-0 top-0 z-50 border-b backdrop-blur"
      onMouseLeave={() => setMenu(null)}
      onKeyDown={(e) => {
        if (e.key === "Escape") setMenu(null);
      }}
      onBlur={(e) => {
        // Only when focus has actually left the header, not while tabbing
        // between the trigger and the panel beneath it.
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          setMenu(null);
        }
      }}
    >
      <Container className="flex h-20 items-center gap-8">
        <Link
          href="/"
          className="text-ink shrink-0 font-bold tracking-tight"
          onClick={closeAll}
        >
          <span className="flex items-center gap-2.5">
            <Img k="brand.mark" className="size-10 shrink-0" />
            <span className="hidden flex-col leading-none sm:flex">
              <span className="text-base font-bold tracking-tight">MARGO</span>
              <span className="text-ink-4 mt-1 text-[9px] font-normal tracking-[0.22em]">
                RUBBER PRODUCTS
              </span>
            </span>
          </span>
        </Link>

        <nav className="mx-auto hidden items-center gap-7 lg:flex">
          {NAV.map((n) => {
            const key = "menu" in n ? n.menu : undefined;
            const isOpen = key !== undefined && menu === key;

            return (
              <Link
                key={n.label}
                href={n.href}
                aria-expanded={key ? isOpen : undefined}
                aria-haspopup={key ? "true" : undefined}
                onMouseEnter={(e) => openMenu(key ?? null, e.currentTarget)}
                onFocus={(e) => openMenu(key ?? null, e.currentTarget)}
                onClick={() => setMenu(null)}
                className={`flex items-center gap-1.5 text-sm transition-colors ${
                  isOpen ? "text-ink" : "text-ink-3 hover:text-ink"
                }`}
              >
                {n.label}
                {key && (
                  <span
                    aria-hidden
                    className={`text-[9px] leading-none transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  >
                    ▼
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-3 lg:ml-0">
          <Button href="/contact#quote-form" className="hidden sm:inline-flex">
            Request Quote <span aria-hidden>→</span>
          </Button>

          {/* Mobile menu toggle. 44px hit target, meets the WCAG 2.2 AA
              touch-target size folded into the pre-launch QA gate. */}
          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            className="border-line text-ink grid size-11 place-items-center rounded-lg border lg:hidden"
          >
            <span aria-hidden className="text-lg leading-none">
              {mobileOpen ? "✕" : "☰"}
            </span>
          </button>
        </div>
      </Container>

      {/* ── Mega-panels ───────────────────────────────────────────────────
          Positioned against the header, which spans the viewport, so `left`
          is a plain viewport x — the centre of whichever trigger opened it. */}
      {menu && (
        <div
          style={{ left: anchor }}
          className="pointer-events-none absolute top-full hidden -translate-x-1/2 lg:block"
        >
          {/* Explicit shadow rather than `shadow-2xl shadow-black/50`: the
              theme replaces Tailwind's default palette, so `black` resolves to
              nothing and the pair computes to a fully transparent shadow. */}
          <div className="panel-in border-line bg-surface-4 pointer-events-auto max-w-[calc(100vw-3rem)] rounded-xl border p-7 shadow-[0_24px_48px_-12px_rgb(0_0_0/0.7)]">
            {menu === "products" ? <ProductsPanel /> : <IndustriesPanel />}
          </div>
        </div>
      )}

      {/* ── Mobile ──────────────────────────────────────────────────────── */}
      {mobileOpen && (
        <nav
          id="mobile-nav"
          className="panel-in border-line bg-canvas max-h-[calc(100dvh-5rem)] overflow-y-auto border-t lg:hidden"
        >
          <Container className="py-4">
            <ul className="divide-line divide-y">
              {NAV.map((n) => {
                const key = "menu" in n ? n.menu : undefined;

                if (!key) {
                  return (
                    <li key={n.label}>
                      <Link
                        href={n.href}
                        onClick={closeAll}
                        className="text-ink-2 hover:text-ink block py-4 text-sm"
                      >
                        {n.label}
                      </Link>
                    </li>
                  );
                }

                const expanded = mobileSection === key;

                return (
                  <li key={n.label}>
                    <div className="flex items-center">
                      <Link
                        href={n.href}
                        onClick={closeAll}
                        className="text-ink-2 hover:text-ink flex-1 py-4 text-sm"
                      >
                        {n.label}
                      </Link>
                      <button
                        type="button"
                        onClick={() => setMobileSection(expanded ? null : key)}
                        aria-expanded={expanded}
                        aria-label={`${expanded ? "Hide" : "Show"} ${n.label} menu`}
                        className="text-ink-4 grid size-11 place-items-center"
                      >
                        <span
                          aria-hidden
                          className={`text-[10px] leading-none transition-transform duration-200 ${
                            expanded ? "rotate-180" : ""
                          }`}
                        >
                          ▼
                        </span>
                      </button>
                    </div>

                    {expanded && (
                      <div className="pb-4">
                        {key === "products" ? (
                          <MobileProducts onNavigate={closeAll} />
                        ) : (
                          <MobileList items={INDUSTRY_MENU} onNavigate={closeAll} />
                        )}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>

            <Button
              href="/contact#quote-form"
              onClick={closeAll}
              className="mt-4 w-full justify-center sm:hidden"
            >
              Request Quote <span aria-hidden>→</span>
            </Button>
          </Container>
        </nav>
      )}
    </header>
  );
}

/* ── Desktop panels ──────────────────────────────────────────────────────── */

function ProductsPanel() {
  return (
    <div className="flex gap-10">
      <div>
        <Link
          href="/products#all-products"
          onClick={() =>
            // Same-page hash links don't fire hashchange; tell the grid directly.
            setTimeout(() => window.dispatchEvent(new Event("margo:all-products")), 0)
          }
          className="margo-nav-all text-[10px] font-medium tracking-[0.16em] uppercase"
        >
          All Products <span aria-hidden>›</span>
        </Link>
        <ul className="mt-3 space-y-0.5">
          {/* Every product family, the two grouped ones included, so the
              left column is the complete list and reads as the main menu. */}
          {[...PRODUCT_MENU.categories, ...PRODUCT_MENU.groups].map((c) => (
            <li key={c.label}>
              <PanelLink href={c.href}>{c.label}</PanelLink>
            </li>
          ))}
        </ul>
      </div>

      <div className="border-line w-px self-stretch border-l" />

      <div className="space-y-6">
        {PRODUCT_MENU.groups.map((g) => (
          <div key={g.label}>
            <Link
              href={g.href}
              className="text-ink hover:text-accent-400 flex items-center gap-1.5 text-sm font-semibold transition-colors"
            >
              {g.label}
              <span aria-hidden className="text-accent-400 text-[10px]">
                ›
              </span>
            </Link>
            <ul className="mt-2 grid grid-cols-2 gap-x-8 gap-y-0.5">
              {g.items.map((i) => (
                <li key={i.label}>
                  <PanelLink href={i.href} tone="sub">{i.label}</PanelLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

function IndustriesPanel() {
  return (
    <div className="min-w-56">
      <PanelLabel>Sectors We Serve</PanelLabel>
      <ul className="mt-3 space-y-0.5">
        {INDUSTRY_MENU.map((i) => (
          <li key={i.label}>
            <PanelLink href={i.href}>{i.label}</PanelLink>
          </li>
        ))}
      </ul>
    </div>
  );
}

function PanelLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-ink-4 text-[10px] font-medium tracking-[0.16em] uppercase">
      {children}
    </p>
  );
}

/**
 * Menu link. `main` (product families, sectors) is white; `sub` (profiles
 * inside a family) is a light grey that still reads clearly on the dark
 * panel. Colours live in globals.css (.margo-nav-*), not in utilities, so a
 * stale Tailwind build cannot drop them.
 */
function PanelLink({
  href,
  children,
  tone = "main",
}: {
  href: string;
  children: React.ReactNode;
  tone?: "main" | "sub";
}) {
  return (
    <Link
      href={href}
      className={`${tone === "main" ? "margo-nav-main" : "margo-nav-sub"} hover:bg-surface-5 -mx-2.5 block rounded-md px-2.5 py-1.5 text-sm whitespace-nowrap transition-colors`}
    >
      {children}
    </Link>
  );
}

/* ── Mobile panels ───────────────────────────────────────────────────────── */

function MobileList({
  items,
  onNavigate,
}: {
  items: readonly { label: string; href: string }[];
  onNavigate: () => void;
}) {
  return (
    <ul className="border-line ml-1 space-y-0.5 border-l pl-4">
      {items.map((i) => (
        <li key={i.label}>
          <Link
            href={i.href}
            onClick={onNavigate}
            className="margo-nav-main block py-2 text-sm"
          >
            {i.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function MobileProducts({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div className="space-y-4">
      <MobileList items={PRODUCT_MENU.categories} onNavigate={onNavigate} />

      {PRODUCT_MENU.groups.map((g) => (
        <div key={g.label} className="border-line ml-1 border-l pl-4">
          <Link
            href={g.href}
            onClick={onNavigate}
            className="margo-nav-main block py-2 text-sm font-semibold"
          >
            {g.label}
          </Link>
          <ul className="space-y-0.5">
            {g.items.map((i) => (
              <li key={i.label}>
                <Link
                  href={i.href}
                  onClick={onNavigate}
                  className="margo-nav-sub block py-2 pl-3 text-sm"
                >
                  {i.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
