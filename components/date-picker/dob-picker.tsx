"use client"

import * as React from "react"
import {ChevronDownIcon} from "lucide-react"

import {Button} from "@/components/ui/button"
import {Calendar} from "@/components/ui/calendar"
import {Popover, PopoverContent, PopoverTrigger,} from "@/components/ui/popover"

interface CustomDatePickerProps {
  value?: Date
}

export function DobPicker({ value }: CustomDatePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [date, setDate] = React.useState<Date | undefined>(value ?? undefined)
  const [timeZone, setTimeZone] = React.useState<string | undefined>(undefined)

  return (
    <div>
      <input className="sr-only" required name="date" id="date" type="text" defaultValue={date ? date.toLocaleDateString() : undefined}  />
      <div>
        <Popover open={open} onOpenChange={setOpen} >
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="date"
              className="w-full justify-between font-normal"
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
              defaultMonth={date}
              onSelect={(date) => {
                if (!date) return
                setDate(date)
                setOpen(false)
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}
