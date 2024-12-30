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
  let title = '';
  let description = '';
  if (productId != 'add') {
    product = await db.product.findUnique({
      where: {
        id: parseInt(productId)
      }
    })
    title = 'Edit Product';
    description = 'Edit existing product';
  } else {
    title = 'Add Product';
    description = 'Add new product';
  }

  return (
    <PageContainer scrollable={true}>
      <div className="space-y-4">
        <Heading
          title={title}
          description={description}
        />
        <Separator />
        <ProductForm categories={category} initialData={product} />
      </div>
    </PageContainer>
  )
}

export default AddProducts