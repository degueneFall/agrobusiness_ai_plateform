# Audit du projet – Système de Recommandation IA pour l’Agrobusiness

## 1. Récapitulatif des écrans requis vs existants

| Écran requis | Dossier / Maquette | Statut |
|--------------|--------------------|--------|
| **Tableau de bord de synthèse** (KPIs santé sols, pluviométrie, analyses IA) | `agribusiness_ai_overview_dashboard_2` | ✅ Présent |
| **Cartographie Interactive** (NDVI, pH, humidité, délimitation de zones) | `interactive_ag-zone_mapping_1` | ✅ Présent |
| **Analyse de Zone & Recommandations** (scores compatibilité, prévisions météo) | `ai_seed_compatibility_analysis_1` | ✅ Présent |
| **Catalogue de Semences Intelligent** (base filtrable par zone) | `catalogue_de_semences_intelligent` | ✅ Présent |
| **Rapports de Rentabilité** (simulation coûts, rendements, ROI) | `yield_&_roi_profitability_reports_2` | ✅ Présent |
| **Détails Parcelles, Sol & Climat** (liste parcelles, NPK, pH, graphiques climat, journal d’historique) | `plot_technical_control_center_1` | ✅ Présent |
| **Recommandation IA & Exigences Semences** (exigences vs terrain, score de réussite) | `ai_seed_compatibility_analysis_1` + `comparaison_détaillee_des_semences` | ✅ Présent |
| **Administration : Utilisateurs & Régions** (accès par région, profils, historique global) | `system_admin__users_&_regions_1` | ✅ Présent |
| **Analyse des Rendements Historiques** (rendements passés par culture et par semence) | — | ❌ **Manquant** |
| **Configuration & Entraînement des Modèles IA** (hyperparamètres, variables, courbes d’apprentissage) | `ai_model_training_&_config_1` | ✅ Présent |

---

## 2. Ce qui manque

### 2.1 Écran dédié « Analyse des Rendements Historiques »

- **Manque** : Un écran dédié qui compare les **rendements passés par culture et par semence**, pour ajuster les stratégies agricoles.
- **Actuel** : Les rapports de rentabilité (`yield_&_roi_profitability_reports_2`) proposent une comparaison de rentabilité par variété et une tendance ROI, mais pas une vue historique explicite « rendement (t/ha) par culture / par semence / par année ou campagne ».
- **Recommandation** : Créer une maquette dédiée avec par exemple :
  - Filtres : année(s), région/parcelle, culture, variété de semence.
  - Graphiques : courbes ou barres d’évolution des rendements (t/ha) par culture et par semence.
  - Tableau récapitulatif (culture, semence, année, rendement, évolution %).

### 2.2 Navigation entre les maquettes

- **Manque** : Tous les liens sont en `href="#"`. Il n’existe pas de routage ni d’index pour passer d’une maquette à l’autre.
- **Recommandation** : Un fichier **index** (ex. `index.html`) listant tous les écrans avec des liens vers chaque `code.html` permet de parcourir les maquettes comme une application prototype.

### 2.3 Prévisions météorologiques locales

- **Cahier des charges** : « Prévisions météorologiques locales » sur l’écran Analyse de Zone & Recommandations.
- **Actuel** : Dans `ai_seed_compatibility_analysis_1`, la « Fenêtre de Semis » mentionne des pluies attendues (ex. 28 mai) ; pas de bloc dédié « Météo locale » (températures, pluie 7j, etc.).
- **Recommandation** : Ajouter un encart « Prévisions météo » (7 jours ou 14 jours) sur l’écran d’analyse de zone / compatibilité semences.

---

## 3. Améliorations recommandées

### 3.1 Cohérence de marque et de design

- **Noms d’application** : Plusieurs noms coexistent (AgriAI Corp, Ag-Zone IA, AgriAI Analyse, AgriAI Pro, AgriYield AI, AgriSystem Admin, AgriML Workbench, AgroIA, AgroAI). Pour une démo ou un livrable, unifier (ex. « AgriAI Suite » ou un nom unique) ou au minimum garder le même nom sur les écrans principaux.
- **Couleur primaire** : Variantes (#13ec13, #14b814, #11d411). Choisir une seule valeur (ex. `#13ec13`) et l’utiliser partout pour la cohérence visuelle.

### 3.2 Cartographie

- **Actuel** : Fond d’image + SVG statiques (polygones, légende). Pas de carte interactive (zoom/pan, couches cliquables).
- **Recommandation** : Pour une maquette plus proche du produit final, prévoir l’intégration d’une librairie cartographique (Leaflet, Mapbox, etc.) avec couches NDVI/pH/humidité et outils de dessin de zones (polygone, cercle) déjà évoqués dans l’UI.

### 3.3 Accessibilité et sémantique

- **Images** : Certaines utilisent `data-alt` au lieu de `alt` ; les lecteurs d’écran ne lisent que `alt`. Remplacer par `alt="..."` avec une description courte.
- **Liens** : Éviter des liens vides ou « Voir tout » sans contexte ; ajouter des `aria-label` ou du texte explicite pour les actions importantes.
- **Contraste** : Vérifier le contraste texte/fond (surtout texte gris sur fond sombre) pour respecter les recommandations d’accessibilité.

### 3.4 Responsive et ergonomie

- Plusieurs écrans sont déjà en grille responsive (Tailwind). Vérifier sur mobile :
  - Tableaux (Rapports rentabilité, Admin, Centre de contrôle) : prévoir défilement horizontal ou vue en cartes sur petit écran.
  - Cartographie : barres d’outils et panneaux latéraux repliables ou en overlay.

### 3.5 Flux « Générer Rapport »

- **Actuel** : Bouton « Générer Rapport » sur le tableau de bord ; écran `generation rapport` existe.
- **Recommandation** : S’assurer que le bouton du dashboard pointe vers la maquette « Génération de rapport » (ou vers l’index) et que le flux (sélection de périmètre → options → génération) est clair dans les maquettes.

### 3.6 Données et labels

- Remplacer les textes du type « 4 sur 1 284 utilisateurs » par une pagination claire (ex. « Page 1 sur 322 »).
- Sur les graphiques (ROI, Loss, Précision), ajouter des labels d’axe (valeurs, unités) pour que les maquettes soient auto-explicatives.

---

## 4. Écrans additionnels déjà présents (hors liste stricte)

- Connexion : `connexion_utilisateur`
- Inscription : `inscription_nouvel_utilisateur`, `succès_de_l'inscription`
- Vérification compte (OTP) : `vérification_du_compte_(otp)`
- Profil utilisateur / paramètres : `profil_utilisateur_et_paramètres_1`, `profil_utilisateur_et_paramètres_3`
- Saisie données sols : `saisie donnees sols`
- Saisie nouvelle semence : `Saisie nouvel semences`
- Génération de rapport : `generation rapport`
- Comparaison détaillée des semences : `comparaison_détaillee_des_semences`

Ces écrans complètent bien le parcours utilisateur (auth, profil, saisie, comparaison, rapport).

---

## 5. Synthèse des actions prioritaires

1. **Créer l’écran « Analyse des Rendements Historiques »** (graphiques par culture/semence, filtres année/parcelle).
2. **Mettre en place un index de navigation** (index.html) vers toutes les maquettes.
3. **Unifier le nom d’application et la couleur primaire** dans les maquettes.
4. **Ajouter un bloc « Prévisions météo »** sur l’écran Analyse de Zone & Recommandations.
5. **Remplacer `data-alt` par `alt`** et améliorer les libellés des liens pour l’accessibilité.
6. **Prévoir une version plus avancée de la cartographie** (carte interactive) si le projet évolue vers un prototype cliquable.

---

*Audit réalisé sur la base du parcours de l’ensemble des dossiers et fichiers `code.html` du projet.*
