'use client'

import {EventOrderType, EventType, GroupWithParticipant} from "@/db/schema";
import {useParams, useRouter, useSearchParams} from "next/navigation";
import {Label} from "@/components/ui/label";
import {useActionState, useState} from "react";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {initialState} from "@/types/types";
import {updateOrderAction} from "@/app/actions/event-order/event-order.action";
import {toast} from "sonner";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {Field, FieldContent, FieldLabel, FieldTitle} from "@/components/ui/field";
import {Spinner} from "@/components/ui/spinner";
import {SizeChart} from "@/components/checkout/size-chart";
import {GroupItem} from "@/components/group/group-item";
import {SimpleGroupInput} from "@/components/checkout/simple-group-input";
import {createGroupAction} from "@/app/actions/event-group/event-group.action";

export function CategorySelection({event, groups, order}: {
  event: EventType & { participantCount: number },
  groups: GroupWithParticipant[],
  order: EventOrderType
}) {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const eventId = params.id;

  const [jerseySize, setJerseySize] = useState<string>(order?.jerseySize ?? "");

  const [availableGroup] = useState<GroupWithParticipant[]>(groups)
  const [selectedGroup, setSelectedGroup] = useState<GroupWithParticipant | null>(() => {
    if (!order) return null;
    return availableGroup.find(group => group.id === order.groupId) || null;
  });

  const router = useRouter();

  async function handleCreate(value: string) {
    if (!value) return;
    const res = await createGroupAction({
      name: value,
      eventId: Number(eventId),
      orderId: order.id
    })

    console.log(res)

    if (res.success && res.data) {
      const newParam = new URLSearchParams(searchParams);
      // @ts-ignore
      newParam.set('group', String(res.data.id))
      router.push(`/event/${eventId}/category?${newParam}`)
      toast.success(res.message);
    }
  }

  function onSelectHandler(group: GroupWithParticipant) {
    setSelectedGroup(group)
  }

  const [state, formAction, isPending] = useActionState(async () => {

    const newPayload = {
      ...order,
      status: "group",
      jerseySize: jerseySize,
      groupId: Number(selectedGroup?.id),
    }

    const res = await updateOrderAction(newPayload)

    if (res.success) {
      if (res.data) {
        const newParam = new URLSearchParams(searchParams);
        router.push(`/event/${eventId}/profile?${newParam}`)
      }
    } else {
      toast.error("this toas is clicked")
      toast.error(res.message)
    }
    return res;

  }, initialState)

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Step 1: Group Ride and Jersey Size.
        </CardTitle>
        <CardDescription>
          Search or Create Group Ride and select your jersey size.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">

          <div>
            <Label>Group Ride</Label>
            <div className="mt-2">
              <SimpleGroupInput existingGroups={availableGroup} onCreate={(value: string) => handleCreate(value)} />
            </div>

          </div>

          {selectedGroup && (
            <div>
              <Label>Selected Group Ride</Label>
              <div className="mt-2">
                <GroupItem group={selectedGroup} />
              </div>
            </div>
          )}
        </div>


        {selectedGroup && (
          <>


            <div className="mt-6">
              <div>
                <div className="flex justify-between">
                  <Label>Jersey</Label>
                  <SizeChart />
                </div>

                <div className="mt-4">

                  <RadioGroup onValueChange={(value) => setJerseySize(value)}
                              defaultValue={jerseySize || ""}
                              className="mt-4 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
                    {sizes.map((size) => (
                      <FieldLabel key={size.id} htmlFor={size.id}>
                        <Field orientation="horizontal">
                          <FieldContent>
                            <FieldTitle>{size.name}</FieldTitle>
                          </FieldContent>
                          <RadioGroupItem value={size.id} id={size.id}/>
                        </Field>
                      </FieldLabel>
                    ))}
                  </RadioGroup>
                </div>

              </div>
            </div>

          </>
        )}


      </CardContent>
      <CardFooter>
        <form action={formAction} className="w-full">
          <Button type="submit" className="w-full" disabled={(!selectedGroup || !jerseySize) || isPending}>
            {isPending ? <Spinner /> : null}
            Continue
          </Button>
        </form>

      </CardFooter>
    </Card>
  )
}

const sizes = [
  // ASIA Sizing
  { id: 'xxs', name: 'XXS' },
  { id: 'xs', name: 'XS' },
  { id: 's', name: 'S' },
  { id: 'm', name: 'M' },
  { id: 'l', name: 'L' },
  { id: 'xl', name: 'XL' },
  { id: 'xxl', name: 'XXL' },
  { id: '3xl', name: '3XL' },
  { id: '4xl', name: '4XL' },
  { id: '5xl', name: '5XL' },
  { id: '6xl', name: '6XL' },

  // INTERNATIONAL Sizing
  { id: 'is', name: 'iS' },
  { id: 'im', name: 'iM' },
  { id: 'il', name: 'iL' },
  { id: 'ixl', name: 'iXL' },
  { id: 'ixxl', name: 'iXXL' },
  { id: 'i3xl', name: 'i3XL' },
  { id: 'i4xl', name: 'i4XL' },
  { id: 'i5xl', name: 'i5XL' },
  { id: 'i6xl', name: 'i6XL' }
];