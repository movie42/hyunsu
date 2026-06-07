import { getAllPosts, generateUrl } from '$lib/server/posts';

const SITE_URL = 'https://hyunsu.info';

export function GET() {
	const posts = getAllPosts();

	const urls = posts
		.map(
			(post) => `
	<url>
		<loc>${SITE_URL}${generateUrl({ category: post.category, slug: post.slug })}</loc>
		<lastmod>${post.date}</lastmod>
	</url>`
		)
		.join('');

	const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
	<url>
		<loc>${SITE_URL}</loc>
		<lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
	</url>
	${urls}
</urlset>`;

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml'
		}
	});
}
