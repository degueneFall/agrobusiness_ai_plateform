# Rapport d'État du Projet — Agribusiness AI Platform

**Date :** 12 Février 2026  
**Version :** 0.1.0 (MVP Alpha)

---

## Résumé Exécutif

Ce document décrit tout ce qui a été réalisé sur la plateforme **Agribusiness AI** (AgriAI). L’objectif est de permettre à toute l’équipe (y compris les personnes non techniques) de comprendre ce qui existe et comment tester l’application.

**En bref :**
- L’application est composée d’un **site web** (interface utilisateur) et d’un **serveur** (qui gère les données et la sécurité).
- Les utilisateurs peuvent **se connecter**, **s’inscrire**, et accéder à un **tableau de bord** selon leur rôle (Agriculteur, Agronome, Administrateur).
- Les fonctionnalités principales sont en place : **parcelles**, **semences**, **analyse de compatibilité**, **rapports**, **notifications** et **paramètres du compte**.
- Un **administrateur** peut créer d’autres comptes (admin, agronome, agriculteur) et modifier les rôles. Chaque utilisateur peut **créer des parcelles** depuis la cartographie.
- Des **comptes de démonstration** (admin et agronome) sont créés automatiquement au démarrage pour faciliter les tests.

---

## Architecture Technique (vue simplifiée)

Le projet est organisé en **deux parties** dans un même dossier de projet :

| Partie | Rôle | Technologies utilisées |
|--------|------|-------------------------|
| **Backend** (dossier `/backend`) | Serveur qui gère les données, l’authentification et les règles métier. | NestJS (Node.js), MySQL (base de données), TypeORM (lien avec la base). |
| **Frontend** (dossier `/frontend`) | Site web que l’utilisateur voit dans son navigateur. | React, Vite, Tailwind CSS (design). |

**En pratique :**
- Le **backend** tourne sur un port (par exemple 3000) et expose une **API** (des « portes » que le frontend appelle pour récupérer ou enregistrer des données).
- Le **frontend** tourne sur un autre port (par exemple 5173) : c’est l’adresse que l’on ouvre dans le navigateur pour utiliser l’application.
- La **base de données MySQL** stocke les utilisateurs, les parcelles, les semences, les notifications, etc. Elle doit être installée et démarrée sur la machine (ou accessible sur le réseau).

---

## Ce qui fonctionne aujourd’hui

### 1. Côté serveur (Backend)

| Élément | Description simple |
|--------|---------------------|
| **Connexion à la base de données** | Le serveur se connecte à MySQL et utilise des « modèles » (Utilisateurs, Parcelles, Semences, Régions, Notifications, Rapports, Recommandations IA, etc.) pour lire et écrire les données. |
| **Sécurité (authentification)** | Les mots de passe sont **chiffrés** (bcrypt). À la connexion, le serveur délivre un **jeton** (JWT) que le site envoie à chaque requête pour prouver l’identité de l’utilisateur. Les pages sensibles sont protégées par ce jeton. |
| **Utilisateurs et rôles** | Quatre rôles existent : Agriculteur, Agronome, Administrateur, Super administrateur. Le serveur propose : « Mon profil » (voir/modifier), « Liste des utilisateurs » et « Modifier le rôle » (réservé aux admins), et « Créer un utilisateur » (réservé aux admins). |
| **Parcelles** | Le serveur permet de lister, créer, modifier et consulter les parcelles de l’utilisateur connecté, avec des statistiques (nombre de parcelles, NDVI moyen, etc.). |
| **Semences** | Catalogue de semences avec recherche et filtres (type de culture, besoin en eau, pH, type de sol), et fiche détail par semence. |
| **Tableau de bord** | Le serveur fournit les indicateurs affichés sur la page d’accueil : nombre de parcelles, indice NDVI (santé du sol), pluviométrie, modèles IA actifs, et dernières activités. |
| **Notifications** | Liste des notifications, nombre de non lues, et actions « Marquer comme lu » / « Tout marquer comme lu ». |
| **Rapports** | Liste des rapports et création de nouveaux rapports. |
| **Compatibilité IA** | Calcul de la compatibilité entre une parcelle et une semence (score, niveau de confiance, rendement attendu, explications). |
| **Régions** | Liste des régions (Dakar, Thiès, etc.) utilisée notamment dans le formulaire de création de parcelle. |
| **Données de test (seed)** | Un script lance le peuplement automatique de la base : 1 admin, 1 agronome, 5 régions, des parcelles exemples, des semences, des notifications et des recommandations IA. |

### 2. Côté site web (Frontend)

| Élément | Description simple |
|--------|---------------------|
| **Connexion et inscription** | Pages **Connexion** et **Inscription**. Après connexion, le jeton et les infos utilisateur sont mémorisés ; en cas de déconnexion ou d’expiration (erreur 401), l’utilisateur est renvoyé sur la page de connexion. |
| **Menu et navigation** | Un menu fixe (sidebar) permet d’accéder au Tableau de bord, Cartographie, Analyse, Semences, Rapports, et (pour les admins) Gestion des rôles et Admin IA. En haut : titre de la page, recherche, icône notifications, icône paramètres, profil et déconnexion. |
| **Tableau de bord** | Affiche les indicateurs (NDVI, pluviométrie, modèles actifs), une zone carte (à connecter plus tard), et le flux d’activités récentes avec un lien « Voir tout l’historique » vers la page Notifications. |
| **Cartographie** | Liste des parcelles avec recherche. Bouton **« Nouvelle parcelle »** qui ouvre un formulaire (nom, surface, région, type de sol, pH, statut) pour créer une parcelle. |
| **Semences** | Catalogue avec filtres (type de sol, pH, eau) et recherche. Chaque semence a un bouton **« Voir détail »** qui mène à une fiche complète (rendement, cycle, pH, prix, etc.). |
| **Analyse** | Choix d’une parcelle et d’une semence ; affichage du **score de compatibilité**, du niveau de confiance, du rendement attendu et des explications. Boutons « Exporter PDF » et « Lancer Simulation » avec message de retour à l’utilisateur. |
| **Notifications** | Icône cloche dans le header : menu déroulant avec les dernières notifications et lien « Voir tout ». Page dédiée avec la liste complète et les actions « Marquer comme lu » / « Tout marquer comme lu ». |
| **Paramètres** | Page accessible via l’icône engrenage : modification du **profil** (prénom, nom, téléphone), option « Recevoir les notifications par email » (mémorisée localement), et section Sécurité (changer le mot de passe prévue pour plus tard). |
| **Rapports** | Page liste des rapports et page « Générer un rapport » avec formulaire. |
| **Gestion des rôles** (admins) | Liste de tous les utilisateurs avec possibilité de **changer le rôle** (menu déroulant). Bouton **« Créer un utilisateur »** : formulaire (email, mot de passe, prénom, nom, rôle) pour créer un nouveau compte (agriculteur, agronome, admin, etc.). |
| **Admin IA** | Page dédiée (gestion des modèles IA, à enrichir selon les besoins). |

---

## Récapitulatif par thème

| Thème | État |
|-------|------|
| Connexion, inscription, déconnexion, protection des pages | ✅ En place |
| Rôles (agriculteur, agronome, admin) et droits d’accès | ✅ En place |
| Création d’utilisateurs par un admin (avec choix du rôle) | ✅ En place |
| Modification du rôle d’un utilisateur (par un admin) | ✅ En place |
| Parcelles : liste, recherche, création (formulaire) | ✅ En place |
| Semences : catalogue, filtres, fiche détail | ✅ En place |
| Analyse de compatibilité parcelle × semence (IA) | ✅ En place |
| Tableau de bord (indicateurs et activités) | ✅ En place |
| Notifications (liste, non lus, marquer comme lu) | ✅ En place |
| Paramètres (profil, préférences) | ✅ En place |
| Rapports (liste, création, génération) | ✅ En place |
| Régions (liste pour les formulaires) | ✅ En place |
| Données de démonstration (seed : admin, agronome, régions, parcelles, semences, etc.) | ✅ En place |

---

## Guide de test (pour une collègue non développeuse)

### Prérequis

- **Node.js** installé sur le poste (version LTS conseillée).
- **MySQL** : base de données installée et démarrée ; une base nommée `agribusiness_ai_db` doit exister (voir la doc du projet ou le fichier `IMPORTER_LA_BD.md` si besoin).
- Fichier **`backend/.env`** rempli avec les informations de connexion à MySQL (`DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`).

### 1. Lancer le serveur (Backend)

Ouvrir un **terminal**, se placer dans le dossier du projet puis :

```bash
cd backend
npm install
npm run seed
npm run start:dev
```

Attendre le message indiquant que l’application Nest est démarrée (par ex. « Nest application successfully started »). Le serveur écoute en général sur **http://localhost:3000**.

- **`npm run seed`** : à faire au moins une fois pour créer les données de test (admin, agronome, régions, parcelles, semences, etc.).

### 2. Lancer le site web (Frontend)

Ouvrir **un autre terminal**, dans le même dossier de projet :

```bash
cd frontend
npm install
npm run dev
```

Le terminal affiche une adresse (par ex. **http://localhost:5173**). Ouvrir cette adresse dans le navigateur.

### 3. Identifiants de test (après avoir lancé le seed)

Se connecter avec l’un des comptes créés automatiquement :

| Rôle | Email | Mot de passe |
|------|--------|--------------|
| **Administrateur** | `admin@agriai.sn` | `Admin@123` |
| **Agronome** | `agronome@agriai.sn` | `Agronome@123` |

Les personnes qui s’inscrivent via la page **Inscription** ont par défaut le rôle **Agriculteur**. Un **admin** peut ensuite créer d’autres comptes (avec le rôle qu’il souhaite) ou modifier les rôles depuis **Gestion des rôles**.

### 4. Vérifications rapides à faire

- **Connexion** : se connecter avec `admin@agriai.sn` / `Admin@123` → on doit arriver sur le tableau de bord.
- **Parcelles** : menu **Cartographie** → **Nouvelle parcelle** → remplir le formulaire (nom, surface, etc.) → **Créer** → la nouvelle parcelle doit apparaître dans la liste.
- **Semences** : menu **Semences** → utiliser les filtres → cliquer sur **Voir détail** pour une semence → la fiche détail doit s’afficher.
- **Analyse** : menu **Analyse** → choisir une parcelle et une semence → le score de compatibilité et les explications doivent s’afficher.
- **Notifications** : cliquer sur l’icône cloche en haut à droite → le menu doit s’ouvrir ; cliquer sur **Voir tout** pour la page complète ; tester « Marquer comme lu ».
- **Paramètres** : cliquer sur l’icône engrenage → modifier le prénom ou le nom → **Enregistrer le profil** → les infos en haut (profil) doivent se mettre à jour.
- **Gestion des rôles** (avec le compte admin) : menu **Gestion des rôles** → modifier un rôle dans la liste ; puis **Créer un utilisateur** (email, mot de passe, prénom, nom, rôle) → le nouveau compte doit pouvoir se connecter avec ces identifiants.

---

## Documentation utile dans le projet

- **CREER_ADMIN_ET_PARCELLES.md** : comment obtenir les comptes admin et agronome (seed), créer d’autres utilisateurs (interface ou modification de rôle), et créer des parcelles depuis la cartographie.
- **IMPORTER_LA_BD.md** (si présent) : comment créer et importer la base MySQL.
- **MAQUETTES_INTEGRATION.md** (si présent) : lien entre les maquettes et les écrans/routes de l’application.
- **RAPPORT_PROJET_AGRIBUSINESS_AI.md** : rapport technique plus détaillé (modules, routes, sécurité).

---

*Rapport d’état — Agribusiness AI Platform — Version 0.1.0 (MVP Alpha) — 12 Février 2026*
