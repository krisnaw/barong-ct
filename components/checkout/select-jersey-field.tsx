'use client'

import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {Field, FieldContent, FieldLabel, FieldTitle} from "@/components/ui/field";
import {useRouter, useSearchParams} from "next/navigation";

export function SelectJerseyField({eventId} : {eventId: number}) {
  const searchParams = useSearchParams();
  const jersey = searchParams.get('jersey') ?? "";
  const router = useRouter()

  const onChangeHandler = (value: string) => {
    const newParam = new URLSearchParams(searchParams);
    newParam.set('jersey', value)
    router.push(`/event/${eventId}/register/group?${newParam}`)
  }

  return (
    <RadioGroup
      value={jersey} onValueChange={(value: string) => onChangeHandler(value)}
      className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
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
  )
}

const sizes = [
  // ASIA Sizing
  {id: 'xxs', name: 'XXS'},
  {id: 'xs', name: 'XS'},
  {id: 's', name: 'S'},
  {id: 'm', name: 'M'},
  {id: 'l', name: 'L'},
  {id: 'xl', name: 'XL'},
  {id: 'xxl', name: 'XXL'},
  // {id: '3xl', name: '3XL'},
  // {id: '4xl', name: '4XL'},
  // {id: '5xl', name: '5XL'},
  // {id: '6xl', name: '6XL'},

  // // INTERNATIONAL Sizing
  // {id: 'is', name: 'iS'},
  // {id: 'im', name: 'iM'},
  // {id: 'il', name: 'iL'},
  // {id: 'ixl', name: 'iXL'},
  // {id: 'ixxl', name: 'iXXL'},
  // {id: 'i3xl', name: 'i3XL'},
  // {id: 'i4xl', name: 'i4XL'},
  // {id: 'i5xl', name: 'i5XL'},
  // {id: 'i6xl', name: 'i6XL'}
];