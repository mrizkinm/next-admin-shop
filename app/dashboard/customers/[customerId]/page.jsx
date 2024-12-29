import Heading from '@/components/heading'
import { Separator } from '@/components/ui/separator'
import React from "react";
import CustomerForm from './components/customer-form';
import db from "@/lib/db";
import PageContainer from '@/components/page-container';

const AddCustomers = async ({params}) => {
  const { customerId } = await params;
  
  let customer;
  let title = '';
  let description = '';
  if (customerId != 'add') {
    customer = await db.customer.findUnique({
      where: {
        id: parseInt(customerId)
      }
    })
    title = 'Edit Customer';
    description = 'Edit existing customer';
  } else {
    title = 'Add Customer';
    description = 'Add new customer';
  }

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