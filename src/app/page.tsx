import { MotionRoot } from '@/lib/motion';
import { SceneRoot } from '@/components/three/SceneRoot';
import { Preloader } from '@/components/ui/Preloader';
import { Cursor } from '@/components/ui/Cursor';
import { Nav } from '@/components/ui/Nav';
import { ScrollRail, SectionCounter, Ticker } from '@/components/ui/Chrome';
import { Hero } from '@/components/sections/Hero';
import { Manifesto } from '@/components/sections/Manifesto';
import { Science } from '@/components/sections/Science';
import { Pipeline } from '@/components/sections/Pipeline';
import { Platform } from '@/components/sections/Platform';
import { Impact } from '@/components/sections/Impact';
import { Contact } from '@/components/sections/Contact';

export default function Page() {
	return (
		<MotionRoot>
			<Preloader />
			<Cursor />

			{/* One persistent WebGL scene behind the whole document. */}
			<SceneRoot />
			<div aria-hidden className="scene-scrim" />

			<a
				href="#main"
				className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-paper focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-ink"
			>
				Skip to content
			</a>

			<ScrollRail />
			<SectionCounter />
			<Nav />

			<main id="main" className="relative z-10">
				<Hero />
				<Ticker />
				<Manifesto />
				<Science />
				<Pipeline />
				<Platform />
				<Impact />
				<Contact />
			</main>
		</MotionRoot>
	);
}
