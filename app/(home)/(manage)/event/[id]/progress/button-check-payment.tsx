'use client'

import {Button} from "@/components/ui/button";
import {checkPaymentStatus} from "@/app/actions/payment/payment-status.action";

export function ButtonCheckPayment({invoiceNumber}: {invoiceNumber: string}) {
  return (
    <>
      <Button onClick={() => {
        checkPaymentStatus(invoiceNumber);
      }}>Check Payment</Button>
    </>
  )
}