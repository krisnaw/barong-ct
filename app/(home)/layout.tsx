import {auth} from "@/lib/auth";
import {headers} from "next/headers";
import Header from "@/components/landing/header";
import Footer from "@/components/landing/footer";

export default async function HomeLayout({children,}: Readonly<{ children: React.ReactNode; }>) {

  const session = await auth.api.getSession({
    headers: await headers() // you need to pass the headers object.
  })

  return (
    <div className="flex flex-col">
      <Header user={session?.user ? session.user : undefined}/>
      <div className="grow">
        {children}
      </div>
      <Footer />
    </div>
  )
}