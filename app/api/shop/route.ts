import db from "@/lib/db";
import { NextResponse } from "next/server"
import { z } from "zod";
import fs from "fs";
import path from "path";

const uploadFolder = path.join(process.cwd(), "public/img");

export async function GET(req: Request) {
  try {
    const shop = await db.shop.findUnique({
      where: {
        id: 1
      }
    })

    return NextResponse.json(shop)
  } catch (error) {
    console.error("Error get data", error)
    return NextResponse.json({ errors: "Internal server error" }, {status: 500})
  }
}

const formSchema = z.object({
  name: z.string()
    .min(3, { message: 'Nama minimal 3 karakter' })
    .max(50, { message: 'Nama maksimal 50 karakter' }),
  address: z.string().min(1),
  phone: z.string().max(15),
  email: z.string().min(1).email(),
  description: z.string().min(1),
  images: z.array(z.any()).optional()
});

export async function PATCH(req: Request) {
  try {
    const { name, phone, address, email, description, images } = await req.json();

    const result = formSchema.safeParse({ name, phone, address, email, description, images });
     
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
    const imageUrls = images?.length
    ? await Promise.all(images.map(async (base64: string) => {
        const fileName = await saveBase64Image(base64, uploadFolder);
        return `${process.env.NEXT_PUBLIC_BASE_URL}/img/shop/${fileName}`;
    }))
    : [];

    const shop = await db.shop.update({
      where: {
        id: 1
      },
      data: {
        name,
        phone,
        address,
        email,
        description,
        image: imageUrls[0]
      }
    })

    return NextResponse.json(shop)
  } catch (error) {
    console.log("ERROR shop PATCH", error)
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