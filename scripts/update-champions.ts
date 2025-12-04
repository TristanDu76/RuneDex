import { createClient } from '@supabase/supabase-js';
import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';

// Charge les variables d'environnement
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// Utilise la clé Service Role si dispo (pour contourner les RLS), sinon la clé Anon
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Erreur: Identifiants Supabase manquants dans .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateAllChampions() {
    console.log('🚀 Démarrage de la mise à jour globale des champions (FR + EN)...');

    // 1. Récupérer la liste des champions existants
    const { data: champions, error } = await supabase
        .from('champions')
        .select('id, version');

    if (error || !champions) {
        console.error('Erreur lors de la récupération des champions:', error);
        return;
    }

    console.log(`📋 ${champions.length} champions trouvés à mettre à jour.`);
    let successCount = 0;
    let errorCount = 0;

    for (const champ of champions) {
        try {
            // 2. Récupérer les données FR (pour les colonnes de base)
            const urlFR = `https://ddragon.leagueoflegends.com/cdn/${champ.version}/data/fr_FR/champion/${champ.id}.json`;
            const resFR = await axios.get<any>(urlFR);
            const dataFR = resFR.data.data[champ.id];

            // 3. Récupérer les données EN (pour les colonnes _en et la standardisation)
            const urlEN = `https://ddragon.leagueoflegends.com/cdn/${champ.version}/data/en_US/champion/${champ.id}.json`;
            const resEN = await axios.get<any>(urlEN);
            const dataEN = resEN.data.data[champ.id];

            if (!dataFR || !dataEN) {
                console.warn(`⚠️ Données manquantes pour ${champ.id}`);
                errorCount++;
                continue;
            }

            // 4. Préparer la mise à jour
            const updates = {
                // --- Données de base (Français) ---
                title: dataFR.title,
                lore: dataFR.lore,
                blurb: dataFR.blurb,
                spells: dataFR.spells,
                passive: dataFR.passive,
                partype: dataFR.partype,
                tags: dataFR.tags,
                skins: dataFR.skins,

                // --- Données de traduction (Anglais) ---
                title_en: dataEN.title,
                lore_en: dataEN.lore,
                blurb_en: dataEN.blurb,
                spells_en: dataEN.spells,
                passive_en: dataEN.passive,
                partype_en: dataEN.partype,
                skins_en: dataEN.skins,

            };

            // 5. Envoyer à Supabase
            const { error: updateError } = await supabase
                .from('champions')
                .update(updates)
                .eq('id', champ.id);

            if (updateError) {
                console.error(`❌ Erreur mise à jour ${champ.id}:`, updateError.message);
                errorCount++;
            } else {
                console.log(`✅ ${champ.id} mis à jour (FR & EN)`);
                successCount++;
            }

        } catch (err: any) {
            console.error(`❌ Échec pour ${champ.id}:`, err.message);
            errorCount++;
        }
    }

    console.log('-----------------------------------');
    console.log(`🎉 Mise à jour terminée !`);
    console.log(`Succès : ${successCount}`);
    console.log(`Erreurs : ${errorCount}`);
}

updateAllChampions();
