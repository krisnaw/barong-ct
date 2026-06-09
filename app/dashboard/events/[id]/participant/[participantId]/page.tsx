import React from "react";
import {notFound} from "next/navigation";
import Link from "next/link";
import {ChevronLeft} from "lucide-react";
import {getParticipantDetail} from "@/db/query/participant-query";
import {getUserWithDetail} from "@/db/query/user-query";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {Separator} from "@/components/ui/separator";
import {buttonVariants} from "@/components/ui/button";
import {EventDate} from "@/components/events/event-date";
import {formatMoney} from "@/utils/money-helper";
import {BtnResendConfirm} from "@/components/button/btn-resend-confirm";
import {ButtonFixBibNumber} from "@/components/participant/button-fix-bib-number";
import {ButtonChangeParticipantStatus} from "@/components/participant/button-change-participant-status";
import {ButtonChangeJerseySize} from "@/components/participant/button-change-jersey-size";
import {PARTICIPANT_STATUS} from "@/utils/event.helper";

const STATUS_BADGE: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  [PARTICIPANT_STATUS.COMPLETED]: "default",
  [PARTICIPANT_STATUS.PENDING_PAYMENT]: "secondary",
  [PARTICIPANT_STATUS.DRAFT]: "outline",
  [PARTICIPANT_STATUS.PROFILE]: "outline",
}

const STATUS_LABELS: Record<string, string> = {
  [PARTICIPANT_STATUS.COMPLETED]: "Completed",
  [PARTICIPANT_STATUS.PENDING_PAYMENT]: "Pending Payment",
  [PARTICIPANT_STATUS.DRAFT]: "Draft",
  [PARTICIPANT_STATUS.PROFILE]: "Profile",
}

function Row({label, value}: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2">
      <span className="text-sm text-muted-foreground shrink-0">{label}</span>
      <span className="text-sm font-medium text-right">{value ?? "—"}</span>
    </div>
  )
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string; participantId: string }>
}) {
  const {id: eventId, participantId} = await params

  const participant = await getParticipantDetail(Number(participantId))
  if (!participant) notFound()

  const detail = await getUserWithDetail(participant.userId).then(u => u?.detail)
  const latestPayment = participant.payments[0]

  return (
    <div className="space-y-4">

      {/* Back + header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href={`/dashboard/events/${eventId}`}
            className={buttonVariants({variant: "ghost", size: "icon-sm"})}
          >
            <ChevronLeft />
          </Link>
          <div>
            <h1 className="text-xl font-bold leading-tight">{participant.user.name}</h1>
            <p className="text-sm text-muted-foreground">{participant.user.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={STATUS_BADGE[participant.status ?? ""] ?? "outline"}>
            {STATUS_LABELS[participant.status ?? ""] ?? participant.status}
          </Badge>
          {participant.bibNumber && (
            <Badge variant="outline" className="font-mono tabular-nums">
              #{participant.bibNumber}
            </Badge>
          )}
        </div>
      </div>

      {/* Action bar */}
      <Card>
        <CardContent className="flex flex-wrap gap-2 py-3">
          <BtnResendConfirm participantId={participant.id} />
          <ButtonFixBibNumber participantId={participant.id} currentBib={participant.bibNumber} />
          <ButtonChangeJerseySize participantId={participant.id} currentSize={participant.jerseySize} />
          <ButtonChangeParticipantStatus participantId={participant.id} currentStatus={participant.status ?? ""} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* LEFT: Profile + emergency */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
            </CardHeader>
            <CardContent className="divide-y">
              <Row label="Phone" value={detail?.phoneNumber} />
              <Row label="Gender" value={detail?.gender && <span className="capitalize">{detail.gender}</span>} />
              <Row label="Blood type" value={detail?.bloodType} />
              <Row label="Date of birth" value={detail?.dateOfBirth} />
              <Row label="Nationality" value={detail?.nationality} />
              <Row label="City" value={detail?.city} />
              <Row label="Province" value={detail?.province} />
              <Row label="Club" value={detail?.clubName} />
              {detail?.instagram && (
                <Row label="Instagram" value={`@${detail.instagram}`} />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Emergency Contact</CardTitle>
            </CardHeader>
            <CardContent className="divide-y">
              <Row label="Name" value={detail?.emergencyContactName} />
              <Row label="Phone" value={detail?.emergencyContactNumber} />
            </CardContent>
          </Card>
        </div>

        {/* RIGHT: Registration + pricing + payment */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Registration</CardTitle>
            </CardHeader>
            <CardContent className="divide-y">
              <Row label="Event" value={participant.event?.name} />
              <Row label="Category" value={participant.category?.name} />
              <Row label="Group" value={participant.group?.name} />
              <Row
                label="Jersey size"
                value={participant.jerseySize && <span className="uppercase">{participant.jerseySize}</span>}
              />
              <Row label="Bib number" value={participant.bibNumber ?? "Not assigned"} />
              <Row label="Registered" value={<EventDate eventDate={participant.createdAt} type="date" />} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="divide-y">
                <Row label="Price" value={formatMoney(Number(participant.price ?? 0))} />
                <Row label="Service fee" value={formatMoney(Number(participant.serviceFee ?? 0))} />
                {participant.promoCode && (
                  <Row
                    label={`Promo (${participant.promoCode})`}
                    value={
                      <span className="text-green-600">
                        -{formatMoney(Number(participant.discountAmount ?? 0))}
                      </span>
                    }
                  />
                )}
              </div>
              <Separator className="my-2" />
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">Total</span>
                <span className="text-sm font-bold tabular-nums">
                  {formatMoney(Number(participant.finalPrice ?? 0))}
                </span>
              </div>
            </CardContent>
          </Card>

          {latestPayment && (
            <Card>
              <CardHeader>
                <CardTitle>Payment</CardTitle>
              </CardHeader>
              <CardContent className="divide-y">
                <Row
                  label="Invoice"
                  value={<span className="font-mono text-xs">{latestPayment.invoiceNumber}</span>}
                />
                <Row
                  label="Status"
                  value={
                    <Badge variant={latestPayment.status === "SUCCESS" ? "default" : "secondary"}>
                      {latestPayment.status}
                    </Badge>
                  }
                />
                <Row label="Amount" value={formatMoney(Number(latestPayment.price ?? 0))} />
                {latestPayment.expiresAt && (
                  <Row
                    label="Expires"
                    value={<EventDate eventDate={latestPayment.expiresAt} type="date" />}
                  />
                )}
                {latestPayment.paymentURL && (
                  <Row
                    label="Payment link"
                    value={
                      <a
                        href={latestPayment.paymentURL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 underline"
                      >
                        Open link
                      </a>
                    }
                  />
                )}
              </CardContent>
            </Card>
          )}
        </div>

      </div>
    </div>
  )
}