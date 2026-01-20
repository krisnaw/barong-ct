import {getEventById} from "@/db/query/event-query";
import {redirect} from "next/navigation";
import {getPendingParticipants} from "@/db/query/participant-query";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Badge} from "@/components/ui/badge";
import {format} from "date-fns";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {id as idLocale} from "date-fns/locale";
import {ButtonEventReminder} from "@/app/dashboard/events/[id]/pending/button-event-reminder";
import {ButtonAddParticipant} from "@/app/dashboard/events/[id]/pending/button-add-participant";

export default async function Page({params}: { params: Promise<{ id: number }> }) {
  const {id} = await params;
  const event = await getEventById(id)
  if (!event) {
    redirect('/dashboard/events');
  }

  const users = await getPendingParticipants(event.id)

  return (
    <div className="flex flex-col gap-6">

      <h1 className="text-2xl font-bold">
        Total {users.length} have not joined
      </h1>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Profile</TableHead>
              <TableHead>Registered At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell><Badge className={`${user.phone ? 'bg-green-500 text-white' : ''}`}>{user.phone ? "Completed" : "Not Complete"}</Badge> </TableCell>
                <TableCell>{format(user.createdAt, 'PPpp', { locale: idLocale })}</TableCell>
                <TableCell className="inline-flex gap-2">

                  <ButtonAddParticipant eventId={event.id} userId={user.id} name={user.name} email={user.email} />

                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/users/${user.id}`}>
                      View Details
                    </Link>
                  </Button>

                  {user.phone && (
                    <>
                      <ButtonEventReminder name={user.name} email={user.email} />
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