import {Pencil} from "lucide-react";
import {EventCategoryType} from "@/db/schema";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table"
import {formatMoney} from "@/utils/money-helper";

export async function ListCategory({categories} : {categories: EventCategoryType[]}) {
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Name</TableHead>
            <TableHead>Desc</TableHead>
            <TableHead>Price</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category: EventCategoryType) => (
            <TableRow key={category.id}>
              <TableCell className="font-medium">{category.name}</TableCell>
              <TableCell>
                {category.description}
              </TableCell>
              <TableCell>{category.price ? formatMoney(category.price) : 0}</TableCell>
              <TableCell className="text-right">
                <Button
                  size="icon-sm"
                  variant="outline"
                  className="rounded-full"
                  aria-label="Invite"
                >
                  <Link href={`/dashboard/events/${category.eventId}/category/${category.id}/edit`}>
                    <Pencil />
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}

        </TableBody>
      </Table>
    </div>
  )
}