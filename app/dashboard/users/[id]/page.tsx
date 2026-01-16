import {getUserWithDetail} from "@/db/query/user-query";
import {UserDetail} from "@/components/dashboard/user-detail";
import {Button} from "@/components/ui/button";
import {ArrowLeft, Edit} from "lucide-react";
import Link from "next/link";
import {notFound} from "next/navigation";

export default async function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const {id} = await params;

  const user = await getUserWithDetail(id);

  if (!user) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/users">
              <ArrowLeft className="size-4 mr-2" />
              Back to Users
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">User Profile</h1>
            <p className="text-muted-foreground">View and manage user information</p>
          </div>
        </div>
        
        <Button asChild>
          <Link href={`/dashboard/users/${user.id}/edit`}>
            <Edit className="size-4 mr-2" />
            Edit User
          </Link>
        </Button>
      </div>

      <UserDetail user={user} />
    </div>
  );
}