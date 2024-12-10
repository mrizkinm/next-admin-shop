import db from "@/lib/db";
import { NextResponse } from "next/server"

export async function POST(req) {
  try {
    const { name, userId } = await req.json();
    if (!name) {
      return NextResponse.json({ message: "Nama wajib diisi" }, { status: 400 });
    }
    if (!userId) {
      return NextResponse.json({ message: "Email wajib diisi" }, { status: 400 });
    }

    const save = await db.user.create({
      data: {
        name,
        userId
      }
    })

    return NextResponse.json(save)
  } catch (error) {
    console.log("ERROR STORE POST", error)
    return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
  
}