import { defineMiddleware } from 'astro:middleware';

/**
 * Astro Middleware: Route Protection Gateway
 *
 * Ensures that all administrative and warehouse operations under `/dashboard`
 * require an authenticated session. Unauthenticated visitors are redirected
 * to the `/login` gateway with a return redirect parameter.
 */
export const onRequest = defineMiddleware(async (context, next) => {
	const pathname = context.url.pathname;

	// Gated routes for SGA warehouse intranet
	if (pathname === '/dashboard' || pathname.startsWith('/dashboard/')) {
		const sessionCookie = context.cookies.get('sga_session')?.value;
		const insforgeToken = context.cookies.get('insforge-auth-token')?.value;

		if (!sessionCookie && !insforgeToken) {
			const redirectTarget = `/login?redirect=${encodeURIComponent(pathname)}`;
			return context.redirect(redirectTarget);
		}
	}

	return next();
});
