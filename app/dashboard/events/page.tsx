import {getEvents} from "@/db/query/event-query";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {EventDate} from "@/components/events/event-date";
import {Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle} from "@/components/ui/empty";
import {UserIcon} from "lucide-react";

export default async function EventsPage() {

  const events = await getEvents();

  if (events.length === 0) {
    return (
      <>

        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <UserIcon />
            </EmptyMedia>
            <EmptyTitle>No Event Yet</EmptyTitle>
            <EmptyDescription>
              You haven&apos;t created any event yet. Get started by creating
              your first event.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent className="flex-row justify-center gap-2">
            <Button>
              <Link href="/dashboard/events/create">
                Create Event
              </Link>
            </Button>
          </EmptyContent>
        </Empty>
      </>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Events</h1>

        <Button >
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
            <TableHead>Participants</TableHead>
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
                  <EventDate eventDate={event.startDate} type="date"/>
                </div>
                <div className="mt-1 text-muted-foreground">
                  <EventDate eventDate={event.startDate} type="time"/>
                </div>
              </TableCell>
              <TableCell>
                {event.participantCount} / {event.maxParticipants || '∞'}
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