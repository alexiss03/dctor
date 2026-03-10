"use client";

import {
  ColumnDef,
  OnChangeFn,
  PaginationState,
  TableOptions,
  Table as TableType,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "../Button";

import classNames from "classnames";
import styles from "./style.module.css";

export const ROWS_PER_PAGE = 10;

interface PaginationProps<T> {
  table: TableType<T>;
}

function Pagination<T>({ table }: PaginationProps<T>) {
  const { pageIndex } = table.getState().pagination;

  return (
    <div className={styles.pagination}>
      <Button
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
      >
        {"<"}
      </Button>
      <p className={styles["page-info"]}>
        {pageIndex + 1} of {table.getPageCount()} Page
        {table.getPageCount() === 1 ? "" : "s"}
      </p>
      <Button
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
      >
        {">"}
      </Button>
    </div>
  );
}

type SortOption<T> = {
  field: keyof T;
  desc?: boolean;
};

interface TableProps<T> {
  rowData: T[];
  columns: (ColumnDef<T> & { sortable?: boolean })[];
  sortableFields?: (keyof T | string)[];
  sortField?: keyof T | string;
  sortByDesc?: boolean;
  onRowClick?: (data: T) => void;
  onSortChange?: (sortOption: SortOption<T>) => void;
}

interface TableControlledPaginationProps<T> extends TableProps<T> {
  pagination: PaginationState;
  totalPages: number;
  onPaginationChange: OnChangeFn<PaginationState>;
}

export function Table<T>({
  rowData,
  columns,
  onRowClick,
  onSortChange,
  sortableFields = [],
  sortField,
  sortByDesc,
}: TableProps<T> | TableControlledPaginationProps<T>) {
  const options: TableOptions<T> = {
    data: rowData,
    columns,
    getPaginationRowModel: getPaginationRowModel(),
    getCoreRowModel: getCoreRowModel(),
  };

  const table = useReactTable(options);

  const pageOptions = table.getPageOptions();

  return (
    <div className={styles.wrapper}>
      <table
        className={classNames(styles.table, {
          [styles["with-border"]]: pageOptions.length > 1,
        })}
      >
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className={styles["header-row"]}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  width={header.getSize()}
                  className={styles["header-cell"]}
                >
                  <div>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}

                    {sortableFields.includes(header.id as keyof T) &&
                      (header.id === sortField && !sortByDesc ? (
                        <Button
                          onClick={() =>
                            onSortChange?.({
                              field: header.id as keyof T,
                              desc: true,
                            })
                          }
                        >
                          {"^"}
                        </Button>
                      ) : header.id === sortField && sortByDesc ? (
                        <Button
                          onClick={() =>
                            onSortChange?.({
                              field: header.id as keyof T,
                              desc: false,
                            })
                          }
                        >
                          {"v"}
                        </Button>
                      ) : (
                        <Button
                          onClick={() =>
                            onSortChange?.({
                              field: header.id as keyof T,
                              desc: false,
                            })
                          }
                        >
                          {"sort"}
                        </Button>
                      ))}
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} onClick={() => onRowClick?.(row.original)}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {pageOptions.length > 1 && (
        <div>
          <Pagination table={table} />
        </div>
      )}
    </div>
  );
}
