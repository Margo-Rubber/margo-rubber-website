# /industries/medical-devices: what the Medical page brief changes

Sources:
- Brief: `src/MED/handover.html`, "Medical Devices page: change brief", 42 Now/Change-to items in sections 00 to 15. Stripped text is in `MED/handover.txt`.
- Live doc: Sanity `industry-medical-devices`, `_rev 1ILl7KQjqHfOaNFPI2vJB1`, updated 2026-10-26T11:24:39Z. Saved copy: `MED/live/doc.json`.
- Hero image doc: `imageOverride-industries__medical-devices__hero`.

All paths here are relative to `/tmp/claude-0/-home-user/02edad7f-842b-540a-8461-ceee5618f0af/scratchpad/`. Repo paths are relative to `/home/user/margo-rubber-website`.

Characters copied as the brief writes them: "−" is U+2212, and there is a normal space before "°C". Apostrophes are straight.

---

## 1. Summary

This is a full rewrite of the page's medical claims, plus a restructure of three sections. It does more than change the title, H1 and meta.

**Text changes:**
- `seo.title`, `seo.description`, H1 and `intro` are rewritten.
- The 7-tab `block.componentTabs` is replaced by three grouped card grids with 10 new product cards and images (MED-01…10).
- The 4 application tiles are rewritten.
- The 4 compound tiles become 3 (EPDM / FKM / Silicone), with a new compound table under them.
- The custom-engineering paragraph and bullets become an H3, a line and a 6-step ordered process.
- The quality intro and two of the three quality cards change.
- The export heading, map label and first paragraph change.
- The disclaimer (`nonClaims[0]`) is replaced.
- In the FAQs: 1 is rewritten, 2 are added, 1 answer is rewritten, 1 is deleted and the minimum-order FAQ is replaced.
- The first sentence of the closing band changes.

**Changes with no field in the data model (need code):**
- A scope line under the H1 and a certification line beside the hero buttons.
- An answer paragraph under the hero.
- A caption under the components.
- A link on the title of quality card 1.
- `areaServed` in the JSON-LD.
- The first FAQ open by default.
- Hero overlay, object-position and mobile layout, card background colour and image sizing.

**Other pages and sitewide:** sections 11 and 12 and the hreflang item affect other pages or the whole site (catalogue form, footer, menu, tap targets, third-party scripts, hreflang, `/api/enquiry` log check). Section 13 asks for anchor ids on 5 product-category pages.

**Label and URL:** "Medical Devices" (`navLabel`) and `/industries/medical-devices` stay as they are. Nothing in the brief changes them.

### Sanity vs the .mdx fallback

`src/content/industries/medical-devices.mdx` does **not** match the Sanity doc. It is an older draft:
- **Title, H1 and description differ.** Title "Medical Device Rubber Components | Margo Rubber". H1 "Rubber Components for Medical Devices". Description "…ISO 9001:2015, MOQ 500pcs…".
- **Components:** 3 component cards instead of 7. Card bullets include "MOQ 500 pcs per part number".
- **FAQ:** the minimum-order answer is "500 pieces per part number, per material".
- **Other sections:** the quality chips, closing and export rows also differ.

It also breaks the site rules (a numeric minimum order, biocompatible, clean-room and FDA wording).

The page renders from Sanity. The mdx is only used if the Sanity doc fails Zod validation (`src/lib/industry-source.ts` logs and falls back silently). So any new block that fails validation would put this worse copy live. Either bring the mdx in line as well, or at least check the doc with `npm run check:cms` after editing.

---

## 2. Field-by-field changes (Sanity doc `industry-medical-devices`)

Current `sections` order:

| Index | Block type | `_key` |
|---|---|---|
| [0] | `block.componentTabs` | `components` |
| [1] | `block.industryApplications` | `applications` |
| [2] | `block.conditionGrid` | `conditions` |
| [3] | `block.customPanel` | `custom` |
| [4] | `block.qualityCards` | `quality` |
| [5] | `block.exportLane` | `exportLane` |
| [6] | `block.industryFaq` | `faqs` (projects `^.faqs`) |
| [7] | `block.closingBand` | `closing` |

### 2.1 Search title, meta and JSON-LD (brief §01)

| Field | Current | New (verbatim) |
|---|---|---|
| `seo.title` (also og:title and twitter:title through `buildMetadata`) | `Silicone & Rubber Components for Medical Devices \| Margo` | `Rubber components for medical & laboratory equipment \| Margo` (60 chars, under the 70 max) |
| `seo.description` (also og/twitter description, and the Service description through the `serviceNode` fallback) | `Biocompatible silicone O-rings, gaskets, diaphragms and bellows for diagnostic and laboratory equipment, moulded to drawing in Nashik, India. ISO 9001:2015. Clean-room packaging available.` | `Rubber parts for laboratory and diagnostic equipment, moulded to drawing in EPDM, FKM or silicone at our ISO 9001:2015 plant in Nashik, India.` (142 chars) |
| `schemaService.name` (optional: unset today, so it falls back to `h1`) | (unset → `h1`) `Silicone & Rubber Components for Medical Devices, Manufactured in India` | `Rubber components for medical & laboratory equipment`. This already results once `h1` changes. Setting it explicitly is safer. |
| `schemaService.description` (optional, falls back to `seo.description`) | (unset → seo.description above) | `Rubber parts for laboratory and diagnostic equipment, moulded to drawing in EPDM, FKM or silicone at our ISO 9001:2015 plant in Nashik, India.` |
| JSON-LD Service `areaServed` (§15) | none | `"areaServed":[{"@type":"Country","name":"India"},{"@type":"Country","name":"Australia"},{"@type":"Country","name":"United Kingdom"},{"@type":"Country","name":"United States"},{"@type":"Country","name":"Singapore"},{"@type":"Country","name":"United Arab Emirates"}]`. **No field exists.** It needs a code change in `serviceNode()` (`src/lib/schema.ts:383`), or a new `schemaService.areaServed` field. |
| `seo.keywords` (Sanity `primaryKeyword` / `secondaryKeywords`), optional record (§15) | none | primary `rubber components for medical devices`; secondary `silicone medical parts`, `laboratory equipment gaskets` |

The brief says that biocompatible, bellows and clean-room must not appear in any of these fields. The new values meet this.

### 2.2 Hero (brief §02)

| Field | Current | New (verbatim) |
|---|---|---|
| `h1` | `Silicone & Rubber Components for Medical Devices, Manufactured in India` | `Rubber components for medical & laboratory equipment` |
| `h1Lines` | `["Silicone & Rubber Components for Medical Devices,", "Manufactured in India"]` | The brief gives no line split. Suggested: `["Rubber components for", "medical & laboratory equipment"]`. |
| `h1AccentLines` | `[1]` | Keep `[1]`. This is a judgement call. |
| `intro` | `Clean-room-compatible rubber components for diagnostic and laboratory equipment, moulded in biocompatible silicone at our ISO 9001:2015 facility in Nashik, India.` | `Lab and diagnostic instrument parts in EPDM, FKM or silicone, chosen by chemistry.` (82 chars; the minimum is 40) |
| **NEW** scope line under the H1 | none | `Parts for laboratory and diagnostic equipment. We do not make patient-contact parts.` **No field exists.** `heroChips` is for short uppercase chips, not sentences. Needs a new field (for example `heroScope`) in the Zod `industrySchema`, the Studio `industry.ts`, the GROQ `industryBySlugQuery` and `IndustryHero`. |
| **NEW** certification line beside the hero buttons | none | `ISO 9001:2015 certified. Medical-device certification is in progress.` **No field exists.** Same code path as the scope line (for example `heroNote`). |
| Hero image | Override doc `imageOverride-industries__medical-devices__hero`, alt `Medical device components moulded in silicone and EPDM`. Asset `5c67d309…-2880x1520.png` (silicone tubing). | Upload `public/images/release-2026-10/med-hero.webp` as the override's `image`. Set `alt` = `Rubber seals, gaskets, port plugs and feet on a laboratory bench`. See §3. |
| `hero.alt` (doc field; the hero `Img` takes its alt from the override or registry, so this field is not what renders) | `Medical Devices industry environment` | Set it to `Rubber seals, gaskets, port plugs and feet on a laboratory bench` for consistency. |
| Hero styling (code: `IndustryHero` in `src/components/sections/IndustryDetail.tsx`, shared by all industry pages) | `object-cover brightness-[0.85]` plus gradients | "keep a dark overlay strong enough for the H1 and intro to reach at least 4.5:1 contrast, and set object-position: 75% 60% so the parts sit right of the text column. Below 640 px, place the image under the hero text instead of behind it." Also from §15: "Serve the hero at no more than 1200 px wide on mobile as WebP or AVIF via sizes; keep fetchpriority="high"." This needs a per-page switch or prop, otherwise every industry hero changes. |

`badge` (`OEM COMPONENT SUPPLIER · DRAWING-MATCHED PRODUCTION`) and `actions` are not mentioned. Keep them.

### 2.3 NEW answer paragraph under the hero (§15)

Placement: "directly under the hero certification line, before the Components section". Text:

> Margo Rubber Products moulds rubber components for laboratory and diagnostic equipment at its ISO 9001:2015 certified plant in Nashik, India: fluid-path O-rings, valve-manifold gaskets, steriliser door gaskets, port plugs, instrument feet and laboratory stoppers, made to your drawing in EPDM, FKM or silicone. We do not make patient-contact parts. Prototypes take 48 to 72 hours with an existing tool, about 1 week for a new part, and material test reports ship with every shipment.

There is no Sanity field for it. The nearest mechanism is `AnswerLead`, an entry in `src/content/answer-blocks.ts` keyed by `"/industries/medical-devices"`. It renders right after the hero and before the blocks, so the position is right. The catch:
- It **requires a question `q`, rendered as an H2**, and the brief gives none.
- Unless `faq: false` is set, it is also prepended to the FAQPage JSON-LD.

The options are:
- a code change, so AnswerLead can render without a question, or
- a new hero field.

### 2.4 Components section → replace `sections[0]` (§03, §13, §14, §15)

**Remove** `sections[0]` (`block.componentTabs`, `_key components`) completely, including all 7 items: O-Rings, Gaskets, Bellows & Boots, Diaphragms, Extruded Tubing & Profiles, Grommets, and Pads, Stoppers & Caps. Their bullets carry "Biocompatible silicone (VMQ) as standard" and "−60 to +220 °C — clears autoclave at 121 to 134 °C".

**Block choice: three `block.cardGrid` blocks with `layout: "plain"`.** `block.cardGrid` is in the industry `ALLOWED_BLOCKS` list. With `layout: "plain"` (`PlainCards` in `src/components/sections/CategoryBlocks.tsx`) it already provides what the brief asks for:
- a `group` field rendered as an `<h3>` over the cards, with card titles stepping down to `<h4>`;
- a card made of an image (Sanity image, alt, a 4:3 box, `fit="contain"`), the name linked to `href`, and the body line.

A grid can also have no eyebrow or heading (the "second grouped grid" case in `profileSectionSchema`). `componentTabs` is a tab UI with registry-key images and bullets, so it cannot show three groups of image cards.

Each grid needs its own `id`. Otherwise all three get `id="cards"`.

**New `sections[0]`** (`_type: "block.cardGrid"`, `_key: "components"`, `layout: "plain"`):
- `id`: `components`
- `eyebrow`: `COMPONENTS WE SUPPLY FOR MEDICAL DEVICES` (kept; the brief does not change it)
- `heading`: `Engineered to Spec, Not to Catalogue` (kept)
- `body`: new first sentence, then the current body unchanged:
  `A laboratory-equipment rubber component is a moulded or extruded elastomer part, such as a seal, gasket, plug or foot, that sits inside an instrument rather than touching a patient. We don’t stock generic parts. Each component is produced against your drawing or an OEM sample — compound, hardness and geometry matched to the fluid path and the sterilisation cycle rather than picked from a catalogue.`
- `group`: `Fluid path`
- `items`: every card's `body` is the same line, `Made to your drawing. Send the drawing (or a sample), the medium and the working temperature.` `image.alt` is the card title exactly.

| # | `name` | `href` | `image` (file → alt) |
|---|---|---|---|
| 1 | `Fluid-path O-rings` | `/products/o-rings` (no anchor; the brief says there is no matching card on the O-rings page) | med-01.webp → `Fluid-path O-rings` |
| 2 | `Valve-manifold gaskets & flange seals` | `/products/gaskets#valve-manifold-gaskets-flange-seals` | med-02.webp → `Valve-manifold gaskets & flange seals` |
| 3 | `Instrument valve diaphragms` | `/products/diaphragms#instrument-valve-diaphragms` | med-03.webp → `Instrument valve diaphragms` |
| 4 | `Instrument micro-pump diaphragms` | `/products/diaphragms#instrument-micro-pump-diaphragms` | med-04.webp → `Instrument micro-pump diaphragms` |
| 5 | `Silicone pump tubing & profiles` | `/products/extrusion#silicone-pump-tubing-profiles` | med-05.webp → `Silicone pump tubing & profiles` |

**New `sections[1]`** (`block.cardGrid`, `_key: "components-chambers"`, `layout: "plain"`, `id: "components-chambers-doors-ports"`, no eyebrow or heading):
- `group`: `Chambers, doors & ports`
- `items`: same body line on every card, alt = title.

| # | `name` | `href` | `image` (file → alt) |
|---|---|---|---|
| 6 | `Instrument door & lid gaskets` | `/products/gaskets#instrument-door-lid-gaskets` | med-06.webp → `Instrument door & lid gaskets` |
| 7 | `Steriliser lid & door gaskets` | `/products/gaskets#steriliser-lid-door-gaskets` | med-07.webp → `Steriliser lid & door gaskets` |
| 8 | `Access-port plugs & pass-through grommets` | `/products/grommets#access-port-plugs-pass-through-grommets` | med-08.webp → `Access-port plugs & pass-through grommets` |

**New `sections[2]`** (`block.cardGrid`, `_key: "components-bench"`, `layout: "plain"`, `id: "components-bench-hardware"`, no eyebrow or heading):
- `group`: `Bench hardware`
- `items`: same body line on every card, alt = title.

| # | `name` | `href` | `image` (file → alt) |
|---|---|---|---|
| 9 | `Instrument feet & suction feet` | `/products/pads-stoppers-caps#instrument-feet-suction-feet` | med-09.webp → `Instrument feet & suction feet` |
| 10 | `Laboratory stoppers` | `/products/pads-stoppers-caps#laboratory-stoppers` | med-10.webp → `Laboratory stoppers` |

**Optional card ids.** The brief's rule is: lower case, hyphens, drop `&` and punctuation. The ids would be:
- `fluid-path-o-rings`
- `valve-manifold-gaskets-flange-seals`
- `instrument-valve-diaphragms`
- `instrument-micro-pump-diaphragms`
- `silicone-pump-tubing-profiles`
- `instrument-door-lid-gaskets`
- `steriliser-lid-door-gaskets`
- `access-port-plugs-pass-through-grommets`
- `instrument-feet-suction-feet`
- `laboratory-stoppers`

The brief only requires ids on the category pages (§13), not here.

**NEW caption under the Components section:** `Illustrative product images.`. No `block.cardGrid` field fits:
- `groupPhoto.caption` renders only with a group photo, and above the cards.
- There is no footnote field.

Options: a code change (add `footnote` to `cardGridSchema` and the Studio field), or a one-line `block.richText` after the third grid.

**Code-side requirements for the cards (§03, §15):**
- **Background colour.** "object-fit: contain on a light grey (#F3F7F8) card background". `PlainCards` uses `bg-white`, so this needs a code change, and `PlainCards` is shared with the category pages.
- **Image sizing.** "Render with explicit width={2400} height={1600}, sizes="(max-width: 640px) 100vw, 33vw" and style width:100%, height:auto". `SanityPhoto` is used with `fill` today. The real files are 1600×1067, not 2400×1600 (see §4).
- **Old anchors.** "Before removing the old card ids (e.g. #component-o-rings), search the site for links to /industries/medical-devices#component-". I searched the repo (`src`, `sanity`, `public`) and every document in the public Sanity dataset. There are **no links** to `/industries/medical-devices#component-…`, so nothing needs repointing.

### 2.5 Where our components are used → `sections[3]` (was [1]) `block.industryApplications` (§04)

`eyebrow` (`WHERE OUR COMPONENTS ARE USED`) and `heading` (`Built into diagnostic and laboratory equipment.`) are unchanged.

Replace `items` (4) in this order:

| Field | Current | New (verbatim) |
|---|---|---|
| `items[0].name` / `.body` | `Diagnostic instrumentation` / `Fluid-path seals and [gaskets](/products/gaskets) for analysers and sample-handling equipment, in biocompatible silicone assessed to ISO 10993.` | `Analysers and diagnostic instruments` / `Fluid-path seals and gaskets for analysers and sample-handling equipment, in EPDM, FKM or silicone.` |
| `items[1].name` / `.body` | `Peristaltic & metering pumps` / `Extruded silicone tubing for pump sets, and moulded [diaphragms](/products/diaphragms) produced against controlled drawing revisions.` | `Laboratory pumps and valves` / `Extruded silicone tubing for pump sets, and moulded diaphragms produced against controlled drawing revisions.` |
| `items[2].name` / `.body` | `Laboratory equipment` / `Housing gaskets, closures, instrument feet and vibration isolation for benchtop instrumentation.` | `Sterilisers and incubators` / `Door and lid gaskets in EPDM for steam cycles, made to the OEM drawing.` |
| `items[3].name` / `.body` | `Fluid handling assemblies` / `Valve diaphragms and connector seals in biocompatible silicone.` | `Lab benches and glassware` / `Instrument feet, suction feet and laboratory stoppers.` |

The brief's text drops the two inline markdown links (gaskets, diaphragms). Copied verbatim, without the links.

### 2.6 Compounds → `sections[4]` (was [2]) `block.conditionGrid` (§05)

| Field | Current | New |
|---|---|---|
| `body` (2nd sentence only) | `Medical and laboratory equipment places specific demands on the materials in the fluid path. Compound selection is driven by biocompatibility requirements, sterilisation method and service temperature.` | `Medical and laboratory equipment places specific demands on the materials in the fluid path. Compound selection is driven by the fluids contacted, the cleaning or sterilisation method and the service temperature.` |
| `items` | 4 tiles: Biocompatible silicone (shield); Sterilisation tolerance (thermo, "−60 to +220 °C"); Low compression set (wave, "ASTM D395 Method B, which we run in-house"); Clean handling (dust) | **Remove all 4.** Add the 3 tiles below. |

| Item | `name` | `body` | `icon` |
|---|---|---|---|
| `items[0]` | `EPDM` | `Steam and aqueous reagents.` | not given |
| `items[1]` | `FKM (fluoroelastomer)` | `Solvents and oils.` | not given |
| `items[2]` | `Silicone (VMQ)` | `Dry-heat steriliser gaskets and seals; limited life in steam (use EPDM for steam). Tell us the fluid and the cleaning or sterilisation method and we will confirm what the compound supplier can evidence.` | not given |

`icon` is **required**, one of `shield`, `wave`, `thermo` or `dust`, and the brief gives none. Suggestion: EPDM `thermo`, FKM `shield`, Silicone `wave`.

Also from the brief:
- "Add 3 tiles of equal size." `ConditionGrid` is `md:grid-cols-2`, so 3 tiles leave an odd one out. It needs a 3-column variant (code).
- "Do not add a test statement anywhere on this page." This removes "ASTM D395 Method B, which we run in-house".

### 2.7 NEW compound table → new `block.specTable` after the conditionGrid, as `sections[5]` (§15)

Block choice: `block.specTable` (`specSectionSchema`). It is in industry `ALLOWED_BLOCKS` and has `caption`, `columns`, `rows` and `controls`. In Sanity, `rows` are stored as `{cells:[…]}` objects (the query flattens them).

```
_type: block.specTable   _key: compound-table
id: compound-table                      (otherwise the section id defaults to "specifications")
heading: Which compound for which duty  (REQUIRED, min 4. The brief gives only a caption, so the caption text is reused here; this is a judgement call)
caption: Which compound for which duty
controls: false
columns: ["Compound", "Choose it for", "Limit"]
rows:
  ["EPDM", "Steam, autoclave sterilisation, aqueous reagents", "Not stated on this page"]
  ["FKM (fluoroelastomer)", "Solvents and oils", "Not stated on this page"]
  ["Silicone (VMQ)", "Dry-heat steriliser gaskets and seals; −60 to +200 °C (standard grade, dry air)", "Not suitable for steam above 121 °C; limited life in steam below that"]
```

`BlockRenderer` does not pass `caption` to `SpecTable`, so the brief's `<caption>` will not render without a code change.

Row 3 is now the only silicone temperature on the page. It uses the approved form "−60 to +200 °C (standard grade, dry air)". After all the edits, no "+220" remains in the doc. Re-check the rendered page source anyway: the brief asks for this, and siteSettings still carries VMQ `maxC: 220` (see §4).

### 2.8 Custom engineering → `sections[6]` (was [3]) `block.customPanel` (§15)

Keep:
- `eyebrow` `CUSTOM ENGINEERING`
- `heading` (H2) `We match your device spec, not the other way around.`
- `cta` `{label: "Discuss a Custom Component", href: "/contact"}`
- `image` and `imageCaption`

Replace `body` and `bullets`:

| Field | Current | New (verbatim) |
|---|---|---|
| `body` | `Margo operates dedicated tooling capability for custom rubber components. Send us your OEM drawing, an existing part, or the equipment make and model — we reverse-engineer and produce to your specification.` | Sub-heading `<h3>How Margo takes a lab-equipment part from drawing to shipment</h3>`, then the line `This is Margo's own process at the Nashik plant.` |
| `bullets` (5) | OEM drawing and sample matching; Custom mould tooling in-house; Compound selection by application; Pre-production sample approval process; Long-run production with consistent batch quality | Ordered list, in the 6 rows below. |

The ordered list:
1. `You send the drawing or a sample, the fluid contacted, the cleaning or sterilisation method and the working temperature.`
2. `We recommend EPDM, FKM or silicone and confirm what the compound supplier can evidence.`
3. `Prototype: 48 to 72 hours with an existing tool; about 1 week for a new part.`
4. `You approve the pre-production sample before volume release.`
5. `Production runs against your controlled drawing revision, and the revision is recorded on every despatch document.`
6. `Material test reports ship with every shipment.`

**No block fits as-is.** `CustomPanel` renders `body` as a `<p>` and `bullets` as a `<ul>` of dots, with no H3 and no `<ol>`.
- `block.processTimeline` is numbered, but it is not in industry `ALLOWED_BLOCKS` and needs a `name` plus a body of at least 20 characters per step.
- `block.richText` could hold an H3 and an `<ol>`, but it would be a separate section, outside this panel and its CTA.

Recommended: a small code change. Add optional `subheading` and `steps` (ordered) to `industryCustomSchema`, the Studio field and `CustomPanel`.

Interim fallback, which loses the `<h3>` and `<ol>` semantics: `body` = `This is Margo's own process at the Nashik plant.` and `bullets` = the 6 steps.

### 2.9 Quality & certification → `sections[7]` (was [4]) `block.qualityCards` (§06, §15)

`eyebrow`, `heading` (`Every batch. Every shipment.`) and `links` (3) are unchanged.

| Field | Current | New |
|---|---|---|
| `body` | `Margo Rubber Products holds ISO 9001:2015 certification, certificate 09111526A, issued by Integral Certification Ltd and valid to 21 February 2027. Our quality management system covers incoming raw material inspection, in-process control and outgoing batch documentation.` | `ISO 9001:2015 certified. Medical-device certification is in progress. Our quality management system covers incoming raw material inspection, in-process control and outgoing batch documentation.` The brief says "no validity date; the certificate number stays on card 1" and to keep the QMS sentence. |
| `items[0]` (`iso-9001-2015`) | name `ISO 9001:2015`; body `Certified quality management covering all production and inspection processes. Certificate 09111526A, Integral Certification Ltd. Documentation available on request.` | Keep "as now", but the **title must link**: `<a href="https://www.iso.org/standard/62085.html">ISO 9001:2015</a>`. `QualityCards` renders `name` as plain text, so markdown in `name` will not link. Needs a code change (pass `name` through `emphasised()`, or add an `href` to the item). |
| `items[1]` (was `oem-compliance`) | `OEM compliance` / `Every component produced against a controlled drawing revision. No substitutions without approval.` | **Replace** with name `ISO 3601-1 / SAE AS568` and body `O-ring sizes to [ISO 3601-1](https://www.iso.org/standard/58043.html) (ISO) and [SAE AS568](https://www.sae.org/standards/as568f-aerospace-size-standard-o-rings) (SAE International).` The body goes through `emphasised()`, which turns `[text](https://…)` into links, so this markdown form gives the brief's two anchors. Keep `chip: ""`. |
| `items[2]` (was `batch-traceability`) | `Batch traceability` / `Raw material certificates and batch records retained per shipment. Available to medical device buyers on request.` | **Replace** with name `Certification` and body `Biocompatibility sits with the finished device.` Keep `chip: ""`. |

### 2.10 Export supply → `sections[8]` (was [5]) `block.exportLane` (§07)

| Field | Current | New (verbatim) |
|---|---|---|
| `heading` | `Direct supply from Nashik to device manufacturers.` | `Supply from Nashik to laboratory and diagnostic equipment makers.` |
| `card.subtitle` (the "map label") | `Direct OEM supply chain from Nashik, Maharashtra` | `Shipped from Nashik, Maharashtra` |
| `paragraphs[0]` | `Margo Rubber Products exports moulded silicone components directly to diagnostic and laboratory equipment manufacturers, with full export documentation managed from Nashik.` | `We can supply laboratory and diagnostic equipment makers in the markets listed, with full export documentation managed from Nashik.` |

Keep `paragraphs[1]`, `rows`, `card.title`, `card.regions` (Australia, United Kingdom, United States, Singapore, United Arab Emirates) and `card.footnote`.

### 2.11 Disclaimer box → `nonClaims[0]` (§08)

- **Current:** `Margo Rubber Products holds ISO 9001:2015 certification only. We do not hold ISO 13485 certification or FDA registration, and we make no medical-device regulatory claim. Biocompatible silicone is offered as a moulding capability; regulatory responsibility for the finished device remains with the manufacturer.`
- **New:** `ISO 9001:2015 certified. Medical-device certification is in progress. Silicone (VMQ) is offered as a moulding capability; suitability is assessed on the finished device.`

### 2.12 FAQ → doc-level `faqs[]`

These feed both the on-page FAQ (`sections[…] block.industryFaq` projects `^.faqs`) and the FAQPage JSON-LD (§09). The new list is in this order. The live order today is: FDA, compounds, clean-room, minimum order, drawing revision.

| New | `_key` (current, or suggested) | `q` | `a` |
|---|---|---|---|
| `faqs[0]` | `do-you-hold-fda-or-iso-13485-approval` (suggest re-keying to `do-you-hold-medical-device-certification`) | was `Do you hold FDA or ISO 13485 approval?` → **`Do you hold medical-device certification?`** | Replace the whole answer: `ISO 9001:2015 certified. Medical-device certification is in progress. Our ISO 9001:2015 certificate is 09111526A. We mould parts to your drawing in EPDM, FKM and silicone for laboratory and diagnostic equipment, not patient-contact parts. Regulatory responsibility for the finished device stays with the manufacturer; we provide material certificates, batch records and drawing-revision documentation.` (401 chars, under the 700 max) |
| `faqs[1]` NEW | `are-your-parts-biocompatible` | `Are your parts biocompatible?` | `We do not claim biocompatibility. It is assessed on the finished device. We make non-patient-contact parts for laboratory and diagnostic equipment.` |
| `faqs[2]` NEW | `silicone-or-epdm-for-steam` | `Silicone or EPDM for steam?` | `EPDM for steam and autoclave sterilisation. Silicone is not suitable for steam above 121 °C and has a limited life in steam below that.` |
| `faqs[3]` (brief "FAQ 4") | `which-compounds-are-available-for-fluid-` | `Which compounds are available for fluid-path components?` (unchanged) | Replace: `EPDM for steam and aqueous reagents, FKM for solvents and oils, and silicone (VMQ) for dry heat. Send the fluid and the cleaning or sterilisation method and we will confirm the compound and what the compound supplier can evidence.` |
| DELETE | `can-you-support-clean-room-packaging` | `Can you support clean-room packaging?` | Delete the question and answer. |
| `faqs[4]` (brief "FAQ 5") | `is-there-a-minimum-order-quantity` (suggest `what-is-the-minimum-order`) | was `Is there a minimum order quantity?` → **`What is the minimum order?`** | Replace (the old answer had "Minimum run is 10,000 pieces…"): `Minimum order is set against part size and tooling, not a fixed number. Send the drawing and annual volume and we quote both. Prototype within 48 to 72 hours for a part with an existing tool; about 1 week for a new part.` |
| `faqs[5]` | `can-you-produce-to-our-validated-drawing` | `Can you produce to our validated drawing revision?` | Unchanged. The brief does not mention it. |

FAQ block heading and eyebrow are unchanged.

"In the FAQ, open the first item by default (<details open>)" (§02). There is no field for this. It needs a code change in `IndustryFAQ` (`IndustryDetail.tsx:382`), which all industry pages share. Make it a prop or a block field if only this page should change.

### 2.13 Closing band → `sections[10]` (was [7]) `block.closingBand`, `body` (§10)

- **Current:** `Send the drawing, an existing part, or the instrument make and model — with the fluid contacted, the sterilisation method and your biocompatibility standard reference. Our engineering team responds within 48 hours with a compound recommendation, dimensional confirmation and a quotation, and confirms what the compound supplier can evidence.`
- **New:** `Send the drawing, an existing part, or the instrument make and model, with the fluid contacted and the cleaning or sterilisation method. Our engineering team responds within 48 hours with a compound recommendation, dimensional confirmation and a quotation, and confirms what the compound supplier can evidence.`

The brief quotes only the first sentence under "Now", so the second sentence is assumed to stay.

`lines`, `actions` and `contacts` are unchanged.

### 2.14 Final section order (`sections[]`)

| Index | Block | `_key` | What changes |
|---|---|---|---|
| 0 | `block.cardGrid` (plain) | `components` | NEW (replaces componentTabs). Group "Fluid path", 5 cards. |
| 1 | `block.cardGrid` (plain) | `components-chambers` | NEW. Group "Chambers, doors & ports", 3 cards. |
| 2 | `block.cardGrid` (plain) | `components-bench` | NEW. Group "Bench hardware", 2 cards. Caption "Illustrative product images." needs a field. |
| 3 | `block.industryApplications` | `applications` | 4 tiles rewritten |
| 4 | `block.conditionGrid` | `conditions` | body sentence 2; 3 new tiles |
| 5 | `block.specTable` | `compound-table` | NEW |
| 6 | `block.customPanel` | `custom` | body/bullets → H3, line and 6 steps (code) |
| 7 | `block.qualityCards` | `quality` | body; cards 2 and 3 replaced; card 1 title link (code) |
| 8 | `block.exportLane` | `exportLane` | heading, card.subtitle, paragraphs[0] |
| 9 | `block.industryFaq` | `faqs` | unchanged (the doc-level `faqs` change) |
| 10 | `block.closingBand` | `closing` | body sentence 1 |

Doc-level fields that change: `seo.title`, `seo.description`, `h1`, `h1Lines`, `intro`, `hero.alt`, `nonClaims[0]`, `faqs[]`, optionally `schemaService`, and optionally the keywords.

`related.products` still lists `bellows`. The brief removes bellows from the page but does not mention `related`, so this is open.

---

## 3. Image placements

Checks on the files:
- I compared all 11 files in `public/images/release-2026-10/` against the thumbnails embedded in the brief. Each file matches its own MED number (pixel difference about 0.2 against 25 or more for the next-closest file), so the downloaded names map correctly.
- The local files are **1600×1067**. The brief says 2400×1600.

| Slot / field | File | Alt (verbatim from brief) |
|---|---|---|
| Hero: Sanity `imageOverride-industries__medical-devices__hero` (`image` + `alt`). Optionally also the registry fallback `industries.medical-devices.hero` in `src/content/images.ts:1832`. | `public/images/release-2026-10/med-hero.webp` | Rubber seals, gaskets, port plugs and feet on a laboratory bench |
| `sections[0].items[0].image` | med-01.webp | Fluid-path O-rings |
| `sections[0].items[1].image` | med-02.webp | Valve-manifold gaskets & flange seals |
| `sections[0].items[2].image` | med-03.webp | Instrument valve diaphragms |
| `sections[0].items[3].image` | med-04.webp | Instrument micro-pump diaphragms |
| `sections[0].items[4].image` | med-05.webp | Silicone pump tubing & profiles |
| `sections[1].items[0].image` | med-06.webp | Instrument door & lid gaskets |
| `sections[1].items[1].image` | med-07.webp | Steriliser lid & door gaskets |
| `sections[1].items[2].image` | med-08.webp | Access-port plugs & pass-through grommets |
| `sections[2].items[0].image` | med-09.webp | Instrument feet & suction feet |
| `sections[2].items[1].image` | med-10.webp | Laboratory stoppers |

The card images must be **uploaded as Sanity image assets**, not set as path strings. Two reasons:
- The cardGrid query dereferences `asset->url`.
- `cmsImageSchema` accepts `/images/...` paths only for .mdx pages.

The other medical image overrides are not touched by the brief: `imageOverride-industries__medical-devices` (the hub card, alt "Rubber components for medical devices") and `…__facility`. The old registry keys (`products.*.hero`) simply stop being used on this page.

---

## 4. Ambiguities, rule conflicts, and items not about this page

### 4a. Ambiguous or contradictory
1. **Hero scope line, hero certification line, answer paragraph and components caption have no data field.** Each needs code: new industry fields, plus Zod, Studio, GROQ and the component. The answer paragraph can go through `answer-blocks.ts`/`AnswerLead`, but that requires an H2 question, which the brief does not give. It also defaults into the FAQPage, so set `faq: false` or change the component.
2. **Custom-engineering H3 and `<ol>`.** No allowed block renders them, so `customPanel` needs extending (see §2.8). The quality card 1 title link needs a code change. The compound table `<caption>` is not rendered by `BlockRenderer`. The `specTable` needs a `heading`, which the brief does not give.
3. **"Held" cards.** `score.md` (the reference) says the answer paragraph leaves out "the held diaphragm and tubing cards". That implies MED-03, MED-04 and MED-05 are on hold, yet the brief includes all 10 cards. Confirm before publishing those three.
4. **Image size.** The brief says 2400×1600 JPG and WebP, and `width={2400} height={1600}`. The repo files are 1600×1067 WebP only. Use the real intrinsic size, or get the larger originals. The aspect ratio is about the same.
5. **Shared components.** The brief treats the hero overlay/object-position/mobile layout, the first FAQ open, the `#F3F7F8` card background and equal-width compound tiles as page-only changes. Each sits in a component shared by all industry pages (`IndustryHero`, `IndustryFAQ`, `ConditionGrid`), or by industry and category pages (`PlainCards`). Each needs a per-page prop or variant.
6. **Not specified by the brief:**
   - the H1 line split;
   - the 3 condition-tile icons (required field);
   - the specTable heading;
   - whether the closing band's second sentence ("responds within 48 hours") stays;
   - whether `related.products` drops `bellows`.
7. **Brief "Now" values that differ slightly from live:**
   - The brief's "now" meta description omits the live tail "ISO 9001:2015. Clean-room packaging available." The live `seo.description` contains it, and the brief attributes it only to the Service description.
   - The brief numbers the FAQs 1, 4 and 5, but the live order is FDA, compounds, clean-room, minimum order, drawing revision.

   Neither difference blocks the change.
8. **Unverified claims.** `score.md` lists some of the kept or new claims as needing Margo's confirmation:
   - "revision is recorded on every despatch document" (custom step 5 and export paragraph 2);
   - "material test reports ship with every shipment" (answer paragraph and step 6);
   - the 48-hour engineering response (closing);
   - "TT and LC accepted" (export rows);
   - the QMS-scope sentence.

   The brief keeps them. They do not break a site rule.
9. **Status.** The doc is `status: "placeholder"`. It is indexable and emits JSON-LD only while `SITE_LIVE` is set (`isIndexable`). The brief does not change the status.

### 4b. Brief text that breaks the site rules (flagged, not fixed)
- **"biocompatible" / "biocompatibility" wording** (the site rule is no biocompatible wording):
  - new FAQ 2, question "Are your parts biocompatible?" and answer "We do not claim biocompatibility. It is assessed on the finished device. …";
  - new quality card 3, "Biocompatibility sits with the finished device."

  The brief's own rule bans only biocompatibility *claims*, so it treats these negations as allowed. The site rule bans the wording.
- **Minimum order phrasing.** The brief has "Minimum order is set against part size and tooling, not a fixed number." The site rule wording is "set by part size and tooling". The meaning is the same and there is no number. The wording differs.
- **"Components we supply" eyebrow** (`COMPONENTS WE SUPPLY FOR MEDICAL DEVICES`, kept). This is borderline against the "supply as capability, never 'we supply X directly'" rule. It is not "directly", so it is probably fine.
- No FDA, clean-room, medical-grade wording, customer name or date appears in the brief's new page copy. Edition years in standard codes ("ISO 9001:2015") are treated as designations, not dates.
- The brief correctly removes the following from the live page:
  - "valid to 21 February 2027"
  - "targeted for 2027"
  - "10,000 pieces"
  - "−60 to +220 °C"
  - FDA, ISO 13485 and clean-room wording.

### 4c. Items in the brief that are not about this page's data

**Catalogue form and enquiry endpoint:**
- **§11 Catalogue form** (`CatalogueBlock`, shared by every industry page):
  - client-side validation, inline errors, `aria-invalid` and focus on the first error;
  - 16px inputs below 640px;
  - error colour and icon, `role="alert"`.
- **§11 `/api/enquiry`:** check the logs and the CRM or mailbox for the "3 empty requests … 27 Oct around 15:14 IST", delete any stored record, and report. This is an operations task with data deletion.

**Shared header, footer and scripts (§12):**
- **Footer company line:** remove "with 95 countries served". This is the `siteFooter-footer` doc or the layout.
- **Menu and footer label:** "Sponge & Foam Rubber" → "Sponge Rubber". The URL `/products/sponge-foam-rubber` stays.
- **Tap targets:** at least 44px height for mobile menu rows, chips and footer links.
- **Tap-to-call:** a tap-to-call phone icon in the mobile header or menu.
- **Third-party hosts:** find what loads `POST /events?cee=no` to `ov-1d104299d2a447049cdc73700c9309f7.ecs.us-west-2.on.aws` and `n2n5o3nlb661.cloud.run`, and report before removing anything. Keep the Meta pixel and add it to the privacy policy and the cookie banner.

**Shared head (§15):** remove hreflang `en` and `x-default`. They are emitted by `buildMetadata` → `alternates.languages` in `src/lib/seo.ts`, which affects every page.

**Product-category pages (§13): add anchor ids** on 5 pages. The target cards exist, but none has an id, and `block.partsGrid` items have **no `id` field** in Zod, Studio or the renderer, so this needs code first.

| Sanity doc | Card | Id to add |
|---|---|---|
| `productCategory-gaskets` | `sections[1].items[41]` | `valve-manifold-gaskets-flange-seals` |
| `productCategory-gaskets` | `sections[1].items[42]` | `instrument-door-lid-gaskets` |
| `productCategory-gaskets` | `sections[1].items[43]` | `steriliser-lid-door-gaskets` |
| `productCategory-diaphragms` | `sections[7].items[9]` | `instrument-valve-diaphragms` |
| `productCategory-diaphragms` | `sections[7].items[10]` | `instrument-micro-pump-diaphragms` |
| `productCategory-extrusion` | `sections[7].items[14]` | `silicone-pump-tubing-profiles` |
| `productCategory-grommets` | `sections[1].items[20]` | `access-port-plugs-pass-through-grommets` |
| `productCategory-pads-stoppers-caps` | `sections[1].items[23]`, titled "Instrument suction feet" | `instrument-feet-suction-feet` |
| `productCategory-pads-stoppers-caps` | `sections[1].items[31]` | `laboratory-stoppers` |

Until the ids exist, the links land at the top of each category page.

**Performance (§15):** re-measure with Lighthouse mobile after the hero change.

**Found while checking, not in the brief.** Rule-breaking copy on other pages that links to or describes this page (for the caller to decide):
- `industriesHub-industries`, medical card: "Biocompatible silicone components. We do not hold ISO 13485 or FDA registration." This has biocompatible and FDA wording.
- `productsHub-products`, sector "Medical": "Biocompatible silicone seals and tubing … We do not hold ISO 13485 or FDA registration." It also has `clients: "Vactech Surgical Equipment"`, which is a **customer name**.
- `homePage-home`, sector card: "…We do not hold ISO 13485 or FDA registration." This is FDA wording.
- `productCategory-sponge-foam-rubber`, card "Medical & food": "Clean-room seals…", linking to this page.
- `siteSettings-settings`, compound VMQ: "biocompatible grades available", `maxC: 220`, `href: /industries/medical-devices`. This conflicts with the brief's −60 to +200 °C rule wherever the site settings render it.
- `src/content/industries/medical-devices.mdx` (the fallback): MOQ 500, biocompatible, clean-room, FDA (see §1).
