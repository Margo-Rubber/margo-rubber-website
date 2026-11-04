import { worldLandSvg } from "@/components/sections/WorldMapArt";

/**
 * The land outline behind the /export trade-lane map. Prerendered at build
 * time: it reads no runtime data, and drawing it from the map's own projection
 * keeps the coastlines lined up with the pins.
 */
export async function GET() {
  return new Response(worldLandSvg(), {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
