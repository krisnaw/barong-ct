import {EventType} from "@/db/schema";
import {emptyBanner} from "@/types/date-helper";
import {MapPin} from "lucide-react";
import {EventDate} from "@/components/events/event-date";
import {Button} from "@/components/ui/button";
import Link from "next/link";

export function ListItemEvent({event}: { event: EventType }) {
  return (
    <div className="sm:flex outline rounded-xl p-4">
      <div className="mb-4 shrink-0 sm:mr-4 sm:mb-0 flex items-center justify-center">
        <div className="mr-0 shrink-0 w-full">
          <img
            alt=""
            src={event.feature_image ?? emptyBanner}
            className="aspect-square  lg:size-24   rounded-2xl  object-cover"
          />
        </div>
      </div>
      <div className="flex-1">

        <div className="sm:flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-xs lg:text-lg">
              <EventDate eventDate={event.startDate} type="date"/> - <EventDate eventDate={event.startDate} type="time"/>
            </p>

            <h3 className="text-lg font-bold ">
              {event.name}
            </h3>

            <p className="mt-1 inline-flex items-center text-gray-500 gap-2">
              <MapPin size={18}/> {event.locationName}
            </p>

          </div>
          <div className="mt-4 shrink-0">
            <Button variant="outline" className="w-full sm:" asChild>
              <Link href={`/event/${event.id}`}>
                View
              </Link>
            </Button>
          </div>
        </div>


      </div>
    </div>

    // <div className="sm:flex outline rounded-xl p-4">
    //
    //   <div className="mr-4 shrink-0">
    //     <img
    //       alt=""
    //       src={event.feature_image ?? emptyBanner}
    //       className="inline-block size-24 object-cover rounded-md outline -outline-offset-1 outline-white/10"
    //     />
    //   </div>
    //
    //   <div className="w-full flex flex-wrap items-center justify-between sm:flex-nowrap">
    //     <div>

    //       <h4 className="text-lg font-bold ">
    //         {event.name}
    //       </h4>

    //     </div>
    //     <div className="shrink-0 flex gap-2">
    //       <Button variant="outline" asChild>
    //         <Link href={`/event/${event.id}`}>
    //           View
    //         </Link>
    //       </Button>
    //     </div>
    //   </div>
    //
    // </div>
  )
}