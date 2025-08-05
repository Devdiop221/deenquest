# 🤝 Guide de Contribution - DeenQuest

Merci de votre intérêt pour contribuer à DeenQuest ! Ce guide vous aidera à commencer.

## 🌟 Comment contribuer

### Types de contributions recherchées

- 🐛 **Corrections de bugs**
- ✨ **Nouvelles fonctionnalités**
- 📚 **Contenu éducatif** (questions, histoires)
- 🌍 **Traductions**
- 📖 **Documentation**
- 🎨 **Améliorations UI/UX**
- 🧪 **Tests**

## 🚀 Démarrage rapide

### 1. Fork et clone

```bash
# Fork le projet sur GitHub, puis :
git clone https://github.com/votre-username/deenquest.git
cd deenquest
```

### 2. Configuration de l'environnement

```bash
# Installer les dépendances
bun install

# Configurer la base de données
cp apps/server/.env.example apps/server/.env
# Éditez .env avec vos paramètres

# Configurer l'app mobile
cp apps/native/.env.example apps/native/.env.development
# Éditez les variables d'environnement

# Initialiser la base de données
cd apps/server
bun run db:push
bun run db:seed
bun run db:seed-badges
```

### 3. Lancer en développement

```bash
# Terminal 1 - Serveur
cd apps/server
bun run dev

# Terminal 2 - App mobile
cd apps/native
bun run dev
```

## 📋 Processus de contribution

### 1. Créer une issue

Avant de commencer, créez une issue pour :
- Décrire le bug ou la fonctionnalité
- Discuter de l'approche
- Éviter les doublons

### 2. Créer une branche

```bash
# Créer une branche depuis main
git checkout main
git pull origin main
git checkout -b feature/nom-de-la-fonctionnalite

# Ou pour un bug
git checkout -b fix/description-du-bug
```

### 3. Développer

#### Standards de code

- **TypeScript** : Utilisez des types stricts
- **ESLint** : Respectez les règles configurées
- **Prettier** : Code formaté automatiquement
- **Commits** : Messages clairs et descriptifs

#### Structure des commits

```bash
# Format : type(scope): description

# Exemples :
git commit -m "feat(quiz): add random quiz functionality"
git commit -m "fix(auth): resolve login redirect issue"
git commit -m "docs(readme): update installation guide"
git commit -m "test(quiz): add unit tests for quiz logic"
```

Types de commits :
- `feat`: Nouvelle fonctionnalité
- `fix`: Correction de bug
- `docs`: Documentation
- `style`: Formatage, pas de changement de code
- `refactor`: Refactoring de code
- `test`: Ajout ou modification de tests
- `chore`: Maintenance, dépendances

### 4. Tests

```bash
# Lancer tous les tests
./scripts/test-all.sh

# Tests spécifiques
cd apps/native && bun test
cd apps/server && bun test

# Vérifier la couverture
bun run test:coverage
```

### 5. Pull Request

1. **Push votre branche**
   ```bash
   git push origin feature/nom-de-la-fonctionnalite
   ```

2. **Créer la PR** sur GitHub avec :
   - Titre descriptif
   - Description détaillée
   - Screenshots si UI
   - Référence à l'issue

3. **Template de PR** :
   ```markdown
   ## Description
   Brève description des changements

   ## Type de changement
   - [ ] Bug fix
   - [ ] Nouvelle fonctionnalité
   - [ ] Breaking change
   - [ ] Documentation

   ## Tests
   - [ ] Tests unitaires ajoutés/mis à jour
   - [ ] Tests manuels effectués
   - [ ] Tous les tests passent

   ## Screenshots (si applicable)
   [Ajoutez des captures d'écran]

   ## Checklist
   - [ ] Code respecte les standards
   - [ ] Documentation mise à jour
   - [ ] Pas de console.log oubliés
   - [ ] Variables d'environnement documentées
   ```

## 📚 Contribuer au contenu

### Ajouter des questions de quiz

1. **Fichier** : `apps/server/src/db/seed.ts`
2. **Format** :
   ```typescript
   {
     title: "Titre du quiz",
     question: "Votre question ?",
     options: ["Option A", "Option B", "Option C", "Option D"],
     correctAnswerIndex: 0, // Index de la bonne réponse
     explanation: "Explication détaillée de la réponse",
     categoryId: "prophets", // ID de la catégorie
     xpReward: 10,
   }
   ```

### Ajouter des histoires

1. **Fichier** : `apps/server/src/db/seed.ts`
2. **Format** :
   ```typescript
   {
     title: "Titre de l'histoire",
     content: "Contenu de l'histoire...",
     audioUrl: "https://example.com/audio.mp3", // Optionnel
     categoryId: "prophets",
     duration: 300, // En secondes
   }
   ```

### Guidelines de contenu

- **Authenticité** : Sources islamiques fiables
- **Respect** : Ton respectueux et approprié
- **Clarté** : Langage simple et accessible
- **Longueur** : Questions concises, explications détaillées
- **Diversité** : Couvrir différents aspects de l'Islam

## 🌍 Traductions

### Langues supportées

- Français (principal)
- Arabe (en cours)
- Anglais (planifié)

### Ajouter une traduction

1. **Créer** : `apps/native/locales/[langue].json`
2. **Format** :
   ```json
   {
     "common": {
       "loading": "Chargement...",
       "error": "Erreur"
     },
     "quiz": {
       "title": "Quiz",
       "score": "Score"
     }
   }
   ```

## 🎨 Guidelines UI/UX

### Design System

- **Couleurs** : Palette DeenQuest (voir `constants.ts`)
- **Typographie** : Space Grotesk (titres), Urbanist (texte)
- **Espacement** : Multiples de 4px
- **Bordures** : Arrondies (8px, 12px, 16px)

### Accessibilité

- **Contraste** : Minimum 4.5:1
- **Taille de police** : Minimum 16px
- **Touch targets** : Minimum 44px
- **Screen readers** : Labels appropriés

### Responsive

- **Mobile first** : Design pour mobile d'abord
- **Tablettes** : Adaptation pour écrans plus grands
- **Orientations** : Portrait et paysage

## 🧪 Guidelines de test

### Tests requis

- **Unitaires** : Fonctions et composants
- **Intégration** : Interactions entre composants
- **E2E** : Parcours utilisateur critiques

### Couverture minimale

- **Statements** : 80%
- **Branches** : 75%
- **Functions** : 80%
- **Lines** : 80%

### Exemples de tests

```typescript
// Test de composant
describe('QuizCard', () => {
  it('should display quiz title', () => {
    const { getByText } = render(
      <QuizCard title="Test Quiz" />
    );
    expect(getByText('Test Quiz')).toBeTruthy();
  });
});

// Test d'API
describe('Quiz Router', () => {
  it('should return quiz by id', async () => {
    const caller = quizRouter.createCaller({});
    const result = await caller.getById({ id: '1' });
    expect(result).toBeDefined();
  });
});
```

## 🔍 Code Review

### Critères de review

- **Fonctionnalité** : Code fonctionne comme attendu
- **Performance** : Pas de régressions
- **Sécurité** : Pas de vulnérabilités
- **Maintenabilité** : Code lisible et documenté
- **Tests** : Couverture appropriée

### Processus

1. **Auto-review** : Relisez votre code
2. **CI/CD** : Tous les checks passent
3. **Review** : Au moins 1 approbation
4. **Merge** : Squash and merge

## 🚨 Signaler des bugs

### Template d'issue

```markdown
**Description du bug**
Description claire et concise du bug.

**Étapes pour reproduire**
1. Aller à '...'
2. Cliquer sur '...'
3. Voir l'erreur

**Comportement attendu**
Ce qui devrait se passer.

**Screenshots**
Si applicable, ajoutez des captures d'écran.

**Environnement**
- OS: [iOS/Android]
- Version de l'app: [1.0.0]
- Appareil: [iPhone 12, Samsung Galaxy S21]

**Informations supplémentaires**
Tout autre contexte utile.
```

## 📞 Support

### Canaux de communication

- **Issues GitHub** : Bugs et fonctionnalités
- **Discussions GitHub** : Questions générales
- **Discord** : Chat en temps réel (lien à venir)
- **Email** : contribute@deenquest.app

### Temps de réponse

- **Issues** : 2-3 jours ouvrés
- **PR Reviews** : 3-5 jours ouvrés
- **Questions** : 1-2 jours ouvrés

## 🏆 Reconnaissance

### Contributeurs

Tous les contributeurs sont reconnus dans :
- README principal
- Page "À propos" de l'app
- Releases notes

### Types de reconnaissance

- **Code** : Commits et PR
- **Contenu** : Questions et histoires
- **Documentation** : Guides et tutoriels
- **Traductions** : Localisation
- **Tests** : QA et feedback

## 📜 Code de conduite

### Notre engagement

Nous nous engageons à faire de la participation à notre projet une expérience sans harcèlement pour tous, indépendamment de l'âge, de la taille corporelle, du handicap visible ou invisible, de l'origine ethnique, des caractéristiques sexuelles, de l'identité et de l'expression de genre, du niveau d'expérience, de l'éducation, du statut socio-économique, de la nationalité, de l'apparence personnelle, de la race, de la religion ou de l'identité et de l'orientation sexuelles.

### Standards

Exemples de comportements qui contribuent à créer un environnement positif :

- Utiliser un langage accueillant et inclusif
- Respecter les différents points de vue et expériences
- Accepter gracieusement les critiques constructives
- Se concentrer sur ce qui est le mieux pour la communauté
- Faire preuve d'empathie envers les autres membres de la communauté

### Application

Les cas de comportement abusif, harcelant ou autrement inacceptable peuvent être signalés en contactant l'équipe du projet à conduct@deenquest.app.

## 🙏 Merci

Merci de contribuer à DeenQuest ! Votre aide rend cette application meilleure pour toute la communauté musulmane.

---

*Ce guide est vivant et évolue avec le projet. N'hésitez pas à suggérer des améliorations !*