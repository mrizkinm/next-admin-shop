import db from "@/lib/db";
import { NextResponse } from "next/server"

export async function GET(req) {
  try {
    // Fetch summary data
    const totalCategories = await db.category.count();
    const totalProducts = await db.product.count();
    const totalOrders = await db.order.count();
    const totalCustomers = await db.customer.count();

    // Fetch recent orders
    const recentOrders = await db.order.findMany({
      orderBy: { createdAt: "desc" },
      where: { status: "Pending" },
      include: {
        items: true,
        customer: true, // Include customer data
      },
    });

    const summary = {
      summary: {
        totalCategories,
        totalProducts,
        totalOrders,
        totalCustomers,
      },
      recentOrders
    }
    return NextResponse.json(summary)
  } catch (error) {
    console.error("Error get data", error)
    return NextResponse.json({ errors: "Internal server error" }, {status: 500})
  }
}