import {getPromoByEvent} from "@/db/query/event-promo.query";
import {Card, CardAction, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {AddPromo} from "@/components/promo/add-promo";
import {ListPromo} from "@/components/promo/list-promo";

export default async function Page({
                                     params,
                                   }: {
  params: Promise<{ id: number }>
}) {
  const {id} = await params;
  const promos = await getPromoByEvent(id)

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Promo code</CardTitle>
          <CardAction>
            <AddPromo eventId={id}/>
          </CardAction>
        </CardHeader>
        <CardContent>
          <ListPromo promos={promos}/>
        </CardContent>
      </Card>
    </div>
  )
}