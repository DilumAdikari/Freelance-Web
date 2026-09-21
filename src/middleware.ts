import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || '');

interface TokenPayload {
  userId: string;
  email: string;
  role: 'CLIENT' | 'FREELANCER' | 'ADMIN';
}

const CLIENT_ROUTES = ['/dashboard/client'];
const FREELANCER_ROUTES = ['/dashboard/freelancer'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('auth_token')?.value;

  let payload: TokenPayload | null = null;
  if (token) {
    try {
      const { payload: verifiedPayload } = await jwtVerify(token, JWT_SECRET);
      payload = verifiedPayload as unknown as TokenPayload;
    } catch {
      payload = null;
    }
  }

  const isAuthenticated = !!payload;

  // 1. Logged in users trying to access login/register
  if (isAuthenticated && (pathname === '/login' || pathname === '/register')) {
    if (payload?.role === 'CLIENT') {
      return NextResponse.redirect(new URL('/dashboard/client', request.url));
    }
    return NextResponse.redirect(new URL('/dashboard/freelancer', request.url));
  }

  // 2. Unauthenticated users trying to access protected dashboards
  const isProtectedRoute =
    CLIENT_ROUTES.some((route) => pathname.startsWith(route)) ||
    FREELANCER_ROUTES.some((route) => pathname.startsWith(route));

  if (!isAuthenticated && isProtectedRoute) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 3. Role-based route guard
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