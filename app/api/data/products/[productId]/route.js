import db from "@/lib/db";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function GET(req, {params}) {
  try {
    if (!params.productId) {
      return new NextResponse.json({ error: "Harus ada product id" }, {status: 400})
    }

    const product = await db.product.findUnique({
      where: {
        id: params.productId
      },
      include: {
        category: true
      }
    })
    return NextResponse.json(product);
  } catch (error) {
    console.log('ERROR product GET', error);
    return NextResponse.json({ error: "Internal server error" }, {status: 500})
  }
}

const formSchema = z.object({
  name: z.string().min(1),
  price: z.coerce.number().min(1),
  categoryId: z.string().min(1),
  isFeatured: z.boolean().default(false).optional(),
  isArchived: z.boolean().default(false).optional()
})

export async function PATCH(req, {params}) {
  try {
    if (!params.productId) {
      return new NextResponse.json({ error: "Harus ada product id" }, {status: 400})
    }
    
    const { name, price, categoryId, isFeatured, isArchived } = await req.json();

    const result = formSchema.safeParse({ name, price, categoryId, isFeatured, isArchived });

    if (!result.success) {
      return NextResponse.json({ error: result.error.format().name?._errors[0] || result.error.format().price?._errors[0] || result.error.format().categoryId?._errors[0] || result.error.format().isFeatured?._errors[0] || result.error.format().isArchived?._errors[0] }, { status: 400 });
    }

    const product = await db.product.updateMany({
      where: {
        id: params.productId
      },
      data: {
        name,
        price,
        categoryId,
        isFeatured,
        isArchived
      }
    })

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error patch data', error);
    return new NextResponse.json({ error: "Internal server error" }, {status: 500})
  }
}

export async function DELETE(req, {params}) {
  try {
    if (!params.productId) {
      return new NextResponse.json({ error: "Harus ada product id" }, {status: 400})
    }

    await db.image.deleteMany({
      where: {
        productId: parseInt(params.productId)
      }
    })

    await db.product.deleteMany({
      where: {
        id: parseInt(params.productId)
      }
    })
    return NextResponse.json({ msg: "Success to delete data" });
  } catch (error) {
    console.log('Error delete data', error);
    return NextResponse.json({ error: "Internal server error" }, {status: 500})
  }
}