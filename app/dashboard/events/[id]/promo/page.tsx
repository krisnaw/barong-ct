import {CreatePromoForm} from "@/components/promo/create-promo-form";
import {getPromoByEvent} from "@/db/query/event-promo.query";
import {PromoListTable} from "@/components/promo/promo-list-table";
import {getEventById} from "@/db/query/event-query";
import {redirect} from "next/navigation";

export default async function Page({params}: { params: Promise<{ id: number }> }) {
  const {id} = await params;

  const promos = await getPromoByEvent(id)
  const event = await getEventById(id)

  if (!event) {
    redirect('/dashboard')
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      <CreatePromoForm eventId={id} price={event.price ?? 0} />

      <div>
        {promos && (
          <PromoListTable promos={promos} />
        )}
      </div>
    </div>
  )
}