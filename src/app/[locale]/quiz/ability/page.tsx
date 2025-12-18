import { fetchAllChampions } from "@/lib/data";
import AbilityQuizClient from "@/components/quiz/AbilityQuizClient";
import { getTranslations } from 'next-intl/server';

interface QuizPageProps {
    params: Promise<{ locale: string }>;
}

export default async function AbilityQuizPage({ params }: QuizPageProps) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'quiz' });

    const champions = await fetchAllChampions(locale);

    return (
        <main className="min-h-screen bg-gray-900 text-white relative flex flex-col">
            {/* Header */}
            <div className="w-full p-4 flex justify-center items-center max-w-7xl mx-auto relative">
                <a href={`/${locale}/quiz`} className="absolute left-4 text-gray-400 hover:text-white transition-colors">
                    ← Back to Hub
                </a>
                <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-600">
                    {t('abilityTitle')}
                </h1>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col items-center justify-start pt-6 pb-20 px-4">
                <AbilityQuizClient champions={champions} />
            </div>
        </main>
    );
}
