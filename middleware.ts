import type { NextRequest } from 'next/server';
// import { auth0 } from './lib/auth0'; // Deshabilitado - usando client-side auth

export async function middleware(request: NextRequest) {
  // Middleware deshabilitado - usando client-side authentication
  // return await auth0.middleware(request);
  return;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    // Matcher deshabilitado
    // '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
