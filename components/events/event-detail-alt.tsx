import Image from "next/image";
import {CalendarIcon, ClockIcon, MapPinIcon} from "lucide-react";
import {Separator} from "@/components/ui/separator";
import {formatMoney} from "@/utils/money-helper";
import {EventWithDetail} from "@/db/query/event-query";
import {formatEventDate, formatEventTime} from "@/types/date-helper";

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
    </div>
  )
}

export function EventDetailAlt({event, children} : {event: EventWithDetail, children?: React.ReactNode}) {

  const dateLabel = formatEventDate(event.startDate)
  const timeLabel = formatEventTime(event.startDate)

  return (
    <div className="overflow-hidden rounded-3xl bg-card shadow-sm ring-1 ring-foreground/10">

      {/* Hero image */}
      <div className="relative h-52 w-full">
        <Image
          src={event.feature_image!}
          alt={event.name}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between p-5">
          <h1 className="text-3xl lg:text-5xl font-bold leading-tight text-white">{event.name}</h1>
          {/* <Badge className="shrink-0 capitalize">{event.status}</Badge> */}
        </div>
      </div>

      {/* Info section */}
      <div className="space-y-4 p-5">
        <div className="grid gap-3 grid-cols-1">
          <div>
            <InfoRow
              icon={<CalendarIcon className="size-4" />}
              label="Date"
              value={dateLabel}
            />
          </div>
          <InfoRow
            icon={<ClockIcon className="size-4" />}
            label="Open Gate Time"
            value={timeLabel}
          />
          <div>
            <InfoRow
              icon={<MapPinIcon className="size-4" />}
              label="Location"
              value={event.locationName ?? "—"}
            />
          </div>
        </div>

        <Separator />

        {/* Categories */}
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Categories</p>
          <div className="space-y-2">
            {event.categories.map((cat) => (
              <div key={cat.id} className="flex items-center justify-between rounded-xl border bg-muted/40 px-4 py-3">
                <div>
                  <p className="text-sm font-semibold">{cat.name}</p>
                  {cat.description && (
                    <p className="text-xs text-muted-foreground">{cat.description}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">{cat.price ? formatMoney(cat.price) : "Free"}</p>
                  {/*{cat.maxParticipants && (*/}
                  {/*  <p className="text-xs text-muted-foreground">max {cat.maxParticipants} pax</p>*/}
                  {/*)}*/}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {children && (
        <div className="border-t px-5 py-4">
          {children}
        </div>
      )}

    </div>
  )
}
