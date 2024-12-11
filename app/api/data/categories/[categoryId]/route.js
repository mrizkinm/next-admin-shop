import db from "@/lib/db";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function GET(req, {params}) {
  try {
    if (!params.categoryId) {
      return new NextResponse({ error: "Harus ada category id" }, {status: 400})
    }

    const category = await db.category.findUnique({
      where: {
        id: params.categoryId
      },
      include: {
        products: true
      }
    })
    return NextResponse.json(category);
  } catch (error) {
    console.log('ERROR category GET', error);
    return NextResponse({ error: "Internal server error" }, {status: 500})
  }
}

const formSchema = z.object({
  name: z.string().min(1),
});

export async function PATCH(req, {params}) {
  try {
    if (!params.categoryId) {
      return new NextResponse({ error: "Harus ada category id" }, {status: 400})
    }
    
    const { name } = await req.json();

    const result = formSchema.safeParse({ name });

    if (!result.success) {
      return NextResponse.json({ error: result.error.format().name?._errors[0] }, { status: 400 });
    }

    if (!name) {
      return new NextResponse({ error: "Harus ada nama" }, {status: 400})
    }

    const category = await db.category.updateMany({
      where: {
        id: params.categoryId
      },
      data: {
        name
      }
    })

    return NextResponse.json(category);
  } catch (error) {
    console.error('Error patch data', error);
    return new NextResponse({ error: "Internal server error" }, {status: 500})
  }
}

export async function DELETE(req, {params}) {
  try {
    if (!params.categoryId) {
      return new NextResponse({ error: "Harus ada category id" }, {status: 400})
    }

    const category = await db.category.deleteMany({
      where: {
        id: params.categoryId
      }
    })
    return NextResponse.json(category);
  } catch (error) {
    console.error('Error delete data', error);
    return new NextResponse({ error: "Internal server error" }, {status: 500})
  }
}