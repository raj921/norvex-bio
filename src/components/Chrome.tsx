'use client';

/**
 * Site chrome: scroll progress rail + custom pointer.
 * Both are pure decoration — they never trap events, and both self-disable for
 * coarse pointers and prefers-reduced-motion (motion contract §5).
 */
import { useEffect, useRef, useSyncExternalStore } from 'react';
import { prefersReducedMotion } from '@/lib/motion';

export function ScrollProgress() {
	const barRef = useRef<HTMLDivElement>(null);
	useEffect(() => {
		const el = barRef.current;
		if (!el) return;
		let raf = 0;
		const update = () => {
			raf = 0;
			const max = document.documentElement.scrollHeight - window.innerHeight;
			const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
			el.style.transform = `scaleX(${p})`;
		};
		const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
		update();
		window.addEventListener('scroll', onScroll, { passive: true });
		window.addEventListener('resize', onScroll, { passive: true });
		return () => {
			window.removeEventListener('scroll', onScroll);
			window.removeEventListener('resize', onScroll);
			if (raf) cancelAnimationFrame(raf);
		};
	}, []);
	return (
		<div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-[65] h-[2px]">
			<div
				ref={barRef}
				className="h-full origin-left scale-x-0 bg-gradient-to-r from-accent via-bio to-accent will-change-transform"
			/>
		</div>
	);
}

/** Lagging ring + instant dot. Grows over interactive elements, inverts over dark blocks. */
export function Cursor() {
	// SSR snapshot = false → server renders nothing, client opts in after hydration.
	const enabled = useSyncExternalStore(
		onStoreChange => {
			const queries = ['(pointer: fine)', '(prefers-reduced-motion: reduce)'].map(q => window.matchMedia(q));
			queries.forEach(q => q.addEventListener('change', onStoreChange));
			return () => queries.forEach(q => q.removeEventListener('change', onStoreChange));
		},
		() => window.matchMedia('(pointer: fine)').matches && !prefersReducedMotion(),
		() => false,
	);
	const ringRef = useRef<HTMLDivElement>(null);
	const dotRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!enabled) return;
		const ring = ringRef.current;
		const dot = dotRef.current;
		if (!ring || !dot) return;

		const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
		const pos = { ...target };
		let scale = 1;
		let scaleTarget = 1;
		let raf = 0;

		const loop = () => {
			pos.x += (target.x - pos.x) * 0.18;
			pos.y += (target.y - pos.y) * 0.18;
			scale += (scaleTarget - scale) * 0.18;
			ring.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%) scale(${scale})`;
			dot.style.transform = `translate3d(${target.x}px, ${target.y}px, 0) translate(-50%, -50%)`;
			raf = requestAnimationFrame(loop);
		};
		raf = requestAnimationFrame(loop);

		const onMove = (event: PointerEvent) => {
			target.x = event.clientX;
			target.y = event.clientY;
			const el = event.target as HTMLElement | null;
			const hot = el?.closest('a, button, [role="button"], input, summary');
			scaleTarget = hot ? 2.1 : 1;
			ring.dataset.hot = hot ? 'true' : 'false';
			const onDark = Boolean(el?.closest('[data-surface="dark"]'));
			ring.dataset.dark = onDark ? 'true' : 'false';
			dot.dataset.dark = onDark ? 'true' : 'false';
		};
		const onLeave = () => { ring.style.opacity = '0'; dot.style.opacity = '0'; };
		const onEnter = () => { ring.style.opacity = '1'; dot.style.opacity = '1'; };

		window.addEventListener('pointermove', onMove, { passive: true });
		document.addEventListener('pointerleave', onLeave);
		document.addEventListener('pointerenter', onEnter);
		return () => {
			cancelAnimationFrame(raf);
			window.removeEventListener('pointermove', onMove);
			document.removeEventListener('pointerleave', onLeave);
			document.removeEventListener('pointerenter', onEnter);
		};
	}, [enabled]);

	if (!enabled) return null;
	return (
		<div aria-hidden className="cursor-layer">
			<div ref={ringRef} className="cursor-ring" />
			<div ref={dotRef} className="cursor-dot" />
		</div>
	);
}
