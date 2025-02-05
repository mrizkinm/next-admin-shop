import { searchParamsCache } from '@/lib/searchparams';
import { DataTable as CustomerTable } from '@/components/ui/table/data-table';
import { columns } from './column';
import { getCategories } from '@/lib/api';

export default async function ListingPage() {
  // Showcasing the use of search params cache in nested RSCs
  const page = searchParamsCache.get('page');
  const search = searchParamsCache.get('q');
  const pageLimit = searchParamsCache.get('limit');

  const filters = {
    page,
    limit: pageLimit,
    ...(search && { search })
  };

  const dataRaw = await getCategories(filters);
  const total = dataRaw.total;
  const data = dataRaw.data;

  return (
    <CustomerTable
      columns={columns}
      data={data}
      totalItems={total}
    />
  );
}