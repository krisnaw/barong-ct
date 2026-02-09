import {Item, ItemContent, ItemDescription, ItemMedia, ItemTitle} from "@/components/ui/item";
import {ReceiptIcon} from "lucide-react";
import {EventPaymentType} from "@/db/schema";

export function EventPaymentCard({payment} : {payment : EventPaymentType}) {
  return (
    <Item variant="outline">
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
              <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                {payment.status}
              </span>
        </ItemDescription>
      </ItemContent>
    </Item>
  )
}