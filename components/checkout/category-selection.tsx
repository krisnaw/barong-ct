'use client'

import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {EventCategoryType, EventGroupType, EventOrderType} from "@/db/schema";
import {useQueryState} from "nuqs";
import {useParams, useRouter, useSearchParams} from "next/navigation";
import {Label} from "@/components/ui/label";
import {SearchGroupInput} from "@/components/checkout/search-group-input";
import {createGroupAction} from "@/app/actions/event-group/event-group.action";
import {useActionState, useEffect, useState} from "react";
import {Item, ItemContent, ItemMedia, ItemTitle} from "@/components/ui/item";
import {BadgeCheckIcon} from "lucide-react";
import {Card, CardContent, CardFooter} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {initialState} from "@/types/types";
import {createOrderAction} from "@/app/actions/event-order/event-order.action";
import {toast} from "sonner";

export function CategorySelection({categories, order}: { categories: EventCategoryType[], order?: EventOrderType | null }) {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const eventId = params.id;
  const [category, setCategory] = useQueryState('category', { defaultValue: order ? String(order.categoryId) : "", shallow: true});
  const [group, setGroup] = useQueryState('group', {defaultValue: order ? String(order.groupId) : "",  shallow: true});
  const [availableGroup, setAvailableGroup] = useState<EventGroupType[]>()
  const [selectedGroup, setSelectedGroup] = useState<EventGroupType>()
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
          console.error(error);
        }
      }

      fetchGroup()

      return () => {
        abortController.abort()
      }

    }
  }, [group]);

  async function onSearchHandler(value: string) {
    try {
      const newParam = new URLSearchParams(searchParams);
      newParam.set("name", value)
      newParam.set("category", String(category))
      const response = await fetch(`/api/event/${eventId}?${newParam}`, {
        method: 'GET',
      })

      if (!response.ok) {
        console.log(`Response status: ${response.status}`);
      }

      const result = await response.json();
      setAvailableGroup(result.groups)

    } catch (error) {
      console.error(error);
    }
  }

  async function handleCreate(value: string) {
    setGroup('1')
    const res = await createGroupAction({
      name: value,
      eventId: Number(eventId),
      eventCategoryId: Number(category),
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
      eventId: Number(eventId),
      categoryId: Number(category),
      groupId: Number(group),
    }

    const res = await createOrderAction(payload)
    if (res.success) {
      if(res.data) {
        const newParam = new URLSearchParams(searchParams);
        newParam.set('order', String(res.data))
        newParam.set('category', String(category))
        newParam.set('group', String(group))
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
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label>Category</Label>
              <div className="mt-2">
                <Select value={category || ""} onValueChange={(id) => setCategory(id)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select category"/>
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem value={String(category.id)} key={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

            </div>

            {category && (
              <div className="space-y-4">

                <div>
                  <Label>Group</Label>
                  <div className="mt-2">
                    <SearchGroupInput eventId={Number(eventId)}
                                      availableGroups={availableGroup}
                                      onSelectGroup={(group: EventGroupType) => onSelectHandler(group)}
                                      onCreate={(value: string) => handleCreate(value)}
                                      onSearch={(value: string) => onSearchHandler(value)}/>
                  </div>

                </div>

                {selectedGroup && (
                  <div>
                    <Item variant="outline">
                      <ItemMedia>
                        <BadgeCheckIcon className="size-5" />
                      </ItemMedia>
                      <ItemContent>
                        <ItemTitle>{selectedGroup.name}</ItemTitle>
                      </ItemContent>
                    </Item>
                  </div>

                )}
              </div>
            )}

          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={!group && !category || isPending}>
            Continue
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}