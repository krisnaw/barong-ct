"use client"

import {useState} from "react";
import {PencilIcon} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {Button} from "@/components/ui/button";

const JERSEY_SIZES = ["XS", "S", "M", "L", "XL", "XXL"] as const
type JerseySize = typeof JERSEY_SIZES[number]

export function ButtonChangeJerseySize({ currentSize }: { currentSize?: string }) {
  const [selected, setSelected] = useState<JerseySize>(
    (currentSize?.toUpperCase() as JerseySize) ?? "M"
  )

  return (
    <AlertDialog>
      <AlertDialogTrigger render={
        <Button variant="ghost" size="icon-xs">
          <PencilIcon />
        </Button>
      } />
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>Change Jersey Size</AlertDialogTitle>
          <AlertDialogDescription>
            Select your jersey size.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="grid grid-cols-3 gap-2">
          {JERSEY_SIZES.map((size) => (
            <button
              key={size}
              onClick={() => setSelected(size)}
              className={`rounded-xl border py-3 text-sm font-semibold uppercase transition-colors ${
                selected === size
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-card text-foreground hover:bg-muted"
              }`}
            >
              {size}
            </button>
          ))}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Save</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}