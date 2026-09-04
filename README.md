# Norvex Bio — biotech landing page

Premium, animation-driven concept site for a fictional AI-guided protein design company.
Built as a creative frontend assessment: a dark, cinematic single page where **one
persistent WebGL scene** travels behind seven sections of scroll choreography.

**Stack:** Next.js 16 (App Router, static) · React 19 · TypeScript · Tailwind v4 ·
GSAP + ScrollTrigger · Lenis · Motion (Framer) · React Three Fiber / three.js ·
@react-three/postprocessing · SplitType

## Architecture

```
src/
├── app/                     # routes, metadata, global CSS
├── components/
│   ├── three/               # WebGL layer
│   │   ├── SceneRoot.tsx    # capability gate: real scene vs SVG fallback
│   │   ├── Scene.tsx        # THE canvas — one context for the whole site
│   │   ├── Molecule.tsx     # PDB 4OO8 specimen, scroll-choreographed
│   │   └── ResidueField.tsx # ambient deterministic particle field
│   ├── sections/            # Hero · Manifesto · Science · Pipeline · Platform · Impact · Contact
│   └── ui/                  # Preloader · Cursor · Nav · Chrome (rail, counter, ticker)
└── lib/
    ├── copy.ts              # all content — rebrand by editing this file only
    ├── motion.tsx           # the motion contract + every reusable hook
    ├── scene-store.ts       # render-free DOM ↔ WebGL channel
    └── utils.ts             # cn(), clamp, lerp, mapRange
```

### One scene, seven sections

The 3D specimen is **never unmounted**. `Scene.tsx` mounts a single fixed canvas
behind the document; `Molecule.tsx` reads global scroll progress from
`scene-store.ts` and interpolates through a keyframe track (position, scale,
rotation, material heat). Scrolling therefore reads as one continuous camera move
around one object, not seven disconnected section visuals.

The store is the important part: scroll and pointer values are written into a
plain mutable object at 60fps and read inside `useFrame`. **No React re-renders
are involved in keeping the canvas in sync with the page** — only discrete state
(`phase`, `ready`) is subscribable.

### The hero is a real protein

The specimen is the actual **SpCas9 ternary complex (RCSB PDB 4OO8)** — not a
procedural blob. `scripts/build-molecule.mjs`:

1. Fetches the structure from RCSB PDB
2. Parses the Cα trace (1,301 residues) + nucleic-acid phosphate backbone (236)
3. Builds a stylized "pearl strand" mesh (icosphere instances)
4. Optimizes to **222KB GLB** via gltf-transform + Draco

```bash
npm run build:molecule
```

Studio lighting is a locally served 512px HDR. No CDN fetches at runtime — the
Draco decoder is vendored (`public/draco/`) and fonts are self-hosted via
Fontsource, so the build has zero network dependencies.

## Design system

- **Palette:** abyss `#050D20` · ink `#0A1633` · deep `#0B2A6B` · accent `#3E63F2` · bio `#25D0A6` · paper `#F6F7F9`
- **Type:** Geologica (display) · Inter (body, tabular numerals) · Newsreader italic (editorial accent) · IBM Plex Mono (data labels)
- **Motion contract:** expo-out `cubic-bezier(0.16,1,0.3,1)` everywhere · micro 150–250ms · reveals 400–1100ms · stagger 80ms
- Full research + rationale: [ASSET-RESEARCH.md](ASSET-RESEARCH.md)

## Signature interactions

| Section | Interaction |
| --- | --- |
| Preloader | Eased counter to 100, scroll locked, curtain wipe hands off to the hero timeline |
| Hero | SplitType line-masked headline, magnetic CTAs, live telemetry readout |
| Manifesto | Scroll-scrubbed word-by-word illumination |
| Science | Self-drawing contour landscape + parallaxed stat list |
| Pipeline | **Pinned horizontal rail** — vertical scroll becomes lateral travel through the loop |
| Platform | Keyboard-navigable discipline selector with shared-layout detail swap |
| Impact | Count-up figures with dash-drawn sparklines |
| Global | Trailing custom cursor (grows on targets, reads "DRAG" over the scene), scroll rail, section counter, marquee |

## Performance & accessibility rules this repo enforces

- **One** WebGL context, `frameloop="demand"`, fully paused when the tab is hidden
- `dpr` capped at 1.5 with `AdaptiveDpr`; postprocessing is bloom + vignette only — no SSAO, DOF, or transmission
- Scene never mounts at all for coarse pointers, `deviceMemory <= 4`, or reduced motion — those visitors get an SVG fallback
- Scroll is **never hijacked on touch**: the pinned pipeline degrades to a vertical stack, and Lenis is disabled entirely
- Every animation no-ops under `prefers-reduced-motion`; count-ups render final values rather than a misleading `0`
- Full keyboard support: skip link, roving arrow keys in the platform selector, visible `:focus-visible` rings, `aria-current` on nav

## Develop

```bash
npm install
npm run dev          # dev server
npm run build        # production build (fully static)
npm start            # serve the production build
npm run lint         # eslint, 0 problems
```

## Credits

- Structure data: [RCSB Protein Data Bank](https://www.rcsb.org/), entry 4OO8
- Studio HDR: [Poly Haven](https://polyhaven.com/) (CC0), resized locally
- Fonts: Geologica, Inter, Newsreader, IBM Plex Mono — self-hosted via Fontsource

Assessment context: brand/company is a fictional concept; the science data is real.
