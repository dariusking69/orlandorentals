# orlandorentals.com

Landing page that funnels the exact-match domain **orlandorentals.com** into
[meetatrium.com](https://www.meetatrium.com). One static page, no build step,
no dependencies.

**Two audiences, one page; owners first.** The hero has two buttons: renters
go down to the listings (`#homes`), and owners go straight to
[meetatrium.com/free-rental-analysis](https://www.meetatrium.com/free-rental-analysis).
The `#owners` business-development section ("Own a rental? Get a free rental
analysis.") comes right after the hero, on white so it stands out, and its main
button goes to the same free-rental-analysis page. Owner CTAs carry
`utm_campaign=orlando_rentals_owners` so BD leads are separable from renter
traffic in analytics.

**Concept: "Full stop."** The domain is the headline. "We are" leads into
`ORLANDO RENTALS.`, set in Inter 800 and fitted to about half the width on
desktop (most of it on a phone). The red period is the page's brand device: it
lands once when the page opens and then stays put as the full stop of each
section title and of MEET ATRIUM. It no longer travels down the page while you
scroll (Trey, 11/25: the moving dot was distracting). The only other red marks
are the hand-drawn underlines under one key word or fact per section: **free**
in the owner heading and the live door count.

## Live data

The page reads two public feeds client-side.

`https://listings.meetatrium.com/listings.json` (our own listings feed,
CORS-open, refreshed every 30 min) gives:

- the live Greater-Orlando home count in the hero subhead, never hardcoded
- a marquee ticker of real addresses/rents pinned to the hero
- 12 real listing cards (soonest available, max 2 per community, interleaved),
  each linking to its detail page on `listings.meetatrium.com`
- a freshness stamp from the feed's own Last-Modified header
  ("Listings as of h:mm ET")

`https://atriummanagement.ai/meetatrium/doors.json` (the Intranet's live door
counter, the number the master fact sheet uses) gives the exact door count in
the hero and the facts ledger. No count means the line is left out, never an
old number.

If the listings feed fails the page degrades cleanly: count-free copy, ticker
hidden, grid falls back to the SEE-EVERY-HOME CTA.

**Pending: the picks file.** Trey asked (11/25) for about 20 of the nicest
homes, with exterior photos rather than floor plans, pinned first, and for a
map whose zoom narrows the list, like Zillow. That is being built in the
listings widget itself (dariusking69/atrium-listings issue #16), which will
serve one picks file. Until its URL exists, this page keeps its own sample of
12 cards above. When it does, the grid should read the picks file instead of
choosing homes itself.

## Facts

Every fact on the page must agree with the master fact sheet (Notion
3f89a61f32308151996ff713075afb62; Intranet PR #1415 serves it at
`/meetatrium/facts.json`) or with meetatrium.com. The page states no Google
rating or review count: the old "4.6 / 700+" did not match the fact sheet
(about 4.4 across 1,200+), and `facts.json` is not on production yet. Once it
is, the rating can come back read live from it, the way the door count does.
Inc. 5000 and "Best Place to Work nine years running" are as stated on
meetatrium.com.

## Brand

Atrium public brand spec: monochrome (#121212 / #424245 / #E6E6E6 / #F5F5F7 /
#FFF) + red #F13D3D accent only; Inter display + Open Sans body; ALL-CAPS
wide-tracked labels; 4px-radius CTAs. Logos are the real 2025 files in
`assets/` (`Logo_Management-neg.svg` on dark, `Logo_Management.svg` on light),
never redrawn. No emoji; SVG icons only. `prefers-reduced-motion` disables all
motion. `assets/og.png` (the link-preview image) states no numbers, so it
never goes stale.

All outbound links carry
`utm_source=orlandorentals.com&utm_medium=referral&utm_campaign=orlando_rentals_landing`
(or `orlando_rentals_owners` on owner links).

**The P.S.** A one-line "made with AI" note sits under the footer.
`ps-options.html` (not linked, `noindex`) shows it next to a joke version for
Trey to pick from; delete that file once he has.

## Hosting

GitHub Pages (this repo, `main`, root), custom domain via `CNAME`. Preview
before the domain is live: https://dariusking69.github.io/orlandorentals/

DNS at the registrar (GoDaddy, `domaincontrol.com`):

- `A` records for the apex `orlandorentals.com` → GitHub Pages IPs
  (185.199.108.153 / 185.199.109.153 / 185.199.110.153 / 185.199.111.153)
- `CNAME` for `www` → `dariusking69.github.io`

As of 2026-11-25 the apex has only the first A record and `www` points at the
apex. GitHub answers 404 for the domain because the repo doesn't claim it yet.

Order: registrar DNS first, then set the custom domain in the repo (Settings →
Pages → Custom domain `orlandorentals.com`, or commit the `CNAME` file that is
gitignored until then), then tick **Enforce HTTPS** once GitHub has issued the
certificate.

`shot.html` (gitignored) is a local screenshot harness for headless Chrome.
