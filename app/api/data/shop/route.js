import db from "@/lib/db";
import { NextResponse } from "next/server"
import { z } from "zod";
import fs from "fs";
import path from "path";

const uploadFolder = path.join(process.cwd(), "public/img");

export async function GET(req) {
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
  images: z.any()
});

export async function PATCH(req) {
  try {
    const formData = await req.formData();
    
    // Ambil field data dan file
    const name = formData.get('name');
    const phone = formData.get('phone');
    const address = formData.get('address');
    const description = formData.get('description');
    const email = formData.get('email');

    const images = [];
    for (let i = 0; i < formData.getAll('images').length; i++) {
      images.push(formData.getAll('images')[i]);
    }

    const result = formSchema.safeParse({ name, phone, address, email, description, images });
     
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
      const fileName = `${Date.now()}-${image.name}`;
      const filePath = path.join(uploadFolder, fileName);
      const buffer = await image.arrayBuffer();  // Ambil buffer dari file

      fs.writeFileSync(filePath, Buffer.from(buffer));  // Menyimpan gambar ke disk
      imageUrls.push(`/img/${fileName}`);
    }

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