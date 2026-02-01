import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,} from "@/components/ui/dialog"

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
          <img src="https://subjersey.com/cdn/shop/files/Series_Pro_1200x.jpg?v=1753949490" alt=""/>
        </div>
      </DialogContent>
    </Dialog>
  )
}