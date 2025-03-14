'use client';

import { DataTableFilterBox } from '@/components/ui/table/data-table-filter-box';
import { DataTableResetFilter } from '@/components/ui/table/data-table-reset-filter';
import { DataTableSearch } from '@/components/ui/table/data-table-search';
import { useTableFilters } from './use-table-filters';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

export default function TableAction() {
  const {
    categoriesFilter,
    setCategoriesFilter,
    isAnyFilterActive,
    resetFilters,
    searchQuery,
    setPage,
    setSearchQuery
  } = useTableFilters();

  const [ dataOptions, setDataOptions] = useState([])
  const [ loading, setLoading ] = useState(true)
  const { data: session, status } = useSession();

  const getData = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/category`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session?.token}`
        }
      });

      const responseData = await response.json();
      const options = responseData.data.map((category: { id: number; name: string }) => ({
        value: category.id.toString(),
        label: category.name
      }));
      setDataOptions(options);
    } catch (error: any) {
      console.error('Gagal mendapatkan akses token baru:', error.message);
      throw error;
    } finally {
      setLoading(false)
    };
  };
  
  useEffect(() => {
    if (status === "authenticated") {
      getData()
    }
  }, [status])

  return (
    <div className='flex flex-wrap items-center gap-4'>
      <DataTableSearch
        searchKey='name'
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setPage={setPage}
      />
      <DataTableFilterBox
        filterKey='categories'
        title='Categories'
        options={dataOptions}
        setFilterValue={setCategoriesFilter}
        filterValue={categoriesFilter}
      />
      <DataTableResetFilter
        isFilterActive={isAnyFilterActive}
        onReset={resetFilters}
      />
    </div>
  );
}