# 31_Resources_Hub.html — Resources Hub Content Sheet

**<title>** Technical Guides for Rubber Seal Specification | Margo
**description** Compound selection, O-ring sizing and supplier evaluation guides for engineers specifying rubber seals and gaskets. Written and reviewed at our ISO 9001:2015 works in Nashik, India.

## 01 Hero [The counter and the date]
> live: LIVE H1 → Resources & Guides · “7 Guides · 3 Categories · Aug 2026 Last Updated” · there are zero guides and seven placeholders
- **Breadcrumb · eyebrow**: `MARGO RUBBER PRODUCTS / RESOURCES`
  _[no change] — a real breadcrumb, correctly built, on the one page family that already had one_
- **H1**: “Resources & Guides”
  _[no change]_
- **Subhead**:
  > Technical reference library for engineers and procurement teams specifying precision rubber seals, gaskets and moulded components.
  _17 words · live is 17 · serial comma removed for house style. “Engineers and procurement teams” is the correct dual audience and the seven topics genuinely serve both_
- **Counter strip**: `7 Guides · 3 Categories · Aug 2026 Last Updated`
  _Rewritten 2026-09-03 — all seven guides are now written. The counter was the honesty gate while the library was empty; it is now a straight count of seven published articles, which is what the strip always claimed and can finally back. The date becomes real too. “Last Updated Aug 2026” was stale filler on a library that had published nothing; “Updated September 2026” is the month the seven articles ship, so it is a fact rather than a decoration. Derive the count, do not hard-code 7 — the eighth guide will be written eventually and a hard-coded number is how this strip went wrong the first time_
  <details><summary>notes (4)</summary>
  - The counter is the honesty gate for the whole page. Every other fix in this sheet follows from it — if the counter says “in preparation”, the read times and the Read Guide buttons stop being defensible and have to change too.
  - Do not render the count from a hard-coded 7. Derive it, and split published from in-preparation, so the strip stays true as guides ship one at a time.
  - “Last updated” must come from real content dates or not appear. It is a freshness signal that becomes a staleness signal the moment it stops moving.
  - Breadcrumb schema — Home › Resources. The visible breadcrumb is already correct.
  </details>

## 02 Search, filters and the featured guide [Featured card removed]
> live: LIVE → search box, four filter tabs, “7 results”, and a START HERE card · eight cards render under a seven-result counter
- **Search field**: `Search guides…`
  _[no change to the placeholder text] — but the field should be disabled or hidden until at least one guide is published. A search box over an empty library returns nothing for every query, which is a worse first interaction than no search box_
- **Filter tabs ×4**: `All Guides · Material Comparison · Sizing & Spec · Sourcing & Buyer Decision`
  _[no change] — the three categories are well drawn and the counts underneath them (3 / 2 / 2) are correct_
- **Result counter**: `7 results`
  _The counter says 7 and eight cards render, because the gasket guide appears once as the featured card and again inside Material Comparison. The featured card is a duplicate link, not an eighth guide — so count distinct articles, not rendered cards. Seven is correct and all seven now exist_
- **Featured card — START HERE**: `START HERE
MATERIAL COMPARISON · 8 min read
Gasket Material Selection Guide
A structured decision framework for selecting between rubber compounds — temperature, media, flange standard.`
  _Restored 2026-09-03 — the condition set on this card has been met. The instruction here was to pull it only until a real guide existed to feature, and to bring back the gasket guide first because it is the highest-intent topic of the seven. That guide is now written (sheet RES 03, ~1,900 words, eight sections and two tables), so START HERE routes the reader to a finished article rather than a placeholder. The trailing ellipsis goes — the live card truncated mid-sentence, which reads as unfinished copy rather than a teaser. Ending on temperature, media, flange standard names the three decisions the guide actually makes_
  <details><summary>notes (3)</summary>
  - Filters and search must not unmount cards. All seven render in the DOM at first paint and are hidden with CSS — a filtered library that mounts on click ships a hub page with no links in it.
  - The featured card is a duplicate link to the same URL. Two links to one destination on one page is not harmful, but the duplicate H3 splits the anchor-text signal for no gain.
  - Filter state should not create URLs. No ?category= parameters in the index, or three filter views become three thin duplicates of the hub. Client-side only, or noindex the parameterised views.
  </details>

## 03 Material comparison — 3 guides [3 cards stay three · read times out]
> live: LIVE H2 → Material Comparison · “Compound-level analysis to inform your material specification decisions.” · three read times on three unwritten guides
- **H2 · intro** (composite):
  · H: “Material Comparison”
  · Compound-level analysis to inform your material specification decisions. 3 guides
  _[no change] — and this is the strongest of the three categories: compound selection is the question Margo is asked most and the one the site already answers best_
- **Card 1**:
  > Compares silicone and EPDM across thermal stability, weathering and fluid compatibility — silicone −60 to +220 °C, EPDM −40 to +140 °C — and the trade-off that decides most specifications: EPDM resists ozone and weather, silicone survives the higher temperature, and neither tolerates mineral oil.
  `MATERIAL COMPARISON · 5 min read
Silicone vs EPDM: Selecting the Right Elastomer for High-Temperature Seals`
  `[ Read Guide → /resources/silicone-vs-epdm-high-temperature-seals ]`
  _44 words · live is 16 · Updated 2026-09-03 — all seven guides are written, so the three holding changes on this card come off: the read time is published rather than struck, the description is in the present tense because the guide exists, and Read Guide points at the article instead of deflecting to Ask an engineer. The read times are the article sheets’ own figures, not estimates.
The two temperature ranges come from the locked homepage table and cost nothing to state now. The oil sentence is the actual answer to the question — it is the thing a buyer comparing these two compounds most often gets wrong, and putting it on the card means the card is useful even before the guide exists_
- **Card 2**:
  > Compares fluorocarbon and nitrile across temperature, chemical resistance and cost-in-use — FKM −20 to +250 °C, NBR −30 to +120 °C. FKM is the answer where temperature or aggressive media demand it; NBR is the answer everywhere else, and it costs a fraction as much.
  `MATERIAL COMPARISON · 6 min read
FKM vs NBR: Which Rubber Is Right for Your Application?`
  `[ Read Guide → /resources/fkm-vs-nbr-oil-seal-guide ]`
  _44 words · live is 15 · “cost-in-use” is the right frame and the live card already has it. The addition states the decision plainly: this comparison is almost always a cost question wearing a technical costume, and saying so is more useful than another spec table_
- **Card 3**:
  > Sets out a decision framework across the compounds we mix — FKM, NBR, EPDM, silicone and neoprene — with temperature ranges, hardness bands and chemical compatibility, and the flange standards a gasket is drawn to: ASME B16.21 for nonmetallic flat gaskets, EN 1514-1, AWWA C111/A21.11 for water.
  `MATERIAL COMPARISON · 8 min read
Gasket Material Selection Guide`
  `[ Read Guide → /resources/gasket-material-selection-guide ]`
  _49 words · live is 33 · “Includes a material matrix” becomes “will set out” — the live wording promises a document that does not exist.
The three standards are the addition and they are the reason this guide should ship first. All three are verified in this content set, and ASME B16.21 is the correction to an error the live site makes on three pages, where B16.20 — metallic gaskets — is cited for rubber. Publishing this guide fixes a sitewide error and earns a term nobody else is targeting_
  <details><summary>notes (5)</summary>
  - Card titles are <h3> under the category <h2>. Correct in the live build.
  - These three are the highest-intent topics on the site. Silicone vs EPDM, FKM vs NBR and gasket material selection are all high-volume, and the comparison format is what answer engines lift most readily.
  - The figures on the cards do work now. Even unwritten, each card carries an extractable temperature range and a one-sentence decision rule — which is more than most published competitor guides manage.
  - Link each card to the matching product page as well as the article: gaskets to /products/gaskets, FKM/NBR to /products/o-rings and /products/oil-seals. The article is a placeholder; the product page is not.
  - No TechArticle schema on cards. The hub describes; the article declares, once it exists.
  </details>

## 04 Sizing & spec — 2 guides [2 cards stay two · ISO 3601-1 added]
> live: LIVE H2 → Sizing & Spec · the O-ring card names BS 1806 without noting it has been superseded
- **H2 · intro** (composite):
  · H: “Sizing & Spec”
  · Dimensional standards, tolerances and design guidelines for sealing elements. 2 guides
  _[no change] — and “tolerances” is a word this site needs to get right, since it currently publishes four different tolerance figures across four pages_
- **Card 1**:
  > Cross-references the international sizing standards with tolerance and groove-dimension guidance. ISO 3601-1 is the current standard and its size code matches the AS568 dash number; BS 1806 was superseded by BS ISO 3601 but is still widely quoted, so a working chart has to carry all three.
  `O-Ring Size Chart: AS568, BS1806 & Metric Standards Explained`
  `SIZING & SPEC · 5 min read
O-Ring Size Chart: AS568, ISO 3601-1 and BS 1806 Explained`
  `[ Read Guide → /resources/o-ring-size-chart ]`
  _48 words · live is 14 · the title changes and the reason is a credibility one. BS 1806 has been superseded by BS ISO 3601. It is not wrong to name it — it is still very widely used for cross-reference, which is exactly why it belongs on a chart — but a sizing guide for engineers that names only the withdrawn standard and omits the current one loses the reader it is aimed at.
Naming all three, and saying which is current, is the whole value of the guide and it can be said on the card today. Verified live 2026-09-02. Note the spacing fix too: BS1806 is written BS 1806_
- **Card 2**:
  > Covers bond geometry, surface preparation and the failure modes that decide whether a bonded part lasts — across the five applications where the bond is the part. No load-rating table: a load rating belongs to a part, not to a bond. We bond in-house — bushes, mounts and bonded seals — so the guide is written from the tooling and the process rather than from a textbook.
  `SIZING & SPEC · 7 min read
Rubber-to-Metal Bonded Parts: Design & Specification Guide`
  `[ Read Guide → /resources/rubber-to-metal-bonded-parts-guide ]`
  _40 words · live is 14 · “We bond in-house” is the addition (client-confirmed) and it is what separates this guide from every generic version of it online. Of the seven topics this is the one where Margo has the strongest claim to be the author — the anti-vibration mounts and bushes product pages both depend on the capability_
  <details><summary>notes (5)</summary>
  - O-ring size chart is the highest-volume term on this entire website and it is a page that gets bookmarked and returned to, which is rare for a manufacturer. It is worth building properly — real tables, not an image — and it is the one guide here that can earn links.
  - Standard designations are text. AS568, ISO 3601-1, BS 1806 — each is a searched string, and a chart delivered as an image ranks for none of them.
  - Do not publish a size chart as a PDF download. The site already has 22 dead downloads; this one belongs on the page.
  - Link card 2 to /products/anti-vibration-mounts and /products/bushes, which carry the bonding detail today.
  - ISO 3302-1 belongs in card 1’s guide too when it is written — a tolerance guide is the natural home for the class system that replaces the four ± figures published across this site.
  </details>

## 05 Sourcing & buyer decision — 2 guides [2 cards stay two · both need care]
> live: LIVE H2 → Sourcing & Buyer Decision · the two topics on this list where an unsupported claim is easiest to make
- **H2 · intro** (composite):
  · H: “Sourcing & Buyer Decision”
  · Procurement strategy and supplier evaluation for engineered rubber parts. 2 guides
  _[no change]_
- **Card 1**:
  > Sets out a due-diligence checklist for quality systems, tooling ownership, capacity and documentation — including the three structural questions that separate a manufacturer from a trading house: who mixes the compound, who owns the tooling, and whose name is on the batch record.
  `SOURCING & BUYER DECISION · 5 min read
How to Evaluate a Precision Rubber Manufacturer: 8 Questions to Ask`
  `[ Read Guide → /resources/how-to-evaluate-a-rubber-manufacturer ]`
  _45 words · live is 14 · the three questions come from the factory-versus-trading-company section already drafted for /about, so most of this guide is written.
One sequencing warning for the developer. A guide telling buyers to “ask for the certificate, then verify it with the issuing body” cannot ship while another page of the same site claims four certifications Margo does not hold. /why-margo comes down before this guide goes up — otherwise the guide indicts its own publisher_
- **Card 2**:
  > Compares lead time, quality systems, minimum order and total landed cost for procurement managers assessing supply-chain risk.
  `SOURCING & BUYER DECISION · 6 min read
India vs China: Sourcing Rubber Seals & Gaskets for Export Markets`
  `[ Read Guide → /resources/india-vs-china-rubber-sourcing ]`
  _18 words · live is 19 · deliberately the shortest card in this sheet.
This is the one topic of the seven where nothing should be added to the card, because everything worth saying needs a source. Duty rates, freight costs, lead times and MOQ norms all move, and every figure would date. Write it from live trade data with dated citations, or do not write it — a comparison piece by an interested party is read sceptically to begin with, and one unsupported number discredits the rest.
Publish this one last, after the five technical guides have established that this library is a reference rather than a sales asset_
  <details><summary>notes (4)</summary>
  - Card 1 is a strong AEO target. “How do I evaluate a rubber manufacturer?” is asked by procurement teams and answered almost entirely by suppliers marketing themselves; a checklist that names structural tests rather than adjectives is what gets cited.
  - Card 2 needs dated sources on every figure, and a visible “data as at” line. Without it the guide ages into a liability the way the rest of this site’s unsourced numbers already have.
  - Do not name competitors or countries pejoratively. A comparison that reads as a sales pitch fails with the procurement audience it targets, and it is the wrong reputation for a library that is otherwise technical.
  - Card 1 should link to /certifications — a supplier-evaluation guide whose publisher shows its own certificate number, issuer and expiry is making the argument by example.
  </details>

## 06 Closing CTA [Keep · one line added]
> live: LIVE H2 → Can’t find your spec? Talk to an engineer. · the right CTA for this page, and well written
- **H2 — 2 lines**: “Can’t find your spec?” / “Talk to an engineer.”  (accent: Talk to an engineer.)
  _[no change] — the correct CTA for a reference library, and it is the same offer the seven placeholder pages make. The page is consistent with itself at the bottom even where it is not at the top_
- **Body**:
  > Our technical team in Nashik is available for application review, compound selection and custom moulding enquiries. We answer specification questions whether or not there is an order behind them — and we respond within 48 hours.
  _37 words · live is 17 · two additions. The first is the offer that makes a reference library work: answering a specification question with no order attached is how a supplier earns the enquiry that follows, and Margo already does it — the seven placeholders all say so.
The 48-hour response time is the sitewide constant, and this page publishes none today_
- **Buttons ×2** (Button | Live | Ships as):
  | Primary | Request a Quote → /contact | Ask a Specification Question → /contact |
  | Secondary | Email Us → /contact | info@margorubber.in → mailto: |
  _Both buttons point at /contact today, which is one button with a spare. The primary label changes because “Request a Quote” is the wrong ask of a reader who came for a size chart — the heading offers an engineer and the button should too. The secondary becomes a real mailto:_
  <details><summary>notes (4)</summary>
  - “We answer specification questions whether or not there is an order behind them” is the most quotable sentence available to this page and it is true — it is what the seven placeholders already offer.
  - mailto: must match the footer address. info@margorubber.in, not the exports@ variant that appears on /why-margo.
  - One response time sitewide, from one constant.
  - No ContactPoint here — it lives once on the Organization node.
  </details>

## 07 The article template — ships 7 times [Keep the copy · add noindex and a reviewer]
> live: LIVE → “This guide is being written” · the honest half of this page family · identical on all seven URLs
- **H2 · body** (composite):
  · H: “This guide is being written”
  · We publish technical guides only once the engineering content has been reviewed by our team in Nashik. This one is in preparation. Rather than fill the page with generic material, we would rather answer your specific question directly.
  _[no change to either] — and that is the point of this section. 38 words that decline to publish filler and route the reader to a person. It is the same decision /case-studies made, and between them these are the two page families on this website that got the editorial call right without being asked.
The only thing wrong with these pages is the hub in front of them_
- **Buttons ×2**: `[ Ask our engineers → /contact ] [ Back to all guides → /resources ]`
  _[no change] — both live, both correct. A placeholder page with two working routes out is better built than most published pages on this site_
- **Reviewer line — new**:
  > Technical guides are reviewed before publication by {name}, {role}, at our Nashik works.
  _13 words · new line, and it is the E-E-A-T lever for the whole library. The stub already promises review “by our team in Nashik” — naming the reviewer converts a claim into a credential. A named engineer at the works is a signal almost no competitor library carries, and it costs one sentence. who reviews · who reviews_
- **Related strip**: `RELATED
o rings oil seals oil gas`
  _A rendering bug, not a copy decision. The strip prints raw URL slugs as labels — /industries/oil-gas shows as “oil gas”. The links themselves are correct and useful; only the slug-to-label conversion is missing. Present on all seven pages_
  <details><summary>notes (6)</summary>
  - <meta name="robots" content="noindex, follow"> on all seven, today. Seven URLs of roughly 225 words each, with under 60 words of body copy that is identical across all seven, is seven near-duplicate thin pages in the index. They cannot rank and they drag on a site with real depth elsewhere.
  - Switch to index, follow one at a time, as each guide is published. Not as a batch.
  - No TechArticle node while the page is a placeholder. An article node with no article is a structured-data claim about content that does not exist.
  - Keep the breadcrumb. It is already correct here and it is better built than on most of the site.
  - Fix the slug-to-label conversion — it will otherwise ship into the real guides.
  - The contrast with /why-margo is worth holding on to. That page is unpublished because its risk is people. These are noindexed because their risk is crawlers — they are perfectly good pages for the human who lands on one.
  </details>

## 08 Footer [Rewrite]
> live: LIVE → 50+ countries, © 2024, and the wrong legal entity · Products column shows 9 of 11 categories · /export appears nowhere
- **Wordmark**: `MARGO
RUBBER PRODUCTS`
- **Description**:
  > ISO 9001:2015 certified manufacturer of precision moulded and extruded rubber components in Nashik, India. Sealing and anti-vibration parts to customer drawing, supplied to OEMs and distributors in 95 countries.
  _29 words · live is 26 · opens with the entity definition, since the footer repeats on all 40 pages_
- **NAP block**: `+91 96655 79276
info@margorubber.in
SRNO. 4494/10, behind Furniture Stop, opposite Samarth Dies,
Vilholi, Nashik, Maharashtra 422010, India`
  _Client-confirmed address. It replaces the live B-12, MIDC Ambad, which is a different location. The company name is not repeated inside the address line — it is already the wordmark directly above it. One string, everywhere, forever_
- **Column 1 — Products**: `SEALING
O-Rings · Oil Seals · Gaskets · Diaphragms · Reciprocating Seals · Leak Test Rubber
MOUNTING & PROTECTION
Anti-Vibration Mounts · Bushes & Bushings · Bonded Components · Bellows · Grommets · Pads, Stoppers & Caps
SHEET & PROFILE
Extrusion Profiles · Sponge & Foam Rubber · Rubber Lining & Skirting`
  _15 entries in three groups, up from 11. Adds Diaphragms, Bonded Components, Rubber Lining & Skirting and Reciprocating Seals (sheets 36–39), plus /products/extrusion and /products/sponge-foam-rubber, which had no sitewide inbound link at all. The column was designed for eleven and fifteen flat is not readable, so it is grouped — Sealing (6), Mounting & protection (6), Sheet & profile (3). The third group is also the commercial split: those three are quoted by length or area rather than by piece count, per sheets 18, 38 and 40. “Seals” is labelled “Reciprocating Seals” so it is not read as a parent of O-Rings and Oil Seals — sheet 39 §02 explains why. Group labels are <p> or <div>, never headings — three more phantom sections is not an improvement on one. One label also changes: Bushes & Sleeves becomes Bushes & Bushings, matching that category’s own H1. Its URL stays /products/bushes_
- **Column 2 — Industries**: `Automotive · Mining · Oil & Gas · Pumps & Valves · HVAC ·
Electrical & Electronics · Agriculture · Medical Devices ·
Water & Fluid Management · Construction · Transport — Rail & Marine`
  _11 entries, up from 9 — adds Construction (sheet 41) and Transport — Rail & Marine (sheet 42), the first two of the six “additional sectors” on sheet 05 to earn a URL. Automotive still leads, matching real volume. 🛑 The live footer’s four industry links all resolve to the same /industries/ The full twenty-six-row footer link map is in sheet 01_Homepage.html, footer section — fifteen product links and eleven industry links, with the three label/slug mismatches called out. — adding two entries to a column whose links are broken makes eleven broken links, so fix the routing in this same commit_
- **Column 3 — Company**: `About Us · Certifications · Export Markets · Case Studies ·
Resources · Contact Us`
  _6 entries · Export Markets is new and fixes the orphaned /export page · Why Choose Us comes out — that page is recommended for deletion, its job is done better by /certifications and /export_
- **CTA lines**: `Ready to source precision rubber components?
Quotation from our engineering team within 48 hours.
[ Request Quote → ]`
  _“within 24 hours” becomes 48 hours. The footer CTA is the fastest of the six response times published on this site, and it contradicts the page body on /contact, /industries and /export. One constant, rendered everywhere_
- **Legal line**: `© 2026 Margo Rubber Products. All rights reserved.
Privacy Policy · Terms & Conditions · Disclaimer
ISO 9001:2015 · Certificate 09111526A · Integral Certification Ltd`
  _Fixes © 2024 and Margo Rubber Industries Pvt. Ltd. — GSTIN 27AAKFM8595Q1Z1 embeds PAN AAKFM8595Q, whose 4th character F denotes a firm, not a company. Pvt. Ltd. is positively excluded. The ISO line gains the certificate number and the issuer, which makes it checkable on all 40 pages instead of decorative_
  <details><summary>notes (10)</summary>
  - What it fixes on this page specifically: the footer Company column links to Resources, so this footer is the main route into the library from all 40 pages. It is also the only response time this page publishes — “within 24 hours” — against the 48 hours the set standardises on and the 48 hours added to section 06.
  - And it still links to “Why Choose Us”. That page is the subject of a takedown recommendation, and this footer is where its 40 sitewide inbound links live. Removing that entry is step one of the removal and it happens in this same component.
  - What it fixes on this page specifically: the footer carries the correct phone number and email — the two strings the CTA two sections above it publishes as placeholders, This page does not carry the placeholder CTA variant that HVAC, electrical & electronics, agriculture and water do. Its closing CTA is the plain shared block, and the footer’s contact details are correct — info@margorubber.in, which is the address section 06’s mailto: must match.
  - The Products column must show all eleven — and lining makes twelve. It currently shows nine. Rubber sheet lining is client-confirmed (2026-09-02) and has no category, no page and no footer entry. It is also a missing guide: a library with an O-ring size chart and a bonding guide and nothing on lining specification is missing the topic where Margo has just confirmed a capability nobody on this site has written about.
  - Build once, ships forty times. This is one component. The copy above is written out in full on every sheet in this set so nobody has to open two files to build one block, but it is authored once in the codebase.
  - Heading levels. The column labels (PRODUCTS / INDUSTRIES / COMPANY) are <h2> in the live build. As visible <h2>s they inject three phantom sections into every document outline on the site. Change to <p class="col-label">.
  - Link equity. 26 sitewide links from here. Adding /export, /products/extrusion and /products/sponge-foam-rubber gives three orphaned or under-linked URLs a sitewide inbound link each — the cheapest internal-linking win available on this site.
  - NAP markup. Wrap in <address>. Phone as <a href="tel:+919665579276">, email as <a href="mailto:info@margorubber.in">. The visible string and the href must not diverge.
  - Schema. The footer emits nothing. The Organization node on the homepage is the single entity definition and every other page @id-references it. Repeating an Organization block per page creates 40 competing entities.
  - Copyright year. Render from new Date().getFullYear(), not a literal. It has read 2024 for eight months.
  </details>