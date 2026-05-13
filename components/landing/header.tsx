'use client'

import {User} from "@/types/auth-types";
import {signOut} from "@/app/actions/auth/signup.action";
import Link from "next/link";

export default function Header({user} : {user : User | undefined}) {


  return (
    <>
      <header className="bg-white text-gray-600 px-6 py-4 shrink-0 border-b border-gray-200 fixed w-full z-50">
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
            <div className="space-x-4 text-sm font-medium">
              {user ? (
                <div className="inline-flex gap-4">
                  <Link href="/profile">
                    Profile
                  </Link>
                  <form action={signOut}>
                    <button className="opacity-80 hover:opacity-100">
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
