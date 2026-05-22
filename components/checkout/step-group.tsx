'use client'

import {EventCategoryType, EventOrderType, EventType, GroupWithParticipant} from "@/db/schema";
import {useRouter, useSearchParams} from "next/navigation";
import {useActionState, useState} from "react";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {initialState} from "@/types/types";
import {updateOrderAction} from "@/app/actions/event-order/event-order.action";
import {toast} from "sonner";
import {Spinner} from "@/components/ui/spinner";
import {SizeChart} from "@/components/checkout/size-chart";
import {GroupItem} from "@/components/group/group-item";
import {InputGroupField} from "./input-group-field";
import {SelectCategoryField} from "@/components/checkout/select-category-field";
import {SelectJerseyField} from "@/components/checkout/select-jersey-field";

type Props = {
  event: EventType & { participantCount: number },
  categories: EventCategoryType[],
  groups: GroupWithParticipant[],
  order: EventOrderType
}

export function StepGroup({event, groups, categories, order}: Props) {
  const router = useRouter();
  const eventId = event.id
  const searchParams = useSearchParams();
  const categoryId = searchParams.get('category') ?? "";
  const jerseySize = order.jerseySize ?? searchParams.get('jersey') ?? "";
  const groupId = order.groupId ?? searchParams.get('group') ?? "";
  const [availableGroup] = useState<GroupWithParticipant[]>(groups)
  const selectedGroup = availableGroup.find((item) => item.id === order.groupId)
  const price = categories.find((cat) => cat.id === Number(categoryId))?.price ?? 0;

  const [_, formAction, isPending] = useActionState(async () => {

    const newPayload = {
      ...order,
      status: "group",
      categoryId: Number(categoryId),
      jerseySize: jerseySize,
      price: price,
      groupId: Number(groupId),
    }

    const res = await updateOrderAction(newPayload)

    if (res.success) {
      if (res.data) {
        const newParam = new URLSearchParams(searchParams);
        router.push(`/event/${eventId}/register/profile?${newParam}`)
      }
    } else {
      toast.error(res.message)
    }
    return res;

  }, initialState)

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Step 1: Category, Group & Jersey
        </CardTitle>
        <CardDescription>
          Select your ride category, set up your group details, and pick your jersey size to get started.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <SelectCategoryField eventId={eventId} categories={categories}/>
          <div>
            <h2 className="cn-font-heading text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Group Ride
            </h2>
            <div className="mt-2">
              {selectedGroup ?
                (
                  <GroupItem group={selectedGroup}/>
                ) :
                (
                  <InputGroupField eventId={event.id} orderId={order.id} existingGroups={availableGroup}/>
                )
              }
            </div>
          </div>
        </div>
        {selectedGroup && (
          <>
            <div className="mt-6">
              <div>
                <div className="flex justify-between">
                  <h2 className="cn-font-heading text-xs font-medium tracking-wider text-muted-foreground uppercase">
                    Jersey
                  </h2>
                  <SizeChart/>
                </div>
                <div className="mt-2">
                  <SelectJerseyField eventId={eventId} />
                </div>
              </div>
            </div>
          </>
        )}

      </CardContent>
      <CardFooter>
        <form action={formAction} className="w-full">
          <Button type="submit" className="w-full" disabled={(!categoryId || !groupId || !jerseySize) || isPending}>
            {isPending ? <Spinner/> : null}
            Continue
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}

