import {getParticipantById} from "@/db/query/participant-query";
import {Avatar, AvatarFallback} from "@/components/ui/avatar";
import {EventDate} from "@/components/events/event-date";
import {formatQRData, generateQRCode} from "@/utils/qrcode";
import Image from "next/image";
import {MapPinIcon} from "lucide-react";

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

  const qrCodeUrl = await generateQRCode(formatQRData({ registrationId: String(participant.id) }))

  const initials = participant.user.name
    ?.split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-4 sm:p-12">
      <div className="w-full max-w-sm">

        {/* Ticket body — no overflow-hidden so cutout circles can bleed out */}
        <div className="rounded-3xl bg-card shadow-xl ring-1 ring-foreground/10">

          {/* Header */}
          <div className="rounded-t-3xl bg-foreground px-6 py-8 text-background">
            <p className="text-xs font-semibold uppercase tracking-widest opacity-60">
              Event
            </p>
            <h1 className="mt-1 text-2xl font-bold leading-tight">
              {participant.event?.name}
            </h1>
            {participant.event?.startDate && (
              <p className="mt-2 flex items-center gap-2 text-sm opacity-70">
                <EventDate eventDate={participant.event.startDate} type="date" />
                <span>·</span>
                <EventDate eventDate={participant.event.startDate} type="time" />
              </p>
            )}
            {participant.event?.locationName && (
              <p className="mt-1 flex items-center gap-1 text-sm opacity-70">
                <MapPinIcon className="size-3.5 shrink-0" />
                {participant.event.locationName}
              </p>
            )}
          </div>

          {/* Perforated divider */}
          <div className="relative flex items-center overflow-visible">
            <div className="absolute -left-4 z-10 size-8 rounded-full bg-muted" />
            <div className="w-full border-t-2 border-dashed border-border" />
            <div className="absolute -right-4 z-10 size-8 rounded-full bg-muted" />
          </div>

          {/* Participant info */}
          <div className="flex items-center gap-4 px-6 py-6">
            <Avatar className="size-14 shrink-0 text-xl">
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-lg font-bold">{participant.user.name}</p>
              <p className="truncate text-sm text-muted-foreground">{participant.user.email}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 border-t px-6 py-5">
            <StatBlock label="Bib" value={participant.bibNumber} />
            <StatBlock label="Jersey" value={participant.jerseySize} />
            <StatBlock label="Category" value={participant.category?.name} />
          </div>

          {/* Perforated divider */}
          <div className="relative flex items-center overflow-visible">
            <div className="absolute -left-4 z-10 size-8 rounded-full bg-muted" />
            <div className="w-full border-t-2 border-dashed border-border" />
            <div className="absolute -right-4 z-10 size-8 rounded-full bg-muted" />
          </div>

          {/* QR code */}
          <div className="flex flex-col items-center gap-3 rounded-b-3xl px-6 py-6">
            <div className="rounded-xl border bg-white p-3">
              <Image src={qrCodeUrl} alt="Participant QR code" width={160} height={160} />
            </div>
            <p className="text-center text-xs text-muted-foreground">
              Show this at the race kit pickup booth
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}