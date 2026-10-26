# Explore C · "The Showroom"

Preview: http://localhost:8773/explore/c/index.html
Built 26 Oct 2026. Manifest: `/Users/alex/Desktop/WORK/design_dna/TASTE.md` (canonical Mac path).

## Concept sentence
Prestige Marine shows a boat the way Prestige shows a supercar: one object on a strong grid, named
in big type, with its facts arriving as separate pieces. The water is a framed window, not the ground.

## Mechanic
- **First screen.** Shallows-white ground with a 12-column grid. The H1 sits in columns 1–9, the intro
  and CTAs in 10–12, and a placard ("Tecnomar for Lamborghini 63 · Represented by Prestige Marine")
  stands at the window's top edge in columns 1–3. The water is a framed window in columns 4–12, playing
  the approved azure loop, with its deep channel lifted into the frame. The yellow Tecnomar (bow right)
  is longer than the window: its stern breaks out over the white ground. Its shadow falls only where
  there is water, because the shadow layer shares the window's clip.
- **One pinned stage, about 3 screens of scroll, driven by one Lenis input.** The window opens to the
  full frame under the header. The yacht levels from −3° to 0° and grows. The first screen's words
  leave as separate pieces, each at its own rate. The model name then settles in at the top, and the
  four ice cards (Lineage, Build, Power, In stock now) rise from below one after another. They stand as
  a staircase climbing toward the bow. Finally the yacht drifts right and turns +1.2° until the stage
  releases. The cards sit on the grid and never point at the hull.
- **Phone (authored separately).** The yacht stands bow-up in a tall window. In the stage it moves
  right, and the model name becomes a small ice plate at the top left. The cards arrive as a deck: the
  newest stands in front and each earlier card climbs one step, so its label stays visible. The final
  frame reads Lineage / Build / Power / In stock now as stairs.
- **Water ripple.** A WebGL height-field ripple runs over the hero window and the surf footer. It
  answers hover, and a tap on touch. The CPU simulation uses about 9 px cells and refracts the live
  loop with a soft light on the wave faces. The canvas shows only while the water is disturbed; at
  rest, the video itself shows. It is not built under reduced motion, and if WebGL is missing the
  video stays as it is.
- **The floor (inventory, on asphalt `#1E252B`).** Four lots alternate left and right. In each, the
  car paint is the headline at 152 px (Pagani Silver / Nardo Grey / Grigio Lynx / Verde Gea). Each
  lot has a plan photo, plus an elevation inset that overlaps it and moves faster. The paint word
  drifts sideways and the plan photo drifts slowly. The year, model, full paint line and price
  follow, then three spec cells that rise in steps (110 ms apart) when the lot arrives. The specs are
  DESIGN-READ-v2 §7 verbatim: no ME52 hours or outboard count, and no Tecnomar top speed.
- **Surf footer**, as in v2, with the ripple on its water.

## What is different from v2
v2 is one continuous water ground, a hull rising vertically, and facts placed beside the hull. C is a
white grid with water only inside frames. The hero object is horizontal and breaks out of its frame.
The page has a single pinned "showroom" stage, its facts are free-standing frosted cards, and its
inventory runs on dark asphalt and is headlined by the paints.

## Judgment calls
- **No GSAP.** One progress function (`paintShow`) driven by Lenis does the whole stage, so there is
  one fewer dependency. Lenis runs with `autoRaf` (DNA90) and `anchors` set, and is not built under
  reduced motion.
- **The yacht's final size is computed**, not fixed. It fits the band between the model name and the
  highest card, so nothing ever sits on the hull. On short screens (720 px tall) the cards turn compact
  and the stair gets shallower.
- **Bare ink type for the model name over water (motion path).** It measured ≥5.98:1 worst-case on the
  composited render. In the static path the same title sits on the deep channel (2.90:1), so it gets an
  ice plate there.
- **A horizontal copy of the generated Tecnomar** is at `explore/c/img/tecnomar63-top-h.webp`
  (2499×750, 280 KB, rotated 90° from `gen-tecnomar63-top.png`, nothing else changed). It is still
  generated artwork, disclosed in the footer legal line and in the image alt. No new generation was
  run.
- **The phone intro sentence is hidden** to keep the hero head inside 42svh. It is a tagline, not
  information. Everything the visitor needs (H1, both CTAs) stays.
- **Enquire** links point to the footer's Visit block (`#visit`), because this prototype has no
  contact form.
- **No HUD or map.** That idea belongs to another direction. C's devices are the grid, the frame and
  the cards.

## Verified (Playwright, Chrome channel, own browser)
- 1440×900, 390×844, 1280×720, 1920×1080, 1024×768 and 375×667: no horizontal scroll (scrollWidth =
  viewport width).
- Contrast on the composited render (text hidden, background sampled under each box, worst = 5th
  percentile):
  - desktop cards ≥10.6:1;
  - model name 6.37:1 and subline 5.98:1 over water;
  - phone cards ≥11.1:1, title chip ≥8.6:1;
  - reduced-motion spec panel ≥9.05:1;
  - footer legal line (now ink) ≥7.96:1 on the phone surf fade.
- The ripple turns its canvas live on mouse move (desktop) and on tap (phone).
- Reduced motion: no `fx` class, no Lenis, no pin, no ripple, posters only. It renders as two static
  blocks (first screen, then the cards on a framed water panel).
- No console errors. The only 404 was `/favicon.ico`, now silenced with an empty icon.

Shots: `shots/d1440-*`, `m390-*` (stage at 0/15/30/50/70/95%, floor, footer), `rm*` (reduced motion,
full page), `x*` (other viewports), `d1440-ripple.png`.
