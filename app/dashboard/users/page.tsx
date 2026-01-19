import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table"
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {InputSearch} from "@/components/dashboard/input-search";
import {getUsers} from "@/db/query/user-query";
import {format} from "date-fns";
import {id} from "date-fns/locale";

export default async function UsersPage({searchParams} : {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {

  const name = (await searchParams).name as string ?? ""
  const users = await getUsers(name)

  return (
    <div className="flex flex-col gap-6">

      <h1 className="text-2xl font-bold">
        Total {users.length} Users
      </h1>

      <div>
        <InputSearch />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Registered At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{format(user.createdAt, 'PPpp', { locale: id })}</TableCell>
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