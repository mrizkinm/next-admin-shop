import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(req) {
  const { id } = await req.json();

  if (!id) {
    return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
  }
  await db.user.update({
    where: { id },
    data: { token: null },
  });

  const response = NextResponse.json({ message: 'Logout berhasil' });
  response.cookies.delete('refreshToken', { path: '/' });
  response.cookies.delete('accessToken', { path: '/' });

  return response;
}