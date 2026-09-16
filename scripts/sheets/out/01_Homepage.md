# 01_Homepage.html — Homepage Content Sheet

**<title>** Rubber Components Manufacturer & Exporter India | Margo
**description** ISO 9001:2015 certified rubber component manufacturer in Nashik, India. O-rings, oil seals, gaskets and bellows moulded to your drawing. Quotation in 48 hours.

## 01 Hero [Rewrite]
> live: LIVE H1 → Where Rubber Meets Innovation · eyebrow says 1997, subhead says 27+ countries — both fabricated
- **Eyebrow**: `SINCE 2005 · NASHIK, INDIA · ISO 9001:2015 CERTIFIED`
  _IATF 16949 removed from the eyebrow — not yet held, and the eyebrow is the one element a procurement auditor reads first. The upgrade position is stated on the four pages that carry the certification grids_
- **H1 — 3 lines**: “Precision Rubber Components” / “Manufactured in India,” / “Shipped to 95 Countries.”  (accent: Manufactured in India,)
  _8 words · live H1 is 4 · line 2 in accent teal, matching the current treatment_
- **Subhead**:
  > Margo Rubber Products is an ISO 9001:2015 certified rubber component manufacturer in Nashik, India, moulding and extruding O-rings, oil seals, gaskets and bellows to customer drawing in eight compounds. Five million components a month, FOB Nhava Sheva. Quotation in 48 hours.
  _44 words · live subhead is 22 · the four product nouns are inline links, not extra UI_
- **CTA primary**: `Request Engineering Quote →`
- **CTA secondary**: `▶ Explore Products`
- **Industry chips**: `Automotive → /industries/automotive
Medical → /industries/medical-devices
Electrical → /industries/electrical-electronics
Pumping → /industries/pumps-valves
Mechanical → /industries/mining`
  _Same five labels · now links, not decoration_
- **Stat cards ×4** (Value | Label | Replaces):
  | 95 | Countries Served |  |
  | 200+ | Catalogue SKUs |  |
  | 5M | Components Per Month |  |
  | ISO 9001:2015 | Certified Quality | ISO 9001:2015 / Certified Quality — unchanged |
  <details><summary>notes (8)</summary>
  - Heading. This is the page’s only <h1>. Three <span class="block"> children, not concatenated text nodes.
  - Keyword. Head term rubber components manufacturer India split across H1 (“Precision Rubber Components” + “Manufactured in India”) and resolved literally in the subhead’s first clause. Density in the first 100 words: 2.1%.
  - Entity definition. Subhead opens [Entity] is a [category] in [location] that [does X] — the copula is what makes this liftable by an assistant. Never open with “We”.
  - Internal links. Four in-subhead product links + five industry chips = 9 descriptive outbound links from the hero. No “click here”.
  - LCP image. fetchpriority="high" loading="eager" decoding="async" on the hero background only; every other image on the page loading="lazy". Preload with imagesrcset.
  - Alt text. alt="Margo Rubber Products precision rubber component manufacturing plant in Nashik, India". The circuit overlay gets alt="".
  - Schema. No section-level block. The hero image registers as ImageObject @id=#hero-image, referenced by WebPage.primaryImageOfPage.
  - Certification claim. ISO 9001:2015 only, in the eyebrow and in the fourth stat card. IATF 16949 is not yet held and is deliberately not stated here — the live build claims it outright on /why-margo and /products while /certifications denies it one click away, which is indefensible in front of a procurement auditor and, per the AI-citation audit, risks silent removal from an answer set.
  </details>

## 02 Client strip [Rewrite]
> live: LIVE → 11 names, none of which appear in Margo’s own collateral · Kirloskar, Bosch, Atlas Copco, Grundfos, Thermax, Forbes, KSB, Alfa Laval, Sulzer, Bonfiglioli, L&T
- **Eyebrow**: `TWENTY-FOUR NAMED ACCOUNTS ACROSS SEVEN SECTORS`
  _6 words · live is 7_
- **Names ×24** (Band | Accounts | #):
  | Automotive & auto components | Mahindra & Mahindra · Tata · Hyundai · Victor Reinz · Neo Wheels · Ukay Metal Industries · Satish Injecto-Plast · Abhijeet Plastics (India) · Abhijeet Techno-Plast · Mutual Industries | 10 |
  | Industrial machinery & heavy engineering | IDEX India · Shakti Mining Equipments · Amalgamated Industrial Composites | 3 |
  | Electrical & electronics | Starlite Lighting · Boost Electronics · Rohini Industries | 3 |
  | Tooling, fabrication & job shops | Talco India · Almaas Moulding Works · Press Tool Engineering Works · Suvidh Engineering Industries · Samartha Dies | 5 |
  | Specialist vehicles | Minerva Special Purpose Vehicle (MSPV) | 1 |
  | Medical equipment | Vactech Surgical Equipment | 1 |
  | Chemicals & process | Shivi Chemical Technologies | 1 |
  _The complete corrected list, company profile p28 · 10+3+3+5+1+1+1 = 24 · “Federal-Mogul Sealings India” is not on it — the 25-name version shipped in Phase 2 carried that fabricated entry, and Federal-Mogul owns the Victor Reinz brand already listed_
- **Strip build**:
  > 24 names will not sit on one 1440px row. Build as a continuous marquee, single row, paused on hover and on prefers-reduced-motion, sector order as above so Automotive leads. Alternative if motion is unwanted: two static rows of 12 at a smaller type size — the band has 139px of height and can take 200px without disturbing the sections either side.
- **Permission note**:
  > — logo use needs written permission per account. Until it lands, run this strip as text wordmarks, not logos. Mahindra & Mahindra and IDEX are the two independently corroborated names; the other 22 come from Margo’s own profile p28 and are safe to name but not to badge. Footer line, verbatim from the profile: Trade marks shown are the property of their respective owners and appear solely to identify commercial supply relationships.
  _CONFIRM_
  <details><summary>notes (5)</summary>
  - Heading. Eyebrow stays a <p>. Do not promote it to <h2> — it carries no query.
  - Markup. <ul> of <li>, each with itemprop omitted. Do not emit these as schema.org Organization.customer — unverifiable relationships in structured data are an answer-set-exclusion risk.
  - Logos. When permission clears: SVG, loading="lazy", alt="{Company} — Margo Rubber Products customer", and a visible <small> line — Trade marks shown are the property of their respective owners and appear solely to identify commercial supply relationships.
  - AEO. Named, checkable customers are the strongest citation signal on the page. Generic logo walls are ignored; a named account list is quotable. At 24 names across seven sectors this becomes the page’s answer to “who does Margo actually supply?” — a question no competitor in the Indian SERP answers with names.
  - Marquee crawlability. All 24 names must be real text in the DOM at first paint, not injected by script and not duplicated for the scroll loop. If the animation needs a cloned track, mark the clone aria-hidden="true" and keep it out of the text layer — a doubled list reads to an extraction pass as 48 customers.
  </details>

## 03 Our story [Rewrite]
> live: LIVE H2 → Two Decades of Engineering Precision · body claims founded 1997 at MIDC Ambad; verified year is 2005
- **Eyebrow**: `OUR STORY`
- **H2 — 2 lines**: “Rubber Component Manufacturing” / “in Nashik Since 2005”  (accent: in Nashik Since 2005)
  _6 words · live is 4 · carries head term + geo + founding year_
- **Badge overline**: `EST. 2005 · NASHIK, INDIA`
- **Badge title**: `ISO 9001:2015`
- **Badge caption**:
  > Certificate 09111526A, issued by Integral Certification Ltd, valid to 21 February 2027. Scope covers the manufacture of moulded rubber components; extension to the extruded and cellular lines is in hand.
  _30 words · live is 8 · names the issuing body, which the live site leaves blank_
- **Paragraph 1**:
  > Margo Rubber Products has manufactured precision rubber components in Nashik, Maharashtra since 2005. The works moved from a 6,000 sq ft plant running 200,000 parts a month to a purpose-built 10,000+ sq ft facility built around one linear flow — raw material in at one end, finished goods out at the other.
  _50 words · live is 44_
- **Paragraph 2**:
  > Compound formulation, mould tooling, moulding, finishing and testing all happen under that roof. When a part fails a fitment check there is no three-way argument between a compounder, a toolroom and a moulder — there is one team and one corrective action.
  _42 words · live is 29_
- **Stat cards ×4** (Value | Label | Replaces):
  | 2005 | Year Established |  |
  | 17.9M | Components Delivered Per Year |  |
  | 10+ yrs | Average Client Relationship |  |
  | 95% | Repeat Order Rate |  |
  _Shares no figure with the hero. 17.9M = the four sector volumes on company profile p29 summed: 13M automotive + 2.7M industrial + 1.4M electrical + 0.8M HVAC. It cross-checks twice — 17.9M ÷ 12 = 1.49M a month against the stated 1.5M current output, and 17.9M against 60M installed = 29.8% utilisation against the stated ~30%. Three independent figures reconcile, which is why this number can go in front of a buyer. Year, relationship length and repeat rate from p27_
- **CTA**: `Explore Our Capabilities` → /about
  <details><summary>notes (8)</summary>
  - Heading. First <h2> on the page. Two <span class="block"> children.
  - Answer block. Paragraph 1’s first sentence is the 40–60 word extractable answer to “who manufactures precision rubber components in Nashik, India?” — entity named, category stated, location stated, date stated, all in one sentence.
  - Internal links. Three: /about (CTA), /certifications (from the ISO badge), /products (from “moulded rubber components”).
  - Schema. No new node. Every figure here must match the Organization node — foundingDate 2005, addressLocality Nashik. A mismatch between prose and schema is worse than omitting the schema.
  - Image. Certificate thumbnail: alt="ISO 9001:2015 certificate 09111526A issued to Margo Rubber Products by Integral Certification Ltd", loading="lazy". The certificate itself still carries the old B-12 MIDC Ambad address — do not publish the scan until that is reconciled with the site NAP.
  - GEO. “Nashik, Maharashtra” appears in prose here, not only in decorative eyebrow markup — that is the check the live build fails.
  - Delivered volume beats account count. “24 named accounts” is true and reads small; 17.9M components a year is the same fact expressed as capability, and it is the figure a procurement buyer sizing a supplier actually needs. Keep the 24 names in section 02 where they are evidence, not a headline.
  - Stat de-duplication. No figure repeats between the hero, this section and section 11. A number shown three times on one page reads as padding to a buyer and adds nothing extractable for an assistant — the live build repeats 27+ and 150+ in all three places.
  </details>

## 04 Competitive edge [Rewrite]
> live: LIVE H2 → Why Global OEMs Choose Margo · six cards; four contain unsourced claims (27+ countries, 25+ years, REACH/RoHS, named clients)
- **Eyebrow**: `COMPETITIVE EDGE`
- **H2 — 2 lines**: “Why Global OEMs Choose” / “Margo Rubber Products”  (accent: Margo Rubber Products)
  _6 words · live is 5 · names the entity in the heading_
- **Cards ×6** (Title | Body):
  | Certified to ISO 9001:2015 | Certificate 09111526A, audited annually. Batch traceability on compound, cure parameters and inspection results, retrievable per production batch. |
  | Compound formulated in-house | Eight polymer families mixed here, not bought in. If the part sits in hot oil we build for hot oil; the formulation is the engineering. |
  | Quotation in 48 hours | Quote and feasibility report inside two days. Prototype 48 to 72 hours from an approved drawing, fitment samples inside two weeks. |
  | Tooling designed and cut here | Mould and die development from a CAD file, a section drawing or a worn physical sample. No third-party toolroom in the loop. |
  | Five million components a month | Installed press and line capacity. Current output is 1.5 million, so a volume ramp gets press time rather than a queue position. |
  | Export documentation as standard | Certificate of Origin, ISPM-15 heat-treated pallets, APQP and PPAP packs where the programme requires them. FOB Nhava Sheva or CIF to your port. |
  _Card bodies 20–24 words each · live cards run 17–20 · grid holds_
  <details><summary>notes (6)</summary>
  - Heading levels. Section <h2>; each card title <h3>. No skipped levels. Card titles are real headings here because each answers a distinct buyer sub-query.
  - Answer blocks. Cards 3 and 5 are the two most citable passages on the page — “how fast does an Indian rubber manufacturer quote?” and “what monthly volume can they take?”. Both carry a number and a unit in the first clause.
  - Removed claims. REACH / RoHS compliance, 25+ years track record, 27+ countries, trusted by Bosch, Kirloskar, Atlas Copco — all four are unsourced and each one alone caps the section at 60.
  - Internal links. Card 1 → /certifications, card 2 → /products#materials, card 3 → /contact, card 6 → /export. Anchor text is the card title, not “learn more”.
  - Icons. Decorative — alt="" and aria-hidden="true". Do not give them descriptive alt text; it pollutes the text layer an LLM reads.
  - Schema. Optional ItemList of six ListItem nodes, isPartOf the #webpage node. Low value — skip if it adds build weight.
  </details>

## 05 Product portfolio [Tune]
> live: LIVE H2 → Engineered for Every Application · 11 cards, correct count · Gaskets tagged SPIRAL / KAMMPROFILE, which are metallic gasket types Margo does not make
- **Eyebrow**: `OUR PORTFOLIO`
- **H2 — 2 lines**: “Rubber Components” / “Engineered for Every Application”  (accent: Engineered for Every Application)
  _6 words · live is 4 · adds the head noun the live H2 is missing_
- **Section link**: `Full Product Catalogue ↗ /products`
- **Cards ×11** (Card title | Tag line | URL):
  | O-Rings | AS568 / ISO 3601 / METRIC | /products/o-rings |
  | Oil Seals | ROTARY SHAFT / LIP / FKM | /products/oil-seals |
  | Gaskets | FLAT / PROFILE / FOAM | /products/gaskets |
  | Bellows | EXPANSION / PROTECTIVE / BOOT | /products/bellows |
  | Anti-Vibration Mounts | BOBBIN / BUFFER / SANDWICH | /products/anti-vibration-mounts |
  | Grommets | OPEN / CLOSED / BLIND | /products/grommets |
  | Bushes & Bushings | SUSPENSION / CENTRE / FLANGED | /products/bushes |
  | Pads, Stoppers & Caps | BUMPER / DUST / PROTECTIVE | /products/pads-stoppers-caps |
  | Leak Test Rubber | PLUG / BLADDER / DIAPHRAGM | /products/leak-test-rubber |
  | Extrusion Profiles | D-SECTION / U-CHANNEL / CORD | /products/extrusion |
  | Sponge & Foam Rubber | CLOSED CELL / OPEN CELL / TAPE | /products/sponge-foam-rubber |
  <details><summary>notes (7)</summary>
  - Heading levels. Section <h2>; each card title <h3> wrapped in the <a>. Tag lines are <p>.
  - Internal links. The single densest link block on the site — 11 category URLs with exact-match anchor text. Every one of the 11 head terms in the keyword map is reachable in one click from here.
  - Slug fix. Card 10 points at /products/extrusion-profiles, not the live /products/extrusion. 301 the old slug — or correct the card, which is cheaper.
  - Images. Eleven card backgrounds, all loading="lazy", AVIF with WebP fallback, explicit aspect-ratio. Alt pattern: alt="{Product} manufactured by Margo Rubber Products, Nashik" — never the bare product name.
  - Schema. This section carries the page’s OfferCatalog:
  - Do not add Offer.price or availability. Margo quotes per part; a fabricated price field is a Merchant-listing violation and an answer-set risk.
  - ISO scope trap. Certificate 09111526A covers moulded rubber components only. Cards 10 and 11 — Extrusion Profiles and Sponge & Foam Rubber — and their category pages must not carry an ISO 9001 product claim until the scope extension lands.
  </details>

## 06 Sectors we serve [Tune]
> live: LIVE H2 → Cross-Industry Expertise · nine cards, correct count · descriptions are generic category text, not parts Margo actually supplies
- **Eyebrow**: `SECTORS WE SERVE`
- **H2 — 2 lines**: “Rubber Components” / “for Nine Industries”  (accent: for Nine Industries)
  _5 words · live is 3_
- **Cards ×9** (Title | Body):
  | Automotive | AEM insulation bushes, oil filler caps, radiator shroud flaps and footrest mats. Supplied to Mahindra & Mahindra for engine and transmission applications. |
  | Mining | Anti-vibration mounts, O-rings and bushes for abrasive, high-load extraction plant. Precision moulded components, not wear linings. |
  | Oil & Gas | FKM seals and gaskets rated to 250 °C for upstream and downstream service. NORSOK and API qualification is under way and targeted for 2027. |
  | Pumps & Valves | Shaft seals, valve seats and moulded diaphragms for fluid-handling OEMs. Compound chosen against the pumped medium, not a catalogue default. |
  | HVAC | EPDM foam strips, closed-cell duct gaskets, self-adhesive foam tape and vibration isolators. Airtight compression under continuous low-amplitude vibration. |
  | Electrical & Electronics | Silicone gaskets, insulator head covers, cable grommets and switchgear bushings. Flame-retardant neoprene where UL 94 or FMVSS 302 applies. |
  | Agriculture | Weather- and UV-resistant EPDM seals, mounts and profiles for farm machinery and irrigation. Built for ozone and static strain in sunlight. |
  | Medical Devices | Biocompatible silicone seals and tubing for diagnostic and laboratory equipment. We do not hold ISO 13485 or FDA registration. |
  | Water & Fluid Management | Sealing rings to IS 5382 for water and sewer mains, tank linings and coupling gaskets for treatment and distribution. |
  _Card bodies 18–23 words · live cards run 12–14 · two-line cards become three lines; check the grid at 1024px_
  <details><summary>notes (6)</summary>
  - Heading levels. <h2> + nine <h3> card titles, each wrapping the link to /industries/{slug}.
  - Slug display map. Fixes the live leakage bug — hvac renders HVAC, water-fluid-management renders Water & Fluid Management, electrical-electronics renders Electrical & Electronics. Never interpolate the raw slug into a sentence.
  - Honest negatives are an AEO asset. The ISO 13485 and NORSOK non-claims are deliberate. An assistant asked “is Margo ISO 13485 certified?” finds a direct answer here rather than an inferred yes — and the page keeps its citation.
  - Uniqueness. All nine bodies are >70% unique against each other and against the nine industry pages. This is the section the live build fails hardest — its nine descriptions differ only by compound name.
  - Internal links. Nine, exact-match anchor text. Combined with section 05 this gives the homepage 20 descriptive links into the two hub clusters.
  - Schema. No node. Industry pages carry their own Service nodes; duplicating them here creates a competing entity.
  </details>

## 07 How we work [Tune]
> live: LIVE H2 → From Brief to Delivery · six steps, structurally sound · no timings anywhere, which is the one thing a buyer is scanning for
- **Eyebrow**: `HOW WE WORK`
- **H2 — 2 lines**: “From Drawing to Delivery” / “in Three to Four Weeks”  (accent: in Three to Four Weeks)
  _8 words · live is 4 · the timeline is the answer buyers search for_
- **Intro**:
  > Send a drawing, a specification or a worn part in an envelope. Quotation comes back in 48 hours, a prototype in 48 to 72 hours from approval, and production in three to four weeks — two on express.
  _40 words · live is 25 · second sentence is the extractable answer block_
- **Steps ×6** (Step | Title | Body):
  | STEP 01 | Engineering brief | Drawing, specification or physical sample in. We measure it, identify the compound family and confirm feasibility. Quote in 48 hours. |
  | STEP 02 | Compound selection | Formulated against the duty cycle, not pulled off a shelf. Hot oil, ozone under static strain and thermal cycling each get a different mix. |
  | STEP 03 | Tooling & prototyping | Mould or die designed and cut in-house. Prototype 48 to 72 hours from an approved drawing; fitment samples inside two weeks. |
  | STEP 04 | Production & in-process QC | Automated presses with closed-loop temperature and pressure control. First-article dimensional check, then in-process inspection through the run. |
  | STEP 05 | Laboratory release | Hardness to ASTM D2240, tensile to D412, compression set to D395, cure curve on the rheometer to ISO 6502-2. Every despatch lot. |
  | STEP 06 | Export & delivery | HDPE bags, labelled cartons, ISPM-15 heat-treated pallets, Certificate of Origin. Nhava Sheva is 185 km and 3 h 20 by road. |
  _Step bodies 19–23 words · live steps run 12–17 · cards are tall enough to absorb it_
  <details><summary>notes (5)</summary>
  - Heading levels. <h2> + six <h3>. The STEP 01 labels are <p class="step-label">, not headings — numbering here is real sequence, so <ol> is the correct wrapper.
  - This is the highest-value AEO section on the page. Four of the buyer questions in the fan-out map resolve here: how is a custom part quoted, how fast is a prototype, what is the lead time, can you reverse-engineer without a drawing. Each answer sits in its own step with a number in it.
  - Schema. This section earns a real node — HowTo is the wrong type for a commercial process; use ItemList with ordered ListItem:
  - Internal links. Step 01 → /contact, step 05 → /certifications, step 06 → /export. Three descriptive links out of the darkest, least-linked band on the page.
  - Contrast. Section ground is #171A1F. Body text must clear 4.5:1 — the live grey on this band measures under it at small sizes.
  </details>

## 08 Our facility [Rewrite]
> live: LIVE H2 → State-of-the-Art Production Plant · body places the plant at MIDC Ambad and elsewhere claims 80,000 sq ft; verified is 10,000+ sq ft at Vilholi
- **Eyebrow**: `OUR FACILITY`
- **H2 — 2 lines**: “Inside the Nashik” / “Manufacturing Plant”  (accent: Manufacturing Plant)
  _4 words · live is 5 · geo in the heading, superlative out_
- **Paragraph**:
  > A 10,000+ sq ft plant in the Nashik industrial belt, built for a single linear workflow: raw material in at one end, finished goods out at the other, with no cross-traffic between clean and flash-generating areas. Automating during the move took installed capacity to five million parts a month. Output today is 1.5 million.
  _52 words · live is 42_
- **Bullets ×6**:
  - Automated moulding presses — closed-loop temperature and pressure control, which takes operator variation out of the cure
  - IoT production monitoring — a slow press shows up the same day, not in the month-end report
  - Digital curing ovens — programmable controllers and a retrievable cure record per batch
  - In-house compound mixing — automated for even filler distribution, batch after batch
  - Testing laboratory — durometer, ODR rheometer, tensile machine, ageing oven, compression set rig, all on a calibration cycle
  - Centralised ERP and MES — planning, tracking and batch traceability across the plant
  _Six bullets, 12–18 words each · live bullets run 5–7 words on one line, so allow two lines per bullet_
- **Stat row — new** (Value | Label):
  | 30% | Less production time per cycle since automation |
  | 20% | Better material utilisation |
  | <1% | Target rejection rate |
  | 25× | Installed capacity against the old works |
  _Optional addition — the section has vertical room and no numbers at all today_
  <details><summary>notes (12)</summary>
  - Automated moulding presses — closed-loop temperature and pressure control, which takes operator variation out of the cure
  - IoT production monitoring — a slow press shows up the same day, not in the month-end report
  - Digital curing ovens — programmable controllers and a retrievable cure record per batch
  - In-house compound mixing — automated for even filler distribution, batch after batch
  - Testing laboratory — durometer, ODR rheometer, tensile machine, ageing oven, compression set rig, all on a calibration cycle
  - Centralised ERP and MES — planning, tracking and batch traceability across the plant
  - Removed claims. 80,000 sq ft, 400+ team members, 3 production facilities, 200+ skilled employees, clean room section, CMM equipment — none are in Margo’s own collateral. Dimensional inspection is by vernier and micrometer, not CMM.
  - Address. Prose must never name MIDC Ambad — the client-confirmed address is SRNO. 4494/10, behind Furniture Stop, opposite Samarth Dies, Vilholi, Nashik 422010. Where prose does not carry the full string, say “the Nashik industrial belt”, which is true either way.
  - Heading levels. <h2> only. Bullets are <li>; the bolded lead-ins are <strong>, not <h3>.
  - Images. Plant photography, loading="lazy". Alt pattern: alt="Automated compression moulding press at the Margo Rubber Products plant, Nashik". One geo-bearing alt per image, not the same string repeated.
  - Schema. Add Place and link it, rather than a second address block:
  - GEO. Coordinates are confirmed and unused — the live build emits neither them nor a Google Business Profile at the same NAP. Together they are the cheapest local-signal upgrade available.
  </details>

## 09 Export markets [Rewrite]
> live: LIVE H2 → Four active lanes. · asserts four live export lanes on the buyer-facing build, where the true count is zero. On the vision build the claim is the point
- **Eyebrow**: `EXPORT MARKETS`
- **H2 — 2 lines**: “95 markets screened.” / “Eighteen playbooks. Five live lanes.”  (accent: Eighteen playbooks. Five live lanes.)
  _8 words · live is 3 · the three-tier structure is what makes the number defensible instead of decorative_
- **Standfirst — new**:
  > Margo Rubber Products ships precision rubber components from Nashik, India to 95 countries, FOB Nhava Sheva or CIF to your port. Every market carries a country-level sourcing playbook — duty treatment, certificate requirements, transit time and port.
  _36 words · the section has no standfirst today; this is where the entity definition goes_
- **Lane cards ×4** (Code | Market | Second line):
  | AU | Australia | Mining & industrial · Melbourne 18–22 days |
  | GB | United Kingdom | General industrial · Felixstowe 22–28 days |
  | AE | United Arab Emirates | Oil & gas · Jebel Ali 5–8 days |
  | MY | Malaysia | Palm oil & manufacturing · Port Klang 10–14 days |
  _Four cards, two lines each — identical to the live layout · markets follow the Top-5 activation order; Saudi Arabia is the fifth and moves to the map pins_
- **Map pins**: `NASHIK, IN (origin) · AUSTRALIA · UNITED KINGDOM ·
UNITED ARAB EMIRATES · SAUDI ARABIA · MALAYSIA`
  _Five destination pins, up from four · arcs unchanged_
- **Footnote**:
  > Incoterms FOB Nhava Sheva as standard; CIF, EXW and DAP by agreement at quotation stage. ISPM-15 heat-treated pallets on every consignment. See all 95 markets and their trade lanes →
  _30 words · live is 19 · footnote gains the section’s only outbound link_
  <details><summary>notes (7)</summary>
  - This section fixes the site’s worst structural defect. /export currently has zero inbound links from any header, footer or body on any page — the strongest page on a site named margo-rubber-export is reachable only by typing the URL. This footnote link is its first.
  - Anchor targets. Live /export jump links emit as /#australia instead of /export#australia, so every market link lands on the homepage. Cards here must link /export#australia, /export#uk, /export#uae-saudi, /export#malaysia — root-relative anchors are the bug, fix at source.
  - Heading levels. <h2> + four <h3> market names. Country codes are <span aria-hidden="true">; the accessible name is the full country.
  - Map. Inline SVG, not an image — the country labels must be in the text layer for a crawler and an LLM to read. <title> and <desc> on the <svg>, role="img".
  - GEO. Ports and transit days are the strongest generative-engine signal on the page — they are checkable, specific, and no Indian competitor publishes them. Keep the number ranges; drop them and this section scores 60.
  - Schema. areaServed on the Organization contactPoint carries the country list. Do not create a second geo node here.
  - Vision-build guard. On the buyer-facing build this H2 becomes “Where we are opening lanes first” and every card reads as a target market, not an active one.
  </details>

## 10 Material engineering [Keep & correct]
> live: LIVE H2 → Eight compounds. Published ranges, not sales copy. · best-written section on the page · one defect: the footnote claims ±0.01 mm tolerance, which is not achievable in moulded rubber
- **Eyebrow**: `MATERIAL ENGINEERING`
- **H2**: “Eight compounds, mixed in-house.” / “Published ranges, not sales copy.”  (accent: Published ranges, not sales copy.)
  _8 words · live is 7 · “mixed in-house” is the differentiator and it is missing_
- **Intro**:
  > Temperature service range per compound — the same table our engineers use for material selection, not a marketing simplification. Name the fluid, the temperature and the duty cycle and we will tell you which of the eight to specify.
  _40 words · live is 24_
- **Compound rows ×8** (Compound | Descriptor | Range):
  | AEM | Signature compound, supplied to Mahindra & Mahindra | −40° to 175°C
continuous to 160°C |
  | FKM | Aggressive chemical and hydrocarbon environments | −20° to 250°C
continuous to 200°C |
  | Silicone | Widest service range; biocompatible grades available | −60° to 220°C |
  | EPDM | Weather, ozone and steam resistant | −40° to 140°C |
  | NBR | Oil and fuel resistant | −30° to 120°C |
  | Neoprene | General purpose; flame-retardant grades | −40° to 120°C |
  | SBR | Abrasion resistant | −30° to 100°C |
  | Natural Rubber | High resilience, damping | −20° to 90°C |
  _Ranges unchanged from live · only the AEM, silicone and neoprene descriptors gain a clause_
- **Footnote — corrected**:
  > Shore A hardness to ASTM D2240 · tensile to D412 · compression set to D395 · ageing to D573 · cure curve to ISO 6502-2. Dimensional conformity to ISO 3302-1, classes M1–M4 moulded and E1–E3 extruded — tolerance follows the section.
  _Replaces Tolerances held to ±0.01mm — ±0.01 mm is the resolution of the inspection instrument, not a part tolerance. Physically unachievable in moulded rubber and an instant credibility loss with any procurement engineer_
- **Single source**:
  > This table is the one source for compound temperature ranges across the whole site. Every category page, the products hub, the industry pages and the export pages must carry these eight values and no others. Where a page disagrees, this table wins.
- **Check result** (Compound | Published here | General industry continuous | Verdict):
  | AEM | −40° to 175°C
continuous to 160°C | −29° to 150°C standard; 165–175°C advanced grades | ⚠ Resolved 2026-09-03 — the table now publishes the continuous figure alongside the peak, so the ten SKU pages that carried a bare 160°C agree with it. Still confirm which AEM grade Margo mixes |
  | FKM | −20° to 250°C
continuous to 200°C | −20° to 200–210°C | ⚠ Resolved 2026-09-03 — the table now publishes the continuous figure alongside the peak, matching the AEM treatment. Chemours rates FKM continuous at 204 °C with peaks to about 260 °C; Viton B and speciality grades reach 250 °C continuous, so confirm the grade if 250 is to stand as continuous |
  | Silicone (VMQ) | −60° to 220°C | −55° to 230°C | Sound, slightly conservative |
  | EPDM | −40° to 140°C | −40° to 150°C | Sound, conservative |
  | NBR | −30° to 120°C | −33° to 120°C | Sound |
  | Neoprene (CR) | −40° to 120°C | −33° to 120°C | Sound |
  | SBR | −30° to 100°C | −28° to 100°C | Sound |
  | Natural Rubber | −20° to 90°C | −50° to 80–90°C | Top sound; low end conservative |
  _Six of eight are sound. Where Margo’s figure is narrower than the general range — EPDM, silicone, natural rubber — that is a supplier being conservative about what it will stand behind, which is the right instinct and should stay_
- **FKM — the one to settle**:
  > Published FKM continuous service is 200 to 210 °C across the industry. The 250 °C figure in Margo’s locked facts is 40 to 50 degrees above that, which is the pattern of a peak or intermittent rating rather than a continuous one. Both numbers can be true of the same compound — they answer different questions.
  > This matters more than the other seven combined. FKM is the compound specified precisely because something runs hot, so it is the one a buyer selects on the top number. An engineer who designs to 250 °C continuous on a compound rated 200 gets a seal that hardens and cracks in service — and the site said 250.
  > is 250 °C a continuous or a peak rating, and is it a specific high-temperature FKM grade Margo mixes? If it is a peak, publish both: “−20 °C to +200 °C continuous, peaks to 250 °C”. That is more useful than either number alone and it is what a datasheet would say.
  _Ask Ayaz two questions:_
- **Add a column**:
  > Label the column Continuous service, not Temperature range. Every figure in this table is a continuous rating, and saying so removes the ambiguity that produced the FKM question in the first place. If peak figures are confirmed for any compound, they get their own column rather than being folded into one range.
  <details><summary>notes (6)</summary>
  - The most citable block on the site. Eight compounds with numeric ranges and named test standards is exactly the passage shape an LLM lifts. No competitor in the Indian SERP publishes it.
  - Markup. A real <table> with <caption> and <th scope="col">, visually styled as bars. Do not build it from <div>s — the tabular relationship is what makes it extractable.
  - Heading levels. <h2> only. Compound names are <th scope="row">, not <h3>.
  - Internal links. AEM → /industries/automotive, FKM → /products/oil-seals#fkm, silicone → /industries/medical-devices, EPDM → /products/sponge-foam-rubber. Four, on the compound names.
  - Consistency gate. FKM is published at three different ranges across the live site. This table is the single source: −20 °C to +250 °C. Propagate to /products/oil-seals, its FKM child and every SKU Engineering Data block.
  - Schema. DefinedTermSet of eight DefinedTerm nodes, inDefinedTermSet pointing at #compounds, each termCode the polymer abbreviation. Ties the compound vocabulary to the Organization’s knowsAbout array.
  </details>

## 11 Contact / RFQ [Rewrite]
> live: LIVE H2 → Request Engineering Consultation · stat row publishes an MOQ against a standing founder instruction; /contact publishes rfq@margorubber.com where every other page uses .in
- **Eyebrow**: `GET IN TOUCH`
- **H2 — 2 lines**: “Request an Engineering” / “Quotation”  (accent: Quotation)
  _4 words · live is 3 · “quotation” is the transactional term buyers search; “consultation” is not_
- **H3**: “Send a drawing, a specification, or a worn part.”
  _8 words · replaces Let’s Engineer Something Remarkable — concrete instruction beats a slogan at the conversion point_
- **Paragraph**:
  > Our engineering team replies within one business day with a compound recommendation, an indicative price and a lead time. A full quotation and feasibility report follows inside 48 hours. No drawing? Send the part — a large share of our work starts as a worn component in an envelope.
  _48 words · live is 29_
- **Stat cards ×4** (Value | Label | Replaces):
  | 48h | Quotation Turnaround |  |
  | 48–72h | Prototype From Approval |  |
  | 2 wks | Fitment Samples |  |
  | 3–4 wks | Production Lead Time |  |
  _Four timings, no repeats from the hero or the Story section. At the conversion point a buyer is asking how fast, not how big — scale figures already did their work 9,000px higher up. The MOQ card comes off every build: standing founder instruction, 2026-08-19, no exceptions — quote against the part, never publish a piece count_
- **Form labels ×8**: `COMPANY * COUNTRY * EMAIL * PHONE
PRODUCT / MATERIAL ANNUAL QUANTITY
TECHNICAL REQUIREMENTS
ATTACH DRAWING / SPEC (OPTIONAL) — PDF, DWG or image, max 10MB`
  _Unchanged. Do not shorten the form_
- **Submit button**: `Request Engineering Quotation →`
- **Footnote**:
  > — rfq@margorubber.com is published on /contact and is the wrong TLD. If that mailbox does not exist, quote requests from the primary contact page are bouncing or vanishing right now. This is the only defect on the site that loses money today.
  _TEST TODAY_
  <details><summary>notes (6)</summary>
  - Heading levels. <h2> then <h3>. Stat values are <p>. On the live /contact, footer column labels are marked up as <h2> — that fragments the outline and must be fixed with this section.
  - Form semantics. Every <label for> bound to its input; autocomplete="organization | country-name | email | tel"; required on the four starred fields; type="email" and type="tel"; enctype="multipart/form-data" on the file field with accept=".pdf,.dwg,.dxf,image/*". Error text names the field and the fix, never “invalid input”.
  - NAP consistency. Phone, email and address here must match the Organization node and the footer character for character. Five values currently circulate: +91 96655 79276 is the locked NAP; +91 92251 38339, +91 253 234 5678, +91 98765 43210 and +91 22 XXXX XXXX all come off.
  - Schema. ContactPoint already lives on the Organization node. Add nothing here. Do not emit ContactPage on the homepage.
  - Conversion mechanics. Success state must confirm what happens next — “Received. A quotation follows within 48 hours to {email}.” The live form gives no confirmation copy.
  - Analytics. Fire a named conversion event on submit, not on page view. The current build has no event wired.
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
  _11 entries, up from 9 — adds Construction (sheet 41) and Transport — Rail & Marine (sheet 42), the first two of the six “additional sectors” on sheet 05 to earn a URL. Automotive still leads, matching real volume. 🛑 The live footer’s four industry links all resolve to the same /industries/ — adding two entries to a column whose links are broken makes eleven broken links, so fix the routing in this same commit_
- **🛑 Footer link map — all 26** (Products column label | href | Watch for):
  | SEALING |
  | O-Rings | /products/o-rings |  |
  | Oil Seals | /products/oil-seals |  |
  | Gaskets | /products/gaskets |  |
  | Diaphragms | /products/diaphragms |  |
  | Reciprocating Seals | /products/seals | Label carries the qualifier so it is not read as a parent of O-Rings and Oil Seals — sheet 39 §02 |
  | Leak Test Rubber | /products/leak-test-rubber |  |
  | MOUNTING & PROTECTION |
  | Anti-Vibration Mounts | /products/anti-vibration-mounts |  |
  | Bushes & Bushings | /products/bushes | Not /products/bushes-bushings |
  | Bonded Components | /products/bonded-components |  |
  | Bellows | /products/bellows |  |
  | Grommets | /products/grommets |  |
  | Pads, Stoppers & Caps | /products/pads-stoppers-caps |  |
  | SHEET & PROFILE |
  | Extrusion Profiles | /products/extrusion | 🛑 Not /products/extrusion-profiles — the display name and the slug differ, and the wrong one is the memorable one. Sheet 18 records that the homepage grid and several internal links point at the non-existent path |
  | Sponge & Foam Rubber | /products/sponge-foam-rubber |  |
  | Rubber Lining & Skirting | /products/rubber-lining |  |
  _Fifteen product links and eleven industry links, twenty-six in all. Three group labels in the Products column are not links — they are <p> or <div> headings-in-appearance-only, never <h2>/<h3> and never anchors. Derive the map from phase0-route-handlers/lib/site.ts, which is the single source every canonical, sitemap entry and JSON-LD block already derives from — a second hand-maintained copy of twenty-six URLs is how the four industry links ended up pointing at one page. Three slugs do not match their labels and each is a live trap: Extrusion Profiles → /products/extrusion, Bushes & Bushings → /products/bushes, Transport — Rail & Marine → /industries/transport. Test all twenty-six after the build — the defect this map fixes was four links silently collapsing to one, which renders fine and passes no check that was not looking for it_
- **Column 3 — Company**: `About Us · Certifications · Export Markets · Case Studies ·
Resources · Contact Us`
  _6 entries · Export Markets is new and fixes the orphaned /export page · Why Choose Us comes out — the page is recommended for deletion, its job is done better by /certifications and /export_
- **CTA lines**: `Ready to source precision rubber components?
Quotation from our engineering team within 48 hours.
[ Request Quote → ]`
- **Legal line**: `© 2026 Margo Rubber Products. All rights reserved.
Privacy Policy · Terms & Conditions · Disclaimer
ISO 9001:2015 · Certificate 09111526A · Integral Certification Ltd`
  _Fixes © 2024 and Margo Rubber Industries Pvt. Ltd. — GSTIN 27AAKFM8595Q1Z1 embeds PAN AAKFM8595Q, whose 4th character F denotes a firm, not a company. Pvt. Ltd. is positively excluded_
  <details><summary>notes (6)</summary>
  - Heading levels. Column labels (PRODUCTS / INDUSTRIES / COMPANY) are currently <h2> on every page. Change to <p class="col-label"> or <h2 class="sr-only"> patterns — as visible <h2>s they inject three phantom sections into every document outline on the site.
  - Link equity. 26 sitewide links from here. Adding /export, /products/extrusion and /products/sponge-foam-rubber gives three currently orphaned or under-linked URLs a sitewide inbound link each — the cheapest internal-linking win available.
  - NAP markup. Wrap in <address>. Phone as <a href="tel:+919665579276">, email as <a href="mailto:info@margorubber.in">. The visible string and the href must not diverge.
  - Schema. The footer emits nothing — the Organization node on the homepage is the single entity definition and every other page @id-references it. Repeating an Organization block per page creates 40 competing entities.
  - Legal pages. All three are placeholder text while the site publishes technical specifications with no disclaimer standing behind them. /legal/terms 12/12 sections and /legal/disclaimer 8/8 sections are ship-stoppers, not backlog.
  - Copyright year. Render from new Date().getFullYear(), not a literal. It has read 2024 for eight months.
  </details>