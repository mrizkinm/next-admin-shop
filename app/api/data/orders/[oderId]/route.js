import db from "@/lib/db";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function GET(req, {params}) {
  try {
    if (!params.orderId) {
      return new NextResponse({ error: "Harus ada order id" }, {status: 400})
    }

    const order = await db.order.findUnique({
      where: {
        id: parseInt(params.orderId)
      },
      include: {
        products: true
      }
    })
    return NextResponse.json(order);
  } catch (error) {
    console.log('ERROR order GET', error);
    return NextResponse({ error: "Internal server error" }, {status: 500})
  }
}

const formSchema = z.object({
  name: z.string().min(1)
});

export async function PATCH(req, {params}) {
  try {
    if (!params.orderId) {
      return new NextResponse({ error: "Harus ada order id" }, {status: 400})
    }
    
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

    await db.order.updateMany({
      where: {
        id: parseInt(params.orderId)
      },
      data: {
        name
      }
    })

    return NextResponse.json({ msg: "Success to update data" });
  } catch (error) {
    console.error('Error patch data', error);
    return new NextResponse({ error: "Internal server error" }, {status: 500})
  }
}

export async function DELETE(req, {params}) {
  try {
    if (!params.orderId) {
      return new NextResponse({ error: "Harus ada order id" }, {status: 400})
    }

    await db.order.deleteMany({
      where: {
        id: parseInt(params.orderId)
      }
    })
    return NextResponse.json({ msg: "Success to delete data" });
  } catch (error) {
    console.log('Error delete data', error);
    return new NextResponse({ error: "Internal server error" }, {status: 500})
  }
}