import {getUserById, getUserDetail} from "@/db/query/user-query";
import {EditUserForm} from "@/components/users/edit-user-form";
import {EditUserDetailForm} from "@/components/users/edit-user-detail-form";
import {CreateUserDetailForm} from "@/components/users/create-user-detail-form";
import {BackButton} from "@/components/button/back-button";

export default async function EditUser({ params }: { params: Promise<{ id: string }> }) {
  const {id} = await params;

  const user = await getUserById(id);
  const detail = await getUserDetail(id)

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <BackButton href="/dashboard/users">
        Back to Users
      </BackButton>

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
