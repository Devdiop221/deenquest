# DeenQuest - Guide de Déploiement

Ce guide explique comment déployer DeenQuest en production.

## Architecture de déploiement

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Mobile App    │    │   Web Server    │    │   Database      │
│   (EAS Build)   │◄──►│   (Vercel)      │◄──►│   (Supabase)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Prérequis

### Comptes nécessaires
- [Expo Account](https://expo.dev) - Pour EAS Build
- [Vercel Account](https://vercel.com) - Pour le serveur
- [Supabase Account](https://supabase.com) - Pour la base de données
- [Apple Developer](https://developer.apple.com) - Pour iOS (optionnel)
- [Google Play Console](https://play.google.com/console) - Pour Android (optionnel)

### Outils requis
```bash
# Package managers
npm install -g bun
npm install -g @expo/cli eas-cli vercel

# Vérification
bun --version
eas --version
vercel --version
```

## Configuration des environnements

### 1. Variables d'environnement

#### Serveur (Vercel)
```bash
# Base de données
DATABASE_URL=postgresql://user:pass@host:port/db

# Authentification
BETTER_AUTH_SECRET=your-super-secret-key
BETTER_AUTH_URL=https://your-domain.vercel.app/api/auth

# CORS
CORS_ORIGIN=https://your-domain.vercel.app

# Monitoring
METRICS_SECRET=your-metrics-secret

# Environment
NODE_ENV=production
```

#### Mobile App (EAS)
```bash
# API
EXPO_PUBLIC_SERVER_URL=https://your-domain.vercel.app
EXPO_PUBLIC_API_URL=https://your-domain.vercel.app/trpc
EXPO_PUBLIC_AUTH_URL=https://your-domain.vercel.app/api/auth

# App
EXPO_PUBLIC_APP_NAME=DeenQuest
EXPO_PUBLIC_APP_VERSION=1.0.0
```

### 2. Configuration Expo

Mettez à jour `apps/native/app.json` :
```json
{
  "expo": {
    "extra": {
      "eas": {
        "projectId": "your-actual-project-id"
      }
    },
    "owner": "your-expo-username"
  }
}
```

## Déploiement automatisé

### Script de déploiement
```bash
# Développement
./scripts/deploy.sh development

# Staging
./scripts/deploy.sh staging

# Production
./scripts/deploy.sh production
```

## Déploiement manuel

### 1. Serveur (Vercel)

```bash
cd apps/server

# Login Vercel
vercel login

# Premier déploiement
vercel

# Déploiements suivants
vercel --prod
```

### 2. Mobile App (EAS)

```bash
cd apps/native

# Login EAS
eas login

# Configuration initiale
eas project:init
eas build:configure

# Build de développement
eas build --profile development

# Build de production
eas build --profile production

# Soumission aux stores
eas submit --profile production
```

## Base de données

### 1. Configuration Supabase

1. Créez un nouveau projet sur [Supabase](https://supabase.com)
2. Copiez l'URL de connexion PostgreSQL
3. Ajoutez-la comme `DATABASE_URL` dans Vercel

### 2. Migration et seeding

```bash
cd apps/server

# Push du schéma
bun run db:push

# Seed des données
bun run db:seed
bun run db:seed-badges
```

## Monitoring et maintenance

### 1. Health checks

- **Serveur** : `https://your-domain.vercel.app/health`
- **Métriques** : `https://your-domain.vercel.app/metrics`

### 2. Logs

```bash
# Vercel logs
vercel logs

# EAS logs
eas build:list
eas build:view [BUILD_ID]
```

### 3. Updates OTA

```bash
cd apps/native

# Update de production
eas update --branch production --message "Bug fixes"

# Update de staging
eas update --branch preview --message "New features"
```

## CI/CD avec GitHub Actions

### 1. Secrets GitHub

Ajoutez ces secrets dans GitHub :
```
EXPO_TOKEN=your-expo-token
VERCEL_TOKEN=your-vercel-token
VERCEL_ORG_ID=your-org-id
VERCEL_PROJECT_ID=your-project-id
```

### 2. Workflow

Le workflow `.github/workflows/ci.yml` gère :
- Tests automatiques
- Build du serveur
- Build mobile
- Déploiement automatique

## Sécurité

### 1. Variables sensibles

- Utilisez des secrets forts (32+ caractères)
- Rotez les clés régulièrement
- Ne commitez jamais les secrets

### 2. Rate limiting

Le serveur inclut :
- Rate limiting (100 req/15min par IP)
- Headers de sécurité
- Validation des entrées

### 3. HTTPS

- Vercel fournit HTTPS automatiquement
- Forcez HTTPS en production

## Performance

### 1. Optimisations serveur

- Compression automatique (Vercel)
- Cache des réponses statiques
- Monitoring des performances

### 2. Optimisations mobile

- Bundle splitting automatique
- Images optimisées
- Lazy loading des écrans

## Troubleshooting

### Erreurs communes

1. **Build failed**
   ```bash
   # Nettoyez le cache
   eas build --clear-cache
   ```

2. **Database connection**
   ```bash
   # Vérifiez l'URL
   echo $DATABASE_URL
   ```

3. **CORS errors**
   ```bash
   # Vérifiez CORS_ORIGIN
   curl -H "Origin: https://your-app.com" https://your-api.com
   ```

### Logs utiles

```bash
# Serveur
vercel logs --follow

# Mobile
eas build:view [BUILD_ID]

# Base de données
# Consultez Supabase Dashboard
```

## Rollback

### 1. Serveur
```bash
# Vercel rollback automatique
vercel rollback [DEPLOYMENT_URL]
```

### 2. Mobile
```bash
# Rollback OTA
eas update --branch production --message "Rollback" --republish
```

## Monitoring en production

### 1. Métriques clés

- Temps de réponse API
- Taux d'erreur
- Utilisation mémoire
- Nombre d'utilisateurs actifs

### 2. Alertes

Configurez des alertes pour :
- Erreurs > 5%
- Temps de réponse > 2s
- Utilisation mémoire > 80%

### 3. Dashboards

- Vercel Analytics
- Supabase Dashboard
- EAS Dashboard

## Support

### Ressources

- [Documentation Vercel](https://vercel.com/docs)
- [Documentation EAS](https://docs.expo.dev/build/introduction/)
- [Documentation Supabase](https://supabase.com/docs)

### Contact

Pour les problèmes de déploiement :
1. Vérifiez les logs
2. Consultez la documentation
3. Ouvrez une issue GitHub