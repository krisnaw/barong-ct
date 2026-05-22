'use client'

import {Label} from "@/components/ui/label";
import {EventCategoryType} from "@/db/schema";
import {RadioGroup} from "@base-ui/react";
import {RadioGroupItem} from "@/components/ui/radio-group";
import {useRouter, useSearchParams} from "next/navigation";

export function SelectCategoryField({eventId, categories}: { eventId: number, categories: EventCategoryType[] }) {
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get('category') ?? "";
  const router = useRouter();

  const handleChange = (value: string) => {
    const newParam = new URLSearchParams(searchParams);
    newParam.set('category', value)
    router.push(`/event/${eventId}/register/group?${newParam}`)
  }

  return (
    <div>
      <Label htmlFor="create-group">Select category</Label>
      <div>
        <RadioGroup defaultValue={selectedCategory} onValueChange={(value: string) => handleChange(value)}>
          {categories.map((category: EventCategoryType) => (
            <div className="flex items-center gap-3" key={category.id}>
              <RadioGroupItem value={String(category.id)} id={`option-${category.id}`} />
              <Label htmlFor={`option-${category.id}`}>{category.name}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  )
}