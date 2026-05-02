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

export function EventCard({event, withFooter = false, participant} : {event: EventType, withFooter?: boolean, participant? : ParticipantType}) {
  return (
    <Card className="cn-card group/card flex flex-col relative w-full overflow-hidden pt-0">
      <div className="max-h-96 overflow-hidden rounded-b-4xl shadow-xl">
        <Image
          src="https://images.lumacdn.com/cdn-cgi/image/format=auto,fit=cover,dpr=2,background=white,quality=75,width=400,height=400/event-covers/vl/d915ba91-1698-484a-9d45-4787d8112668.png"
          alt="Valeria Reverdo on Unsplash"
          width={128}
          height={128}
          sizes="100"
          className="aspect-square w-full rounded-b-2xl  object-cover"
        />
      </div>

      <CardHeader className="mt-2">
        <CardTitle>
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight text-balance">
            {event.name}
          </h1>
        </CardTitle>
        <CardDescription>
          Technology group and play a vital function on one of two Apple teams
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
              <p className="font-bold">Limited to 300 riders</p>
            </div>
          </div>

        </div>

        <Item className="bg-muted">

          <div className="inline-flex gap-3 items-center">
            <Ticket />
            <p className="cn-card-title cn-font-heading text-2xl tabular-nums">
              {formatMoney(Number(event.price))}
            </p>
          </div>

        </Item>
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
