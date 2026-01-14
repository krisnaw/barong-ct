import {EventType} from "@/db/schema";
import {MapPin} from "lucide-react";

export function ListItemEvent({event} : {event: EventType}) {
  return (
    <div className="flex outline rounded-xl p-4">
      <div className="mr-4 shrink-0">
        <img
          alt=""
          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
          className="inline-block size-24 rounded-md outline -outline-offset-1 outline-white/10"
        />
      </div>
      <div>
        <p className="text-gray-500 text-lg">{new Date().toLocaleDateString()}</p>
        <h4 className="text-lg font-bold ">
          {event.name}
        </h4>
        <p className="mt-1 inline-flex items-center text-gray-500 gap-2">
          <MapPin size={18} /> Capital Place
        </p>
      </div>
    </div>
  )
}