import {Playfair_Display} from 'next/font/google'
import Image from "next/image";
import Link from "next/link";
import {getLastActiveEvent} from "@/db/query/event-query";
import {MoveRight} from "lucide-react";

const playfair = Playfair_Display({
  subsets: ['latin'],
})

export default async function Page() {
  const event = await getLastActiveEvent()

  return (
    <div className="relative isolate overflow-hidden min-h-svh flex flex-col justify-between">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/bg-image-opt.jpg"
          alt="Cyclists riding through Bali at golden hour with Mount Agung in the distance"
          fill
          priority
          className="size-full object-cover"
        />
        <div className="absolute top-0 right-0 w-full h-full hidden sm:block">
          <Image src="/meru-m.svg" alt="" fill className="object-contain object-top-right opacity-50"/>
        </div>
        <div className="absolute inset-0 bg-black/50"/>
        <div className="absolute inset-0 bg-linear-to-b from-black/60 via-transparent to-black/70"/>
      </div>


      <div className="mx-auto max-w-2xl pt-32">
        <div className="text-center">
          <h1
            className={`${playfair.className} text-amber-50 text-6xl leading-[0.95] tracking-tight md:text-7xl lg:text-8xl animate-fade-up`}>
            Barong
            <span className="italic text-amber-200">Melali</span>
            <span className="block text-4xl sm:text-6xl md:text-7xl lg:text-8xl">2026</span>
          </h1>

          <p
            className="mt-6 sm:mt-8 max-w-xl text-center italic leading-relaxed text-amber-50/90 text-base sm:text-xl md:text-4xl animate-fade-up [animation-delay:220ms]">
            &#34;This is not a race, this is a journey of feeling in the island of Gods.&#34;
          </p>
        </div>

        <div className="mt-8 sm:mt-10 flex justify-center items-center animate-fade-up [animation-delay:420ms]">
          {event ? (

            <Link prefetch={true}
                  href={`/event/${event.id}`}
                  className="group inline-flex items-center gap-3 rounded-full bg-orange-700 px-6 py-3 sm:px-8 sm:py-4 text-sm font-semibold uppercase tracking-widest text-white transition-transform hover:bg-orange-500 hover:scale-[1.02]"
            >
              Register Now
              <span className="transition-transform group-hover:translate-x-1">
                <MoveRight/>
              </span>
            </Link>

          ) : (
            <div
              className="group inline-flex items-center gap-3 rounded-full bg-orange-700 px-6 py-3 sm:px-8 sm:py-4 text-sm font-semibold uppercase tracking-widest text-white transition-transform hover:bg-orange-500 hover:scale-[1.02]"
            >
              Coming Soon
              <span className="transition-transform group-hover:translate-x-1">
                <MoveRight/>
              </span>
            </div>
          )}

        </div>
      </div>

      {/* Sponsors */}
      <div className="mx-auto max-w-3xl pb-4">
        <div className="mb-4 flex items-center gap-4">
          <span className="h-px flex-1 bg-white/15"/>
          <span className="text-[10px] uppercase tracking-[0.4em] text-white/70">Presented With</span>
          <span className="h-px flex-1 bg-white/15"/>
        </div>
        <div
          className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 sm:gap-x-12 sm:gap-y-6 rounded-2xl border border-white/15 bg-black/20 px-6 py-4 sm:px-8 sm:py-6 backdrop-blur-md">
          <Image src="/barong-bni.png" alt="BarongBNI" width={500} height={400}
                 className="h-16 sm:h-24 lg:h-32 w-auto object-contain animate-fade-left [animation-delay:600ms]"/>
          <Image src="/wondr.png" alt="Wondr" width={400} height={400}
                 className="h-16 sm:h-24 lg:h-32 w-auto object-contain animate-fade-left [animation-delay:780ms]"/>
          <Image src="/bni-80.png" alt="BNI" width={400} height={400}
                 className="h-16 sm:h-24 lg:h-32 w-auto object-contain animate-fade-left [animation-delay:960ms]"/>
        </div>
      </div>
    </div>
  )
}
