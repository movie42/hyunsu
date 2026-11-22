import { NextResponse, type NextRequest } from 'next/server';

const VERCEL_PROJECT = 'hyunsu';
const VERCEL_SCOPE = 'movie42s-projects';

function toBranchSlug(branch: string) {
	return branch
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

export function GET(request: NextRequest) {
	const slug = request.nextUrl.searchParams.get('slug');
	const branch = request.nextUrl.searchParams.get('branch') ?? '';
	if (!slug) return new Response('Not Found', { status: 404 });

	const previewPath = `/preview/${slug.split('/').map(encodeURIComponent).join('/')}`;
	const deployedBranch = process.env.VERCEL_GIT_COMMIT_REF;

	if (!branch || !deployedBranch || branch === deployedBranch) {
		return NextResponse.redirect(new URL(previewPath, request.url));
	}

	const origin = `https://${VERCEL_PROJECT}-git-${toBranchSlug(branch)}-${VERCEL_SCOPE}.vercel.app`;
	return NextResponse.redirect(new URL(previewPath, origin));
}
