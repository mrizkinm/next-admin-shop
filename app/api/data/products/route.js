import db from "@/lib/db";
import { NextResponse } from "next/server"
import { z } from "zod";
import fs from "fs";
import path from "path";

const uploadFolder = path.join(process.cwd(), "public/img/products");

export const config = {
  api: {
    bodyParser: false, // Disable body parser so formidable can handle the request
  },
};

export async function GET(req) {
  try {
    const product = await db.product.findMany({
      include: {
        category: true, // Memuat data dari relasi Category
        images: true // Memuat data dari relasi Image
      },
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error("Error get data", error)
    return NextResponse.json({ errors: "Internal Error" }, {status: 500})
  }
}

const formSchema = z.object({
  name: z.string().min(1),
  images: z
  .array(z.instanceof(File))
  .min(1, 'Please upload at least one file.')
  .max(5, 'You can upload up to 5 files.')
  .refine((files) => files.every((file) => file.type.startsWith('image/')), {
    message: 'Only image files are allowed.',
  }),
  price: z.coerce.number().min(1),
  categoryId: z.coerce.number().min(1),
  isFeatured: z.string().optional(),
  isArchived: z.string().optional(),
  description: z.string().min(1),
});

export async function POST(req) {
  try {
    const formData = await req.formData();
    
    // Ambil field data dan file
    const name = formData.get('name');
    const price = formData.get('price');
    const categoryId = formData.get('categoryId');
    const description = formData.get('description');
    const isFeatured = formData.get('isFeatured');
    const isArchived = formData.get('isArchived');
    
    const images = [];
    for (let i = 0; i < formData.getAll('images').length; i++) {
      images.push(formData.getAll('images')[i]);
    }

    const result = formSchema.safeParse({ name, images, categoryId, price, description, isFeatured, isArchived });
    
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;

      // Ubah format menjadi { fieldName: "Error message" }
      const simplifiedErrors = Object.fromEntries(
        Object.entries(errors).map(([key, value]) => [key, value?.[0] || 'Invalid value'])
      );

      return NextResponse.json({ errors: simplifiedErrors }, { status: 400 });
    }

    const product = await db.product.create({
      data: {
        name,
        categoryId: parseInt(categoryId),
        price: parseInt(price),
        description,
        isFeatured: isFeatured === "true", // Mengkonversi dari string
        isArchived: isArchived === "true", // Mengkonversi dari string
      },
    });

    // Proses dan simpan gambar ke server
    const imageUrls = [];
    for (let image of images) {
      const fileName = `${Date.now()}-${image.name}`;
      const filePath = path.join(uploadFolder, fileName);
      const buffer = await image.arrayBuffer();  // Ambil buffer dari file

      fs.writeFileSync(filePath, Buffer.from(buffer));  // Menyimpan gambar ke disk
      imageUrls.push(`/img/products/${fileName}`);
    }

    // Menyimpan data gambar terkait produk
    await db.image.createMany({
      data: imageUrls.map((url) => ({
        productId: product.id,
        url,
      })),
    });

    return NextResponse.json(product)
  } catch (error) {
    console.log("ERROR CATEGORY POST", error)
    return NextResponse.json({ errors: "Internal Error" }, {status: 500})
  }
}