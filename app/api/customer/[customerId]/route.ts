import db from "@/lib/db";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function GET(req: Request, { params } : { params: Promise<{customerId: string}> }) {
  try {
    const customerId = (await params).customerId;
    if (!customerId) {
      return NextResponse.json({ errors: "Harus ada customer id" }, {status: 400})
    }

    const customer = await db.customer.findUnique({
      where: {
        id: parseInt(customerId)
      }
    })
    return NextResponse.json(customer);
  } catch (error) {
    console.log('ERROR customer GET', error);
    return NextResponse.json({ errors: "Internal server error" }, {status: 500})
  }
}

const formSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().min(1),
  phone: z.string().min(1),
  address: z.string().min(1)
});

export async function PATCH(req: Request, { params } : { params: Promise<{customerId: string}> }) {
  try {
    const customerId = (await params).customerId;
    if (!customerId) {
      return NextResponse.json({ errors: "Harus ada customer id" }, {status: 400})
    }
    
    const { name, email, phone, address } = await req.json();

    const result = formSchema.safeParse({ name, email, phone, address });

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;

      // Ubah format menjadi { fieldName: "Error message" }
      const simplifiedErrors = Object.fromEntries(
        Object.entries(errors).map(([key, value]) => [key, value?.[0] || 'Invalid value'])
      );

      return NextResponse.json({ errors: simplifiedErrors }, { status: 400 });
    }

    await db.customer.updateMany({
      where: {
        id: parseInt(customerId)
      },
      data: {
        name,
        email,
        phone,
        address
      }
    })

    return NextResponse.json({ message: "Success to update data" });
  } catch (error) {
    console.error('Error patch data', error);
    return NextResponse.json({ errors: "Internal server error" }, {status: 500})
  }
}

export async function DELETE(req: Request, { params } : { params: Promise<{customerId: string}> }) {
  try {
    const customerId = (await params).customerId;
    if (!customerId) {
      return NextResponse.json({ errors: "Harus ada customer id" }, {status: 400})
    }

    await db.customer.deleteMany({
      where: {
        id: parseInt(customerId)
      }
    })
    return NextResponse.json({ message: "Success to delete data" });
  } catch (error) {
    console.log('Error delete data', error);
    return NextResponse.json({ errors: "Internal server error" }, {status: 500})
  }
}