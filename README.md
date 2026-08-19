# orlandorentals.com

Landing page that funnels the exact-match domain **orlandorentals.com** into
[meetatrium.com](https://www.meetatrium.com). One static page, no build step,
no dependencies.

**Concept: "Full stop."** The domain is the headline — `ORLANDO RENTALS.` set
as a fit-to-width Inter 800 monument, and the red period is the page's single
brand device: it types itself in on arrival, then detaches and travels down the
page as you scroll, docking as the decimal point in the 4.6 Google rating, the
full stop of each section title, and finally the period in MEET ATRIUM.

## Live data

The page fetches `https://listings.meetatrium.com/listings.json` client-side
(the feed behind our own listings widget, CORS-open, refreshed every 30 min)
and renders:

- the live Greater-Orlando home count in the hero subhead — never hardcoded
  (the CTAs stay count-free: they lead to the full portfolio, not an
  Orlando-only list)
- a marquee ticker of real addresses/rents pinned to the hero
- 12 real listing cards (soonest available, max 2 per community, interleaved),
  each linking to its detail page on `listings.meetatrium.com`
- a freshness stamp from the feed's own Last-Modified header
  ("Listings as of h:mm ET")

If the fetch fails the page degrades cleanly: countless copy, ticker hidden,
grid falls back to the SEE-EVERY-HOME CTA.

## Brand

Atrium public brand spec: monochrome (#121212 / #424245 / #E6E6E6 / #F5F5F7 /
#FFF) + red #F13D3D accent only; Inter display + Open Sans body; ALL-CAPS
wide-tracked labels; 4px-radius CTAs. Logos are the real 2025 files in
`assets/` (`Logo_Management-neg.svg` on dark, `Logo_Management.svg` on light) —
never redrawn. No emoji; SVG icons only. `prefers-reduced-motion` disables all
motion.

All outbound links carry
`utm_source=orlandorentals.com&utm_medium=referral&utm_campaign=orlando_rentals_landing`.

## Hosting

GitHub Pages (this repo), custom domain via `CNAME`. DNS at the registrar:

- `A` records for the apex `orlandorentals.com` → GitHub Pages IPs
  (185.199.108.153 / 109.153 / 110.153 / 111.153)
- `CNAME` for `www` → `dariusking69.github.io`

`shot.html` (gitignored) is a local screenshot harness for headless Chrome.
