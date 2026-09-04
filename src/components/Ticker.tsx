'use client';

import { copy } from '@/lib/copy';

/** Edge-to-edge marquee band between hero and science — pauses on hover, static under reduced motion. */
export function Ticker() {
	const items = [...copy.ticker, ...copy.ticker];
	return (
		<div
			data-surface="dark"
			aria-hidden
			className="marquee relative overflow-hidden border-y border-paper/10 bg-ink py-4 text-paper select-none"
		>
			<div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-ink to-transparent" />
			<div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-ink to-transparent" />
			<div className="marquee-track">
				{items.map((item, index) => (
					<span key={`${item}-${index}`} className="flex items-center gap-8 pr-8 font-mono text-[11px] tracking-[0.24em] text-paper/45">
						{item}
						<span className="inline-block h-1 w-1 rounded-full bg-bio/70" />
					</span>
				))}
			</div>
		</div>
	);
}
