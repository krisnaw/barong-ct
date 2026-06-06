import {getEventById} from "@/db/query/event-query";
import {redirect} from "next/navigation";
import {Card, CardAction, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {CalendarIcon, MapPin} from "lucide-react";
import {EventDate} from "@/components/events/event-date";
import Link from "next/link";
import {ButtonDownloadParticipant} from "@/components/button/button-download-participant";
import {ListCategory} from "@/components/category/list-category";
import {ListPromo} from "@/components/promo/list-promo";
import {getPromoByEvent} from "@/db/query/event-promo.query";
import {AddCategory} from "@/components/category/add-category";
import {AddPromo} from "@/components/promo/add-promo";
import {getParticipantByEvent, getParticipantByEventCount} from "@/db/query/participant-query";
import {ListParticipant} from "@/components/participant/list-participant";
import {buttonVariants} from "@/components/ui/button";
import {Pagination} from "@/components/ui/pagination";
import {getGroupsByEvent} from "@/db/query/event-group.query";

const PAGE_SIZE = 20

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: number }>
  searchParams: Promise<{ page?: string }>
}) {
  const {id} = await params;
  const { page: pageParam } = await searchParams
  const page = Math.max(1, parseInt(pageParam ?? "1"))

  const event = await getEventById(id)
  if (!event) {
    redirect('/dashboard/events');
  }

  const promos = await getPromoByEvent(id)

  const [participants, total, groups] = await Promise.all([
    getParticipantByEvent(id, { page, pageSize: PAGE_SIZE }),
    getParticipantByEventCount(id),
    getGroupsByEvent(id)
  ])

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
                  <EventDate eventDate={event.startDate} type="date"/> - <EventDate eventDate={event.startDate} type="time"/>
                </div>
              </div>

            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4 gap-2">
              <Link
                className={buttonVariants({variant: "outline", size: "sm"})}
                href={`/dashboard/events/${id}/groups`}>
                Manage Groups
              </Link>
              <Link
                className={buttonVariants({variant: "secondary", size: "sm"})}
                href={`/dashboard/events/${id}/edit`}>
                Edit
              </Link>
            </div>
          </div>

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
            <ListCategory categories={event.categories}/>
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
      <Card>
        <CardHeader>
          <CardTitle>Participants</CardTitle>
          <CardAction className="flex gap-2">
            <Link
              className={buttonVariants({variant: "outline", size: "sm"})}
              href={`/dashboard/events/${id}/register`}
            >
              Register User
            </Link>
            <ButtonDownloadParticipant eventId={event.id} eventName={event.name}/>
          </CardAction>
        </CardHeader>
        <CardContent className="space-y-4">
          <ListParticipant participants={participants} groups={groups} categories={event.categories}/>
          <Pagination
            page={page}
            pageSize={PAGE_SIZE}
            total={total}
            buildHref={(p) => `/dashboard/events/${id}?page=${p}`}
          />
        </CardContent>
      </Card>
    </div>
  )
}
