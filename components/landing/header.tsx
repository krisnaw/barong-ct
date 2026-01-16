'use client'

import {useState} from 'react'
import {MenuIcon, XIcon} from "lucide-react";
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
        <div className="flex lg:flex-1">
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
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 "
          >
            <span className="sr-only">Open main menu</span>
            <MenuIcon aria-hidden="true" className="size-6" />
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-12">
          {navigation.map((item) => (
            <a key={item.name} href={item.href} className={cn('text-sm/6 font-semibold text-white', isHome ? 'text-white' : 'text-primary')}>
              {item.name}
            </a>
          ))}
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
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
      <div  className="lg:hidden">
        <div className="fixed inset-0 z-50" />
        <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-gray-900 p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-100/10">
          <div className="flex items-center justify-between">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <img
                alt=""
                src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                className="h-8 w-auto"
              />
            </a>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-400"
            >
              <span className="sr-only">Close menu</span>
              <XIcon aria-hidden="true" className="size-6" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-white/10">
              <div className="space-y-2 py-6">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-white hover:bg-white/5"
                  >
                    {item.name}
                  </a>
                ))}
              </div>
              <div className="py-6">
                <a
                  href="/signup"
                  className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-white hover:bg-white/5"
                >
                  Log in
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
