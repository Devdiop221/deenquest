#!/bin/bash

# Script de build alternatif pour DeenQuest (évite les problèmes Fastlane)
echo "🚀 Build alternatif pour DeenQuest..."

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

print_step "Options de build disponibles pour DeenQuest"
echo ""
echo "Le build iOS local nécessite Fastlane qui n'est pas installé."
echo "Voici vos options :"
echo ""
echo "1) 📱 Build Android (recommandé - pas de Fastlane requis)"
echo "2) ☁️  Build iOS sur EAS Cloud (pas de Fastlane local requis)"
echo "3) 🛠️  Installer Fastlane pour builds iOS locaux"
echo "4) 📱 Build pour Expo Go (test rapide)"
echo "5) ❌ Annuler"
echo ""

read -p "Votre choix (1-5): " choice

case $choice in
    1)
        print_step "Build Android avec profil: $PROFILE"
        print_success "Android ne nécessite pas Fastlane !"

        echo "Lancement du build Android..."
        eas build --profile $PROFILE --platform android --non-interactive

        if [ $? -eq 0 ]; then
            print_success "Build Android terminé !"
            echo ""
            echo "📱 Prochaines étapes :"
            echo "1. Téléchargez l'APK depuis le dashboard EAS"
            echo "2. Installez-le sur votre appareil Android"
            echo "3. Testez l'application"
            echo ""
            echo "🔗 Dashboard: https://expo.dev/accounts/$(eas whoami)/projects/deenquest"
        else
            print_error "Build Android échoué"
        fi
        ;;

    2)
        print_step "Build iOS sur EAS Cloud avec profil: $PROFILE"
        print_warning "Ce build se fera sur les serveurs EAS (pas localement)"

        echo "Lancement du build iOS cloud..."
        eas build --profile $PROFILE --platform ios --non-interactive

        if [ $? -eq 0 ]; then
            print_success "Build iOS cloud terminé !"
            echo ""
            echo "📱 Prochaines étapes :"
            echo "1. Téléchargez l'IPA depuis le dashboard EAS"
            echo "2. Installez-le sur votre appareil iOS"
            echo "3. Testez l'application"
        else
            print_error "Build iOS cloud échoué"
        fi
        ;;

    3)
        print_step "Installation de Fastlane..."
        echo ""
        echo "Pour installer Fastlane, vous avez plusieurs options :"
        echo ""
        echo "Option 1 - Homebrew (recommandé sur macOS) :"
        echo "  brew install fastlane"
        echo ""
        echo "Option 2 - RubyGems :"
        echo "  sudo gem install fastlane"
        echo ""
        echo "Option 3 - Bundler (dans le projet) :"
        echo "  echo 'gem \"fastlane\"' >> Gemfile"
        echo "  bundle install"
        echo ""
        print_warning "Après installation, relancez ce script"
        ;;

    4)
        print_step "Test avec Expo Go"
        print_success "Pas de build nécessaire !"

        echo ""
        echo "Pour tester avec Expo Go :"
        echo "1. Installez Expo Go sur votre téléphone"
        echo "2. Lancez: bun run dev"
        echo "3. Scannez le QR code avec Expo Go"
        echo ""
        print_warning "Note: Certaines fonctionnalités natives peuvent ne pas marcher"
        ;;

    5)
        print_warning "Build annulé"
        exit 0
        ;;

    *)
        print_error "Choix invalide"
        exit 1
        ;;
esac