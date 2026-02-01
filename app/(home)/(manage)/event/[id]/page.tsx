import {getEventById} from "@/db/query/event-query";
import {redirect} from "next/navigation";
import {getCategoryByEvent} from "@/db/query/event-category.query";
import {Card, CardContent, CardDescription, CardHeader, CardTitle,} from "@/components/ui/card"
import {CategorySelection} from "@/components/checkout/category-selection";

export default async function Page({params,}: { params: Promise<{ id: number }> }) {

  const {id} = await params;

  const event = await getEventById(id);
  const categories = await getCategoryByEvent(id)

  if (!event) {
    redirect('/');
  }

  if (categories.length > 0 ) {
    redirect(`/event/${id}/category`)
  }

  return (
    <div className="mx-auto max-w-xl">
      <Card>
        <CardHeader>
          <CardTitle>Category and Group</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            <CategorySelection categories={categories}  />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}