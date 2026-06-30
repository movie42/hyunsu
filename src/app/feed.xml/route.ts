import { FEED_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/site';
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

function cdata(value: string): string {
	return `<![CDATA[${value.replaceAll(']]>', ']]]]><![CDATA[>')}]]>`;
}

export function GET() {
	const posts = getAllPosts();
	const items = posts
		.map((post) => {
			const url = `${SITE_URL}${generateUrl({ tags: post.tags, slug: post.slug })}`;
			const description = post.description || `${post.content.slice(0, 100)}...`;

			return `
		<item>
			<title>${cdata(post.title)}</title>
			<description>${cdata(description)}</description>
			<link>${escapeXml(url)}</link>
			<guid>${escapeXml(url)}</guid>
			<pubDate>${new Date(post.date).toUTCString()}</pubDate>
		</item>`;
		})
		.join('');

	const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
	<channel>
		<title>${escapeXml(SITE_NAME)}</title>
		<description>${escapeXml(FEED_DESCRIPTION)}</description>
		<link>${escapeXml(SITE_URL)}</link>
		<language>ko</language>
		${items}
	</channel>
</rss>`;

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8',
			'Cache-Control': 'public, max-age=0, s-maxage=3600'
		}
	});
}
