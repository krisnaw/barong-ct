'use client'

import {EventCategoryType, EventGroupType, EventType, InsertGroupType, InsertParticipantType} from "@/db/schema";
import {useRouter, useSearchParams} from "next/navigation";
import {useActionState} from "react";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {ActionResponse, initialState} from "@/types/types";
import {toast} from "sonner";
import {Spinner} from "@/components/ui/spinner";
import {SizeChart} from "@/components/checkout/size-chart";
import {InputGroupField} from "./input-group-field";
import {SelectCategoryField} from "@/components/checkout/select-category-field";
import {SelectJerseyField} from "@/components/checkout/select-jersey-field";
import {createParticipant} from "@/app/actions/event-participant/event-participant.action";
import {PARTICIPANT_STATUS} from "@/utils/event.helper";
import {createGroupAction} from "@/app/actions/event-group/event-group.action";

type Props = {
  event: EventType,
  userId: string
  categories: EventCategoryType[],
  groups: EventGroupType[]
}

export function StepGroup({event, userId, categories, groups}: Props) {
  const router = useRouter();
  const eventId = event.id
  const searchParams = useSearchParams();
  const categoryId = searchParams.get('category') ?? null;
  const jerseySize = searchParams.get('jersey') ?? "";
  const groupName = searchParams.get('group') ?? null;
  const groupId = searchParams.get('groupId') ?? null;

  const [_, formAction, isPending] = useActionState(async (_: ActionResponse, formData: FormData) => {

    let newGroupId
    if (!groupId) {
      // 1. Create group
      const groupPayload : InsertGroupType = {
        eventId: eventId,
        name: groupName!
      }
      const group = await createGroupAction(groupPayload)
      newGroupId = group.data
    } else {
      newGroupId = groupId
    }


    const category : EventCategoryType | null = categories.find((cat) => cat.id === Number(categoryId)) ?? null

    // 2. Create participant
    const payload : InsertParticipantType = {
      userId: userId,
      eventId: eventId,
      categoryId: Number(categoryId),
      groupId: Number(newGroupId),
      jerseySize: jerseySize!,
      price: category?.price,
      serviceFee: category?.serviceFee,
      status: PARTICIPANT_STATUS.DRAFT
    }

    const res = await createParticipant(payload)
    // 3. Redirect to next step
    if (res.success) {
      toast.info(res.message)
      const newParam = new URLSearchParams(searchParams);
      router.push(`/event/${eventId}/register/profile?${newParam}`)
    } else {
      toast.error(res.message)
    }

    return res

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

          <SelectCategoryField eventId={eventId} categories={categories} groupId={groupId}/>

          {categoryId && (
            <div>
              <h2 className="cn-font-heading text-xs font-medium tracking-wider text-muted-foreground uppercase">
                Group Ride Name
              </h2>
              <div className="mt-2">
                <InputGroupField eventId={event.id} existingGroups={groups} groupId={groupId}/>
              </div>
            </div>
          )}
        </div>


        {groupName && (
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
          <Button type="submit" className="w-full" disabled={(!categoryId || !groupName || !jerseySize) || isPending}>
            {isPending ? <Spinner/> : null}
            Continue
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}

