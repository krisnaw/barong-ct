"use client"

import * as React from "react"
import {useEffect} from "react"
import {ChevronDownIcon} from "lucide-react"

import {Button} from "@/components/ui/button"
import {Calendar} from "@/components/ui/calendar"
import {Popover, PopoverContent, PopoverTrigger,} from "@/components/ui/popover"

interface CustomDatePickerProps {
  value?: Date;
}

export function CustomDatePicker({ value = new Date() }: CustomDatePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [date, setDate] = React.useState<Date>(value)
  const [timeZone, setTimeZone] = React.useState<string | undefined>(undefined)

  useEffect(() => {
    setTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone)
  }, [])

  return (
    <>
      <input className="hidden" name="date" id="date" type="text" defaultValue={date.toLocaleDateString()}  />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date"
            className="w-48 justify-between font-normal"
          >
            {date ? date.toLocaleDateString() : "Select date"}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            timeZone={timeZone}
            mode="single"
            selected={date}
            captionLayout="dropdown"

            onSelect={(date) => {
              if (!date) return
              setDate(date)
              setOpen(false)
            }}
          />
        </PopoverContent>
      </Popover>
    </>
  )
}
