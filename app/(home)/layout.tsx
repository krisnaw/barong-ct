import {auth} from "@/lib/auth";
import {headers} from "next/headers";
import {Mona_Sans} from "next/font/google";

const instrumentSerif = Mona_Sans({
  subsets: ["latin"],
  style: "normal",
  weight: "400"
})


export default async function HomeLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {

  const session = await auth.api.getSession({
    headers: await headers() // you need to pass the headers object.
  })

  return (
    <div className={`${instrumentSerif.className} min-h-screen flex flex-col`}>
      <div className="flex-grow">
        {children}
      </div>
    </div>
  )
}