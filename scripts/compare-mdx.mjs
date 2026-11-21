import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import remarkGfm from 'remark-gfm';
import remarkMdx from 'remark-mdx';
import remarkParse from 'remark-parse';
import { unified } from 'unified';

const ref = process.argv[2] ?? 'HEAD';
const contentRoot = 'src/content/markdown-pages';
const processor = unified().use(remarkParse).use(remarkMdx).use(remarkGfm);

function strip(node) {
	if (Array.isArray(node)) return node.map(strip);
	if (!node || typeof node !== 'object') return node;
	const out = {};
	for (const [key, value] of Object.entries(node)) {
		if (key === 'position' || key === 'data') continue;
		out[key] = strip(value);
	}
	if (out.type === 'mdxJsxAttribute' && out.value && typeof out.value === 'object') {
		out.value = { type: out.value.type, value: out.value.value };
	}
	return out;
}

function merge(nodes) {
	const out = [];
	for (const node of nodes) {
		const prev = out[out.length - 1];
		if (prev && prev.type === 'text' && node.type === 'text') prev.value += node.value;
		else out.push(node);
	}
	return out;
}

function normalize(node) {
	if (Array.isArray(node)) return merge(node.map(normalize));
	if (!node || typeof node !== 'object') return node;
	const out = { ...node };
	if (out.children) out.children = normalize(out.children);
	if (out.type === 'text') out.value = out.value.replace(/[ \t]*\n[ \t]*/g, '\n');
	if (out.type === 'list') delete out.spread;
	if (out.type === 'listItem') delete out.spread;
	return out;
}

function tree(source) {
	return normalize(strip(processor.runSync(processor.parse(source))));
}

function meta(data) {
	const date = data.date instanceof Date ? data.date.toISOString().slice(0, 10) : String(data.date ?? '');
	return {
		title: data.title ?? '',
		date: date.slice(0, 10),
		tags: (data.tags ?? []).filter(Boolean),
		description: data.description ?? '',
		draft: Boolean(data.draft)
	};
}

function firstDiff(a, b, at = '') {
	if (JSON.stringify(a) === JSON.stringify(b)) return null;
	if (typeof a !== 'object' || typeof b !== 'object' || !a || !b) return `${at}: ${JSON.stringify(a)?.slice(0, 160)} → ${JSON.stringify(b)?.slice(0, 160)}`;
	for (const key of new Set([...Object.keys(a), ...Object.keys(b)])) {
		const found = firstDiff(a[key], b[key], `${at}/${key}`);
		if (found) return found;
	}
	return `${at}: differs`;
}

const files = execFileSync('git', ['ls-files', contentRoot], { encoding: 'utf8' })
	.split('\n')
	.filter((file) => file.endsWith('.mdx'));

let differing = 0;
for (const file of files) {
	const before = matter(execFileSync('git', ['show', `${ref}:${file}`], { encoding: 'utf8' }));
	const after = matter(fs.readFileSync(path.resolve(file), 'utf8'));
	const metaDiff = firstDiff(meta(before.data), meta(after.data));
	const bodyDiff = firstDiff(tree(before.content), tree(after.content));
	if (metaDiff || bodyDiff) {
		differing += 1;
		console.log(`DIFF ${file}\n  ${metaDiff ? `frontmatter ${metaDiff}` : `body ${bodyDiff}`}`);
	}
}
console.log(`${differing} of ${files.length} posts differ from ${ref}`);
process.exitCode = differing ? 1 : 0;
