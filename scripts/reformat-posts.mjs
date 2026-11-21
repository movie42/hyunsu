import fs from 'node:fs';
import { registerHooks } from 'node:module';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root = process.cwd();
const dist = path.join(root, 'node_modules/@keystatic/core/dist');
const browserBuilds = {
	'@keystatic/core': path.join(dist, 'keystatic-core.js'),
	'@keystatic/core/content-components': path.join(dist, 'keystatic-core-content-components.js')
};

registerHooks({
	resolve(specifier, context, nextResolve) {
		const target = browserBuilds[specifier];
		if (target) return { url: pathToFileURL(target).href, shortCircuit: true, format: 'module' };
		return nextResolve(specifier, context);
	}
});

const internalsPath = path.join(dist, '__reformat-internals.js');
fs.writeFileSync(
	internalsPath,
	fs.readFileSync(path.join(dist, 'keystatic-core-ui.js'), 'utf8') +
		'\nexport { parseEntry as __parseEntry, serializeEntryToFiles as __serializeEntryToFiles, getCollectionItemPath as __getCollectionItemPath, getCollectionFormat as __getCollectionFormat };\n'
);

const write = process.argv.includes('--write');
const only = process.argv.slice(2).filter((arg) => !arg.startsWith('--'));

try {
	const { default: config } = await import(pathToFileURL(path.join(root, 'keystatic.config.ts')).href);
	const internals = await import(pathToFileURL(internalsPath).href);
	const collection = config.collections.posts;
	const format = internals.__getCollectionFormat(config, 'posts');
	const contentRoot = path.join(root, 'src/content/markdown-pages');

	const files = [];
	const walk = (dir) => {
		for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
			const full = path.join(dir, entry.name);
			if (entry.isDirectory()) walk(full);
			else if (entry.name.endsWith('.mdx')) files.push(full);
		}
	};
	walk(contentRoot);

	let failed = 0;
	let changed = 0;
	for (const file of files) {
		const slug = path.relative(contentRoot, file).replace(/\.mdx$/, '');
		if (only.length && !only.includes(slug)) continue;
		const dirpath = internals.__getCollectionItemPath(config, 'posts', slug);
		const original = fs.readFileSync(file);
		try {
			const { initialState } = internals.__parseEntry(
				{ dirpath, format, schema: collection.schema, slug: { field: collection.slugField, slug } },
				new Map([[`${dirpath}.mdx`, new Uint8Array(original)]])
			);
			const [entry] = internals.__serializeEntryToFiles({
				basePath: dirpath,
				format,
				schema: collection.schema,
				slug: { field: collection.slugField, value: slug },
				state: initialState
			});
			const next = Buffer.from(entry.contents);
			if (!next.equals(original)) {
				changed += 1;
				if (write) fs.writeFileSync(file, next);
			}
		} catch (error) {
			failed += 1;
			const message = error instanceof Error ? error.message : String(error);
			console.error(`FAIL ${slug}: ${message.split('\n').slice(0, 3).join(' | ')}`);
		}
	}
	console.log(`${write ? 'rewrote' : 'would rewrite'} ${changed}, failed ${failed}, total ${files.length}`);
	if (failed) process.exitCode = 1;
} finally {
	fs.rmSync(internalsPath, { force: true });
}
