import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	trailingSlash: false,
	allowedDevOrigins: ['127.0.0.1'],
	pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
	turbopack: {
		root: process.cwd()
	}
};

export default nextConfig;
