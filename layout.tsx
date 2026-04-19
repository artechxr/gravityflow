import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { OrderProvider } from "@/context/OrderStore";

export const metadata: Metadata = {
  title: "GravityFlow",
  description: "Smart Stadium Ecosystem",
};

import { SystemProvider } from "@/context/SystemContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col pt-0">
        <SystemProvider>
            <OrderProvider>{children}</OrderProvider>
        </SystemProvider>
      </body>
    </html>
  );
}
