import axios from 'axios';



import { ChampionData } from '@/types/champion';

interface ChampionListResponse {
  data: { [key: string]: Omit<ChampionData, 'version'> };
}

export async function fetchAllChampions(locale: string = 'fr_FR') {
  try {
    const versionResponse = await axios.get<string[]>('https://ddragon.leagueoflegends.com/api/versions.json');
    const latestVersion = versionResponse.data[0];

    console.log(`Version du jeu Data Dragon : ${latestVersion}`);

    const championListUrl = `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/${locale}/champion.json`;

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
  data: { [key: string]: ChampionData };
}

/**
 * Récupère les données supplémentaires depuis l'API Universe (Faction, Relations).
 */
async function fetchChampionUniverseDetails(championId: string, locale: string = 'fr_FR') {
  try {
    // 1. Récupérer la liste pour trouver le slug
    // Note: L'API Universe utilise des slugs (ex: "wukong") qui peuvent différer de l'ID DataDragon (ex: "MonkeyKing")
    const browseUrl = `https://universe-meeps.leagueoflegends.com/v1/${locale.toLowerCase()}/champion-browse/index.json`;
    const browseResponse = await axios.get(browseUrl);
    const championsList = (browseResponse.data as any).champions;

    // Trouver le champion correspondant
    // On essaie de matcher par nom ou par slug approximatif
    const championEntry = championsList.find((c: any) =>
      c.slug === championId.toLowerCase() ||
      c.name.toLowerCase() === championId.toLowerCase() ||
      c.slug.replace(/[^a-z0-9]/g, '') === championId.toLowerCase().replace(/[^a-z0-9]/g, '')
    );

    if (!championEntry) {
      console.warn(`Champion slug not found for ID: ${championId}`);
      return null;
    }

    const slug = championEntry.slug;

    // 2. Récupérer les détails du champion
    const detailsUrl = `https://universe-meeps.leagueoflegends.com/v1/${locale.toLowerCase()}/champions/${slug}/index.json`;
    const detailsResponse = await axios.get(detailsUrl);
    const data = detailsResponse.data as any;

    // Le champion peut être dans un tableau ou un objet direct selon l'API (parfois bizarre)
    // Mais généralement c'est la racine de la réponse pour cet endpoint

    // Extraction de la faction
    // Parfois c'est dans 'champion', parfois à la racine
    let faction = data['associated-faction-slug'];
    if (!faction && data.champion) {
      faction = data.champion['associated-faction-slug'];
    }

    if (faction === 'unaffiliated') faction = 'Runeterra'; // Ou null

    // On cherche les relations
    let relatedChampions = data['related-champions'];
    if (!relatedChampions && data.champion) {
      relatedChampions = data.champion['related-champions'];
    }

    return {
      faction,
      relatedChampions
    };

  } catch (error) {
    console.warn(`Erreur lors de la récupération des données Universe pour ${championId}:`, error);
    return null;
  }
}

/**
 * Récupère toutes les données détaillées d'un champion spécifique.
 * @param championId L'ID du champion (ex: 'Aatrox').
 * @param version La version du jeu (ex: '15.23.1').
 * @param locale La langue des données (ex: 'fr_FR' ou 'en_US').
 * @returns Les données détaillées du champion, y compris le Lore complet.
 */
export async function fetchChampionDetails(championId: string, version: string, locale: string = 'fr_FR') {
  try {
    const url = `https://ddragon.leagueoflegends.com/cdn/${version}/data/${locale}/champion/${championId}.json`;

    const response = await axios.get<DetailedChampionResponse>(url);

    // Les données sont imbriquées dans 'data', puis par l'ID du champion (ex: response.data.data.Aatrox)
    const details = response.data.data[championId];

    if (!details) {
      throw new Error(`Champion details not found for ID: ${championId}`);
    }

    // Récupérer les données Universe en parallèle
    const universeData = await fetchChampionUniverseDetails(championId, locale);

    if (universeData) {
      details.faction = universeData.faction;
      details.relatedChampions = universeData.relatedChampions;
    }

    return details;
  } catch (error) {
    console.error(`Erreur lors de la récupération des détails pour ${championId}:`, error);
    return null;
  }
}