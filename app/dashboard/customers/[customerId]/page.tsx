import Heading from '@/components/heading'
import { Separator } from '@/components/ui/separator'
import React from "react";
import CustomerForm from './components/customer-form';
import PageContainer from '@/components/page-container';
import { getDetailCustomer } from '@/lib/api';

interface CustomersPageProps {
  params: Promise<{
    customerId: string;
  }>
}

const AddCustomers: React.FC<CustomersPageProps> = async ({params}) => {
  const { customerId } = await params;

  const isEdit = customerId !== 'add';
  const title = isEdit ? 'Edit Customer' : 'Add Customer';
  const description = isEdit ? 'Edit existing customer' : 'Add new customer';

  const customer = isEdit
  ? await getDetailCustomer(parseInt(customerId))
  : null;

  return (
    <PageContainer scrollable={true}>
      <div className="space-y-4">
        <Heading
          title={title}
          description={description}
        />
        <Separator />
        <CustomerForm initialData={customer} />
      </div>
    </PageContainer>
  )
}

export default AddCustomers