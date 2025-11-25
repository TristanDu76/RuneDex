export const translations = {
    fr_FR: {
        home: {
            subtitle: "Base de données complète de {count} champions",
            searchPlaceholder: "Rechercher un champion...",
            noResults: "Aucun champion trouvé pour \"{query}\"",
        },
        champion: {
            loreTitle: "Histoire",
            spellsTitle: "Compétences",
            passive: "Passif",
            cooldown: "Délai :",
            cost: "Coût :",
            range: "Portée :",
            rangeVariable: "Variable",
            rangeUnlimited: "Illimitée",
            relatedChampions: "Champions liés",
        },
        factions: {
            "bandle-city": "Bandle City",
            "bilgewater": "Bilgewater",
            "demacia": "Demacia",
            "freljord": "Freljord",
            "ionia": "Ionia",
            "ixtal": "Ixtal",
            "noxus": "Noxus",
            "piltover": "Piltover",
            "shadow-isles": "Îles Obscures",
            "shurima": "Shurima",
            "mount-targon": "Mont Targon",
            "targon": "Targon",
            "zaun": "Zaun",
            "void": "Néant",
            "runeterra": "Runeterra",
            "unaffiliated": "Non affilié",
        },
        relationTypes: {
            // Famille
            sibling: "Frère/Sœur",
            parent: "Parent",
            child: "Enfant",
            spouse: "Époux/Épouse",
            ancestor: "Ancêtre",
            descendant: "Descendant",
            "adoptive-family": "Famille adoptive",
            // Romance & Amour
            lover: "Amant(e)",
            "ex-lover": "Ex-amant(e)",
            "unrequited-love": "Amour non partagé",
            // Amitié & Alliance
            friend: "Ami(e)",
            mentor: "Mentor",
            student: "Élève",
            ally: "Allié",
            comrade: "Camarade",
            // Rivalité & Hostilité
            enemy: "Ennemi",
            rival: "Rival",
            nemesis: "Némésis",
            betrayed: "Trahi par",
            betrayer: "A trahi",
            victim: "Victime de",
            killer: "A tué",
            // Relations complexes
            complex: "Relation complexe",
            creator: "Créateur",
            creation: "Création de",
            "corrupted-by": "Corrompu par",
            corrupted: "A corrompu",
            hunts: "Chasse",
            "hunted-by": "Chassé par",
        },
        search: {
            placeholder: "Rechercher...",
            noResults: "Aucun résultat trouvé"
        }
    },
    en_US: {
        home: {
            subtitle: "Complete database of {count} champions",
            searchPlaceholder: "Search for a champion...",
            noResults: "No champion found for \"{query}\"",
        },
        champion: {
            loreTitle: "Lore",
            spellsTitle: "Abilities",
            passive: "Passive",
            cooldown: "Cooldown:",
            cost: "Cost:",
            range: "Range:",
            rangeVariable: "Variable",
            rangeUnlimited: "Unlimited",
            relatedChampions: "Related Champions",
        },
        factions: {
            "bandle-city": "Bandle City",
            "bilgewater": "Bilgewater",
            "demacia": "Demacia",
            "freljord": "Freljord",
            "ionia": "Ionia",
            "ixtal": "Ixtal",
            "noxus": "Noxus",
            "piltover": "Piltover",
            "shadow-isles": "Shadow Isles",
            "shurima": "Shurima",
            "mount-targon": "Mount Targon",
            "targon": "Mount Targon",
            "zaun": "Zaun",
            "void": "The Void",
            "runeterra": "Runeterra",
            "unaffiliated": "Runeterra",
        },
        relationTypes: {
            // Family
            sibling: "Sibling",
            parent: "Parent",
            child: "Child",
            spouse: "Spouse",
            ancestor: "Ancestor",
            descendant: "Descendant",
            "adoptive-family": "Adoptive Family",
            // Romance & Love
            lover: "Lover",
            "ex-lover": "Ex-Lover",
            "unrequited-love": "Unrequited Love",
            // Friendship & Alliance
            friend: "Friend",
            mentor: "Mentor",
            student: "Student",
            ally: "Ally",
            comrade: "Comrade",
            // Rivalry & Hostility
            enemy: "Enemy",
            rival: "Rival",
            nemesis: "Nemesis",
            betrayed: "Betrayed by",
            betrayer: "Betrayed",
            victim: "Victim of",
            killer: "Killed",
            // Complex Relations
            complex: "Complex Relationship",
            creator: "Creator",
            creation: "Creation of",
            "corrupted-by": "Corrupted by",
            corrupted: "Corrupted",
            hunts: "Hunts",
            "hunted-by": "Hunted by",
        },
        search: {
            placeholder: "Search...",
            noResults: "No results found"
        }
    }
};

export type Locale = 'fr_FR' | 'en_US';

export function getTranslation(lang: string) {
    return translations[lang as Locale] || translations['fr_FR'];
}
