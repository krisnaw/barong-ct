import Header from "@/components/landing/header";
import Footer from "@/components/landing/footer";

export default function HomeLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow">
        {children}
      </div>
      <Footer />
    </div>
  )
}