"use client";

import type { ComponentType } from "react";
import { useFormValue, type FieldProps } from "sanity";
import { Badge, Box, Card, Flex, Stack, Text } from "@sanity/ui";
import { IMAGE_SLOTS, type ImageSlot } from "../../src/content/image-slots.ts";

/**
 * SHOWING THE CURRENT PHOTOGRAPH IN THE STUDIO
 *
 * The site's photographs live as files in the repo, not in Sanity, so a plain
 * image field in the Studio starts empty — and an empty field next to a key
 * like `home.story` tells an editor nothing about what they are replacing.
 *
 * Both components here render the CURRENT file from the site itself. The
 * Studio is mounted at /studio on the same host as the site, so the file is
 * one relative URL away and no asset is copied into Sanity. Copying would
 * have moved every image byte onto the Sanity plan's bandwidth quota and
 * muddled "delete the override to restore the original", which only works
 * because the original is not in Sanity.
 *
 * `NEXT_PUBLIC_SITE_URL` overrides the origin for a Studio hosted elsewhere;
 * until then `window.location.origin` is exactly right. Preview deployments
 * behind Vercel's login will show a broken thumbnail — harmless, and the
 * production Studio is the one editors use.
 */

const siteOrigin = () =>
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  (typeof window !== "undefined" ? window.location.origin : "");

export const fileUrl = (slot: ImageSlot) => `${siteOrigin()}${slot.src}`;

/**
 * Resized by the site's own image optimiser, never the original.
 *
 * The originals are up to 1.9 MB each and the Photographs list draws 85 of
 * them at once — 47 MB to paint a column of 25px thumbnails, and the larger
 * files were still downloading when the editor looked. /_next/image serves
 * the same file at 64px in about 5 KB. `q` must be 75: Next 16 rejects any
 * quality not in `images.qualities`, and the default list is just [75].
 */
export const sizedUrl = (slot: ImageSlot, w: 64 | 384 | 640) =>
  `${siteOrigin()}/_next/image?url=${encodeURIComponent(slot.src)}&w=${w}&q=75`;

/** Registry key ← override document id. The id encodes dots as `__`. */
export const slotKeyFromId = (id: string) =>
  id.replace(/^drafts\./, "").replace(/^imageOverride-/, "").replace(/__/g, ".");

const bySlot = new Map(IMAGE_SLOTS.map((s) => [s.key, s]));
export const findSlot = (key: string) => bySlot.get(key);

/* ── List row thumbnail ─────────────────────────────────────────────── */

/**
 * A component per slot, because the structure builder's `icon` takes a
 * component type, not an element. Sized to the row; object-fit keeps the
 * crop honest for the tall portrait slots.
 */
export function slotIcon(slot: ImageSlot): ComponentType {
  const Icon = () => (
    // Studio UI, not a visitor page: next/image's optimisation pipeline is the
    // wrong tool for an editor's 25px thumbnail of a file already on disk.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={sizedUrl(slot, 64)}
      alt=""
      width={25}
      height={25}
      loading="lazy"
      style={{
        display: "block",
        width: 25,
        height: 25,
        objectFit: "cover",
        borderRadius: 3,
        background: "#2a2d33",
      }}
    />
  );
  Icon.displayName = `SlotIcon(${slot.key})`;
  return Icon;
}

/* ── "Currently showing" panel inside the override document ─────────── */

export function CurrentPhotographField(props: FieldProps) {
  const docType = useFormValue(["_type"]) as string | undefined;
  const id = useFormValue(["_id"]) as string | undefined;
  const hasReplacement = Boolean(
    (useFormValue(["image", "asset"]) as { _ref?: string } | undefined)?._ref,
  );
  const slot = id ? findSlot(slotKeyFromId(id)) : undefined;

  if (docType !== "imageOverride" || !slot) return props.renderDefault(props);

  const standIn = slot.status !== "final";
  const isPortrait = slot.h > slot.w;

  return (
    <Card padding={3} radius={2} tone="transparent" border>
      <Stack gap={3}>
        <Flex align="center" gap={2} wrap="wrap">
          <Text size={1}>
            <strong>{hasReplacement ? "The original this replaces" : "Currently on the site"}</strong>
          </Text>
          <Badge tone={standIn ? "caution" : "positive"} fontSize={0}>
            {standIn ? "stock stand-in" : "Margo photograph"}
          </Badge>
        </Flex>

        <Card
          radius={2}
          tone="default"
          style={{ background: "#17191c", overflow: "hidden", minHeight: isPortrait ? 320 : 240 }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- Studio preview of a repo file, not a visitor image */}
          <img
            src={sizedUrl(slot, 640)}
            alt={slot.alt || slot.title}
            onError={(e) => {
              // The optimiser declined (unsupported format, or a dev server
              // without it) — fall back to the file itself rather than a blank.
              const el = e.currentTarget;
              if (!el.dataset.fallback) {
                el.dataset.fallback = "1";
                el.src = fileUrl(slot);
              }
            }}
            style={{
              display: "block",
              margin: "0 auto",
              maxWidth: "100%",
              maxHeight: isPortrait ? 320 : 240,
              objectFit: "contain",
            }}
          />
        </Card>

        <Stack gap={2}>
          <Text weight="semibold">{slot.title}</Text>
          <Text size={1} muted>
            {slot.where}
          </Text>
          <Flex gap={3} wrap="wrap" align="center">
            <Text size={1} muted>
              {slot.w} × {slot.h} px
            </Text>
            <Text size={1} muted style={{ fontFamily: "monospace" }}>
              {slot.key}
            </Text>
            <Box>
              <a
                href={`${siteOrigin()}${slot.page}`}
                target="_blank"
                rel="noreferrer"
                style={{ fontSize: 13 }}
              >
                View the page ↗
              </a>
            </Box>
          </Flex>
        </Stack>

        <Text size={1} muted>
          Upload a replacement below and publish — it takes this picture’s exact
          place and size. To go back to this original, delete this document
          (the ⋮ menu next to Publish → Delete). Clearing the field won’t
          publish: a replacement needs a photograph.
        </Text>
      </Stack>
    </Card>
  );
}

/**
 * Wired at the CONFIG level, not on the schema field.
 *
 * The schema files are loaded by plain Node in `check:groups` and
 * `check:labels`, which cannot parse JSX. Importing this file from
 * imageOverride.ts would break both checks, so the schema declares the field
 * and this wrapper — registered in sanity.config.ts — decides how it renders.
 */
export function StudioField(props: FieldProps) {
  if (props.name === "current" && props.path.length === 1) {
    return <CurrentPhotographField {...props} />;
  }
  return props.renderDefault(props);
}
