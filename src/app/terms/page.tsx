import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
	title: 'Terms · Norvex Bio',
	description: 'Terms of use for the Norvex Bio website.',
};

const sections = [
	{
		h: 'About this site',
		p: 'Norvex Bio is a fictional company created for a design study. The content on this site — including the company, its platform, pipeline figures, and therapeutic claims — is illustrative and is not an offer, a solicitation, or medical, scientific, or investment advice.',
	},
	{
		h: 'Intellectual property',
		p: 'The written content, visual system, and code of this site are original work. The molecular visualization is derived from structure 4OO8 in the RCSB Protein Data Bank, used with attribution to the depositing authors and the Protein Data Bank.',
	},
	{
		h: 'Limitation of liability',
		p: 'The site is provided as-is, without warranties of any kind. To the fullest extent permitted by law, we are not liable for any loss arising from use of, or reliance on, this site or its content.',
	},
	{
		h: 'Contact',
		p: 'Questions about these terms can go to hello@norvexbio.example.',
	},
];

export default function TermsPage() {
	return (
		<main className="mx-auto max-w-[1240px] px-6 pb-28 pt-28">
			<div className="flex items-center justify-between font-mono text-[11px] tracking-[0.18em] text-paper/45">
				<Link href="/" className="transition-colors duration-200 hover:text-bio">
					← NORVEX BIO
				</Link>
				<span>LEGAL · TERMS</span>
			</div>
			<h1 className="mt-10 font-display text-4xl font-semibold tracking-[-0.02em] md:text-5xl">Terms of use.</h1>
			<p className="mt-5 max-w-[65ch] text-lg leading-relaxed text-paper/65">
				Short, readable rules for using this website. If anything here is unclear, ask us before relying on it.
			</p>
			<div className="mt-12 max-w-[65ch] space-y-10 border-t border-paper/15 pt-10">
				{sections.map(s => (
					<section key={s.h}>
						<h2 className="font-display text-xl font-semibold">{s.h}</h2>
						<p className="mt-2 leading-relaxed text-paper/65">{s.p}</p>
					</section>
				))}
			</div>
		</main>
	);
}
