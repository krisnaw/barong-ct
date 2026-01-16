'use client'

import {useState} from 'react'
import {User} from "@/types/auth-types";
import {usePathname} from "next/navigation";
import {cn} from "@/lib/utils";
import {signOut} from "@/app/actions/auth/signup.action";

const navigation = [
  { name: 'Events', href: '/event' },
  // { name: 'About', href: '/about' },
]

export default function Header({user} : {user : User | undefined}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <nav aria-label="Global" className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
        <div className="flex flex-1">
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/" className="-m-1.5">
            <span className="sr-only">Home</span>
            <img
              alt="Barong Cycling Logo"
              src="/barong-no-bg.svg"
              className="h-14"
            />
          </a>
        </div>

        <div className="flex gap-x-12">
          {navigation.map((item) => (
            <a key={item.name} href={item.href} className={cn('text-sm/6 font-semibold text-white', isHome ? 'text-white' : 'text-primary')}>
              {item.name}
            </a>
          ))}
        </div>

        <div className="flex flex-1 justify-end">
          {user ? (
            <div className="inline-flex gap-4">

              <a href="/profile" className={cn('text-sm/6 font-semibold text-white', isHome ? 'text-white' : 'text-primary')}>
                Profile
              </a>

              <form  action={signOut}>
                <button type="submit"
                        className={cn('text-sm/6 font-semibold text-white', isHome ? 'text-white' : 'text-primary')}
                >Logout</button>
              </form>


            </div>
            ) : (
            <a href="/auth/signup" className={cn('text-sm/6 font-semibold text-white', isHome ? 'text-white' : 'text-primary')}>
              Log in <span aria-hidden="true">&rarr;</span>
            </a>
          ) }
        </div>

      </nav>
    </header>
  )
}
