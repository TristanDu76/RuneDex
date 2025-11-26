/**
 * Tags personnalisés pour les champions et PNJ (Liste Complète et à Jour)
 * Permet la recherche par catégories (Darkin, Vastaya, Région, PNJ, etc.)
 */

export const championTags: Record<string, string[]> = {
    // === DARKIN ===
    'Aatrox': ['darkin', 'shurima', 'guerrier'],
    'Varus': ['darkin', 'porteur', 'archer'],
    'Naafiri': ['darkin', 'shurima', 'chasseur'],
    'Zaahen': ['darkin', 'runeterra', 'guerrier', 'unsundered'],
    'Kayn': ['ionia', 'assassin', 'ombre', 'rhaast-porteur'],
    'Rhaast': ['darkin', 'pnj', 'arme-vivante'],

    // === VASTAYA ===
    'Ahri': ['vastaya', 'ionia', 'mage'],
    'Xayah': ['vastaya', 'ionia', 'rebelle'],
    'Rakan': ['vastaya', 'ionia', 'rebelle'],
    'Rengar': ['vastaya', 'ixtal', 'chasseur'],
    'Lillia': ['vastaya', 'ionia', 'rêve'],
    'Sett': ['vastaya', 'ionia', 'chef-crime'],
    'Neeko': ['vastaya', 'ixtal', 'métamorphe'],
    'Aurora': ['vastaya', 'freljord', 'esprit', 'sorciere'],
    'Wukong': ['shimon', 'ionia', 'combattant'],

    // === CRÉATURES MARINES / AQUATIQUES ===
    'Nami': ['marai', 'aquatique', 'runeterra', 'guerisseuse'],
    'Fizz': ['aquatique', 'runeterra', 'yordle-similaire'],

    // === YORDLES ===
    'Teemo': ['yordle', 'bandle-city', 'éclaireur'],
    'Tristana': ['yordle', 'bandle-city', 'artilleur'],
    'Lulu': ['yordle', 'bandle-city', 'faerie'],
    'Veigar': ['yordle', 'bandle-city', 'mage'],
    'Heimerdinger': ['yordle', 'piltover', 'scientifique'],
    'Ziggs': ['yordle', 'zaun', 'bombardier'],
    'Poppy': ['yordle', 'demacia', 'heraut'],
    'Kennen': ['yordle', 'ionia', 'kinkou'],
    'Rumble': ['yordle', 'bandle-city', 'techmaturge'],
    'Corki': ['yordle', 'bandle-city', 'pilote'],
    'Kled': ['yordle', 'noxus', 'vagabond'],
    'Gnar': ['yordle', 'préhistorique', 'freljord'],
    'Vex': ['yordle', 'shadow-isles', 'gloom'],
    'Yuumi': ['yordle', 'bandle-city', 'familier'],
    'Smolder': ['yordle', 'dragon', 'runeterra'],

    // === ASCENSIONNÉS ===
    'Azir': ['ascensionne', 'shurima', 'empereur'],
    'Nasus': ['ascensionne', 'shurima', 'érudit'],
    'Renekton': ['ascensionne', 'shurima', 'corrompu'],
    'Xerath': ['ascensionne', 'shurima', 'forme-énergie'],

    // === ASPECTS (TARGON) ===
    'Leona': ['aspect', 'targon', 'soleil'],
    'Diana': ['aspect', 'targon', 'lune'],
    'Pantheon': ['targon', 'mortel', 'guerrier'],
    'Taric': ['aspect', 'targon', 'protecteur'],
    'Zoe': ['aspect', 'targon', 'crépuscule', 'enfant'],
    'Aphelios': ['targon', 'lunari', 'tueur'],
    'Aurelion Sol': ['targon', 'celeste', 'dragon'],

    // === VOID ===
    'Cho\'Gath': ['void', 'monstre'],
    'Kha\'Zix': ['void', 'chasseur'],
    'Kog\'Maw': ['void'],
    'Vel\'Koz': ['void', 'observateur'],
    'Rek\'Sai': ['void', 'shurima', 'reine'],
    'Kassadin': ['void', 'shurima'],
    'Kai\'Sa': ['void', 'shurima'],
    'Malzahar': ['void', 'shurima', 'prophète'],
    'Bel\'Veth': ['void', 'impératrice'],

    // === OMBRES (SHADOW ISLES) ===
    'Thresh': ['shadow-isles', 'spectre', 'bourreau'],
    'Hecarim': ['shadow-isles', 'spectre', 'chevalier'],
    'Kalista': ['shadow-isles', 'spectre', 'vengeance'],
    'Maokai': ['shadow-isles', 'benie', 'esprit'],
    'Yorick': ['shadow-isles', 'moine', 'fossoyeur'],
    'Viego': ['shadow-isles', 'roi-déchu', 'ruine'],
    'Gwen': ['shadow-isles', 'poupée', 'benie'],
    'Elise': ['shadow-isles', 'araignee', 'noxus'],
    'Mordekaiser': ['shadow-isles', 'non-mort', 'conquerant'],
    'Isolde': ['shadow-isles', 'pnj', 'reine', 'décédée'],

    // === PILTOVER & ZAUN ===
    'Vi': ['piltover', 'zaun', 'enforcer'],
    'Jinx': ['zaun', 'chaos', 'criminel'],
    'Ekko': ['zaun', 'temps', 'inventeur'],
    'Warwick': ['zaun', 'expérience', 'chimère'],
    'Singed': ['zaun', 'chimiste', 'fou'],
    'Viktor': ['zaun', 'évolution', 'cyborg'],
    'Blitzcrank': ['zaun', 'robot', 'création'],
    'Jayce': ['piltover', 'inventeur', 'technologie-hexa'],
    'Caitlyn': ['piltover', 'shérif', 'enforcer'],
    'Orianna': ['piltover', 'robot', 'danseuse'],
    'Zac': ['zaun', 'bio-arme'],
    'Renata Glasc': ['zaun', 'chimbaron', 'industriel'],
    'Camille': ['piltover', 'clan-ferros', 'enforcer'],
    'Seraphine': ['piltover', 'chanteuse', 'pop'],
    'Dr. Mundo': ['zaun', 'fou', 'chirurgien'],
    'Mel': ['piltover', 'noxus', 'diplomate', 'pnj'],
    'Silco': ['zaun', 'pnj', 'chef-crime'],
    'Vander': ['zaun', 'pnj', 'gérant', 'warwick'],

    // === DEMACIA ===
    'Garen': ['demacia', 'élite', 'sans-magie'],
    'Lux': ['demacia', 'mage', 'magie-cachee'],
    'Jarvan IV': ['demacia', 'prince', 'roi'],
    'Xin Zhao': ['demacia', 'garde', 'lancier'],
    'Fiora': ['demacia', 'duelliste', 'noble'],
    'Galio': ['demacia', 'colosse', 'construct'],
    'Quinn': ['demacia', 'ranger', 'éclaireur'],
    'Shyvana': ['demacia', 'demi-dragon'],
    'Sylas': ['demacia', 'révolutionnaire', 'mage-rebelle'],
    'Vayne': ['demacia', 'chasseur-noir', 'anti-magie'],
    'Sona': ['demacia', 'mage', 'musicienne'],
    'Morgana': ['demacia', 'ange', 'justice'],
    'Kayle': ['demacia', 'ange', 'justice'],
    'Skarner': ['shurima', 'brackern'],
    'Jarvan III': ['demacia', 'pnj', 'roi', 'décédé'],
    'Tiana Crownguard': ['demacia', 'pnj', 'noble', 'général'],
    'Durand': ['demacia', 'pnj', 'créateur', 'galio'],

    // === NOXUS ===
    'Darius': ['noxus', 'général', 'trifarix'],
    'Draven': ['noxus', 'gladiateur'],
    'Katarina': ['noxus', 'assassin', 'lame'],
    'Talon': ['noxus', 'assassin', 'lame'],
    'Swain': ['noxus', 'général', 'trifarix'],
    'LeBlanc': ['noxus', 'rose-noire', 'manipulatrice'],
    'Vladimir': ['noxus', 'hémomancien'],
    'Cassiopeia': ['noxus', 'serpent', 'exploratrice'],
    'Sion': ['noxus', 'non-mort', 'colosse'],
    'Samira': ['noxus', 'mercenaire'],
    'Rell': ['noxus', 'rebelle', 'métal'],
    'Urgot': ['noxus', 'cyborg', 'criminel'],
    'Briar': ['noxus', 'combattante', 'arme-biologique'],
    'Ambessa': ['noxus', 'général', 'matriarche', 'trifarix'],
    'Général Du Couteau': ['noxus', 'pnj', 'assassin-chef'],
    'Boram Darkwill': ['noxus', 'pnj', 'empereur', 'décédé'],

    // === FRELJORD ===
    'Ashe': ['freljord', 'avarosan', 'cheffe'],
    'Sejuani': ['freljord', 'griffe-hivernale', 'cheffe'],
    'Lissandra': ['freljord', 'sorcière-glace', 'observateur-servante'],
    'Braum': ['freljord', 'protecteur', 'héros'],
    'Tryndamere': ['freljord', 'barbare', 'roi'],
    'Olaf': ['freljord', 'berserker'],
    'Volibear': ['freljord', 'demi-dieu', 'ancien'],
    'Ornn': ['freljord', 'demi-dieu', 'forgeron'],
    'Anivia': ['freljord', 'demi-dieu', 'cryophénix'],
    'Nunu & Willump': ['freljord', 'yeti', 'conte'],
    'Trundle': ['freljord', 'troll', 'roi'],
    'Udyr': ['freljord', 'shaman', 'esprit'],
    'Brand': ['freljord', 'mage', 'fire'],
    'Avarosa': ['freljord', 'pnj', 'ancêtre', 'décédée'],
    'Serylda': ['freljord', 'pnj', 'ancêtre', 'décédée'],

    // === IONIA ===
    'Yasuo': ['ionia', 'épéiste', 'vagabond'],
    'Yone': ['ionia', 'épéiste', 'azakana'],
    'Zed': ['ionia', 'ombre', 'maitre'],
    'Shen': ['ionia', 'kinkou', 'eye-of-twilight'],
    'Akali': ['ionia', 'renégate', 'assassin'],
    'Irelia': ['ionia', 'résistance', 'danseuse'],
    'Karma': ['ionia', 'illuminée', 'esprit'],
    'Master Yi': ['ionia', 'wuju', 'maitre'],
    'Lee Sin': ['ionia', 'moine', 'aveugle'],
    'Jhin': ['ionia', 'artiste', 'tueur-serie'],
    'Soraka': ['ionia', 'celeste', 'guérisseur'],
    'Syndra': ['ionia', 'mage', 'puissance'],
    'Hwei': ['ionia', 'artiste', 'mage', 'peintre'],
    'Yunara': ['ionia', 'vastaya', 'kinkou', 'pnj'],
    'Kusho': ['ionia', 'pnj', 'maitre-shen', 'décédé'],
    'Elder Souma': ['ionia', 'pnj', 'maitre-yasuo', 'décédé'],

    // === SHURIMA ===
    'Sivir': ['shurima', 'mercenaire', 'descendante'],
    'Taliyah': ['shurima', 'tisseuse-pierre'],
    'Rammus': ['shurima', 'mystere'],
    'Amumu': ['shurima', 'momie', 'maudit'],
    'Akshan': ['shurima', 'sentinelle', 'chasseur'],
    'K\'Sante': ['shurima', 'nazumah', 'tank', 'protecteur'],
    'Setaka': ['shurima', 'ascensionne', 'pnj', 'décédée'],
    'Myisha': ['shurima', 'pnj', 'amante-darkin', 'décédée'],

    // === BILGEWATER ===
    'Miss Fortune': ['bilgewater', 'capitaine', 'chasseuse'],
    'Gangplank': ['bilgewater', 'pirate', 'roi'],
    'Twisted Fate': ['bilgewater', 'joueur', 'escroc'],
    'Graves': ['bilgewater', 'hors-la-loi', 'escroc'],
    'Pyke': ['bilgewater', 'éventreur', 'non-mort'],
    'Nautilus': ['bilgewater', 'spectre', 'noyé'],
    'Illaoi': ['bilgewater', 'prêtresse', 'kraken'],
    'Nilah': ['bilgewater', 'joie', 'démon'],

    // === IXTAL ===
    'Qiyana': ['ixtal', 'élémentaliste', 'princesse'],
    'Nidalee': ['ixtal', 'chasseuse', 'cougar'],
    'Zyra': ['ixtal', 'plante', 'mage'],
    'Milio': ['ixtal', 'chaleur', 'guérisseur'],
    'Malphite': ['ixtal', 'monolithe', 'element'],

    // === RUNETERRA / INCONNU ===
    'Fiddlesticks': ['démon', 'peur', 'ancien'],
    'Nocturne': ['démon', 'cauchemar'],
    'Evelynn': ['démon', 'agonie', 'succube'],
    'Zilean': ['runeterra', 'temps', 'mage'],
    'Ryze': ['runeterra', 'mage', 'vagabond'],
    'Karthus': ['runeterra', 'non-mort', 'chanteur'],
    'Jax': ['runeterra', 'icathia', 'maitre-armes'],
    'Kindred': ['runeterra', 'esprit', 'mort'],
    'Bard': ['celeste', 'runeterra', 'mystere'],
};

/**
 * Obtient les tags d'un champion
 */
export function getChampionTags(championName: string): string[] {
    return championTags[championName] || [];
}

/**
 * Vérifie si un champion correspond à une recherche (nom, titre, tags, faction)
 */
export function matchesSearch(
    champion: { name: string; title: string; faction?: string },
    query: string
): boolean {
    const lowerQuery = query.toLowerCase();

    // Recherche dans le nom
    if (champion.name.toLowerCase().includes(lowerQuery)) return true;

    // Recherche dans le titre
    if (champion.title.toLowerCase().includes(lowerQuery)) return true;

    // Recherche dans la faction (si disponible, bien que les tags le couvrent souvent)
    if (champion.faction && champion.faction.toLowerCase().includes(lowerQuery)) return true;

    // Recherche dans les tags (correspondance exacte)
    const tags = getChampionTags(champion.name);

    if (tags.some(tag => tag === lowerQuery)) return true;

    return false;
}