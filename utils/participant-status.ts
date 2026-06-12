import {PARTICIPANT_STATUS} from "@/utils/event.helper";

export type ParticipantStatus = typeof PARTICIPANT_STATUS[keyof typeof PARTICIPANT_STATUS]
export type ParticipantStatusBadgeVariant = "default" | "secondary" | "destructive" | "outline"

export const PARTICIPANT_STATUS_BADGE: Record<string, ParticipantStatusBadgeVariant> = {
  [PARTICIPANT_STATUS.COMPLETED]: "default",
  [PARTICIPANT_STATUS.PENDING_PAYMENT]: "secondary",
  [PARTICIPANT_STATUS.DRAFT]: "outline",
  [PARTICIPANT_STATUS.PROFILE]: "outline",
}

export const PARTICIPANT_STATUS_LABELS: Record<string, string> = {
  [PARTICIPANT_STATUS.COMPLETED]: "Completed",
  [PARTICIPANT_STATUS.PENDING_PAYMENT]: "Pending Payment",
  [PARTICIPANT_STATUS.DRAFT]: "Draft",
  [PARTICIPANT_STATUS.PROFILE]: "Profile",
}
