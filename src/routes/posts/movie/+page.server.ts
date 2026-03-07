import { getAllPosts } from '$lib/server/posts';

export function load() {
	const posts = getAllPosts()
		.filter((post) => post.tags.includes('movie'))
		.map((post) => ({
			slug: post.slug,
			title: post.title,
			date: post.date,
			tags: post.tags,
			description: post.description ?? '',
			href: `/posts/movie/${post.slug}`
		}));

	return { posts };
}
