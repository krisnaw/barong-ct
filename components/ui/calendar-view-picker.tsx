"use client"

import * as React from "react"

import {Calendar} from "@/components/ui/calendar"

interface Props {
  defaultValue? : Date | undefined
}

export function CalendarViewPicker({ defaultValue }: Props) {
  const [date, setDate] = React.useState<Date | undefined>( defaultValue ? new Date(defaultValue) : new Date())

  console.log("CalendarViewPicker", date)

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      className="rounded-md border shadow-sm md:max-w-sm"
      captionLayout="dropdown"
    />
  )
}
