import Heading from '@/components/heading'
import { Separator } from '@/components/ui/separator'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import React, { Suspense } from 'react'
import PageContainer from '@/components/page-container'
import TableSkeleton from '@/components/table-skeleton'
import { searchParamsCache, serialize } from '@/lib/searchparams'
import ListingPage from './components/listing'
import TableAction from './components/table-action'
import { SearchParams } from 'nuqs'

type pageProps = {
  searchParams: Promise<SearchParams>;
};

const CustomersPage = async (props: pageProps) => {
  const searchParams = await props.searchParams;
  // Allow nested RSCs to access the search params (in a type-safe way)
  searchParamsCache.parse(searchParams);

  // This key is used for invoke suspense if any of the search params changed (used for filters).
  const key = serialize({ ...searchParams });

  return (
    <PageContainer scrollable={true}>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title="Customers"
            description="List of customer"
          />
          <Link
            href="/dashboard/customers/add"
            className={cn(buttonVariants())}
            title="Add Customers"
          >
            <Plus className="h-4 w-4" /> Add New
          </Link>
        </div>
        <Separator />
        <TableAction />
        <Suspense
          key={key}
          fallback={<TableSkeleton columnCount={4} rowCount={10} />}
        >
          <ListingPage />
        </Suspense>
      </div>
    </PageContainer>
  )
}

export default CustomersPage