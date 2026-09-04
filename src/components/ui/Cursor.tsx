'use client';

/**
 * Custom pointer: an instant dot plus a ring that trails it. The ring grows over
 * interactive targets and swaps to a labelled state over the 3D scene ("DRAG").
 * Fine pointers only, never under reduced motion.
 */
import { useEffect, useRef, useSyncExternalStore } from 'react';
import { isFinePointer, prefersReducedMotion } from '@/lib/motion';

export function Cursor() {
	// SSR snapshot false → server renders nothing; client opts in post-hydration.
	const enabled = useSyncExternalStore(
		onStoreChange => {
			const queries = ['(pointer: fine)', '(prefers-reduced-motion: reduce)'].map(q => window.matchMedia(q));
			queries.forEach(q => q.addEventListener('change', onStoreChange));
			return () => queries.forEach(q => q.removeEventListener('change', onStoreChange));
		},
		() => isFinePointer() && !prefersReducedMotion(),
		() => false,
	);

	const ringRef = useRef<HTMLDivElement>(null);
	const dotRef = useRef<HTMLDivElement>(null);
	const labelRef = useRef<HTMLSpanElement>(null);

	useEffect(() => {
		if (!enabled) return;
		const ring = ringRef.current;
		const dot = dotRef.current;
		const label = labelRef.current;
		if (!ring || !dot || !label) return;

		const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
		const pos = { ...target };
		let scale = 1;
		let scaleTarget = 1;
		let raf = 0;

		const loop = () => {
			pos.x += (target.x - pos.x) * 0.19;
			pos.y += (target.y - pos.y) * 0.19;
			scale += (scaleTarget - scale) * 0.16;
			ring.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%) scale(${scale})`;
			dot.style.transform = `translate3d(${target.x}px, ${target.y}px, 0) translate(-50%, -50%)`;
			raf = requestAnimationFrame(loop);
		};
		raf = requestAnimationFrame(loop);

		const onMove = (event: PointerEvent) => {
			target.x = event.clientX;
			target.y = event.clientY;
			const el = event.target as HTMLElement | null;
			const interactive = el?.closest('a, button, [role="button"], input, textarea, summary');
			const overScene = Boolean(el?.closest('[data-scene-root]')) && !interactive;
			scaleTarget = interactive ? 2.2 : overScene ? 2.6 : 1;
			ring.dataset.mode = interactive ? 'hot' : overScene ? 'drag' : 'idle';
			label.textContent = overScene ? 'DRAG' : '';
		};
		const show = () => { ring.style.opacity = '1'; dot.style.opacity = '1'; };
		const hide = () => { ring.style.opacity = '0'; dot.style.opacity = '0'; };

		window.addEventListener('pointermove', onMove, { passive: true });
		document.addEventListener('pointerenter', show);
		document.addEventListener('pointerleave', hide);
		return () => {
			cancelAnimationFrame(raf);
			window.removeEventListener('pointermove', onMove);
			document.removeEventListener('pointerenter', show);
			document.removeEventListener('pointerleave', hide);
		};
	}, [enabled]);

	if (!enabled) return null;
	return (
		<div aria-hidden className="cursor-layer">
			<div ref={ringRef} className="cursor-ring" data-mode="idle">
				<span ref={labelRef} className="cursor-label" />
			</div>
			<div ref={dotRef} className="cursor-dot" />
		</div>
	);
}
