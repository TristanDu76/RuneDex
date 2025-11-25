/**
 * Base de données des relations entre champions basée sur le lore officiel de League of Legends
 * Types de relations détaillés pour une meilleure précision du lore
 *
 * NOTE IMPORTANTE : Les relations 'sibling', 'parent', 'child' sont parfois utilisées pour
 * des liens non-sanguins (adoptifs, démi-dieux) ou des liens spirituels profonds,
 * clarifiés par la note (ex: Volibear, Ornn, Anivia, etc.).
 */

export type RelationType =
    // Famille
    | 'sibling'             // Frère/Sœur (aussi utilisé pour les demi-dieux/famille adoptive)
    | 'parent'              // Parent (aussi utilisé pour Oncle/Tante/Mentor-Fondateur)
    | 'child'               // Enfant (aussi utilisé pour Neveu/Nièce/Disciple-Héritier)
    | 'spouse'              // Époux/Épouse
    | 'ancestor'            // Ancêtre
    | 'descendant'          // Descendant
    | 'adoptive-family'     // Famille adoptive
    // Romance & Amour
    | 'lover'               // Amant(e) actuel(le)
    | 'ex-lover'            // Ex-amant(e)
    | 'unrequited-love'     // Amour non partagé (unilatéral)
    // Amitié & Alliance
    | 'friend'              // Ami(e)
    | 'mentor'              // Mentor
    | 'student'             // Élève
    | 'ally'                // Allié
    | 'comrade'             // Camarade d'armes
    | 'faction-member'      // Membre de la même faction/région (n'implique pas amitié)
    // Rivalité & Hostilité
    | 'enemy'               // Ennemi
    | 'rival'               // Rival
    | 'nemesis'             // Némésis (ennemi juré, vendetta)
    | 'betrayed'            // Trahi par
    | 'betrayer'            // A trahi
    | 'victim'              // Victime de (passif ou indirect)
    | 'killer'              // A tué
    // Relations complexes
    | 'complex'             // Relation complexe/ambiguë (inclut anciens liens, liens d'honneur, etc.)
    | 'creator'             // Créateur
    | 'creation'            // Création de
    | 'corrupted-by'        // Corrompu par
    | 'corrupted'           // A corrompu
    | 'hunts'               // Chasse/Traque
    | 'hunted-by';          // Chassé par

export interface ChampionRelation {
    champion: string;
    type: RelationType;
    note?: string; // Note optionnelle pour plus de contexte
}

export const championRelations: Record<string, ChampionRelation[]> = {
    // === DEMACIA ===
    'Garen': [
        { champion: 'Lux', type: 'sibling', note: 'Frère aîné' },
        { champion: 'Jarvan IV', type: 'comrade' },
        { champion: 'Katarina', type: 'complex', note: 'Romance secrète et rivalité politique' },
        { champion: 'Sylas', type: 'nemesis' },
        { champion: 'Xin Zhao', type: 'comrade' },
    ],
    'Lux': [
        { champion: 'Garen', type: 'sibling', note: 'Sœur cadette' },
        { champion: 'Ezreal', type: 'friend', note: 'Ami avec un potentiel romantique non exploré' },
        { champion: 'Sylas', type: 'complex', note: 'Ancienne connexion, manipulation et trahison' },
        { champion: 'Galio', type: 'friend', note: 'Son pouvoir réveille Galio' },
    ],
    'Jarvan IV': [
        { champion: 'Garen', type: 'comrade' },
        { champion: 'Xin Zhao', type: 'ally', note: 'Garde du corps et conseiller' },
        { champion: 'Shyvana', type: 'complex', note: 'Protectrice ; sa présence est controversée' },
        { champion: 'Sylas', type: 'betrayed', note: 'Ancien prisonnier qui a déclenché une guerre civile' },
    ],
    'Sylas': [
        { champion: 'Lux', type: 'betrayer', note: 'A manipulé sa confiance pour s\'échapper' },
        { champion: 'Garen', type: 'nemesis' },
        { champion: 'Jarvan IV', type: 'enemy', note: 'Chef de la rébellion contre la Couronne' },
    ],
    'Galio': [
        { champion: 'Lux', type: 'friend', note: 'S\'anime grâce à la magie de Lux' },
    ],
    'Shyvana': [
        { champion: 'Jarvan IV', type: 'complex', note: 'Protège le prince malgré les tensions' },
    ],
    'Xin Zhao': [
        { champion: 'Jarvan IV', type: 'ally' },
        { champion: 'Garen', type: 'comrade' },
    ],
    'Poppy': [
        { champion: 'Ornn', type: 'hunted-by', note: 'Cherche le forgeron légendaire, son créateur indirect' },
    ],

    // === NOXUS ===
    'Darius': [
        { champion: 'Draven', type: 'sibling', note: 'Frère aîné' },
        { champion: 'Swain', type: 'ally', note: 'Membre du Trifarix (Main de Noxus)' },
        { champion: 'Garen', type: 'rival' },
        { champion: 'Samira', type: 'faction-member', note: 'Loyaliste de Noxus' },
    ],
    'Draven': [
        { champion: 'Darius', type: 'sibling', note: 'Frère cadet' },
    ],
    'Katarina': [
        { champion: 'Cassiopeia', type: 'sibling', note: 'Sœur aînée' },
        { champion: 'Garen', type: 'complex', note: 'Romance secrète et rivalité politique' },
        { champion: 'Talon', type: 'adoptive-family', note: 'Enfants adoptifs du Général Du Couteau' },
    ],
    'Cassiopeia': [
        { champion: 'Katarina', type: 'sibling', note: 'Sœur cadette' },
        { champion: 'Sivir', type: 'betrayer', note: 'L\'a trahie et laissée pour morte' },
    ],
    'Talon': [
        { champion: 'Katarina', type: 'adoptive-family' },
        { champion: 'Général Du Couteau', type: 'adoptive-family', note: 'Père adoptif et mentor (champion non jouable)' },
    ],
    'Swain': [
        { champion: 'Darius', type: 'ally', note: 'Membre du Trifarix (Vision de Noxus)' },
        { champion: 'LeBlanc', type: 'complex', note: 'Ennemi politique interne et membre de la Rose Noire' },
        { champion: 'Irelia', type: 'enemy', note: 'Sa défaite à la bataille du Placidium a été causée par Irelia' },
    ],
    'LeBlanc': [
        { champion: 'Swain', type: 'complex' },
        { champion: 'Vladimir', type: 'ally', note: 'Membre de la Rose Noire' },
        { champion: 'Rell', type: 'enemy', note: 'Ancienne directrice de l\'académie ayant expérimenté sur Rell' },
    ],
    'Vladimir': [
        { champion: 'LeBlanc', type: 'ally' },
        { champion: 'Swain', type: 'faction-member', note: 'Ancien conseiller de la famille Darkwill' }
    ],
    'Sion': [
        { champion: 'Jarvan IV', type: 'enemy', note: 'A tué l\'ancêtre de Jarvan IV' },
    ],
    'Samira': [
        { champion: 'Darius', type: 'faction-member', note: 'Loyaliste de Noxus' },
    ],
    'Rell': [
        { champion: 'LeBlanc', type: 'nemesis', note: 'Mène une vendetta contre la Rose Noire et ses chefs' },
    ],

    // === ÎLES OBSCURES (Shadow Isles) ===
    'Thresh': [
        { champion: 'Lucian', type: 'nemesis' },
        { champion: 'Senna', type: 'victim', note: 'L\'a capturée dans sa lanterne' },
        { champion: 'Viego', type: 'ally', note: 'Ancien bourreau qui a servi et manipulé Viego' },
    ],
    'Lucian': [
        { champion: 'Senna', type: 'spouse', note: 'Époux' },
        { champion: 'Thresh', type: 'nemesis' },
    ],
    'Senna': [
        { champion: 'Lucian', type: 'spouse', note: 'Épouse' },
        { champion: 'Thresh', type: 'nemesis', note: 'Emprisonnée puis libérée avec un nouveau pouvoir' },
    ],
    'Viego': [
        { champion: 'Gwen', type: 'enemy', note: 'Son amour non-réciproque pour Isolde a indirectement créé Gwen' },
        { champion: 'Thresh', type: 'ally', note: 'A déclenché la Ruine en le servant' },
        { champion: 'Kalista', type: 'parent', note: 'Son oncle (relation complexe de suzerain)' },
        { champion: 'Hecarim', type: 'ally', note: 'Ancien chevalier et traître' },
    ],
    'Gwen': [
        { champion: 'Viego', type: 'enemy', note: 'Créée par le corps d\'Isolde pour contrer la Ruine' },
    ],
    'Kalista': [
        { champion: 'Viego', type: 'child', note: 'Sa nièce (relation complexe de conseillère)' },
        { champion: 'Hecarim', type: 'betrayed', note: 'Poignardée par lui lors de la Ruine' },
    ],
    'Hecarim': [
        { champion: 'Kalista', type: 'betrayer', note: 'L\'a trahie pour gagner la faveur de Viego' },
        { champion: 'Viego', type: 'ally' },
    ],
    'Maokai': [
        { champion: 'Viego', type: 'enemy', note: 'Veut restaurer la nature des Îles' },
    ],
    'Yorick': [
        { champion: 'Viego', type: 'enemy' },
    ],

    // === FRELJORD ===
    'Ashe': [
        { champion: 'Tryndamere', type: 'spouse', note: 'Mariage politique devenu amour' },
        { champion: 'Sejuani', type: 'rival', note: 'Guerre des Trois Sœurs / Cousines' },
        { champion: 'Lissandra', type: 'enemy' },
        { champion: 'Braum', type: 'ally', note: 'Chef des Avarosans' },
    ],
    'Tryndamere': [
        { champion: 'Ashe', type: 'spouse' },
        { champion: 'Aatrox', type: 'nemesis', note: 'Recherche la vengeance contre le Darkin qui a massacré sa tribu' },
        { champion: 'Sejuani', type: 'enemy', note: 'Ennemi de faction' },
    ],
    'Sejuani': [
        { champion: 'Ashe', type: 'rival', note: 'Guerre des Trois Sœurs / Cousines' },
        { champion: 'Lissandra', type: 'enemy' },
        { champion: 'Olaf', type: 'ally', note: 'Berserker de la Griffe Hivernale' },
    ],
    'Lissandra': [
        { champion: 'Ashe', type: 'enemy' },
        { champion: 'Sejuani', type: 'enemy' },
        { champion: 'Trundle', type: 'ally', note: 'Manipulé pour servir ses intérêts (roi des Trolls)' },
    ],
    'Braum': [
        { champion: 'Ashe', type: 'ally' },
    ],
    'Olaf': [
        { champion: 'Sejuani', type: 'ally' },
    ],
    'Trundle': [
        { champion: 'Lissandra', type: 'ally', note: 'Roi des Trolls manipulé' },
    ],
    'Volibear': [
        { champion: 'Ornn', type: 'sibling', note: 'Frère - Demi-dieux du Freljord' },
        { champion: 'Anivia', type: 'sibling', note: 'Sœur - Demi-dieux du Freljord' },
    ],
    'Ornn': [
        { champion: 'Volibear', type: 'sibling' },
        { champion: 'Anivia', type: 'sibling' },
        { champion: 'Poppy', type: 'complex', note: 'Le marteau de Poppy est lié à lui' },
    ],
    'Anivia': [
        { champion: 'Volibear', type: 'sibling' },
        { champion: 'Ornn', type: 'sibling' },
    ],
    'Nunu & Willump': [
        { champion: 'Lissandra', type: 'enemy' },
    ],

    // === IONIA ===
    'Yasuo': [
        { champion: 'Yone', type: 'sibling', note: 'Frère cadet (a tué Yone avant sa résurrection)' },
        { champion: 'Riven', type: 'complex', note: 'Tueuse involontaire de son maître - Source de la trahison de Yasuo' },
        { champion: 'Ahri', type: 'ally', note: 'Compagnons de voyage' },
        { champion: 'Taliyah', type: 'student', note: 'Ancienne élève du vent' },
    ],
    'Yone': [
        { champion: 'Yasuo', type: 'sibling', note: 'Frère aîné' },
    ],
    'Riven': [
        { champion: 'Yasuo', type: 'complex' },
    ],
    'Zed': [
        { champion: 'Shen', type: 'rival', note: 'Anciens frères d\'armes et élèves du même maître' },
        { champion: 'Jhin', type: 'enemy', note: 'A travaillé avec Shen pour capturer Jhin' },
        { champion: 'Kayn', type: 'student' },
        { champion: 'Akali', type: 'faction-member', note: 'Fait partie du même ordre (Ordre des Ombres)' },
    ],
    'Shen': [
        { champion: 'Zed', type: 'rival', note: 'Ancien ami devenu ennemi' },
        { champion: 'Akali', type: 'mentor', note: 'Ancien maître' },
        { champion: 'Kennen', type: 'ally', note: 'Ordre Kinkou' },
        { champion: 'Jhin', type: 'nemesis' },
    ],
    'Akali': [
        { champion: 'Shen', type: 'mentor', note: 'Ancien maître qu\'elle a quitté' },
        { champion: 'Kennen', type: 'ally', note: 'Ordre Kinkou' },
        { champion: 'Zed', type: 'enemy', note: 'Divergence idéologique forte' },
    ],
    'Kennen': [
        { champion: 'Shen', type: 'ally', note: 'Ordre Kinkou' },
        { champion: 'Akali', type: 'ally', note: 'Ordre Kinkou' },
    ],
    'Kayn': [
        { champion: 'Zed', type: 'mentor' },
    ],
    'Jhin': [
        { champion: 'Zed', type: 'enemy' },
        { champion: 'Shen', type: 'nemesis' },
    ],
    'Irelia': [
        { champion: 'Karma', type: 'ally', note: 'Cheffe de la résistance Ionia' },
        { champion: 'Swain', type: 'enemy', note: 'Invasion de Noxus' },
    ],
    'Karma': [
        { champion: 'Irelia', type: 'ally' },
    ],
    'Xayah': [
        { champion: 'Rakan', type: 'lover' },
        { champion: 'Ahri', type: 'complex', note: 'Neutre, mais méfiance envers les non-Vastayas' },
        { champion: 'Master Yi', type: 'faction-member', note: 'Conflit au sujet des humains' },
    ],
    'Rakan': [
        { champion: 'Xayah', type: 'lover' },
        { champion: 'Ahri', type: 'complex' },
    ],
    'Ahri': [
        { champion: 'Yasuo', type: 'ally' },
        { champion: 'Xayah', type: 'complex', note: 'Neutre, concentrée sur sa quête personnelle' },
        { champion: 'Rakan', type: 'complex' },
    ],
    'Wukong': [
        { champion: 'Master Yi', type: 'student', note: 'Disciple auto-proclamé' },
    ],
    'Master Yi': [
        { champion: 'Wukong', type: 'mentor' },
    ],
    'Taliyah': [
        { champion: 'Yasuo', type: 'mentor', note: 'Ancien maître du vent' },
    ],

    // === PILTOVER & ZAUN ===
    'Vi': [
        { champion: 'Jinx', type: 'sibling', note: 'Sœur cadette (Powder)' },
        { champion: 'Caitlyn', type: 'friend', note: 'Partenaire et amie proche' },
        { champion: 'Jayce', type: 'faction-member', note: 'Application de la loi à Piltover' },
        { champion: 'Warwick', type: 'complex', note: 'Vander avant transformation (père adoptif)' },
    ],
    'Jinx': [
        { champion: 'Vi', type: 'sibling', note: 'Sœur aînée' },
        { champion: 'Caitlyn', type: 'nemesis' },
        { champion: 'Warwick', type: 'complex', note: 'Vander avant transformation (père adoptif)' },
    ],
    'Caitlyn': [
        { champion: 'Vi', type: 'friend' },
        { champion: 'Jinx', type: 'nemesis' },
        { champion: 'Jayce', type: 'faction-member', note: 'Application de la loi à Piltover' },
    ],
    'Jayce': [
        { champion: 'Caitlyn', type: 'faction-member' },
        { champion: 'Vi', type: 'faction-member' },
        { champion: 'Viktor', type: 'rival', note: 'Anciens partenaires' },
        { champion: 'Heimerdinger', type: 'mentor' },
    ],
    'Viktor': [
        { champion: 'Jayce', type: 'rival' },
        { champion: 'Blitzcrank', type: 'creator' },
    ],
    'Blitzcrank': [
        { champion: 'Viktor', type: 'creation' },
    ],
    'Heimerdinger': [
        { champion: 'Jayce', type: 'student' },
        { champion: 'Ziggs', type: 'complex', note: 'Ancien assistant turbulent' },
    ],
    'Ziggs': [
        { champion: 'Heimerdinger', type: 'complex' },
    ],
    'Ekko': [
        { champion: 'Jinx', type: 'friend', note: 'Amis d\'enfance (avant Jinx)' },
        { champion: 'Vi', type: 'friend' },
    ],
    'Ezreal': [
        { champion: 'Lux', type: 'unrequited-love', note: 'Intérêt romantique non partagé (par Lux)' },
    ],
    'Seraphine': [
        { champion: 'Skarner', type: 'enemy', note: 'Utilise involontairement la souffrance de son peuple (Brackern)' },
    ],
    'Warwick': [
        { champion: 'Singed', type: 'creation', note: 'Transformé par Singed' },
        { champion: 'Vi', type: 'complex', note: 'Vander avant transformation (père adoptif)' },
        { champion: 'Jinx', type: 'complex', note: 'Vander avant transformation (père adoptif)' },
    ],
    'Singed': [
        { champion: 'Warwick', type: 'creator' },
    ],

    // === SHURIMA ===
    'Azir': [
        { champion: 'Xerath', type: 'betrayed', note: 'Ancien ami et esclave' },
        { champion: 'Sivir', type: 'descendant', note: 'Descendante lointaine' },
        { champion: 'Nasus', type: 'ally', note: 'Ancien général (Ascensionné)' },
        { champion: 'Renekton', type: 'complex', note: 'Ancien général (Ascensionné) devenu fou' },
    ],
    'Xerath': [
        { champion: 'Azir', type: 'betrayer' },
        { champion: 'Nasus', type: 'enemy' },
        { champion: 'Renekton', type: 'corrupted', note: 'L\'a rendu fou pendant leur emprisonnement' },
    ],
    'Sivir': [
        { champion: 'Azir', type: 'ancestor' },
        { champion: 'Cassiopeia', type: 'betrayed', note: 'Trahie et laissée pour morte' },
    ],
    'Nasus': [
        { champion: 'Renekton', type: 'sibling', note: 'Frère aîné' },
        { champion: 'Azir', type: 'ally' },
        { champion: 'Xerath', type: 'enemy' },
    ],
    'Renekton': [
        { champion: 'Nasus', type: 'sibling', note: 'Frère cadet (considère Nasus comme son bourreau)' },
        { champion: 'Azir', type: 'complex' },
        { champion: 'Xerath', type: 'corrupted-by' },
    ],

    // === BILGEWATER ===
    'Miss Fortune': [
        { champion: 'Gangplank', type: 'nemesis', note: 'A tué sa famille' },
        { champion: 'Twisted Fate', type: 'ally' },
    ],
    'Gangplank': [
        { champion: 'Miss Fortune', type: 'nemesis' },
        { champion: 'Illaoi', type: 'ex-lover' },
    ],
    'Illaoi': [
        { champion: 'Gangplank', type: 'ex-lover' },
    ],
    'Twisted Fate': [
        { champion: 'Graves', type: 'complex', note: 'Anciens partenaires, réconciliation progressive' },
        { champion: 'Miss Fortune', type: 'ally' },
    ],
    'Graves': [
        { champion: 'Twisted Fate', type: 'complex', note: 'Réconciliation progressive' },
    ],
    'Pyke': [
        { champion: 'Nautilus', type: 'complex', note: 'Deux âmes perdues de Bilgewater liées par la hantise' },
    ],
    'Nautilus': [
        { champion: 'Pyke', type: 'complex' },
    ],

    // === TARGON ===
    'Leona': [
        { champion: 'Diana', type: 'complex', note: 'Anciennes amies devenues ennemies puis alliées' },
        { champion: 'Pantheon', type: 'faction-member', note: 'Aspect du Sol (ancien Rakkor)' },
    ],
    'Diana': [
        { champion: 'Leona', type: 'complex' },
    ],
    'Pantheon': [
        { champion: 'Leona', type: 'faction-member' },
        { champion: 'Aatrox', type: 'nemesis', note: 'A tué l\'Aspect de la Guerre (l\'ancienne entité)' },
    ],
    'Taric': [
        { champion: 'Leona', type: 'faction-member', note: 'Aspect du Protecteur' },
    ],
    'Aphelios': [
        { champion: 'Alune', type: 'sibling', note: 'Sœur jumelle (lien spirituel fort)' },
    ],

    // === VOID ===
    'Kassadin': [
        { champion: "Kai'Sa", type: 'child', note: 'Fille' },
        { champion: 'Malzahar', type: 'nemesis', note: 'A causé la perte de sa famille' },
    ],
    "Kai'Sa": [
        { champion: 'Kassadin', type: 'parent', note: 'Père' },
    ],
    'Malzahar': [
        { champion: 'Kassadin', type: 'nemesis' },
    ],

    // === DARKIN ===
    'Aatrox': [
        { champion: 'Pantheon', type: 'killer', note: 'A tué l\'Aspect (l\'ancienne entité divine)' },
        { champion: 'Tryndamere', type: 'nemesis', note: 'Sa survie après le massacre est une insulte' },
        { champion: 'Varus', type: 'ally', note: 'Darkin' },
        { champion: 'Kayn', type: 'enemy', note: 'Rhaast (Kayn) est un autre Darkin rival' },
    ],
    'Varus': [
        { champion: 'Aatrox', type: 'ally' },
    ],

    // === BANDLE CITY / YORDLES ===
    'Teemo': [
        { champion: 'Tristana', type: 'friend' },
    ],
    'Tristana': [
        { champion: 'Teemo', type: 'friend' },
    ],
    'Lulu': [
        { champion: 'Veigar', type: 'complex', note: 'Relation chaotique' },
    ],
    'Veigar': [
        { champion: 'Lulu', type: 'complex' },
    ],

    // === AUTRES / LIENS TRANS-RÉGIONAUX ===
    'Skarner': [
        { champion: 'Seraphine', type: 'victim', note: 'Son peuple utilisé pour les cristaux de Seraphine (sans qu\'elle le sache)' },
    ],
};