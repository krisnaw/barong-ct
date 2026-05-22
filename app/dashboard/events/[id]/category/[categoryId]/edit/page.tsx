import {getCategoryById} from "@/db/query/event-category.query";
import {EditCategoryForm} from "@/components/category/edit-category-form";
import {redirect} from "next/navigation";

export default async function Page({
                                     params,
                                   }: {
  params: Promise<{ categoryId: number }>
}) {

  const {categoryId} = await params;

  const category = await getCategoryById(categoryId)

  if (!category) {
    return redirect('/dashboard/events')
  }

  return (
    <div>
      <EditCategoryForm category={category} />
    </div>
  )
}