import db from "@/lib/db";
import { NextResponse } from "next/server"
import { z } from "zod";

export async function GET(req) {
  try {
    const shop = await db.shop.findMany()

    return NextResponse.json(shop)
  } catch (error) {
    console.error("Error get data", error)
    return NextResponse.json({ errors: "Internal server error" }, {status: 500})
  }
}

const formSchema = z.object({
  name: z.string()
    .min(3, { message: 'Nama minimal 3 karakter' })
    .max(50, { message: 'Nama maksimal 50 karakter' }),
  address: z.string().min(1),
  phone: z.string().max(15),
  email: z.string().min(1).email(),
  description: z.string().min(1)
});

export async function PATCH(req) {
  try {
    const { name, phone, address, email, description } = await req.json();

    const result = formSchema.safeParse({ name, phone, address, email, description });
     
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;

      // Ubah format menjadi { fieldName: "Error message" }
      const simplifiedErrors = Object.fromEntries(
        Object.entries(errors).map(([key, value]) => [key, value?.[0] || 'Invalid value'])
      );

      return NextResponse.json({ errors: simplifiedErrors }, { status: 400 });
    }

    const shop = await db.shop.update({
      where: {
        id: 1
      },
      data: {
        name,
        phone,
        address,
        email,
        description
      }
    })

    return NextResponse.json(shop)
  } catch (error) {
    console.log("ERROR shop PATCH", error)
    return NextResponse.json({ errors: "Internal Error" }, {status: 500})
  }
}