'use client';

/**
 * Platform: an interactive accordion/detail split. Selecting a discipline swaps
 * the detail panel with a shared-layout transition and publishes the index to
 * the 3D scene. Keyboard-navigable with roving arrow keys.
 */
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { copy } from '@/lib/copy';
import { useSplitReveal, useTilt } from '@/lib/motion';
import { sceneState } from '@/lib/scene-store';
import { cn } from '@/lib/utils';

const EASE = [0.16, 1, 0.3, 1] as const;

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

export function Platform() {
	const [active, setActive] = useState(0);
	const title = useSplitReveal<HTMLHeadingElement>();
	const panel = useTilt<HTMLDivElement>(4);
	const buttons = useRef<(HTMLButtonElement | null)[]>([]);

	// Publish selection to the shared 3D scene channel (write-only side effect).
	useEffect(() => {
		sceneState.platformIndex = active;
	}, [active]);

	const select = (index: number) => setActive(index);

	const onKeyDown = (event: React.KeyboardEvent, index: number) => {
		if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
		event.preventDefault();
		const next = event.key === 'ArrowDown'
			? (index + 1) % copy.platform.items.length
			: (index - 1 + copy.platform.items.length) % copy.platform.items.length;
		select(next);
		buttons.current[next]?.focus();
	};

	const item = copy.platform.items[active];
	const Icon = ICONS[item.icon];

	return (
		<section id={copy.platform.id} className="relative py-28 md:py-40">
			<div className="mx-auto max-w-[1320px] px-6 md:px-10">
				<div className="flex flex-wrap items-end justify-between gap-6">
					<div>
						<p className="kicker flex items-center gap-3 text-paper/45">
							<span className="inline-block h-px w-8 bg-bio" aria-hidden />
							{copy.platform.kicker}
						</p>
						<h2 ref={title} className="mt-6 max-w-[16ch] font-display text-[clamp(2.2rem,4.6vw,3.6rem)] font-semibold leading-[1.05] tracking-[-0.025em] text-paper">
							{copy.platform.title}
						</h2>
					</div>
					<p className="max-w-[34ch] text-[15px] leading-relaxed text-paper/55">{copy.platform.body}</p>
				</div>

				<div className="mt-14 grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-12">
					{/* Selector list */}
					<ul className="flex flex-col border-t border-paper/10">
						{copy.platform.items.map((entry, index) => {
							const isActive = index === active;
							const EntryIcon = ICONS[entry.icon];
							return (
								<li key={entry.title} className="border-b border-paper/10">
									<button
										ref={element => { buttons.current[index] = element; }}
										type="button"
										onClick={() => select(index)}
										onKeyDown={event => onKeyDown(event, index)}
										aria-expanded={isActive}
										className="group relative flex w-full items-center gap-5 py-6 text-left transition-colors duration-300"
									>
										{isActive && (
											<motion.span
												layoutId="platform-marker"
												className="absolute left-0 top-0 h-full w-px bg-bio"
												transition={{ duration: 0.5, ease: EASE }}
											/>
										)}
										<span
											className={cn(
												'ml-4 inline-flex rounded-xl p-2.5 transition-all duration-300',
												isActive ? 'bg-bio/15 text-bio' : 'bg-paper/5 text-paper/45 group-hover:text-paper',
											)}
										>
											<EntryIcon size={20} />
										</span>
										<span className="flex-1">
											<span className={cn('block font-display text-xl font-semibold transition-colors duration-300', isActive ? 'text-paper' : 'text-paper/60 group-hover:text-paper')}>
												{entry.title}
											</span>
											<span className="mt-1 block max-w-[46ch] text-sm leading-relaxed text-paper/45">
												{entry.body}
											</span>
										</span>
										<span className={cn('font-mono text-[10px] tracking-[0.2em] transition-colors duration-300', isActive ? 'text-bio' : 'text-paper/25')}>
											{String(index + 1).padStart(2, '0')}
										</span>
									</button>
								</li>
							);
						})}
					</ul>

					{/* Detail panel */}
					<div ref={panel} className="spotlight spotlight-dark glass-dark relative overflow-hidden rounded-[2rem] p-8 lg:p-10">
						<AnimatePresence mode="wait">
							<motion.div
								key={item.title}
								initial={{ opacity: 0, y: 24 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -16 }}
								transition={{ duration: 0.5, ease: EASE }}
							>
								<span className="inline-flex rounded-2xl bg-bio/15 p-3 text-bio">
									<Icon size={24} />
								</span>
								<h3 className="mt-6 font-display text-2xl font-semibold tracking-[-0.02em] text-paper">{item.title}</h3>
								<p className="mt-4 max-w-[46ch] text-[15px] leading-relaxed text-paper/60">{item.detail}</p>
								<dl className="mt-10 grid gap-px overflow-hidden rounded-2xl bg-paper/10 sm:grid-cols-3">
									{item.spec.map(([label, value]) => (
										<div key={label} className="bg-abyss/80 p-4">
											<dt className="font-mono text-[9px] tracking-[0.18em] text-paper/40">{label.toUpperCase()}</dt>
											<dd className="mt-2 font-display text-base font-semibold text-paper">{value}</dd>
										</div>
									))}
								</dl>
							</motion.div>
						</AnimatePresence>
						<div aria-hidden className="pointer-events-none absolute -bottom-20 -right-16 h-64 w-64 rounded-full bg-accent/20 blur-[90px]" />
					</div>
				</div>
			</div>
		</section>
	);
}
