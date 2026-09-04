'use client';

import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { copy } from '@/lib/copy';
import { useMagnetic } from '@/lib/motion';

function LogoMark({ className }: { className?: string }) {
	return (
		<svg viewBox="0 0 32 32" className={className} aria-hidden>
			<defs>
				<linearGradient id="lg" x1="0" y1="0" x2="1" y2="1">
					<stop offset="0" stopColor="#0B2A6B" />
					<stop offset="1" stopColor="#3E63F2" />
				</linearGradient>
			</defs>
			<rect width="32" height="32" rx="8" fill="url(#lg)" />
			<path d="M11 7c0 6 10 6 10 12M21 7c0 6-10 6-10 12" fill="none" stroke="#F6F7F9" strokeWidth="1.8" strokeLinecap="round" />
			<path d="M13.5 11h5M13 16h6M13.5 21h5" stroke="#25D0A6" strokeWidth="1.4" strokeLinecap="round" />
		</svg>
	);
}

export function Nav() {
	const ctaRef = useMagnetic<HTMLAnchorElement>(0.25);
	const [scrolled, setScrolled] = useState(false);
	const [menuOpen, setMenuOpen] = useState(false);
	const [activeSection, setActiveSection] = useState('top');
	useEffect(() => {
		const sentinel = document.querySelector('[data-nav-sentinel]');
		const sections = ['top', ...copy.nav.links.map(link => link.href.slice(1)), 'contact']
			.map(id => document.getElementById(id))
			.filter((section): section is HTMLElement => Boolean(section));
		if (!sentinel || sections.length === 0) return;

		const visibility = new Map<HTMLElement, IntersectionObserverEntry>();
		const observer = new IntersectionObserver(
			entries => {
				entries.forEach(entry => {
					if (entry.target instanceof HTMLElement) visibility.set(entry.target, entry);
				});
				const visible = sections
					.filter(section => visibility.get(section)?.isIntersecting)
					.sort((a, b) => Math.abs(a.getBoundingClientRect().top - 96) - Math.abs(b.getBoundingClientRect().top - 96))[0];
				if (visible) setActiveSection(visible.id);
			},
			{ threshold: [0, 0.2, 0.5, 0.8], rootMargin: '-12% 0px -62% 0px' },
		);
		sections.forEach(section => observer.observe(section));

		const topObserver = new IntersectionObserver(([entry]) => setScrolled(!entry.isIntersecting), { threshold: 0 });
		topObserver.observe(sentinel);
		return () => {
			observer.disconnect();
			topObserver.disconnect();
		};
	}, []);

	useEffect(() => {
		if (!menuOpen) return;
		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') setMenuOpen(false);
		};
		document.addEventListener('keydown', onKeyDown);
		return () => document.removeEventListener('keydown', onKeyDown);
	}, [menuOpen]);

	const closeMenu = () => setMenuOpen(false);
	const solid = scrolled || menuOpen;

	return (
		<header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${solid ? 'border-b border-mist/80 bg-paper/70 text-ink shadow-[0_10px_40px_-30px_rgb(10_22_51/0.5)] backdrop-blur-xl backdrop-saturate-150' : 'text-paper'}`}>
			<div className={`mx-auto flex max-w-[1240px] items-center justify-between px-6 transition-[height] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${solid ? 'h-14' : 'h-20'}`}>
				<a href="#top" onClick={closeMenu} className="group/logo flex items-center gap-2.5">
					<LogoMark className="h-7 w-7 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/logo:rotate-[10deg]" />
					<span className="font-display font-semibold tracking-tight">{copy.company}</span>
				</a>
				<nav aria-label="Primary" className={`hidden items-center gap-8 text-sm md:flex ${solid ? 'text-ink/70' : 'text-paper/70'}`}>
					{copy.nav.links.map(l => (
						<a
							key={l.href}
							href={l.href}
							aria-current={activeSection === l.href.slice(1) ? 'location' : undefined}
							className={`relative transition-colors after:absolute after:-bottom-1 after:left-0 after:h-px after:bg-bio after:transition-all after:duration-200 ${solid ? 'hover:text-ink' : 'hover:text-paper'} hover:after:w-full ${activeSection === l.href.slice(1) ? `${solid ? 'text-ink' : 'text-paper'} after:w-full` : 'after:w-0'}`}
						>
							{l.label}
						</a>
					))}
				</nav>
				<a
					ref={ctaRef}
					href="#contact"
					onClick={closeMenu}
					className={`hidden rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-200 hover:scale-[1.04] active:scale-[0.97] md:inline-flex ${solid ? 'bg-ink text-paper hover:bg-accent' : 'bg-paper text-ink hover:bg-bio'}`}
				>
					{copy.nav.cta}
				</a>
				<button
					type="button"
					className={`inline-flex h-10 w-10 items-center justify-center rounded-full border transition-colors hover:border-bio hover:text-bio active:scale-[0.96] md:hidden ${solid ? 'border-ink/10 text-ink' : 'border-paper/20 text-paper'}`}
					aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
					aria-expanded={menuOpen}
					aria-controls="mobile-navigation"
					onClick={() => setMenuOpen(open => !open)}
				>
					{menuOpen ? <X size={18} strokeWidth={1.8} /> : <Menu size={18} strokeWidth={1.8} />}
				</button>
			</div>
			{menuOpen && (
				<nav id="mobile-navigation" aria-label="Mobile primary" className="mx-4 mb-4 rounded-2xl border border-mist bg-paper p-2 shadow-[0_20px_60px_-24px_rgb(10_22_51/0.35)] md:hidden">
					{copy.nav.links.map(link => (
						<a
							key={link.href}
							href={link.href}
							onClick={closeMenu}
							aria-current={activeSection === link.href.slice(1) ? 'location' : undefined}
							className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm transition-colors active:scale-[0.99] ${activeSection === link.href.slice(1) ? 'bg-mist/60 text-ink' : 'text-ink/70 hover:bg-mist/40 hover:text-ink'}`}
						>
							{link.label}
							<span aria-hidden className="font-mono text-[10px] tracking-[0.18em] text-ink/35">{link.href.slice(1).toUpperCase()}</span>
						</a>
					))}
					<a href="#contact" onClick={closeMenu} className="mt-1 flex items-center justify-center rounded-xl bg-ink px-4 py-3 text-sm font-medium text-paper transition-colors hover:bg-accent active:scale-[0.99]">
						{copy.nav.cta}
					</a>
				</nav>
			)}
		</header>
	);
}
