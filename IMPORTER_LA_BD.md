# Importer la base de données MySQL

Le backend utilise par défaut la base **`agribusiness_ai_db`** (voir `backend/.env`). Voici comment importer le fichier SQL que l’on vous a envoyé.

---

## Prérequis

- **MySQL** installé et démarré (MySQL Server ou XAMPP/WAMP/MAMP).
- Le fichier de la base reçu (souvent `*.sql` ou `*.sql.gz`).

---

## 1. Créer la base (si elle n’existe pas)

Ouvrez **invite de commandes** ou **PowerShell** et lancez MySQL :

```bash
mysql -u root -p
```

Entrez votre mot de passe MySQL. Puis dans le client MySQL :

```sql
CREATE DATABASE IF NOT EXISTS agribusiness_ai_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
EXIT;
```

Si votre projet utilise un **autre nom de base**, utilisez ce nom à la place de `agribusiness_ai_db` et mettez le même dans `backend/.env` (voir plus bas).

---

## 2. Importer le fichier SQL

### Fichier `.sql` (non compressé)

Dans l’invite de commandes (hors de MySQL), depuis n’importe quel dossier :

```bash
mysql -u root -p agribusiness_ai_db < "C:\chemin\vers\votre\fichier.sql"
```

Remplacez `C:\chemin\vers\votre\fichier.sql` par le **chemin réel** du fichier qu’on vous a envoyé.

Exemple si le fichier est sur le Bureau :

```bash
mysql -u root -p agribusiness_ai_db < "C:\Users\degue\Desktop\backup_agribusiness.sql"
```

### Fichier `.sql.gz` (compressé)

Sous Windows, décompressez d’abord le `.gz` (avec 7-Zip par exemple) pour obtenir un `.sql`, puis utilisez la commande ci-dessus.

Ou, si vous avez **Git Bash** ou **WSL** :

```bash
gunzip -c fichier.sql.gz | mysql -u root -p agribusiness_ai_db
```

---

## 3. Vérifier que le backend utilise la même base

Le fichier **`backend/.env`** doit utiliser le **même** nom de base, utilisateur et mot de passe que ceux avec lesquels vous importez. Par défaut le projet attend :

- **Nom de la base** : `agribusiness_ai_db`
- **Utilisateur** : `root` (ou celui que vous utilisez pour l’import)
- **Mot de passe** : celui de MySQL

Exemple de `.env` :

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=votre_mot_de_passe_mysql
DB_NAME=agribusiness_ai_db
```

Si vous avez créé une base avec un **autre nom** (ou un autre utilisateur), changez `DB_NAME` et `DB_USER` (et éventuellement `DB_PASSWORD`) dans `backend/.env` pour qu’ils correspondent.

---

## 4. Redémarrer le backend

Après l’import et la vérification du `.env` :

```bash
cd backend
npm run start:dev
```

L’application utilisera alors la base que vous venez d’importer.

---

## Dépannage rapide

| Problème | Solution |
|----------|----------|
| `mysql` non reconnu | Ajoutez le dossier `bin` de MySQL au PATH (ex. `C:\Program Files\MySQL\MySQL Server 8.0\bin`) ou lancez la commande depuis ce dossier. |
| Erreur d’encodage | La base est en `utf8mb4` ; si le fichier SQL est en UTF-8, l’import est en général correct. |
| Accès refusé | Vérifiez utilisateur/mot de passe et que MySQL est bien démarré. |
| Fichier trop gros | Utilisez la même commande `mysql ... < fichier.sql` ; ça peut prendre quelques minutes. |

Si vous me dites le **nom exact du fichier** (et s’il est en `.sql` ou `.sql.gz`), je peux vous donner la commande prête à copier-coller en remplaçant seulement le chemin.
