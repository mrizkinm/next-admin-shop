import { searchParamsCache } from '@/lib/searchparams';
import { DataTable as ProductTable } from '@/components/ui/table/data-table';
import { columns } from './column';
import { getProducts } from '@/lib/api';

export default async function ListingPage() {
  // Showcasing the use of search params cache in nested RSCs
  const page = searchParamsCache.get('page');
  const search = searchParamsCache.get('q');
  const pageLimit = searchParamsCache.get('limit');
  const categories = searchParamsCache.get('categories');

  const filters = {
    page,
    limit: pageLimit,
    ...(search && { search }),
    ...(categories && { categories: Number(categories) })
  };

  const dataRaw = await getProducts(filters);
  const total = dataRaw.total;
  const data = dataRaw.data;

  return (
    <ProductTable
      columns={columns}
      data={data}
      totalItems={total}
    />
  );
}