# Editing margorubber.in — the guide for whoever runs it

The site has two back rooms. The **Studio** (`/studio`) is where every word
and photograph on the site lives. The **desk** (`/margo-desk`) is where every
enquiry the site receives arrives. This guide is for the person at Margo who
will open both; it assumes no technical background.

Sign in to the Studio with the Google or email account 3rd Shade added to
the Sanity project. Sign in to the desk with the desk password (kept by the
manager; changed in Vercel, not in the Studio).

## What is where in the Studio

The left-hand menu:

| Menu | What it holds |
| --- | --- |
| **Product categories** | The fifteen category pages (O-Rings, Oil Seals, Gaskets … Rubber Lining & Skirting). Each has its hero, its parts grid, its material cards, its questions. |
| **Industries** | The eleven industry pages (Automotive … Transport). |
| **Parts** | The 29 part pages — one per part in the catalogue, grouped by category. |
| **Guides** | The seven technical guides on /resources and the sponge & foam datasheet. |
| **Pages** | Home, About, Export, Certifications, Case Studies, Contact, the Products and Industries hub pages, Resources & Guides, the legal pages, the footer. |
| **Site settings** | The facts that appear on many pages at once: the address and phone, the certification record, the compound table, the customer list, the guide reviewer. Change a figure here and every page that prints it changes. |
| **Photographs** | Every picture on the site, listed by page. |

Every document has a **Publish** button (top right). Nothing you type is on
the site until you publish; you can save a draft and come back.

## Everyday tasks

**Change a phone number, the address, or the hours** → Site settings →
*Company & contact*. The footer, the contact page's address card, the
homepage strip and the structured data all read from here.

One exception, by design: the "Ways to reach us" cards on the Contact page
(WhatsApp · Phone · Email) carry their own number and their own note — the
Phone card's note is the hours as the Contact sheet wrote them. Those cards
are edited on the Contact page itself (Pages → Contact → *Ways to reach
us*), so changing the hours in Site settings updates the address card and
the footer but not that card. Change both, or the page contradicts itself.

**Update the certificate** (new expiry, new certificate number, a standard
gained) → Site settings → *Certifications*. The *Certification record* rows
are what the certifications page, the industry pages and every part page
print. A row's *Standing* is either held or in progress — never mark
something held that is not: the site is written not to overclaim, and
several checks refuse the site if it does.

**Change a compound's temperature range** → Site settings → *Compound
table*. This is the one source for every "−40 to +160 °C" on the site — the
homepage table, the material cards, the compound selectors on the part
pages, the guides. Change it once.

**Replace a photograph** → Photographs → find the page → the slot → *Override*
→ upload. Each slot is one placement, so replacing the Bushes hero changes
only the Bushes hero. Write the *alt text* as what the photograph shows
("Compression-moulded AEM bushes on the inspection bench, Nashik"), not a
keyword list. Pictures marked *Stand-in* are borrowed from another page
until the real one is uploaded.

**Answer a question in a FAQ block** → the page → its *Questions & answers* list.
Some questions were named by the content sheets without an answer; a
question with no answer is not shown. Write 40–60 words: long enough to be
quoted, short enough to be read.

**Edit a part's specification** → Parts → the part → *Specifications*.
Rows that say "On request" or "To your drawing" are honest placeholders;
replace them with the figure when the works confirms it, and leave them
otherwise.

**Add a guide** → Guides → *+* → fill the title, the standfirst, the body,
the questions. Leave *Publication status* on Draft until it has been
reviewed at the works; a Draft is visible at its address but hidden from
search engines. Then set it to Published.

**Take a page out of search** → set its *Publication status* to Draft. The
page stays reachable by its address but leaves the sitemap and search
results; set it back when it is ready. (Deleting a document is not the way;
ask 3rd Shade.)

## Things that are deliberate

- **"Not held" rows, "no such approval" sentences, "we do not"** lines are
  on purpose. The site is written to say plainly what Margo holds and what
  it does not — an ISO 9001 certificate, no IATF yet, no product approvals.
  Editing one of these into a claim will be refused by the checks and would
  expose Margo to an audit it cannot pass. If something has genuinely been
  gained, change the record in Site settings; the pages follow.
- **`**bold**` and `[words](/some-page)`** inside a text field are how a
  field carries emphasis and a link. Leave the stars and brackets; the site
  turns them into bold and links.
- **A field marked "Do not change"** or "Identifier" is read by the code.
  Changing it can break the page. Leave it.
- **Publication status** decides whether a page is in Google. Before launch
  only Published pages are; on launch day 3rd Shade turns one switch in the
  hosting settings (see CUTOVER.md §5) and from then on every page except a
  Draft is. So after launch the status means one thing: Draft hides a page
  from search, anything else shows it.

## The desk

`/margo-desk` lists every enquiry the website has received, newest first.
Click a name to read it in full. Each enquiry has a **status** — New,
Contacted, Quoted, Won, Lost — set it as you work; the counts at the top
are your queue. *Export CSV* downloads the whole list.

An enquiry that came with a drawing shows an **Attached file** panel with
a *Download* button. The link works for one hour from opening the page;
reload the page for a fresh one. Files are stored privately in Margo's
Cloudinary account — nobody without the desk login can reach them.

The desk is the only place enquiries arrive until the notification email is
switched on (it needs Margo's email domain set up first). **Until then,
open the desk every working day.**

## When to call 3rd Shade

- A page shows something that is not in the Studio (a heading in the
  wrong place, a broken picture, a form that will not send).
- You need a new kind of page, section or field.
- You want to change the desk password (it lives in Vercel, not the Studio).
- Anything in `scripts/sheets/OPEN-ITEMS.md` you have an answer for —
  send the item number and the answer.
