import * as React from "react";
import {EventType, ParticipantType} from "@/db/schema";
import {emptyBanner} from "@/types/date-helper";
import {CalendarDays, CreditCard, MapPin, TimerIcon, Users} from "lucide-react";
import {EventDate} from "@/components/events/event-date";
import {formatMoney} from "@/utils/money-helper";
import {Button} from "@/components/ui/button";
import Link from "next/link";

export function EventCard({event, participant} : {event: EventType, participant? : ParticipantType}) {
  return (
    <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow-sm">
      <div>
        <img className="size-full aspect-square flex-none  object-cover outline -outline-offset-1 outline-white/10"
               src={emptyBanner} alt=""/>
      </div>

      <div className="px-4 py-5 sm:p-6">
        <div>
          <h3 className=" text-lg/6 font-semibold text-gray-900 group-hover:text-gray-600">
            {event.name}
          </h3>
        </div>

        <div>
          <dl className="flex flex-wrap">

            <div className="mt-4 flex w-full flex-none gap-x-4 border-t border-gray-900/5 pt-4">
              <dt className="flex-none">
                <span className="sr-only">Date</span>
                <CalendarDays aria-hidden="true" className="h-6 w-5 text-gray-400" />
              </dt>
              <dd className=" text-sm/6 font-bold text-gray-900">
                <time dateTime={event.startDate.toDateString()}>
                  <EventDate eventDate={event.startDate} type="date"/>
                </time>
              </dd>
            </div>

            <div className="mt-2 flex w-full flex-none gap-x-4">
              <dt className="flex-none">
                <span className="sr-only">Due date</span>
                <TimerIcon aria-hidden="true" className="h-6 w-5 text-gray-400" />
              </dt>
              <dd className="text-sm/6 text-gray-500">
                <time dateTime={event.startDate.toTimeString()}>
                  <EventDate eventDate={event.startDate} type="time"/>
                </time>
              </dd>
            </div>

            <div className="mt-2 flex w-full flex-none gap-x-4">
              <dt className="flex-none">
                <span className="sr-only">Due date</span>
                <MapPin aria-hidden="true" className="h-6 w-5 text-gray-400" />
              </dt>
              <dd className="text-sm/6 text-gray-500">
                {event.locationName}
              </dd>
            </div>

            <div className="mt-2 flex w-full flex-none gap-x-4">
              <dt className="flex-none">
                <span className="sr-only">Status</span>
                <CreditCard aria-hidden="true" className="h-6 w-5 text-gray-400" />
              </dt>
              <dd className="text-sm/6 text-green-500 font-semibold">
                {formatMoney(Number(event.price))}
              </dd>
            </div>

            <div className="mt-2 flex w-full flex-none gap-x-4">
              <dt className="flex-none">
                <span className="sr-only">Due date</span>
                <Users aria-hidden="true" className="h-6 w-5 text-gray-400" />
              </dt>
              <dd className="text-sm/6 text-gray-500">
                Limited to <span className="font-bold text-primary">{event.maxParticipants} </span> Slots
              </dd>
            </div>

          </dl>
        </div>

        {!participant && (
          <div className="mt-4">

            <Button className="w-full" asChild={true}>
              <Link href={`/event/${event.id}/order`}>
                Join Event
              </Link>
            </Button>

          </div>
        )}

      </div>
      <div className="px-4 py-4 sm:px-6">
        <article className="prose prose-sm">
          <div dangerouslySetInnerHTML={{__html: event.description}}/>
        </article>
      </div>
    </div>
  )
}