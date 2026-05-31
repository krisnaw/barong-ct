export const PARTICIPANT_STATUS = {
  DRAFT: "draft",
  PROFILE: "profile",
  PENDING_PAYMENT: "payment",
  COMPLETED: "completed",
} as const;

export const PAYMENT_STATUS = {
  PENDING: "PENDING",
  SUCCESS: "SUCCESS",
  EXPIRED: "EXPIRED",
  ORDER_EXPIRED: "ORDER_EXPIRED",
} as const;

export const EVENT_STATUS = {
  DRAFT: "draft",
  OPEN: "open",
} as const;