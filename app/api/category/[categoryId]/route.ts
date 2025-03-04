import db from "@/lib/db";
import { NextResponse } from "next/server";
import { z } from "zod";
import fs from "fs";
import path from "path";

export async function GET(req: Request, { params } : { params: Promise<{categoryId: string}> }) {
  try {
    const categoryId = (await params).categoryId;
    if (!categoryId) {
      return NextResponse.json({ errors: "Harus ada category id" }, {status: 400})
    }

    const category = await db.category.findUnique({
      where: {
        id: parseInt(categoryId)
      },
      include: {
        products: true
      }
    })
    return NextResponse.json(category);
  } catch (error) {
    console.log('ERROR category GET', error);
    return NextResponse.json({ errors: "Internal server error" }, {status: 500})
  }
}

const formSchema = z.object({
  name: z.string().min(1)
});

export async function PATCH(req: Request, { params } : { params: Promise<{categoryId: string}> }) {
  try {
    const categoryId = (await params).categoryId;
    const { name, images } = await req.json();

    const result = formSchema.safeParse({ name, images });

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;

      // Ubah format menjadi { fieldName: "Error message" }
      const simplifiedErrors = Object.fromEntries(
        Object.entries(errors).map(([key, value]) => [key, value?.[0] || 'Invalid value'])
      );

      return NextResponse.json({ errors: simplifiedErrors }, { status: 400 });
    }

    await db.category.updateMany({
      where: {
        id: parseInt(categoryId)
      },
      data: {
        name
      }
    })

    return NextResponse.json({ message: "Success to update data" });
  } catch (error) {
    console.error('Error patch data', error);
    return NextResponse.json({ errors: "Internal server error" }, {status: 500})
  }
}

export async function DELETE(req: Request, { params } : { params: Promise<{categoryId: string}> }) {
  try {
    const categoryId = (await params).categoryId;
    if (!categoryId) {
      return NextResponse.json({ errors: "Harus ada category id" }, {status: 400})
    }

    const category = await db.category.findUnique({
      where: {
        id: parseInt(categoryId)
      }
    })

    if (!category) {
      return NextResponse.json({ errors: "Category not found" }, {status: 404})
    }

    await db.category.deleteMany({
      where: {
        id: parseInt(categoryId)
      }
    })

    // Define the image path (e.g., inside 'public/uploads')
    if (category.image) {
      const imagePath = path.join(process.cwd(), 'public', category.image);
      fs.unlinkSync(imagePath);
    }
    
    return NextResponse.json({ message: "Success to delete data" });
  } catch (error) {
    console.log('Error delete data', error);
    return NextResponse.json({ errors: "Internal server error" }, {status: 500})
  }
}