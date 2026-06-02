import {EventFaq} from "@/components/events/event-faq";

export default function Page() {
  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-3xl">
        <div className="flex flex-col items-center gap-2">
          <EventFaq />
        </div>
      </div>
    </div>
  )
}