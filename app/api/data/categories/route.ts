import db from "@/lib/db";
import { NextResponse } from "next/server"
import { z } from "zod";
import fs from "fs";
import path from "path";

const uploadFolder = path.join(process.cwd(), "public/img/categories");

export async function GET(req: Request) {
  try {
    // Parse query parameters
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search");

    // Query products from database
    const whereClause = {
      AND: [
        search ? { name: { contains: search } } : {},
      ],
    };

    const total = await db.category.count({ where: whereClause });
    const categories = await db.category.findMany({
      where: whereClause,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "asc" },
    });

    // Mock current time
    const currentTime = new Date().toISOString();

    return NextResponse.json({
      time: currentTime,
      total: total,
      offset: (page - 1) * limit,
      limit,
      data: categories,
    });
  } catch (error) {
    console.error("Error get data", error)
    return NextResponse.json({ errors: "Internal Error" }, {status: 500})
  }
}

// export async function GET(req) {
//   try {
//     const category = await db.category.findMany({
//       // include: {
//       //   products: true // Memuat data dari relasi Category
//       // },
//     })

//     return NextResponse.json(category)
//   } catch (error) {
//     console.error("Error get data", error)
//     return NextResponse.json({ errors: "Internal server error" }, {status: 500})
//   }
// }

const formSchema = z.object({
  name: z.string().min(1),
  images: z
  .array(z.instanceof(File))
  .min(1, 'Please upload at least one file.')
  .max(1, 'You can upload up to 1 files.')
  .refine((files) => files.every((file) => file.type.startsWith('image/')), {
    message: 'Only image files are allowed.',
  }),
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    
    // Ambil field data dan file
    const name = formData.get('name') as string;
    if (!name) {
      return NextResponse.json({ errors: { name: "Name is required" } }, { status: 400 });
    }
    
    const images = [];
    for (let i = 0; i < formData.getAll('images').length; i++) {
      images.push(formData.getAll('images')[i]);
    }

    const result = formSchema.safeParse({ name, images });
    
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;

      // Ubah format menjadi { fieldName: "Error message" }
      const simplifiedErrors = Object.fromEntries(
        Object.entries(errors).map(([key, value]) => [key, value?.[0] || 'Invalid value'])
      );

      return NextResponse.json({ errors: simplifiedErrors }, { status: 400 });
    }

    // Proses dan simpan gambar ke server
    const imageUrls = [];
    for (let image of images) {
      if (image instanceof File) {
        const fileName = `${Date.now()}-${image.name}`;
        const filePath = path.join(uploadFolder, fileName);
        const buffer = await image.arrayBuffer();  // Ambil buffer dari file
        
        fs.writeFileSync(filePath, Buffer.from(buffer));  // Menyimpan gambar ke disk
        imageUrls.push(`/img/categories/${fileName}`);
      }
    }

    const category = await db.category.create({
      data: {
        name,
        image: imageUrls[0]
      }
    })

    return NextResponse.json(category)
  } catch (error) {
    console.log("ERROR CATEGORY POST", error)
    return NextResponse.json({ errors: "Internal Error" }, {status: 500})
  }
}