import * as React from "react";
import {EventType} from "@/db/schema";
import {EventDate} from "@/components/events/event-date";
import {formatMoney} from "@/utils/money-helper";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import Image from "next/image";
import {Item, ItemContent} from "@/components/ui/item";
import {Separator} from "@/components/ui/separator";
import {buttonVariants} from "@/components/ui/button";
import Link from "next/link";

type Props = {
  event: EventType,
}

export function EventCard({event} : Props) {
  return (
    <Card className="pt-0">
      <div className="relative h-56 w-full overflow-hidden shadow">
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
      </CardHeader>

      <CardContent>

        <Item variant="muted" className="flex-col items-stretch">
          <ItemContent className="gap-3">
            <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Dates
                </span>
              <span className="text-sm font-medium">
                 <EventDate eventDate={event.startDate} type="date"/>
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
            <Separator/>
            <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Participant
                </span>
              <span className="text-sm font-medium tabular-nums">
                Limited to {event.maxParticipants} riders
              </span>
            </div>
          </ItemContent>
        </Item>

        <Item className="mt-6">
          <div className="inline-flex gap-3 w-full justify-center items-center">
            {event.price ? (
              <p className="cn-card-title cn-font-heading text-2xl tabular-nums tracking-tight">
                {formatMoney(Number(event.price))}
              </p>
            ) : (
              <p className="cn-card-title cn-font-heading text-2xl tabular-nums">
                FREE
              </p>
            )}
          </div>
        </Item>

      </CardContent>
      <CardFooter>
        <Link href={`/event/${event.id}`} prefetch={true} className={`${buttonVariants({ variant: "default", size: "lg" })} w-full uppercase`}>
          See details
        </Link>
      </CardFooter>
    </Card>
  )
}
