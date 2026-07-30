'use server';

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Suspense } from "react";

interface WithNavLayoutProps {
    children: React.ReactNode;
    locale: string;
}

export default async function WithNavLayout({ children, locale }: WithNavLayoutProps) {
    return (
        <>
            <Suspense fallback={<div className="h-16 bg-gray-900 border-b border-gray-800" />}>
                <Navbar locale={locale} />
            </Suspense>
            <div className="pt-16 flex-grow min-h-screen">
                {children}
            </div>
            <Footer />
        </>
    );
}
