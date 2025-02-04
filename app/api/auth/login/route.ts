import bcrypt from "bcryptjs";
import { SignJWT } from 'jose';
import db from "@/lib/db";
import { NextResponse } from "next/server";
import { z } from "zod";

const formSchema = z.object({
  email: z.string().email("Email tidak valid").min(1, "Email tidak boleh kosong"),
  password: z.string().min(6, "Password harus memiliki minimal 6 karakter"),
});

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const result = formSchema.safeParse({ email, password });

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;

      // Ubah format menjadi { fieldName: "Error message" }
      const simplifiedErrors = Object.fromEntries(
        Object.entries(errors).map(([key, value]) => [key, value?.[0] || 'Invalid value'])
      );

      return NextResponse.json({ errors: simplifiedErrors }, { status: 400 });
    }
    
    // Cari user berdasarkan email
    const user = await db.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ errors: "Email atau password salah" }, { status: 401 });
    }

    // Verifikasi password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json({ errors: "Email atau password salah" }, { status: 401 });
    }

    // Buat access token dan refresh token
    const accessToken = await new SignJWT({ id: user.id, name: user.name, email: user.email })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('15m')
    .sign(new TextEncoder().encode(process.env.NEXT_PUBLIC_ACCESS_TOKEN_SECRET));

    const refreshToken = await new SignJWT({ id: user.id })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(new TextEncoder().encode(process.env.REFRESH_TOKEN_SECRET));

    // Simpan refresh token di kolom token di database
    await db.user.update({
      where: { id: user.id },
      data: { token: refreshToken },
    });
    // Tambahkan refresh token ke dalam cookie
    const response = NextResponse.json({ msg: 'Login berhasil', accessToken });
    response.cookies.set('accessToken', accessToken, {
      httpOnly: false,  // Untuk keamanan, hanya bisa diakses oleh server
      secure: process.env.NODE_ENV === 'production',  // Set secure di production
      maxAge: 15 * 60, // Set waktu kadaluarsa 15 menit
      path: '/',
    });
    response.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 hari
    });
    return response;
  } catch (error) {
    return NextResponse.json({ errors: "Internal server error" }, { status: 500 });
  }
}