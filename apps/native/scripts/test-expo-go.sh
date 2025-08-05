#!/bin/bash

# Script de test rapide avec Expo Go
echo "📱 Test rapide DeenQuest avec Expo Go..."

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
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

print_step "Préparation du test avec Expo Go"

# Vérifier si le serveur backend tourne
if ! curl -s http://localhost:3000 > /dev/null; then
    print_warning "Le serveur backend ne semble pas tourner"
    echo ""
    echo "Lancez le serveur dans un autre terminal :"
    echo "  cd apps/server"
    echo "  bun run dev"
    echo ""
    read -p "Appuyez sur Entrée quand le serveur est lancé..."
fi

print_step "Vérification de la configuration"

# Vérifier les variables d'environnement
if [ ! -f ".env.development" ]; then
    print_warning "Fichier .env.development manquant"
    echo "Création du fichier avec les valeurs par défaut..."

    cat > .env.development << 'EOF'
EXPO_PUBLIC_SERVER_URL=http://localhost:3000
EXPO_PUBLIC_API_URL=http://localhost:3000/trpc
EXPO_PUBLIC_AUTH_URL=http://localhost:3000/api/auth
EXPO_PUBLIC_APP_NAME=DeenQuest Dev
EXPO_PUBLIC_APP_VERSION=1.0.0-dev
EOF

    print_success "Fichier .env.development créé"
fi

print_step "Lancement d'Expo Go"

echo ""
echo "🎯 Instructions pour tester avec Expo Go :"
echo ""
echo "1. 📱 Installez Expo Go sur votre téléphone :"
echo "   - iOS: https://apps.apple.com/app/expo-go/id982107779"
echo "   - Android: https://play.google.com/store/apps/details?id=host.exp.exponent"
echo ""
echo "2. 📶 Assurez-vous que votre téléphone et ordinateur sont sur le même réseau WiFi"
echo ""
echo "3. 📷 Scannez le QR code qui va apparaître avec :"
echo "   - iOS: App Appareil photo native"
echo "   - Android: App Expo Go"
echo ""
echo "4. 🚀 L'app DeenQuest va se lancer automatiquement"
echo ""

print_warning "Note: Certaines fonctionnalités natives peuvent ne pas fonctionner parfaitement dans Expo Go"

echo ""
read -p "Appuyez sur Entrée pour lancer Expo Go..."

# Lancer Expo
print_step "Démarrage d'Expo..."
bun run dev

print_success "Test terminé !"
echo ""
echo "💡 Pour un test complet sur appareil réel :"
echo "   ./scripts/build-alternative.sh"
echo "   (Choisir option 1 pour Android ou 2 pour iOS cloud)"