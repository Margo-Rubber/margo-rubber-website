import fs from "node:fs";
import { createHmac } from "node:crypto";

/**
 * FIRE THE PUBLISH WEBHOOK BY HAND
 *
 *   npm run revalidate extrusion
 *   npm run revalidate extrusion --  --type legal
 *   npm run revalidate --all
 *
 * WHY THIS EXISTS. Publishing in Studio writes to Sanity; it does not tell the
 * site. The site is told by a webhook, and a webhook needs a public URL —
 * which localhost is not. So in development, publishing appears to do nothing
 * until the cache is invalidated, and this is what invalidates it.
 *
 * Once the site is deployed and the webhook is registered against its real
 * URL, this script stops being necessary for production. It stays useful for
 * local work, and it is also the way to confirm the endpoint still verifies
 * signatures correctly after changing it.
 *
 * It sends a REAL signed request rather than a back door. There is no unsigned
 * path into the revalidation endpoint, not even for development — a bypass
 * added "just for dev" is exactly the kind of thing that ships.
 */

const HOST = process.env.SITE ?? "http://localhost:3000";

function envValue(key: string): string | null {
  let text: string;
  try {
    text = fs.readFileSync(".env.local", "utf8");
  } catch {
    return null;
  }
  const line = text.split("\n").find((l) => l.startsWith(`${key}=`));
  if (!line) return null;
  return line.slice(key.length + 1).trim().replace(/^["']|["']$/g, "");
}

const args = process.argv.slice(2);
// `--all`: a Site settings publish is the one event the endpoint answers by
// clearing every collection at once (api/revalidate/route.ts), so that is
// what --all sends.
if (args.includes("--all")) args.splice(0, args.length, "settings", "--type", "siteSettings");
const typeAt = args.indexOf("--type");
const type = typeAt === -1 ? "productCategory" : args[typeAt + 1];
// Guard the -1 case: with no --type flag, `typeAt + 1` is 0, which silently
// swallowed the first slug.
const typeValueAt = typeAt === -1 ? -1 : typeAt + 1;
const slugs = args.filter((a, i) => !a.startsWith("--") && i !== typeValueAt);

if (slugs.length === 0) {
  console.error(
    "Usage: npm run revalidate <slug…> [-- --type <documentType>]\n" +
      `Types the endpoint knows: productCategory, legal`,
  );
  process.exit(1);
}

const secret = envValue("SANITY_REVALIDATE_SECRET");
if (!secret) {
  console.error("No SANITY_REVALIDATE_SECRET in .env.local.");
  process.exit(1);
}

let failed = 0;

for (const slug of slugs) {
  const body = JSON.stringify({ _type: type, slug: { current: slug } });

  // Sanity's format: t=<millis>,v1=<base64url HMAC of "<t>.<body>">. Fixed
  // rather than Date.now() so repeated runs are byte-identical and easy to
  // compare when something goes wrong; the endpoint does not check freshness.
  const ts = 1756800000000;
  const signature = `t=${ts},v1=${createHmac("sha256", secret)
    .update(`${ts}.${body}`)
    .digest("base64url")}`;

  try {
    const res = await fetch(`${HOST}/api/revalidate`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "sanity-webhook-signature": signature,
      },
      body,
    });
    const text = await res.text();
    console.log(`${res.ok ? "✓" : "✖"} ${slug}  ${res.status}  ${text}`);
    if (!res.ok) failed++;
  } catch (err) {
    console.error(`✖ ${slug}  ${err instanceof Error ? err.message : err}`);
    failed++;
  }
}

console.log(
  "\nGive it a few seconds — the page rebuilds on the next request, and " +
    "Sanity's own CDN can be up to a minute behind a publish.",
);

process.exit(failed === 0 ? 0 : 1);
