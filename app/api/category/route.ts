import db from "@/lib/db";
import { NextResponse } from "next/server"
import { z } from "zod";
import fs from "fs";
import path from "path";

const uploadFolder = path.join(process.cwd(), "public/img/category");

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
  images: z.array(z.any()),
});

export async function POST(req: Request) {
  try {
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

    // Pastikan folder ada
    if (!fs.existsSync(uploadFolder)) {
      fs.mkdirSync(uploadFolder, { recursive: true });
    }
    
    // Simpan semua gambar dari Base64 menjadi file
    const imageUrls = await Promise.all(images.map(async (base64: string) => {
      const fileName = await saveBase64Image(base64, uploadFolder);
      return `${process.env.NEXT_PUBLIC_BASE_URL}/img/category/${fileName}`;
    }));

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

async function saveBase64Image(base64String: string, folder: string) {
  const matches = base64String.match(/^data:image\/([a-zA-Z]+);base64,(.+)$/);
  if (!matches) {
    return NextResponse.json({ errors: "Invalid Base64 format" }, {status: 400})
  }

  const ext = matches[1]; // Ekstensi file (png, jpg, dll.)
  const base64Data = matches[2]; // Data Base64 tanpa prefix
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`; // Nama file unik
  const filePath = path.join(folder, fileName);

  fs.writeFileSync(filePath, Buffer.from(base64Data, "base64"));

  return fileName; // Kembalikan nama file
}