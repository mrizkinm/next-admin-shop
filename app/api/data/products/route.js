import db from "@/lib/db";
import { NextResponse } from "next/server"

export async function GET(req) {
  try {
    const category = await db.category.findMany()

    return NextResponse.json(category)
  } catch (error) {
    console.error("Error get data", error)
    return new NextResponse("Internal Error", {status: 500})
  }
}