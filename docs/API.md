# 📚 Documentation API - DeenQuest

Cette documentation décrit l'API tRPC de DeenQuest.

## 🔗 Base URL

- **Développement** : `http://localhost:3000/trpc`
- **Production** : `https://your-domain.vercel.app/trpc`

## 🔐 Authentification

DeenQuest utilise Better Auth pour l'authentification. Les endpoints protégés nécessitent un token valide.

### Headers requis
```http
Authorization: Bearer <token>
Content-Type: application/json
```

## 📋 Endpoints

### Categories

#### `categories.getAll`
Récupère toutes les catégories disponibles.

**Méthode** : `GET`
**Authentification** : Non requise

**Réponse** :
```typescript
{
  id: string;
  name: string;
  description: string;
  icon: string;
  createdAt: Date;
}[]
```

**Exemple** :
```typescript
const categories = await trpc.categories.getAll.query();
```

#### `categories.getById`
Récupère une catégorie par son ID.

**Méthode** : `GET`
**Authentification** : Non requise

**Paramètres** :
```typescript
{
  id: string;
}
```

**Réponse** :
```typescript
{
  id: string;
  name: string;
  description: string;
  icon: string;
  createdAt: Date;
} | null
```

**Exemple** :
```typescript
const category = await trpc.categories.getById.query({ id: "prophets" });
```

### Quizzes

#### `quizzes.getAll`
Récupère tous les quiz disponibles.

**Méthode** : `GET`
**Authentification** : Non requise

**Réponse** :
```typescript
{
  id: string;
  title: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  categoryId: string;
  xpReward: number;
  createdAt: Date;
  category?: {
    id: string;
    name: string;
  };
}[]
```

**Exemple** :
```typescript
const quizzes = await trpc.quizzes.getAll.query();
```

#### `quizzes.getById`
Récupère un quiz par son ID.

**Méthode** : `GET`
**Authentification** : Non requise

**Paramètres** :
```typescript
{
  id: string;
}
```

**Réponse** :
```typescript
{
  id: string;
  title: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  categoryId: string;
  xpReward: number;
  createdAt: Date;
} | null
```

**Exemple** :
```typescript
const quiz = await trpc.quizzes.getById.query({ id: "quiz-1" });
```

#### `quizzes.getByCategory`
Récupère tous les quiz d'une catégorie.

**Méthode** : `GET`
**Authentification** : Non requise

**Paramètres** :
```typescript
{
  categoryId: string;
}
```

**Réponse** :
```typescript
{
  id: string;
  title: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  categoryId: string;
  xpReward: number;
  createdAt: Date;
}[]
```

**Exemple** :
```typescript
const quizzes = await trpc.quizzes.getByCategory.query({
  categoryId: "prophets"
});
```

#### `quizzes.getRandom`
Récupère des quiz aléatoires.

**Méthode** : `GET`
**Authentification** : Non requise

**Paramètres** :
```typescript
{
  limit?: number; // Par défaut : 10
}
```

**Réponse** :
```typescript
{
  id: string;
  title: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  categoryId: string;
  xpReward: number;
  createdAt: Date;
}[]
```

**Exemple** :
```typescript
const randomQuizzes = await trpc.quizzes.getRandom.query({ limit: 5 });
```

### Lectures

#### `lectures.getAll`
Récupère toutes les lectures disponibles.

**Méthode** : `GET`
**Authentification** : Non requise

**Réponse** :
```typescript
{
  id: string;
  title: string;
  content: string;
  audioUrl?: string;
  categoryId: string;
  duration: number;
  createdAt: Date;
  category?: {
    id: string;
    name: string;
  };
}[]
```

**Exemple** :
```typescript
const lectures = await trpc.lectures.getAll.query();
```

#### `lectures.getById`
Récupère une lecture par son ID.

**Méthode** : `GET`
**Authentification** : Non requise

**Paramètres** :
```typescript
{
  id: string;
}
```

**Réponse** :
```typescript
{
  id: string;
  title: string;
  content: string;
  audioUrl?: string;
  categoryId: string;
  duration: number;
  createdAt: Date;
} | null
```

**Exemple** :
```typescript
const lecture = await trpc.lectures.getById.query({ id: "lecture-1" });
```

#### `lectures.getByCategory`
Récupère toutes les lectures d'une catégorie.

**Méthode** : `GET`
**Authentification** : Non requise

**Paramètres** :
```typescript
{
  categoryId: string;
}
```

**Réponse** :
```typescript
{
  id: string;
  title: string;
  content: string;
  audioUrl?: string;
  categoryId: string;
  duration: number;
  createdAt: Date;
}[]
```

**Exemple** :
```typescript
const lectures = await trpc.lectures.getByCategory.query({
  categoryId: "companions"
});
```

### Favorites

#### `favorites.getAll`
Récupère tous les favoris de l'utilisateur.

**Méthode** : `GET`
**Authentification** : **Requise**

**Réponse** :
```typescript
{
  quizzes: {
    id: string;
    title: string;
    question: string;
    categoryId: string;
  }[];
  lectures: {
    id: string;
    title: string;
    content: string;
    categoryId: string;
  }[];
}
```

**Exemple** :
```typescript
const favorites = await trpc.favorites.getAll.query();
```

#### `favorites.add`
Ajoute un élément aux favoris.

**Méthode** : `POST`
**Authentification** : **Requise**

**Paramètres** :
```typescript
{
  type: 'quiz' | 'lecture';
  itemId: string;
}
```

**Réponse** :
```typescript
{
  id: string;
  userId: string;
  type: string;
  itemId: string;
  createdAt: Date;
}
```

**Exemple** :
```typescript
const favorite = await trpc.favorites.add.mutate({
  type: 'quiz',
  itemId: 'quiz-1'
});
```

#### `favorites.remove`
Supprime un élément des favoris.

**Méthode** : `DELETE`
**Authentification** : **Requise**

**Paramètres** :
```typescript
{
  type: 'quiz' | 'lecture';
  itemId: string;
}
```

**Réponse** :
```typescript
{
  success: boolean;
}
```

**Exemple** :
```typescript
const result = await trpc.favorites.remove.mutate({
  type: 'quiz',
  itemId: 'quiz-1'
});
```

### User

#### `user.getStats`
Récupère les statistiques de l'utilisateur.

**Méthode** : `GET`
**Authentification** : **Requise**

**Réponse** :
```typescript
{
  totalXp: number;
  level: number;
  quizzesCompleted: number;
  lecturesCompleted: number;
}
```

**Exemple** :
```typescript
const stats = await trpc.user.getStats.query();
```

#### `user.getProgress`
Récupère l'historique des progrès de l'utilisateur.

**Méthode** : `GET`
**Authentification** : **Requise**

**Réponse** :
```typescript
{
  id: string;
  quizId: string;
  score: number;
  timeSpent: number;
  completedAt: Date;
}[]
```

**Exemple** :
```typescript
const progress = await trpc.user.getProgress.query();
```

#### `user.getBadges`
Récupère les badges débloqués par l'utilisateur.

**Méthode** : `GET`
**Authentification** : **Requise**

**Réponse** :
```typescript
{
  id: string;
  unlockedAt: Date;
  badge: {
    id: string;
    name: string;
    description: string;
    icon: string;
  };
}[]
```

**Exemple** :
```typescript
const badges = await trpc.user.getBadges.query();
```

### Badges

#### `badges.getAll`
Récupère tous les badges disponibles.

**Méthode** : `GET`
**Authentification** : Non requise

**Réponse** :
```typescript
{
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: string;
  xpReward: number;
  createdAt: Date;
}[]
```

**Exemple** :
```typescript
const badges = await trpc.badges.getAll.query();
```

#### `badges.getUserBadges`
Récupère les badges d'un utilisateur.

**Méthode** : `GET`
**Authentification** : Non requise

**Paramètres** :
```typescript
{
  userId: string;
}
```

**Réponse** :
```typescript
{
  badge: {
    id: string;
    name: string;
    description: string;
    icon: string;
  };
  unlockedAt: Date;
}[]
```

**Exemple** :
```typescript
const userBadges = await trpc.badges.getUserBadges.query({
  userId: "user-1"
});
```

#### `badges.updateStats`
Met à jour les statistiques utilisateur.

**Méthode** : `POST`
**Authentification** : Non requise

**Paramètres** :
```typescript
{
  userId: string;
  xpGained?: number;
  quizCompleted?: boolean;
  lectureListened?: boolean;
}
```

**Réponse** :
```typescript
{
  id: string;
  userId: string;
  totalXp: number;
  level: number;
  quizzesCompleted: number;
  lecturesListened: number;
  updatedAt: Date;
}[]
```

**Exemple** :
```typescript
const updatedStats = await trpc.badges.updateStats.mutate({
  userId: "user-1",
  xpGained: 10,
  quizCompleted: true
});
```

#### `badges.checkBadges`
Vérifie et débloque de nouveaux badges.

**Méthode** : `POST`
**Authentification** : Non requise

**Paramètres** :
```typescript
{
  userId: string;
}
```

**Réponse** :
```typescript
{
  id: string;
  name: string;
  description: string;
  icon: string;
  xpReward: number;
}[]
```

**Exemple** :
```typescript
const newBadges = await trpc.badges.checkBadges.mutate({
  userId: "user-1"
});
```

## 🔍 Monitoring

### Health Check

#### `GET /health`
Vérifie l'état de santé de l'API.

**Réponse** :
```typescript
{
  status: 'healthy' | 'unhealthy';
  uptime: number;
  memory: {
    rss: number;
    heapTotal: number;
    heapUsed: number;
    external: number;
  };
  errors: number;
  totalApiCalls?: number;
  totalUsers?: number;
}
```

### Metrics

#### `GET /metrics`
Récupère les métriques de l'API (protégé en production).

**Headers** (production) :
```http
Authorization: Bearer <METRICS_SECRET>
```

**Réponse** :
```typescript
{
  metrics: Record<string, number>;
  errors: {
    timestamp: Date;
    error: string;
    context?: any;
  }[];
  health: HealthStatus;
}
```

## ⚠️ Codes d'erreur

### Codes HTTP

- `200` - Succès
- `400` - Requête invalide
- `401` - Non authentifié
- `403` - Non autorisé
- `404` - Ressource non trouvée
- `429` - Trop de requêtes
- `500` - Erreur serveur

### Erreurs tRPC

```typescript
{
  error: {
    code: 'BAD_REQUEST' | 'UNAUTHORIZED' | 'FORBIDDEN' | 'NOT_FOUND' | 'INTERNAL_SERVER_ERROR';
    message: string;
    data?: {
      code: string;
      httpStatus: number;
      path: string;
    };
  };
}
```

## 🔒 Rate Limiting

- **Limite** : 100 requêtes par 15 minutes par IP
- **Headers de réponse** :
  - `X-RateLimit-Limit` : Limite maximale
  - `X-RateLimit-Remaining` : Requêtes restantes
  - `X-RateLimit-Reset` : Timestamp de reset

## 📝 Exemples d'utilisation

### Client React Native

```typescript
import { trpc } from '../lib/trpc';

function QuizScreen() {
  const { data: quizzes, isLoading } = trpc.quizzes.getAll.useQuery();
  const addFavorite = trpc.favorites.add.useMutation();

  const handleAddFavorite = (quizId: string) => {
    addFavorite.mutate({
      type: 'quiz',
      itemId: quizId
    });
  };

  if (isLoading) return <Text>Loading...</Text>;

  return (
    <View>
      {quizzes?.map(quiz => (
        <QuizCard
          key={quiz.id}
          quiz={quiz}
          onAddFavorite={() => handleAddFavorite(quiz.id)}
        />
      ))}
    </View>
  );
}
```

### Client HTTP direct

```typescript
// GET request
const response = await fetch('https://api.deenquest.app/trpc/categories.getAll');
const result = await response.json();

// POST request
const response = await fetch('https://api.deenquest.app/trpc/favorites.add', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer <token>'
  },
  body: JSON.stringify({
    type: 'quiz',
    itemId: 'quiz-1'
  })
});
```

## 🔄 Versioning

L'API suit le versioning sémantique :
- **Major** : Changements breaking
- **Minor** : Nouvelles fonctionnalités
- **Patch** : Corrections de bugs

Version actuelle : `v1.0.0`

## 📞 Support

- **Documentation** : [docs.deenquest.app](https://docs.deenquest.app)
- **Issues** : [GitHub Issues](https://github.com/username/deenquest/issues)
- **Email** : api@deenquest.app