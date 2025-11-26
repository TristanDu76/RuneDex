/**
 * Base de données des relations entre champions et PNJ basée sur le lore officiel de League of Legends
 * Types de relations détaillés pour une meilleure précision du lore
 */

export type RelationType =
    | 'family'          // Famille (générique)
    | 'sibling'         // Frère / Sœur
    | 'parent'          // Parent
    | 'child'           // Enfant
    | 'spouse'          // Époux / Épouse
    | 'lover'           // Amant / Amante (romance confirmée)
    | 'ex-lover'        // Ex-amant / Ex-amante
    | 'unrequited-love' // Amour non réciproque
    | 'friend'          // Ami proche
    | 'ally'            // Allié (politique ou circonstanciel)
    | 'enemy'           // Ennemi déclaré
    | 'rival'           // Rival (compétition, pas forcément haine)
    | 'nemesis'         // Ennemi juré (haine profonde)
    | 'mentor'          // Maître / Mentor
    | 'student'         // Élève / Disciple
    | 'creator'         // Créateur (pour les robots/construits)
    | 'creation'        // Création
    | 'faction-member'  // Membre de la même faction (générique)
    | 'captured'        // A capturé / Emprisonné
    | 'victim'          // Victime de
    | 'killer'          // Tueur de
    | 'betrayer'        // Traître
    | 'betrayed'        // Trahi par
    | 'complex'         // Relation complexe / Ambiguë
    | 'ancestor'        // Ancêtre
    | 'descendant'      // Descendant
    | 'adoptive-family' // Famille adoptive
    | 'corrupted'       // Corrompu par
    | 'corrupted-by'    // A corrompu
    | 'hunts'           // Chasse
    | 'hunted-by'       // Chassé par
    | 'comrade'         // Frère d'armes
    | 'related'         // Relation générique (API fallback)
    | 'faction';        // Tag pour afficher tous les membres de la faction

export interface ChampionRelation {
    champion: string;
    type: RelationType;
    note?: string;
}

export const championRelations: Record<string, ChampionRelation[]> = {
    'Aatrox': [
        { champion: 'Pantheon', type: 'killer', note: 'A tué l\'Aspect (l\'ancienne entité divine)' },
        { champion: 'Tryndamere', type: 'nemesis', note: 'Sa survie après le massacre est une insulte' },
        { champion: 'Varus', type: 'ally', note: 'Darkin' },
        { champion: 'Zaahen', type: 'ally', note: 'Darkin' },
    ],
    'Ahri': [
        { champion: 'Yasuo', type: 'ally' },
        { champion: 'Xayah', type: 'complex' },
        { champion: 'Rakan', type: 'complex' },
    ],
    'Akali': [
        { champion: 'Shen', type: 'mentor', note: 'Ancien maître qu\'elle a quitté' },
        { champion: 'Kennen', type: 'ally', note: 'Ordre Kinkou' },
        { champion: 'Zed', type: 'enemy' },
    ],
    'Akshan': [
        { champion: 'Viego', type: 'nemesis', note: 'A tué son mentor Shadya' },
        { champion: 'Lucian', type: 'ally', note: 'Sentinelle de la Lumière' },
        { champion: 'Senna', type: 'ally', note: 'Sentinelle de la Lumière' },
        { champion: 'Gwen', type: 'ally', note: 'Alliée contre la Ruine' },
        { champion: 'Shadya', type: 'mentor', note: 'Son maître assassiné (PNJ)' },
    ],
    'Alistar': [
        { champion: 'Swain', type: 'enemy', note: 'Noxus a détruit son clan' },
        { champion: 'Xin Zhao', type: 'friend', note: 'Anciens gladiateurs ensemble (Fleshning)' },
    ],
    'Ambessa': [
        { champion: 'Darius', type: 'ally', note: 'Membre du Trifarix (Force de Noxus)' },
        { champion: 'Swain', type: 'ally', note: 'Membre du Trifarix' },
        { champion: 'Mel', type: 'parent', note: 'Mère (Mel est Piltovérienne/Noxienne)' },
    ],
    'Anivia': [
        { champion: 'Ornn', type: 'sibling' },
        { champion: 'Volibear', type: 'sibling' },
    ],
    'Annie': [
        { champion: 'Mordekaiser', type: 'enemy', note: 'Tybaulk (son ours) est un démon lié à Mordekaiser' },
        { champion: 'LeBlanc', type: 'enemy', note: 'La Rose Noire s\'intéresse à son pouvoir' },
        { champion: 'Amoline', type: 'parent', note: 'Mère (PNJ, décédée)' },
        { champion: 'Gregori', type: 'parent', note: 'Père (PNJ, décédé)' },
    ],
    'Aphelios': [
        { champion: 'Alune', type: 'sibling', note: 'Sœur jumelle (lien spirituel fort)' },
    ],
    'Ashe': [
        { champion: 'Tryndamere', type: 'spouse', note: 'Mariage politique devenu amour' },
        { champion: 'Sejuani', type: 'rival', note: 'Guerre des Trois Sœurs / Cousines' },
        { champion: 'Lissandra', type: 'enemy' },
        { champion: 'Avarosa', type: 'ancestor', note: 'Ancêtre et fondatrice (PNJ)' },
    ],
    'Aurelion Sol': [
        { champion: 'Zoé', type: 'enemy', note: 'L\'Aspect du Crépuscule se moque de lui' },
        { champion: 'Pantheon', type: 'enemy', note: 'Ancien esclave de l\'Aspect de la Guerre' },
    ],
    'Aurora': [
        { champion: 'Ornn', type: 'friend', note: 'Vastaya Bryni qui l\'aide' },
        { champion: 'Volibear', type: 'enemy', note: 'S\'oppose à sa destruction' },
    ],
    'Azir': [
        { champion: 'Xerath', type: 'betrayed', note: 'Ancien ami et esclave' },
        { champion: 'Sivir', type: 'descendant', note: 'Descendante lointaine' },
        { champion: 'Nasus', type: 'ally', note: 'Ancien général (Ascensionné)' },
        { champion: 'Renekton', type: 'ally', note: 'Ancien général (Ascensionné)' },
        { champion: 'Setaka', type: 'ancestor', note: 'Ancienne Ascensionnée (PNJ)' },
    ],
    'Bel\'Veth': [
        { champion: 'Kai\'Sa', type: 'enemy', note: 'Veut l\'utiliser pour détruire les Veilleurs' },
        { champion: 'Vel\'Koz', type: 'enemy', note: 'Guerre civile du Néant' },
        { champion: 'Malzahar', type: 'rival', note: 'Concurrence pour le contrôle du Néant' },
    ],
    'Blitzcrank': [
        { champion: 'Viktor', type: 'creator' },
    ],
    'Brand': [
        { champion: 'Ryze', type: 'mentor', note: 'Ancien maître (Kegan Rodhe avant corruption)' },
        { champion: 'Lissandra', type: 'enemy', note: 'Cherche à s\'emparer des Runes' },
    ],
    'Braum': [
        { champion: 'Ashe', type: 'ally' },
    ],
    'Briar': [
        { champion: 'Vladimir', type: 'creator', note: 'Père "biologique" (Hémomancie)' },
        { champion: 'Sion', type: 'friend', note: 'L\'admire beaucoup' },
        { champion: 'Swain', type: 'enemy', note: 'S\'est échappée des geôles de Noxus' },
    ],
    'Caitlyn': [
        { champion: 'Vi', type: 'lover', note: 'Partenaire et amie proche (Arcane)' },
        { champion: 'Jinx', type: 'nemesis' },
        { champion: 'Jayce', type: 'friend', note: 'Ami de longue date' },
        { champion: 'Mel', type: 'ally', note: 'Partenaire d\'Enforcement' },
    ],
    'Camille': [
        { champion: 'Caitlyn', type: 'complex', note: 'Manipule la police pour les intérêts du clan Ferros' },
        { champion: 'Vi', type: 'enemy', note: 'S\'oppose à son ingérence à Zaun' },
        { champion: 'Jhin', type: 'enemy', note: 'A tenté de l\'assassiner lors de son passage à Piltover' },
        { champion: 'Renata Glasc', type: 'rival', note: 'Concurrence commerciale et technologique' },
    ],
    'Cassiopeia': [
        { champion: 'Katarina', type: 'sibling', note: 'Sœur aînée' },
        { champion: 'Talon', type: 'adoptive-family', note: 'Frère adoptif' },
        { champion: 'Azir', type: 'betrayer', note: 'L\'a réveillé mais trahi' },
        { champion: 'Sivir', type: 'betrayer', note: 'L\'a poignardée' },
    ],
    'Cho\'Gath': [
        { champion: 'Kassadin', type: 'enemy' },
        { champion: 'Kai\'Sa', type: 'enemy' },
    ],
    'Corki': [
        { champion: 'Heimerdinger', type: 'friend', note: 'Collègues de Piltover' },
        { champion: 'Rumble', type: 'rival', note: 'Rivalité technologique Yordle' },
    ],
    'Darius': [
        { champion: 'Draven', type: 'sibling', note: 'Frère cadet' },
        { champion: 'Swain', type: 'ally', note: 'Membre du Trifarix (Main de Noxus)' },
        { champion: 'Garen', type: 'rival' },
        { champion: 'Samira', type: 'faction-member', note: 'Loyaliste de Noxus' },
        { champion: 'Ambessa', type: 'ally', note: 'Membre du Trifarix' },
    ],
    'Diana': [
        { champion: 'Leona', type: 'lover' },
    ],
    'Draven': [
        { champion: 'Darius', type: 'sibling', note: 'Frère aîné' },
        { champion: 'Swain', type: 'ally' },
    ],
    'Ekko': [
        { champion: 'Jinx', type: 'friend', note: 'Amis d\'enfance (avant Jinx)' },
        { champion: 'Vi', type: 'friend' },
        { champion: 'Heimerdinger', type: 'mentor', note: 'Mentor à Zaun' },
    ],
    'Elise': [
        { champion: 'LeBlanc', type: 'ally', note: 'Membre de la Rose Noire' },
        { champion: 'Vilemaw', type: 'ally', note: 'Dieu-Araignée des Îles Obscures (PNJ)' },
    ],
    'Evelynn': [
        { champion: 'Vayne', type: 'killer', note: 'A tué les parents de Vayne' },
        { champion: 'Twisted Fate', type: 'ex-lover', note: 'Relation dans l\'univers alternatif (Tango), clin d\'œil' },
    ],
    'Ezreal': [
        { champion: 'Lux', type: 'unrequited-love', note: 'A un béguin pour elle (Star Guardian/Canon ?)' },
        { champion: 'Kassadin', type: 'enemy', note: 'A exploré les ruines d\'Icathia' },
        { champion: 'Kai\'Sa', type: 'ally', note: 'Rencontre dans le Néant (Cinématique Warriors)' },
        { champion: 'Zoé', type: 'admirer', note: 'Zoé est amoureuse de lui' },
    ],
    'Fiddlesticks': [
        { champion: 'Nilah', type: 'enemy', note: 'Nilah chasse les démons primordiaux' },
        { champion: 'Swain', type: 'complex', note: 'Swain utilise le pouvoir de Raum (un autre démon)' },
        { champion: 'Zoé', type: 'thief', note: 'Elle lui a volé une clé' },
    ],
    'Fiora': [
        { champion: 'Jax', type: 'rival', note: 'Veut le défier en duel' },
        { champion: 'Garen', type: 'complex', note: 'Respect mutuel entre nobles' },
        { champion: 'Camille', type: 'complex', note: 'Tensions entre maisons nobles' },
    ],
    'Fizz': [
        { champion: 'Ur', type: 'ally', note: 'Son familier (PNJ)' },
    ],
    'Galio': [
        { champion: 'Lux', type: 'friend', note: 'S\'anime grâce à la magie de Lux' },
        { champion: 'Durand', type: 'creator', note: 'Créateur original (PNJ, décédé)' },
    ],
    'Gangplank': [
        { champion: 'Miss Fortune', type: 'nemesis' },
        { champion: 'Illaoi', type: 'ex-lover' },
    ],
    'Garen': [
        { champion: 'Lux', type: 'family', note: 'Sœur cadette' },
        { champion: 'Jarvan IV', type: 'friend', note: 'Ami d\'enfance et frère d\'armes' },
        { champion: 'Katarina', type: 'complex', note: 'Romance secrète et rivalité' },
        { champion: 'Sylas', type: 'enemy', note: 'Ennemi de Demacia' },
    ],
    'Général Du Couteau': [
        { champion: 'Katarina', type: 'parent', note: 'Père et Mentor' },
        { champion: 'Talon', type: 'adoptive-family', note: 'Père adoptif' },
    ],
    'Gragas': [
        { champion: 'Ashe', type: 'ally', note: 'Fournit de la bière aux Avarosans' },
        { champion: 'Lissandra', type: 'enemy', note: 'Cherche un éclat de Glace Pure pour sa bière' },
    ],
    'Graves': [
        { champion: 'Twisted Fate', type: 'complex', note: 'Réconciliation progressive' },
    ],
    'Gwen': [
        { champion: 'Viego', type: 'enemy', note: 'Créée par le corps d\'Isolde pour contrer la Ruine' },
        { champion: 'Isolde', type: 'creator', note: 'Poupée d\'Isolde (PNJ)' },
    ],
    'Hecarim': [
        { champion: 'Kalista', type: 'betrayer', note: 'L\'a trahie pour gagner la faveur de Viego' },
        { champion: 'Viego', type: 'ally' },
    ],
    'Heimerdinger': [
        { champion: 'Jayce', type: 'student' },
        { champion: 'Ziggs', type: 'complex', note: 'Ancien assistant turbulent' },
        { champion: 'Ekko', type: 'ally', note: 'Allié à Zaun (Arcane)' },
    ],
    'Hwei': [
        { champion: 'Jhin', type: 'nemesis', note: 'Jhin a massacré ses maîtres' },
    ],
    'Illaoi': [
        { champion: 'Gangplank', type: 'ex-lover' },
    ],
    'Irelia': [
        { champion: 'Karma', type: 'ally', note: 'Cheffe de la résistance Ionia' },
        { champion: 'Swain', type: 'enemy', note: 'Invasion de Noxus' },
    ],
    'Isolde': [
        { champion: 'Viego', type: 'spouse', note: 'Épouse décédée' },
        { champion: 'Gwen', type: 'creator', note: 'Créatrice (via la poupée)' },
    ],
    'Ivern': [
        { champion: 'Maokai', type: 'friend', note: 'Esprits de la nature' },
        { champion: 'Rengar', type: 'enemy', note: 'Protège la jungle que Rengar chasse' },
        { champion: 'Lillia', type: 'friend' },
    ],
    'Janna': [
        { champion: 'Ekko', type: 'ally', note: 'Protectrice de Zaun' },
        { champion: 'Viktor', type: 'enemy', note: 'La technologie menace l\'air pur' },
    ],
    'Jarvan IV': [
        { champion: 'Garen', type: 'comrade' },
        { champion: 'Xin Zhao', type: 'ally', note: 'Protecteur et sénéchal' },
        { champion: 'Shyvana', type: 'complex', note: 'Protectrice ; sa présence est controversée' },
        { champion: 'Sylas', type: 'betrayed', note: 'Ancien prisonnier qui a déclenché une guerre civile' },
        { champion: 'Jarvan III', type: 'parent', note: 'Père (PNJ, tué)' },
    ],
    'Jax': [
        { champion: 'Fiora', type: 'rival', note: 'Digne adversaire' },
        { champion: 'Zilean', type: 'ally', note: 'Cherchent à sauver Icathia' },
    ],
    'Jayce': [
        { champion: 'Viktor', type: 'rival', note: 'Anciens partenaires' },
        { champion: 'Caitlyn', type: 'friend' },
        { champion: 'Heimerdinger', type: 'mentor' },
        { champion: 'Mel', type: 'lover', note: 'Intérêt romantique (Arcane)' },
    ],
    'Jhin': [
        { champion: 'Zed', type: 'enemy' },
        { champion: 'Shen', type: 'nemesis' },
        { champion: 'Hwei', type: 'victim', note: 'A massacré ses maîtres' },
    ],
    'Jinx': [
        { champion: 'Vi', type: 'sibling', note: 'Sœur aînée' },
        { champion: 'Caitlyn', type: 'nemesis' },
        { champion: 'Ekko', type: 'friend', note: 'Ami d\'enfance' },
        { champion: 'Warwick', type: 'complex', note: 'Vander avant transformation (père adoptif)' },
        { champion: 'Silco', type: 'parent', note: 'Père adoptif (PNJ, tué)' },
    ],
    "Kai'Sa": [
        { champion: 'Kassadin', type: 'parent', note: 'Père' },
        { champion: 'Bel\'Veth', type: 'enemy', note: 'Menace de consumer Runeterra' },
    ],
    'Kalista': [
        { champion: 'Viego', type: 'parent', note: 'Oncle (Roi Déchu)' },
        { champion: 'Hecarim', type: 'betrayed', note: 'Poignardée par lui lors de la Ruine' },
    ],
    'Karma': [
        { champion: 'Irelia', type: 'ally' },
        { champion: 'Karma (ancienne)', type: 'ancestor', note: 'Esprit réincarné (PNJ)' },
    ],
    'Karthus': [
        { champion: 'Kindred', type: 'enemy', note: 'Pervertit le cycle naturel de la mort' },
        { champion: 'Soraka', type: 'enemy', note: 'Soraka préserve la vie' },
        { champion: 'Mordekaiser', type: 'ally', note: 'Partagent une affinité avec la mort' },
    ],
    'Kassadin': [
        { champion: "Kai'Sa", type: 'child', note: 'Fille' },
        { champion: 'Malzahar', type: 'nemesis', note: 'A causé la perte de sa famille' },
    ],
    'Katarina': [
        { champion: 'Cassiopeia', type: 'sibling', note: 'Sœur cadette' },
        { champion: 'Talon', type: 'adoptive-family', note: 'Frère adoptif' },
        { champion: 'Garen', type: 'complex', note: 'Romance secrète et rivalité politique' },
        { champion: 'Général Du Couteau', type: 'parent', note: 'Père et Mentor (PNJ)' },
    ],
    'Kayle': [
        { champion: 'Morgana', type: 'sibling', note: 'Sœur jumelle (conflit idéologique)' },
        { champion: 'Ryze', type: 'ally', note: 'A confié une Rune Géodésique' },
    ],
    'Kayn': [
        { champion: 'Zed', type: 'mentor' },
        { champion: 'Rhaast', type: 'rival', note: 'Lutte pour le contrôle du corps' },
    ],
    'Kennen': [
        { champion: 'Shen', type: 'ally', note: 'Ordre Kinkou' },
        { champion: 'Akali', type: 'ally', note: 'Ordre Kinkou' },
        { champion: 'Yunara', type: 'ally', note: 'Ordre Kinkou (PNJ)' },
    ],
    'Kha\'Zix': [
        { champion: 'Rengar', type: 'nemesis', note: 'Chasseur et proie (œil crevé)' },
    ],
    'Kindred': [
        { champion: 'Karthus', type: 'enemy', note: 'Abomination qui refuse la mort' },
        { champion: 'Yone', type: 'complex', note: 'A refusé de mourir complètement' },
        { champion: 'Mordekaiser', type: 'enemy', note: 'A créé son propre royaume de la mort' },
    ],
    'Kled': [
        { champion: 'Skaarl', type: 'ally', note: 'Sa monture immortelle (PNJ)' },
        { champion: 'Swain', type: 'faction-member', note: 'Haut gradé de Noxus (techniquement)' },
    ],
    'Kog\'Maw': [
        { champion: 'Malzahar', type: 'ally', note: 'Attiré par le prophète' },
    ],
    'K\'Sante': [
        { champion: 'Renekton', type: 'enemy', note: 'Protège Nazumah des bêtes Ascensionnées' },
    ],
    'LeBlanc': [
        { champion: 'Swain', type: 'complex' },
        { champion: 'Vladimir', type: 'ally', note: 'Membres fondateurs de la Rose Noire' },
        { champion: 'Rell', type: 'enemy', note: 'Ancienne directrice de l\'académie ayant expérimenté sur Rell' },
        { champion: 'Mordekaiser', type: 'enemy', note: 'A piégé Mordekaiser' },
    ],
    'Lee Sin': [
        { champion: 'Udyr', type: 'friend', note: 'Ont médité ensemble au temple d\'Hirana' },
        { champion: 'Karma', type: 'ally', note: 'Défenseurs d\'Ionia' },
    ],
    'Leona': [
        { champion: 'Diana', type: 'lover', note: 'Anciennes amies devenues ennemies puis amantes' },
        { champion: 'Pantheon', type: 'faction-member', note: 'Aspect du Sol (ancien Rakkor)' },
    ],
    'Lillia': [
        { champion: 'Yone', type: 'friend', note: 'A aidé Yone dans le royaume spirituel' },
        { champion: 'Ivern', type: 'friend' },
        { champion: 'Neeko', type: 'friend' },
    ],
    'Lissandra': [
        { champion: 'Ashe', type: 'enemy' },
        { champion: 'Sejuani', type: 'enemy' },
        { champion: 'Trundle', type: 'ally', note: 'Manipulé pour servir ses intérêts (roi des Trolls)' },
        { champion: 'Avarosa', type: 'sibling', note: 'Sœur (PNJ, décédée)' },
        { champion: 'Serylda', type: 'sibling', note: 'Sœur (PNJ, décédée)' },
    ],
    'Lucian': [
        { champion: 'Senna', type: 'spouse', note: 'Époux' },
        { champion: 'Thresh', type: 'nemesis' },
    ],
    'Lulu': [
        { champion: 'Veigar', type: 'friend', note: 'Trouve sa "méchanceté" mignonne' },
        { champion: 'Tristana', type: 'friend' },
    ],
    'Lux': [
        { champion: 'Garen', type: 'family', note: 'Frère aîné' },
        { champion: 'Ezreal', type: 'friend', note: 'Ami avec un potentiel romantique non exploré' },
        { champion: 'Sylas', type: 'complex', note: 'Ancienne connexion, manipulation et trahison' },
        { champion: 'Galio', type: 'friend', note: 'Son pouvoir réveille Galio' },
        { champion: 'Tiana Crownguard', type: 'parent', note: 'Mère (PNJ)' },
    ],
    'Malzahar': [
        { champion: 'Kassadin', type: 'nemesis' },
    ],
    'Maokai': [
        { champion: 'Zyra', type: 'enemy', note: 'Nature corrompue vs Nature pure' },
        { champion: 'Yorick', type: 'ally', note: 'Veulent purifier les Îles' },
        { champion: 'Viego', type: 'enemy', note: 'Source de la corruption' },
    ],
    'Maître Yi': [
        { champion: 'Wukong', type: 'mentor' },
    ],
    'Milio': [
        { champion: 'Nidalee', type: 'mentor', note: 'L\'a aidé à maîtriser son feu apaisant' },
        { champion: 'Qiyana', type: 'enemy', note: 'Milio veut rejoindre les Yun Tal que Qiyana méprise' },
    ],
    'Mel': [
        { champion: 'Ambessa', type: 'child', note: 'Fille' },
        { champion: 'Jayce', type: 'lover', note: 'Intérêt romantique (Arcane)' },
        { champion: 'Vi', type: 'ally' },
    ],
    'Miss Fortune': [
        { champion: 'Gangplank', type: 'nemesis', note: 'A tué sa famille' },
        { champion: 'Twisted Fate', type: 'ally' },
    ],
    'Mordekaiser': [
        { champion: 'LeBlanc', type: 'betrayer', note: 'L\'a trahi et scellé' },
        { champion: 'Veigar', type: 'victim', note: 'L\'a torturé et rendu fou' },
        { champion: 'Sahn-Uzal', type: 'complex', note: 'Son nom mortel (PNJ)' },
    ],
    'Morgana': [
        { champion: 'Kayle', type: 'sibling', note: 'Sœur jumelle' },
        { champion: 'Sylas', type: 'ally', note: 'Partagent une vision des mages opprimés' },
    ],
    'Naafiri': [
        { champion: 'Zaahen', type: 'ally', note: 'Darkin' },
    ],
    'Nami': [
        { champion: 'Diana', type: 'ally', note: 'Cherche l\'Aspect de la Lune pour sauver son peuple' },
        { champion: 'Fizz', type: 'friend', note: 'Créatures aquatiques' },
    ],
    'Nasus': [
        { champion: 'Renekton', type: 'sibling', note: 'Frère aîné' },
        { champion: 'Azir', type: 'ally' },
        { champion: 'Xerath', type: 'enemy' },
    ],
    'Nautilus': [
        { champion: 'Pyke', type: 'complex' },
    ],
    'Neeko': [
        { champion: 'Nidalee', type: 'lover', note: 'Béguin fort (et réciproque ?)' },
        { champion: 'Lillia', type: 'friend' },
        { champion: 'Zyra', type: 'enemy', note: 'Nature dangereuse' },
    ],
    'Nidalee': [
        { champion: 'Neeko', type: 'friend', note: 'L\'a accueillie dans la jungle' },
        { champion: 'Rengar', type: 'rival', note: 'Chasseurs de la jungle' },
        { champion: 'Milio', type: 'student', note: 'Lui a appris à survivre' },
    ],
    'Nilah': [
        { champion: 'Graves', type: 'ally', note: 'Sentinelle de la Lumière' },
        { champion: 'Viego', type: 'enemy' },
        { champion: 'Fiddlesticks', type: 'enemy', note: 'Chasse les démons primordiaux' },
        { champion: 'Volibear', type: 'rival', note: 'Veut défier les demi-dieux' },
    ],
    'Nocturne': [
        { champion: 'Lux', type: 'enemy', note: 'La lumière dissipe les cauchemars' },
        { champion: 'Shen', type: 'enemy', note: 'Equilibre spirituel' },
    ],
    'Nunu & Willump': [
        { champion: 'Lissandra', type: 'enemy', note: 'Veut le pouvoir du Yeti' },
        { champion: 'Ornn', type: 'friend', note: 'Aime la musique de Nunu' },
        { champion: 'Braum', type: 'friend', note: 'Héros de Nunu' },
    ],
    'Olaf': [
        { champion: 'Sejuani', type: 'ally', note: 'A rejoint la Griffe Hivernale' },
        { champion: 'Lucian', type: 'ally', note: 'A combattu la Ruine avec les Sentinelles' },
    ],
    'Orianna': [
        { champion: 'Blitzcrank', type: 'friend', note: 'Automates de Zaun/Piltover' },
        { champion: 'Viktor', type: 'complex', note: 'Leur vision de "l\'évolution" diffère' },
        { champion: 'Corin Reveck', type: 'parent', note: 'Père et créateur (PNJ)' },
    ],
    'Ornn': [
        { champion: 'Volibear', type: 'sibling' },
        { champion: 'Anivia', type: 'sibling' },
        { champion: 'Poppy', type: 'complex', note: 'Le marteau de Poppy est lié à lui' },
        { champion: 'Aurora', type: 'friend', note: 'Alliée/messagère' },
    ],
    'Pantheon': [
        { champion: 'Leona', type: 'faction-member' },
        { champion: 'Aatrox', type: 'nemesis', note: 'A tué l\'Aspect de la Guerre (l\'ancienne entité)' },
        { champion: 'Aurelion Sol', type: 'enemy', note: 'L\'Aspect de la Guerre l\'a asservi autrefois' },
        { champion: 'Zoé', type: 'enemy', note: 'Se moque de son sérieux' },
        { champion: 'Taric', type: 'ally', note: 'Aspect du Protecteur' },
        { champion: 'Soraka', type: 'ally', note: 'Entité Céleste bienveillante' },
        { champion: 'Viego', type: 'corrupted-by', note: 'A été temporairement possédé par la Ruine' },
    ],
    'Poppy': [
        { champion: 'Ornn', type: 'creator', note: 'A forgé son marteau' },
        { champion: 'Galio', type: 'friend', note: 'Protecteurs de Demacia' },
        { champion: 'Vayne', type: 'ally', note: 'Chasseurs de monstres (Sentinelles)' },
    ],
    'Pyke': [
        { champion: 'Nautilus', type: 'complex', note: 'Deux âmes perdues de Bilgewater liées par la hantise' },
    ],
    'Qiyana': [
        { champion: 'Milio', type: 'enemy', note: 'Méprise son village et sa magie "simple"' },
        { champion: 'Malphite', type: 'complex', note: 'Source de magie élémentaire' },
    ],
    'Quinn': [
        { champion: 'Talon', type: 'rival', note: 'Assassin vs Eclaireur' },
        { champion: 'Garen', type: 'ally', note: 'Sert l\'avant-garde de Demacia' },
        { champion: 'Jarvan IV', type: 'ally', note: 'Loyale au trône' },
    ],
    'Rakan': [
        { champion: 'Xayah', type: 'lover' },
        { champion: 'Ahri', type: 'complex' },
    ],
    'Rammus': [
        { champion: 'Sivir', type: 'complex', note: 'Légendes de Shurima' },
    ],
    'Rek\'Sai': [
        { champion: 'Kai\'Sa', type: 'enemy', note: 'Chasseuse du Néant' },
        { champion: 'Sivir', type: 'enemy', note: 'Menace les caravanes' },
    ],
    'Rell': [
        { champion: 'LeBlanc', type: 'nemesis', note: 'Mène une vendetta contre la Rose Noire et ses chefs' },
        { champion: 'Samira', type: 'complex', note: 'Rivalité amicale' },
    ],
    'Renata Glasc': [
        { champion: 'Zeri', type: 'enemy', note: 'Zeri combat ses opérations à Zaun' },
        { champion: 'Camille', type: 'rival', note: 'Concurrence commerciale (Clan Ferros)' },
        { champion: 'Viktor', type: 'complex', note: 'Utilise parfois sa technologie' },
        { champion: 'Silco', type: 'rival', note: 'A pris le pouvoir après sa chute' },
    ],
    'Renekton': [
        { champion: 'Nasus', type: 'sibling', note: 'Frère cadet (considère Nasus comme son bourreau)' },
        { champion: 'Azir', type: 'complex' },
        { champion: 'Xerath', type: 'corrupted-by' },
        { champion: 'K\'Sante', type: 'enemy' },
    ],
    'Rengar': [
        { champion: 'Kha\'Zix', type: 'nemesis', note: 'La proie ultime' },
        { champion: 'Nidalee', type: 'rival' },
        { champion: 'Ivern', type: 'enemy' },
    ],
    'Rhaast': [
        { champion: 'Kayn', type: 'rival', note: 'Entité Darkin luttant pour le contrôle' },
    ],
    'Riven': [
        { champion: 'Yasuo', type: 'complex', note: 'A tué l\'Ancien Souma (accidentellement)' },
        { champion: 'Singed', type: 'enemy', note: 'A détruit son bataillon avec la chimie' },
        { champion: 'Draven', type: 'enemy', note: 'L\'a combattue dans les arènes (Awaken)' },
    ],
    'Rumble': [
        { champion: 'Tristana', type: 'unrequited-love', note: 'Est amoureux d\'elle (elle le voit comme un ami)' },
        { champion: 'Teemo', type: 'rival', note: 'Jaloux de son amitié avec Tristana' },
        { champion: 'Heimerdinger', type: 'rival', note: 'Méprise la tech de Piltover' },
    ],
    'Ryze': [
        { champion: 'Brand', type: 'student', note: 'Ancien élève corrompu' },
        { champion: 'Kayle', type: 'ally', note: 'Lui a confié une Rune' },
        { champion: 'Nasus', type: 'friend', note: 'Vieux amis érudits' },
    ],
    'Samira': [
        { champion: 'Darius', type: 'faction-member', note: 'Loyaliste de Noxus' },
        { champion: 'Ambessa', type: 'ally', note: 'Travaille pour Noxus' },
    ],
    'Sejuani': [
        { champion: 'Ashe', type: 'rival', note: 'Guerre des Trois Sœurs / Cousines' },
        { champion: 'Lissandra', type: 'enemy' },
        { champion: 'Olaf', type: 'ally', note: 'Berserker de la Griffe Hivernale' },
        { champion: 'Serylda', type: 'ancestor', note: 'Ancêtre et fondatrice (PNJ)' },
    ],
    'Senna': [
        { champion: 'Lucian', type: 'spouse', note: 'Épouse' },
        { champion: 'Thresh', type: 'nemesis', note: 'Emprisonnée puis libérée avec un nouveau pouvoir' },
        { champion: 'Viego', type: 'enemy' },
        { champion: 'Isolde', type: 'complex', note: 'Porte une partie de l\'âme d\'Isolde' },
    ],
    'Seraphine': [
        { champion: 'Caitlyn', type: 'ally', note: 'Fan de sa musique' },
        { champion: 'Skarner', type: 'complex', note: 'Entendait les cris des Brackern dans son cristal (ancien lore)' },
    ],
    'Sett': [
        { champion: 'Aphelios', type: 'complex', note: 'Duo populaire (Skin Spirit Blossom)' },
        { champion: 'Draven', type: 'rival', note: 'Stars des arènes de combat' },
        { champion: 'Jack', type: 'rival', note: 'Le Vainqueur (LoR)' },
    ],
    'Shaco': [
        { champion: 'Fiddlesticks', type: 'complex', note: 'Démons/Esprits' },
    ],
    'Shen': [
        { champion: 'Zed', type: 'rival', note: 'Ancien ami devenu ennemi' },
        { champion: 'Akali', type: 'student', note: 'Ancienne élève' },
        { champion: 'Kennen', type: 'ally', note: 'Ordre Kinkou' },
        { champion: 'Jhin', type: 'nemesis' },
        { champion: 'Kusho', type: 'parent', note: 'Père et ancien maître (PNJ, tué)' },
        { champion: 'Yunara', type: 'ally', note: 'Membre de l\'ordre Kinkou (PNJ)' },
    ],
    'Shyvana': [
        { champion: 'Jarvan IV', type: 'complex', note: 'Protège le prince malgré les tensions' },
    ],
    'Silco': [
        { champion: 'Jinx', type: 'parent', note: 'Père adoptif (tué)' },
        { champion: 'Vi', type: 'nemesis', note: 'Ennemi' },
        { champion: 'Vander', type: 'betrayer', note: 'Ancien partenaire' },
    ],
    'Singed': [
        { champion: 'Warwick', type: 'creation' },
        { champion: 'Riven', type: 'enemy', note: 'Responsable du bombardement chimique' },
    ],
    'Sion': [
        { champion: 'Jarvan IV', type: 'enemy', note: 'A tué l\'ancêtre de Jarvan IV' },
    ],
    'Sivir': [
        { champion: 'Azir', type: 'ancestor' },
        { champion: 'Cassiopeia', type: 'betrayed', note: 'Trahie et laissée pour morte' },
    ],
    'Skarner': [
        { champion: 'Seraphine', type: 'enemy', note: 'Utilise les âmes de son peuple (ancien lore)' },
        { champion: 'Camille', type: 'enemy', note: 'Le clan Ferros exploite les cristaux' },
        { champion: 'Jayce', type: 'enemy', note: 'Utilise l\'Hextech' },
    ],
    'Smolder': [
        { champion: 'Aurelion Sol', type: 'complex', note: 'Interaction familiale (Grand-oncle ?)' },
        { champion: 'Shyvana', type: 'friend', note: 'Autre dragon' },
    ],
    'Sona': [
        { champion: 'Etwahl', type: 'ally', note: 'Son instrument (conscient ?)' },
        { champion: 'Ryze', type: 'mentor', note: 'L\'a aidée à maîtriser sa magie (parfois)' },
        { champion: 'Xin Zhao', type: 'friend' },
    ],
    'Soraka': [
        { champion: 'Karthus', type: 'enemy', note: 'La Mort vs La Vie' },
        { champion: 'Warwick', type: 'complex', note: 'A tenté de le sauver (ancien lore)' },
        { champion: 'Pantheon', type: 'ally', note: 'Aide les mortels' },
    ],
    'Swain': [
        { champion: 'Darius', type: 'ally', note: 'Membre du Trifarix (Vision de Noxus)' },
        { champion: 'LeBlanc', type: 'complex', note: 'Rivalité politique et manipulation mutuelle' },
        { champion: 'Irelia', type: 'enemy', note: 'Sa défaite à la bataille du Placidium a été causée par Irelia' },
        { champion: 'Ambessa', type: 'ally', note: 'Membre du Trifarix' },
        { champion: 'Boram Darkwill', type: 'killer', note: 'A tué l\'ancien Empereur (PNJ)' },
    ],
    'Syndra': [
        { champion: 'Karma', type: 'enemy', note: 'L\'a emprisonnée dans le Rêve' },
        { champion: 'Irelia', type: 'enemy', note: 'Menace pour Ionia' },
        { champion: 'Zed', type: 'ally', note: 'Ennemis communs (Ordre Kinkou)' },
    ],
    'Sylas': [
        { champion: 'Lux', type: 'betrayer', note: 'A manipulé sa confiance pour s\'échapper' },
        { champion: 'Jarvan IV', type: 'enemy' },
        { champion: 'Garen', type: 'enemy' },
    ],
    'Tahm Kench': [
        { champion: 'Pyke', type: 'complex', note: 'Pactes avec les noyés' },
        { champion: 'Soraka', type: 'enemy', note: 'Démon du désir vs Guérisseuse' },
    ],
    'Taliyah': [
        { champion: 'Yasuo', type: 'mentor', note: 'Ancien maître du vent' },
        { champion: 'Azir', type: 'enemy', note: 'S\'oppose à son retour' },
        { champion: 'Sivir', type: 'complex' },
    ],
    'Taric': [
        { champion: 'Garen', type: 'friend', note: 'Ancien soldat de Demacia' },
        { champion: 'Diana', type: 'ally', note: 'Aspect de Targon' },
        { champion: 'Leona', type: 'ally', note: 'Aspect de Targon' },
    ],
    'Talon': [
        { champion: 'Katarina', type: 'adoptive-family', note: 'Sœur adoptive' },
        { champion: 'Cassiopeia', type: 'adoptive-family', note: 'Sœur adoptive' },
        { champion: 'Général Du Couteau', type: 'parent', note: 'Père adoptif/Mentor (PNJ)' },
    ],
    'Teemo': [
        { champion: 'Tristana', type: 'friend', note: 'Meilleurs amis' },
        { champion: 'Rumble', type: 'rival', note: 'Rivalité amicale' },
        { champion: 'Veigar', type: 'enemy', note: 'A volé le vaisseau mère (Skin)' },
    ],
    'Thresh': [
        { champion: 'Lucian', type: 'nemesis' },
        { champion: 'Senna', type: 'victim', note: 'L\'a capturée dans sa lanterne' },
        { champion: 'Viego', type: 'ally', note: 'Ancien bourreau qui a servi et manipulé Viego' },
    ],
    'Tristana': [
        { champion: 'Rumble', type: 'friend', note: 'Ami proche (ignore ses sentiments)' },
        { champion: 'Teemo', type: 'friend', note: 'Compagnon éclaireur' },
        { champion: 'Lulu', type: 'friend' },
    ],
    'Trundle': [
        { champion: 'Lissandra', type: 'ally', note: 'Lui a juré allégeance (pour le pouvoir)' },
        { champion: 'Ashe', type: 'enemy' },
    ],
    'Tryndamere': [
        { champion: 'Ashe', type: 'spouse' },
        { champion: 'Aatrox', type: 'nemesis', note: 'Recherche la vengeance contre le Darkin qui a massacré sa tribu' },
        { champion: 'Sejuani', type: 'enemy', note: 'Ennemi de faction' },
        { champion: 'Avarosa', type: 'ancestor', note: 'Époux d\'Ashe ; respecte l\'héritage' },
    ],
    'Twisted Fate': [
        { champion: 'Graves', type: 'complex', note: 'Anciens partenaires, réconciliation progressive' },
        { champion: 'Miss Fortune', type: 'ally' },
    ],
    'Twitch': [
        { champion: 'Zac', type: 'complex', note: 'Mutants de Zaun' },
    ],
    'Udyr': [
        { champion: 'Lee Sin', type: 'friend', note: 'Ami proche et guide' },
        { champion: 'Sejuani', type: 'parent', note: 'Père adoptif / Protecteur' },
        { champion: 'Volibear', type: 'mentor', note: 'Canalise son esprit' },
    ],
    'Urgot': [
        { champion: 'Swain', type: 'nemesis', note: 'L\'a trahi et envoyé à Zaun' },
        { champion: 'Caitlyn', type: 'enemy', note: 'A kidnappé les gardiens' },
        { champion: 'Vi', type: 'enemy' },
    ],
    'Vander': [
        { champion: 'Vi', type: 'adoptive-family', note: 'Père adoptif (transformé en Warwick)' },
        { champion: 'Jinx', type: 'adoptive-family', note: 'Père adoptif (transformé en Warwick)' },
        { champion: 'Warwick', type: 'complex', note: 'Identité post-transformation' },
        { champion: 'Silco', type: 'nemesis', note: 'Ancien partenaire' },
    ],
    'Varus': [
        { champion: 'Aatrox', type: 'ally' },
        { champion: 'Zaahen', type: 'ally', note: 'Darkin' },
        { champion: 'Valmar', type: 'complex', note: 'Hôte humain (Amant de Kai) (PNJ)' },
        { champion: 'Kai', type: 'complex', note: 'Hôte humain (Amant de Valmar) (PNJ)' },
    ],
    'Vayne': [
        { champion: 'Evelynn', type: 'nemesis', note: 'A tué ses parents' },
        { champion: 'Vladimir', type: 'enemy', note: 'Magie noire' },
        { champion: 'Poppy', type: 'ally', note: 'Sentinelles' },
    ],
    'Veigar': [
        { champion: 'Mordekaiser', type: 'nemesis', note: 'Son tortionnaire' },
        { champion: 'Lulu', type: 'friend', note: 'La seule qui le comprend' },
    ],
    'Vel\'Koz': [
        { champion: 'Zilean', type: 'enemy', note: 'Veut assimiler sa connaissance du temps' },
        { champion: 'Bel\'Veth', type: 'enemy', note: 'Loyal aux Veilleurs' },
    ],
    'Vex': [
        { champion: 'Viego', type: 'ally', note: 'Amuse Viego et sert la Ruine' },
    ],
    'Vi': [
        { champion: 'Jinx', type: 'sibling', note: 'Sœur cadette (Powder)' },
        { champion: 'Caitlyn', type: 'lover', note: 'Partenaire et amie proche (Arcane)' },
        { champion: 'Jayce', type: 'ally', note: 'Allié de circonstance' },
        { champion: 'Warwick', type: 'complex', note: 'Vander avant transformation (père adoptif)' },
        { champion: 'Silco', type: 'nemesis', note: 'Ennemi de Vander (PNJ)' },
        { champion: 'Mel', type: 'ally', note: 'Membre de l\'Enforcement' },
    ],
    'Viego': [
        { champion: 'Gwen', type: 'enemy', note: 'Son amour non-réciproque pour Isolde a indirectement créé Gwen' },
        { champion: 'Thresh', type: 'ally', note: 'A déclenché la Ruine en le servant' },
        { champion: 'Kalista', type: 'parent', note: 'Oncle' },
        { champion: 'Hecarim', type: 'ally', note: 'Ancien chevalier et traître' },
        { champion: 'Isolde', type: 'spouse', note: 'Épouse décédée (PNJ)' },
        { champion: 'Yorick', type: 'enemy' },
    ],
    'Viktor': [
        { champion: 'Jayce', type: 'rival' },
        { champion: 'Blitzcrank', type: 'creator' },
    ],
    'Vladimir': [
        { champion: 'LeBlanc', type: 'ally' },
        { champion: 'Swain', type: 'faction-member', note: 'Ancien conseiller de la famille Darkwill' },
        { champion: 'Viego', type: 'ancestor', note: 'Oncle de Camavor (Relation lointaine)' },
    ],
    'Volibear': [
        { champion: 'Ornn', type: 'sibling' },
        { champion: 'Anivia', type: 'sibling' },
        { champion: 'Aurora', type: 'enemy' },
    ],
    'Warwick': [
        { champion: 'Singed', type: 'creator', note: 'Transformé par Singed' },
        { champion: 'Vi', type: 'complex', note: 'Vander avant transformation (père adoptif)' },
        { champion: 'Jinx', type: 'complex', note: 'Vander avant transformation (père adoptif)' },
        { champion: 'Vander', type: 'complex', note: 'Identité passée (PNJ)' },
    ],
    'Wukong': [
        { champion: 'Maître Yi', type: 'student', note: 'Disciple auto-proclamé' },
    ],
    'Xayah': [
        { champion: 'Rakan', type: 'lover' },
        { champion: 'Ahri', type: 'complex', note: 'Neutre, mais méfiance envers les non-Vastayas' },
    ],
    'Xerath': [
        { champion: 'Azir', type: 'betrayer' },
        { champion: 'Nasus', type: 'enemy' },
        { champion: 'Renekton', type: 'corrupted', note: 'L\'a rendu fou pendant leur emprisonnement' },
    ],
    'Xin Zhao': [
        { champion: 'Jarvan IV', type: 'ally', note: 'Sénéchal dévoué' },
        { champion: 'Jarvan III', type: 'ally', note: 'A servi le roi jusqu\'à sa mort' },
        { champion: 'Alistar', type: 'friend', note: 'Passé de gladiateur' },
    ],
    'Yasuo': [
        { champion: 'Yone', type: 'sibling', note: 'Frère cadet (a tué Yone avant sa résurrection)' },
        { champion: 'Riven', type: 'complex', note: 'Tueuse involontaire de son maître - Source de la trahison de Yasuo' },
        { champion: 'Taliyah', type: 'student', note: 'Ancienne élève du vent' },
        { champion: 'Ahri', type: 'ally', note: 'Compagnons de voyage (Ruined King)' },
        { champion: 'Elder Souma', type: 'mentor', note: 'Maître assassiné (PNJ)' },
    ],
    'Yone': [
        { champion: 'Yasuo', type: 'sibling', note: 'Frère aîné' },
        { champion: 'Azakana', type: 'hunts', note: 'Chasseur de démons mineurs' },
    ],
    'Yorick': [
        { champion: 'Viego', type: 'enemy' },
        { champion: 'Isolde', type: 'ally', note: 'Protège une larme d\'Isolde (PNJ)' },
    ],
    'Yuumi': [
        { champion: 'Norra', type: 'parent', note: 'Sa maîtresse disparue (PNJ/LoR)' },
        { champion: 'Alistar', type: 'friend', note: 'Aime le poisson' },
    ],
    'Zaahen': [
        { champion: 'Naafiri', type: 'ally', note: 'Darkin' },
        { champion: 'Aatrox', type: 'ally', note: 'Darkin' },
        { champion: 'Varus', type: 'ally', note: 'Darkin' },
        { champion: 'Myisha', type: 'lover', note: 'Amante (PNJ, décédée)' },
    ],
    'Zac': [
        { champion: 'Twitch', type: 'friend', note: 'Potes de Zaun' },
        { champion: 'Riven', type: 'friend', note: 'Exilés (Fan canon très populaire)' },
    ],
    'Zed': [
        { champion: 'Shen', type: 'rival', note: 'Anciens frères d\'armes et élèves du même maître' },
        { champion: 'Jhin', type: 'enemy', note: 'A travaillé avec Shen pour capturer Jhin' },
        { champion: 'Kayn', type: 'student' },
        { champion: 'Akali', type: 'enemy', note: 'Divergence idéologique' },
        { champion: 'Kusho', type: 'killer', note: 'A tué son maître (PNJ)' },
    ],
    'Zeri': [
        { champion: 'Ekko', type: 'ally', note: 'Alliée des Feux-Volants' },
        { champion: 'Renata Glasc', type: 'enemy', note: 'Lutte contre les barons de la chimie' },
    ],
    'Ziggs': [
        { champion: 'Heimerdinger', type: 'complex' },
    ],
    'Zilean': [
        { champion: 'Vel\'Koz', type: 'enemy', note: 'Menace la tour temporelle' },
        { champion: 'Jax', type: 'ally', note: 'Sauver Icathia' },
        { champion: 'Volibear', type: 'enemy', note: 'Haine ancestrale (Légendes)' },
    ],
    'Zoé': [
        { champion: 'Aurelion Sol', type: 'enemy' },
        { champion: 'Ezreal', type: 'unrequited-love', note: 'Béguin pour Ezreal' },
    ],
    'Zyra': [
        { champion: 'Maokai', type: 'enemy', note: 'Envahisseuse' },
        { champion: 'Neeko', type: 'complex', note: 'Nature dangereuse' },
    ],
};