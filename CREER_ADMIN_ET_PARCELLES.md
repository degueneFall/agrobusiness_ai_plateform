# Créer un admin, un agronome et des parcelles

## 1. Comptes Admin et Agronome (seed)

Après avoir importé la base et exécuté le **seed**, deux comptes sont créés automatiquement :

| Rôle   | Email              | Mot de passe   |
|--------|--------------------|----------------|
| Admin  | `admin@agriai.sn`  | `Admin@123`    |
| Agronome | `agronome@agriai.sn` | `Agronome@123` |

**Exécuter le seed (depuis le dossier `backend`) :**
```bash
cd backend
npm run seed
```

Ensuite, connecte-toi avec l’un de ces comptes pour accéder au tableau de bord et à la gestion des rôles.

---

## 2. Créer d’autres admins ou agronomes

### Option A : Depuis l’interface (recommandé)

1. Connecte-toi en tant qu’**admin** (`admin@agriai.sn` / `Admin@123`).
2. Va dans **Gestion des rôles** (lien dans la sidebar).
3. Clique sur **« Créer un utilisateur »**.
4. Renseigne **email**, **mot de passe** (min. 6 caractères), **prénom**, **nom** et **rôle** (Agriculteur, Agronome, Administrateur, Super administrateur).
5. Clique sur **Créer**.

Le nouveau compte peut se connecter tout de suite avec cet email et ce mot de passe.

### Option B : Changer le rôle d’un utilisateur existant

1. L’utilisateur s’inscrit via **Inscription** (il est créé en tant qu’**Agriculteur**).
2. Un **admin** va dans **Gestion des rôles**.
3. Dans la liste, il change le **rôle** (menu déroulant) de cet utilisateur en **Agronome** ou **Administrateur**, etc.
4. Le rôle est enregistré automatiquement.

---

## 3. Créer des parcelles

1. Connecte-toi (avec n’importe quel compte : agriculteur, agronome ou admin).
2. Va dans **Cartographie** (sidebar).
3. Clique sur **« Nouvelle parcelle »** (en haut à droite de la liste).
4. Remplis le formulaire :
   - **Nom** * (ex. Parcelle Nord A)
   - **Surface (ha)** * (ex. 12.5)
   - **Région** (optionnel, liste des régions seed : Dakar, Thiès, etc.)
   - **Type de sol** (optionnel : Argileux, Sableux, Limoneux, Humifère, Mixte)
   - **pH du sol** (optionnel, ex. 6.5)
   - **Statut** (Active, En jachère, Préparation)
5. Clique sur **Créer**.

La parcelle est créée et rattachée à ton compte. Elle apparaît dans la liste et peut être utilisée dans **Analyse** (compatibilité semences) et **Rapports**.

---

## Résumé

| Action                    | Où / Comment |
|---------------------------|--------------|
| Premier admin / agronome  | Lancer `npm run seed` dans `backend` puis utiliser `admin@agriai.sn` ou `agronome@agriai.sn`. |
| Nouveaux admins/agronomes | Admin → **Gestion des rôles** → **Créer un utilisateur** (choisir le rôle). |
| Changer un rôle           | Admin → **Gestion des rôles** → modifier le rôle dans la liste. |
| Créer des parcelles       | **Cartographie** → **Nouvelle parcelle** → formulaire. |
