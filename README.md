# Norvex Bio — biotech landing page

Premium, animation-driven concept site for a fictional AI-guided protein design company.
Built as a creative frontend assessment: six sections (Hero · Science · Platform ·
Capabilities · Impact · CTA), one real WebGL hero, strict motion + performance budgets.

**Stack:** Next.js 16 (App Router, static) · React 19 · TypeScript · Tailwind v4 ·
GSAP + ScrollTrigger + Lenis · React Three Fiber / three.js

## The hero is a real protein

The 3D hero is the actual **SpCas9 ternary complex (RCSB PDB 4OO8)** — not a
procedural blob. `scripts/build-molecule.mjs`:

1. Fetches the structure from RCSB PDB
2. Parses the Cα trace (1,301 residues) + nucleic-acid phosphate backbone (236)
3. Builds a stylized "pearl strand" mesh (icosphere instances)
4. Optimizes to **222KB GLB** via gltf-transform + Draco

Run it yourself (assert-based self-check included):

```bash
npm run build:molecule
```

The studio lighting is a locally served 512px HDR (`scripts/shrink-hdr.mjs` shrinks
the Poly Haven CC0 original). No CDN fetches at runtime — even the Draco decoder
is vendored (`public/draco/`).

## Design system

- **Palette:** ink `#0A1633` · deep `#0B2A6B` · accent `#3E63F2` · bio `#25D0A6` · paper `#F6F7F9` · mist `#E4E9F4` (60-30-10)
- **Type:** Geologica (display) · Inter (body, tabular numerals) · Newsreader italic (editorial accent) · IBM Plex Mono (data labels)
- **Motion contract:** expo-out `cubic-bezier(0.16,1,0.3,1)` everywhere · micro 150–250ms · reveals 400–600ms · stagger 80ms · everything honors `prefers-reduced-motion`
- Full research + rationale: [ASSET-RESEARCH.md](ASSET-RESEARCH.md)

## Performance rules this repo enforces

- One WebGL context, only while the hero is in view (`frameloop` gated by IntersectionObserver)
- Glass/transmission materials and postprocessing are **deliberately absent** — clearcoat + iridescence give the same sheen in a single render pass
- Static constellation fallback instead of 3D on touch / low-memory / reduced-motion devices
- Draco-compressed GLB, AVIF-friendly rasters, system-compliant font loading via `next/font`

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
- Fonts: Geologica, Inter, Newsreader, IBM Plex Mono (Google Fonts)

Assessment context: brand/company is a fictional concept; the science data is real.
