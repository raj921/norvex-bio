'use client';

/**
 * Pinned horizontal rail — the centrepiece interaction.
 *
 * The section pins for 4 viewport-heights of scroll and translates the track
 * sideways, so vertical scrolling reads as lateral travel through the design
 * loop. Progress is published to `sceneState.pipelineStep` so the 3D specimen
 * reacts to the same input.
 *
 * Reduced motion / touch: the pin is skipped entirely and the same content
 * renders as a normal vertical stack (no scroll hijacking on phones).
 */
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { copy } from '@/lib/copy';
import { prefersReducedMotion } from '@/lib/motion';
import { sceneState } from '@/lib/scene-store';
import { cn } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger);

const STEPS = copy.pipeline.steps;

function StepCard({ step, index, active }: { step: (typeof STEPS)[number]; index: number; active: boolean }) {
	return (
		<article
			className={cn(
				'spotlight spotlight-dark relative flex h-full w-[86vw] shrink-0 flex-col justify-between overflow-hidden rounded-[2rem] border p-8 transition-colors duration-500 sm:w-[62vw] lg:w-[38vw] lg:p-10',
				active ? 'border-bio/50 bg-paper/[0.08]' : 'border-paper/10 bg-paper/[0.03]',
			)}
		>
			<div>
				<div className="flex items-center justify-between font-mono text-[10px] tracking-[0.2em]">
					<span className={active ? 'text-bio' : 'text-paper/40'}>{step.n}</span>
					<span className="text-paper/35">{step.metric}</span>
				</div>
				<p className="mt-10 font-mono text-[11px] tracking-[0.2em] text-paper/45">{step.label.toUpperCase()}</p>
				<h3 className="mt-3 font-display text-[clamp(1.6rem,2.6vw,2.2rem)] font-semibold leading-tight tracking-[-0.02em] text-paper">
					{step.title}
				</h3>
				<p className="mt-4 max-w-[42ch] text-[15px] leading-relaxed text-paper/60">{step.body}</p>
			</div>

			<div className="mt-10 flex items-end justify-between border-t border-paper/10 pt-6">
				<div>
					<p className="font-display text-3xl font-semibold tabular-nums text-paper">{step.stat.value}</p>
					<p className="mt-1 font-mono text-[10px] tracking-[0.16em] text-paper/40">{step.stat.label.toUpperCase()}</p>
				</div>
				<span className="font-mono text-[10px] tracking-[0.2em] text-paper/25">
					{String(index + 1).padStart(2, '0')} / {String(STEPS.length).padStart(2, '0')}
				</span>
			</div>

			<div
				aria-hidden
				className={cn(
					'pointer-events-none absolute -bottom-24 -right-20 h-72 w-72 rounded-full blur-[80px] transition-opacity duration-700',
					active ? 'bg-bio/20 opacity-100' : 'bg-accent/10 opacity-60',
				)}
			/>
		</article>
	);
}

export function Pipeline() {
	const section = useRef<HTMLElement>(null);
	const track = useRef<HTMLDivElement>(null);
	const [active, setActive] = useState(0);

	useEffect(() => {
		const sectionEl = section.current;
		const trackEl = track.current;
		if (!sectionEl || !trackEl) return;
		// No pinning for reduced motion or touch — the vertical fallback layout
		// already communicates the same sequence without hijacking scroll.
		if (prefersReducedMotion()) return;
		if (window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 1024) return;

		const ctx = gsap.context(() => {
			const distance = () => trackEl.scrollWidth - window.innerWidth + 96;
			gsap.to(trackEl, {
				x: () => -distance(),
				ease: 'none',
				scrollTrigger: {
					trigger: sectionEl,
					pin: true,
					scrub: 0.8,
					start: 'top top',
					end: () => `+=${distance()}`,
					invalidateOnRefresh: true,
					anticipatePin: 1,
					onUpdate: self => {
						sceneState.sectionProgress = self.progress;
						const step = Math.min(STEPS.length - 1, Math.floor(self.progress * STEPS.length));
						sceneState.pipelineStep = step;
						setActive(step);
					},
				},
			});
		}, sectionEl);

		return () => ctx.revert();
	}, []);

	return (
		<section id={copy.pipeline.id} ref={section} className="relative overflow-hidden py-28 lg:h-screen lg:py-0">
			<div className="mx-auto flex h-full max-w-[1320px] flex-col justify-center px-6 md:px-10">
				<div className="flex flex-wrap items-end justify-between gap-6 lg:pt-24">
					<div>
						<p className="kicker flex items-center gap-3 text-paper/45">
							<span className="inline-block h-px w-8 bg-bio" aria-hidden />
							{copy.pipeline.kicker}
						</p>
						<h2 className="mt-6 max-w-[18ch] font-display text-[clamp(2.2rem,4.6vw,3.6rem)] font-semibold leading-[1.05] tracking-[-0.025em] text-paper">
							{copy.pipeline.title}
						</h2>
					</div>
					<p className="max-w-[38ch] text-[15px] leading-relaxed text-paper/55">{copy.pipeline.body}</p>
				</div>

				{/* Progress rail — mirrors the pinned scrub on desktop. */}
				<div className="mt-10 hidden items-center gap-4 lg:flex">
					<div className="relative h-px flex-1 bg-paper/15">
						<div
							className="absolute inset-y-0 left-0 bg-bio transition-[width] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
							style={{ width: `${((active + 1) / STEPS.length) * 100}%` }}
						/>
					</div>
					<span className="font-mono text-[10px] tracking-[0.2em] text-paper/40">
						{String(active + 1).padStart(2, '0')} / {String(STEPS.length).padStart(2, '0')}
					</span>
				</div>
			</div>

			<div className="mt-12 overflow-hidden lg:mt-14">
				<div
					ref={track}
					className="flex flex-col gap-6 px-6 md:px-10 lg:h-[46vh] lg:flex-row lg:gap-8 lg:will-change-transform"
				>
					{STEPS.map((step, index) => (
						<StepCard key={step.n} step={step} index={index} active={active === index} />
					))}
					<div aria-hidden className="hidden w-24 shrink-0 lg:block" />
				</div>
			</div>
		</section>
	);
}
