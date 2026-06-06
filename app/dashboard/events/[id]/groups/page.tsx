import Link from "next/link"
import {ArrowLeft} from "lucide-react"

import {DashboardGroupManager} from "@/components/group/dashboard-group-manager"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {getGroupsByEvent} from "@/db/query/event-group.query"
import {getCategoryByEvent} from "@/db/query/event-category.query";

export default async function Page({
  params,
}: {
  params: Promise<{ id: number }>
}) {
  const {id} = await params
  const eventId = Number(id)

  const [categories, groups] = await Promise.all([
    getCategoryByEvent(eventId),
    getGroupsByEvent(eventId),
  ])


  return (
    <div className="space-y-4">
      <div>
        <Link href={`/dashboard/events/${eventId}`} className="inline-flex gap-2">
          <ArrowLeft />
          Event Detail
        </Link>
      </div>

      <Card>
        <CardHeader className="gap-1">
          <CardTitle>Manage Groups</CardTitle>
          <CardDescription>
            Add and edit groups for
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DashboardGroupManager
            eventId={eventId}
            categories={categories}
            groups={groups}
          />
        </CardContent>
      </Card>
    </div>
  )
}
