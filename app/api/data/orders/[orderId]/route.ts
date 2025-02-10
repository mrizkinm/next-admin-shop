import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request, {params} : {params: {orderId: string}}) {
  try {
    if (!params.orderId) {
      return NextResponse.json({ errors: "Harus ada order id" }, {status: 400})
    }

    const order = await db.order.findUnique({
      where: {
        id: parseInt(params.orderId)
      },
      include: {
        items: {
          include: {
            product: true // Ini akan menyertakan informasi produk
          }
        },
        customer: true,
      }
    })
    return NextResponse.json(order);
  } catch (error) {
    console.log('ERROR customer GET', error);
    return NextResponse.json({ errors: "Internal server error" }, {status: 500})
  }
}