import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(req: Request) {
  const authHeader = req.headers.get("Authorization");
  const refreshToken = authHeader?.split(" ")[1];

  if (!refreshToken) {
    return NextResponse.json({ errors: 'Unauthorized: No token provided' }, { status: 401 });
  }

  const storedToken  = await db.user.findFirst({
    where: { token: refreshToken },
  });

  if (!storedToken) {
    return NextResponse.json({ errors: "Invalid refresh token"}, { status: 401 });
  }

  await db.user.updateMany({
    where: { token: refreshToken },
    data: { token: null },
  });

  return NextResponse.json({ message: 'Logout berhasil' });
}