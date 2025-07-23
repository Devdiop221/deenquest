# Tasks — DeenQuest

## Base technique
- [ ] Configure Supabase project and add DATABASE_URL to `.env`
- [ ] Set up Clerk authentication (Better Auth)
- [ ] Set up Prisma / Drizzle models: users, categories, quizzes, lectures, favorites, user_progress
- [ ] Create seed script with Islamic quiz and story content

## Frontend - UI
- [ ] Create Home screen with category buttons
- [ ] Build Quiz list screen with category filtering
- [ ] Implement Quiz screen with logic and explanation
- [ ] Create Lecture screen with audio + text sync
- [ ] Add Favorites screen (reading from DB by userId)
- [ ] Add Profile screen with XP, levels, progress

## Backend - API
- [ ] Create `quizRouter`: getAll, getById, getByCategory
- [ ] Create `lectureRouter`: getAll, getById, getByCategory
- [ ] Create `favoritesRouter`: getAll, add, remove
- [ ] Create `userProgressRouter`: store score, get stats

## Authentification
- [ ] I-Authetification with Better Auth
- [ ] Protect tRPC routers with `protectedProcedure`

## Gamification
- [ ] Implement XP system (based on quiz completion)
- [ ] Add badge logic (e.g., 5 quizzes in same category)
- [ ] Display XP and badges in profile

## Offline / Accessibilité
- [ ] Allow downloading audio and text content
- [ ] Add dark mode and text size controls

## Tests & QA
- [ ] Write unit tests for quiz logic
- [ ] Test all routers with tRPC calls
- [ ] Test on Android + iOS

## Déploiement
- [ ] Deploy backend to Vercel (or Bun deploy)
- [ ] Configure Supabase storage for audio files
