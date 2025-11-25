import axios from 'axios';

import { ChampionData } from '@/types/champion'; 

interface ChampionListResponse {
  data: { [key: string]: Omit<ChampionData, 'version'> };
}

export async function fetchAllChampions() {
  try {
    const versionResponse = await axios.get<string[]>('https://ddragon.leagueoflegends.com/api/versions.json');
    const latestVersion = versionResponse.data[0];

    console.log(`Version du jeu Data Dragon : ${latestVersion}`);

    const championListUrl = `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/fr_FR/champion.json`;
    
    const championsResponse = await axios.get<ChampionListResponse>(championListUrl);

    const championMap = championsResponse.data.data;
    
    const championsArray: ChampionData[] = Object.values(championMap).map(champ => ({
      ...champ,
      version: latestVersion
    }));
    
    return championsArray;

  } catch (error) {
    console.error("Erreur lors de la récupération des champions :", error);
    return [];
  }
}

interface DetailedChampionResponse {
  data: { [key: string]: ChampionData & { lore: string; skins: any[] } };
}

/**
 * Récupère toutes les données détaillées d'un champion spécifique.
 * @param championId L'ID du champion (ex: 'Aatrox').
 * @param version La version du jeu (ex: '15.23.1').
 * @returns Les données détaillées du champion, y compris le Lore complet.
 */
export async function fetchChampionDetails(championId: string, version: string) {
  try {
    const url = `https://ddragon.leagueoflegends.com/cdn/${version}/data/fr_FR/champion/${championId}.json`;
    
    const response = await axios.get<DetailedChampionResponse>(url);
    
    // Les données sont imbriquées dans 'data', puis par l'ID du champion (ex: response.data.data.Aatrox)
    const details = response.data.data[championId];

    if (!details) {
      throw new Error(`Champion details not found for ID: ${championId}`);
    }

    return details;
  } catch (error) {
    console.error(`Erreur lors de la récupération des détails pour ${championId}:`, error);
    return null;
  }
}