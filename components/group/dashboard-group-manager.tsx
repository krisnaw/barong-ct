'use client'

import * as React from "react"
import {useRouter} from "next/navigation"
import {toast} from "sonner"

import {createGroupAction, updateGroupAction} from "@/app/actions/event-group/event-group.action"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
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
import {Pencil, Plus, Search, Users, UsersRound} from "lucide-react";

type GroupParticipant = { id: number; user: { name: string } }

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
  const [query, setQuery] = React.useState("")
  const [open, setOpen] = React.useState(false)
  const [isSaving, setIsSaving] = React.useState(false)
  const [mode, setMode] = React.useState<SheetMode>("create")
  const [selectedGroup, setSelectedGroup] = React.useState<DraftGroup | null>(null)
  const [participantsGroup, setParticipantsGroup] = React.useState<DraftGroup | null>(null)

  const categoryById = React.useMemo(() => {
    return new Map(categories.map((category) => [category.id, category]))
  }, [categories])

  const filteredGroups = React.useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    if (!normalizedQuery) {
      return items
    }

    return items.filter((group) => {
      const categoryName = group.eventCategoryId
        ? categoryById.get(group.eventCategoryId)?.name ?? ""
        : "unassigned"

      return `${group.name} ${categoryName}`.toLowerCase().includes(normalizedQuery)
    })
  }, [categoryById, items, query])

  function openCreateSheet() {
    setMode("create")
    setSelectedGroup(null)
    setOpen(true)
  }

  function openEditSheet(group: DraftGroup) {
    setMode("edit")
    setSelectedGroup(group)
    setOpen(true)
  }

  async function handleSave(values: { name: string; eventCategoryId: number | null }) {
    setIsSaving(true)

    try {
      if (mode === "edit" && selectedGroup) {
        const res = await updateGroupAction({
          id: selectedGroup.id,
          eventId: selectedGroup.eventId,
          name: values.name,
        })
        toast.info(res.message)

        if (!res.success) {
          return
        }

        setItems((current) =>
          current.map((group) =>
            group.id === selectedGroup.id
              ? {...group, name: values.name}
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

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
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
            <TableRow>
              <TableHead className="w-16">ID</TableHead>
              <TableHead>Group</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="w-20 text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredGroups.length > 0 ? (
              filteredGroups.map((group) => (
                <TableRow key={group.id}>
                  <TableCell className="tabular-nums text-muted-foreground">{group.id}</TableCell>
                  <TableCell className="font-medium">{group.name}</TableCell>
                  <TableCell>
                    {group.eventCategoryId ? (
                      <Badge variant="secondary">
                        {categoryById.get(group.eventCategoryId)?.name ?? "Unknown category"}
                      </Badge>
                    ) : (
                      <span className="text-sm text-muted-foreground">Unassigned</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`View participants in ${group.name}`}
                      onClick={() => setParticipantsGroup(group)}
                    >
                      <Users />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Edit ${group.name}`}
                      onClick={() => openEditSheet(group)}
                    >
                      <Pencil />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4}>
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
                <li key={p.id} className="rounded px-2 py-1.5 hover:bg-muted">
                  {p.user.name}
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
                  disabled={mode === "edit"}
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
                  {mode === "edit"
                    ? "Only group name editing is wired for now."
                    : "The category shown when participants choose this group."}
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
