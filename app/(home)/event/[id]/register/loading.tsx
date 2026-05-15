import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-center gap-4">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-1 w-16" />
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-1 w-16" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
      <div className="rounded-lg border p-6 space-y-6">
        <Skeleton className="h-7 w-48" />
        <div className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  )
}
