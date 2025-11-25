// src/app/page.tsx
import { fetchAllChampions } from "@/lib/data";
import ChampionCard from "@/components/ChampionCard"; // On importe notre composant

export default async function Home() {
  // 1. Récupération des données (s'exécute côté serveur)
  const champions = await fetchAllChampions();
  
  // Tri optionnel pour le fun, par ordre alphabétique du nom
  const sortedChampions = champions.sort((a, b) => a.name.localeCompare(b.name));

  return (
    <main className="min-h-screen bg-gray-900 p-8">
      
      {/* --- Header/Titre --- */}
      <h1 className="text-6xl font-bold text-yellow-500 text-center mb-4">
        RuneDex
      </h1>
      <p className="text-xl text-gray-400 text-center mb-12">
        Base de données complète de {champions.length} champions
      </p>

      {/* --- Grille des Champions --- */}
      <section 
        className="
          grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 
          xl:grid-cols-9 2xl:grid-cols-10 
          gap-4 max-w-7xl mx-auto
        "
      >
        {/* 2. On itère sur le tableau des champions pour créer une carte par champion */}
        {sortedChampions.map((champion) => (
          <ChampionCard 
            key={champion.id} 
            champion={champion} 
          />
        ))}
      </section>
      
      {/* Note : Le composant Image de Next.js gère la mise en cache des images de Riot */}
    </main>
  );
}