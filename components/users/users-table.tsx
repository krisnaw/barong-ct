"use client"

import * as React from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table"
import {ArrowUpDown, ChevronLeft, ChevronRight, EyeIcon, PencilIcon} from "lucide-react"
import Link from "next/link"
import {format} from "date-fns"
import {id} from "date-fns/locale"
import {Badge} from "@/components/ui/badge"
import {Button, buttonVariants} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {getUsers} from "@/db/query/user-query"

type UserRow = Awaited<ReturnType<typeof getUsers>>[number]

const columns: ColumnDef<UserRow>[] = [
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
    accessorKey: "phone",
    header: "Phone",
    cell: ({row}) => row.original.phone ?? "-",
  },
  {
    id: "profile",
    header: "Profile",
    cell: ({row}) => (
      <Badge className={row.original.phone ? "bg-green-500 text-white" : ""}>
        {row.original.phone ? "Completed" : "Not Complete"}
      </Badge>
    ),
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
        Registered At
        <ArrowUpDown />
      </Button>
    ),
    cell: ({row}) => format(row.original.createdAt, "PPpp", {locale: id}),
  },
  {
    id: "actions",
    header: "Actions",
    enableSorting: false,
    cell: ({row}) => (
      <div className="inline-flex gap-2">
        <Link className={buttonVariants({ variant: "ghost", size: "icon"})} href={`/dashboard/users/${row.original.id}/edit`}>
          <PencilIcon />
        </Link>
        <Link
          className={buttonVariants({variant: "ghost", size: "icon"})}
          href={`/dashboard/users/${row.original.id}`}
        >
          <EyeIcon />
        </Link>
      </div>
    ),
  },
]

const pageSizeOptions = [10, 25, 50, 100]

export function UsersTable({users}: {users: UserRow[]}) {
  const [sorting, setSorting] = React.useState<SortingState>([{id: "createdAt", desc: true}])
  const [globalFilter, setGlobalFilter] = React.useState("")

  // eslint-disable-next-line react-hooks/incompatible-library -- TanStack Table exposes non-memoizable table helpers.
  const table = useReactTable({
    data: users,
    columns,
    state: {sorting, globalFilter},
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Input
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search users…"
            className="w-56 sm:w-72"
          />
          <Select
            value={String(table.getState().pagination.pageSize)}
            onValueChange={(value) => table.setPageSize(Number(value))}
          >
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size} / page
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <span className="text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} users
        </span>
      </div>

      <div className="rounded-md border">
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
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

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