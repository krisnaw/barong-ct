import Header from "@/components/landing/header";
import {headers} from "next/headers";
import {auth} from "@/lib/auth";

export default async function HomeLayout({children,}: Readonly<{ children: React.ReactNode; }>) {
  const session = await auth.api.getSession({
    headers: await headers() // you need to pass the headers object.
  })
  return (
    <div className="flex flex-col min-h-screen">
      <Header user={session?.user ? session.user : undefined}/>
      <div className="grow">
        {children}
      </div>
      {/*<Footer />*/}
    </div>
  )
}
