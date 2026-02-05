import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,} from "@/components/ui/dialog"
import Image from "next/image";

export function SizeChart() {
  return (
    <Dialog>
      <DialogTrigger className="text-sm font-medium text-blue-600 hover:text-blue-500">
        See sizing chart
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Size Chart</DialogTitle>
        </DialogHeader>
        <div>
          <Image height={1200} width={500} src="/size-chart.png" alt=""/>
        </div>
      </DialogContent>
    </Dialog>
  )
}