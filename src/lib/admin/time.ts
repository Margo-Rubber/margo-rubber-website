/**
 * Times on the desk are Nashik's, always.
 *
 * The desk renders on Vercel, whose clock is UTC, so a bare
 * `toLocaleString` printed "05:47" for an enquiry that arrived at 11:17 in
 * the works. Every timestamp the desk shows goes through here with the
 * zone fixed, so it reads the same on the server and in whichever browser
 * opens it.
 */
const ZONE = "Asia/Kolkata";

export const deskDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: ZONE });

export const deskTime = (iso: string) =>
  new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: ZONE });

/** "Friday, 18 September 2026 at 11:17 IST" */
export const deskDateTimeLong = (iso: string) =>
  `${new Date(iso).toLocaleString("en-GB", { dateStyle: "full", timeStyle: "short", timeZone: ZONE })} IST`;

/** "18 Sept 2026, 11:17 IST" */
export const deskDateTime = (iso: string) =>
  `${new Date(iso).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: ZONE })} IST`;
