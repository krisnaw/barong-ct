import * as React from "react";
import {EventType} from "@/db/schema";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import Image from "next/image";
import {buttonVariants} from "@/components/ui/button";
import Link from "next/link";
import {EventCardDetail} from "@/components/events/event-card-detail";

type Props = {
  event: EventType,
}

export function EventCard({event}: Props) {
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
        <EventCardDetail event={event} />
      </CardContent>
      <CardFooter>
        <Link href={`/event/${event.id}`} prefetch={true}
              className={`${buttonVariants({variant: "default", size: "lg"})} w-full uppercase`}>
          See details
        </Link>
      </CardFooter>
    </Card>
  )
}
