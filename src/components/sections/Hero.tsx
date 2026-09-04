'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { copy } from '@/lib/copy';
import { EXPO_OUT, prefersReducedMotion, useMagnetic } from '@/lib/motion';
import { useScene } from '@/lib/scene-store';

/**
 * Hero. The 3D specimen lives in the persistent canvas behind this, so the
 * section itself is pure typography: a masked line-by-line headline plus a
 * telemetry readout, all sequenced off the preloader's `ready` flag.
 */
export function Hero() {
	const { ready } = useScene();
	const root = useRef<HTMLElement>(null);
	const primary = useMagnetic<HTMLAnchorElement>(0.28);
	const secondary = useMagnetic<HTMLAnchorElement>(0.22);

	useEffect(() => {
		if (!ready || !root.current) return;
		if (prefersReducedMotion()) return;
		const ctx = gsap.context(() => {
			const tl = gsap.timeline({ defaults: { ease: EXPO_OUT } });
			tl.from('[data-hero-line]', { yPercent: 118, duration: 1.25, stagger: 0.09 }, 0)
				.from('[data-hero-fade]', { opacity: 0, y: 26, duration: 1, stagger: 0.08 }, 0.25)
				.from('[data-hero-readout] > *', { opacity: 0, y: 18, duration: 0.8, stagger: 0.06 }, 0.7);
		}, root);
		return () => ctx.revert();
	}, [ready]);

	return (
		<section
			id="hero"
			ref={root}
			className="relative flex min-h-[100svh] items-center pt-28 pb-16"
		>
			<div className="mx-auto grid w-full max-w-[1320px] grid-cols-1 gap-12 px-6 md:px-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
				<div>
					<p data-hero-fade className="kicker flex items-center gap-3 text-paper/55">
						<span className="inline-block h-px w-8 bg-bio" aria-hidden />
						{copy.hero.kicker}
					</p>

					<h1 className="mt-7 font-display text-[clamp(3rem,7.5vw,6.5rem)] font-semibold leading-[0.96] tracking-[-0.03em] text-paper">
						{copy.hero.headline.map(line => (
							<span key={line} className="line-mask">
								<span data-hero-line className="block">
									{line === copy.hero.headline[1] ? (
										<>
											<em className="font-editorial font-normal italic text-bio">{copy.hero.italicWord}</em>
											{line.replace(copy.hero.italicWord, '')}
										</>
									) : (
										line
									)}
								</span>
							</span>
						))}
					</h1>

					<p data-hero-fade className="mt-8 max-w-[46ch] text-lg leading-relaxed text-paper/65">
						{copy.hero.sub}
					</p>

					<div data-hero-fade className="mt-10 flex flex-wrap items-center gap-4">
						<a
							ref={primary}
							href="#platform"
							className="group inline-flex items-center gap-2 rounded-full bg-paper px-6 py-3.5 text-sm font-medium text-ink transition-colors duration-200 hover:bg-bio"
						>
							{copy.hero.primaryCta}
							<ArrowUpRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
						</a>
						<a
							ref={secondary}
							href="#science"
							className="rounded-full border border-paper/25 px-6 py-3.5 text-sm font-medium text-paper transition-colors duration-200 hover:border-bio hover:text-bio"
						>
							{copy.hero.secondaryCta}
						</a>
					</div>
				</div>

				<div className="lg:justify-self-end">
					<div data-hero-readout className="glass-dark w-full max-w-[320px] rounded-3xl p-5">
						<div className="flex items-center justify-between font-mono text-[9px] tracking-[0.2em] text-paper/45">
							<span>MODEL READOUT</span>
							<span className="flex items-center gap-1.5 text-bio">
								<span className="live-dot inline-block h-1.5 w-1.5 rounded-full bg-bio" />
								LIVE
							</span>
						</div>
						<dl className="mt-6 grid grid-cols-2 gap-x-5 gap-y-5">
							{copy.hero.readout.map(item => (
								<div key={item.label}>
									<dt className="font-mono text-[9px] tracking-[0.16em] text-paper/40">{item.label}</dt>
									<dd className="mt-1.5 font-display text-lg font-semibold text-paper">{item.value}</dd>
								</div>
							))}
						</dl>
					</div>
				</div>
			</div>

			<div className="pointer-events-none absolute inset-x-0 bottom-6 mx-auto flex max-w-[1320px] items-end justify-between px-6 md:px-10">
				<p data-hero-fade className="font-mono text-[10px] tracking-[0.2em] text-paper/40">
					{copy.hero.specimen}
				</p>
				<span data-hero-fade className="hidden items-center gap-2 font-mono text-[10px] tracking-[0.2em] text-paper/40 md:flex">
					SCROLL
					<ArrowDown size={12} className="animate-bounce-slow" />
				</span>
			</div>
		</section>
	);
}
