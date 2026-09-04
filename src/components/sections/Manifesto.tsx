'use client';

/**
 * Scroll-scrubbed manifesto. Every word starts dim and lights up as the section
 * passes through the viewport — the classic editorial "read-along" treatment,
 * done with one ScrollTrigger scrub over a stagger rather than per-word triggers.
 */
import { useEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { copy } from '@/lib/copy';
import { prefersReducedMotion } from '@/lib/motion';

gsap.registerPlugin(ScrollTrigger);

export function Manifesto() {
	const root = useRef<HTMLElement>(null);
	const words = useMemo(() => copy.manifesto.body.split(' '), []);

	useEffect(() => {
		const el = root.current;
		if (!el || prefersReducedMotion()) return;
		const ctx = gsap.context(() => {
			gsap.fromTo(
				'[data-word]',
				{ opacity: 0.16 },
				{
					opacity: 1,
					ease: 'none',
					stagger: 0.5,
					scrollTrigger: { trigger: el, start: 'top 72%', end: 'bottom 65%', scrub: 0.6 },
				},
			);
		}, el);
		return () => ctx.revert();
	}, []);

	return (
		<section id={copy.manifesto.id} ref={root} className="relative py-32 md:py-52">
			<div className="mx-auto max-w-[1100px] px-6 md:px-10">
				<p className="kicker flex items-center gap-3 text-paper/45">
					<span className="inline-block h-px w-8 bg-bio" aria-hidden />
					{copy.manifesto.kicker}
				</p>
				<p className="mt-10 font-display text-[clamp(1.6rem,3.6vw,2.9rem)] font-medium leading-[1.28] tracking-[-0.02em] text-paper">
					{words.map((word, index) => (
						<span key={`${word}-${index}`} data-word className="inline-block opacity-100 md:opacity-[0.16]">
							{word}
							{index < words.length - 1 ? '\u00A0' : ''}
						</span>
					))}
				</p>
				<p className="mt-12 font-mono text-[10px] tracking-[0.22em] text-paper/35">
					{copy.manifesto.signature}
				</p>
			</div>
		</section>
	);
}
