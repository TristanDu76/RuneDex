// src/app/champion/[championId]/page.tsx
import React from 'react';
import { fetchChampionDetails, fetchAllChampions } from "@/lib/data"; // Import des fonctions de données

// Interface pour les props de la page
interface ChampionPageProps {
  // Le 'params' est bien une Promise pour l'App Router, comme vous l'avez identifié
  params: Promise<{
    championId: string;
  }>;
}

export default async function ChampionPage({ params }: ChampionPageProps) {
  const { championId } = await params; // Votre correction: on 'await' les params

  // ASTUCE: On récupère la version la plus récente en appelant la liste de champions
  const allChampions = await fetchAllChampions();
  const latestVersion = allChampions.length > 0 ? allChampions[0].version : '15.23.1'; 
  
  // 1. Récupération des données DETAILED spécifiques au champion
  const championDetails = await fetchChampionDetails(championId, latestVersion);
  
  if (!championDetails) {
    return <main className="text-white p-8">Champion non trouvé ou erreur de données.</main>;
  }

  // 2. Préparation des données pour l'affichage
  const { name, title, lore, blurb } = championDetails;
  // Construction de l'URL du Splash Art (background)
  const splashArtUrl = `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${championId}_0.jpg`;


  return (
    <main className="min-h-screen bg-gray-900 text-white">
      {/* Bannière de fond (Splash Art) */}
      <div 
        className="h-96 bg-center bg- flex items-end p-8 shadow-inner" 
        style={{ backgroundImage: `url(${splashArtUrl})` }}
      >
        <div className="bg-gray-900/70 p-4 rounded-lg">
          <h1 className="text-5xl font-extrabold text-white">{name}</h1>
          <p className="text-xl text-yellow-400">{title}</p>
        </div>
      </div>
      
      {/* Contenu principal : Lore */}
      <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl text-gray-200 mb-4 border-b border-gray-700 pb-2">Lore & Biographie</h2>
        <p className="text-gray-300 text-lg mb-6 italic">{blurb}</p>
        {/* Le lore complet, avec l'espace blanc préservé pour les sauts de ligne */}
        <p className="text-gray-400 leading-relaxed whitespace-pre-line">{lore}</p>
      </div>
    </main>
  );
}