import Heading from '@/components/heading'
import { Separator } from '@/components/ui/separator'
import React from "react";
import ProductForm from './components/product-form';
import PageContainer from '@/components/page-container';
import { getCategories, getDetailProduct } from '@/lib/api';

interface ProductsPageProps {
  params: Promise<{
    productId: string;
  }>
}

const AddProducts: React.FC<ProductsPageProps>  = async ({params}) => {
  const category = await getCategories({});
  const { productId } = await params;

  const isEdit = productId !== 'add';
  const title = isEdit ? 'Edit Product' : 'Add Product';
  const description = isEdit ? 'Edit existing product' : 'Add new product';

  const product = isEdit
  ? await getDetailProduct(parseInt(productId))
  : null;

  return (
    <PageContainer scrollable={true}>
      <div className="space-y-4">
        <Heading
          title={title}
          description={description}
        />
        <Separator />
        <ProductForm categories={category.data} initialData={product} />
      </div>
    </PageContainer>
  )
}

export default AddProducts