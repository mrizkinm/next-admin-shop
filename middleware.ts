import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { AnyARecord } from 'node:dns';

export async function middleware(req: NextRequest) {
  const refreshToken = req.cookies.get('refreshToken');

  // Redirect ke login jika tidak ada token
  if (!refreshToken) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  try {
    const { payload }: { payload: { id: string } } = await jwtVerify(
      refreshToken.value,
      new TextEncoder().encode(process.env.REFRESH_TOKEN_SECRET)
    );

    // Set user info (optional) to request headers
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('x-user-id', payload.id);

    // Lanjutkan ke halaman tujuan
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error: any) {
    // Jika token kadaluwarsa atau tidak valid, arahkan ke halaman login
    console.error('JWT verification failed:', error.message);
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/data/:path*'],
};
