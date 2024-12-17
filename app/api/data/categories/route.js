import db from "@/lib/db";
import { NextResponse } from "next/server"
import { z } from "zod";

export async function GET(req) {
  try {
    const category = await db.category.findMany({
      include: {
        products: true // Memuat data dari relasi Category
      },
    })

    return NextResponse.json(category)
  } catch (error) {
    console.error("Error get data", error)
    return NextResponse({ error: "Internal server error" }, {status: 500})
  }
}

const formSchema = z.object({
  name: z.string().min(1)
});

export async function POST(req) {
  try {
    const { name } = await req.json();

    const result = formSchema.safeParse({ name });
    
    if (!result.success) {
      return NextResponse.json({ error: result.error.format().name?._errors[0] }, { status: 400 });
    }

    const category = await db.category.create({
      data: {
        name
      }
    })

    return NextResponse.json(category)
  } catch (error) {
    console.log("ERROR CATEGORY POST", error)
    return new NextResponse("Internal Error", {status: 500})
  }
}