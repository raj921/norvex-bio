# Biotech Landing Page — Asset & Methodology Research

Research for Round 1 — Creative Frontend Developer. References analyzed live and
measured from pixels/DOM (no eyeballing): palettes below are extracted, not guessed.

---

## 1. What the rubric actually rewards

| Criterion | Weight | What it means for asset decisions |
|---|---|---|
| Visual Design | 20% | Coherent token system, real type pairing, no stock-looking imagery |
| Animation & Interaction | 20% | Every section needs *choreographed* motion, not random fades |
| Frontend Engineering | 20% | Assets must be compressed (AVIF/WebP/GLB-Draco) and lazy-loaded |
| Responsiveness | 15% | Design assets mobile-first; hero visual must degrade gracefully |
| Creativity & Originality | 15% | Steal the *method* of references, never their palette verbatim |
| Performance & UX | 10% | LCP < 2.5s, 60fps scroll, reduced-motion fallbacks |

---

## 2. Reference teardown (measured)

### 2a. DeepPiction — deeppiction.com (the "real company" bar)
- **Stack**: Webflow. **Zero `<canvas>`/WebGL.** All motion is video + Webflow interactions.
- **Type**: Geologica (primary, Google Fonts), Montserrat Alternates (display), Inter.
- **Palette (extracted)**: deep navy `#031E54`, off-white `#F5F5F7`, grey `#D9D9E0`, blue-greys `#939BB6` / `#52658B`. Dark and light sections *alternate*.
- **Assets in use**: real scientific footage — tissue-clearing / whole-organism imaging MP4s (DeepMACT cancer imaging), before/after comparison pair, greyed partner-logo wall, 4 platform SVG icons, AVIF `@2x` imagery, publication covers.
- **Structure**: hero → science → publications → platform → partner → blog → about → team → careers → contact.
- **Lesson**: credibility comes from *real microscopy footage* and an editorial rhythm (dark/light alternation), not from WebGL fireworks.

### 2b. Zajno — "Animation for the Biotech Website Concept" (the motion bar)
Two MP4s, 2880×2160, ~20s & ~24s. Frame-sampled every 12%:
- **Palette (extracted)**: lavender-white family — `#DDDDEE` (33–73% of frame), `#DDCCEE`, `#FFEFFF`, `#EEEEFF`. Mean luminance **0.81–0.85**, saturation **~0.10** → pastel, light-on-light, glassy.
- **Contrast beat**: finale flips to near-black plum `#221122`/`#221133` (63% of frame, saturation jumps to 0.36) — one dark crescendo section.
- **Motion signature**: long smooth runs (luminance delta ≈ 0), then hard scene cuts at ~64% and ~88% of runtime. Slow matter, decisive transitions.
- **Lesson**: mono-tint restraint. One hue family, aired out with whitespace, 3D "matter" (translucent, glass, subsurface look), and a single dark section for the CTA.

### 2c. Orizon / Aurélien Salomon — "Modern Rounded UI Biotech" (the UI bar)
- **Palette (extracted)**: 42% pure white, soft blue tints `#AABBDD` / `#CCDDEE`, black-only text.
- **Signature**: fully rounded cards/pills, clinical whitespace, one blue accent family.
- **Lesson**: UI chrome (radius, borders, tints) does the "biotech" signaling, letting photography stay minimal.

### 2d. Field study — top live biotech sites (measured 2026-08-12)
| Site | Stack | Type strategy | Palette signal | 3D? |
|---|---|---|---|---|
| isomorphiclabs.com | **Webflow** | Söhne family (commercial Swiss) + **Söhne Mono** for data labels | pure monochrome (white/#DDD/black) | 0 canvas, 1 video |
| generatebiomedicines.com | **WordPress** | Messina Sans + Messina Modern + **Serif mixing** | white/black + ONE signature green `#009900` | 0 canvas, 1 video |
| insitro.com | custom | TT Commons + Tiempos Headline (commercial) | navy `#232E4F` + electric yellow `#FFEF00` + cyan `#00D9EA` | 1 canvas |

**The 2026 bar, in order of investment:**
1. **Typography is the #1 premium signal.** Every top site buys/knows type (Söhne, Messina, Tiempos). Free equivalents that hit the same notes: Inter/Geologica (≈Söhne), Fraunces/Newsreader (≈Tiempos serif), **a mono for data labels** (IBM Plex Mono / Space Mono ≈ Söhne Mono) — the mono is the "lab credibility" cue.
2. **One saturated signature accent** on a near-neutral base (Generate's green, insitro's yellow).
3. **Zero-to-one WebGL canvas.** Credibility comes from real science media + type, not engine flexing. 3D sites ≠ top biotech sites.
4. Serif+sans mixing (Generate, insitro) is the current editorial move — a serif for headlines signals "science publication," sans for UI.

### Synthesis — the shared formula
> **Light scientific premium.** High-key palette, ONE signature hue, one hero molecule/helix visual, one dark contrast section tied to the final CTA, editorial typography. None of them look like cyberpunk "neon DNA" template work.

---

## 3. Design system to build (original, reference-informed)

### Color tokens
Own direction — keep the *calm*, dodge the lavender clone:
| Token | Hex | Role |
|---|---|---|
| `ink` | `#0A1633` | primary text / dark section bg (navy-black, not plum) |
| `deep` | `#0B2A6B` | brand deep blue (honors DeepPiction's navy without copying) |
| `accent` | `#3E63F2` | interactive blue — CTAs, links, data highlights |
| `bio` | `#25D0A6` | ONE organic accent (teal-mint) for "living" markers/gradients |
| `paper` | `#F6F7F9` | light bg |
| `mist` | `#E4E9F4` | tints, card washes, hairline borders |
| `glass` | `#FFFFFF @ 60–80%` | glassmorphic overlays on the 3D visual |

60-30-10: paper/mist 60 · ink/deep 30 · accent+bio 10. Single dark section uses `ink`.

### Typography (all free, Google Fonts)
- **Display**: *Montserrat Alternates SemiBold* or *Geologica* (geometric, technical, reference-adjacent but not the whole stack)
- **Body/UI**: *Inter* (400/500, features: `ss01`, tabular numerals `tnum` for stats)
- **Accent serif (optional)**: *Newsreader Italic* for one-word editorial flavor in section kicker lines
- **Scale**: 12 / 14 / 16 / 20 / 28 / 40 / 56–72 (clamp). Hero display `clamp(2.75rem, 6vw, 4.5rem)`, tight leading (1.02–1.08), -0.02em tracking on display only.

### Grid & spacing
12-col desktop (max-width 1200–1320px, 24px gutters), 8-col tablet, 4-col mobile.
Spacing on an 8px base: sections breathe at 120–160px desktop, 64–80px mobile.
Radius system: 12 / 20 / 28 / pill (Orizon's rounded cue).

---

## 4. Asset inventory — everything to produce or source

### A. Hero visual (the make-or-break asset)
Recommended: **real DNA/molecule 3D artifact**, in order of effort:
1. **RCSB PDB / AlphaFold DB** → download a real protein (e.g., Cas9, insulin, spike RBD) → open in ChimeraX or Blender → stylize (glass/transmission material, studio HDRI, soft DOF) → export GLB → `gltf-transform optimize --compress draco --texture-compress webp` → budget **< 1.5MB**.
2. Procedural alternative: helix/particle lattice generated at runtime (no download cost, always crisp) — fallback if modeling time runs out.
3. Static fallback: one rendered 2048px AVIF/WebP still of the same asset for mobile/reduced-motion.

### B. Supporting visuals per section
| Section | Asset | Spec |
|---|---|---|
| Hero | 3D molecule + particle field | GLB Draco <1.5MB; 60fps; pointer-parallax |
| About/Innovation | Abstract microscopy-style stills | 2× AVIF @2x, duotone in `mist`/`deep` |
| Technology/Research | 3–4 step process diagram | inline SVG, stroke-based, animated dash-draw on scroll |
| Capabilities | 4 icon tiles | custom 24px SVG line icons (1.5px stroke, round caps) — motif set: *helix, cell, assay/flask, data-node* |
| Stats/Impact | 3–4 counters | tabular numerals, count-up on enter; sparkline SVG |
| Final CTA | dark `ink` section + molecule silhouette or particle constellation | reuse hero GLB, inverted lighting |
| Global | logo wall (fictional partners, greyed) | 5–6 wordmarks, 40% opacity, SVG |
| Global | favicon + OG image | 32px SVG favicon; 1200×630 OG |

### C. Texture & finish library
- Fine film **grain/noise** overlay (tiled 128px PNG, 3–5% opacity) — the cheapest "premium" trick from high-end sites.
- **Glass cards**: 1px `mist` border, white 60% fill, 16–24px backdrop blur — only over the 3D canvas.
- **Gradient usage rule**: gradients live ONLY in the 3D visual + one accent glow per section. UI stays flat.

### D. Asset source guide — verified best places (Aug 2026)

**3D molecular assets (hero visual)**
- **RCSB PDB** (rcsb.org) — real protein structures, free, downloadable
- **AlphaFold DB** (alphafold.ebi.ac.uk) — 200M+ predicted structures, EMBL-EBI, free
- **Molecular Nodes** (Blender add-on, github.com/BradyAJohnston/MolecularNodes) — *the* current best practice: imports PDB/AlphaFold straight into Blender as stylable geometry nodes (cartoon, surface, ball-and-stick presets). This is how modern science renders get the "glassy matter" Zajno look
- **Mol\*** (molstar.org) — web viewer for composition reference and quick screenshots
- Export: GLB → `gltf-transform optimize` with **Draco mesh + KTX2/BasisU textures** (2026 best practice — GPU-native, beats WebP for 3D)

**Scientific imagery (credibility layer)**
- **Wellcome Collection** (wellcomecollection.org) — CC-BY biomedical imagery, genuinely beautiful
- **Cell Image Library** (cellimagelibrary.org) — CC microscopy
- **NIH / NCI Visuals Online** — public domain
- Unsplash ("microscopy", "laboratory") — license-check each image
- AI generation (Midjourney/Flux): only for *abstract* textures/glows. Never fake lab photography — reviewers in biotech smell it and it breaks the "real company" goal

**Type (the highest-leverage asset)**
- Free-premium: **Geologica** (DeepPiction uses it — you're licensed for the same flex), **Inter** + `tnum`, **Newsreader/Fraunces** (serif editorial), **IBM Plex Mono / Space Mono** (data labels, stats, coordinates — the lab cue)
- Self-host, subset (woff2), preload display weight only, `font-display: swap`

**Icons**
- **Lucide** as the 24px baseline grid, then customize 6–8 into a proprietary-feel set (helix, cell, flask/assay, node-network) at 1.5px stroke

**Texture/finish**
- Grain: generate a 128px noise tile yourself — 3–5% opacity, `mix-blend: overlay`
- Gradients: author as SVG/CSS meshes yourself; "gradient pack" downloads read as template

**Copy & data (an underestimated asset)**
- Write real biotech structure: pipeline stages (Discovery → Preclinical → Clinical), platform names, metrics (“× faster”, “targets validated”), one methodology diagram
- Statistics section needs plausible, internally consistent numbers — nothing else reads "generic template" faster than round filler stats

**Motion/tooling — current best practice**
- **GSAP + ScrollTrigger + Lenis** is the standard stack; GSAP (incl. former Club plugins like ScrollSmoother) has been **fully free** since the Webflow acquisition — no license risk
- Framer Motion is now **Motion** (motion.dev) — fine for micro-interactions; don't mix two animation systems for the same elements
- R3F: v9/React 19 era; use `detect-gpu` tiering, Suspense fallback = the static AVIF hero, render on demand (`frameloop="demand"`) when idle
- Honored anti-pattern check: one WebGL context max, everything interchangeably swappable for the static fallback

**Where to track "latest" beyond this doc**
- awwwards.com (Collections → biotech/science), fwa.design, godly.website, land-book.com, minimal.gallery — sorted by recent
- Study *real* companies (DeepPiction, Isomorphic, Generate, insitro, Recursion, Arcadia Science) over Dribbble — Dribbble is the motion lab, companies are the credibility bar

**Pipeline (compression is a design deliverable)**
- Rasters: AVIF primary / WebP fallback, `srcset+sizes`, @2x only for hero
- Video: muted loop, ≤2MB, poster frame AVIF, `playsInline`
- SVG: SVGO; 3D: gltf-transform (Draco+KTX2); Fonts: pyftsubset
- Budget: hero GLB < 1.5MB, total first load < 2.5MB on 4G

---

## 5. Motion methodology

### Timing & easing contract (used everywhere, no exceptions)
- **Micro** (hover, buttons): 150–250ms, `cubic-bezier(0.2, 0, 0, 1)` (decelerate)
- **UI** (cards, reveals): 400–600ms, `cubic-bezier(0.16, 1, 0.3, 1)` (expo-out)
- **Scenes** (section transitions): 800–1200ms expo-out
- **Continuous** (hero drift/molecule): 20–30s linear loop (Zajno's ~20s rhythm), 2–4px amplitude
- Stagger children 60–90ms. Nothing blocks input. Everything cancels under `prefers-reduced-motion`.

### Scroll choreography (one idea per section)
1. **Hero** — molecule idle drift + pointer parallax; headline staggers in on load
2. **About** — pinned text column, imagery clips in with rounded-mask reveal
3. **Technology** — SVG process line draws with scroll progress (scrub)
4. **Capabilities** — cards rise + tilt-in with stagger; icon hover micro-rotations
5. **Stats** — count-up + sparkline draw on enter
6. **Final CTA** — background cross-fades paper→ink; molecule reappears dimmed; CTA is the only saturated element

### Performance rules (these ARE design constraints)
- One WebGL context, `ScrollTrigger`-driven `useFrame` gated on viewport visibility
- Hero GLB preloads; everything else lazy (`loading="lazy"` + suspense)
- Target: < 200KB critical CSS/JS, LCP < 2.5s on 4G, 60fps on a 2019 mid-phone
- Mobile: molecule → static rendered still unless device is high-end (check `deviceMemory`/GPU tier)

---

## 6. Anti-goals (what loses points)
- Neon-on-black "sci-fi template" look — none of the references do this
- Lorem-ipsum science; copy must read like a real company (pipeline, platform, impact numbers)
- 3D for 3D's sake (the assessment's own anti-pattern): every animated element maps to content
- Copying Zajno's lavender or DeepPiction's layout verbatim (brief forbids it)
- Ignoring motion-reduction & keyboard states — 10% of the grade hides here

## 7. Suggested 7-day allocation
D1 tokens+grid+type · D2 hero 3D asset pipeline (PDB→GLB→optimized) · D3 sections 1–3 · D4 sections 4–6 + stats logic · D5 scroll choreography + micro-interactions · D6 responsive + a11y + performance pass · D7 deploy, README, buffer.

## 8. Final benchmark revision

The live DeepPiction comparison showed that the missing quality signal was narrative rhythm, not a larger asset download. The final Norvex composition therefore alternates ink and paper scenes:

- cinematic ink hero with the real PDB molecule, a model readout, and a visible mobile helix fallback
- paper science section for the explanatory foundation
- ink design loop with an interactive target → backbone → sequence → assay progression
- paper platform and asymmetric capabilities, avoiding four equal feature cards
- ink impact band for stronger evidence contrast before the final CTA

DeepPiction media is not reused. The molecule comes from RCSB PDB 4OO8, and the design-loop visual is an original local SVG composition. A public-domain NCI microscopy image was investigated as an optional supporting asset, but its archive endpoint was unavailable during the final pass, so the page does not depend on a fragile remote image.

---
*Data basis: live DOM/CSS extraction from deeppiction.com (2026-08-12), frame-sampled pixel analysis of Zajno shot #21281292 (8 frames/video), and pixel histogram of Orizon shot #26232588.*
