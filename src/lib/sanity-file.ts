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
