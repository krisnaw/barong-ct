import {CreatePromoForm} from "@/components/promo/create-promo-form";

export default async function Page({params}: { params: Promise<{ id: number }> }) {
  const {id} = await params;
  return <CreatePromoForm eventId={id} />
}