import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

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

export default function UsersPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Users</h1>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dummyUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.id}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}