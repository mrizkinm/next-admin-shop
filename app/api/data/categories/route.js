import db from "@/lib/db";
import { NextResponse } from "next/server"

export async function GET(req) {
  try {
    const product = await db.product.findMany({
      include: {
        category: true // Memuat data dari relasi Category
      },
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error("Error get data", error)
    return NextResponse({ error: "Internal server error" }, {status: 500})
  }
}