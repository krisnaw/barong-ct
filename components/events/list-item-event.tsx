import {EventType} from "@/db/schema";
import {MapPin} from "lucide-react";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {ButtonJoinEvent} from "@/components/events/button-join-event";
import {emptyBanner} from "@/types/date-helper";
import {EventDate} from "@/components/events/event-date";

export function ListItemEvent({event} : {event: EventType}) {
  return (
    <div className="flex outline rounded-xl p-4">

      <div className="mr-4 shrink-0">
        <img
          alt=""
          src={event.feature_image ?? emptyBanner}
          className="inline-block size-24 object-cover rounded-md outline -outline-offset-1 outline-white/10"
        />
      </div>

      <div className="w-full flex flex-wrap items-center justify-between sm:flex-nowrap">
        <div>
          <p className="text-gray-500 text-lg">
            <EventDate eventDate={event.startDate} type="date" />
          </p>
          <h4 className="text-lg font-bold ">
            {event.name}
          </h4>
          <p className="mt-1 inline-flex items-center text-gray-500 gap-2">
            <MapPin size={18} /> {event.locationName}
          </p>
        </div>
        <div className="shrink-0 flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/app/(home)/(manage)/event/${event.id}`}>
              View
            </Link>
          </Button>
          <ButtonJoinEvent eventId={event.id} />
        </div>
      </div>

    </div>
  )
}