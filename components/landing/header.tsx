'use client'

import {signOut} from "@/app/actions/auth/signup.action";
import Link from "next/link";
import {User} from "better-auth";

export default function Header({user} : {user : User | undefined }) {
  return (
    <>
      <header className="bg-transparent backdrop-blur-xs text-gray-600 px-6 py-4 shrink-0  fixed w-full z-50">
        <nav className="mx-auto max-w-3xl px-4 md:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <Link href="/" className="-m-1.5">
              <span className="sr-only">Home</span>
              <img
                alt="Barong Cycling Logo"
                src="/barong-no-bg.svg"
                className="h-14"
              />
            </Link>
            <div className="space-x-4 text-md font-medium">
              {user ? (
                <div className="inline-flex gap-4">
                  <Link href="/profile" className="hover:underline">
                    Profile
                  </Link>
                  <form action={signOut}>
                    <button className="opacity-80 hover:opacity-100 hover:underline">
                      Logout
                    </button>
                  </form>
                </div>
              ) : (
                <>
                  <Link href="/auth/signup">
                    Log in <span aria-hidden="true">&rarr;</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </nav>
      </header>
    </>
  )
}
