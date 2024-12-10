import db from "@/lib/db";
import { NextResponse } from "next/server"
import bcrypt from 'bcryptjs';

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();
    if (!name) {
      return NextResponse.json({ message: "Nama wajib diisi" }, { status: 400 });
    }
    if (!email) {
      return NextResponse.json({ message: "Email wajib diisi" }, { status: 400 });
    }
    if (!password) {
      return NextResponse.json({ message: "Password wajib diisi" }, { status: 400 });
    }

    // Hash password dengan Bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    const save = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword
      }
    })

    return NextResponse.json(save)
  } catch (error) {
    console.log("ERROR STORE POST", error)
    return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
  
}