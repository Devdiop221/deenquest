# 🚨 Guide des Avertissements EAS - DeenQuest

Ce guide explique les avertissements EAS courants et comment les gérer.

## ⚠️ Avertissements Courants

### 1. "Found eas-cli in your project dependencies"

**Message** :
```
Found eas-cli in your project dependencies.
It's recommended to use the "cli.version" field in eas.json
```

**Solution** : ✅ **Résolu**
- Ajouté `"cli.version": ">= 12.0.0"` dans `eas.json`
- Cet avertissement peut être ignoré en toute sécurité

### 2. "The field cli.appVersionSource is not set"

**Message** :
```
The field "cli.appVersionSource" is not set, but it will be required in the future.
```

**Solution** : ✅ **Résolu**
- Ajouté `"appVersionSource": "remote"` dans `eas.json`
- EAS gérera automatiquement les versions

### 3. "Custom metro.config.js warning"

**Message** :
```
It looks like that you are using a custom metro.config.js that does not extend @expo/metro-config.
This can result in unexpected and hard to debug issues.
```

**Solution** : ✅ **Sécurisé**
- Notre `metro.config.js` utilise bien `getDefaultConfig` d'Expo
- La configuration est correcte pour un monorepo
- Cet avertissement peut être ignoré

### 4. "NODE_ENV=production warning"

**Message** :
```
You set NODE_ENV=production in the build profile.
Remember that it will be available during the entire build process.
```

**Solution** : ✅ **Résolu**
- Changé `NODE_ENV=production` en `NODE_ENV=preview` pour le profil preview
- Garde `NODE_ENV=production` seulement pour le profil production

## 🛠️ Scripts de Build Améliorés

### Utilisation des nouveaux scripts

```bash
# Build de développement
npm run build:dev:ios

# Build de preview
npm run build:preview:android

# Build de production
npm run build:production
```

### Script personnalisé

Le script `scripts/build-with-warnings.sh` :
- Affiche des messages informatifs sur les avertissements
- Continue le build malgré les avertissements Metro
- Fournit des instructions post-build

## 📋 Checklist Pre-Build

Avant de lancer un build, vérifiez :

- [ ] Variables d'environnement configurées
- [ ] Certificats iOS valides (si applicable)
- [ ] Keystore Android configuré (si applicable)
- [ ] Version de l'app incrémentée
- [ ] Tests passent

## 🔧 Configuration Recommandée

### eas.json optimisé

```json
{
  "cli": {
    "version": ">= 12.0.0",
    "appVersionSource": "remote"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "env": {
        "NODE_ENV": "preview"
      }
    },
    "production": {
      "env": {
        "NODE_ENV": "production"
      }
    }
  }
}
```

### Variables d'environnement

```bash
# .env.development
EXPO_PUBLIC_SERVER_URL=http://localhost:3000
NODE_ENV=development

# .env.production
EXPO_PUBLIC_SERVER_URL=https://your-domain.com
NODE_ENV=production
```

## 🚨 Avertissements à NE PAS Ignorer

### Erreurs critiques

- **Certificate errors** : Certificats iOS expirés
- **Keystore errors** : Problèmes de signature Android
- **Dependency conflicts** : Conflits de versions
- **Build failures** : Erreurs de compilation

### Actions recommandées

1. **Lisez toujours les logs complets**
2. **Vérifiez les certificats avant le build**
3. **Testez localement avant le build EAS**
4. **Gardez les dépendances à jour**

## 📊 Monitoring des Builds

### Dashboard EAS

- Consultez https://expo.dev/accounts/[username]/projects/deenquest
- Vérifiez les logs de build détaillés
- Surveillez les temps de build

### Métriques importantes

- **Temps de build** : < 15 minutes idéalement
- **Taille de l'APK/IPA** : < 50MB recommandé
- **Taux de succès** : > 95%

## 🔄 Workflow Recommandé

### 1. Développement
```bash
# Test local
npm run dev

# Build de développement
npm run build:dev:android
```

### 2. Preview/Staging
```bash
# Build preview
npm run build:preview

# Test sur appareils réels
# Collecte de feedback
```

### 3. Production
```bash
# Build final
npm run build:production

# Soumission aux stores
npm run submit:production
```

## 🆘 Troubleshooting

### Build qui échoue

1. **Vérifiez les logs EAS**
2. **Testez localement avec `expo prebuild`**
3. **Vérifiez les dépendances**
4. **Nettoyez le cache avec `--clear-cache`**

### Avertissements persistants

1. **Mettez à jour EAS CLI** : `npm i -g @expo/cli@latest`
2. **Vérifiez la configuration** : `eas config`
3. **Consultez la documentation** : https://docs.expo.dev/build/

### Performance lente

1. **Utilisez des ressources plus importantes** dans `eas.json`
2. **Optimisez les dépendances**
3. **Réduisez la taille des assets**

## 📚 Ressources

- [Documentation EAS Build](https://docs.expo.dev/build/introduction/)
- [Troubleshooting EAS](https://docs.expo.dev/build-reference/troubleshooting/)
- [Metro Configuration](https://docs.expo.dev/guides/customizing-metro/)
- [App Versioning](https://docs.expo.dev/build-reference/app-versions/)

---

**Note** : La plupart des avertissements EAS sont informatifs et n'empêchent pas le build de réussir. Concentrez-vous sur les erreurs critiques qui bloquent réellement le processus.