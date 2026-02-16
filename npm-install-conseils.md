# Erreurs npm install – quoi faire

## Ce que vous aviez

- **EPERM (operation not permitted)** : un programme (souvent **OneDrive**) verrouille des dossiers dans `node_modules`, donc npm ne peut pas tout supprimer ou écrire correctement.
- **ECONNRESET** : la connexion réseau a été coupée pendant le téléchargement (proxy, WiFi instable, pare-feu, etc.).

## Solutions (dans l’ordre)

### 1. Utiliser le script de réinstallation (recommandé)

1. **Fermez Cursor** et tous les terminaux ouverts dans le projet.
2. Dans l’Explorateur Windows, allez dans le dossier du projet.
3. **Clic droit** sur `fix-npm-install.ps1` → **Exécuter avec PowerShell**.
4. Si une erreur de stratégie d’exécution apparaît, ouvrez PowerShell **en tant qu’administrateur** et exécutez une fois :
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```
   Puis relancez le script.

Cela nettoie le cache npm, supprime `node_modules` et `package-lock.json` dans backend et frontend, puis refait `npm install` dans les deux dossiers.

### 2. Si le projet est dans OneDrive

OneDrive peut verrouiller des fichiers et provoquer les EPERM.

- **Option A** : Pause OneDrive pour ce dossier (clic droit sur l’icône OneDrive → Pause la synchronisation), puis relancez le script ou les commandes ci-dessous.
- **Option B** : Copier tout le projet **hors de OneDrive** (par ex. `C:\Dev\agribusiness-ai-platform`), ouvrir ce nouveau dossier dans Cursor et refaire `npm install` dans `backend` et `frontend`. Souvent le plus fiable à long terme.

### 3. Réinstallation manuelle (si le script échoue)

Dans **PowerShell**, à la racine du projet :

**Backend :**
```powershell
cd backend
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue
npm cache clean --force
npm install
```

**Frontend** (dans un autre terminal ou après) :
```powershell
cd frontend
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue
npm cache clean --force
npm install
```

Faites ça **après** avoir fermé Cursor et tout programme qui utilise le projet, pour éviter les EPERM.

### 4. Si l’erreur est surtout réseau (ECONNRESET)

- Réessayer plus tard ou avec une autre connexion (ex. partage de connexion 4G).
- Augmenter le délai et les tentatives :
  ```powershell
  npm config set fetch-retries 5
  npm config set fetch-retry-mintimeout 20000
  npm config set fetch-retry-maxtimeout 120000
  ```
- Si vous êtes derrière un **proxy** :
  ```powershell
  npm config set proxy http://votre-proxy:port
  npm config set https-proxy http://votre-proxy:port
  ```

### 5. Après une installation réussie

- **Backend** : `cd backend` puis `npm run start:dev`
- **Frontend** : `cd frontend` puis `npm run dev`
- Ouvrir dans le navigateur : http://localhost:5173
