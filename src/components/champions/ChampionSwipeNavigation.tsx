'use client';

import { useEffect } from 'react';
import { useRouter } from '@/i18n/routing';

interface ChampionSwipeNavigationProps {
    prevChampionId: string;
    nextChampionId: string;
}

export default function ChampionSwipeNavigation({ prevChampionId, nextChampionId }: ChampionSwipeNavigationProps) {
    const router = useRouter();

    useEffect(() => {
        let touchStartX = 0;
        let touchEndX = 0;
        const minSwipeDistance = 50;

        const onTouchStart = (e: TouchEvent) => {
            touchStartX = e.changedTouches[0].screenX;
        };

        const onTouchEnd = (e: TouchEvent) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        };

        const handleSwipe = () => {
            const distance = touchStartX - touchEndX;
            const isLeftSwipe = distance > minSwipeDistance;
            const isRightSwipe = distance < -minSwipeDistance;

            if (isLeftSwipe) {
                // Swipe Left ( <--- ) -> Next Champion
                router.push(`/champion/${nextChampionId}`);
            } else if (isRightSwipe) {
                // Swipe Right ( ---> ) -> Previous Champion
                router.push(`/champion/${prevChampionId}`);
            }
        };

        window.addEventListener('touchstart', onTouchStart);
        window.addEventListener('touchend', onTouchEnd);

        return () => {
            window.removeEventListener('touchstart', onTouchStart);
            window.removeEventListener('touchend', onTouchEnd);
        };
    }, [nextChampionId, prevChampionId, router]);

    return null;
}
