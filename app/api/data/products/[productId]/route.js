import db from "@/lib/db";
import { NextResponse } from "next/server";
import { z } from "zod";
import fs from "fs";
import path from "path";

export async function GET(req, {params}) {
  try {
    if (!params.productId) {
      return new NextResponse.json({ errors: "Harus ada product id" }, {status: 400})
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
    return NextResponse.json({ errors: "Internal server error" }, {status: 500})
  }
}

const formSchema = z.object({
  name: z.string().min(1),
  price: z.coerce.number().min(1),
  categoryId: z.coerce.number().min(1),
  isFeatured: z.string().optional(),
  isArchived: z.string().optional(),
  description: z.string().min(1),
  quantity: z.coerce.number().min(0),
});

export async function PATCH(req, {params}) {
  try {
    if (!params.productId) {
      return new NextResponse.json({ errors: "Harus ada product id" }, {status: 400})
    }
    
    const formData = await req.formData();
    
    // Ambil field data dan file
    const name = formData.get('name');
    const price = formData.get('price');
    const categoryId = formData.get('categoryId');
    const description = formData.get('description');
    const isFeatured = formData.get('isFeatured');
    const isArchived = formData.get('isArchived');
    const quantity = formData.get('quantity');

    const result = formSchema.safeParse({ name, categoryId, price, description, isFeatured, isArchived, quantity });

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
        quantity: parseInt(quantity),
        description,
        isFeatured: isFeatured === "true", // Mengkonversi dari string
        isArchived: isArchived === "true", // Mengkonversi dari string
      },
    })

    return NextResponse.json({ msg: "Success to update data" });
  } catch (error) {
    console.error('Error patch data', error);
    return new NextResponse.json({ errors: "Internal server error" }, {status: 500})
  }
}

export async function DELETE(req, {params}) {
  try {
    const paramId = await params.productId;
    const productId = parseInt(paramId);
    if (!productId) {
      return NextResponse.json({ errors: "Harus ada product id" }, {status: 400})
    }

    // Mulai transaksi
    const result = await db.$transaction(async (prisma) => {
      // Ambil semua gambar terkait
      const images = await prisma.image.findMany({
        where: {
          productId: productId,
        },
      });

      // Hapus data gambar
      await prisma.image.deleteMany({
        where: {
          productId: productId,
        },
      });

      // Hapus data produk
      await prisma.product.deleteMany({
        where: {
          id: productId,
        },
      });

      // Hapus file fisik gambar
      for (let image of images) {
        const imagePath = path.join(process.cwd(), 'public', image.url);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }

      return { success: true };
    });

    if (result.success) {
      return NextResponse.json({ msg: "Success to delete data" });
    }

    return NextResponse.json({ errors: "Failed to delete data" }, { status: 500 });
  } catch (error) {
    console.log('Error delete data', error);
    return new NextResponse.json({ errors: "Internal server error" }, {status: 500})
  }
}