import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
	title: 'Privacy · Norvex Bio',
	description: 'How Norvex Bio handles information on this website.',
};

const sections = [
	{
		h: 'What we collect',
		p: 'This website is a static presentation. It sets no advertising or tracking cookies, runs no third-party analytics, and asks for no personal information. If you contact us by email, we receive only what you choose to send.',
	},
	{
		h: 'How we use it',
		p: 'Email correspondence is used to answer your inquiry and nothing else. We do not sell, rent, or share correspondence with third parties, and we do not build behavioral profiles from visits to this site.',
	},
	{
		h: 'Third-party material',
		p: 'The molecular visualization on our home page is derived from structure 4OO8 in the RCSB Protein Data Bank and is used with attribution. No external service receives data about you through this page.',
	},
	{
		h: 'Contact',
		p: 'Questions about this policy can go to hello@norvxbio.example. We are a fictional company created for a design study; no live data processing exists behind this site.',
	},
];

export default function PrivacyPage() {
	return (
		<main className="mx-auto max-w-[1240px] px-6 pb-28 pt-28">
			<div className="flex items-center justify-between font-mono text-[11px] tracking-[0.18em] text-ink/45">
				<Link href="/" className="transition-colors duration-200 hover:text-accent">
					← NORVEX BIO
				</Link>
				<span>LEGAL · PRIVACY</span>
			</div>
			<h1 className="mt-10 font-display text-4xl font-semibold tracking-[-0.02em] md:text-5xl">Privacy, kept simple.</h1>
			<p className="mt-5 max-w-[65ch] text-lg leading-relaxed text-ink/65">
				We built this site to explain our science, not to collect data. This page describes exactly what that means in practice.
			</p>
			<div className="mt-12 max-w-[65ch] space-y-10 border-t border-mist pt-10">
				{sections.map(s => (
					<section key={s.h}>
						<h2 className="font-display text-xl font-semibold">{s.h}</h2>
						<p className="mt-2 leading-relaxed text-ink/65">{s.p}</p>
					</section>
				))}
			</div>
		</main>
	);
}
