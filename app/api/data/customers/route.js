import db from "@/lib/db";
import { NextResponse } from "next/server"
import { z } from "zod";
import bcrypt from "bcryptjs";

export async function GET(req) {
  try {
    const customer = await db.customer.findMany({
      include: {
        orders: true
      }
    })

    return NextResponse.json(customer)
  } catch (error) {
    console.error("Error get data", error)
    return NextResponse.json({ errors: "Internal server error" }, {status: 500})
  }
}

const formSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().min(1),
  phone: z.string().min(1),
  address: z.string().min(1),
  password: z.string().min(6)
});

export async function POST(req) {
  try {
    const { name, email, phone, address, password } = await req.json();

    const result = formSchema.safeParse({ name, email, phone, address, password });
     
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;

      // Ubah format menjadi { fieldName: "Error message" }
      const simplifiedErrors = Object.fromEntries(
        Object.entries(errors).map(([key, value]) => [key, value?.[0] || 'Invalid value'])
      );

      return NextResponse.json({ errors: simplifiedErrors }, { status: 400 });
    }

    const existingUser = await db.customer.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json({ errors: 'User already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const customer = await db.customer.create({
      data: {
        name,
        email,
        phone,
        address,
        password: hashedPassword
      }
    })

    return NextResponse.json(customer)
  } catch (error) {
    console.log("ERROR customer POST", error)
    return NextResponse.json({ errors: "Internal Error" }, {status: 500})
  }
}