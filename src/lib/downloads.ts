/**
 * DOWNLOADS — only when a file exists.
 *
 * The old site carried "Download PDF", "Download Quality Policy" and
 * "Download Test Capability Statement" buttons that pointed at the contact
 * page or at nothing. Build Instructions: a download control renders only
 * when there is a file behind it. Until an editor attaches one, the button
 * is absent rather than dead.
 */
const FILE_EXT = /\.(pdf|docx?|xlsx?|pptx?|zip|csv|dwg|dxf|step|stp)(\?|#|$)/i;

export function isFileHref(href: string | undefined | null): href is string {
  if (!href) return false;
  return FILE_EXT.test(href) || href.startsWith("https://cdn.sanity.io/files/");
}

/**
 * Drops links that read as downloads but have no file behind them; keeps
 * everything else untouched. For lists mixing page links and downloads.
 */
export function withoutDeadDownloads<T extends { label: string; href: string }>(
  links: readonly T[],
): T[] {
  return links.filter(
    (l) => !/\bdownload\b/i.test(l.label) || isFileHref(l.href),
  );
}
