"use client"

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import {ArrowUpDown, ChevronLeft, ChevronRight} from "lucide-react";
import Link from "next/link";
import {Badge} from "@/components/ui/badge";
import {Button, buttonVariants} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {eventDateFormat} from "@/types/date-helper";
import {formatMoney} from "@/utils/money-helper";

export type CompletedParticipantTableRow = {
  id: number;
  eventId: number;
  bibNumber: string | null;
  name: string;
  email: string;
  groupName: string | null;
  finalPrice: number | null;
  invoiceNumber: string | null;
  promoCode: string | null;
  categoryName: string | null;
  registeredAt: string;
}

const columns: ColumnDef<CompletedParticipantTableRow>[] = [
  {
    accessorKey: "bibNumber",
    header: ({column}) => (
      <Button
        variant="ghost"
        size="sm"
        className="-ml-2"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Bib
        <ArrowUpDown />
      </Button>
    ),
    cell: ({row}) => row.original.bibNumber ?? "-",
  },
  {
    accessorKey: "name",
    header: ({column}) => (
      <Button
        variant="ghost"
        size="sm"
        className="-ml-2"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Name
        <ArrowUpDown />
      </Button>
    ),
    cell: ({row}) => (
      <div className="flex flex-col">
        <span className="font-medium">{row.original.name}</span>
        <span className="text-sm text-muted-foreground">
          {row.original.email}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "groupName",
    header: "Group",
    cell: ({row}) => (
      <Badge variant="secondary">
        {row.original.groupName ?? "-"}
      </Badge>
    ),
  },
  {
    accessorKey: "finalPrice",
    header: ({column}) => (
      <Button
        variant="ghost"
        size="sm"
        className="-ml-2"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Payment
        <ArrowUpDown />
      </Button>
    ),
    cell: ({row}) => (
      <div className="flex flex-col">
        <span className="font-medium">
          {row.original.finalPrice ? formatMoney(row.original.finalPrice) : "-"}
        </span>
        <span className="text-sm text-muted-foreground">
          {row.original.invoiceNumber ?? "-"}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "promoCode",
    header: "Promo",
    cell: ({row}) => row.original.promoCode ?? "-",
  },
  {
    accessorKey: "categoryName",
    header: "Cat",
    cell: ({row}) => (
      <Badge>
        {row.original.categoryName ?? "-"}
      </Badge>
    ),
  },
  {
    accessorKey: "registeredAt",
    header: ({column}) => (
      <Button
        variant="ghost"
        size="sm"
        className="-ml-2"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Registered At
        <ArrowUpDown />
      </Button>
    ),
    cell: ({row}) => eventDateFormat(row.original.registeredAt),
  },
  {
    id: "actions",
    header: "Actions",
    enableSorting: false,
    cell: ({row}) => (
      <Link
        className={buttonVariants({ variant: "secondary", size: "sm" })}
        href={`/dashboard/events/${row.original.eventId}/participant/${row.original.id}`}
      >
        View
      </Link>
    ),
  },
];

const pageSizeOptions = [10, 25, 50, 100, 300];

export function ListParticipant({participants} : {participants : CompletedParticipantTableRow[]}) {
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "registeredAt", desc: true },
  ]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const categoryOptions = React.useMemo(() => {
    return Array.from(
      new Set(participants.map((participant) => participant.categoryName ?? "-"))
    ).sort((a, b) => a.localeCompare(b, undefined, {sensitivity: "base"}));
  }, [participants]);

  // eslint-disable-next-line react-hooks/incompatible-library -- TanStack Table exposes non-memoizable table helpers.
  const table = useReactTable({
    data: participants,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Input
            value={globalFilter}
            onChange={(event) => setGlobalFilter(event.target.value)}
            placeholder="Search participants"
            className="w-56 sm:w-72"
          />
          <Select
            value={String(table.getState().pagination.pageSize)}
            onValueChange={(value) => table.setPageSize(Number(value ?? pageSizeOptions[0]))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map((pageSize) => (
                <SelectItem key={pageSize} value={String(pageSize)}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={(table.getColumn("categoryName")?.getFilterValue() as string | undefined) ?? "all"}
            onValueChange={(value) => {
              table.getColumn("categoryName")?.setFilterValue(value === "all" ? undefined : value)
            }}
          >
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categoryOptions.map((categoryName) => (
                <SelectItem key={categoryName} value={categoryName}>
                  {categoryName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} completed
        </div>
      </div>

      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell className="h-24 text-center" colSpan={columns.length}>
                No completed participants found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between gap-2 text-sm text-muted-foreground">
        <span>
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1}
        </span>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon-xs"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            size="icon-xs"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight />
          </Button>
        </div>
      </div>
    </div>
  )
}
