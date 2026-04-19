import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function getRoleDashboard(role: string): string {
  switch (role?.toLowerCase()) {
    case 'client': return '/client';
    case 'lawyer':
    case 'advokat': return '/advokat';
    case 'admin': return '/admin';
    default: return '/';
  }
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const role = request.cookies.get('role')?.value;

  // Lindungi route dashboard
  if (
    request.nextUrl.pathname.startsWith('/client') ||
    request.nextUrl.pathname.startsWith('/advokat') ||
    request.nextUrl.pathname.startsWith('/admin')
  ) {
    if (!token) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }

  // Redirect user yang sudah login dari halaman auth ke dashboard sesuai role
  if (
    request.nextUrl.pathname.startsWith('/auth/login') ||
    request.nextUrl.pathname.startsWith('/auth/register')
  ) {
    if (token && role) {
      const dashboard = getRoleDashboard(role);
      return NextResponse.redirect(new URL(dashboard, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/client/:path*', '/advokat/:path*', '/admin/:path*', '/auth/:path*'],
};
