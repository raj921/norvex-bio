# HANDOFF — Biotech Landing Page (Round 1 Assessment)

Date: 2026-08-15 · Status: **Session 4 — benchmark redesign built + verified. Deploy remains.**

---

## 1. The assignment
Build a premium, animation-driven **biotechnology landing page** (Google Doc brief: `docs.google.com/document/d/17mz9_4nodsjzH7wtc33uXYsNnKKSzrfrF53y9eX7yCE`).
- **Sections**: Hero · About/Innovation · Technology/Research · Capabilities · Stats/Impact · Final CTA
- **Grading**: Visual 20 · Animation 20 · Engineering 20 · Responsive 15 · Originality 15 · Perf/UX 10
- **Deliverables**: live deploy + GitHub repo + README + design-rationale write-up
- **Deadline**: 7 days from receipt · Submit: `forms.gle/h4cgxChvHhYzzKvZ8`
- Hard rule: references are inspiration only — **no copying**; original visual identity required.

## 2. References (from the brief)
1. deeppiction.com — the "real company" credibility bar
2. dribbble.com/shots/21281292 — Zajno animation concept (2 videos) — the motion bar
3. dribbble.com/shots/26232588 — Orizon rounded-UI shot — the UI bar

## 3. Active skills/modes this session
| Skill | Role so far |
|---|---|
| **ponytail** (lazy senior dev) | Governing mindset: minimum code, no unrequested abstractions, push back on unneeded work |
| **3d-web-experience** | 3D stack decision tree loaded (Spline → R3F → vanilla Three.js). Verdict from research: one WebGL canvas max, static fallback mandatory |
| **ego-browser** | All live research (doc export, DOM/CSS extraction, pixel analysis); session 2: visual/functional verification via CDP + canvas pixel probes (agent model can't view images — screenshot → pixel histogram is the workaround) |

## 4. What's been done (chronological)
1. Read the Google Doc via its `/export?format=txt|html` endpoints (canvas editor — DOM scraping unreliable; export path is the reliable one). Extracted full brief + all reference URLs.
2. **DeepPiction measured live**: Webflow, 0 canvas, video-driven science footage; fonts Geologica + Montserrat Alternates + Inter; navy `#031E54` + off-white `#F5F5F7`; section flow documented.
3. **Zajno videos downloaded & frame-sampled** (8 frames/video, 2880×2160, ~20/24s): lavender-white palette (lum ~0.82, sat ~0.10), dark-plum finale, smooth loops + hard cuts.
4. **Orizon shot pixel-histogrammed**: 42% white, `#AABBDD` blues, black type, rounded UI.
5. **Field study of top live biotech sites** (isomorphiclabs.com, generatebiomedicines.com, insitro.com): all type-led (Söhne/Messina/TT Commons premium faces), one signature accent each, 0–1 WebGL canvas. Key insight: **typography > 3D for "premium biotech."**
6. Wrote **`ASSET-RESEARCH.md`** = the full strategy doc (rubric map, teardowns, design tokens, motion contract, asset inventory, verified source guide, anti-goals, 7-day plan). **This is the single source of truth — read it first.**

## 5. Decisions locked in
- Direction: *light scientific premium* — high-key palette, one hue, one hero molecule, one dark CTA section. **Not** neon sci-fi, **not** Zajno's lavender.
- Tokens: ink `#0A1633` · deep `#0B2A6B` · accent `#3E63F2` · bio `#25D0A6` · paper `#F6F7F9` · mist `#E4E9F4`
- Type: Geologica/Montserrat Alternates display · Inter body (`tnum`) · Newsreader italic accent · mono (IBM Plex Mono) for data labels
- Motion stack: GSAP + ScrollTrigger + Lenis (GSAP fully free since Webflow acquisition)
- Hero: real protein via RCSB PDB/AlphaFold → **Molecular Nodes** (Blender) → GLB, Draco + KTX2, <1.5MB; procedural helix as backup; static AVIF still as mobile/reduced-motion fallback
- Budgets: first load < 2.5MB on 4G · LCP < 2.5s · 60fps on 2019 mid-phone · everything honors `prefers-reduced-motion`

## 6. Artifacts
| Item | Location |
|---|---|
| Strategy doc (READ THIS) | `/Users/rajkumar/creative frontend assesmet/ASSET-RESEARCH.md` |
| This handoff | `/Users/rajkumar/creative frontend assesmet/HANDOFF.md` |
| Zajno reference videos + Orizon image | `/var/folders/xq/gy8gv85x2kj7bs6m9jp9t5480000gn/T/opencode/` — **temp dir, may be wiped**; all needed data already extracted into ASSET-RESEARCH.md |
| ~~Project code~~ | Full Next.js app now lives at repo root — `src/`, `public/hero-molecule.glb`, `scripts/` |

## 7. Environment gotchas (save the next session an hour)
- **ffmpeg is broken on this machine** (missing libbluray dylib after a homebrew change). Frame extraction was done in-browser via canvas instead. Fix homebrew (`brew reinstall libbluray ffmpeg`) if video tooling is needed, or keep using the browser-canvas trick.
- ego-browser quirks learned: tabs use `targetId` (not `id`); `captureScreenshot()` helper errors — use `cdp('Page.captureScreenshot', ...)`, which still times out on heavy WebGL pages; `data:` origin pages **cannot fetch** — serve files over http with a CORS header and probe from a same-origin page.
- ego-browser task spaces used are closed; reopen as needed with a new name.

## 8. Session 2 (2026-08-12 PM) — build

**Decisions taken (user delegated via "continue"):** fiction = **Norvex Bio**, AI-guided protein design. Stack = Next.js 16.3 + React 19 + Tailwind v4 + GSAP/ScrollTrigger + Lenis + R3F. Hero pipeline = Node script (no Blender). Build machine = this Mac (M2, 8GB).

**What exists now:**
- `scripts/build-molecule.mjs` — fetches RCSB PDB 4OO8 (SpCas9 ternary complex), parses Cα trace (1,301) + nucleic P-backbone (236), builds icosphere "pearl strand" GLB → `npx gltf-transform optimize --compress draco` → **`public/hero-molecule.glb` = 222KB** (budget was 1.5MB). Has assert-based self-check; run `npm run build:molecule`.
- Architecture: `src/lib/copy.ts` (ALL copy — rebrand = edit one file), `src/lib/motion.tsx` (MotionRoot=Lenis+ScrollTrigger, useReveal hook, reduced-motion no-op), `components/{Nav,Hero,HeroCanvas,Sections}.tsx` (Sections = all 5 non-hero sections), `app/{layout,page,opengraph-image}.tsx`, `app/icon.svg`.
- Hero: glass MeshTransmissionMaterial protein + teal nucleic strands, slow 78s rotation, pointer parallax, Float drift, scale-in entrance. Canvas gated: no 3D on coarse-pointer/low-mem/reduced-motion → CSS constellation fallback (ponytail note: upgrade path = rendered AVIF still).
- Motion contract honored: expo-out everywhere, staggered reveals, SVG pipeline line scrub-draw, stats count-up, one WebGL context + IntersectionObserver frameloop gate, anchor scroll via Lenis.
- Draco decoders vendored at `public/draco/gltf/` (no CDN fetch).
- OG image via `next/og`, favicon = custom SVG mark.

**Verified (ego-browser, quantitatively — this model can't view images):** build passes static; WebGL canvas renders molecule (hero region: 11.5% blue + 10% teal px); counter reaches "96.2%"; CTA bg = `#0A1633`; 390px: no horizontal overflow, nav collapses; **0 own-origin console errors**; DCL ~200ms local.

**Still open (D5–D7):**
1. `metadataBase` unset — set real domain at deploy; README + design-rationale write-up still owed (deliverable).
2. Perf pass on real mid-phone; check glass material's dark facets visually with human eyes (13% dark px in hero region — probably shaded spheres, worth a look).
3. Optional credibility upgrade: Wellcome Collection CC-BY imagery replacing the SVG art in Science section; AVIF hero still.
4. Deploy (Vercel needs user's account), git init + repo (needs user OK), submission form.
5. Stray `package-lock.json` in `/Users/rajkumar` triggers a Next warning — user's to remove, left untouched.

**Preview/Rerun:** `npm run dev` (or `next start` after `npm run build`). Session-2 preview server may still be on :3100 (`lsof -ti:3100 | xargs kill` to stop).

**Session 3 fix (Aug 15):** user's `npm run dev` felt heavy + hero rendered as black box. Cause: someone added `<EffectComposer><Bloom>` (full-screen post pass) on top of `MeshTransmissionMaterial` (own render pass) = 3 renders/frame + opaque composer target over the alpha canvas. Fix: **removed postprocessing + transmission entirely** → `meshPhysicalMaterial` (clearcoat + iridescence) with the user's 380KB local studio HDR for reflections — same premium sheen, ONE render pass. Also: dpr capped 1.5, grain lost its blend mode, counters render final values under reduced-motion, `__hero.png` + raw GLB evicted from `public/` (build-molecule script now deletes its intermediate). **Do not re-add EffectComposer/bloom/transmission — that was the whole bug.** Post-fix: build passes, 0 own-origin errors, WebGL context alive, HDR loads. Dev-mode note: `npm run dev` is inherently hotter; preview via `npm run build && npm start`.

**Session 4 (Aug 15 PM):** hero interaction pass — drag-to-rotate (idle drift pauses under hand), thicker pearls (2.3Å/2.7Å), camera z 8.4, canvas widened to 70%, micro-interactions (nav underlines, button scale/press states, card/stats hovers), lint clean (draco dir ignored, `useSyncExternalStore` for the 3D gate). Footer disclosure line removed per user. User added `/privacy` + `/terms` pages + `metadataBase` (fixed its default from localhost to prod URL). **Deployed:** https://norvex-bio.vercel.app (Vercel, account raj315920-2166). **Repo:** https://github.com/raj921/norvex-bio (public, main). Deploy = `npx vercel --yes --prod`; og:image verified absolute. Remaining deliverable: submission at forms.gle/h4cgxChvHhYzzKvZ8 (repo URL + deploy URL + rationale from ASSET-RESEARCH.md).

## 9. Open questions for the user
- Company/product fiction: name, what it "does" (gene editing? diagnostics? platform?) — needed before any copy
- Windows machine only or will this be built here? (ffmpeg fix decision)
- Any hard deadline date vs "7 days from receipt"?
- Repo hosting: user's GitHub account, new repo name preference

## 10. Session 4 (2026-08-15) — DeepPiction benchmark redesign

- Reworked the hero into an ink-dark, editorial split composition with stronger contrast, shorter two-line value proposition, scientific model readout, and local PDB molecule.
- Added the interactive four-stage design loop: target, backbone, sequence, assay evidence.
- Replaced equal capability cards with one dominant dark feature and three supporting surfaces.
- Converted Impact into a dark evidence band to create the same deliberate light/dark pacing that makes premium biotech sites feel authored.
- Added `immediateRender: false` to reveal tweens so anchor navigation cannot strand content at opacity 0.
- Strengthened the mobile SVG helix fallback after visual browser inspection.
- Final preview verified on port `3108`: desktop one Canvas, mobile zero Canvas, no horizontal overflow, 4 design-loop buttons, and no browser errors.
- DeepPiction media was not copied. The final page uses the real RCSB PDB 4OO8 structure and original local SVG/CSS compositions.
