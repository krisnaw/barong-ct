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




//
// function getOrderStatusText(status: string) {
//   switch (status) {
//     case ORDER_STATUS.DRAFT:
//       return "Created";
//     case ORDER_STATUS.PROFILE:
//       return "Profile Completion"
//     case ORDER_STATUS.PENDING_PAYMENT:
//       return "Awaiting for payment"
//   }
// }