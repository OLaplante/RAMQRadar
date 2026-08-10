# RAMQ Radar

Application web statique pour comprendre et optimiser sa facturation RAMQ.
Aucune donnée n'est envoyée à un serveur : tout est stocké dans le navigateur
(`localStorage`).

## Déploiement sur GitHub Pages

1. Téléverser **tous les fichiers de ce dossier à la racine** du dépôt.
2. `Settings` → `Pages` → Source : `Deploy from a branch`, branche `main`,
   dossier `/ (root)`.
3. Attendre une minute, puis ouvrir l'URL fournie.

Aucune étape de build. Aucune dépendance.

## Les 16 fichiers

| Fichier | Rôle | Obligatoire |
|---|---|---|
| `index.html` | L'application entière (HTML + CSS + JS) | **oui** |
| `vulnerabilite.json` | Écarts tarifaires vulnérable / non vulnérable | **oui** |
| `actes_inclus.json` | Actes compris dans la visite, non facturables séparément | **oui** |
| `manifest.json` | Manifeste PWA | oui (installation) |
| `sw.js` | Service worker, mode hors ligne | oui (hors ligne) |
| `favicon.ico`, `icon-16/32/48/180/192/512.png` | Icônes | oui |
| `icon-maskable-192/512.png` | Icônes adaptatives Android | oui |
| `apple-touch-icon.png` | Icône iOS | oui |
| `og-image.png` | Aperçu au partage (1200×630) | non |
| `README.md` | Ce fichier | non |

Si un fichier non obligatoire manque, l'app fonctionne quand même : le service
worker met chaque ressource en cache indépendamment et ignore celles qui
échouent.

## ⚠️ Incrémenter le cache à chaque déploiement

Dans `sw.js`, première ligne de code :

```js
const CACHE_NAME = "ramq-radar-v10";
```

**Passer à `v7`, `v8`, etc. à chaque mise en ligne.** Sans ça, les navigateurs
qui ont déjà ouvert l'app continueront de servir l'ancienne version depuis leur
cache, et vos modifications seront invisibles. C'est le piège le plus courant.

## Données locales

Deux clés dans `localStorage` :

- `ramqradar_profiles` — vos profils de pratique (milieux, clientèle, durées de
  rendez-vous, frais, impôt). Plusieurs profils possibles, étanches entre eux.
- `ramqradar_scenarios` — les scénarios du comparateur.

Vider le cache du navigateur efface ces données.

## Calculateur de revenu annuel

Reconstruit pour être transparent sur ce qui est connu vs saisi par
l'utilisateur :

- **Frais de bureau** : 3 modes (% du brut, $/journée travaillée,
  $/mois). Le mode $/mois est calculé sur 12 mois pleins — un loyer continue
  de courir pendant les vacances.
- **Forfaits** : décomposés en 8 lignes réelles (inscription générale,
  montant supplémentaire au seuil de 750/1000 patients, vulnérabilité,
  GMF 08875, supplément 0-5 ans 08877, suppléments grossesse, patient sans
  médecin de famille 19957-19960, frais de cabinet 19928/19929), chacune avec
  son vrai code RAMQ et ses conditions. **Aucun montant de forfait n'est
  publié par la RAMQ** — ils sont fixés par l'Entente particulière EP 40,
  document non public. L'utilisateur saisit ses propres montants depuis son
  état de compte RAMQ plutôt que l'app n'en invente un composite.

Le profil (patients inscrits, part vulnérable, mode de frais) préremplit
automatiquement ce qui peut l'être ; le reste reste à la discrétion du
médecin.

## État des données

`vulnerabilite.json` contient l'écart tarifaire vulnérable / non vulnérable pour
21 paires d'actes, extrait de l'onglet B du **Manuel des omnipraticiens —
rémunération à l'acte, version 2026-06-05**. Chaque tarif a été confirmé par
deux extractions indépendantes du même PDF.

`actes_inclus.json` contient 128 actes (Préambule général, Annexe I) qui sont
compris dans les honoraires de la visite et ne se facturent jamais séparément
— utile pour éviter une réclamation refusée.

La recherche d'acte couvre les visites de l'onglet B et 9 actes techniques
courants (biopsies, stérilet, circoncision, ECG en établissement), chacun
confirmé par recoupement avec un corpus d'extraction indépendant du même
document.

**Ce que la base ne contient pas** :

- les sections spécialisées du manuel (chirurgie, anesthésie, ophtalmologie,
  ORL, radiologie, cardiologie invasive…) — hors du champ d'un GMF-U dans
  l'immense majorité des cas, et volontairement exclues plutôt qu'ajoutées
  sans discernement;
- la liste complète des catégories de problèmes de santé du paragraphe 5.01 de
  l'EP 40, la répartition des quatre groupes de vulnérabilité, et les montants
  du forfait annuel de prise en charge et des forfaits 15169/15170/15171 —
  ces éléments sont dans l'**Entente particulière EP 40 (Brochure no 1)**,
  document distinct non encore disponible.

## Régénérer les données

Les scripts d'extraction ne font pas partie du site et n'ont pas à être
téléversés. Ils nécessitent le PDF officiel du manuel :

- `extract_b.py` — extrait les tarifs de visite de l'onglet B
- `build_vuln.py` — construit `vulnerabilite.json`
- `build_technical.py` — construit `actes_inclus.json` et les actes techniques
- `dollars.py` — regénère le champ de symboles de la bannière

## Avertissement

Outil personnel d'estimation. Les calculs de revenu sont des approximations : le
taux d'imposition réel dépend de votre structure, de l'incorporation et de vos
déductions. Ce n'est ni un avis fiscal ni une source officielle de tarification.
Vérifiez toujours au manuel RAMQ avant de facturer.
