import bcrypt from "bcrypt";
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

    const tokenJwt = await new SignJWT({ id: user.id })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(new TextEncoder().encode(process.env.REFRESH_TOKEN_SECRET));

    // Simpan refresh token di kolom token di database
    await db.user.update({
      where: { id: user.id },
      data: { token: tokenJwt },
    });

    const { password: userPassword, token, ...userWithoutPass } = user;
    return NextResponse.json({ token: tokenJwt, ...userWithoutPass });
  } catch (error) {
    return NextResponse.json({ errors: "Internal server error" }, { status: 500 });
  }
}