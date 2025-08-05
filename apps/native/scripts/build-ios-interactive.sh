#!/bin/bash

# Script de build iOS interactif pour gérer les certificats
echo "📱 Build iOS interactif pour DeenQuest..."

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

# Vérifier les arguments
PROFILE=${1:-development}
echo "Building iOS with profile: $PROFILE"

print_step "Vérification des prérequis..."

# Vérifier si EAS CLI est installé
if ! command -v eas &> /dev/null; then
    print_error "EAS CLI n'est pas installé"
    echo "Installez-le avec: npm install -g @expo/cli eas-cli"
    exit 1
fi

# Vérifier si l'utilisateur est connecté
if ! eas whoami &> /dev/null; then
    print_warning "Vous n'êtes pas connecté à Expo"
    echo "Connexion..."
    eas login
fi

print_success "Connecté en tant que: $(eas whoami)"

print_step "Configuration des certificats iOS..."

print_warning "Pour iOS, vous avez plusieurs options :"
echo "1. Laisser EAS gérer automatiquement les certificats (recommandé)"
echo "2. Utiliser vos propres certificats"
echo "3. Build pour simulateur uniquement (pas de certificats requis)"
echo ""

# Demander à l'utilisateur ce qu'il préfère
echo "Que souhaitez-vous faire ?"
echo "1) Build pour simulateur (pas de certificats requis)"
echo "2) Build pour appareil (EAS gérera les certificats)"
echo "3) Annuler"
read -p "Votre choix (1-3): " choice

case $choice in
    1)
        print_step "Build pour simulateur iOS..."
        # Modifier temporairement eas.json pour le simulateur
        if [ "$PROFILE" = "development" ]; then
            eas build --profile development --platform ios --local
        else
            print_warning "Les builds simulateur ne sont disponibles qu'en mode development"
            print_step "Utilisation du profil development pour le simulateur..."
            eas build --profile development --platform ios --local
        fi
        ;;
    2)
        print_step "Build pour appareil iOS (mode interactif)..."
        print_warning "EAS va vous demander de configurer les certificats"
        print_warning "Suivez les instructions à l'écran"

        # Build interactif (sans --non-interactive)
        eas build --profile $PROFILE --platform ios
        ;;
    3)
        print_warning "Build annulé"
        exit 0
        ;;
    *)
        print_error "Choix invalide"
        exit 1
        ;;
esac

if [ $? -eq 0 ]; then
    print_success "Build iOS terminé avec succès!"
    echo ""
    echo "📱 Prochaines étapes :"
    if [ "$choice" = "1" ]; then
        echo "1. Le build est disponible localement"
        echo "2. Installez-le sur le simulateur iOS"
        echo "3. Testez l'application"
    else
        echo "1. Téléchargez le build depuis le dashboard EAS"
        echo "2. Installez-le sur votre appareil iOS"
        echo "3. Testez l'application"
    fi
    echo ""
    echo "🔗 Dashboard EAS: https://expo.dev/accounts/$(eas whoami)/projects/deenquest"
else
    print_error "Build échoué. Vérifiez les logs ci-dessus."
    exit 1
fi