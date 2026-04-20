import WithNavLayout from "@/components/layout/WithNavLayout";

export default async function ChampionRouteLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    return <WithNavLayout locale={locale}>{children}</WithNavLayout>;
}
