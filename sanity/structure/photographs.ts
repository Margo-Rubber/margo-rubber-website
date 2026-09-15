import type { StructureBuilder } from "sanity/structure";
import { IMAGE_SLOTS } from "../../src/content/image-slots.ts";
import { PAGE_GROUPS } from "../../src/content/image-slot-labels.ts";
import { overrideId, slotIcon } from "../components/photographs.tsx";

/**
 * THE PHOTOGRAPHS SCREEN
 *
 * Built from the SLOT LIST, not from the documents.
 *
 * That distinction is the whole point, and getting it wrong the first time
 * made the screen useless: a plain document list shows photographs that have
 * been uploaded, so it reads "No documents of this type" until somebody has
 * already done the thing the screen exists to help them do. The 85 slots were
 * discoverable only by pressing + and opening a dropdown.
 *
 * Here every slot is a row, always, whether or not it has a photograph yet.
 * Opening one opens the editor for that slot's document, which is created on
 * first save — so nothing exists until a real photograph is uploaded, and the
 * list is still complete.
 *
 * Every row SHOWS its current picture and is named the way an editor would
 * name it — "Our story — plant photo", under "Home page" — with the registry
 * key kept out of sight. A key like `home.story` is for code; asking an
 * editor to decode it was the reason the first version of this screen needed
 * a developer standing beside it.
 *
 * Consequences worth having:
 *
 *  · The screen is a to-do list of the photography Margo still owes.
 *  · The document id is derived from the slot, so one slot cannot end up with
 *    two competing photographs — it is impossible rather than merely validated.
 *  · The slot is the id, so there is no slot field to pick, mistype, or leave
 *    disagreeing with the document it sits on.
 */

export { overrideId };

const AREA_ORDER = Object.keys(PAGE_GROUPS);

export function photographsMenu(S: StructureBuilder) {
  const byArea = new Map<string, typeof IMAGE_SLOTS>();
  for (const slot of IMAGE_SLOTS) {
    const area = slot.key.split(".")[0];
    if (!byArea.has(area)) byArea.set(area, []);
    byArea.get(area)!.push(slot);
  }

  const areas = [...byArea.keys()].sort(
    (a, b) =>
      (AREA_ORDER.indexOf(a) + 1 || 99) - (AREA_ORDER.indexOf(b) + 1 || 99) ||
      a.localeCompare(b),
  );

  return S.list()
    .title("Photographs")
    .items(
      areas.map((area) => {
        // Page order within a group, not key order: "Our story" before
        // "Our facility" because that is how the page reads, and a spare
        // that renders nowhere sinks to the bottom.
        const slots = [...byArea.get(area)!].sort(
          (a, b) =>
            Number(a.where.startsWith("Not shown")) -
              Number(b.where.startsWith("Not shown")) ||
            a.title.localeCompare(b.title),
        );
        const pending = slots.filter((s) => s.status === "placeholder").length;
        const groupTitle = PAGE_GROUPS[area] ?? area;

        return S.listItem()
          .id(area)
          .title(
            `${groupTitle}  —  ${
              pending === 0
                ? `${slots.length} done`
                : pending === 1 && slots.length === 1
                  ? "still a stand-in"
                  : `${pending} of ${slots.length} still stand-ins`
            }`,
          )
          .child(
            S.list()
              .title(groupTitle)
              .items(
                slots.map((slot) =>
                  S.listItem()
                    .id(slot.key.replace(/\./g, "_"))
                    .icon(slotIcon(slot))
                    .title(slot.title)
                    .child(
                      S.editor()
                        .id(slot.key.replace(/\./g, "_"))
                        .schemaType("imageOverride")
                        .documentId(overrideId(slot.key))
                        .title(slot.title),
                    ),
                ),
              ),
          );
      }),
    );
}
