import {CreateCategoryForm} from "@/components/category/create-category-form";

export default async function Page({
                                     params,
                                   }: {
  params: Promise<{ id: number }>
}) {

  const {id} = await params;

  return (
    <div>
      <CreateCategoryForm eventId={id} />
    </div>
  )
}