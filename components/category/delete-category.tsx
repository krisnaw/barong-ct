'use client'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {Button} from "@/components/ui/button"
import {Trash} from "lucide-react";
import {EventCategoryType} from "@/db/schema";
import {deleteCategoryAction} from "@/app/actions/event-category/event-category.action";
import {toast} from "sonner";

export function DeleteCategory({category} : {category: EventCategoryType}) {
  const onClickHandler = async () => {
    const res = await deleteCategoryAction(category.id)
    if (res.success) {
      toast.info(res.message)
    } else {
      toast.warning(res.message)
    }
  }
  return (
    <AlertDialog>
      <AlertDialogTrigger render={<Button variant="destructive" size={"icon"}><Trash /></Button>} />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => onClickHandler()}>Yes, Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
