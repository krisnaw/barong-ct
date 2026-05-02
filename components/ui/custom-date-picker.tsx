"use client"

import * as React from "react"
import {useEffect} from "react"
import {ChevronDownIcon} from "lucide-react"

import {Button} from "@/components/ui/button"
import {Calendar} from "@/components/ui/calendar"
import {Popover, PopoverContent, PopoverTrigger,} from "@/components/ui/popover"
import {format} from "date-fns";

interface CustomDatePickerProps {
  name?: string
  value?: Date;
}

export function CustomDatePicker({ name = "date", value = new Date() }: CustomDatePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [date, setDate] = React.useState<Date | undefined>(value)
  const [timeZone, setTimeZone] = React.useState<string | undefined>(undefined)

  useEffect(() => {
    setTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone)
  }, [])

  return (
    <>
      <input className="hidden" name={name} id={name} type="text" defaultValue=""  />
      <Popover>
        <PopoverTrigger render={<Button variant={"outline"} data-empty={!date} className="w-53 justify-between text-left font-normal data-[empty=true]:text-muted-foreground">{date ? format(date, "PPP") : <span>Pick a date</span>}<ChevronDownIcon data-icon="inline-end" /></Button>} />
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-lg border"
          />
        </PopoverContent>
      </Popover>
    </>
  )
}
