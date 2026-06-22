'use client'

import * as React from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table"
import {useRouter} from "next/navigation"
import {toast} from "sonner"

import {createGroupAction, deleteGroupAction, updateGroupAction} from "@/app/actions/event-group/event-group.action"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {Badge} from "@/components/ui/badge"
import {Button} from "@/components/ui/button"
import {Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle,} from "@/components/ui/empty"
import {Field, FieldDescription, FieldGroup, FieldLabel} from "@/components/ui/field"
import {Input} from "@/components/ui/input"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {EventCategoryType, EventGroupType, InsertGroupType} from "@/db/schema"
import {PARTICIPANT_STATUS_BADGE, PARTICIPANT_STATUS_LABELS} from "@/utils/participant-status"
import {ArrowUpDown, Pencil, Plus, Search, Trash, Users, UsersRound} from "lucide-react";

type GroupParticipant = { id: number; bibNumber: string | null; status: string | null; user: { name: string } }

type DraftGroup = Pick<EventGroupType, "id" | "name" | "eventId" | "eventCategoryId"> & {
  participants: GroupParticipant[]
}

type Props = {
  eventId: number
  categories: EventCategoryType[]
  groups: (EventGroupType & { participants: GroupParticipant[] })[]
}

type SheetMode = "create" | "edit"

export function DashboardGroupManager({eventId, categories, groups}: Props) {
  const router = useRouter()
  const [items, setItems] = React.useState<DraftGroup[]>(
    groups.map((group) => ({
      id: group.id,
      name: group.name,
      eventId: group.eventId,
      eventCategoryId: group.eventCategoryId,
      participants: group.participants,
    }))
  )
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [sorting, setSorting] = React.useState<SortingState>([
    {id: "category", desc: false},
    {id: "name", desc: false},
  ])
  const [open, setOpen] = React.useState(false)
  const [isSaving, setIsSaving] = React.useState(false)
  const [mode, setMode] = React.useState<SheetMode>("create")
  const [selectedGroup, setSelectedGroup] = React.useState<DraftGroup | null>(null)
  const [participantsGroup, setParticipantsGroup] = React.useState<DraftGroup | null>(null)
  const [deleteGroup, setDeleteGroup] = React.useState<DraftGroup | null>(null)
  const [isDeleting, setIsDeleting] = React.useState(false)

  const categoryById = React.useMemo(() => {
    return new Map(categories.map((category) => [category.id, category]))
  }, [categories])

  function openCreateSheet() {
    setMode("create")
    setSelectedGroup(null)
    setOpen(true)
  }

  const openEditSheet = React.useCallback((group: DraftGroup) => {
    setMode("edit")
    setSelectedGroup(group)
    setOpen(true)
  }, [])

  const columns = React.useMemo<ColumnDef<DraftGroup>[]>(() => [
    {
      accessorKey: "id",
      header: ({column}) => (
        <Button
          variant="ghost"
          size="sm"
          className="-ml-2"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ID
          <ArrowUpDown />
        </Button>
      ),
      cell: ({row}) => (
        <span className="tabular-nums text-muted-foreground">
          {row.original.id}
        </span>
      ),
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
          Group
          <ArrowUpDown />
        </Button>
      ),
      cell: ({row}) => (
        <span className="font-medium">
          {row.original.name}
        </span>
      ),
    },
    {
      id: "category",
      accessorFn: (group) => group.eventCategoryId
        ? categoryById.get(group.eventCategoryId)?.name ?? "Unknown category"
        : "Unassigned",
      header: ({column}) => (
        <Button
          variant="ghost"
          size="sm"
          className="-ml-2"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Category
          <ArrowUpDown />
        </Button>
      ),
      cell: ({row}) => (
        row.original.eventCategoryId ? (
          <Badge variant="secondary">
            {categoryById.get(row.original.eventCategoryId)?.name ?? "Unknown category"}
          </Badge>
        ) : (
          <span className="text-sm text-muted-foreground">Unassigned</span>
        )
      ),
    },
    {
      id: "participants",
      accessorFn: (group) => group.participants.length,
      header: ({column}) => (
        <Button
          variant="ghost"
          size="sm"
          className="-ml-2"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Participants
          <ArrowUpDown />
        </Button>
      ),
      cell: ({row}) => (
        <span className="tabular-nums">
          {row.original.participants.length}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Action",
      enableSorting: false,
      cell: ({row}) => (
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label={`View participants in ${row.original.name}`}
            onClick={() => setParticipantsGroup(row.original)}
          >
            <Users />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label={`Edit ${row.original.name}`}
            onClick={() => openEditSheet(row.original)}
          >
            <Pencil />
          </Button>
          {row.original.participants.length === 0 ? (
            <Button
              type="button"
              variant="destructive"
              size="icon"
              aria-label={`Delete ${row.original.name}`}
              onClick={() => setDeleteGroup(row.original)}
            >
              <Trash />
            </Button>
          ) : null}
        </div>
      ),
    },
  ], [categoryById, openEditSheet])

  // eslint-disable-next-line react-hooks/incompatible-library -- TanStack Table exposes non-memoizable table helpers.
  const table = useReactTable({
    data: items,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getRowId: (group) => String(group.id),
    globalFilterFn: (row, _columnId, filterValue) => {
      const normalizedFilter = String(filterValue).trim().toLowerCase()

      if (!normalizedFilter) {
        return true
      }

      const group = row.original
      const categoryName = group.eventCategoryId
        ? categoryById.get(group.eventCategoryId)?.name ?? ""
        : "unassigned"
      const participants = group.participants
        .map((participant) => `${participant.user.name} ${participant.bibNumber ?? ""} ${PARTICIPANT_STATUS_LABELS[participant.status ?? ""] ?? participant.status ?? ""}`)
        .join(" ")

      return `${group.name} ${categoryName} ${participants}`.toLowerCase().includes(normalizedFilter)
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  async function handleSave(values: { name: string; eventCategoryId: number | null }) {
    setIsSaving(true)

    try {
      if (mode === "edit" && selectedGroup) {
        const res = await updateGroupAction({
          id: selectedGroup.id,
          eventId: selectedGroup.eventId,
          name: values.name,
          eventCategoryId: values.eventCategoryId,
        })
        toast.info(res.message)

        if (!res.success) {
          return
        }

        setItems((current) =>
          current.map((group) =>
            group.id === selectedGroup.id
              ? {...group, name: values.name, eventCategoryId: values.eventCategoryId}
              : group
          )
        )
        router.refresh()
        setOpen(false)
        return
      } else {
        const payload: InsertGroupType = {
          eventId,
          name: values.name,
          eventCategoryId: values.eventCategoryId,
        }

        const res = await createGroupAction(payload)
        toast.info(res.message)

        if (!res.success) {
          return
        }

        setItems((current) => [
          ...current,
          {
            id: Number(res.data),
            name: values.name,
            eventId,
            eventCategoryId: values.eventCategoryId,
            participants: [],
          },
        ])

        router.refresh()
      }

      setOpen(false)
    } catch {
      toast.error("Unable to save group.")
    } finally {
      setIsSaving(false)
    }
  }

  async function handleDeleteGroup() {
    if (!deleteGroup) {
      return
    }

    setIsDeleting(true)

    try {
      const res = await deleteGroupAction(deleteGroup.id, eventId)

      if (!res.success) {
        toast.error(res.message)
        return
      }

      setItems((current) => current.filter((group) => group.id !== deleteGroup.id))
      toast.success(res.message)
      router.refresh()
      setDeleteGroup(null)
    } catch {
      toast.error("Unable to delete group.")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={globalFilter}
            onChange={(event) => setGlobalFilter(event.target.value)}
            placeholder="Search groups"
            className="pl-8"
          />
        </div>
        <Button onClick={openCreateSheet}>
          <Plus />
          Add Group
        </Button>
      </div>

      <div className="overflow-hidden rounded-lg border bg-card">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={header.column.id === "actions" ? "w-36 text-right" : undefined}
                  >
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
                    <TableCell
                      key={cell.id}
                      className={cell.column.id === "actions" ? "text-right" : undefined}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length}>
                  <Empty className="border-0 py-10">
                    <EmptyHeader>
                      <EmptyMedia variant="icon">
                        <UsersRound />
                      </EmptyMedia>
                      <EmptyTitle>No groups found</EmptyTitle>
                      <EmptyDescription>
                        Add a group or adjust the search term.
                      </EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {open ? (
        <GroupSheet
          key={selectedGroup?.id ?? "create"}
          open={open}
          onOpenChange={setOpen}
          mode={mode}
          categories={categories}
          group={selectedGroup}
          isSaving={isSaving}
          onSave={handleSave}
        />
      ) : null}

      <AlertDialog
        open={participantsGroup !== null}
        onOpenChange={(isOpen) => { if (!isOpen) setParticipantsGroup(null) }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {participantsGroup?.name} — Participants
            </AlertDialogTitle>
          </AlertDialogHeader>
          {participantsGroup && participantsGroup.participants.length > 0 ? (
            <ul className="max-h-72 space-y-1 overflow-y-auto py-1 text-sm">
              {participantsGroup.participants.map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-3 rounded px-2 py-1.5 hover:bg-muted">
                  <span className="min-w-0 truncate">{p.user.name}</span>
                  <span className="flex shrink-0 items-center gap-2">
                    <Badge variant={PARTICIPANT_STATUS_BADGE[p.status ?? ""] ?? "outline"} className="text-xs">
                      {PARTICIPANT_STATUS_LABELS[p.status ?? ""] ?? p.status ?? "Unknown"}
                    </Badge>
                    <span className="text-xs tabular-nums text-muted-foreground">
                      {p.bibNumber ? `#${p.bibNumber}` : "No bib"}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="py-4 text-center text-sm text-muted-foreground">
              No participants in this group yet.
            </p>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={deleteGroup !== null}
        onOpenChange={(isOpen) => {
          if (!isOpen && !isDeleting) {
            setDeleteGroup(null)
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete group?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete <strong>{deleteGroup?.name}</strong>. Existing participants
              will no longer be assigned to this group. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={isDeleting}
              onClick={handleDeleteGroup}
            >
              {isDeleting ? "Deleting..." : "Yes, Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

function GroupSheet({
  open,
  onOpenChange,
  mode,
  categories,
  group,
  isSaving,
  onSave,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: SheetMode
  categories: EventCategoryType[]
  group: DraftGroup | null
  isSaving: boolean
  onSave: (values: { name: string; eventCategoryId: number | null }) => void | Promise<void>
}) {
  const formId = React.useId()
  const [name, setName] = React.useState(group?.name ?? "")
  const [categoryValue, setCategoryValue] = React.useState(
    group?.eventCategoryId ? String(group.eventCategoryId) : "none"
  )

  function handleSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault()

    const trimmedName = name.trim()
    if (!trimmedName) {
      return
    }

    onSave({
      name: trimmedName,
      eventCategoryId: categoryValue === "none" ? null : Number(categoryValue),
    })
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{mode === "edit" ? "Edit Group" : "Add Group"}</SheetTitle>
          <SheetDescription>
            Set the group name and optional category.
          </SheetDescription>
        </SheetHeader>

        <form id={formId} onSubmit={handleSubmit}>
          <div className="grid flex-1 auto-rows-min gap-6 px-4">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor={`${formId}-name`}>Group Name</FieldLabel>
                <Input
                  id={`${formId}-name`}
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Peloton Bali"
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor={`${formId}-category`}>Category</FieldLabel>
                <Select
                  value={categoryValue}
                  onValueChange={(value) => value && setCategoryValue(value)}
                >
                  <SelectTrigger id={`${formId}-category`} className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Unassigned</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={String(category.id)}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldDescription>
                  The category shown when participants choose this group.
                </FieldDescription>
              </Field>
            </FieldGroup>
          </div>
        </form>

        <SheetFooter>
          <Button type="submit" form={formId} disabled={!name.trim() || isSaving}>
            Save
          </Button>
          <SheetClose render={<Button variant="outline">Cancel</Button>} />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
