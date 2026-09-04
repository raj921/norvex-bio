'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';
import { copy } from '@/lib/copy';
import { EXPO_OUT, prefersReducedMotion, useLineReveal, useMagnetic, useReveal, useTilt } from '@/lib/motion';

gsap.registerPlugin(ScrollTrigger);

/* Brand icons — the 1.8-round stroke language of the nav mark, not a stock set. */
function IconHelix({ size = 22 }: { size?: number }) {
	return (
		<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
			<path d="M7 2.5c0 5 10 5 10 10s-10 5-10 10" />
			<path d="M17 2.5c0 5-10 5-10 10s10 5 10 10" />
			<path d="M9.4 7h5.2M8.2 12h7.6M9.4 17h5.2" strokeWidth="1.4" />
		</svg>
	);
}

function IconLattice({ size = 22 }: { size?: number }) {
	return (
		<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
			<path d="M3 8V5a2 2 0 0 1 2-2h3M16 3h3a2 2 0 0 1 2 2v3M21 16v3a2 2 0 0 1-2 2h-3M8 21H5a2 2 0 0 1-2-2v-3" />
			<circle cx="12" cy="12" r="3.2" />
			<path d="M12 6.6v1.7M12 15.7v1.7M6.6 12h1.7M15.7 12h1.7" strokeWidth="1.4" />
		</svg>
	);
}

function IconFlask({ size = 22 }: { size?: number }) {
	return (
		<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
			<path d="M9.5 3h5M10.5 3v4.8L5.6 16.6A2.2 2.2 0 0 0 7.6 20h8.8a2.2 2.2 0 0 0 2-3.4L13.5 7.8V3" />
			<path d="M8 14.5h8" strokeWidth="1.4" />
			<circle cx="11.1" cy="17" r="0.9" fill="currentColor" stroke="none" />
			<circle cx="13.9" cy="16.4" r="0.7" fill="currentColor" stroke="none" />
		</svg>
	);
}

function IconGraph({ size = 22 }: { size?: number }) {
	return (
		<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
			<path d="M5 7l7 5.5L19 5.5M12 12.5 6 19M12 12.5l6.5 6" strokeWidth="1.4" />
			<circle cx="5" cy="7" r="1.6" strokeWidth="1.4" />
			<circle cx="19" cy="5.5" r="1.6" strokeWidth="1.4" />
			<circle cx="12" cy="12.5" r="1.8" />
			<circle cx="6" cy="19" r="1.6" strokeWidth="1.4" />
			<circle cx="18.5" cy="18.5" r="1.6" strokeWidth="1.4" />
		</svg>
	);
}

const ICONS = { Helix: IconHelix, Lattice: IconLattice, Flask: IconFlask, Graph: IconGraph } as const;

function SectionHead({ kicker, title, dark, center }: { kicker: string; title: string; dark?: boolean; center?: boolean }) {
	// Titles reveal line-by-line out of a clip mask — the single most "awarded"
	// typographic move on the site, and it degrades to plain text with no motion.
	const ref = useLineReveal<HTMLHeadingElement>();
	const words = title.split(' ');
	const mid = Math.ceil(words.length / 2);
	const lines = [words.slice(0, mid).join(' '), words.slice(mid).join(' ')].filter(Boolean);
	return (
		<>
			<p className={`kicker flex items-center gap-3 ${center ? 'justify-center' : ''} ${dark ? 'text-paper/40' : 'text-ink/50'}`}>
				<span className="inline-block h-px w-8 bg-bio" aria-hidden />
				{kicker}
			</p>
			<h2
				ref={ref}
				className={`mt-5 max-w-[18ch] font-display text-4xl font-semibold leading-[1.08] tracking-[-0.02em] md:text-5xl ${center ? 'mx-auto' : ''}`}
			>
				{lines.map(line => (
					<span key={line} className="line-mask">
						<span data-line-inner className="block">{line}</span>
					</span>
				))}
			</h2>
		</>
	);
}

/* ---------------- About / Innovation ---------------- */

/** Deterministic contour-line art — stands in for microscopy footage. */
function FitnessLandscape() {
	const rows = 14;
	const paths = Array.from({ length: rows }, (_, r) => {
		const y = 40 + r * 34;
		const amp = 14 + r * 5;
		const phase = r * 0.9;
		let d = `M 0 ${y}`;
		for (let x = 0; x <= 480; x += 24) {
			d += ` L ${x} ${y + Math.sin(x / 90 + phase) * amp * Math.exp(-((x - 240) ** 2) / 42000)}`;
		}
		return d;
	});
		return (
			<figure className="glass relative aspect-[4/3] overflow-hidden rounded-3xl">
				<svg viewBox="0 0 480 500" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
					{paths.map((d, i) => (
						<path
							key={i}
							d={d}
							fill="none"
							stroke={i === 7 ? '#25D0A6' : '#0B2A6B'}
							strokeOpacity={i === 7 ? 0.9 : 0.12 + (i / rows) * 0.2}
							strokeWidth={i === 7 ? 2 : 1.2}
						/>
					))}
				</svg>
				<figcaption className="absolute bottom-4 left-4 rounded-full bg-ink/85 px-4 py-2 font-mono text-[10px] tracking-[0.18em] text-paper/90">
					{copy.science.caption}
				</figcaption>
			</figure>
		);
}

export function Science() {
	const head = useReveal<HTMLDivElement>();
	const list = useReveal<HTMLUListElement>({ stagger: true });
	const fig = useReveal<HTMLDivElement>({ y: 40 });
	return (
		<section id={copy.science.id} className="mx-auto max-w-[1240px] px-6 py-28 md:py-40">
			<div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
				<div>
					<div ref={head}>
						<SectionHead kicker={copy.science.kicker} title={copy.science.title} />
						<p className="mt-6 max-w-[52ch] text-lg leading-relaxed text-ink/65">{copy.science.body}</p>
					</div>
					<ul ref={list} className="mt-10 space-y-4 border-t border-mist pt-8">
						{copy.science.points.map(p => (
							<li key={p.label} className="flex items-baseline gap-4">
								<span className="w-16 shrink-0 font-display text-xl font-semibold tabular-nums text-accent">{p.k}</span>
								<span className="text-sm text-ink/60">{p.label}</span>
							</li>
						))}
					</ul>
				</div>
				<div ref={fig}>
					<FitnessLandscape />
				</div>
			</div>
		</section>
	);
}

/* ---------------- Design loop / Scale story ---------------- */

function JourneyVisual({ active }: { active: number }) {
	const angles = [-26, 46, 132, 218];
	return (
		<div className="relative mx-auto aspect-square w-full max-w-[560px] overflow-hidden rounded-[2rem] border border-paper/10 bg-abyss">
			<div className="absolute inset-0 bg-[radial-gradient(circle_at_52%_48%,rgb(62_99_242/0.25),transparent_42%),radial-gradient(circle_at_70%_20%,rgb(37_208_166/0.16),transparent_28%)]" aria-hidden />
			<svg viewBox="0 0 600 600" className="relative h-full w-full" role="img" aria-label="Abstract design loop moving from target geometry through fold, sequence, and assay evidence">
				<defs>
					<radialGradient id="journeyCore" cx="50%" cy="45%" r="50%">
						<stop offset="0" stopColor="#F6F7F9" stopOpacity="0.95" />
						<stop offset="0.12" stopColor="#25D0A6" stopOpacity="0.72" />
						<stop offset="0.5" stopColor="#3E63F2" stopOpacity="0.2" />
						<stop offset="1" stopColor="#3E63F2" stopOpacity="0" />
					</radialGradient>
				</defs>
				<g fill="none" stroke="#F6F7F9" strokeOpacity="0.12">
					<circle cx="300" cy="300" r="92" />
					<circle cx="300" cy="300" r="150" strokeDasharray="3 11" />
					<circle cx="300" cy="300" r="214" strokeDasharray="1 15" />
					<circle cx="300" cy="300" r="266" />
				</g>
				<g className="journey-orbit" style={{ transformOrigin: '300px 300px', transform: `rotate(${active * 16}deg)` }}>
					<path d="M96 338 C160 124 346 104 476 224 C536 280 498 412 348 454 C218 490 124 440 96 338Z" fill="none" stroke="#3E63F2" strokeOpacity="0.7" strokeWidth="2" />
					<path d="M136 214 C244 112 430 170 456 314 C478 434 310 502 196 424 C112 366 92 286 136 214Z" fill="none" stroke="#25D0A6" strokeOpacity="0.55" strokeWidth="1.5" />
					<circle cx="300" cy="300" r="92" fill="url(#journeyCore)" />
					<circle cx="300" cy="300" r="12" fill="#F6F7F9" fillOpacity="0.85" />
					<circle cx="300" cy="300" r="24" fill="none" stroke="#25D0A6" strokeOpacity="0.6" />
					{angles.map((angle, index) => {
						const radians = (angle * Math.PI) / 180;
						const radius = 220;
						const x = 300 + Math.cos(radians) * radius;
						const y = 300 + Math.sin(radians) * radius;
						return <circle key={index} cx={x} cy={y} r={active === index ? 9 : 5} fill={active === index ? '#25D0A6' : '#F6F7F9'} fillOpacity={active === index ? 1 : 0.5} className="transition-all duration-500" />;
					})}
				</g>
				<text x="300" y="286" fill="#F6F7F9" fillOpacity="0.72" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="10" letterSpacing="2">DESIGN LOOP</text>
				<text x="300" y="324" fill="#F6F7F9" textAnchor="middle" fontFamily="Geologica, sans-serif" fontSize="19" fontWeight="600">{String(active + 1).padStart(2, '0')} / 04</text>
			</svg>
			<div className="absolute bottom-5 left-5 right-5 flex items-center justify-between font-mono text-[9px] tracking-[0.18em] text-paper/40">
				<span>ITERATIVE DESIGN SYSTEM</span>
				<span className="text-bio">PDB 4OO8</span>
			</div>
		</div>
	);
}

export function Journey() {
	const [active, setActive] = useState(0);
	const head = useReveal<HTMLDivElement>();
	const list = useReveal<HTMLDivElement>({ stagger: true });
	const sectionRef = useRef<HTMLElement>(null);

	// The loop should read as a loop: it advances itself (contract §5 continuous
	// motion) and pauses while the visitor is reading or driving it — hover or
	// keyboard focus both stop the cycle. Cancelled entirely under reduced motion.
	useEffect(() => {
		if (prefersReducedMotion()) return;
		const el = sectionRef.current;
		if (!el) return;
		let timer: number | undefined;
		const stop = () => window.clearInterval(timer);
		const start = () => {
			stop();
			timer = window.setInterval(() => setActive(a => (a + 1) % copy.journey.steps.length), 4500);
		};
		start();
		el.addEventListener('pointerenter', stop);
		el.addEventListener('pointerleave', start);
		el.addEventListener('focusin', stop);
		el.addEventListener('focusout', start);
		return () => {
			stop();
			el.removeEventListener('pointerenter', stop);
			el.removeEventListener('pointerleave', start);
			el.removeEventListener('focusin', stop);
			el.removeEventListener('focusout', start);
		};
	}, []);

	return (
		<section id={copy.journey.id} ref={sectionRef} data-surface="dark" className="overflow-hidden bg-ink py-28 text-paper md:py-40">
			<div className="mx-auto max-w-[1240px] px-6">
				<div className="grid items-center gap-14 lg:grid-cols-[0.78fr_1.22fr] lg:gap-20">
					<div ref={head}>
						<SectionHead kicker={copy.journey.kicker} title={copy.journey.title} dark />
						<p className="mt-6 max-w-[48ch] text-lg leading-relaxed text-paper/60">{copy.journey.body}</p>
						<div className="mt-10 flex items-center gap-4 font-mono text-[10px] tracking-[0.18em] text-paper/40">
							<span className="h-px w-8 bg-bio" aria-hidden />
							<span>MODEL-ASSAY FEEDBACK</span>
						</div>
					</div>
					<JourneyVisual active={active} />
				</div>

				<div ref={list} className="mt-14 grid gap-3 md:grid-cols-2 lg:mt-20 lg:grid-cols-4">
					{copy.journey.steps.map((step, index) => (
						<button
							key={step.n}
							type="button"
							onClick={() => setActive(index)}
							aria-pressed={active === index}
							className={`spotlight spotlight-dark group relative min-h-[220px] overflow-hidden rounded-3xl border p-5 text-left transition-all duration-500 hover:-translate-y-1 active:scale-[0.99] ${active === index ? 'border-bio/70 bg-paper/[0.1]' : 'border-paper/10 bg-paper/[0.03] hover:border-paper/25 hover:bg-paper/[0.06]'}`}
						>
							<div className="flex items-center justify-between font-mono text-[10px] tracking-[0.18em]">
								<span className={active === index ? 'text-bio' : 'text-paper/40'}>{step.n}</span>
								<span className="text-paper/35">{step.metric}</span>
							</div>
							<h3 className="mt-14 font-display text-xl font-semibold">{step.title}</h3>
							<p className="mt-2 text-sm leading-relaxed text-paper/55">{step.body}</p>
							<span className={`mt-5 inline-block h-px transition-all duration-500 ${active === index ? 'w-10 bg-bio' : 'w-5 bg-paper/25 group-hover:w-8'}`} aria-hidden />
						</button>
					))}
				</div>
			</div>
		</section>
	);
}

/* ---------------- Technology / Research ---------------- */

export function Platform() {
	const head = useReveal<HTMLDivElement>();
	const grid = useReveal<HTMLOListElement>({ stagger: true });
	const pathRef = useRef<SVGPathElement>(null);
	const sectionRef = useRef<HTMLElement>(null);

	useEffect(() => {
		const path = pathRef.current;
		if (!path || prefersReducedMotion()) return;
		const len = path.getTotalLength();
		path.style.strokeDasharray = `${len}`;
		path.style.strokeDashoffset = `${len}`;
		const ctx = gsap.context(() => {
			gsap.to(path, {
				strokeDashoffset: 0,
				ease: 'none',
				scrollTrigger: { trigger: sectionRef.current, start: 'top 70%', end: 'bottom 75%', scrub: 1 },
			});
		});
		return () => ctx.revert();
	}, []);

	return (
		<section id={copy.platform.id} ref={sectionRef} className="bg-white/60 py-28 md:py-40">
			<div className="mx-auto max-w-[1240px] px-6">
				<div ref={head}>
					<SectionHead kicker={copy.platform.kicker} title={copy.platform.title} />
				</div>

				<div className="relative mt-16 md:mt-24">
					{/* Drawn connection line (desktop); nodes are positioned on-curve approximately — visual pairing, not geometry */}
					<svg viewBox="0 0 1200 220" className="absolute inset-x-0 top-6 hidden h-[180px] w-full lg:block" aria-hidden>
						<path
							ref={pathRef}
							d="M 40 170 C 300 60, 500 210, 660 120 S 980 40, 1160 130"
							fill="none"
							stroke="#3E63F2"
							strokeWidth="2"
							strokeLinecap="round"
						/>
					</svg>
					<ol ref={grid} className="relative grid gap-10 md:grid-cols-2 lg:grid-cols-4">
						{copy.platform.steps.map(s => (
							<li key={s.n} className="group relative">
								<div className="flex items-center gap-3">
									<span className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-accent bg-paper font-mono text-xs text-accent transition-colors duration-200 group-hover:bg-accent group-hover:text-paper">
										{s.n}
									</span>
									<span className="h-px flex-1 bg-mist lg:hidden" aria-hidden />
								</div>
								<h3 className="mt-5 font-display text-xl font-semibold">{s.title}</h3>
								<p className="mt-2 text-sm leading-relaxed text-ink/60">{s.body}</p>
							</li>
						))}
					</ol>
				</div>
			</div>
		</section>
	);
}

/* ---------------- Capabilities ---------------- */

type CapabilityItem = (typeof copy.capabilities.items)[number];

function CapabilityCard({ item, index }: { item: CapabilityItem; index: number }) {
	// Feature card is the only one that earns 3D tilt; the rest get the cheaper
	// spotlight so the section still feels alive without four tracked surfaces.
	const tilt = useTilt<HTMLElement>(index === 0 ? 4.5 : 3);
	const Icon = ICONS[item.icon];
	const tone =
		index === 0
			? 'border-ink bg-ink text-paper lg:col-span-7 lg:row-span-3'
			: index === 1
				? 'border-accent/20 bg-accent/[0.08] lg:col-span-5'
				: index === 2
					? 'border-mist bg-white/75 lg:col-span-5'
					: 'border-bio/20 bg-bio/[0.09] lg:col-span-5';
	return (
		<article
			ref={tilt}
			{...(index === 0 ? { 'data-surface': 'dark' } : {})}
			className={`spotlight ${index === 0 ? 'spotlight-dark' : ''} group relative overflow-hidden rounded-3xl border p-7 transition-shadow duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:shadow-[0_30px_80px_-40px_rgb(11_42_107/0.55)] ${tone}`}
		>
			<div className={`relative z-10 inline-flex rounded-2xl p-3 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-6 ${index === 0 ? 'bg-paper/10 text-bio group-hover:bg-bio/15' : 'bg-mist/50 text-deep group-hover:bg-accent/10 group-hover:text-accent'}`}>
				<Icon size={22} />
			</div>
			<h3 className={`relative z-10 mt-5 font-display text-xl font-semibold transition-colors duration-200 ${index === 0 ? 'lg:mt-24 group-hover:text-bio' : 'group-hover:text-accent'}`}>{item.title}</h3>
			<p className={`relative z-10 mt-2 max-w-[42ch] text-sm leading-relaxed ${index === 0 ? 'text-paper/60' : 'text-ink/60'}`}>{item.body}</p>
			<span
				aria-hidden
				className={`relative z-10 mt-6 block h-px w-8 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-16 ${index === 0 ? 'bg-bio/70' : 'bg-accent/50'}`}
			/>
			{index === 0 && (
				<div className="pointer-events-none absolute -bottom-12 -right-6 h-64 w-64 rounded-full border border-bio/20 transition-transform duration-700 group-hover:scale-110" aria-hidden>
					<div className="absolute inset-8 rounded-full border border-paper/10" />
					<div className="absolute inset-20 rounded-full bg-bio/15 blur-3xl" />
				</div>
			)}
		</article>
	);
}

export function Capabilities() {
	const head = useReveal<HTMLDivElement>();
	const grid = useReveal<HTMLDivElement>({ stagger: true });
	return (
		<section id={copy.capabilities.id} className="mx-auto max-w-[1240px] px-6 py-28 md:py-40">
			<div ref={head}>
				<SectionHead kicker={copy.capabilities.kicker} title={copy.capabilities.title} />
			</div>
			<div ref={grid} className="mt-14 grid gap-5 lg:grid-cols-12 lg:grid-rows-3">
				{copy.capabilities.items.map((item, index) => (
					<CapabilityCard key={item.title} item={item} index={index} />
				))}
			</div>
		</section>
	);
}

/* ---------------- Stats / Impact ---------------- */

function Sparkline({ data, className }: { data: readonly number[]; className?: string }) {
	const max = Math.max(...data, 1);
	const pts = data.map((v, i) => `${(i / (data.length - 1)) * 100},${30 - (v / max) * 27}`).join(' ');
	return (
		<svg viewBox="0 0 100 32" className={className} aria-hidden preserveAspectRatio="none">
			<polyline data-spark points={pts} fill="none" stroke="#25D0A6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	);
}

export function Stats() {
	const head = useReveal<HTMLDivElement>();
	const grid = useReveal<HTMLDivElement>({ stagger: true });
	const sectionRef = useRef<HTMLElement>(null);

	useEffect(() => {
		if (!sectionRef.current) return;
		const els = sectionRef.current.querySelectorAll<HTMLElement>('[data-count]');
		// Reduced motion: show final values immediately — no animation, no wrong "0%" state
		if (prefersReducedMotion()) {
			els.forEach(el => {
				el.textContent = parseFloat(el.dataset.count!).toFixed(parseInt(el.dataset.decimals ?? '0', 10)) + (el.dataset.suffix ?? '');
			});
			return;
		}
		const ctx = gsap.context(() => {
			els.forEach(el => {
				const target = parseFloat(el.dataset.count!);
				const decimals = parseInt(el.dataset.decimals ?? '0', 10);
				const suffix = el.dataset.suffix ?? '';
				const state = { v: 0 };
				gsap.to(state, {
					v: target,
					duration: 1.8,
					ease: EXPO_OUT,
					scrollTrigger: { trigger: el, start: 'top 88%', once: true },
					onUpdate: () => { el.textContent = state.v.toFixed(decimals) + suffix; },
				});
			});
			// Contract §5: "count-up + sparkline draw on enter" — dash-draw each trend line
			sectionRef.current!.querySelectorAll<SVGPolylineElement>('[data-spark]').forEach(line => {
				const len = line.getTotalLength();
				line.style.strokeDasharray = `${len}`;
				line.style.strokeDashoffset = `${len}`;
				gsap.to(line, {
					strokeDashoffset: 0,
					duration: 1.4,
					ease: EXPO_OUT,
					scrollTrigger: { trigger: line, start: 'top 90%', once: true },
				});
			});
		}, sectionRef);
		return () => ctx.revert();
	}, []);

	return (
		<section id={copy.stats.id} ref={sectionRef} data-surface="dark" className="bg-ink py-28 text-paper md:py-40">
			<div className="mx-auto max-w-[1240px] px-6">
				<div ref={head}>
					<SectionHead kicker={copy.stats.kicker} title={copy.stats.title} />
				</div>
				<div ref={grid} className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-paper/10 bg-paper/10 sm:grid-cols-2 lg:grid-cols-4">
					{copy.stats.items.map(s => (
						<div key={s.label} className="spotlight spotlight-dark relative bg-ink p-7 transition-colors duration-300 hover:bg-paper/[0.06]">
							<p
								className="font-display text-5xl font-semibold tracking-tight tabular-nums text-paper"
								data-count={s.value}
								data-decimals={s.decimals ?? 0}
								data-suffix={s.suffix}
							>
								0{s.suffix}
							</p>
							<p className="mt-2 text-sm text-paper/55">{s.label}</p>
							<Sparkline data={s.spark} className="mt-6 h-8 w-full text-bio" />
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

/* ---------------- Final CTA + Footer ---------------- */

export function Cta() {
	const inner = useReveal<HTMLDivElement>();
	const button = useMagnetic<HTMLAnchorElement>(0.3);
	return (
		<section id={copy.cta.id} className="px-6 pb-10 pt-4">
			<div data-surface="dark" className="relative mx-auto max-w-[1240px] overflow-hidden rounded-[2.5rem] bg-ink text-paper">
				{/* single saturated glow — the only gradient allowed in UI (contract §4C) */}
				<div className="absolute -top-1/3 right-[-10%] h-[480px] w-[480px] rounded-full bg-accent/25 blur-[120px]" aria-hidden />
				<div ref={inner} className="relative px-8 py-24 text-center md:py-32">
					<SectionHead kicker={copy.cta.kicker} title={copy.cta.title} dark center />
					<p className="mx-auto mt-6 max-w-[46ch] text-lg leading-relaxed text-paper/60">{copy.cta.body}</p>
					<a
						ref={button}
						href={`mailto:${copy.cta.email}`}
						className="group mt-10 inline-flex items-center gap-2 rounded-full bg-accent px-8 py-4 text-sm font-semibold text-paper transition-all duration-200 hover:scale-[1.04] hover:bg-bio hover:text-ink hover:shadow-[0_8px_32px_-8px_rgb(37_208_166/0.6)] active:scale-[0.97]"
					>
						{copy.cta.button}
						<ArrowUpRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
					</a>
				</div>
				<footer className="relative flex flex-col items-center justify-between gap-3 border-t border-paper/10 px-8 py-6 font-mono text-[11px] tracking-wide text-paper/40 md:flex-row">
					<span>{copy.footer.pdb}</span>
					<div className="flex items-center gap-5">
						{copy.footer.links.map(l => (
							<Link key={l.href} href={l.href} className="link-underline transition-colors duration-200 hover:text-bio">
								{l.label}
							</Link>
						))}
						<span className="text-paper/25" aria-hidden>
							{copy.footer.rights}
						</span>
					</div>
				</footer>
			</div>
		</section>
	);
}
