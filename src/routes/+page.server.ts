import { getAllPosts, generateUrl } from '$lib/server/posts';

export function load() {
	const allPosts = getAllPosts();
	const recentPosts = allPosts.slice(0, 4).map((post) => ({
		slug: post.slug,
		title: post.title,
		date: post.date,
		tags: post.tags,
		href: generateUrl({ slug: post.slug, tags: post.tags })
	}));

	return { posts: recentPosts };
}
