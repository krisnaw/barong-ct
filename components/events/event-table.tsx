import Link from "next/link"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {Button} from "@/components/ui/button"
import {Badge} from "@/components/ui/badge"
import {EventDate} from "@/components/events/event-date"
import {ButtonChangeEventStatus} from "@/components/events/button-change-event-status"
import {EventList} from "@/db/query/event-query"

export function EventTable({events}: { events: EventList }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Date time</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {events.map((event) => (
          <TableRow key={event.id}>
            <TableCell className="font-medium">
              {event.name}
            </TableCell>
            <TableCell className="flex flex-col">
              <div className="font-medium">
                <EventDate eventDate={event.startDate} type="date"/>
              </div>
              <div className="mt-1 text-muted-foreground">
                <EventDate eventDate={event.startDate} type="time"/>
              </div>
            </TableCell>
            <TableCell>
              <Badge variant="outline" className="capitalize">
                {event.status ?? "draft"}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Link href={`/dashboard/events/${event.id}`}>
                  <Button variant="outline" size="sm">View</Button>
                </Link>
                <Link href={`/dashboard/events/${event.id}/edit`}>
                  <Button variant="outline" size="sm">Edit</Button>
                </Link>
                <ButtonChangeEventStatus currentStatus={event.status ?? "draft"}/>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}