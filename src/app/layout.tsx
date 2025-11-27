import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import { Suspense } from "react";

import { fetchAllChampions, fetchLoreCharacters } from "@/lib/data";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RuneDex",
  description: "League of Legends Champion Database",

};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const champions = await fetchAllChampions();
  const loreCharacters = await fetchLoreCharacters();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-900 text-white`}
      >
        <Suspense fallback={<div className="h-16 bg-gray-900 border-b border-gray-800" />}>
          <Navbar champions={champions} loreCharacters={loreCharacters} />
        </Suspense>
        <div className="pt-16">
          {children}
        </div>
      </body>
    </html>
  );
}
