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
| `ramq-data.js` | Base officielle intégrée : onglet B, version du 6 août 2026 |
| `manifest.json` | Manifeste PWA (installation, icônes, raccourcis) |
| `sw.js` | Service worker — cache hors ligne |
| `favicon.ico`, `icon-*.png`, `apple-touch-icon.png` | Icônes |
| `logo-mark.png`, `logo-lockup.png` | Logo utilisé dans l'app |
| `og-image.png` | Aperçu au partage (1200×630) |

## Maintenance

### ⚠️ Incrémenter le cache à chaque déploiement

Dans `sw.js`, en haut du fichier :

```js
const CACHE_NAME = "ramq-radar-v2";
```

**Passer à `v2`, `v3`, etc. à chaque mise en ligne.** Sans ça, les navigateurs
qui ont déjà installé l'application continueront de servir l'ancienne version
depuis leur cache, et vos modifications seront invisibles.

### Données RAMQ intégrées

L'application est livrée avec 214 codes et 291 tarifs contextuels tirés des
[tableaux-synthèses RAMQ de l'onglet B](https://www.ramq.gouv.qc.ca/fr/professionnels/media/32176),
mis à jour le 6 août 2026. Le périmètre couvre les consultations, examens et
visites. Les variantes de tarif sont séparées selon l'âge, le profil du patient,
le nombre de patients inscrits et le lieu de service.

Cette base ne remplace pas le manuel complet : les notes, règles, modificateurs,
maxima et les codes des autres onglets doivent encore être vérifiés dans le
[manuel des médecins omnipraticiens](https://www.ramq.gouv.qc.ca/fr/professionnels/medecin-omnipraticien-omnipraticienne/manuels-guides).

Pour modifier ou compléter la base :

1. Ouvrir l'app → icône ⚙ (à droite dans l'en-tête) → **Base de codes RAMQ**.
2. Modifier les lignes directement, ou **Importer (JSON)** un fichier préparé.
3. **Exporter (JSON)** pour se faire une sauvegarde.

Les tarifs changent plusieurs fois par année : la base n'est pas synchronisée
automatiquement et sa version est affichée dans l'application.

Format d'un code :

```json
{
  "code": "15803",
  "description": "Suivi — patient non vulnérable de moins de 80 ans",
  "context": "Cabinet/GMF, ou domicile lié aux activités du médecin en cabinet",
  "category": "Visite sur rendez-vous",
  "tags": ["visite", "rendez-vous", "patient inscrit"],
  "tariff": 42.85,
  "duration_min": 0,
  "practiceTypes": ["Cabinet", "GMF"],
  "source_page": 5,
  "data_version": "2026-08-06"
}
```

`tags`, `context` et `practiceTypes` alimentent la recherche. `duration_min`
reste à `0` lorsque la RAMQ ne publie pas de période explicite; aucune durée
clinique n'est inventée. Le classement en équivalent horaire ne retient que les
codes facturés par périodes de 15 ou 30 minutes dans le document source.

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
