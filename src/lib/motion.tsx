'use client';

/**
 * Motion system — one contract, one place.
 *
 * · Lenis drives smooth scroll, GSAP's ticker drives Lenis, ScrollTrigger reads it.
 * · Every scroll value the 3D scene needs is written into `sceneState` here, so
 *   the canvas never re-renders React to stay in sync with the page.
 * · Easing is expo-out everywhere: micro 150–250ms, reveals 400–1100ms, stagger 80ms.
 * · Everything below no-ops under prefers-reduced-motion.
 */
import { useEffect, useRef, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import SplitType from 'split-type';
import { sceneState } from './scene-store';
import { clamp } from './utils';

gsap.registerPlugin(ScrollTrigger);

export const EXPO_OUT = 'expo.out';
export const EASE_CSS = 'cubic-bezier(0.16, 1, 0.3, 1)';

export function prefersReducedMotion() {
	return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function isFinePointer() {
	return typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches;
}

let lenisInstance: Lenis | null = null;

/** Programmatic scroll that respects Lenis when it is running. */
export function scrollToTarget(target: string | HTMLElement, offset = -80) {
	if (lenisInstance) {
		lenisInstance.scrollTo(target, { offset, duration: 1.4 });
		return;
	}
	const el = typeof target === 'string' ? document.querySelector(target) : target;
	el?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
}

export function stopScroll() {
	lenisInstance?.stop();
}

export function startScroll() {
	lenisInstance?.start();
}

/** Smooth-scroll + global scroll/pointer telemetry root. */
export function MotionRoot({ children }: { children: ReactNode }) {
	useEffect(() => {
		const reduced = prefersReducedMotion();
		// Touch platforms already have excellent native scrolling; running Lenis
		// there costs battery for no perceptual gain. ScrollTrigger still works.
		const coarse = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768;

		let cleanupLenis = () => {};
		if (!reduced && !coarse) {
			const lenis = new Lenis({ duration: 1.15, smoothWheel: true, wheelMultiplier: 0.95 });
			lenisInstance = lenis;
			lenis.on('scroll', ScrollTrigger.update);
			const tick = (time: number) => lenis.raf(time * 1000);
			gsap.ticker.add(tick);
			gsap.ticker.lagSmoothing(0);
			cleanupLenis = () => {
				gsap.ticker.remove(tick);
				lenis.destroy();
				lenisInstance = null;
			};
		}

		// Global scroll telemetry → scene store (no React renders).
		let raf = 0;
		const readScroll = () => {
			raf = 0;
			const max = document.documentElement.scrollHeight - window.innerHeight;
			sceneState.scroll = max > 0 ? clamp(window.scrollY / max) : 0;
		};
		const onScroll = () => { if (!raf) raf = requestAnimationFrame(readScroll); };
		readScroll();
		window.addEventListener('scroll', onScroll, { passive: true });
		window.addEventListener('resize', onScroll, { passive: true });

		const onPointer = (event: PointerEvent) => {
			sceneState.pointerX = (event.clientX / window.innerWidth) * 2 - 1;
			sceneState.pointerY = (event.clientY / window.innerHeight) * 2 - 1;
		};
		window.addEventListener('pointermove', onPointer, { passive: true });

		// Anchor links route through Lenis so they share the site's easing.
		const onClick = (event: MouseEvent) => {
			const anchor = (event.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
			const href = anchor?.getAttribute('href');
			if (!href || href === '#') return;
			const target = document.querySelector(href);
			if (!target) return;
			event.preventDefault();
			scrollToTarget(target as HTMLElement);
		};
		document.addEventListener('click', onClick);

		return () => {
			cleanupLenis();
			document.removeEventListener('click', onClick);
			window.removeEventListener('scroll', onScroll);
			window.removeEventListener('resize', onScroll);
			window.removeEventListener('pointermove', onPointer);
			if (raf) cancelAnimationFrame(raf);
		};
	}, []);

	return <>{children}</>;
}

/** Fade/rise reveal. `stagger` animates direct children on an 80ms cascade. */
export function useReveal<T extends HTMLElement>(opts?: { y?: number; stagger?: boolean; delay?: number; start?: string }) {
	const ref = useRef<T>(null);
	const { y = 28, stagger = false, delay = 0, start = 'top 85%' } = opts ?? {};
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
				scrollTrigger: { trigger: ref.current, start, once: true },
			});
		});
		return () => ctx.revert();
	}, [y, stagger, delay, start]);
	return ref;
}

/**
 * SplitType line reveal — the signature typographic move. Each line rises out of
 * its own clip mask. Re-splits on resize so reflowed lines still mask correctly.
 */
export function useSplitReveal<T extends HTMLElement>(opts?: { delay?: number; stagger?: number; start?: string; trigger?: boolean }) {
	const ref = useRef<T>(null);
	const { delay = 0, stagger = 0.09, start = 'top 85%', trigger = true } = opts ?? {};
	useEffect(() => {
		const el = ref.current;
		if (!el || prefersReducedMotion()) return;

		let split: SplitType | null = null;
		let ctx: gsap.Context | null = null;

		const build = () => {
			ctx?.revert();
			split?.revert();
			split = new SplitType(el, { types: 'lines', lineClass: 'split-line' });
			split.lines?.forEach(line => {
				const inner = document.createElement('span');
				inner.className = 'split-line-inner';
				while (line.firstChild) inner.appendChild(line.firstChild);
				line.appendChild(inner);
			});
			ctx = gsap.context(() => {
				gsap.from(el.querySelectorAll('.split-line-inner'), {
					yPercent: 116,
					duration: 1.1,
					delay,
					ease: EXPO_OUT,
					stagger,
					immediateRender: false,
					...(trigger ? { scrollTrigger: { trigger: el, start, once: true } } : {}),
				});
			}, el);
		};

		build();

		let resizeTimer: number | undefined;
		const onResize = () => {
			window.clearTimeout(resizeTimer);
			resizeTimer = window.setTimeout(build, 220);
		};
		window.addEventListener('resize', onResize);

		return () => {
			window.clearTimeout(resizeTimer);
			window.removeEventListener('resize', onResize);
			ctx?.revert();
			split?.revert();
		};
	}, [delay, stagger, start, trigger]);
	return ref;
}

/** Magnetic hover: the element leans toward the pointer, snaps back on exit. */
export function useMagnetic<T extends HTMLElement>(strength = 0.3) {
	const ref = useRef<T>(null);
	useEffect(() => {
		const el = ref.current;
		if (!el || prefersReducedMotion() || !isFinePointer()) return;

		const quickX = gsap.quickTo(el, 'x', { duration: 0.5, ease: EXPO_OUT });
		const quickY = gsap.quickTo(el, 'y', { duration: 0.5, ease: EXPO_OUT });
		const onMove = (event: PointerEvent) => {
			const rect = el.getBoundingClientRect();
			quickX((event.clientX - (rect.left + rect.width / 2)) * strength);
			quickY((event.clientY - (rect.top + rect.height / 2)) * strength);
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

/** Pointer-tracked perspective tilt plus a `--mx/--my` spotlight for card surfaces. */
export function useTilt<T extends HTMLElement>(max = 6) {
	const ref = useRef<T>(null);
	useEffect(() => {
		const el = ref.current;
		if (!el || prefersReducedMotion() || !isFinePointer()) return;

		const setRx = gsap.quickTo(el, 'rotationX', { duration: 0.6, ease: EXPO_OUT });
		const setRy = gsap.quickTo(el, 'rotationY', { duration: 0.6, ease: EXPO_OUT });
		gsap.set(el, { transformPerspective: 1000, transformOrigin: 'center' });

		const onMove = (event: PointerEvent) => {
			const rect = el.getBoundingClientRect();
			const px = (event.clientX - rect.left) / rect.width;
			const py = (event.clientY - rect.top) / rect.height;
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

/** Scrub-driven parallax on the Y axis, expressed in pixels of total travel. */
export function useParallax<T extends HTMLElement>(distance = 80) {
	const ref = useRef<T>(null);
	useEffect(() => {
		const el = ref.current;
		if (!el || prefersReducedMotion()) return;
		const ctx = gsap.context(() => {
			gsap.fromTo(
				el,
				{ y: distance * 0.5 },
				{
					y: -distance * 0.5,
					ease: 'none',
					scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
				},
			);
		});
		return () => ctx.revert();
	}, [distance]);
	return ref;
}
