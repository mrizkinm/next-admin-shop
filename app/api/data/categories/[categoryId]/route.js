import db from "@/lib/db";
import { NextResponse } from "next/server";
import { z } from "zod";
import fs from "fs";
import path from "path";

export async function GET(req, {params}) {
  try {
    if (!params.categoryId) {
      return new NextResponse({ errors: "Harus ada category id" }, {status: 400})
    }

    const category = await db.category.findUnique({
      where: {
        id: parseInt(params.categoryId)
      },
      include: {
        products: true
      }
    })
    return NextResponse.json(category);
  } catch (error) {
    console.log('ERROR category GET', error);
    return NextResponse({ errors: "Internal server error" }, {status: 500})
  }
}

const formSchema = z.object({
  name: z.string().min(1)
});

export async function PATCH(req, {params}) {
  try {
    if (!params.categoryId) {
      return new NextResponse({ errors: "Harus ada category id" }, {status: 400})
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

    await db.category.updateMany({
      where: {
        id: parseInt(params.categoryId)
      },
      data: {
        name
      }
    })

    return NextResponse.json({ msg: "Success to update data" });
  } catch (error) {
    console.error('Error patch data', error);
    return new NextResponse({ errors: "Internal server error" }, {status: 500})
  }
}

export async function DELETE(req, {params}) {
  try {
    if (!params.categoryId) {
      return NextResponse({ errors: "Harus ada category id" }, {status: 400})
    }

    const category = await db.category.findUnique({
      where: {
        id: parseInt(params.categoryId)
      }
    })

    if (!category) {
      return NextResponse({ errors: "Category not found" }, {status: 404})
    }

    await db.category.deleteMany({
      where: {
        id: parseInt(params.categoryId)
      }
    })

    // Define the image path (e.g., inside 'public/uploads')
    const imagePath = path.join(process.cwd(), 'public', category.image);
    fs.unlinkSync(imagePath);
    
    return NextResponse.json({ msg: "Success to delete data" });
  } catch (error) {
    console.log('Error delete data', error);
    return new NextResponse({ errors: "Internal server error" }, {status: 500})
  }
}