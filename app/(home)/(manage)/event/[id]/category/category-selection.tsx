'use client'

import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {EventCategoryType} from "@/db/schema";
import {useQueryState} from "nuqs";
import {useParams, useRouter} from "next/navigation";

export function CategorySelection({categories} : {categories : EventCategoryType[]}) {
  const params = useParams<{ id: string;}>();
  const eventId = params.id as string;
  const [category, setCategory] = useQueryState('category', { shallow: true });
  const router = useRouter();
  function onChangeHandler(id : string) {
    setCategory(id).then(r => {
      router.push(`/event/${eventId}/group`)
    })
  }
  return (
    <>
      <Select value={category || ""} onValueChange={onChangeHandler}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select category" />
        </SelectTrigger>
        <SelectContent>
          {categories.map(category => (
            <SelectItem value={String(category.id)} key={category.id}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  )
}