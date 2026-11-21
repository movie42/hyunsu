import { makeRouteHandler } from '@keystatic/next/route-handler';
import keystaticConfig from '../../../../../keystatic.config';

const isConfigured =
	process.env.NODE_ENV === 'development' ||
	Boolean(
		process.env.KEYSTATIC_GITHUB_CLIENT_ID && process.env.KEYSTATIC_GITHUB_CLIENT_SECRET && process.env.KEYSTATIC_SECRET
	);

function notConfigured() {
	return new Response('Not Found', { status: 404 });
}

export const { GET, POST } = isConfigured
	? makeRouteHandler({ config: keystaticConfig })
	: { GET: notConfigured, POST: notConfigured };
