# 32_SKU_Page_Template.html — SKU Page Template Content Sheet

**<title>** {Part Name} | {Category} Manufacturer India | Margo
**description** {Part Name} moulded to your drawing in {compound list} at our ISO 9001:2015 plant in Nashik, India. Bulk production from 10,000 pieces. Send a drawing or sample for a quotation.

## 01 Hero & spec block [Boilerplate specs · two contradictions]
> live: LIVE H1 → {Part Name} · IN STOCK badge above a “MADE TO ORDER” label · four specs identical on all 31 pages · quantity in kilograms
- **Badges**: `IN STOCK · MADE TO ORDER`
  _“IN STOCK” comes off all 31 pages. It sits in the same viewport as “MADE TO ORDER” and as an intro sentence that says the part is manufactured to order from a drawing. A procurement manager who reads IN STOCK plans a delivery date against it, and the rest of the page describes a tooled, made-to-order part quoted per programme. The certification badge is the honest thing to put in that slot_
- **H1**: “{Part Name}”
  _[no change to the pattern] — but four of the 31 H1s name other companies’ vehicles and six are internal part names no buyer searches. Both are handled in the inventory table at the foot of this sheet_
- **Intro sentence**:
  > {Part Name} manufactured to order at our ISO 9001:2015 certified plant in Nashik. Compound, hardness and dimensions are set from your drawing or sample.
  _[no change] — this is the best sentence on the template. It is true, it is specific, and every defect on this page is a contradiction of it. The spec block below contradicts “set from your drawing”; the IN STOCK badge contradicts “to order”; the kilogram selector contradicts both_
- **Spec block ×4** (Field | Live — identical on all 31 | Ships as):
  | HARDNESS |  | {part.hardness} — else To your drawing |
  | TEMPERATURE |  | Compound dependent — see section 04 |
  | THICKNESS |  | Remove — a sheet dimension |
  | WIDTH |  | Remove — a sheet dimension |
  | TENSILE |  | Per compound datasheet — or remove |
  | SHORE A |  | {part.hardness} ±5 — else remove |
  _Two separate problems.
First, the temperature is wrong on the compounds that matter. The FKM oil seal page prints −40 to +120 °C here and −20 / +250 °C in its own compound card 2,000 px below. A buyer specifying a hot seal reads the hero, concludes FKM tops out at 120 °C and leaves — for a part that would have done the job. “Compound dependent” is both true and safe, and it routes the reader to the card that has the real range.
Second, thickness and width are sheet-rubber fields. A bumper stopper is not 2,000 mm wide. Delete them rather than fill them — a moulded part is described by its drawing, which is what the intro sentence already says.
Third, and worst: the tensile figure. 18 MPa is published identically on all 31 pages. Tensile strength belongs to the compound, not the part — natural rubber runs around 20–25 MPa, EPDM and silicone considerably lower. A blank field is ignored; a wrong number gets designed against_
- **Quantity selector**: `QTY (kg) − 1,000 + Min: 500 kg`
  _Two changes, both client-instructed. Moulded parts are ordered in pieces, not kilograms — no buyer on this page thinks in kg, and the Engineering Data table two sections below already says “per SKU”. And 500 becomes 10,000, per the position of 2026-09-01. These are the 7th and 8th minimum-order figures published on this website; correcting the template retires two of them across 31 pages at once_
  <details><summary>notes (4)</summary>
  - One <h1>, the part name. Breadcrumb above it: Home › Products › {Category} › {Part}. The live breadcrumb labels the second level “Rubber Products” while the nav calls it “Products” — pick one.
  - Do not emit availability: InStock in Product schema. If the badge is already wired to it, that contradiction is published as machine-readable data on 31 URLs. Check before deploying anything else on this sheet.
  - The spec block is the only per-part content above the fold. Until it carries real values these 31 pages are near-duplicates of one another, which is a thin-content risk on a set this size.
  - Image alt, per part: “{Part Name} in {compound}, moulded to drawing at Margo Rubber Products, Nashik”.
  </details>

## 02 Visual reference [Sheet dimensions again · no image]
> live: LIVE H2 → Visual Reference · “CROSS SECTION VIEW” with no drawing · Max width / Thickness / Run length
- **H2**: “Visual Reference”
  _[no change to the heading] — but the section renders a labelled empty frame. “CROSS SECTION VIEW” with nothing in it is worse than no section, because the label promises a drawing the reader then looks for_
- **Dimension rows ×3** (Row | Live | Ships as):
  | Max width |  | Remove — sheet field |
  | Thickness |  | Remove — sheet field |
  | Run length |  | Remove — extrusion field |
  | Overall dimensions | — | To your drawing or sample |
  | Tolerance class | — | ISO 3302-1, class agreed per part |
  | Bonded insert | — | Rubber-to-metal bonding in-house where the part requires it |
  _Three sheet-rubber rows out, three moulded-part rows in — tell the developer the row set changes, not the count. “Run length” is an extrusion field and it renders empty on all 31 pages, which is what gives the template’s origin away.
ISO 3302-1 is the tolerance answer everywhere on this site, replacing four different ± figures currently published across four pages. Bonding is client-confirmed in-house and this is the only place on a part page it could be stated_
- **🛑 The images**:
  > All 31 pages share three images and none shows the part. Two of the three are metalworking photographs — their own alt text reads “Grinding and finishing work throwing sparks in the workshop” and “Operator setting up a machining pass on the shop floor”. A rubber moulding plant has neither. The third is a generic tray of mouldings repeated 266 times across the set.
  > One phone photograph per part on a plain background fixes this, and it is the highest-value hour anyone could spend on this website. Until then the two metalworking images should come off every page — a wrong photograph is worse than no photograph.
- **Empty state**:
  > Drawing available on request under NDA. Send your part number or a sample and we will return a dimensioned drawing for approval before tooling.
  _24 words · replaces the empty frame until real cross-sections exist. It is honest, it is an offer rather than an apology, and “before tooling” is the reassurance an OEM buyer is actually looking for. A part drawing is also the single most valuable asset this template could carry — see section 09_
  <details><summary>notes (3)</summary>
  - An empty labelled frame is a layout-shift and a trust problem, not an SEO one — but it is on 31 pages, which makes it the most-repeated empty state on the site.
  - When drawings do exist, they are images with real alt text, not background CSS — a cross-section drawing is exactly the kind of asset that earns image-search traffic from engineers.
  - ISO 3302-1 in text, once per page. It is the string a drawing calls out.
  </details>

## 03 Engineering data [7 of 13 rows render empty]
> live: LIVE H2 → Engineering Data · a specification table where over half the values are blank · and a minimum that contradicts the hero
- **Table** (Row | Live | Ships as):
  | Product Code |  | {part.code} — or remove the row. A part page whose part number is “on request” is the one thing a buyer will notice |
  | Product Family | {Category} | [no change] |
  | Material | Compound dependent, see options below | [no change] — correct and honest |
  | Hardness (Shore A) |  | {part.hardness} else To your drawing, 40–90 Shore A typical |
  | Tensile Strength |  | Per compound datasheet — tested to ASTM D412 |
  | Elongation at Break |  | Per compound datasheet — tested to ASTM D412 |
  | Operating Temperature | Compound dependent | [no change] |
  | Compression Set |  | Tested to ASTM D395 Method B |
  | Density |  | Per compound datasheet |
  | Colour Options | Black standard, custom RAL on request | [no change] |
  | Lead Time |  | Confirmed with the quotation, from approved drawing and approved sample |
  | Certifications | ISO 9001:2015 | ISO 9001:2015 — certificate 09111526A, valid to 21 Feb 2027 |
  | Minimum Order |  | 10,000 pieces per part number, per compound — prototypes outside the minimum |
  _Seven of thirteen rows answer “On request” on all 31 pages — identically, with the four production metrics in section 08 making eight. A specification table that declines to specify seven times is not a specification table, and it is the section a technical buyer scrolls to first.
Three of the empty rows can be filled today without any new data — tensile, elongation and compression set are properties of the compound, not the part, and Margo tests all three in-house. Naming the method (ASTM D412, ASTM D395 Method B) turns an empty row into a capability statement.
The rest should be hidden until populated, not shown empty. And the minimum contradicts the hero’s “Min: 500 kg” on the same page_
  <details><summary>notes (4)</summary>
  - Hide rows you cannot answer; do not print “On request” seven times. An answer engine asked “what is the hardness of Margo’s bumper stopper?” currently extracts the string “On request” — which is worse than extracting nothing, because it is a confident non-answer that will be quoted.
  - This table is the page’s Product schema source. material, category and the compound list map straight from it. Do not map an empty row to a schema property.
  - Named test methods are the cheapest credibility on the page. ASTM D412 and ASTM D395 Method B are both on Margo’s published test list, so naming them costs nothing and is checkable.
  - The certificate number belongs here, not just on /certifications — this is the row an auditor screenshots.
  </details>

## 04 Rubber compound options [Show all eight · rank them per part]
> live: LIVE H2 → Rubber Compound Options · a real selector with real temperature ranges · but the list is a category default and natural rubber is on none of the 31 pages
- **H2 · intro**: “Rubber Compound Options”
  _[no change to either] — and the ranges in the cards are correct against the locked homepage table, which is more than most sections on this site manage_
- **Compound sets — live** (Category | Compounds offered | Pages):
  | Anti-Vibration Mounts | Neoprene, SBR | 5 |
  | Pads, Stoppers & Caps | EPDM, NBR, Neoprene, SBR | 13 |
  | Oil Seals | FKM, Silicone, NBR | 6 |
  | Gaskets | Silicone, EPDM, NBR, Neoprene | 3 |
  | Grommets | EPDM, NBR, Neoprene | 2 |
  | O-Rings | FKM, Silicone, EPDM, NBR | 1 |
  | Bushes | AEM, NBR, Neoprene | 1 |
  _Every page in a category gets the same list, and it is shorter than the truth. All thirteen pads offer the same four compounds; all six oil seals the same three. Margo produces every part in every compound it mixes (client-instructed 2026-09-02) — so the live selector is understating the offer and giving no guidance on which of the four suits the part_
- **What changes** (Change | Why):
  | Show all eight compounds on every page | Margo produces every part in every compound it mixes — client-instructed 2026-09-02. Showing three or four understates the offer. Natural rubber currently appears on none of the 31 pages, including the five anti-vibration mounts it is the primary compound for |
  | Rank them for the part — Recommended / Suitable / Available / Not recommended | The live selector presents three or four compounds as equals. A buyer choosing from an unranked list can pick a compound that will fail — and on this site they can pick EPDM for an oil seal. Ranking is the whole fix |
  | State the reason against anything wrong for that duty | Not “unavailable” — “not recommended: swells in mineral oil”. It keeps the capability claim intact and stops the wrong selection. This is what turns a menu into a selection tool |
  | Add “Not sure? Send the medium, temperature and load” under the selector | The same request the industry pages make. A buyer who cannot choose currently has no route except the quote form |
  | Keep every temperature range as published | They match the locked homepage table. FKM −20/+250, silicone −60/+220, EPDM −40/+140, NBR −30/+120, neoprene −40/+120, SBR −30/+100, AEM −40/+175, NR −20/+90 — all correct |
  _This section is the best-built part of the template — a working selector with accurate figures. The fix is guidance, not scope: every compound stays selectable, and the page starts saying which one is right_
  <details><summary>notes (4)</summary>
  - Every compound panel in the DOM at first paint, hidden with CSS. A selector that mounts on click ships a page with one compound and a row of buttons.
  - This is the section that makes each SKU page distinct. With the spec block genericised, the per-part ranking is the main signal — and eight compounds ranked differently on every page is genuinely unique content on all 31 URLs.
  - The temperature ranges are this template’s AEO asset. “What temperature can FKM take?” gets a correct 40-word answer here, and it is correct on all 31 pages.
  - Feed material in Product schema from the recommended and suitable rows only — not from all eight, or every part on the site declares the same material list.
  </details>

## 05 Why specifiers choose Margo [Drop one chip · fix one process claim]
> live: LIVE H2 → Why Specifiers Choose Margo · four cards · a 99.7% yield chip the page later says is “on request”
- **Quality chip**: `QUALITY RATE 99.7% first-pass yield avg.`
  _The page contradicts this chip 2,300 px lower, where the production-metrics table lists “First-pass yield — On request”. One of the two is wrong and the honest one is the table.
99.7% is also the fourth quality figure on this website, alongside 0.2% field returns, 99.4% process consistency and the <1% target rejection in the company profile. Four numbers for one property is worse than none — the replacement states something checkable instead_
- **Card 1 — Superior Durability**:
  > Compound and geometry selected for the service life your application needs — continuous mechanical stress, UV exposure or fluid contact.
  _20 words · live is 15 · “Engineered for long service life” is an adjective, not a claim. Naming the three failure modes says the same thing and tells the buyer what to send_
- **Card 2 — Precision Tolerance**:
  > Dimensional accuracy held under ISO-controlled compression moulding.
  > Dimensional conformity to ISO 3302-1, class agreed per part — injection, compression or transfer moulded to suit the geometry.
  _19 words · live is 8 · two fixes in one line. ISO 3302-1 replaces the vague “ISO-controlled”, which names no standard.
And “compression moulding” is wrong on a third of these pages. Six oil seals and an O-ring are injection or transfer moulded — a seal engineer knows that on sight. Margo runs all three processes; the template just names one_
- **Card 3 — Global Compliance**:
  > Manufactured against the international standard applicable to your market.
  > Produced against the standard your drawing calls out. Tell us the specification and we confirm what we can supply against it.
  _21 words · live is 9 · “the international standard applicable to your market” is not a thing — there is no single standard, and the sentence implies Margo already meets whatever it is. The replacement is the same position the water and medical sheets take on approvals_
- **Card 4 — Custom Formulation**:
  > In-house compounding across the eight rubbers we mix, blended to your operating conditions.
  _14 words · live is 13 · “bespoke rubber blends” becomes a number. Eight is checkable against the homepage table and it is the claim that separates a compounder from a trading house_
  <details><summary>notes (3)</summary>
  - Card titles <h3>. Generic titles — “Superior Durability”, “Global Compliance” — carry no search value; the body is doing the work, so keep the body specific.
  - Never publish a metric the same page later declines to give. The 99.7% chip and the “on request” row are 2,300 px apart on 31 pages.
  - Name the moulding process per part, from the part record — it is a genuine differentiator and currently it is wrong on seven pages.
  </details>

## 06 Global applications [6 cards become 4]
> live: LIVE H2 → Global Applications · six sectors · Aerospace and Marine are claimed on all 31 pages
- **Cards** (Card | Live | Decision):
  | Automotive | Seals, mounts, vibration dampers | Keep. The verified client list is automotive-led and 24 of the 31 SKUs are automotive parts |
  | Heavy Industry | Conveyor liners, impact buffers | Keep. Conveyor lining is now supportable — sheet lining client-confirmed 2026-09-02 |
  | Energy & Oil |  | Retitle to “Oil & Gas”, narrow the body. Valve packing is a braided-gland product Margo does not make. Ships as: “Static seals and gaskets for surface equipment” — matching the oil & gas industry page, which does not claim downhole or pipeline duty |
  | Construction |  | Retitle to “Infrastructure”, narrow the body. Structural bearings are a certified load-bearing product to EN 1337 and expansion joints are an engineered assembly. Ships as: “Sealing profiles, pads and gaskets for plant and building services” |
  | Aerospace |  | Remove. Aerospace supply requires AS9100, which is not held and is claimed nowhere. Aerospace is not among the seven sectors in the verified client list. This is the same over-reach the /why-margo page carries, repeated on 31 URLs |
  | Marine |  | Remove. Marine fender systems are a different industry and a different product — large fabricated units, not moulded components. Marine also implies NORSOK/API, targeted 2027 and not held |
  _Six become four — tell the developer the grid count changes. Two removed, two narrowed to what the industry pages in this set already say.
The pattern is worth naming for the developer: each of the four live bodies pairs a real product with one that belongs to a different trade — conveyor liners and impact buffers is fine; pipeline seals and valve packing is not. Whoever wrote this listed adjacent products rather than Margo’s products, and on 31 pages that is 124 application claims of which roughly half are outside the range_
  <details><summary>notes (3)</summary>
  - Link each of the four to its industry page — /industries/automotive, /industries/mining, /industries/oil-gas and /industries/hvac. These 31 pages currently link to no industry page at all, and they are the deepest URLs on the site.
  - Do not claim a sector in Product schema. The industry pages carry Service nodes; a SKU page asserting audience or an aerospace category creates a competing claim.
  - Card titles <h3>.
  </details>

## 07 From compound to certification [Keep · one step generalised]
> live: LIVE H2 → From Compound to Certification · six numbered steps · accurate, and the best-built section on the template
- **Steps ×6** (# | Step | Ships as):
  | 01 | Material Compounding | Raw polymer blending, additive integration and batch QC testing in our in-house lab. [“ISO-certified lab” → “in-house lab”] |
  | 02 | Mould Design & CNC | Precision steel tooling manufactured in-house and held as a controlled record. [no change] |
  | 03 |  | Moulding — injection, compression or transfer, selected for the part geometry, at controlled temperature and pressure profiles |
  | 04 | Post-Cure & Trimming | Oven post-cure for dimensional stability, followed by flash trimming. [no change] |
  | 05 | Quality Inspection | Dimensional check, hardness testing and batch sampling before release. [no change] |
  | 06 | Export Packaging | Industrial packing with documentation for international shipping. ISPM-15 treated pallets where timber packaging is used. |
  _Six steps, six kept — only step 03 changes materially. This section is accurate, it is specific, and it describes work Margo actually does.
Step 02 is the strongest sentence in the whole template: “precision steel tooling manufactured in-house and held as a controlled record” is exactly what separates a manufacturer from a trading house, and it is stated without an adjective.
Step 01 loses “ISO-certified lab” — the certificate scope covers rubber moulded components, not a laboratory accreditation, and a lab claim implies ISO/IEC 17025. Step 06 gains ISPM-15, which the agriculture and export sheets already establish and which is the one packaging fact an importer needs_
  <details><summary>notes (3)</summary>
  - Numbered steps are an <ol>. The order is the process; a grid of divs loses it.
  - This is a strong AEO passage and it is identical on 31 pages — which is fine for a process description but means it will never differentiate one SKU from another. Consider lifting it to /products and linking, which would also cut ~1,050 px of duplicate content from every SKU page.
  - “Held as a controlled record” is audit language and it is the phrase a Tier-1 supplier-qualification questionnaire uses. Keep it.
  </details>

## 08 Certified to international standards [Keep · add the certificate identity]
> live: LIVE H2 → Certified to International Standards · ISO 9001 only, no invented credentials, metrics marked “On request” — the most honest section on the site
- **This section got it right four times**:
  > After /why-margo, which lists five certifications and holds one, this template deserves saying plainly: it claims ISO 9001:2015 and nothing else. No IATF. No TÜV SÜD. No CE marking. The production-metrics table prints “On request” where it has no figure rather than inventing one, and the facility video says “Film pending” instead of showing a stock clip. Whoever built this component made the honest call four times in one section. Do not let a rewrite undo that.
- **H2 · body**: “Certified to International Standards”
  _[no change] — 30 words, three named documents, one checkable promise. This is how the rest of the site should read_
- **Certificate block**: `ISO 9001:2015
Accredited certification body
Current`
  _“Accredited certification body” and “Current” are true but unverifiable. A number, an issuer and an expiry date are checkable, and this is the section a supplier-qualification team screenshots.
The scope line matters on this template specifically: extrusion and sponge/foam sit outside the certificate. Neither category has SKU pages today, so nothing here is affected — but the moment an extruded profile gets a SKU page, this block would claim ISO cover it does not have_
- **Production metrics ×4** (Row | Live | Ships as):
  | Years in operation |  | Publish it — once the founding year is settled. The site currently carries four different ones |
  | Active clients |  | 60+ — from the signed company profile p27 |
  | First-pass yield | On request | [no change] — and remove the 99.7% chip in section 05 that contradicts it |
  | Avg. lead time |  | 3–4 weeks from approved sample — company profile p27 |
  _Three of the four can be filled from documents Margo has already signed off. “On request” was the right answer when nobody had checked; now that the figures exist, publishing them is strictly better — and they are good figures.
First-pass yield stays “on request” because no verified number exists, and the 99.7% in section 05 is not one_
  <details><summary>notes (3)</summary>
  - No hasCredential on any SKU page. The ISO node lives once, on /certifications; 31 SKU pages declaring it creates 31 credentials for one certificate.
  - The certificate number is visible text, not an image caption — it is the string a buyer copies into a verification search.
  - “Film pending” is fine to ship. An honest empty state beats a stock factory video, and on a page selling drawing-matched manufacturing a generic clip actively undercuts the argument.
  </details>

## 09 Technical documentation [4 dead downloads × 31 pages = 124]
> live: LIVE H2 → Technical Documentation · PDF, DWG, STEP, ZIP · none of the four exists; two are labelled “Download” and open the contact form
- **Live state** (Offered | Reality):
  | PDF — Product datasheet | Marked “Pending” on the page itself |
  | DWG — Technical drawing | Anchor labelled “Technical Drawing DWG” → /contact |
  | STEP — 3D CAD model | No file |
  | ZIP — Product images hi-res | No file |
  | Anchor: “Download Full Datasheet PDF” | → /contact |
  _4 × 31 = 124 dead download affordances, on top of the 22 counted across the rest of the site. A control labelled “Download” that opens a contact form is worse than no control — the buyer has been told a file exists, and discovering it does not is the moment they start discounting everything else on the page_
- **Ships as — until files exist**: “Technical Documentation”
  _41 words · one honest request line replaces four fake buttons. It still captures the intent — and it captures it better, because the buyer now tells you which format they use, which is information the download never gave you.
The pre-filled part parameter is copied from section 12, which already does this correctly_
  <details><summary>notes (4)</summary>
  - Build the STEP models before anything else on this sheet. A 3D model is the highest-intent asset on this entire website — an engineer who drops a STEP file into an assembly has designed the part in, and the enquiry that follows is a specification, not a price check. Ten parts would be enough to test it.
  - Gate on an email, not on a form. If documentation is gated, the trade has to be worth it — and a datasheet that does not exist is not a trade.
  - Never label a control “Download” unless a file is served. It is a soft 404 that a crawler cannot see and a buyer always can.
  - When files ship, Product schema can carry them via subjectOf; not before.
  </details>

## 10 Technical & commercial questions [5 questions · answers written]
> live: LIVE H2 → Technical & Commercial Questions · five well-chosen questions · the same five on all 31 pages
- **Intro**:
  > Answers to the most common questions from engineering teams and procurement managers worldwide.
  _[no change] — and the five questions are genuinely the right five. Whoever chose them understood the buyer_
- **Q1**:
  > We supply in bulk. The minimum run is 10,000 pieces per part number, per compound, or quoted against the part where geometry or tooling makes that unrealistic. Prototype and first-article lots sit outside the minimum.
  _36 words · client-instructed 2026-09-01. This answer must match the hero selector and the Engineering Data row on the same page — all three currently disagree_
- **Q2**:
  > Yes. Send the physical sample or the drawing and we will produce a dimensioned drawing and confirm compound selection before tooling. A worn part measures smaller than it was made — we dimension to the original intent, not to the wear, and confirm with you first.
  _46 words · the worn-sample point is the same one the agriculture sheet makes, and it is the thing a reverse-engineering buyer actually worries about_
- **Q3**:
  > PDF, DWG, DXF and STEP. A dimensioned 2D drawing with tolerances is enough to quote; a 3D model helps with tooling. If you only have a sample, send the sample — we will produce the drawing.
  _37 words · a small, entirely factual answer that most competitor sites do not give. It also tells the buyer the minimum they need to get a quote, which removes the commonest reason an enquiry stalls_
- **Q4**:
  > Yes. Material test reports, dimensional inspection sheets and a certificate of conformance ship with every consignment, and batch records are retained per shipment. Hardness, tensile to ASTM D412 and compression set to ASTM D395 Method B are tested in-house.
  _40 words · the named methods are the addition, and both are on Margo’s published test list. Consistent with section 08 and with /certifications_
- **Q5**:
  > TT and LC accepted, discussed per order. Ex-works Nashik or FOB Nhava Sheva, with sea and air freight via established forwarders. Commercial invoice, packing list and certificate of origin are issued with every consignment.
  _35 words · same wording as the export sheet and all nine industry pages, so one answer ships everywhere_
  <details><summary>notes (4)</summary>
  - All five answers in the DOM at first paint, hidden with CSS. The live accordion renders the questions as <span> with the answers not present in the sampled DOM — verify with curl, not devtools, because a hover- or click-mounted answer is invisible to a crawler on all 31 pages.
  - Questions become <h3>, not <span>.
  - Identical FAQ content on 31 URLs is a duplication risk. Mark up FAQPage on the category pages instead, and keep the visible accordion on the SKU pages without schema — or Q1’s answer competes with itself 31 times.
  - Q1’s answer must match the hero and the data table. Three places, one constant, rendered from one value.
  </details>

## 11 You may also need [Keep · the only part-to-part linking on the site]
> live: LIVE H2 → You May Also Need · three sibling parts, all from the same category
- **H2**: “You May Also Need”
  _[no change] — and keep this section. It is the only place on the entire website where one part links to another, and it is the mechanism that stops these 31 URLs being dead ends_
- **Selection rule** (Live | Ships as):
  | 3 siblings from the same category | 3 siblings + 1 cross-category part that shares an assembly |
  | Ordered by whatever the CMS returns | Ordered so the first is the nearest functional substitute |
  | Card shows part name + “View part” | Card shows part name + compound + one-line difference from the part being viewed |
  _Three becomes four — tell the developer the count changes.
The cross-category slot is the useful addition. A buyer on the oil filler cap page plausibly also needs the seal filler cap O-ring; both sit in a filler-neck assembly and they are in different categories, so the current same-category rule never surfaces them together. That relationship is the one thing a parts buyer wants a site to know, and Margo’s own part list already contains the pairs.
The one-line difference is what makes the cards worth clicking — three names alone give the reader nothing to choose on_
  <details><summary>notes (4)</summary>
  - This is the internal-linking layer for the deepest 31 URLs on the site. With the sitemap empty, sibling links and the category pages are the only route a crawler has to these pages.
  - Feed isSimilarTo in Product schema from this list.
  - Anchor text is the part name, never “View part” alone — the live cards use the name as the heading and “View part” as the link, which wastes the anchor.
  - Add a link back to the parent category in addition to the one in section 12 — the category page is the hub that distributes authority to all of these.
  </details>

## 12 Quote CTA [Keep the pre-fill · fix the response time]
> live: LIVE H2 → Need this part quoted? · the quote link pre-fills the part name — the best-built control on the site · and a sixth response time
- **H2**: “Need this part quoted?”
  _[no change] — four words, correct question, no adjective_
- **Body**:
  > Send your drawing or a sample. We confirm compound, hardness and tolerance, then quote against your annual quantity. Response within 1 business day (IST).
  > Send your drawing or a sample. We confirm compound, hardness and tolerance, then quote against your annual quantity. We respond within 48 hours.
  _23 words · live is 24 · only the response time changes. “Quote against your annual quantity” is exactly right for a bulk moulder and it is the phrase that tells an OEM buyer this is a programme supplier, not a catalogue.
“Within 1 business day (IST)” is the sixth response commitment on this website — and multiplied across 31 pages it is by far the most-published. 48 hours is the figure this set standardises on and the only one that survives a bad week_
- **Primary CTA**: `Request a quote` → /contact?part={Part%20Name}
  _[no change] — and this is the single best-built control on the website. The buyer arrives at the contact form with the part already named, which removes the commonest reason a part enquiry arrives unusable.
Extend the same pattern to section 09 with &doc=1 for documentation requests, and to the category pages_
- **Secondary**: `← Back to {Category} /products/{category}`
  _[no change] — correct, and it is the only upward link on the page apart from the breadcrumb_
  <details><summary>notes (3)</summary>
  - One response time sitewide, rendered from one constant. Six figures currently appear across the site; this template publishes one of them 31 times.
  - The ?part= parameter must be URL-encoded and the form must read it. Verify the value actually lands in the form field — a pre-fill that silently fails is worse than none, because nobody notices.
  - Do not index the parameterised URL. /contact?part=… should canonical to /contact; 31 variants of the contact page is a duplication problem, and robots.txt already disallows several query patterns but not this one.
  </details>

## 13 Footer [Global component · unchanged from the rest of the set]
> live: LIVE → the shared footer · the same corrections as all 31 other sheets
  <details><summary>notes (4)</summary>
  - The footer is the only sitewide navigation these 31 pages have. With /sitemap.xml empty, a crawler reaches a SKU page through the category page or the sibling links in section 11 — and reaches nothing else from it except the footer.
  - The Products column must list all eleven categories (twelve with sheet lining). It currently shows nine, so two categories are unreachable from any SKU page.
  - Same corrections as every other sheet in this set: legal name Margo Rubber Products, © rendered from the current year, the Vilholi address, Export Markets replacing Why Choose Us, the 48-hour response time, and certificate 09111526A on the ISO line.
  - One detail specific to this template: the footer CTA promises a quote “within 24 hours” while section 12 promises “within 1 business day”, ~350 px apart. Two response commitments on every one of the 31 pages.
  </details>

## 31 The full SKU inventory [Per-page actions]
> live: Every live SKU URL, its H1, its compound set, and what changes
- **1. Six pages are material variants, not parts**:
  > /oil-seals/epdm, /oil-seals/fkm, /oil-seals/nbr, /oil-seals/silicone, /gaskets/epdm and /pads-stoppers-caps/epdm-pad are compound variants of a category sitting in the same URL space as actual parts like Glove Box Stopper. Their content is otherwise identical to each other, which makes four near-duplicate oil-seal pages whose only difference is a heading.
  > These are not SKUs and they should not be SKU pages. Compound choice already has a dedicated selector in section 04 of every page. The four oil-seal variants collapse into the /products/oil-seals category page as filter states, or become one page each with genuinely different content — a real application, a real dimension range, a real reason to exist separately.
- **2. /oil-seals/epdm does not offer EPDM**:
  > The page titled “EPDM Oil Seals” offers FKM, Silicone and NBR in its compound selector. EPDM is not among them. The compound list is inherited from the oil-seals category default, and nobody checked it against a page whose entire identity is that compound.
  > This is the clearest possible demonstration of why compound lists have to be per-part. It is a two-line fix and it is currently live.
  <details><summary>notes (5)</summary>
  - Collapsing the six material variants removes six near-duplicate URLs. Four oil-seal pages whose only difference is a heading are competing with each other and with the category page for the same query.
  - Six unsearchable internal names is the biggest missed opportunity here. “C Pad” and “L Pad” rank for nothing. The buyer searches by what it does — rubber bump stop, tailgate switch boot, radiator shroud flap — and three of the 31 already do this correctly.
  - The four OEM renames keep the search value in the body, not the H1. “Dimensionally equivalent to the support pad used on Bolero-class SUV platforms; supplied to your drawing or sample” still matches the query and asserts nothing about Mahindra.
  - Two foam parts belong under /products/sponge-foam-rubber, which has no SKU pages and no sitewide inbound link. Moving them fixes both problems.
  - Add all remaining URLs to /sitemap.xml, which today is an empty <urlset>. Redirect anything collapsed or renamed — 301, and update the sibling links in section 11 first so the redirects are a safety net rather than a route the site depends on.
  </details>