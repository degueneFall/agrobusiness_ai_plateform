# Rapport du projet Agribusiness AI Platform

**Date du rapport :** 2025  
**Projet :** Plateforme Agribusiness AI (AgriAI) — Suite Executive

---

## 1. Introduction et objectifs

Le projet **Agribusiness AI Platform** est une application web full-stack destinée au secteur agricole. Elle permet de gérer des parcelles, un catalogue de semences, des analyses de compatibilité (parcelle × semence), des rapports et des notifications, avec une gestion des rôles (agriculteur, agronome, administrateur).

Les objectifs couverts jusqu’à ce jour sont notamment :

- Authentification et inscription (JWT).
- Gestion des rôles (affichage, modification, création d’utilisateurs par un admin).
- Tableau de bord avec indicateurs (NDVI, pluviométrie, modèles IA, activités récentes).
- Cartographie des parcelles avec création de parcelles.
- Catalogue de semences avec filtres et fiche détail.
- Analyse de compatibilité semence/parcelle (score, confiance, rendement attendu).
- Rapports (liste, création, génération).
- Notifications (liste, non lus, marquer comme lu).
- Paramètres utilisateur (profil, préférences, sécurité).
- Intégration des maquettes (thème, layout, routes).

---

## 2. Architecture technique

### 2.1 Stack globale

| Couche      | Technologie |
|------------|-------------|
| **Backend**  | Node.js, NestJS 11, TypeScript |
| **Base de données** | MySQL, TypeORM |
| **Auth**     | JWT (Passport), bcrypt |
| **Frontend** | React 19, Vite 7, TypeScript |
| **UI**       | Tailwind CSS, Material Symbols, Lucide React |
| **Routing**  | React Router v7 |

### 2.2 Structure des dossiers

```
agribusiness-ai-platform/
├── backend/                 # API NestJS
│   ├── src/
│   │   ├── main.ts
│   │   ├── app.module.ts
│   │   ├── modules/         # Auth, Users, Plots, Seeds, Dashboard, etc.
│   │   └── seeds/           # Script de peuplement (seed.ts)
│   └── package.json
├── frontend/                # Application React
│   ├── src/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   ├── components/      # AppLayout
│   │   ├── context/         # AuthContext
│   │   ├── pages/           # Login, Register, dashboards, admin
│   │   ├── services/        # api, auth, plots, seeds, etc.
│   │   └── types/
│   └── package.json
├── CREER_ADMIN_ET_PARCELLES.md
└── RAPPORT_PROJET_AGRIBUSINESS_AI.md  # Ce document
```

---

## 3. Backend (API NestJS)

### 3.1 Modules et responsabilités

| Module | Rôle |
|--------|------|
| **AuthModule** | Login (POST /auth/login), inscription (POST /auth/register), stratégies Passport (local, JWT), guards. |
| **UsersModule** | Profil (GET/PATCH /users/me), liste utilisateurs et mise à jour du rôle (admin), création d’utilisateur par admin (POST /users). |
| **PlotsModule** | CRUD parcelles par utilisateur : GET/POST /plots, GET/PATCH /plots/:id, GET /plots/stats. |
| **SeedsModule** | Catalogue semences : GET /seeds (filtres), GET /seeds/:id. |
| **DashboardModule** | Tableau de bord : GET /dashboard/overview (métriques, activités, NDVI, modèles IA). |
| **NotificationsModule** | GET /notifications, GET /notifications/unread-count, PATCH /notifications/:id/read, PATCH /notifications/read-all. |
| **ReportsModule** | Liste et création de rapports (GET/POST /reports). |
| **AiCompatibilityModule** | Recommandations IA : GET /ai-compatibility (par user/parcelle), compatibilité parcelle/semence. |
| **SystemAdminModule** | Données système : GET /system-admin/regions (liste des régions). |
| **AiAdminModule** | Gestion des modèles IA (admin). |
| **SoilMappingModule** | Cartographie des sols. |

### 3.2 Modèle de données (entités principales)

- **User** : id, email, passwordHash, firstName, lastName, phone, role (farmer | agronomist | admin | super_admin), isVerified, profilePicture, dates.
- **Plot** : id, userId, regionId, name, areaHectares, coordinates, soilType, soilPh, ndviScore, status (active | fallow | preparation), dates.
- **Region** : id, name, code, country, climateZone, averageRainfall.
- **Seed** : id, name, varietyCode, cropType, description, yieldPotential, growthCycleDays, waterRequirement, optimalSoilType, optimalPhMin/Max, droughtResistant, nitrogenEfficient, pricePerKg, supplier, isActive.
- **Notification** : id, userId, type, title, message, priority, isRead, relatedEntityType/Id, createdAt.
- **Report** : entité dédiée aux rapports générés.
- **AiRecommendation** : liaison parcelle/semence, score de compatibilité, rendement attendu, niveau de confiance.

### 3.3 Sécurité

- **JWT** : émis au login, requis sur toutes les routes protégées (sauf /auth/login, /auth/register).
- **Guards** : `JwtAuthGuard` sur les contrôleurs protégés ; `RolesGuard` + décorateur `@Roles` pour les routes réservées aux rôles admin / super_admin (ex. GET /users, PATCH /users/:id/role, POST /users).
- **Validation** : `ValidationPipe` global avec `whitelist: true` ; DTOs avec class-validator (RegisterDto, UpdateProfileDto, CreatePlotDto, CreateUserByAdminDto, etc.).

### 3.4 Seed (peuplement initial)

Le script `backend/src/seeds/seed.ts` (commande `npm run seed` dans `backend`) crée notamment :

- **Régions** : Dakar, Thiès, Saint-Louis, Kaolack, Ziguinchor.
- **Utilisateurs** : admin (`admin@agriai.sn` / `Admin@123`), agronome (`agronome@agriai.sn` / `Agronome@123`).
- **Parcelles** : exemples rattachées à l’admin (Parcelle A-102, Vignoble Nord B-205, Verger Sud C-301).
- **Semences** : variétés (maïs, blé, soja, tournesol, etc.) avec caractéristiques.
- **Notifications** : alertes irrigation, ravageurs, sync santé des sols.
- **Recommandations IA** : exemples parcelle × semence.
- **Modèle IA** : Seed Recommendation Engine v2.4.

---

## 4. Frontend (React + Vite)

### 4.1 Authentification et contexte

- **AuthContext** : état global `user`, `loading`, `isAuthenticated`, `isAdmin` ; méthodes `login`, `register`, `logout`, `refreshUser`.
- **Stockage** : token JWT et objet user en `localStorage` ; intercepteur Axios qui envoie le `Authorization: Bearer <token>` et, en cas de 401, supprime token/user et redirige vers `/login` (sauf pour la requête de login elle-même).

### 4.2 Routes et pages

| Route | Page / contenu | Accès |
|-------|----------------|--------|
| `/login` | Connexion (email / mot de passe) | Public |
| `/register` | Inscription (agriculteur par défaut) | Public |
| `/` | Redirection vers `/dashboard` | Authentifié |
| `/dashboard` | Tableau de bord global (KPIs, carte placeholder, flux d’activité) | Authentifié |
| `/dashboard/cartographie` | Liste des parcelles, recherche, bouton « Nouvelle parcelle », modal de création | Authentifié |
| `/dashboard/analyse` | Sélection parcelle + semence, affichage compatibilité IA (score, confiance, rendement, raisonnement) | Authentifié |
| `/dashboard/semences` | Catalogue semences (filtres type de sol, pH, eau, recherche), cartes avec « Voir détail » | Authentifié |
| `/dashboard/semences/:id` | Fiche détail d’une semence (caractéristiques, lien vers Analyse) | Authentifié |
| `/dashboard/notifications` | Liste des notifications, marquer comme lu / tout marquer comme lu | Authentifié |
| `/dashboard/parametres` | Profil (prénom, nom, téléphone), préférences notifications (email), sécurité (changer mot de passe à venir) | Authentifié |
| `/dashboard/rapports` | Liste des rapports, création possible | Authentifié |
| `/dashboard/rapports/generer` | Formulaire de génération de rapport | Authentifié |
| `/admin/roles` | Gestion des rôles : liste des utilisateurs, modification du rôle, bouton « Créer un utilisateur » (modal) | Admin / Super admin |
| `/admin/ia` | Admin IA (placeholder / gestion des modèles) | Authentifié (lien visible pour admin) |

### 4.3 Layout et navigation

- **AppLayout** : sidebar (logo AgriAI, liens Tableau de bord, Cartographie, Analyse, Semences, Rapports, Générer Rapport ; pour les admins : Gestion des rôles, Admin IA), header avec titre, champ de recherche, icône notifications (dropdown + badge non lus), lien Paramètres, profil utilisateur, déconnexion.
- **DashboardShell** : enveloppe qui injecte `AppLayout` avec un titre de page.

### 4.4 Services API (frontend)

- **api** : instance Axios (baseURL, intercepteurs request/response), helper `getApiErrorMessage`.
- **auth** : login, register, logout, getCurrentUser.
- **users** : getMe, updateProfile, getAll, updateRole, createByAdmin.
- **plots** : getAll, getStats, getOne, create, update.
- **seeds** : getAll (filtres), getOne.
- **regions** : getAll (GET /system-admin/regions).
- **notifications** : getAll, getUnreadCount, markAsRead, markAllAsRead.
- **dashboard** : getOverview.
- **reports** : getAll, create.
- **ai-compatibility** : getCompatibility(plotId, seedId), getByUser / getByPlot selon besoin.

### 4.5 Fonctionnalités UI marquantes

- **Tableau de bord** : cartes KPIs (NDVI, pluviométrie, modèles actifs), zone carte (placeholder), flux d’activités récentes, lien « Voir tout l’historique » vers `/dashboard/notifications`.
- **Cartographie** : liste des parcelles avec recherche, tags (Rendement élevé / Irrigation / Stable selon NDVI), modal « Nouvelle parcelle » (nom, surface, région, type de sol, pH, statut).
- **Catalogue semences** : filtres (type de sol, plage pH, besoin en eau, recherche), cartes avec lien « Voir détail » vers `/dashboard/semences/:id`.
- **Analyse** : sélecteurs parcelle et semence, affichage score de compatibilité, confiance, rendement attendu, raisonnement ; boutons « Exporter PDF » et « Lancer Simulation » avec message utilisateur (PDF à venir, simulation avec paramètres actuels).
- **Notifications** : dropdown dans le header (dernières notifications, lien « Voir tout »), page dédiée avec marquer lu / tout marquer lu.
- **Paramètres** : formulaire profil (prénom, nom, téléphone) relié à PATCH /users/me et `refreshUser`, préférence « Recevoir les notifications par email » (localStorage), section sécurité (changer mot de passe à venir).
- **Gestion des rôles** : tableau des utilisateurs avec sélecteur de rôle, bouton « Créer un utilisateur » (email, mot de passe, prénom, nom, rôle) appelant POST /users.

---

## 5. Récapitulatif des fonctionnalités réalisées

| Domaine | Réalisé |
|--------|---------|
| **Auth** | Login, inscription, JWT, déconnexion, redirection 401, refresh du profil |
| **Rôles** | 4 rôles (farmer, agronomist, admin, super_admin), guards backend, hasRole/isAdmin frontend, page Gestion des rôles, création d’utilisateur par admin |
| **Parcelles** | CRUD par utilisateur, liste avec recherche, création via modal (nom, surface, région, sol, pH, statut), stats |
| **Semences** | Catalogue avec filtres, fiche détail par ID, liaison avec Analyse |
| **Analyse IA** | Sélection parcelle + semence, appel API compatibilité, affichage score / confiance / rendement / raisonnement |
| **Tableau de bord** | Overview avec métriques réelles (parcelles, NDVI, pluviométrie, modèles), activités récentes, lien historique |
| **Notifications** | Liste, compteur non lus, dropdown header, page dédiée, marquer lu / tout marquer lu |
| **Rapports** | Liste, création, page « Générer un rapport » |
| **Paramètres** | Profil (GET/PATCH /users/me), préférences notifications (localStorage), section sécurité |
| **Régions** | API GET /system-admin/regions, utilisée dans le formulaire de création de parcelle |
| **Seed** | Comptes admin et agronome, régions, parcelles, semences, notifications, recommandations IA, modèle IA |

---

## 6. Démarrage du projet

### 6.1 Prérequis

- Node.js (LTS recommandé)
- MySQL (base `agribusiness_ai_db` créée, schéma géré par TypeORM avec `synchronize: true` en dev)
- Fichier `backend/.env` avec au minimum : `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`

### 6.2 Installation et lancement

```bash
# Backend
cd backend
npm install
npm run seed    # optionnel : peupler régions, admin, agronome, parcelles, semences, etc.
npm run start:dev

# Frontend (autre terminal)
cd frontend
npm install
npm run dev
```

- Backend : http://localhost:3000  
- Frontend : http://localhost:5173 (configuré dans CORS du backend)

### 6.3 Comptes de test (après seed)

- Admin : `admin@agriai.sn` / `Admin@123`
- Agronome : `agronome@agriai.sn` / `Agronome@123`

Les autres comptes peuvent être créés via Inscription (agriculteur) ou par un admin dans Gestion des rôles (Créer un utilisateur avec le rôle souhaité).

---

## 7. Documentation associée

- **CREER_ADMIN_ET_PARCELLES.md** : comment obtenir un admin/agronome (seed), créer d’autres comptes (interface ou modification de rôle), et créer des parcelles depuis la cartographie.
- **IMPORTER_LA_BD.md** (si présent) : import manuel de la base MySQL.
- **MAQUETTES_INTEGRATION.md** (si présent) : correspondance maquettes ↔ routes et thème.

---

## 8. Conclusion

Le projet Agribusiness AI Platform couvre à ce jour un périmètre fonctionnel cohérent : authentification, rôles, parcelles, semences, analyse de compatibilité IA, tableau de bord, notifications, rapports et paramètres. Le backend (NestJS, MySQL, TypeORM, JWT) et le frontend (React, Vite, Tailwind) sont structurés par modules et services, avec une API REST documentée implicitement par les contrôleurs et DTOs. Les prochaines évolutions possibles incluent : export PDF des analyses, changement de mot de passe, carte interactive (ex. Leaflet/Mapbox) sur la cartographie, et enrichissement des rapports et de l’admin IA.
