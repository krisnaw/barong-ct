import {Item, ItemContent, ItemDescription, ItemMedia, ItemTitle} from "@/components/ui/item";
import {ReceiptIcon} from "lucide-react";
import {EventPaymentType} from "@/db/schema";
import {cn} from "@/lib/utils";

export function EventPaymentCard({payment} : {payment : EventPaymentType}) {
  return (
    <Item size="sm" variant="outline">
      <ItemMedia variant="icon">
        <ReceiptIcon/>
      </ItemMedia>
      <ItemContent>
        <ItemTitle>Payment</ItemTitle>
        <ItemDescription>
          {payment.invoiceNumber}
        </ItemDescription>
      </ItemContent>
      <ItemContent className="flex-none text-center">
        <ItemDescription>
              <span className={
                cn(
                  'inline-flex items-center rounded-md  px-2 py-1 text-xs font-medium ',
                  payment.status === "EXPIRED" ? 'text-yellow-700 bg-yellow-100'  : 'text-green-700 bg-green-100'
                )
              }>
                {payment.status}
              </span>
        </ItemDescription>
      </ItemContent>
    </Item>
  )
}