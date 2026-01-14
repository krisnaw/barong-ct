import {CalendarDays, MapPin} from "lucide-react";
import {formatEventDate, formatEventTime} from "@/types/date-helper";
import {getEventById} from "@/db/query/event-query";
import {redirect} from "next/navigation";
import {Button} from "@/components/ui/button";

export default async function Page({params,}: { params: Promise<{ id: number }> }) {

  const {id} = await params;

  const event = await getEventById(id);

  if (!event) {
    redirect('/dashboard');
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="sm:flex gap-8">

        <div className="mr-4 shrink-0 w-sm">
          <img className="aspect-square w-full rounded-2xl  object-cover"
            src="https://images.lumacdn.com/cdn-cgi/image/format=auto,fit=cover,dpr=2,background=white,quality=75,width=400,height=400/event-covers/ci/f04dc0fd-f5da-4f06-bd6d-482ea04c5dec.png" alt=""/>
        </div>

        <div className="w-full">

          <div>
            <h2 className="text-2xl font-semibold">
              {event.name}
            </h2>

            <ul className="mt-4 grid grid-cols-1 gap-8">
              <li>
                <div className="flex">

                  <div className="mr-4 shrink-0">

                    <div className="outline rounded-xl outline-gray-300 p-2.5">
                      <CalendarDays size="32" className="text-gray-500" />
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-800">
                      {formatEventDate(new Date())}
                    </h4>
                    <p className="mt-1 text-gray-400">
                      {formatEventTime(new Date())} GMT+8
                    </p>
                  </div>
                </div>
              </li>

              <li>
                <div className="flex">
                  <div className="mr-4 shrink-0">

                    <div className="outline rounded-xl outline-gray-300 p-2.5">
                      <MapPin size="32" className="text-gray-500" />
                    </div>

                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800">
                      {event.locationName}
                    </h4>
                    <p className="mt-1 text-gray-400">
                      {event.locationName}
                    </p>
                  </div>
                </div>
              </li>
            </ul>

            <div className="mt-8">
              <Button className="w-full">Join</Button>
            </div>
          </div>

          <div className="mt-10">

            <div className="space-y-6">

              <div>
                <div className="px-4 sm:px-0 border-b border-gray-200">
                  <h3 className="text-base/7 font-semibold ">About Event</h3>
                </div>
                <div className="mt-4">
                  <p>
                    MetaMask Welcoming Night — Indonesia Edition 🇮🇩
                    in collaboration with ETH Jakarta.

                    ​MetaMask Welcoming Night marks one of the first Web3 Wallet community gatherings of 2026 in Jakarta bringing builders, users, and enthusiasts together for an evening of learning, sharing, and meaningful conversations around Web3.

                    ​This in person meetup will start with introducing MetaMask, its core features, and its role within the Web3 ecosystem. The session will then continue with a sharing and discussion segment covering security practices, on chain protocols, and an overview of the current security landscape across wallets, & protocols.

                    ​Designed for developers, students, founders, DAO contributors, and Web3 enthusiasts, this event aims to help participants better understand self custody, common security risks, and how to safely navigate the Web3 space all in a friendly and community driven environment.
                  </p>
                </div>
              </div>

              <div>

                <div className="px-4 sm:px-0 border-b border-gray-200">
                  <h3 className="text-base/7 font-semibold ">Location</h3>
                </div>

                <div>
                  sdf
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>


    </div>
  )
}