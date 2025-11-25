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
        },
        search: {
            placeholder: "Rechercher...",
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
        },
        search: {
            placeholder: "Search...",
        }
    }
};

export type Locale = 'fr_FR' | 'en_US';

export function getTranslation(lang: string) {
    return translations[lang as Locale] || translations['fr_FR'];
}
