import {getUserWithDetail} from "@/db/query/user-query";
import {ProfileForm} from "@/components/profile/profile-form";

export default async function EditUser({ params }: { params: Promise<{ id: string }> }) {
  const {id} = await params;

  const user = await getUserWithDetail(id)

  return (
    <div>
      <ProfileForm user={user} />
    </div>
  )
}