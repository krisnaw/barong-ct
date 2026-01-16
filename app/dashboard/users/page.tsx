import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table"
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {db} from "@/db/db";
import {user} from "@/db/schema";

export default async function UsersPage() {
  const users =  await db.select().from(user).limit(10)
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Users</h1>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/users/${user.id}`}>
                      View Details
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}