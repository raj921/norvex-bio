'use client';

/**
 * Science: split editorial layout. The figure is a deterministic contour render
 * of a fitness landscape whose ridge line draws itself on entry, paired with a
 * parallaxed stat list.
 */
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { copy } from '@/lib/copy';
import { EXPO_OUT, prefersReducedMotion, useParallax, useReveal, useSplitReveal } from '@/lib/motion';

gsap.registerPlugin(ScrollTrigger);

const ROWS = 15;

function FitnessLandscape() {
	const root = useRef<HTMLDivElement>(null);

	const paths = Array.from({ length: ROWS }, (_, r) => {
		const y = 36 + r * 32;
		const amp = 13 + r * 5;
		const phase = r * 0.9;
		let d = `M 0 ${y}`;
		for (let x = 0; x <= 480; x += 20) {
			d += ` L ${x} ${y + Math.sin(x / 90 + phase) * amp * Math.exp(-((x - 240) ** 2) / 42000)}`;
		}
		return d;
	});

	useEffect(() => {
		const el = root.current;
		if (!el || prefersReducedMotion()) return;
		const ctx = gsap.context(() => {
			const lines = el.querySelectorAll<SVGPathElement>('path');
			lines.forEach(line => {
				const length = line.getTotalLength();
				gsap.set(line, { strokeDasharray: length, strokeDashoffset: length });
			});
			gsap.to(lines, {
				strokeDashoffset: 0,
				duration: 1.6,
				ease: EXPO_OUT,
				stagger: 0.05,
				scrollTrigger: { trigger: el, start: 'top 82%', once: true },
			});
		}, el);
		return () => ctx.revert();
	}, []);

	return (
		<figure ref={root} className="glass-dark relative aspect-[4/3] overflow-hidden rounded-[2rem]">
			<svg viewBox="0 0 480 520" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
				{paths.map((d, i) => (
					<path
						key={i}
						d={d}
						fill="none"
						stroke={i === 7 ? '#25D0A6' : '#8FA5FF'}
						strokeOpacity={i === 7 ? 0.95 : 0.14 + (i / ROWS) * 0.22}
						strokeWidth={i === 7 ? 2 : 1.1}
					/>
				))}
			</svg>
			<figcaption className="absolute bottom-4 left-4 rounded-full bg-abyss/80 px-4 py-2 font-mono text-[10px] tracking-[0.18em] text-paper/80 backdrop-blur-sm">
				{copy.science.caption}
			</figcaption>
		</figure>
	);
}

export function Science() {
	const title = useSplitReveal<HTMLHeadingElement>();
	const body = useSplitReveal<HTMLParagraphElement>({ stagger: 0.05 });
	const list = useReveal<HTMLUListElement>({ stagger: true });
	const figure = useParallax<HTMLDivElement>(70);

	return (
		<section id={copy.science.id} className="relative py-28 md:py-40">
			<div className="mx-auto max-w-[1320px] px-6 md:px-10">
				<div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-24">
					<div>
						<p className="kicker flex items-center gap-3 text-paper/45">
							<span className="inline-block h-px w-8 bg-bio" aria-hidden />
							{copy.science.kicker}
						</p>
						<h2 ref={title} className="mt-6 max-w-[16ch] font-display text-[clamp(2.2rem,4.6vw,3.6rem)] font-semibold leading-[1.05] tracking-[-0.025em] text-paper">
							{copy.science.title}
						</h2>
						<p ref={body} className="mt-7 max-w-[52ch] text-lg leading-relaxed text-paper/60">
							{copy.science.body}
						</p>
						<ul ref={list} className="mt-12 space-y-5 border-t border-paper/10 pt-8">
							{copy.science.points.map(point => (
								<li key={point.label} className="flex items-baseline gap-5">
									<span className="w-24 shrink-0 font-display text-2xl font-semibold tabular-nums text-bio">{point.k}</span>
									<span className="text-sm text-paper/55">{point.label}</span>
								</li>
							))}
						</ul>
					</div>
					<div ref={figure}>
						<FitnessLandscape />
					</div>
				</div>
			</div>
		</section>
	);
}
