import {getParticipantById} from "@/db/query/participant-query";
import {EventDate} from "@/components/events/event-date";
import Image from "next/image";

function StatBlock({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      <span className="text-2xl font-bold tracking-tight uppercase">
        {value ?? "—"}
      </span>
    </div>
  )
}

export default async function Page({params}: { params: Promise<{ id: number }> }) {
  const {id} = await params
  const participant = await getParticipantById(Number(id))
  if (!participant) return null

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-4 sm:p-12">
      <div className="w-full max-w-sm">

        {/* Ticket body — no overflow-hidden so cutout circles can bleed out */}
        <div className="rounded-3xl bg-card shadow-xl ring-1 ring-foreground/10">

          {/* Header */}
          <div className="relative rounded-t-3xl overflow-hidden">
            {participant.event?.feature_image ? (
              <Image
                src={participant.event.feature_image}
                alt={participant.event.name ?? "Event"}
                width={640}
                height={320}
                className="h-44 w-full object-cover"
              />
            ) : (
              <div className="h-44 w-full bg-foreground" />
            )}
            {/* Overlay with event info */}
            <div className="absolute inset-0 bg-linear-to-t from-black via-black/60 to-black/10 px-6 pb-6 flex flex-col justify-end text-white">
              <p className="text-xs font-semibold uppercase tracking-widest opacity-60">
                Event
              </p>
              <h1 className="mt-1 text-2xl font-bold leading-tight">
                {participant.event?.name}
              </h1>
            </div>
          </div>

          {/* Perforated divider */}
          <div className="relative flex items-center overflow-visible">
            <div className="absolute -left-2.5 z-10 size-5 rounded-full bg-muted" />
            <div className="w-full border-t-2 border-dashed border-border" />
            <div className="absolute -right-2.5 z-10 size-5 rounded-full bg-muted" />
          </div>

          {/* Participant name */}
          <div className="px-6 pt-6 pb-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Participant</p>
            <p className="mt-0.5 text-lg font-bold">{participant.user.name}</p>
          </div>

          {/* Event details */}
          <div className="grid grid-cols-2 gap-4 border-t px-6 pt-4 pb-4">
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Date</span>
              <span className="text-sm font-semibold"><EventDate eventDate={participant.event!.startDate} type="date" /></span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Time</span>
              <span className="text-sm font-semibold"><EventDate eventDate={participant.event!.startDate} type="time" /></span>
            </div>
            <div className="col-span-2 flex flex-col gap-0.5">
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Location</span>
              <span className="text-sm font-semibold">{participant.event?.locationName ?? "—"}</span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 border-t px-6 py-5 rounded-b-3xl">
            <StatBlock label="Bib" value={participant.bibNumber} />
            <StatBlock label="Jersey" value={participant.jerseySize} />
            <StatBlock label="Category" value={participant.category?.name} />
          </div>


        </div>
      </div>
    </div>
  )
}