import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="mx-auto max-w-4xl">
      <div className="sm:flex gap-8">
        <div className="mr-0 md:mr-4 shrink-0 w-full md:w-64 lg:w-80">
          <Skeleton className="aspect-square w-full rounded-2xl" />
        </div>

        <div className="w-full mt-8 md:mt-0">
          <div>
            <Skeleton className="h-8 w-3/4 mb-4" />

            <ul className="mt-4 grid grid-cols-1 gap-8">
              <li>
                <div className="flex">
                  <div className="mr-4 shrink-0">
                    <Skeleton className="w-16 h-16 rounded-xl" />
                  </div>
                  <div className="flex-1">
                    <Skeleton className="h-6 w-32 mb-2" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              </li>

              <li>
                <div className="flex items-center">
                  <div className="mr-4 shrink-0">
                    <Skeleton className="w-16 h-16 rounded-xl" />
                  </div>
                  <div className="flex-1">
                    <Skeleton className="h-6 w-40" />
                  </div>
                </div>
              </li>
            </ul>

            <div className="mt-8">
              <div className="border rounded-lg p-4 text-center">
                <Skeleton className="h-5 w-32 mx-auto mb-2" />
                <Skeleton className="h-6 w-24 mx-auto mb-2" />
                <Skeleton className="h-10 w-32 mx-auto" />
              </div>
            </div>
          </div>

          <div className="mt-10">
            <div className="space-y-6 flex flex-col">
              <div className="order-first md:order-last">
                <div className="border-b border-gray-200 pb-2 mb-4">
                  <Skeleton className="h-5 w-20" />
                </div>
                <div className="w-full aspect-[16/9] rounded-lg overflow-hidden">
                  <Skeleton className="w-full h-full" />
                </div>
              </div>

              <div className="order-last md:order-first">
                <div className="border-b border-gray-200 pb-2 mb-4">
                  <Skeleton className="h-5 w-24" />
                </div>
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-4/5" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}