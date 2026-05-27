import * as React from "react";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import Image from "next/image";
import {EventCardDetail} from "@/components/events/event-card-detail";
import {Item, ItemContent} from "@/components/ui/item";
import {EventWithDetail} from "@/db/query/event-query";
import {EventCategoryType} from "@/db/schema";
import {FieldContent, FieldDescription, FieldTitle} from "@/components/ui/field";
import {formatMoney} from "@/utils/money-helper";
import {SignupForm} from "@/components/signup-form";

type Props = {
  event: EventWithDetail,
  noSession?: boolean,
}

export function EventCard({event, noSession = false}: Props) {
  if (!event) return;
  return (
    <Card className="pt-0">
      <div className="relative h-56 w-full overflow-hidden">
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
        <EventCardDetail event={event}/>
        <div className="mt-6 grid w-full grid-cols-1 gap-3 md:grid-cols-2">
          {event.categories.map((category: EventCategoryType) => (
            <Item variant="outline" className="flex-col items-stretch" key={category.id}>
              <ItemContent className="gap-1">
                <FieldContent className="grid grid-cols-2 justify-between">
                  <div>
                    <FieldTitle>{category.name}</FieldTitle>
                    <FieldDescription>{category.description}</FieldDescription>
                  </div>
                  <div className="text-right">
                    {category.price ? formatMoney(category.price) : 0}
                  </div>
                </FieldContent>
              </ItemContent>
            </Item>
          ))}
        </div>
      </CardContent>

      {noSession && (
        <CardFooter className="flex flex-col text-left">
          <div className="text-left font-semibold w-full mb-2 text-muted-foreground">
            Create an account to register for this event
          </div>
          <SignupForm />
        </CardFooter>
      )}
    </Card>
  )
}
