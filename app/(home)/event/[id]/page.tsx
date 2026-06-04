import {getEventById} from "@/db/query/event-query";
import {redirect} from "next/navigation";
import {auth} from "@/lib/auth";
import {headers} from "next/headers";
import * as React from "react";
import Link from "next/link";
import {buttonVariants} from "@/components/ui/button";
import {PARTICIPANT_STATUS} from "@/utils/event.helper";
import {getOnGoingParticipant} from "@/db/query/participant-query";
import {getGroupById} from "@/db/query/event-group.query";
import {getPaymentByParticipant} from "@/db/query/event-payment.query";
import {EventDetailAlt} from "@/components/events/event-detail-alt";
import {RegistrationCompleteAlt} from "@/components/events/registration-complete-alt";
import {BanknoteIcon, CircleDashedIcon, UserIcon} from "lucide-react";
import {EventDetailWithSignup} from "@/components/events/event-detail-with-signup";

const STATUS_CTA: Record<string, string> = {
  [PARTICIPANT_STATUS.DRAFT]:           "Continue Registration",
  [PARTICIPANT_STATUS.PROFILE]:         "Complete Your Profile",
  [PARTICIPANT_STATUS.PENDING_PAYMENT]: "Complete Payment",
}

type StatusBannerConfig = {
  icon: React.ReactNode
  title: string
  description: string
  colors: string
}

const STATUS_BANNER: Record<string, StatusBannerConfig> = {
  [PARTICIPANT_STATUS.DRAFT]: {
    icon: <CircleDashedIcon className="size-4" />,
    title: "Registration in progress",
    description: "You've started your registration. Complete the remaining steps to secure your spot.",
    colors: "bg-blue-50 text-blue-700 border-blue-200 ring-blue-100",
  },
  [PARTICIPANT_STATUS.PROFILE]: {
    icon: <UserIcon className="size-4" />,
    title: "Profile pending",
    description: "Your payment is done. Please complete your rider profile to finish registration.",
    colors: "bg-amber-50 text-amber-700 border-amber-200 ring-amber-100",
  },
  [PARTICIPANT_STATUS.PENDING_PAYMENT]: {
    icon: <BanknoteIcon className="size-4" />,
    title: "Awaiting payment",
    description: "Almost there — complete your payment to confirm your registration.",
    colors: "bg-orange-50 text-orange-700 border-orange-200 ring-orange-100",
  },
}

export default async function Page({params}: { params: Promise<{ id: number }> }) {

  const {id} = await params;
  const event = await getEventById(id);

  if (!event) redirect('/');

  const session = await auth.api.getSession({ headers: await headers() })

  // No session — show event + signup prompt
  if (!session) {
    return (
      <div className="bg-slate-50 pt-18 min-h-screen">
        <div className="mx-auto max-w-3xl px-4 md:px-6 lg:px-8 pt-10 pb-24">

          <EventDetailAlt event={event}>
            <EventDetailWithSignup returnURL={`/event/${event.id}`} />
          </EventDetailAlt>
        </div>
      </div>
    )
  }

  //TODO: refactor to include with relation
  const participant = await getOnGoingParticipant(id, session.user.id);
  let payment, group = undefined
  if (participant) {
    [payment, group] = await Promise.all([
      getPaymentByParticipant(participant.id),
      getGroupById(participant.groupId!),
    ]);
  }

  const isCompleted = participant?.status === PARTICIPANT_STATUS.COMPLETED

  return (
    <div className="bg-slate-50 pt-18">
      <div className="mx-auto max-w-xl px-4 md:px-6 lg:px-8 pt-10 pb-24">
        <div className="space-y-4">

          {/* Status banner for in-progress registrations */}
          {participant && !isCompleted && (() => {
            const banner = STATUS_BANNER[participant.status ?? ""]
            if (!banner) return null
            return (
              <div className={`flex items-start gap-3 rounded-2xl border px-4 py-3.5 ring-1 ${banner.colors}`}>
                <div className="mt-0.5 shrink-0">{banner.icon}</div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold">{banner.title}</p>
                  <p className="text-xs mt-0.5 opacity-80">{banner.description}</p>
                </div>
              </div>
            )
          })()}

          {/* Event detail — CTA slot used for non-completed & no-participant states */}
          {!isCompleted ? (
            <EventDetailAlt event={event}>
              {participant ? (
                // In-progress registration — per-status CTA
                <Link
                  href={`/event/${id}/register`}
                  className={`${buttonVariants({ variant: "default", size: "lg" })} w-full uppercase`}
                >
                  {STATUS_CTA[participant.status ?? ""] ?? "Continue Registration"}
                </Link>
              ) : (
                // Not registered yet
                <Link
                  href={`/event/${id}/register`}
                  className={`${buttonVariants({ variant: "default", size: "lg" })} w-full uppercase`}
                >
                  Register Now
                </Link>
              )}
            </EventDetailAlt>
          ) : (
            <EventDetailAlt event={event} />
          )}


          {/* Completed — full registration details */}
          {isCompleted && participant && (
            <RegistrationCompleteAlt
              eventId={id}
              isGroupRide={event.isGroupRide}
              group={group}
              participant={participant}
              payment={payment}
            />
          )}

        </div>
      </div>
    </div>
  )
}