// src/app/page.tsx
import { fetchAllChampions } from "@/lib/data";
import ChampionGrid from "@/components/ChampionGrid";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import Image from "next/image";
import { getTranslation } from "@/lib/translations";

interface HomeProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const locale = (params.lang as string) || 'fr_FR';
  const t = getTranslation(locale);

  // 1. Récupération des données (s'exécute côté serveur)
  const champions = await fetchAllChampions(locale);

  // Tri optionnel pour le fun, par ordre alphabétique du nom
  const sortedChampions = champions.sort((a, b) => a.name.localeCompare(b.name));

  return (
    <main className="min-h-screen bg-gray-900 p-8 relative">
      <LanguageSwitcher />

      {/* --- Header/Titre --- */}
      <div className="flex flex-col items-center mb-8 mt-8">
        <Image
          src="/LogoRuneDex.png"
          alt="RuneDex Logo"
          width={400}
          height={150}
          className="w-auto h-32 object-contain mb-4"
          priority
        />
        <h1 className="text-6xl font-bold text-yellow-500 text-center tracking-tight" style={{ textShadow: '0 4px 20px rgba(234, 179, 8, 0.2)' }}>
          RuneDex
        </h1>
      </div>

      {/* --- Grille des Champions avec Recherche --- */}
      <ChampionGrid champions={sortedChampions} lang={locale} />

      {/* Note : Le composant Image de Next.js gère la mise en cache des images de Riot */}
    </main>
  );
}