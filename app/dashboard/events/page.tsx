import {Button} from "@/components/ui/button";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table";
import Link from "next/link";
import {getEvents} from "@/db/query/event-query";
import {EventDate} from "@/components/events/event-date";

export default async function EventsPage() {

  const events = await getEvents()

  if (events.length === 0) {
    return (
      <div>
        <Link href="/dashboard/events/create">
          <Button>Create Event</Button>
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Events</h1>
        <Link href="/dashboard/events/create">
          <Button>Create Event</Button>
        </Link>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Date time</TableHead>
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
                <div className="font-medium ">
                  <EventDate eventDate={event.startDate} type="date" />
                </div>
                <div className="mt-1 text-muted-foreground">

                  <EventDate eventDate={event.startDate} type="time" />
                </div>
              </TableCell>
              <TableCell>
                <Link href={`/dashboard/events/${event.id}`}>
                  <Button variant="outline" size="sm" className="mr-2">
                    View
                  </Button>
                </Link>
                <Link href={`/dashboard/events/${event.id}/edit`}>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}