import { MotionRoot } from '@/lib/motion';
import { Nav } from '@/components/Nav';
import { Hero } from '@/components/Hero';
import { Science, Journey, Platform, Capabilities, Stats, Cta } from '@/components/Sections';

export default function Page() {
	return (
		<MotionRoot>
			<a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-paper">
				Skip to content
			</a>
			<Nav />
			<main id="main-content">
				<Hero />
				<Science />
				<Journey />
				<Platform />
				<Capabilities />
				<Stats />
				<Cta />
			</main>
		</MotionRoot>
	);
}
