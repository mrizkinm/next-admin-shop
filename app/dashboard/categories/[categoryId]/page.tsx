import Heading from '@/components/heading'
import { Separator } from '@/components/ui/separator'
import React from "react";
import CategoryForm from './components/category-form';
import db from "@/lib/db";
import PageContainer from '@/components/page-container';

interface CategoryPageProps {
  params: {
    categoryId: string;
  }
}

const AddCategories: React.FC<CategoryPageProps> = async ({params}) => {
  const { categoryId } = await params;

  const isEdit = categoryId !== 'add';
  const title = isEdit ? 'Edit Category' : 'Add Category';
  const description = isEdit ? 'Edit existing category' : 'Add new category';

  const category = isEdit
  ? await db.category.findUnique({
      where: { id: parseInt(categoryId) }
    })
  : null;

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