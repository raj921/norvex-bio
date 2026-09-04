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

/**
 * Magnetic hover — the element leans toward the pointer and snaps back on exit.
 * Fine pointers only; fully inert under reduced motion (contract §5).
 */
export function useMagnetic<T extends HTMLElement>(strength = 0.32) {
	const ref = useRef<T>(null);
	useEffect(() => {
		const el = ref.current;
		if (!el || prefersReducedMotion()) return;
		if (!window.matchMedia('(pointer: fine)').matches) return;

		const quickX = gsap.quickTo(el, 'x', { duration: 0.5, ease: EXPO_OUT });
		const quickY = gsap.quickTo(el, 'y', { duration: 0.5, ease: EXPO_OUT });
		const onMove = (event: PointerEvent) => {
			const r = el.getBoundingClientRect();
			quickX((event.clientX - (r.left + r.width / 2)) * strength);
			quickY((event.clientY - (r.top + r.height / 2)) * strength);
		};
		const onLeave = () => { quickX(0); quickY(0); };
		el.addEventListener('pointermove', onMove);
		el.addEventListener('pointerleave', onLeave);
		return () => {
			el.removeEventListener('pointermove', onMove);
			el.removeEventListener('pointerleave', onLeave);
			gsap.set(el, { x: 0, y: 0 });
		};
	}, [strength]);
	return ref;
}

/** Pointer-tracked 3D tilt + a CSS-variable spotlight for card surfaces. */
export function useTilt<T extends HTMLElement>(max = 6) {
	const ref = useRef<T>(null);
	useEffect(() => {
		const el = ref.current;
		if (!el || prefersReducedMotion()) return;
		if (!window.matchMedia('(pointer: fine)').matches) return;

		const setRx = gsap.quickTo(el, 'rotationX', { duration: 0.6, ease: EXPO_OUT });
		const setRy = gsap.quickTo(el, 'rotationY', { duration: 0.6, ease: EXPO_OUT });
		gsap.set(el, { transformPerspective: 900, transformOrigin: 'center' });

		const onMove = (event: PointerEvent) => {
			const r = el.getBoundingClientRect();
			const px = (event.clientX - r.left) / r.width;
			const py = (event.clientY - r.top) / r.height;
			setRy((px - 0.5) * max * 2);
			setRx((0.5 - py) * max * 2);
			el.style.setProperty('--mx', `${px * 100}%`);
			el.style.setProperty('--my', `${py * 100}%`);
		};
		const onLeave = () => { setRx(0); setRy(0); };
		el.addEventListener('pointermove', onMove);
		el.addEventListener('pointerleave', onLeave);
		return () => {
			el.removeEventListener('pointermove', onMove);
			el.removeEventListener('pointerleave', onLeave);
		};
	}, [max]);
	return ref;
}

/** Line-masked heading reveal: each child line rises out of its own clip box. */
export function useLineReveal<T extends HTMLElement>(delay = 0) {
	const ref = useRef<T>(null);
	useEffect(() => {
		const el = ref.current;
		if (!el || prefersReducedMotion()) return;
		const ctx = gsap.context(() => {
			gsap.from(el.querySelectorAll('[data-line-inner]'), {
				yPercent: 118,
				duration: 1.1,
				delay,
				ease: EXPO_OUT,
				stagger: 0.09,
				immediateRender: false,
				scrollTrigger: { trigger: el, start: 'top 88%', once: true },
			});
		}, el);
		return () => ctx.revert();
	}, [delay]);
	return ref;
}
