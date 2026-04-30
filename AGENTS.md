# RuneDex

## Stack et architecture

- Node.js 20+, npm, Next.js 16 App Router, React 19, TypeScript strict et Tailwind CSS 4.
- Les routes applicatives vivent sous `src/app/[locale]`.
- `next-intl` gère `fr` et `en`; `fr` est la locale par défaut. Configuration dans `src/i18n/`, interception dans `src/proxy.ts`.
- Les accès serveur aux données JSON passent principalement par `src/lib/data.ts` et le cache de `src/lib/cache.ts`.
- Redux Toolkit/RTK Query porte l’état client. La carte Leaflet reste côté client via un import dynamique avec `ssr: false`.

## Commandes canoniques

- Développement : `npm run dev`
- Développement sans régénération des données : `SKIP_PREBUILD=1 npm run dev`
- Génération du manifeste et des shards, puis validation : `npm run prebuild`
- Build de production : `npm run build`
- Lint global : `npm run lint`
- Lint ciblé : `npx eslint <fichiers>`
- Typecheck : `npx tsc --noEmit --incremental false`
- Tests ciblés : `npx vitest run <fichier>`
- Suite complète : `npx vitest run`
- Intégrité des données : `npm run validate`
- Intégrité détaillée : `VERBOSE_INTEGRITY=1 npm run validate`
- Rapport de santé : `npm run stats`
- Mise à jour Data Dragon : `npm run update-data`

`npm run dev` exécute normalement `predev`. `npm run build` exécute toujours `prebuild` et peut donc réécrire les sorties générées. Pour un build de validation qui ne doit pas modifier ces sorties dans le checkout courant, utiliser une copie isolée du projet.

## Données et fichiers générés

Sources principales :

- `src/data/champions/*.json`, hors `index.json`
- `src/data/lore-characters/*.json`, hors `index.json`
- `src/data/artifacts/*.json`
- `src/data/runes/*.json`
- `src/data/relations.json`
- `src/data/artifact-owners.json`
- `src/data/rune-owners.json`
- `src/data/regions.ts`

`src/scripts/generate-manifest.mjs` ne scanne que les champions et personnages de lore. Il génère :

- `src/data/manifest.json`
- `src/data/shards/<factionKey>.json`

`npm run update-data` réécrit les fichiers champions ainsi que :

- `src/data/champions-summary.json`
- `src/data/champions/index.json`
- `src/data/version.json`

Les relations présentes dans `relations.json` et les champs `related_characters` des entités sont deux sources distinctes utilisées par l’application.

## Règles des shards

- Les clés de shard utilisent le kebab-case. Réutiliser `src/lib/slug-config.ts` au lieu d’ajouter une nouvelle normalisation.
- Le manifeste conserve la faction principale dans `factionKey` et toutes les appartenances normalisées dans `factionKeys`; chaque shard reçoit les personnages qui lui appartiennent.
- La génération injecte les relations réciproques dans le manifeste produit.
- Après validation complète des sources, le générateur supprime les anciens fichiers de `src/data/shards` qui ne correspondent plus à une faction; inspecter toute suppression générée.
- `validate-integrity.mjs` échoue sur les incohérences critiques de manifeste ou de shards, mais peut retourner `0` avec de simples avertissements. Toujours lire le rapport, éventuellement avec `VERBOSE_INTEGRITY=1`.
- Toute modification de la liste des shards autorisés doit aussi mettre à jour l’allowlist de `src/app/api/data/shards/[faction]/route.ts`.
- Conserver dans cette route la double protection : allowlist puis confinement du chemin avec `path.resolve()` et `path.relative()`.
- Conserver les cas encodés et doublement encodés dans `route.test.ts`.

## Routing et i18n

- Utiliser `Link`, `redirect`, `useRouter` et `usePathname` depuis `@/i18n/routing` pour préserver la locale.
- Les `params` des pages et Route Handlers sont des promesses avec Next.js 16 et doivent être attendus.
- La carte est la page racine localisée, `/{locale}`; il n’existe pas de route `/{locale}/map`.
- La liste des champions est `/{locale}/champions`, mais une fiche utilise `/{locale}/champion/[championId]`.
- Les textes d’interface vont dans `src/lib/translations/fr.json` et `en.json`.
- Pour les données bilingues, conserver les paires existantes : `lore`/`lore_en`, `description_fr`/`description_en`, `lore_fr`/`lore_en`, et `note_fr`/`note_en`. Une relation possède les deux notes ou aucune.

## Validations attendues

- Logique TypeScript, Redux ou API : test ciblé, suite Vitest, lint ciblé et typecheck.
- Route, layout, configuration Next.js ou i18n : ajouter `npm run build`.
- Champions, lore, factions, régions ou relations : ajouter `npm run prebuild`, examiner les avertissements et inspecter les changements de manifeste et de shards.
- Modification du pipeline Data Dragon : vérifier aussi `champions-summary.json`, `champions/index.json` et `version.json`.
- Le build télécharge actuellement Marcellus et Roboto via `next/font`; il nécessite donc un accès réseau aux Google Fonts.

## Pièges connus

- Les identifiants n’ont pas un format unique : les champions et leurs fichiers suivent souvent la casse Data Dragon (`Ahri`), tandis que le manifeste, le lore, les relations et les shards utilisent des identifiants normalisés en minuscules ou kebab-case.
- Les régions sont dupliquées entre `src/data/regions.ts`, `LeafletInteractiveMap.tsx` et `REGION_INFO` dans la page de région. Une modification régionale doit examiner ces trois sources.
- Pour charger un shard régional, passer par `normalizeRegionToShardKey`; ne pas recréer une normalisation qui casserait `shadow-isles` ou `bandle-city`.
- `images.unoptimized` est activé dans `next.config.ts`; ne pas supposer que les grandes images seront redimensionnées par Next.js.
- `npm run update-data` ne réécrit rien lorsque la version Data Dragon est inchangée; utiliser `--force` uniquement pour forcer explicitement la mise à jour.
- Le lint global possède une dette préexistante. Distinguer son résultat des erreurs éventuelles sur les fichiers touchés.
- Le README décrit certains identifiants et la couverture FR/EN de façon plus stricte que l’état réel; vérifier les données et les loaders.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
