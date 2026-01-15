import {getEvents} from "@/db/query/event-query";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {EventDate} from "@/components/events/event-date";

export default async function EventsPage() {

  const events = await getEvents();

  if (events.length === 0) {
    return (
      <Button asChild>
        <Link href="/dashboard/events/create">
          Create Event
        </Link>
      </Button>
    )
  }

  return (
    <div>
      event page
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Events</h1>

      <Button asChild>
        <Link href="/dashboard/events/create">
          Create Event
        </Link>
      </Button>

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