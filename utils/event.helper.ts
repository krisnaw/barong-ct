export const ORDER_STATUS = {
  DRAFT: "draft",
  PROFILE: "profile",
  PENDING_PAYMENT: "payment",
  COMPLETED: "completed",
} as const;

export const PAYMENT_STATUS = {
  PENDING: "PENDING",
  SUCCESS: "SUCCESS",
  EXPIRED: "EXPIRED"
} as const;


export const PARTICIPANT_STATUS = {
  CONFIRMED: "CONFIRMED",
} as const;
