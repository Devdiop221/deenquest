# Design — DeenQuest

## Architecture
- Frontend: Expo + React Native with NativeWind
- Backend: tRPC API (Better T Stack)
- Database: PostgreSQL via Supabase
- ORM: Drizzle (or Prisma)
- Auth: Clerk (via Better Auth)
- Audio: Expo AV

## Base de données
### Tables
- `users`: id, email, name
- `categories`: id, name, icon
- `quizzes`: id, question, options[], answerIndex, explanation, categoryId
- `lectures`: id, title, audioUrl, text, categoryId
- `user_progress`: id, userId, quizId, score, completedAt
- `favorites`: id, userId, contentId, type ("quiz" | "lecture")

## Pages principales
- `/` Home: shows categories
- `/quiz`: lists all quizzes
- `/quiz/[id]`: shows one quiz
- `/lecture/[id]`: displays audio + text
- `/favorites`: shows user favorites
- `/profile`: shows profile and XP

## Composants
- `<QuizCard />`: for quiz preview
- `<AudioPlayer />`: for story playback
- `<CategoryButton />`: for navigation
- `<UserBadge />`: shows user level

## Séquences
### Prendre un quiz
1. L'utilisateur clique sur un quiz dans une catégorie.
2. Chaque question est affichée avec 4 options.
3. Une fois répondu, l'explication est affichée.
4. À la fin, le score est stocké dans `user_progress`.

### Lecture audio
1. L'utilisateur accède à un récit (via catégorie ou favoris).
2. L’audio est lancé via `<AudioPlayer />`.
3. Le texte est affiché en bas de l’écran.
4. Le temps de lecture est enregistré.

### Favoris
1. L'utilisateur appuie sur une icône "coeur".
2. Le contenu est ajouté à la table `favorites` avec `userId`.
3. L’utilisateur peut voir ses favoris depuis `/favorites`.

### Authentification
1. L’utilisateur est fait par Better Auth.
2. Après connexion, son `userId` est utilisé dans toutes les requêtes tRPC.
