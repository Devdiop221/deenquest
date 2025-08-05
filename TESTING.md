# DeenQuest - Testing Guide

Ce guide explique comment exécuter et écrire des tests pour DeenQuest.

## Structure des tests

```
apps/
├── native/
│   ├── components/__tests__/     # Tests des composants
│   ├── lib/__tests__/           # Tests des utilitaires
│   ├── app/(tabs)/__tests__/    # Tests des écrans
│   ├── jest.config.js           # Configuration Jest
│   └── jest.setup.js            # Setup Jest
├── server/
│   ├── src/routers/__tests__/   # Tests des routers tRPC
│   ├── jest.config.js           # Configuration Jest
│   └── jest.setup.ts            # Setup Jest
└── scripts/
    └── test-all.sh              # Script pour tous les tests
```

## Exécution des tests

### Tests de l'application native

```bash
cd apps/native

# Exécuter tous les tests
npm test

# Exécuter en mode watch
npm run test:watch

# Générer le rapport de couverture
npm run test:coverage

# Tests pour CI/CD
npm run test:ci
```

### Tests du serveur

```bash
cd apps/server

# Exécuter tous les tests
npm test

# Exécuter en mode watch
npm run test:watch

# Générer le rapport de couverture
npm run test:coverage
```

### Tous les tests

```bash
# Depuis la racine du projet
./scripts/test-all.sh
```

## Types de tests

### 1. Tests unitaires

Tests des fonctions et composants individuels.

**Exemple - Composant Badge :**
```typescript
import { render } from '@testing-library/react-native';
import Badge from '../Badge';

describe('Badge Component', () => {
  it('renders correctly with default props', () => {
    const { getByText } = render(
      <Badge name="Test Badge" description="Test" icon="Trophy" />
    );

    expect(getByText('Test Badge')).toBeTruthy();
  });
});
```

### 2. Tests d'intégration

Tests des interactions entre composants et services.

**Exemple - Écran Home :**
```typescript
import { render, waitFor } from '@testing-library/react-native';
import HomeScreen from '../index';

describe('HomeScreen', () => {
  it('displays categories when loaded', async () => {
    const { getByText } = render(<HomeScreen />);

    await waitFor(() => {
      expect(getByText('Prophets')).toBeTruthy();
    });
  });
});
```

### 3. Tests des routers tRPC

Tests des endpoints API.

**Exemple - Categories Router :**
```typescript
import { categoriesRouter } from '../categories';

describe('Categories Router', () => {
  it('should return all categories', async () => {
    const caller = categoriesRouter.createCaller({});
    const result = await caller.getAll();

    expect(result).toEqual(mockCategories);
  });
});
```

## Mocks et utilitaires

### Mocks communs

Les mocks suivants sont configurés automatiquement :

- **AsyncStorage** : Stockage local
- **Expo Router** : Navigation
- **tRPC** : Appels API
- **NetInfo** : État de la connexion
- **Expo modules** : Fonts, SecureStore, etc.

### Utilitaires de test

```typescript
// Rendu avec providers
const renderWithProviders = (component) => {
  return render(
    <ThemeProvider>
      <AuthProvider>
        {component}
      </AuthProvider>
    </ThemeProvider>
  );
};

// Mock de données
const mockQuiz = {
  id: '1',
  title: 'Test Quiz',
  question: 'Test Question?',
  options: ['A', 'B', 'C', 'D'],
  correctAnswerIndex: 0,
};
```

## Couverture de code

### Objectifs de couverture

- **Statements** : > 80%
- **Branches** : > 75%
- **Functions** : > 80%
- **Lines** : > 80%

### Rapports de couverture

Les rapports sont générés dans :
- `apps/native/coverage/`
- `apps/server/coverage/`

Ouvrez `coverage/lcov-report/index.html` pour voir le rapport détaillé.

## Bonnes pratiques

### 1. Nommage des tests

```typescript
describe('ComponentName', () => {
  describe('when condition', () => {
    it('should do something', () => {
      // Test implementation
    });
  });
});
```

### 2. Structure AAA (Arrange, Act, Assert)

```typescript
it('should calculate total correctly', () => {
  // Arrange
  const items = [{ price: 10 }, { price: 20 }];

  // Act
  const total = calculateTotal(items);

  // Assert
  expect(total).toBe(30);
});
```

### 3. Tests asynchrones

```typescript
it('should load data', async () => {
  const { getByText } = render(<Component />);

  await waitFor(() => {
    expect(getByText('Loaded')).toBeTruthy();
  });
});
```

### 4. Tests d'interaction

```typescript
it('should handle button press', () => {
  const mockFn = jest.fn();
  const { getByText } = render(<Button onPress={mockFn} />);

  fireEvent.press(getByText('Click me'));

  expect(mockFn).toHaveBeenCalled();
});
```

## Tests spécifiques à DeenQuest

### Tests de quiz

```typescript
describe('Quiz Logic', () => {
  it('should calculate score correctly', () => {
    const answers = [0, 1, 2]; // User answers
    const correct = [0, 2, 2]; // Correct answers

    const score = calculateQuizScore(answers, correct);

    expect(score).toBe(66.67); // 2/3 correct
  });
});
```

### Tests de gamification

```typescript
describe('XP System', () => {
  it('should award XP for correct answers', () => {
    const correctAnswers = 8;
    const xpPerAnswer = 10;

    const totalXp = calculateXP(correctAnswers, xpPerAnswer);

    expect(totalXp).toBe(80);
  });
});
```

### Tests offline

```typescript
describe('Offline Storage', () => {
  it('should store quizzes offline', async () => {
    const quizzes = [mockQuiz];

    await offlineStorage.storeQuizzes(quizzes);

    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      '@deenquest_offline_quizzes',
      JSON.stringify(quizzes)
    );
  });
});
```

## Débogage des tests

### Tests qui échouent

1. **Vérifiez les mocks** : Assurez-vous que tous les modules externes sont mockés
2. **Logs de débogage** : Utilisez `console.log` temporairement
3. **Tests isolés** : Exécutez un seul test avec `it.only()`

### Problèmes courants

1. **Timeouts** : Augmentez le timeout pour les tests asynchrones
2. **Mocks manquants** : Ajoutez les mocks nécessaires dans `jest.setup.js`
3. **État partagé** : Utilisez `beforeEach` pour nettoyer l'état

## CI/CD

### GitHub Actions

```yaml
- name: Run tests
  run: |
    npm ci
    ./scripts/test-all.sh
```

### Pré-commit hooks

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm run test:ci"
    }
  }
}
```

## Ressources

- [Testing Library React Native](https://callstack.github.io/react-native-testing-library/)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [tRPC Testing](https://trpc.io/docs/server/testing)
- [Expo Testing](https://docs.expo.dev/guides/testing-with-jest/)