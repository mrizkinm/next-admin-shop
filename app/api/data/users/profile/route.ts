import db from "@/lib/db";
import { NextResponse } from "next/server"
import { z } from "zod";

const formSchema = z.object({
    name: z.string()
      .min(3, { message: 'Nama minimal 3 karakter' })
      .max(50, { message: 'Nama maksimal 50 karakter' }),
    email: z.string()
      .email({ message: 'Format email tidak valid' }),
    id: z.number().int()
  });

export async function PATCH(req: Request) {
  try {
    const { name, email, id } = await req.json();

    const result = formSchema.safeParse({ name, email, id });
     
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;

      // Ubah format menjadi { fieldName: "Error message" }
      const simplifiedErrors = Object.fromEntries(
        Object.entries(errors).map(([key, value]) => [key, value?.[0] || 'Invalid value'])
      );

      return NextResponse.json({ errors: simplifiedErrors }, { status: 400 });
    }

    // Cocokkan token dengan token di database
    const findUser = await db.user.findUnique({
      where: { id: id },
    });

    if (!findUser) {
      return NextResponse.json({ errors: 'User not found' }, { status: 404 });
    }

    const user = await db.user.update({
      where: {
        id: id
      },
      data: {
        name,
        email
      }
    });

    return NextResponse.json(user)
  } catch (error) {
    console.log("ERROR user PATCH", error)
    return NextResponse.json({ errors: "Internal Error" }, {status: 500})
  }
}