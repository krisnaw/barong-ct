import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {EventDate} from "@/components/events/event-date";
import {formatBibNumber} from "@/utils/money-helper";
import {Button} from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {Badge} from "@/components/ui/badge";

export function ListOrder({orders} : {orders : any[]}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Bib</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Promo</TableHead>
          <TableHead>Cat</TableHead>
          <TableHead>Registered At</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.length > 0 ? (
          orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">{order.participant.bibNumber ? formatBibNumber(order.participant.bibNumber) : "-"}</TableCell>
              <TableCell className="font-medium">
                <div className="flex flex-col">
                  <span className="font-medium">{order.user.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {order.user.email}
                  </span>
                </div>
              </TableCell>
              <TableCell className="font-medium">{order.promoCode ?? "-"}</TableCell>
              <TableCell className="font-medium">
                <Badge>{order.category?.name}</Badge>
              </TableCell>
              <TableCell className="font-medium">
                <EventDate eventDate={order.updatedAt} type="date" />
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger render={<Button variant="outline" />}>
                    Open
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuGroup>
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuItem>Profile</DropdownMenuItem>
                      <DropdownMenuItem>Billing</DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem>Team</DropdownMenuItem>
                      <DropdownMenuItem>Subscription</DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell className="font-medium" colSpan={4}>Sorry, no participant yet</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}