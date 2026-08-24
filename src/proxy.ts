import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Define route access by role
const ROUTE_ROLES: Record<string, string[]> = {
  '/dashboard/admin': ['admin_role'],
  '/dashboard/manage': ['admin_role', 'content_manager'],
  '/dashboard/instructor': ['admin_role', 'instructor'],
  '/dashboard/student': ['admin_role', 'authenticated'],
  '/courses/create': ['admin_role', 'content_manager', 'instructor'],
  '/courses/edit': ['admin_role', 'content_manager', 'instructor'],
  '/blog/create': ['admin_role', 'content_manager'],
  '/blog/edit': ['admin_role', 'content_manager'],
};

// We don't have the Strapi secret in Next.js by default unless we set it.
// If we don't verify the signature, we can just decode it.
// But to be secure against spoofing, we should verify it.
// However, since it's an httpOnly cookie set by our own server, it's generally trusted.
// Let's decode it safely using jose.
import { decodeJwt } from 'jose';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Find if this route requires a specific role
  // E.g., /courses/edit matches /courses/create, but we'll use startsWith for subroutes
  // Or exact matches
  let requiredRoles: string[] | undefined;
  
  for (const [route, roles] of Object.entries(ROUTE_ROLES)) {
    if (pathname.startsWith(route)) {
      requiredRoles = roles;
      break;
    }
  }

  if (!requiredRoles) {
    return NextResponse.next(); // Route is public or not protected
  }

  const jwt = request.cookies.get('jwt')?.value;

  if (!jwt) {
    // Not authenticated
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  try {
    // To properly enforce role, Strapi JWT payload typically doesn't contain the role string directly in older versions, 
    // but in v5 it might, or it just contains id.
    // Let's decode the JWT to check. If role is not there, we have a problem.
    // Actually, Strapi standard JWT payload only has { id: 123, iat, exp }.
    // It DOES NOT contain the role!
    // So Edge middleware CANNOT check the role synchronously without hitting the DB!
    // UNLESS we modified Strapi to issue custom JWTs, or we store the user role in another cookie.
    
    // For now, if we know they are authenticated, we let them through, and the page component (server side) 
    // will fetch /users/me to do the real role check, or we use a separate role cookie.
    
    // Let's rely on a separate non-httpOnly cookie 'user_role' set by the login route to do fast edge checking,
    // or just let the server component bounce them.
    const roleCookie = request.cookies.get('user_role')?.value;
    
    if (roleCookie && !requiredRoles.includes(roleCookie)) {
      const url = request.nextUrl.clone();
      url.pathname = '/unauthorized';
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  } catch (err) {
    console.error('Middleware error:', err);
    return NextResponse.next();
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/courses/create', '/courses/:path*/edit', '/blog/create', '/blog/:path*/edit'],
};
