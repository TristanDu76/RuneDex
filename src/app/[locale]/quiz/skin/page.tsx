import { fetchAllChampions } from "@/lib/data";
import SkinQuizClient from "../../../../components/quiz/SkinQuizClient";
import { getTranslations } from 'next-intl/server';

interface QuizPageProps {
    params: Promise<{ locale: string }>;
}

export default async function SkinQuizPage({ params }: QuizPageProps) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'quiz' });

    // Fetch champions with skins (skins field added to fetchAllChampions)
    const champions = await fetchAllChampions(locale);

    return (
        <main className="min-h-screen bg-gray-900 text-white relative flex flex-col">
            {/* Header */}
            <div className="w-full p-4 flex justify-center items-center max-w-7xl mx-auto relative">
                <a href={`/${locale}/quiz`} className="absolute left-4 text-gray-400 hover:text-white transition-colors">
                    ← Back to Hub
                </a>
                <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                    {t('skinTitle')}
                </h1>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col items-center justify-start pt-6 pb-20 px-4">
                <SkinQuizClient champions={champions} />
            </div>
        </main>
    );
}
