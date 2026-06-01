import Header from "@/components/landing/header";
import {Suspense} from "react";

export default async function HomeLayout({children,}: Readonly<{ children: React.ReactNode; }>) {
  return (
    <div className="flex flex-col min-h-screen">
      <Suspense><Header /></Suspense>
      <div className="grow">
        {children}
      </div>
      {/*<Footer />*/}
    </div>
  )
}
