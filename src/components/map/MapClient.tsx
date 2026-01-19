'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from '@/i18n/routing';
import { X } from 'lucide-react';

interface Region {
    id: string;
    name: string;
    nameEn: string;
    description: string;
    descriptionEn: string;
    color: string;
    // SVG path coordinates (simplified polygons for each region)
    // Format: "x1,y1 x2,y2 x3,y3 ..." (percentage-based)
    // Peut contenir plusieurs polygones pour les territoires dispersés
    polygons?: string[];
    // SVG circles for small/circular regions
    // Format: "cx,cy,radius" (absolute coordinates)
    circles?: string[];
    // Optional icon/logo for the region
    // Path to the image file
    icon?: string;
}

// Image dimensions: 9181 x 5880
const IMAGE_WIDTH = 9181;
const IMAGE_HEIGHT = 5880;

// Helper function to convert absolute coords to percentage
const coordsToPercentage = (coords: string): string => {
    const points = coords.split(',').map(Number);
    const percentagePoints: string[] = [];

    for (let i = 0; i < points.length; i += 2) {
        const x = (points[i] / IMAGE_WIDTH * 100).toFixed(2);
        const y = (points[i + 1] / IMAGE_HEIGHT * 100).toFixed(2);
        percentagePoints.push(`${x},${y}`);
    }

    return percentagePoints.join(' ');
};

// Helper function to calculate the center of a region for icon placement
const getRegionCenter = (region: Region): { x: number; y: number } | null => {
    // If region has circles, use the first circle's center
    if (region.circles && region.circles.length > 0) {
        const [cx, cy] = region.circles[0].split(',').map(Number);
        return { x: cx, y: cy };
    }

    // If region has polygons, calculate the centroid of the first polygon
    if (region.polygons && region.polygons.length > 0) {
        const points = region.polygons[0].split(/[\s,]+/).map(Number);
        let sumX = 0, sumY = 0, count = 0;

        for (let i = 0; i < points.length; i += 2) {
            sumX += points[i];
            sumY += points[i + 1];
            count++;
        }

        return { x: sumX / count, y: sumY / count };
    }

    return null;
};

const regions: Region[] = [
    {
        id: 'demacia',
        name: 'Demacia',
        nameEn: 'Demacia',
        description: 'Fier Royaume Militaire Légaliste',
        descriptionEn: 'Proud Lawful Military Kingdom',
        icon: '/images/Demacia.png',
        color: '#e6f3ceff',
        polygons: [

        ]
    },
    {
        id: 'shurima',
        name: 'Shurima',
        nameEn: 'Shurima',
        description: 'Ancien Empire Désertique Déchu',
        descriptionEn: 'Ancient Fallen Desert Empire',
        icon: '/images/Shurima.png',
        color: '#ebc443ff',
        polygons: [

        ]
    },
    {
        id: 'ixtal',
        name: 'Ixtal',
        nameEn: 'Ixtal',
        description: 'Jungle Élémentaire Isolée',
        descriptionEn: 'Secluded Elemental Jungle',
        icon: '/images/Ixtal.png',
        color: '#1d9719ff',
        polygons: [

        ]
    },
    {
        id: 'freljord',
        name: 'Freljord',
        nameEn: 'Freljord',
        description: 'Terres Tribales Glaciales',
        descriptionEn: 'Harsh Frozen Tribal Lands',
        icon: '/images/Freljord.png',
        color: '#13c5ddff',
        polygons: [

        ]
    },

    {
        id: 'noxus',
        name: 'Noxus',
        nameEn: 'Noxus',
        description: 'Empire Méritocratique Agressif',
        descriptionEn: 'Aggressive Meritocratic Empire',
        icon: '/images/Noxus.png',
        color: '#d10000ff',
        polygons: [
            '4408,2810 4416,2798 4436,2778 4460,2752 4475,2732 4487,2717 4501,2714 4519,2714 4529,2720 4565,2730 4619,2750 4669,2764 4680,2771 4699,2803 4712,2816 4748,2874 4764,2864 4780,2865 4791,2866 4805,2869 4813,2872 4828,2886 4847,2888 4855,2887 4863,2888 4877,2885 4892,2882 4892,2875 4899,2873 4909,2877 4920,2881 4935,2881 4943,2878 4958,2870 4959,2860 4967,2859 4973,2863 4978,2875 4979,2881 4977,2889 4981,2900 4990,2908 5003,2913 5009,2916 5025,2916 5034,2919 5059,2912 5067,2914 5085,2922 5093,2927 5096,2940 5105,2948 5121,2955 5130,2964 5128,2972 5121,2979 5119,2985 5126,2992 5130,3004 5125,3021 5116,3035 5125,3041 5127,3052 5127,3052 5125,3058 5122,3064 5115,3058 5110,3058 5114,3064 5113,3070 5113,3078 5120,3085 5127,3085 5134,3086 5139,3088 5137,3093 5139,3100 5147,3104 5159,3104 5166,3109 5174,3113 5179,3112 5186,3116 5190,3124 5196,3132 5197,3139 5197,3146 5205,3149 5212,3149 5221,3152 5227,3154 5238,3159 5243,3158 5249,3159 5256,3156 5262,3152 5270,3148 5277,3143 5287,3142 5295,3144 5303,3145 5313,3148 5323,3149 5335,3146 5343,3144 5346,3141 5348,3131 5361,3125 5363,3118 5360,3110 5357,3105 5353,3102 5355,3095 5351,3087 5344,3080 5336,3076 5331,3072 5313,3067 5302,3063 5289,3057 5291,3050 5297,3046 5303,3044 5307,3039 5307,3032 5304,3024 5303,3018 5298,3015 5298,3012 5301,3006 5301,2997 5293,2996 5292,2989 5294,2981 5293,2975 5292,2970 5286,2965 5277,2963 5277,2958 5282,2954 5290,2951 5296,2944 5298,2936 5296,2928 5298,2920 5302,2915 5301,2907 5301,2899 5303,2893 5307,2886 5310,2883 5313,2879 5311,2871 5318,2869 5324,2869 5331,2862 5339,2856 5343,2851 5341,2845 5340,2837 5346,2824 5349,2813 5350,2803 5345,2797 5348,2790 5349,2785 5334,2769 5331,2762 5326,2758 5320,2750 5312,2747 5310,2737 5306,2734 5296,2727 5292,2718 5283,2712 5278,2703 5267,2697 5256,2694 5245,2691 5238,2685 5228,2666 5215,2655 5201,2644 5181,2633 5150,2633 5141,2626 5133,2612 5118,2605 5093,2609 5082,2604 5062,2600 5043,2600 5032,2604 5026,2599 5015,2591 5002,2579 5003,2571 5008,2562 5007,2553 4998,2543 4997,2536 4986,2525 4977,2515 4974,2499 4963,2486 4959,2484 4959,2473 4945,2461 4941,2445 4931,2436 4923,2425 4920,2417 4914,2407 4907,2402 4905,2393 4898,2385 4894,2377 4890,2367 4888,2360 4882,2356 4872,2354 4866,2347 4861,2345 4855,2336 4852,2327 4847,2319 4843,2311 4842,2305 4846,2299 4847,2291 4842,2287 4825,2284 4806,2281 4791,2280 4785,2268 4785,2258 4791,2248 4793,2242 4785,2242 4771,2242 4765,2239 4763,2232 4754,2230 4739,2237 4737,2233 4743,2228 4746,2222 4749,2218 4749,2211 4748,2206 4746,2203 4748,2196 4751,2195 4750,2190 4747,2181 4742,2180 4741,2173 4738,2168 4732,2162 4728,2153 4724,2147 4717,2145 4709,2138 4700,2134 4689,2132 4672,2129 4662,2129 4647,2132 4633,2137 4630,2145 4623,2144 4622,2137 4608,2134 4587,2136 4568,2137 4547,2133 4536,2132 4531,2137 4527,2143 4519,2141 4512,2145 4499,2148 4490,2157 4477,2164 4463,2172 4457,2184 4451,2196 4440,2197 4428,2204 4417,2209 4407,2220 4400,2231 4402,2242 4403,2248 4401,2256 4401,2270 4403,2283 4403,2295 4408,2299 4413,2303 4416,2309 4416,2319 4415,2328 4407,2328 4408,2319 4404,2313 4398,2309 4387,2306 4383,2298 4373,2292 4369,2291 4361,2293 4352,2293 4349,2288 4345,2285 4345,2280 4349,2275 4353,2269 4355,2263 4352,2252 4345,2244 4336,2245 4326,2249 4315,2249 4306,2245 4300,2238 4289,2237 4289,2237 4283,2238 4276,2242 4273,2247 4264,2249 4252,2248 4243,2244 4234,2241 4225,2237 4217,2238 4211,2244 4198,2244 4185,2240 4168,2236 4156,2229 4147,2223 4141,2213 4137,2208 4133,2206 4132,2199 4130,2194 4126,2189 4122,2183 4121,2177 4120,2173 4115,2168 4111,2170 4105,2174 4100,2179 4095,2185 4092,2187 4080,2192 4067,2192 4063,2192 4057,2188 4049,2179 4047,2173 4045,2165 4048,2159 4051,2154 4056,2147 4058,2144 4063,2133 4065,2128 4062,2124 4056,2121 4051,2120 4034,2119 4040,2111 4045,2107 4048,2103 4055,2089 4057,2081 4056,2072 4047,2063 4041,2054 4038,2045 4027,2038 4023,2028 4013,2020 4007,2010 4002,1996 3995,1985 3983,1980 3975,1974 3983,1969 3991,1966 3993,1954 3986,1947 3990,1943 3997,1942 3997,1935 3995,1929 3992,1925 3988,1919 3991,1912 3991,1905 3987,1902 3988,1892 3993,1886 4000,1880 4003,1876 4002,1869 4005,1863 4005,1863 4006,1857 4007,1848 4004,1843 4003,1834 4000,1828 3994,1831 3985,1842 3971,1850 3961,1856 3945,1864 3932,1868 3933,1863 3937,1860 3945,1856 3946,1846 3953,1839 3963,1828 3970,1818 3976,1807 3980,1791 3977,1780 3975,1773 3980,1767 3986,1761 3995,1756 4001,1743 4012,1735 4019,1725 4027,1718 4031,1706 4037,1700 4045,1695 4046,1689 4042,1678 4045,1671 4047,1664 4044,1659 4038,1656 4033,1646 4017,1632 4006,1632 3995,1632 3991,1617 3982,1609 3973,1601 3962,1597 3952,1590 3944,1585 3930,1581 3917,1577 3907,1572 3896,1557 3890,1549 3880,1551 3872,1548 3868,1538 3856,1540 3852,1532 3860,1524 3865,1514 3867,1507 3874,1502 3885,1501 3892,1496 3897,1491 3901,1489 3912,1486 3922,1483 3928,1481 3936,1476 3943,1474 3949,1469 3947,1462 3936,1459 3923,1455 3910,1449 3901,1451 3893,1447 3877,1443 3868,1448 3856,1445 3844,1449 3832,1447 3822,1445 3806,1440 3795,1434 3791,1422 3782,1422 3771,1420 3760,1417 3746,1406 3738,1410 3731,1413 3722,1409 3725,1402 3722,1397 3715,1385 3704,1375 3695,1373 3690,1378 3678,1374 3668,1382 3656,1381 3644,1382 3632,1377 3620,1375 3615,1370 3610,1365 3616,1358 3622,1350 3628,1346 3634,1343 3633,1335 3631,1332 3622,1326 3615,1325 3608,1327 3601,1324 3594,1321 3600,1314 3606,1309 3616,1303 3619,1300 3624,1296 3626,1291 3621,1290 3615,1290 3608,1291 3599,1296 3588,1302 3575,1308 3568,1314 3563,1320 3555,1324 3545,1327 3534,1328 3531,1335 3528,1340 3520,1342 3505,1342 3498,1342 3486,1347 3470,1357 3458,1366 3448,1374 3436,1376 3425,1377 3412,1384 3401,1397 3396,1410 3387,1418 3378,1416 3376,1405 3383,1390 3389,1379 3384,1377 3376,1384 3366,1387 3356,1391 3347,1392 3339,1399 3325,1406 3320,1417 3310,1423 3300,1430 3287,1434 3274,1433 3252,1440 3246,1446 3235,1455 3224,1460 3215,1457 3205,1460 3198,1466 3191,1474 3185,1482 3173,1484 3162,1488 3152,1496 3144,1504 3132,1512 3125,1519 3116,1528 3109,1538 3101,1547 3093,1556 3084,1562 3073,1568 3062,1571 3048,1573 3037,1574 3025,1574 3017,1581 3005,1588 2997,1596 2990,1606 2980,1614 2972,1621 2960,1625 2948,1626 2937,1628 2924,1628 2912,1628 2905,1628 2890,1627 2877,1627 2864,1627 2854,1632 2843,1635 2831,1639 2819,1637 2808,1635 2798,1635 2785,1638 2773,1642 2762,1649 2756,1657 2764,1659 2774,1662 2785,1667 2797,1669 2810,1674 2820,1678 2830,1687 2835,1698 2839,1709 2841,1721 2842,1751 2850,1744 2859,1736 2867,1728 2876,1719 2885,1715 2897,1711 2909,1708 2921,1707 2933,1707 2944,1708 2953,1701 2964,1705 2976,1716 2991,1719 3009,1726 3019,1733 3034,1723 3045,1719 3061,1714 3080,1711 3099,1710 3111,1715 3120,1718 3135,1719 3144,1723 3155,1729 3167,1733 3177,1738 3191,1736 3207,1732 3212,1747 3217,1758 3223,1771 3226,1783 3230,1794 3233,1807 3237,1817 3242,1827 3250,1839 3255,1847 3264,1855 3275,1863 3281,1870 3289,1879 3298,1887 3310,1893 3318,1897 3330,1904 3341,1909 3352,1913 3363,1917 3375,1920 3387,1926 3397,1933 3405,1941 3414,1948 3424,1955 3423,1968 3422,1978 3421,1991 3418,2002 3412,2013 3410,2025 3410,2036 3411,2045 3415,2059 3418,2070 3420,2083 3426,2094 3433,2104 3443,2114 3460,2128 3471,2133 3494,2145 3512,2155 3525,2163 3533,2171 3539,2182 3542,2194 3541,2204 3542,2214 3541,2228 3540,2240 3531,2250 3529,2263 3528,2275 3533,2287 3527,2300 3529,2313 3529,2325 3524,2335 3522,2351 3533,2356 3551,2352 3572,2346 3579,2341 3590,2339 3611,2339 3641,2341 3660,2344 3675,2347 3690,2359 3697,2374 3701,2392 3705,2415 3702,2429 3688,2447 3686,2463 3685,2477 3690,2494 3701,2519 3711,2544 3721,2567 3727,2594 3732,2618 3741,2643 3738,2657 3737,2669 3734,2693 3727,2704 3722,2716 3712,2721 3698,2724 3687,2730 3676,2734 3665,2740 3656,2745 3652,2758 3648,2769 3645,2778 3639,2785 3627,2787 3615,2783 3603,2782 3590,2784 3578,2787 3566,2793 3555,2797 3545,2801 3534,2805 3526,2813 3518,2824 3510,2833 3502,2842 3492,2848 3482,2851 3470,2856 3459,2862 3447,2866 3437,2866 3425,2865 3412,2861 3400,2861 3393,2854 3385,2835 3381,2822 3373,2812 3367,2801 3361,2791 3356,2773 3359,2756 3361,2745 3360,2739 3377,2733 3383,2728 3380,2719 3374,2713 3359,2702 3347,2696 3329,2698 3318,2701 3296,2704 3280,2707 3261,2709 3249,2706 3235,2700 3223,2696 3210,2690 3202,2681 3191,2673 3181,2666 3171,2660 3161,2652 3156,2645 3158,2629 3160,2624 3156,2612 3149,2610 3140,2616 3133,2621 3122,2630 3121,2641 3119,2650 3106,2656 3102,2670 3100,2683 3098,2691 3106,2703 3121,2735 3110,2742 3068,2811 3051,2819 3040,2838 3012,2847 2974,2857 2947,2872 2908,2881 2888,2895 2877,2908 2855,2916 2822,2926 2801,2928 2765,2938 2732,2930 2720,2921 2708,2917 2689,2899 2673,2887 2653,2880 2635,2879 2613,2873 2589,2865 2546,2855 2536,2848 2534,2839 2529,2825 2521,2812 2507,2807 2497,2810 2481,2815 2472,2821 2469,2829 2453,2822 2442,2817 2434,2819 2427,2821 2418,2826 2409,2842 2404,2854 2406,2863 2406,2879 2403,2891 2398,2906 2391,2917 2384,2922 2378,2927 2370,2938 2380,2939 2387,2934 2400,2930 2406,2930 2421,2932 2428,2935 2439,2940 2445,2943 2451,2942 2459,2935 2466,2932 2479,2928 2484,2929 2491,2938 2499,2947 2511,2949 2520,2954 2533,2951 2544,2958 2555,2967 2570,2972 2583,2964 2591,2970 2596,2977 2605,2988 2613,2991 2624,2985 2628,2976 2639,2973 2645,2982 2654,2988 2665,2991 2674,2991 2679,2998 2689,3003 2699,3008 2704,3015 2712,3027 2719,3025 2727,3032 2738,3040 2769,3040 2776,3037 2797,3029 2808,3025 2817,3018 2830,3014 2845,3010 2845,3010 2850,3002 2860,3000 2863,2993 2881,3007 2903,3014 2909,3003 2921,2993 2936,2993 2947,2997 2968,3002 2981,3005 2996,3006 2996,3006 3009,2994 3020,2998 3037,3004 3048,3007 3065,3007 3076,3004 3093,3006 3103,3010 3101,3018 3109,3019 3117,3014 3127,3008 3140,3001 3146,2995 3147,2983 3154,2975 3164,2962 3174,2947 3184,2938 3188,2929 3199,2921 3194,2905 3189,2900 3193,2883 3204,2869 3214,2868 3221,2876 3232,2877 3239,2891 3244,2900 3258,2911 3287,2919 3296,2918 3305,2911 3319,2915 3341,2920 3373,2918 3378,2910 3387,2914 3394,2923 3411,2929 3424,2934 3440,2944 3451,2955 3463,2967 3472,2976 3481,2987 3500,2987 3513,2991 3526,2998 3531,3008 3540,3022 3539,3035 3557,3043 3589,3048 3605,3053 3619,3068 3631,3086 3645,3106 3653,3121 3655,3134 3660,3143 3655,3155 3661,3171 3676,3182 3692,3186 3703,3193 3717,3195 3722,3187 3725,3179 3735,3160 3745,3163 3754,3162 3766,3158 3772,3153 3771,3138 3777,3130 3785,3124 3793,3122 3803,3118 3813,3122 3819,3120 3823,3111 3829,3105 3833,3098 3833,3091 3831,3080 3821,3062 3822,3051 3822,3041 3825,3034 3829,3028 3835,3019 3841,3013 3846,3006 3844,2996 3835,2992 3831,2982 3822,2961 3794,2959 3792,2949 3802,2945 3803,2922 3801,2908 3800,2898 3804,2884 3805,2869 3785,2853 3788,2843 3809,2849 3817,2846 3824,2848 3840,2861 3855,2869 3883,2889 3913,2910 3924,2909 3937,2918 3953,2919 3968,2909 3979,2915 3993,2918 3998,2929 4005,2940 4031,2943 4043,2947 4061,2945 4073,2930 4088,2933 4105,2933 4116,2921 4122,2914 4118,2902 4125,2892 4131,2882 4129,2868 4132,2856 4135,2841 4135,2826 4129,2817 4132,2806 4129,2797 4124,2788 4125,2777 4130,2771 4141,2768 4151,2765 4160,2759 4163,2753 4163,2746 4155,2737 4146,2732 4142,2728 4136,2721 4139,2713 4147,2705 4152,2697 4152,2697 4150,2690 4154,2684 4160,2676 4166,2669 4174,2666 4179,2667 4186,2672 4191,2674 4196,2681 4197,2697 4203,2706 4207,2718 4211,2728 4221,2734 4236,2735 4244,2741 4252,2747 4261,2748 4270,2750 4277,2747 4279,2739 4288,2742 4290,2750 4297,2756 4305,2760 4315,2762 4326,2763 4339,2768 4350,2773 4356,2780 4369,2787 4377,2793 4387,2799 4397,2803',
            '3451,3291 3462,3293 3475,3296 3491,3302 3502,3303 3509,3302 3520,3301 3529,3301 3536,3310 3542,3319 3539,3327 3530,3337 3530,3337 3523,3346 3516,3353 3521,3359 3533,3356 3543,3360 3555,3356 3559,3361 3555,3371 3549,3375 3547,3383 3552,3391 3557,3398 3560,3408 3562,3414 3566,3421 3573,3420 3579,3422 3582,3425 3576,3431 3571,3437 3563,3445 3559,3454 3554,3466 3554,3478 3558,3487 3566,3496 3577,3503 3586,3508 3597,3513 3602,3516 3605,3530 3607,3541 3608,3550 3611,3560 3614,3567 3617,3577 3617,3588 3617,3599 3606,3601 3596,3605 3588,3610 3580,3617 3571,3625 3564,3632 3560,3639 3554,3645 3546,3654 3535,3660 3526,3665 3514,3671 3508,3675 3507,3684 3503,3691 3495,3698 3487,3706 3477,3712 3468,3716 3452,3709 3439,3705 3429,3702 3419,3697 3405,3694 3394,3690 3384,3688 3372,3686 3361,3683 3348,3680 3338,3676 3326,3673 3312,3668 3304,3659 3301,3649 3297,3638 3289,3627 3282,3621 3273,3612 3267,3603 3253,3595 3251,3586 3249,3576 3251,3562 3248,3553 3244,3543 3238,3531 3243,3525 3253,3525 3262,3522 3270,3519 3277,3515 3283,3518 3287,3516 3286,3512 3292,3509 3300,3509 3311,3506 3316,3504 3320,3495 3325,3486 3329,3476 3332,3468 3338,3462 3345,3458 3345,3453 3342,3449 3342,3440 3344,3435 3338,3427 3335,3423 3333,3418 3337,3416 3343,3415 3349,3412 3353,3405 3363,3399 3371,3394 3382,3391 3388,3391 3396,3396 3403,3390 3408,3385 3417,3380 3423,3376 3430,3372 3435,3369 3438,3364 3440,3358 3442,3351 3444,3343 3444,3335 3444,3330 3438,3324 3433,3318 3433,3311 3436,3305 3441,3299 3444,3294',
            '3937,3402 3937,3413 3939,3424 3939,3430 3943,3437 3949,3446 3954,3458 3956,3467 3961,3478 3962,3491 3964,3504 3966,3513 3970,3521 3976,3526 3986,3530 3998,3532 4007,3534 4018,3535 4026,3533 4036,3528 4048,3528 4062,3527 4070,3523 4077,3517 4082,3510 4090,3504 4098,3501 4101,3491 4109,3485 4117,3478 4126,3475 4136,3473 4142,3474 4150,3481 4159,3487 4171,3491 4180,3498 4186,3506 4196,3514 4209,3520 4221,3524 4229,3532 4238,3540 4251,3545 4261,3541 4273,3536 4285,3532 4295,3527 4304,3519 4313,3513 4323,3504 4331,3497 4341,3492 4354,3488 4362,3478 4369,3468 4375,3457 4384,3450 4395,3444 4402,3451 4411,3458 4425,3461 4436,3460 4442,3465 4448,3473 4452,3480 4453,3490 4454,3503 4456,3526 4466,3536 4476,3543 4487,3551 4502,3564 4512,3573 4522,3583 4530,3589 4538,3600 4546,3609 4554,3612 4567,3615 4579,3617 4591,3618 4603,3621 4610,3611 4620,3591 4628,3574 4621,3566 4615,3553 4611,3548 4606,3536 4602,3527 4592,3524 4594,3518 4597,3508 4592,3499 4583,3491 4577,3487 4569,3477 4562,3471 4552,3467 4547,3459 4539,3457 4535,3450 4541,3448 4544,3442 4549,3433 4549,3423 4545,3415 4536,3406 4527,3399 4521,3387 4512,3383 4507,3372 4501,3364 4492,3366 4486,3359 4479,3353 4471,3347 4469,3341 4468,3334 4477,3332 4483,3326 4483,3316 4479,3302 4474,3296 4461,3292 4455,3286 4449,3283 4446,3275 4436,3270 4417,3270 4400,3268 4390,3274 4384,3281 4380,3282 4378,3275 4369,3274 4364,3279 4360,3284 4354,3292 4350,3299 4348,3307 4335,3315 4330,3322 4319,3326 4309,3332 4304,3337 4295,3343 4285,3346 4275,3351 4264,3355 4256,3359 4249,3362 4243,3371 4250,3381 4242,3390 4235,3383 4227,3381 4220,3377 4214,3373 4203,3374 4195,3375 4191,3371 4182,3371 4175,3372 4170,3375 4166,3378 4164,3383 4163,3388 4154,3391 4151,3385 4144,3383 4137,3381 4130,3378 4120,3369 4113,3367 4106,3363 4101,3358 4095,3356 4080,3343 4073,3344 4064,3335 4057,3335 4051,3332 4045,3326 4034,3323 4029,3317 4021,3316 4013,3316 4008,3318 4000,3322 3995,3327 3991,3331 3985,3336 3977,3341 3972,3345 3973,3351 3968,3353 3965,3353 3960,3359 3958,3365 3957,3369 3959,3377 3951,3387 3950,3396 3944,3400',
            '3983,3259 3980,3250 3980,3245 3986,3238 3991,3233 3998,3230 3999,3222 4003,3216 4016,3212 4025,3209 4036,3209 4043,3212 4051,3213 4063,3212 4068,3215 4065,3223 4057,3227 4048,3232 4040,3235 4037,3242 4034,3249 4027,3253 4021,3257 4014,3257 4009,3258 4002,3259 3995,3258 3989,3260',
            '4037,3262 4040,3255 4047,3251 4053,3245 4056,3238 4067,3234 4076,3238 4082,3238 4092,3236 4095,3232 4105,3229 4110,3227 4119,3228 4129,3233 4139,3239 4143,3245 4153,3242 4161,3238 4169,3234 4177,3229 4187,3228 4198,3227 4205,3228 4214,3234 4218,3241 4221,3250 4218,3256 4214,3264 4211,3269 4203,3270 4198,3269 4199,3276 4198,3281 4189,3285 4185,3290 4180,3296 4174,3299 4171,3301 4164,3298 4156,3291 4151,3294 4143,3297 4134,3296 4126,3294 4122,3296 4112,3295 4107,3292 4101,3285 4098,3286 4091,3284 4084,3283 4078,3281 4073,3277 4067,3276 4065,3273 4061,3271 4056,3271 4050,3272 4044,3270 4040,3267',
            '5327,2685 5333,2681 5333,2675 5339,2672 5348,2669 5357,2664 5365,2661 5370,2657 5383,2653 5394,2653 5403,2654 5415,2656 5424,2657 5431,2662 5439,2665 5440,2671 5446,2671 5444,2679 5444,2686 5448,2691 5448,2698 5452,2699 5459,2698 5461,2694 5462,2688 5466,2683 5470,2679 5476,2673 5476,2673 5484,2671 5493,2670 5500,2672 5510,2674 5510,2683 5517,2686 5521,2688 5523,2693 5525,2699 5528,2708 5528,2716 5528,2722 5525,2727 5529,2732 5525,2741 5521,2744 5515,2746 5508,2752 5502,2751 5494,2757 5487,2762 5480,2760 5471,2755 5465,2752 5459,2751 5455,2755 5447,2757 5439,2760 5433,2762 5428,2766 5426,2769 5423,2774 5424,2780 5419,2780 5416,2780 5411,2779 5405,2773 5402,2765 5398,2760 5395,2752 5394,2745 5392,2740 5386,2735 5378,2727 5376,2723 5371,2717 5368,2712 5364,2709 5358,2708 5350,2707 5343,2705 5335,2702 5331,2697 5329,2692',
            '5543,2790 5536,2791 5532,2795 5534,2802 5534,2809 5537,2812 5546,2814 5549,2811 5547,2806 5544,2800 5545,2794',
            '5539,2773 5545,2769 5550,2762 5554,2755 5562,2752 5567,2747 5570,2743 5572,2737 5577,2732 5579,2724 5581,2716 5579,2706 5587,2702 5593,2698 5595,2691 5596,2684 5603,2681 5610,2683 5610,2683 5611,2687 5616,2690 5613,2692 5616,2698 5614,2704 5621,2710 5632,2714 5631,2718 5640,2719 5646,2720 5653,2725 5654,2732 5660,2738 5659,2742 5657,2747 5655,2751 5660,2755 5657,2761 5660,2765 5659,2770 5659,2775 5662,2780 5662,2783 5659,2786 5659,2791 5655,2794 5648,2794 5641,2796 5636,2795 5631,2792 5624,2791 5618,2789 5614,2785 5610,2780 5606,2776 5600,2771 5593,2769 5588,2770 5583,2770 5578,2770 5571,2770 5568,2773 5561,2773 5558,2779 5553,2780 5546,2780 5541,2778',

        ]
    },
    {
        id: 'piltover',
        name: 'Piltover',
        nameEn: 'Piltover',
        description: 'Cité Prospère d\'Innovation',
        descriptionEn: 'Wealthy City of Innovation',
        icon: '/images/Piltover.png',
        color: '#f5a623ff',
        circles: [
            '4566,2996,55'
        ]
    },
    {
        id: 'zaun',
        name: 'Zaun',
        nameEn: 'Zaun',
        description: 'Ville Basse Industrielle Polluée',
        descriptionEn: 'Polluted Industrial Undercity',
        icon: '/images/Zaun.png',
        color: '#f5a623ff',
        circles: [
            '4558,3069,55'
        ]
    },
    {
        id: 'ionia',
        name: 'Ionia',
        nameEn: 'Ionia',
        description: 'Ville Basse Industrielle Polluée',
        descriptionEn: 'Polluted Industrial Undercity',
        icon: '/images/Ionia.png',
        color: '#a82feeff',
        polygons: [
            '6209,1172 6215,1159 6219,1158 6221,1154 6221,1146 6224,1138 6227,1132 6233,1131 6236,1127 6241,1125 6245,1127 6247,1130 6248,1137 6253,1143 6252,1148 6253,1153 6252,1159 6248,1166 6241,1169 6233,1175 6226,1177 6218,1180 6212,1178',
        ]
    },
    // TODO: Add other regions here with their coordinates from image-map.net
];

interface MapClientProps {
    locale: string;
}

export default function MapClient({ locale }: MapClientProps) {
    const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
    const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
    const router = useRouter();

    // Zoom and Pan states
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [hasDragged, setHasDragged] = useState(false); // Track if user actually dragged

    // Editor mode states
    const [isEditorMode, setIsEditorMode] = useState(false);
    const [editorPoints, setEditorPoints] = useState<{ x: number, y: number }[]>([]);
    const [editorShape, setEditorShape] = useState<'polygon' | 'circle'>('polygon');
    const [editorCircleCenter, setEditorCircleCenter] = useState<{ x: number, y: number } | null>(null);
    const [draggedPointIndex, setDraggedPointIndex] = useState<number | null>(null);

    const handleRegionClick = (region: Region) => {
        setSelectedRegion(region);
    };

    const handleViewChampions = () => {
        if (selectedRegion) {
            router.push(`/?region=${selectedRegion.id}`);
        }
    };

    // Zoom handlers - Simple zoom at center
    const handleWheel = (e: React.WheelEvent) => {
        e.preventDefault();
        const delta = e.deltaY * -0.001;
        const newScale = Math.min(Math.max(0.85, scale + delta), 20); // Limit zoom between 0.5x and 5x
        setScale(newScale);
    };

    // Pan handlers
    const handleMouseDown = (e: React.MouseEvent) => {
        if (e.button === 0) { // Left click only
            setIsDragging(true);
            setHasDragged(false); // Reset drag flag
            setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isDragging) {
            setHasDragged(true); // User is dragging
            const newX = e.clientX - dragStart.x;
            const newY = e.clientY - dragStart.y;

            // Calculate boundaries to keep at least 20% of the map visible
            const maxOffset = Math.max(window.innerWidth, window.innerHeight) * scale * 0.8;

            // Constrain position
            const constrainedX = Math.min(Math.max(newX, -maxOffset), maxOffset);
            const constrainedY = Math.min(Math.max(newY, -maxOffset), maxOffset);

            setPosition({
                x: constrainedX,
                y: constrainedY
            });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        // hasDragged will be checked in region click handlers
    };

    // Reset zoom and pan
    const handleReset = () => {
        setScale(1);
        setPosition({ x: 0, y: 0 });
    };

    // Editor mode functions
    const handleEditorClick = (e: React.MouseEvent<SVGSVGElement>) => {
        if (!isEditorMode || hasDragged) return;

        const svg = e.currentTarget;
        const pt = svg.createSVGPoint();
        pt.x = e.clientX;
        pt.y = e.clientY;

        // Transform the point to SVG coordinates
        const svgP = pt.matrixTransform(svg.getScreenCTM()?.inverse());

        const svgX = Math.round(svgP.x);
        const svgY = Math.round(svgP.y);

        if (editorShape === 'polygon') {
            setEditorPoints([...editorPoints, { x: svgX, y: svgY }]);
        } else if (editorShape === 'circle') {
            if (!editorCircleCenter) {
                setEditorCircleCenter({ x: svgX, y: svgY });
            } else {
                // Calculate radius
                const dx = svgX - editorCircleCenter.x;
                const dy = svgY - editorCircleCenter.y;
                const radius = Math.round(Math.sqrt(dx * dx + dy * dy));

                // Copy to clipboard
                const circleString = `'${editorCircleCenter.x},${editorCircleCenter.y},${radius}'`;
                navigator.clipboard.writeText(circleString);
                alert(`Circle copied to clipboard:\n${circleString}`);

                // Reset
                setEditorCircleCenter(null);
            }
        }
    };

    const clearEditor = () => {
        setEditorPoints([]);
        setEditorCircleCenter(null);
    };

    const exportPolygon = () => {
        if (editorPoints.length < 3) {
            alert('Need at least 3 points for a polygon');
            return;
        }

        const polygonString = editorPoints.map(p => `${p.x},${p.y}`).join(' ');
        navigator.clipboard.writeText(`'${polygonString}'`);
        alert(`Polygon copied to clipboard!\n${editorPoints.length} points`);
    };

    const undoLastPoint = () => {
        setEditorPoints(editorPoints.slice(0, -1));
    };

    // Point dragging functions
    const handlePointMouseDown = (e: React.MouseEvent, index: number) => {
        e.stopPropagation();
        setDraggedPointIndex(index);
    };

    const handleSvgMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
        if (draggedPointIndex !== null) {
            const svg = e.currentTarget;
            const pt = svg.createSVGPoint();
            pt.x = e.clientX;
            pt.y = e.clientY;

            const svgP = pt.matrixTransform(svg.getScreenCTM()?.inverse());
            const svgX = Math.round(svgP.x);
            const svgY = Math.round(svgP.y);

            const newPoints = [...editorPoints];
            newPoints[draggedPointIndex] = { x: svgX, y: svgY };
            setEditorPoints(newPoints);
        }
    };

    const handlePointMouseUp = () => {
        setDraggedPointIndex(null);
    };

    const isEn = locale.startsWith('en');

    return (
        <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-b from-gray-900 to-black select-none overflow-hidden">
            {/* Map Container - Full Screen with Zoom and Pan */}
            <div
                className="relative w-full h-full"
                onWheel={handleWheel}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                style={{
                    cursor: isDragging ? 'grabbing' : 'grab',
                    transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                    transformOrigin: 'center',
                    transition: isDragging ? 'none' : 'transform 0.1s ease-out',
                    userSelect: 'none',
                    WebkitUserSelect: 'none',
                    MozUserSelect: 'none',
                    msUserSelect: 'none'
                }}
            >
                {/* Base Map Image */}
                <Image
                    src="/images/runeterra-map.png"
                    alt="Carte de Runeterra"
                    fill
                    className="object-contain pointer-events-none"
                    priority
                />

                {/* SVG Overlay for Interactive Regions */}
                <svg
                    viewBox="0 0 9181 5880"
                    className="absolute inset-0 w-full h-full"
                    style={{
                        pointerEvents: isEditorMode ? 'auto' : 'none',
                        cursor: isEditorMode ? 'crosshair' : 'default'
                    }}
                    onClick={handleEditorClick}
                    onMouseMove={handleSvgMouseMove}
                    onMouseUp={handlePointMouseUp}
                >
                    {regions.map((region) => (
                        <>
                            {/* Render polygons if they exist */}
                            {region.polygons?.map((polygon, index) => (
                                <motion.polygon
                                    key={`${region.id}-polygon-${index}`}
                                    points={polygon}
                                    fill={region.color}
                                    fillOpacity={hoveredRegion === region.id ? 0.5 : 0.2}
                                    stroke={region.color}
                                    strokeWidth="0.5"
                                    className="cursor-pointer transition-all"
                                    style={{ pointerEvents: 'auto' }}
                                    onMouseEnter={() => setHoveredRegion(region.id)}
                                    onMouseLeave={() => setHoveredRegion(null)}
                                    onClick={() => {
                                        if (!hasDragged) {
                                            handleRegionClick(region);
                                        }
                                    }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                />
                            ))}

                            {/* Render circles if they exist */}
                            {region.circles?.map((circle, index) => {
                                const [cx, cy, r] = circle.split(',').map(Number);
                                return (
                                    <motion.circle
                                        key={`${region.id}-circle-${index}`}
                                        cx={cx}
                                        cy={cy}
                                        r={r}
                                        fill={region.color}
                                        fillOpacity={hoveredRegion === region.id ? 0.5 : 0.2}
                                        stroke={region.color}
                                        strokeWidth="2"
                                        className="cursor-pointer transition-all"
                                        style={{ pointerEvents: 'auto' }}
                                        onMouseEnter={() => setHoveredRegion(region.id)}
                                        onMouseLeave={() => setHoveredRegion(null)}
                                        onClick={() => {
                                            if (!hasDragged) {
                                                handleRegionClick(region);
                                            }
                                        }}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    />
                                );
                            })}
                        </>
                    ))}

                    {/* Render region icons/logos */}
                    {regions.map((region) => {
                        if (!region.icon) return null;
                        const center = getRegionCenter(region);
                        if (!center) return null;

                        // Adjust icon size inversely with zoom (smaller when zoomed in)
                        const baseIconSize = 300;
                        const iconSize = baseIconSize / scale;

                        return (
                            <motion.image
                                key={`${region.id}-icon`}
                                href={region.icon}
                                x={center.x - iconSize / 2}
                                y={center.y - iconSize / 2}
                                width={iconSize}
                                height={iconSize}
                                className="pointer-events-none"
                                initial={{ opacity: 0.7 }}
                                whileHover={{ opacity: 1 }}
                                animate={{
                                    opacity: hoveredRegion === region.id ? 1 : 0.7,
                                    scale: hoveredRegion === region.id ? 1.1 : 1
                                }}
                                style={{
                                    filter: hoveredRegion === region.id
                                        ? 'drop-shadow(0 0 10px rgba(255,255,255,0.8))'
                                        : 'drop-shadow(0 0 5px rgba(0,0,0,0.5))'
                                }}
                            />
                        );
                    })}

                    {/* Editor mode visualization */}
                    {isEditorMode && (
                        <>
                            {/* Show polygon being drawn */}
                            {editorShape === 'polygon' && editorPoints.length > 0 && (
                                <>
                                    {/* Polygon preview */}
                                    {editorPoints.length > 2 && (
                                        <polygon
                                            points={editorPoints.map(p => `${p.x},${p.y}`).join(' ')}
                                            fill="rgba(255, 255, 0, 0.3)"
                                            stroke="yellow"
                                            strokeWidth="0.1"
                                            style={{ pointerEvents: 'none' }}
                                        />
                                    )}

                                    {/* Lines between points */}
                                    {editorPoints.map((point, index) => {
                                        if (index === 0) return null;
                                        const prevPoint = editorPoints[index - 1];
                                        return (
                                            <line
                                                key={index}
                                                x1={prevPoint.x}
                                                y1={prevPoint.y}
                                                x2={point.x}
                                                y2={point.y}
                                                stroke="rgba(255, 255, 0, 0.5)"
                                                strokeWidth="1"
                                                style={{ pointerEvents: 'none' }}
                                            />
                                        );
                                    })}

                                    {/* Points */}
                                    {editorPoints.map((point, index) => (
                                        <circle
                                            key={index}
                                            cx={point.x}
                                            cy={point.y}
                                            r="2"
                                            fill={draggedPointIndex === index ? "orange" : "yellow"}
                                            stroke="black"
                                            strokeWidth="1"
                                            style={{ pointerEvents: 'auto', cursor: 'crosshair' }}
                                            onMouseDown={(e) => handlePointMouseDown(e, index)}
                                        />
                                    ))}
                                </>
                            )}

                            {/* Show circle being drawn */}
                            {editorShape === 'circle' && editorCircleCenter && (
                                <circle
                                    cx={editorCircleCenter.x}
                                    cy={editorCircleCenter.y}
                                    r="15"
                                    fill="cyan"
                                    stroke="black"
                                    strokeWidth="2"
                                    style={{ pointerEvents: 'none' }}
                                />
                            )}
                        </>
                    )}
                </svg>

                {/* Navigation Button - Champions Page */}
                <div className="absolute top-4 right-4 z-10">
                    <button
                        onClick={() => router.push('/')}
                        className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-bold px-6 py-3 rounded-full shadow-lg transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                        </svg>
                        {isEn ? 'Champions' : 'Champions'}
                    </button>
                </div>

                {/* Region Labels (on hover) */}
                {hoveredRegion && (
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md px-6 py-3 rounded-full border border-yellow-500/50 pointer-events-none">
                        <p className="text-yellow-400 font-bold text-lg">
                            {regions.find(r => r.id === hoveredRegion)?.[isEn ? 'nameEn' : 'name']}
                        </p>
                    </div>
                )}
            </div>

            {/* Zoom Controls - Fixed position outside transformed container */}
            <div className="absolute bottom-4 left-4 z-20 flex flex-col gap-2">
                <button
                    onClick={() => setScale(Math.min(scale + 0.2, 5))}
                    className="bg-black/60 hover:bg-black/80 text-white p-3 rounded-lg shadow-lg transition-all hover:scale-110"
                    title={isEn ? "Zoom in" : "Zoomer"}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                </button>
                <button
                    onClick={() => setScale(Math.max(scale - 0.2, 0.5))}
                    className="bg-black/60 hover:bg-black/80 text-white p-3 rounded-lg shadow-lg transition-all hover:scale-110"
                    title={isEn ? "Zoom out" : "Dézoomer"}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                </button>
                <button
                    onClick={handleReset}
                    className="bg-black/60 hover:bg-black/80 text-white p-3 rounded-lg shadow-lg transition-all hover:scale-110"
                    title={isEn ? "Reset view" : "Réinitialiser"}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                    </svg>
                </button>
                <div className="bg-black/60 text-white text-xs px-2 py-1 rounded text-center">
                    {Math.round(scale * 100)}%
                </div>
            </div>

            {/* Editor Controls - Fixed position */}
            <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                <button
                    onClick={() => setIsEditorMode(!isEditorMode)}
                    className={`${isEditorMode ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-black/60 hover:bg-black/80'} text-white px-4 py-2 rounded-lg shadow-lg transition-all font-bold`}
                    title="Toggle Editor Mode"
                >
                    {isEditorMode ? '🛠️ Editor ON' : '🛠️ Editor OFF'}
                </button>

                {isEditorMode && (
                    <>
                        <div className="bg-black/80 text-white px-3 py-2 rounded-lg text-sm">
                            <div className="font-bold mb-1">Shape:</div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setEditorShape('polygon')}
                                    className={`px-3 py-1 rounded ${editorShape === 'polygon' ? 'bg-yellow-500' : 'bg-gray-600'}`}
                                >
                                    Polygon
                                </button>
                                <button
                                    onClick={() => setEditorShape('circle')}
                                    className={`px-3 py-1 rounded ${editorShape === 'circle' ? 'bg-cyan-500' : 'bg-gray-600'}`}
                                >
                                    Circle
                                </button>
                            </div>
                        </div>

                        {editorShape === 'polygon' && (
                            <div className="bg-black/80 text-white px-3 py-2 rounded-lg text-sm">
                                <div className="font-bold">Points: {editorPoints.length}</div>
                                <div className="flex flex-col gap-1 mt-2">
                                    <button
                                        onClick={exportPolygon}
                                        disabled={editorPoints.length < 3}
                                        className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 px-3 py-1 rounded text-xs"
                                    >
                                        📋 Export
                                    </button>
                                    <button
                                        onClick={undoLastPoint}
                                        disabled={editorPoints.length === 0}
                                        className="bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 px-3 py-1 rounded text-xs"
                                    >
                                        ↶ Undo
                                    </button>
                                    <button
                                        onClick={clearEditor}
                                        className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-xs"
                                    >
                                        🗑️ Clear
                                    </button>
                                </div>
                            </div>
                        )}

                        {editorShape === 'circle' && (
                            <div className="bg-black/80 text-white px-3 py-2 rounded-lg text-sm">
                                <div className="font-bold mb-1">Circle Mode:</div>
                                <div className="text-xs">
                                    {!editorCircleCenter ? '1. Click center' : '2. Click edge'}
                                </div>
                                <button
                                    onClick={clearEditor}
                                    className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-xs mt-2 w-full"
                                >
                                    🗑️ Clear
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Region Detail Panel */}
            <AnimatePresence>
                {selectedRegion && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setSelectedRegion(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-gray-800 rounded-2xl p-8 max-w-md w-full border-2 shadow-2xl relative"
                            style={{ borderColor: selectedRegion.color }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setSelectedRegion(null)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                            >
                                <X size={24} />
                            </button>

                            {/* Region Name */}
                            <h2
                                className="text-4xl font-bold mb-4"
                                style={{ color: selectedRegion.color }}
                            >
                                {selectedRegion[isEn ? 'nameEn' : 'name']}
                            </h2>

                            {/* Region Description */}
                            <p className="text-gray-300 mb-6 text-lg">
                                {selectedRegion[isEn ? 'descriptionEn' : 'description']}
                            </p>

                            {/* Action Button */}
                            <button
                                onClick={handleViewChampions}
                                className="w-full py-3 rounded-lg font-bold text-white transition-all hover:scale-105 active:scale-95 shadow-lg"
                                style={{ backgroundColor: selectedRegion.color }}
                            >
                                {isEn ? 'View Champions' : 'Voir les Champions'}
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
