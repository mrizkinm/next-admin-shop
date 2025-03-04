import { NextResponse } from 'next/server';
import { SignJWT, jwtVerify } from 'jose';
import db from "@/lib/db";
import { cookies } from 'next/headers';

export async function GET(req: Request) {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get('refreshToken')?.value;
  if (!refreshToken) return NextResponse.json({ message: 'Token tidak ditemukan' }, { status: 401 });
  
  try {
    // Verifikasi refresh token
    const { payload } = await jwtVerify(
      refreshToken, 
      new TextEncoder().encode(process.env.REFRESH_TOKEN_SECRET)
    );
    if (!payload) return NextResponse.json({ message: 'Token tidak valid' }, { status: 401 });

    // Cocokkan token dengan token di database
    const user = await db.user.findUnique({
      where: { id: Number(payload.id) },
    });

    if (!user || user.token !== refreshToken) {
      return NextResponse.json({ message: 'Token tidak cocok' }, { status: 401 });
    }

    // Buat access token baru
    const accessToken = await new SignJWT({ id: user.id, name: user.name, email: user.email })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('15m')
      .sign(new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET));

    const response = NextResponse.json({ accessToken });
    response.cookies.set('accessToken', accessToken, {
      httpOnly: false,  // Untuk keamanan, hanya bisa diakses oleh server
      secure: process.env.NODE_ENV === 'production',  // Set secure di production
      maxAge: 15 * 60, // Set waktu kadaluarsa 15 menit
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Refresh Token error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}