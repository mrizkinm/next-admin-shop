import db from "@/lib/db";
import { NextResponse } from "next/server"
import { z } from "zod";

export async function GET(req) {
  try {
    // Parse query parameters
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    // Convert status string to array if exists
    const statusArray = status ? status.split(".").map(String) : [];

    // Query products from database
    const whereClause = {
      AND: [
        search
        ? {
            OR: [
              { customer: { name: { contains: search } } },
              { orderTrxId: { contains: search } }
            ],
          }
        : {},
        statusArray.length > 0 ? { status: { in: statusArray } } : {},
      ],
    };

    const total = await db.order.count({ where: whereClause });
    const orders = await db.order.findMany({
      where: whereClause,
      include: { items: true, customer: true },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
    });

    // Mock current time
    const currentTime = new Date().toISOString();

    return NextResponse.json({
      time: currentTime,
      total: total,
      offset: (page - 1) * limit,
      limit,
      data: orders,
    });
  } catch (error) {
    console.error("Error get data", error)
    return NextResponse.json({ errors: "Internal Error" }, {status: 500})
  }
}

// export async function GET(req) {
//   try {
//     const order = await db.order.findMany({
//       orderBy: { status: "asc" },
//       include: {
//         items: true,
//         customer: true
//       },
//     })

//     return NextResponse.json(order)
//   } catch (error) {
//     console.error("Error get data", error)
//     return NextResponse.json({ errors: "Internal server error" }, {status: 500})
//   }
// }

const formSchema = z.object({
  name: z.string().min(1)
});

export async function POST(req) {
  try {
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

    const order = await db.order.create({
      data: {
        name
      }
    })

    return NextResponse.json(order)
  } catch (error) {
    console.log("ERROR order POST", error)
    return NextResponse.json({ errors: "Internal Error" }, {status: 500})
  }
}