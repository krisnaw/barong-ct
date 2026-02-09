'use client'

import {formatMoney} from "@/utils/money-helper";
import {Badge} from "@/components/ui/badge";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table";
import {PromoType} from "@/db/schema";

interface PromoListTableProps {
  promos: PromoType[];
}

export function PromoListTable({ promos }: PromoListTableProps) {
  const formatDate = (date?: Date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString();
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Promo Code</TableHead>
          <TableHead>Discount</TableHead>
          <TableHead>Start Date</TableHead>
          <TableHead>End Date</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {promos.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center text-muted-foreground">
              No promos found
            </TableCell>
          </TableRow>
        ) : (
          promos.map((promo) => (
            <TableRow key={promo.id}>
              <TableCell className="font-medium">{promo.promo}</TableCell>
              <TableCell>{formatMoney(promo.discountValue)}</TableCell>
              <TableCell>{promo.startsAt ? formatDate(promo.startsAt) : "-"}</TableCell>
              <TableCell>{promo.endsAt ? formatDate(promo.endsAt) : "-"}</TableCell>
              <TableCell>
                <Badge variant={promo.isActive ? "default" : "secondary"}>
                  {promo.isActive ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}