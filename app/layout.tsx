import type {Metadata} from "next";
import {Geist, Geist_Mono, Inter, Playfair_Display} from "next/font/google";
import "./globals.css";
import {Toaster} from "sonner";
import {NuqsAdapter} from "nuqs/adapters/next";
import {cn} from "@/lib/utils";
import {TooltipProvider} from "@/components/ui/tooltip"

const playfairDisplayHeading = Playfair_Display({subsets: ['latin'], variable: '--font-heading'});

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.BETTER_AUTH_URL ?? "https://www.barongmelali.com/"),
  title: "Barong Cycling Team",
  description: "Bali Road Cycling Group",
};

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en"
          className={cn("h-full overscroll-none", "font-sans", inter.variable, playfairDisplayHeading.variable)}>
    <body className={`${geistSans.variable} ${geistMono.variable} antialiased h-full`}>
    <NuqsAdapter>
      <TooltipProvider>
        {children}
      </TooltipProvider>
    </NuqsAdapter>
    <Toaster position="top-center"/>
    </body>
    </html>
  );
}
