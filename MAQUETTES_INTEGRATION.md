# Intégration des maquettes – Agribusiness AI

Ce document relie les maquettes du dossier **`Maquettes agribusiness_ai_overview_dashboard`** aux routes et composants de l’application React.

## Thème commun (déjà dans le projet)

- **Couleur primaire** : `#13ec13` (Tailwind: `primary`)
- **Fonds** : `background-light` `#f6f8f6`, `background-dark` `#102210`
- **Police** : Inter
- **Icônes** : Material Symbols Outlined (à charger dans `index.html`)

---

## Correspondance Maquette → Route / Composant

| Dossier maquette | Route proposée | Composant / Page | Rôle(s) |
|------------------|----------------|------------------|---------|
| `connexion_utilisateur` | `/login` | `Login.tsx` | Tous |
| `inscription_nouvel_utilisateur` | `/register` | `Register.tsx` | Tous |
| `succès_de_l'inscription` | Après inscription | Redirection + toast ou page succès | Tous |
| `vérification_du_compte_(otp)` | `/verify-email` ou modal | À créer | Tous |
| **`agribusiness_ai_overview_dashboard_2`** | `/dashboard` | Layout + contenu overview (KPIs, carte, insights IA) | Tous |
| `interactive_ag-zone_mapping_1` | `/dashboard/cartographie` | Cartographie (zones, NDVI, pH, humidité) | Tous |
| `ai_seed_compatibility_analysis_1` | `/dashboard/analyse` | Analyse zone & compatibilité semences | Tous |
| `catalogue_de_semences_intelligent` | `/dashboard/semences` | Catalogue semences | Tous |
| `comparaison_détaillee_des_semences` | `/dashboard/semences/:id/compare` | Comparaison détaillée | Tous |
| `yield_&_roi_profitability_reports_2` | `/dashboard/rapports` | Rapports rentabilité / ROI | Tous |
| `plot_technical_control_center_1` | `/dashboard/parcelles` ou `/dashboard/parcelles/:id` | Détails parcelles, sol, climat | Tous |
| `generation rapport` | `/dashboard/rapports/generer` | Génération de rapport | Tous |
| `saisie donnees sols` | `/dashboard/sols/saisie` | Saisie données sols | Farmer / Agronome |
| `Saisie nouvel semences` | `/dashboard/semences/nouvelle` | Saisie nouvelle semence | Admin |
| `profil_utilisateur_et_paramètres_1` / `_3` | `/dashboard/profil` | Profil & paramètres | Tous |
| `system_admin__users_&_regions_1` | `/admin/users` ou `/admin/regions` | Admin utilisateurs & régions | Admin / Super Admin |
| `ai_model_training_&_config_1` | `/admin/ia` | Config & entraînement modèles IA | Admin / Super Admin |
| **Gestion des rôles (existant)** | `/admin/roles` | `RoleManagement.tsx` | Admin / Super Admin |

---

## Structure du layout (selon maquette dashboard)

- **Sidebar** (cachée sur mobile, visible `lg:flex`) :
  - Logo + nom app (ex. AgriAI)
  - Nav : Tableau de bord, Cartographie, Analyse, Semences, Rapports, Admin IA (si admin)
  - Bouton « Générer Rapport » en bas
- **Header** :
  - Titre de la page
  - Barre de recherche
  - Notifications, Paramètres, Profil utilisateur
- **Main** : contenu scrollable (grille KPIs, carte, panneau « Flux d’insights IA », etc.)

---

## Ordre d’implémentation suggéré

1. **Layout global** : sidebar + header (liens vers routes ci‑dessus, certains en « à venir »).
2. **Tableau de bord** (`/dashboard`) : KPIs (santé sol, pluviométrie, modèles actifs), carte régionale, panneau Insights IA.
3. **Pages secondaires** : une par une en réutilisant le même layout (Cartographie, Analyse, Semences, Rapports, Profil, Admin).
4. **Auth** : ajuster Login/Register au visuel des maquettes (split screen, images, textes).
5. **Écrans manquants** (cf. `AUDIT_PROJET.md`) : ex. « Analyse des rendements historiques », prévisions météo sur l’analyse de zone.

---

## Fichiers de référence

- Liste et statut des écrans : `Maquettes agribusiness_ai_overview_dashboard/AUDIT_PROJET.md`
- Maquette HTML à reproduire en React : chaque sous-dossier contient un `code.html` (Tailwind, structure à transposer en JSX).
