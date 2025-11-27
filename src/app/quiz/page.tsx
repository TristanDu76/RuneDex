import { fetchAllChampions } from "@/lib/data";
import QuizClient from "@/components/quiz/QuizClient";
import LanguageSwitcher from "@/components/layout/LanguageSwitcher";
import Link from "next/link";
import { getTranslation } from "@/lib/translations";

interface QuizPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function QuizPage({ searchParams }: QuizPageProps) {
    const params = await searchParams;
    const locale = (params.lang as string) || 'fr_FR';
    const t = getTranslation(locale);

    const champions = await fetchAllChampions(locale);

    return (
        <main className="min-h-screen bg-gray-900 text-white relative flex flex-col">
            {/* Header */}
            <div className="w-full p-4 flex justify-center items-center max-w-7xl mx-auto">
                <h1 className="text-2xl font-bold text-yellow-500">RuneDex Quiz</h1>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col items-center justify-start pt-10 pb-20 px-4">
                <div className="text-center mb-8">
                    <h2 className="text-4xl font-bold mb-2">{t.quiz.title}</h2>
                    <p className="text-gray-400">{t.quiz.subtitle}</p>
                </div>

                <QuizClient champions={champions} lang={locale} />
            </div>
        </main>
    );
}
