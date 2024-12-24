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
        id: parseInt(params.productId)
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
  categoryId: z.coerce.number().min(1),
  isFeatured: z.string().optional(),
  isArchived: z.string().optional(),
  description: z.string().min(1),
});

export async function PATCH(req, {params}) {
  try {
    if (!params.productId) {
      return new NextResponse.json({ error: "Harus ada product id" }, {status: 400})
    }
    
    const formData = await req.formData();
    
    // Ambil field data dan file
    const name = formData.get('name');
    const price = formData.get('price');
    const categoryId = formData.get('categoryId');
    const description = formData.get('description');
    const isFeatured = formData.get('isFeatured');
    const isArchived = formData.get('isArchived');

    const result = formSchema.safeParse({ name, categoryId, price, description, isFeatured, isArchived });

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;

      // Ubah format menjadi { fieldName: "Error message" }
      const simplifiedErrors = Object.fromEntries(
        Object.entries(errors).map(([key, value]) => [key, value?.[0] || 'Invalid value'])
      );

      return NextResponse.json({ errors: simplifiedErrors }, { status: 400 });
    }

    await db.product.updateMany({
      where: {
        id: parseInt(params.productId)
      },
      data: {
        name,
        categoryId: parseInt(categoryId),
        price: parseInt(price),
        description,
        isFeatured: isFeatured === "true", // Mengkonversi dari string
        isArchived: isArchived === "true", // Mengkonversi dari string
      },
    })

    return NextResponse.json({ msg: "Success to update data" });
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