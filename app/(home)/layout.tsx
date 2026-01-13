import Header from "@/components/landing/header";
import Footer from "@/components/landing/footer";
import {auth} from "@/lib/auth";
import {headers} from "next/headers";

export default async function HomeLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {

  const session = await auth.api.getSession({
    headers: await headers() // you need to pass the headers object.
  })

  console.log(session)

  return (
    <div className="min-h-screen flex flex-col">
      <Header user={session?.user ? session.user : undefined} />
      <div className="flex-grow">
        {children}
      </div>
      <Footer />
    </div>
  )
}