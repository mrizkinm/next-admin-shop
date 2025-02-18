// import { NextRequest, NextResponse } from 'next/server';
// import { jwtVerify } from 'jose';
import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

// export async function middleware(req: NextRequest) {
//   const refreshToken = req.cookies.get('refreshToken');

//   // Redirect ke login jika tidak ada token
//   if (!refreshToken) {
//     return NextResponse.redirect(new URL('/login', req.url));
//   }

//   try {
//     const { payload }: any = await jwtVerify(
//       refreshToken.value,
//       new TextEncoder().encode(process.env.REFRESH_TOKEN_SECRET)
//     );

//     // Set user info (optional) to request headers
//     const requestHeaders = new Headers(req.headers);
//     requestHeaders.set('x-user-id', payload.id);

//     // Lanjutkan ke halaman tujuan
//     return NextResponse.next({
//       request: {
//         headers: requestHeaders,
//       },
//     });
//   } catch (error: any) {
//     // Jika token kadaluwarsa atau tidak valid, arahkan ke halaman login
//     console.error('JWT verification failed:', error.message);
//     // return NextResponse.redirect(new URL('/login', req.url));
//   }
// }

export const config = {
  matcher: [
    '/dashboard/:path*',
    // '/api/category/:path*',
    // '/api/customer/:path*',
    // '/api/order/:path*',
    // '/api/product/:path*',
    // '/api/shop/:path*',
    // '/api/user/password',
    // '/api/user/profile'
  ],
};
