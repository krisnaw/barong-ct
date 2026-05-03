import {EventType} from "@/db/schema";
import * as React from "react";
import {EventCard} from "@/components/events/event-card";

export function ListItemEvent({event}: { event: EventType & { participantCount?: number } }) {
  return (
    <EventCard event={event} withFooter={true} />
  )
}