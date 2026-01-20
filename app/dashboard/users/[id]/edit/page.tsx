import {getUserWithDetail} from "@/db/query/user-query";
import {DashboardProfileForm} from "@/components/profile/dashboard-profile-form";

export default async function EditUser({ params }: { params: Promise<{ id: string }> }) {
  const {id} = await params;

  const user = await getUserWithDetail(id)

  return (
    <div>
      <DashboardProfileForm user={user} />
    </div>
  )
}