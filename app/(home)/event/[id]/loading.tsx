import {Skeleton} from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="bg-slate-50 pt-18">
      <div className="mx-auto max-w-3xl px-4 md:px-6 lg:px-8 pt-10 pb-24 space-y-4">

        {/* EventDetailAlt skeleton */}
        <div className="overflow-hidden rounded-3xl bg-card ring-1 ring-foreground/10">

          {/* Hero image */}
          <Skeleton className="h-52 w-full rounded-none" />

          {/* Info rows */}
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {/* Date — full width on mobile */}
              <div className="col-span-2 sm:col-span-1 flex items-start gap-3">
                <Skeleton className="size-8 shrink-0 rounded-lg" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3 w-10" />
                  <Skeleton className="h-4 w-36" />
                </div>
              </div>
              {/* Time */}
              <div className="flex items-start gap-3">
                <Skeleton className="size-8 shrink-0 rounded-lg" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3 w-10" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
              {/* Location */}
              <div className="col-span-2 sm:col-span-1 flex items-start gap-3">
                <Skeleton className="size-8 shrink-0 rounded-lg" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3 w-14" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            </div>

            <Skeleton className="h-px w-full" />

            {/* Categories */}
            <div className="space-y-2">
              <Skeleton className="h-3 w-20 mb-3" />
              <div className="flex items-center justify-between rounded-xl border px-4 py-3">
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <div className="space-y-1.5 items-end flex flex-col">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
              <div className="flex items-center justify-between rounded-xl border px-4 py-3">
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-3 w-12" />
                </div>
                <div className="space-y-1.5 items-end flex flex-col">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            </div>

            {/* Footer (children) */}
            <Skeleton className="h-px w-full" />
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
        </div>

      </div>
    </div>
  )
}
