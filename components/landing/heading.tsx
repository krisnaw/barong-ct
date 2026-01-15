import type {ComponentProps} from 'react'
import {cn} from "@/lib/utils";
import {Instrument_Serif} from "next/font/google";

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  style: "normal",
  weight: "400"
})


export function Heading({
                          children,
                          color = 'dark/light',
                          className,
                          ...props
                        }: { color?: 'dark/light' | 'light' } & ComponentProps<'h1'>) {
  return (
    <h1
      className={cn(
        'font-display text-5xl/12 tracking-tight text-balance sm:text-[5rem]/20',
        color === 'dark/light' && 'text-olive-950 dark:text-white',
        color === 'light' && 'text-white',
        className,
        instrumentSerif.className
      )}
      {...props}
    >
      {children}
    </h1>
  )
}
