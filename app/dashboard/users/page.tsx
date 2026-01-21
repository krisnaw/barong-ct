import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table"
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {InputSearch} from "@/components/dashboard/input-search";
import {getUsers} from "@/db/query/user-query";
import {format} from "date-fns";
import {id} from "date-fns/locale";
import {Badge} from "@/components/ui/badge";
import {ButtonSendReminder} from "@/app/dashboard/users/button-send-reminder";
import {PencilIcon} from "lucide-react";

export default async function UsersPage({searchParams}: {
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
        <InputSearch/>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Profile</TableHead>
              <TableHead>Registered At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">

                  <div className="flex items-center">
                    <div className="size-11 shrink-0">
                      <img alt="" src={user.image ?? "/no_avatar.png"} className="size-11 rounded-full"/>
                    </div>
                    <div className="ml-4">
                      <div className="font-medium text-gray-900">{user.name}</div>
                      <div className="mt-1 text-gray-500">{user.email}</div>
                    </div>
                  </div>

                </TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell><Badge
                  className={`${user.phone ? 'bg-green-500 text-white' : ''}`}>{user.phone ? "Completed" : "Not Complete"}</Badge>
                </TableCell>
                <TableCell>{format(user.createdAt.toLocaleString(), 'PPpp', {locale: id})}</TableCell>
                <TableCell className="inline-flex gap-2">
                  <Button asChild size="icon-sm" variant="outline">
                    <Link href={`/dashboard/users/${user.id}/edit`}>
                      <PencilIcon/>
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/users/${user.id}`}>
                      View
                    </Link>
                  </Button>
                  {!user.phone && (
                    <>
                      <ButtonSendReminder email={user.email}/>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}