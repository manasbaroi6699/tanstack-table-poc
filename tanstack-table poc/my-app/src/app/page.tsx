"use client";

import { FormEvent, useEffect, useState } from "react";
import Main from '../componants/Main'
import DynamicTable from "@/componants/DynamicTable";

import {
  SortingState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  PaginationState,
  ColumnDefBase,
  ColumnDef,
  FilterFn,
  getSortedRowModel,
  getPaginationRowModel,
  ColumnFiltersState,
  
} from "@tanstack/react-table";

import {
  RankingInfo,
  rankItem,
  compareItems,
} from '@tanstack/match-sorter-utils'


export type User = {
  id: number;
  name: string;
  age: number;
  address : string;
};

const columnHelper = createColumnHelper<User>();

const columns = [
  columnHelper.accessor("id", {
    header: () => "ID",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("name", {
    header: () => "Name",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("age", {
    header: () => "Age",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("address", {
    header: () => "Full Address",
    cell: (info) => info.getValue(),
  }),
];



const UsersTable = () => {
  const [searchValue, setSearchValue] = useState("");
  const [users, setUsers] = useState([]);
  const [inputSearchValue, setInputSearchValue] = useState("");

  const submitSearchForm = (e: FormEvent) => {
    e.preventDefault();
    setSearchValue(inputSearchValue);
  };

    useEffect(() => {
    const url = `https://65899ba0324d417152593c87.mockapi.io/api/pp`;
    fetch(url)
      .then((res) => res.json())
      .then((users) => {
        setUsers(users);
      });
  },[]);

 

  const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value)

  // Store the itemRank info
  addMeta({
    itemRank,
  })

  // Return if the item should be filtered in/out
  return itemRank.passed
}

  const [pagination , setPagination] = useState<PaginationState>({
    pageIndex : 0,
    pageSize : 10,
  })

  const [sorting, setSorting] = useState<SortingState>([]);


  const [columnFilters, setcolumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data : users,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onColumnFiltersChange: setcolumnFilters,
    enableSorting: true,
    state: {
      sorting,
      pagination,
      columnFilters
    },
    filterFns: {
      fuzzy: fuzzyFilter,
    },
  });
  

  return (
    
    <div>
      <DynamicTable<User>
        loading={false}
        table={table}
      />
     {/* <Main/> */}
    </div>
  );
};

export default UsersTable;