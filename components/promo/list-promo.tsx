'use client'

import {formatMoney} from "@/utils/money-helper";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table";
import {PromoType} from "@/db/schema";
import {CopyIcon, Trash2} from "lucide-react";
import {toast} from "sonner";
import {deletePromoAction} from "@/app/actions/profile/promo/promo.action";

export function ListPromo({ promos }: { promos: PromoType[] }) {
  const formatDate = (date?: Date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString();
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Promo code copied to clipboard");
    } catch (err) {
      toast.error("Failed to copy promo code");
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Promo</TableHead>
          <TableHead>Value</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {promos.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7} className="text-center text-muted-foreground">
              No promos found
            </TableCell>
          </TableRow>
        ) : (
          promos.map((promo) => (
            <TableRow key={promo.id}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  {promo.promo}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(promo.promo)}
                    className="h-6 w-6 p-0"
                  >
                    <CopyIcon className="h-3 w-3" />
                  </Button>
                </div>
              </TableCell>
              <TableCell>{promo.discountType == 'fixed' ? formatMoney(promo.discountValue) : promo.discountValue + "%"}</TableCell>
              <TableCell>
                <Badge variant={promo.isActive ? "default" : "secondary"}>
                  {promo.isActive ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell>
                <form action={deletePromoAction}>
                  <input type="hidden" name="promoId" value={promo.id} />
                  <Button type="submit" variant="ghost" size="sm" className="h-6 w-6 p-0 text-destructive">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </form>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}