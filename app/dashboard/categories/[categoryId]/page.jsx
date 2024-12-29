import Heading from '@/components/heading'
import { Separator } from '@/components/ui/separator'
import React from "react";
import CategoryForm from './components/category-form';
import db from "@/lib/db";
import PageContainer from '@/components/page-container';

const AddCategories = async ({params}) => {
  const { categoryId } = await params;

  let category;
  let title = '';
  let description = '';
  if (categoryId != 'add') {
    category = await db.category.findUnique({
      where: {
        id: parseInt(categoryId)
      }
    })
    title = 'Edit Category';
    description = 'Edit existing category';
  } else {
    title = 'Add Category';
    description = 'Add new category';
  }

  return (
    <PageContainer scrollable={true}>
      <div className="space-y-4">
        <Heading
          title={title}
          description={description}
        />
        <Separator />
        <CategoryForm initialData={category} />
      </div>
    </PageContainer>
  )
}

export default AddCategories