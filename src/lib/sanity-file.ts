import { dataset, projectId } from "../../sanity/env.ts";

/**
 * A Sanity file reference → its public CDN URL, without another query.
 *
 * File asset ids encode everything needed: `file-<hash>-<ext>` lives at
 * `https://cdn.sanity.io/files/<project>/<dataset>/<hash>.<ext>`. The page
 * loader fetches documents with a plain `{...}` projection, so the reference
 * is what arrives; resolving it here keeps that loader generic.
 *
 * `downloadAs` adds Sanity's `?dl=` parameter, which makes the CDN send the
 * file as an attachment under that name instead of opening it in the tab.
 */
export function sanityFileUrl(
  ref: string | undefined,
  downloadAs?: string,
): string | undefined {
  const m = ref?.match(/^file-([a-zA-Z0-9]+)-([a-z0-9]+)$/);
  if (!m) return undefined;
  const url = `https://cdn.sanity.io/files/${projectId}/${dataset}/${m[1]}.${m[2]}`;
  return downloadAs ? `${url}?dl=${encodeURIComponent(downloadAs)}` : url;
}

/** Where this project's uploaded files live on Sanity's CDN. */
export const SANITY_FILES_ORIGIN = `https://cdn.sanity.io/files/${projectId}/${dataset}/`;

/**
 * Our own path for those files — next.config.ts rewrites `/sanity-files/*`
 * to SANITY_FILES_ORIGIN. Sanity's file CDN sends no CORS header for this
 * site, so anything the browser fetches or frames (3D models, certificate
 * PDFs) is served same-origin instead; the URL also stays on our domain.
 */
export const SAME_ORIGIN_FILES = "/sanity-files/";

/** A Sanity file CDN url → the same file under our own domain. Others pass through. */
export function sameOriginFileUrl(url: string): string {
  return url.startsWith(SANITY_FILES_ORIGIN)
    ? `${SAME_ORIGIN_FILES}${url.slice(SANITY_FILES_ORIGIN.length)}`
    : url;
}

/** Add Sanity's `?dl=` so the CDN sends the file as a download under `name`. */
export function downloadUrl(url: string, name?: string): string {
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}dl=${encodeURIComponent(name ?? "")}`;
}
