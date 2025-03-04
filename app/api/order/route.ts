import db from "@/lib/db";
import { NextResponse } from "next/server"
import { z } from "zod";

export async function GET(req: Request) {
  try {
    // Parse query parameters
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
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
      include: { customer: true },
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