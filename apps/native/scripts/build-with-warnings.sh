#!/bin/bash

# Script pour build EAS en ignorant les avertissements Metro
echo "🚀 Building with EAS (ignoring Metro warnings)..."

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# Vérifier les arguments
if [ $# -eq 0 ]; then
    echo "Usage: $0 [development|preview|production] [ios|android|all]"
    echo "Example: $0 preview ios"
    exit 1
fi

PROFILE=$1
PLATFORM=${2:-all}

print_warning "Les avertissements Metro peuvent être ignorés en toute sécurité"
print_warning "Notre metro.config.js utilise bien getDefaultConfig d'Expo"

echo ""
echo "Building with profile: $PROFILE"
echo "Platform: $PLATFORM"
echo ""

# Construire avec EAS
if [ "$PLATFORM" = "all" ]; then
    eas build --profile $PROFILE --platform all --non-interactive
else
    eas build --profile $PROFILE --platform $PLATFORM --non-interactive
fi

if [ $? -eq 0 ]; then
    print_success "Build completed successfully!"
    echo ""
    echo "📱 Next steps:"
    echo "1. Download the build from EAS dashboard"
    echo "2. Install on your device"
    echo "3. Test the application"
else
    echo "❌ Build failed. Check the logs above."
    exit 1
fi