'use client';

/**
 * Motion system — one place, one contract (ASSET-RESEARCH §5).
 * Lenis smooth scroll driven by GSAP's ticker; ScrollTrigger for all scroll
 * choreography; everything cancels under prefers-reduced-motion.
 */
import { useEffect, useRef, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

export const EXPO_OUT = 'expo.out'; // ≈ cubic-bezier(0.16, 1, 0.3, 1)

export function prefersReducedMotion() {
	return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Smooth-scroll root. Wraps the page; children still render as RSC. */
export function MotionRoot({ children }: { children: ReactNode }) {
	useEffect(() => {
		// Touch devices already have high-quality native scrolling. Avoid keeping
		// Lenis and the GSAP ticker alive there; ScrollTrigger still observes native scroll.
		const coarse = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768;
		if (prefersReducedMotion() || coarse) return;

		const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
		lenis.on('scroll', ScrollTrigger.update);
		const tick = (time: number) => lenis.raf(time * 1000);
		gsap.ticker.add(tick);
		gsap.ticker.lagSmoothing(0);

		// Anchor links must go through Lenis, not native jump
		const onClick = (e: MouseEvent) => {
			const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
			if (!a) return;
			const el = document.querySelector(a.getAttribute('href')!);
			if (el) { e.preventDefault(); lenis.scrollTo(el as HTMLElement, { offset: -72 }); }
		};
		document.addEventListener('click', onClick);

		return () => {
			document.removeEventListener('click', onClick);
			gsap.ticker.remove(tick);
			lenis.destroy();
		};
	}, []);
	return <>{children}</>;
}

/**
 * Scroll-reveal hook. stagger=true animates the element's children with 80ms
 * stagger (contract §5). No-op under reduced motion — elements stay visible.
 */
export function useReveal<T extends HTMLElement>(opts?: { y?: number; stagger?: boolean; delay?: number }) {
	const ref = useRef<T>(null);
	const { y = 28, stagger = false, delay = 0 } = opts ?? {};
	useEffect(() => {
		if (prefersReducedMotion() || !ref.current) return;
		const ctx = gsap.context(() => {
			gsap.from(stagger ? ref.current!.children : ref.current!, {
				opacity: 0,
				y,
				duration: 0.9,
				delay,
				ease: EXPO_OUT,
				stagger: stagger ? 0.08 : 0,
				immediateRender: false,
				scrollTrigger: { trigger: ref.current, start: 'top 85%', once: true },
			});
		});
		return () => ctx.revert();
	}, [y, stagger, delay]);
	return ref;
}
