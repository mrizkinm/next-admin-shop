import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(req) {
  const refreshToken = req.cookies.get('refreshToken');

  // Redirect ke login jika tidak ada token
  if (!refreshToken) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  try {
    const { payload } = await jwtVerify(
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
  } catch (error) {
    // Jika token kadaluwarsa atau tidak valid, arahkan ke halaman login
    console.error('JWT verification failed:', error.message);
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/data/:path*'],
};
