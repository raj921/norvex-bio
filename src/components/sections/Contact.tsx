'use client';

/** Closing CTA + footer. */
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { copy } from '@/lib/copy';
import { useMagnetic, useSplitReveal } from '@/lib/motion';

export function Contact() {
	const title = useSplitReveal<HTMLHeadingElement>();
	const button = useMagnetic<HTMLAnchorElement>(0.3);

	return (
		<section id={copy.cta.id} className="relative px-6 pb-10 pt-16 md:px-10">
			<div className="relative mx-auto max-w-[1320px] overflow-hidden rounded-[2.5rem] border border-paper/10 bg-abyss/70 backdrop-blur-xl">
				<div aria-hidden className="pointer-events-none absolute -top-1/3 right-[-8%] h-[520px] w-[520px] rounded-full bg-accent/25 blur-[130px]" />
				<div aria-hidden className="pointer-events-none absolute bottom-[-30%] left-[-6%] h-[380px] w-[380px] rounded-full bg-bio/15 blur-[120px]" />

				<div className="relative px-8 py-24 text-center md:py-32">
					<p className="kicker flex items-center justify-center gap-3 text-paper/45">
						<span className="inline-block h-px w-8 bg-bio" aria-hidden />
						{copy.cta.kicker}
					</p>
					<h2 ref={title} className="mx-auto mt-6 max-w-[20ch] font-display text-[clamp(2.2rem,5vw,4rem)] font-semibold leading-[1.04] tracking-[-0.03em] text-paper">
						{copy.cta.title}
					</h2>
					<p className="mx-auto mt-6 max-w-[46ch] text-lg leading-relaxed text-paper/60">{copy.cta.body}</p>
					<a
						ref={button}
						href={`mailto:${copy.cta.email}`}
						className="group mt-12 inline-flex items-center gap-2 rounded-full bg-paper px-8 py-4 text-sm font-semibold text-ink transition-colors duration-200 hover:bg-bio"
					>
						{copy.cta.button}
						<ArrowUpRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
					</a>
				</div>

				<footer className="relative flex flex-col items-center justify-between gap-3 border-t border-paper/10 px-8 py-6 font-mono text-[11px] tracking-wide text-paper/40 md:flex-row">
					<span>{copy.footer.pdb}</span>
					<div className="flex items-center gap-5">
						{copy.footer.links.map(link => (
							<Link key={link.href} href={link.href} className="link-underline transition-colors duration-200 hover:text-bio">
								{link.label}
							</Link>
						))}
						<span className="text-paper/25">{copy.footer.rights}</span>
					</div>
				</footer>
			</div>
		</section>
	);
}
