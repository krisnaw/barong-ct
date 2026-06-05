import Link from "next/link";
import {buttonVariants} from "@/components/ui/button";
import {ChevronLeftIcon, ChevronRightIcon} from "lucide-react";
import {cn} from "@/lib/utils";

interface PaginationProps {
  page: number
  pageSize: number
  total: number
  buildHref: (page: number) => string
}

export function Pagination({ page, pageSize, total, buildHref }: PaginationProps) {
  const totalPages = Math.ceil(total / pageSize)
  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-between text-sm text-muted-foreground">
      <span>
        {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} of {total}
      </span>
      <div className="flex items-center gap-1">
        <Link
          href={buildHref(page - 1)}
          aria-disabled={page <= 1}
          className={cn(
            buttonVariants({ variant: "outline", size: "icon-xs" }),
            page <= 1 && "pointer-events-none opacity-40"
          )}
        >
          <ChevronLeftIcon />
        </Link>
        <span className="tabular-nums px-2">
          {page} / {totalPages}
        </span>
        <Link
          href={buildHref(page + 1)}
          aria-disabled={page >= totalPages}
          className={cn(
            buttonVariants({ variant: "outline", size: "icon-xs" }),
            page >= totalPages && "pointer-events-none opacity-40"
          )}
        >
          <ChevronRightIcon />
        </Link>
      </div>
    </div>
  )
}