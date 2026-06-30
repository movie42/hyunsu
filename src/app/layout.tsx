import type { Metadata } from 'next';
import { Header } from '@/components/Header';
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/site';
import './globals.css';

export const metadata: Metadata = {
	metadataBase: new URL(SITE_URL),
	title: {
		default: SITE_NAME,
		template: `%s | ${SITE_NAME}`
	},
	description: SITE_DESCRIPTION,
	icons: {
		icon: '/favicon.png'
	},
	alternates: {
		canonical: '/',
		types: {
			'application/rss+xml': '/feed.xml'
		}
	},
	openGraph: {
		type: 'website',
		locale: 'ko_KR',
		url: SITE_URL,
		siteName: SITE_NAME,
		title: SITE_NAME,
		description: SITE_DESCRIPTION
	}
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="ko">
			<body>
				<Header />
				{children}
			</body>
		</html>
	);
}
