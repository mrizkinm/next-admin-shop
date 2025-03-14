import Heading from '@/components/heading'
import { Separator } from '@/components/ui/separator'
import React from "react";
import CategoryForm from './components/category-form';
import PageContainer from '@/components/page-container';
import { getDetailCategory } from '@/lib/api';
interface CategoryPageProps {
  params: Promise<{
    categoryId: string;
  }>
}

const AddCategories: React.FC<CategoryPageProps> = async ({params}) => {
  const { categoryId } = await params;

  const isEdit = categoryId !== 'add';
  const title = isEdit ? 'Edit Category' : 'Add Category';
  const description = isEdit ? 'Edit existing category' : 'Add new category';

  const category = isEdit
  ? await getDetailCategory(parseInt(categoryId))
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