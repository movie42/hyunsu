import { getAllPosts, generateUrl } from '$lib/server/posts';

export function load() {
	const allPosts = getAllPosts();
	const mapPost = (post: (typeof allPosts)[0]) => ({
		slug: post.slug,
		title: post.title,
		date: post.date,
		tags: post.tags,
		description: post.description ?? '',
		wordCount: post.wordCount,
		href: generateUrl({ slug: post.slug, category: post.category })
	});

	return {
		heroPost: allPosts[0] ? mapPost(allPosts[0]) : null,
		pastPosts: allPosts.slice(1, 9).map(mapPost)
	};
}
