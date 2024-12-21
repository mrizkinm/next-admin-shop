import Heading from '@/components/heading'
import { Separator } from '@/components/ui/separator'
import React from "react";
import ProductForm from './components/product-form';
import db from "@/lib/db";

const AddProducts = async () => {
  const category = await db.category.findMany()

  return (
    <div className="h-full p-4 md:px-6">
      <div className="space-y-4">
        <Heading
          title="Add Products"
          description="Add new products"
        />
        <Separator />
        <ProductForm categories={category} />
      </div>
    </div>
  )
}

export default AddProducts