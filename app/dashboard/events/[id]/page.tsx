import {getEventById} from "@/db/query/event-query";
import {redirect} from "next/navigation";
import {Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {CalendarIcon, MapPin} from "lucide-react";
import {EventDate} from "@/components/events/event-date";
import Link from "next/link";
import {ButtonDownloadParticipant} from "@/components/button/button-download-participant";
import {getCategoryByEvent} from "@/db/query/event-category.query";
import {ListCategory} from "@/components/category/list-category";
import {ListPromo} from "@/components/promo/list-promo";
import {getPromoByEvent} from "@/db/query/event-promo.query";
import {AddCategory} from "@/components/category/add-category";
import {AddPromo} from "@/components/promo/add-promo";
import {getParticipantByEvent} from "@/db/query/participant-query";
import {ListParticipant} from "@/components/participant/list-participant";
import {buttonVariants} from "@/components/ui/button";

export default async function Page({params}: { params: Promise<{ id: number }> }) {
  const {id} = await params;
  const event = await getEventById(id)
  if (!event) {
    redirect('/dashboard/events');
  }

  const categories = await getCategoryByEvent(id)

  const promos = await getPromoByEvent(id)

  const participants = await getParticipantByEvent(id)

  return (
    <div className="space-y-4">
      <Card>
        <CardContent>
          <div className="md:flex md:items-center md:justify-between">
            <div className="min-w-0 flex-1">
              <h2 className="text-2xl/7 font-bold  sm:truncate sm:text-3xl sm:tracking-tight">
                {event.name}
              </h2>

              <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
                <div className="mt-2 flex items-center text-sm text-muted-foreground">
                  <MapPin aria-hidden="true" className="mr-1.5 size-5 shrink-0 text-muted-foreground"/>
                  {event.locationName}
                </div>
                <div className="mt-2 flex items-center text-sm text-muted-foreground">
                  <CalendarIcon aria-hidden="true" className="mr-1.5 size-5 shrink-0 text-muted-foreground"/>
                  <EventDate eventDate={event.startDate} type="date"/> - <EventDate eventDate={event.startDate}
                                                                                    type="time"/>
                </div>
              </div>

            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4 gap-2">
              <Link
                className={buttonVariants({variant: "secondary", size: "sm"})}
                href={`/dashboard/events/${id}/edit`}>
                Edit
              </Link>
            </div>
          </div>

        </CardContent>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardDescription>Total participants</CardDescription>
            <CardTitle className="text-3xl">
              {participants.length}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Total Revenue</CardDescription>
            <CardTitle className="text-3xl">
              {participants.length}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Total Revenue</CardDescription>
            <CardTitle className="text-3xl">
              {participants.length}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Total Revenue</CardDescription>
            <CardTitle className="text-3xl">
              {participants.length}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Participants</CardTitle>
          <CardAction>
            <ButtonDownloadParticipant eventId={event.id} eventName={event.name}/>
          </CardAction>
        </CardHeader>
        <CardContent>
          <ListParticipant participants={participants}/>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Categories</CardTitle>
            <CardAction>
              <AddCategory eventId={id}/>
            </CardAction>
          </CardHeader>
          <CardContent>
            <ListCategory categories={categories}/>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Promo code</CardTitle>
            <CardAction>
              <AddPromo eventId={event.id}/>
            </CardAction>
          </CardHeader>
          <CardContent>
            <ListPromo promos={promos}/>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
