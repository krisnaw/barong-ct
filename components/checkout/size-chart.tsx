import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,} from "@/components/ui/dialog"
import Image from "next/image"

const SIZES = [
  {size: "XXS", chest: "75–81",   sleeve: "33", frontLength: "46", backLength: "62"},
  {size: "XS",  chest: "79–85",   sleeve: "34", frontLength: "48", backLength: "64"},
  {size: "S",   chest: "83–87",   sleeve: "35", frontLength: "50", backLength: "64"},
  {size: "M",   chest: "87–93",   sleeve: "36", frontLength: "52", backLength: "66"},
  {size: "L",   chest: "93–99",   sleeve: "37", frontLength: "54", backLength: "68"},
  {size: "XL",  chest: "99–105",  sleeve: "38", frontLength: "56", backLength: "70"},
  {size: "XXL", chest: "105–109", sleeve: "39", frontLength: "58", backLength: "72"},
]

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
        <Image src="/sub-jersey-size-chart.jpg" alt="Barong Melali Jersey" width={500} height={500} className="w-full rounded-lg object-cover" />
      </DialogContent>
    </Dialog>
  )
}
