"use client";

import { useState, type ComponentType } from "react";
import {
  useDocumentOperation,
  useFormValue,
  type DocumentActionComponent,
  type FieldProps,
} from "sanity";
import { useRouter } from "sanity/router";
import type { UserViewComponent } from "sanity/structure";
import { Badge, Box, Button, Card, Flex, Stack, Text } from "@sanity/ui";
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

/**
 * Deterministic: one override document per slot, by construction.
 *
 * Dots are ENCODED, not passed through. Sanity reserves the dot for
 * namespacing document ids — `drafts.`, `versions.<release>.` — and an id
 * containing one is invisible to the published perspective. It still saves,
 * still reads back by id, and simply never appears in a published query: a
 * document that exists and cannot be found.
 */
export const overrideId = (slot: string) =>
  `imageOverride-${slot.replace(/\./g, "__")}`;

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
          place and size. To go back to this original, use{" "}
          <strong>Restore original photograph</strong> next to Publish.
          Clearing the field won’t publish: a replacement needs a photograph.
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

/* ── The "Photographs" tab on every page document ───────────────────── */

/**
 * WHICH PHOTOGRAPHS BELONG TO THIS PAGE — derived, not listed.
 *
 * A page's images are the registry keys its document actually contains:
 * the hero key, every block's image key, every card's. Walking the document
 * for strings that are registry keys finds all of them, in the order the
 * document stores them, and a page that gains a section gains its
 * photographs here without anyone maintaining a second list.
 *
 * The few images a component hard-codes rather than reads from the document
 * are the exception, listed once per type below so they are not invisible.
 */
const CODE_ONLY: Record<string, string[]> = {
  certificationsPage: ["certifications.hero"],
  sku: ["sku.product", "sku.finishing", "sku.machining"],
  siteFooter: ["brand.mark", "brand.logo"],
  aboutPage: ["about.story.gauge"],
};

function collectKeys(value: unknown, out: string[]): void {
  if (typeof value === "string") {
    if (bySlot.has(value) && !out.includes(value)) out.push(value);
  } else if (Array.isArray(value)) {
    for (const v of value) collectKeys(v, out);
  } else if (value && typeof value === "object") {
    for (const v of Object.values(value as Record<string, unknown>)) collectKeys(v, out);
  }
}

function heroKeyOf(doc: Record<string, unknown> | null): string | undefined {
  const hero = doc?.hero as { image?: unknown } | undefined;
  const candidates = [hero?.image, doc?.heroImage];
  return candidates.find((c): c is string => typeof c === "string" && bySlot.has(c));
}

export const PhotographsView: UserViewComponent = ({ document, schemaType }) => {
  const router = useRouter();
  const displayed = (document.displayed ?? null) as Record<string, unknown> | null;

  const keys: string[] = [];
  const hero = heroKeyOf(displayed);
  if (hero) keys.push(hero);
  collectKeys(displayed, keys);
  for (const k of CODE_ONLY[schemaType.name] ?? []) if (!keys.includes(k)) keys.push(k);

  const slots = keys.map((k) => bySlot.get(k)!).filter(Boolean);

  if (slots.length === 0) {
    return (
      <Box padding={4}>
        <Text muted>This page has no photographs of its own.</Text>
      </Box>
    );
  }

  return (
    <Box padding={4}>
      <Stack gap={4}>
        <Text size={1} muted>
          Every photograph this page draws, in page order. Open one to replace it —
          the replacement takes the same place and size. Photographs shared with
          other pages say so.
        </Text>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: 12,
          }}
        >
          {slots.map((slot) => {
            const isHero = slot.key === hero;
            const standIn = slot.status !== "final";
            return (
              <Card key={slot.key} radius={2} border overflow="hidden">
                <Card
                  style={{ background: "#17191c", aspectRatio: "4 / 3", overflow: "hidden" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element -- Studio preview of a repo file */}
                  <img
                    src={sizedUrl(slot, 384)}
                    alt={slot.alt || slot.title}
                    loading="lazy"
                    style={{ display: "block", width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </Card>
                <Box padding={3}>
                  <Stack gap={2}>
                    <Flex gap={2} align="center" wrap="wrap">
                      {isHero && (
                        <Badge tone="primary" fontSize={0}>
                          Hero
                        </Badge>
                      )}
                      <Badge tone={standIn ? "caution" : "positive"} fontSize={0}>
                        {standIn ? "stock stand-in" : "Margo photograph"}
                      </Badge>
                    </Flex>
                    <Text weight="semibold" size={1}>
                      {slot.title}
                    </Text>
                    <Text size={1} muted>
                      {slot.where}
                    </Text>
                    <Button
                      text="Replace this photograph"
                      mode="ghost"
                      fontSize={1}
                      onClick={() =>
                        router.navigateIntent("edit", {
                          id: overrideId(slot.key),
                          type: "imageOverride",
                        })
                      }
                    />
                  </Stack>
                </Box>
              </Card>
            );
          })}
        </div>
      </Stack>
    </Box>
  );
};

/* ── "Restore original photograph" — the delete, named for what it does ── */

/**
 * The override document IS the replacement; removing it is what puts the
 * original back. The built-in Delete does exactly this, but "Delete" beside
 * an image an editor has just uploaded reads as "destroy my photograph", and
 * the first editor to try going back cleared the field instead — which
 * leaves a document that cannot be published. This action says what will
 * happen, shows the original that will return, and does the same delete.
 */
export const RestoreOriginalAction: DocumentActionComponent = (props) => {
  const { id, type, draft, published, onComplete } = props;
  const { delete: del } = useDocumentOperation(id, type);
  const [open, setOpen] = useState(false);
  const slot = findSlot(slotKeyFromId(id));
  const nothingToRestore = !draft && !published;

  if (!slot) return null;

  return {
    label: "Restore original photograph",
    tone: "caution",
    disabled: nothingToRestore || Boolean(del.disabled),
    title: nothingToRestore
      ? "Nothing has been uploaded for this slot yet — the site already shows the original."
      : "Remove the uploaded replacement so the site shows the original photograph again.",
    onHandle: () => setOpen(true),
    dialog: open && {
      type: "confirm",
      tone: "caution",
      confirmButtonText: "Restore original",
      cancelButtonText: "Keep my photograph",
      message: (
        <Stack gap={3}>
          <Text>
            The site will go back to this photograph for <strong>{slot.title}</strong>.
            Your uploaded replacement is removed — you can upload it again later.
          </Text>
          <Card style={{ background: "#17191c", overflow: "hidden" }} radius={2}>
            {/* eslint-disable-next-line @next/next/no-img-element -- Studio preview of a repo file */}
            <img
              src={sizedUrl(slot, 384)}
              alt={slot.alt || slot.title}
              style={{ display: "block", margin: "0 auto", maxWidth: "100%", maxHeight: 200, objectFit: "contain" }}
            />
          </Card>
        </Stack>
      ),
      onCancel: () => setOpen(false),
      onConfirm: () => {
        del.execute();
        setOpen(false);
        onComplete();
      },
    },
  };
};
