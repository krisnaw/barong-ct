import {CalendarDays, MapPin} from "lucide-react";
import {emptyBanner} from "@/types/date-helper";
import {getEventById} from "@/db/query/event-query";
import {redirect} from "next/navigation";
import {ButtonJoinEvent} from "@/components/events/button-join-event";
import {toZonedTime} from "date-fns-tz";
import {EventDate} from "@/components/events/event-date";

export default async function Page({params,}: { params: Promise<{ id: number }> }) {

  const {id} = await params;

  const event = await getEventById(id);

  if (!event) {
    redirect('/');
  }

  const zonedDate = toZonedTime(event.startDate, 'Asia/Singapore')

  return (
    <div className="mx-auto max-w-4xl">
      <div className="sm:flex gap-8">

        <div className="mr-4 shrink-0 w-sm">
          <img
            className="aspect-square w-full rounded-2xl  object-cover"
            src={event.feature_image ?? emptyBanner}
            alt="Banner image" />
        </div>

        <div className="w-full">

          <div>
            <h2 className="text-2xl font-semibold">
              {event.name}
            </h2>

            <ul className="mt-4 grid grid-cols-1 gap-8">
              <li>
                <div className="flex">

                  <div className="mr-4 shrink-0">

                    <div className="outline rounded-xl outline-gray-300 p-2.5">
                      <CalendarDays size="32" className="text-gray-500" />
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-800">
                      <EventDate eventDate={event.startDate} type="date" />
                    </h4>
                    <p className="mt-1 text-gray-400">
                      <EventDate eventDate={event.startDate} type="time" />
                    </p>
                  </div>
                </div>
              </li>

              <li>
                <div className="flex">
                  <div className="mr-4 shrink-0">

                    <div className="outline rounded-xl outline-gray-300 p-2.5">
                      <MapPin size="32" className="text-gray-500" />
                    </div>

                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800">
                      {event.locationName}
                    </h4>
                    <p className="mt-1 text-gray-400">
                      {event.locationName}
                    </p>
                  </div>
                </div>
              </li>
            </ul>

            <div className="mt-8">
              <ButtonJoinEvent eventId={event.id} />
            </div>
          </div>

          <div className="mt-10">

            <div className="space-y-6">

              <div>
                <div className="px-4 sm:px-0 border-b border-gray-200">
                  <h3 className="text-base/7 font-semibold text-muted-foreground">About Event</h3>
                </div>
                <div className="mt-4">
                  <p>{event.description}</p>
                </div>
              </div>

              <div>

                <div className="px-4 sm:px-0 border-b border-gray-200">
                  <h3 className="text-base/7 font-semibold text-muted-foreground">Location</h3>
                </div>

                <div className="mt-4">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3944.3628429589126!2d115.26138180000001!3d-8.656998999999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd241007ff18975%3A0x90cb3b1c40257b08!2sXavi%20Croissanterie!5e0!3m2!1sen!2sid!4v1768382812451!5m2!1sen!2sid"
                    width="600" height="450" style={{ border: 0 }} allowFullScreen={false} loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"></iframe>
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>


    </div>
  )
}