import {Card, CardAction, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {AddCategory} from "@/components/category/add-category";
import {ListCategory} from "@/components/category/list-category";
import {getCategoryByEvent} from "@/db/query/event-category.query";

export default async function Page({
                                     params,
                                   }: {
  params: Promise<{ id: number }>
}) {
  const {id} = await params;

  const categories = await getCategoryByEvent(id)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Categories</CardTitle>
        <CardAction>
          <AddCategory eventId={id}/>
        </CardAction>
      </CardHeader>
      <CardContent>
        <ListCategory categories={categories}/>
      </CardContent>
    </Card>
  )
}