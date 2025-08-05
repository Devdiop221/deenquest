# 🚀 Guide d'installation Fastlane - DeenQuest

Fastlane est requis pour les builds iOS locaux avec EAS.

## 🍺 Installation avec Homebrew (Recommandé sur macOS)

```bash
# Installer Homebrew si pas déjà fait
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Installer Fastlane
brew install fastlane

# Vérifier l'installation
fastlane --version
```

## 💎 Installation avec RubyGems

```bash
# Installer Fastlane globalement
sudo gem install fastlane

# Ou sans sudo si vous utilisez rbenv/rvm
gem install fastlane

# Vérifier l'installation
fastlane --version
```

## 📦 Installation avec Bundler (Dans le projet)

```bash
# Créer un Gemfile dans apps/native/
cd apps/native
echo 'source "https://rubygems.org"' > Gemfile
echo 'gem "fastlane"' >> Gemfile

# Installer
bundle install

# Utiliser avec bundle exec
bundle exec fastlane --version
```

## 🔧 Alternatives sans Fastlane

Si vous ne voulez pas installer Fastlane :

### 1. Build Android uniquement
```bash
# Android ne nécessite pas Fastlane
./scripts/build-alternative.sh
# Choisir option 1 (Android)
```

### 2. Build iOS sur EAS Cloud
```bash
# Build sur les serveurs EAS (pas localement)
eas build --profile development --platform ios --non-interactive
```

### 3. Test avec Expo Go
```bash
# Pas de build nécessaire
bun run dev
# Scanner le QR code avec Expo Go
```

## 🚨 Résolution de problèmes

### Erreur "command not found: fastlane"

```bash
# Vérifier le PATH
echo $PATH

# Ajouter au PATH si nécessaire (dans ~/.zshrc ou ~/.bash_profile)
export PATH="$HOME/.fastlane/bin:$PATH"

# Recharger le shell
source ~/.zshrc
```

### Erreur de permissions Ruby

```bash
# Utiliser rbenv pour gérer Ruby (recommandé)
brew install rbenv
rbenv install 3.1.0
rbenv global 3.1.0

# Puis installer Fastlane
gem install fastlane
```

### Erreur Xcode Command Line Tools

```bash
# Installer les outils de développement Xcode
xcode-select --install

# Accepter la licence Xcode
sudo xcodebuild -license accept
```

## ✅ Vérification de l'installation

```bash
# Vérifier Fastlane
fastlane --version

# Vérifier les outils iOS
xcodebuild -version

# Tester un build local
cd apps/native
eas build --profile development --platform ios --local
```

## 🎯 Recommandations

### Pour le développement quotidien :
- **Expo Go** : Test rapide des changements
- **Build Android** : Test sur appareil réel
- **EAS Cloud iOS** : Build iOS sans configuration locale

### Pour la production :
- **Fastlane installé** : Builds iOS locaux rapides
- **EAS Cloud** : Builds de production fiables
- **CI/CD** : Automatisation complète

## 📚 Ressources

- [Documentation Fastlane](https://docs.fastlane.tools/)
- [EAS Build Local](https://docs.expo.dev/build-reference/local-builds/)
- [Troubleshooting iOS](https://docs.expo.dev/build-reference/troubleshooting/)

---

**Note** : Fastlane n'est requis que pour les builds iOS locaux. Vous pouvez parfaitement développer et tester DeenQuest sans l'installer !