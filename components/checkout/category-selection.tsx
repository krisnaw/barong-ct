'use client'

import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {EventCategoryType, EventGroupType} from "@/db/schema";
import {useQueryState} from "nuqs";
import {useParams, useRouter, useSearchParams} from "next/navigation";
import {Label} from "@/components/ui/label";
import {SearchGroupInput} from "@/components/checkout/search-group-input";
import {createGroupAction} from "@/app/actions/event-group/event-group.action";
import {useEffect, useState} from "react";
import {Item, ItemContent, ItemMedia, ItemTitle} from "@/components/ui/item";
import {BadgeCheckIcon} from "lucide-react";
import {Card, CardContent, CardFooter} from "@/components/ui/card";
import {Button} from "@/components/ui/button";

export function CategorySelection({categories}: { categories: EventCategoryType[] }) {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const eventId = params.id;
  const [category, setCategory] = useQueryState('category', {shallow: true});
  const [group, setGroup] = useQueryState('group', {shallow: true});
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

  function onClickContinue() {
    // store order
    router.push(`/event/${eventId}/profile?${searchParams.toString()}`)
  }

  return (
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
        <Button onClick={onClickContinue} className="w-full" disabled={!group && !category}>
          Continue
        </Button>
      </CardFooter>
    </Card>
  )
}