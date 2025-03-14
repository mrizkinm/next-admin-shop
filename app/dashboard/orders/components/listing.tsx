import { searchParamsCache } from '@/lib/searchparams';
import { DataTable as OrderTable } from '@/components/ui/table/data-table';
import { columns } from './column';
import { getOrders } from '@/lib/api';

export default async function ListingPage() {
  // Showcasing the use of search params cache in nested RSCs
  const page = searchParamsCache.get('page');
  const search = searchParamsCache.get('q');
  const pageLimit = searchParamsCache.get('limit');
  const status = searchParamsCache.get('status');

  const filters = {
    page,
    limit: pageLimit,
    ...(search && { search }),
    ...(status && { status: parseInt(status, 10) })
  };

  const dataRaw = await getOrders(filters);
  const total = dataRaw.total;
  const data = dataRaw.data;

  return (
    <OrderTable
      columns={columns}
      data={data}
      totalItems={total}
    />
  );
}