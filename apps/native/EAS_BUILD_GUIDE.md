# DeenQuest - EAS Build Guide

Ce guide vous explique comment configurer et utiliser EAS Build pour DeenQuest.

## Prérequis

1. **Compte Expo** - Créez un compte sur [expo.dev](https://expo.dev)
2. **EAS CLI** - Installé automatiquement via le script de setup
3. **Xcode** (pour iOS) - Requis pour les builds iOS
4. **Android Studio** (pour Android) - Requis pour les builds Android

## Configuration initiale

### 1. Installation et setup

```bash
# Exécuter le script de setup automatique
./scripts/setup-eas.sh

# Ou manuellement :
npm install -g @expo/cli eas-cli
eas login
eas project:init
eas build:configure
```

### 2. Configuration du projet

Mettez à jour les valeurs suivantes dans `app.json` :

```json
{
  "expo": {
    "extra": {
      "eas": {
        "projectId": "votre-project-id-ici"
      }
    },
    "owner": "votre-username-expo"
  }
}
```

## Types de builds

### Development Build
- **Usage** : Développement et tests
- **Caractéristiques** : Inclut le client de développement Expo
- **Distribution** : Interne seulement

```bash
# Android
npm run build:dev:android

# iOS
npm run build:dev:ios

# Les deux plateformes
npm run build:dev
```

### Preview Build
- **Usage** : Tests internes et démonstrations
- **Caractéristiques** : Build optimisé mais pas pour production
- **Distribution** : Interne (TestFlight, Google Play Internal Testing)

```bash
# Android
npm run build:preview:android

# iOS
npm run build:preview:ios

# Les deux plateformes
npm run build:preview
```

### Production Build
- **Usage** : Publication sur les stores
- **Caractéristiques** : Build complètement optimisé
- **Distribution** : App Store et Google Play Store

```bash
# Android (AAB pour Play Store)
npm run build:production:android

# iOS
npm run build:production:ios

# Les deux plateformes
npm run build:production
```

## Variables d'environnement

### Development
- Serveur local : `http://localhost:3000`
- Mode debug activé
- Logs détaillés

### Preview/Production
- Serveur de production : `https://your-production-server.com`
- Mode optimisé
- Logs minimaux

## Workflow de développement

### 1. Développement local
```bash
# Démarrer le serveur de développement
npm run dev

# Dans un autre terminal, démarrer le serveur backend
cd ../server && npm run dev
```

### 2. Test sur device
```bash
# Créer un development build
npm run build:dev:android  # ou :ios

# Installer le build sur votre appareil
# Scanner le QR code avec l'app installée
```

### 3. Preview pour tests
```bash
# Créer un preview build
npm run build:preview

# Distribuer via TestFlight (iOS) ou Internal Testing (Android)
```

### 4. Production
```bash
# Créer le build de production
npm run build:production

# Soumettre aux stores
npm run submit:production
```

## Over-the-Air Updates (OTA)

EAS Update permet de pousser des mises à jour sans passer par les stores :

```bash
# Update pour development
npm run update:dev

# Update pour preview
npm run update:preview

# Update pour production
npm run update:production
```

## Troubleshooting

### Avertissements courants (peuvent être ignorés)

1. **"Found eas-cli in your project dependencies"**
   - ✅ Résolu avec `cli.version` dans `eas.json`
   - Peut être ignoré en toute sécurité

2. **"Custom metro.config.js warning"**
   - ✅ Notre config utilise bien `getDefaultConfig`
   - Peut être ignoré en toute sécurité

3. **"cli.appVersionSource not set"**
   - ✅ Résolu avec `appVersionSource: "remote"`
   - EAS gère automatiquement les versions

### Erreurs critiques

1. **"Project not found"**
   - Vérifiez que `projectId` est correct dans `app.config.js`
   - Assurez-vous d'être connecté au bon compte Expo

2. **"Build failed"**
   - Vérifiez les logs de build sur expo.dev
   - Assurez-vous que toutes les dépendances sont compatibles

3. **"Certificate issues" (iOS)**
   - EAS gère automatiquement les certificats
   - Vérifiez vos permissions sur Apple Developer

### Commandes utiles

```bash
# Voir le statut des builds
eas build:list

# Voir les détails d'un build
eas build:view [BUILD_ID]

# Annuler un build en cours
eas build:cancel [BUILD_ID]

# Voir les updates
eas update:list

# Configurer les credentials
eas credentials
```

## Configuration avancée

### Custom native code
Si vous ajoutez du code natif, utilisez :

```bash
# Générer les dossiers natifs
expo prebuild

# Build avec code natif custom
eas build --clear-cache
```

### Optimisations

1. **Bundle size** : Utilisez `expo-doctor` pour analyser
2. **Performance** : Activez Hermes pour Android
3. **Caching** : EAS cache automatiquement les dépendances

## Support

- **Documentation EAS** : [docs.expo.dev/build/introduction](https://docs.expo.dev/build/introduction/)
- **Discord Expo** : [chat.expo.dev](https://chat.expo.dev)
- **GitHub Issues** : Pour les bugs spécifiques au projet