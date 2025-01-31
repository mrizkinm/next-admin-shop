import db from "@/lib/db";
import { NextResponse } from "next/server"
import { z } from "zod";
import fs from "fs";
import path from "path";

const uploadFolder = path.join(process.cwd(), "public/img/products");

export async function GET(req) {
  try {
    // Parse query parameters
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const categories = searchParams.get("categories");
    const search = searchParams.get("search");

    // Convert categories string to array if exists
    const categoriesArray = categories ? categories.split(".").map(Number) : [];

    // Query products from database
    const whereClause = {
      AND: [
        search ? { name: { contains: search } } : {},
        categoriesArray.length > 0 ? { categoryId: { in: categoriesArray } } : {},
        { isArchived: false },
      ],
    };

    const totalProducts = await db.product.count({ where: whereClause });
    const products = await db.product.findMany({
      where: whereClause,
      include: { category: true, images: true },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
    });

    // Mock current time
    const currentTime = new Date().toISOString();

    return NextResponse.json({
      time: currentTime,
      total_products: totalProducts,
      offset: (page - 1) * limit,
      limit,
      products,
    });

    // const product = await db.product.findMany({
    //   include: {
    //     category: true, // Memuat data dari relasi Category
    //     images: true // Memuat data dari relasi Image
    //   },
    // })

    // return NextResponse.json(product)
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
  quantity: z.coerce.number().min(0),
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
    const quantity = formData.get('quantity');
    
    const images = [];
    for (let i = 0; i < formData.getAll('images').length; i++) {
      images.push(formData.getAll('images')[i]);
    }

    const result = formSchema.safeParse({ name, images, categoryId, price, description, isFeatured, isArchived, quantity });
    
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
        quantity: parseInt(quantity),
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