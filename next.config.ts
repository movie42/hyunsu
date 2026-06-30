import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	trailingSlash: false,
	pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
	turbopack: {
		root: process.cwd()
	}
};

export default nextConfig;
