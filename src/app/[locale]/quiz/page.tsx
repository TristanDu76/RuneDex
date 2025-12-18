import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { Brain, Image as ImageIcon, Zap, Lock } from 'lucide-react';

interface QuizPageProps {
    params: Promise<{ locale: string }>;
}

export default async function QuizHubPage({ params }: QuizPageProps) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'quiz' });

    const quizzes = [
        {
            id: 'classic',
            title: t('classicTitle'),
            description: t('classicDesc'),
            icon: Brain,
            href: `/${locale}/quiz/classic`,
            color: 'from-blue-500 to-cyan-500',
            active: true
        },
        {
            id: 'skin',
            title: t('skinTitle'),
            description: t('skinDesc'),
            icon: ImageIcon,
            href: `/${locale}/quiz/skin`,
            color: 'from-purple-500 to-pink-500',
            active: true
        },
        {
            id: 'ability',
            title: t('abilityTitle'),
            description: t('abilityDesc'),
            icon: Zap,
            href: `/${locale}/quiz/ability`,
            color: 'from-yellow-500 to-orange-500',
            active: true
        }
    ];

    return (
        <main className="min-h-screen bg-gray-900 text-white relative flex flex-col items-center justify-center p-4">
            <div className="max-w-5xl w-full">
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600 mb-4">
                        {t('hubTitle')}
                    </h1>
                    <p className="text-xl text-gray-400">
                        {t('hubSubtitle')}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {quizzes.map((quiz) => (
                        <Link
                            key={quiz.id}
                            href={quiz.active ? quiz.href : '#'}
                            className={`relative group rounded-2xl p-1 overflow-hidden transition-all duration-300 ${quiz.active ? 'hover:scale-105 cursor-pointer' : 'opacity-75 cursor-not-allowed'}`}
                        >
                            {/* Gradient Border */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${quiz.color} opacity-20 group-hover:opacity-100 transition-opacity duration-300`} />

                            {/* Card Content */}
                            <div className="relative h-full bg-gray-800 rounded-xl p-6 flex flex-col items-center text-center border border-gray-700 group-hover:border-transparent transition-colors">
                                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${quiz.color} flex items-center justify-center mb-4 shadow-lg`}>
                                    <quiz.icon size={32} className="text-white" />
                                </div>

                                <h3 className="text-2xl font-bold mb-2 group-hover:text-white transition-colors">
                                    {quiz.title}
                                </h3>

                                <p className="text-gray-400 text-sm mb-6 flex-grow">
                                    {quiz.description}
                                </p>

                                {!quiz.active && (
                                    <div className="absolute top-4 right-4 text-gray-500">
                                        <Lock size={20} />
                                    </div>
                                )}

                                {quiz.active ? (
                                    <span className={`px-6 py-2 rounded-full bg-gradient-to-r ${quiz.color} text-white font-bold text-sm shadow-lg opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all`}>
                                        {t('playQuiz')}
                                    </span>
                                ) : (
                                    <span className="px-4 py-1 rounded-full bg-gray-700 text-gray-400 text-xs font-bold">
                                        {t('comingSoon')}
                                    </span>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </main>
    );
}
