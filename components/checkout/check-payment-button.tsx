'use client'

import {useTransition} from "react";
import {useRouter} from "next/navigation";
import {Button} from "@/components/ui/button";
import {Spinner} from "@/components/ui/spinner";
import {checkPaymentStatus} from "@/app/actions/payment/payment-status.action";

export function CheckPaymentButton({invoiceNumber}: { invoiceNumber: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleCheck = () => {
    startTransition(async () => {
      await checkPaymentStatus(invoiceNumber);
      router.refresh();
    });
  };

  return (
    <div className="mt-3 text-center space-y-2">
      <p className="text-sm text-muted-foreground">Already paid? Click the button below to check your payment status.</p>
      <Button variant="outline" className="w-full" disabled={isPending} onClick={handleCheck}>
        {isPending ? <Spinner/> : null}
        {isPending ? "Checking payment..." : "Check Payment Status"}
      </Button>
    </div>
  );
}