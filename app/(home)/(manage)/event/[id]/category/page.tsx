import {getCategoryByEvent} from "@/db/query/event-category.query";
import {CategorySelection} from "@/components/checkout/category-selection";

export default async function Page({params,}: { params: Promise<{ id: number }> }) {
  const {id} = await params;
  const categories = await getCategoryByEvent(id)

  return (
    <div>
      <CategorySelection categories={categories}  />
    </div>
  )
}