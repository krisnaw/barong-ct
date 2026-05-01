import {EventType} from "@/db/schema";
import Image from "next/image";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {ArrowRight, CalendarDays, MapPin} from "lucide-react";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Item, ItemContent} from "@/components/ui/item";
import {EventDate} from "@/components/events/event-date";
import * as React from "react";

export function ListItemEvent({event}: { event: EventType & { participantCount?: number } }) {
  return (
    <div className="gap-4">
      <Card className="cn-card group/card flex flex-col relative w-full overflow-hidden pt-0">
        <div className="h-64 overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1650804068570-7fb2e3dbf888?q=80&w=640&auto=format&fit=crop"
            alt="Valeria Reverdo on Unsplash"
            width={128}
            height={128}
            sizes="100"
            className="aspect-square w-full  object-cover"
          />
        </div>

        <CardHeader>
          <CardTitle>
            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
              {event.name}
            </h4>
          </CardTitle>
          <CardDescription>
            Technology group and play a vital function on one of two Apple teams
          </CardDescription>
        </CardHeader>

        <CardContent>

          <div className="flex justify-between mb-4">

            <div className="flex">
              <div className="mr-4 shrink-0">
                <div className="flex size-10 items-center justify-center rounded-lg  outline outline-foreground/10">
                  <CalendarDays size={24} className="text-muted-foreground"/>
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

            <div className="flex">
              <div className="mr-4 shrink-0">
                <div className="flex size-10 items-center justify-center rounded-lg  outline outline-foreground/10">
                  <MapPin size={24} className="text-muted-foreground"/>
                </div>
              </div>
              <div>
                <p className="font-bold">SANA by NUMA</p>
                <p className="text-sm font-semibold text-muted-foreground">Kabupaten Badung, Bali</p>
              </div>
            </div>

          </div>

          <Item variant="muted">
            <ItemContent>
              <small className="text-base leading-none font-bold">
                Limited to 300 riders
              </small>
            </ItemContent>

            <p className="text-lg font-semibold tabular-nums">
              Rp1.450.000
            </p>
          </Item>
        </CardContent>


        
        <CardFooter>
          <Button variant="default" className="w-full">
            <Link href={`/event/${event.id}`} className="inline-flex items-center gap-2">
              View event <ArrowRight />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}