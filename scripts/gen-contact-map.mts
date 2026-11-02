/**
 * CONTACT PAGE MAP — redraws public/images/contact/margo-plant-map-2026-11-access-road.jpg.
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
 * Location confirmed by Margo, 2 Nov 2026: the plant building itself. The
 * 27 Oct point (19.93545, 73.73312) put the pin on the highway, ~330 m north.
 */
import sharp from "sharp";
import { writeFile } from "node:fs/promises";

const LAT = Number(process.argv[2] ?? 19.932445350253296);
const LNG = Number(process.argv[3] ?? 73.73282183068572);
const OUT = "public/images/contact/margo-plant-map-2026-11-access-road.jpg";

const W = 1200, H = 900;
// Zoom 16 at full size (2 Nov 2026): wide enough to show the highway, the
// side roads and the area names around the plant, and OSM's own labels stay
// crisp because the tiles are not shrunk. 16.5 showed an unlabelled block.
const Z = 16;
const SCALE = 1;
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
   from the background. Labels come out light, everything else dark. */
const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const BG = hex("#161b21"), ROAD = hex("#a6b8be"), MAJOR = hex("#4b5459"),
  WATER = hex("#26343d"), PARK = hex("#1d262a"), BUILDING = hex("#262d34"), INK = hex("#c9d3d8"); // labels: light enough to read

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

/* ── The plant's own access road ──────────────────────────────────────────
   OSM does not map the lane into the plant (client, 2 Nov 2026). The way
   in, as Margo describe it: off the highway south down the colony road,
   left (east) into the lane, then left again (north) to the building — an
   inverse L. Drawn as minor road of OSM's width: east from the colony
   road's edge on the row TURN px south of the plant, then north to the
   centre, where the pin covers the end. */
{
  const cx = W / 2, cy = H / 2, HALF = 2; // 4 px, as OSM's minor roads at this zoom
  const TURN = 90; // px south of the plant where the lane leaves the colony road
  const ty = cy + TURN;
  const isRoad = (x: number) => out[(ty * W + x) * 3] === ROAD[0];
  let edge = -1;
  for (let x = cx; x > cx - 150; x--) if (isRoad(x)) { edge = x; break; }
  if (edge === -1) throw new Error("No colony road within 150 px west of the turn — check the map");
  const paint = (x0: number, x1: number, y0: number, y1: number) => {
    for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) out.set(ROAD, (y * W + x) * 3);
  };
  paint(edge + 1, cx + HALF, ty - HALF, ty + HALF); // east along the lane
  paint(cx - HALF, cx + HALF, cy, ty + HALF); // north to the plant
  console.log(`Access road: east from x=${edge} at y=${ty}, then north to the plant at ${cx},${cy}`);
}

const jpg = await sharp(out, { raw: { width: info.width, height: info.height, channels: 3 } })
  .jpeg({ quality: 84, mozjpeg: true })
  .toBuffer();
await writeFile(OUT, jpg);
console.log(`Wrote ${OUT} (${W}×${H}, ${(jpg.length / 1024).toFixed(0)} KB). Open it and check the plant is dead centre.`);
