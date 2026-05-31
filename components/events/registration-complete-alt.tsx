import {CheckCircle2Icon, CircleUserIcon, Link2Icon, UsersIcon} from "lucide-react";
import {Badge} from "@/components/ui/badge";
import {InviteItem} from "@/app/(home)/event/[id]/invite-item";
import {EventQr} from "@/components/events/event-qr";
import type {getOnGoingParticipant} from "@/db/query/participant-query";
import type {getPaymentByParticipant} from "@/db/query/event-payment.query";
import type {getGroupById} from "@/db/query/event-group.query";
import {EventDate} from "@/components/events/event-date";

type Props = {
  eventId: number
  isGroupRide: number | null
  participant: NonNullable<Awaited<ReturnType<typeof getOnGoingParticipant>>>
  payment?: Awaited<ReturnType<typeof getPaymentByParticipant>>
  group?: Awaited<ReturnType<typeof getGroupById>>
}

function StatBlock({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</span>
      <span className="text-lg font-bold tracking-tight uppercase sm:text-2xl">{value ?? "—"}</span>
    </div>
  )
}

export function RegistrationCompleteAlt({ eventId, isGroupRide, participant, payment, group }: Props) {
  const groupFull = isGroupRide && group && group.participants.length >= isGroupRide

  return (
    <div className="rounded-2xl border bg-card overflow-hidden">

      {/* Success header */}
      <div className="flex items-center gap-3 bg-green-50 px-5 py-4 border-b border-green-200">
        <CheckCircle2Icon className="size-5 shrink-0 text-green-500" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-green-800">Registration confirmed</p>
          {payment && (
            <>
              <p className="text-xs text-green-600 uppercase tracking-wide">{payment.invoiceNumber}</p>
              <p className="text-xs text-green-600 capitalize">
                Paid on <EventDate eventDate={payment.updatedAt} type="date" />
              </p>
            </>
          )}
        </div>
      </div>

      {/* Stat blocks */}
      <div className="grid grid-cols-2 gap-4 px-5 py-4 border-b sm:grid-cols-3">
        <StatBlock label="Bib" value={participant.bibNumber} />
        <StatBlock label="Jersey" value={participant.jerseySize} />
        <div className="col-span-2 sm:col-span-1">
          <StatBlock label="Category" value={participant.category?.name} />
        </div>
      </div>

      {/* Group ride */}
      {group && (
        <>
          {/* Group header */}
          <div className="flex items-center justify-between px-5 py-3 border-b">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <UsersIcon className="size-4 text-muted-foreground" />
              {group.name}
            </div>
            <Badge variant="outline">
              {group.participants.length}{isGroupRide ? `/${isGroupRide}` : ""} members
            </Badge>
          </div>

          {/* Member list */}
          <div className="divide-y">
            {group.participants.map((p) => (
              <div key={p.id} className="flex items-center gap-3 px-5 py-3">
                <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted">
                  <CircleUserIcon className="size-4 text-muted-foreground" />
                </div>
                <span className="flex-1 text-sm font-medium truncate">{p.user.name}</span>
                <div className="flex items-center gap-1.5">
                  {p.jerseySize && (
                    <Badge variant="secondary" className="uppercase text-xs">
                      {p.jerseySize}
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-xs font-mono">
                    {p.bibNumber ?? "—"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>

          {/* Invite link */}
          {!groupFull && participant.categoryId && (
            <div className="border-t px-5 py-4">
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                <Link2Icon className="size-3.5" />
                Invite link
              </div>
              <InviteItem
                eventId={eventId}
                categoryId={participant.categoryId}
                groupId={group.id}
                groupName={group.name}
              />
            </div>
          )}
        </>
      )}

      {/* QR code */}
      <div className="border-t">
        <EventQr participant={participant} />
      </div>

    </div>
  )
}
