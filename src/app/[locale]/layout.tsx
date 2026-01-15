import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Suspense } from "react";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';


import { fetchAllChampionsLight, fetchLoreCharactersLight } from "@/lib/data";

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
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!['en', 'fr'].includes(locale)) {
    notFound();
  }

  // Providing all messages to the client
  const messages = await getMessages();

  const champions = await fetchAllChampionsLight(locale);
  const loreCharacters = await fetchLoreCharactersLight();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-900 text-white flex flex-col min-h-screen`}
      >
        <NextIntlClientProvider messages={messages}>
          <Suspense fallback={<div className="h-16 bg-gray-900 border-b border-gray-800" />}>
            <Navbar champions={champions} loreCharacters={loreCharacters} />
          </Suspense>
          <div className="pt-16 flex-grow">
            {children}
          </div>
          <Footer />
        </NextIntlClientProvider>

      </body>
    </html>
  );
}
