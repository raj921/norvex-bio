import Link from 'next/link';

export default function NotFound() {
	return (
		<main className="relative flex min-h-[100dvh] items-center overflow-hidden bg-abyss text-paper">
			<div className="pointer-events-none absolute left-1/2 top-1/3 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-accent/20 blur-[120px]" aria-hidden />
			<div className="relative mx-auto w-full max-w-[1240px] px-6">
				<p className="kicker flex items-center gap-3 text-paper/55">
					<span className="inline-block h-px w-8 bg-bio" aria-hidden />
					ERR · 404
				</p>
				<h1 className="mt-6 max-w-[16ch] font-display text-[clamp(2.5rem,6vw,4.5rem)] font-semibold leading-[1.04] tracking-[-0.02em]">
					This sequence didn&apos;t <em className="font-editorial font-normal italic text-bio">fold.</em>
				</h1>
				<p className="mt-6 max-w-[46ch] text-lg leading-relaxed text-paper/70">
					The page you asked for isn&apos;t in our library. The structure you want may exist under a different accession.
				</p>
				<div className="mt-10 flex flex-wrap gap-4">
					<Link
						href="/"
						className="rounded-full bg-paper px-6 py-3 text-sm font-medium text-ink transition-all duration-200 hover:scale-[1.04] hover:bg-bio hover:shadow-[0_10px_36px_-10px_rgb(37_208_166/0.55)] active:scale-[0.97]"
					>
						Back to the home page
					</Link>
					<Link
						href="/#science"
						className="rounded-full border border-paper/25 px-6 py-3 text-sm font-medium text-paper transition-all duration-200 hover:scale-[1.04] hover:border-bio hover:text-bio active:scale-[0.97]"
					>
						Read the science
					</Link>
				</div>
				<p className="mt-16 font-mono text-[10px] tracking-[0.2em] text-paper/40">SPCAS9 TERNARY COMPLEX · PDB 4OO8 · 1,301 RESIDUES</p>
			</div>
		</main>
	);
}
