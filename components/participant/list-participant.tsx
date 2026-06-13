"use client"

import * as React from "react";
import {
  ColumnDef,
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

export function ListParticipant({participants} : {participants : CompletedParticipantTableRow[]}) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");

  // eslint-disable-next-line react-hooks/incompatible-library -- TanStack Table exposes non-memoizable table helpers.
  const table = useReactTable({
    data: participants,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <Input
          value={globalFilter}
          onChange={(event) => setGlobalFilter(event.target.value)}
          placeholder="Search participants"
          className="max-w-xs"
        />
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
