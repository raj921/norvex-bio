import type { Metadata } from 'next';
import { Geologica, Inter, Newsreader, IBM_Plex_Mono } from 'next/font/google';
import { copy } from '@/lib/copy';
import './globals.css';

const display = Geologica({ subsets: ['latin'], variable: '--ff-geologica' });
const body = Inter({ subsets: ['latin'], variable: '--ff-inter' });
const editorial = Newsreader({ subsets: ['latin'], style: ['italic'], weight: ['400', '500'], variable: '--ff-newsreader' });
const mono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--ff-plex' });

export const metadata: Metadata = {
	metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
	title: copy.siteTitle,
	description: copy.siteDescription,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" className={`${display.variable} ${body.variable} ${editorial.variable} ${mono.variable}`}>
			<body>
				{children}
				<div aria-hidden className="grain" />
			</body>
		</html>
	);
}
