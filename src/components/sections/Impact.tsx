'use client';

/** Impact: count-up figures with self-drawing sparklines. */
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { copy } from '@/lib/copy';
import { EXPO_OUT, prefersReducedMotion, useReveal, useSplitReveal } from '@/lib/motion';

gsap.registerPlugin(ScrollTrigger);

function Sparkline({ data, className }: { data: readonly number[]; className?: string }) {
	const max = Math.max(...data, 1);
	const points = data.map((value, i) => `${(i / (data.length - 1)) * 100},${30 - (value / max) * 27}`).join(' ');
	return (
		<svg viewBox="0 0 100 32" className={className} aria-hidden preserveAspectRatio="none">
			<polyline data-spark points={points} fill="none" stroke="#25D0A6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	);
}

export function Impact() {
	const section = useRef<HTMLElement>(null);
	const title = useSplitReveal<HTMLHeadingElement>();
	const grid = useReveal<HTMLDivElement>({ stagger: true });

	useEffect(() => {
		const el = section.current;
		if (!el) return;
		const counters = el.querySelectorAll<HTMLElement>('[data-count]');

		// Reduced motion: render final values immediately, never a misleading "0".
		if (prefersReducedMotion()) {
			counters.forEach(node => {
				node.textContent =
					parseFloat(node.dataset.count!).toFixed(parseInt(node.dataset.decimals ?? '0', 10)) + (node.dataset.suffix ?? '');
			});
			return;
		}

		const ctx = gsap.context(() => {
			counters.forEach(node => {
				const target = parseFloat(node.dataset.count!);
				const decimals = parseInt(node.dataset.decimals ?? '0', 10);
				const suffix = node.dataset.suffix ?? '';
				const state = { value: 0 };
				gsap.to(state, {
					value: target,
					duration: 1.9,
					ease: EXPO_OUT,
					scrollTrigger: { trigger: node, start: 'top 88%', once: true },
					onUpdate: () => { node.textContent = state.value.toFixed(decimals) + suffix; },
				});
			});

			el.querySelectorAll<SVGPolylineElement>('[data-spark]').forEach(line => {
				const length = line.getTotalLength();
				gsap.set(line, { strokeDasharray: length, strokeDashoffset: length });
				gsap.to(line, {
					strokeDashoffset: 0,
					duration: 1.5,
					ease: EXPO_OUT,
					scrollTrigger: { trigger: line, start: 'top 90%', once: true },
				});
			});
		}, el);
		return () => ctx.revert();
	}, []);

	return (
		<section id={copy.impact.id} ref={section} className="relative py-28 md:py-40">
			<div className="mx-auto max-w-[1320px] px-6 md:px-10">
				<p className="kicker flex items-center gap-3 text-paper/45">
					<span className="inline-block h-px w-8 bg-bio" aria-hidden />
					{copy.impact.kicker}
				</p>
				<h2 ref={title} className="mt-6 max-w-[16ch] font-display text-[clamp(2.2rem,4.6vw,3.6rem)] font-semibold leading-[1.05] tracking-[-0.025em] text-paper">
					{copy.impact.title}
				</h2>

				<div ref={grid} className="mt-14 grid gap-px overflow-hidden rounded-[2rem] border border-paper/10 bg-paper/10 sm:grid-cols-2 lg:grid-cols-4">
					{copy.impact.items.map(item => (
						<div key={item.label} className="spotlight spotlight-dark relative bg-abyss/90 p-7 transition-colors duration-300 hover:bg-paper/[0.05]">
							<p
								className="font-display text-[clamp(2.4rem,4vw,3.2rem)] font-semibold tabular-nums tracking-tight text-paper"
								data-count={item.value}
								data-decimals={item.decimals}
								data-suffix={item.suffix}
							>
								0{item.suffix}
							</p>
							<p className="mt-2 text-sm text-paper/55">{item.label}</p>
							<Sparkline data={item.spark} className="mt-8 h-8 w-full" />
						</div>
					))}
				</div>

				<p className="mt-6 font-mono text-[10px] tracking-[0.16em] text-paper/30">{copy.impact.note}</p>
			</div>
		</section>
	);
}
