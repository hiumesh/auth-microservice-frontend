"use client";

import React, { useEffect, useRef } from "react";
import { Column, useTable, usePagination, useFlexLayout } from "react-table";

import Pagination from "@/ui/table-pagination";

export interface PermissionTableProps {
  data: any;
  count: number;
  pageCount: number;
  fetchData: Function;
  columns: readonly Column[];
  query: string;
}

export default function PermissionTable({
  data,
  pageCount: controlledPageCount,
  count,
  fetchData,
  query,
  columns,
}: PermissionTableProps) {
  const isMounted = useRef(false);
  const prevQuery = useRef(query);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    canNextPage,
    canPreviousPage,
    prepareRow,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageSize: 10 },
      manualPagination: true,
      pageCount: controlledPageCount,
    },
    usePagination,
    useFlexLayout
  );
  useEffect(() => {
    let delayDebounceFn: undefined | ReturnType<typeof setTimeout>;
    if (isMounted.current) {
      if (prevQuery.current !== query) {
        delayDebounceFn = setTimeout(() => {
          if (pageIndex == 0) fetchData({ pageIndex, pageSize, name: query });
          else gotoPage(0);
          prevQuery.current = query;
        }, 500);
      } else fetchData({ pageIndex, pageSize, name: query });
    } else {
      isMounted.current = true;
    }
    return () => clearTimeout(delayDebounceFn);
  }, [pageIndex, query]);

  return (
    <div className="relative overflow-x-auto sm:rounded-lg my-2">
      <table
        className="w-full text-sm text-left text-gray-500"
        {...getTableProps()}
      >
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          {headerGroups.map((headerGroup) => {
            const { key, ...restHeaderGroupProps } =
              headerGroup.getHeaderGroupProps();
            return (
              <tr key={key} {...restHeaderGroupProps}>
                {headerGroup.headers.map((column) => {
                  const { key, ...restColumn } = column.getHeaderProps();
                  return (
                    <th
                      key={key}
                      scope="col"
                      className="px-6 py-3"
                      {...restColumn}
                    >
                      {column.render("Header")}
                    </th>
                  );
                })}
              </tr>
            );
          })}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row);
            const { key, ...restRowProps } = row.getRowProps();
            return (
              <tr
                key={key}
                className="bg-white border-b hover:bg-gray-50"
                {...restRowProps}
              >
                {row.cells.map((cell) => {
                  const { key, ...cellRestProps } = cell.getCellProps();
                  return (
                    <td key={key} className="px-6" {...cellRestProps}>
                      {cell.render("Cell")}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <Pagination
        pageCount={pageCount}
        totalCount={count}
        pageIndex={pageIndex}
        pageSize={10}
        nextPage={nextPage}
        previousPage={previousPage}
        gotoPage={gotoPage}
        canNext={canNextPage}
        canPrevious={canPreviousPage}
      />
    </div>
  );
}
