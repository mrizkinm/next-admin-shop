import Heading from '@/components/heading'
import { Separator } from '@/components/ui/separator'
import React from "react";
import ProductForm from './components/product-form';
import db from "@/lib/db";
import PageContainer from '@/components/page-container';

const AddProducts = async ({params}) => {
  const category = await db.category.findMany()
  const { productId } = await params;
  
  let product;
  if (productId != 'add') {
    product = await db.product.findUnique({
      where: {
        id: parseInt(productId)
      }
    })
  }

  return (
    <PageContainer scrollable={true}>
      <div className="space-y-4">
        <Heading
          title="Add Products"
          description="Add new products"
        />
        <Separator />
        <ProductForm categories={category} initialData={product} />
      </div>
    </PageContainer>
  )
}

export default AddProducts