import {getUserWithDetail} from "@/db/query/user-query";
import {DashboardProfileForm} from "@/components/profile/dashboard-profile-form";
import Link from "next/link";
import {cn} from "@/lib/utils";
import {buttonVariants} from "@/components/ui/button";
import {ArrowLeft} from "lucide-react";

export default async function EditUser({ params }: { params: Promise<{ id: string }> }) {
  const {id} = await params;

  const user = await getUserWithDetail(id)

  return (
    <div className="max-w-5xl">
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

      <DashboardProfileForm user={user} />
    </div>
  )
}