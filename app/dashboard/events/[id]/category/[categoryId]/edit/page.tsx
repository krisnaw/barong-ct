import {EditCategoryForm} from "@/components/category/edit-category-form";
import {getCategoryById} from "@/db/query/event-category.query";

export default async function Page({
                                     params,
                                   }: {
  params: Promise<{ categoryId: number }>
}) {

  const {categoryId} = await params;


  const [category] = await getCategoryById(categoryId)

  return (
    <div>
      <EditCategoryForm category={category} />
    </div>
  )
}