import * as React from "react";
import {EventType} from "@/db/schema";

export function EventCard({event} : {event: EventType}) {
  return (
    <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow-sm">
      <div>
        {/* Content goes here */}
        {/* We use less vertical padding on card headers on desktop than on body sections */}

        <img

          className="size-full aspect-square flex-none  object-cover outline -outline-offset-1 outline-white/10"

          src="https://placeholdit.com/400x400/f3f4f6/9da8bf?text=Banner" alt=""/>
      </div>
      <div className="px-4 py-5 sm:p-6">


        <h3 className=" text-lg/6 font-semibold text-gray-900 group-hover:text-gray-600">
          {event.name}
        </h3>

      </div>
      {/*<div className="px-4 py-4 sm:px-6">*/}
      {/*  /!* Content goes here *!/*/}
      {/*  /!* We use less vertical padding on card footers at all sizes than on headers or body sections *!/*/}
      {/*</div>*/}
    </div>
  )
}