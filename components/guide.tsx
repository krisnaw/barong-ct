"use client"

import * as React from "react"

import {Card, CardContent} from "@/components/ui/card"
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Image from "next/image";

export function Guide() {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const [count, setCount] = React.useState(0)

  React.useEffect(() => {
    if (!api) {
      return
    }

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])

  return (
    <div className="mx-auto w-full max-w-md px-4">
      <Carousel setApi={setApi} className="w-full max-w-md">
        <CarouselContent>
          {steps.map((step, ) => (
            <CarouselItem key={step.id}>
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-4 sm:p-6">
                  <Image src={step.image} width={400} height={800} alt={step.title} className="outline outline-gold-400 w-full h-auto" />
                  <div className="text-left mt-4">
                    <div className="text-base/7 text-gray-600">{step.title}</div>
                    <div>
                      {step.desc}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden sm:inline-flex" />
        <CarouselNext className="hidden sm:inline-flex" />
      </Carousel>
      <div className="py-2 text-center text-sm text-muted-foreground">
        Slide {current} of {steps.length}
      </div>
    </div>
  )
}


const steps = [
  {
    id: 1,
    title: "Home Page",
    desc: "Halaman utama",
    image: "/tutorial/tutorial-step-1.jpg"
  },
  {
    id: 2,
    title: "Event Detail Page",
    desc: "Setelah melihat informasi event. Klik tombol register",
    image: "/tutorial/tutorial-step-2.jpg"
  },
  {
    id: 3,
    title: "Login Page",
    desc: "Masukan email untuk mendaftar.",
    image: "/tutorial/tutorial-step-3.jpg"
  },
]