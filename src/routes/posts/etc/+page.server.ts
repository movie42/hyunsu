import { getAllPosts } from '$lib/server/posts';

export function load() {
	const posts = getAllPosts()
		.filter((post) => post.tags.includes('etc'))
		.map((post) => ({
			slug: post.slug,
			title: post.title,
			date: post.date,
			tags: post.tags,
			href: `/posts/etc/${post.slug}`
		}));

	return { posts };
}
