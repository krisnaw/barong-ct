import {getParticipantByEvent} from "@/db/query/participant-query";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

const dummyUsers: User[] = [
  { id: "1", name: "Alice Smith", email: "alice@example.com", role: "Admin" },
  { id: "2", name: "Bob Johnson", email: "bob@example.com", role: "Member" },
  { id: "3", name: "Charlie Brown", email: "charlie@example.com", role: "Member" },
  { id: "4", name: "Diana Prince", email: "diana@example.com", role: "Editor" },
  { id: "5", name: "Eve Adams", email: "eve@example.com", role: "Member" },
];


export default async function Page({params}: { params: Promise<{ id: number }> }) {
  const {id} = await params;
  const participants = await getParticipantByEvent(id)

  console.log(participants)

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Users</h1>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {participants.map((participant) => (
              <TableRow key={participant.id}>
                <TableCell className="font-medium">{participant.user.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}