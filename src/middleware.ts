import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET as string);

interface TokenPayload {
  userId: string;
  email: string;
  role: 'CLIENT' | 'FREELANCER' | 'ADMIN';
}

const PUBLIC_ROUTES = ['/login', '/register', '/'];
const CLIENT_ROUTES = ['/dashboard/client'];
const FREELANCER_ROUTES = ['/dashboard/freelancer'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('auth_token')?.value;

  // 1. Verify token if present
  let payload: TokenPayload | null = null;
  if (token) {
    try {
      const { payload: verifiedPayload } = await jwtVerify(token, JWT_SECRET);
      payload = verifiedPayload as unknown as TokenPayload;
    } catch {
      // Invalid/Expired token
      payload = null;
    }
  }

  const isAuthenticated = !!payload;
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

  // 2. Redirect logged-in users away from auth pages
  if (isAuthenticated && (pathname === '/login' || pathname === '/register')) {
    if (payload?.role === 'CLIENT') {
      return NextResponse.redirect(new URL('/dashboard/client', request.url));
    }
    return NextResponse.redirect(new URL('/dashboard/freelancer', request.url));
  }

  // 3. Protect authenticated routes from unauthenticated users
  const isProtectedRoute =
    CLIENT_ROUTES.some((route) => pathname.startsWith(route)) ||
    FREELANCER_ROUTES.some((route) => pathname.startsWith(route));

  if (!isAuthenticated && isProtectedRoute) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 4. Role-based access control
  if (isAuthenticated && payload) {
    const isAccessingClient = CLIENT_ROUTES.some((route) => pathname.startsWith(route));
    const isAccessingFreelancer = FREELANCER_ROUTES.some((route) => pathname.startsWith(route));

    if (isAccessingClient && payload.role !== 'CLIENT' && payload.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard/freelancer', request.url));
    }

    if (isAccessingFreelancer && payload.role !== 'FREELANCER' && payload.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard/client', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};