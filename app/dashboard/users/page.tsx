import Link from "next/link";

import {getUsers} from "@/db/query/user-query";
import {UsersTable} from "@/components/users/users-table";
import {buttonVariants} from "@/components/ui/button";

export default async function UsersPage() {
  const users = await getUsers()
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Users</h1>
          <p className="text-sm text-muted-foreground">
            Manage rider accounts and profile details.
          </p>
        </div>
        <Link
          className={buttonVariants({ variant: "secondary" })}
          href="/dashboard/users/create">
          Add User
        </Link>
      </div>
      <UsersTable users={users} />
    </div>
  );
}
