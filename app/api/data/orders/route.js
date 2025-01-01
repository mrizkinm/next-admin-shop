import db from "@/lib/db";
import { NextResponse } from "next/server"
import { z } from "zod";

export async function GET(req) {
  try {
    const order = await db.order.findMany({
      include: {
        items: true,
        customer: true
      },
    })

    return NextResponse.json(order)
  } catch (error) {
    console.error("Error get data", error)
    return NextResponse.json({ errors: "Internal server error" }, {status: 500})
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
      const errors = result.error.flatten().fieldErrors;

      // Ubah format menjadi { fieldName: "Error message" }
      const simplifiedErrors = Object.fromEntries(
        Object.entries(errors).map(([key, value]) => [key, value?.[0] || 'Invalid value'])
      );

      return NextResponse.json({ errors: simplifiedErrors }, { status: 400 });
    }

    const order = await db.order.create({
      data: {
        name
      }
    })

    return NextResponse.json(order)
  } catch (error) {
    console.log("ERROR order POST", error)
    return NextResponse.json({ errors: "Internal Error" }, {status: 500})
  }
}