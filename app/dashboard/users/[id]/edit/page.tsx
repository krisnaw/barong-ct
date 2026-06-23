import {getUserById, getUserDetail} from "@/db/query/user-query";
import Link from "next/link";
import {cn} from "@/lib/utils";
import {buttonVariants} from "@/components/ui/button";
import {ArrowLeft} from "lucide-react";
import {EditUserForm} from "@/components/users/edit-user-form";
import {EditUserDetailForm} from "@/components/users/edit-user-detail-form";
import {CreateUserDetailForm} from "@/components/users/create-user-detail-form";

export default async function EditUser({ params }: { params: Promise<{ id: string }> }) {
  const {id} = await params;

  const user = await getUserById(id);
  const detail = await getUserDetail(id)

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <Link
        href="/dashboard/users"
        className={cn(
          buttonVariants({variant: "outline", size: "sm"}),
          "active:scale-[0.96] transition-transform duration-150 ease-out"
        )}
      >
        <ArrowLeft className="size-4" />
        Back to Users
      </Link>

      {user && (
        <EditUserForm user={user} />
      )}

      {user && detail && (
        <EditUserDetailForm userId={id} detail={detail} />
      )}

      {user && !detail && (
        <CreateUserDetailForm user={user} />
      )}

    </div>
  )
}
