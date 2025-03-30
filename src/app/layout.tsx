import type { Metadata } from "next";
import { Geist, Geist_Mono, Lusitana } from "next/font/google";
import { Analytics } from "@vercel/analytics/react"
import "./globals.css";
import localFont from 'next/font/local'
import { Navbar } from "@/components/navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const lusitana = Lusitana({
  weight: ['400', '700'],
  subsets: ["latin"],
  variable: "--font-lusitana",
});

// Add your custom font
const customFont = localFont({
  src: '../../public/fonts/Lordish-Regular.ttf',
  variable: '--font-custom',
  display: 'swap',
})

export const metadata: Metadata = {
  title: "MonaBaem - Tattoo Designs",
  description: "I'm Mona, a tattoo artist showcasing unique custom designs. Browse my portfolio, shop for original tattoo designs, and contact me for custom commission work.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${customFont.variable} ${lusitana.variable} font-custom antialiased`}
      >
        <Navbar />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
