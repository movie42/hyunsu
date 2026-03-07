import { getAllPosts, generateUrl } from '$lib/server/posts';

const SITE_URL = 'https://hyunsu.info';

export function GET() {
	const posts = getAllPosts();

	const items = posts
		.map(
			(post) => `
		<item>
			<title><![CDATA[${post.title}]]></title>
			<description><![CDATA[${post.content.slice(0, 100)}...]]></description>
			<link>${SITE_URL}${generateUrl({ tags: post.tags, slug: post.slug })}</link>
			<guid>${SITE_URL}${generateUrl({ tags: post.tags, slug: post.slug })}</guid>
			<pubDate>${new Date(post.date).toUTCString()}</pubDate>
		</item>`
		)
		.join('');

	const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
	<channel>
		<title>현수의 블로그</title>
		<description>개발 &amp; 잡다한 이야기를 끄적이는 곳입니다.</description>
		<link>${SITE_URL}</link>
		<language>kr</language>
		${items}
	</channel>
</rss>`;

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml'
		}
	});
}
