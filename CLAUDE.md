# Prestige Marine — Prestige Imports child site

Miami boat dealer, "A Division of the Prestige Imports Family". Represents Tecnomar for Lamborghini 63,
Midnight Express, VanDutch and Iguana Yachts. Homepage only. Contact on the page: 305-947-1000,
15050 Biscayne Blvd, North Miami Beach FL 33181.
Siblings: `../PRESTIGE_CZINGER`, `../PRESTIGE_PAGANI`, `../PRESTIGE_LAMBORGHNI/PRESTIGE_LAMBO`, `../PRESTIGE_GUNTHER`.
Repo: https://github.com/Sigovs/PRESTIGE-_MARINE (cloned here 27 Oct 2026; started on Alex's Mac).

## ⛔ Before any visual work

1. Load the `design-dna` skill. It resolves `TASTE.md` and routes to the taste skills the task needs.
2. Read [.claude/rules/design-dna.md](.claude/rules/design-dna.md) and obey it. It is a junction to the live master in
   `c:/____WORK/_____GDBURO SIGOFF/design_dna/.claude/rules/` (excluded from git in `.git/info/exclude`).
3. For scroll-led, cinematic or 3D work, load `scroll-site` before any markup.

Figures follow `content-provenance`: sourced and uncontradicted only, never invented.

## Working version: FINALE

`site/index_finale.html` + `site/assets/css/marine_finale.css` + `site/assets/js/marine_finale.js`.
v2's page on the WebGL sea from explore/A: one fixed WebGL sea under the page (the azure loop),
pointer ripples, a wake astern of the yellow Tecnomar while the page moves, ice cards that rise one by one,
the berth-sheet inventory, the surf footer. Lenis is the scroll layer.
Serve it over HTTP (WebGL textures are tainted from file://), e.g. the PRESTIGE root server:
`http://127.0.0.1:8790/PRESTIGE_MARINE/site/index_finale.html`.
Older versions (v1 `site/index.html`, v2, `site/explore/a|b|c`) are history; the versions page is `index.html`.

Not in the repo (gitignored, on the Mac only): `research/` (~600 MB brand media and raw photos) and `_work/`.

## Feedback log
- **27 Oct 2026 · Finale is the working base** (Alex: "finale nash poslednij, budem rabotatj s nim").
  New work refines the finale; v1 (7/10) and v2 (6/10) were the same page (hull cut-out over water with
  facts beside it) and are not to come back.
- **27 Oct 2026 · Finale round 2: the dress from Alex's reference board** (`OPTION FINALE/`, a boats-in-ua
  redesign; Alex: "with our movement only… try it with our elements", and "work on the finale" — edited in
  place, the previous finale is commit 9ba14a7). Deep water (the shader's ramp taken down to the board's teal),
  the hull on the right in its own lane, Playfair Display headline left (display ≥30px only) + Raleway for
  everything read or pressed, tracked capitals, hairline cells in a two-row header, outline CTA, brand row,
  counter on a rail; below, a light catalogue: four brand tiles, four boat cards on one subgrid base with a
  bar drawn to one scale, underlined form fields, an accent-blue footer. Palette from the board: navy #062843,
  accent #557A95 (primary buttons, white type 4.6:1), ink-2 #46677F, mist #E9F6FF; #7395AE never carries text.
  The motion stays ours (sea, ripples, the hull sailing up with its wake, facts rising one by one, Lenis).
  This supersedes the earlier "graphite primary button" rule.
  Alex on round 2 (27 Oct): "nu pochti krasota" (almost beautiful). It is the direction; refine it, don't replace it.
  His fixes the same day, binding: **no water strips between sections** (the catalogue is one continuous page;
  the sea shows in the stage and the footer only); **no dark "pool" shadow under the hero text** (the shader's
  pool is off — white type on the deep water needs none); **the ocean is the footer** — the surf video fills it,
  the footer's words sit on the sand over it, never hidden below a panel. He also agreed with: wider stage at
  1920 with the boat further right, and thin facts cards (deep glass + hairline) instead of white boxes.
  Later the same day: **the water goes back to our azure** (the shader ramp of commit 9ba14a7 — Alex: "like on
  GitHub, we have it"; the board's deep teal is dropped). On the azure, navy is the stage's ink (the median water
  gives navy ~4:1, white less), so the hero's small words are set as large text (19px bold), the header over the
  water is a light glass, and the facts cards are thin light ice with a white hairline. **Footer water raised**:
  a shorter footer (76svh) crops the sand off the clip's top, so the foam and water rise up to the words.
- **27 Oct 2026 · BLUE version** (`site/index_blue.html`, `marine_blue.css/js`), a separate page from Alex's
  four-frame storyboard — the finale stays as is. Deep blue held stage, Archivo; brand pills switch the boat
  before the page moves (one boat at a time: the last sails off the top before the next rises); on scroll the
  promise drifts up blurred, the boat sails up to its stern, its plate + four glass facts arrive, then leave for a
  light grey catalogue. Pills only for brands with a hull seen straight down: Tecnomar (the generated yellow,
  disclosed; the plate says the stock unit is Verde Gea), Midnight Express (me52-hull), VanDutch (vd402-hull, cut
  locally with rembg from the listing's overhead photo, sidecar beside it). Iguana has no overhead photo anywhere
  (prestigemarine.co, iguana-yachts.com), so it has no pill until one exists.
- **BLUE, round 2 (27 Oct): the storyboard is the layout only** — Alex: "I gave it just as a layout, everything else
  should be ours". Rebuilt on the finale's system (WebGL azure sea, Playfair + Raleway, the two-row header, ice
  cards, white panels — no grey, no flat blue). Binding from his notes: the ocean on the stage is **locked** (no
  scroll travel, only its waves, wake and rings); the promise **leaves upward** whole, never blurred behind the
  plate; choosing a boat **never moves a word** (the intro is pinned from the top); the boats are drawn **to one
  scale** (height ∝ length, 63′ = full); the brands panel **slides up over** the held stage.
- **BLUE, round 3 (27 Oct):** hero text centred in the height and locked (the headline keeps its lines of room;
  the line changes per boat: Tecnomar "The boat you deserve starts here." · Midnight "Miami-built, family-owned." ·
  VanDutch "Essential lines, refined power." — all from our own copy); the boats are one width, large, bow just
  above the pills, stern off the bottom, never under the header; on scroll the ocean stays and the boat sails up
  and away. Pills and facts cards are **glass** — the shader bends the sea under each `[data-glass]` (lens + rim),
  CSS adds only a light tint, hairline, inner highlight and radius. Inventory boats sit on white cards with a
  radius and a soft hover shadow. Footer: "Copyright 2026 | Sitemap | Your Privacy Choices" beside the name
  (links pending), and the generated-artwork line removed at Alex's request (the images' alt text still says so).
- **BLUE, round 4 (27 Oct), binding:** no tracked capitals anywhere — labels, buttons, pills, links in sentence
  case at normal spacing (only the logotype's small subline keeps caps). Facts cards on the stage are plain cards
  with a background blur (26px, like Figma) and a small radius — the shader lens look was rejected (1/10:
  "outlined boxes, can't see glass"). Inventory cards: no scale line, no dimensions row; length × beam lives in
  the specs; "Inquire" (American spelling) is a full-width button; the plan→side photo swap is slow (.9s);
  radii small (card 10px, photo 6px).
- **BLUE, round 5 (27 Oct):** navbar = the current prestigemarine.co menu (Home · Brands ▾ · New Inventory · Brokerage ·
  Sold · About Us · Contact Us, their URLs). Small grey brand logos (the brands' own files, `assets/img/logos/`, as
  masks) over the brand rows. Facts cards: title 16 over paragraph 14. Pills are liquid glass drawn by the shader
  (no outline, no white wash, no focus ring after a click). The wake: Kelvin arms only while the boat moves, its
  start hidden and softened under the hull; pointer ripples scaled to the scene. No surf edge on the brands panel
  (rejected). Inventory head: no "Four boats…" lede and no "Prices as listed" line (Alex's request; the price date
  is therefore not on the page — re-add it if the client needs the listing date shown).
- **FINALE, several boats + blue's nav (27 Oct):** the finale's section row and menu are the current prestigemarine.co
  navigation, as on blue (Brands ▾ · New Inventory · Brokerage · Sold · About Us · Contact Us). The brand row on the
  first screen chooses the boat (Tecnomar · Midnight Express · VanDutch — the hulls seen from above; Iguana has none),
  and an ice tab bar above the plate carries the same choice, in sync. The last boat sails off the top before the next
  rises; the headline, plate, facts, link and counter take the new boat's words (blue's BOATS data; Tecnomar keeps
  its Size card, so 05 facts, the others 04).
- **Footer line "Powered by All Auto Network"** at the very bottom (Alex, 27 Oct) — on the finale and on blue.
- **RULE (Alex, 31 Oct, "never!"): in a dropdown the text never touches the field.** Every `select` keeps at least `--s-3` clear on the left and its arrow `--s-3` from the right edge, on every page. Check the computed padding after any form or filter change.
- **RULE, repeated by Alex (27 Oct: "the rule is gone again, why every time the same"): no text ever sits against a
  rule, bar or edge.** Anything under the header keeps at least `--s-8` clear of the header's bottom hairline (the
  menu overlay starts `--s-9` below both header rows); and the menu, the section row and every header-anchored block
  align to the phone cell's text edge (gutter + cell padding + 1px hairline). Check by measuring, at 1440/1024/390.
- **BLUE, round 6 (27 Oct): reverted at Alex's request** — pointer ripples and the boat's wake are the finale's own
  again (verbatim), and the pills are plain (light tint + white hairline; no shader glass, no focus ring on click).
- **BLUE, round 7 (27 Oct):** logo = prestigemarine.co's own script mark (`assets/img/logos/prestige-marine.png`, as a
  mask so it takes the bar's ink), larger, no "A Division…" subline; no header backing over the hero; no Home in the
  nav; no links to the brands' websites on the brand rows (only in-page films); stage actions = primary solid white +
  secondary white-outline ghost (phone with icon / Inquire); footer columns: heading 18 navy over 16 links.
- **BLUE wake (27 Oct): no diagonal side lines at all** — only the bright centre trail astern of the boat.
- **BLUE, plate (30 Oct), binding:** the plate is one fixed size on all three boats (`holdPlate()` measures each boat's
  words and holds the largest; nothing moves on a switch). Cards are real frosted glass with no outline: never put
  `will-change: opacity` on `.bplate`, it makes a backdrop root and the blur sees nothing.
- **BLUE, fish (30 Oct):** ovals with a triangle tail were rejected ("shapeless piglets"). Fish are slim top-view silhouettes
  on a flexing spine, after Alex's reference (CodeCanyon "Fish Animation"; own drawing, no copied sprites). Two kinds take
  turns: a school of small fish and a few larger ones (not very large), every few seconds, because nobody watches a screen for
  a minute. Each pass draws its own route, count, size and density, and they are slightly blurred, under the water.
- **Whole site scored 8/10 by Alex (31 Oct): "a very good site".** The bar for this project: brand film first, list pages that show the boats at once, the client's own words, stepped slide-ins.
- **Inner pages (30 Oct), template:** `templates/` holds `shell.html` (head, header, menu, footer, film dialog), `brand.html` and one JSON per
  brand; `python templates/build.py` writes `site/brand-<slug>.html`, add the slug to `BUILT`. Never edit a built page by hand. Alex's reference is
  vanquish-yachts.com/yachts/vq40-outboard, as a principle only: **the home's sea does not come to a brand page** (Alex: "I wouldn't drag our hero
  video into brand"). One template; the data sets the size: hero film, range (many models: a held sideways reel; one: a large plate), full-screen chapters,
  views, the home's standard stock cards (the heading takes the columns the cards leave), other brands, contact, surf footer, page bar with Inquire.
  Facts come from the brand's own site (vandutch.com, midnightboats.com, iguana-yachts.com, tecnomar.com/fleet) or our own copy; no links out to brand sites;
  New inventory and brokerage are one section, Inventory, on one page (Alex, 31 Oct); the menu has no separate Brokerage.
  **`site/about.html` carries the client's About text word for word (Alex, 31 Oct: never rewrite copy we were told to take).** One paragraph to a section, no headings of ours. It keeps the client's spelling, including "recourses", until they correct it.
  Inventory has a short search: year and make menus, length and price two-handled sliders; a boat on request stays until the price is narrowed.
  **Inventory and Sold are list pages (Alex, 31 Oct): the film is a band half the screen high with the title on it, filters below, the cards right after, no float.** Clients and managers must see the boats at once.
  Tags on cards: `"tag"` per boat (Available now, New, Sale pending, Sold). Never set a status we have not been told.
  Stock and sold come from prestigemarine.co/boats-for-sale and /sold (9 and 15 boats, 31 Oct). The site answers 403 to scripts; it opens in Alex's own Chrome, which is how it was read. Boats from brands without a page live in `templates/stock-other.json`.
  `contact.html` (monochrome OpenStreetMap, sample hours marked as such until confirmed, the form), `sitemap.html`, `privacy.html` (placeholder until the client's text arrives).
  Boat pages: `templates/boats.json` + `vdp.html` build `site/boat-<slug>.html`, one per listing: the boat with name and price on the first screen; photos in stepped groups beside a sticky rail; a full-size viewer; the listing's own text; specs in folding groups; the broker. Listing statuses become tags. Bans still bind: no ME52 outboard count or total hp, no Tecnomar top speed. Keep "Photos are not of the actual boat" where the listing says so.
  Panels must stay above held films (`main > .panel` carries the z-index): a short panel otherwise lets the next one run under the sticky frame. Test the whole scroll, not one stretch.
  Motion (Alex, 30 Oct): pictures may stand side by side in groups but slide in a step apart (from the side or below) and float away upward with the scroll; chapter words drive in, hold, and drive away upward before the next chapter rides over.
  a figure that disagrees with itself is left out. Brand media is downloaded and cut locally with ffmpeg (authorised dealer, no fal), listed in `site/assets/SOURCES-brands.md`. Rewrite brand copy, never paste it.
- **Alex's standing rules from the explore round (26 Oct, `EXPLORE-BRIEF.md`):**
  - the boat over the water video stays; water stays saturated azure, never pale shallows;
  - texts are not bolted to the boat: they rise from below in steps, in legible ice cards;
  - split into elements, dynamic; darker boat shadow; water ripple under the pointer;
  - header never disappears, only changes tone;
  - no beige, cream or camel. Grounds come from the subject: azure, cool white `#EEFAF9`,
    asphalt `#1E252B`, graphite `#2A2627`, lagoon `#0B6A70`. Primary button is graphite with white type.
- **Content bans:** never print the ME52 outboard count; never a Tecnomar top speed; never link
  midnightexpressboat.com. The yellow Tecnomar from above and the water footage are generated: keep the
  disclosure line (footer). New generated assets get the `gen-` prefix and a line in `site/assets/video/GENERATED.md`.
