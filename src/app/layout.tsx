import type { Metadata, Viewport } from 'next';
/**
 * Fonts are self-hosted via Fontsource rather than next/font/google: the build
 * then has no network dependency on fonts.googleapis.com, and the woff2 files
 * ship from our own origin (one less third-party connection at runtime).
 */
import '@fontsource-variable/geologica/wght.css';
import '@fontsource-variable/inter/wght.css';
import '@fontsource/newsreader/400-italic.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import { copy } from '@/lib/copy';
import './globals.css';

export const metadata: Metadata = {
	metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://norvex-bio.vercel.app'),
	title: copy.siteTitle,
	description: copy.siteDescription,
	openGraph: {
		title: copy.siteTitle,
		description: copy.siteDescription,
		type: 'website',
	},
};

export const viewport: Viewport = {
	themeColor: '#050d20',
	colorScheme: 'dark',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body>
				{children}
				<div aria-hidden className="grain" />
			</body>
		</html>
	);
}
