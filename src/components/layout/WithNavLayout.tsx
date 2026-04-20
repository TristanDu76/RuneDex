'use server';

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Suspense } from "react";
import { fetchAllChampionsLight, fetchLoreCharactersLight } from "@/lib/data";

interface WithNavLayoutProps {
    children: React.ReactNode;
    locale: string;
}

export default async function WithNavLayout({ children, locale }: WithNavLayoutProps) {
    const champions = await fetchAllChampionsLight(locale);
    const loreCharacters = await fetchLoreCharactersLight();

    return (
        <>
            <Suspense fallback={<div className="h-16 bg-gray-900 border-b border-gray-800" />}>
                <Navbar champions={champions} loreCharacters={loreCharacters} />
            </Suspense>
            <div className="pt-16 flex-grow min-h-screen">
                {children}
            </div>
            <Footer />
        </>
    );
}
