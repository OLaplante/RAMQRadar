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

## Les 15 fichiers

| Fichier | Rôle | Obligatoire |
|---|---|---|
| `index.html` | L'application entière (HTML + CSS + JS) | **oui** |
| `vulnerabilite.json` | Données de vulnérabilité, chargées à l'ouverture de la vue | **oui** |
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
const CACHE_NAME = "ramq-radar-v4";
```

**Passer à `v5`, `v6`, etc. à chaque mise en ligne.** Sans ça, les navigateurs
qui ont déjà ouvert l'app continueront de servir l'ancienne version depuis leur
cache, et vos modifications seront invisibles. C'est le piège le plus courant.

## Données locales

Deux clés dans `localStorage` :

- `ramqradar_profiles` — vos profils de pratique (milieux, clientèle, durées de
  rendez-vous, frais, impôt). Plusieurs profils possibles, étanches entre eux.
- `ramqradar_scenarios` — les scénarios du comparateur.

Vider le cache du navigateur efface ces données.

## État des données

`vulnerabilite.json` contient l'écart tarifaire vulnérable / non vulnérable pour
21 paires d'actes, extrait de l'onglet B du **Manuel des omnipraticiens —
rémunération à l'acte, version 2026-06-05**. Chaque tarif a été confirmé par
deux extractions indépendantes du même PDF.

**Ce que la base ne contient pas encore**, faute d'accès au document :

- la liste complète des catégories de problèmes de santé du paragraphe 5.01 de
  l'EP 40;
- la répartition des quatre groupes de vulnérabilité;
- les montants du forfait annuel de prise en charge et des forfaits de
  responsabilité 15169 / 15170 / 15171.

Ces éléments sont dans l'**Entente particulière EP 40 (Brochure no 1)**. Un
avertissement affiché en haut de la vue Vulnérabilité le dit explicitement.

## Régénérer les données

Les scripts d'extraction ne font pas partie du site et n'ont pas à être
téléversés. Ils nécessitent le PDF officiel du manuel :

- `extract_b.py` — extrait les tarifs de l'onglet B
- `build_vuln.py` — construit `vulnerabilite.json` à partir de cette extraction
- `dollars.py` — regénère le champ de symboles de la bannière

## Avertissement

Outil personnel d'estimation. Les calculs de revenu sont des approximations : le
taux d'imposition réel dépend de votre structure, de l'incorporation et de vos
déductions. Ce n'est ni un avis fiscal ni une source officielle de tarification.
Vérifiez toujours au manuel RAMQ avant de facturer.
