import * as React from "react";
import {EventType, ParticipantType} from "@/db/schema";
import {CalendarDays, MapPin, Ticket, Users} from "lucide-react";
import {EventDate} from "@/components/events/event-date";
import {formatMoney} from "@/utils/money-helper";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import Image from "next/image";
import {Item} from "@/components/ui/item";
import {Button} from "@/components/ui/button";
import Link from "next/link";

export function EventCard({event, withFooter = false, participant}: {
  event: EventType,
  withFooter?: boolean,
  participant?: ParticipantType
}) {
  return (
    <Card className="cn-card group/card flex flex-col relative w-full overflow-hidden pt-0">
      <div className="relative h-96 w-full overflow-hidden rounded-b-4xl shadow">
        <Image
          src={event.feature_image ?? "/empty-banner.png"}
          alt={event.name}
          fill
          className="object-cover"
        />
      </div>

      <CardHeader className="mt-2">
        <CardTitle>
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight text-balance">
            {event.name}
          </h1>
        </CardTitle>
        <CardDescription className="truncate">
          <div dangerouslySetInnerHTML={{ __html: event.description }} />
        </CardDescription>
      </CardHeader>

      <CardContent className="mt-4">

        <div className="space-y-4  mb-4">

          <div className="flex">
            <div className="mr-4 shrink-0">
              <div className="flex size-10 items-center justify-center rounded-lg  outline outline-foreground/10">
                <CalendarDays size={20} className="text-muted-foreground"/>
              </div>
            </div>
            <div>
              <p className="font-bold">
                <EventDate eventDate={event.startDate} type="date"/>
              </p>
              <p className="text-sm font-semibold text-muted-foreground">
                <EventDate eventDate={event.startDate} type="time"/>
              </p>
            </div>
          </div>

          <div className="flex items-center">
            <div className="mr-4 shrink-0">
              <div className="flex size-10 items-center justify-center rounded-lg  outline outline-foreground/10">
                <MapPin size={20} className="text-muted-foreground"/>
              </div>
            </div>
            <div>
              <p className="font-bold">SANA by NUMA</p>
            </div>
          </div>

          <div className="flex items-center">
            <div className="mr-4 shrink-0">
              <div className="flex size-10 items-center justify-center rounded-lg  outline outline-foreground/10">
                <Users size={20} className="text-muted-foreground"/>
              </div>
            </div>
            <div>
              <p className="font-bold">Limited to {event.maxParticipants} riders</p>
            </div>
          </div>

        </div>

        {event.price ? (
          <Item className="bg-muted">
            <div className="inline-flex gap-3 items-center">
              <Ticket/>
              <p className="cn-card-title cn-font-heading text-2xl tabular-nums">
                {formatMoney(Number(event.price))}
              </p>
            </div>
          </Item>
        ) : (
          <Item className="bg-muted">
            <div className="inline-flex gap-3 items-center">
              <Ticket/>
              <p className="cn-card-title cn-font-heading text-2xl tabular-nums">
                FREE
              </p>
            </div>
          </Item>
        )}
      </CardContent>

      {withFooter ? (
        <CardFooter>
          {!participant && (
            <Button className="w-full">
              <Link href={`/event/${event.id}/order`}>
                Join Event
              </Link>
            </Button>
          )}
        </CardFooter>
      ) : null}


    </Card>
  )
}
