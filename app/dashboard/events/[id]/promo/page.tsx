import {CreatePromoForm} from "@/components/promo/create-promo-form";
import {getPromoByEvent} from "@/db/query/event-promo.query";
import {PromoListTable} from "@/components/promo/promo-list-table";

export default async function Page({params}: { params: Promise<{ id: number }> }) {
  const {id} = await params;

  const promos = await getPromoByEvent(id)

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        {promos && (
          <PromoListTable promos={promos} />
        )}

      </div>
      <CreatePromoForm eventId={id} />
    </div>
  )
}