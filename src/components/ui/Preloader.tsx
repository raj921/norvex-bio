'use client';

/**
 * Entrance curtain. Locks scroll, counts the loader to 100, then wipes upward
 * and hands off to the hero timeline via `setReady`.
 * Reduced motion skips straight to the site with no counter and no lock.
 */
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { copy } from '@/lib/copy';
import { EASE_CSS, startScroll, stopScroll } from '@/lib/motion';
import { setReady } from '@/lib/scene-store';

const EASE = [0.16, 1, 0.3, 1] as const;

export function Preloader() {
	const reduced = useReducedMotion();
	const [visible, setVisible] = useState(true);
	const [progress, setProgress] = useState(0);
	const started = useRef(false);

	useEffect(() => {
		if (started.current) return;
		started.current = true;

		if (reduced) {
			// Defer out of the effect body so React never sees a synchronous
			// setState cascade on mount.
			const id = window.setTimeout(() => {
				setVisible(false);
				setReady(true);
			}, 0);
			return () => window.clearTimeout(id);
		}

		stopScroll();
		window.scrollTo(0, 0);

		let value = 0;
		let raf = 0;
		let last = performance.now();

		const tick = (now: number) => {
			const delta = Math.min(now - last, 48);
			last = now;
			// Ease toward 100 so the count decelerates instead of running linearly.
			value += Math.max(0.35, (100 - value) * 0.012) * (delta / 16);
			if (value >= 100) {
				value = 100;
				setProgress(100);
				window.setTimeout(() => {
					setVisible(false);
					startScroll();
					setReady(true);
				}, 420);
				return;
			}
			setProgress(value);
			raf = requestAnimationFrame(tick);
		};
		raf = requestAnimationFrame(tick);

		return () => {
			cancelAnimationFrame(raf);
			startScroll();
		};
	}, [reduced]);

	const stepIndex = Math.min(copy.preloader.steps.length - 1, Math.floor((progress / 100) * copy.preloader.steps.length));

	return (
		<AnimatePresence>
			{visible && (
				<motion.div
					key="preloader"
					className="fixed inset-0 z-[90] flex flex-col justify-between bg-abyss px-6 py-8 text-paper md:px-10 md:py-10"
					initial={{ y: 0 }}
					exit={{ y: '-100%' }}
					transition={{ duration: 1, ease: EASE }}
					aria-hidden
				>
					<div className="flex items-baseline justify-between font-mono text-[10px] tracking-[0.24em] text-paper/45">
						<span>{copy.company.toUpperCase()}</span>
						<span>{copy.preloader.label}</span>
					</div>

					<div className="flex items-end justify-between gap-6">
						<div className="overflow-hidden">
							<motion.p
								className="font-mono text-[11px] tracking-[0.22em] text-bio"
								key={stepIndex}
								initial={{ y: 16, opacity: 0 }}
								animate={{ y: 0, opacity: 1 }}
								transition={{ duration: 0.5, ease: EASE }}
							>
								{copy.preloader.steps[stepIndex]}
							</motion.p>
						</div>
						<span className="font-display text-[clamp(3.5rem,14vw,10rem)] font-semibold leading-none tabular-nums tracking-tight">
							{String(Math.floor(progress)).padStart(3, '0')}
						</span>
					</div>

					<div className="h-px w-full bg-paper/15">
						<div
							className="h-full bg-gradient-to-r from-accent to-bio"
							style={{ width: `${progress}%`, transition: `width 120ms ${EASE_CSS}` }}
						/>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
