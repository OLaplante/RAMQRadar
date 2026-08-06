# RAMQ Radar

Application web statique pour comprendre et optimiser sa facturation RAMQ.
Aucune donnée n'est envoyée à un serveur : tout est stocké dans le navigateur
(`localStorage`).

## Déploiement sur GitHub Pages

1. Créer un dépôt (ou utiliser un dépôt existant).
2. Téléverser **tous** les fichiers de ce dossier à la racine du dépôt.
3. `Settings` → `Pages` → Source : `Deploy from a branch`, branche `main`, dossier `/ (root)`.
4. Attendre une minute, puis ouvrir l'URL fournie.

Aucune étape de build. Aucune dépendance à installer.

## Fichiers

| Fichier | Rôle |
|---|---|
| `index.html` | L'application complète (HTML + CSS + JS en un seul fichier) |
| `manifest.json` | Manifeste PWA (installation, icônes, raccourcis) |
| `sw.js` | Service worker — cache hors ligne |
| `favicon.ico`, `icon-*.png`, `apple-touch-icon.png` | Icônes |
| `logo-mark.png`, `logo-lockup.png` | Logo utilisé dans l'app |
| `og-image.png` | Aperçu au partage (1200×630) |

## Maintenance

### ⚠️ Incrémenter le cache à chaque déploiement

Dans `sw.js`, en haut du fichier :

```js
const CACHE_NAME = "ramq-radar-v1";
```

**Passer à `v2`, `v3`, etc. à chaque mise en ligne.** Sans ça, les navigateurs
qui ont déjà installé l'application continueront de servir l'ancienne version
depuis leur cache, et vos modifications seront invisibles.

### Remplacer les codes d'exemple

L'application est livrée avec 20 codes fictifs préfixés `EX-`. Ce sont des
placeholders : les montants et les durées sont inventés.

Pour mettre les vrais tarifs :

1. Ouvrir l'app → icône ⚙ (à droite dans l'en-tête) → **Base de codes RAMQ**.
2. Modifier les lignes directement, ou **Importer (JSON)** un fichier préparé.
3. **Exporter (JSON)** pour se faire une sauvegarde.

Source officielle : [manuel des médecins omnipraticiens (RAMQ)](https://www.ramq.gouv.qc.ca/fr/professionnels/medecin-omnipraticien-omnipraticienne/manuels-guides).
Les tarifs changent plusieurs fois par année — la base n'est pas synchronisée
automatiquement.

Format d'un code :

```json
{
  "code": "00103",
  "description": "Examen général",
  "category": "Visite",
  "tags": ["visite", "examen", "complet"],
  "tariff": 78.50,
  "duration_min": 25,
  "practiceTypes": ["Cabinet", "GMF"]
}
```

`tags` alimente la recherche par mots-clés. `duration_min` sert au calcul du
$ / heure dans « Top actes rentables » — mettre `0` pour un forfait ou une
prime sans durée.

## Données locales

Trois clés dans `localStorage` :

- `ramqradar_codes` — la base de codes
- `ramqradar_settings` — les paramètres de pratique
- `ramqradar_scenarios` — les scénarios du comparateur

Vider le cache du navigateur efface ces données. Exportez votre base de codes
avant toute manipulation.

## Avertissement

Outil personnel d'estimation. Les calculs de revenu sont des approximations
(le taux d'imposition réel dépend de votre structure, de l'incorporation, des
déductions, etc.). Ce n'est ni un avis fiscal ni une source officielle de
tarification. Vérifiez toujours au manuel RAMQ avant de facturer.
