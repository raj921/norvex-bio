'use client';

/**
 * Decides whether this visitor gets the real WebGL scene or the static
 * fallback, then mounts exactly one of them for the lifetime of the page.
 */
import dynamic from 'next/dynamic';
import { useSyncExternalStore } from 'react';
import { prefersReducedMotion } from '@/lib/motion';

const Scene = dynamic(() => import('./Scene'), { ssr: false, loading: () => <SceneFallback /> });

/** Deterministic SVG stand-in: abstract fold art, zero WebGL cost. */
export function SceneFallback() {
	return (
		<div className="fixed inset-0 z-0 overflow-hidden" aria-hidden>
			<div className="absolute left-1/2 top-1/3 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-accent/20 blur-[110px]" />
			<div className="absolute bottom-[14%] right-[8%] h-[300px] w-[300px] rounded-full bg-bio/15 blur-[100px]" />
			<svg viewBox="0 0 320 480" className="absolute left-1/2 top-1/2 w-[72%] max-w-[420px] -translate-x-1/2 -translate-y-1/2 opacity-60">
				<g fill="none" stroke="#AFC0FF" strokeLinecap="round">
					<path d="M92 8 C 248 72 248 168 92 232 S -64 392 92 472" strokeWidth="2.2" strokeOpacity="0.5" />
					<path d="M228 8 C 72 72 72 168 228 232 S 384 392 228 472" strokeWidth="2.2" strokeOpacity="0.5" />
					{[
						[104, 22, 216, 22], [164, 70, 156, 70], [206, 118, 114, 118], [208, 166, 112, 166],
						[164, 214, 156, 214], [104, 262, 216, 262], [72, 310, 248, 310], [104, 358, 216, 358],
						[164, 406, 156, 406], [206, 454, 114, 454],
					].map(([x1, y1, x2, y2], i) => (
						<path key={i} d={`M ${x1} ${y1} L ${x2} ${y2}`} strokeWidth="1.4" strokeOpacity="0.32" />
					))}
				</g>
				{[[92, 8], [228, 8], [92, 232], [228, 232], [92, 472], [228, 472]].map(([x, y], i) => (
					<circle key={i} cx={x} cy={y} r="5" fill={i % 2 ? '#25D0A6' : '#3E63F2'} fillOpacity="0.7" />
				))}
			</svg>
		</div>
	);
}

function useSupports3D() {
	return useSyncExternalStore(
		onStoreChange => {
			const queries = ['(pointer: coarse)', '(max-width: 767px)', '(prefers-reduced-motion: reduce)'].map(q => window.matchMedia(q));
			queries.forEach(q => q.addEventListener('change', onStoreChange));
			window.addEventListener('resize', onStoreChange, { passive: true });
			return () => {
				queries.forEach(q => q.removeEventListener('change', onStoreChange));
				window.removeEventListener('resize', onStoreChange);
			};
		},
		() => {
			const coarse = window.matchMedia('(pointer: coarse)').matches;
			const compact = window.matchMedia('(max-width: 767px)').matches || window.innerWidth < 768;
			const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
			return !prefersReducedMotion() && !coarse && !compact && memory > 4;
		},
		() => false,
	);
}

export function SceneRoot() {
	return useSupports3D() ? <Scene /> : <SceneFallback />;
}
