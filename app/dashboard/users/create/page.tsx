import Link from "next/link"
import {ArrowLeft} from "lucide-react"

import {AddUserForm} from "@/components/users/add-user-form"
import {buttonVariants} from "@/components/ui/button"

export default function CreateUserPage() {
  return (
    <div className="space-y-4">
      <Link href="/dashboard/users" className={buttonVariants({variant: "ghost", className: "-ml-2"})}>
        <ArrowLeft />
        Back to Users
      </Link>

      <AddUserForm />
    </div>
  )
}
