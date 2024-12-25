import Heading from '@/components/heading'
import { Separator } from '@/components/ui/separator'
import React from "react";
import CategoryForm from './components/category-form';
import db from "@/lib/db";
import PageContainer from '@/components/page-container';

const AddCategories = async ({params}) => {
  const { categoryId } = await params;

  let category;
  if (categoryId != 'add') {
    category = await db.category.findUnique({
      where: {
        id: parseInt(categoryId)
      }
    })
  }

  return (
    <PageContainer scrollable={true}>
      <div className="space-y-4">
        <Heading
          title="Add Categories"
          description="Add new categories"
        />
        <Separator />
        <CategoryForm initialData={category} />
      </div>
    </PageContainer>
  )
}

export default AddCategories