'use client';

import { useEffect, useSyncExternalStore } from 'react';
import dynamic from 'next/dynamic';
import gsap from 'gsap';
import { copy } from '@/lib/copy';
import { EXPO_OUT, prefersReducedMotion } from '@/lib/motion';

// ponytail: static fallback is CSS/SVG constellation, not a rendered AVIF still.
// Ceiling: hero degrades to abstract art rather than the actual molecule.
// Upgrade: screenshot the R3F scene once → commit as AVIF here.
function StaticMolecule({ loading }: { loading?: boolean }) {
	return (
		<div className="absolute inset-0" aria-hidden>
			<div className="absolute right-[-16%] top-[10%] h-[260px] w-[260px] rounded-full bg-accent/20 blur-3xl md:right-[-8%] md:top-[12%] md:h-[420px] md:w-[420px] md:bg-accent/25" />
			<div className="absolute right-[-2%] bottom-[12%] h-[190px] w-[190px] rounded-full bg-bio/20 blur-3xl md:right-[18%] md:bottom-[16%] md:h-[300px] md:w-[300px] md:bg-bio/25" />
			<svg viewBox="0 0 320 480" className="absolute right-[-2%] top-1/2 block w-[76%] -translate-y-1/2 opacity-55 md:right-[3%] md:w-[48%] md:opacity-75">
				<g fill="none" stroke="#AFC0FF" strokeLinecap="round">
					<path d="M92 8 C 248 72 248 168 92 232 S -64 392 92 472" strokeWidth="2.2" strokeOpacity="0.55" />
					<path d="M228 8 C 72 72 72 168 228 232 S 384 392 228 472" strokeWidth="2.2" strokeOpacity="0.55" />
					{[
						[104, 22, 216, 22], [164, 70, 156, 70], [206, 118, 114, 118], [208, 166, 112, 166],
						[164, 214, 156, 214], [104, 262, 216, 262], [72, 310, 248, 310], [104, 358, 216, 358],
						[164, 406, 156, 406], [206, 454, 114, 454],
					].map(([x1, y1, x2, y2], i) => <path key={i} d={`M ${x1} ${y1} L ${x2} ${y2}`} strokeWidth="1.5" strokeOpacity="0.38" />)}
				</g>
				{[
					[92, 8], [228, 8], [92, 232], [228, 232], [92, 472], [228, 472],
				].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="5" fill={i % 2 ? '#25D0A6' : '#3E63F2'} fillOpacity="0.7" />)}
			</svg>
			{loading && (
				<span className="absolute bottom-6 right-6 font-mono text-[10px] tracking-[0.2em] text-paper/45">
					LOADING SPECIMEN…
				</span>
			)}
		</div>
	);
}

const HeroCanvas = dynamic(() => import('./HeroCanvas'), { ssr: false, loading: () => <StaticMolecule loading /> });

/** Only gate kept intentionally simple: low-power or reduced-motion users never pay the 3D cost.
 *  SSR snapshot = false → server + first hydration render the fallback, then client flips. */
function useShouldRender3D() {
	return useSyncExternalStore(
		onStoreChange => {
			const queries = ['(pointer: coarse)', '(max-width: 767px)', '(prefers-reduced-motion: reduce)'].map(query => window.matchMedia(query));
			window.addEventListener('resize', onStoreChange, { passive: true });
			queries.forEach(query => query.addEventListener('change', onStoreChange));
			return () => {
				window.removeEventListener('resize', onStoreChange);
				queries.forEach(query => query.removeEventListener('change', onStoreChange));
			};
		},
		() => {
			const coarse = window.matchMedia('(pointer: coarse)').matches;
			const compact = window.matchMedia('(max-width: 767px)').matches || window.innerWidth < 768;
			const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
			return !prefersReducedMotion() && !coarse && !compact && mem > 4;
		},
		() => false,
	);
}

export function Hero() {
	const render3D = useShouldRender3D();

	useEffect(() => {
		if (prefersReducedMotion()) return;
		const tween = gsap.fromTo(
			'.hero-reveal',
			{ opacity: 0, y: 24 },
			{ opacity: 1, y: 0, duration: 1, ease: EXPO_OUT, stagger: 0.09, delay: 0.15 },
		);
		return () => { tween.kill(); };
	}, []);

	return (
		<section id="top" className="relative flex min-h-[100dvh] items-center overflow-hidden bg-ink text-paper">
			<div data-nav-sentinel aria-hidden className="absolute left-0 top-0 h-px w-px" />
			<div className="hero-grid absolute inset-0" aria-hidden />
			<div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink/80 to-transparent" aria-hidden />

			<div className="absolute inset-0 md:left-[30%]">
				{render3D ? <HeroCanvas /> : <StaticMolecule />}
			</div>
			<div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink via-ink/90 to-transparent md:hidden" aria-hidden />

			<div className="relative z-10 mx-auto w-full max-w-[1240px] px-6 pt-24">
				<div className="max-w-[620px]">
					<p className="hero-reveal kicker flex items-center gap-3 text-paper/55">
						<span className="inline-block h-px w-8 bg-bio" aria-hidden />
						{copy.hero.kicker}
					</p>
					<h1 className="hero-reveal mt-6 font-display text-[clamp(2.75rem,6vw,4.5rem)] font-semibold leading-[1.04] tracking-[-0.02em]">
						{copy.hero.headline[0]}
						<br />
						<em className="font-editorial font-normal italic text-bio">{copy.hero.headline[1]}</em>{' '}
						{copy.hero.headline[2]}
					</h1>
					<p className="hero-reveal mt-7 max-w-[46ch] text-lg leading-relaxed text-paper/70">{copy.hero.sub}</p>
					<div className="hero-reveal mt-10 flex flex-wrap items-center gap-4">
						<a
							href="#platform"
							className="rounded-full bg-paper px-6 py-3 text-sm font-medium text-ink transition-all duration-200 hover:scale-[1.04] hover:bg-bio hover:shadow-[0_10px_36px_-10px_rgb(37_208_166/0.55)] active:scale-[0.97]"
						>
							{copy.hero.primaryCta}
						</a>
						<a
							href="#science"
							className="rounded-full border border-paper/25 px-6 py-3 text-sm font-medium text-paper transition-all duration-200 hover:scale-[1.04] hover:border-bio hover:text-bio active:scale-[0.97]"
						>
							{copy.hero.secondaryCta}
						</a>
					</div>
				</div>
			</div>

			<div className="hero-reveal pointer-events-none absolute bottom-16 right-8 hidden w-52 rounded-3xl border border-paper/15 bg-paper/[0.08] p-4 backdrop-blur-md lg:block">
				<div className="flex items-center justify-between font-mono text-[9px] tracking-[0.18em] text-paper/45">
					<span>MODEL READOUT</span>
					<span className="text-bio">LIVE</span>
				</div>
				<div className="mt-5 grid grid-cols-2 gap-x-5 gap-y-4">
					<div>
						<p className="font-mono text-[9px] tracking-[0.16em] text-paper/40">STRUCTURE</p>
						<p className="mt-1 font-display text-lg text-paper">4OO8</p>
					</div>
					<div>
						<p className="font-mono text-[9px] tracking-[0.16em] text-paper/40">RESIDUES</p>
						<p className="mt-1 font-display text-lg text-paper">1,301</p>
					</div>
					<div>
						<p className="font-mono text-[9px] tracking-[0.16em] text-paper/40">MODE</p>
						<p className="mt-1 font-display text-sm text-paper">DE NOVO</p>
					</div>
					<div>
						<p className="font-mono text-[9px] tracking-[0.16em] text-paper/40">INPUT</p>
						<p className="mt-1 font-display text-sm text-paper">TARGET</p>
					</div>
				</div>
			</div>

			<p className="hero-reveal absolute bottom-6 left-6 font-mono text-[10px] tracking-[0.2em] text-paper/40">
				{copy.hero.specimen}
			</p>
		</section>
	);
}
