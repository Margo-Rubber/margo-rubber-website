/**
 * CONSENT REGION — which browser time zones get the cookie banner.
 *
 * The ONE rule, read by both places that decide it: the inline consent
 * defaults in src/components/analytics/Analytics.tsx (which run before React
 * and gate the Meta Pixel) and inConsentRegion() in src/lib/consent.ts (which
 * shows the banner), so the two cannot disagree.
 *
 * Every "Europe/…" zone, plus the EEA, UK and Swiss zones that are not
 * named "Europe/…" (D1b, 27 Oct 2026). Without them a visitor in Iceland,
 * Cyprus, the Canaries or France's overseas regions got the Meta Pixel with
 * no banner: GA4 has Google's IP-region default as a backstop, Meta has none.
 * Erring wide is safe — an extra banner costs nothing; a missing one is a
 * GDPR breach.
 */
const NOT_NAMED_EUROPE = [
  "Atlantic/Reykjavik", // Iceland (EEA)
  "Asia/Nicosia", // Cyprus
  "Asia/Famagusta", // Cyprus
  "Atlantic/Canary", // Spain
  "Africa/Ceuta", // Spain (Ceuta, Melilla)
  "Atlantic/Madeira", // Portugal
  "Atlantic/Azores", // Portugal
  "America/Guadeloupe", // France, outermost region
  "America/Martinique", // France, outermost region
  "America/Cayenne", // France (French Guiana), outermost region
  "America/Marigot", // France (Saint-Martin), outermost region
  "Indian/Reunion", // France, outermost region
  "Indian/Mayotte", // France, outermost region
  // Legacy aliases some systems still report instead of the names above.
  "Iceland",
  "Portugal",
  "Poland",
  "GB",
  "GB-Eire",
  "Eire",
  "WET",
  "CET",
  "MET",
  "EET",
] as const;

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\/-]/g, "\\$&");

/** Matches a consent-region time zone. `.source` is inlined in Analytics.tsx. */
export const CONSENT_TIME_ZONE = new RegExp(
  `^(?:Europe\\/|(?:${NOT_NAMED_EUROPE.map(escape).join("|")})$)`,
);
