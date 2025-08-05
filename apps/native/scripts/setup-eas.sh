#!/bin/bash

# DeenQuest EAS Setup Script
echo "🚀 Setting up EAS for DeenQuest..."

# Check if EAS CLI is installed
if ! command -v eas &> /dev/null; then
    echo "📦 Installing EAS CLI..."
    npm install -g @expo/cli eas-cli
fi

# Login to Expo (if not already logged in)
echo "🔐 Checking Expo authentication..."
if ! eas whoami &> /dev/null; then
    echo "Please login to your Expo account:"
    eas login
fi

# Initialize EAS project
echo "🏗️ Initializing EAS project..."
eas project:init

# Configure project
echo "⚙️ Configuring project..."
eas build:configure

# Create development build
echo "🔨 Creating development build..."
echo "Choose your platform:"
echo "1) Android only"
echo "2) iOS only"
echo "3) Both platforms"
read -p "Enter your choice (1-3): " choice

case $choice in
    1)
        echo "Building for Android..."
        eas build --profile development --platform android
        ;;
    2)
        echo "Building for iOS..."
        eas build --profile development --platform ios
        ;;
    3)
        echo "Building for both platforms..."
        eas build --profile development --platform all
        ;;
    *)
        echo "Invalid choice. Building for Android by default..."
        eas build --profile development --platform android
        ;;
esac

echo "✅ EAS setup complete!"
echo ""
echo "📱 Next steps:"
echo "1. Install the development build on your device"
echo "2. Run 'npm run dev' to start the development server"
echo "3. Scan the QR code with your development build"
echo ""
echo "🔧 Useful commands:"
echo "- npm run build:dev - Build development version"
echo "- npm run build:preview - Build preview version"
echo "- npm run build:production - Build production version"