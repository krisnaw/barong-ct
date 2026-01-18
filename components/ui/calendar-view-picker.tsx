"use client"

import * as React from "react"

import {Calendar} from "@/components/ui/calendar"

interface Props {
  defaultValue? : Date | undefined
}

export function CalendarViewPicker({ defaultValue }: Props) {
  const [date, setDate] = React.useState<Date | undefined>(defaultValue);

  return (
    <>
      <input className="hidden" name="date" id="date" type="text" defaultValue={date?.toLocaleDateString()}  />
      <Calendar
        mode="single"
        selected={date}
        onSelect={(date) => {
          if (!date) return
          setDate(date)
        }}
        defaultMonth={date}
        className="rounded-md border shadow-sm md:max-w-sm"
        captionLayout="dropdown"
      />
    </>
  )
}
