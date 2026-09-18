/**
 * ICON PATH DATA
 *
 * Pure data, deliberately separate from the component that draws it.
 *
 * Icon.tsx is a .tsx file, and Node can strip TypeScript types but not JSX —
 * so a plain script cannot import it. The Sanity schema needs these key lists
 * to build its icon dropdowns, and `check:groups` needs to load that schema.
 * Splitting the data out keeps ONE source of truth while letting both a
 * bundler and a bare node script read it.
 */

const PATHS = {
  /* Manufacturing process */
  layers: "M12 3 2 8l10 5 10-5-10-5ZM2 14l10 5 10-5M2 11l10 5 10-5",
  gear: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1A1.6 1.6 0 0 0 9 19.4a1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1A1.6 1.6 0 0 0 4.6 9a1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3H9a1.6 1.6 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V9a1.6 1.6 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1Z",
  bolt: "m13 2-9 12h7l-1 8 9-12h-7l1-8Z",
  thermometer: "M14 14.8V4a2 2 0 1 0-4 0v10.8a4 4 0 1 0 4 0Z",

  /* Specify block */
  droplet: "M12 2.7 6.9 7.8a7.2 7.2 0 1 0 10.2 0L12 2.7Z",
  pulse: "M22 12h-4l-3 9L9 3l-3 9H2",
  cycle: "M3 12a9 9 0 0 1 15.5-6.2L21 8M21 3v5h-5M21 12a9 9 0 0 1-15.5 6.2L3 16M3 21v-5h5",

  /* Sectors */
  building: "M4 21V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v16M14 9h4a2 2 0 0 1 2 2v10M2 21h20M8 7h2M8 11h2M8 15h2",
  vehicle: "M5 17a2 2 0 1 0 4 0 2 2 0 0 0-4 0ZM15 17a2 2 0 1 0 4 0 2 2 0 0 0-4 0ZM5 17H3v-5l2-5h9l4 5h3v5h-2M9 17h6",
  airflow: "M2 8h12a3 3 0 1 0-3-3M2 16h9a3 3 0 1 1-3 3M2 12h18",
  wrench: "M14.7 6.3a4 4 0 0 0 5 5l-9.4 9.4a2.1 2.1 0 0 1-3-3l7.4-11.4Z",
  chip: "M6 6h12v12H6zM9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4",
  /* Drawn for the three sectors the sheets added without an icon (OPEN-ITEMS 54) */
  pick: "M3 21 13 11M9.5 6.5a9 9 0 0 1 8 8M9.5 6.5 8 5M17.5 14.5 19 16",
  derrick: "M8 21 11 4h2l3 17M6 21h12M9.5 12h5M8.5 16.5h7M16 8h3l2-3M19 8v3",
  wheat: "M12 22V9M12 9c-3 0-5-2-5-5 3 0 5 2 5 5ZM12 9c3 0 5-2 5-5-3 0-5 2-5 5ZM12 14c-3 0-5-2-5-5 3 0 5 2 5 5ZM12 14c3 0 5-2 5-5-3 0-5 2-5 5ZM12 19c-3 0-5-2-5-5 3 0 5 2 5 5ZM12 19c3 0 5-2 5-5-3 0-5 2-5 5Z",

  /* Quality assurance */
  check: "m9 12 2 2 4-4M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z",
  document: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6ZM14 2v6h6M8 13h8M8 17h5",
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z",
  award: "M12 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12ZM8.2 13.8 7 22l5-3 5 3-1.2-8.2",

  /* Commerce and actions */
  box: "M21 8 12 3 3 8v8l9 5 9-5V8ZM3 8l9 5 9-5M12 13v8",
  clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 7v5l3 2",
  upload: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12",
  arrowRight: "M5 12h14M13 6l6 6-6 6",
  chevronRight: "m9 6 6 6-6 6",
  plus: "M12 5v14M5 12h14",
} as const;

export type IconName = keyof typeof PATHS;

/** The key list at runtime, for the Sanity schema's icon dropdown. */
export const ICON_NAMES = Object.keys(PATHS) as IconName[];

export { PATHS };

const PROFILES = {
  "d-section": "M9 6h6a9 9 0 0 1 0 12H9V6Z",
  "p-seal": "M16 6a5 5 0 1 0 0 10 5 5 0 0 0 0-10ZM16 16v14",
  "t-profile": "M6 8h20M16 8v18",
  "u-channel-round": "M8 6v12a8 8 0 0 0 16 0V6",
  "u-channel-square": "M8 6v20h16V6",
  "solid-cord": "M16 6a10 10 0 1 0 0 20 10 10 0 0 0 0-20ZM16 15a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z",
  tubing: "M16 4a12 12 0 1 0 0 24 12 12 0 0 0 0-24ZM16 11a5 5 0 1 0 0 10 5 5 0 0 0 0-10Z",
  "l-angle": "M9 5v22h16",
  "custom-profile": "M16 9v14M9 16h14",
} as const;

export type ProfileShape = keyof typeof PROFILES;

/** Same reason as ICON_NAMES — the Studio dropdown is derived, never copied. */
export const PROFILE_SHAPES = Object.keys(PROFILES) as ProfileShape[];

export { PROFILES };
