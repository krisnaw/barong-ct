import {EditCategoryForm} from "@/components/category/edit-category-form";
import {getCategoryById} from "@/db/query/event-category.query";

export default async function Page({
                                     params,
                                   }: {
  params: Promise<{ categoryId: number }>
}) {

  const {categoryId} = await params;

  console.log(categoryId);

  const category = await getCategoryById(categoryId)



  return (
    <div>
      <EditCategoryForm eventId={categoryId} />
    </div>
  )
}