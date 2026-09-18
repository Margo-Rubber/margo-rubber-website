# Copy pass — open items for Ayaz

Every place the site deviates from a content sheet, with the reason. Nothing
here was invented; each is either a roadmap claim held back from the buyer
build (Build Instructions §01) or a row the sheet marks CONFIRM.

**Ayaz's rule (2026-09-17): the content sheets are the source of truth.
Whatever a sheet writes is published as written, without question; a CONFIRM
mark alone does not hold a value back. The only open questions are
contradictions inside the content itself, and facts the sheets leave blank
— those are filled in the Studio when Margo has them.** Items below marked
*ruled* were closed by that instruction.

## 01 Homepage

Ayaz's instruction (2026-09-16): the sheets' copy ships as written — including the three figures the Build Instructions §01 mark as concept-build only (95 countries, 200+ catalogue SKUs, named ports) and the full 24-name account list. They are in the live fields. Below is only what the sheet itself leaves open.

1. **Export markets H2 — buyer-build variant.** *Ruled:* the boxed H2 ("95 markets screened. Eighteen playbooks. Five live lanes.") ships as written.
2. **Facility badge / contact panel badge.** The sheet gives neither; both are empty and the pills do not render. (The old badge named MIDC Ambad.)

## 02 Products hub

3. **Sector panels — four "Typical clients" cells.** Oil & Gas, HVAC, Water and Agriculture have no named account; per the sheet the buyer type is published (e.g. "Gulf EPC and equipment suppliers"). *The sheet asks: do any of the four have an account that never reached the company profile?*
4. **Marquee strip under the hero.** The sheet has no such element; the old one named Aerospace and Pharmaceutical. Now empty (hidden).
5. **Testing CTA — "Download the test capability statement".** Hidden until a PDF exists (sheet: CONFIRM the file).
6. **Certifications — ISO 14001 / ISO 45001 rows.** *Ruled:* sheet 02 writes the badge "(In Progress)", sheet 03 "(Upgrade in progress)"; the shared record renders sheet 03's on every page — the wording the client instructed for IATF.

## 03 About

7. **Leadership stat — "Team Members".** The sheet's value is CONFIRM; the card is not shown until a headcount is given.
8. **Milestones — ten proposed years.** *Ruled:* all eleven entries publish as the sheet writes them. The Studio's verified/proposed switch stays as the way to take one down if a date proves wrong.
9. **Founder titles.** Sheet marks both CONFIRM ("Founder & Director" / "Co-Founder & Business Development Head") and asks whether either wants a photograph published. Shown as written.
10. **Sustainability section.** *Ruled:* the sheet's "honest version" copy ships, section on.
11. **Certifications record.** Sheets 02 and 03 both say render the five rows from one shared record; sheet 02's fuller card bodies are the record, sheet 03's one-line titles are not shown separately.
12. **Client strip — logos.** Text wordmarks until permission letters exist (sheet: CONFIRM per account).

## 04 Contact

13. **Direct contact — phone.** The sheet publishes +91 96655 79276 for both WhatsApp and Phone and asks: should a separate landline be published?
14. ~~**Attachment field.** Shown with the sheet's label and hint; inert until the upload backend exists (Phase 7 — needs the storage account).~~ Resolved 2026-09-18: Margo's Cloudinary account (`CLOUDINARY_URL`); uploads are private, the desk signs an expiring download link. See `src/lib/enquiry/attachments.ts`.
15. **Map still.** Links to Google Maps at the confirmed coordinates; the picture in the slot is the hero photograph until a map image is uploaded in the Studio (Photographs → "Contact page — map still").

## 06 Export

16. **European Union block.** New, split from "US & EU"; the sheet asks: is the EU a target market at all? If not, delete rather than split. In place as written.
17. **Two bullets copied as written that look like sheet artefacts** — Singapore: "Transit 8–12 days, Nhava Sheva to the Port of Singapore *figure*"; Kenya & Tanzania: the ports bullet carries "CMA CGM's Swahili Express publishes 19 and 21 days … as the footnote already says". *Confirm the intended wording.*
18. **Map pin labels and the concept-build pin layer.** ~~The nine labels and the tooltip text are stored on the markets; the map draws pins without labels until the nine-pin map rewrite (Phase 7).~~ Resolved (Phase 7b): the nine destination labels and the origin are drawn beside their pins. The European Union block (item 16) has a lane but no pin label — the sheet's map names nine destinations and it is not among them. The concept-build figure strip shows only on the concept build.
19. **Trade-lane chips.** The sheet's chip list keeps "US & EU" while its block list splits it into United States and European Union; the chips follow the blocks (8 lanes: Australia, United Kingdom, UAE & Saudi, Malaysia, USA, European Union, Singapore, Kenya & Tanzania).

## 07 Certifications

20. **Certificate card — address.** The certificate itself carries the old B-12, MIDC Ambad line (sheet: MISMATCH); the card is a designed representation and shows the confirmed Vilholi address. Do not publish the scan until the certificate is re-issued at the new address.
21. **Certificate card — issue date.** CONFIRM on the sheet (not yet extracted from the certificate); the card shows the number and expiry only.
22. **Certificate PDF.** The download button stays hidden until a clean scan is uploaded (Studio → certificate card → file address).
23. **Facility cards — press tonnage and rubber-to-metal bonding as a named line.** Both CONFIRM on the sheet; the card bodies are as written.
24. **FMEA documentation** in the audit note — the sheet asks to confirm it exists before the line ships.

## 08 Legal

25. **Counsel review — Terms §9 and Disclaimer §7.** The sheet marks both CLIENT CONFIRMED — COUNSEL TO REVIEW: the liability cap is settled at invoice value; a lawyer should examine it most closely, and the two sections must say the same thing. Copy is in place as written; all three pages stay `placeholder` (noindex) until counsel signs off.
26. **Section anchors.** The sheet says anchor IDs are unchanged, so §7 of the Privacy Policy keeps its `user-rights` anchor under its new heading "Your Rights".
27. **Cookie notice.** Privacy Policy §4 describes a cookie notice through which analytics cookies are consented to and refused; no notice exists on the site yet (Phase 7 — build one or the section over-describes).

## 09 O-Rings

28. **Compound ranges render from Site settings** (sheet 01 §10 governs): AEM shows "continuous to 160°C" under its +175°C peak, as sheet 01 resolved on 2026-09-03; sheet 09's panel has no continuous line. Both AEM and FKM grades still to confirm (sheet 01).
29. **FAQPage questions.** The notes name "Which O-Ring Material Do I Need?", "What is the lead time for custom O-rings?" and "How is a custom O-ring order quoted?" for the FAQ node, but the sheet writes no answers and has no §09. A question that is not visible on the page cannot be in the graph, so only the sizing-standards question — the §05 heading, with its answer — is emitted. Sheets 10–19 name questions the same way and emit no FAQPage node until a FAQ section is written.
30. **Spec table sign-off.** The sheet asks that the twelve rows be checked once against the purchased SAE AS568, JIS B2401 and DIN 3771 documents before the page goes live.
31. **PTFE-encapsulated panel** is written for encapsulated rings (elastomer core, moulded); if Margo also machines solid PTFE the copy and capability claim change.
32. **Standards attribution footnote under §05** — the note asks for one but gives no wording; not added.

## 10 Oil Seals

33. ~~**Silicone panel wording.** The panel table ships "Biocompatible grades available." while the sheet's Remove note asks for "Biocompatible grades available; we do not hold FDA registration or ISO 13485." — the table is what is applied; confirm which line.~~ Resolved (2026-09-17): the note's line ships.
34. **Six live parts removed** (four compound variants, two non-seals) — the sheet's "CONFIRM which" on the two that belong under Leak Test Rubber or Pads, Stoppers & Caps.
35. **FAQ questions** "What is the lead time for custom oil seals?" and "How is a custom oil seal quoted?" — named for the FAQPage node, not on the page; no node until a FAQ section is written (as item 29).

## 11 Gaskets

36. ~~**Confirmation copy** "Enquiry received. A named engineer replies within 48 hours to {email}." is the contact form's post-submit state — Phase 7 (forms), not this page.~~ Resolved (Phase 7b): the contact form shows it in place of the form once sent, with the buyer's address; the extrusion and sponge & foam variants apply when that category is chosen.
37. **FAQ questions.** "Which rubber gasket material should I use for steam?", "What temperature can an EPDM gasket withstand?", "What is the lead time for custom rubber gaskets?" and "How is a rubber gasket order quoted?" are named for the FAQPage node with no written answers and no FAQ section; no node until one is written (as item 29).
38. **Hero image.** The sheet says the hero has no image; the slot keeps the existing photograph with the sheet's alt text for when one is chosen.

## 12 Bellows

39. **Flex-fatigue qualification offer.** The footnote says cycle life "is established by qualification testing on that part — to ISO 132, ASTM D430 or ASTM D813" and "we will qualify against it". The claims register says no fatigue rig in-house or at the partner lab, and the Disclaimer's partner-lab list (sheet 08 §3) does not include fatigue. Shipped as written; confirm who runs the test.
40. **Chip rules.** The sheet names four service chips (Fatigue-critical, Oil contact, Water & steam, High temperature) without saying which rows each selects; they select from the table's own cells — the two "High"/"Very high" fatigue grades, service text naming oil without a "not for oil" clause, water/steam/coolant, and peaks of +175 °C and above.
41. ~~**Confirmation copy** (as item 36)~~ — resolved with item 36; and the three unanswered FAQ questions (as item 37).

## 13 Anti-Vibration Mounts

42. **Chip rules.** Bonded / Unbonded / Compression / Shear select mount types by form (bobbins, conical, plate, shear and bonded bush = bonded; buffer = unbonded; shear and bush mounts = shear, the rest compression). The sheet names the chips only; confirm the classification.
43. **Floor mat moved out** to Pads, Stoppers & Caps — client-confirmed part, category to confirm (sheet's Moved out row).
44. ~~**Confirmation copy** (as item 36)~~ — resolved with item 36; and the three unanswered FAQ questions (as item 37).

## 14 Grommets

45. **Two CONFIRMs in the parts list** — Edge Protection Grommet Strip (extruded and cut; may belong under Extrusion Profiles) and Metal-Reinforced Grommets (needs insert loading; resolves with the bonding CONFIRM). Both listed as written.
46. ~~**Confirmation copy** (as item 36)~~ — resolved with item 36; and the unanswered FAQ questions (as item 37).

## 15 Bushes

47. **Two CONFIRMs in the parts list** — Torque Rod Bushes (heavy-commercial duty class) and Double-Sleeve Bonded Bushes (two inserts in one tool; resolves with the bonding CONFIRM). Both listed as written.
48. ~~**Confirmation copy** (as item 36)~~ — resolved with item 36; and the unanswered FAQ questions (as item 37).

## 16 Pads, Stoppers & Caps

49. **Four table rows carry derived values** (Big Support Pad, Oil Seal Filler Cap, Rubber Insulator Head Cover, Boot Tailgate Switch) — the sheet shows its working in "Where the four new rows come from"; the plant should confirm the sizes and compounds.
50. **Scorpio Footrest Rubber Mat** moved in from Anti-Vibration Mounts (same CONFIRM as item 43).
51. ~~**Confirmation copy** (as item 36)~~ — resolved with item 36; the two named FAQ questions are not on the page (as item 29).

## 17 Leak Test Rubber

52. **FAQ node empty.** "Can I reorder leak test rubber in small quantities?" and "What is the lead time for a replacement rig seal?" are named with no written answers; no FAQPage node ships until they are written (as item 37).
53. ~~**Confirmation copy** (as item 36).~~ Resolved with item 36.

## 18 Extrusion Profiles

54. **Sector card icons.** Mining, Oil & gas and Agriculture take the nearest strokes in the icon set (layers, droplet, cycle) until drawn.
55. ~~**Construction card** links through the route registry to /contact?industry=Construction until the Construction page (sheet 41) is live.~~ Resolved — the page is built (Phase 7) and the card resolves to /industries/construction.
56. ~~**Confirmation copy** "Drawing received. A named engineer replies within 48 hours to {email} with a compound recommendation, hardness grade and indicative pricing." — contact form post-submit state, Phase 7.~~ Resolved (Phase 7b): shown when Extrusion Profiles is the category on the form — which a link from this page (`?profile=`, `?request=datasheets`) pre-selects.
57. **FAQ node empty.** The two live questions had no written answers on the sheet and no FAQ section exists; none emitted (as item 29).

## 19 Sponge & Foam Rubber

58. **Datasheet button.** The sheet links "Download Datasheet ↓ /resources/sponge-foam-datasheet.pdf"; the datasheet is a page (sheet 40, Phase 6) and the PDF is not yet produced. Both buttons open the page under its own title, "Sponge & Foam Rubber Datasheet". Restore the sheet's label and href when the file is published.
59. **Construction and Transport cards** link through the route registry to /contact until those pages (sheets 41, 42) are live.
60. **FAQ node empty.** The two live questions have no written answers on the sheet; a HowTo node carries the four-line specification guide instead, as the sheet's graph asks.
61. ~~**Confirmation copy** "Enquiry received. A named engineer replies within 48 hours to {email} with a compound, a density and a recommended cut form." — Phase 7 forms.~~ Resolved (Phase 7b): shown when Sponge & Foam Rubber is the category on the form.

## 20 Automotive

62. **Component card bullets.** The sheet writes bullets for one card (Bushes & Bushings) and says the other seven "take three bullets each … written per card from the matching product sheet" — none are written, so the seven cards ship with body copy only. The same holds for sheets 21–28.
63. **Quality links.** "View ISO Certificate" and "Download Quality Policy" ship as the sheet's fallback — Request ISO Certificate → /contact?request=iso and Request Quality Policy → /contact?request=quality-policy — until the PDFs exist. (Phase 7b: the form reads the request and opens with "Request: ISO 9001:2015 certificate" / "Request: quality policy" in the project details.)
64. **Export card title/subtitle** ("Nashik → OEM Lines", "Direct supply to OEMs and Tier 1 suppliers") are live strings the sheet does not rewrite; kept.
65. ~~**Confirmation copy** — Phase 7 forms (as item 36).~~ Resolved with item 36.

## 21–26 Mining, Oil & Gas, Medical Devices, Pumps & Valves, HVAC, Electrical & Electronics

66. **Diaphragms card** (sheets 23, 24) ~~links through the route registry to /contact?product=Diaphragms until the Diaphragms page (sheet 36) is live~~ — resolved, the page is built (Phase 7); its photograph is still the page's own slot until the category has one (item 93).
67. **Component bullets, quality-link fallbacks, export card title/subtitle where the sheet gives none, confirmation copy** — as items 62–65.
68. **Sheet 23 §02 CONFIRM** (diaphragms, resolved 2026-09-03 per the sheet) — listed as written.

## 27–28 Agriculture, Water & Fluid Management

69. **Quality buttons.** These two sheets point "View ISO Certificate" at /certifications#iso-9001 (an anchor now on the certificate card) and remove "Download Quality Policy" until the PDF exists; sheets 20–26 use the request-form fallback (item 63). Two conventions on nine pages — settle which when the PDFs arrive.
70. **Contact strip.** Sheet 27 writes the certification line as "ISO 9001:2015 Certified · 09111526A"; sheet 25 as "ISO 9001:2015 · Certificate 09111526A". The shared strip renders the sheet-25 form from Site settings.
71. **Bold figures** in the FAQ answers and quality cards are highlights for the sheet's reader and ship as plain text, as on sheets 20–26.

# Phase 6

## 32–34 SKU pages (31 parts)

72. **Six parts need one sentence from Margo** — what the part does and where it fits: 01, 13, 20, 23, 27, 31; and 26, where two readings are possible (engine cylinder-head cover insulator or electrical terminal head cover). Shipped from the sheets as written.
73. **Four OEM-name pages** (02, 04, 05 written twice; version A ships per "ship A unless a supply agreement exists"). Sheet 21 has one version only — an aftermarket "to suit Mahindra Bolero" part with its trade-mark disclaimer — and its fitment rows are as written. No contradiction.
74. **Three confirmations**: are 03 and 05 the same bump stop? Are 28 and 29 the same filler cap? Is 14 a water/steam seal mislabelled as an oil seal?
75. **Category moves and renames** proposed by sheet 33 (07 and 09 to Sponge & Foam; 08, 14, 24 as material variants to collapse; 13/16 to merge; 11, 22 renamed) are Phase 7 — the pages stay at their current URLs; the sheets' related-part links to the proposed URLs resolve to the current ones.
76. **Application cards left out** because the sheet describes the card without writing it: SKU 16 Water & Fluid Management (flag FKM as wrong for hot water), SKU 17 Agriculture ("add, with the caveat"), SKU 18 Food & Beverage ("must say Margo holds no food-contact approval"). Two lead cards (13, 16 Pumps & Valves) ship with a title only.
77. **Cycle-life rows on SKU 22** ("To your specification, tested at the minimum temperature") held back — a fatigue-testing claim the build instructions rule out.
78. **Pre-format-rule cells** (sheets 01–20) carried reasoning after their value; each was set down as the rule reads (`CELL` in scripts/sheets/sku.mts). Worth a read by the author.
79. **Card titles beginning 🛑** on sheets 21–31 ship without the glyph; sentences addressed to the developer inside selector reasons ("currently offered on this page") are dropped.
80. **"You may also need" difference lines** — the sheets give rationale ("Why it is here"), not the one-line difference sheet 32 asks for; cards show the part name only.
81. **Years in operation** stays "On request" until the founding year is settled (sheet 32 §08); active clients 60+ and 3–4 weeks lead time ship from the sheets.
82. **No product photography** — the tray-of-mouldings plate serves every page; the two metalworking stock images are off (sheet 32 §02). Thirty-one phone photographs on a plain background is the sheets' first ask.
83. **Certification row date** renders "21 February 2027" from Site settings where a sheet writes "21 Feb 2027".
84. **"Download Quality Certificates"** → "Certification detail" (a page, not a file); the hero's "Download Datasheet" → "Request documentation" — the sheets remove the dead downloads but do not name these two controls.

## 35 Resource articles (7 guides)

85. **Byline.** "Reviewed at our works in Nashik by [name], [title] · Published [date]" — the reviewer's name and title (Site settings → guide reviewer) and each guide's publication date are blank until Margo names them; the byline renders when they are set.
86. ~~**Related-link anchor text.** The sheets give anchor text per link ("Silicone vs EPDM guide", "About Margo"); the related strip renders the target's own short name and carries categories, industries and guides only — /about and /certifications links in two sheets are not shown.~~ Resolved (technical-SEO pass): guide and page links carry the sheet's anchor text (`related.pages`); a guide-to-guide link shows only once its target is published.
87. **The full AS568 chart** (RES_04 §12) — the sheet says the 369-row table is the one download worth building; not built.
88. **Hub blurb vs standfirst.** Sheet 31's card blurbs stay on `intro`; the articles' opening paragraphs are on the new `standfirst` field.

## 40 Sponge & Foam datasheet

89. **The twelve figures** the sheet lists at its foot (nominal density and CFD at 25% for the five cellular compounds, the full D1056 designation supplied against, and whether NR is open or closed cell) — the sheet records §04 as resolved to the standard's Type/Class with "quoted per grade", and ships; the compounding team's stocked grades would let the table name them.
90. **PDF.** The meta strip's "Download · PDF · same content" row is not shown until the file exists; "Rev 1 · publication date" is shown as written.
91. ~~**Hub listing.** The datasheet is in the "datasheets" category the build instructions add, reached from the Sponge & Foam page; the /resources hub lists the seven guides only (sheet 31 has no datasheet group).~~ Resolved (technical-SEO pass): sheet 40 §10 asks for a fourth group, "Datasheets", and a counter reading "7 Guides · 1 Datasheet" — built; the category count is derived (4), where sheet 31's counter strip wrote "3 Categories".
92. **Meta description cap** widened to 220 (the sheet's 217-character description).

## 36–39 Diaphragms, Bonded Components, Rubber Lining & Skirting, Reciprocating Seals (new pages)

93. **Hero photographs.** ~~None of the four categories has an image slot; the heroes ship without a photograph.~~ Each now has its own slot (Studio → Photographs), filled with a stand-in from a related page until Margo uploads the real one. The sheets give the alt text to use when one is added — "Fabric-reinforced rubber diaphragms moulded at Margo Rubber Products, Nashik" (36), "Rubber-to-metal bonded mounts and bushes moulded at Margo Rubber Products, Nashik" (37), "Natural rubber chute lining and conveyor skirting cut at Margo Rubber Products, Nashik" (38), "Moulded rubber plunger cups and rod seals produced at Margo Rubber Products, Nashik" (39).
94. **/products hub cards.** The hub grid (sheet 02) has eleven cards with their own kicker, tag, chips and image; the four new categories need the same before they can be added. Sheet 38 also asks for a third group on the grid — "sheet and lining products" — to be raised with the design before its card is built. Until then the four are reachable from the header menu, the footer, the industry pages and the sitemap.
95. **Seals slug** — the sheet's one decision for Ayaz: /products/seals (recommended, and what SKU 31 canonicalises to) or /products/reciprocating-seals. Built at /products/seals with §02 as the router, as recommended; the nav label is "Reciprocating Seals".
96. ~~**Plunger cups card (39 §03)** links to the part's live URL, /products/pads-stoppers-caps/rubber-plungers, until the SKU moves to /products/seals/plunger-seals (sheet 33's category move — a later Phase 7 branch, with the 301).~~ Resolved (Phase 7b): the part is at /products/seals/plunger-seals and the old URL is a 301.
97. **Lining service area (38 §07).** Fitting is client-confirmed and Version B ships. The sheet also asks for a Service node and "a named geographic service area"; no area is named, so neither is emitted. The "not included" line ships as the three items the note lists (scaffolding, confined-space entry, plant shutdown coordination) under a "Not included" heading — *confirm the wording and name the area*.
98. **"See sheet 37"** (38 §06, the adhesion-to-steel row) is the sheet's own cross-reference; it ships as written, linked to /products/bonded-components. *Reword if wanted* — e.g. "See bonded components".
99. **In-page cross-references** — "See section 04", "see section 06", "See section 05" — ship as written, each linked to the section it names.
100. **Certification block** (36–42 §07/08) is one string in Site settings (Certifications → "Certification block"), placed by a block on each page; edit it once.
101. **FAQ block heading.** The sheets give no eyebrow or heading for the questions section; the page uses the sheet's section title "Technical & commercial questions" and the block's standard eyebrow.
102. **/products compound anchors.** Each compound name in a router table links to its panel on /products (`#hub-compound-epdm` …), which now opens that tab on arrival.

## 41–42 Construction, Transport — Rail & Marine (new pages)

103. **Hero photographs** — as item 93 (slots `industries.construction.hero`, `industries.transport.hero`, stand-ins in place); alt text "EPDM glazing gaskets and expansion joint seals extruded at Margo Rubber Products, Nashik" (41) and "Extruded EPDM window and hatch seals produced at Margo Rubber Products, Nashik" (42).
104. **/industries hub cards.** Sheet 05's grid has nine sector cards with body, products supplied, typical clients and an image; Construction and Transport need the same to move out of "additional sectors" (where "Construction & glazing" still links to /products/extrusion). Both are already in the hub's ItemList structured data.
105. **Download buttons** (41–42 §07) render only once the hosted ISO certificate and quality policy exist — the same rule as the nine original industry pages (item 63).
106. **RDSO vendor approval** (42 §05) ships as the sheet writes it — "Application in process — not yet held" — client-confirmed 2026-09-03. The sheet's business question stands: whether to pursue it, and if so the target date for the line.
107. **Contact dropdown labels.** The sheets ask for "Seals — reciprocating" and "Transport — rail & marine" as dropdown options; the form offers the registry labels "Reciprocating Seals" and "Transport — Rail & Marine". (Phase 7b: `?part=Seals` and `?industry=Transport` pre-select those options.)

## Phase 7b — forms, redirects and the SKU moves

108. ~~**Attachment upload** (04 §02, 18 §09 "Send Drawing & Quote") stays an inert field until the storage account exists (item 14). The label and hint ship; nothing is uploaded.~~ Resolved 2026-09-18 — live on /contact, the homepage and the products hub (item 14).
109. **Legacy WooCommerce URLs.** The 301 map for the old site's product URLs (Build Checklist B15) is taken from a crawl immediately before cutover; `src/content/redirects.ts` is where they go, next to the eight redirects already there.
110. **SKU moves made** (each sheet's "New URL … 301 from …"): 02 → /products/extrusion/rear-windscreen-glazing-rubber, 04 → /products/pads-stoppers-caps/side-step-pad, 05 → /products/anti-vibration-mounts/cv-suspension-bump-stop, 07 → /products/sponge-foam-rubber/c-pillar-garnish-seal, 09 → /products/sponge-foam-rubber/foam-gaskets, 31 → /products/seals/plunger-seals. The image slots keep their old keys (`sku.anti-vibration-mounts--backlight-mount.photo` …) until the image-slot clean-up branch renames them with the 21 retired slots.
111. **Duplicates folded** (sheets 16 and 29, "Duplicate — 301 this URL"): /oil-seals/fkm-compression-pump-inlays → /oil-seals/compression-pump-inlays and /pads-stoppers-caps/oil-seal-filler-cap → /pads-stoppers-caps/oil-filler-cap. Both documents carried the survivor's copy word for word after Phase 6; they are removed (dataset backup `backups/production-2026-09-16-18-51-moves.ndjson`). Item 74's question — are 28 and 29 the same cap? — is answered by the sheets as yes; if Margo says otherwise, the redirect comes out and a distinct part page is written.
112. **Oil-seal compound pages** (14, 15, 17, 18) — the sheets say "collapse into /products/oil-seals as a compound section and 301 … after the collapse; until the collapse, canonical to this URL … move the content, do not bin it". They stay live, self-canonical, as written, until the category page's compound sections are written to carry their content — a copy job for 3rd Shade, not a redirect.
113. **Kept, per their own sheets:** 08 EPDM Gaskets (sheet 08 overrides sheet 33's collapse — "collapse this one as well and the Gaskets category is left with no parts at all") and 24 Flat Packing Pad. 03 and 05 stay two parts with the duty in both H1s, pending the two-drawing check (item 74).
114. **/why-margo** — the parked takedown sheet (30) recommends "unpublish now, 301 to /about": the page publishes four certifications not held and a fabricated timeline and testimonial. It is placeholder (noindex) and linked from nowhere, so it is not reachable today; the decision to remove it and redirect is Ayaz's — the redirect registry is ready to take it.
115. **Products-hub and industries-hub forms** posted nothing until Phase 7b — their controls carried no field names and the selects had no options. Fixed: named fields, the registry's fifteen categories / eleven industries as options, `?sector=` pre-selects the industry.
116. **Hidden context fields.** A pre-filled link's parameters travel with the enquiry as `via_part`, `via_industry`, `via_request`, `via_topic`, `via_profile`, `via_doc`, `via_sector` in the record's raw fields; the desk shows raw fields as it does today.

## Sheet gaps closed under the rule (2026-09-17)

117. **Products hub attachment field** (02 §11 "Add: file field") was missing from the hub form; added, inert like the homepage and /contact fields.
118. **About timeline** — the ten CONFIRM years now publish (item 8).
119. **Parts grids link to the part pages** (2026-09-17). The category sheets (10–16) listed parts as plain names and said the part pages would be 301-redirected to the category; the later SKU sheets build the pages and assume the category links to them. Ruled for the later sheets: each card that is a part links to its page under the part's current name; parts that moved show under their new category; the two folded duplicates' cards are off; foam gaskets stays on the Gaskets page as the cross-reference sheet 09 asks for. Extrusion and Sponge & Foam had no grid (their parts arrived with the moves): each gets one whose eyebrow, heading pattern and body sentence are the other sheets' shared wording ("IN THIS CATEGORY" · "Profiles We Make to Order" / "Sponge & Foam Parts We Make to Order" · "Each part below is manufactured to customer drawing or to our standard tooling. Full dimensional data is issued with the quotation.") — the one place with composed copy, for 3rd Shade to replace if they want their own.
120. **Material-card photographs** (2026-09-17). The sheets added compound panels the old pages never had (NR, CR, SBR, AEM; EPDM sponge on Gaskets, PTFE on O-Rings) — 38 panels across ten pages with no photograph. Each now has its own slot in Photographs (`products.<category>.material.<compound>`), showing a neighbouring panel's picture until its own is uploaded; the label says so.

## Technical SEO / AEO / GEO pass (2026-09-17)

Every "Technical SEO" line in the 78 sheets (2,842 instructions on 73 routes) was read against the rendered page — `npm run check:techseo` re-runs it; `scripts/sheets/techseo-notes.json` holds the verdicts (2,175 pass · 156 open · 511 commentary). What the pass could not close, because the answer is Margo's or the sheets disagree:

121. **Compound table, one source** (40 §03 🛑 "Render this table and sheet 19's from one source"). Sheets 19 §04 and 40 §03 publish the same five-compound table with one differing cell — sheet 19's VMQ applications name "food-contact grades", sheet 40's do not — and a different column order. Rendering both from one record means choosing one wording. *Which?*
122. **"Viton" with the ®** (SKU sheets 09, 13–18, 31 🛑 "FKM (Viton®) once, FKM thereafter"). The compound selector's full name comes from sheet 02's compound table, which writes "Fluoroelastomer (Viton)" without the mark. *Add the ® to the settings name, or leave sheet 02's wording?*
123. **IATF on part pages** (SKU 05 §07 "Never state an IATF position on a SKU page — it lives once, on /certifications"). Twenty-two SKU sheets write "IATF 16949 — upgrade in progress, certification targeted by end 2026" in their own certificate blocks, and ship as written. *Keep the line on the parts, or drop it to /certifications only?*
124. **Two cure-system headings** (RES_01 §04 "Two <h3>s, one per cure system"). The sheet's body for the section has no heading lines; adding "Sulphur-cured EPDM" / "Peroxide-cured EPDM" as <h3>s would split its second paragraph. *Supply the two headings, or leave the paragraph whole?*
125. **Guide-to-guide links in the body** (RES_01 §03, RES_02 §06, RES_03 §05, RES_03 §10 item 3). The sheets ask for links "once it publishes" without naming the phrase to carry them (fluoroelastomer → FKM vs NBR guide; steam and brake-fluid answers → silicone guide; item 3 → section 07). The Related strip carries each guide link, hidden until the target is published. *Name the phrases, or leave the strip to do it?*
126. **Publication gates on the guides.** RES_06 (Q6, "Can you show me a photograph of a part like mine?") is not to publish before the first real product photograph is live; RES_02/03/05 wait for nothing else. `npm run publish:pages -- --write /resources/<slug>` publishes one guide at a time.
127. **Assets the sheets say would earn links, none supplied:** a compound and density datasheet (19), AEM and EPDM datasheets (SKU 06, 08), a CFD curve and sponge grade file (09, 40), a load-deflection chart for the pad range (20, 22–24), an actuation-force chart (23), an opening-pressure chart (19), a bore-size chart and a cap-and-seal sheet (28), a standard-section sheet and outline drawings for the shape-named pads (24–26), an interchange listing (05), a chemical/fluid compatibility chart (17, 31), a compound-versus-speed guide (18), a fitment-parts index (21), an interior-trim landing page (27), a gap-to-form guide (30), the full 369-row AS568 chart (RES_04). Each is Margo's data to supply; none is fabricated.
128. **Typed part fields** (SKU sheets 🛑: inside diameter and cross-section on O-rings, included angle with tolerance on the angle pad, fitment as vehicle/variant/year, form vs compound on sponge parts, foam fields by part type). The values print as each sheet writes them, in the spec table; making them typed fields is a template change for after cutover.
129. **Conversion events.** Every enquiry variant the sheets name (product RFQ, documentation request, datasheet enquiry, export quotation, certifications documents) posts with its own `source`; the named analytics events wait on an analytics property, which does not exist yet — Margo's account to create, with the cookie notice of item 27.
130. **Medical Devices page audit** (RES_01 §11 🛑 "Audit the Medical Devices industry page separately. If this link implies a capability, so does everything else pointing at it"). The page ships as sheet 27 writes it, with every ISO 10993 mention as a standard the compound is assessed to and nothing in structured data; the audit is a decision for Margo, not a change the sheets specify.
131. **Publish state.** Robots, sitemap and structured data all follow document `status`; the 🛑 "nofollow → follow, today" lines on the seven guides are met by `publish:pages` at cutover (CUTOVER.md), not by a template change.

