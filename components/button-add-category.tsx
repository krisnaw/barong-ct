'use client'
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Field} from "@/components/ui/field";
import {createCategoryAction} from "@/app/actions/event-category/event-category.action";

export function ButtonAddCategory({eventId} : {eventId: number}) {

  return (
    <form action={createCategoryAction}>
      <input type="hidden" name="eventId" value={eventId} />
      <Field orientation="horizontal">
        <Input name="name" type="text" placeholder="Category name" />
        <Button>Add Category</Button>
      </Field>
    </form>
  )
}
