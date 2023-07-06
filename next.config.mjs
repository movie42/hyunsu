/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    mdxRs: true
  }
};

import createMDX from "@next/mdx";

const withMDX = createMDX();

export default withMDX(nextConfig);
