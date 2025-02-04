import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(req: Request) {
  const { id } = await req.json();

  if (!id) {
    return NextResponse.json({ errors: 'User ID is required' }, { status: 400 });
  }
  await db.user.update({
    where: { id },
    data: { token: null },
  });

  const response = NextResponse.json({ msg: 'Logout berhasil' });
  response.cookies.delete('refreshToken');
  response.cookies.delete('accessToken');

  return response;
}