import {getEvents} from "@/db/query/event-query";
import {Button, buttonVariants} from "@/components/ui/button";
import Link from "next/link";
import {Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle} from "@/components/ui/empty";
import {UserIcon} from "lucide-react";
import {EventTable} from "@/components/events/event-table";
import {Card, CardAction, CardContent, CardHeader, CardTitle} from "@/components/ui/card";

export default async function EventsPage() {

  const events = await getEvents();

  if (events.length === 0) {
    return (
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
            <Link href="/dashboard/events/create" prefetch={true}>
              Create Event
            </Link>
          </Button>
        </EmptyContent>
      </Empty>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Event list
        </CardTitle>
        <CardAction>
          <Link href="/dashboard/events/create"
                className={buttonVariants({ variant: "default", })}>
            Create Event
          </Link>
        </CardAction>
      </CardHeader>
      <CardContent>
        <EventTable events={events} />
      </CardContent>
    </Card>
  );
}