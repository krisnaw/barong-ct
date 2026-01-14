import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";

const events = [
  {
    id: "1",
    name: "Event 1",
    description: "Description 1",
    date: "2024-01-01",
    location: "Location 1",
  },
  {
    id: "2",
    name: "Event 2",
    description: "Description 2",
    date: "2024-01-02",
    location: "Location 2",
  },
];

export default function EventsPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Events</h1>
        <Link href="/dashboard/events/new">
          <Button>Create Event</Button>
        </Link>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map((event) => (
            <TableRow key={event.id}>
              <TableCell>{event.name}</TableCell>
              <TableCell>{event.date}</TableCell>
              <TableCell>{event.location}</TableCell>
              <TableCell>
                <Link href={`/dashboard/events/${event.id}`}>
                  <Button variant="outline" size="sm" className="mr-2">
                    View
                  </Button>
                </Link>
                <Link href={`/dashboard/events/${event.id}/edit`}>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}