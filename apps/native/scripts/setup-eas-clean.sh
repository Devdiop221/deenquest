#!/bin/bash

# Script de configuration EAS propre pour DeenQuest
echo "🧹 Configuration EAS propre pour DeenQuest..."

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

print_step() {
    echo -e "${BLUE}📋 $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Vérifier si on est dans le bon dossier
if [ ! -f "app.config.js" ]; then
    print_error "Ce script doit être exécuté depuis apps/native/"
    exit 1
fi

# Vérifier si EAS CLI est installé
if ! command -v eas &> /dev/null; then
    print_step "Installation d'EAS CLI..."
    bun add -g @expo/cli eas-cli
fi

print_step "Nettoyage de la configuration existante..."

# Supprimer les fichiers de configuration EAS existants
rm -f .expo/settings.json 2>/dev/null || true

print_step "Connexion à Expo..."

# Vérifier si l'utilisateur est connecté
if ! eas whoami &> /dev/null; then
    echo "Veuillez vous connecter à votre compte Expo:"
    eas login
fi

EXPO_USERNAME=$(eas whoami)
print_success "Connecté en tant que: $EXPO_USERNAME"

print_step "Initialisation du nouveau projet EAS..."

# Initialiser le projet EAS (cela créera un nouveau projet)
eas project:init

# Récupérer le nouvel ID de projet
PROJECT_ID=$(eas project:info --json | jq -r '.id' 2>/dev/null || echo "")

if [ -n "$PROJECT_ID" ] && [ "$PROJECT_ID" != "null" ]; then
    print_success "Nouveau projet créé avec l'ID: $PROJECT_ID"

    # Mettre à jour les variables d'environnement
    print_step "Mise à jour des variables d'environnement..."

    # Créer/mettre à jour le fichier .env.local
    cat > .env.local << EOF
# Configuration EAS générée automatiquement
EXPO_PROJECT_ID=$PROJECT_ID
EXPO_OWNER=$EXPO_USERNAME
EOF

    print_success "Variables d'environnement mises à jour dans .env.local"

    # Afficher les informations du projet
    echo ""
    echo "📋 Informations du projet:"
    echo "- ID: $PROJECT_ID"
    echo "- Owner: $EXPO_USERNAME"
    echo "- Slug: deenquest"

else
    print_error "Impossible de récupérer l'ID du projet"
    exit 1
fi

print_step "Configuration des builds..."

# Configurer les builds EAS
eas build:configure

print_success "Configuration EAS terminée!"

echo ""
echo "🎉 Votre projet EAS est maintenant configuré!"
echo ""
echo "📱 Prochaines étapes:"
echo "1. Vérifiez la configuration dans eas.json"
echo "2. Testez avec: eas build --profile development --platform android"
echo "3. Ou lancez: bun run build:dev"
echo ""
echo "🔗 Liens utiles:"
echo "- Dashboard EAS: https://expo.dev/accounts/$EXPO_USERNAME/projects/deenquest"
echo "- Documentation: https://docs.expo.dev/build/introduction/"