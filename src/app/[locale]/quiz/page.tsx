import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { Brain, Image as ImageIcon, Zap } from 'lucide-react';

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
            href: '/quiz/classic',
            color: 'from-blue-500 to-cyan-500',
            active: true
        },
        {
            id: 'skin',
            title: t('skinTitle'),
            description: t('skinDesc'),
            icon: ImageIcon,
            href: '/quiz/skin',
            color: 'from-purple-500 to-pink-500',
            active: true
        },
        {
            id: 'ability',
            title: t('abilityTitle'),
            description: t('abilityDesc'),
            icon: Zap,
            href: '/quiz/ability',
            color: 'from-yellow-500 to-orange-500',
            active: true
        }
    ];

    return (
        <main className="relative min-h-screen bg-transparent px-4 pb-16 pt-28 text-white sm:px-6">
            <div className="max-w-5xl w-full mx-auto">
                <div className="mb-10 text-center sm:mb-12">
                    <p className="mb-3 text-xs uppercase tracking-[0.28em] text-hextech-cyan">Atlas vivant</p>
                    <h1 className="hex-title mb-4 text-4xl font-bold sm:text-5xl">
                        {t('hubTitle')}
                    </h1>
                    <p className="mx-auto max-w-2xl text-base text-gray-400 sm:text-xl">
                        {t('hubSubtitle')}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {quizzes.map((quiz) => (
                        <Link
                            key={quiz.id}
                            href={quiz.active ? quiz.href : '#'}
                            className={`group relative overflow-hidden rounded-sm p-1 transition-all duration-300 ${quiz.active ? 'cursor-pointer hover:-translate-y-1' : 'cursor-not-allowed opacity-75'}`}
                        >
                            {/* Gradient Border */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${quiz.color} opacity-20 group-hover:opacity-100 transition-opacity duration-300`} />

                            {/* Card Content */}
                            <div className="relative flex h-full flex-col items-center border border-hextech-gold/25 bg-hextech-panel p-6 text-center transition-colors group-hover:border-hextech-gold/70">
                                <div className={`mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br ${quiz.color} shadow-lg`}>
                                    <quiz.icon size={32} className="text-white" />
                                </div>

                                <h3 className="text-2xl font-bold mb-2 group-hover:text-white transition-colors">
                                    {quiz.title}
                                </h3>

                                <p className="text-gray-400 text-sm mb-6 flex-grow">
                                    {quiz.description}
                                </p>

                                {quiz.active ? (
                                    <span className={`rounded-sm bg-gradient-to-r px-6 py-2 text-sm font-bold text-white shadow-lg ${quiz.color}`}>
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
