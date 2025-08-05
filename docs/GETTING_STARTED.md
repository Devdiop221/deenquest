# 🚀 Guide de Démarrage - DeenQuest

Ce guide vous accompagne pour configurer et lancer DeenQuest en local.

## 📋 Prérequis

### Outils requis

```bash
# Node.js (version 18 ou supérieure)
node --version  # v18.0.0+

# Bun (package manager et runtime)
bun --version   # v1.2.16+

# Git
git --version   # v2.0.0+
```

### Installation des outils

#### 1. Node.js
```bash
# Via nvm (recommandé)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18

# Ou téléchargez depuis https://nodejs.org
```

#### 2. Bun
```bash
# macOS/Linux
curl -fsSL https://bun.sh/install | bash

# Windows
powershell -c "irm bun.sh/install.ps1 | iex"

# Vérification
bun --version
```

#### 3. Expo CLI
```bash
# Installation globale
npm install -g @expo/cli eas-cli

# Vérification
expo --version
eas --version
```

### Comptes nécessaires

1. **GitHub** - Pour cloner le projet
2. **Supabase** - Base de données PostgreSQL gratuite
3. **Expo** - Pour le développement mobile (optionnel)

## 📥 Installation

### 1. Cloner le projet

```bash
# HTTPS
git clone https://github.com/username/deenquest.git

# SSH (si configuré)
git clone git@github.com:username/deenquest.git

# Entrer dans le dossier
cd deenquest
```

### 2. Installer les dépendances

```bash
# Installation avec Bun (recommandé)
bun install

# Ou avec npm
npm install
```

### 3. Configuration de la base de données

#### Option A : Supabase (Recommandé)

1. **Créer un compte** sur [supabase.com](https://supabase.com)
2. **Créer un nouveau projet**
3. **Récupérer l'URL de connexion** :
   - Aller dans Settings > Database
   - Copier la "Connection string"
   - Format : `postgresql://postgres:[password]@[host]:5432/postgres`

#### Option B : PostgreSQL local

```bash
# macOS avec Homebrew
brew install postgresql
brew services start postgresql

# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql

# Créer une base de données
createdb deenquest_dev
```

### 4. Configuration des variables d'environnement

#### Serveur

```bash
# Copier le fichier d'exemple
cp apps/server/.env.example apps/server/.env

# Éditer le fichier
nano apps/server/.env
```

Contenu du fichier `.env` :
```bash
# Base de données
DATABASE_URL="postgresql://postgres:password@localhost:5432/deenquest_dev"

# Authentification
BETTER_AUTH_SECRET="your-super-secret-key-32-characters-min"
BETTER_AUTH_URL="http://localhost:3000/api/auth"

# CORS
CORS_ORIGIN="http://localhost:8081"

# Environment
NODE_ENV="development"
```

#### Application mobile

```bash
# Copier le fichier d'exemple
cp apps/native/.env.example apps/native/.env.development

# Éditer le fichier
nano apps/native/.env.development
```

Contenu du fichier `.env.development` :
```bash
# API
EXPO_PUBLIC_SERVER_URL="http://localhost:3000"
EXPO_PUBLIC_API_URL="http://localhost:3000/trpc"
EXPO_PUBLIC_AUTH_URL="http://localhost:3000/api/auth"

# App
EXPO_PUBLIC_APP_NAME="DeenQuest Dev"
EXPO_PUBLIC_APP_VERSION="1.0.0-dev"
```

### 5. Initialiser la base de données

```bash
# Aller dans le dossier serveur
cd apps/server

# Appliquer le schéma
bun run db:push

# Peupler avec des données de test
bun run db:seed
bun run db:seed-badges

# Vérifier (optionnel)
bun run db:studio
```

## 🚀 Lancement

### Développement complet

```bash
# Depuis la racine du projet
bun dev
```

Cette commande lance :
- 🖥️ **Serveur API** sur http://localhost:3000
- 📱 **App mobile** avec Expo Dev Server

### Lancement séparé

#### Serveur uniquement
```bash
cd apps/server
bun run dev

# Ou
bun dev:server
```

#### App mobile uniquement
```bash
cd apps/native
bun run dev

# Ou
bun dev:native
```

## 📱 Tester l'application mobile

### Option 1 : Expo Go (Recommandé pour débuter)

1. **Installer Expo Go** sur votre téléphone :
   - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
   - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. **Scanner le QR code** affiché dans le terminal

3. **L'app se lance** automatiquement

### Option 2 : Simulateur iOS

```bash
# Installer Xcode depuis l'App Store
# Puis lancer le simulateur
cd apps/native
bun run ios
```

### Option 3 : Émulateur Android

```bash
# Installer Android Studio
# Créer un AVD (Android Virtual Device)
# Puis lancer l'émulateur
cd apps/native
bun run android
```

### Option 4 : Development Build

```bash
# Créer un build de développement
cd apps/native
eas build --profile development --platform android

# Installer le fichier APK sur votre appareil
# Scanner le QR code pour se connecter
```

## 🔍 Vérification de l'installation

### 1. Serveur API

Ouvrez http://localhost:3000 dans votre navigateur.
Vous devriez voir : "DeenQuest API - OK"

### 2. Endpoints API

```bash
# Health check
curl http://localhost:3000/health

# Catégories
curl http://localhost:3000/trpc/categories.getAll

# Quiz
curl http://localhost:3000/trpc/quizzes.getAll
```

### 3. Base de données

```bash
# Ouvrir Drizzle Studio
cd apps/server
bun run db:studio

# Vérifier les tables dans le navigateur
# http://localhost:4983
```

### 4. Application mobile

L'app devrait afficher :
- ✅ Écran d'accueil avec catégories
- ✅ Navigation par onglets
- ✅ Quiz fonctionnels
- ✅ Système de favoris

## 🛠️ Outils de développement

### 1. Base de données

```bash
# Studio visuel
bun run db:studio

# Migrations
bun run db:generate
bun run db:migrate

# Reset complet
bun run db:push --force
```

### 2. Tests

```bash
# Tous les tests
./scripts/test-all.sh

# Tests spécifiques
cd apps/native && bun test
cd apps/server && bun test

# Mode watch
bun run test:watch

# Couverture
bun run test:coverage
```

### 3. Linting et formatage

```bash
# Vérifier les types
bun run check-types

# Linter (si configuré)
bun run lint

# Formatage (automatique avec Prettier)
```

### 4. Debugging

#### React Native
```bash
# Ouvrir les dev tools
# Secouer l'appareil ou Cmd+D (iOS) / Cmd+M (Android)

# Logs
npx react-native log-ios
npx react-native log-android

# Flipper (optionnel)
# Télécharger depuis https://fbflipper.com
```

#### API
```bash
# Logs serveur
cd apps/server
bun run dev

# Monitoring
curl http://localhost:3000/metrics
```

## 🔧 Configuration avancée

### 1. Variables d'environnement personnalisées

```bash
# apps/server/.env
CUSTOM_FEATURE_FLAG=true
LOG_LEVEL=debug
CACHE_TTL=3600

# apps/native/.env.development
EXPO_PUBLIC_DEBUG_MODE=true
EXPO_PUBLIC_API_TIMEOUT=10000
```

### 2. Configuration de l'IDE

#### VS Code (Recommandé)

Extensions utiles :
```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-json",
    "expo.vscode-expo-tools"
  ]
}
```

Settings :
```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

### 3. Configuration Git

```bash
# Hooks pre-commit (optionnel)
npm install -g husky
npx husky install
npx husky add .husky/pre-commit "bun run test:ci"
```

## 🚨 Résolution de problèmes

### Problèmes courants

#### 1. Erreur de connexion à la base de données

```bash
# Vérifier la connexion
psql $DATABASE_URL

# Vérifier les permissions
GRANT ALL PRIVILEGES ON DATABASE deenquest_dev TO postgres;
```

#### 2. Port déjà utilisé

```bash
# Trouver le processus
lsof -i :3000
lsof -i :8081

# Tuer le processus
kill -9 <PID>

# Ou changer le port
PORT=3001 bun run dev
```

#### 3. Erreurs de dépendances

```bash
# Nettoyer le cache
bun install --force
rm -rf node_modules
rm bun.lockb
bun install

# Ou avec npm
npm ci
```

#### 4. Problèmes Expo

```bash
# Nettoyer le cache Expo
expo start --clear

# Reset Metro cache
npx react-native start --reset-cache

# Réinstaller Expo CLI
npm uninstall -g @expo/cli
npm install -g @expo/cli@latest
```

#### 5. Erreurs TypeScript

```bash
# Vérifier les types
bun run check-types

# Redémarrer le serveur TypeScript (VS Code)
# Cmd+Shift+P > "TypeScript: Restart TS Server"
```

### Logs de debug

#### Serveur
```bash
# Activer les logs détaillés
DEBUG=* bun run dev

# Ou spécifique
DEBUG=trpc:* bun run dev
```

#### Mobile
```bash
# React Native logs
npx react-native log-ios
npx react-native log-android

# Expo logs
expo logs
```

### Performance

#### Bundle size
```bash
# Analyser le bundle
cd apps/native
npx expo export --platform all --output-dir dist-analysis
du -sh dist-analysis
```

#### Profiling
```bash
# React DevTools Profiler
# Installer l'extension navigateur

# Flipper Performance
# Utiliser l'outil de profiling intégré
```

## 📚 Ressources utiles

### Documentation officielle
- [React Native](https://reactnative.dev/docs/getting-started)
- [Expo](https://docs.expo.dev/)
- [tRPC](https://trpc.io/docs)
- [Drizzle ORM](https://orm.drizzle.team/docs/overview)
- [Better Auth](https://www.better-auth.com/docs)

### Communauté
- [Discord Expo](https://chat.expo.dev/)
- [Reddit React Native](https://www.reddit.com/r/reactnative/)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/react-native)

### Outils
- [React Native Directory](https://reactnative.directory/)
- [Expo Snack](https://snack.expo.dev/) - Playground en ligne
- [React DevTools](https://react-devtools-experimental.vercel.app/)

## 🎯 Prochaines étapes

Une fois l'installation terminée :

1. **Explorer le code** - Familiarisez-vous avec la structure
2. **Lire la documentation** - Architecture, API, tests
3. **Faire des modifications** - Commencez par de petits changements
4. **Contribuer** - Consultez [CONTRIBUTING.md](../CONTRIBUTING.md)

## 💬 Support

Besoin d'aide ? Plusieurs options :

- 📖 **Documentation** : Consultez les autres guides
- 🐛 **Issues** : [GitHub Issues](https://github.com/username/deenquest/issues)
- 💬 **Discussions** : [GitHub Discussions](https://github.com/username/deenquest/discussions)
- 📧 **Email** : help@deenquest.app

---

Bon développement avec DeenQuest ! 🚀