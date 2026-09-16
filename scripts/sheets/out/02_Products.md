# 02_Products.html — Products Page Content Sheet

**<title>** Custom Rubber Parts Manufacturer India | 11 Product Lines | Margo
**description** Eleven rubber component lines moulded and extruded to your drawing in Nashik, India — O-rings, oil seals, gaskets, bellows, mounts, profiles and foam. ISO 9001:2015. Quote in 48 hours.

## 01 Hero [Rewrite]
> live: LIVE H1 → EngineeredRubber Solutionsfor Every Industry (whitespace bug) · subhead says “50+ countries since 1988” — a fourth founding year, used nowhere else on the site
- **Eyebrow**: `GLOBAL MANUFACTURING PARTNER · NASHIK, INDIA`
  _6 words · live is 3 · the eyebrow was carrying no geo at all_
- **H1 — 3 lines**: “Custom Rubber Parts” / “Manufactured to Your Drawing.” / “Eleven Product Lines.”  (accent: Manufactured to Your Drawing.)
  _8 words · live H1 is 6 · carries the head term in line 1; line 2 in accent teal_
- **Subhead**:
  > Margo Rubber Products moulds and extrudes eleven lines of precision rubber components at its ISO 9001:2015 certified plant in Nashik, India — sealing, anti-vibration, protection, continuous profile and cellular. Compound, hardness and dimensions set from your drawing or a physical sample.
  _41 words · live is 19 · entity, category and location in the first clause — this is the page’s AEO surface_
- **CTA primary**: `Explore Products` → #range
- **CTA secondary**: `Download Catalogue ↓ #catalogue`
  _Replaces Watch Overview ▶ — there is no overview video, and the live button goes nowhere_
- **Stat cards ×4** (Value | Label | Replaces):
  | 11 | Product Lines |  |
  | 8 | Compounds Mixed In-House |  |
  | 200+ | Catalogue SKUs |  |
  | ISO 9001:2015 | Certified Quality | ISO / 9001:2015 Certified — unchanged |
  _Product-page stats, not company stats. Countries and years belong on the homepage and /about; on a catalogue hub the buyer is sizing the range. No figure repeats from the homepage hero except 200+, which is the catalogue itself_
  <details><summary>notes (6)</summary>
  - Heading. Page’s only <h1>. Three <span class="block"> children — the concatenation bug is live on this exact element.
  - Keyword. Head term custom rubber parts manufacturer sits in H1 line 1 + subhead. Secondary rubber components manufacturer India resolves in the subhead’s first clause. First-100-word density 2.3%.
  - Removed claims. since 1988, 35+ years, 500+ product variants, 50+ countries — four fabrications in one 19-word subhead and one stat row.
  - Internal links. Two in-page anchors (#range, #catalogue) plus the breadcrumb. Anchors must be /products#range, not /#range — the root-relative anchor bug that breaks all eight jump links on /export is the same component.
  - LCP. Hero background is the LCP element. fetchpriority="high", AVIF + WebP, preload. Every other image on this 10,031px page loading="lazy" — there are 11 card images below the fold.
  - Alt. alt="Custom moulded rubber components manufactured by Margo Rubber Products, Nashik, India".
  </details>

## 02 Product range [Tune]
> live: LIVE H2 → Our Product Range · 11 cards with a working filter — structurally the best section on the page · card fields are correct; what is missing is the family label, so a card never says which filter chip it belongs to
- **Eyebrow**: `PRODUCT CATALOGUE`
- **H2**: “Eleven Rubber Component Lines,” / “Moulded and Extruded to Drawing”  (accent: Moulded and Extruded to Drawing)
  _8 words · live is 3 · the live H2 carries no product noun at all_
- **Intro**:
  > Nine moulded lines, one continuous-profile line and one cellular line. Standard catalogue sizes to AS568, ISO 3601 and metric series, or fully bespoke from your drawing. Tooling is designed and cut in-house.
  _32 words · live is 15_
- **Filter chips ×7**: `All Products · Sealing · Anti-Vibration · Protection · Profiles · Custom · Cellular`
  _Unchanged — the taxonomy is correct and the filter works_
- **Cards ×11** (composite):
    | O-Rings | Sealing | by the piece | PRECISION SEALING TO STANDARD SERIES | Hydraulic systems · Pneumatic valves |
    | Oil Seals | Sealing | by the piece | ROTARY SHAFT SEALING, LIP TYPE | Gearboxes · Pumps & compressors |
    | Gaskets | Sealing | by the piece | FLANGE AND PROFILE SEALING | Flanged joints · Engine covers |
    | Bellows | Protection | by the piece | FLEXIBLE EXPANSION AND PROTECTION | CV joints · Steering systems |
    | Grommets | Protection | by the piece | SEALED CABLE AND PANEL ENTRY | Cable entry · Panel seals |
    | Bushes & Bushings | Anti-Vibration | by the piece | PRECISION BORE, ENGINEERED FIT | Suspension arms · Engine mounts |
    | Anti-Vibration Mounts | Anti-Vibration | by the piece | ISOLATE, DAMPEN, PROTECT | Marine engines · Generators |
    | Pads, Stoppers & Caps | Custom | by the piece | CUSHIONING, STOPPING, PROTECTING | Machinery feet · Buffer stops |
    | Leak Test Rubber | Custom | by the piece | SEALS THE TEST, NOT THE PART | Alloy wheel testing · Diaphragms |
    | Extrusion Profiles | Profiles | by the metre | CONTINUOUS PROFILE, ANY CROSS-SECTION | Door & window profiles · Cord & strip |
    | Sponge & Foam Rubber | Cellular | sheet, roll or piece | CELLULAR ELASTOMERS, OPEN AND CLOSED CELL | HVAC insulation · Weatherseals |
  · Five fields per card, all five already in the live component. Family is added — the same six-term taxonomy as the filter chips above, so a card always tells you which chip it sits under. Unit is unchanged from live. Family assignments are unchanged too; only the row order is regrouped so the families read in blocks, where live, Grommets sits four rows from Bellows despite sharing one.
  · The unit is a pricing basis, never a quantity. “by the piece” states how a line is quoted — it must never be paired anywhere on the page with a number, a “from”, or a minimum. That pairing is what produced the MOQ leak in the live FAQ, and the founder instruction of 2026-08-19 has no exceptions.
  · Where the standards go. AS568 / ISO 3601, ASTM D2000, ISO 3302-1 and ASTM D1056 / D6576 belong in the category page spec tables, not on a hub card. They are still carried on this page, in section 05, section 08 and the FAQ.
- **Card CTA**: `View {Product} specifications →`
  _Replaces the generic View Details → on all 11 cards. Eleven identical anchor texts waste eleven internal links_
- **Closing link**: `Part not in the catalogue? Send a drawing or a sample` → /contact
  _14 words · live is 6 · names the two things Margo actually accepts_
  <details><summary>notes (7)</summary>
  - The densest internal-link block on the site. Eleven category URLs with unique, descriptive anchor text. Every head term in the keyword map is one click from here.
  - Slug fix. Card 10 → /products/extrusion (live is /products/extrusion, 301 it). Card 11 keeps the live slug /products/sponge-foam-rubber — it carries both head nouns and is the better target.
  - Filter must not hide content from crawlers. All 11 cards render in the DOM at first paint; the filter chips toggle CSS classes, not React conditional rendering. If cards unmount, ten of eleven category links disappear from the crawlable page.
  - Filter state and the URL. Chips should push ?family=sealing without changing the canonical. <link rel="canonical" href="https://margorubber.in/products"> stays fixed on every filter state, or seven filter combinations become seven duplicate URLs.
  - Card markup. <h3> product name inside the <a>; overline is a <p>. The overline is styled uppercase in CSS, never typed in caps — screen readers spell out typed caps letter by letter.
  - Images. Eleven cards, all loading="lazy" with explicit aspect-ratio. Alt: alt="{Product} moulded by Margo Rubber Products, Nashik", unique per card.
  - Schema. References the homepage #product-catalog node via mainEntity. No second catalogue node.
  </details>

## 03 Manufacturing excellence [Rewrite]
> live: LIVE H2 → Built on Decades of Precision · all four stats fabricated · says “Across 9 lines” 700px below a section that says eleven
- **Eyebrow**: `MANUFACTURING CAPACITY`
  _Replaces MANUFACTURING EXCELLENCE — the section shows numbers, so name the thing the numbers measure_
- **H2 — 2 lines**: “Five Million Components” / “a Month, Installed”  (accent: a Month, Installed)
  _6 words · live is 4 · a figure in the heading, not an adjective_
- **Intro**:
  > Automated presses with closed-loop temperature and pressure control, digital curing ovens with a retrievable cure record per batch, and IoT line monitoring. Current output is 1.5 million a month, so a volume ramp gets press time rather than a queue position.
  _42 words · live is 20 · second sentence is the extractable answer to “can they take my volume?”_
- **Capacity badge**: `INSTALLED CAPACITY
5M pcs / month · 30% utilised`
  _Replaces PRODUCTION CAPACITY / 12 Active Lines — the line count has no source_
- **Stat cards ×4** (Value | Label | Sub-label | Replaces):
  | 5M | Installed Capacity | Pieces per month |  |
  | 11 | Product Lines | 9 moulded, 1 extruded, 1 cellular |  |
  | <1% | Target Rejection Rate | Post-automation |  |
  | 25× | Capacity Growth | Against the previous works |  |
  _All four trace to company profile p11. “6-sigma process” is the single most dangerous string on the page — Six Sigma is a certifiable methodology with belt-level evidence behind it, and claiming it unprompted is the kind of thing a procurement auditor asks to see documented_
  <details><summary>notes (5)</summary>
  - Consistency gate. 11 here must equal the card count in section 02 and the footer Products column. The live page states 11 and 9 within 700px of each other — an LLM asked “how many product lines does Margo have?” gets two answers from one URL and is likely to cite neither.
  - Heading levels. <h2> only. Stat values <p>, never <h3>.
  - Answer block. The intro’s second sentence is the 40–60 word passage for “what production volume can an Indian rubber manufacturer handle?” — installed figure, current figure and the consequence, in one sentence.
  - Internal links. Two: /about#plant and /certifications. The live section has none.
  - Removed claims. Since 1988, 35+ years, 500+ variants, 50+ markets, 98.5% defect-free, 6-sigma, 12 active lines. Seven in one section.
  </details>

## 04 Manufacturing process [Rewrite]
> live: LIVE H2 → Our Manufacturing Process · 4 steps + 8 capability ticks · claims ±0.01 mm CNC tooling, CMM inspection and RoHS-compliant materials, none of which Margo holds
- **H2**: “From Compound to Certified Part,” / “Under One Roof”  (accent: Under One Roof)
  _7 words · live is 3 · “under one roof” is the actual differentiator and it is missing_
- **Steps ×4** (# | Title | Body):
  | 01 | Compound formulation | Mixed in-house across eight polymer families. Formulated to the duty cycle — hot oil, ozone under static strain and thermal cycling each take a different mix. |
  | 02 | Tooling | Mould and die designed and cut here from a CAD file, a section drawing or a worn sample. Prototyped to prove geometry before volume release. |
  | 03 | Moulding & extrusion | Compression, transfer and injection moulding, plus continuous-cure extrusion. Automated presses hold cure temperature and pressure closed-loop. |
  | 04 | Laboratory release | First-article dimensional check, then in-process inspection through the run. Every despatch lot released against hardness, dimension and visual criteria. |
  _Step bodies 20–26 words · live steps run 12–14 · step 1 changes from “Material Science” because Margo mixes compound, it does not run a research programme_
- **Capability ticks ×8** (Replacement | Replaces):
  | In-house rubber compounding | In-house rubber compounding — unchanged |
  | Mould and die tooling in-house |  |
  | Compression, transfer & injection moulding | Compression & injection molding — adds transfer |
  | Continuous-cure extrusion |  |
  | Dimensional inspection to ISO 3302-1 |  |
  | ODR rheometer cure-curve control |  |
  | Reverse engineering from a worn sample |  |
  | Batch traceability · APQP and PPAP on request | Traceability documentation — sharpened |
  _Five of eight replaced. CMM — inspection is by vernier and micrometer per company profile p12. ±0.01 mm in step 2 is that instrument’s resolution, not a tooling tolerance. RoHS is denied on /certifications. Fatigue and pressure testing is not on the in-house instrument list_
- **Closing block**: `Need a capability assessment?
Send a drawing or a sample. Our engineers will confirm feasibility,
recommend the compound, and quote inside 48 hours.
[ Talk to an Engineer → ] /contact`
  _26 words · live is 21 · adds the 48-hour commitment, which is the only reason to click_
  <details><summary>notes (5)</summary>
  - Markup. Steps are an <ol> — real sequence. Capability ticks are a <ul>. The ∅ glyph the live build uses as a bullet is a mathematical empty-set character read aloud by screen readers; replace with a CSS ::before and list-style:none.
  - Heading levels. <h2>, then <h3> for “In-House Capabilities” and for each step title. No level skipped.
  - Schema. None. The ItemList process node lives on the homepage; this is the same process described for a product audience and must not become a second node.
  - Why the tolerance claim matters more than it looks. Publishing ±0.01 mm on moulded rubber tells a specifying engineer the page was not written by someone who moulds rubber. It costs more credibility than the four fabricated stats above it, because it is the one an expert catches instantly.
  - Internal links. Three: /contact, /certifications, /about#plant.
  </details>

## 05 Material expertise [Rewrite]
> live: LIVE H2 → Six Core Compounds · the homepage says eight and the company profile says eight · AEM, Margo’s signature compound and the only one with a named customer behind it, is missing entirely
- **Eyebrow**: `MATERIAL ENGINEERING`
- **H2**: “Eight Compounds,” / “Mixed in Our Own Plant”  (accent: Mixed in Our Own Plant)
  _6 words · live is 3 · the count is corrected and the differentiator named_
- **Intro**:
  > We mix our own compound rather than buying it in, which is why the formulation can be written for your duty cycle instead of pulled off a shelf. Name the fluid, the temperature and the load and we will tell you which of the eight to specify.
  _47 words · live is 22_
- **Tabs ×8**: `AEM · FKM · Silicone (VMQ) · EPDM · NBR · Neoprene (CR) · SBR · Natural Rubber`
  _Live tabs are NBR · EPDM · VMQ · CR · FKM · NR. AEM and SBR are added; AEM leads. Default open tab changes from NBR to AEM — it is the only compound on the site with a named OEM behind it_
- **Tab panel — 8 fields** (Tab | Full name | Lead sentence | Temperature range | Hardness range | Best for | Property chips ×3 | Typical applications ×3):
  | AEM | Ethylene Acrylic Elastomer (Vamac) | Our signature compound. Holds flexibility and compression-set stability where oil, heat and ozone all act at once. Supplied to Mahindra & Mahindra for engine and transmission applications. | −40 °C to +175 °C | 50–80 Shore A | Heat + Oil | Heat-Stable · Oil-Resistant · Low Compression Set | 01 Insulation bushes · 02 Transmission seals · 03 Under-bonnet O-rings |
  | FKM | Fluoroelastomer (Viton) | The compound for aggressive chemistry and sustained heat. Resists hydrocarbons, acids and solvents that destroy nitrile. | −20 °C to +250 °C | 60–90 Shore A | Chemical-Resistant | High-Temperature · Chemical-Resistant · Low Swell | 01 Oil & gas seals · 02 Fuel system O-rings · 03 High-temp gaskets |
  | Silicone (VMQ) | Vinyl Methyl Silicone | The widest service range of the eight, and the only family with biocompatible grades. Poor abrasion resistance — not a wear part. | −60 °C to +220 °C | 30–80 Shore A | Temperature Extremes | Widest Range · Biocompatible Grades · Dielectric | 01 Medical tubing · 02 Switchgear gaskets · 03 Insulator covers |
  | EPDM | Ethylene Propylene Diene Monomer | Weather, ozone, steam and hot water. The default for anything that lives outdoors or under static strain in sunlight. | −40 °C to +140 °C | 40–90 Shore A | Weather + Steam | Ozone-Resistant · Steam-Resistant · UV-Stable | 01 Weatherseals · 02 HVAC foam strips · 03 Water main sealing rings |
  | NBR | Nitrile Butadiene Rubber | The workhorse for oil contact. Excellent resistance to petroleum oils, fuels and greases, with low gas permeability. | −30 °C to +120 °C | 40–90 Shore A | Oil-Resistant | Oil-Resistant · Fuel-Resistant · Low Gas Permeability | 01 Hydraulic seals · 02 Fuel system parts · 03 O-rings |
  | Neoprene (CR) | Polychloroprene | General purpose with balanced properties, and the family we reach for when flame retardancy is specified. | −40 °C to +120 °C | 40–90 Shore A | Flame-Retardant Grades | Flame-Retardant · Weather-Resistant · Balanced Properties | 01 Enclosure gaskets · 02 Foam tape · 03 Bonded pads |
  | SBR | Styrene Butadiene Rubber | Abrasion resistance at low cost. Specified where a part wears rather than seals. | −30 °C to +100 °C | 40–90 Shore A | Abrasion-Resistant | Abrasion-Resistant · Cost-Efficient · Good Wear Life | 01 Wear pads · 02 Buffer stops · 03 General mouldings |
  | Natural Rubber | Polyisoprene (NR) | The highest resilience of the eight. Specified for damping, not for oil or heat. | −20 °C to +90 °C | 30–80 Shore A | Damping | High Resilience · High Tensile · Excellent Damping | 01 Anti-vibration mounts · 02 Suspension bushes · 03 Footrest mats |
  _Every field the live panel renders, filled for all eight tabs. Key Properties is three rows — Temperature Range, Hardness Range, Best For — matching the live component exactly; the live NBR panel shows all three. Property chips are the three pills under the description. Typical Applications is the numbered 01/02/03 list on the right. Temperature ranges are identical to the homepage compound table — single source, no drift. Hardness bands and Best For are the standard commercial values per family; CONFIRM with the lab if a tighter band is held · CONFIRM_
- **Closing link**: `Need a custom formulation? Talk to our compounding team` → /contact
  <details><summary>notes (7)</summary>
  - Tab accessibility and crawlability. role="tablist" / role="tab" / role="tabpanel", aria-selected, arrow-key navigation. All eight panels must be in the DOM with inactive ones hidden by CSS, not unmounted — seven of eight compound descriptions vanish from the crawlable page otherwise, and this is the passage an LLM most wants to lift.
  - Deep-linkable tabs. /products#aem, #fkm, #silicone … so the compound table on the homepage and the FKM oil-seal resource article can link straight to a panel. Canonical stays /products.
  - Heading levels. <h2> section, <h3> compound name inside each panel. The full polymer name is a <p>.
  - Consistency gate. These eight ranges must match the homepage table and every category page character for character. FKM currently publishes at three different ranges across the live site; −20 °C to +250 °C is the single source.
  - Compound ranges are governed by one table. The eight values here match the homepage compound table exactly, which is the single source for the whole site. Two carry an open question — FKM at 250 °C is above the 200–210 °C industry continuous rating and reads as a peak, and AEM at 175 °C is an advanced-grade figure. Both are flagged in sheet 01 section 10; settle them there and the change propagates to all eleven category pages.
  - Schema. DefinedTermSet at #compounds with eight DefinedTerm nodes, termCode the polymer abbreviation. Ties to Organization.knowsAbout on the homepage.
  - Internal links. Eight — one per panel to the category or industry page where that compound is the lead material.
  </details>

## 06 Industries we serve [Tune]
> live: LIVE H2 → Engineered for Every Sector · 8 tabs; the homepage and the footer both show 9 industries · “TYPICAL CLIENTS: OEMs & Tier 1 suppliers” is filler on every tab
- **Eyebrow**: `INDUSTRIES WE SERVE`
- **H2**: “Which Line Goes” / “Into Which Industry”  (accent: Into Which Industry)
  _6 words · live is 4 · states the job the section actually does — it is a product-to-sector map, not a capability boast_
- **Intro**:
  > The same eleven lines serve nine sectors. What changes between them is the compound, the tolerance class and the documentation that ships with the part.
  _25 words · live is 17_
- **Tabs ×9**: `Automotive · Mining · Oil & Gas · Pumps & Valves · HVAC ·
Electrical · Medical · Water · Agriculture`
  _Agriculture added — live shows 8, the homepage and footer show 9, and /industries/agriculture exists and is orphaned from this hub_
- **Tab panel — 3 fields** (Sector | Description | Products supplied | Typical clients):
  | Automotive | Insulation bushes, oil filler caps, radiator shroud flaps and footrest mats for passenger and commercial vehicles. APQP and PPAP documentation where the programme requires it. | Bushes, O-Rings, Oil Seals, Pads | Mahindra & Mahindra · Tata · Hyundai · Victor Reinz |
  | Mining | Precision moulded components for abrasive, high-load extraction plant — not wear linings or conveyor rubber. | Anti-Vibration Mounts, O-Rings, Bushes | Shakti Mining Equipments |
  | Oil & Gas | Sealing rated to 250 °C for upstream and downstream service. NORSOK and API qualification is under way and targeted for 2027. | O-Rings, Gaskets, Oil Seals | ⚠ Gulf EPC and equipment suppliers — target sector, no named account yet |
  | Pumps & Valves | Shaft seals, valve seats and moulded diaphragms. Compound chosen against the pumped medium, not a catalogue default. | Oil Seals, Gaskets, Leak Test Rubber | IDEX India |
  | HVAC | Airtight compression under continuous low-amplitude vibration. Foam tape supplied as cut rolls to your width. | Sponge & Foam, Extrusion Profiles, Gaskets | ⚠ Duct and panel fabricators — 800,000 pcs/yr delivered, accounts unnamed |
  | Electrical | Insulator head covers, cable grommets and switchgear bushings. Flame-retardant grades where UL 94 or FMVSS 302 applies. | Grommets, Gaskets, Bushes | Starlite Lighting · Boost Electronics · Rohini Industries |
  | Medical | Biocompatible silicone seals and tubing for diagnostic and laboratory equipment. We do not hold ISO 13485 or FDA registration. | O-Rings, Gaskets, Bellows | Vactech Surgical Equipment |
  | Water | Sealing rings to IS 5382 for water, gas and sewer mains, plus coupling gaskets and tank linings. | Gaskets, O-Rings, Extrusion Profiles | ⚠ Treatment and distribution contractors — target sector, no named account yet |
  | Agriculture | Weather- and UV-resistant parts for farm machinery and irrigation. Built for ozone attack under static strain in sunlight. | Extrusion Profiles, Mounts, Grommets | ⚠ Farm machinery and irrigation OEMs — target sector, no named account yet |
  _Descriptions 17–24 words, matching the live panel length. Five of nine sectors carry real named accounts from the corrected 24-account list — that is five more than the live build, which prints “OEMs & Tier 1 suppliers” on all eight tabs. The four amber rows have no named account and must not invent one: publish the buyer type, or leave the field out of those four panels entirely. Ask Ayaz whether any of the four have an account that simply never reached the profile · Ask Ayaz_
  <details><summary>notes (7)</summary>
  - Nine panels in the DOM, CSS-hidden. Same rule as section 05. These nine passages are the product↔industry crossover content — the highest-value thing on a hub page — and unmounting eight of nine deletes them from the crawl.
  - Nine internal links out, one per panel, to /industries/{slug}. Anchor text is “Rubber components for {sector}”, not “Find {sector} Solutions”.
  - Products-supplied field links too. Each named product in that field links to its category page — roughly 27 additional contextual links, product to industry, which is the internal-linking pattern the whole architecture was designed around and which the live build does not implement anywhere.
  - Slug display map. Tab labels are display names; the live build interpolates raw slugs into prose elsewhere (“Available to hvac buyers”). Never render the slug.
  - Honest negatives stay. ISO 13485 and NORSOK non-claims are load-bearing — they are what makes the rest of the panel credible.
  - Named clients are the strongest field in this section. A sector panel that names Mahindra & Mahindra, IDEX or Starlite Lighting answers “who do they actually supply in my industry?” — a question none of the seven Indian competitors in the teardown answers anywhere on their sites. Trade mark line required beneath the tab set, verbatim: Trade marks shown are the property of their respective owners and appear solely to identify commercial supply relationships. Logo use needs written permission per account; text wordmarks until it lands.
  - Schema. None. Each /industries/* page owns its own node; duplicating them here splits the entity.
  </details>

## 07 Certifications [Rewrite]
> live: LIVE H2 → Certified to Global Standards · five cards: ISO 9001, ISO 14001, IATF 16949, RoHS 2.0, REACH SVHC — all five presented as held, and four are denied by /certifications one click away
- **Eyebrow**: `QUALITY & COMPLIANCE`
- **H2**: “What We Hold,” / “and What We Do Not”  (accent: and What We Do Not)
  _7 words · live is 4 · the honesty is the differentiator; seven of seven Indian competitors in the teardown publish a wall of unverifiable badges_
- **Intro**:
  > One list, with the status of each certification stated on the badge rather than implied. A supplier who names that boundary is one you can plan around. Compound composition declarations are produced per part on request.
  _36 words · live is 18_
- **Cards ×5** (composite):
    | ISO 9001:2015 (Approved) | Quality Management System | Certificate 09111526A, issued by Integral Certification Ltd, valid to 21 February 2027. The certified scope covers moulded rubber components; extension to the extruded and cellular lines is in hand. |
    | IATF 16949:2016 (Upgrade in progress) | Automotive Quality | Our quality management system is being upgraded to IATF 16949:2016, with certification targeted by the end of 2026. Automotive supply today runs against controlled drawing revisions with first-article approval and batch-level traceability. |
    | NORSOK M-710 / API (Qualification in progress) | Oil & Gas Elastomer Qualification | The qualification programme for hydrocarbon service is under way and is targeted for 2027. FKM compounds ship against published temperature and fluid-resistance data in the meantime. |
    | ISO 14001:2015 (In Progress) | Environmental Management | Not currently held. The plant is fully compliant with MIDC environmental and industrial norms, and material utilisation improved 20% after automation. |
    | ISO 45001:2018 (In Progress) | Occupational Health & Safety | Not currently held. Industrial-grade fire extinguishers, smoke detectors and ventilation throughout the plant, under MIDC industrial norms. |
  · The bracket does the work, so it cannot be decorative. (Approved) and (In Progress) sit inside the badge itself, at the same type size and weight as the standard number — never smaller, never a lighter grey, never a tooltip. A badge reading “IATF 16949:2016” with the status set 4px and 40% opacity beneath it makes functionally the same claim the live site makes. Give (In Progress) cards an outline badge against (Approved)’s filled one, so the two states also read apart in a screenshot with no text.
  · RoHS and REACH come off this table entirely. They are declarations, not certifications, and no notified body is involved — putting them in a certification grid is what created the live overclaim. Correct home is one line under the table: Compound composition declarations are produced per part on request. A full REACH SVHC screen across all product families is a roadmap item.
  · IATF 16949 is settled — client-instructed 2026-09-01, upgrade in progress with certification targeted by end 2026, wording identical on all four pages that carry it. NORSOK/API already has a documented position on the live site. ISO 14001 and ISO 45001 are client-instructed, 2026-09-01 — both management systems are being upgraded with certification targeted 2027, and the badge status carries the year. /certifications states only that they are not held, which is not the same as saying they are being pursued — publishing “In Progress” without a booked audit is a new fabrication in a more honest-looking badge. Ask whether either application is live, and drop the row if it is not.
  _CONFIRM — two rows need Ayaz before they ship._
- **Closing link**: `Full certification detail, scope and test standards` → /certifications
  <details><summary>notes (7)</summary>
  - The live section, unchanged, caps the whole page at 60. A single fabricated claim caps a section regardless of everything else, and four claims here are contradicted by another page on the same domain — not merely unsourced, but actively refuted one click away. Putting the status inside the badge lifts the cap, because an accurate statement about a future certification is not a false statement about a present one.
  - Why publish the roadmap at all. A buyer already in conversation, and an assistant asked “is Margo working towards IATF?”, both get a clear answer with a timeframe instead of silence. The bracketed status keeps the two questions separate — what is held today, and what is coming — without ever presenting the second as the first.
  - Why it is worse than a ranking problem. Per the AI-citation audit, an assistant that finds a certification claimed flatly on one page and denied on another resolves the conflict by dropping the source, not by picking one. That is why every status now reads identically on all four pages that carry one. An overclaim risks silent removal from the answer set — strictly worse than having said nothing.
  - Schema. Only the ISO 9001:2015 row goes in hasCredential, and only on the homepage Organization node. No In Progress row is emitted as structured data in any form — there is no schema.org property for “certification we are working towards”, and forcing one into hasCredential, award or knowsAbout makes a machine read it as held. In Progress rows are visible text only.
  - Heading levels. <h2> + five <h3> card titles. The status bracket is part of the badge <p>, not the heading — a heading reading “IATF 16949:2016 (In Progress)” puts the caveat into the document outline, where an extraction pass may drop the parenthetical and keep the claim.
  - Badge images. Do not use ISO or IATF logo marks. Certification body logos are trademark-controlled and their use is licensed by the certificate; a text badge carries the same information with none of the exposure.
  - Procurement reality. A buyer’s first act after reading this section is to ask for the certificate PDF. Ship the scope and number in the copy so the request confirms rather than contradicts.
  </details>

## 08 In-house testing [Tune]
> live: LIVE H2 → Full Validation Before Every Shipment · eight test types listed as in-house · four of them go to a NABL partner lab, not Margo’s own bench
- **Eyebrow**: `TESTING & TRACEABILITY`
- **H2**: “Tested Here, or Tested” / “at an Accredited Lab — Named Either Way”  (accent: at an Accredited Lab — Named Either Way)
  _11 words · live is 5 · the boundary is the claim_
- **Intro**:
  > Every compound batch and every despatch lot is tested before it ships. Instruments sit on a scheduled calibration cycle, which is what makes a result traceable rather than merely recorded. Anything outside our bench goes to a NABL-accredited partner laboratory, on request.
  _42 words · live is 26_
- **Group A — in-house** (Test | Standard):
  | Shore A hardness | ASTM D2240 / ISO 48-4 |
  | Tensile & elongation at break | ASTM D412 / ISO 37 |
  | Compression set | ASTM D395 / ISO 815-1 |
  | Heat ageing, to 200 °C | ASTM D573 / ISO 188 |
  | Cure curve, ODR rheometer | ISO 6502-2 |
  | Specific gravity / filler dispersion | ASTM D297 / ISO 2781 |
  | Dimensional conformity | ISO 3302-1 · M1–M4, E1–E3 |
- **Group B — partner lab** (Test | Standard | Live status):
  | Ozone resistance | ASTM D1149 / ISO 1431-1 |  |
  | Fluid immersion ageing | ASTM D471 / ISO 1817 |  |
  | Low-temperature brittleness & TR-10 | ASTM D2137 / D1329 |  |
  | Abrasion · tear · rebound | ASTM D5963 / D624 / D2632 | — |
  | Flammability | UL 94 / FMVSS 302 | — |
  _CMM dimensional inspection is deleted entirely — inspection is by vernier and micrometer per company profile p12. It appears on the live page in both this section and section 04_
- **CTA**:
  > — does this PDF exist? The live button is wired to nothing. If there is no document, the button comes off; a dead download on a quality page costs more than the missing asset.
  `Download the test capability statement ↓`
  _CONFIRM_
  <details><summary>notes (5)</summary>
  - Two named groups outrank one long list. A buyer scanning for “do they test ozone in-house?” gets a direct answer. An assistant asked the same question gets a passage with a subject, a standard number and a boundary — all three checkable.
  - Markup. Two <table>s with <caption>, not chip <div>s. Test name and standard are a key–value relationship and the table is what makes it extractable.
  - Heading levels. <h2> + two <h3> group headings.
  - Standard numbers are citation bait. Twelve ASTM and ISO designations on one page is a stronger authority signal for this query class than any amount of adjective copy, and no competitor in the Indian SERP publishes them.
  - Gated PDF. If the capability statement ships, serve it from a real URL rather than an email-gated modal, and let it be crawled — a linkable technical PDF earns citations that a gated one never will.
  </details>

## 09 Catalogue download [Tune]
> live: LIVE H2 → Download Our Product Catalogue · offers the “complete 2024 catalogue, nine product families” — the Product Catalogue 2026 exists and ships twelve production lines
- **H2**: “The 2026 Product Catalogue”
  _4 words · live is 4 · year corrected_
- **Body**:
  > Twelve production lines across eleven website categories, with material data, dimensional tables and application notes. One PDF, no login.
  _20 words · live is 25 · “nine product families” corrected to the real count; the 2026 catalogue reconciles to 12 lines and 11 categories, self-adhesive foam tape being a section inside Sponge & Foam rather than a URL of its own_
- **Bullets ×4**:
  - Standard size series per line — AS568, ISO 3601 and metric
  - Compound data sheets for all eight polymer families
  - Profile section index for the extrusion line
  - Application notes by industry
  _200+ standard sizes per product line comes off — multiplied across 11 lines it claims 2,200 sizes, against 200+ catalogue SKUs total. CAD drawing index with part numbers comes off unless the index exists — CONFIRM · CONFIRM_
- **Gate**: `FULL NAME · WORK EMAIL · COMPANY
[ ↓ Download the 2026 Catalogue ]
No spam. Unsubscribe anytime. Your data is protected.`
  _Three fields unchanged_
- **Recommendation**:
  > Consider removing the gate. The catalogue is the single strongest citable asset Margo has, and a gate makes it invisible to every crawler and every assistant. The trade is a handful of email addresses against being the only Indian rubber manufacturer whose full spec catalogue is indexable. If the gate stays, publish an ungated HTML version of the same tables at /products/catalogue and gate only the PDF.
  <details><summary>notes (9)</summary>
  - Standard size series per line — AS568, ISO 3601 and metric
  - Compound data sheets for all eight polymer families
  - Profile section index for the extrusion line
  - Application notes by industry
  - A gated PDF earns nothing. It cannot be crawled, cannot be cited, cannot rank and cannot be lifted into an AI answer. Every technical table inside it is content Margo already owns and is choosing not to publish.
  - If ungated: serve from /downloads/margo-product-catalogue-2026.pdf, link it from this section, the footer and every category page, and add <meta name="robots" content="index, follow"> equivalent via X-Robots-Tag. Set the PDF’s own /Title metadata — it becomes the SERP title.
  - Form. Three <label for> bindings, autocomplete="name | email | organization", type="email". Consent checkbox required under DPDP if the address is used for anything beyond sending the file — and the copy must say which.
  - Schema. Optional DigitalDocument with encodingFormat: "application/pdf" and datePublished. Only worth shipping if the file is ungated.
  - Heading levels. <h2> + <h3> on “Get instant access”. The ▤ glyph used as a decorative icon needs aria-hidden="true".
  </details>

## 10 FAQ [Rewrite]
> live: LIVE H2 → Common Questions · eight questions, good structure · Q1 publishes an MOQ twice in two different numbers, against a standing founder instruction
- **Eyebrow**: `FREQUENTLY ASKED`
- **H2**: “Questions Buyers Ask” / “Before the First Order”  (accent: Before the First Order)
  _6 words · live is 2_
- **Q&A ×8** (Question | Answer):
  | How is a custom rubber part quoted? | Send a drawing, a specification or a physical sample. Margo measures it, identifies the compound family and confirms feasibility, then returns a quotation and feasibility report within 48 hours. Margo produces in bulk against OEM schedules — minimum run from 10,000 pieces per part number, or quoted against the part where size or complexity sets the economics. |
  | Can you manufacture to our drawing? | Yes. Compound, hardness and dimensions are set from your drawing or sample on every one of the eleven product lines. Mould and die tooling is designed and cut in-house from a CAD file, a section drawing or a worn part — no third-party toolroom in the loop. |
  | What if we have no drawing? | Send the physical part. Margo measures it, identifies the compound family and quotes against the sample. A large share of Margo’s work starts as a worn component in an envelope rather than a CAD file, and reverse engineering is a standard route to a first order. |
  | Which rubber material should we specify? | Name the fluid, the operating temperature and the load. Eight compounds are mixed in-house: AEM to 175 °C, FKM to 250 °C, silicone from −60 °C, EPDM for weather and steam, NBR for oil, neoprene, SBR and natural rubber. Margo’s engineers recommend the family at quotation stage. |
  | Do you supply AS568 and metric O-ring series? | Yes. O-rings are supplied to AS568, ISO 3601 and metric series, and to non-standard sections from a drawing. Dimensional conformity is held to ISO 3302-1 classes M1–M4 for moulded parts and E1–E3 for extruded sections; tolerance follows the section. |
  | What is the lead time? | Quotation within 48 hours of an enquiry. Prototype 48 to 72 hours from an approved drawing, fitment samples inside two weeks, and production in three to four weeks standard or two weeks express. Nhava Sheva is 185 km from the plant, about three hours twenty by road. |
  | Do you provide material certificates and test reports? | Yes. Every despatch lot ships with hardness and dimensional release data, and compound batch, cure parameters and inspection results are retrievable per production batch. APQP and PPAP documentation is provided where the programme requires it. Ozone, fluid immersion and flammability testing goes to a NABL-accredited partner laboratory. |
  | What quality system does Margo operate to? | ISO 9001:2015, certificate 09111526A, issued by Integral Certification Ltd and valid to 21 February 2027. The certified scope covers moulded rubber components, with extension to the extruded and cellular lines in hand. Our quality management system is being upgraded to IATF 16949:2016, with certification targeted by the end of 2026. |
  _Answers run 44–52 words. Q1 replaces the live MOQ answer entirely. Q3 and Q4 are new; the live “can you supply globally” question is dropped from this page — /export owns it and answers it far better, and this hub links there instead_
  <details><summary>notes (7)</summary>
  - Question phrasing. Every question is written the way a buyer types it, taken from the fan-out enumeration, not the way a marketer would phrase it. “What if we have no drawing?” is a real search; “Can you manufacture to customer drawings and specifications?” is a brochure sentence.
  - Answer length. 40–60 words is the passage window assistants lift. All eight sit inside it. Each opens with the answer, not with a restatement of the question.
  - Markup. <details>/<summary> or a button-driven accordion with aria-expanded and aria-controls. All eight answers in the DOM regardless of open state — a collapsed answer is still crawlable, an unmounted one is not.
  - Heading levels. <h2> + eight <h3> question headings inside the summary elements.
  - Schema. The FAQPage node in the page-level block carries these eight pairs verbatim. Text in the JSON-LD and text on the page must match exactly — a mismatch is a structured-data violation.
  - MOQ. The live Q1 states “typically 100 pieces” and “generally 500 to 1,000 pieces” in one answer, and the page elsewhere says 500. Standing founder instruction, 2026-08-19: never publish a piece count, never claim to take only big orders, quote by part size. This answer is where it leaks most visibly.
  - Internal links. Six, inside the answers — /products/o-rings, #compounds, /certifications, /export, /contact, /about#plant.
  </details>

## 11 Request a quote [Rewrite]
> live: LIVE H2 → Request a Quote · contact block publishes +91 22 XXXX XXXX and places the company in Mumbai under the wrong legal entity
- **Eyebrow**: `GET STARTED`
- **H2**: “Request a Quotation”
  _3 words · live is 3_
- **Intro**:
  > Share the part and the volume. Our engineering team replies within one business day, and a full quotation with a feasibility report follows inside 48 hours.
  _26 words · live is 20 · the live “within 24 hours with pricing” conflicts with the 48-hour quote commitment used everywhere else_
- **Direct contact**: `PHONE +91 96655 79276 Mon–Sat, 9am–6pm IST
EMAIL info@margorubber.in Reply within one business day
ADDRESS Margo Rubber Products
SRNO. 4494/10, behind Furniture Stop, opposite Samarth Dies, Vilholi, Nashik,
Maharashtra 422010, India`
  _Three corrections: +91 22 XXXX XXXX placeholder → the locked NAP number · Margo Rubber Industries → Margo Rubber Products · MIDC Industrial Area, Mumbai → Nashik · sales@margorubber.in → info@margorubber.in. CONFIRM street address · CONFIRM_
- **Quote promise ×4**:
  - Acknowledgement within one business day
  - Quotation and feasibility report inside 48 hours
  - Compound recommended against your duty cycle
  - Design-for-manufacture review at no cost
  _Four items, as live · No obligation, no spam replaced with a substantive commitment_
- **Form fields ×7**: `FULL NAME COMPANY EMAIL PHONE
PRODUCT OF INTEREST ESTIMATED QUANTITY
TECHNICAL REQUIREMENTS / MESSAGE`
  _Unchanged. Do not shorten the form_
- **Add: file field**: `ATTACH DRAWING / SPEC (OPTIONAL) — PDF, DWG or image, max 10MB`
  _One field added. The homepage RFQ form accepts a drawing and this one does not, while this page’s own FAQ tells buyers to send a drawing. The two forms must accept the same thing_
  <details><summary>notes (11)</summary>
  - Acknowledgement within one business day
  - Quotation and feasibility report inside 48 hours
  - Compound recommended against your duty cycle
  - Design-for-manufacture review at no cost
  - NAP consistency. Phone, email and address must match the homepage Organization node and the footer character for character. This page currently carries a placeholder number, the wrong entity name and the wrong city — three NAP breaks in one block, which is the strongest negative local signal on the site.
  - Email — one address sitewide. info@margorubber.in, here and on every other page. Live, this page publishes sales@margorubber.in, the homepage info@, /contact rfq@margorubber.com on the wrong TLD, and exports@margorubber.in appears elsewhere. Four addresses across a nine-page journey reads as four companies, and splits the NAP signal four ways. Still test the .com mailbox today — if it does not exist, the primary contact page is losing live leads right now.
  - Form semantics. Labels bound with for, autocomplete on all seven, type="email" / type="tel", enctype="multipart/form-data" for the new file field with accept=".pdf,.dwg,.dxf,image/*".
  - Success state. Confirm what happens next — “Received. A quotation follows within 48 hours to {email}.” Neither form on the site has confirmation copy.
  - Schema. ContactPoint lives on the homepage node. Emit nothing here.
  - Heading levels. <h2> + two <h3> (“Direct Contact”, “Our Quote Promise”). Wrap the NAP in <address>.
  - Analytics. Named conversion event on submit. Two RFQ forms on the site, zero events wired.
  </details>

## 12 Footer [Rewrite]
> live: LIVE → 50+ countries, © 2024, and the wrong legal entity · Products column shows 9 of 11 categories · /export appears nowhere
- **Wordmark**: `MARGO
RUBBER PRODUCTS`
- **Description**:
  > ISO 9001:2015 certified manufacturer of precision moulded and extruded rubber components in Nashik, India. Sealing and anti-vibration parts to customer drawing, supplied to OEMs and distributors in 95 countries.
  _29 words · live is 26 · opens with the entity definition, since the footer repeats on all 40 pages_
- **NAP block**: `+91 96655 79276
info@margorubber.in
SRNO. 4494/10, behind Furniture Stop,
opposite Samarth Dies, Vilholi,
Nashik, Maharashtra 422010, India`
  _Client-confirmed 2026-09-01 — this exact string, on all 40 pages, in the PostalAddress node and on the Google Business Profile. The landmarks are part of the address and stay in; B-12, MIDC Ambad is wrong and comes off the site. The company name is not repeated inside the address line — the wordmark above it already carries it_
- **Column 1 — Products**: `SEALING
O-Rings · Oil Seals · Gaskets · Diaphragms · Reciprocating Seals · Leak Test Rubber
MOUNTING & PROTECTION
Anti-Vibration Mounts · Bushes & Bushings · Bonded Components · Bellows · Grommets · Pads, Stoppers & Caps
SHEET & PROFILE
Extrusion Profiles · Sponge & Foam Rubber · Rubber Lining & Skirting`
  _15 entries in three groups, up from 11. Adds Diaphragms, Bonded Components, Rubber Lining & Skirting and Reciprocating Seals (sheets 36–39), plus /products/extrusion and /products/sponge-foam-rubber, which had no sitewide inbound link at all. The column was designed for eleven and fifteen flat is not readable, so it is grouped — Sealing (6), Mounting & protection (6), Sheet & profile (3). The third group is also the commercial split: those three are quoted by length or area rather than by piece count, per sheets 18, 38 and 40. “Seals” is labelled “Reciprocating Seals” so it is not read as a parent of O-Rings and Oil Seals — sheet 39 §02 explains why. Group labels are <p> or <div>, never headings — three more phantom sections is not an improvement on one_
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
  <details><summary>notes (8)</summary>
  - What it fixes on this page: the Products column goes from 9 to 11 entries, adding /products/extrusion and /products/sponge-foam-rubber — the two lines this page markets in section 02 and which currently have no sitewide inbound link at all.
  - Outline damage here is the worst on the site. Three phantom <h2>s from the column labels land in a document outline that already carries eleven real ones.
  - Build once, ships forty times. This is one component. The copy above is written out in full on every sheet in this set so nobody has to open two files to build one block, but it is authored once in the codebase.
  - Heading levels. The column labels (PRODUCTS / INDUSTRIES / COMPANY) are <h2> in the live build. As visible <h2>s they inject three phantom sections into every document outline on the site. Change to <p class="col-label">.
  - Link equity. 26 sitewide links from here. Adding /export, /products/extrusion and /products/sponge-foam-rubber gives three orphaned or under-linked URLs a sitewide inbound link each — the cheapest internal-linking win available on this site.
  - NAP markup. Wrap in <address>. Phone as <a href="tel:+919665579276">, email as <a href="mailto:info@margorubber.in">. The visible string and the href must not diverge.
  - Schema. The footer emits nothing. The Organization node on the homepage is the single entity definition and every other page @id-references it. Repeating an Organization block per page creates 40 competing entities.
  - Copyright year. Render from new Date().getFullYear(), not a literal. It has read 2024 for eight months.
  </details>