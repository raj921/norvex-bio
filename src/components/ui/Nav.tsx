'use client';

/**
 * Header + fullscreen overlay menu.
 * The desktop nav shows a live section indicator driven by ScrollTrigger-fed
 * IntersectionObservers; the mobile/overlay menu is a staggered curtain.
 */
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { copy } from '@/lib/copy';
import { useMagnetic } from '@/lib/motion';
import { setPhase, useScene, type ScenePhase } from '@/lib/scene-store';
import { cn } from '@/lib/utils';

const EASE = [0.16, 1, 0.3, 1] as const;

function LogoMark({ className }: { className?: string }) {
	return (
		<svg viewBox="0 0 32 32" className={className} aria-hidden>
			<defs>
				<linearGradient id="norvex-logo" x1="0" y1="0" x2="1" y2="1">
					<stop offset="0" stopColor="#0B2A6B" />
					<stop offset="1" stopColor="#3E63F2" />
				</linearGradient>
			</defs>
			<rect width="32" height="32" rx="8" fill="url(#norvex-logo)" />
			<path d="M11 7c0 6 10 6 10 12M21 7c0 6-10 6-10 12" fill="none" stroke="#F6F7F9" strokeWidth="1.8" strokeLinecap="round" />
			<path d="M13.5 11h5M13 16h6M13.5 21h5" stroke="#25D0A6" strokeWidth="1.4" strokeLinecap="round" />
		</svg>
	);
}

export function Nav() {
	const { ready } = useScene();
	const ctaRef = useMagnetic<HTMLAnchorElement>(0.25);
	const [scrolled, setScrolled] = useState(false);
	const [menuOpen, setMenuOpen] = useState(false);
	const [active, setActive] = useState('hero');

	// Section tracking also publishes the current phase to the 3D scene.
	useEffect(() => {
		const ids = ['hero', ...copy.nav.links.map(link => link.href.slice(1)), 'contact'];
		const sections = ids.map(id => document.getElementById(id)).filter((el): el is HTMLElement => Boolean(el));
		if (sections.length === 0) return;

		const observer = new IntersectionObserver(
			entries => {
				const visible = entries
					.filter(entry => entry.isIntersecting)
					.sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
				if (!visible) return;
				const id = visible.target.id;
				setActive(id);
				setPhase(id as ScenePhase);
			},
			{ threshold: [0.15, 0.35, 0.6], rootMargin: '-15% 0px -45% 0px' },
		);
		sections.forEach(section => observer.observe(section));

		const onScroll = () => setScrolled(window.scrollY > 40);
		onScroll();
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => {
			observer.disconnect();
			window.removeEventListener('scroll', onScroll);
		};
	}, []);

	useEffect(() => {
		if (!menuOpen) return;
		const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') setMenuOpen(false); };
		document.addEventListener('keydown', onKey);
		return () => document.removeEventListener('keydown', onKey);
	}, [menuOpen]);

	return (
		<>
			<motion.header
				initial={{ y: -80, opacity: 0 }}
				animate={ready ? { y: 0, opacity: 1 } : { y: -80, opacity: 0 }}
				transition={{ duration: 1, ease: EASE, delay: 0.15 }}
				className={cn(
					'fixed inset-x-0 top-0 z-[70] transition-colors duration-500',
					scrolled && !menuOpen && 'border-b border-paper/10 bg-abyss/70 backdrop-blur-xl backdrop-saturate-150',
				)}
			>
				<div
					className={cn(
						'mx-auto flex max-w-[1320px] items-center justify-between px-6 text-paper transition-[height] duration-500 md:px-10',
						scrolled ? 'h-16' : 'h-20',
					)}
				>
					<a href="#hero" onClick={() => setMenuOpen(false)} className="group/logo flex items-center gap-2.5">
						<LogoMark className="h-7 w-7 transition-transform duration-500 group-hover/logo:rotate-12" />
						<span className="font-display text-[15px] font-semibold tracking-tight">{copy.company}</span>
					</a>

					<nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
						{copy.nav.links.map(link => {
							const isActive = active === link.href.slice(1);
							return (
								<a
									key={link.href}
									href={link.href}
									aria-current={isActive ? 'location' : undefined}
									className="group relative rounded-full px-4 py-2 text-sm text-paper/65 transition-colors duration-200 hover:text-paper"
								>
									{isActive && (
										<motion.span
											layoutId="nav-pill"
											className="absolute inset-0 rounded-full bg-paper/10"
											transition={{ duration: 0.5, ease: EASE }}
										/>
									)}
									<span className={cn('relative z-10', isActive && 'text-paper')}>{link.label}</span>
								</a>
							);
						})}
					</nav>

					<div className="flex items-center gap-3">
						<a
							ref={ctaRef}
							href="#contact"
							onClick={() => setMenuOpen(false)}
							className="hidden rounded-full bg-paper px-5 py-2.5 text-sm font-medium text-ink transition-colors duration-200 hover:bg-bio md:inline-flex"
						>
							{copy.nav.cta}
						</a>
						<button
							type="button"
							onClick={() => setMenuOpen(open => !open)}
							aria-expanded={menuOpen}
							aria-controls="overlay-menu"
							aria-label={menuOpen ? 'Close menu' : 'Open menu'}
							className="relative z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border border-paper/20 transition-colors duration-200 hover:border-bio hover:text-bio lg:hidden"
						>
							<span className="sr-only">{menuOpen ? 'Close menu' : 'Open menu'}</span>
							<span className="flex h-3 w-4 flex-col justify-between">
								<span className={cn('block h-px w-full bg-current transition-transform duration-300', menuOpen && 'translate-y-[5.5px] rotate-45')} />
								<span className={cn('block h-px w-full bg-current transition-opacity duration-200', menuOpen && 'opacity-0')} />
								<span className={cn('block h-px w-full bg-current transition-transform duration-300', menuOpen && '-translate-y-[5.5px] -rotate-45')} />
							</span>
						</button>
					</div>
				</div>
			</motion.header>

			<AnimatePresence>
				{menuOpen && (
					<motion.div
						id="overlay-menu"
						className="fixed inset-0 z-[65] flex flex-col justify-center bg-abyss/95 px-6 backdrop-blur-2xl lg:hidden"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.4, ease: EASE }}
					>
						<nav aria-label="Mobile primary" className="flex flex-col gap-2">
							{copy.nav.links.map((link, index) => (
								<motion.a
									key={link.href}
									href={link.href}
									onClick={() => setMenuOpen(false)}
									initial={{ y: 40, opacity: 0 }}
									animate={{ y: 0, opacity: 1 }}
									exit={{ y: 20, opacity: 0 }}
									transition={{ duration: 0.6, ease: EASE, delay: 0.06 * index }}
									className="flex items-baseline gap-4 border-b border-paper/10 py-4 text-paper"
								>
									<span className="font-mono text-[11px] tracking-[0.2em] text-bio">{link.index}</span>
									<span className="font-display text-3xl font-semibold tracking-tight">{link.label}</span>
								</motion.a>
							))}
							<motion.a
								href="#contact"
								onClick={() => setMenuOpen(false)}
								initial={{ y: 40, opacity: 0 }}
								animate={{ y: 0, opacity: 1 }}
								transition={{ duration: 0.6, ease: EASE, delay: 0.06 * copy.nav.links.length }}
								className="mt-6 rounded-full bg-paper px-6 py-4 text-center text-sm font-medium text-ink"
							>
								{copy.nav.cta}
							</motion.a>
						</nav>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
}
