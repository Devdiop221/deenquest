# 🕌 DeenQuest

> **Une application éducative islamique moderne avec quiz interactifs et histoires audio**

DeenQuest est une application mobile native qui permet aux utilisateurs d'apprendre l'Islam à travers des quiz interactifs et des histoires audio captivantes. L'application couvre les Prophètes, les Compagnons, les batailles historiques, les héros islamiques et les valeurs morales.

[![CI/CD](https://github.com/username/deenquest/workflows/CI/CD%20Pipeline/badge.svg)](https://github.com/username/deenquest/actions)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-1.0.0-green.svg)](package.json)

## ✨ Fonctionnalités

### 📚 Contenu éducatif
- **5 catégories** : Prophètes, Compagnons, Batailles, Héros, Morale
- **94+ questions** de quiz avec explications détaillées
- **Histoires audio** avec texte synchronisé
- **Système de favoris** pour sauvegarder le contenu préféré

### 🎮 Gamification
- **Système XP** : Gagnez des points pour chaque bonne réponse
- **Badges** : Débloquez des récompenses pour vos accomplissements
- **Niveaux** : Progressez et montez en niveau
- **Statistiques** : Suivez vos progrès détaillés

### 🎨 Expérience utilisateur
- **Design moderne** avec palette de couleurs islamiques
- **Mode sombre/clair** adaptatif
- **Taille de police ajustable** pour l'accessibilité
- **Navigation intuitive** avec onglets
- **Fonctionnalité offline** pour apprendre partout

### 🔧 Stack technique
- **React Native** avec Expo Router
- **tRPC** pour l'API type-safe
- **Drizzle ORM** avec PostgreSQL
- **Better Auth** pour l'authentification
- **Tests complets** avec Jest

## 🚀 Démarrage rapide

### Prérequis
```bash
# Outils requis
node >= 18
bun >= 1.2.16
expo-cli
```

### Installation
```bash
# Cloner le projet
git clone https://github.com/username/deenquest.git
cd deenquest

# Installer les dépendances
bun install

# Configuration de la base de données
cp apps/server/.env.example apps/server/.env
# Éditez .env avec vos paramètres

# Lancer la base de données et seeder
cd apps/server
bun run db:push
bun run db:seed
bun run db:seed-badges

# Lancer le serveur
bun run dev
```

### Développement mobile
```bash
# Dans un nouveau terminal
cd apps/native
cp .env.example .env.development
# Éditez les variables d'environnement

# Lancer l'app mobile
bun run dev
```

## 📱 Captures d'écran

<div align="center">
  <img src="docs/screenshots/home.png" width="200" alt="Écran d'accueil" />
  <img src="docs/screenshots/quiz.png" width="200" alt="Quiz interactif" />
  <img src="docs/screenshots/profile.png" width="200" alt="Profil utilisateur" />
  <img src="docs/screenshots/dark-mode.png" width="200" alt="Mode sombre" />
</div>

## 🏗️ Architecture

```
DeenQuest/
├── apps/
│   ├── native/          # Application React Native
│   │   ├── app/         # Écrans avec Expo Router
│   │   ├── components/  # Composants réutilisables
│   │   └── lib/         # Utilitaires et hooks
│   └── server/          # API Backend avec Hono
│       ├── src/
│       │   ├── routers/ # Routers tRPC
│       │   ├── db/      # Schéma et migrations
│       │   └── lib/     # Services et utilitaires
├── scripts/             # Scripts d'automatisation
└── docs/               # Documentation
```

## 🛠️ Stack technique

### Frontend (Mobile)
- **React Native** 0.79 - Framework mobile
- **Expo** 53 - Plateforme de développement
- **Expo Router** - Navigation basée sur les fichiers
- **NativeWind** - Styling avec Tailwind CSS
- **Lucide React Native** - Icônes modernes
- **React Query** - Gestion d'état serveur

### Backend (API)
- **Hono** - Framework web rapide
- **tRPC** - API type-safe
- **Drizzle ORM** - ORM TypeScript
- **PostgreSQL** - Base de données
- **Better Auth** - Authentification moderne

### DevOps & Outils
- **Bun** - Runtime et package manager
- **TypeScript** - Typage statique
- **Jest** - Tests unitaires
- **EAS Build** - Builds natifs
- **Vercel** - Déploiement serveur

## 📖 Documentation

- [🚀 Guide de démarrage](docs/GETTING_STARTED.md)
- [🏗️ Guide d'architecture](docs/ARCHITECTURE.md)
- [🧪 Guide de test](TESTING.md)
- [🚢 Guide de déploiement](DEPLOYMENT.md)
- [🤝 Guide de contribution](CONTRIBUTING.md)
- [📚 Documentation API](docs/API.md)

## 🧪 Tests

```bash
# Tous les tests
./scripts/test-all.sh

# Tests spécifiques
cd apps/native && bun test
cd apps/server && bun test

# Couverture de code
bun run test:coverage
```

## 🚢 Déploiement

```bash
# Déploiement automatisé
./scripts/deploy.sh production

# Ou manuel
cd apps/server && vercel --prod
cd apps/native && eas build --profile production
```

## 🤝 Contribution

Nous accueillons les contributions ! Consultez [CONTRIBUTING.md](CONTRIBUTING.md) pour commencer.

### Développement local
1. Fork le projet
2. Créez une branche feature (`git checkout -b feature/amazing-feature`)
3. Committez vos changements (`git commit -m 'Add amazing feature'`)
4. Push vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir [LICENSE](LICENSE) pour plus de détails.

## 🙏 Remerciements

- **Communauté Expo** pour les outils exceptionnels
- **Équipe tRPC** pour l'API type-safe
- **Contributeurs** qui rendent ce projet possible
- **Communauté musulmane** pour l'inspiration et les retours

## 📞 Support

- 📧 Email: support@deenquest.app
- 🐛 Issues: [GitHub Issues](https://github.com/username/deenquest/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/username/deenquest/discussions)
- 📱 App Store: [Télécharger DeenQuest](https://apps.apple.com/app/deenquest)

---

<div align="center">
  <p>Fait avec ❤️ pour la communauté musulmane</p>
  <p>
    <a href="https://deenquest.app">Site Web</a> •
    <a href="https://twitter.com/deenquest">Twitter</a> •
    <a href="https://instagram.com/deenquest">Instagram</a>
  </p>
</div>
