import { getAllPosts } from '$lib/server/posts';
import { redirect } from '@sveltejs/kit';

export function entries() {
	return getAllPosts()
		.filter((post) => post.category === 'general' && post.tags.includes('movie'))
		.map((post) => ({ slug: post.slug }));
}

export function load({ params }) {
	redirect(308, `/posts/general/${params.slug}`);
}
