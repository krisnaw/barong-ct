'use client'

import {EventGroupType, EventOrderType, EventType} from "@/db/schema";
import {useParams, useRouter, useSearchParams} from "next/navigation";
import {Label} from "@/components/ui/label";
import {SearchGroupInput} from "@/components/checkout/search-group-input";
import {createGroupAction} from "@/app/actions/event-group/event-group.action";
import {useActionState, useEffect, useState} from "react";
import {Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle} from "@/components/ui/item";
import {CirclePile} from "lucide-react";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {initialState} from "@/types/types";
import {createOrderAction, updateOrderAction} from "@/app/actions/event-order/event-order.action";
import {toast} from "sonner";
import {Separator} from "@radix-ui/react-menu";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {Field, FieldContent, FieldLabel, FieldTitle} from "@/components/ui/field";
import {Spinner} from "@/components/ui/spinner";
import {SizeChart} from "@/components/checkout/size-chart";

export function CategorySelection({event, groups, order}: {
  event: EventType & { participantCount: number },
  groups: EventGroupType[],
  order?: EventOrderType | null
}) {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const eventId = params.id;

  const [group, setGroup] = useState<string | undefined>(order?.groupId  ? String(order.groupId) :  undefined);

  const [jerseyGender, setJerseyGender] = useState<string>(order?.jerseyGender ?? "");
  const [jerseySize, setJerseySize] = useState<string>(order?.jerseySize ?? "");

  const [availableGroup, setAvailableGroup] = useState<EventGroupType[]>(groups)
  const [selectedGroup, setSelectedGroup] = useState<EventGroupType>()

  console.log("selectedGroup", selectedGroup)

  const router = useRouter();

  useEffect(() => {

    const abortController = new AbortController();
    const signal = abortController.signal;

    if (group) {

      const fetchGroup = async () => {
        try {
          const response = await fetch(`/api/event/group/${group}`, {signal})
          const data = await response.json();
          setSelectedGroup(data.group)
        } catch (error) {
          if (error instanceof Error) {
            if (error.name === 'AbortError') {
              return; // Ignore abort error
            }
          }
          console.error('Fetch error:', error);
        }
      }

      fetchGroup()

      return () => {
        abortController.abort()
      }

    }
  }, [group]);

  async function handleCreate(value: string) {
    const res = await createGroupAction({
      name: value,
      eventId: Number(eventId),
    })

    if (res.success && res.data) {
      setGroup(res.data as string)
    }
  }

  function onSelectHandler(item: EventGroupType) {
    setGroup(String(item.id))
    setSelectedGroup(item)
  }

  const [state, formAction, isPending] = useActionState(async () => {

    const payload = {
      userId: order ? order.userId : "",
      eventId: Number(eventId),
      groupId: Number(group),
      jerseyGender: jerseyGender,
      jerseySize: jerseySize,
      price: event.price,
      currency: event.currency,
    }

    const res = order ? await updateOrderAction(order) : await createOrderAction(payload)

    if (res.success) {
      if (res.data) {
        const newParam = new URLSearchParams(searchParams);
        newParam.set('order', String(res.data))
        router.push(`/event/${eventId}/profile?${newParam}`)
      }
    } else {
      toast.error(res.message)
    }
    return res;

  }, initialState)

  return (
    <form action={formAction}>
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
                <SearchGroupInput eventId={Number(eventId)}
                                  availableGroups={availableGroup}
                                  onSelectGroup={(group: EventGroupType) => onSelectHandler(group)}
                                  onCreate={(value: string) => handleCreate(value)}
                                 />
              </div>

            </div>

            {selectedGroup && (
              <div>
                <Item variant="outline">
                  <ItemMedia variant="icon">
                    <CirclePile />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle className="font-bold text-lg">
                      {selectedGroup.name}
                    </ItemTitle>
                    <ItemDescription className="line-clamp-none">
                      <ul className="grid grid-cols-2 ">
                        <li>Name</li>

                        <li>Name</li>

                        <li>Name</li>

                        <li>Name</li>

                        <li>Name</li>
                      </ul>
                    </ItemDescription>
                  </ItemContent>
                  <ItemActions>
                    <ItemDescription>
                      4/5
                    </ItemDescription>
                  </ItemActions>
                </Item>
              </div>
            )}
          </div>

          <Separator className="py-4"/>

          {selectedGroup && (
            <>

              <div>
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
          <Button type="submit" className="w-full" disabled={(!group || !jerseySize) || isPending}>
            {isPending ? <Spinner /> : null}
            Continue
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}

const gender = [
  {id: "male", name: "Male"},
  {id: "female", name: "Female"},
]
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