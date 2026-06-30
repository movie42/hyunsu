import { SITE_URL } from '@/lib/site';
import { generateUrl, getAllPosts } from '@/lib/server/posts';

export const dynamic = 'force-static';

function escapeXml(value: string): string {
	return value
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&apos;');
}

export function GET() {
	const posts = getAllPosts();
	const today = new Date().toISOString().split('T')[0];
	const urls = posts
		.map((post) => {
			const url = `${SITE_URL}${generateUrl({ tags: post.tags, slug: post.slug })}`;
			return `
	<url>
		<loc>${escapeXml(url)}</loc>
		<lastmod>${post.date}</lastmod>
	</url>`;
		})
		.join('');

	const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
	<url>
		<loc>${escapeXml(SITE_URL)}</loc>
		<lastmod>${today}</lastmod>
	</url>
	<url>
		<loc>${escapeXml(`${SITE_URL}/posts/programming`)}</loc>
		<lastmod>${today}</lastmod>
	</url>
	<url>
		<loc>${escapeXml(`${SITE_URL}/posts/etc`)}</loc>
		<lastmod>${today}</lastmod>
	</url>
	<url>
		<loc>${escapeXml(`${SITE_URL}/posts/movie`)}</loc>
		<lastmod>${today}</lastmod>
	</url>
	${urls}
</urlset>`;

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8',
			'Cache-Control': 'public, max-age=0, s-maxage=3600'
		}
	});
}
