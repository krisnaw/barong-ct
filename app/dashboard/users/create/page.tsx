import {AddUserForm} from "@/components/users/add-user-form"
import {BackButton} from "@/components/button/back-button";

export default function CreateUserPage() {
  return (
    <div className="space-y-4">
      <BackButton href="/dashboard/users">
        Back to Users
      </BackButton>

      <AddUserForm />
    </div>
  )
}
