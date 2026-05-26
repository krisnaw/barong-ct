import {Item, ItemContent} from "@/components/ui/item";
import {Separator} from "@/components/ui/separator";
import {EventType} from "@/db/schema";
import {EventDate} from "@/components/events/event-date";

export function EventCardDetail({event} : {event: EventType}) {
  return (
    <Item variant="muted" className="flex-col items-stretch">
      <ItemContent className="gap-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Date
          </span>
          <span className="text-sm font-medium">
            <EventDate eventDate={event.startDate} type="date"/> , <EventDate eventDate={event.startDate} type="time"/>
          </span>
        </div>
        <Separator/>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Venue
          </span>
          <span className="text-sm font-medium tabular-nums">
            {event.locationName}
          </span>
        </div>
      </ItemContent>
    </Item>
  )
}