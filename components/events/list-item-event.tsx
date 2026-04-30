import {EventType} from "@/db/schema";
import Image from "next/image";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {ArrowRight} from "lucide-react";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Item, ItemContent} from "@/components/ui/item";
import {EventDate} from "@/components/events/event-date";

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

        <CardContent>
          <Item variant="muted">
            <ItemContent>
              <small className="text-base leading-none font-bold">
                <EventDate eventDate={event.startDate} type="date"/>
              </small>
            </ItemContent>

            <p className="text-lg font-semibold tabular-nums">
              Rp1.450.000
            </p>
          </Item>
        </CardContent>

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