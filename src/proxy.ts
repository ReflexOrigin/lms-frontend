import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const jwt = request.cookies.get('jwt')?.value;
  
  // Check if JWT is expired. If so, clear cookies and redirect to login
  if (jwt) {
    try {
      const payload = JSON.parse(atob(jwt.split('.')[1]));
      if (payload.exp && payload.exp * 1000 < Date.now()) {
        const res = NextResponse.redirect(new URL('/login?expired=1', request.url));
        res.cookies.delete('jwt');
        res.cookies.delete('user_role');
        return res;
      }
    } catch (e) {
      // Invalid JWT format
      const res = NextResponse.redirect(new URL('/login', request.url));
      res.cookies.delete('jwt');
      res.cookies.delete('user_role');
      return res;
    }
  }

  let userRole = request.cookies.get('user_role')?.value?.toLowerCase();
  const { pathname } = request.nextUrl;

  // Normalize Strapi default roles to our LMS roles
  if (userRole === 'authenticated') userRole = 'student';
  if (userRole === 'administrator' || userRole === 'admin_role') userRole = 'admin';
  if (userRole === 'content_manager') userRole = 'manager';

  // 1. If not logged in and trying to access a protected route, redirect to homepage (/)
  const isProtectedRoute = pathname.startsWith('/dashboard') || 
                           pathname.startsWith('/courses/create') || 
                           pathname.includes('/edit');
  if (!jwt && isProtectedRoute) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 2. If logged in and trying to access public auth pages, redirect to specific dashboard
  if (jwt && userRole && (pathname === '/login' || pathname === '/register')) {
    let dashPath = `/dashboard/${userRole}`;
    
    // Fallback if role doesn't match a dashboard
    if (!['admin', 'manager', 'instructor', 'student'].includes(userRole)) {
        dashPath = '/dashboard/student';
    }
    
    return NextResponse.redirect(new URL(dashPath, request.url));
  }

  // 3. Strict Role Isolation within /dashboard namespace
  if (pathname.startsWith('/dashboard/') && jwt && userRole) {
    const segments = pathname.split('/');
    // e.g. /dashboard/admin -> segments[2] is 'admin'
    const requestedWorkspace = segments[2]; 

    // If the workspace doesn't match the user's role, block access
    if (requestedWorkspace && requestedWorkspace !== userRole) {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
