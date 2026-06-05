'use client'

import {useTransition} from "react";
import {Button} from "@/components/ui/button";
import {Spinner} from "@/components/ui/spinner";
import {checkPaymentStatus, updatePaymentStatusToExpired} from "@/app/actions/payment/payment-status.action";
import {toast} from "sonner";
import {PAYMENT_STATUS} from "@/utils/event.helper";
import {useRouter} from "next/navigation";

export function CheckPaymentButton({expiredAt, invoiceNumber}: { expiredAt: Date | null, invoiceNumber: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const isExpired = expiredAt != null && new Date() > new Date(expiredAt);

  const handleCheck = () => {
    startTransition(async () => {
      if (isExpired) {
        const result = await updatePaymentStatusToExpired(invoiceNumber);
        if (!result.success) {
          toast.error("Failed to update payment status. Please try again.");
          return;
        }
        router.refresh();
        toast.info("Payment expired");
        return;
      }

      const result = await checkPaymentStatus(invoiceNumber);

      if (!result.success) {
        toast.error("Failed to check payment status. Please try again.");
        return;
      }

      const { status } = result;

      if (status === PAYMENT_STATUS.SUCCESS) {
        toast.success("Payment confirmed! Your payment was successful.");
      } else if (status === PAYMENT_STATUS.EXPIRED || status === PAYMENT_STATUS.ORDER_EXPIRED) {
        toast.warning("Your payment has expired.");
      } else if (status === PAYMENT_STATUS.PENDING) {
        toast.info("Payment is still pending. Please complete your payment.");
      } else {
        toast.info(`Payment status: ${status}`);
      }
    });
  };

  return (
    <div className="mt-3 text-center space-y-2">
      <p className="text-sm text-muted-foreground">Already paid or Expired? Click the button below to check your payment status.</p>
      <Button variant="outline" className="w-full" disabled={isPending} onClick={handleCheck}>
        {isPending ? <Spinner/> : null}
        {isPending ? "Checking payment..." : "Check Payment Status"}
      </Button>
    </div>
  );
}