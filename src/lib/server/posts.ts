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

export interface Post extends PostMatter {
	slug: string;
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
	const relativePath = '/src/content/markdown-pages/' + path.relative(POST_PATH, absPath);

	return {
		...grayMatter,
		tags: grayMatter.tags?.filter(Boolean) ?? [],
		date: dayjs(grayMatter.date).format('YYYY-MM-DD'),
		content,
		slug,
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
	tags
}: {
	slug?: string;
	tags?: string[];
	baseUrl?: string;
}): string {
	if (!tags) return '404';
	if (tags.includes('etc')) return `${baseUrl}/etc/${slug}`;
	if (tags.includes('movie')) return `${baseUrl}/movie/${slug}`;
	return `${baseUrl}/programming/${slug}`;
}

export function getCategory(tags: string[]): 'etc' | 'movie' | 'programming' {
	if (tags.includes('etc')) return 'etc';
	if (tags.includes('movie')) return 'movie';
	return 'programming';
}
