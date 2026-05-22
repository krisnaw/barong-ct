'use client'

import {EventCategoryType} from "@/db/schema";
import {RadioGroup} from "@base-ui/react";
import {RadioGroupItem} from "@/components/ui/radio-group";
import {useRouter, useSearchParams} from "next/navigation";
import {Field, FieldContent, FieldDescription, FieldLabel, FieldTitle} from "@/components/ui/field";
import {formatMoney} from "@/utils/money-helper";

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
      <h2 className="cn-font-heading text-xs font-medium tracking-wider text-muted-foreground uppercase">Select
        Select category
      </h2>
      <div className="mt-2">
        <RadioGroup
          className="grid grid-cols-1 items-start gap-3 md:grid-cols-2 style-sera:grid-cols-1"
          defaultValue={selectedCategory} onValueChange={(value: string) => handleChange(value)}>
          {categories.map((category: EventCategoryType) => (
            <FieldLabel key={category.id} htmlFor={`option-${category.id}`}>
              <Field orientation="horizontal" className="pb-2.5">
                <RadioGroupItem value={String(category.id)} id={`option-${category.id}`}/>
                <FieldContent className="grid grid-cols-2 justify-between">
                  <div>
                    <FieldTitle>{category.name}</FieldTitle>
                    <FieldDescription>{category.description}</FieldDescription>
                  </div>
                  <div className="text-right">
                    {category.price ? formatMoney(category.price) : 0}
                  </div>
                </FieldContent>
              </Field>
            </FieldLabel>
          ))}
        </RadioGroup>
      </div>
    </div>
  )
}