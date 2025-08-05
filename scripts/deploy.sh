#!/bin/bash

# DeenQuest Deployment Script
echo "🚀 Starting DeenQuest deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_step() {
    echo -e "${BLUE}📋 $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Check if environment is specified
if [ -z "$1" ]; then
    echo "Usage: ./scripts/deploy.sh [development|staging|production]"
    exit 1
fi

ENVIRONMENT=$1

print_step "Deploying to $ENVIRONMENT environment"

# Validate environment
if [[ "$ENVIRONMENT" != "development" && "$ENVIRONMENT" != "staging" && "$ENVIRONMENT" != "production" ]]; then
    print_error "Invalid environment. Use: development, staging, or production"
    exit 1
fi

# Check if required tools are installed
print_step "Checking required tools..."

if ! command -v bun &> /dev/null; then
    print_error "Bun is not installed. Please install it first."
    exit 1
fi

if ! command -v vercel &> /dev/null; then
    print_error "Vercel CLI is not installed. Run: npm i -g vercel"
    exit 1
fi

if ! command -v eas &> /dev/null; then
    print_error "EAS CLI is not installed. Run: npm i -g @expo/cli eas-cli"
    exit 1
fi

print_success "All required tools are installed"

# Run tests
print_step "Running tests..."
if ! ./scripts/test-all.sh; then
    print_error "Tests failed. Deployment aborted."
    exit 1
fi
print_success "All tests passed"

# Build and deploy server
print_step "Deploying server to Vercel..."
cd apps/server

if [ "$ENVIRONMENT" = "production" ]; then
    vercel --prod
elif [ "$ENVIRONMENT" = "staging" ]; then
    vercel --target preview
else
    vercel --target development
fi

if [ $? -eq 0 ]; then
    print_success "Server deployed successfully"
else
    print_error "Server deployment failed"
    exit 1
fi

cd ../..

# Build mobile app
print_step "Building mobile app..."
cd apps/native

if [ "$ENVIRONMENT" = "production" ]; then
    print_step "Building production mobile app..."
    eas build --profile production --platform all --non-interactive
elif [ "$ENVIRONMENT" = "staging" ]; then
    print_step "Building preview mobile app..."
    eas build --profile preview --platform all --non-interactive
else
    print_step "Building development mobile app..."
    eas build --profile development --platform all --non-interactive
fi

if [ $? -eq 0 ]; then
    print_success "Mobile app built successfully"
else
    print_error "Mobile app build failed"
    exit 1
fi

cd ../..

# Deploy updates (OTA)
if [ "$ENVIRONMENT" != "development" ]; then
    print_step "Deploying OTA updates..."
    cd apps/native

    if [ "$ENVIRONMENT" = "production" ]; then
        eas update --branch production --message "Production deployment $(date)"
    else
        eas update --branch preview --message "Staging deployment $(date)"
    fi

    if [ $? -eq 0 ]; then
        print_success "OTA updates deployed"
    else
        print_warning "OTA updates failed (non-critical)"
    fi

    cd ../..
fi

print_success "🎉 Deployment completed successfully!"

echo ""
echo "📱 Next steps:"
if [ "$ENVIRONMENT" = "production" ]; then
    echo "1. Test the production server"
    echo "2. Download and test the production mobile build"
    echo "3. Submit to app stores if needed"
else
    echo "1. Test the $ENVIRONMENT server"
    echo "2. Download and test the $ENVIRONMENT mobile build"
    echo "3. Share with testers"
fi

echo ""
echo "🔗 Useful links:"
echo "- Vercel Dashboard: https://vercel.com/dashboard"
echo "- EAS Dashboard: https://expo.dev/accounts/[username]/projects/deenquest"
echo "- App Store Connect: https://appstoreconnect.apple.com"
echo "- Google Play Console: https://play.google.com/console"