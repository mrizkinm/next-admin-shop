import { NextResponse } from 'next/server';
import db from "@/lib/db";

export async function POST(req) {
  const refreshToken = req.cookies.get('refreshToken');
  if (!refreshToken) return NextResponse.json({ message: 'Token tidak ditemukan' }, { status: 401 });

  try {
    // 1️⃣ Verifikasi refresh token
    const { payload } = await jwtVerify(
      refreshToken, 
      new TextEncoder().encode(process.env.JWT_REFRESH_SECRET)
    );
    if (!payload) return NextResponse.json({ message: 'Token tidak valid' }, { status: 401 });

    // Cocokkan token dengan token di database
    const user = await db.user.findUnique({
      where: { id: payload.id },
    });

    if (!user || user.token !== refreshToken) {
      return NextResponse.json({ message: 'Token tidak cocok' }, { status: 401 });
    }

    // Buat access token baru
    const accessToken = await new SignJWT({ id: user.id, email: user.email })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('15m')
      .sign(new TextEncoder().encode(process.env.NEXT_PUBLIC_ACCESS_TOKEN_SECRET));

    return NextResponse.json({ accessToken });
  } catch (error) {
    console.error('Refresh Token error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}