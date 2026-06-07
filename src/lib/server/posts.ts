import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import dayjs from 'dayjs';

const POST_PATH = path.join(process.cwd(), 'src/content/markdown-pages');

export interface PostMatter {
	title: string;
	description?: string;
	tags: string[];
	draft?: boolean;
	date: string;
}

export type PostCategory = 'programming' | 'general' | 'trash';

export interface Post extends PostMatter {
	slug: string;
	category: PostCategory;
	content: string;
	filePath: string;
	wordCount: number;
}

function globMdx(dir: string): string[] {
	const results: string[] = [];
	if (!fs.existsSync(dir)) return results;
	for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
		const fullPath = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			results.push(...globMdx(fullPath));
		} else if (entry.name.endsWith('.mdx') || entry.name.endsWith('.md')) {
			results.push(fullPath);
		}
	}
	return results;
}

export function getPost(absPath: string): Post | undefined {
	const file = fs.readFileSync(absPath, { encoding: 'utf8' });
	const { content, data } = matter(file);
	const grayMatter = data as PostMatter;

	if (grayMatter.draft) return undefined;

	const slug = path.basename(absPath).replace(/\.(mdx|md)$/, '');
	const relative = path.relative(POST_PATH, absPath);
	const relativePath = '/src/content/markdown-pages/' + relative;
	const category = getCategoryFromPath(relative);

	return {
		...grayMatter,
		tags: grayMatter.tags?.filter(Boolean) ?? [],
		date: dayjs(grayMatter.date).format('YYYY-MM-DD'),
		content,
		slug,
		category,
		filePath: relativePath,
		wordCount: content.split(/\s+/gu).length
	};
}

export function getAllPosts(): Post[] {
	const files = globMdx(POST_PATH);
	return files
		.map((f) => getPost(f))
		.filter((p): p is Post => p !== undefined)
		.sort((a, b) => new Date(b.date).valueOf() - new Date(a.date).valueOf());
}

export function getPostBySlug(slug: string): Post | undefined {
	return getAllPosts().find((p) => p.slug === slug);
}

export function generateUrl({
	slug = '404',
	baseUrl = '/posts',
	category
}: {
	slug?: string;
	category?: PostCategory;
	baseUrl?: string;
}): string {
	if (!category) return '404';
	return `${baseUrl}/${category}/${slug}`;
}

function getCategoryFromPath(relativePath: string): PostCategory {
	const topLevelDirectory = relativePath.split(path.sep)[0];

	if (
		topLevelDirectory === 'programming' ||
		topLevelDirectory === 'general' ||
		topLevelDirectory === 'trash'
	) {
		return topLevelDirectory;
	}

	return 'trash';
}
