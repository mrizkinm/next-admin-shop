import db from "@/lib/db";
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { action, id, items } = await req.json();
    let status = "";
    if (action === "process") {
      await db.order.updateMany({
        where: {
          id: parseInt(id)
        },
        data: {
          status: "Processed"
        }
      })
      status = "Processed"
    }
    if (action === "cancel") {
      const result = await updateProductStockFromOrder(id, items);
      status = "Canceled"
      if (!result.success) {
        return NextResponse.json({ errors: result.error }, { status: result.httpStatus });
      }
    }

    return NextResponse.json({ message: `Success to ${action} order ${id}`, status: status})
  } catch (error) {
    console.log("ERROR order POST", error)
    return NextResponse.json({ errors: "Internal Error" }, {status: 500})
  }
}

async function updateProductStockFromOrder(id: string, items: any[]) {
  try {
    const updateProductQuantities = await db.$transaction(async (tx) => {
      // Update status order menjadi Canceled
      await tx.order.updateMany({
        where: {
          id: parseInt(id)
        },
        data: {
          status: "Canceled"
        }
      });
 
      // Cek stok untuk semua produk
      const products = await Promise.all(items.map(item =>
        tx.product.findUnique({
          where: { id: item.productId }
        })
      ));
 
      // Validasi stok
      items.forEach((item, index) => {
        const product = products[index];
        if (!product) {
          return NextResponse.json({ errors: `Product with id ${item.productId} not found`}, { status: 400 });
        }
        if (product.quantity < item.quantity) {
          return NextResponse.json({ errors: `Insufficient stock for product ${item.productId}`}, { status: 400 });
        }
      });
 
      // Jika semua stok mencukupi, lakukan update
      const updates = await Promise.all(items.map(item =>
        tx.product.update({
          where: { id: item.productId },
          data: {
            quantity: {
              increment: item.quantity
            }
          }
        })
      ));
 
      return updates;
    });
 
    return {
      success: true,
      data: updateProductQuantities,
      httpStatus: 200
    };
 
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
      httpStatus: 500
    };
  }
 }