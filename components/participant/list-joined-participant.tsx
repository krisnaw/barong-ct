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
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {ButtonChangeParticipantStatus} from "@/components/participant/button-change-participant-status";
import {DeleteParticipant} from "@/components/participant/delete-participant";
import {eventDateFormat} from "@/types/date-helper";
import {PARTICIPANT_STATUS} from "@/utils/event.helper";

export type JoinedParticipantTableRow = {
  id: number;
  name: string;
  email: string;
  status: string | null;
  paymentStatus: string | null;
  createdAt: string;
  bibNumber: string | null;
}

const columns: ColumnDef<JoinedParticipantTableRow>[] = [
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
        <span className="text-sm text-muted-foreground">{row.original.email}</span>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: ({column}) => (
      <Button
        variant="ghost"
        size="sm"
        className="-ml-2"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Status
        <ArrowUpDown />
      </Button>
    ),
    cell: ({row}) => (
      <Badge variant="secondary" className="capitalize">
        {row.original.status ?? "-"}
      </Badge>
    ),
  },
  {
    accessorKey: "paymentStatus",
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
    cell: ({row}) => row.original.paymentStatus ?? "-",
  },
  {
    accessorKey: "createdAt",
    header: ({column}) => (
      <Button
        variant="ghost"
        size="sm"
        className="-ml-2"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Created At
        <ArrowUpDown />
      </Button>
    ),
    cell: ({row}) => eventDateFormat(row.original.createdAt),
  },
  {
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    enableSorting: false,
    cell: ({row}) => {
      const participant = row.original;

      return (
        <div className="flex justify-end gap-2">
          {participant.bibNumber && participant.status !== PARTICIPANT_STATUS.COMPLETED ? (
            <ButtonChangeParticipantStatus participantId={participant.id} currentStatus={participant.status ?? ""} />
          ) : null}
          {participant.status === PARTICIPANT_STATUS.DRAFT || participant.status === PARTICIPANT_STATUS.PROFILE || participant.status === PARTICIPANT_STATUS.PENDING_PAYMENT ? (
            <DeleteParticipant participant={{id: participant.id, user: {name: participant.name}}} />
          ) : null}
        </div>
      )
    },
  },
];

const pageSizeOptions = [10, 25, 50, 100];

export function ListJoinedParticipant({participants}: {participants: JoinedParticipantTableRow[]}) {
  const [sorting, setSorting] = React.useState<SortingState>([
    {id: "createdAt", desc: true},
  ]);
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
        </div>
        <div className="text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} joined
        </div>
      </div>

      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} className={header.column.id === "actions" ? "text-right" : undefined}>
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
                  <TableCell key={cell.id} className={cell.column.id === "actions" ? "text-right" : undefined}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell className="h-24 text-center" colSpan={columns.length}>
                No joined participants found.
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
