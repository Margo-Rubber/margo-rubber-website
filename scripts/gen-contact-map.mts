/**
 * CONTACT PAGE MAP — redraws public/images/contact/margo-plant-map.jpg.
 *
 *   node --experimental-strip-types scripts/gen-contact-map.mts
 *   node --experimental-strip-types scripts/gen-contact-map.mts 19.9354 73.7331     (other coordinates)
 *
 * The Contact page shows this image with a pulsing pin drawn at its exact
 * centre (.margo-map-pin), so the image must be centred on the plant. This
 * downloads the OpenStreetMap tiles around the point, crops a 1200×900 frame
 * centred on it at zoom ~16.5, and recolours it to the site's dark palette.
 *
 * About 20 tiles, once, with an identifying User-Agent — within the OSM tile
 * usage policy. The "© OpenStreetMap contributors" credit is drawn by the
 * page (ContactDetails.tsx) and must stay.
 *
 * Location confirmed by Margo, 27 Oct 2026 (the Google Business listing's
 * own pin is ~400 m south of the plant).
 */
import sharp from "sharp";
import { writeFile } from "node:fs/promises";

const LAT = Number(process.argv[2] ?? 19.935449556805665);
const LNG = Number(process.argv[3] ?? 73.73311970828622);
const OUT = "public/images/contact/margo-plant-map.jpg";

const W = 1200, H = 900;
const Z = 17;                      // tiles are fetched at 17 …
const SCALE = Math.SQRT1_2;        // … and shrunk by 1/√2 → effective zoom 16.5
const T = 256;

// Web-Mercator pixel position of the point at zoom Z.
const world = T * 2 ** Z;
const px = ((LNG + 180) / 360) * world;
const latR = (LAT * Math.PI) / 180;
const py = ((1 - Math.log(Math.tan(latR) + 1 / Math.cos(latR)) / Math.PI) / 2) * world;

// Source window (at zoom 17) that becomes the 1200×900 frame.
const sw = Math.round(W / SCALE), sh = Math.round(H / SCALE);
const left = Math.round(px - sw / 2), top = Math.round(py - sh / 2);
const tx0 = Math.floor(left / T), ty0 = Math.floor(top / T);
const tx1 = Math.floor((left + sw) / T), ty1 = Math.floor((top + sh) / T);

console.log(`Centre ${LAT}, ${LNG} — ${(tx1 - tx0 + 1) * (ty1 - ty0 + 1)} tiles at zoom ${Z}`);

// A plain shape rather than sharp's own type: the type check could not see
// sharp's namespace from a script.
const tiles: { input: Buffer; left: number; top: number }[] = [];
for (let ty = ty0; ty <= ty1; ty++) {
  for (let tx = tx0; tx <= tx1; tx++) {
    const url = `https://tile.openstreetmap.org/${Z}/${tx}/${ty}.png`;
    const res = await fetch(url, {
      headers: { "User-Agent": "margorubber.com contact-map generator (one-off; info@margorubber.in)" },
    });
    if (!res.ok) throw new Error(`Tile ${url} → HTTP ${res.status}`);
    tiles.push({ input: Buffer.from(await res.arrayBuffer()), left: (tx - tx0) * T, top: (ty - ty0) * T });
    await new Promise((r) => setTimeout(r, 150)); // be polite to the tile server
  }
}

const mosaic = await sharp({
  create: { width: (tx1 - tx0 + 1) * T, height: (ty1 - ty0 + 1) * T, channels: 4, background: "#f2efe9" },
})
  .composite(tiles)
  .png()
  .toBuffer();

const { data, info } = await sharp(mosaic)
  .extract({ left: left - tx0 * T, top: top - ty0 * T, width: sw, height: sh })
  .resize(W, H, { kernel: "lanczos3" })
  .removeAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

/* ── Recolour: OSM's light "standard" style → the site's dark map ──────────
   Minor roads (white) become pale slate, major roads (yellow/orange/pink)
   a mid grey, water a blue-grey, parks and buildings slightly lifted
   from the background. Everything else, labels included, goes dark. */
const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const BG = hex("#161b21"), ROAD = hex("#a6b8be"), MAJOR = hex("#4b5459"),
  WATER = hex("#26343d"), PARK = hex("#1d262a"), BUILDING = hex("#262d34"), INK = hex("#7d8c93");

const mix = (a: number[], b: number[], t: number) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
const out = Buffer.alloc(data.length);

for (let i = 0; i < data.length; i += 3) {
  const r = data[i], g = data[i + 1], b = data[i + 2];
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const lum = 0.299 * r + 0.587 * g + 0.114 * b;
  const sat = max === 0 ? 0 : (max - min) / max;

  let c: number[];
  if (sat < 0.09 && lum > 244) c = mix(BG, ROAD, Math.min(1, (lum - 244) / 11));      // minor roads (OSM land is ~239: stays dark)
  else if (sat > 0.16 && r >= b && lum > 170) c = MAJOR;                              // trunk/primary
  else if (b > r + 15 && b > g - 5) c = WATER;                                        // water
  else if (g > r + 8 && g >= b) c = PARK;                                             // green areas
  else if (sat < 0.12 && lum > 195 && lum < 232) c = BUILDING;                       // buildings (OSM land, ~239, is BG)
  else if (lum < 120) c = INK;                                                        // labels, icons
  else c = BG;
  out.set(c, i);
}

const jpg = await sharp(out, { raw: { width: info.width, height: info.height, channels: 3 } })
  .jpeg({ quality: 84, mozjpeg: true })
  .toBuffer();
await writeFile(OUT, jpg);
console.log(`Wrote ${OUT} (${W}×${H}, ${(jpg.length / 1024).toFixed(0)} KB). Open it and check the plant is dead centre.`);
