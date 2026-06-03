import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,} from "@/components/ui/dialog"
import Image from "next/image"

export function SizeChart() {
  return (
    <Dialog>
      <DialogTrigger className="text-sm font-medium text-blue-600 hover:text-blue-500">
        Size chart
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Size Chart SUB Jersey Pro Series</DialogTitle>
        </DialogHeader>
        <Image src="/size-chart.jpeg" alt="Barong Melali Jersey" width={500} height={500} className="w-full rounded-lg object-cover" />
      </DialogContent>
    </Dialog>
  )
}
