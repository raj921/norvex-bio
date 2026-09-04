'use client';

/** Ambient chrome: scroll rail, section counter, and the marquee ticker band. */
import { motion, useScroll, useSpring } from 'motion/react';
import { copy } from '@/lib/copy';
import { useScene } from '@/lib/scene-store';

/** Thin gradient progress bar, spring-smoothed by motion's scroll hooks. */
export function ScrollRail() {
	const { scrollYProgress } = useScroll();
	const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4 });
	return (
		<motion.div
			aria-hidden
			style={{ scaleX }}
			className="fixed inset-x-0 top-0 z-[80] h-[2px] origin-left bg-gradient-to-r from-accent via-bio to-accent"
		/>
	);
}

/** Fixed vertical section readout on the left edge (desktop only). */
export function SectionCounter() {
	const { phase, ready } = useScene();
	const order: string[] = ['hero', ...copy.nav.links.map(link => link.href.slice(1)), 'contact'];
	const index = Math.max(0, order.indexOf(phase));
	return (
		<motion.div
			aria-hidden
			initial={{ opacity: 0 }}
			animate={{ opacity: ready ? 1 : 0 }}
			transition={{ duration: 0.8, delay: 0.6 }}
			className="fixed left-6 top-1/2 z-[60] hidden -translate-y-1/2 flex-col items-center gap-3 xl:flex"
		>
			<span className="font-mono text-[10px] tracking-[0.2em] text-paper/50">
				{String(index + 1).padStart(2, '0')}
			</span>
			<span className="relative h-28 w-px bg-paper/15">
				<motion.span
					className="absolute inset-x-0 top-0 bg-bio"
					animate={{ height: `${((index + 1) / order.length) * 100}%` }}
					transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
				/>
			</span>
			<span className="font-mono text-[10px] tracking-[0.2em] text-paper/30">
				{String(order.length).padStart(2, '0')}
			</span>
		</motion.div>
	);
}

/** Edge-faded capability marquee. Pauses on hover, static under reduced motion. */
export function Ticker() {
	const items = [...copy.ticker, ...copy.ticker];
	return (
		<div aria-hidden className="marquee relative overflow-hidden border-y border-paper/10 bg-abyss/60 py-4 backdrop-blur-sm">
			<div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-28 bg-gradient-to-r from-abyss to-transparent" />
			<div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-28 bg-gradient-to-l from-abyss to-transparent" />
			<div className="marquee-track">
				{items.map((item, index) => (
					<span key={`${item}-${index}`} className="flex items-center gap-8 pr-8 font-mono text-[11px] tracking-[0.24em] text-paper/40">
						{item}
						<span className="inline-block h-1 w-1 rounded-full bg-bio/70" />
					</span>
				))}
			</div>
		</div>
	);
}
