import { getAllPosts } from '$lib/server/posts';

export function load() {
	const posts = getAllPosts()
		.filter((post) => post.category === 'trash')
		.map((post) => ({
			slug: post.slug,
			title: post.title,
			date: post.date,
			tags: post.tags,
			description: post.description ?? '',
			href: `/posts/trash/${post.slug}`
		}));

	return { posts };
}
