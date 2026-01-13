import Header from "@/components/landing/header";
import Footer from "@/components/landing/footer";

export default function HomeLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Header />
      <div className="min-h-screen">
        {children}
      </div>
      <Footer />
    </div>
  )
}