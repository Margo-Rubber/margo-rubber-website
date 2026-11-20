/**
 * INDEXNOW — tell Bing (and Yandex, Seznam, Naver) which URLs changed.
 *
 *   node --experimental-strip-types scripts/indexnow.mts                 (dry run: lists what would be sent)
 *   node --experimental-strip-types scripts/indexnow.mts --send          (every URL in both sitemaps)
 *   node --experimental-strip-types scripts/indexnow.mts --send /products/seals /products/o-rings
 *
 * Why: Bing's index is what ChatGPT search and Copilot answer from, and
 * IndexNow is the one way to ask for a re-crawl without a Webmaster Tools
 * login. Google does not take part in IndexNow — Google indexing is requested
 * by hand in Search Console (Search-Console-Indexing-List-20-Nov-2026.md).
 *
 * The key is public by design: the protocol proves ownership by the key file
 * at https://www.margorubber.com/<key>.txt, which must contain the key and
 * nothing else. Run this only after that file is deployed — the script checks
 * it and stops if it is missing. Send after real content changes, not on a
 * schedule: re-submitting unchanged URLs is ignored at best.
 */
const HOST = "www.margorubber.com";
const KEY = "d6f86795010c688b24bef67764655124";
const SITE = `https://${HOST}`;
const send = process.argv.includes("--send");
const only = process.argv.slice(2).filter((a) => a.startsWith("/"));

const keyRes = await fetch(`${SITE}/${KEY}.txt`);
const keyBody = keyRes.ok ? (await keyRes.text()).trim() : "";
if (keyBody !== KEY) {
  console.error(`Key file ${SITE}/${KEY}.txt is ${keyRes.ok ? "wrong" : `HTTP ${keyRes.status}`} — deploy public/${KEY}.txt first.`);
  process.exit(1);
}

let urls: string[];
if (only.length) urls = only.map((p) => SITE + p);
else {
  urls = [];
  for (const sm of ["/sitemap.xml", "/products/sitemap/0.xml"]) {
    const xml = await (await fetch(SITE + sm)).text();
    urls.push(...[...xml.matchAll(/<loc>(https:\/\/www\.margorubber\.com[^<]*)<\/loc>/g)].map((m) => m[1]));
  }
  urls = [...new Set(urls)].filter((u) => !/\.(jpe?g|png|webp|avif)$/i.test(u));
}

console.log(`${urls.length} URL(s)${send ? "" : " (dry run — add --send)"}`);
for (const u of urls) console.log("  " + u);
if (!send) process.exit(0);

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `${SITE}/${KEY}.txt`, urlList: urls }),
});
// 200 = accepted, 202 = accepted, key check pending. 4xx = something to fix.
console.log(`IndexNow answered HTTP ${res.status} ${res.statusText}`);
if (res.status >= 400) {
  console.error(await res.text());
  process.exit(1);
}
